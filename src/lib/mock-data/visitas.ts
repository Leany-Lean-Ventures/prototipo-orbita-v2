import { unidadesList } from "./unidades";
import { pvsList } from "./pvs";
import { formTemplatesList } from "./form-templates";

/**
 * Mock do módulo Visitas — reformulado (2026-07-26) de "agendar/registrar
 * visita futura" para "registrar visita já realizada" (checklist gerencial
 * de campo, PRD/checklist_visita_lojas_form_spec.md). Não existe mais
 * conceito de status (Agendada/Cancelada) — toda visita na lista já foi
 * realizada e registrada.
 */

export type VisitaTipo = "Comercial" | "Auditoria" | "Avaliação 360" | "Estruturação";
export type ChecklistResposta = "Sim" | "Não";

export const RESPONSAVEIS_VISITA = ["Roberto Almeida", "Equipe de Auditoria"] as const;

// --------------- Loja (Unidade ou PV) para o select do formulário ---------------

export interface LojaOption {
  id: string;
  nome: string;
  gestor: string;
  tipo: "Unidade" | "PV";
}

export const lojasParaVisita: LojaOption[] = [
  ...unidadesList.map((u) => ({ id: u.id, nome: `${u.nome} (${u.id})`, gestor: u.dono, tipo: "Unidade" as const })),
  ...pvsList.map((p) => ({ id: p.id, nome: `${p.nome} (${p.id})`, gestor: p.gestor, tipo: "PV" as const })),
];

function getLicenciadoGestor(unidadeId: string): string {
  return lojasParaVisita.find((l) => l.id === unidadeId)?.gestor ?? "—";
}

function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// --------------- Comunicação Visual (ambientes fotografados) ---------------

export type AmbienteKey =
  | "fachada"
  | "recepcao"
  | "salaAtendimento"
  | "salaGestor"
  | "salaReuniao"
  | "salaTreinamento"
  | "areaConsultores"
  | "bwc"
  | "copa";

export const AMBIENTES_COMUNICACAO_VISUAL: { key: AmbienteKey; label: string; detalhe?: string }[] = [
  { key: "fachada", label: "Fachada", detalhe: "Totem e selo" },
  { key: "recepcao", label: "Recepção", detalhe: "Painel, balcão e poltronas" },
  { key: "salaAtendimento", label: "Sala de atendimento" },
  { key: "salaGestor", label: "Sala do gestor" },
  { key: "salaReuniao", label: "Sala de reunião" },
  { key: "salaTreinamento", label: "Sala de treinamento", detalhe: "Se houver" },
  { key: "areaConsultores", label: "Área dos consultores" },
  { key: "bwc", label: "BWC (banheiro)" },
  { key: "copa", label: "Copa" },
];

// --------------- Checklist completo (PRD/checklist_visita_lojas_form_spec.md) ---------------

export interface VisitaChecklistDetalhe {
  planoCarreiras: { status: ChecklistResposta; formalizadoFront: ChecklistResposta; comprovacao: string; observacoes: string };
  processoContratacao: { status: ChecklistResposta; processoPeriodico: ChecklistResposta; observacoes: string };
  aceleradorAdemicon: { status: ChecklistResposta; treinamentoPlataforma: ChecklistResposta; focal: string; observacoes: string };
  multiplicador: { status: ChecklistResposta; nome: string; observacoes: string };
  avaliacoesPrevias: { dashboardExplorado: boolean; candidatosUtilizando: string; observacoes: string };
  devolutivaBackoffice: { feedback: string; observacoes: string };
  visitaDiretoria: { ultimaData: string; quemFoi: string; necessidadesTreinamento: string; observacoes: string };
  normativaDigital: { status: ChecklistResposta; observacoes: string };
  avaliacao360Premissas: { devolutiva: string; novasPremissasExplicadas: boolean; observacoes: string };
  comunicacaoVisual: Record<AmbienteKey, number>;
  comunicacaoVisualObservacoes: string;
  observacoesAdicionais: string;
}

