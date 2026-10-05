import React, { useState } from 'react';
import { BRAZIL_STATES_VECTOR, BrazilStateVector } from '../data/brazilMapData';
import { Municipality, Region } from '../types';

interface BrazilVectorMapProps {
  selectedUf: string;
  onSelectUf: (uf: string) => void;
  selectedRegion: Region | 'TODAS';
  municipalities: Municipality[];
}

interface TooltipData {
  uf: string;
  name: string;
  muniCount: number;
  avgScore: string;
  immediateCount: number;
  x: number;
  y: number;
}

export const BrazilVectorMap: React.FC<BrazilVectorMapProps> = ({
  selectedUf,
  onSelectUf,
  selectedRegion,
  municipalities,
}) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Helper to calculate stats per UF
  const getUfStats = (uf: string) => {
    const list = municipalities.filter((m) => m.uf === uf);
    const count = list.length;
    const avg = count > 0 ? (list.reduce((acc, m) => acc + m.score.total, 0) / count).toFixed(1) : '—';
    const immediate = list.filter((m) => m.janela === '0–90 dias').length;

    let intensity: 'alta' | 'media' | 'baixa' | 'sem_dados' = 'sem_dados';
    if (count > 0) {
      if (immediate > 0 || Number(avg) >= 80) {
        intensity = 'alta';
      } else if (Number(avg) >= 70) {
        intensity = 'media';
      } else {
        intensity = 'baixa';
      }
    }
    return { count, avg, immediate, intensity };
  };

  const handleMouseEnter = (state: BrazilStateVector, e: React.MouseEvent) => {
    const stats = getUfStats(state.uf);
    const rect = e.currentTarget.closest('svg')?.getBoundingClientRect();
    const x = rect ? e.clientX - rect.left : e.clientX;
    const y = rect ? e.clientY - rect.top : e.clientY;

    setTooltip({
      uf: state.uf,
      name: state.name,
      muniCount: stats.count,
      avgScore: stats.avg,
      immediateCount: stats.immediate,
      x,
      y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!tooltip) return;
    const rect = e.currentTarget.closest('svg')?.getBoundingClientRect();
    if (rect) {
      setTooltip((prev) =>
        prev
          ? {
              ...prev,
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            }
          : null
      );
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none py-2">
      <svg
        viewBox="0 0 354 368"
        className="w-full max-w-[520px] h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={handleMouseMove}
      >
        <defs>
          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {BRAZIL_STATES_VECTOR.map((state) => {
          const stats = getUfStats(state.uf);
          const isSelected = selectedUf === state.uf;
          const isRegionMatch = selectedRegion === 'TODAS' || state.region === selectedRegion;

          // Color calculation
          let fill = '#0A1428';
          let stroke = '#16264C';
          let strokeWidth = '0.75';

          if (!isRegionMatch) {
            fill = '#050B1E';
            stroke = '#101C3C';
          } else if (isSelected) {
            fill = '#00DDF2';
            stroke = '#FFFFFF';
            strokeWidth = '1.8';
          } else if (stats.intensity === 'alta') {
            fill = 'rgba(0, 221, 242, 0.42)';
            stroke = 'rgba(0, 221, 242, 0.75)';
            strokeWidth = '1';
          } else if (stats.intensity === 'media') {
            fill = 'rgba(0, 221, 242, 0.18)';
            stroke = 'rgba(0, 221, 242, 0.45)';
          } else if (stats.intensity === 'baixa') {
            fill = 'rgba(15, 28, 60, 0.9)';
            stroke = '#1F3870';
          }

          const commonProps = {
            id: `map-state-${state.uf}`,
            fill,
            stroke,
            strokeWidth,
            strokeLinecap: 'round' as const,
            strokeLinejoin: 'round' as const,
            className: `transition-all duration-150 cursor-pointer ${
              isSelected ? 'filter drop-shadow-[0_0_8px_rgba(0,221,242,0.8)]' : 'hover:brightness-125'
            }`,
            onClick: () => onSelectUf(state.uf),
            onMouseEnter: (e: React.MouseEvent) => handleMouseEnter(state, e),
            onMouseLeave: handleMouseLeave,
          };

          return (
            <g key={state.uf} className="group">
              {state.type === 'polygon' && state.points ? (
                <polygon points={state.points} {...commonProps} />
              ) : state.type === 'path' && state.d ? (
                <path d={state.d} {...commonProps} />
              ) : null}

              {/* State abbreviation label on map centroid */}
              {isRegionMatch && (
                <text
                  x={state.cx}
                  y={state.cy + 2.5}
                  textAnchor="middle"
                  className={`pointer-events-none text-[8.5px] font-mono font-bold select-none transition-colors ${
                    isSelected
                      ? 'fill-[#050B1E]'
                      : stats.intensity === 'alta'
                      ? 'fill-white'
                      : 'fill-slate-300'
                  }`}
                >
                  {state.uf}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating Hover Tooltip */}
      {tooltip && (
        <div
          className="absolute z-30 pointer-events-none px-3 py-2 rounded-lg bg-[#050B1E]/95 border border-[#00DDF2]/60 shadow-[0_4px_20px_rgba(0,0,0,0.8)] text-xs text-white min-w-[170px] backdrop-blur-md transform -translate-x-1/2 -translate-y-full -mt-2 transition-all duration-75"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
        >
          <div className="flex items-center justify-between border-b border-[#16264C] pb-1 mb-1.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="px-1 py-0.2 rounded bg-[#16264C] text-[#00DDF2] text-[10px] font-mono">
                {tooltip.uf}
              </span>
              <span>{tooltip.name}</span>
            </span>
          </div>

          <div className="space-y-1 text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Municípios analisados:</span>
              <strong className="font-mono-numbers text-white">{tooltip.muniCount}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Score Harpia médio:</span>
              <strong className="font-mono-numbers text-[#00DDF2]">{tooltip.avgScore}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Oportunidades imediatas:</span>
              <strong className="font-mono-numbers text-emerald-400">{tooltip.immediateCount}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
