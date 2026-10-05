import React, { useState } from 'react';
import {
  Settings,
  Building2,
  ShieldCheck,
  Bell,
  Scale,
  RotateCcw,
  Check,
  Info,
} from 'lucide-react';

interface SettingsViewProps {
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetData }) => {
  const [resetSuccess, setResetSuccess] = useState(false);
  const [savedSettings, setSavedSettings] = useState(false);

  // Form states
  const [minAlertScore, setMinAlertScore] = useState(75);
  const [notifyShortWindow, setNotifyShortWindow] = useState(true);
  const [notifyTceAudit, setNotifyTceAudit] = useState(true);

  const handleSave = () => {
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  };

  const handleReset = () => {
    onResetData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Configurações da Plataforma
        </h1>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Gerencie parâmetros operacionais de prospecção, critérios de pontuação do Score Harpia e preferências do usuário.
        </p>
      </div>

      {/* 1. Organização & Assinatura */}
      <div className="p-5 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#00DDF2]" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Perfil da Empresa Licenciada
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Razão Social / Nome Comercial</label>
            <input
              type="text"
              readOnly
              value="EdTech Brasil Soluções Educacionais S.A."
              className="w-full px-3 py-2 rounded-lg bg-[#050B1E] border border-[#16264C] text-white cursor-not-allowed font-medium"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Plano Ativo</label>
            <input
              type="text"
              readOnly
              value="Harpia Enterprise B2G · 5.572 Municípios"
              className="w-full px-3 py-2 rounded-lg bg-[#050B1E] border border-[#16264C] text-[#00DDF2] cursor-not-allowed font-semibold"
            />
          </div>
        </div>
      </div>

      {/* 2. Composição Oficial do Score Harpia (0 a 100 pts) */}
      <div className="p-5 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Pesos Oficiais do Score Harpia (100 Pontos)
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Total: 100 pontos</span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-lg bg-[#050B1E] border border-[#16264C] flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block">Capacidade Fiscal e Financeira</span>
              <span className="text-[11px] text-slate-400">
                Arrecadação própria, RCL, cumprimento dos 25% de educação e liquidez de caixa
              </span>
            </div>
            <span className="text-sm font-bold text-[#00DDF2] font-mono-numbers shrink-0 ml-4">
              30 pts
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#050B1E] border border-[#16264C] flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block">Necessidade Educacional</span>
              <span className="text-[11px] text-slate-400">
                Déficit em relação às metas do IDEB, proficiência no SAEB, abandono e distorção
              </span>
            </div>
            <span className="text-sm font-bold text-emerald-400 font-mono-numbers shrink-0 ml-4">
              25 pts
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#050B1E] border border-[#16264C] flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block">Oportunidade de Contratação</span>
              <span className="text-[11px] text-slate-400">
                Proximidade do fim de contratos vigentes, previsão no PCA, LOA e audiências
              </span>
            </div>
            <span className="text-sm font-bold text-cyan-400 font-mono-numbers shrink-0 ml-4">
              25 pts
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#050B1E] border border-[#16264C] flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block">Acessibilidade Institucional</span>
              <span className="text-[11px] text-slate-400">
                Disponibilidade de contatos oficiais válidos da pasta educacional e compras
              </span>
            </div>
            <span className="text-sm font-bold text-indigo-400 font-mono-numbers shrink-0 ml-4">
              10 pts
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#050B1E] border border-[#16264C] flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block">Integridade, Risco e Governança</span>
              <span className="text-[11px] text-slate-400">
                Regularidade em prestações de contas perante o TCE/TCM e índices de transparência
              </span>
            </div>
            <span className="text-sm font-bold text-violet-400 font-mono-numbers shrink-0 ml-4">
              10 pts
            </span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#050B1E] border border-[#16264C] text-[11px] text-slate-300 flex items-center gap-2">
          <Info className="w-4 h-4 text-[#00DDF2] shrink-0" />
          <span>
            A pontuação organiza sinais e evidências para apoiar priorização comercial. Não prevê nem garante contratação pública.
          </span>
        </div>
      </div>

      {/* 3. Alertas e Notificações */}
      <div className="p-5 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Critérios de Alerta do Monitoramento
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-[#16264C]">
            <div>
              <span className="text-white font-medium block">Notificar janelas menores que 90 dias</span>
              <span className="text-slate-400 text-[11px]">
                Disparar aviso prioritário quando um contrato similar entrar na reta final
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifyShortWindow}
              onChange={(e) => setNotifyShortWindow(e.target.checked)}
              className="accent-[#00DDF2] w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-white font-medium block">Alertar sobre novos atos no PNCP</span>
              <span className="text-slate-400 text-[11px]">
                Sinalizar avisos de chamamento público e termos de referência educacionais
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifyTceAudit}
              onChange={(e) => setNotifyTceAudit(e.target.checked)}
              className="accent-[#00DDF2] w-4 h-4 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00DDF2] hover:bg-[#00c5d8] text-[#050B1E] text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,221,242,0.2)]"
          >
            {savedSettings ? (
              <>
                <Check className="w-4 h-4" /> Preferências Salvas!
              </>
            ) : (
              'Salvar Preferências'
            )}
          </button>
        </div>
      </div>

      {/* 4. Reset de Dados Demonstrativos (localStorage) */}
      <div className="p-5 rounded-xl bg-[#0A1329] border border-rose-500/20 space-y-3">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-rose-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Reinicializar Ambiente Demonstrativo
          </h2>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Restaura os municípios demonstrativos (Município Alfa / PA, Beta / SP, Gama / MG, etc.), histórico do pipeline e timeline para os valores iniciais de fábrica.
        </p>

        <div className="flex items-center justify-between pt-2">
          {resetSuccess ? (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-4 h-4" /> Dados restaurados com sucesso!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">
              Usa exclusivamente o armazenamento local (localStorage).
            </span>
          )}

          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors"
          >
            Resetar Dados de Demonstração
          </button>
        </div>
      </div>
    </div>
  );
};
