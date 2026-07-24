export type VisitaTipo = "Comercial" | "Auditoria" | "Avaliação 360" | "Estruturação";
export type VisitaStatus = "Agendada" | "Realizada" | "Cancelada";

export interface VisitaListItem {
  id: string;
  data: string;
  dataFormatada: string;
  unidade: string;
  unidadeId: string;
  tipo: VisitaTipo;
  responsavel: string;
  status: VisitaStatus;
}

export interface VisitaDetalhe {
  id: string;
  data: string;
  unidade: { id: string; nome: string };
  tipo: VisitaTipo;
  responsavel: string;
  status: VisitaStatus;
  objetivos: string;
  relatorio: string | null;
  anotacaoPrivada: string | null;
  ocorrenciaGerada: string | null;
}

export interface AlertaCobertura {
  totalSemVisita180d: number;
  unidadesCriticas: string[];
}

// --------------- Alerta de cobertura ---------------

export const alertaCobertura: AlertaCobertura = {
  totalSemVisita180d: 3,
  unidadesCriticas: ["L004 (RJ-Barra)", "L005 (BH-Savassi)", "L007 (Brasília-Asa Sul)"],
};

// --------------- List data ---------------

export const visitasList: VisitaListItem[] = [
  { id: "VIS-001", data: "2026-07-28T14:00:00Z", dataFormatada: "28/07/2026 14:00", unidade: "SP-Centro (L001)", unidadeId: "L001", tipo: "Comercial", responsavel: "Roberto Almeida", status: "Agendada" },
  { id: "VIS-002", data: "2026-07-25T09:00:00Z", dataFormatada: "25/07/2026 09:00", unidade: "Campinas (L002)", unidadeId: "L002", tipo: "Auditoria", responsavel: "Roberto Almeida", status: "Agendada" },
  { id: "VIS-003", data: "2026-07-20T10:00:00Z", dataFormatada: "20/07/2026 10:00", unidade: "PV Alpha (PV-1042)", unidadeId: "PV-1042", tipo: "Comercial", responsavel: "Roberto Almeida", status: "Realizada" },
  { id: "VIS-004", data: "2026-07-15T14:00:00Z", dataFormatada: "15/07/2026 14:00", unidade: "PV Vega (PV-1055)", unidadeId: "PV-1055", tipo: "Estruturação", responsavel: "Roberto Almeida", status: "Realizada" },
  { id: "VIS-005", data: "2026-07-10T09:00:00Z", dataFormatada: "10/07/2026 09:00", unidade: "Curitiba-Norte (L003)", unidadeId: "L003", tipo: "Auditoria", responsavel: "Equipe de Auditoria", status: "Realizada" },
  { id: "VIS-006", data: "2026-07-05T11:00:00Z", dataFormatada: "05/07/2026 11:00", unidade: "SP-Centro (L001)", unidadeId: "L001", tipo: "Avaliação 360", responsavel: "Roberto Almeida", status: "Realizada" },
  { id: "VIS-007", data: "2026-06-28T14:00:00Z", dataFormatada: "28/06/2026 14:00", unidade: "RJ-Barra (L004)", unidadeId: "L004", tipo: "Comercial", responsavel: "Roberto Almeida", status: "Cancelada" },
  { id: "VIS-008", data: "2026-06-20T09:00:00Z", dataFormatada: "20/06/2026 09:00", unidade: "Campinas (L002)", unidadeId: "L002", tipo: "Estruturação", responsavel: "Roberto Almeida", status: "Realizada" },
  { id: "VIS-009", data: "2026-06-15T10:00:00Z", dataFormatada: "15/06/2026 10:00", unidade: "PV Zeta (PV-2091)", unidadeId: "PV-2091", tipo: "Comercial", responsavel: "Roberto Almeida", status: "Realizada" },
  { id: "VIS-010", data: "2026-06-10T14:00:00Z", dataFormatada: "10/06/2026 14:00", unidade: "Porto Alegre-Moinhos (L006)", unidadeId: "L006", tipo: "Auditoria", responsavel: "Equipe de Auditoria", status: "Realizada" },
  { id: "VIS-011", data: "2026-06-05T09:00:00Z", dataFormatada: "05/06/2026 09:00", unidade: "SP-Centro (L001)", unidadeId: "L001", tipo: "Comercial", responsavel: "Roberto Almeida", status: "Realizada" },
  { id: "VIS-012", data: "2026-05-28T11:00:00Z", dataFormatada: "28/05/2026 11:00", unidade: "Curitiba-Norte (L003)", unidadeId: "L003", tipo: "Comercial", responsavel: "Roberto Almeida", status: "Realizada" },
];

