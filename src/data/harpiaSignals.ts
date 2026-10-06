import { HarpiaSignal } from '../types';

export const HARPIA_SIGNALS: HarpiaSignal[] = [
  {
    id: 'sig-001',
    municipioId: 'mun-alfa',
    municipioNome: 'Município Alfa',
    uf: 'PA',
    tipo: 'OPORTUNIDADE',
    titulo: 'Contrato educacional entra nos últimos 90 dias',
    descricao:
      'Contrato anterior de tecnologia e software educacional atingiu 75 dias para o encerramento da vigência formal no Diário Oficial.',
    data: 'Hoje',
    impacto: 'Alto',
    scoreAntes: 83,
    scoreDepois: 87,
    acaoRecomendada: 'Validar dotação na LOA e iniciar abordagem técnica com a Secretaria de Educação.',
  },
  {
    id: 'sig-002',
    municipioId: 'mun-beta',
    municipioNome: 'Município Beta',
    uf: 'SP',
    tipo: 'MUDANCA_PRIORIDADE',
    titulo: 'Prioridade elevada para Imediata',
    descricao:
      'Score alterado de 76 para 82 após confirmação de reserva orçamentária para material digital e plataforma pedagógica.',
    data: 'Ontem',
    impacto: 'Alto',
    scoreAntes: 76,
    scoreDepois: 82,
    acaoRecomendada: 'Apresentar proposta de alinhamento à BNCC antes da consolidação do termo de referência.',
  },
  {
    id: 'sig-003',
    municipioId: 'mun-zeta',
    municipioNome: 'Município Zeta',
    uf: 'CE',
    tipo: 'NOVA_PUBLICACAO',
    titulo: 'Aviso de planejamento identificado no PNCP',
    descricao:
      'Publicação de Estudo Técnico Preliminar (ETP) referente à aquisição de tecnologias para recomposição de aprendizagem.',
    data: 'Há 2 dias',
    impacto: 'Alto',
    scoreAntes: 80,
    scoreDepois: 84,
    acaoRecomendada: 'Mapear requisitos pedagógicos do ETP e contatar o setor de planejamento educacional.',
  },
  {
    id: 'sig-004',
    municipioId: 'mun-gama',
    municipioNome: 'Município Gama',
    uf: 'MG',
    tipo: 'DADOS_ATUALIZADOS',
    titulo: 'Superávit fiscal confirmado no RREO',
    descricao:
      'Relatório de Execução Orçamentária confirmou liquidez disponível e aplicação de 28,1% da RCL em Educação.',
    data: 'Há 4 dias',
    impacto: 'Médio',
    scoreAntes: 74,
    scoreDepois: 79,
    acaoRecomendada: 'Iniciar relacionamento consultivo com o secretário de educação apresentando casos de sucesso.',
  },
  {
    id: 'sig-005',
    municipioId: 'mun-omega',
    municipioNome: 'Município Omega',
    uf: 'GO',
    tipo: 'OPORTUNIDADE',
    titulo: 'Vigência de contrato anterior próxima de 140 dias',
    descricao:
      'Prefeitura abriu ciclo de planejamento do ano letivo com foco em recomposição de matemática nos anos finais.',
    data: 'Há 5 dias',
    impacto: 'Médio',
    scoreAntes: 72,
    scoreDepois: 76,
    acaoRecomendada: 'Apresentar diagnóstico pedagógico comparativo baseado nas metas do IDEB municipal.',
  },
  {
    id: 'sig-006',
    municipioId: 'mun-delta',
    municipioNome: 'Município Delta',
    uf: 'PR',
    tipo: 'ATENCAO',
    titulo: 'Termo aditivo estendeu contrato vigente por 6 meses',
    descricao:
      'Janela de contratação foi postergada para o próximo semestre. Recomendada migração temporária para Relacionamento.',
    data: 'Há 6 dias',
    impacto: 'Médio',
    scoreAntes: 78,
    scoreDepois: 73,
    acaoRecomendada: 'Manter acompanhamento periódico sem abordagem comercial agressiva no curto prazo.',
  },
  {
    id: 'sig-007',
    municipioId: 'mun-sigma',
    municipioNome: 'Município Sigma',
    uf: 'SC',
    tipo: 'NOVA_PUBLICACAO',
    titulo: 'Previsão de investimento pedagógico na LDO',
    descricao:
      'Projeto da Lei de Diretrizes Orçamentárias incluiu rubrica para modernização dos laboratórios e material didático interativo.',
    data: 'Há 1 semana',
    impacto: 'Médio',
    scoreAntes: 68,
    scoreDepois: 71,
    acaoRecomendada: 'Agendar apresentação institucional com a equipe de projetos da Secretaria de Educação.',
  },
  // Specific historical timeline signals for municipalities
  {
    id: 'sig-hist-alfa-1',
    municipioId: 'mun-alfa',
    municipioNome: 'Município Alfa',
    uf: 'PA',
    tipo: 'OPORTUNIDADE',
    titulo: 'Contrato semelhante entrou na janela de 90 dias',
    descricao: 'Contrato vigente com vigência até os próximos 75 dias.',
    data: 'Hoje',
    impacto: 'Alto',
    acaoRecomendada: 'Validar dotação na LOA e iniciar contato técnico com a Secretaria.',
  },
  {
    id: 'sig-hist-alfa-2',
    municipioId: 'mun-alfa',
    municipioNome: 'Município Alfa',
    uf: 'PA',
    tipo: 'MUDANCA_PRIORIDADE',
    titulo: 'Score de contratação alterado de 19 para 23 pontos',
    descricao: 'Aproximação da data limite impulsionou o indicador de oportunidade de compra.',
    data: '12 dias atrás',
    impacto: 'Alto',
    acaoRecomendada: 'Revisar portfólio pedagógico para a abordagem.',
  },
  {
    id: 'sig-hist-alfa-3',
    municipioId: 'mun-alfa',
    municipioNome: 'Município Alfa',
    uf: 'PA',
    tipo: 'NOVA_PUBLICACAO',
    titulo: 'Nova publicação de planejamento identificada no PCA',
    descricao: 'Previsão oficial de renovação de plataformas para o ensino fundamental.',
    data: '28 dias atrás',
    impacto: 'Médio',
    acaoRecomendada: 'Mapear secretários e dirigentes responsáveis.',
  },
  {
    id: 'sig-hist-alfa-4',
    municipioId: 'mun-alfa',
    municipioNome: 'Município Alfa',
    uf: 'PA',
    tipo: 'DADOS_ATUALIZADOS',
    titulo: 'Indicadores educacionais atualizados no Censo INEP',
    descricao: 'IDEB registrou defasagem de 0,6 ponto em relação à meta contratada.',
    data: '45 dias atrás',
    impacto: 'Médio',
    acaoRecomendada: 'Preparar proposta técnica de recomposição de aprendizagem.',
  },
  // Beta history
  {
    id: 'sig-hist-beta-1',
    municipioId: 'mun-beta',
    municipioNome: 'Município Beta',
    uf: 'SP',
    tipo: 'MUDANCA_PRIORIDADE',
    titulo: 'Score alterado de 76 para 82 após novo sinal de contratação',
    descricao: 'Janela de 0–90 dias confirmada por documento de planejamento anual.',
    data: 'Ontem',
    impacto: 'Alto',
    acaoRecomendada: 'Validar janela e contato institucional com dirigente da pasta.',
  },
  {
    id: 'sig-hist-beta-2',
    municipioId: 'mun-beta',
    municipioNome: 'Município Beta',
    uf: 'SP',
    tipo: 'OPORTUNIDADE',
    titulo: 'Reserva orçamentária aprovada para projetos educacionais',
    descricao: 'Dotação orçamentária suplementar de R$ 3,8M publicada no Diário Oficial.',
    data: '15 dias atrás',
    impacto: 'Alto',
    acaoRecomendada: 'Consultar portais de compras do estado para editais vinculados.',
  },
  // Gama history
  {
    id: 'sig-hist-gama-1',
    municipioId: 'mun-gama',
    municipioNome: 'Município Gama',
    uf: 'MG',
    tipo: 'DADOS_ATUALIZADOS',
    titulo: 'Orçamento municipal em formação com 28,1% para educação',
    descricao: 'Cumprimento constitucional consistente sem pendências no Tribunal de Contas.',
    data: 'Há 4 dias',
    impacto: 'Médio',
    acaoRecomendada: 'Iniciar relacionamento consultivo com o gestor pedagógico.',
  },
];

export function getSignalsForMunicipio(municipioId: string): HarpiaSignal[] {
  return HARPIA_SIGNALS.filter((s) => s.municipioId === municipioId);
}

export function getRecentSignals(limit = 6): HarpiaSignal[] {
  return HARPIA_SIGNALS.slice(0, limit);
}

export function filterSignalsByType(tipo?: string): HarpiaSignal[] {
  if (!tipo || tipo === 'TODOS') return HARPIA_SIGNALS;
  return HARPIA_SIGNALS.filter((s) => s.tipo === tipo);
}
