import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Search,
  Landmark,
  GraduationCap,
  ShoppingBag,
  Info,
} from 'lucide-react';
import { PUBLIC_DATA_SOURCES } from '../data/mockData';
import { PublicDataSource } from '../types';

export const SourcesView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = PUBLIC_DATA_SOURCES.filter((s) => {
    if (selectedCategory !== 'ALL' && s.categoria !== selectedCategory) return false;
    if (
      searchQuery.trim() &&
      !s.nome.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !s.descricao.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Central de Fontes de Referência
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Mapeamento das bases públicas oficiais previstas na metodologia da plataforma para cálculo de indicadores fiscais, educacionais e contratuais.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="px-3 py-1.5 rounded-lg bg-[#0A1329] border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            AMBIENTE DEMONSTRATIVO • DADOS SIMULADOS
          </span>
        </div>
      </div>

      {/* Methodological notice */}
      <div className="p-3.5 rounded-xl bg-[#0A1329] border border-[#16264C] flex items-center gap-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-[#00DDF2] shrink-0" />
        <span>
          <strong>Nota Metodológica:</strong> As fontes listadas abaixo correspondem às bases oficiais que norteiam a modelagem de dados da Harpia Tech. Neste ambiente demonstrativo, todos os dados exibidos são simulados para apresentação dos fluxos analíticos.
        </span>
      </div>

      {/* Filter Tabs & Search */}
      <div className="p-4 rounded-xl bg-[#0A1329] border border-[#16264C] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['ALL', 'Fiscal', 'Educação', 'Compras'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#00DDF2] text-[#050B1E] shadow-[0_0_12px_rgba(0,221,242,0.2)]'
                  : 'text-slate-300 hover:bg-[#0F1C3C]'
              }`}
            >
              {cat === 'ALL' ? 'Todas as Categorias' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar base de referência..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#050B1E] border border-[#16264C] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00DDF2]/50"
          />
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((source) => {
          const CategoryIcon =
            source.categoria === 'Fiscal'
              ? Landmark
              : source.categoria === 'Educação'
              ? GraduationCap
              : ShoppingBag;

          return (
            <div
              key={source.id}
              className="p-5 rounded-xl bg-[#0A1329] border border-[#16264C] hover:border-[#00DDF2]/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#050B1E] border border-[#16264C] flex items-center justify-center text-[#00DDF2] shrink-0">
                      <CategoryIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{source.nome}</h3>
                      <span className="text-[10px] uppercase font-bold text-[#00DDF2] tracking-wider">
                        {source.categoria}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#00DDF2]/10 text-[#00DDF2] border border-[#00DDF2]/20 shrink-0">
                    Fonte Prevista
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {source.descricao}
                </p>
              </div>

              {/* Metadata Indicators */}
              <div className="pt-3 border-t border-[#16264C]/60 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div>
                  <span className="block text-slate-400 text-[10px]">Padrão de referência:</span>
                  <strong className="text-slate-200">{source.ultimaAtualizacao}</strong>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px]">Grau de autoridade:</span>
                  <strong className="text-emerald-400">{source.confiabilidade}</strong>
                </div>
                <div className="col-span-2 pt-1 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Escopo planejado:</span>
                    <span className="text-slate-300">{source.cobertura}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 flex items-center gap-1">
                    {source.urlExterna}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
