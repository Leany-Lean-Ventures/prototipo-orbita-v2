import { addDays } from "date-fns";
import { unidadesList } from "./unidades";

/**
 * Mock do módulo Esteira → Abertura de Unidades
 * (PRD/abertura_unidades_kanban_spec.md — AS-IS §3.4.2 + Blueprint processo 5.2 · S-PROC-1).
 * Escopo fora de qualquer PRD numerado — pedido direto do usuário (2026-07-26, ver MEMORY.md).
 *
 * Cada registro é um card do Kanban que percorre as 8 etapas fixas do processo.
 * A config de etapas em Configurações (`etapasAberturaUnidadesConfig`) é
 * independente desta lista — por decisão explícita de escopo de MVP, editar a
 * config ali não reflete nas colunas deste Kanban.
 */

export type EtapaId =
  | "SOLICITACAO"
  | "ELEGIBILIDADE"
  | "PLANO_NEGOCIO"
  | "COMITE"
  | "DOCUMENTACAO"
  | "CONTRATO"
  | "OBRA"
  | "ABERTURA";

export type StatusRegistro = "ativo" | "bloqueado" | "aprovado" | "reprovado" | "concluido" | "cancelado";

export type CanalOrigem = "email" | "whatsapp" | "telefone" | "visita" | "sistema";

export interface EtapaConfig {
  id: EtapaId;
  ordem: number;
  nome: string;
  responsavel: string;
  slaDias: number | null;
}

export const ETAPAS_ABERTURA: EtapaConfig[] = [
  { id: "SOLICITACAO", ordem: 1, nome: "Solicitação de abertura", responsavel: "Licenciado solicitante", slaDias: 3 },
  { id: "ELEGIBILIDADE", ordem: 2, nome: "Filtro de elegibilidade", responsavel: "Gerente regional", slaDias: 5 },
  { id: "PLANO_NEGOCIO", ordem: 3, nome: "Plano de negócio", responsavel: "Gerente regional", slaDias: 15 },
  { id: "COMITE", ordem: 4, nome: "Comitê de expansão", responsavel: "Comitê (gerente + diretor + diretoria master)", slaDias: 15 },
  { id: "DOCUMENTACAO", ordem: 5, nome: "Aprovação e coleta de documentos", responsavel: "Gerente regional + back-office", slaDias: 20 },
  { id: "CONTRATO", ordem: 6, nome: "Contrato e dados bancários", responsavel: "Jurídico + licenciado", slaDias: 20 },
  { id: "OBRA", ordem: 7, nome: "Planejamento e execução da obra", responsavel: "Licenciado + equipe de obra", slaDias: 180 },
  { id: "ABERTURA", ordem: 8, nome: "Abertura e funcionamento", responsavel: "Licenciado / back-office", slaDias: null },
];

const ETAPA_ORDEM: EtapaId[] = ETAPAS_ABERTURA.map((e) => e.id);
export function etapaIndex(etapa: EtapaId): number {
  return ETAPA_ORDEM.indexOf(etapa);
}
export function getEtapaConfig(etapa: EtapaId): EtapaConfig {
  return ETAPAS_ABERTURA[etapaIndex(etapa)];
}

export const STATUS_LABEL: Record<StatusRegistro, string> = {
  ativo: "Ativo",
  bloqueado: "Bloqueado",
  aprovado: "Aprovado",
  reprovado: "Reprovado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export const STATUS_COLOR: Record<StatusRegistro, string> = {
  ativo: "#3b82f6",
  bloqueado: "#f59e0b",
  aprovado: "#8bc34b",
  reprovado: "#dc2626",
  concluido: "#16a34a",
  cancelado: "#64748b",
};

const CANAL_LABEL: Record<CanalOrigem, string> = {
  email: "E-mail",
  whatsapp: "WhatsApp",
  telefone: "Telefone",
  visita: "Visita",
  sistema: "Sistema",
};
export { CANAL_LABEL };

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const HOJE = new Date("2026-07-26");

// --------------- LogEtapa / histórico ---------------

