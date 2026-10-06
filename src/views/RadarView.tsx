import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  Download,
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Municipality, Region, ContractingWindow, PriorityLevel, ConfidenceLevel } from '../types';
import { ContextualHelp } from '../components/ContextualHelp';

interface RadarViewProps {
  municipalities: Municipality[];
  onSelectMunicipality: (municipality: Municipality) => void;
  onToggleMonitoring: (id: string) => void;
}

type SortField =
  | 'nome'
  | 'uf'
  | 'score'
  | 'fiscal'
  | 'educacao'
  | 'contratacao'
  | 'acesso'
  | 'governanca'
  | 'janela'
  | 'confianca'
  | 'prioridade';

export const RadarView: React.FC<RadarViewProps> = ({
  municipalities,
  onSelectMunicipality,
  onToggleMonitoring,
}) => {
  // Filter state
  const [search, setSearch] = useState('');
  const [selectedUf, setSelectedUf] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedJanela, setSelectedJanela] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedConfianca, setSelectedConfianca] = useState<string>('ALL');
  const [minScore, setMinScore] = useState<number>(0);

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Filter saved notice
  const [filterSaved, setFilterSaved] = useState(false);

  // Extract unique UFs and Regions
  const ufs = useMemo(() => Array.from(new Set(municipalities.map((m) => m.uf))).sort(), [municipalities]);
  const regions = useMemo(() => Array.from(new Set(municipalities.map((m) => m.regiao))).sort(), [municipalities]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedUf('ALL');
    setSelectedRegion('ALL');
    setSelectedJanela('ALL');
    setSelectedStatus('ALL');
    setSelectedConfianca('ALL');
    setMinScore(0);
    setCurrentPage(1);
  };

  const handleSaveFilter = () => {
    localStorage.setItem(
      'harpia_tech_saved_radar_filter',
      JSON.stringify({
        search,
        selectedUf,
        selectedRegion,
        selectedJanela,
        selectedStatus,
        selectedConfianca,
        minScore,
      })
    );
    setFilterSaved(true);
    setTimeout(() => setFilterSaved(false), 2000);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // Default descending for scores
    }
  };

  // Filtered & Sorted list
  const filteredList = useMemo(() => {
    return municipalities
      .filter((m) => {
        if (search.trim() && !m.nome.toLowerCase().includes(search.toLowerCase())) return false;
        if (selectedUf !== 'ALL' && m.uf !== selectedUf) return false;
        if (selectedRegion !== 'ALL' && m.regiao !== selectedRegion) return false;
        if (selectedJanela !== 'ALL' && m.janela !== selectedJanela) return false;
        if (selectedStatus !== 'ALL' && m.status !== selectedStatus) return false;
        if (selectedConfianca !== 'ALL' && m.confianca !== selectedConfianca) return false;
        if (m.score.total < minScore) return false;
        return true;
      })
      .sort((a, b) => {
        let valA: any;
        let valB: any;

        switch (sortField) {
          case 'nome':
            valA = a.nome;
            valB = b.nome;
            break;
          case 'uf':
            valA = a.uf;
            valB = b.uf;
            break;
          case 'score':
            valA = a.score.total;
            valB = b.score.total;
            break;
          case 'fiscal':
            valA = a.score.fiscal;
            valB = b.score.fiscal;
            break;
          case 'educacao':
            valA = a.score.educacao;
            valB = b.score.educacao;
            break;
          case 'contratacao':
            valA = a.score.contratacao;
            valB = b.score.contratacao;
            break;
          case 'acesso':
            valA = a.score.acesso;
            valB = b.score.acesso;
            break;
          case 'governanca':
            valA = a.score.governanca;
            valB = b.score.governanca;
            break;
          case 'janela':
            valA = a.janela;
            valB = b.janela;
            break;
          case 'confianca':
            valA = a.confianca;
            valB = b.confianca;
            break;
          case 'prioridade':
            valA = a.prioridade;
            valB = b.prioridade;
            break;
          default:
            valA = a.score.total;
            valB = b.score.total;
        }

        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [
    municipalities,
    search,
    selectedUf,
    selectedRegion,
    selectedJanela,
    selectedStatus,
    selectedConfianca,
    minScore,
    sortField,
    sortAsc,
  ]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
  const paginatedList = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Radar de Municípios
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Identifique onde estão as melhores oportunidades e entenda os sinais por trás de cada prioridade.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            id="radar-export-btn"
            onClick={() => {
              const headers = 'Município,UF,Região,Score,Fiscal,Educação,Contratação,Acesso,Governança,Janela,Confiança,Status\n';
              const rows = filteredList
                .map(
                  (m) =>
                    `"${m.nome}","${m.uf}","${m.regiao}",${m.score.total},${m.score.fiscal},${m.score.educacao},${m.score.contratacao},${m.score.acesso},${m.score.governanca},"${m.janela}","${m.confianca}","${m.status}"`
                )
                .join('\n');
              const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.setAttribute('href', url);
              link.setAttribute('download', 'harpia_tech_municipios.csv');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F1C3C] border border-[#16264C] hover:border-[#00DDF2]/50 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#00DDF2]" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handleSaveFilter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A1329] border border-[#16264C] hover:border-[#00DDF2]/50 text-xs font-medium text-slate-300 transition-colors"
          >
            {filterSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Filtro Salvo!</span>
              </>
            ) : (
              <span>Salvar Filtro</span>
            )}
          </button>
          <button
            onClick={handleResetFilters}
            title="Resetar filtros"
            className="p-1.5 rounded-lg bg-[#0A1329] border border-[#16264C] text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Multi-Filters Panel */}
      <div id="radar-filters-bar" className="p-4 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Filter className="w-3.5 h-3.5 text-[#00DDF2]" />
          <span>Filtros Analíticos Avançados</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Busca por município */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="radar-search-input"
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar por município..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#050B1E] border border-[#16264C] text-white placeholder-slate-400 focus:outline-none focus:border-[#00DDF2]/50"
            />
          </div>

          {/* UF */}
          <div>
            <select
              value={selectedUf}
              onChange={(e) => {
                setSelectedUf(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 rounded-lg bg-[#050B1E] border border-[#16264C] text-slate-300 focus:outline-none focus:border-[#00DDF2]/50"
            >
              <option value="ALL">Todas as UFs</option>
              {ufs.map((uf) => (
                <option key={uf} value={uf}>
                  Estado: {uf}
                </option>
              ))}
            </select>
          </div>

          {/* Região */}
          <div>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 rounded-lg bg-[#050B1E] border border-[#16264C] text-slate-300 focus:outline-none focus:border-[#00DDF2]/50"
            >
              <option value="ALL">Todas as Regiões</option>
              {regions.map((reg) => (
                <option key={reg} value={reg}>
                  Região {reg}
                </option>
              ))}
            </select>
          </div>

          {/* Janela */}
          <div>
            <select
              value={selectedJanela}
              onChange={(e) => {
                setSelectedJanela(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 rounded-lg bg-[#050B1E] border border-[#16264C] text-slate-300 focus:outline-none focus:border-[#00DDF2]/50"
            >
              <option value="ALL">Todas as Janelas</option>
              <option value="0–90 dias">0–90 dias (Imediata)</option>
              <option value="91–180 dias">91–180 dias (Próxima)</option>
              <option value="181–365 dias">181–365 dias (Estratégica)</option>
              <option value="Sem sinal">Sem sinal</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 rounded-lg bg-[#050B1E] border border-[#16264C] text-slate-300 focus:outline-none focus:border-[#00DDF2]/50"
            >
              <option value="ALL">Todos os Status</option>
              <option value="Imediata">Imediata</option>
              <option value="Próxima">Próxima</option>
              <option value="Estratégica">Estratégica</option>
              <option value="Monitorar">Monitorar</option>
            </select>
          </div>

          {/* Nível de Confiança */}
          <div>
            <select
              value={selectedConfianca}
              onChange={(e) => {
                setSelectedConfianca(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 rounded-lg bg-[#050B1E] border border-[#16264C] text-slate-300 focus:outline-none focus:border-[#00DDF2]/50"
            >
              <option value="ALL">Qualquer Confiança</option>
              <option value="Alta">Alta Confiança</option>
              <option value="Média">Média Confiança</option>
              <option value="Baixa">Baixa Confiança</option>
            </select>
          </div>

          {/* Score Mínimo Slider */}
          <div className="lg:col-span-2 flex items-center gap-3 px-3 py-1 bg-[#050B1E] rounded-lg border border-[#16264C]">
            <span className="text-slate-400 whitespace-nowrap">Score Mín:</span>
            <input
              type="range"
              min="0"
              max="95"
              step="5"
              value={minScore}
              onChange={(e) => {
                setMinScore(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full accent-[#00DDF2] cursor-pointer"
            />
            <span className="font-mono-numbers font-bold text-white text-xs w-8 text-right">
              {minScore}
            </span>
          </div>
        </div>
      </div>

      {/* Analytical Table */}
      <div id="radar-table-container" className="p-5 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Exibindo <span className="font-semibold text-white">{filteredList.length}</span> de {municipalities.length} municípios demonstrativos
          </div>
          <div className="text-[11px] text-slate-400">
            Clique no cabeçalho para ordenar
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#16264C] text-slate-400">
                <th
                  onClick={() => handleSort('nome')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Município</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('uf')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  UF
                </th>
                <th
                  onClick={() => handleSort('score')}
                  className="py-3 px-3 font-semibold text-center cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Score</span>
                    <ContextualHelp
                      topic="Score Harpia"
                      explanation="Pontuação ponderada de 0 a 100 baseada nas 5 dimensões oficiais: Fiscal (30), Educação (25), Contratação (25), Acesso (10) e Governança (10)."
                    />
                    <ArrowUpDown className="w-3 h-3 text-[#00DDF2]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('fiscal')}
                  className="py-3 px-3 font-semibold text-center cursor-pointer hover:text-white transition-colors"
                >
                  Fiscal (30)
                </th>
                <th
                  onClick={() => handleSort('educacao')}
                  className="py-3 px-3 font-semibold text-center cursor-pointer hover:text-white transition-colors"
                >
                  Educação (25)
                </th>
                <th
                  onClick={() => handleSort('contratacao')}
                  className="py-3 px-3 font-semibold text-center cursor-pointer hover:text-white transition-colors"
                >
                  Contratação (25)
                </th>
                <th
                  onClick={() => handleSort('acesso')}
                  className="py-3 px-3 font-semibold text-center cursor-pointer hover:text-white transition-colors"
                >
                  Acesso (10)
                </th>
                <th
                  onClick={() => handleSort('governanca')}
                  className="py-3 px-3 font-semibold text-center cursor-pointer hover:text-white transition-colors"
                >
                  Governança (10)
                </th>
                <th
                  onClick={() => handleSort('janela')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Janela</span>
                    <ContextualHelp
                      topic="Janela de Contratação"
                      explanation="Estimativa temporal recomendada para abordagem: Imediata (0-90 dias), Próxima (91-180 dias) e Estratégica (181-365 dias)."
                    />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('confianca')}
                  className="py-3 px-3 font-semibold text-center cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Confiança</span>
                    <ContextualHelp
                      topic="Nível de Confiança"
                      explanation="Grau de consistência e completude dos registros públicos consultados para este município demonstrativo."
                    />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('prioridade')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  Prioridade
                </th>
                <th className="py-3 px-3 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#16264C]/60 text-slate-300">
              {paginatedList.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onSelectMunicipality(item)}
                  className="hover:bg-[#0F1C3C]/60 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3 font-medium text-white">
                    <div className="flex items-start gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleMonitoring(item.id);
                        }}
                        title={item.isMonitored ? 'Remover da watchlist' : 'Adicionar à watchlist'}
                        className="text-slate-500 hover:text-[#00DDF2] transition-colors p-0.5 mt-0.5"
                      >
                        {item.isMonitored ? (
                          <BookmarkCheck className="w-3.5 h-3.5 text-[#00DDF2]" />
                        ) : (
                          <Bookmark className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <span className="group-hover:text-[#00DDF2] transition-colors font-bold block">
                          {item.nome}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[200px]" title={item.principalSinal}>
                          {item.principalSinal || 'Sinal mapeado no PNCP'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono-numbers text-slate-400">{item.uf}</td>
                  <td className="py-3 px-3 font-mono-numbers font-bold text-center text-white">
                    <span className="px-2 py-0.5 rounded bg-[#050B1E] border border-[#16264C] group-hover:border-[#00DDF2]/40 transition-colors">
                      {item.score.total}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono-numbers text-center text-slate-300">
                    {item.score.fiscal}
                  </td>
                  <td className="py-3 px-3 font-mono-numbers text-center text-slate-300">
                    {item.score.educacao}
                  </td>
                  <td className="py-3 px-3 font-mono-numbers text-center text-slate-300">
                    {item.score.contratacao}
                  </td>
                  <td className="py-3 px-3 font-mono-numbers text-center text-slate-300">
                    {item.score.acesso}
                  </td>
                  <td className="py-3 px-3 font-mono-numbers text-center text-slate-300">
                    {item.score.governanca}
                  </td>
                  <td className="py-3 px-3">
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
                      className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold ${
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
                    <div className="flex flex-col items-end">
                      <span className="text-[11px] text-[#00DDF2] font-semibold group-hover:underline flex items-center gap-0.5">
                        Abrir Ficha →
                      </span>
                      <span className="text-[9.5px] text-slate-400 truncate max-w-[150px]" title={item.leituraHarpia.proximaAcao}>
                        {item.leituraHarpia.proximaAcao}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between pt-3 border-t border-[#16264C] text-xs text-slate-400">
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded bg-[#050B1E] border border-[#16264C] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#0F1C3C]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono-numbers">{currentPage}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded bg-[#050B1E] border border-[#16264C] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#0F1C3C]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
