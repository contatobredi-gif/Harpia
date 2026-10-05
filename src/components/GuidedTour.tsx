import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Compass,
  CheckCircle2,
  Zap,
  Target,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { Municipality } from '../types';

export interface TourStep {
  step: number;
  title: string;
  subtitle: string;
  content: string;
  targetTab: NavTab;
  openDemoMunicipality?: boolean;
  spotlightSelector?: string;
  position?: 'bottom' | 'top' | 'center' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    title: 'Visão Geral & Indicadores',
    subtitle: 'Painel Executivo',
    content:
      'Aqui você acompanha os principais indicadores da Harpia e visualiza rapidamente onde estão as melhores oportunidades comerciais no setor educacional público.',
    targetTab: 'visao-geral',
    spotlightSelector: '#dashboard-overview-cards',
    position: 'bottom',
  },
  {
    step: 2,
    title: 'Score Harpia (0 a 100)',
    subtitle: 'Inteligência de Priorização',
    content:
      'O Score Harpia varia de 0 a 100 e combina capacidade fiscal, necessidade educacional, oportunidade de contratação, acesso institucional e governança.',
    targetTab: 'visao-geral',
    spotlightSelector: '#dashboard-score-card',
    position: 'bottom',
  },
  {
    step: 3,
    title: 'Radar de Municípios',
    subtitle: 'Mapeamento Avançado',
    content:
      'Use o Radar para localizar municípios, aplicar filtros dinâmicos e comparar oportunidades com base em indicadores oficiais do setor público.',
    targetTab: 'radar',
    spotlightSelector: '#radar-table-container',
    position: 'top',
  },
  {
    step: 4,
    title: 'Filtros Estratégicos',
    subtitle: 'Segmentação Precisa',
    content:
      'Combine UF, região, score mínimo, janela de contratação, confiança e outros indicadores para encontrar oportunidades específicas para o seu portfólio.',
    targetTab: 'radar',
    spotlightSelector: '#radar-filters-bar',
    position: 'bottom',
  },
  {
    step: 5,
    title: 'Ficha Municipal Completa',
    subtitle: 'Dossiê do Município',
    content:
      'A Ficha Municipal concentra todos os sinais utilizados na análise da oportunidade, reunindo finanças, dados escolares, compras públicas e contatos institucionais.',
    targetTab: 'radar',
    openDemoMunicipality: true,
    spotlightSelector: '#modal-municipality-header',
    position: 'bottom',
  },
  {
    step: 6,
    title: 'Cinco Dimensões do Score',
    subtitle: 'Estrutura Analítica',
    content:
      'Conheça a composição exata: Capacidade Fiscal (30 pts), Necessidade Educacional (25 pts), Oportunidade de Contratação (25 pts), Acesso Institucional (10 pts) e Governança (10 pts).',
    targetTab: 'radar',
    openDemoMunicipality: true,
    spotlightSelector: '#modal-five-dimensions',
    position: 'bottom',
  },
  {
    step: 7,
    title: 'Leitura Harpia & Evidências',
    subtitle: 'Por trás dos números',
    content:
      'A Harpia não mostra apenas uma nota. Ela explica os sinais que sustentam a oportunidade e os pontos de atenção e cautela que precisam ser validados antes da abordagem.',
    targetTab: 'radar',
    openDemoMunicipality: true,
    spotlightSelector: '#modal-overview-analysis',
    position: 'top',
  },
  {
    step: 8,
    title: 'Mapa de Oportunidades',
    subtitle: 'Geolocalização B2G',
    content:
      'Explore oportunidades geograficamente através do mapa vetorial do Brasil. Selecione estados para visualizar seus municípios e analisar a concentração regional.',
    targetTab: 'mapa',
    spotlightSelector: '#map-vector-container',
    position: 'top',
  },
  {
    step: 9,
    title: 'Pipeline B2G (Kanban)',
    subtitle: 'Gestão Comercial',
    content:
      'Organize municípios estrategicamente entre Abordagem Imediata (0-90 dias), Relacionamento & Planejamento (91-180 dias) e Monitoramento (181-365 dias).',
    targetTab: 'oportunidades',
    spotlightSelector: '#pipeline-kanban-board',
    position: 'top',
  },
  {
    step: 10,
    title: 'Monitoramento Contínuo',
    subtitle: 'Watchlist & Sinais',
    content:
      'Adicione municípios estratégicos ao monitoramento para acompanhar alterações de vigência, publicações no PNCP, recálculos de score e histórico de eventos.',
    targetTab: 'monitoramento',
    spotlightSelector: '#monitoring-watchlist-area',
    position: 'top',
  },
  {
    step: 11,
    title: 'Harpia Insights com IA',
    subtitle: 'Copiloto Analítico',
    content:
      'Pergunte à Harpia usando linguagem natural. A IA analisa os dados disponíveis no ambiente e explica as respostas com fontes, sinais e cautelas.',
    targetTab: 'insights',
    spotlightSelector: '#insights-input-form',
    position: 'bottom',
  },
  {
    step: 12,
    title: 'Você está pronto para usar a Harpia!',
    subtitle: 'Tour Concluído',
    content:
      'Agora você domina todas as ferramentas da plataforma. Identifique oportunidades, filtre por janelas contratuais e potencialize sua prospecção educacional.',
    targetTab: 'visao-geral',
    position: 'center',
  },
];

