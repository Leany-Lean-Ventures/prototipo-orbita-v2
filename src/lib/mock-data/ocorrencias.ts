export type OcorrenciaTipo = "Conflito" | "Visita" | "Notificação" | "Penalidade" | "Contrato" | "Denúncia";
export type OcorrenciaStatus = "Aberto" | "Em andamento" | "Resolvido";
export type OcorrenciaCanal = "WhatsApp" | "E-mail" | "Ligação" | "Sistema" | "Denúncia";

export interface EntidadeVinculada {
  tipo: "Unidade" | "PV" | "Consultor";
  nome: string;
  id: string;
}

export interface Interacao {
  data: string;
  autor: string;
  texto: string;
}

export interface OcorrenciaItem {
  id: string;
  tipo: OcorrenciaTipo;
  colorTheme: string;
  titulo: string;
  entidade: string;
  data: string;
  tempo: string;
  responsavel: string;
  status: OcorrenciaStatus;
}

export interface OcorrenciaDetalhe {
  id: string;
  tipo: OcorrenciaTipo;
  colorTheme: string;
  titulo: string;
  status: OcorrenciaStatus;
  dataCriacao: string;
  criador: string;
  canal: OcorrenciaCanal;
  descricao: string;
  entidades: EntidadeVinculada[];
  anotacaoPrivada: string | null;
  historicoInteracoes: Interacao[];
  desfecho?: string;
  dataResolucao?: string;
}

