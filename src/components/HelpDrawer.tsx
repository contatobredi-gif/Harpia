import React, { useState } from 'react';
import {
  X,
  Search,
  HelpCircle,
  Sparkles,
  ChevronRight,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Layers,
  Compass,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { askHelpAssistant, HelpSearchResult } from '../services/help';
import { HELP_KNOWLEDGE_BASE } from '../data/helpKnowledgeBase';
import { NavTab } from './Sidebar';

interface HelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab) => void;
  onRestartTour: () => void;
  onShowHowTo?: (actionTarget: string, highlightId?: string) => void;
}

const POPULAR_QUESTIONS = [
  'Como buscar um município?',
  'Como funciona o Score Harpia?',
  'Como usar os filtros?',
  'Como adicionar um município ao monitoramento?',
  'Como comparar oportunidades?',
  'O que significa janela de contratação?',
  'Como usar o Harpia Insights?',
  'Como funciona o Pipeline?',
  'Como analisar uma Ficha Municipal?',
];

export const HelpDrawer: React.FC<HelpDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onRestartTour,
  onShowHowTo,
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentResult, setCurrentResult] = useState<HelpSearchResult | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (text: string) => {
    if (!text.trim()) return;
    setIsSearching(true);
    try {
      const res = await askHelpAssistant(text);
      setCurrentResult(res);
    } catch (err) {
      console.error('Help search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSuggested = (q: string) => {
    setQuery(q);
    handleSearch(q);
  };

  const handleExecuteAction = (actionTarget?: string | null, highlightId?: string | null) => {
    if (!actionTarget) return;

    onClose();

    if (actionTarget === 'tutorial') {
      onRestartTour();
      return;
    }

    if (onShowHowTo) {
      onShowHowTo(actionTarget, highlightId || undefined);
    } else {
      const tabMap: Record<string, NavTab> = {
        radar: 'radar',
        mapa: 'mapa',
        oportunidades: 'oportunidades',
        monitoramento: 'monitoramento',
        insights: 'insights',
        fontes: 'fontes',
        configuracoes: 'configuracoes',
        'visao-geral': 'visao-geral',
      };
      if (tabMap[actionTarget]) {
        onNavigate(tabMap[actionTarget]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#050B1E]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0A1329] border-l border-[#16264C] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#16264C] bg-[#070F26] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00DDF2]/15 border border-[#00DDF2]/40 flex items-center justify-center text-[#00DDF2]">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Central de Ajuda Harpia
                </h2>
                <span className="text-[11px] text-slate-400">
                  Instruções e suporte sobre o uso da plataforma
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#16264C] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="p-4 border-b border-[#16264C] bg-[#0A1329]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(query);
              }}
              className="relative"
            >
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Como podemos ajudar? Ex: Como buscar um município?"
                className="w-full pl-9 pr-9 py-2 rounded-xl bg-[#050B1E] border border-[#16264C] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00DDF2] transition-colors"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setCurrentResult(null);
                  }}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Quick Tutorial restart button */}
            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={() => {
                  onClose();
                  onRestartTour();
                }}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-[#00DDF2] hover:text-[#5beaff] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar Tutorial da Plataforma</span>
              </button>
              <span className="text-[10px] text-slate-400 font-mono">12 etapas guiadas</span>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isSearching ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 className="w-6 h-6 text-[#00DDF2] animate-spin" />
                <span className="text-xs text-slate-400">Consultando instruções da plataforma...</span>
              </div>
            ) : currentResult ? (
              /* Search / Topic Answer Card */
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-4 rounded-xl bg-[#050B1E] border border-[#00DDF2]/40 shadow-lg space-y-3">
                  <div className="flex items-center justify-between border-b border-[#16264C] pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#00DDF2]" />
                      <span>{currentResult.title}</span>
                    </h3>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#16264C] text-[#00DDF2]">
                      {currentResult.source === 'gemini-assistant' ? 'Assistente IA' : 'Base Harpia'}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-200">
                    {currentResult.answer}
                  </p>

                  {/* Step by step checklist */}
                  {currentResult.steps && currentResult.steps.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-[#16264C]/70">
                      <span className="text-[11px] font-semibold text-[#00DDF2] uppercase tracking-wider block">
                        Passo a Passo:
                      </span>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {currentResult.steps.map((st, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-[#16264C] text-[#00DDF2] text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="leading-snug">{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Contextual Action Button */}
                  {currentResult.actionLabel && currentResult.actionTarget && (
                    <div className="pt-3 border-t border-[#16264C] flex flex-col gap-2">
                      <button
                        onClick={() =>
                          handleExecuteAction(
                            currentResult.actionTarget,
                            currentResult.highlightTargetId
                          )
                        }
                        className="w-full py-2 px-3 rounded-lg bg-[#00DDF2] text-[#050B1E] text-xs font-bold hover:bg-[#5beaff] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,221,242,0.25)]"
                      >
                        <span>{currentResult.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      {currentResult.relatedScreen && (
                        <button
                          onClick={() =>
                            handleExecuteAction(
                              currentResult.actionTarget,
                              currentResult.highlightTargetId
                            )
                          }
                          className="text-[11px] text-slate-400 hover:text-[#00DDF2] text-center transition-colors"
                        >
                          Me mostre na interface →
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setCurrentResult(null)}
                  className="w-full py-2 text-xs text-slate-400 hover:text-white border border-[#16264C] rounded-lg hover:bg-[#050B1E] transition-colors"
                >
                  ← Ver outras perguntas frequentes
                </button>
              </div>
            ) : (
              /* Default State: Suggested Questions */
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Dúvidas Frequentes
                  </span>
                  <div className="space-y-1.5">
                    {POPULAR_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSelectSuggested(q)}
                        className="w-full text-left p-2.5 rounded-xl bg-[#050B1E] hover:bg-[#0F1C3C] border border-[#16264C] hover:border-[#00DDF2]/50 text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between group"
                      >
                        <span className="group-hover:text-[#00DDF2] transition-colors">
                          {q}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#00DDF2] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Modules Reference Strip */}
                <div className="p-3 rounded-xl bg-[#050B1E] border border-[#16264C] space-y-2">
                  <span className="text-[11px] font-bold text-[#00DDF2] uppercase tracking-wider block">
                    Navegação Rápida
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => {
                        onClose();
                        onNavigate('radar');
                      }}
                      className="p-2 rounded-lg bg-[#0A1329] border border-[#16264C] hover:border-[#00DDF2]/40 text-left text-slate-300 hover:text-white transition-all"
                    >
                      <strong className="block text-white">Radar</strong>
                      <span className="text-[10px] text-slate-400">Tabela de municípios</span>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onNavigate('mapa');
                      }}
                      className="p-2 rounded-lg bg-[#0A1329] border border-[#16264C] hover:border-[#00DDF2]/40 text-left text-slate-300 hover:text-white transition-all"
                    >
                      <strong className="block text-white">Mapa</strong>
                      <span className="text-[10px] text-slate-400">Distribuição por UF</span>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onNavigate('oportunidades');
                      }}
                      className="p-2 rounded-lg bg-[#0A1329] border border-[#16264C] hover:border-[#00DDF2]/40 text-left text-slate-300 hover:text-white transition-all"
                    >
                      <strong className="block text-white">Pipeline</strong>
                      <span className="text-[10px] text-slate-400">Funil de abordagem</span>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onNavigate('insights');
                      }}
                      className="p-2 rounded-lg bg-[#0A1329] border border-[#16264C] hover:border-[#00DDF2]/40 text-left text-slate-300 hover:text-white transition-all"
                    >
                      <strong className="block text-[#00DDF2]">Insights</strong>
                      <span className="text-[10px] text-slate-400">IA B2G analítica</span>
                    </button>
                  </div>
                </div>

                {/* Scope Distinction Disclaimer */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 leading-relaxed">
                  <p className="font-semibold mb-1">Central de Ajuda vs. Harpia Insights:</p>
                  <p className="text-amber-200/80">
                    A <strong>Central de Ajuda</strong> explica como usar o software. Para analisar dados e priorizar compras públicas de municípios, utilize o <strong>Harpia Insights</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[#16264C] bg-[#070F26] flex items-center justify-between text-[11px] text-slate-400">
            <span>HARPIA TECH v1.2</span>
            <span className="font-mono">Suporte B2G</span>
          </div>
        </div>
      </div>
    </div>
  );
};
