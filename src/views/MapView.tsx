import React, { useState, useMemo } from 'react';
import {
  MapPin,
  ChevronRight,
  TrendingUp,
  Zap,
  Target,
  Clock,
  Layers,
  Award,
  Info,
} from 'lucide-react';
import { Municipality, Region } from '../types';
import { BrazilVectorMap } from '../components/BrazilVectorMap';
import { BRAZIL_STATES_VECTOR } from '../data/brazilMapData';

interface MapViewProps {
  municipalities: Municipality[];
  onSelectMunicipality: (municipality: Municipality) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  municipalities,
  onSelectMunicipality,
}) => {
  const [selectedUf, setSelectedUf] = useState<string>('PA');
  const [selectedRegion, setSelectedRegion] = useState<Region | 'TODAS'>('TODAS');

  // Filter municipalities for the active state
  const stateMunicipalities = useMemo(() => {
    return municipalities.filter((m) => m.uf === selectedUf);
  }, [municipalities, selectedUf]);

  // Selected state info from vector list
  const currentStateVector = useMemo(() => {
    return BRAZIL_STATES_VECTOR.find((s) => s.uf === selectedUf) || BRAZIL_STATES_VECTOR[0];
  }, [selectedUf]);

  // Regional summary data
  const regionalSummary = useMemo(() => {
    const list = stateMunicipalities;
    const count = list.length;
    const avg =
      count > 0
        ? (list.reduce((acc, m) => acc + m.score.total, 0) / count).toFixed(1)
        : '—';
    const immediate = list.filter((m) => m.janela === '0–90 dias').length;
    const next = list.filter((m) => m.janela === '91–180 dias').length;
    const strategic = list.filter((m) => m.janela === '181–365 dias').length;

    return { count, avg, immediate, next, strategic };
  }, [stateMunicipalities]);

  const handleSelectUf = (uf: string) => {
    setSelectedUf(uf);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Mapa de Oportunidades
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Navegue pelo mapa vetorial do Brasil para identificar a distribuição geográfica e a intensidade de oportunidades educacionais simuladas por UF.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A1329] border border-amber-500/30 text-[11px] text-amber-300 font-mono self-start sm:self-center">
          <span>AMBIENTE DEMONSTRATIVO • DADOS SIMULADOS</span>
        </div>
      </div>

      {/* Main Grid: Interactive Vector Map + Lateral Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Real Vector Map & Region Filter (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Region Tabs */}
          <div className="p-3 rounded-xl bg-[#0A1329] border border-[#16264C] flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs font-semibold text-slate-400 px-2">Região:</span>
            {(['TODAS', 'Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'] as const).map((reg) => (
              <button
                key={reg}
                onClick={() => {
                  setSelectedRegion(reg);
                  if (reg !== 'TODAS') {
                    const firstInReg = BRAZIL_STATES_VECTOR.find((s) => s.region === reg);
                    if (firstInReg) setSelectedUf(firstInReg.uf);
                  }
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedRegion === reg
                    ? 'bg-[#00DDF2] text-[#050B1E] font-bold shadow-[0_0_12px_rgba(0,221,242,0.2)]'
                    : 'text-slate-300 hover:bg-[#0F1C3C]'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Real Vector Brazil Map Canvas */}
          <div id="map-vector-container" className="p-5 rounded-2xl bg-[#0A1329] border border-[#16264C] relative flex flex-col justify-between overflow-hidden shadow-xl">
            {/* Header info */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-[#16264C]/60 mb-2">
              <span className="flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00DDF2] animate-pulse" />
                Mapa Vetorial do Brasil · Clique em uma UF para filtrar
              </span>
              <span className="font-mono text-slate-400">26 Estados + DF</span>
            </div>

            {/* Interactive Vector Map Component */}
            <BrazilVectorMap
              selectedUf={selectedUf}
              onSelectUf={handleSelectUf}
              selectedRegion={selectedRegion}
              municipalities={municipalities}
            />

            {/* Map Legend */}
            <div className="pt-3 border-t border-[#16264C]/70 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <span className="w-3 h-3 rounded bg-[#00DDF2] shadow-[0_0_6px_rgba(0,221,242,0.6)]" />
                  Estado Selecionado
                </span>
                <span className="flex items-center gap-1.5 text-[11px]">
                  <span className="w-3 h-3 rounded bg-[rgba(0,221,242,0.42)] border border-[rgba(0,221,242,0.75)]" />
                  Alta Intensidade
                </span>
                <span className="flex items-center gap-1.5 text-[11px]">
                  <span className="w-3 h-3 rounded bg-[rgba(0,221,242,0.18)] border border-[rgba(0,221,242,0.45)]" />
                  Média Intensidade
                </span>
                <span className="flex items-center gap-1.5 text-[11px]">
                  <span className="w-3 h-3 rounded bg-[#0A1428] border border-[#16264C]" />
                  Sem dados simulados
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">
                Geografia Oficial IBGE
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Selected State Analysis & Top Regional Opportunities (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Summary Box for Selected UF */}
          <div className="p-5 rounded-2xl bg-[#0A1329] border border-[#16264C] space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#16264C] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#00DDF2] tracking-wider uppercase block">
                  Estado Selecionado
                </span>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{currentStateVector.name}</span>
                  <span className="px-2 py-0.5 text-xs font-mono-numbers bg-[#16264C] text-[#00DDF2] rounded border border-[#00DDF2]/30">
                    {currentStateVector.uf}
                  </span>
                </h2>
                <span className="text-xs text-slate-400">Região {currentStateVector.region}</span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Score Médio</span>
                <span className="text-xl font-bold font-mono-numbers text-white">
                  {regionalSummary.avg}
                  {regionalSummary.count > 0 && (
                    <span className="text-xs text-slate-400 font-normal">/100</span>
                  )}
                </span>
              </div>
            </div>

            {/* 4 Metric counters */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-lg bg-[#050B1E] border border-[#16264C]">
                <span className="text-slate-400 block text-[11px]">Municípios no MVP</span>
                <span className="text-base font-bold text-white font-mono-numbers">
                  {regionalSummary.count}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#050B1E] border border-[#16264C]">
                <span className="text-slate-400 block text-[11px]">Oportunidades Imediatas</span>
                <span className="text-base font-bold text-emerald-400 font-mono-numbers">
                  {regionalSummary.immediate}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#050B1E] border border-[#16264C]">
                <span className="text-slate-400 block text-[11px]">Oportunidades Próximas</span>
                <span className="text-base font-bold text-[#00DDF2] font-mono-numbers">
                  {regionalSummary.next}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#050B1E] border border-[#16264C]">
                <span className="text-slate-400 block text-[11px]">Estratégicas</span>
                <span className="text-base font-bold text-indigo-400 font-mono-numbers">
                  {regionalSummary.strategic}
                </span>
              </div>
            </div>
          </div>

          {/* Top Oportunidades da Região */}
          <div className="p-5 rounded-2xl bg-[#0A1329] border border-[#16264C] space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Top Oportunidades em {currentStateVector.name}
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {stateMunicipalities.length} cadastrado{stateMunicipalities.length > 1 ? 's' : ''}
              </span>
            </div>

            {stateMunicipalities.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400 border border-dashed border-[#16264C] rounded-xl p-4">
                <Info className="w-5 h-5 text-slate-400 mx-auto mb-1.5 opacity-60" />
                <p className="font-medium text-slate-300">
                  Nenhum município demonstrativo alocado para {currentStateVector.name} ({currentStateVector.uf}) nesta amostra.
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Selecione outro estado no mapa (ex: PA, SP, MG, PR, BA, CE, GO, PE, RS, AM) para analisar municípios simulados.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {stateMunicipalities.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectMunicipality(item)}
                    className="p-3.5 rounded-xl bg-[#050B1E] border border-[#16264C] hover:border-[#00DDF2]/50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#00DDF2]" />
                        <h4 className="text-xs font-bold text-white group-hover:text-[#00DDF2] transition-colors">
                          {item.nome}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono-numbers font-bold text-white">
                          Score {item.score.total}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {item.leituraHarpia.resumo}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-[#16264C]/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">
                        Janela: <strong className="text-slate-200">{item.janela}</strong>
                      </span>
                      <span
                        className={`font-semibold ${
                          item.status === 'Imediata' ? 'text-emerald-400' : 'text-[#00DDF2]'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
