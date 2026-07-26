import { addDays } from "date-fns";

/**
 * Mock do módulo Esteira → Promoção de Consultores
 * (PRD/promocao_consultores_kanban_spec.md)
 * 6 etapas, gated transitions, deliberação com ramificação.
 */

export type EtapaPromocaoId =
  | "SOLICITACAO"
  | "VALIDACAO"
  | "ESTRUTURA_PV"
  | "DELIBERACAO"
  | "EFETIVACAO"
  | "VIGENTE";

export type StatusPromocao = "ativo" | "bloqueado" | "aprovado" | "reprovado" | "vigente" | "cancelado";

export type TipoMovimento = "promocao" | "troca_de_contrato" | "convite_socio";

export type NivelId =
  | "PREVIA"
  | "AUTORIZADO_I"
  | "AUTORIZADO_II"
  | "AUTORIZADO_III"
  | "LICENCIADO_I"
  | "LICENCIADO_II"
  | "LICENCIADO_LOJISTA";

export type CanalOrigem = "whatsapp" | "telefone" | "visita" | "email" | "sistema";

export interface EtapaPromocaoConfig {
  id: EtapaPromocaoId;
  ordem: number;
  nome: string;
  responsavel: string;
  slaDias: number | null;
}

export const NIVEIS_LABEL: Record<NivelId, { nome: string; comissao: string }> = {
  PREVIA: { nome: "Prévia", comissao: "2,0%" },
  AUTORIZADO_I: { nome: "Autorizado I", comissao: "2,0%" },
  AUTORIZADO_II: { nome: "Autorizado II", comissao: "2,2%" },
  AUTORIZADO_III: { nome: "Autorizado III", comissao: "2,5%" },
  LICENCIADO_I: { nome: "Licenciado I", comissao: "2,7%" },
  LICENCIADO_II: { nome: "Licenciado II", comissao: "3,0%" },
  LICENCIADO_LOJISTA: { nome: "Licenciado Lojista", comissao: "3,5%" },
};

export function nivelSeguinte(nivel: NivelId): NivelId | null {
  const ordem: NivelId[] = ["PREVIA", "AUTORIZADO_I", "AUTORIZADO_II", "AUTORIZADO_III", "LICENCIADO_I", "LICENCIADO_II", "LICENCIADO_LOJISTA"];
  const idx = ordem.indexOf(nivel);
  return idx < ordem.length - 1 ? ordem[idx + 1] : null;
}

export const ETAPAS_PROMOCAO: EtapaPromocaoConfig[] = [
  { id: "SOLICITACAO", ordem: 1, nome: "Solicitação de promoção", responsavel: "Gestor da unidade", slaDias: 3 },
  { id: "VALIDACAO", ordem: 2, nome: "Validação: plano × trajetória × score", responsavel: "Gerente de BU + Gestor", slaDias: 5 },
  { id: "ESTRUTURA_PV", ordem: 3, nome: "Estrutura de PV na origem", responsavel: "Loja + Back-office", slaDias: 5 },
  { id: "DELIBERACAO", ordem: 4, nome: "Deliberação / aprovação", responsavel: "Autoridade por nível", slaDias: 10 },
  { id: "EFETIVACAO", ordem: 5, nome: "Escrita governada + janela mensal", responsavel: "Comissões + TI", slaDias: null },
  { id: "VIGENTE", ordem: 6, nome: "Nova categoria vigente", responsavel: "—", slaDias: null },
];

const ETAPA_ORDEM: EtapaPromocaoId[] = ETAPAS_PROMOCAO.map((e) => e.id);
export function etapaPromocaoIndex(etapa: EtapaPromocaoId): number {
  return ETAPA_ORDEM.indexOf(etapa);
}
export function getEtapaPromocaoConfig(etapa: EtapaPromocaoId): EtapaPromocaoConfig {
  return ETAPAS_PROMOCAO[etapaPromocaoIndex(etapa)];
}

export const STATUS_PROMOCAO_LABEL: Record<StatusPromocao, string> = {
  ativo: "Ativo",
  bloqueado: "Bloqueado",
  aprovado: "Aprovado",
  reprovado: "Reprovado",
  vigente: "Vigente",
  cancelado: "Cancelado",
};

export const STATUS_PROMOCAO_COLOR: Record<StatusPromocao, string> = {
  ativo: "#3b82f6",
  bloqueado: "#f59e0b",
  aprovado: "#8bc34b",
  reprovado: "#dc2626",
  vigente: "#16a34a",
  cancelado: "#64748b",
};

