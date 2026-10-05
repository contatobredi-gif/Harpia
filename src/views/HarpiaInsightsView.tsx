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
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Municipality } from '../types';
import { askHarpiaAi, InsightResponse } from '../services/ai';

interface HarpiaInsightsViewProps {
  municipalities: Municipality[];
  onSelectMunicipality: (municipality: Municipality) => void;
}

interface InsightAnswer extends InsightResponse {
  query: string;
  prioridadeBadge: string;
  prioridadeColor: string;
}

const PRESET_QUESTIONS = [
  'Quais municípios possuem janela nos próximos 90 dias?',
  'Compare Município Alfa e Município Beta.',
  'Qual município possui maior capacidade fiscal?',
  'Quais municípios combinam alta necessidade educacional e boa capacidade financeira?',
  'Por que Município Alfa está com prioridade alta?',
  'Quais oportunidades possuem mais cautelas?',
  'Quais municípios estão em monitoramento?',
  'Quais municípios possuem score acima de 75?',
];

function getPriorityColor(priority: string): string {
  const p = priority.toLowerCase();
  if (p.includes('alta') || p.includes('iminente')) {
    return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
  }
  if (p.includes('atenção') || p.includes('cautela') || p.includes('alerta')) {
    return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
  }
  return 'bg-[#00DDF2]/15 text-[#00DDF2] border border-[#00DDF2]/30';
}

