import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Allowed models in order of preference
const MODEL_CANDIDATES = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

// POST /api/insights — Real Gemini integration for Harpia Insights
app.post('/api/insights', async (req, res) => {
  const { question, dataset, signals } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({
      error: 'Pergunta não informada ou inválida.',
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return res.status(503).json({
      error: 'Não foi possível concluir a análise neste momento. Tente novamente.',
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `Você é o Harpia Copilot, o módulo de inteligência analítica da HARPIA TECH (plataforma SaaS de inteligência B2G para prospecção de oportunidades educacionais em municípios brasileiros).

METODOLOGIA DO SCORE HARPIA (0 a 100 pontos):
- 30 pontos: Capacidade fiscal e financeira (RCL, arrecadação própria, cumprimento dos 25% constitucionais em educação, restos a pagar, liquidez).
- 25 pontos: Necessidade educacional (metas do IDEB nos anos iniciais e finais, proficiência SAEB em português e matemática, evasão e distorção idade-série).
- 25 pontos: Oportunidade de contratação (proximidade de encerramento de contratos vigentes, previsão no PCA, tramitação da LOA, ano letivo).
- 10 pontos: Acessibilidade institucional (órgãos oficiais, dirigentes e canais institucionais verificados).
- 10 pontos: Integridade, risco e governança (registros neutros perante tribunais de contas TCE/TCM e transparência fiscal).

JANELAS DE CONTRATAÇÃO:
- 0–90 dias: Imediata
- 91–180 dias: Próxima
- 181–365 dias: Estratégica
- Sem sinal: Monitorar

REGRAS ABSOLUTAS E MANDATÓRIAS:
1. Responda baseando-se ESTRITAMENTE no conjunto de dados demonstrativos fornecido no prompt.
2. NUNCA invente informações de municípios que não estejam no dataset.
3. NUNCA afirme que bases reais do governo foram consultadas em tempo real durante a sessão.
4. NUNCA afirme monitoramento ao vivo ("live"). Todas as bases são fontes de referência previstas para a metodologia da plataforma.
5. NUNCA garanta que um município irá comprar ou contratar. O Score Harpia organiza sinais para apoiar priorização comercial, e não prevê nem garante compra pública.
6. Se o usuário perguntar algo que não puder ser respondido com os dados disponíveis no dataset demonstrativo, declare explicitamente: "Os dados disponíveis neste ambiente demonstrativo não permitem concluir isso."
7. Sempre fundamente o porquê de uma recomendação apontando os sinais específicos (fiscal, educacional, contrato, acesso).
8. Mantenha linguagem estritamente neutra e corporativa a respeito de governança e órgãos de controle. NUNCA faça acusações contra pessoas ou instituições.
9. Retorne o resultado estritamente no esquema JSON solicitado.`;

    const userPrompt = `PERGUNTA DO USUÁRIO:
"${question}"

SINAIS HARPIA RECENTES IDENTIFICADOS NA PLATAFORMA (RADAR DE SINAIS):
${JSON.stringify(signals || [], null, 2)}

DATASET DEMONSTRATIVO DE MUNICÍPIOS DISPONÍVEL NA PLATAFORMA:
${JSON.stringify(dataset || [], null, 2)}

Analise a pergunta com base exclusiva nos dados acima (municípios e sinais Harpia) e na metodologia da Harpia Tech. Se a pergunta mencionar novos sinais, alertas, recálculos ou movimentações recentes, cite diretamente os Sinais Harpia correspondentes.`;

    let lastError: any = null;
    let responseText: string | undefined = undefined;

    for (const model of MODEL_CANDIDATES) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: userPrompt,
          config: {
            systemInstruction,
            temperature: 0.2,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                conclusao: {
                  type: Type.STRING,
                  description: 'Conclusão executiva direta e objetiva respondendo à pergunta.',
                },
                justificativa: {
                  type: Type.STRING,
                  description: 'Justificativa técnica detalhada baseada exclusivamente no dataset e nos indicadores.',
                },
                prioridade: {
                  type: Type.STRING,
                  description: "Classificação ou status em destaque (ex: 'Prioridade Alta', 'Janela Iminente', 'Potencial Elevado', 'Atenção Necessária').",
                },
                confianca: {
                  type: Type.STRING,
                  description: "Nível de confiança dos dados demonstrativos (ex: 'Alta', 'Média', 'Baixa').",
                },
                sinais: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Lista de 2 a 5 sinais objetivos identificados que fundamentam a conclusão.',
                },
                cautelas: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Lista de 1 a 4 cautelas, pontos de atenção ou validações necessárias.',
                },
                fontes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Chips de fontes de referência previstas associadas aos dados (ex: Siconfi, PNCP, INEP Censo, IDEB, TCE).',
                },
                municipiosRelacionados: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Nomes ou IDs dos municípios do dataset citados ou mais relevantes para esta resposta.',
                },
              },
              required: [
                'conclusao',
                'justificativa',
                'prioridade',
                'confianca',
                'sinais',
                'cautelas',
                'fontes',
                'municipiosRelacionados',
              ],
            },
          },
        });

        if (response && response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} attempt failed:`, err?.status || err?.message);
      }
    }

    if (!responseText) {
      throw lastError || new Error('Nenhum modelo respondeu com sucesso');
    }

    const parsed = JSON.parse(responseText);
    return res.json(parsed);
  } catch (error) {
    console.error('Error invoking Gemini for Harpia Insights:', error);
    return res.status(500).json({
      error: 'Não foi possível concluir a análise neste momento. Tente novamente.',
    });
  }
});

// POST /api/help — Dedicated AI Assistant for platform usage instructions & guidance
app.post('/api/help', async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({
      error: 'Pergunta de ajuda não informada ou inválida.',
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return res.status(503).json({
      error: 'Central de Ajuda temporariamente indisponível. Consulte os tópicos rápidos.',
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `Você é o Assistente da Central de Ajuda da plataforma HARPIA TECH.
Sua única função é orientar o usuário sobre como utilizar o software, navegar pelas telas, entender os filtros, o Score Harpia, a Ficha Municipal, o Monitoramento, o Pipeline e as ferramentas disponíveis na interface.