export const CANAL_LABEL: Record<CanalOrigem, string> = {
  whatsapp: "WhatsApp",
  telefone: "Telefone",
  visita: "Visita",
  email: "E-mail",
  sistema: "Sistema",
};

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const HOJE = new Date("2026-07-26");

// --------------- Log / Histórico ---------------

export interface LogEtapaPromocao {
  etapa: EtapaPromocaoId;
  entrouEm: string;
  saiuEm: string | null;
  responsavel: string;
  decisao: string | null;
  justificativa: string | null;
}

function gerarHistorico(etapaAtual: EtapaPromocaoId, createdAt: string, status: StatusPromocao) {
  const idx = etapaPromocaoIndex(etapaAtual);
  let cursor = new Date(createdAt);
  const historico: LogEtapaPromocao[] = [];

  for (let i = 0; i < idx; i++) {
    const cfg = ETAPAS_PROMOCAO[i];
    const entrouEm = toISO(cursor);
    const duracao = Math.min(cfg.slaDias ?? 5, 8);
    cursor = addDays(cursor, duracao);
    historico.push({
      etapa: cfg.id,
      entrouEm,
      saiuEm: toISO(cursor),
      responsavel: cfg.responsavel,
      decisao: cfg.id === "DELIBERACAO" ? "aprovado" : null,
      justificativa: null,
    });
  }

  const cfgAtual = ETAPAS_PROMOCAO[idx];
  const entrouEtapaAtual = toISO(cursor);
  const finalizado = status === "vigente" || status === "reprovado" || status === "cancelado";
  historico.push({
    etapa: etapaAtual,
    entrouEm: entrouEtapaAtual,
    saiuEm: finalizado ? toISO(addDays(cursor, 2)) : null,
    responsavel: cfgAtual.responsavel,
    decisao: status === "reprovado" ? "reprovado" : status === "cancelado" ? "cancelado" : finalizado ? "aprovado" : null,
    justificativa: status === "reprovado" ? "Plano não cumprido integralmente no prazo estipulado." : null,
  });

  const prazoEtapa = cfgAtual.slaDias != null ? toISO(addDays(new Date(entrouEtapaAtual), cfgAtual.slaDias)) : null;
  const emAtraso = status === "ativo" && prazoEtapa != null && HOJE > new Date(prazoEtapa);

  return { historico, prazoEtapa, updatedAt: entrouEtapaAtual, emAtraso };
}

// --------------- Modelo do registro ---------------

export interface RegistroPromocaoConsultor {
  id: string;
  etapaAtual: EtapaPromocaoId;
  status: StatusPromocao;
  createdAt: string;
  updatedAt: string;
  responsavelAtual: string;
  prazoEtapa: string | null;
  emAtraso: boolean;
  historico: LogEtapaPromocao[];

  // Bloco A — Solicitação
  consultorNome: string;
  razaoSocial: string;
  matricula: string;
  nivelAtual: NivelId;
  nivelAlvo: NivelId;
  tipoMovimento: TipoMovimento;
  percentualAtual: string;
  teraEquipeAbaixo: boolean;
  canalOrigem: CanalOrigem;
  lojaOrigem: string;

  // Bloco B — Validação
  tempoCasaMeses?: number;
  volumeVendasMensal?: number;
  retencaoPercentual?: number;
  scoreConsultor?: number;
  criteriosChecados?: boolean;

  // Bloco C — Estrutura PV
  cadeiaPVDeclarada?: boolean;
  monotonicidadeOk?: boolean;

  // Bloco D — Deliberação
  autoridadeAprovadora?: string;
  dataDeliberacao?: string;
  decisao?: "aprovado" | "reprovado" | "ajuste";
  justificativa?: string;

  // Bloco E — Efetivação
  janelaEfetivacao?: string;
  gravacaoSis2Ok?: boolean;
  aditivoAssinado?: boolean;
  dataVigencia?: string;
}

// --------------- Raw data ---------------

interface RegistroRaw {
  id: string;
  consultorNome: string;
  razaoSocial: string;
  matricula: string;
  nivelAtual: NivelId;
  tipoMovimento: TipoMovimento;
  percentualAtual: string;
  teraEquipeAbaixo: boolean;
  canalOrigem: CanalOrigem;
  lojaOrigem: string;
  createdAt: string;
  etapaAtual: EtapaPromocaoId;
  status: StatusPromocao;
}

