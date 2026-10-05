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
} from 'lucide-react';
import { Municipality, Region } from '../types';

interface MapViewProps {
  municipalities: Municipality[];
  onSelectMunicipality: (municipality: Municipality) => void;
}

interface StateData {
  uf: string;
  name: string;
  region: Region;
  intensity: 'alta' | 'media' | 'moderada';
}

const BRAZIL_STATES: StateData[] = [
  { uf: 'PA', name: 'Pará', region: 'Norte', intensity: 'alta' },
  { uf: 'AM', name: 'Amazonas', region: 'Norte', intensity: 'media' },
  { uf: 'SP', name: 'São Paulo', region: 'Sudeste', intensity: 'alta' },
  { uf: 'MG', name: 'Minas Gerais', region: 'Sudeste', intensity: 'media' },
  { uf: 'PR', name: 'Paraná', region: 'Sul', intensity: 'alta' },
  { uf: 'RS', name: 'Rio Grande do Sul', region: 'Sul', intensity: 'alta' },
  { uf: 'BA', name: 'Bahia', region: 'Nordeste', intensity: 'alta' },
  { uf: 'CE', name: 'Ceará', region: 'Nordeste', intensity: 'alta' },
  { uf: 'PE', name: 'Pernambuco', region: 'Nordeste', intensity: 'moderada' },
  { uf: 'GO', name: 'Goiás', region: 'Centro-Oeste', intensity: 'media' },
  { uf: 'MT', name: 'Mato Grosso', region: 'Centro-Oeste', intensity: 'moderada' },
  { uf: 'SC', name: 'Santa Catarina', region: 'Sul', intensity: 'media' },
];

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

  // Regional summary data
  const regionalSummary = useMemo(() => {
    const list = selectedUf
      ? stateMunicipalities
      : selectedRegion === 'TODAS'
      ? municipalities
      : municipalities.filter((m) => m.regiao === selectedRegion);

    const count = list.length;
    const avg = count > 0 ? (list.reduce((acc, m) => acc + m.score.total, 0) / count).toFixed(1) : '0';
    const immediate = list.filter((m) => m.janela === '0–90 dias').length;
    const next = list.filter((m) => m.janela === '91–180 dias').length;
    const strategic = list.filter((m) => m.janela === '181–365 dias').length;

    return { count, avg, immediate, next, strategic };
  }, [municipalities, stateMunicipalities, selectedUf, selectedRegion]);

  const currentState = BRAZIL_STATES.find((s) => s.uf === selectedUf) || BRAZIL_STATES[0];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Mapa de Oportunidades
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Navegue pelas Unidades Federativas e macrorregiões para explorar a densidade de compras públicas e prioridades educacionais.
        </p>
      </div>

      {/* Main Grid: Interactive Map + Lateral Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Map & State Selector (7 cols) */}
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
                    const firstInReg = BRAZIL_STATES.find((s) => s.region === reg);
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

          {/* Stylized Interactive Map Canvas */}
          <div className="p-6 rounded-xl bg-[#0A1329] border border-[#16264C] relative min-h-[440px] flex flex-col justify-between overflow-hidden">
            {/* Background Map Grid & Coordinates */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 z-10">
              <span className="flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00DDF2]" />
                Camada de Oportunidades B2G Ativa
              </span>
              <span className="font-mono">Lat: -14.235 · Long: -51.925</span>
            </div>

            {/* Stylized State Clusters Display */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 my-6 z-10">
              {BRAZIL_STATES.filter(
                (s) => selectedRegion === 'TODAS' || s.region === selectedRegion
              ).map((state) => {
                const isSelected = selectedUf === state.uf;
                const muniCount = municipalities.filter((m) => m.uf === state.uf).length;

                return (
                  <button
                    key={state.uf}
                    onClick={() => setSelectedUf(state.uf)}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-[#00DDF2]/15 border-[#00DDF2] shadow-[0_0_15px_rgba(0,221,242,0.25)]'
                        : state.intensity === 'alta'
                        ? 'bg-[#0F1C3C]/80 border-[#00DDF2]/30 hover:border-[#00DDF2]/60'
                        : 'bg-[#050B1E] border-[#16264C] hover:border-slate-500'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00DDF2] animate-ping" />
                    )}
                    <span className="text-sm font-bold text-white font-mono-numbers block">
                      {state.uf}
                    </span>
                    <span className="text-xs text-slate-300 truncate block mt-0.5">
                      {state.name}
                    </span>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">{muniCount} município{muniCount > 1 ? 's' : ''}</span>
                      <span
                        className={`font-semibold ${
                          state.intensity === 'alta'
                            ? 'text-emerald-400'
                            : state.intensity === 'media'
                            ? 'text-[#00DDF2]'
                            : 'text-slate-400'
                        }`}
                      >
                        {state.intensity.toUpperCase()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Map Legend */}
            <div className="p-3 rounded-lg bg-[#050B1E] border border-[#16264C] flex items-center justify-between text-xs text-slate-400 z-10">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-400" />
                  Alta concentração (0–90 dias)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#00DDF2]" />
                  Média concentração (91–180 dias)
                </span>
              </div>
              <span className="font-mono text-[10px]">SIG Municipal Integrado</span>
            </div>
          </div>
        </div>

        {/* Right Side: Selected State Analysis & Top Regional Opportunities (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Summary Box for Selected UF */}
          <div className="p-5 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-4">
            <div className="flex items-center justify-between border-b border-[#16264C] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#00DDF2] tracking-wider uppercase block">
                  Estado Selecionado
                </span>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{currentState.name}</span>
                  <span className="px-2 py-0.5 text-xs font-mono-numbers bg-[#16264C] text-[#00DDF2] rounded">
                    {currentState.uf}
                  </span>
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Score Médio</span>
                <span className="text-xl font-bold font-mono-numbers text-white">
                  {regionalSummary.avg}
                  <span className="text-xs text-slate-400 font-normal">/100</span>
                </span>
              </div>
            </div>

            {/* 4 Metric counters */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-lg bg-[#050B1E] border border-[#16264C]">
                <span className="text-slate-400 block text-[11px]">Municípios Analisados</span>
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
          <div className="p-5 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Top Oportunidades em {currentState.name}
            </h3>

            {stateMunicipalities.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Nenhum município demonstrativo cadastrado para esta UF.
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