export interface LogEtapa {
  etapa: EtapaId;
  entrouEm: string;
  saiuEm: string | null;
  responsavel: string;
  decisao: string | null;
  observacao: string | null;
}

function gerarHistorico(etapaAtual: EtapaId, createdAt: string, status: StatusRegistro) {
  const idx = etapaIndex(etapaAtual);
  let cursor = new Date(createdAt);
  const historico: LogEtapa[] = [];

  for (let i = 0; i < idx; i++) {
    const cfg = ETAPAS_ABERTURA[i];
    const entrouEm = toISO(cursor);
    const duracao = i === 6 ? 45 : Math.min(cfg.slaDias ?? 10, 18);
    cursor = addDays(cursor, duracao);
    historico.push({
      etapa: cfg.id,
      entrouEm,
      saiuEm: toISO(cursor),
      responsavel: cfg.responsavel,
      decisao: cfg.id === "COMITE" ? "aprovado" : null,
      observacao: null,
    });
  }

  const cfgAtual = ETAPAS_ABERTURA[idx];
  const entrouEtapaAtual = toISO(cursor);
  const finalizado = status === "concluido" || status === "reprovado" || status === "cancelado";
  historico.push({
    etapa: etapaAtual,
    entrouEm: entrouEtapaAtual,
    saiuEm: finalizado ? toISO(addDays(cursor, 2)) : null,
    responsavel: cfgAtual.responsavel,
    decisao: status === "reprovado" ? "reprovado" : status === "cancelado" ? "cancelado" : finalizado ? "aprovado" : null,
    observacao: null,
  });

  const prazoEtapa = cfgAtual.slaDias != null ? toISO(addDays(new Date(entrouEtapaAtual), cfgAtual.slaDias)) : null;
  const emAtraso = status === "ativo" && prazoEtapa != null && HOJE > new Date(prazoEtapa);

  return { historico, prazoEtapa, updatedAt: entrouEtapaAtual, emAtraso };
}

// --------------- Modelo completo do registro ---------------

export interface ChecklistDocumentoItem {
  item: string;
  status: "pendente" | "recebido" | "validado";
}

export interface RegistroAberturaUnidade {
  id: string;
  etapaAtual: EtapaId;
  status: StatusRegistro;
  createdAt: string;
  updatedAt: string;
  responsavelAtual: string;
  prazoEtapa: string | null;
  emAtraso: boolean;
  historico: LogEtapa[];

  // Bloco A — Solicitação
  licenciadoNome: string;
  lojaOrigem: string;
  cidadeAlvo: string;
  uf: string;
  canalOrigem: CanalOrigem;
  dataSolicitacao: string;
  observacoesIniciais: string;

  // Bloco B — Elegibilidade
  desempenhoPercentual?: number;
  conformidadeContratual?: boolean;
  cidadeDisponivel?: "sim" | "nao";
  parecerElegibilidade?: string;

  // Bloco C — Plano de negócio
  planoNegocioArquivo?: string;
  projecaoFaturamento?: number;
  perfilCidade?: string;
  equipeEstimada?: number;

  // Bloco D — Comitê
  dataReuniaoComite?: string;
  participantesComite?: string[];
  scoreComite?: number;
  decisaoComite?: "aprovado" | "reprovado" | "ajuste";
  justificativaComite?: string;

  // Bloco E — Documentação
  checklistDocumentos?: ChecklistDocumentoItem[];
  dataDocsCompletos?: string;

  // Bloco F — Contrato e dados bancários
  statusAssinatura?: "pendente" | "em_assinatura" | "assinado";
  banco?: string;
  agencia?: string;
  conta?: string;
  aceitePenalty?: boolean;

  // Bloco G — Obra
  dataInicioObra?: string;
  prazoPrevistoObra?: string;
  andamentoObra?: number;
  dataConclusaoObra?: string;
  extrapolacaoPrazo?: "sim" | "nao";
  motivoExtrapolacao?: string;

  // Bloco H — Abertura
  dataAbertura?: string;
  emailCorporativoCriado?: boolean;
  publicacaoSite?: boolean;
  metaDefinida?: boolean;
  territorioBloqueado?: boolean;
}