const REGISTROS_RAW: RegistroRaw[] = [
  { id: "PC-001", consultorNome: "Maria Santos", razaoSocial: "MS Assessoria Ltda", matricula: "M-30001", nivelAtual: "AUTORIZADO_I", tipoMovimento: "promocao", percentualAtual: "2,0%", teraEquipeAbaixo: false, canalOrigem: "sistema", lojaOrigem: "SP-Centro", createdAt: "2026-07-25", etapaAtual: "SOLICITACAO", status: "ativo" },
  { id: "PC-002", consultorNome: "Rafael Costa", razaoSocial: "RC Consórcios ME", matricula: "M-30006", nivelAtual: "AUTORIZADO_I", tipoMovimento: "promocao", percentualAtual: "2,0%", teraEquipeAbaixo: false, canalOrigem: "whatsapp", lojaOrigem: "SP-Centro", createdAt: "2026-07-24", etapaAtual: "SOLICITACAO", status: "ativo" },

  { id: "PC-003", consultorNome: "Fernanda Lima", razaoSocial: "FL Participações ME", matricula: "M-30005", nivelAtual: "AUTORIZADO_II", tipoMovimento: "promocao", percentualAtual: "2,2%", teraEquipeAbaixo: true, canalOrigem: "email", lojaOrigem: "SP-Centro", createdAt: "2026-07-20", etapaAtual: "VALIDACAO", status: "ativo" },
  { id: "PC-004", consultorNome: "André Pereira", razaoSocial: "AP Investimentos", matricula: "M-30008", nivelAtual: "AUTORIZADO_I", tipoMovimento: "promocao", percentualAtual: "2,0%", teraEquipeAbaixo: false, canalOrigem: "telefone", lojaOrigem: "SP-Centro", createdAt: "2026-07-18", etapaAtual: "VALIDACAO", status: "ativo" },

  { id: "PC-005", consultorNome: "Carlos Oliveira", razaoSocial: "Alpha Consórcios LTDA", matricula: "M-20042", nivelAtual: "AUTORIZADO_III", tipoMovimento: "promocao", percentualAtual: "2,5%", teraEquipeAbaixo: true, canalOrigem: "visita", lojaOrigem: "SP-Centro", createdAt: "2026-07-12", etapaAtual: "ESTRUTURA_PV", status: "ativo" },

  { id: "PC-006", consultorNome: "Beatriz Souza", razaoSocial: "BS Investimentos Ltda", matricula: "M-30003", nivelAtual: "AUTORIZADO_II", tipoMovimento: "promocao", percentualAtual: "2,2%", teraEquipeAbaixo: true, canalOrigem: "sistema", lojaOrigem: "SP-Centro", createdAt: "2026-07-05", etapaAtual: "DELIBERACAO", status: "ativo" },
  { id: "PC-007", consultorNome: "Juliana Mendes", razaoSocial: "JM Assessoria ME", matricula: "M-30007", nivelAtual: "AUTORIZADO_I", tipoMovimento: "promocao", percentualAtual: "2,0%", teraEquipeAbaixo: false, canalOrigem: "email", lojaOrigem: "SP-Centro", createdAt: "2026-06-28", etapaAtual: "DELIBERACAO", status: "reprovado" },

  { id: "PC-008", consultorNome: "Camila Rocha", razaoSocial: "CR Consórcios Ltda", matricula: "M-30009", nivelAtual: "AUTORIZADO_III", tipoMovimento: "promocao", percentualAtual: "2,5%", teraEquipeAbaixo: true, canalOrigem: "sistema", lojaOrigem: "Campinas", createdAt: "2026-06-20", etapaAtual: "EFETIVACAO", status: "ativo" },

  { id: "PC-009", consultorNome: "Lucas Martins", razaoSocial: "LM Participações ME", matricula: "M-30010", nivelAtual: "AUTORIZADO_I", tipoMovimento: "promocao", percentualAtual: "2,0%", teraEquipeAbaixo: false, canalOrigem: "telefone", lojaOrigem: "Campinas", createdAt: "2026-06-10", etapaAtual: "VIGENTE", status: "vigente" },

  { id: "PC-010", consultorNome: "Diego Farias", razaoSocial: "DF Consórcios ME", matricula: "M-30004", nivelAtual: "AUTORIZADO_II", tipoMovimento: "troca_de_contrato", percentualAtual: "2,2%", teraEquipeAbaixo: true, canalOrigem: "visita", lojaOrigem: "SP-Centro", createdAt: "2026-07-22", etapaAtual: "SOLICITACAO", status: "ativo" },

  { id: "PC-011", consultorNome: "Renata Lopes", razaoSocial: "RL Negócios Ltda", matricula: "M-30020", nivelAtual: "LICENCIADO_I", tipoMovimento: "convite_socio", percentualAtual: "2,7%", teraEquipeAbaixo: true, canalOrigem: "sistema", lojaOrigem: "Curitiba-Norte", createdAt: "2026-07-15", etapaAtual: "DELIBERACAO", status: "ativo" },

  { id: "PC-012", consultorNome: "Tiago Almeida", razaoSocial: "TA Consórcios Ltda", matricula: "M-30010", nivelAtual: "AUTORIZADO_II", tipoMovimento: "promocao", percentualAtual: "2,2%", teraEquipeAbaixo: true, canalOrigem: "email", lojaOrigem: "Campinas", createdAt: "2026-07-01", etapaAtual: "VALIDACAO", status: "cancelado" },
];