// Color config per tipo
export const TIPO_CONFIG: Record<OcorrenciaTipo, { color: string; bg: string; border: string }> = {
  Conflito: { color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
  Visita: { color: "text-success", bg: "bg-success/10", border: "border-success/20" },
  Notificação: { color: "text-blue-600", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  Penalidade: { color: "text-violet-600", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  Contrato: { color: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  Denúncia: { color: "text-rose-600", bg: "bg-rose-500/10", border: "border-rose-500/20" },
};

// --------------- List data ---------------

export const ocorrenciasList: OcorrenciaItem[] = [
  { id: "OCC-001", tipo: "Conflito", colorTheme: "red", titulo: "Disputa de território entre lojas", entidade: "L001 (SP-Centro) / Ana Lima", data: "2026-07-20T10:00:00Z", tempo: "há 3d", responsavel: "Roberto Almeida", status: "Aberto" },
  { id: "OCC-002", tipo: "Penalidade", colorTheme: "violet", titulo: "Comunicação visual desatualizada", entidade: "L001 (SP-Centro)", data: "2026-07-15T14:30:00Z", tempo: "há 8d", responsavel: "Roberto Almeida", status: "Em andamento" },
  { id: "OCC-003", tipo: "Visita", colorTheme: "green", titulo: "Visita semestral de acompanhamento", entidade: "PV-1042 (PV Alpha)", data: "2026-07-10T09:00:00Z", tempo: "há 13d", responsavel: "Roberto Almeida", status: "Resolvido" },
  { id: "OCC-004", tipo: "Notificação", colorTheme: "blue", titulo: "Atraso no envio de relatório mensal", entidade: "PV-1055 (PV Vega)", data: "2026-07-08T11:00:00Z", tempo: "há 15d", responsavel: "Roberto Almeida", status: "Resolvido" },
  { id: "OCC-005", tipo: "Contrato", colorTheme: "amber", titulo: "Renovação contratual pendente", entidade: "L003 (Curitiba-Norte)", data: "2026-07-05T16:00:00Z", tempo: "há 18d", responsavel: "Jurídico Ademicon", status: "Em andamento" },
  { id: "OCC-006", tipo: "Denúncia", colorTheme: "rose", titulo: "Denúncia de prática comercial irregular", entidade: "C012 (PC Negócios ME)", data: "2026-07-01T08:30:00Z", tempo: "há 22d", responsavel: "Diretoria", status: "Aberto" },
  { id: "OCC-007", tipo: "Conflito", colorTheme: "red", titulo: "Sobreposição de carteira entre consultores", entidade: "C001 (MS Assessoria Ltda) / C005 (FL Participações ME)", data: "2026-06-28T14:00:00Z", tempo: "há 25d", responsavel: "Carlos Oliveira", status: "Resolvido" },
  { id: "OCC-008", tipo: "Visita", colorTheme: "green", titulo: "Auditoria de conformidade documental", entidade: "L002 (Campinas)", data: "2026-06-25T10:00:00Z", tempo: "há 28d", responsavel: "Equipe de Auditoria", status: "Resolvido" },
  { id: "OCC-009", tipo: "Penalidade", colorTheme: "violet", titulo: "SLA de prévia vencido — reincidência", entidade: "L003 (Curitiba-Norte)", data: "2026-06-20T09:00:00Z", tempo: "há 33d", responsavel: "Roberto Almeida", status: "Resolvido" },
  { id: "OCC-010", tipo: "Notificação", colorTheme: "blue", titulo: "Mudança societária não comunicada", entidade: "L004 (RJ-Barra)", data: "2026-06-15T11:30:00Z", tempo: "há 38d", responsavel: "Jurídico Ademicon", status: "Aberto" },
  { id: "OCC-011", tipo: "Visita", colorTheme: "green", titulo: "Visita de início de ano — alinhamento de metas", entidade: "PV-2091 (PV Zeta)", data: "2026-06-10T09:00:00Z", tempo: "há 43d", responsavel: "Roberto Almeida", status: "Resolvido" },
  { id: "OCC-012", tipo: "Contrato", colorTheme: "amber", titulo: "Alteração de cláusula contratual", entidade: "PV-1042 (PV Alpha)", data: "2026-06-05T15:00:00Z", tempo: "há 48d", responsavel: "Jurídico Ademicon", status: "Resolvido" },
];

// --------------- Detail data ---------------

export const ocorrenciasDetalhe: Record<string, OcorrenciaDetalhe> = {
  "OCC-001": {
    id: "OCC-001",
    tipo: "Conflito",
    colorTheme: "red",
    titulo: "Disputa de território entre lojas",
    status: "Aberto",
    dataCriacao: "20/07/2026 às 10:00",
    criador: "Roberto Almeida",
    canal: "WhatsApp",
    descricao: "Consultor da unidade Campinas prospectou cliente na mesma rua da unidade SP-Centro. Gerou reclamação formal via WhatsApp. O gestor da SP-Centro relatou que já havia contato prévio com o cliente.",
    entidades: [
      { tipo: "Unidade", nome: "SP-Centro", id: "L001" },
      { tipo: "Consultor", nome: "Ana Lima", id: "C004" },
    ],
    anotacaoPrivada: "Gestor da SP-Centro está insatisfeito há meses com a falta de limite territorial. Necessário intervir rápido para evitar perda do parceiro. Considerar reunião presencial com ambas as partes.",
    historicoInteracoes: [
      { data: "20/07/2026 10:30", autor: "Roberto Almeida", texto: "Liguei para as duas partes, agendada reunião de conciliação para amanhã às 14h." },
      { data: "21/07/2026 15:00", autor: "Roberto Almeida", texto: "Reunião realizada. Ambas as partes concordaram com divisão territorial pela Av. Paulista. Aguardando formalização por escrito." },
    ],
  },
  "OCC-002": {
    id: "OCC-002",
    tipo: "Penalidade",
    colorTheme: "violet",
    titulo: "Comunicação visual desatualizada",
    status: "Em andamento",
    dataCriacao: "15/07/2026 às 14:30",
    criador: "Roberto Almeida",
    canal: "Sistema",
    descricao: "Fachada e materiais internos da unidade SP-Centro fora do padrão atualizado em Jan/2026. Prazo de adequação de 90 dias já expirado. Penalidade de 1,5% aplicada sobre comissão.",
    entidades: [
      { tipo: "Unidade", nome: "SP-Centro", id: "L001" },
    ],
    anotacaoPrivada: null,
    historicoInteracoes: [
      { data: "15/07/2026 14:30", autor: "Roberto Almeida", texto: "Penalidade registrada no sistema. Notificação enviada ao gestor da unidade." },
      { data: "18/07/2026 09:00", autor: "João Silva", texto: "Solicito prazo adicional de 30 dias. Fornecedor de fachada com atraso na entrega." },
      { data: "18/07/2026 11:00", autor: "Roberto Almeida", texto: "Prazo estendido até 15/08. Penalidade mantida até regularização." },
    ],
  },
  "OCC-003": {
    id: "OCC-003",
    tipo: "Visita",
    colorTheme: "green",
    titulo: "Visita semestral de acompanhamento",
    status: "Resolvido",
    dataCriacao: "10/07/2026 às 09:00",
    criador: "Roberto Almeida",
    canal: "Sistema",
    descricao: "Visita de rotina ao PV Alpha para avaliação de conformidade operacional e revisão de metas do segundo semestre.",
    entidades: [
      { tipo: "PV", nome: "PV Alpha", id: "PV-1042" },
    ],
    anotacaoPrivada: "Carlos demonstrou interesse em expandir para um segundo PV na região da Mooca. Avaliar viabilidade no próximo trimestre.",
    historicoInteracoes: [
      { data: "10/07/2026 09:00", autor: "Roberto Almeida", texto: "Visita iniciada. Documentação em ordem, fachada adequada." },
      { data: "10/07/2026 11:30", autor: "Roberto Almeida", texto: "Reunião com Carlos Oliveira. Metas revisadas: 30 vendas/mês no H2. Equipe motivada." },
    ],
    desfecho: "Visita concluída com sucesso. Sem pendências.",
    dataResolucao: "10/07/2026",
  },
  "OCC-006": {
    id: "OCC-006",
    tipo: "Denúncia",
    colorTheme: "rose",
    titulo: "Denúncia de prática comercial irregular",
    status: "Aberto",
    dataCriacao: "01/07/2026 às 08:30",
    criador: "Diretoria",
    canal: "Denúncia",
    descricao: "Recebida denúncia anônima sobre prática de venda casada no PV do consultor Pedro Costa (Curitiba-Norte). Cliente alega ter sido condicionado a contratar seguro para liberar consórcio.",
    entidades: [
      { tipo: "Consultor", nome: "Pedro Costa", id: "C012" },
      { tipo: "Unidade", nome: "Curitiba-Norte", id: "L003" },
    ],
    anotacaoPrivada: "Denúncia recebida pelo canal anônimo. Pedro Costa já teve advertência anterior por conduta similar em 2025. Caso pode resultar em descredenciamento se comprovado.",
    historicoInteracoes: [
      { data: "01/07/2026 09:00", autor: "Diretoria", texto: "Denúncia registrada. Encaminhada para apuração pelo departamento de compliance." },
      { data: "03/07/2026 14:00", autor: "Compliance", texto: "Solicitado depoimento do cliente denunciante. Aguardando retorno." },
    ],
  },
  "OCC-010": {
    id: "OCC-010",
    tipo: "Notificação",
    colorTheme: "blue",
    titulo: "Mudança societária não comunicada",
    status: "Aberto",
    dataCriacao: "15/06/2026 às 11:30",
    criador: "Jurídico Ademicon",
    canal: "Sistema",
    descricao: "Identificada alteração no quadro societário da unidade RJ-Barra sem comunicação formal à Ademicon. Sócio minoritário (45%) foi substituído sem notificação prévia, conforme exigido em contrato.",
    entidades: [
      { tipo: "Unidade", nome: "RJ-Barra", id: "L004" },
    ],
    anotacaoPrivada: "Situação societária da RJ-Barra vem se deteriorando. Novo sócio não tem histórico no setor. Monitorar de perto nos próximos 90 dias.",
    historicoInteracoes: [
      { data: "15/06/2026 11:30", autor: "Jurídico Ademicon", texto: "Irregularidade detectada via consulta a junta comercial. Notificação extrajudicial enviada." },
      { data: "20/06/2026 16:00", autor: "Patrícia Nogueira", texto: "Reconhece a falha na comunicação. Solicita prazo para regularização documental." },
    ],
  },
};