interface RegistroRaw {
  id: string;
  licenciadoNome: string;
  lojaOrigemId: string;
  cidadeAlvo: string;
  uf: string;
  canalOrigem: CanalOrigem;
  createdAt: string;
  etapaAtual: EtapaId;
  status: StatusRegistro;
  observacoesIniciais: string;
}

const CHECKLIST_PADRAO: string[] = [
  "Documento de identidade do responsável",
  "Comprovante de endereço",
  "Contrato social da PJ",
  "Comprovantes de conformidade contratual",
];

const BANCOS = ["Banco do Brasil", "Itaú", "Bradesco", "Santander", "Caixa Econômica"];

const REGISTROS_RAW: RegistroRaw[] = [
  { id: "AU-001", licenciadoNome: "Carlos Mendes", lojaOrigemId: "L001", cidadeAlvo: "Sorocaba", uf: "SP", canalOrigem: "sistema", createdAt: "2026-07-25", etapaAtual: "SOLICITACAO", status: "ativo", observacoesIniciais: "Licenciado já atua na região há 4 anos, quer abrir segunda unidade." },
  { id: "AU-002", licenciadoNome: "Fernanda Duarte", lojaOrigemId: "L002", cidadeAlvo: "Uberlândia", uf: "MG", canalOrigem: "whatsapp", createdAt: "2026-07-24", etapaAtual: "SOLICITACAO", status: "ativo", observacoesIniciais: "" },
  { id: "AU-003", licenciadoNome: "Roberto Salles", lojaOrigemId: "L003", cidadeAlvo: "Joinville", uf: "SC", canalOrigem: "email", createdAt: "2026-07-21", etapaAtual: "SOLICITACAO", status: "ativo", observacoesIniciais: "Interesse recorrente — segunda tentativa em 12 meses." },

  { id: "AU-004", licenciadoNome: "Juliana Prado", lojaOrigemId: "L004", cidadeAlvo: "Londrina", uf: "PR", canalOrigem: "visita", createdAt: "2026-07-21", etapaAtual: "ELEGIBILIDADE", status: "ativo", observacoesIniciais: "Indicada pelo gerente regional durante visita de rotina." },
  { id: "AU-005", licenciadoNome: "Marcos Vinícius Lima", lojaOrigemId: "L005", cidadeAlvo: "Feira de Santana", uf: "BA", canalOrigem: "telefone", createdAt: "2026-07-16", etapaAtual: "ELEGIBILIDADE", status: "ativo", observacoesIniciais: "" },

  { id: "AU-006", licenciadoNome: "Patrícia Andrade", lojaOrigemId: "L006", cidadeAlvo: "Caxias do Sul", uf: "RS", canalOrigem: "sistema", createdAt: "2026-07-12", etapaAtual: "PLANO_NEGOCIO", status: "ativo", observacoesIniciais: "" },
  { id: "AU-007", licenciadoNome: "Eduardo Nogueira", lojaOrigemId: "L007", cidadeAlvo: "Vitória", uf: "ES", canalOrigem: "email", createdAt: "2026-06-30", etapaAtual: "PLANO_NEGOCIO", status: "ativo", observacoesIniciais: "Plano em revisão após feedback do gerente regional." },

  { id: "AU-008", licenciadoNome: "Camila Torres", lojaOrigemId: "L008", cidadeAlvo: "Anápolis", uf: "GO", canalOrigem: "sistema", createdAt: "2026-06-28", etapaAtual: "COMITE", status: "ativo", observacoesIniciais: "" },
  { id: "AU-009", licenciadoNome: "Rafael Bittencourt", lojaOrigemId: "L001", cidadeAlvo: "Petrópolis", uf: "RJ", canalOrigem: "whatsapp", createdAt: "2026-06-18", etapaAtual: "COMITE", status: "reprovado", observacoesIniciais: "Cidade com bloqueio territorial de unidade vizinha." },

  { id: "AU-010", licenciadoNome: "Simone Carvalho", lojaOrigemId: "L002", cidadeAlvo: "Maringá", uf: "PR", canalOrigem: "email", createdAt: "2026-06-08", etapaAtual: "DOCUMENTACAO", status: "ativo", observacoesIniciais: "" },
  { id: "AU-011", licenciadoNome: "André Luiz Ferreira", lojaOrigemId: "L003", cidadeAlvo: "Juiz de Fora", uf: "MG", canalOrigem: "visita", createdAt: "2026-05-24", etapaAtual: "DOCUMENTACAO", status: "ativo", observacoesIniciais: "Documentação fragmentada — cobrado reenvio pelo back-office." },

  { id: "AU-012", licenciadoNome: "Beatriz Nunes", lojaOrigemId: "L004", cidadeAlvo: "Chapecó", uf: "SC", canalOrigem: "sistema", createdAt: "2026-05-23", etapaAtual: "CONTRATO", status: "ativo", observacoesIniciais: "" },

  { id: "AU-013", licenciadoNome: "Guilherme Assis", lojaOrigemId: "L005", cidadeAlvo: "Piracicaba", uf: "SP", canalOrigem: "telefone", createdAt: "2026-04-23", etapaAtual: "OBRA", status: "ativo", observacoesIniciais: "" },
  { id: "AU-014", licenciadoNome: "Larissa Monteiro", lojaOrigemId: "L006", cidadeAlvo: "Blumenau", uf: "SC", canalOrigem: "email", createdAt: "2026-01-05", etapaAtual: "OBRA", status: "ativo", observacoesIniciais: "Obra com atraso na entrega de material pelo fornecedor local." },

  { id: "AU-015", licenciadoNome: "Vinícius Tavares", lojaOrigemId: "L007", cidadeAlvo: "Ribeirão Preto", uf: "SP", canalOrigem: "sistema", createdAt: "2026-03-25", etapaAtual: "ABERTURA", status: "concluido", observacoesIniciais: "" },

  { id: "AU-016", licenciadoNome: "Tatiane Bezerra", lojaOrigemId: "L008", cidadeAlvo: "Presidente Prudente", uf: "SP", canalOrigem: "whatsapp", createdAt: "2026-06-13", etapaAtual: "ELEGIBILIDADE", status: "cancelado", observacoesIniciais: "Licenciado desistiu por motivos pessoais." },
];

