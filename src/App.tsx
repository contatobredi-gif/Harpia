/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { MunicipalityDetailModal } from './components/MunicipalityDetailModal';

// Views
import { OverviewDashboard } from './views/OverviewDashboard';
import { RadarView } from './views/RadarView';
import { MapView } from './views/MapView';
import { OpportunitiesKanban } from './views/OpportunitiesKanban';
import { MonitoringView } from './views/MonitoringView';
import { HarpiaInsightsView } from './views/HarpiaInsightsView';
import { SourcesView } from './views/SourcesView';
import { SettingsView } from './views/SettingsView';

// Services & Types
import {
  getStoredMunicipalities,
  saveStoredMunicipalities,
  toggleMunicipalityMonitoring,
  updateMunicipalityPipelineStage,
  getStoredNotifications,
  markAllNotificationsAsRead,
  getStoredTimeline,
  resetAllDemoData,
} from './services/storage';
import { Municipality, NotificationItem, TimelineEvent, PipelineStage } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('visao-geral');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Core Data in localStorage
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  // Modals & Drawers
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);

  // Sync / Refresh toast
  const [refreshToast, setRefreshToast] = useState(false);

  // Initialize data from localStorage on mount
  useEffect(() => {
    setMunicipalities(getStoredMunicipalities());
    setNotifications(getStoredNotifications());
    setTimelineEvents(getStoredTimeline());
  }, []);

  // Global keyboard shortcuts (⌘K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Actions
  const handleToggleMonitoring = (id: string) => {
    const updated = toggleMunicipalityMonitoring(id);
    setMunicipalities(updated);
    if (selectedMunicipality && selectedMunicipality.id === id) {
      setSelectedMunicipality({
        ...selectedMunicipality,
        isMonitored: !selectedMunicipality.isMonitored,
      });
    }
  };

  const handleMovePipelineStage = (id: string, stage: PipelineStage) => {
    const updated = updateMunicipalityPipelineStage(id, stage);
    setMunicipalities(updated);
    if (selectedMunicipality && selectedMunicipality.id === id) {
      setSelectedMunicipality({
        ...selectedMunicipality,
        pipelineStage: stage,
      });
    }
  };

  const handleMarkAllNotifications = () => {
    const updated = markAllNotificationsAsRead();
    setNotifications(updated);
  };

  const handleSelectMunicipalityById = (id: string) => {
    const found = municipalities.find((m) => m.id === id);
    if (found) {
      setSelectedMunicipality(found);
    }
  };

  const handleResetData = () => {
    resetAllDemoData();
    setMunicipalities(getStoredMunicipalities());
    setNotifications(getStoredNotifications());
    setTimelineEvents(getStoredTimeline());
  };

  const handleRefresh = () => {
    setRefreshToast(true);
    setTimeout(() => setRefreshToast(false), 2000);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.lida).length;
  const monitoredCount = municipalities.filter((m) => m.isMonitored).length;

  return (
    <div className="min-h-screen bg-[#050B1E] text-slate-100 flex">
      {/* 1. Fixed Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        monitoredCount={monitoredCount}
      />

      {/* 2. Main Content Canvas */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          sidebarCollapsed ? 'pl-[72px]' : 'pl-64'
        }`}
      >
        {/* Top Bar Header */}
        <Header
          currentTab={currentTab}
          onOpenSearch={() => setSearchModalOpen(true)}
          onOpenNotifications={() => setNotificationsOpen(true)}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenInsights={() => setCurrentTab('insights')}
          onRefreshData={handleRefresh}
        />

        {/* Refresh feedback toast */}
        {refreshToast && (
          <div className="fixed top-20 right-6 z-40 p-3 rounded-xl bg-[#0A1329] border border-[#00DDF2]/50 text-xs text-[#00DDF2] shadow-xl flex items-center gap-2 animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-[#00DDF2] animate-pulse" />
            <span>Dados de inteligência atualizados com as bases oficiais.</span>
          </div>
        )}

        {/* Viewport Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'visao-geral' && (
            <OverviewDashboard
              municipalities={municipalities}
              onSelectMunicipality={setSelectedMunicipality}
              onNavigateToRadar={() => setCurrentTab('radar')}
              onNavigateToMap={() => setCurrentTab('mapa')}
            />
          )}

          {currentTab === 'radar' && (
            <RadarView
              municipalities={municipalities}
              onSelectMunicipality={setSelectedMunicipality}
              onToggleMonitoring={handleToggleMonitoring}
            />
          )}

          {currentTab === 'mapa' && (
            <MapView
              municipalities={municipalities}
              onSelectMunicipality={setSelectedMunicipality}
            />
          )}

          {currentTab === 'oportunidades' && (
            <OpportunitiesKanban
              municipalities={municipalities}
              onSelectMunicipality={setSelectedMunicipality}
              onMoveStage={handleMovePipelineStage}
            />
          )}

          {currentTab === 'monitoramento' && (
            <MonitoringView
              municipalities={municipalities}
              timelineEvents={timelineEvents}
              onSelectMunicipality={setSelectedMunicipality}
              onToggleMonitoring={handleToggleMonitoring}
              onNavigateToRadar={() => setCurrentTab('radar')}
            />
          )}

          {currentTab === 'insights' && (
            <HarpiaInsightsView
              municipalities={municipalities}
              onSelectMunicipality={setSelectedMunicipality}
            />
          )}

          {currentTab === 'fontes' && <SourcesView />}

          {currentTab === 'configuracoes' && (
            <SettingsView onResetData={handleResetData} />
          )}
        </main>
      </div>

      {/* Global Search Dialog (⌘K) */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        municipalities={municipalities}
        onSelectMunicipality={setSelectedMunicipality}
        onNavigateToInsights={() => setCurrentTab('insights')}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotifications}
        onSelectMunicipalityById={handleSelectMunicipalityById}
      />

      {/* Ficha Municipal Detail Modal */}
      <MunicipalityDetailModal
        municipality={selectedMunicipality}
        onClose={() => setSelectedMunicipality(null)}
        onToggleMonitoring={handleToggleMonitoring}
        onChangePipelineStage={handleMovePipelineStage}
      />
    </div>
  );
}
