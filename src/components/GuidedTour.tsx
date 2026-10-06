import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  X,
  Compass,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Check,
} from 'lucide-react';
import { NavTab } from './Sidebar';

export interface TourStep {
  step: number;
  title: string;
  subtitle: string;
  content: string;
  targetTab: NavTab;
  openDemoMunicipality?: boolean;
  spotlightSelector?: string;
  allowInteraction?: boolean;
  isActionable?: boolean;
}

const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    title: 'Visão Geral & Indicadores',
    subtitle: 'Painel Executivo',
    content:
      'Acompanhe os principais indicadores consolidados e veja rapidamente onde estão as maiores concentrações de oportunidades no país.',
    targetTab: 'visao-geral',
    spotlightSelector: '#dashboard-overview-cards',
  },
  {
    step: 2,
    title: 'Score Harpia (0 a 100)',
    subtitle: 'Critério de Priorização',
    content:
      'Combina capacidade fiscal (30%), necessidade educacional (25%), oportunidade de contratação (25%), acesso institucional (10%) e governança (10%) para orientar a prioridade comercial.',
    targetTab: 'visao-geral',
    spotlightSelector: '#dashboard-score-card',
  },
  {
    step: 3,
    title: 'Radar de Municípios',
    subtitle: 'Mapeamento Analítico',
    content:
      'Acesse a base completa de municípios, ordene por score, capacidade fiscal ou urgência pedagógica e selecione qualquer linha para abrir a Ficha Municipal.',
    targetTab: 'radar',
    spotlightSelector: '#radar-table-container',
  },
  {
    step: 4,
    title: 'Busca e Filtros',
    subtitle: 'Segmentação Estratégica',
    content:
      'Filtre por estado, macrorregião, janela de contratação ou digite o nome de um município para refinar sua prospecção.',
    targetTab: 'radar',
    spotlightSelector: '#radar-filters-bar',
    allowInteraction: true,
  },
  {
    step: 5,
    title: 'Ficha Municipal',
    subtitle: 'Dossiê Completo da Oportunidade',
    content:
      'Reúne histórico financeiro, indicadores de aprendizagem (IDEB e SAEB), contratos anteriores, canais institucionais e leitura estratégica da Harpia.',
    targetTab: 'radar',
    openDemoMunicipality: true,
    spotlightSelector: '#modal-municipality-header',
  },
  {
    step: 6,
    title: 'Pipeline & Monitoramento',
    subtitle: 'Organização Comercial',
    content:
      'Estruture sua cadência comercial entre Abordagem Imediata (0–90 dias), Relacionamento (91–180 dias) e Monitoramento Estratégico.',
    targetTab: 'oportunidades',
    spotlightSelector: '#pipeline-kanban-board',
  },
  {
    step: 7,
    title: 'Harpia Insights',
    subtitle: 'Copiloto Analítico com IA',
    content:
      'Faça perguntas em linguagem natural para cruzar indicadores, comparar municípios e entender o embasamento de cada oportunidade.',
    targetTab: 'insights',
    spotlightSelector: '#insights-input-form',
    allowInteraction: true,
  },
  {
    step: 8,
    title: 'Central de Ajuda & Conclusão',
    subtitle: 'Tudo Pronto para Começar',
    content:
      'Acesse a Central de Ajuda no cabeçalho ou pressione ⌘K a qualquer momento para buscar municípios, rever o passo a passo ou tirar dúvidas.',
    targetTab: 'visao-geral',
    spotlightSelector: undefined,
  },
];

interface GuidedTourProps {
  isActive: boolean;
  initialStepIndex?: number;
  onFinishTour: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenDemoMunicipality: () => void;
  onCloseDemoMunicipality: () => void;
  showWelcomeModal: boolean;
  onStartTourFromWelcome: () => void;
  onDismissWelcomeModal: () => void;
}

interface SpotlightBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface CardPosition {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  isCentered: boolean;
}

/**
 * Polls via requestAnimationFrame until target element exists in DOM and is rendered.
 */