interface GuidedTourProps {
  isActive: boolean;
  onFinishTour: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenDemoMunicipality: () => void;
  onCloseDemoMunicipality: () => void;
  showWelcomeModal: boolean;
  onStartTourFromWelcome: () => void;
  onDismissWelcomeModal: () => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({
  isActive,
  onFinishTour,
  onNavigateTab,
  onOpenDemoMunicipality,
  onCloseDemoMunicipality,
  showWelcomeModal,
  onStartTourFromWelcome,
  onDismissWelcomeModal,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);

  const step = TOUR_STEPS[currentStepIndex];

  // Sync tab and modal on step change
  useEffect(() => {
    if (!isActive) return;

    if (step.targetTab) {
      onNavigateTab(step.targetTab);
    }

    if (step.openDemoMunicipality) {
      onOpenDemoMunicipality();
    } else {
      onCloseDemoMunicipality();
    }

    // Attempt to compute spotlight bounding rect
    const timer = setTimeout(() => {
      if (step.spotlightSelector) {
        const el = document.querySelector(step.spotlightSelector);
        if (el) {
          const rect = el.getBoundingClientRect();
          setSpotlightRect(rect);
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
      }
      setSpotlightRect(null);
    }, 220);

    return () => clearTimeout(timer);
  }, [currentStepIndex, isActive, step.targetTab, step.openDemoMunicipality]);

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    onCloseDemoMunicipality();
    onFinishTour();
    setCurrentStepIndex(0);
  };

  // 1. First Access Welcome Modal
  if (showWelcomeModal) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050B1E]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="w-full max-w-md bg-[#0A1329] border border-[#00DDF2]/50 rounded-2xl shadow-[0_0_40px_rgba(0,221,242,0.18)] p-6 sm:p-7 space-y-5 text-center relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-[#00DDF2]/15 border border-[#00DDF2]/40 flex items-center justify-center text-[#00DDF2] mx-auto shadow-[0_0_20px_rgba(0,221,242,0.25)]">
            <Compass className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#00DDF2] font-semibold">
              Onboarding Interativo
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Bem-vindo à Harpia Tech
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
              Vamos apresentar em poucos passos como identificar, analisar e acompanhar oportunidades comerciais no setor público educacional.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onStartTourFromWelcome}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#00DDF2] text-[#050B1E] font-bold text-xs hover:bg-[#5beaff] transition-all shadow-[0_0_15px_rgba(0,221,242,0.3)] flex items-center justify-center gap-2"
            >
              <span>COMEÇAR TOUR</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onDismissWelcomeModal}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#0F1C3C] hover:bg-[#16264C] text-slate-300 hover:text-white font-medium text-xs border border-[#16264C] transition-colors"
            >
              EXPLORAR SOZINHO
            </button>
          </div>

          <p className="text-[10.5px] text-slate-400">
            Você poderá reiniciar o tour a qualquer momento na Central de Ajuda ou em Configurações.
          </p>
        </div>
      </div>
    );
  }

  // 2. Active Tour Overlay & Card
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none">
      {/* Darkened backdrop with spotlight effect */}
      <div className="absolute inset-0 bg-[#050B1E]/80 backdrop-blur-[2px] transition-all duration-300" />

      {/* Highlight Cutout Box if element found */}
      {spotlightRect && (
        <div
          className="absolute border-2 border-[#00DDF2] rounded-xl shadow-[0_0_30px_rgba(0,221,242,0.5),0_0_0_9999px_rgba(5,11,30,0.82)] pointer-events-none transition-all duration-300 animate-pulse"
          style={{
            top: `${Math.max(8, spotlightRect.top - 6)}px`,
            left: `${Math.max(8, spotlightRect.left - 6)}px`,
            width: `${spotlightRect.width + 12}px`,
            height: `${spotlightRect.height + 12}px`,
          }}
        />
      )}

      {/* Explanatory Floating Card */}
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-auto">
        <div className="w-full max-w-lg bg-[#070F26] border border-[#00DDF2]/60 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-200">
          {/* Top Bar with Step & Skip */}
          <div className="flex items-center justify-between border-b border-[#16264C] pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#00DDF2]/20 border border-[#00DDF2]/50 text-[#00DDF2] text-xs font-mono font-bold">
                ETAPA {step.step} DE {TOUR_STEPS.length}
              </span>
              <span className="text-xs font-medium text-slate-400">
                {step.subtitle}
              </span>
            </div>

            <button
              onClick={handleComplete}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Pular tour</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Title & Body */}
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00DDF2]" />
              <span>{step.title}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {step.content}
            </p>
          </div>

          {/* Step 12 Action Buttons or Navigation Buttons */}
          {step.step === 12 ? (
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={handleComplete}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#00DDF2] text-[#050B1E] font-bold text-xs hover:bg-[#5beaff] transition-all shadow-[0_0_15px_rgba(0,221,242,0.3)] flex items-center justify-center gap-2"
              >
                <span>EXPLORAR PLATAFORMA</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  handleComplete();
                  onNavigateTab('insights');
                }}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#0A1329] hover:bg-[#0F1C3C] text-[#00DDF2] font-semibold text-xs border border-[#00DDF2]/40 transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>PERGUNTAR À HARPIA</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 flex items-center justify-between border-t border-[#16264C]/70">
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  currentStepIndex === 0
                    ? 'border-transparent text-slate-600 cursor-not-allowed'
                    : 'border-[#16264C] text-slate-300 hover:text-white hover:bg-[#0A1329]'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>

              {/* Step indicator dots */}
              <div className="flex items-center gap-1">
                {TOUR_STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === currentStepIndex
                        ? 'bg-[#00DDF2] w-4'
                        : i < currentStepIndex
                        ? 'bg-slate-500'
                        : 'bg-[#16264C]'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00DDF2] text-[#050B1E] text-xs font-bold hover:bg-[#5beaff] transition-all shadow-[0_0_12px_rgba(0,221,242,0.2)]"
              >
                <span>Próximo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