function gerarRegistro(raw: RegistroRaw, seed: number): RegistroPromocaoConsultor {
  const idx = etapaPromocaoIndex(raw.etapaAtual);
  const passou = (etapa: EtapaPromocaoId) => idx >= etapaPromocaoIndex(etapa);
  const { historico, prazoEtapa, updatedAt, emAtraso } = gerarHistorico(raw.etapaAtual, raw.createdAt, raw.status);

  const nivelAlvo = nivelSeguinte(raw.nivelAtual) ?? raw.nivelAtual;

  const registro: RegistroPromocaoConsultor = {
    id: raw.id,
    etapaAtual: raw.etapaAtual,
    status: raw.status,
    createdAt: raw.createdAt,
    updatedAt,
    responsavelAtual: getEtapaPromocaoConfig(raw.etapaAtual).responsavel,
    prazoEtapa,
    emAtraso,
    historico,
    consultorNome: raw.consultorNome,
    razaoSocial: raw.razaoSocial,
    matricula: raw.matricula,
    nivelAtual: raw.nivelAtual,
    nivelAlvo,
    tipoMovimento: raw.tipoMovimento,
    percentualAtual: raw.percentualAtual,
    teraEquipeAbaixo: raw.teraEquipeAbaixo,
    canalOrigem: raw.canalOrigem,
    lojaOrigem: raw.lojaOrigem,
  };

  if (passou("VALIDACAO")) {
    registro.tempoCasaMeses = 12 + seed * 3;
    registro.volumeVendasMensal = 800000 + seed * 120000;
    registro.retencaoPercentual = 94 + (seed % 6);
    registro.scoreConsultor = 650 + seed * 25;
    registro.criteriosChecados = true;
  }

  if (passou("ESTRUTURA_PV")) {
    registro.cadeiaPVDeclarada = true;
    registro.monotonicidadeOk = true;
  }

  if (passou("DELIBERACAO")) {
    registro.autoridadeAprovadora = "Gerente de BU";
    registro.dataDeliberacao = historico.find((h) => h.etapa === "DELIBERACAO")?.entrouEm ?? raw.createdAt;
    registro.decisao = raw.status === "reprovado" ? "reprovado" : "aprovado";
    registro.justificativa = raw.status === "reprovado"
      ? "Plano não cumprido integralmente no prazo estipulado."
      : "Todos os critérios do plano da loja atendidos. Score e trajetória compatíveis com o nível-alvo.";
  }

  if (passou("EFETIVACAO")) {
    registro.janelaEfetivacao = "21/08/2026";
    registro.gravacaoSis2Ok = idx > etapaPromocaoIndex("EFETIVACAO");
    registro.aditivoAssinado = idx > etapaPromocaoIndex("EFETIVACAO");
    registro.dataVigencia = "21/08/2026";
  }

  return registro;
}

export const registrosPromocaoConsultores: RegistroPromocaoConsultor[] = REGISTROS_RAW.map((raw, i) => gerarRegistro(raw, i + 1));

export function getRegistroPromocao(id: string): RegistroPromocaoConsultor | undefined {
  return registrosPromocaoConsultores.find((r) => r.id === id);
}

export function diasEmProcessoPromocao(registro: RegistroPromocaoConsultor): number {
  const created = new Date(registro.createdAt);
  const diff = Math.floor((HOJE.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

export function getResumoPromocao(registros: RegistroPromocaoConsultor[]) {
  const total = registros.filter((r) => r.status === "ativo").length;
  const finalizados = registros.filter((r) => r.status === "vigente").length;
  const dias = registros.filter((r) => r.status !== "cancelado").map((r) => diasEmProcessoPromocao(r));
  const tempoMedio = dias.length > 0 ? Math.round(dias.reduce((a, b) => a + b, 0) / dias.length) : 0;
  return { total, finalizados, tempoMedioDias: tempoMedio };
}
