import React from 'react';
import {
  Activity,
  BookmarkCheck,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
  FileText,
  AlertCircle,
  Database,
  Building,
  Plus,
} from 'lucide-react';
import { Municipality, TimelineEvent } from '../types';

interface MonitoringViewProps {
  municipalities: Municipality[];
  timelineEvents: TimelineEvent[];
  onSelectMunicipality: (municipality: Municipality) => void;
  onToggleMonitoring: (id: string) => void;
  onNavigateToRadar: () => void;
}

export const MonitoringView: React.FC<MonitoringViewProps> = ({
  municipalities,
  timelineEvents,
  onSelectMunicipality,
  onToggleMonitoring,
  onNavigateToRadar,
}) => {
  const monitoredList = municipalities.filter((m) => m.isMonitored);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Monitoramento & Watchlist
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Acompanhe a evolução simulada de scores, variações de janelas e alertas metodológicos nos municípios sob observação comercial.
          </p>
        </div>

        <button
          onClick={onNavigateToRadar}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00DDF2] hover:bg-[#00c5d8] text-[#050B1E] text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,221,242,0.2)] self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Município do Radar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Watchlist Table (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-[#00DDF2]" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Municípios Acompanhados ({monitoredList.length})
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Alertas automáticos habilitados</span>
          </div>

          {monitoredList.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400 border border-dashed border-[#16264C] rounded-xl p-6">
              <BookmarkCheck className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="font-medium text-slate-300">Sua watchlist está vazia no momento.</p>
              <p className="mt-1 text-[11px]">
                Navegue pelo Radar de Municípios e clique em "Adicionar ao monitoramento" para acompanhar mudanças de score e editais.
              </p>
              <button
                onClick={onNavigateToRadar}
                className="mt-4 px-3 py-1.5 rounded-lg bg-[#0F1C3C] text-[#00DDF2] text-xs font-semibold hover:bg-[#16264C] transition-colors"
              >
                Ir para o Radar de Municípios
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#16264C] text-slate-400">
                    <th className="py-3 px-3 font-semibold">Município / UF</th>
                    <th className="py-3 px-3 font-semibold text-center">Score Atual</th>
                    <th className="py-3 px-3 font-semibold text-center">Score Ant.</th>
                    <th className="py-3 px-3 font-semibold text-center">Variação</th>
                    <th className="py-3 px-3 font-semibold">Janela</th>
                    <th className="py-3 px-3 font-semibold">Próxima Ação</th>
                    <th className="py-3 px-3 font-semibold text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#16264C]/60 text-slate-300">
                  {monitoredList.map((m) => {
                    const delta = m.score.total - m.scoreAnterior;
                    return (
                      <tr
                        key={m.id}
                        onClick={() => onSelectMunicipality(m)}
                        className="hover:bg-[#0F1C3C]/60 transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-3 font-medium text-white">
                          <div className="flex items-center gap-2">
                            <span className="group-hover:text-[#00DDF2] transition-colors">
                              {m.nome}
                            </span>
                            <span className="text-[10px] font-mono-numbers px-1.5 py-0.5 rounded bg-[#050B1E] border border-[#16264C] text-slate-400">
                              {m.uf}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{m.atualizadoEm}</span>
                        </td>
                        <td className="py-3 px-3 font-mono-numbers font-bold text-center text-white">
                          {m.score.total}
                        </td>
                        <td className="py-3 px-3 font-mono-numbers text-center text-slate-400">
                          {m.scoreAnterior}
                        </td>
                        <td className="py-3 px-3 font-mono-numbers text-center">
                          {delta > 0 ? (
                            <span className="text-emerald-400 font-semibold inline-flex items-center gap-0.5">
                              <TrendingUp className="w-3 h-3" /> +{delta}
                            </span>
                          ) : delta < 0 ? (
                            <span className="text-rose-400 font-semibold inline-flex items-center gap-0.5">
                              <TrendingDown className="w-3 h-3" /> {delta}
                            </span>
                          ) : (
                            <span className="text-slate-400">0 pts</span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono-numbers text-slate-200">
                          {m.janela}
                        </td>
                        <td className="py-3 px-3 max-w-xs truncate text-[11px] text-slate-300">
                          {m.leituraHarpia.proximaAcao}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleMonitoring(m.id);
                            }}
                            className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors"
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Timeline of Live Events (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Linha do Tempo de Sinais B2G
              </h2>
            </div>
            <span className="text-[10px] text-[#00DDF2] font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00DDF2]" />
              Simulado
            </span>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#16264C]">
            {timelineEvents.map((evt) => {
              const Icon =
                evt.tipo === 'contrato'
                  ? Clock
                  : evt.tipo === 'publicacao'
                  ? FileText
                  : evt.tipo === 'score'
                  ? TrendingUp
                  : Database;

              const iconColor =
                evt.tipo === 'contrato'
                  ? 'text-amber-400'
                  : evt.tipo === 'publicacao'
                  ? 'text-[#00DDF2]'
                  : evt.tipo === 'score'
                  ? 'text-emerald-400'
                  : 'text-indigo-400';

              return (
                <div key={evt.id} className="relative group">
                  {/* Dot Icon */}
                  <div className="absolute -left-[27px] top-0.5 w-5 h-5 rounded-full bg-[#050B1E] border border-[#16264C] group-hover:border-[#00DDF2] flex items-center justify-center transition-colors">
                    <Icon className={`w-3 h-3 ${iconColor}`} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono-numbers text-slate-400">{evt.data}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#050B1E] border border-[#16264C] text-[#00DDF2] font-semibold">
                        {evt.municipioNome} / {evt.uf}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-white leading-tight">
                      {evt.titulo}
                    </h4>

                    <p className="text-[11px] text-slate-400 leading-normal">
                      {evt.descricao}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
