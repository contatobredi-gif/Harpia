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
  const { question, dataset } = req.body;

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

DATASET DEMONSTRATIVO DISPONÍVEL NA PLATAFORMA:
${JSON.stringify(dataset || [], null, 2)}

Analise a pergunta com base exclusiva nos dados acima e na metodologia da Harpia Tech.`;

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
