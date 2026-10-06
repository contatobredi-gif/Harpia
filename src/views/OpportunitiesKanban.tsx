import React from 'react';
import {
  Zap,
  Users2,
  BookmarkCheck,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Municipality, PipelineStage } from '../types';
import { ContextualHelp } from '../components/ContextualHelp';

interface OpportunitiesKanbanProps {
  municipalities: Municipality[];
  onSelectMunicipality: (municipality: Municipality) => void;
  onMoveStage: (id: string, newStage: PipelineStage) => void;
}

interface ColumnConfig {
  id: PipelineStage;
  code: string;
  title: string;
  criteria: string;
  action: string;
  badgeColor: string;
  borderColor: string;
  icon: React.ElementType;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'A_IMEDIATA',
    code: 'A',
    title: 'ABORDAGEM IMEDIATA',
    criteria: 'Necessidade e aderência comprovadas, sinal de contratação próximo e canal oficial confirmado.',
    action: 'Contato técnico e institucional imediato.',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    borderColor: 'border-emerald-500/30',
    icon: Zap,
  },
  {
    id: 'B_RELACIONAMENTO',
    code: 'B',
    title: 'RELACIONAMENTO',
    criteria: 'Necessidade relevante, dotação orçamentária em formação e janela prevista de 6 a 12 meses.',
    action: 'Conteúdo, demonstração pedagógica e relacionamento institucional.',
    badgeColor: 'bg-[#00DDF2]/15 text-[#00DDF2] border border-[#00DDF2]/30',
    borderColor: 'border-[#00DDF2]/30',
    icon: Users2,
  },
  {
    id: 'C_MONITORAMENTO',
    code: 'C',
    title: 'MONITORAMENTO',
    criteria: 'Dados insuficientes, contrato recentemente renovado ou ausência de sinal de janela.',
    action: 'Atualizar dados e acompanhar publicações oficiais.',
    badgeColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    borderColor: 'border-amber-500/30',
    icon: BookmarkCheck,
  },
];

