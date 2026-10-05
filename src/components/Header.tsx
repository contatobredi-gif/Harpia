import React from 'react';
import { Search, Bell, Sparkles, RefreshCw } from 'lucide-react';
import { NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  onOpenInsights: () => void;
  onRefreshData?: () => void;
}

const TAB_TITLES: Record<NavTab, { section: string; title: string }> = {
  'visao-geral': { section: 'Painel Executivo', title: 'Visão Geral' },
  'radar': { section: 'Inteligência Comercial', title: 'Radar de Municípios' },
  'mapa': { section: 'Geolocalização B2G', title: 'Mapa de Oportunidades' },
  'oportunidades': { section: 'Funil Comercial', title: 'Pipeline de Oportunidades' },
  'monitoramento': { section: 'Watchlist & Alertas', title: 'Monitoramento Contínuo' },
  'insights': { section: 'Copiloto de Decisão', title: 'Harpia Insights' },
  'fontes': { section: 'Bases Públicas Oficiais', title: 'Central de Fontes' },
  'configuracoes': { section: 'Sistema', title: 'Configurações & Parâmetros' },
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenSearch,
  onOpenNotifications,
  unreadNotificationsCount,
  onOpenInsights,
  onRefreshData,
}) => {
  const meta = TAB_TITLES[currentTab] || { section: 'Plataforma', title: 'Harpia Tech' };

  return (
    <header className="h-16 bg-[#050B1E]/90 backdrop-blur-md border-b border-[#16264C] sticky top-0 z-20 px-6 flex items-center justify-between gap-4">
      {/* Zone 1: Contextual Breadcrumb */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium">{meta.section}</span>
        <span className="text-slate-500">/</span>
        <h1 className="text-sm font-semibold text-white tracking-wide">{meta.title}</h1>
      </div>

      {/* Zone 2: Global Search Bar and Demo Tag */}
      <div className="flex-1 max-w-xl hidden md:flex items-center gap-3">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-[#0A1329] border border-[#16264C] hover:border-[#00DDF2]/50 text-slate-400 hover:text-slate-200 transition-all text-xs text-left group"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00DDF2] transition-colors shrink-0" />
            <span className="truncate">Buscar por município, UF, contrato ou fonte...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-[#0F1C3C] border border-[#16264C] rounded">
            ⌘K
          </kbd>
        </button>

        <span className="text-[11px] font-medium text-slate-400 px-2 py-1 rounded bg-[#0A1329] border border-[#16264C]/70 whitespace-nowrap hidden lg:inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00DDF2]" />
          Ambiente de demonstração
        </span>
      </div>

      {/* Zone 3: Actions & Notifications */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onRefreshData && (
          <button
            onClick={onRefreshData}
            title="Atualizar dados de inteligência"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#0A1329] border border-transparent hover:border-[#16264C] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onOpenInsights}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00DDF2]/10 border border-[#00DDF2]/30 hover:border-[#00DDF2] text-[#00DDF2] text-xs font-semibold hover:bg-[#00DDF2]/15 transition-all shadow-[0_0_12px_rgba(0,221,242,0.12)] whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Pergunte à Harpia</span>
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          title="Notificações e Alertas"
          className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#0A1329] border border-[#16264C] transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00DDF2] text-[#050B1E] text-[10px] font-bold flex items-center justify-center font-mono-numbers">
              {unreadNotificationsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