const FOCAIS = ["Ana Lima", "Bruno Castro", "Carla Nogueira", "Diego Ramos"];
const MULTIPLICADORES = ["Fernanda Reis", "Gustavo Pinto", "Helena Souza", "Igor Bastos"];
const DIRETORES = ["Marcelo Vidal (Diretor Regional)", "Patrícia Gomes (Diretora Master)"];

/** Gera um checklist plausível e determinístico a partir do índice do registro — dado derivado, não duplicado à mão. */
function gerarChecklist(seed: number): VisitaChecklistDetalhe {
  const s = (offset: number): ChecklistResposta => ((seed + offset) % 5 === 0 ? "Não" : "Sim");

  return {
    planoCarreiras: {
      status: s(0),
      formalizadoFront: s(1),
      comprovacao: s(0) === "Sim" ? "Enviado por e-mail em até 5 dias úteis após a visita." : "",
      observacoes:
        s(0) === "Não"
          ? "Front ainda não recebeu o plano de carreiras formalizado — cobrar envio em até 5 dias úteis."
          : "Processo formalizado e divulgado ao front.",
    },
    processoContratacao: {
      status: s(2),
      processoPeriodico: s(3),
      observacoes:
        s(3) === "Sim"
          ? "Processo seletivo periódico, alinhado com o RH central."
          : "Contratações ocorrem de forma pontual, sem calendário definido.",
    },
    aceleradorAdemicon: {
      status: s(4),
      treinamentoPlataforma: s(0),
      focal: FOCAIS[seed % FOCAIS.length],
      observacoes: "Candidatos do Acelerador acompanhados semanalmente pelo focal indicado.",
    },
    multiplicador: {
      status: s(1),
      nome: MULTIPLICADORES[seed % MULTIPLICADORES.length],
      observacoes: "Multiplicador administrativo confirmado, sem acúmulo com função comercial.",
    },
    avaliacoesPrevias: {
      dashboardExplorado: seed % 2 === 0,
      candidatosUtilizando:
        "3 candidatos com alta indicação e baixa conversão identificados no dashboard — reforçado follow-up com o gestor.",
      observacoes: "",
    },
    devolutivaBackoffice: {
      feedback: "SLA de prévias dentro do esperado; qualitativo dos analistas elogiado pelo gestor da loja.",
      observacoes: "",
    },
    visitaDiretoria: {
      ultimaData: seed % 3 === 0 ? "" : `2026-0${(seed % 6) + 1}-15`,
      quemFoi: seed % 3 === 0 ? "" : DIRETORES[seed % DIRETORES.length],
      necessidadesTreinamento: "Reforço em normativa digital para a equipe de vendas.",
      observacoes: "",
    },
    normativaDigital: {
      status: s(2),
      observacoes: "Conteúdo repassado em reunião com toda a equipe.",
    },
    avaliacao360Premissas: {
      devolutiva: "Rating mantido, plano de ação focado em comunicação visual.",
      novasPremissasExplicadas: seed % 2 === 1,
      observacoes: "",
    },
    comunicacaoVisual: AMBIENTES_COMUNICACAO_VISUAL.reduce((acc, amb, idx) => {
      acc[amb.key] = (seed + idx) % 3 === 0 ? 0 : 1 + ((seed + idx) % 3);
      return acc;
    }, {} as Record<AmbienteKey, number>),
    comunicacaoVisualObservacoes: "Fachada e recepção dentro do padrão vigente.",
    observacoesAdicionais: "Visita transcorreu conforme planejado, sem pendências críticas.",
  };
}

// --------------- Alerta de cobertura ---------------

export interface AlertaCobertura {
  totalSemVisita180d: number;
  unidadesCriticas: string[];
}

export const alertaCobertura: AlertaCobertura = {
  totalSemVisita180d: 3,
  unidadesCriticas: ["L004 (RJ-Barra)", "L005 (BH-Savassi)", "L007 (Brasília-Asa Sul)"],
};

// --------------- List data ---------------

export interface VisitaListItem {
  id: string;
  dataVisita: string;
  dataVisitaFormatada: string;
  unidadeId: string;
  unidadeNome: string;
  licenciadoGestor: string;
  tipo: VisitaTipo;
  responsavelVisita: string;
  modeloUsado: string;
}