// --------------- Detail data ---------------

export const visitasDetalhe: Record<string, VisitaDetalhe> = {
  "VIS-001": {
    id: "VIS-001",
    data: "28/07/2026 às 14:00",
    unidade: { id: "L001", nome: "SP-Centro" },
    tipo: "Comercial",
    responsavel: "Roberto Almeida",
    status: "Agendada",
    objetivos: "Revisão das metas do Q3 e alinhamento com o gestor sobre expansão da equipe de consultores. Verificar progresso da adequação visual da fachada.",
    relatorio: null,
    anotacaoPrivada: null,
    ocorrenciaGerada: null,
  },
  "VIS-003": {
    id: "VIS-003",
    data: "20/07/2026 às 10:00",
    unidade: { id: "PV-1042", nome: "PV Alpha" },
    tipo: "Comercial",
    responsavel: "Roberto Almeida",
    status: "Realizada",
    objetivos: "Avaliação de performance individual dos consultores e revisão de carteiras ativas.",
    relatorio: "Reunião produtiva com Carlos Oliveira. Maria Santos com excelente desempenho — 22 carteiras ativas. Fernanda Lima precisa ampliar prospecção. Meta individual ajustada. Documentação em ordem.",
    anotacaoPrivada: "Carlos mencionou interesse em abrir um segundo PV na região da Mooca. Potencial forte — avaliar viabilidade no próximo ciclo de expansão.",
    ocorrenciaGerada: "OCC-003",
  },
  "VIS-004": {
    id: "VIS-004",
    data: "15/07/2026 às 14:00",
    unidade: { id: "PV-1055", nome: "PV Vega" },
    tipo: "Estruturação",
    responsavel: "Roberto Almeida",
    status: "Realizada",
    objetivos: "Avaliação de potencial para upgrade de nível (2.2 → 2.5). Análise de documentação e metas.",
    relatorio: "PV Vega operando dentro dos parâmetros para promoção. Faturamento crescente nos últimos 3 meses. Documentação societária em conformidade. Recomendo análise de promoção para Jun/2026.",
    anotacaoPrivada: null,
    ocorrenciaGerada: null,
  },
  "VIS-005": {
    id: "VIS-005",
    data: "10/07/2026 às 09:00",
    unidade: { id: "L003", nome: "Curitiba-Norte" },
    tipo: "Auditoria",
    responsavel: "Equipe de Auditoria",
    status: "Realizada",
    objetivos: "Auditoria semestral de conformidade documental e operacional.",
    relatorio: "Documentação parcialmente em conformidade. SLA de prévia excedido 2x no trimestre — penalidade já aplicada. Fachada com comunicação visual atualizada (regularizada). Recomendação: monitoramento mensal no próximo trimestre.",
    anotacaoPrivada: "Fernando Dias demonstrou resistência ao feedback sobre SLA. Postura defensiva. Necessário acompanhamento mais próximo da gestão regional.",
    ocorrenciaGerada: "OCC-009",
  },
  "VIS-006": {
    id: "VIS-006",
    data: "05/07/2026 às 11:00",
    unidade: { id: "L001", nome: "SP-Centro" },
    tipo: "Avaliação 360",
    responsavel: "Roberto Almeida",
    status: "Realizada",
    objetivos: "Aplicação do checklist gerencial semestral e avaliação 360 da unidade.",
    relatorio: "Rating A mantido com 94 pontos. Desempenho consistente em todos os critérios. Destaque para cumprimento de metas (98/100). Comunicação visual ainda com pendência menor na fachada lateral — prazo de adequação mantido.",
    anotacaoPrivada: null,
    ocorrenciaGerada: null,
  },
};
