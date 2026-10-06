import React, { useState } from 'react';
import {
  Building2,
  Zap,
  Target,
  BookmarkCheck,
  Award,
  Database,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  Users2,
  Activity,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ArrowRight,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { Municipality, HarpiaSignal } from '../types';
import { ContextualHelp } from '../components/ContextualHelp';
import { HARPIA_SIGNALS } from '../data/harpiaSignals';

interface OverviewDashboardProps {
  municipalities: Municipality[];
  onSelectMunicipality: (municipality: Municipality) => void;
  onNavigateToRadar: () => void;
  onNavigateToMap: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  municipalities,
  onSelectMunicipality,
  onNavigateToRadar,
  onNavigateToMap,
}) => {
  const [signalFilter, setSignalFilter] = useState<string>('TODOS');

  // Statistics calculations
  const totalMonitoredDemo = municipalities.length;
  const immediateOpps = municipalities.filter((m) => m.janela === '0–90 dias').length;
  const strategicOpps = municipalities.filter((m) => m.janela === '181–365 dias').length;
  const inWatchlist = municipalities.filter((m) => m.isMonitored).length;
  const avgScore = (
    municipalities.reduce((acc, m) => acc + m.score.total, 0) / municipalities.length
  ).toFixed(1);

  // Commercial decision counts
  const highPriority = municipalities.filter((m) => m.prioridade === 'Alta prioridade').length;
  const mediumPriority = municipalities.filter((m) => m.prioridade === 'Média prioridade').length;
  const monitorPriority = municipalities.filter((m) => m.prioridade === 'Monitoramento').length;

  // Windows counts
  const win090 = municipalities.filter((m) => m.janela === '0–90 dias').length;
  const win91180 = municipalities.filter((m) => m.janela === '91–180 dias').length;
  const win181365 = municipalities.filter((m) => m.janela === '181–365 dias').length;
  const winNone = municipalities.filter((m) => m.janela === 'Sem sinal').length;

  // Main 7 simulated signals
  const primarySignals = HARPIA_SIGNALS.filter((s) => !s.id.startsWith('sig-hist'));

  const filteredSignals = primarySignals.filter((signal) => {
    if (signalFilter === 'TODOS') return true;
    if (signalFilter === 'OPORTUNIDADE') return signal.tipo === 'OPORTUNIDADE';
    if (signalFilter === 'MUDANCA_PRIORIDADE') return signal.tipo === 'MUDANCA_PRIORIDADE';
    if (signalFilter === 'NOVA_PUBLICACAO') return signal.tipo === 'NOVA_PUBLICACAO';
    if (signalFilter === 'ATENCAO') return signal.tipo === 'ATENCAO';
    return true;
  });

  // Recommended Priorities - prioritized for commercial action
  const recommendedPriorities = [...municipalities].sort((a, b) => {
    // 0-90 dias first, then score total descending
    if (a.janela === '0–90 dias' && b.janela !== '0–90 dias') return -1;
    if (b.janela === '0–90 dias' && a.janela !== '0–90 dias') return 1;
    return b.score.total - a.score.total;
  });

  const handleOpenSignalMunicipality = (municipioId: string) => {
    const found = municipalities.find((m) => m.id === municipioId);
    if (found) {
      onSelectMunicipality(found);
    }
  };

  return (
    <div className="space-y-8">
      {/* ===================================================
          1. SUA PRIORIDADE COMERCIAL HOJE (NOVA SEÇÃO DE TOPO)
         =================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                Sua Prioridade Comercial Hoje
              </h1>
              <ContextualHelp
                topic="Prioridade Comercial B2G"
                explanation="Direcionamento para equipe de vendas: onde atuar agora (0–90 dias), quem nutrir institucionalmente e quais sinais públicos acabam de ser identificados."
              />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Onde agir agora, por que abordar, qual a janela e qual o próximo passo de prospecção técnica.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="px-3 py-1 rounded-lg bg-[#0A1329] border border-[#16264C] text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#00DDF2]" />
              Atualização em tempo real (PNCP · Siconfi · DOMs)
            </span>
          </div>
        </div>

        {/* 4 Cards Principais de Prioridade Comercial */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: ABORDAGEM IMEDIATA */}
          <div
            onClick={onNavigateToRadar}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0A1329] to-[#060D20] border border-emerald-500/40 hover:border-emerald-400 transition-all cursor-pointer group shadow-[0_0_20px_rgba(16,185,129,0.08)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  Abordagem Imediata
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  0–90 dias
                </span>
              </div>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono-numbers">
                  12
                </span>
                <span className="text-xs text-emerald-400 font-semibold font-mono-numbers">
                  ({immediateOpps} na amostra prioritária)
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#16264C]/70 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate">Contratos a vencer e PCA no PNCP</span>
              <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </div>

          {/* Card 2: RELACIONAMENTO */}
          <div
            onClick={onNavigateToRadar}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0A1329] to-[#060D20] border border-[#00DDF2]/30 hover:border-[#00DDF2] transition-all cursor-pointer group shadow-[0_0_20px_rgba(0,221,242,0.06)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-bold text-[#00DDF2] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Users2 className="w-4 h-4 text-[#00DDF2]" />
                  Relacionamento
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00DDF2]/10 text-[#00DDF2] border border-[#00DDF2]/20">
                  91–180 dias
                </span>
              </div>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono-numbers">
                  31
                </span>
                <span className="text-xs text-[#00DDF2] font-semibold font-mono-numbers">
                  ({win91180} em nutrição ativa)
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#16264C]/70 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate">Orçamento LOA em consolidação</span>
              <ChevronRight className="w-4 h-4 text-[#00DDF2] group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </div>

          {/* Card 3: MONITORAMENTO */}
          <div
            onClick={onNavigateToRadar}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0A1329] to-[#060D20] border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer group shadow-[0_0_20px_rgba(245,158,11,0.06)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <BookmarkCheck className="w-4 h-4 text-amber-400" />
                  Monitoramento
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Watchlist
                </span>
              </div>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono-numbers">
                  48
                </span>
                <span className="text-xs text-amber-400 font-semibold font-mono-numbers">
                  ({inWatchlist} na sua watchlist)
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#16264C]/70 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate">Rastreio de aditivos e editais</span>
              <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </div>

          {/* Card 4: NOVOS SINAIS */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0A1329] to-[#060D20] border border-indigo-500/40 hover:border-indigo-400 transition-all shadow-[0_0_20px_rgba(99,102,241,0.08)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-bold text-indigo-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  Novos Sinais
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Últimas 48h
                </span>
              </div>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono-numbers">
                  7
                </span>
                <span className="text-xs text-indigo-300 font-semibold">
                  eventos públicos detectados
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#16264C]/70 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate">Movimentações de score e ETP</span>
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          2. PRIORIDADES RECOMENDADAS (TABELA COMERCIAL B2G)
         =================================================== */}
      <section className="p-5 sm:p-6 rounded-2xl bg-[#0A1329] border border-[#16264C] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide uppercase">
                Prioridades Recomendadas
              </h2>
              <ContextualHelp
                topic="Prioridades Recomendadas"
                explanation="Ranking comercial baseado na combinação do Score Harpia, janela de contratação e proximidade de encerramento de contratos de tecnologia educacional."
              />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Onde agir, por que este município é uma oportunidade e qual a próxima ação recomendada.
            </p>
          </div>

          <button
            onClick={onNavigateToRadar}
            className="px-4 py-2 rounded-xl bg-[#00DDF2] hover:bg-[#00c5d8] text-[#050B1E] text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,221,242,0.25)] self-start sm:self-center"
          >
            VER TODAS AS OPORTUNIDADES
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tabela de Decisão Comercial */}
        <div className="overflow-x-auto rounded-xl border border-[#16264C]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#16264C] bg-[#070F26] text-slate-400">
                <th className="py-3.5 px-4 font-bold text-slate-200">Município</th>
                <th className="py-3.5 px-3 font-bold text-center text-slate-200">Score</th>
                <th className="py-3.5 px-3 font-bold text-slate-200">Janela</th>
                <th className="py-3.5 px-4 font-bold text-slate-200">Principal Sinal</th>
                <th className="py-3.5 px-4 font-bold text-slate-200">Próxima Ação</th>
                <th className="py-3.5 px-3 font-bold text-center text-slate-200">Confiança</th>
                <th className="py-3.5 px-3 font-bold text-right text-slate-200">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#16264C]/70 text-slate-300">
              {recommendedPriorities.slice(0, 6).map((item) => {
                const principalSinal =
                  item.principalSinal ||
                  (item.compras.sinaisContribuiram && item.compras.sinaisContribuiram[0]) ||
                  'Contrato semelhante próximo do encerramento';

                const proximaAcao =
                  item.leituraHarpia.proximaAcao ||
                  'Validar orçamento e iniciar abordagem técnica';

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectMunicipality(item)}
                    className="hover:bg-[#0F1C3C]/80 transition-colors cursor-pointer group"
                  >
                    {/* Município */}
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00DDF2] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="group-hover:text-[#00DDF2] transition-colors">
                          {item.nome}
                        </span>
                        <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#16264C] text-slate-300 rounded border border-[#1F3870]">
                          {item.uf}
                        </span>
                      </div>
                    </td>

                    {/* Score */}
                    <td className="py-3.5 px-3 font-mono-numbers font-extrabold text-center text-white">
                      <span className="px-2.5 py-1 rounded-lg bg-[#050B1E] border border-[#16264C] group-hover:border-[#00DDF2]/50 transition-colors">
                        {item.score.total}
                      </span>
                    </td>

                    {/* Janela */}
                    <td className="py-3.5 px-3 font-medium whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-mono-numbers font-semibold ${
                          item.janela === '0–90 dias'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : item.janela === '91–180 dias'
                            ? 'bg-[#00DDF2]/15 text-[#00DDF2] border border-[#00DDF2]/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.janela}
                      </span>
                    </td>

                    {/* Principal Sinal */}
                    <td className="py-3.5 px-4 text-slate-200 font-medium">
                      <div className="flex items-center gap-1.5 max-w-xs sm:max-w-sm truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span className="truncate" title={principalSinal}>
                          {principalSinal}
                        </span>
                      </div>
                    </td>

                    {/* Próxima Ação */}
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="max-w-xs sm:max-w-sm truncate" title={proximaAcao}>
                        <span className="text-white font-medium">{proximaAcao}</span>
                      </div>
                    </td>

                    {/* Confiança */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          item.confianca === 'Alta'
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : 'text-amber-400 bg-amber-500/10'
                        }`}
                      >
                        {item.confianca}
                      </span>
                    </td>

                    {/* Ação */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <span className="text-[11px] text-[#00DDF2] font-bold group-hover:underline flex items-center justify-end gap-1">
                        Ver Ficha <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===================================================
          3. SINAIS HARPIA (FEED DE SINAIS SIMULADOS RECENTES)
         =================================================== */}
      <section className="p-5 sm:p-6 rounded-2xl bg-[#0A1329] border border-[#16264C] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00DDF2]" />
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide uppercase">
                Sinais Harpia
              </h2>
              <ContextualHelp
                topic="Sinais Harpia"
                explanation="Monitoramento contínuo de eventos: expirações contratuais, movimentações de score, novas publicações no Diário Oficial e planejamento de contratações (PCA/ETP)."
              />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Eventos públicos transformados em gatilhos comerciais para antecipação de oportunidades.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'TODOS', label: 'Todos os Sinais' },
              { id: 'OPORTUNIDADE', label: 'Oportunidades' },
              { id: 'MUDANCA_PRIORIDADE', label: 'Mudança de Score' },
              { id: 'NOVA_PUBLICACAO', label: 'Publicações' },
              { id: 'ATENCAO', label: 'Atenção' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSignalFilter(f.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  signalFilter === f.id
                    ? 'bg-[#00DDF2] text-[#050B1E] font-bold'
                    : 'bg-[#050B1E] border border-[#16264C] text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Signals Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredSignals.map((signal) => (
            <div
              key={signal.id}
              onClick={() => handleOpenSignalMunicipality(signal.municipioId)}
              className="p-4 rounded-xl bg-[#070F26] border border-[#16264C] hover:border-[#00DDF2]/50 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        signal.tipo === 'OPORTUNIDADE'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : signal.tipo === 'MUDANCA_PRIORIDADE'
                          ? 'bg-[#00DDF2]/15 text-[#00DDF2] border border-[#00DDF2]/30'
                          : signal.tipo === 'NOVA_PUBLICACAO'
                          ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                          : signal.tipo === 'ATENCAO'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {signal.tipo.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400">{signal.data}</span>
                  </div>

                  <span className="text-[10px] font-bold text-slate-300">
                    Impacto {signal.impacto}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-white group-hover:text-[#00DDF2] transition-colors">
                    {signal.municipioNome}
                  </span>
                  {signal.uf && (
                    <span className="px-1.5 py-0.2 text-[10px] font-mono bg-[#16264C] text-slate-300 rounded font-bold">
                      {signal.uf}
                    </span>
                  )}
                  {signal.scoreAntes && signal.scoreDepois && (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold ml-auto">
                      Score: {signal.scoreAntes} → {signal.scoreDepois}
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-slate-200 leading-snug mb-1">
                  {signal.titulo}
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {signal.descricao}
                </p>
              </div>

              <div className="pt-2 border-t border-[#16264C]/70 space-y-1.5">
                <div className="text-[10.5px] text-slate-300 bg-[#050B1E] p-2 rounded-lg border border-[#16264C]">
                  <strong className="text-[#00DDF2]">Ação Recomendada:</strong>{' '}
                  {signal.acaoRecomendada}
                </div>
                <div className="flex items-center justify-end text-[10.5px] text-[#00DDF2] font-semibold">
                  <span>Abrir Município</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================
          4. RADAR NACIONAL & GRÁFICOS (PRESERVADOS)
         =================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Radar Nacional de Oportunidades (Mapa estilizado do Brasil) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#0A1329] border border-[#16264C] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Radar Nacional de Oportunidades
              </h2>
              <p className="text-xs text-slate-400">
                Densidade de contratação educacional por macrorregião brasileira
              </p>
            </div>
            <button
              onClick={onNavigateToMap}
              className="text-xs text-[#00DDF2] hover:underline flex items-center gap-1 font-semibold"
            >
              Abrir Mapa Completo <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Regional heat blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 my-4">
            {[
              { reg: 'Norte', score: 78, ufs: 'PA, AM', status: 'Alta Demanda', color: 'border-[#00DDF2]/50 bg-[#00DDF2]/10 text-[#00DDF2]' },
              { reg: 'Nordeste', score: 82, ufs: 'BA, CE, PE', status: 'Janela Curta', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' },
              { reg: 'Centro-Oeste', score: 70, ufs: 'GO, MT', status: 'Estratégico', color: 'border-[#16264C] bg-[#050B1E] text-slate-300' },
              { reg: 'Sudeste', score: 76, ufs: 'SP, MG', status: 'Alto Porte', color: 'border-[#00DDF2]/40 bg-[#00DDF2]/5 text-[#00DDF2]' },
              { reg: 'Sul', score: 84, ufs: 'PR, RS, SC', status: 'Alta Solidez', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' },
            ].map((r) => (
              <div
                key={r.reg}
                onClick={onNavigateToMap}
                className={`p-3 rounded-xl border ${r.color} cursor-pointer hover:border-[#00DDF2] transition-all flex flex-col justify-between`}
              >
                <div>
                  <span className="text-[11px] font-bold block text-white">{r.reg}</span>
                  <span className="text-[10px] text-slate-400">{r.ufs}</span>
                </div>
                <div className="mt-3">
                  <span className="text-xl font-bold font-mono-numbers block">{r.score}</span>
                  <span className="text-[10px] opacity-90 font-medium">{r.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-[#050B1E] border border-[#16264C] flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Sinal simulado: Expirações contratuais concentradas no 4º trimestre e início do ano letivo.
            </span>
            <span className="font-mono-numbers text-slate-300">Padrão de referência: Siconfi / PNCP</span>
          </div>
        </div>

        {/* 2 Gráficos: Distribuição e Janela */}
        <div className="space-y-4">
          {/* Gráfico 1: Distribuição das oportunidades */}
          <div className="p-5 rounded-xl bg-[#0A1329] border border-[#16264C]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Distribuição das Oportunidades
            </h3>
            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">Alta prioridade</span>
                  <span className="font-mono-numbers font-semibold text-emerald-400">{highPriority}</span>
                </div>
                <div className="w-full bg-[#16264C] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full"
                    style={{ width: `${(highPriority / totalMonitoredDemo) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">Média prioridade</span>
                  <span className="font-mono-numbers font-semibold text-[#00DDF2]">{mediumPriority}</span>
                </div>
                <div className="w-full bg-[#16264C] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#00DDF2] h-full rounded-full"
                    style={{ width: `${(mediumPriority / totalMonitoredDemo) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">Monitoramento</span>
                  <span className="font-mono-numbers font-semibold text-amber-400">{monitorPriority}</span>
                </div>
                <div className="w-full bg-[#16264C] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${(monitorPriority / totalMonitoredDemo) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico 2: Janela de contratação */}
          <div className="p-5 rounded-xl bg-[#0A1329] border border-[#16264C]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Janela de Contratação
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-lg bg-[#050B1E] border border-[#16264C]">
                <span className="text-[10px] text-slate-400 block truncate">0–90 dias</span>
                <span className="text-lg font-bold text-emerald-400 font-mono-numbers">{win090}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#050B1E] border border-[#16264C]">
                <span className="text-[10px] text-slate-400 block truncate">91–180 d</span>
                <span className="text-lg font-bold text-[#00DDF2] font-mono-numbers">{win91180}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#050B1E] border border-[#16264C]">
                <span className="text-[10px] text-slate-400 block truncate">181–365 d</span>
                <span className="text-lg font-bold text-slate-300 font-mono-numbers">{win181365}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#050B1E] border border-[#16264C]">
                <span className="text-[10px] text-slate-400 block truncate">Sem sinal</span>
                <span className="text-lg font-bold text-slate-400 font-mono-numbers">{winNone}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          5. INDICADORES ESTATÍSTICOS DA PLATAFORMA (PRESERVADOS COM IDs)
         =================================================== */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Métricas de Base & Cobertura da Plataforma
        </h3>
        <div id="dashboard-overview-cards" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1: Municípios monitorados */}
          <div className="p-4 rounded-xl bg-[#0A1329] border border-[#16264C] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="truncate">Municípios monitorados</span>
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
            <div className="my-2">
              <span className="text-2xl font-extrabold text-white font-mono-numbers">
                5.572
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <span className="text-[#00DDF2] font-semibold">{totalMonitoredDemo}</span> em análise ativa
            </div>
          </div>

          {/* Card 2: Oportunidades imediatas */}
          <div className="p-4 rounded-xl bg-[#0A1329] border border-[#16264C] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center">
                <span className="truncate">Janela 0–90d</span>
                <ContextualHelp
                  topic="Janela Imediata (0-90 dias)"
                  explanation="Contratos vigentes prestes a encerrar ou itens já previstos no Plano de Contratações Anual (PCA) que exigem abordagem comercial prioritária."
                />
              </div>
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>
            <div className="my-2">
              <span className="text-2xl font-extrabold text-emerald-400 font-mono-numbers">
                {immediateOpps}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% este mês</span>
            </div>
          </div>

          {/* Card 3: Oportunidades estratégicas */}
          <div className="p-4 rounded-xl bg-[#0A1329] border border-[#16264C] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="truncate">Ciclo estratégico</span>
              <Target className="w-4 h-4 text-[#00DDF2] shrink-0" />
            </div>
            <div className="my-2">
              <span className="text-2xl font-extrabold text-[#00DDF2] font-mono-numbers">
                {strategicOpps}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <span>Ciclo 6–12 meses</span>
            </div>
          </div>

          {/* Card 4: Em monitoramento */}
          <div className="p-4 rounded-xl bg-[#0A1329] border border-[#16264C] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center">
                <span className="truncate">Em monitoramento</span>
                <ContextualHelp
                  topic="Monitoramento"
                  explanation="Sua lista de acompanhamento (watchlist) de prefeituras prioritárias para rastrear movimentações e sinais públicos."
                />
              </div>
              <BookmarkCheck className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
            <div className="my-2">
              <span className="text-2xl font-extrabold text-white font-mono-numbers">
                {inWatchlist}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#00DDF2]">
              <span>Watchlist ativa</span>
            </div>
          </div>

          {/* Card 5: Score médio */}
          <div id="dashboard-score-card" className="p-4 rounded-xl bg-[#0A1329] border border-[#00DDF2]/30 flex flex-col justify-between shadow-[0_0_15px_rgba(0,221,242,0.06)]">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center">
                <span className="truncate">Score médio</span>
                <ContextualHelp
                  topic="Score Harpia"
                  explanation="O Score Harpia varia de 0 a 100 e combina capacidade fiscal (30 pts), necessidade educacional (25 pts), oportunidade de contratação (25 pts), acesso institucional (10 pts) e governança (10 pts)."
                />
              </div>
              <Award className="w-4 h-4 text-[#00DDF2] shrink-0" />
            </div>
            <div className="my-2 flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-white font-mono-numbers">
                {avgScore}
              </span>
              <span className="text-xs text-slate-400 font-mono-numbers">/100</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+3.2 pts vs anterior</span>
            </div>
          </div>

          {/* Card 6: Fontes de referência */}
          <div className="p-4 rounded-xl bg-[#0A1329] border border-[#16264C] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="truncate">Fontes de referência</span>
              <Database className="w-4 h-4 text-[#00DDF2] shrink-0" />
            </div>
            <div className="my-2">
              <span className="text-2xl font-extrabold text-white font-mono-numbers">
                8
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#00DDF2]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00DDF2]" />
              <span>Bases modeladas</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
