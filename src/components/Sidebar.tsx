import React from 'react';
import {
  LayoutDashboard,
  Radar,
  MapPin,
  Kanban,
  Activity,
  Sparkles,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { HarpiaLogo } from './HarpiaLogo';

export type NavTab =
  | 'visao-geral'
  | 'radar'
  | 'mapa'
  | 'oportunidades'
  | 'monitoramento'
  | 'insights'
  | 'fontes'
  | 'configuracoes';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  monitoredCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  monitoredCount,
}) => {
  const menuItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string | number }[] = [
    { id: 'visao-geral', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'radar', label: 'Radar de Municípios', icon: Radar },
    { id: 'mapa', label: 'Mapa', icon: MapPin },
    { id: 'oportunidades', label: 'Oportunidades', icon: Kanban },
    { id: 'monitoramento', label: 'Monitoramento', icon: Activity, badge: monitoredCount > 0 ? monitoredCount : undefined },
    { id: 'insights', label: 'Harpia Insights', icon: Sparkles },
    { id: 'fontes', label: 'Fontes', icon: Database },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 flex flex-col bg-[#050B1E] border-r border-[#16264C] transition-all duration-200 select-none ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#16264C]/70">
        <button
          onClick={() => onSelectTab('visao-geral')}
          className="flex items-center text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00DDF2]"
        >
          <HarpiaLogo collapsed={collapsed} />
        </button>

        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
          className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-[#0F1C3C] transition-colors focus:outline-none"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative ${
                isActive
                  ? 'bg-[#00DDF2]/10 text-white font-semibold shadow-[inset_0_0_12px_rgba(0,221,242,0.08)]'
                  : 'text-slate-300 hover:bg-[#0A1329] hover:text-white'
              }`}
            >
              {/* Cyan indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#00DDF2] rounded-r" />
              )}

              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#00DDF2]' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              {!collapsed && (
                <span className="truncate flex-1 text-left tracking-wide">{item.label}</span>
              )}

              {!collapsed && item.badge !== undefined && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono-numbers bg-[#16264C] text-[#00DDF2] rounded border border-[#00DDF2]/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Discrete Environment indicator */}
      {!collapsed ? (
        <div className="px-4 py-2 mx-3 mb-2 rounded bg-[#0A1329]/70 border border-[#16264C]/50 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00DDF2] animate-pulse" />
            Ambiente de demonstração
          </span>
          <span className="text-[10px] text-slate-400 font-mono">B2G v2.4</span>
        </div>
      ) : (
        <div className="flex justify-center mb-2" title="Ambiente de demonstração">
          <span className="w-2 h-2 rounded-full bg-[#00DDF2]" />
        </div>
      )}

      {/* User / Organization Profile Card */}
      <div className="p-3 border-t border-[#16264C]/80 bg-[#070F26]">
        <div className="flex items-center gap-2.5">
          <img
            src="/src/assets/images/avatar_executive_user_1791225046603.jpg"
            alt="Mariana Vasconcelos"
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-full object-cover border border-[#00DDF2]/40 shrink-0"
          />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <p className="text-xs font-semibold text-white truncate">Mariana V.</p>
                <ShieldCheck className="w-3.5 h-3.5 text-[#00DDF2] shrink-0" />
              </div>
              <p className="text-[11px] text-slate-400 truncate">EdTech Brasil Soluções</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