ATENÇÃO: VOCÊ NÃO É O HARPIA INSIGHTS!
- O Harpia Insights analisa dados de municípios e oportunidades B2G.
- Você (Central de Ajuda) apenas explica COMO USAR O SOFTWARE e as telas do sistema.

ESTRUTURA DA PLATAFORMA HARPIA TECH:
1. Visão Geral (/app): Dashboard executivo com cards de municípios monitorados, oportunidades imediatas, score médio, distribuição de prioridades e atalhos rápidos.
2. Radar de Municípios (/app/radar): Tabela avançada para pesquisar municípios, filtrar por UF, Região, Score Mínimo, Janela de Contratação e Nível de Confiança, ordenar colunas e exportar CSV. Clicar em qualquer linha abre a Ficha Municipal.
3. Mapa de Oportunidades (/app/mapa): Mapa vetorial interativo do Brasil para visualizar a intensidade e distribuição geográfica por estado e região. Clicar em um estado filtra os municípios.
4. Pipeline / Oportunidades (/app/oportunidades): Kanban comercial estruturado em Abordagem Imediata (0-90 dias), Relacionamento (91-180 dias) e Monitoramento (181-365 dias). Permite mover cards entre colunas.
5. Monitoramento / Watchlist (/app/monitoramento): Radar de acompanhamento comercial de municípios sob observação, com histórico de evolução e sinais detectados.
6. Harpia Insights (/app/insights): Copiloto analítico onde o usuário faz perguntas em linguagem natural para analisar as oportunidades e municípios.
7. Central de Fontes (/app/fontes): Catálogo de bases de dados de referência (Siconfi, PNCP, INEP, TCE, FNDE, etc.).
8. Configurações (/app/configuracoes): Ajustes da conta, parâmetros do Score Harpia, pesos das dimensões, reiniciar dados e reiniciar o Tutorial Guiado.
9. Ficha Municipal: Modal completo aberto ao clicar em um município, contendo abas Visão Geral, Financeiro, Educação, Compras Públicas, Acesso Institucional, Governança e Fontes. Possui botão para favoritar/adicionar ao monitoramento e exportar dossiê PDF.
10. Busca Global (⌘K): Modal para buscar rapidamente municípios e atalhos por digitação.
11. Tutorial Guiado: Tour interativo essencial de 8 etapas com destaque fluido e contextual disponível nas configurações e na Central de Ajuda.

