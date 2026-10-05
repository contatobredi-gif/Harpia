import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Database,
  ArrowRight,
  ShieldCheck,
  Building,
  RotateCcw,
} from 'lucide-react';
import { Municipality } from '../types';

interface HarpiaInsightsViewProps {
  municipalities: Municipality[];
  onSelectMunicipality: (municipality: Municipality) => void;
}

interface InsightAnswer {
  query: string;
  prioridadeBadge: string;
  prioridadeColor: string;
  conclusao: string;
  justificativa: string;
  sinais: string[];
  cautelas: string[];
  fontes: string[];
  confianca: string;
  targetMunicipalityId?: string;
}

const PRESET_QUESTIONS = [
  'Por que o Município Alfa está entre as melhores oportunidades?',
  'Quais oportunidades possuem janela nos próximos 90 dias?',
  'Quais municípios combinam boa capacidade financeira e alta necessidade educacional?',
  'Quais oportunidades possuem informações que precisam ser validadas?',
];

export const HarpiaInsightsView: React.FC<HarpiaInsightsViewProps> = ({
  municipalities,
  onSelectMunicipality,
}) => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<InsightAnswer[]>([
    {
      query: 'Por que o Município Alfa está entre as melhores oportunidades?',
      prioridadeBadge: 'PRIORIDADE ALTA',
      prioridadeColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      conclusao:
        'O Município Alfa possui uma combinação favorável entre capacidade financeira, necessidade educacional e proximidade de janela de contratação.',
      justificativa:
        'Com Score Harpia 87/100, o município mantém aplicação educacional acima dos 27% da RCL, apresenta déficit de proficiência nos anos finais e possui contrato de apoio pedagógico expirando em menos de 75 dias.',
      sinais: [
        'Capacidade fiscal acima da média com superávit e baixa dívida',
        'Alta aderência educacional e necessidade identificada pelo IDEB',
        'Contrato semelhante próximo do encerramento (65 dias)',
        'Canal institucional e equipe pedagógica mapeados e verificados',
      ],
      cautelas: [
        'Saldo orçamentário específico em tecnologia requer validação prévia de rubrica na LOA',
        'Vigência do contrato atual de gestão educacional precisa ser formalmente checada no Diário Oficial',
      ],
      fontes: ['Siconfi', 'PNCP', 'INEP Censo Escolar', 'TCE-PA', 'Diário Oficial Municipal'],
      confianca: 'Alta (87%)',
      targetMunicipalityId: 'mun-alfa',
    },
  ]);

  const handleAskQuestion = (question: string) => {
    if (!question.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      let response: InsightAnswer;

      if (question.includes('90 dias') || question.includes('janela')) {
        const matching = municipalities.filter((m) => m.janela === '0–90 dias');
        const names = matching.map((m) => `${m.nome} / ${m.uf}`).join(', ');

        response = {
          query: question,
          prioridadeBadge: 'JANELA IMINENTE',
          prioridadeColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
          conclusao: `Foram identificados ${matching.length} municípios com sinais de contratação nos próximos 90 dias: ${names}.`,
          justificativa:
            'A estimativa foi calculada a partir de contratos com término no 4º trimestre de 2026 e avisos prévios de compras publicados no PNCP para planejamento do próximo ano letivo.',
          sinais: [
            'Contratos em vigência final sem margem para novos aditivos sem licitação',
            'Previsão de crédito suplementar na LOA em tramitação',
            'Termos de referência ou audiências públicas preliminares abertas',
          ],
          cautelas: [
            'Prazos regimentais dos órgãos de controle podem deslocar publicações de editais em até 30 dias',
          ],
          fontes: ['PNCP', 'Diários Oficiais Eletrônicos', 'Siconfi RREO'],
          confianca: 'Alta (92%)',
        };
      } else if (question.includes('capacidade') && question.includes('necessidade')) {
        const matching = municipalities
          .filter((m) => m.score.fiscal >= 24 && m.score.educacao >= 20)
          .sort((a, b) => b.score.total - a.score.total);
        const names = matching.map((m) => `${m.nome} (${m.score.total} pts)`).join(', ');

        response = {
          query: question,
          prioridadeBadge: 'POTENCIAL ELEVADO',
          prioridadeColor: 'bg-[#00DDF2]/15 text-[#00DDF2] border border-[#00DDF2]/30',
          conclusao: `Os municípios que melhor combinam solvência fiscal e carência pedagógica urgente são: ${names}.`,
          justificativa:
            'Esses municípios arrecadam bem, possuem disponibilidade em caixa para investimentos e registram índices do IDEB abaixo das metas estabelecidas, tornando compras pedagógicas prioritárias para os gestores.',
          sinais: [
            'Arrecadação própria e repasses de Fundeb acima da média regional',
            'Gap relevante de proficiência no SAEB (especialmente matemática)',
            'Disponibilidade de caixa sem comprometimento excessivo por restos a pagar',
          ],
          cautelas: [
            'Exigência de demonstração robusta de ganhos de aprendizagem em comitês técnicos municipais',
          ],
          fontes: ['Siconfi', 'INEP Censo', 'IDEB/SAEB', 'Tesouro Nacional'],
          confianca: 'Alta (89%)',
        };
      } else if (question.includes('validar') || question.includes('validadas') || question.includes('risco')) {
        response = {
          query: question,
          prioridadeBadge: 'ATENÇÃO NECESSÁRIA',
          prioridadeColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
          conclusao:
            'Município Sigma / PE e Município Iota / AM possuem dados que demandam diligência adicional antes de qualquer abordagem comercial.',
          justificativa:
            'Identificou-se no Município Sigma pressão de restos a pagar e recente aditivo contratual de 12 meses. No Município Iota, desafios logísticos e convênios federais dependem de liberação de emendas no FNDE.',
          sinais: [
            'Contrato de terceiros recentemente renovado bloqueia nova licitação imediata',
            'Alerta da LRF sobre limites de despesa em monitoramento pelo TCE',
          ],
          cautelas: [
            'Validar status de aditivos e certidões negativas de débito antes de visitas presenciais',
          ],
          fontes: ['TCEs Estaduais', 'Siconfi', 'Simec/FNDE'],
          confianca: 'Média (74%)',
          targetMunicipalityId: 'mun-sigma',
        };
      } else {
        response = {
          query: question,
          prioridadeBadge: 'ANÁLISE INTELIGENTE',
          prioridadeColor: 'bg-[#00DDF2]/15 text-[#00DDF2] border border-[#00DDF2]/30',
          conclusao: `A análise para a consulta solicitada aponta alta correlação entre o ciclo orçamentário da educação e a janela de novas contratações públicas.`,
          justificativa:
            'A base consolidada da Harpia Tech monitora diariamente a execução do Fundeb e atos do PNCP para antecipar demandas antes da publicação de editais formais.',
          sinais: [
            'Cruzamento automatizado de matrizes fiscais do Siconfi',
            'Indexação semântica de termos de referência no PNCP',
            'Mapeamento de organogramas das secretarias municipais de educação',
          ],
          cautelas: [
            'Sempre confirmar dotação orçamentária nominal na LOA com o setor de finanças',
          ],
          fontes: ['Siconfi', 'PNCP', 'INEP', 'Diários Oficiais'],
          confianca: 'Alta (88%)',
        };
      }

      setHistory([response, ...history]);
      setIsAnalyzing(false);
      setInputText('');
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00DDF2]" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Harpia Insights
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Pergunte à inteligência da Harpia Tech sobre prioridades, justificativas de score, cruzamentos fiscais e sinais de contratação.
          </p>
        </div>

        <span className="text-[11px] text-slate-400 px-3 py-1.5 rounded-lg bg-[#0A1329] border border-[#16264C] self-start sm:self-center">
          Base analítica: 5.572 municípios · 8 fontes públicas
        </span>
      </div>

      {/* Chatbot-style Question Input & Suggestions */}
      <div className="p-5 rounded-2xl bg-[#0A1329] border border-[#16264C] space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-[#00DDF2]" />
          <span>Pergunte à Harpia</span>
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 bg-[#050B1E] border border-[#16264C] focus-within:border-[#00DDF2]/60 rounded-xl p-2 transition-colors">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAskQuestion(inputText);
            }}
            placeholder="Digite sua pergunta sobre municípios, scores ou contratações públicas..."
            className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={() => handleAskQuestion(inputText)}
            disabled={!inputText.trim() || isAnalyzing}
            className="px-4 py-2 rounded-lg bg-[#00DDF2] hover:bg-[#00c5d8] disabled:opacity-40 text-[#050B1E] text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>{isAnalyzing ? 'Analisando...' : 'Analisar'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Preset Suggestions */}
        <div>
          <span className="text-[11px] text-slate-400 block mb-2 font-medium">
            Sugestões frequentes de análise comercial:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_QUESTIONS.map((question) => (
              <button
                key={question}
                onClick={() => handleAskQuestion(question)}
                className="px-3 py-1.5 rounded-lg bg-[#050B1E] border border-[#16264C] hover:border-[#00DDF2]/40 text-xs text-slate-300 hover:text-white transition-colors text-left"
              >
                "{question}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Answers Feed */}
      <div className="space-y-5">
        {history.map((ans, idx) => {
          const targetMuni = ans.targetMunicipalityId
            ? municipalities.find((m) => m.id === ans.targetMunicipalityId)
            : null;

          return (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-[#0A1329] border border-[#16264C] space-y-4 shadow-lg animate-in fade-in"
            >
              {/* Question header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#16264C] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00DDF2]" />
                  <span className="text-xs font-bold text-slate-300">Consulta:</span>
                  <span className="text-xs text-white font-medium">"{ans.query}"</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${ans.prioridadeColor}`}>
                    {ans.prioridadeBadge}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono-numbers">
                    Confiança: {ans.confianca}
                  </span>
                </div>
              </div>

              {/* Conclusão */}
              <div>
                <span className="text-[10px] font-bold text-[#00DDF2] tracking-wider uppercase block">
                  Conclusão Executiva
                </span>
                <p className="text-sm font-semibold text-white mt-1 leading-relaxed">
                  {ans.conclusao}
                </p>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {ans.justificativa}
                </p>
              </div>

              {/* Sinais (+) & Cautelas (-) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Sinais */}
                <div className="p-4 rounded-xl bg-[#050B1E] border border-[#16264C]">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                    Por quê? Sinais que sustentam a recomendação
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {ans.sinais.map((s, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">+</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cautelas */}
                <div className="p-4 rounded-xl bg-[#050B1E] border border-[#16264C]">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                    Atenção & Cautelas a validar
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {ans.cautelas.map((c, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">-</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Fontes utilizadas */}
              <div className="pt-2 border-t border-[#16264C] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                    Fontes:
                  </span>
                  {ans.fontes.map((f, fIdx) => (
                    <span
                      key={fIdx}
                      className="px-2 py-0.5 rounded bg-[#050B1E] text-slate-300 border border-[#16264C] text-[10px]"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {targetMuni && (
                  <button
                    onClick={() => onSelectMunicipality(targetMuni)}
                    className="text-xs text-[#00DDF2] hover:underline font-semibold flex items-center gap-1 self-start sm:self-auto"
                  >
                    Ver Ficha de {targetMuni.nome} →
                  </button>
                )}
              </div>

              {/* Mandatory AI Disclaimer */}
              <div className="p-2.5 rounded-lg bg-[#050B1E] border border-[#16264C] text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  <strong>Aviso Metodológico:</strong> Análise assistida por IA. Recomenda-se revisão humana antes de qualquer decisão comercial.
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