async function waitForElement(selector: string, timeout = 1200): Promise<HTMLElement | null> {
  const start = performance.now();
  while (performance.now() - start < timeout) {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (el && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
      return el;
    }
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  return (document.querySelector(selector) as HTMLElement | null) || null;
}

/**
 * Scrolls smoothly and polls until scrolling has stabilized.
 */
async function scrollAndStabilize(el: HTMLElement): Promise<DOMRect> {
  el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

  let lastTop = el.getBoundingClientRect().top;
  let stableCount = 0;

  for (let i = 0; i < 15; i++) {
    await new Promise((r) => setTimeout(r, 50));
    const currentTop = el.getBoundingClientRect().top;
    if (Math.abs(currentTop - lastTop) < 1) {
      stableCount++;
      if (stableCount >= 2) break;
    } else {
      stableCount = 0;
      lastTop = currentTop;
    }
  }

  return el.getBoundingClientRect();
}

export const GuidedTour: React.FC<GuidedTourProps> = ({
  isActive,
  initialStepIndex = 0,
  onFinishTour,
  onNavigateTab,
  onOpenDemoMunicipality,
  onCloseDemoMunicipality,
  showWelcomeModal,
  onStartTourFromWelcome,
  onDismissWelcomeModal,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);
  const [spotlight, setSpotlight] = useState<SpotlightBox | null>(null);
  const [cardPos, setCardPos] = useState<CardPosition>({ isCentered: true });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const currentStep = TOUR_STEPS[currentStepIndex];

  // Sync step index when initialStepIndex changes (e.g. manual restart)
  useEffect(() => {
    if (isActive) {
      setCurrentStepIndex(initialStepIndex);
    }
  }, [isActive, initialStepIndex]);

  // Calculate card position dynamically relative to spotlight box
  const calculateCardPosition = useCallback((box: SpotlightBox | null): CardPosition => {
    if (!box || currentStep.step === 8) {
      return { isCentered: true };
    }

    const cardWidth = Math.min(420, window.innerWidth - 32);
    const cardHeight = 220; // estimated card height
    const margin = 14;

    const spaceBelow = window.innerHeight - (box.top + box.height);
    const spaceAbove = box.top;
    const spaceRight = window.innerWidth - (box.left + box.width);
    const spaceLeft = box.left;

    let top: number | undefined;
    let left: number | undefined;

    // 1. Check vertical space
    if (spaceBelow >= cardHeight + margin + 10) {
      // Place below target
      top = box.top + box.height + margin;
      left = Math.max(16, Math.min(box.left, window.innerWidth - cardWidth - 16));
    } else if (spaceAbove >= cardHeight + margin + 10) {
      // Place above target
      top = Math.max(16, box.top - cardHeight - margin);
      left = Math.max(16, Math.min(box.left, window.innerWidth - cardWidth - 16));
    } else if (window.innerWidth >= 900 && spaceRight >= cardWidth + margin) {
      // Place to the right on desktop
      left = box.left + box.width + margin;
      top = Math.max(16, Math.min(box.top, window.innerHeight - cardHeight - 16));
    } else if (window.innerWidth >= 900 && spaceLeft >= cardWidth + margin) {
      // Place to the left on desktop
      left = Math.max(16, box.left - cardWidth - margin);
      top = Math.max(16, Math.min(box.top, window.innerHeight - cardHeight - 16));
    } else {
      // Fallback: place below or center if completely constrained
      top = Math.max(16, Math.min(box.top + box.height + margin, window.innerHeight - cardHeight - 16));
      left = Math.max(16, Math.min(box.left, window.innerWidth - cardWidth - 16));
    }

    return { top, left, isCentered: false };
  }, [currentStep.step]);

  // Core step update logic: navigate, wait, scroll, measure, render
  const updateSpotlight = useCallback(async () => {
    if (!isActive || !currentStep) return;

    setIsTransitioning(true);

    // 1. Navigate to target tab
    if (currentStep.targetTab) {
      onNavigateTab(currentStep.targetTab);
    }

    // 2. Open or close demo municipality
    if (currentStep.openDemoMunicipality) {
      onOpenDemoMunicipality();
    } else {
      onCloseDemoMunicipality();
    }

    // 3. Step 8 or no selector: render centered card cleanly without spotlight
    if (!currentStep.spotlightSelector) {
      setSpotlight(null);
      setCardPos({ isCentered: true });
      setIsTransitioning(false);
      return;
    }

    try {
      // 4. Wait until target element exists and is rendered
      const targetEl = await waitForElement(currentStep.spotlightSelector, 1200);

      if (!targetEl) {
        // Target not found: recover gracefully without freezing
        setSpotlight(null);
        setCardPos({ isCentered: true });
        setIsTransitioning(false);
        return;
      }

      // 5. Scroll target into view and wait for stabilization
      const rect = await scrollAndStabilize(targetEl);

      const box: SpotlightBox = {
        top: Math.max(4, rect.top - 6),
        left: Math.max(4, rect.left - 6),
        width: rect.width + 12,
        height: rect.height + 12,
      };

      setSpotlight(box);
      setCardPos(calculateCardPosition(box));
    } catch (err) {
      console.warn('Error during tour positioning:', err);
      setSpotlight(null);
      setCardPos({ isCentered: true });
    } finally {
      setIsTransitioning(false);
    }
  }, [
    isActive,
    currentStep,
    onNavigateTab,
    onOpenDemoMunicipality,
    onCloseDemoMunicipality,
    calculateCardPosition,
  ]);

  // Run update when step index or active status changes
  useEffect(() => {
    if (isActive) {
      updateSpotlight();
      localStorage.setItem('harpia_tour_last_step', String(currentStepIndex + 1));
    }
  }, [isActive, currentStepIndex, updateSpotlight]);

  // Recalculate on window resize and scroll
  useEffect(() => {
    if (!isActive || !currentStep.spotlightSelector) return;

    const handleResizeOrScroll = () => {
      const el = document.querySelector(currentStep.spotlightSelector!) as HTMLElement | null;
      if (el) {
        const rect = el.getBoundingClientRect();
        const box: SpotlightBox = {
          top: Math.max(4, rect.top - 6),
          left: Math.max(4, rect.left - 6),
          width: rect.width + 12,
          height: rect.height + 12,
        };
        setSpotlight(box);
        setCardPos(calculateCardPosition(box));
      }
    };

    window.addEventListener('resize', handleResizeOrScroll, { passive: true });
    window.addEventListener('scroll', handleResizeOrScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll);
    };
  }, [isActive, currentStep.spotlightSelector, calculateCardPosition]);

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
    localStorage.setItem('harpia_tour_completed', 'true');
    localStorage.removeItem('harpia_tour_last_step');
    setCurrentStepIndex(0);
    setSpotlight(null);
  };

  // 1. FIRST ACCESS WELCOME MODAL
  if (showWelcomeModal) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050B1E]/75 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0A1329] border border-[#16264C] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-6 sm:p-7 space-y-5 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#00DDF2]/10 border border-[#00DDF2]/30 flex items-center justify-center text-[#00DDF2] mx-auto">
            <Compass className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Bem-vindo à Harpia Tech
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
              Vamos apresentar em poucos passos como identificar, analisar e acompanhar oportunidades comerciais no setor público.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={onStartTourFromWelcome}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#00DDF2] text-[#050B1E] font-bold text-xs hover:bg-[#5beaff] transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,221,242,0.25)]"
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

          <p className="text-[11px] text-slate-400">
            Você pode reiniciar o tutorial a qualquer momento na Central de Ajuda ou em Configurações.
          </p>
        </div>
      </div>
    );
  }

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none">
      {/* Lighter backdrop so user still understands interface context */}
      <div className="absolute inset-0 bg-[#050B1E]/65 transition-opacity duration-200" />

      {/* Stable Cyan Spotlight without excessive animation */}
      {spotlight && (
        <div
          className="absolute border border-[#00DDF2] rounded-xl shadow-[0_0_15px_rgba(0,221,242,0.35),0_0_0_9999px_rgba(5,11,30,0.65)] pointer-events-none transition-all duration-200 ease-out"
          style={{
            top: `${spotlight.top}px`,
            left: `${spotlight.left}px`,
            width: `${spotlight.width}px`,
            height: `${spotlight.height}px`,
          }}
        />
      )}

      {/* Explanatory Tour Card (positioned dynamically close to target, or centered) */}
      <div
        ref={cardRef}
        className={`pointer-events-auto transition-all duration-200 ease-out ${
          cardPos.isCentered
            ? 'fixed inset-0 flex items-center justify-center p-4'
            : 'absolute'
        }`}
        style={
          !cardPos.isCentered && cardPos.top !== undefined && cardPos.left !== undefined
            ? {
                top: `${cardPos.top}px`,
                left: `${cardPos.left}px`,
                width: `${Math.min(420, window.innerWidth - 32)}px`,
              }
            : undefined
        }
      >
        <div className="w-full max-w-md bg-[#0A1329] border border-[#16264C] rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.85)] p-5 space-y-3.5">
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-[#16264C] pb-2.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#00DDF2]/15 text-[#00DDF2] text-[11px] font-mono font-bold">
                Passo {currentStep.step} de {TOUR_STEPS.length}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {currentStep.subtitle}
              </span>
            </div>

            <button
              onClick={handleComplete}
              className="text-xs text-slate-400 hover:text-white transition-colors"
              title="Pular tutorial"
            >
              Pular
            </button>
          </div>

          {/* Title & Explanation Content */}
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-white tracking-tight">
              {currentStep.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentStep.content}
            </p>
          </div>

          {/* Step 8 (Final) vs Navigation Buttons */}
          {currentStep.step === 8 ? (
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={handleComplete}
                className="w-full sm:flex-1 py-2 px-3 rounded-lg bg-[#00DDF2] text-[#050B1E] font-bold text-xs hover:bg-[#5beaff] transition-colors flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(0,221,242,0.2)]"
              >
                <span>EXPLORAR PLATAFORMA</span>
                <Check className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  handleComplete();
                  onNavigateTab('insights');
                }}
                className="w-full sm:flex-1 py-2 px-3 rounded-lg bg-[#0F1C3C] hover:bg-[#16264C] text-[#00DDF2] font-semibold text-xs border border-[#16264C] transition-colors flex items-center justify-center gap-1.5"
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
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  currentStepIndex === 0
                    ? 'text-slate-600 cursor-not-allowed'
                    : 'text-slate-300 hover:text-white hover:bg-[#0F1C3C]'
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
                    className={`h-1 rounded-full transition-all ${
                      i === currentStepIndex
                        ? 'bg-[#00DDF2] w-3.5'
                        : i < currentStepIndex
                        ? 'bg-slate-500 w-1'
                        : 'bg-[#16264C] w-1'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {/* Entendi button for fluid confirmation */}
                <button
                  onClick={handleNext}
                  className="px-3 py-1.5 rounded-lg bg-[#00DDF2] text-[#050B1E] text-xs font-bold hover:bg-[#5beaff] transition-colors flex items-center gap-1 shadow-[0_0_10px_rgba(0,221,242,0.2)]"
                >
                  <span>{currentStep.step === 7 ? 'Próximo' : 'Entendi'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