function lojaNome(id: string): string {
  return unidadesList.find((u) => u.id === id)?.nome ?? id;
}

function gerarRegistro(raw: RegistroRaw, seed: number): RegistroAberturaUnidade {
  const idx = etapaIndex(raw.etapaAtual);
  const passou = (etapa: EtapaId) => idx >= etapaIndex(etapa);
  const { historico, prazoEtapa, updatedAt, emAtraso } = gerarHistorico(raw.etapaAtual, raw.createdAt, raw.status);

  const registro: RegistroAberturaUnidade = {
    id: raw.id,
    etapaAtual: raw.etapaAtual,
    status: raw.status,
    createdAt: raw.createdAt,
    updatedAt,
    responsavelAtual: getEtapaConfig(raw.etapaAtual).responsavel,
    prazoEtapa,
    emAtraso,
    historico,
    licenciadoNome: raw.licenciadoNome,
    lojaOrigem: lojaNome(raw.lojaOrigemId),
    cidadeAlvo: raw.cidadeAlvo,
    uf: raw.uf,
    canalOrigem: raw.canalOrigem,
    dataSolicitacao: raw.createdAt,
    observacoesIniciais: raw.observacoesIniciais,
  };

  if (passou("ELEGIBILIDADE")) {
    registro.desempenhoPercentual = Math.round((2.4 + (seed % 5) * 0.35) * 10) / 10;
    registro.conformidadeContratual = true;
    registro.cidadeDisponivel = "sim";
    registro.parecerElegibilidade = "Licenciado apto: desempenho acima da referência mínima e sem pendências contratuais.";
  }

  if (passou("PLANO_NEGOCIO")) {
    registro.planoNegocioArquivo = "plano-de-negocio.pdf";
    registro.projecaoFaturamento = 180000 + seed * 14500;
    registro.perfilCidade = `Cidade com aproximadamente ${120 + seed * 9} mil habitantes, comércio local forte e ${1 + (seed % 3)} concorrente(s) direto(s) na região.`;
    registro.equipeEstimada = 4 + (seed % 4);
  }

  if (passou("COMITE")) {
    const dataComite = historico.find((h) => h.etapa === "COMITE")?.entrouEm ?? raw.createdAt;
    registro.dataReuniaoComite = dataComite;
    registro.participantesComite = ["Gerente Regional", "Diretor Regional", "Diretoria Master"];
    registro.scoreComite = 68 + (seed % 28);
    registro.decisaoComite = raw.status === "reprovado" ? "reprovado" : "aprovado";
    registro.justificativaComite =
      raw.status === "reprovado"
        ? "Cidade-alvo dentro do raio de bloqueio territorial de unidade já ativa — solicitação reprovada."
        : "Plano consistente, projeção de faturamento compatível com o perfil da cidade e score acima do corte mínimo.";
  }

  if (passou("DOCUMENTACAO")) {
    const completo = idx > etapaIndex("DOCUMENTACAO");
    registro.checklistDocumentos = CHECKLIST_PADRAO.map((item, i) => ({
      item,
      status: completo || i < 3 ? "validado" : "recebido",
    }));
    if (completo) {
      registro.dataDocsCompletos = historico.find((h) => h.etapa === "DOCUMENTACAO")?.saiuEm ?? undefined;
    }
  }

  if (passou("CONTRATO")) {
    registro.statusAssinatura = idx > etapaIndex("CONTRATO") ? "assinado" : "em_assinatura";
    registro.banco = BANCOS[seed % BANCOS.length];
    registro.agencia = String(1000 + seed * 7);
    registro.conta = String(20000 + seed * 31);
    registro.aceitePenalty = true;
  }

  if (passou("OBRA")) {
    const dataInicio = historico.find((h) => h.etapa === "OBRA")?.entrouEm ?? raw.createdAt;
    registro.dataInicioObra = dataInicio;
    registro.prazoPrevistoObra = toISO(addDays(new Date(dataInicio), 180));
    const concluida = idx > etapaIndex("OBRA");
    registro.andamentoObra = concluida ? 100 : emAtraso ? 55 : 35 + (seed % 40);
    if (concluida) registro.dataConclusaoObra = historico.find((h) => h.etapa === "OBRA")?.saiuEm ?? undefined;
    registro.extrapolacaoPrazo = emAtraso ? "sim" : "nao";
    if (emAtraso) registro.motivoExtrapolacao = "Atraso na entrega de material pelo fornecedor local, sem previsão fechada de reposição.";
  }

  if (passou("ABERTURA")) {
    registro.dataAbertura = historico.find((h) => h.etapa === "ABERTURA")?.entrouEm;
    registro.emailCorporativoCriado = true;
    registro.publicacaoSite = true;
    registro.metaDefinida = true;
    registro.territorioBloqueado = true;
  }

  return registro;
}

export const registrosAberturaUnidades: RegistroAberturaUnidade[] = REGISTROS_RAW.map((r, i) => gerarRegistro(r, i));

export function getRegistroAbertura(id: string): RegistroAberturaUnidade | undefined {
  return registrosAberturaUnidades.find((r) => r.id === id);
}

// --------------- KPIs (resumo executivo do topo da página) ---------------

export function diasEmProcesso(registro: RegistroAberturaUnidade): number {
  const fim = registro.status === "concluido" || registro.status === "reprovado" || registro.status === "cancelado"
    ? new Date(registro.updatedAt)
    : HOJE;
  const inicio = new Date(registro.createdAt);
  return Math.round((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
}

export function getResumoAberturaUnidades(registros: RegistroAberturaUnidade[] = registrosAberturaUnidades) {
  const total = registros.length;
  const finalizados = registros.filter((r) => r.status === "concluido").length;
  const tempoMedioDias = total === 0 ? 0 : Math.round(registros.reduce((acc, r) => acc + diasEmProcesso(r), 0) / total);
  const emAtraso = registros.filter((r) => r.emAtraso).length;
  return { total, finalizados, tempoMedioDias, emAtraso };
}
