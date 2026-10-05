import React, { useState, useEffect } from 'react';
import { Search, X, MapPin, Building, ChevronRight, Sparkles } from 'lucide-react';
import { Municipality } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  municipalities: Municipality[];
  onSelectMunicipality: (municipality: Municipality) => void;
  onNavigateToInsights: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  municipalities,
  onSelectMunicipality,
  onNavigateToInsights,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? municipalities.filter(
        (m) =>
          m.nome.toLowerCase().includes(query.toLowerCase()) ||
          m.uf.toLowerCase().includes(query.toLowerCase()) ||
          m.regiao.toLowerCase().includes(query.toLowerCase()) ||
          m.status.toLowerCase().includes(query.toLowerCase()) ||
          m.leituraHarpia.sinaisFavoraveis.some((s) => s.toLowerCase().includes(query.toLowerCase()))
      )
    : municipalities.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#050B1E]/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-[#0A1329] border border-[#16264C] rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#16264C] gap-3">
          <Search className="w-5 h-5 text-[#00DDF2] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar município, estado, sinais ou contratos (Ex: Alfa, PA, Fundeb)..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#0F1C3C] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results / Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() === '' && (
            <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Oportunidades em Destaque
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Nenhum município demonstrativo encontrado para "{query}".
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    onSelectMunicipality(m);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#0F1C3C] border border-transparent hover:border-[#16264C] text-left transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#050B1E] border border-[#16264C] flex items-center justify-center text-[#00DDF2] group-hover:border-[#00DDF2]/50 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white group-hover:text-[#00DDF2] transition-colors truncate">
                          {m.nome}
                        </span>
                        <span className="text-xs text-slate-400 font-mono-numbers">
                          {m.uf} · {m.regiao}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">
                        Janela: <span className="text-slate-300">{m.janela}</span> · Status: {m.status}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Score</span>
                      <span className="text-sm font-mono-numbers font-bold text-white">
                        {m.score.total}
                        <span className="text-[10px] text-slate-400 font-normal">/100</span>
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Quick AI Trigger */}
          <div className="mt-2 pt-2 border-t border-[#16264C]">
            <button
              onClick={() => {
                onNavigateToInsights();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#00DDF2]/5 hover:bg-[#00DDF2]/10 border border-[#00DDF2]/20 text-[#00DDF2] text-xs font-medium transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Explorar perguntas com o Harpia Insights AI</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#070F26] border-t border-[#16264C] flex items-center justify-between text-[11px] text-slate-400">
          <span>Pressione <strong>ESC</strong> para fechar</span>
          <span>Ambiente de demonstração B2G</span>
        </div>
      </div>
    </div>
  );
};
