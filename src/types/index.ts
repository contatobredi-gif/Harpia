export type Region = 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul';

export type PriorityLevel = 'Alta prioridade' | 'Média prioridade' | 'Estratégica' | 'Monitoramento';

export type ContractingWindow = '0–90 dias' | '91–180 dias' | '181–365 dias' | 'Sem sinal';

export type ConfidenceLevel = 'Alta' | 'Média' | 'Baixa';

export type PipelineStage = 'A_IMEDIATA' | 'B_RELACIONAMENTO' | 'C_MONITORAMENTO';

export interface ScoreBreakdown {
  fiscal: number;       // Max 30 pts (Capacidade fiscal e financeira)
  educacao: number;     // Max 25 pts (Necessidade educacional)
  contratacao: number;  // Max 25 pts (Oportunidade de contratação)
  acesso: number;       // Max 10 pts (Acessibilidade institucional)
  governanca: number;   // Max 10 pts (Integridade, risco e governança)
  total: number;        // Sum 0-100 pts
}

export interface FinancialData {
  orcamentoAutorizado: number;
  empenhado: number;
  liquidado: number;
  pago: number;
  rcl: number; // Receita Corrente Líquida
  arrecadacaoPropriaPct: number; // %
  dependenciaTransferenciasPct: number; // %
  resultadoFiscal: 'Superávit' | 'Déficit' | 'Equilibrado';
  resultadoFiscalValor: number;
  dividaConsolidadaLiquida: number;
  disponibilidadeCaixa: number;
  restosAPagar: number;
  orcamentoEducacao: number;
  orcamentoEducacaoPct: number; // e.g. 26.8%
  historicoMensal: { mes: string; orcamento: number; executado: number }[];
}

export interface EducationData {
  escala: {
    matriculas: number;
    escolas: number;
    docentes: number;
    turmas: number;
  };
  aprendizagem: {
    idebIniciais: number;
    idebIniciaisMeta: number;
    idebFinais: number;
    idebFinaisMeta: number;
    saebPortugues: number;
    saebMatematica: number;
    taxaAprovacao: number;
  };
  equidade: {
    taxaAbandono: number;
    distorcaoIdadeSerie: number;
    indiceVulnerabilidade: 'Baixa' | 'Média' | 'Alta';
  };
  aderencia: {
    etapasAtendidas: string[];
    alinhamentoBncc: boolean;
    acessibilidadeDigital: boolean;
    suporteOffline: boolean;
  };
}

export interface ProcurementHistoryItem {
  id: string;
  objeto: string;
  modalidade: string;
  valor: number;
  data: string;
  status: 'Vigente' | 'Encerrado' | 'Em licitação' | 'Planejado';
  vigencia: string;
  fonte: string;
}

export interface ProcurementData {
  historico: ProcurementHistoryItem[];
  janelaEstimada: ContractingWindow;
  janelaLabel: 'IMEDIATA' | 'PRÓXIMA' | 'ESTRATÉGICA' | 'MONITORAR';
  sinaisContribuiram: string[];
}

export interface InstitutionalContact {
  id: string;
  categoria: 'Educação' | 'Gestão' | 'Contratação';
  orgao: string;
  cargo: string;
  emailInstitucional: string;
  telefoneInstitucional: string;
  portalOficial: string;
  fonte: string;
  dataVerificacao: string;
}

export interface GovernanceRecord {
  id: string;
  processo: string;
  tribunal: string;
  classe: string;
  situacao: string;
  categoria: 'notícia/investigação' | 'processo em curso' | 'decisão não definitiva' | 'decisão/sanção vigente';
  ultimaMovimentacao: string;
  fonte: string;
  confianca: ConfidenceLevel;
}

export interface Municipality {
  id: string;
  nome: string; // e.g. "Município Alfa"
  uf: string;   // e.g. "PA"
  regiao: Region;
  populacao: number;
  atualizadoEm: string;
  fontesConsultadasCount: number;
  confianca: ConfidenceLevel;
  score: ScoreBreakdown;
  scoreAnterior: number;
  status: 'Imediata' | 'Próxima' | 'Estratégica' | 'Monitorar';
  prioridade: PriorityLevel;
  pipelineStage: PipelineStage;
  janela: ContractingWindow;
  
  // Executive Reading
  leituraHarpia: {
    resumo: string;
    sinaisFavoraveis: string[];
    cautelas: string[];
    proximaAcao: string;
  };

  financeiro: FinancialData;
  educacao: EducationData;
  compras: ProcurementData;
  acesso: InstitutionalContact[];
  governanca: GovernanceRecord[];
  fontes: string[];

  // User state
  isMonitored: boolean;
  notes?: string;
}

export interface PublicDataSource {
  id: string;
  nome: string;
  categoria: 'Fiscal' | 'Educação' | 'Compras';
  descricao: string;
  status: 'Operacional' | 'Sincronizado' | 'Em atualização';
  ultimaAtualizacao: string;
  cobertura: string;
  confiabilidade: 'Muito Alta' | 'Alta' | 'Oficial';
  urlExterna: string;
}

export interface TimelineEvent {
  id: string;
  municipioId: string;
  municipioNome: string;
  uf: string;
  tipo: 'contrato' | 'publicacao' | 'score' | 'fonte';
  titulo: string;
  descricao: string;
  data: string;
  relevancia: 'Alta' | 'Média';
}

export interface NotificationItem {
  id: string;
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
  municipioId?: string;
  tipo: 'alerta' | 'oportunidade' | 'sistema';
}
