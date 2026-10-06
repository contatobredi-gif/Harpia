import React, { useState } from 'react';
import { Search, Bell, Sparkles, RefreshCw, Info, HelpCircle } from 'lucide-react';
import { NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  onOpenSearch: () => void;
  onOpenHelp: () => void;
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
  'monitoramento': { section: 'Acompanhamento Comercial', title: 'Radar de Acompanhamento' },
  'insights': { section: 'Copiloto de Decisão', title: 'Harpia Insights' },
  'fontes': { section: 'Bases de Referência Previstas', title: 'Central de Fontes' },
  'configuracoes': { section: 'Sistema', title: 'Configurações & Parâmetros' },
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenSearch,
  onOpenHelp,
  onOpenNotifications,
  unreadNotificationsCount,
  onOpenInsights,
  onRefreshData,
}) => {
  const [showDemoTooltip, setShowDemoTooltip] = useState(false);
  const meta = TAB_TITLES[currentTab] || { section: 'Plataforma', title: 'Harpia Tech' };

  return (
    <header className="h-16 bg-[#050B1E]/95 backdrop-blur-md border-b border-[#16264C] sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-4">
      {/* Zone 1: Contextual Breadcrumb & Global Demo Badge */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs truncate">
          <span className="text-slate-400 font-medium hidden sm:inline">{meta.section}</span>
          <span className="text-slate-500 hidden sm:inline">/</span>
          <h1 className="text-sm font-semibold text-white tracking-wide truncate">{meta.title}</h1>
        </div>

        {/* Global Demo Environment Label */}
        <div className="relative shrink-0">
          <button
            onMouseEnter={() => setShowDemoTooltip(true)}
            onMouseLeave={() => setShowDemoTooltip(false)}
            onClick={() => setShowDemoTooltip(!showDemoTooltip)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 hover:border-amber-400/50 text-[10.5px] font-mono font-medium text-amber-300 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="tracking-wider">AMBIENTE DEMONSTRATIVO • DADOS SIMULADOS</span>
            <Info className="w-3 h-3 text-amber-300/70 ml-0.5" />
          </button>

          {showDemoTooltip && (
            <div className="absolute left-0 top-8 z-50 w-72 p-2.5 rounded-lg bg-[#0A1329] border border-amber-500/40 text-[11px] text-slate-200 shadow-2xl leading-relaxed">
              Este MVP utiliza dados simulados para demonstrar a experiência, os fluxos e a metodologia da plataforma.
            </div>
          )}
        </div>
      </div>

      {/* Zone 2: Global Search Bar */}
      <div className="flex-1 max-w-md hidden lg:flex items-center gap-3">
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
      </div>

      {/* Zone 3: Actions & Notifications (Search | Help (?) | Ask Harpia | Notifications) */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Help button */}
        <button
          onClick={onOpenHelp}
          title="Central de Ajuda Harpia"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0F1C3C] hover:bg-[#16264C] border border-[#16264C] hover:border-[#00DDF2]/50 text-slate-300 hover:text-[#00DDF2] text-xs font-semibold transition-all group"
        >
          <HelpCircle className="w-4 h-4 text-[#00DDF2] group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">AJUDA</span>
        </button>

        {onRefreshData && (
          <button
            onClick={onRefreshData}
            title="Atualizar dados demonstrativos"
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
