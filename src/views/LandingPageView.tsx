import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  Database,
  Users,
  Compass,
  CheckCircle2,
  Lock,
  ChevronRight,
  Activity,
  FileText,
  Search,
  Check,
  X,
} from 'lucide-react';
import { HarpiaLogo } from '../components/HarpiaLogo';

interface LandingPageViewProps {
  onNavigateLogin: () => void;
  onNavigateApp: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onNavigateLogin,
  onNavigateApp,
}) => {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoForm, setDemoForm] = useState({
    nome: '',
    email: '',
    empresa: '',
    telefone: '',
  });

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setDemoSubmitted(false);
      setDemoModalOpen(false);
      setDemoForm({ nome: '', email: '', empresa: '', telefone: '' });
    }, 2800);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050B1E] text-slate-100 flex flex-col font-sans selection:bg-[#00DDF2]/20 selection:text-[#00DDF2]">
      {/* ===================================================
          1. STICKY HEADER
         =================================================== */}
      <header className="h-20 bg-[#050B1E]/90 backdrop-blur-md border-b border-[#16264C]/80 sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <HarpiaLogo collapsed={false} />
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <button
              onClick={() => scrollToSection('produto')}
              className="hover:text-[#00DDF2] transition-colors"
            >
              Produto
            </button>
            <button
              onClick={() => scrollToSection('como-funciona')}
              className="hover:text-[#00DDF2] transition-colors"
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollToSection('score-harpia')}
              className="hover:text-[#00DDF2] transition-colors"
            >
              Score Harpia
            </button>
            <button
              onClick={() => scrollToSection('inteligencia')}
              className="hover:text-[#00DDF2] transition-colors"
            >
              Inteligência
            </button>
            <button
              onClick={() => scrollToSection('beneficios')}
              className="hover:text-[#00DDF2] transition-colors"
            >
              Benefícios
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateLogin}
            className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#0F1C3C] border border-[#16264C] rounded-xl transition-all"
          >
            ENTRAR
          </button>

          <button
            onClick={() => setDemoModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-[#050B1E] bg-[#00DDF2] hover:bg-[#5beaff] rounded-xl transition-all shadow-[0_0_15px_rgba(0,221,242,0.3)] hidden sm:flex items-center gap-1.5"
          >
            <span>SOLICITAR DEMONSTRAÇÃO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ===================================================
          2. HERO SECTION
         =================================================== */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#00DDF2]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1329] border border-[#00DDF2]/40 text-[#00DDF2] text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00DDF2] animate-pulse" />
            <span>Inteligência B2G para o Setor Educacional</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            Transforme dados públicos em{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00DDF2] to-[#00DDF2]">
              oportunidades comerciais.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A Harpia conecta indicadores fiscais, educacionais e de compras públicas para ajudar sua equipe a identificar quais municípios priorizar, quando abordar e por quê.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => setDemoModalOpen(true)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#00DDF2] text-[#050B1E] font-extrabold text-sm hover:bg-[#5beaff] transition-all shadow-[0_0_25px_rgba(0,221,242,0.35)] flex items-center justify-center gap-2"
            >
              <span>SOLICITAR DEMONSTRAÇÃO</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateApp}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0A1329] hover:bg-[#0F1C3C] text-white font-semibold text-sm border border-[#16264C] hover:border-[#00DDF2]/50 transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#00DDF2]" />
              <span>CONHECER A PLATAFORMA</span>
            </button>
          </div>

          {/* Social Proof Strip */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <span>• 5.572 Municípios Mapeados</span>
            <span>• 100% Fontes Oficiais</span>
            <span>• Algoritmo Ponderado B2G</span>
          </div>
        </div>

        {/* HERO MOCKUP / COMPOSITION */}
        <div className="mt-14 relative max-w-5xl mx-auto rounded-2xl bg-[#070F26] border border-[#16264C] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Mockup Header Strip */}
          <div className="h-10 bg-[#0A1329] border-b border-[#16264C] px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-[11px] font-mono text-slate-400">
                harpia.app/radar
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-[10px] text-amber-300 font-mono">
              Ambiente de Demonstração
            </span>
          </div>

          {/* Mockup Body Preview */}
          <div className="p-5 sm:p-7 space-y-5 bg-gradient-to-b from-[#070F26] to-[#050B1E]">
            {/* Top Cards in Mockup */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0A1329] border border-[#16264C]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Monitorados</span>
                <p className="text-xl font-bold text-white font-mono-numbers mt-0.5">5.572</p>
                <span className="text-[10px] text-emerald-400 font-mono">Território nacional</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0A1329] border border-[#00DDF2]/30 shadow-[0_0_15px_rgba(0,221,242,0.1)]">
                <span className="text-[10px] text-[#00DDF2] uppercase font-semibold">Janela 0–90 dias</span>
                <p className="text-xl font-bold text-white font-mono-numbers mt-0.5">48</p>
                <span className="text-[10px] text-emerald-400 font-mono">Abordagem imediata</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0A1329] border border-[#16264C]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Score Médio</span>
                <p className="text-xl font-bold text-white font-mono-numbers mt-0.5">72.4</p>
                <span className="text-[10px] text-slate-400 font-mono">Escala de 0 a 100</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0A1329] border border-[#16264C]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Fontes Auditadas</span>
                <p className="text-xl font-bold text-white font-mono-numbers mt-0.5">8</p>
                <span className="text-[10px] text-[#00DDF2] font-mono">Siconfi, PNCP, INEP</span>
              </div>
            </div>

            {/* Opportunity Highlight Row */}
            <div className="p-4 rounded-xl bg-[#0A1329] border border-[#00DDF2]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#00DDF2]/20 border border-[#00DDF2]/50 flex items-center justify-center text-[#00DDF2] font-bold">
                  87
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-white">Município Alfa</strong>
                    <span className="px-1.5 py-0.2 rounded bg-[#16264C] text-[10px] font-mono text-white">PA</span>
                    <span className="px-2 py-0.2 rounded bg-emerald-500/15 border border-emerald-500/30 text-[10px] text-emerald-400 font-bold">
                      ALTA PRIORIDADE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Janela: 0–90 dias · Fiscal 28/30 · Educação 22/25 · Contratos vigentes encerrando em 68 dias
                  </p>
                </div>
              </div>

              <button
                onClick={onNavigateApp}
                className="px-3.5 py-1.5 rounded-lg bg-[#00DDF2] text-[#050B1E] text-xs font-bold hover:bg-[#5beaff] transition-colors self-start sm:self-center shrink-0 flex items-center gap-1.5"
              >
                <span>Ver Dossiê</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          3. SECTION — THE PROBLEM
         =================================================== */}
      <section id="problema" className="py-20 border-t border-[#16264C]/70 bg-[#070F26]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono text-[#00DDF2] uppercase tracking-wider">
              O Desafio do Mercado B2G
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Dados existem. O desafio é saber onde está a oportunidade.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0A1329] border border-[#16264C] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Dados Fragmentados</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Informações orçamentárias no Siconfi, indicadores pedagógicos no INEP, editais dispersos em dezenas de diários oficiais e PNCP. Conectar essas pontas manualmente consome semanas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0A1329] border border-[#16264C] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Timing Inadequado</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Abordar tarde demais significa encontrar um pregão já em andamento ou orçamento esgotado. Abordar cedo demais sem planejamento gera reuniões infrutíferas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0A1329] border border-[#16264C] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Falta de Contexto</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Listas estáticas de municípios com CNPJ não mostram a saúde fiscal, a urgência pedagógica nem o histórico de fornecimento da rede pública.
              </p>
            </div>
          </div>

          {/* Highlight Quote Box */}
          <div className="p-6 rounded-2xl bg-[#050B1E] border border-[#00DDF2]/30 text-center max-w-3xl mx-auto shadow-[0_0_30px_rgba(0,221,242,0.08)]">
            <p className="text-base sm:text-lg font-semibold text-slate-200 italic">
              “Uma decisão comercial não começa com uma lista de municípios. Começa com contexto.”
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================
          4. SECTION — HOW HARPIA WORKS
         =================================================== */}
      <section id="como-funciona" className="py-20 border-t border-[#16264C]/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono text-[#00DDF2] uppercase tracking-wider">
              Metodologia Harpia
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Como transformamos dados em receita pública
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-[#0A1329] border border-[#16264C] space-y-3 relative">
              <span className="text-2xl font-black font-mono text-[#00DDF2]">01</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">COLETAR</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mapeamento de bases públicas e fontes de referência governamentais: finanças, educação, compras e canais oficiais.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0A1329] border border-[#16264C] space-y-3 relative">
              <span className="text-2xl font-black font-mono text-[#00DDF2]">02</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">CONECTAR</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Normalização e padronização dos indicadores municipais para permitir comparação justa e análise em escala nacional.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0A1329] border border-[#16264C] space-y-3 relative">
              <span className="text-2xl font-black font-mono text-[#00DDF2]">03</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">PRIORIZAR</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Aplicação do algoritmo Score Harpia (0 a 100) para separar ruído de oportunidade comercial concreta.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0A1329] border border-[#16264C] space-y-3 relative">
              <span className="text-2xl font-black font-mono text-[#00DDF2]">04</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">EXPLICAR</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Copiloto com IA que detalha sinais favoráveis, riscos de governança, janela de contratação e recomenda a próxima ação comercial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          5. SECTION — SCORE HARPIA (FIVE DIMENSIONS)
         =================================================== */}
      <section id="score-harpia" className="py-20 border-t border-[#16264C]/70 bg-[#070F26]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono text-[#00DDF2] uppercase tracking-wider">
              Algoritmo de Priorização
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Cinco dimensões. Uma visão da oportunidade.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Cada município recebe uma pontuação consolidada de 0 a 100 com pesos balanceados para o segmento educacional.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
            <div className="p-4 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-[#00DDF2] font-mono-numbers">30</span>
                <span className="text-[10px] text-slate-400 font-mono">pontos</span>
              </div>
              <h3 className="text-xs font-bold text-white">Capacidade Fiscal</h3>
              <p className="text-[11px] text-slate-400 leading-snug">
                Receita Corrente Líquida, arrecadação própria, aplicação de 25% na educação e restos a pagar.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-teal-400 font-mono-numbers">25</span>
                <span className="text-[10px] text-slate-400 font-mono">pontos</span>
              </div>
              <h3 className="text-xs font-bold text-white">Necessidade Educacional</h3>
              <p className="text-[11px] text-slate-400 leading-snug">
                Metas do IDEB nos anos iniciais e finais, proficiência SAEB, taxas de abandono e distorção.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-cyan-400 font-mono-numbers">25</span>
                <span className="text-[10px] text-slate-400 font-mono">pontos</span>
              </div>
              <h3 className="text-xs font-bold text-white">Oportunidade Contratação</h3>
              <p className="text-[11px] text-slate-400 leading-snug">
                Proximidade de expiração de contratos vigentes, histórico de compras e PCA/LOA.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-indigo-400 font-mono-numbers">10</span>
                <span className="text-[10px] text-slate-400 font-mono">pontos</span>
              </div>
              <h3 className="text-xs font-bold text-white">Acesso Institucional</h3>
              <p className="text-[11px] text-slate-400 leading-snug">
                Estrutura de lideranças mapeada, canais institucionais e portais oficiais verificados.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-violet-400 font-mono-numbers">10</span>
                <span className="text-[10px] text-slate-400 font-mono">pontos</span>
              </div>
              <h3 className="text-xs font-bold text-white">Governança & Risco</h3>
              <p className="text-[11px] text-slate-400 leading-snug">
                Registros de auditoria em tribunais de contas (TCE) e transparência da gestão pública.
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
            * O Score Harpia apoia a priorização comercial e não representa previsão ou garantia de contratação.
          </p>
        </div>
      </section>

      {/* ===================================================
          6. SECTION — INTELLIGENCE (HARPIA INSIGHTS)
         =================================================== */}
      <section id="inteligencia" className="py-20 border-t border-[#16264C]/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono text-[#00DDF2] uppercase tracking-wider">
              Copiloto com IA
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Não basta dizer onde. É preciso explicar por quê.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Converse diretamente com o conjunto de dados da plataforma através de linguagem natural.
            </p>
          </div>

          {/* Interactive AI Preview Card */}
          <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-[#070F26] border border-[#00DDF2]/40 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00DDF2]">
              <Sparkles className="w-4 h-4" />
              <span>Pergunta Exemplo:</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0A1329] border border-[#16264C] text-sm font-semibold text-white">
              “Quais municípios apresentam oportunidade nos próximos 90 dias?”
            </div>

            {/* Answer Display */}
            <div className="p-4 rounded-xl bg-[#050B1E] border border-[#16264C] space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-[#16264C] pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Conclusão Executiva
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-[10px]">
                  JANELA IMINENTE
                </span>
              </div>

              <p className="text-slate-200 leading-relaxed">
                Município Alfa (PA) lidera a janela imediata com contrato de software de gestão educacional expirando em 68 dias e superávit financeiro de R$ 14,2M. Município Beta (SP) tramita renovação no PCA.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Sinais Favoráveis:</span>
                  <ul className="text-slate-300 space-y-0.5 list-disc list-inside text-[11px]">
                    <li>Contrato vigente com vigência até 12/04</li>
                    <li>Aplicação constitucional em 27,8%</li>
                  </ul>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">Cautelas:</span>
                  <ul className="text-slate-300 space-y-0.5 list-disc list-inside text-[11px]">
                    <li>Validação formal do termo de referência</li>
                    <li>Ano eleitoral com prazos estritos</li>
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-[#16264C] flex items-center justify-between text-[10.5px] text-slate-400">
                <span>Fontes: PNCP, Siconfi, INEP Censo Escolar</span>
                <span className="font-mono text-emerald-400 font-bold">Confiança Alta (92%)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          7. SECTION — PRODUCT FEATURES
         =================================================== */}
      <section id="produto" className="py-20 border-t border-[#16264C]/70 bg-[#070F26]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono text-[#00DDF2] uppercase tracking-wider">
              Módulos da Plataforma
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Tudo o que sua equipe precisa para vencer em B2G
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-[#0A1329] border border-[#16264C] hover:border-[#00DDF2]/50 transition-all space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#00DDF2]/15 text-[#00DDF2] flex items-center justify-center font-bold">
                <Search className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Radar de Municípios</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tabela dinâmica com filtros cruzados por UF, score, janela de contratação e exportação em CSV.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0A1329] border border-[#16264C] hover:border-[#00DDF2]/50 transition-all space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#00DDF2]/15 text-[#00DDF2] flex items-center justify-center font-bold">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Mapa de Oportunidades</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Navegação vetorial pelos 26 estados + DF com intensidade de oportunidades e filtros por macrorregião.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0A1329] border border-[#16264C] hover:border-[#00DDF2]/50 transition-all space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#00DDF2]/15 text-[#00DDF2] flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Ficha Municipal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Raio-X completo em 7 abas com IDEB, finanças, compras anteriores, contatos de dirigentes e governança.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0A1329] border border-[#16264C] hover:border-[#00DDF2]/50 transition-all space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#00DDF2]/15 text-[#00DDF2] flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Harpia Insights</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Copiloto de decisão comercial acionado por IA em linguagem natural para cruzar teses e comparar municípios.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0A1329] border border-[#16264C] hover:border-[#00DDF2]/50 transition-all space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#00DDF2]/15 text-[#00DDF2] flex items-center justify-center font-bold">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Monitoramento</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Watchlist dedicada com notificações de mudanças em contratos, publicações no PNCP e recálculo de scores.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0A1329] border border-[#16264C] hover:border-[#00DDF2]/50 transition-all space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#00DDF2]/15 text-[#00DDF2] flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Pipeline B2G</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fluxo Kanban estruturado em Abordagem Imediata, Relacionamento Institucional e Acompanhamento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          8. SECTION — BENEFITS
         =================================================== */}
      <section id="beneficios" className="py-20 border-t border-[#16264C]/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono text-[#00DDF2] uppercase tracking-wider">
              Resultados Comerciais
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Mais inteligência para sua estratégia B2G
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Priorize melhor sua equipe comercial',
              'Identifique o momento adequado de abordagem',
              'Reduza dias de pesquisa manual',
              'Centralize informações dispersas',
              'Explique decisões comerciais com evidências',
              'Monitore oportunidades estratégicas continuamente',
            ].map((beneficio, i) => (
              <div
                key={i}
                className="p-5 rounded-xl bg-[#0A1329] border border-[#16264C] flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-[#00DDF2]/15 border border-[#00DDF2]/40 flex items-center justify-center text-[#00DDF2] shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                  {beneficio}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          9. FINAL CTA SECTION
         =================================================== */}
      <section className="py-24 border-t border-[#16264C]/80 bg-gradient-to-b from-[#070F26] to-[#050B1E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Encontre as oportunidades antes de começar a procurar.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Conheça como a Harpia pode transformar dados públicos em inteligência comercial para sua empresa.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => setDemoModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#00DDF2] text-[#050B1E] font-bold text-sm hover:bg-[#5beaff] transition-all shadow-[0_0_25px_rgba(0,221,242,0.35)] flex items-center justify-center gap-2"
            >
              <span>SOLICITAR DEMONSTRAÇÃO</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateApp}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0F1C3C] hover:bg-[#16264C] text-white font-semibold text-sm border border-[#16264C] transition-colors"
            >
              ENTRAR NA PLATAFORMA
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================
          10. FOOTER
         =================================================== */}
      <footer className="border-t border-[#16264C] bg-[#050B1E] py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <HarpiaLogo collapsed={false} />
            <span className="text-slate-600">|</span>
            <span>Inteligência B2G para Educação</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Privacidade & Governança</span>
            <span>Termos de Uso</span>
            <span className="font-mono text-slate-400">© 2026 HARPIA TECH</span>
          </div>
        </div>
      </footer>

      {/* ===================================================
          DEMO REQUEST MODAL
         =================================================== */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050B1E]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0A1329] border border-[#00DDF2]/50 rounded-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => setDemoModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {demoSubmitted ? (
              <div className="py-8 text-center space-y-3 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Solicitação Recebida</h3>
                <p className="text-xs text-slate-300">
                  Nossa equipe de inteligência B2G entrará em contato em breve para apresentar a plataforma com seus municípios de interesse.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Solicitar Demonstração</h3>
                  <p className="text-xs text-slate-400">
                    Preencha os dados abaixo para receber uma demonstração personalizada da Harpia Tech.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Nome completo</label>
                    <input
                      type="text"
                      required
                      value={demoForm.nome}
                      onChange={(e) => setDemoForm({ ...demoForm, nome: e.target.value })}
                      placeholder="Ex: Carlos Mendes"
                      className="w-full px-3 py-2 rounded-xl bg-[#050B1E] border border-[#16264C] text-white focus:outline-none focus:border-[#00DDF2]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">E-mail corporativo</label>
                    <input
                      type="email"
                      required
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                      placeholder="carlos@empresa.com.br"
                      className="w-full px-3 py-2 rounded-xl bg-[#050B1E] border border-[#16264C] text-white focus:outline-none focus:border-[#00DDF2]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Empresa</label>
                    <input
                      type="text"
                      required
                      value={demoForm.empresa}
                      onChange={(e) => setDemoForm({ ...demoForm, empresa: e.target.value })}
                      placeholder="Nome da sua EdTech ou editora"
                      className="w-full px-3 py-2 rounded-xl bg-[#050B1E] border border-[#16264C] text-white focus:outline-none focus:border-[#00DDF2]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Telefone / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={demoForm.telefone}
                      onChange={(e) => setDemoForm({ ...demoForm, telefone: e.target.value })}
                      placeholder="(11) 98765-4321"
                      className="w-full px-3 py-2 rounded-xl bg-[#050B1E] border border-[#16264C] text-white focus:outline-none focus:border-[#00DDF2]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setDemoModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#00DDF2] text-[#050B1E] text-xs font-bold hover:bg-[#5beaff] transition-all shadow-[0_0_12px_rgba(0,221,242,0.3)]"
                  >
                    Confirmar Envio
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
