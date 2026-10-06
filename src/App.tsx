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
import { HelpDrawer } from './components/HelpDrawer';
import { GuidedTour } from './components/GuidedTour';

// Views
import { LandingPageView } from './views/LandingPageView';
import { LoginView } from './views/LoginView';
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
  toggleMunicipalityMonitoring,
  updateMunicipalityPipelineStage,
  getStoredNotifications,
  markAllNotificationsAsRead,
  getStoredTimeline,
  resetAllDemoData,
} from './services/storage';
import { Municipality, NotificationItem, TimelineEvent, PipelineStage } from './types';

// Tab to route path mapping
const TAB_TO_PATH: Record<NavTab, string> = {
  'visao-geral': '/app',
  radar: '/app/radar',
  mapa: '/app/mapa',
  oportunidades: '/app/oportunidades',
  monitoramento: '/app/monitoramento',
  insights: '/app/insights',
  fontes: '/app/fontes',
  configuracoes: '/app/configuracoes',
};

// Route path to Tab mapping
function getTabFromPath(path: string): NavTab {
  if (path === '/app/radar') return 'radar';
  if (path === '/app/mapa') return 'mapa';
  if (path === '/app/oportunidades') return 'oportunidades';
  if (path === '/app/monitoramento') return 'monitoramento';
  if (path === '/app/insights') return 'insights';
  if (path === '/app/fontes') return 'fontes';
  if (path === '/app/configuracoes') return 'configuracoes';
  return 'visao-geral';
}

