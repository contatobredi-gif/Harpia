import { Municipality } from '../types';

export interface InsightResponse {
  conclusao: string;
  justificativa: string;
  prioridade: string;
  confianca: string;
  sinais: string[];
  cautelas: string[];
  fontes: string[];
  municipiosRelacionados: string[];
}

export async function askHarpiaAi(
  question: string,
  municipalities: Municipality[]
): Promise<InsightResponse> {
  // Minimize payload by transmitting relevant analytical fields
  const simplifiedDataset = municipalities.map((m) => ({
    id: m.id,
    nome: m.nome,
    uf: m.uf,
    regiao: m.regiao,
    populacao: m.populacao,
    scoreTotal: m.score.total,
    scoreFiscal: m.score.fiscal,
    scoreEducacao: m.score.educacao,
    scoreContratacao: m.score.contratacao,
    scoreAcesso: m.score.acesso,
    scoreGovernanca: m.score.governanca,
    status: m.status,
    prioridade: m.prioridade,
    janela: m.janela,
    isMonitored: m.isMonitored,
    confianca: m.confianca,
    principalSinal: m.principalSinal,
    motivoPrincipal: m.motivoPrincipal,
    melhorMomento: m.melhorMomento,
    canalSugeridoPrimeiroContato: m.canalSugeridoPrimeiroContato,
    leituraHarpia: m.leituraHarpia,
    sinaisCompras: m.compras.sinaisContribuiram,
    historicoCompras: m.compras.historico.map((h) => ({
      objeto: h.objeto,
      modalidade: h.modalidade,
      valor: h.valor,
      status: h.status,
      vigencia: h.vigencia,
    })),
    financeiro: {
      orcamentoAutorizado: m.financeiro.orcamentoAutorizado,
      empenhado: m.financeiro.empenhado,
      liquidado: m.financeiro.liquidado,
      pago: m.financeiro.pago,
      rcl: m.financeiro.rcl,
      arrecadacaoPropriaPct: m.financeiro.arrecadacaoPropriaPct,
      dependenciaTransferenciasPct: m.financeiro.dependenciaTransferenciasPct,
      resultadoFiscal: m.financeiro.resultadoFiscal,
      resultadoFiscalValor: m.financeiro.resultadoFiscalValor,
      disponibilidadeCaixa: m.financeiro.disponibilidadeCaixa,
      restosAPagar: m.financeiro.restosAPagar,
      orcamentoEducacao: m.financeiro.orcamentoEducacao,
      orcamentoEducacaoPct: m.financeiro.orcamentoEducacaoPct,
    },
    educacao: {
      matriculas: m.educacao.escala.matriculas,
      escolas: m.educacao.escala.escolas,
      idebIniciais: m.educacao.aprendizagem.idebIniciais,
      idebIniciaisMeta: m.educacao.aprendizagem.idebIniciaisMeta,
      idebFinais: m.educacao.aprendizagem.idebFinais,
      idebFinaisMeta: m.educacao.aprendizagem.idebFinaisMeta,
      saebPortugues: m.educacao.aprendizagem.saebPortugues,
      saebMatematica: m.educacao.aprendizagem.saebMatematica,
      taxaAbandono: m.educacao.equidade.taxaAbandono,
      distorcaoIdadeSerie: m.educacao.equidade.distorcaoIdadeSerie,
    },
    governanca: m.governanca.map((g) => ({
      processo: g.processo,
      tribunal: g.tribunal,
      classe: g.classe,
      situacao: g.situacao,
      categoria: g.categoria,
    })),
    fontes: m.fontes,
  }));

  const res = await fetch('/api/insights', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question,
      dataset: simplifiedDataset,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const msg =
      errorData?.error || 'Não foi possível concluir a análise neste momento. Tente novamente.';
    throw new Error(msg);
  }

  const data: InsightResponse = await res.json();
  return data;
}