interface VisitaRaw {
  id: string;
  dataVisita: string;
  unidadeId: string;
  unidadeNome: string;
  tipo: VisitaTipo;
  responsavelVisita: string;
}

const VISITAS_RAW: VisitaRaw[] = [
  { id: "VIS-001", dataVisita: "2026-07-25", unidadeId: "L001", unidadeNome: "SP-Centro (L001)", tipo: "Comercial", responsavelVisita: "Roberto Almeida" },
  { id: "VIS-002", dataVisita: "2026-07-24", unidadeId: "L002", unidadeNome: "Campinas (L002)", tipo: "Auditoria", responsavelVisita: "Roberto Almeida" },
  { id: "VIS-003", dataVisita: "2026-07-20", unidadeId: "PV-1042", unidadeNome: "PV Alpha (PV-1042)", tipo: "Comercial", responsavelVisita: "Roberto Almeida" },
  { id: "VIS-004", dataVisita: "2026-07-15", unidadeId: "PV-1055", unidadeNome: "PV Vega (PV-1055)", tipo: "Estruturação", responsavelVisita: "Roberto Almeida" },
  { id: "VIS-005", dataVisita: "2026-07-10", unidadeId: "L003", unidadeNome: "Curitiba-Norte (L003)", tipo: "Auditoria", responsavelVisita: "Equipe de Auditoria" },
  { id: "VIS-006", dataVisita: "2026-07-05", unidadeId: "L001", unidadeNome: "SP-Centro (L001)", tipo: "Avaliação 360", responsavelVisita: "Roberto Almeida" },
  { id: "VIS-007", dataVisita: "2026-06-28", unidadeId: "L004", unidadeNome: "RJ-Barra (L004)", tipo: "Comercial", responsavelVisita: "Roberto Almeida" },
  { id: "VIS-008", dataVisita: "2026-06-20", unidadeId: "L002", unidadeNome: "Campinas (L002)", tipo: "Estruturação", responsavelVisita: "Roberto Almeida" },
  { id: "VIS-009", dataVisita: "2026-06-15", unidadeId: "PV-2091", unidadeNome: "PV Zeta (PV-2091)", tipo: "Comercial", responsavelVisita: "Roberto Almeida" },
  { id: "VIS-010", dataVisita: "2026-06-10", unidadeId: "L006", unidadeNome: "Porto Alegre-Moinhos (L006)", tipo: "Auditoria", responsavelVisita: "Equipe de Auditoria" },
  { id: "VIS-011", dataVisita: "2026-06-05", unidadeId: "L001", unidadeNome: "SP-Centro (L001)", tipo: "Comercial", responsavelVisita: "Roberto Almeida" },
  { id: "VIS-012", dataVisita: "2026-05-28", unidadeId: "L003", unidadeNome: "Curitiba-Norte (L003)", tipo: "Comercial", responsavelVisita: "Roberto Almeida" },
];

export const visitasList: VisitaListItem[] = VISITAS_RAW.map((r, i) => ({
  ...r,
  dataVisitaFormatada: formatDateBR(r.dataVisita),
  licenciadoGestor: getLicenciadoGestor(r.unidadeId),
  modeloUsado: formTemplatesList[i % formTemplatesList.length].nome,
}));

// --------------- Detail data (derivado, não duplicado) ---------------

export interface VisitaDetalhe extends VisitaListItem {
  checklist: VisitaChecklistDetalhe;
  anotacaoPrivada: string | null;
  ocorrenciaGerada: string | null;
}

const OCORRENCIA_POR_VISITA: Record<string, string> = {
  "VIS-003": "OCC-003",
  "VIS-005": "OCC-009",
};

export function getVisitaDetalhe(id: string): VisitaDetalhe | undefined {
  const idx = VISITAS_RAW.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  const item = visitasList[idx];
  return {
    ...item,
    checklist: gerarChecklist(idx),
    anotacaoPrivada:
      idx % 4 === 1
        ? "Equipe demonstrou resistência ao feedback sobre SLA. Necessário acompanhamento mais próximo da gestão regional."
        : null,
    ocorrenciaGerada: OCORRENCIA_POR_VISITA[id] ?? null,
  };
}