export const OpportunitiesKanban: React.FC<OpportunitiesKanbanProps> = ({
  municipalities,
  onSelectMunicipality,
  onMoveStage,
}) => {
  return (
    <div className="space-y-6">
      {/* Title & Pipeline Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Pipeline de Oportunidades Educacionais
            </h1>
            <ContextualHelp
              topic="Pipeline B2G"
              explanation="Organiza os municípios entre Abordagem Imediata (0-90 dias), Relacionamento & Planejamento (91-180 dias) e Monitoramento (181-365 dias). Mova cards entre colunas conforme sua evolução comercial."
            />
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Funil comercial B2G qualificado por inteligência de compras públicas. Arraste ou mova municípios entre estágios de prospecção.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-[#0A1329] border border-[#16264C] text-[11px] text-slate-400 flex items-center gap-1.5 self-start sm:self-center">
          <Info className="w-3.5 h-3.5 text-[#00DDF2]" />
          <span>Movimentações salvas automaticamente no navegador</span>
        </div>
      </div>

      {/* 3 Kanban Columns */}
      <div id="pipeline-kanban-board" className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {COLUMNS.map((col) => {
          const Icon = col.icon;
          const itemsInCol = municipalities.filter((m) => m.pipelineStage === col.id);

          return (
            <div
              key={col.id}
              id={col.id === 'A_IMEDIATA' ? 'pipeline-column-imediata' : undefined}
              className={`rounded-2xl bg-[#0A1329] border ${col.borderColor} p-4 flex flex-col min-h-[580px] shadow-lg`}
            >
              {/* Column Header */}
              <div className="border-b border-[#16264C] pb-3 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${col.badgeColor}`}>
                      {col.code}
                    </span>
                    <h2 className="text-xs font-bold text-white tracking-wide">{col.title}</h2>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-[#050B1E] border border-[#16264C] text-xs font-mono-numbers font-bold text-slate-300 flex items-center justify-center">
                    {itemsInCol.length}
                  </span>
                </div>

                <div className="mt-2.5 space-y-1 text-[11px]">
                  <p className="text-slate-400 leading-tight">
                    <strong>Critérios:</strong> {col.criteria}
                  </p>
                  <p className="text-slate-300 leading-tight">
                    <strong>Ação:</strong> {col.action}
                  </p>
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-3">
                {itemsInCol.length === 0 ? (
                  <div className="h-44 border border-dashed border-[#16264C] rounded-xl flex items-center justify-center text-xs text-slate-400 p-4 text-center">
                    Nenhum município neste estágio no momento.
                  </div>
                ) : (
                  itemsInCol.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => onSelectMunicipality(m)}
                      className="p-4 rounded-xl bg-[#050B1E] border border-[#16264C] hover:border-[#00DDF2]/50 cursor-pointer transition-all shadow-md group space-y-3"
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#00DDF2]" />
                          <h3 className="text-sm font-bold text-white group-hover:text-[#00DDF2] transition-colors">
                            {m.nome}
                          </h3>
                          <span className="text-xs text-slate-400 font-mono-numbers">
                            {m.uf}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-white font-mono-numbers bg-[#0A1329] px-2 py-0.5 rounded border border-[#16264C]">
                            {m.score.total} pts
                          </span>
                        </div>
                      </div>

                      {/* Commercial Decision Highlights */}
                      <div className="space-y-1.5 text-[11px]">
                        <div className="text-slate-300 flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                          <span className="line-clamp-2">
                            <strong className="text-white">Sinal:</strong> {m.principalSinal || m.leituraHarpia.resumo}
                          </span>
                        </div>
                        <div className="text-[#00DDF2] bg-[#0A1329] p-2 rounded-lg border border-[#16264C] flex items-start gap-1.5">
                          <ArrowRight className="w-3 h-3 text-[#00DDF2] mt-0.5 shrink-0" />
                          <span className="line-clamp-2 font-medium">
                            <strong className="text-white">Ação:</strong> {m.leituraHarpia.proximaAcao}
                          </span>
                        </div>
                      </div>

                      {/* Pill metrics */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-[#16264C]/60 text-slate-400">
                        <div>
                          <span>Janela:</span> <strong className="text-slate-200">{m.janela}</strong>
                        </div>
                        <div className="text-right">
                          <span>Confiança:</span> <strong className="text-emerald-400">{m.confianca}</strong>
                        </div>
                      </div>

                      {/* Move Stage Buttons */}
                      <div
                        className="pt-2 border-t border-[#16264C]/60 flex items-center justify-between"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1">
                          {col.id !== 'A_IMEDIATA' && (
                            <button
                              onClick={() => {
                                const prev = col.id === 'C_MONITORAMENTO' ? 'B_RELACIONAMENTO' : 'A_IMEDIATA';
                                onMoveStage(m.id, prev);
                              }}
                              title="Recuar estágio"
                              className="px-2 py-1 rounded bg-[#0A1329] hover:bg-[#16264C] text-[10px] text-slate-300 font-medium flex items-center gap-1"
                            >
                              <ChevronLeft className="w-3 h-3" /> Voltar
                            </button>
                          )}
                          {col.id !== 'C_MONITORAMENTO' && (
                            <button
                              onClick={() => {
                                const next = col.id === 'A_IMEDIATA' ? 'B_RELACIONAMENTO' : 'C_MONITORAMENTO';
                                onMoveStage(m.id, next);
                              }}
                              title="Avançar estágio"
                              className="px-2 py-1 rounded bg-[#0A1329] hover:bg-[#16264C] text-[10px] text-[#00DDF2] font-medium flex items-center gap-1"
                            >
                              Avançar <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <span className="text-[10px] text-slate-400 group-hover:text-white transition-colors">
                          Ver Ficha →
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