export const HarpiaInsightsView: React.FC<HarpiaInsightsViewProps> = ({
  municipalities,
  onSelectMunicipality,
}) => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<InsightAnswer[]>([]);

  const handleAskQuestion = async (question: string) => {
    if (!question.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await askHarpiaAi(question, municipalities);

      const formattedAnswer: InsightAnswer = {
        ...response,
        query: question,
        prioridadeBadge: response.prioridade?.toUpperCase() || 'ANÁLISE ESTRATÉGICA',
        prioridadeColor: getPriorityColor(response.prioridade || ''),
      };

      setHistory((prev) => [formattedAnswer, ...prev]);
      setInputText('');
    } catch (err: any) {
      console.error('Harpia Insights error:', err);
      setErrorMessage(
        err?.message || 'Não foi possível concluir a análise neste momento. Tente novamente.'
      );
    } finally {
      setIsAnalyzing(false);
    }
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
            Copiloto analítico B2G integrado com IA para responder dúvidas sobre prioridades, cruzamentos fiscais, demandas pedagógicas e janelas contratuais.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-[11px] font-mono text-slate-400 px-3 py-1.5 rounded-lg bg-[#0A1329] border border-[#16264C]">
            Motor Gemini Ativo · Dataset Demonstrativo ({municipalities.length} municípios)
          </span>
        </div>
      </div>

      {/* Chatbot-style Question Input & Suggestions */}
      <div id="insights-input-form" className="p-5 rounded-2xl bg-[#0A1329] border border-[#16264C] space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-[#00DDF2]" />
            <span>Pergunte à Harpia</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Respostas baseadas estritamente nos dados do ambiente demonstrativo
          </span>
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
            disabled={isAnalyzing}
            placeholder="Digite sua pergunta sobre municípios, scores ou contratações públicas..."
            className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={() => handleAskQuestion(inputText)}
            disabled={!inputText.trim() || isAnalyzing}
            className="px-4 py-2 rounded-lg bg-[#00DDF2] hover:bg-[#00c5d8] disabled:opacity-40 text-[#050B1E] text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analisando...</span>
              </>
            ) : (
              <>
                <span>Analisar</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
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
                disabled={isAnalyzing}
                onClick={() => handleAskQuestion(question)}
                className="px-3 py-1.5 rounded-lg bg-[#050B1E] border border-[#16264C] hover:border-[#00DDF2]/40 text-xs text-slate-300 hover:text-white transition-colors text-left disabled:opacity-50"
              >
                "{question}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error state if Gemini fails */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start justify-between gap-3 text-xs text-rose-300 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">{errorMessage}</p>
              <p className="text-[11px] text-rose-400/80 mt-0.5">
                Verifique a conexão ou tente reformular a consulta baseada nos dados do demonstrativo.
              </p>
            </div>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs text-rose-400 hover:underline shrink-0"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Loading state indicator */}
      {isAnalyzing && (
        <div className="p-6 rounded-2xl bg-[#0A1329] border border-[#00DDF2]/30 flex flex-col items-center justify-center gap-3 text-center animate-pulse">
          <Loader2 className="w-7 h-7 text-[#00DDF2] animate-spin" />
          <div>
            <p className="text-xs font-semibold text-white">
              Processando indicadores com o motor analítico Harpia...
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Cruzando capacidade fiscal, carência educacional e cronograma de contratação.
            </p>
          </div>
        </div>
      )}

      {/* Initial state empty prompt helper if no history yet */}
      {history.length === 0 && !isAnalyzing && !errorMessage && (
        <div className="p-8 rounded-2xl bg-[#0A1329]/60 border border-dashed border-[#16264C] text-center space-y-2">
          <Sparkles className="w-8 h-8 text-[#00DDF2] mx-auto opacity-50" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Assistente Pronto para Consultas
          </h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
            Selecione uma das sugestões acima ou digite perguntas comparativas, buscas por janelas de compras ou validação de cautelas orçamentárias.
          </p>
        </div>
      )}

      {/* Answers Feed */}
      <div className="space-y-5">
        {history.map((ans, idx) => {
          // Find matching municipalities
          const relatedMunis = (ans.municipiosRelacionados || [])
            .map((term) =>
              municipalities.find(
                (m) =>
                  m.id.toLowerCase() === term.toLowerCase() ||
                  m.nome.toLowerCase() === term.toLowerCase() ||
                  m.nome.toLowerCase().includes(term.toLowerCase())
              )
            )
            .filter((m): m is Municipality => Boolean(m));

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
                    Por quê? Sinais identificados
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {ans.sinais && ans.sinais.length > 0 ? (
                      ans.sinais.map((s, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">+</span>
                          <span>{s}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-400 text-[11px]">Nenhum sinal adicional reportado.</li>
                    )}
                  </ul>
                </div>

                {/* Cautelas */}
                <div className="p-4 rounded-xl bg-[#050B1E] border border-[#16264C]">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                    Atenção & Cautelas a validar
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {ans.cautelas && ans.cautelas.length > 0 ? (
                      ans.cautelas.map((c, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-1.5">
                          <span className="text-amber-400 font-bold">-</span>
                          <span>{c}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-400 text-[11px]">Nenhuma cautela identificada no dataset.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Related Municipalities links */}
              {relatedMunis.length > 0 && (
                <div className="pt-2 border-t border-[#16264C]/60 flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                    Municípios Relacionados:
                  </span>
                  {relatedMunis.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => onSelectMunicipality(m)}
                      className="px-2.5 py-1 rounded-lg bg-[#050B1E] hover:bg-[#16264C] text-[#00DDF2] border border-[#00DDF2]/30 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>{m.nome} / {m.uf}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}

              {/* Fontes utilizadas */}
              <div className="pt-2 border-t border-[#16264C] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                    Fontes de Referência Previstas:
                  </span>
                  {ans.fontes && ans.fontes.length > 0 ? (
                    ans.fontes.map((f, fIdx) => (
                      <span
                        key={fIdx}
                        className="px-2 py-0.5 rounded bg-[#050B1E] text-slate-300 border border-[#16264C] text-[10px]"
                      >
                        {f}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-[10px]">Dataset demonstrativo Harpia Tech</span>
                  )}
                </div>
              </div>

              {/* Mandatory AI Disclaimer & Reference Notes */}
              <div className="p-2.5 rounded-lg bg-[#050B1E] border border-[#16264C] text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    <strong>Aviso Metodológico:</strong> Análise assistida por IA sobre dataset demonstrativo. Recomenda-se revisão humana antes de qualquer decisão comercial.
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Ambiente de Demonstração
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
