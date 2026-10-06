import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronRight,
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
    }, 2500);
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
          1. RESTRAINED INSTITUTIONAL HEADER
         =================================================== */}
      <header className="h-16 bg-[#050B1E]/95 border-b border-[#16264C]/70 sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div
            className="cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <HarpiaLogo collapsed={false} />
          </div>

          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-300">
            <button
              onClick={() => scrollToSection('produto')}
              className="hover:text-white transition-colors"
            >
              Produto
            </button>
            <button
              onClick={() => scrollToSection('como-funciona')}
              className="hover:text-white transition-colors"
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollToSection('score-harpia')}
              className="hover:text-white transition-colors"
            >
              Score Harpia
            </button>
            <button
              onClick={() => scrollToSection('inteligencia')}
              className="hover:text-white transition-colors"
            >
              Inteligência
            </button>
            <button
              onClick={() => scrollToSection('beneficios')}
              className="hover:text-white transition-colors"
            >
              Benefícios
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateLogin}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            Entrar
          </button>

          <button
            onClick={() => setDemoModalOpen(true)}
            className="px-4 py-1.5 text-xs font-semibold text-[#050B1E] bg-[#00DDF2] hover:bg-[#5beaff] rounded-lg transition-colors"
          >
            Solicitar demonstração
          </button>
        </div>
      </header>

      {/* ===================================================
          2. NEW EDITORIAL SPLIT HERO
         =================================================== */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Clear, confident editorial headline */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-bold text-white tracking-tight leading-[1.15]">
              Inteligência para vender melhor ao setor público.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              A Harpia organiza dados fiscais, educacionais e de compras públicas para indicar onde estão as melhores oportunidades comerciais — e por quê.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setDemoModalOpen(true)}
                className="px-6 py-3 rounded-lg bg-[#00DDF2] text-[#050B1E] font-bold text-xs hover:bg-[#5beaff] transition-colors flex items-center justify-center gap-2 text-center"
              >
                <span>SOLICITAR DEMONSTRAÇÃO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onNavigateApp}
                className="px-6 py-3 rounded-lg bg-[#0A1329] hover:bg-[#0F1C3C] text-slate-200 hover:text-white font-medium text-xs border border-[#16264C] transition-colors text-center"
              >
                ENTRAR NA PLATAFORMA
              </button>
            </div>

            <p className="text-xs text-slate-400 font-normal">
              Inteligência B2G para empresas que atendem o setor público educacional.
            </p>
          </div>

          {/* Right Column: Faithful, realistic representation of the actual Harpia interface */}
          <div className="lg:col-span-6">
            <div className="bg-[#0A1329] border border-[#16264C] rounded-xl overflow-hidden shadow-2xl">
              {/* Internal platform header preview */}
              <div className="px-5 py-3.5 border-b border-[#16264C] flex items-center justify-between bg-[#070F26]">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-white">Radar de Municípios</span>
                  <span className="text-slate-500 text-xs">/</span>
                  <span className="text-[11px] text-slate-400 font-mono">5.572 analisados</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#16264C] text-[10px] text-[#00DDF2] font-mono font-medium">
                    0–90 dias: 48
                  </span>
                </div>
              </div>

              {/* Realistic table view snippet */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#16264C] text-slate-400 bg-[#050B1E]/60 text-[11px]">
                      <th className="py-2.5 px-4 font-medium">Município</th>
                      <th className="py-2.5 px-3 font-medium">UF</th>
                      <th className="py-2.5 px-3 font-medium text-center">Score</th>
                      <th className="py-2.5 px-3 font-medium">Janela</th>
                      <th className="py-2.5 px-4 font-medium">Prioridade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#16264C]/50 text-slate-300">
                    <tr className="bg-[#0F1C3C]/40">
                      <td className="py-3 px-4 font-semibold text-white">Município Alfa</td>
                      <td className="py-3 px-3 font-mono text-slate-400">PA</td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono font-bold text-[#00DDF2]">87</span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">0–90 dias</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-semibold text-[10px] border border-emerald-500/30">
                          Imediata
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-white">Município Beta</td>
                      <td className="py-3 px-3 font-mono text-slate-400">SP</td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono font-bold text-white">79</span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">91–180 dias</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-[#00DDF2]/15 text-[#00DDF2] font-semibold text-[10px] border border-[#00DDF2]/30">
                          Próxima
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-white">Município Gama</td>
                      <td className="py-3 px-3 font-mono text-slate-400">MG</td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono font-bold text-white">72</span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">181–365 dias</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 font-semibold text-[10px] border border-indigo-500/30">
                          Estratégica
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-white">Município Delta</td>
                      <td className="py-3 px-3 font-mono text-slate-400">PR</td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono font-bold text-white">68</span>
                      </td>
                      <td className="py-3 px-3 text-slate-400">Sem sinal</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium text-[10px]">
                          Monitorar
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bottom detail pill */}
              <div className="px-4 py-2.5 bg-[#050B1E] border-t border-[#16264C] flex items-center justify-between text-[11px] text-slate-400">
                <span>Dossiê Alfa: Contrato de software educacional expirando em 68 dias</span>
                <span className="text-[#00DDF2] font-medium">Ver Ficha →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          3. SECTION 1 — LARGE STATEMENT & 3 CONCISE COLUMNS
         =================================================== */}
      <section className="py-20 border-t border-[#16264C]/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-snug">
              5.572 municípios. Milhares de sinais. Uma leitura objetiva de prioridade.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-4 border-t border-[#16264C]/40">
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-[#00DDF2] tracking-wider uppercase font-semibold">
                Onde Atuar
              </span>
              <h3 className="text-base font-semibold text-white">
                Identifique municípios com maior aderência
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cruze capacidade orçamentária, cumprimento constitucional dos 25% em educação e vulnerabilidade de aprendizagem.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono text-[#00DDF2] tracking-wider uppercase font-semibold">
                Quando Abordar
              </span>
              <h3 className="text-base font-semibold text-white">
                Entenda a janela de contratação
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Monitore o término de vigência de contratos anteriores e previsões no Plano de Contratações Anual para chegar no momento certo.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono text-[#00DDF2] tracking-wider uppercase font-semibold">
                Por Que Priorizar
              </span>
              <h3 className="text-base font-semibold text-white">
                Veja os sinais que sustentam cada recomendação
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Toda prioridade é acompanhada de evidências públicas, fontes auditadas e cautelas regulatórias claras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          4. SECTION 2 — PRODUCT (AVOID CARDS)
         =================================================== */}
      <section id="produto" className="py-20 border-t border-[#16264C]/70 bg-[#070F26]/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Short Explanation */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Da visão nacional ao detalhe de cada município.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Compare, filtre e aprofunde a análise sem depender de dezenas de planilhas e portais separados.
              </p>

              <div className="pt-2 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="text-[#00DDF2] mt-0.5">•</span>
                  <span>Filtros combinados por estado, macrorregião, score e janela temporal.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00DDF2] mt-0.5">•</span>
                  <span>Ficha Municipal estruturada em finanças, IDEB/SAEB, contratos e governança.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00DDF2] mt-0.5">•</span>
                  <span>Organização em pipeline comercial tipo Kanban para abordagem imediata.</span>
                </div>
              </div>
            </div>

            {/* Right: Actual Product Visual Snippet */}
            <div className="lg:col-span-7 bg-[#0A1329] border border-[#16264C] rounded-xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#16264C] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Ficha Municipal · Município Alfa, PA</h3>
                  <p className="text-[11px] text-slate-400">128.400 habitantes · Região Norte</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-[#00DDF2] font-mono-numbers">87</span>
                  <span className="text-xs text-slate-400">/100</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded bg-[#050B1E] border border-[#16264C]">
                  <span className="text-[10px] text-slate-400 block">RCL Anual</span>
                  <span className="font-semibold text-white font-mono-numbers">R$ 214,8 M</span>
                </div>
                <div className="p-2.5 rounded bg-[#050B1E] border border-[#16264C]">
                  <span className="text-[10px] text-slate-400 block">Invest. Educação</span>
                  <span className="font-semibold text-emerald-400 font-mono-numbers">27,8% (LOA)</span>
                </div>
                <div className="p-2.5 rounded bg-[#050B1E] border border-[#16264C]">
                  <span className="text-[10px] text-slate-400 block">IDEB Anos Iniciais</span>
                  <span className="font-semibold text-white font-mono-numbers">4.8 (meta 5.4)</span>
                </div>
                <div className="p-2.5 rounded bg-[#050B1E] border border-[#16264C]">
                  <span className="text-[10px] text-slate-400 block">Vigência Atual</span>
                  <span className="font-semibold text-[#00DDF2] font-mono-numbers">Expira em 68d</span>
                </div>
              </div>

              <div className="p-3 rounded bg-[#050B1E] border border-[#16264C] text-xs text-slate-300 leading-relaxed">
                <strong className="text-white">Leitura Harpia:</strong> Alta capacidade fiscal combinada com defasagem nas metas do IDEB e encerramento iminente de contrato de tecnologia educacional contratado em 2024.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          5. SECTION 3 — SCORE (HORIZONTAL COMPOSITION)
         =================================================== */}
      <section id="score-harpia" className="py-20 border-t border-[#16264C]/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Um score que mostra prioridade — e explica os motivos.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              O Score Harpia consolida 5 dimensões analíticas ponderadas para refletir potencial e momento de contratação.
            </p>
          </div>

          {/* One horizontal analytical composition */}
          <div className="border border-[#16264C] rounded-xl bg-[#0A1329] p-6 lg:p-8">
            <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-[#16264C]">
              <div className="p-4 md:px-5 space-y-1.5">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#00DDF2]">
                  30 <span className="text-xs font-normal text-slate-400">pts</span>
                </div>
                <h3 className="text-xs font-semibold text-white">Capacidade Fiscal</h3>
                <p className="text-[11px] text-slate-400 leading-snug">
                  RCL, arrecadação própria e cumprimento dos 25% na educação.
                </p>
              </div>

              <div className="p-4 md:px-5 space-y-1.5">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
                  25 <span className="text-xs font-normal text-slate-400">pts</span>
                </div>
                <h3 className="text-xs font-semibold text-white">Necessidade Educacional</h3>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Metas do IDEB, proficiência no SAEB e distorção idade-série.
                </p>
              </div>

              <div className="p-4 md:px-5 space-y-1.5">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
                  25 <span className="text-xs font-normal text-slate-400">pts</span>
                </div>
                <h3 className="text-xs font-semibold text-white">Oportunidade Contratação</h3>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Proximidade do fim de contratos vigentes e PCA/LOA.
                </p>
              </div>

              <div className="p-4 md:px-5 space-y-1.5">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
                  10 <span className="text-xs font-normal text-slate-400">pts</span>
                </div>
                <h3 className="text-xs font-semibold text-white">Acesso Institucional</h3>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Órgãos e canais oficiais confirmados de dirigentes e secretarias.
                </p>
              </div>

              <div className="p-4 md:px-5 space-y-1.5">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
                  10 <span className="text-xs font-normal text-slate-400">pts</span>
                </div>
                <h3 className="text-xs font-semibold text-white">Governança</h3>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Regularidade perante Tribunais de Contas e transparência.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#16264C] flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 gap-2">
              <span>Total: 100 pontos</span>
              <span>O score apoia a priorização comercial e não representa previsão ou garantia de compra.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          6. SECTION 4 — HARPIA INSIGHTS (ASYMMETRICAL LAYOUT)
         =================================================== */}
      <section id="inteligencia" className="py-20 border-t border-[#16264C]/70 bg-[#070F26]/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Pergunte aos dados.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Use linguagem natural para comparar municípios, entender oportunidades e identificar pontos que precisam de validação.
            </p>
          </div>

          {/* Asymmetrical layout: question on left/top, answer on right/bottom */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Real Question Side (5 cols) */}
            <div className="lg:col-span-5 bg-[#0A1329] border border-[#16264C] rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-[11px] font-mono text-[#00DDF2] uppercase font-semibold">
                  Consulta Analítica
                </span>
                <p className="text-sm font-medium text-white leading-relaxed">
                  “Quais municípios combinam alta necessidade educacional e boa capacidade financeira nos próximos 90 dias?”
                </p>
              </div>

              <div className="text-[11px] text-slate-400 pt-3 border-t border-[#16264C]">
                Copiloto analítico consultando bases do Siconfi, INEP e PNCP.
              </div>
            </div>

            {/* Real Harpia Insights Answer Side (7 cols) */}
            <div className="lg:col-span-7 bg-[#050B1E] border border-[#16264C] rounded-xl p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-[#16264C] pb-2">
                <span className="font-semibold text-white">Conclusão</span>
                <span className="text-[10px] font-mono text-[#00DDF2] font-semibold">
                  Janela Imediata
                </span>
              </div>

              <p className="text-slate-200 leading-relaxed">
                Município Alfa (PA) apresenta superávit financeiro de R$ 14,2M, aplicação de 27,8% em educação e contrato vigente de sistema educacional expirando em 68 dias. IDEB em 4.8 aponta necessidade de recomposição.
              </p>

              <div className="pt-2 border-t border-[#16264C]/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-slate-400 block font-medium">Sinais objetivos:</span>
                  <span className="text-slate-300">Contrato próximo do término; disponibilidade de caixa confirmada.</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Pontos de cautela:</span>
                  <span className="text-slate-300">Ano eleitoral com restrições orçamentárias nos últimos 120 dias.</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#16264C]/60 flex items-center justify-between text-[10.5px] text-slate-400 font-mono">
                <span>Fontes: Siconfi, PNCP, INEP</span>
                <span>Confiança Alta</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          7. SECTION 5 — COMMERCIAL VALUE (EDITORIAL TYPOGRAPHY)
         =================================================== */}
      <section id="beneficios" className="py-20 border-t border-[#16264C]/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-snug">
              Menos tempo procurando informação. Mais tempo atuando onde existe oportunidade.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-[#16264C]/40">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-white tracking-wider">
                01 · PRIORIZAÇÃO
              </span>
              <h3 className="text-sm font-semibold text-white">
                Direcione o esforço comercial
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Evite abordar municípios sem capacidade orçamentária ou sem demanda real de tecnologia educacional.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-white tracking-wider">
                02 · TIMING
              </span>
              <h3 className="text-sm font-semibold text-white">
                Aborde no momento mais adequado
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Identifique certames antes da publicação do edital, no período de planejamento da LOA e elaboração do termo de referência.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-white tracking-wider">
                03 · CONTEXTO
              </span>
              <h3 className="text-sm font-semibold text-white">
                Chegue à conversa sabendo o que importa
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Conheça os dados de aprendizagem da rede e os contratos anteriores para propor soluções fundamentadas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          8. RESTRAINED FINAL CTA
         =================================================== */}
      <section className="py-20 border-t border-[#16264C]/70 bg-[#070F26]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-5">
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Encontre as oportunidades antes de começar a procurar.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Conheça como a Harpia pode transformar dados públicos em inteligência comercial para sua empresa.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setDemoModalOpen(true)}
              className="px-6 py-2.5 rounded-lg bg-[#00DDF2] text-[#050B1E] font-bold text-xs hover:bg-[#5beaff] transition-colors"
            >
              SOLICITAR DEMONSTRAÇÃO
            </button>

            <button
              onClick={onNavigateApp}
              className="px-6 py-2.5 rounded-lg bg-[#0F1C3C] hover:bg-[#16264C] text-slate-200 hover:text-white font-medium text-xs border border-[#16264C] transition-colors"
            >
              ENTRAR NA PLATAFORMA
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================
          9. FOOTER
         =================================================== */}
      <footer className="border-t border-[#16264C] bg-[#050B1E] py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <HarpiaLogo collapsed={false} />
            <span className="text-slate-600">|</span>
            <span>Inteligência B2G para Educação</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span>Privacidade & Governança</span>
            <span>Termos de Uso</span>
            <span className="font-mono text-slate-400">© 2026 HARPIA TECH</span>
          </div>
        </div>
      </footer>

      {/* ===================================================
          SOLICITAR DEMONSTRAÇÃO MODAL
         =================================================== */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050B1E]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0A1329] border border-[#16264C] rounded-xl shadow-2xl p-6 relative">
            <button
              onClick={() => setDemoModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {demoSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Solicitação Recebida</h3>
                <p className="text-xs text-slate-300">
                  Nossa equipe entrará em contato em breve para apresentar a plataforma com os seus municípios de interesse.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Solicitar Demonstração</h3>
                  <p className="text-xs text-slate-400">
                    Apresentação executiva adaptada ao segmento da sua empresa.
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
                      placeholder="Seu nome"
                      className="w-full px-3 py-2 rounded-lg bg-[#050B1E] border border-[#16264C] text-white focus:outline-none focus:border-[#00DDF2]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">E-mail corporativo</label>
                    <input
                      type="email"
                      required
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                      placeholder="nome@empresa.com.br"
                      className="w-full px-3 py-2 rounded-lg bg-[#050B1E] border border-[#16264C] text-white focus:outline-none focus:border-[#00DDF2]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Empresa</label>
                    <input
                      type="text"
                      required
                      value={demoForm.empresa}
                      onChange={(e) => setDemoForm({ ...demoForm, empresa: e.target.value })}
                      placeholder="Nome da sua EdTech ou organização"
                      className="w-full px-3 py-2 rounded-lg bg-[#050B1E] border border-[#16264C] text-white focus:outline-none focus:border-[#00DDF2]"
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
                      className="w-full px-3 py-2 rounded-lg bg-[#050B1E] border border-[#16264C] text-white focus:outline-none focus:border-[#00DDF2]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setDemoModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#00DDF2] text-[#050B1E] text-xs font-bold hover:bg-[#5beaff] transition-colors"
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
