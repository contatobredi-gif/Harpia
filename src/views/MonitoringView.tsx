import React, { useState } from 'react';
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
  Zap,
  Filter,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { Municipality, TimelineEvent, HarpiaSignal } from '../types';
import { HARPIA_SIGNALS } from '../data/harpiaSignals';
import { ContextualHelp } from '../components/ContextualHelp';

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
  const [tabFilter, setTabFilter] = useState<'TODOS' | 'IMEDIATOS' | 'SCORE_UP' | 'ATENCAO'>('TODOS');
  const [signalTypeFilter, setSignalTypeFilter] = useState<string>('TODOS');

  // Monitored list
  const monitoredList = municipalities.filter((m) => m.isMonitored);

  // Recommendations for adding if monitored list is small
  const suggestedToAdd = municipalities
    .filter((m) => !m.isMonitored && (m.pipelineStage === 'A_IMEDIATA' || m.score.total >= 75))
    .slice(0, 3);

  // Filtered monitored list based on active tab
  const filteredMonitored = monitoredList.filter((m) => {
    if (tabFilter === 'IMEDIATOS') return m.janela === '0–90 dias';
    if (tabFilter === 'SCORE_UP') return m.score.total > m.scoreAnterior;
    if (tabFilter === 'ATENCAO')
      return (
        (m.leituraHarpia?.cautelas && m.leituraHarpia.cautelas.length > 0) ||
        m.confianca === 'Média' ||
        m.confianca === 'Baixa'
      );
    return true;
  });

  // KPI Calculations strictly from current dataset
  const totalMonitored = monitoredList.length;
  const immediateMonitored = monitoredList.filter((m) => m.janela === '0–90 dias').length;
  const positiveScoreMonitored = monitoredList.filter(
    (m) => m.score.total > m.scoreAnterior
  ).length;
  const monitoredIds = new Set(monitoredList.map((m) => m.id));
  const signalsForMonitored = HARPIA_SIGNALS.filter((s) => monitoredIds.has(s.municipioId));
  const recentSignalsCount = signalsForMonitored.length > 0 ? signalsForMonitored.length : HARPIA_SIGNALS.length;

  // Filtered signals for the radar feed
  const displaySignals = (signalsForMonitored.length > 0 ? signalsForMonitored : HARPIA_SIGNALS).filter(
    (sig) => {
      if (signalTypeFilter === 'TODOS') return true;
      if (signalTypeFilter === 'OPORTUNIDADE') return sig.tipo === 'OPORTUNIDADE';
      if (signalTypeFilter === 'SCORE') return sig.tipo === 'MUDANCA_PRIORIDADE';
      if (signalTypeFilter === 'PUBLICACAO') return sig.tipo === 'NOVA_PUBLICACAO' || sig.tipo === 'DADOS_ATUALIZADOS';
      return true;
    }
  );

  return (
    <div className="space-y-6">
      {/* Title & Radar de Acompanhamento Presentation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Radar de Acompanhamento B2G
            </h1>
            <ContextualHelp
              topic="Radar de Acompanhamento"
              explanation="Acompanhamento contínuo dos municípios sob observação comercial: evolução de scores, movimentações de compras, alertas de publicação e direcionamento da próxima ação."
            />
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Painel ativo de observação comercial. Monitore variações de score, alertas de novos estudos técnicos e janelas de abordagem nos municípios da sua carteira.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={onNavigateToRadar}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00DDF2] hover:bg-[#00c5d8] text-[#050B1E] text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,221,242,0.2)]"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Município do Radar</span>
          </button>
        </div>
      </div>

      {/* 4 Cards de Resumo do Radar de Acompanhamento */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[#0A1329] border border-[#16264C] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookmarkCheck className="w-3.5 h-3.5 text-[#00DDF2]" />
              No Radar Ativo
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#050B1E] text-slate-400 border border-[#16264C]">
              Carteira
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono-numbers">
              {totalMonitored}
            </span>
            <span className="text-xs text-slate-400">
              municípios acompanhados
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0A1329] border border-emerald-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Janela Imediata
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              0–90 dias
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono-numbers">
              {immediateMonitored}
            </span>
            <span className="text-xs text-emerald-400 font-semibold">
              abordagem iminente
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0A1329] border border-indigo-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              Salto de Score
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Evolução
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono-numbers">
              {positiveScoreMonitored}
            </span>
            <span className="text-xs text-indigo-300 font-semibold">
              ganhos de pontuação
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0A1329] border border-amber-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              Sinais Mapeados
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Alertas
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono-numbers">
              {recentSignalsCount}
            </span>
            <span className="text-xs text-amber-400 font-semibold">
              eventos no radar
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Watchlist & Radar Table (8 cols) */}
        <div id="monitoring-watchlist-area" className="lg:col-span-8 p-5 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#16264C]/70 pb-3">
            <div className="flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-[#00DDF2]" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Municípios Acompanhados ({filteredMonitored.length})
              </h2>
            </div>

            {/* Segment Tabs */}
            <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setTabFilter('TODOS')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  tabFilter === 'TODOS'
                    ? 'bg-[#00DDF2] text-[#050B1E] font-bold'
                    : 'text-slate-400 hover:text-white bg-[#050B1E]'
                }`}
              >
                Todos ({monitoredList.length})
              </button>
              <button
                onClick={() => setTabFilter('IMEDIATOS')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  tabFilter === 'IMEDIATOS'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white bg-[#050B1E]'
                }`}
              >
                0–90 dias ({immediateMonitored})
              </button>
              <button
                onClick={() => setTabFilter('SCORE_UP')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  tabFilter === 'SCORE_UP'
                    ? 'bg-indigo-500 text-white font-bold'
                    : 'text-slate-400 hover:text-white bg-[#050B1E]'
                }`}
              >
                Score + ({positiveScoreMonitored})
              </button>
              <button
                onClick={() => setTabFilter('ATENCAO')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  tabFilter === 'ATENCAO'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white bg-[#050B1E]'
                }`}
              >
                Cautelas
              </button>
            </div>
          </div>

          {filteredMonitored.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-[#16264C] rounded-xl p-6 space-y-4">
              <BookmarkCheck className="w-10 h-10 text-slate-500 mx-auto opacity-40" />
              <div>
                <p className="font-semibold text-slate-200 text-sm">
                  {monitoredList.length === 0
                    ? 'Nenhum município no seu Radar de Acompanhamento ainda.'
                    : 'Nenhum município corresponde ao filtro selecionado.'}
                </p>
                <p className="mt-1 text-slate-400 max-w-md mx-auto">
                  Adicione municípios para monitorar alterações de score, encerramento de contratos e novas publicações de ETP.
                </p>
              </div>

              {suggestedToAdd.length > 0 && (
                <div className="pt-3 border-t border-[#16264C]/60 text-left max-w-lg mx-auto">
                  <span className="text-[11px] font-semibold text-slate-300 block mb-2 uppercase tracking-wider">
                    Sugestões de alta prioridade para adicionar:
                  </span>
                  <div className="space-y-2">
                    {suggestedToAdd.map((sug) => (
                      <div
                        key={sug.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#050B1E] border border-[#16264C] hover:border-[#00DDF2]/40 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{sug.nome}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0A1329] text-slate-400">
                            {sug.uf}
                          </span>
                          <span className="text-[11px] text-[#00DDF2] font-mono-numbers font-bold">
                            Score {sug.score.total}
                          </span>
                        </div>
                        <button
                          onClick={() => onToggleMonitoring(sug.id)}
                          className="px-2.5 py-1 rounded bg-[#0F1C3C] hover:bg-[#16264C] text-[#00DDF2] text-[11px] font-bold transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Adicionar</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={onNavigateToRadar}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00DDF2] text-[#050B1E] text-xs font-bold hover:bg-[#00c5d8] transition-colors"
              >
                <span>Explorar Radar de Municípios</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#16264C] text-slate-400">
                    <th className="py-3 px-3 font-semibold">Município / UF</th>
                    <th className="py-3 px-3 font-semibold text-center">Score Harpia</th>
                    <th className="py-3 px-3 font-semibold text-center">Variação</th>
                    <th className="py-3 px-3 font-semibold">Janela</th>
                    <th className="py-3 px-3 font-semibold">Principal Sinal</th>
                    <th className="py-3 px-3 font-semibold">Próxima Ação Comercial</th>
                    <th className="py-3 px-3 font-semibold text-right">Radar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#16264C]/60 text-slate-300">
                  {filteredMonitored.map((m) => {
                    const delta = m.score.total - m.scoreAnterior;
                    return (
                      <tr
                        key={m.id}
                        onClick={() => onSelectMunicipality(m)}
                        className="hover:bg-[#0F1C3C]/60 transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-3 font-medium text-white">
                          <div className="flex items-center gap-2">
                            <span className="group-hover:text-[#00DDF2] transition-colors font-semibold">
                              {m.nome}
                            </span>
                            <span className="text-[10px] font-mono-numbers px-1.5 py-0.5 rounded bg-[#050B1E] border border-[#16264C] text-slate-400">
                              {m.uf}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {m.atualizadoEm}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono-numbers font-bold text-center text-white">
                          <span className="px-2 py-0.5 rounded bg-[#050B1E] border border-[#16264C]">
                            {m.score.total}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono-numbers text-center">
                          {delta > 0 ? (
                            <span className="text-emerald-400 font-semibold inline-flex items-center gap-0.5 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              <TrendingUp className="w-3 h-3" /> +{delta}
                            </span>
                          ) : delta < 0 ? (
                            <span className="text-rose-400 font-semibold inline-flex items-center gap-0.5 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                              <TrendingDown className="w-3 h-3" /> {delta}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono text-[11px]">0 pts</span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono-numbers">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                              m.janela === '0–90 dias'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : m.janela === '91–180 dias'
                                ? 'bg-[#00DDF2]/10 text-[#00DDF2] border-[#00DDF2]/30'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {m.janela}
                          </span>
                        </td>
                        <td className="py-3 px-3 max-w-[200px]">
                          <span className="text-[11px] text-slate-200 line-clamp-2">
                            {m.principalSinal || 'Sinal mapeado em fontes públicas'}
                          </span>
                        </td>
                        <td className="py-3 px-3 max-w-[240px]">
                          <span className="text-[11px] text-emerald-300 font-medium line-clamp-2">
                            {m.leituraHarpia.proximaAcao}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleMonitoring(m.id);
                            }}
                            className="text-[11px] font-medium text-slate-400 hover:text-rose-400 transition-colors px-2 py-1 rounded bg-[#050B1E] border border-[#16264C]"
                            title="Remover do Radar de Acompanhamento"
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

        {/* Timeline & Sinais B2G do Radar (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-4">
          <div className="flex items-center justify-between border-b border-[#16264C]/70 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Feed de Sinais do Radar
              </h2>
            </div>
            <span className="text-[10px] text-[#00DDF2] font-mono px-2 py-0.5 rounded bg-[#050B1E] border border-[#16264C] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Eventos Simulados
            </span>
          </div>

          {/* Quick Filter for Signals */}
          <div className="flex flex-wrap gap-1.5 text-[10px]">
            <button
              onClick={() => setSignalTypeFilter('TODOS')}
              className={`px-2 py-0.5 rounded transition-colors ${
                signalTypeFilter === 'TODOS'
                  ? 'bg-[#00DDF2] text-[#050B1E] font-bold'
                  : 'bg-[#050B1E] text-slate-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSignalTypeFilter('OPORTUNIDADE')}
              className={`px-2 py-0.5 rounded transition-colors ${
                signalTypeFilter === 'OPORTUNIDADE'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-[#050B1E] text-slate-400 hover:text-white'
              }`}
            >
              Oportunidades
            </button>
            <button
              onClick={() => setSignalTypeFilter('SCORE')}
              className={`px-2 py-0.5 rounded transition-colors ${
                signalTypeFilter === 'SCORE'
                  ? 'bg-indigo-500 text-white font-bold'
                  : 'bg-[#050B1E] text-slate-400 hover:text-white'
              }`}
            >
              Score
            </button>
            <button
              onClick={() => setSignalTypeFilter('PUBLICACAO')}
              className={`px-2 py-0.5 rounded transition-colors ${
                signalTypeFilter === 'PUBLICACAO'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-[#050B1E] text-slate-400 hover:text-white'
              }`}
            >
              Publicações
            </button>
          </div>

          <div className="relative pl-6 space-y-4 max-h-[580px] overflow-y-auto pr-1 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#16264C]">
            {displaySignals.map((sig) => {
              const targetMun = municipalities.find((m) => m.id === sig.municipioId);

              return (
                <div
                  key={sig.id}
                  onClick={() => {
                    if (targetMun) onSelectMunicipality(targetMun);
                  }}
                  className="relative group cursor-pointer"
                >
                  {/* Dot Icon */}
                  <div className="absolute -left-[27px] top-0.5 w-5 h-5 rounded-full bg-[#050B1E] border border-[#16264C] group-hover:border-[#00DDF2] flex items-center justify-center transition-colors">
                    {sig.tipo === 'OPORTUNIDADE' ? (
                      <Zap className="w-3 h-3 text-emerald-400" />
                    ) : sig.tipo === 'MUDANCA_PRIORIDADE' ? (
                      <TrendingUp className="w-3 h-3 text-indigo-400" />
                    ) : sig.tipo === 'NOVA_PUBLICACAO' ? (
                      <FileText className="w-3 h-3 text-[#00DDF2]" />
                    ) : (
                      <Clock className="w-3 h-3 text-amber-400" />
                    )}
                  </div>

                  <div className="space-y-1 bg-[#050B1E] p-2.5 rounded-lg border border-[#16264C]/70 group-hover:border-[#00DDF2]/50 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono-numbers text-slate-400">
                        {sig.data}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0A1329] border border-[#16264C] text-[#00DDF2] font-semibold flex items-center gap-1">
                        <span>{sig.municipioNome}</span>
                        <span className="text-slate-400">/ {sig.uf}</span>
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-white leading-tight group-hover:text-[#00DDF2] transition-colors">
                      {sig.titulo}
                    </h4>

                    <p className="text-[11px] text-slate-300 leading-normal">
                      {sig.descricao}
                    </p>

                    {sig.acaoRecomendada && (
                      <div className="pt-1.5 border-t border-[#16264C]/50 text-[10.5px] text-emerald-400 font-medium">
                        → {sig.acaoRecomendada}
                      </div>
                    )}
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
