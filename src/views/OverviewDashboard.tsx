import React from 'react';
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
} from 'lucide-react';
import { Municipality } from '../types';
import { ContextualHelp } from '../components/ContextualHelp';

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
  // Statistics calculations
  const totalMonitoredDemo = municipalities.length;
  const immediateOpps = municipalities.filter((m) => m.janela === '0–90 dias').length;
  const strategicOpps = municipalities.filter((m) => m.janela === '181–365 dias').length;
  const inWatchlist = municipalities.filter((m) => m.isMonitored).length;
  const avgScore = (
    municipalities.reduce((acc, m) => acc + m.score.total, 0) / municipalities.length
  ).toFixed(1);

  // Distribution counts
  const highPriority = municipalities.filter((m) => m.prioridade === 'Alta prioridade').length;
  const mediumPriority = municipalities.filter((m) => m.prioridade === 'Média prioridade').length;
  const monitorPriority = municipalities.filter((m) => m.prioridade === 'Monitoramento').length;

  // Windows counts
  const win090 = municipalities.filter((m) => m.janela === '0–90 dias').length;
  const win91180 = municipalities.filter((m) => m.janela === '91–180 dias').length;
  const win181365 = municipalities.filter((m) => m.janela === '181–365 dias').length;
  const winNone = municipalities.filter((m) => m.janela === 'Sem sinal').length;

  return (
    <div className="space-y-6">
      {/* ===================================================
          1. CARDS SUPERIORES
         =================================================== */}
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
              <span className="truncate">Oportunidades imediatas</span>
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
            <span className="truncate">Oportunidades estratégicas</span>
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

      {/* ===================================================
          2. RADAR NACIONAL & GRÁFICOS
         =================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                <span className="text-[10px] text-slate-400 block truncate">91–180 dias</span>
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
      </div>

      {/* ===================================================
          3. SEÇÃO: PRINCIPAIS OPORTUNIDADES
         =================================================== */}
      <div className="p-5 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Principais Oportunidades
            </h2>
            <p className="text-xs text-slate-400">
              Ranking estruturado pelo Score Harpia ponderando capacidade fiscal, demanda pedagógica e janela
            </p>
          </div>
          <button
            onClick={onNavigateToRadar}
            className="text-xs text-[#00DDF2] hover:underline flex items-center gap-1 font-semibold"
          >
            Ver todas no Radar <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Opportunities Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#16264C] text-slate-400">
                <th className="py-3 px-3 font-semibold">Município</th>
                <th className="py-3 px-3 font-semibold">UF</th>
                <th className="py-3 px-3 font-semibold text-center">Score Harpia</th>
                <th className="py-3 px-3 font-semibold text-center">Capacidade</th>
                <th className="py-3 px-3 font-semibold text-center">Necessidade</th>
                <th className="py-3 px-3 font-semibold text-center">Contratação</th>
                <th className="py-3 px-3 font-semibold">Janela</th>
                <th className="py-3 px-3 font-semibold text-center">Confiança</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#16264C]/60 text-slate-300">
              {municipalities.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onSelectMunicipality(item)}
                  className="hover:bg-[#0F1C3C]/60 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3 font-medium text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00DDF2] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:text-[#00DDF2] transition-colors">{item.nome}</span>
                  </td>
                  <td className="py-3 px-3 font-mono-numbers text-slate-400">{item.uf}</td>
                  <td className="py-3 px-3 font-mono-numbers font-bold text-center text-white">
                    <span className="px-2 py-0.5 rounded bg-[#050B1E] border border-[#16264C] group-hover:border-[#00DDF2]/40 transition-colors">
                      {item.score.total}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono-numbers text-center text-slate-300">
                    {item.score.fiscal}/30
                  </td>
                  <td className="py-3 px-3 font-mono-numbers text-center text-slate-300">
                    {item.score.educacao}/25
                  </td>
                  <td className="py-3 px-3 font-mono-numbers text-center text-slate-300">
                    {item.score.contratacao}/25
                  </td>
                  <td className="py-3 px-3 font-medium">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono-numbers ${
                        item.janela === '0–90 dias'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : item.janela === '91–180 dias'
                          ? 'bg-[#00DDF2]/10 text-[#00DDF2] border border-[#00DDF2]/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.janela}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`text-[11px] font-medium ${
                        item.confianca === 'Alta' ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      {item.confianca}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        item.status === 'Imediata'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : item.status === 'Próxima'
                          ? 'bg-[#00DDF2]/15 text-[#00DDF2]'
                          : item.status === 'Estratégica'
                          ? 'bg-indigo-500/15 text-indigo-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-[11px] text-[#00DDF2] font-semibold opacity-80 group-hover:opacity-100 flex items-center justify-end gap-1">
                      Ver Ficha <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