METODOLOGIA DO SCORE HARPIA:
Total de 0 a 100 pontos dividido em 5 dimensões:
- Fiscal (até 30 pts): RCL, receita própria, cumprimento dos 25% constitucionais em educação, restos a pagar, liquidez.
- Educação (até 25 pts): Metas do IDEB, proficiência SAEB, taxas de abandono e distorção.
- Contratação (até 25 pts): Vigência de contratos vigentes, histórico de licitações, planejamento no PCA e LOA.
- Acesso Institucional (até 10 pts): Contatos institucionais verificados de secretarias e dirigentes.
- Governança (até 10 pts): Regularidade em tribunais de contas (TCE) e transparência pública.

REGRAS RÍGIDAS:
1. Responda APENAS perguntas sobre como usar o sistema Harpia Tech, telas, recursos e metodologia do produto.
2. Se o usuário fizer uma pergunta não relacionada à plataforma (ex: clima, piadas, futebol, política, programação genérica), responda estritamente: "Posso ajudar com dúvidas sobre o funcionamento da plataforma Harpia."
3. Mantenha as respostas concisas, claras, passo a passo e didáticas em português do Brasil.
4. Forneça botões de ação contextual para levar o usuário diretamente à tela adequada.`;

    const userPrompt = `DÚVIDA DO USUÁRIO SOBRE O SISTEMA:
"${question}"

Explique de forma prática e passo a passo como o usuário resolve isso dentro da plataforma Harpia Tech.`;

    let responseText: string | undefined = undefined;
    let lastError: any = null;

    for (const model of MODEL_CANDIDATES) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: userPrompt,
          config: {
            systemInstruction,
            temperature: 0.2,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                answer: {
                  type: Type.STRING,
                  description: 'Explicação direta e acolhedora respondendo à dúvida do usuário sobre a plataforma.',
                },
                steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Passos numerados e objetivos para realizar a ação.',
                },
                relatedScreen: {
                  type: Type.STRING,
                  description: "Identificador da tela relacionada (ex: 'radar', 'mapa', 'oportunidades', 'monitoramento', 'insights', 'configuracoes', 'visao-geral', 'ficha', ou null).",
                },
                actionLabel: {
                  type: Type.STRING,
                  description: "Rótulo do botão de ação em maiúsculas (ex: 'ABRIR RADAR DE MUNICÍPIOS', 'ABRIR MONITORAMENTO', 'ABRIR MAPA', 'REINICIAR TUTORIAL', ou null).",
                },
                actionTarget: {
                  type: Type.STRING,
                  description: "Ação a ser executada ao clicar no botão ('radar', 'mapa', 'oportunidades', 'monitoramento', 'insights', 'configuracoes', 'tutorial', 'busca', ou null).",
                },
              },
              required: ['answer', 'steps'],
            },
          },
        });

        if (response && response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Help model ${model} attempt failed:`, err?.status || err?.message);
      }
    }

    if (!responseText) {
      throw lastError || new Error('Nenhum modelo respondeu à consulta de ajuda');
    }

    const parsed = JSON.parse(responseText);
    return res.json(parsed);
  } catch (error) {
    console.error('Error invoking Gemini for Help Center:', error);
    return res.status(500).json({
      error: 'Não foi possível consultar o assistente de ajuda agora. Tente um dos tópicos rápidos.',
    });
  }
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Harpia Tech server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
