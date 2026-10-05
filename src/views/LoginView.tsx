import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  KeyRound,
} from 'lucide-react';
import { HarpiaLogo } from '../components/HarpiaLogo';

interface LoginViewProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigateHome,
}) => {
  const [email, setEmail] = useState('diretor@harpia.tech');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 450);
  };

  const handleDemoAccess = () => {
    setEmail('diretor@harpia.tech');
    setPassword('demo2026');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#050B1E] text-slate-100 flex flex-col justify-between">
      {/* Top Bar with Back Link */}
      <div className="p-6 flex items-center justify-between max-w-7xl w-full mx-auto">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar para o site</span>
        </button>

        <span className="text-[11px] font-mono text-amber-300 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30">
          AMBIENTE DE DEMONSTRAÇÃO
        </span>
      </div>

      {/* Main Split Screen */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl bg-[#070F26] border border-[#16264C] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Left Column: Brand & Value Proposition (5 cols) */}
          <div className="md:col-span-5 p-8 bg-gradient-to-b from-[#0A1329] to-[#070F26] border-b md:border-b-0 md:border-r border-[#16264C] flex flex-col justify-between space-y-6">
            <div>
              <HarpiaLogo collapsed={false} />

              <div className="mt-8 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#00DDF2] font-semibold">
                  Inteligência B2G para Educação
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                  Decisões comerciais com dados públicos e contexto.
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Acesse o painel analítico para acompanhar 5.572 municípios brasileiros e identificar janelas imediatas de contratação.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-[#16264C]/70">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-[#00DDF2] shrink-0" />
                <span>Bases de referência 100% públicas e auditadas</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Sparkles className="w-4 h-4 text-[#00DDF2] shrink-0" />
                <span>Copiloto de IA analítica integrado</span>
              </div>
            </div>
          </div>

          {/* Right Column: Login Form & Demo Access (7 cols) */}
          <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Entrar na Plataforma
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Acesse o ambiente demonstrativo com suas credenciais ou acesso rápido.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  E-mail corporativo
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@empresa.com.br"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#050B1E] border border-[#16264C] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00DDF2] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-300">Senha</label>
                  <span className="text-[11px] text-slate-500 cursor-not-allowed">
                    Esqueceu a senha?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#050B1E] border border-[#16264C] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00DDF2] transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#00DDF2] text-[#050B1E] font-bold text-xs hover:bg-[#5beaff] transition-all shadow-[0_0_15px_rgba(0,221,242,0.25)] flex items-center justify-center gap-2"
                >
                  <span>{isLoading ? 'Autenticando...' : 'ENTRAR NA PLATAFORMA'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="relative flex items-center justify-center py-1">
                  <div className="border-t border-[#16264C] w-full" />
                  <span className="bg-[#070F26] px-3 text-[10px] uppercase font-mono text-slate-500 tracking-wider">
                    OU
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleDemoAccess}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0F1C3C] hover:bg-[#16264C] text-[#00DDF2] font-semibold text-xs border border-[#00DDF2]/30 hover:border-[#00DDF2] transition-all flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>ACESSAR AMBIENTE DEMONSTRATIVO</span>
                </button>
              </div>
            </form>

            <p className="text-[11px] text-center text-slate-500">
              Ambiente restrito a demonstrações de inteligência B2G.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Strip */}
      <div className="p-4 text-center text-xs text-slate-500 border-t border-[#16264C]/50">
        © 2026 HARPIA TECH · Todos os direitos reservados.
      </div>
    </div>
  );
};
