import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Landmark,
  GraduationCap,
  ShoppingBag,
  Users,
  Scale,
  Database,
  Info,
  Bookmark,
  BookmarkCheck,
  Building2,
  Clock,
  Download,
  ShieldCheck,
  Zap,
  Target,
  Compass,
  PhoneCall,
  Activity,
  Flame,
} from 'lucide-react';
import { Municipality } from '../types';
import { ContextualHelp } from './ContextualHelp';
import { getSignalsForMunicipio } from '../data/harpiaSignals';
import { jsPDF } from 'jspdf';

interface MunicipalityDetailModalProps {
  municipality: Municipality | null;
  onClose: () => void;
  onToggleMonitoring: (id: string) => void;
  onChangePipelineStage?: (id: string, stage: Municipality['pipelineStage']) => void;
}

type TabType = 'visao-geral' | 'financeiro' | 'educacao' | 'compras' | 'acesso' | 'governanca' | 'fontes';

export const MunicipalityDetailModal: React.FC<MunicipalityDetailModalProps> = ({
  municipality,
  onClose,
  onToggleMonitoring,
  onChangePipelineStage,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('visao-geral');
  const [exportNotice, setExportNotice] = useState(false);

  if (!municipality) return null;

  const { score, financeiro, educacao, compras, acesso, governanca, leituraHarpia } = municipality;

  // Format currency
  const fmtCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleExport = () => {
    try {
      const doc = new jsPDF();

      // Header Banner
      doc.setFillColor(5, 11, 30);
      doc.rect(0, 0, 210, 36, 'F');

      doc.setTextColor(0, 221, 242);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text('HARPIA TECH · DOSSIÊ EXECUTIVO B2G', 14, 16);

      doc.setTextColor(180, 195, 220);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text('Inteligência Comercial & Radar de Oportunidades Municipais', 14, 23);
      doc.text(
        `Gerado em: ${new Date().toLocaleDateString('pt-BR')} · Ambiente Demonstrativo`,
        14,
        29
      );

      // Municipality Title
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(17);
      doc.setFont('helvetica', 'bold');
      doc.text(`${municipality.nome} / ${municipality.uf}`, 14, 47);

      const porteDesc =
        municipality.populacao > 100000
          ? 'Grande porte'
          : municipality.populacao > 50000
          ? 'Médio porte'
          : 'Pequeno porte';

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(
        `Região: ${municipality.regiao} | População: ${municipality.populacao.toLocaleString('pt-BR')} hab. | Porte: ${porteDesc}`,
        14,
        54
      );

      // Score Harpia Box
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(0, 221, 242);
      doc.setLineWidth(0.5);
      doc.roundedRect(14, 60, 182, 30, 2, 2, 'FD');

      doc.setFontSize(11);
      doc.setTextColor(2, 132, 199);
      doc.setFont('helvetica', 'bold');
      doc.text(
        `SCORE HARPIA: ${score.total} / 100 PTS  (${municipality.prioridade.toUpperCase()})`,
        18,
        69
      );

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(
        `• Fiscal: ${score.fiscal}/30 pts   • Educação: ${score.educacao}/25 pts   • Contratação: ${score.contratacao}/25 pts`,
        18,
        77
      );
      doc.text(
        `• Acesso: ${score.acesso}/10 pts   • Governança: ${score.governanca}/10 pts   • Janela: ${municipality.janela}`,
        18,
        84
      );

      // 1. Commercial Direction
      let y = 100;
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text('1. DIRECIONAMENTO COMERCIAL B2G', 14, y);
      y += 6;

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(2, 132, 199);
      doc.text('Principal Sinal:', 14, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const splitSignal = doc.splitTextToSize(
        municipality.principalSinal || 'Sinal mapeado em fontes públicas de referência',
        140
      );
      doc.text(splitSignal, 45, y);
      y += splitSignal.length * 4.5 + 2;

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(2, 132, 199);
      doc.text('Próxima Ação:', 14, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(16, 120, 60);
      const splitAction = doc.splitTextToSize(leituraHarpia.proximaAcao, 140);
      doc.text(splitAction, 45, y);
      y += splitAction.length * 4.5 + 2;

      if (municipality.melhorMomento) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(2, 132, 199);
        doc.text('Janela Ideal:', 14, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        doc.text(municipality.melhorMomento, 45, y);
        y += 6;
      }

      // 2. Financial & Educational
      y += 2;
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text('2. INDICADORES FISCAIS E EDUCACIONAIS', 14, y);
      y += 6;

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(
        `• RCL: ${fmtCurrency(financeiro.rcl)} | Arrecadação Própria: ${financeiro.arrecadacaoPropriaPct}%`,
        14,
        y
      );
      y += 4.5;
      doc.text(
        `• Orçamento em Educação: ${fmtCurrency(financeiro.orcamentoEducacao)} (${financeiro.orcamentoEducacaoPct}% da RCL)`,
        14,
        y
      );
      y += 4.5;
      doc.text(
        `• IDEB Iniciais: ${educacao.aprendizagem.idebIniciais} (Meta: ${educacao.aprendizagem.idebIniciaisMeta}) | Finais: ${educacao.aprendizagem.idebFinais} (Meta: ${educacao.aprendizagem.idebFinaisMeta})`,
        14,
        y
      );
      y += 4.5;
      doc.text(
        `• Rede: ${educacao.escala.matriculas.toLocaleString('pt-BR')} matrículas em ${educacao.escala.escolas} escolas municipais`,
        14,
        y
      );
      y += 6;

      // 3. Procurement & Contacts
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text('3. CONTRATAÇÕES VIGENTES E CANAIS INSTITUCIONAIS', 14, y);
      y += 6;

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      if (compras.historico && compras.historico.length > 0) {
        const h = compras.historico[0];
        doc.text(`• Contrato Relevante: ${h.objeto} (${h.status})`, 14, y);
        y += 4.5;
        doc.text(`  Valor: ${fmtCurrency(h.valor)} | Vigência: ${h.vigencia}`, 14, y);
        y += 4.5;
      }
      const secEdu = Array.isArray(acesso)
        ? acesso.find((a) => a.categoria === 'Educação') || acesso[0]
        : null;

      if (secEdu) {
        doc.text(
          `• Contato Institucional: ${secEdu.orgao} (${secEdu.cargo})`,
          14,
          y
        );
        y += 4.5;
        doc.text(
          `  Email: ${secEdu.emailInstitucional} | Tel: ${secEdu.telefoneInstitucional}`,
          14,
          y
        );
        y += 4.5;
      }

      // 4. Cautions
      if (leituraHarpia.cautelas && leituraHarpia.cautelas.length > 0) {
        y += 2;
        doc.setFontSize(10);
        doc.setTextColor(185, 28, 28);
        doc.setFont('helvetica', 'bold');
        doc.text('Cautelas e Validações Prévias:', 14, y);
        y += 5;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(120, 53, 15);
        leituraHarpia.cautelas.forEach((c) => {
          const splitC = doc.splitTextToSize(`- ${c}`, 175);
          doc.text(splitC, 14, y);
          y += splitC.length * 4;
        });
      }

      // Footer
      doc.setDrawColor(203, 213, 225);
      doc.line(14, 276, 196, 276);
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        'HARPIA TECH · Dados demonstrativos baseados em fontes de referência públicas. O Score Harpia não garante contratação.',
        14,
        282
      );

      const filename = `dossie-${municipality.nome.toLowerCase().replace(/[^a-z0-9]/g, '-')}-harpia.pdf`;
      doc.save(filename);

      setExportNotice(true);
      setTimeout(() => setExportNotice(false), 4000);
    } catch (err) {
      console.error('Erro ao gerar dossiê PDF:', err);
    }
  };

  // Dimension explanations based on weighted points
  const getFiscalExplanation = (pts: number) => {
    if (pts >= 26) return 'Alta solidez fiscal e boa disponibilidade de caixa.';
    if (pts >= 20) return 'Boa capacidade fiscal e disponibilidade relativa.';
    return 'Restrições de caixa e pressão por restos a pagar.';
  };

  const getEducationExplanation = (pts: number) => {
    if (pts >= 21) return 'Necessidade educacional relevante e urgência pedagógica.';
    if (pts >= 16) return 'Demanda moderada com foco em recomposição de aprendizagem.';
    return 'Indicadores de aprendizagem acima da média regional.';
  };

  const getContractingExplanation = (pts: number) => {
    if (pts >= 21) return 'Janela iminente e contratos prestes a expirar.';
    if (pts >= 16) return 'Janela em planejamento com sinais no PCA/LOA.';
    return 'Contrato vigente ou ausência de sinal de certame.';
  };

  const getAccessExplanation = (pts: number) => {
    if (pts >= 8) return 'Canais institucionais e lideranças mapeadas com sucesso.';
    if (pts >= 6) return 'Órgãos mapeados com contatos institucionais válidos.';
    return 'Canais de contato com pendência de verificação cadastral.';
  };

  const getGovernanceExplanation = (pts: number) => {
    if (pts >= 8) return 'Gestão fiscal regular e transparência satisfatória.';
    if (pts >= 6) return 'Procedimentos regulares de controle sem sanções vigentes.';
    return 'Apurações de rotina recomendam validação documental.';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050B1E]/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5 animate-in fade-in duration-150">
      <div
        className="w-full max-w-5xl bg-[#070F26] border border-[#16264C] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===================================================
            1. TOP SECTION — POLISHED HIERARCHY
           =================================================== */}
        <div id="modal-municipality-header" className="p-5 sm:p-6 bg-[#0A1329] border-b border-[#16264C] flex flex-col gap-5">
          {/* Header Row: Identity, Priority, Window, Actions */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#050B1E] border border-[#00DDF2]/40 flex items-center justify-center text-[#00DDF2] shadow-[0_0_15px_rgba(0,221,242,0.15)] shrink-0">
                <MapPin className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    {municipality.nome}
                  </h1>
                  <span className="px-2 py-0.5 text-xs font-mono-numbers bg-[#16264C] text-white rounded font-bold border border-[#1F3870]">
                    {municipality.uf}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Região {municipality.regiao} · {municipality.populacao.toLocaleString('pt-BR')} hab.
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-bold rounded ${
                      municipality.prioridade === 'Alta prioridade'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : municipality.prioridade === 'Média prioridade'
                        ? 'bg-[#00DDF2]/15 text-[#00DDF2] border border-[#00DDF2]/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {municipality.prioridade.toUpperCase()}
                  </span>
                </div>

                {/* Subtitle key attributes strip */}
                <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-300 mt-2 flex-wrap">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#00DDF2]" />
                    Janela: <strong className="text-white font-mono-numbers">{municipality.janela}</strong>
                    <ContextualHelp
                      topic="Janela de Contratação"
                      explanation="Prazo estimado para o município abrir novos certames ou renovar contratos vigentes de soluções educacionais."
                    />
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Confiança <strong className="text-white">{municipality.confianca}</strong>
                    <ContextualHelp
                      topic="Confiança dos Dados"
                      explanation="Nível de auditoria e validação das bases públicas oficiais (Siconfi, PNCP, INEP) disponíveis para este município."
                    />
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Atualizado no demonstrativo: <span className="text-slate-300">{municipality.atualizadoEm}</span>
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Database className="w-3.5 h-3.5 text-[#00DDF2]" />
                    <span className="text-slate-300">{municipality.fontesConsultadasCount} bases de referência</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Watchlist, Export, Close */}
            <div className="flex items-center gap-2 self-end sm:self-start">
              <button
                onClick={() => onToggleMonitoring(municipality.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  municipality.isMonitored
                    ? 'bg-[#00DDF2]/15 border-[#00DDF2] text-[#00DDF2]'
                    : 'bg-[#0F1C3C] border-[#16264C] text-slate-300 hover:text-white hover:border-slate-500'
                }`}
              >
                {municipality.isMonitored ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-[#00DDF2]" />
                    <span>Em monitoramento</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Adicionar ao monitoramento</span>
                  </>
                )}
              </button>

              <button
                onClick={handleExport}
                title="Exportar dossiê executivo"
                className="p-2 rounded-lg bg-[#0F1C3C] border border-[#16264C] text-slate-300 hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-[#0F1C3C] border border-[#16264C] text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {exportNotice && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center justify-between animate-in fade-in">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Dossiê executivo B2G baixado: dossie-{municipality.nome.toLowerCase().replace(/[^a-z0-9]/g, '-')}-harpia.pdf
              </span>
              <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Download concluído
              </span>
            </div>
          )}

          {/* ===================================================
              TOTAL SCORE & FIVE DIMENSIONS CLEAR DISPLAY
             =================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-1">
            {/* Score Harpia Total Card with Note */}
            <div className="lg:col-span-3 p-4 rounded-xl bg-[#050B1E] border border-[#00DDF2]/40 shadow-[0_0_20px_rgba(0,221,242,0.1)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#00DDF2] tracking-wider uppercase flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#00DDF2]" />
                    Score Harpia
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0A1329] text-slate-400 border border-[#16264C]">
                    Total
                  </span>
                </div>

                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono-numbers">
                    {score.total}
                  </span>
                  <span className="text-sm text-slate-400 font-mono-numbers font-medium">/100</span>
                </div>
              </div>

              {/* Explanatory note close to total score */}
              <p className="text-[10px] text-slate-400 leading-snug pt-2 mt-2 border-t border-[#16264C]/70">
                O Score Harpia organiza sinais comerciais e evidências para apoiar priorização. Não representa garantia ou previsão de contratação.
              </p>
            </div>

            {/* Five Dimensions Cards (9 cols, 5 equal items) */}
            <div id="modal-five-dimensions" className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
              {/* 1. Fiscal (30 pts max) */}
              <div className="p-3.5 rounded-xl bg-[#050B1E] border border-[#16264C] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white">Fiscal</span>
                    <span className="text-sm font-mono-numbers font-bold text-[#00DDF2]">
                      {score.fiscal} <span className="text-[10px] text-slate-400 font-normal">/ 30</span>
                    </span>
                  </div>

                  <div className="w-full bg-[#16264C] h-1.5 rounded-full overflow-hidden my-2">
                    <div
                      className="bg-[#00DDF2] h-full rounded-full transition-all"
                      style={{ width: `${(score.fiscal / 30) * 100}%` }}
                    />
                  </div>
                </div>

                <p className="text-[10.5px] text-slate-400 leading-snug mt-1">
                  {getFiscalExplanation(score.fiscal)}
                </p>
              </div>

              {/* 2. Educação (25 pts max) */}
              <div className="p-3.5 rounded-xl bg-[#050B1E] border border-[#16264C] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white">Educação</span>
                    <span className="text-sm font-mono-numbers font-bold text-emerald-400">
                      {score.educacao} <span className="text-[10px] text-slate-400 font-normal">/ 25</span>
                    </span>
                  </div>

                  <div className="w-full bg-[#16264C] h-1.5 rounded-full overflow-hidden my-2">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all"
                      style={{ width: `${(score.educacao / 25) * 100}%` }}
                    />
                  </div>
                </div>

                <p className="text-[10.5px] text-slate-400 leading-snug mt-1">
                  {getEducationExplanation(score.educacao)}
                </p>
              </div>

              {/* 3. Contratação (25 pts max) */}
              <div className="p-3.5 rounded-xl bg-[#050B1E] border border-[#16264C] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white">Contratação</span>
                    <span className="text-sm font-mono-numbers font-bold text-cyan-400">
                      {score.contratacao} <span className="text-[10px] text-slate-400 font-normal">/ 25</span>
                    </span>
                  </div>

                  <div className="w-full bg-[#16264C] h-1.5 rounded-full overflow-hidden my-2">
                    <div
                      className="bg-cyan-400 h-full rounded-full transition-all"
                      style={{ width: `${(score.contratacao / 25) * 100}%` }}
                    />
                  </div>
                </div>

                <p className="text-[10.5px] text-slate-400 leading-snug mt-1">
                  {getContractingExplanation(score.contratacao)}
                </p>
              </div>

              {/* 4. Acesso Institucional (10 pts max) */}
              <div className="p-3.5 rounded-xl bg-[#050B1E] border border-[#16264C] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white">Acesso</span>
                    <span className="text-sm font-mono-numbers font-bold text-indigo-400">
                      {score.acesso} <span className="text-[10px] text-slate-400 font-normal">/ 10</span>
                    </span>
                  </div>

                  <div className="w-full bg-[#16264C] h-1.5 rounded-full overflow-hidden my-2">
                    <div
                      className="bg-indigo-400 h-full rounded-full transition-all"
                      style={{ width: `${(score.acesso / 10) * 100}%` }}
                    />
                  </div>
                </div>

                <p className="text-[10.5px] text-slate-400 leading-snug mt-1">
                  {getAccessExplanation(score.acesso)}
                </p>
              </div>

              {/* 5. Governança (10 pts max) */}
              <div className="p-3.5 rounded-xl bg-[#050B1E] border border-[#16264C] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white">Governança</span>
                    <span className="text-sm font-mono-numbers font-bold text-violet-400">
                      {score.governanca} <span className="text-[10px] text-slate-400 font-normal">/ 10</span>
                    </span>
                  </div>

                  <div className="w-full bg-[#16264C] h-1.5 rounded-full overflow-hidden my-2">
                    <div
                      className="bg-violet-400 h-full rounded-full transition-all"
                      style={{ width: `${(score.governanca / 10) * 100}%` }}
                    />
                  </div>
                </div>

                <p className="text-[10.5px] text-slate-400 leading-snug mt-1">
                  {getGovernanceExplanation(score.governanca)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            TABS BAR (ALL 7 PRESERVED)
           =================================================== */}
        <div className="px-6 bg-[#070F26] border-b border-[#16264C] flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'visao-geral', label: 'VISÃO GERAL', icon: Layers },
            { id: 'financeiro', label: 'FINANCEIRO', icon: Landmark },
            { id: 'educacao', label: 'EDUCAÇÃO', icon: GraduationCap },
            { id: 'compras', label: 'COMPRAS', icon: ShoppingBag },
            { id: 'acesso', label: 'ACESSO', icon: Users },
            { id: 'governanca', label: 'GOVERNANÇA', icon: Scale },
            { id: 'fontes', label: 'FONTES', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                  isActive
                    ? 'border-[#00DDF2] text-[#00DDF2]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ===================================================
            TAB CONTENT
           =================================================== */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* 1. VISÃO GERAL */}
          {activeTab === 'visao-geral' && (
            <div className="space-y-6">
              {/* ===================================================
                  QUADRO DE DECISÃO COMERCIAL B2G (4 PILARES)
                 =================================================== */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0A1329] border border-[#00DDF2]/30 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#16264C] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00DDF2] animate-pulse" />
                    <h2 className="text-xs sm:text-sm font-extrabold text-white tracking-wider uppercase flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-[#00DDF2]" />
                      Quadro de Decisão Comercial B2G
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#00DDF2]/10 text-[#00DDF2] border border-[#00DDF2]/20">
                    DIRECIONAMENTO PRÁTICO
                  </span>
                </div>

                {/* 4 Cards das 4 Perguntas Comerciais */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {/* 1. ONDE AGIR? */}
                  <div className="p-4 rounded-xl bg-[#050B1E] border border-[#16264C] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        1. Onde Agir?
                      </span>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#00DDF2]" />
                        {municipality.nome} ({municipality.uf})
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Região {municipality.regiao} · {municipality.populacao.toLocaleString('pt-BR')} hab.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#16264C]/70 text-[10.5px] text-slate-300">
                      <strong>Rede:</strong> {municipality.educacao.escala.escolas} escolas municipais ({municipality.educacao.escala.matriculas.toLocaleString('pt-BR')} matrículas)
                    </div>
                  </div>

                  {/* 2. POR QUE É UMA OPORTUNIDADE? */}
                  <div className="p-4 rounded-xl bg-[#050B1E] border border-emerald-500/30 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                        2. Por que é uma oportunidade?
                      </span>
                      <h3 className="text-xs font-bold text-white leading-snug">
                        {municipality.principalSinal || 'Contrato semelhante próximo do encerramento'}
                      </h3>
                      <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed line-clamp-3">
                        {municipality.motivoPrincipal || leituraHarpia.resumo}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#16264C]/70 text-[10.5px] text-emerald-400 font-semibold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      Score Harpia: {municipality.score.total} pts
                    </div>
                  </div>

                  {/* 3. QUANDO ABORDAR? */}
                  <div className="p-4 rounded-xl bg-[#050B1E] border border-[#00DDF2]/30 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#00DDF2] uppercase tracking-wider block mb-1">
                        3. Quando Abordar?
                      </span>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#00DDF2]" />
                        <span className="text-xs font-bold text-white font-mono-numbers">
                          {municipality.janela}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                        {municipality.melhorMomento || 'Janela estimada com base no encerramento do contrato vigente e ciclo da LOA.'}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#16264C]/70 text-[10.5px] text-[#00DDF2]">
                      <strong>Status:</strong> {municipality.prioridade}
                    </div>
                  </div>

                  {/* 4. O QUE FAZER A SEGUIR? */}
                  <div className="p-4 rounded-xl bg-[#050B1E] border border-indigo-500/30 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                        4. O que fazer a seguir?
                      </span>
                      <h3 className="text-xs font-bold text-white leading-snug">
                        {leituraHarpia.proximaAcao}
                      </h3>
                      <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                        <strong className="text-indigo-300">Canal Sugerido:</strong>{' '}
                        {municipality.canalSugeridoPrimeiroContato || 'Secretaria Municipal de Educação e Coordenação Pedagógica'}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#16264C]/70 flex items-center justify-between text-[10.5px] text-slate-300">
                      <span>Prospecção Técnica</span>
                      <ArrowRight className="w-3 h-3 text-[#00DDF2]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sinais Harpia Históricos deste Município */}
              {(() => {
                const munSignals = getSignalsForMunicipio(municipality.id);
                if (munSignals.length === 0) return null;

                return (
                  <div className="p-5 rounded-2xl bg-[#0A1329] border border-[#16264C] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#00DDF2]" />
                        <h3 className="text-xs font-bold text-white tracking-wider uppercase">
                          Linha do Tempo de Sinais Harpia ({municipality.nome})
                        </h3>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {munSignals.length} eventos registrados
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {munSignals.map((sig) => (
                        <div
                          key={sig.id}
                          className="p-3.5 rounded-xl bg-[#050B1E] border border-[#16264C] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                                  sig.tipo === 'OPORTUNIDADE'
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                    : sig.tipo === 'MUDANCA_PRIORIDADE'
                                    ? 'bg-[#00DDF2]/15 text-[#00DDF2] border border-[#00DDF2]/20'
                                    : sig.tipo === 'NOVA_PUBLICACAO'
                                    ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                                    : 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                {sig.tipo.replace('_', ' ')}
                              </span>
                              <span className="text-[10px] text-slate-400">{sig.data}</span>
                              <span className="text-[10px] text-slate-400">· Impacto {sig.impacto}</span>
                            </div>
                            <h4 className="font-bold text-white">{sig.titulo}</h4>
                            <p className="text-[11px] text-slate-400 leading-snug">{sig.descricao}</p>
                          </div>

                          <div className="shrink-0 sm:text-right">
                            <span className="text-[10px] text-slate-400 block">Ação Comercial:</span>
                            <span className="text-[11px] font-semibold text-[#00DDF2]">
                              {sig.acaoRecomendada}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Leitura Harpia Summary Header */}
              <div className="p-5 rounded-2xl bg-[#0A1329] border border-[#16264C] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00DDF2] animate-pulse" />
                    <h2 className="text-xs font-bold text-[#00DDF2] tracking-wider uppercase">
                      Leitura Harpia
                    </h2>
                  </div>
                  <span className="text-[11px] text-slate-400">Síntese Estratégica B2G</span>
                </div>
                <p className="text-sm text-slate-200 font-medium leading-relaxed">
                  "{leituraHarpia.resumo}"
                </p>
              </div>

              {/* 3 BLOCKS: SINAIS FAVORÁVEIS, CAUTELAS, PRÓXIMA AÇÃO */}
              <div id="modal-overview-analysis" className="space-y-4">
                {/* Row: Sinais Favoráveis e Cautelas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bloco 1: Sinais favoráveis */}
                  <div className="p-5 rounded-2xl bg-[#0A1329] border border-[#16264C] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Sinais favoráveis
                      </div>
                      <ul className="space-y-2.5">
                        {leituraHarpia.sinaisFavoraveis.map((sinal, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-normal">
                            <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                            <span>{sinal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bloco 2: Cautelas */}
                  <div className="p-5 rounded-2xl bg-[#0A1329] border border-[#16264C] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        Cautelas
                      </div>
                      <ul className="space-y-2.5">
                        {leituraHarpia.cautelas.map((cautela, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-normal">
                            <span className="text-amber-400 font-bold mt-0.5">!</span>
                            <span>{cautela}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bloco 3: PRÓXIMA AÇÃO — GREATER VISUAL PROMINENCE */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#00DDF2]/10 via-[#0A1329] to-[#0A1329] border-2 border-[#00DDF2]/50 shadow-[0_0_25px_rgba(0,221,242,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10.5px] font-extrabold uppercase bg-[#00DDF2] text-[#050B1E] tracking-wider shadow-[0_0_10px_rgba(0,221,242,0.4)]">
                        Próxima Ação Recomendada
                      </span>
                      <span className="text-xs text-slate-400">Orientação Técnica de Prospecção</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-white leading-snug">
                      "{leituraHarpia.proximaAcao}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
                    <button
                      onClick={() => onToggleMonitoring(municipality.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-md ${
                        municipality.isMonitored
                          ? 'bg-[#16264C] text-[#00DDF2] border border-[#00DDF2]/40'
                          : 'bg-[#00DDF2] hover:bg-[#00c5d8] text-[#050B1E] shadow-[0_0_15px_rgba(0,221,242,0.3)]'
                      }`}
                    >
                      {municipality.isMonitored ? 'Em monitoramento' : 'Adicionar ao monitoramento'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. FINANCEIRO */}
          {activeTab === 'financeiro' && (
            <div className="space-y-6">
              {/* Financial Disclaimer Banner */}
              <div className="p-3.5 rounded-xl bg-[#0A1329] border border-amber-500/30 flex items-center gap-3 text-xs text-amber-300">
                <Info className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  <strong>Atenção:</strong> Orçamento autorizado não significa recurso imediatamente disponível. Analise a disponibilidade de caixa e o índice de restos a pagar antes de estruturar ofertas comerciais.
                </span>
              </div>

              {/* Budget Execution Summary */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-[#0A1329] border border-[#16264C]">
                  <span className="text-xs text-slate-400">Orçamento Autorizado</span>
                  <p className="text-lg font-bold text-white font-mono-numbers mt-1">
                    {fmtCurrency(financeiro.orcamentoAutorizado)}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-1">LOA municipal</span>
                </div>
                <div className="p-4 rounded-xl bg-[#0A1329] border border-[#16264C]">
                  <span className="text-xs text-slate-400">Empenhado</span>
                  <p className="text-lg font-bold text-slate-200 font-mono-numbers mt-1">
                    {fmtCurrency(financeiro.empenhado)}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {((financeiro.empenhado / financeiro.orcamentoAutorizado) * 100).toFixed(1)}% do autorizado
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#0A1329] border border-[#16264C]">
                  <span className="text-xs text-slate-400">Liquidado</span>
                  <p className="text-lg font-bold text-[#00DDF2] font-mono-numbers mt-1">
                    {fmtCurrency(financeiro.liquidado)}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {((financeiro.liquidado / financeiro.empenhado) * 100).toFixed(1)}% do empenhado
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#0A1329] border border-[#16264C]">
                  <span className="text-xs text-slate-400">Pago Efetivo</span>
                  <p className="text-lg font-bold text-emerald-400 font-mono-numbers mt-1">
                    {fmtCurrency(financeiro.pago)}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {((financeiro.pago / financeiro.liquidado) * 100).toFixed(1)}% do liquidado
                  </span>
                </div>
              </div>

              {/* Macro Fiscal Indicators Grid */}
              <div className="p-5 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Indicadores Fiscais & Saúde Financeira
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400">Receita Corrente Líquida (RCL)</span>
                    <p className="font-mono-numbers font-semibold text-white">
                      {fmtCurrency(financeiro.rcl)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400">Arrecadação Própria</span>
                    <p className="font-mono-numbers font-semibold text-white">
                      {financeiro.arrecadacaoPropriaPct}% da receita
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400">Dependência de Transferências</span>
                    <p className="font-mono-numbers font-semibold text-slate-300">
                      {financeiro.dependenciaTransferenciasPct}% (FPM / Fundeb)
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400">Resultado Fiscal</span>
                    <p
                      className={`font-mono-numbers font-semibold ${
                        financeiro.resultadoFiscal === 'Superávit' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {financeiro.resultadoFiscal} ({fmtCurrency(financeiro.resultadoFiscalValor)})
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400">Dívida Consolidada Líquida</span>
                    <p className="font-mono-numbers font-semibold text-white">
                      {fmtCurrency(financeiro.dividaConsolidadaLiquida)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400">Disponibilidade de Caixa</span>
                    <p className="font-mono-numbers font-semibold text-[#00DDF2]">
                      {fmtCurrency(financeiro.disponibilidadeCaixa)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400">Restos a Pagar</span>
                    <p className="font-mono-numbers font-semibold text-slate-300">
                      {fmtCurrency(financeiro.restosAPagar)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400">Orçamento Destinado à Educação</span>
                    <p className="font-mono-numbers font-semibold text-emerald-400">
                      {fmtCurrency(financeiro.orcamentoEducacao)} ({financeiro.orcamentoEducacaoPct}%)
                    </p>
                  </div>
                </div>
              </div>

              {/* Monthly execution progression bar chart */}
              <div className="p-5 rounded-xl bg-[#0A1329] border border-[#16264C]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Evolução Mensal da Execução Orçamentária
                  </h3>
                  <span className="text-[11px] text-slate-400">Valores em milhões de R$</span>
                </div>
                <div className="grid grid-cols-10 gap-2 items-end h-36 pt-4 border-b border-[#16264C]">
                  {financeiro.historicoMensal.map((item) => {
                    const pct = (item.executado / 40000000) * 100;
                    return (
                      <div key={item.mes} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                        <div
                          className="w-full bg-[#16264C] group-hover:bg-[#00DDF2] rounded-t transition-all relative"
                          style={{ height: `${Math.min(pct, 100)}%` }}
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#050B1E] text-[10px] font-mono-numbers text-white border border-[#16264C] whitespace-nowrap pointer-events-none z-10">
                            {(item.executado / 1000000).toFixed(1)}M
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono-numbers">{item.mes}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 3. EDUCAÇÃO */}
          {activeTab === 'educacao' && (
            <div className="space-y-6">
              {/* 4 Pillars: Escala, Aprendizagem, Equidade, Aderência */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Escala */}
                <div className="p-5 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#00DDF2]" />
                      Escala da Rede Municipal
                    </h3>
                    <span className="text-[10px] text-slate-400">Referência INEP</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-2.5 rounded-lg bg-[#050B1E] border border-[#16264C]">
                      <span className="text-slate-400 block text-[11px]">Matrículas</span>
                      <span className="text-base font-bold text-white font-mono-numbers">
                        {educacao.escala.matriculas.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#050B1E] border border-[#16264C]">
                      <span className="text-slate-400 block text-[11px]">Escolas Municipais</span>
                      <span className="text-base font-bold text-white font-mono-numbers">
                        {educacao.escala.escolas}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#050B1E] border border-[#16264C]">
                      <span className="text-slate-400 block text-[11px]">Docentes Ativos</span>
                      <span className="text-base font-bold text-white font-mono-numbers">
                        {educacao.escala.docentes.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#050B1E] border border-[#16264C]">
                      <span className="text-slate-400 block text-[11px]">Turmas</span>
                      <span className="text-base font-bold text-white font-mono-numbers">
                        {educacao.escala.turmas}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Aprendizagem */}
                <div className="p-5 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      Aprendizagem & Proficiência
                    </h3>
                    <span className="text-[10px] text-slate-400">IDEB / SAEB</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-2.5 rounded-lg bg-[#050B1E] border border-[#16264C]">
                      <span className="text-slate-400 block text-[11px]">IDEB Anos Iniciais</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-bold text-white font-mono-numbers">
                          {educacao.aprendizagem.idebIniciais}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          (Meta: {educacao.aprendizagem.idebIniciaisMeta})
                        </span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#050B1E] border border-[#16264C]">
                      <span className="text-slate-400 block text-[11px]">IDEB Anos Finais</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-bold text-white font-mono-numbers">
                          {educacao.aprendizagem.idebFinais}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          (Meta: {educacao.aprendizagem.idebFinaisMeta})
                        </span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#050B1E] border border-[#16264C]">
                      <span className="text-slate-400 block text-[11px]">SAEB Português</span>
                      <span className="text-base font-bold text-white font-mono-numbers">
                        {educacao.aprendizagem.saebPortugues} pts
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#050B1E] border border-[#16264C]">
                      <span className="text-slate-400 block text-[11px]">Taxa de Aprovação</span>
                      <span className="text-base font-bold text-emerald-400 font-mono-numbers">
                        {educacao.aprendizagem.taxaAprovacao}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Equidade */}
                <div className="p-5 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Equidade & Vulnerabilidade
                  </h3>
                  <div className="space-y-3 text-xs pt-1">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-400">Taxa de Abandono Escolar</span>
                        <span className="font-mono-numbers text-white font-semibold">
                          {educacao.equidade.taxaAbandono}%
                        </span>
                      </div>
                      <div className="w-full bg-[#16264C] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-400 h-full rounded-full"
                          style={{ width: `${educacao.equidade.taxaAbandono * 10}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-400">Distorção Idade-Série</span>
                        <span className="font-mono-numbers text-white font-semibold">
                          {educacao.equidade.distorcaoIdadeSerie}%
                        </span>
                      </div>
                      <div className="w-full bg-[#16264C] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-400 h-full rounded-full"
                          style={{ width: `${educacao.equidade.distorcaoIdadeSerie}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-slate-400">Índice de Vulnerabilidade Social</span>
                      <span className="font-semibold text-slate-200">
                        {educacao.equidade.indiceVulnerabilidade}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Aderência */}
                <div className="p-5 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Aderência da Solução Educacional
                  </h3>
                  <div className="space-y-2 text-xs pt-1">
                    <div className="flex items-center justify-between py-1 border-b border-[#16264C]/60">
                      <span className="text-slate-400">Alinhamento BNCC</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Compatível
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-[#16264C]/60">
                      <span className="text-slate-400">Acessibilidade Digital</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Conforme
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-[#16264C]/60">
                      <span className="text-slate-400">Suporte a Uso Offline</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Requisito Atendido
                      </span>
                    </div>
                    <div className="pt-2">
                      <span className="text-slate-400 block mb-1.5 text-[11px]">Etapas Atendidas na Rede:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {educacao.aderencia.etapasAtendidas.map((etapa) => (
                          <span
                            key={etapa}
                            className="px-2 py-0.5 rounded bg-[#050B1E] text-slate-300 border border-[#16264C] text-[11px]"
                          >
                            {etapa}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. COMPRAS */}
          {activeTab === 'compras' && (
            <div className="space-y-6">
              {/* Janela Estimada & Sinais */}
              <div className="p-5 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#00DDF2] tracking-wider uppercase">
                      Janela Estimada de Contratação
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xl font-bold text-white font-mono-numbers">
                        {compras.janelaEstimada}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs font-bold rounded ${
                          compras.janelaLabel === 'IMEDIATA'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : compras.janelaLabel === 'PRÓXIMA'
                            ? 'bg-[#00DDF2]/20 text-[#00DDF2] border border-[#00DDF2]/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        {compras.janelaLabel}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">
                    Inferida por cruzamento de ciclos da LOA, PCA e dados simulados
                  </span>
                </div>

                <div className="pt-2 border-t border-[#16264C]">
                  <span className="text-xs font-bold text-white block mb-2">
                    Sinais que contribuíram para a estimativa:
                  </span>
                  <ul className="space-y-2">
                    {compras.sinaisContribuiram.map((sinal, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-[#00DDF2] mt-0.5 shrink-0" />
                        <span>{sinal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Histórico de Compras Públicas */}
              <div className="p-5 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Histórico de Compras Públicas Educacionais
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">Bases de referência PNCP / DOM</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#16264C] text-slate-400">
                        <th className="py-2.5 px-3 font-semibold">Objeto</th>
                        <th className="py-2.5 px-3 font-semibold">Modalidade</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Valor</th>
                        <th className="py-2.5 px-3 font-semibold">Data</th>
                        <th className="py-2.5 px-3 font-semibold">Status / Vigência</th>
                        <th className="py-2.5 px-3 font-semibold">Fonte de Referência</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#16264C]/60 text-slate-300">
                      {compras.historico.map((item) => (
                        <tr key={item.id} className="hover:bg-[#0F1C3C]/50 transition-colors">
                          <td className="py-3 px-3 font-medium text-white max-w-xs">{item.objeto}</td>
                          <td className="py-3 px-3 text-slate-400">{item.modalidade}</td>
                          <td className="py-3 px-3 font-mono-numbers font-semibold text-right text-emerald-400">
                            {fmtCurrency(item.valor)}
                          </td>
                          <td className="py-3 px-3 font-mono-numbers text-slate-400">{item.data}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                                item.status === 'Vigente'
                                  ? 'bg-[#00DDF2]/15 text-[#00DDF2]'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {item.status} ({item.vigencia})
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-400 text-[11px]">{item.fonte}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. ACESSO */}
          {activeTab === 'acesso' && (
            <div className="space-y-6">
              <div className="p-3.5 rounded-lg bg-[#0A1329] border border-[#16264C] flex items-center justify-between text-xs text-slate-400">
                <span>
                  <strong>Acesso Institucional B2G:</strong> Contatos estritamente funcionais e institucionais apurados em portais da transparência e atos normativos. Não exibimos dados pessoais ou privados.
                </span>
                <span className="text-emerald-400 font-medium shrink-0 ml-2">LGPD Compliance</span>
              </div>

              <div className="space-y-4">
                {acesso.map((contato) => (
                  <div
                    key={contato.id}
                    className="p-4 rounded-xl bg-[#0A1329] border border-[#16264C] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-[#050B1E] border border-[#16264C] text-[#00DDF2]">
                          {contato.categoria}
                        </span>
                        <h4 className="text-sm font-semibold text-white">{contato.orgao}</h4>
                      </div>
                      <p className="text-xs text-slate-300">{contato.cargo}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 flex-wrap font-mono-numbers">
                        <span>Email: <strong className="text-slate-200">{contato.emailInstitucional}</strong></span>
                        <span>Tel: <strong className="text-slate-200">{contato.telefoneInstitucional}</strong></span>
                        <span>Portal: <strong className="text-slate-200">{contato.portalOficial}</strong></span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 text-xs text-slate-400 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#16264C]">
                      <span>Verificado em: {contato.dataVerificacao}</span>
                      <span className="block text-[11px] text-slate-400">{contato.fonte}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. GOVERNANÇA */}
          {activeTab === 'governanca' && (
            <div className="space-y-6">
              <div className="p-3.5 rounded-lg bg-[#0A1329] border border-[#16264C] text-xs text-slate-300 leading-relaxed">
                <strong>Critério de Governança & Integridade:</strong> As anotações refletem exclusivamente o histórico documental perante órgãos de controle externo (TCE/TCM/CGU/MPC). Classificações automáticas ofensivas são vedadas por metodologia. A existência de procedimento não implica culpa ou condenação definitiva.
              </div>

              <div className="space-y-3">
                {governanca.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-white font-mono-numbers">{item.processo}</span>
                        <span className="text-xs text-slate-400">· {item.tribunal}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#16264C] text-slate-300 border border-[#1F3870]">
                        {item.categoria}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 font-medium">{item.classe}</p>

                    <div className="text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-[#16264C]/60">
                      <span>Situação: <strong className="text-slate-200">{item.situacao}</strong></span>
                      <span>Última movimentação: {item.ultimaMovimentacao}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. FONTES */}
          {activeTab === 'fontes' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-[#0A1329] border border-[#16264C] space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Bases Públicas de Referência para este Município
                </h3>
                <p className="text-xs text-slate-400">
                  Os dados simulados do {municipality.nome} foram modelados com base nos padrões metodológicos das seguintes fontes oficiais:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {municipality.fontes.map((fonte, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#050B1E] border border-[#16264C] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <Database className="w-4 h-4 text-[#00DDF2]" />
                        <span className="text-xs font-semibold text-white">{fonte}</span>
                      </div>
                      <span className="text-[11px] text-[#00DDF2] font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00DDF2]" />
                        Base de Referência
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0A1329] border-t border-[#16264C] flex items-center justify-between text-xs text-slate-400">
          <span>Ambiente de demonstração Harpia Tech · Dados simulados estruturados</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0F1C3C] hover:bg-[#16264C] text-white font-medium transition-colors"
          >
            Fechar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