export default function App() {
  // Routing state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [currentTab, setCurrentTab] = useState<NavTab>(() => {
    return getTabFromPath(window.location.pathname);
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Core Data in localStorage
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  // Modals & Drawers
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [helpDrawerOpen, setHelpDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);

  // Onboarding Guided Tour
  const [tourActive, setTourActive] = useState(false);
  const [tourInitialStep, setTourInitialStep] = useState<number>(0);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Sync / Refresh toast
  const [refreshToast, setRefreshToast] = useState(false);

  // Browser navigation popstate listener
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
      if (path.startsWith('/app')) {
        setCurrentTab(getTabFromPath(path));
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Initialize data from localStorage on mount & check first access
  useEffect(() => {
    setMunicipalities(getStoredMunicipalities());
    setNotifications(getStoredNotifications());
    setTimelineEvents(getStoredTimeline());

    // Check if user on platform for the first time or resuming tour
    const tourDone = localStorage.getItem('harpia_tour_completed');
    const lastStep = localStorage.getItem('harpia_tour_last_step');
    if (!tourDone && window.location.pathname.startsWith('/app')) {
      if (lastStep && Number(lastStep) >= 1 && Number(lastStep) <= 8) {
        setTourInitialStep(Number(lastStep) - 1);
        setTourActive(true);
      } else {
        setShowWelcomeModal(true);
      }
    }
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

  // Clean Navigation function
  const navigate = (newPath: string) => {
    if (newPath !== window.location.pathname) {
      window.history.pushState(null, '', newPath);
    }
    setCurrentPath(newPath);
    if (newPath.startsWith('/app')) {
      setCurrentTab(getTabFromPath(newPath));

      // Trigger welcome tour on first access to /app
      const tourDone = localStorage.getItem('harpia_tour_completed');
      if (!tourDone) {
        setShowWelcomeModal(true);
      }
    }
  };

  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    navigate(TAB_TO_PATH[tab] || '/app');
  };

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

  // Tour controls
  const handleStartTourFromWelcome = () => {
    setShowWelcomeModal(false);
    setTourActive(true);
  };

  const handleDismissWelcomeModal = () => {
    setShowWelcomeModal(false);
    localStorage.setItem('harpia_tour_completed', 'true');
  };

  const handleFinishTour = () => {
    setTourActive(false);
    localStorage.setItem('harpia_tour_completed', 'true');
  };

  const handleRestartTour = () => {
    if (!currentPath.startsWith('/app')) {
      navigate('/app');
    }
    setTourInitialStep(0);
    setTourActive(true);
    setShowWelcomeModal(false);
  };

  const handleOpenDemoMunicipality = () => {
    const demo = municipalities.find((m) => m.id === 'mun-alfa') || municipalities[0] || null;
    setSelectedMunicipality(demo);
  };

  const handleCloseDemoMunicipality = () => {
    setSelectedMunicipality(null);
  };

  // Contextual "ME MOSTRE COMO" handler
  const handleShowHowTo = (actionTarget: string, highlightId?: string) => {
    setHelpDrawerOpen(false);

    if (actionTarget === 'ficha') {
      handleOpenDemoMunicipality();
    } else {
      const tabMap: Record<string, NavTab> = {
        radar: 'radar',
        mapa: 'mapa',
        oportunidades: 'oportunidades',
        monitoramento: 'monitoramento',
        insights: 'insights',
        fontes: 'fontes',
        configuracoes: 'configuracoes',
        'visao-geral': 'visao-geral',
      };
      if (tabMap[actionTarget]) {
        handleSelectTab(tabMap[actionTarget]);
      }
    }

    if (highlightId) {
      setTimeout(() => {
        const el = document.getElementById(highlightId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('tour-pulse-highlight');
          setTimeout(() => {
            el.classList.remove('tour-pulse-highlight');
          }, 3500);
        }
      }, 300);
    }
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.lida).length;
  const monitoredCount = municipalities.filter((m) => m.isMonitored).length;

  // ROUTE 1: Commercial Landing Page (/)
  if (currentPath === '/') {
    return (
      <LandingPageView
        onNavigateLogin={() => navigate('/login')}
        onNavigateApp={() => navigate('/app')}
      />
    );
  }

  // ROUTE 2: Login Screen (/login)
  if (currentPath === '/login') {
    return (
      <LoginView
        onLoginSuccess={() => navigate('/app')}
        onNavigateHome={() => navigate('/')}
      />
    );
  }

  // ROUTE 3: SaaS Platform (/app and subroutes)
  return (
    <div className="min-h-screen bg-[#050B1E] text-slate-100 flex">
      {/* 1. Fixed Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
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
          onOpenHelp={() => setHelpDrawerOpen(true)}
          onOpenNotifications={() => setNotificationsOpen(true)}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenInsights={() => handleSelectTab('insights')}
          onRefreshData={handleRefresh}
        />

        {/* Refresh feedback toast */}
        {refreshToast && (
          <div className="fixed top-20 right-6 z-40 p-3 rounded-xl bg-[#0A1329] border border-[#00DDF2]/50 text-xs text-[#00DDF2] shadow-xl flex items-center gap-2 animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-[#00DDF2] animate-pulse" />
            <span>Dados demonstrativos atualizados com sucesso.</span>
          </div>
        )}

        {/* Viewport Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'visao-geral' && (
            <OverviewDashboard
              municipalities={municipalities}
              onSelectMunicipality={setSelectedMunicipality}
              onNavigateToRadar={() => handleSelectTab('radar')}
              onNavigateToMap={() => handleSelectTab('mapa')}
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
              onNavigateToRadar={() => handleSelectTab('radar')}
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
            <SettingsView
              onResetData={handleResetData}
              onRestartTour={handleRestartTour}
            />
          )}
        </main>
      </div>

      {/* Global Search Dialog (⌘K) */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        municipalities={municipalities}
        onSelectMunicipality={setSelectedMunicipality}
        onNavigateToInsights={() => handleSelectTab('insights')}
      />

      {/* Intelligent Help Center Drawer */}
      <HelpDrawer
        isOpen={helpDrawerOpen}
        onClose={() => setHelpDrawerOpen(false)}
        onNavigate={handleSelectTab}
        onRestartTour={handleRestartTour}
        onShowHowTo={handleShowHowTo}
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

      {/* Interactive Guided Onboarding Tour & Welcome Modal */}
      <GuidedTour
        isActive={tourActive}
        initialStepIndex={tourInitialStep}
        onFinishTour={handleFinishTour}
        onNavigateTab={handleSelectTab}
        onOpenDemoMunicipality={handleOpenDemoMunicipality}
        onCloseDemoMunicipality={handleCloseDemoMunicipality}
        showWelcomeModal={showWelcomeModal}
        onStartTourFromWelcome={handleStartTourFromWelcome}
        onDismissWelcomeModal={handleDismissWelcomeModal}
      />
    </div>
  );
}
