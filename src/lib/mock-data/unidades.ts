import {
  Store,
  Handshake,
  Flag,
  Trophy,
  ClipboardCheck,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

/**
 * Mock do módulo Unidades — schema e exemplo de dados em
 * PRD/PRD-02-Unidades.md §4. O schema formal (PRD/data-schema.json →
 * Unidade) é mais raso (sem carteiras/comissionamento/societária/histórico);
 * os tipos abaixo seguem o exemplo mais completo do PRD.
 *
 * Os tipos exportados aqui (Carteira, ComissionamentoInfo, SocietariaItem,
 * HistoricoItem, ConsultorVinculado, OrganizacionalNode) são reaproveitados
 * por `src/components/entity-detail/` — quando a etapa 5 (PVs) precisar do
 * mesmo shape, importar diretamente daqui em vez de duplicar (ver MEMORY.md).
 */

export type UnidadeStatus = "Ativo" | "Inativo" | "Suspenso";
export type Rating = "A" | "B" | "C";

export interface UnidadeListItem {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  dono: string;
  rating: Rating;
  ratingScore: number;
  status: UnidadeStatus;
}

export interface Carteira {
  id: string;
  cliente: string;
  status: "Ativa" | "Inativa";
  consultor: string | null;
  orfa: boolean;
}

export interface CascataItem {
  nivel: string;
  pct: number;
  qtd: number;
}

export interface Penalidade {
  motivo: string;
  descontoPct: number;
  vigenciaFim: string;
}

export interface ComissionamentoInfo {
  basePct: number;
  cascata: CascataItem[];
  penalidades: Penalidade[];
}

export interface SocietariaItem {
  razao: string;
  cnpj: string;
  papel: string;
  pct: number;
  status: "Ativo" | "Inativo";
}

export type HistoricoColor = "gray" | "green" | "red" | "amber" | "blue" | "violet";

export interface HistoricoItem {
  data: string;
  icon: LucideIcon;
  color: HistoricoColor;
  titulo: string;
  desc: string;
  status?: "Aberto" | "Resolvido";
}

export interface OrganizacionalNode {
  id: string;
  nome: string;
  nivelLabel: string;
  responsavel: string;
  depth: number;
}

export interface FinanceiroInfo {
  faturamentoConsolidado: number;
  ticketMedio: number;
  novosClientesMes: number;
  meses: string[];
  faturamentoSerie: number[];
  vendasSerie: number[];
}

export interface ConsultorVinculado {
  id: string;
  nome: string;
  iniciais: string;
  nivel: string;
  carteiraQtd: number;
}

export interface CriterioAvaliacao {
  criterio: string;
  score: number;
}

export interface Avaliacao360Info {
  ultimaAvaliacao: string;
  scoreGeral: number;
  criterios: CriterioAvaliacao[];
}

export interface UnidadeDetalhe {
  id: string;
  nome: string;
  status: UnidadeStatus;
  cidade: string;
  estado: string;
  dono: string;
  gerente: string;
  abertura: string;
  rating: Rating;
  ratingScore: number;
  organizacional: OrganizacionalNode[];
  financeiro: FinanceiroInfo;
  consultoresVinculados: ConsultorVinculado[];
  carteiras: Carteira[];
  comissionamento: ComissionamentoInfo;
  avaliacao360: Avaliacao360Info;
  societaria: SocietariaItem[];
  historico: HistoricoItem[];
}

export const unidadesList: UnidadeListItem[] = [
  { id: "L001", nome: "SP-Centro", cidade: "São Paulo", estado: "SP", dono: "João Silva", rating: "A", ratingScore: 94, status: "Ativo" },
  { id: "L002", nome: "Campinas", cidade: "Campinas", estado: "SP", dono: "Marina Reis", rating: "A", ratingScore: 87, status: "Ativo" },
  { id: "L003", nome: "Curitiba-Norte", cidade: "Curitiba", estado: "PR", dono: "Fernando Dias", rating: "B", ratingScore: 76, status: "Ativo" },
  { id: "L004", nome: "RJ-Barra", cidade: "Rio de Janeiro", estado: "RJ", dono: "Patrícia Nogueira", rating: "B", ratingScore: 71, status: "Suspenso" },
  { id: "L005", nome: "BH-Savassi", cidade: "Belo Horizonte", estado: "MG", dono: "Eduardo Martins", rating: "C", ratingScore: 58, status: "Ativo" },
  { id: "L006", nome: "Porto Alegre-Moinhos", cidade: "Porto Alegre", estado: "RS", dono: "Camila Torres", rating: "A", ratingScore: 91, status: "Ativo" },
  { id: "L007", nome: "Brasília-Asa Sul", cidade: "Brasília", estado: "DF", dono: "Ricardo Peixoto", rating: "C", ratingScore: 52, status: "Inativo" },
  { id: "L008", nome: "Salvador-Barra", cidade: "Salvador", estado: "BA", dono: "Juliana Farias", rating: "B", ratingScore: 79, status: "Ativo" },
];

const GERENTE = "Roberto Almeida";

export const unidadesDetalhe: Record<string, UnidadeDetalhe> = {
  L001: {
    id: "L001",
    nome: "SP-Centro",
    status: "Ativo",
    cidade: "São Paulo",
    estado: "SP",
    dono: "João Silva",
    gerente: GERENTE,
    abertura: "Mar 2018",
    rating: "A",
    ratingScore: 94,
    organizacional: [
      { id: "L001", nome: "SP-Centro", nivelLabel: "Licenciado 3.5", responsavel: "João Silva", depth: 0 },
      { id: "PV-1042", nome: "Equipe Alpha", nivelLabel: "Autorizado 2.5", responsavel: "Carlos Oliveira", depth: 1 },
      { id: "PV-1055", nome: "Equipe Vega", nivelLabel: "Autorizado 2.2", responsavel: "Beatriz Souza", depth: 1 },
      { id: "PV-2091", nome: "Núcleo Zeta", nivelLabel: "Autorizado 2.0", responsavel: "Diego Farias", depth: 2 },
    ],
    financeiro: {
      faturamentoConsolidado: 512400,
      ticketMedio: 8890,
      novosClientesMes: 14,
      meses: ["Jan/26", "Fev/26", "Mar/26", "Abr/26", "Mai/26", "Jun/26"],
      faturamentoSerie: [420000, 438000, 455000, 471000, 493000, 512400],
      vendasSerie: [48, 51, 53, 56, 58, 61],
    },
    consultoresVinculados: [
      { id: "C001", nome: "Maria Santos", iniciais: "MS", nivel: "Autorizado 2.5", carteiraQtd: 22 },
      { id: "C002", nome: "Carlos Oliveira", iniciais: "CO", nivel: "Autorizado 2.5", carteiraQtd: 19 },
      { id: "C003", nome: "Beatriz Souza", iniciais: "BS", nivel: "Autorizado 2.2", carteiraQtd: 15 },
    ],
    carteiras: [
      { id: "CRT-01", cliente: "Empresa X", status: "Ativa", consultor: "Maria Santos", orfa: false },
      { id: "CRT-02", cliente: "Cliente Y", status: "Inativa", consultor: null, orfa: true },
      { id: "CRT-03", cliente: "Construtora Alfa", status: "Ativa", consultor: "Carlos Oliveira", orfa: false },
      { id: "CRT-04", cliente: "Grupo Nortel", status: "Ativa", consultor: null, orfa: true },
    ],
    comissionamento: {
      basePct: 2.0,
      cascata: [
        { nivel: "Licenciado 3.5", pct: 2.0, qtd: 1 },
        { nivel: "Autorizado 2.5", pct: 0.8, qtd: 5 },
        { nivel: "Autorizado 2.2", pct: 0.5, qtd: 8 },
      ],
      penalidades: [
        { motivo: "Comunicação visual desatualizada", descontoPct: 1.5, vigenciaFim: "Dez 2026" },
      ],
    },
    avaliacao360: {
      ultimaAvaliacao: "Jun 2026",
      scoreGeral: 94,
      criterios: [
        { criterio: "Atendimento ao cliente", score: 96 },
        { criterio: "Padrão de comunicação visual", score: 82 },
        { criterio: "Cumprimento de metas", score: 98 },
        { criterio: "Conformidade documental", score: 95 },
      ],
    },
    societaria: [
      { razao: "Alpha Consultoria Ltda", cnpj: "12.345.678/0001-90", papel: "Licenciado Lojista", pct: 60, status: "Ativo" },
      { razao: "Beta Soluções ME", cnpj: "98.765.432/0001-10", papel: "Sócio", pct: 40, status: "Ativo" },
    ],
    historico: [
      { data: "Jun 2026", icon: ClipboardCheck, color: "gray", titulo: "Checklist gerencial semestral", desc: "Rating A mantido (94 pts)." },
      { data: "Jul 2025", icon: Trophy, color: "green", titulo: "João Silva → Licenciado 3.5", desc: "Nível máximo atingido." },
      { data: "Mai 2025", icon: Flag, color: "red", titulo: "Disputa de território", desc: "Conflito com unidade vizinha. Resolvido por acordo.", status: "Resolvido" },
      { data: "Mar 2018", icon: Store, color: "blue", titulo: "Abertura da unidade", desc: "Início de operação em São Paulo - Centro." },
    ],
  },

  L002: {
    id: "L002",
    nome: "Campinas",
    status: "Ativo",
    cidade: "Campinas",
    estado: "SP",
    dono: "Marina Reis",
    gerente: GERENTE,
    abertura: "Ago 2019",
    rating: "A",
    ratingScore: 87,
    organizacional: [
      { id: "L002", nome: "Campinas", nivelLabel: "Licenciado 3.5", responsavel: "Marina Reis", depth: 0 },
      { id: "PV-1108", nome: "Equipe Orion", nivelLabel: "Autorizado 2.7", responsavel: "Tiago Almeida", depth: 1 },
    ],
    financeiro: {
      faturamentoConsolidado: 398500,
      ticketMedio: 7420,
      novosClientesMes: 9,
      meses: ["Jan/26", "Fev/26", "Mar/26", "Abr/26", "Mai/26", "Jun/26"],
      faturamentoSerie: [340000, 352000, 361000, 374000, 386000, 398500],
      vendasSerie: [39, 40, 42, 44, 45, 47],
    },
    consultoresVinculados: [
      { id: "C010", nome: "Tiago Almeida", iniciais: "TA", nivel: "Autorizado 2.7", carteiraQtd: 18 },
      { id: "C011", nome: "Larissa Prado", iniciais: "LP", nivel: "Autorizado 2.2", carteiraQtd: 12 },
    ],
    carteiras: [
      { id: "CRT-20", cliente: "Metalúrgica Souza", status: "Ativa", consultor: "Tiago Almeida", orfa: false },
      { id: "CRT-21", cliente: "Padaria Bom Pão", status: "Ativa", consultor: "Larissa Prado", orfa: false },
    ],
    comissionamento: {
      basePct: 2.0,
      cascata: [
        { nivel: "Licenciado 3.5", pct: 2.0, qtd: 1 },
        { nivel: "Autorizado 2.7", pct: 1.0, qtd: 3 },
      ],
      penalidades: [],
    },
    avaliacao360: {
      ultimaAvaliacao: "Mai 2026",
      scoreGeral: 87,
      criterios: [
        { criterio: "Atendimento ao cliente", score: 90 },
        { criterio: "Padrão de comunicação visual", score: 88 },
        { criterio: "Cumprimento de metas", score: 84 },
        { criterio: "Conformidade documental", score: 86 },
      ],
    },
    societaria: [
      { razao: "Reis Participações Ltda", cnpj: "23.456.789/0001-11", papel: "Licenciado Lojista", pct: 100, status: "Ativo" },
    ],
    historico: [
      { data: "Mai 2026", icon: ClipboardCheck, color: "gray", titulo: "Checklist gerencial semestral", desc: "Rating A mantido (87 pts)." },
      { data: "Nov 2024", icon: Handshake, color: "green", titulo: "Visita técnica de acompanhamento", desc: "Consultoria de expansão de carteira." },
      { data: "Ago 2019", icon: Store, color: "blue", titulo: "Abertura da unidade", desc: "Início de operação em Campinas." },
    ],
  },

  L003: {
    id: "L003",
    nome: "Curitiba-Norte",
    status: "Ativo",
    cidade: "Curitiba",
    estado: "PR",
    dono: "Fernando Dias",
    gerente: GERENTE,
    abertura: "Jan 2021",
    rating: "B",
    ratingScore: 76,
    organizacional: [
      { id: "L003", nome: "Curitiba-Norte", nivelLabel: "Licenciado 3.5", responsavel: "Fernando Dias", depth: 0 },
      { id: "PV-1200", nome: "Equipe Pinheiro", nivelLabel: "Autorizado 2.5", responsavel: "Renata Lopes", depth: 1 },
    ],
    financeiro: {
      faturamentoConsolidado: 287300,
      ticketMedio: 6150,
      novosClientesMes: 6,
      meses: ["Jan/26", "Fev/26", "Mar/26", "Abr/26", "Mai/26", "Jun/26"],
      faturamentoSerie: [255000, 261000, 268000, 274000, 280000, 287300],
      vendasSerie: [30, 31, 32, 33, 35, 36],
    },
    consultoresVinculados: [
      { id: "C020", nome: "Renata Lopes", iniciais: "RL", nivel: "Autorizado 2.5", carteiraQtd: 13 },
    ],
    carteiras: [
      { id: "CRT-30", cliente: "Auto Peças Sul", status: "Ativa", consultor: "Renata Lopes", orfa: false },
      { id: "CRT-31", cliente: "Comércio Araucária", status: "Inativa", consultor: null, orfa: true },
    ],
    comissionamento: {
      basePct: 1.8,
      cascata: [
        { nivel: "Licenciado 3.5", pct: 1.8, qtd: 1 },
        { nivel: "Autorizado 2.5", pct: 0.8, qtd: 2 },
      ],
      penalidades: [
        { motivo: "SLA de prévia vencido reincidente", descontoPct: 1.0, vigenciaFim: "Set 2026" },
      ],
    },
    avaliacao360: {
      ultimaAvaliacao: "Abr 2026",
      scoreGeral: 76,
      criterios: [
        { criterio: "Atendimento ao cliente", score: 80 },
        { criterio: "Padrão de comunicação visual", score: 70 },
        { criterio: "Cumprimento de metas", score: 74 },
        { criterio: "Conformidade documental", score: 79 },
      ],
    },
    societaria: [
      { razao: "Dias & Cia Ltda", cnpj: "34.567.890/0001-22", papel: "Licenciado Lojista", pct: 100, status: "Ativo" },
    ],
    historico: [
      { data: "Abr 2026", icon: ClipboardCheck, color: "gray", titulo: "Checklist gerencial trimestral", desc: "Rating B, queda de 3 pts vs. ciclo anterior." },
      { data: "Fev 2026", icon: Flag, color: "amber", titulo: "SLA de prévia vencido", desc: "Segunda ocorrência no trimestre.", status: "Resolvido" },
      { data: "Jan 2021", icon: Store, color: "blue", titulo: "Abertura da unidade", desc: "Início de operação em Curitiba - região Norte." },
    ],
  },

  L004: {
    id: "L004",
    nome: "RJ-Barra",
    status: "Suspenso",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    dono: "Patrícia Nogueira",
    gerente: GERENTE,
    abertura: "Set 2017",
    rating: "B",
    ratingScore: 71,
    organizacional: [
      { id: "L004", nome: "RJ-Barra", nivelLabel: "Licenciado 3.5", responsavel: "Patrícia Nogueira", depth: 0 },
    ],
    financeiro: {
      faturamentoConsolidado: 198700,
      ticketMedio: 5980,
      novosClientesMes: 2,
      meses: ["Jan/26", "Fev/26", "Mar/26", "Abr/26", "Mai/26", "Jun/26"],
      faturamentoSerie: [240000, 231000, 219000, 210000, 203000, 198700],
      vendasSerie: [28, 26, 24, 23, 21, 20],
    },
    consultoresVinculados: [
      { id: "C030", nome: "Gustavo Ramos", iniciais: "GR", nivel: "Autorizado 2.2", carteiraQtd: 7 },
    ],
    carteiras: [
      { id: "CRT-40", cliente: "Imobiliária Atlântica", status: "Inativa", consultor: null, orfa: true },
      { id: "CRT-41", cliente: "Studio Fitness RJ", status: "Ativa", consultor: "Gustavo Ramos", orfa: false },
    ],
    comissionamento: {
      basePct: 1.6,
      cascata: [
        { nivel: "Licenciado 3.5", pct: 1.6, qtd: 1 },
        { nivel: "Autorizado 2.2", pct: 0.5, qtd: 1 },
      ],
      penalidades: [
        { motivo: "Mudança societária não comunicada", descontoPct: 2.0, vigenciaFim: "Ago 2026" },
        { motivo: "Comunicação visual desatualizada", descontoPct: 1.0, vigenciaFim: "Ago 2026" },
      ],
    },
    avaliacao360: {
      ultimaAvaliacao: "Mar 2026",
      scoreGeral: 71,
      criterios: [
        { criterio: "Atendimento ao cliente", score: 75 },
        { criterio: "Padrão de comunicação visual", score: 58 },
        { criterio: "Cumprimento de metas", score: 68 },
        { criterio: "Conformidade documental", score: 62 },
      ],
    },
    societaria: [
      { razao: "Nogueira Empreendimentos Ltda", cnpj: "45.678.901/0001-33", papel: "Licenciado Lojista", pct: 55, status: "Ativo" },
      { razao: "RJ Capital Participações", cnpj: "45.678.902/0001-44", papel: "Sócio", pct: 45, status: "Inativo" },
    ],
    historico: [
      { data: "Jul 2026", icon: Flag, color: "red", titulo: "Suspensão temporária", desc: "Pendências societárias não regularizadas no prazo.", status: "Aberto" },
      { data: "Mar 2026", icon: RefreshCw, color: "amber", titulo: "Mudança societária não comunicada", desc: "Alteração de quadro sem notificação prévia.", status: "Aberto" },
      { data: "Set 2017", icon: Store, color: "blue", titulo: "Abertura da unidade", desc: "Início de operação no Rio de Janeiro - Barra." },
    ],
  },

  L005: {
    id: "L005",
    nome: "BH-Savassi",
    status: "Ativo",
    cidade: "Belo Horizonte",
    estado: "MG",
    dono: "Eduardo Martins",
    gerente: GERENTE,
    abertura: "Mai 2022",
    rating: "C",
    ratingScore: 58,
    organizacional: [
      { id: "L005", nome: "BH-Savassi", nivelLabel: "Licenciado 3.5", responsavel: "Eduardo Martins", depth: 0 },
    ],
    financeiro: {
      faturamentoConsolidado: 156200,
      ticketMedio: 4870,
      novosClientesMes: 3,
      meses: ["Jan/26", "Fev/26", "Mar/26", "Abr/26", "Mai/26", "Jun/26"],
      faturamentoSerie: [142000, 145000, 148000, 151000, 153500, 156200],
      vendasSerie: [21, 22, 22, 23, 24, 25],
    },
    consultoresVinculados: [
      { id: "C040", nome: "Priscila Gomes", iniciais: "PG", nivel: "Autorizado 2.0", carteiraQtd: 5 },
    ],
    carteiras: [
      { id: "CRT-50", cliente: "Mercearia Central", status: "Ativa", consultor: "Priscila Gomes", orfa: false },
      { id: "CRT-51", cliente: "Ateliê Savassi", status: "Inativa", consultor: null, orfa: true },
    ],
    comissionamento: {
      basePct: 1.4,
      cascata: [
        { nivel: "Licenciado 3.5", pct: 1.4, qtd: 1 },
        { nivel: "Autorizado 2.0", pct: 0.4, qtd: 1 },
      ],
      penalidades: [
        { motivo: "Prévias com SLA vencido", descontoPct: 1.5, vigenciaFim: "Out 2026" },
      ],
    },
    avaliacao360: {
      ultimaAvaliacao: "Fev 2026",
      scoreGeral: 58,
      criterios: [
        { criterio: "Atendimento ao cliente", score: 62 },
        { criterio: "Padrão de comunicação visual", score: 51 },
        { criterio: "Cumprimento de metas", score: 55 },
        { criterio: "Conformidade documental", score: 64 },
      ],
    },
    societaria: [
      { razao: "Martins Comércio EIRELI", cnpj: "56.789.012/0001-55", papel: "Licenciado Lojista", pct: 100, status: "Ativo" },
    ],
    historico: [
      { data: "Fev 2026", icon: ClipboardCheck, color: "gray", titulo: "Checklist gerencial trimestral", desc: "Rating C, abaixo da meta da regional." },
      { data: "Dez 2025", icon: Flag, color: "amber", titulo: "Prévias com SLA vencido", desc: "3 prévias além do prazo de 3 dias.", status: "Aberto" },
      { data: "Mai 2022", icon: Store, color: "blue", titulo: "Abertura da unidade", desc: "Início de operação em Belo Horizonte - Savassi." },
    ],
  },

  L006: {
    id: "L006",
    nome: "Porto Alegre-Moinhos",
    status: "Ativo",
    cidade: "Porto Alegre",
    estado: "RS",
    dono: "Camila Torres",
    gerente: GERENTE,
    abertura: "Jun 2016",
    rating: "A",
    ratingScore: 91,
    organizacional: [
      { id: "L006", nome: "Porto Alegre-Moinhos", nivelLabel: "Licenciado 3.5", responsavel: "Camila Torres", depth: 0 },
      { id: "PV-1310", nome: "Equipe Guaíba", nivelLabel: "Autorizado 2.5", responsavel: "Henrique Bastos", depth: 1 },
      { id: "PV-1322", nome: "Equipe Ipiranga", nivelLabel: "Autorizado 2.7", responsavel: "Sabrina Kunz", depth: 1 },
    ],
    financeiro: {
      faturamentoConsolidado: 467900,
      ticketMedio: 8210,
      novosClientesMes: 11,
      meses: ["Jan/26", "Fev/26", "Mar/26", "Abr/26", "Mai/26", "Jun/26"],
      faturamentoSerie: [402000, 415000, 428000, 441000, 455000, 467900],
      vendasSerie: [45, 47, 49, 51, 54, 57],
    },
    consultoresVinculados: [
      { id: "C050", nome: "Henrique Bastos", iniciais: "HB", nivel: "Autorizado 2.5", carteiraQtd: 20 },
      { id: "C051", nome: "Sabrina Kunz", iniciais: "SK", nivel: "Autorizado 2.7", carteiraQtd: 17 },
    ],
    carteiras: [
      { id: "CRT-60", cliente: "Vinícola Serra Gaúcha", status: "Ativa", consultor: "Henrique Bastos", orfa: false },
      { id: "CRT-61", cliente: "Frigorífico Pampa", status: "Ativa", consultor: "Sabrina Kunz", orfa: false },
    ],
    comissionamento: {
      basePct: 2.0,
      cascata: [
        { nivel: "Licenciado 3.5", pct: 2.0, qtd: 1 },
        { nivel: "Autorizado 2.5", pct: 0.8, qtd: 2 },
        { nivel: "Autorizado 2.7", pct: 1.0, qtd: 2 },
      ],
      penalidades: [],
    },
    avaliacao360: {
      ultimaAvaliacao: "Jun 2026",
      scoreGeral: 91,
      criterios: [
        { criterio: "Atendimento ao cliente", score: 93 },
        { criterio: "Padrão de comunicação visual", score: 89 },
        { criterio: "Cumprimento de metas", score: 92 },
        { criterio: "Conformidade documental", score: 90 },
      ],
    },
    societaria: [
      { razao: "Torres Investimentos Ltda", cnpj: "67.890.123/0001-66", papel: "Licenciado Lojista", pct: 70, status: "Ativo" },
      { razao: "Sul Capital ME", cnpj: "67.890.124/0001-77", papel: "Sócio", pct: 30, status: "Ativo" },
    ],
    historico: [
      { data: "Jun 2026", icon: ClipboardCheck, color: "gray", titulo: "Checklist gerencial semestral", desc: "Rating A mantido (91 pts)." },
      { data: "Set 2025", icon: Trophy, color: "green", titulo: "Sabrina Kunz → Autorizado 2.7", desc: "Promoção por desempenho consistente." },
      { data: "Jun 2016", icon: Store, color: "blue", titulo: "Abertura da unidade", desc: "Início de operação em Porto Alegre - Moinhos de Vento." },
    ],
  },

  L007: {
    id: "L007",
    nome: "Brasília-Asa Sul",
    status: "Inativo",
    cidade: "Brasília",
    estado: "DF",
    dono: "Ricardo Peixoto",
    gerente: GERENTE,
    abertura: "Out 2015",
    rating: "C",
    ratingScore: 52,
    organizacional: [
      { id: "L007", nome: "Brasília-Asa Sul", nivelLabel: "Licenciado 3.5", responsavel: "Ricardo Peixoto", depth: 0 },
    ],
    financeiro: {
      faturamentoConsolidado: 41200,
      ticketMedio: 3120,
      novosClientesMes: 0,
      meses: ["Jan/26", "Fev/26", "Mar/26", "Abr/26", "Mai/26", "Jun/26"],
      faturamentoSerie: [98000, 81000, 67000, 55000, 47000, 41200],
      vendasSerie: [14, 12, 10, 8, 6, 5],
    },
    consultoresVinculados: [],
    carteiras: [
      { id: "CRT-70", cliente: "Gráfica Capital", status: "Inativa", consultor: null, orfa: true },
    ],
    comissionamento: {
      basePct: 1.0,
      cascata: [{ nivel: "Licenciado 3.5", pct: 1.0, qtd: 1 }],
      penalidades: [
        { motivo: "Inatividade comercial prolongada", descontoPct: 3.0, vigenciaFim: "Indeterminado" },
      ],
    },
    avaliacao360: {
      ultimaAvaliacao: "Nov 2025",
      scoreGeral: 52,
      criterios: [
        { criterio: "Atendimento ao cliente", score: 48 },
        { criterio: "Padrão de comunicação visual", score: 40 },
        { criterio: "Cumprimento de metas", score: 45 },
        { criterio: "Conformidade documental", score: 55 },
      ],
    },
    societaria: [
      { razao: "Peixoto Serviços Ltda", cnpj: "78.901.234/0001-88", papel: "Licenciado Lojista", pct: 100, status: "Inativo" },
    ],
    historico: [
      { data: "Jan 2026", icon: Flag, color: "red", titulo: "Unidade inativada", desc: "Sem faturamento registrado nos últimos 60 dias.", status: "Aberto" },
      { data: "Nov 2025", icon: ClipboardCheck, color: "gray", titulo: "Checklist gerencial semestral", desc: "Rating C, terceiro ciclo consecutivo em queda." },
      { data: "Out 2015", icon: Store, color: "blue", titulo: "Abertura da unidade", desc: "Início de operação em Brasília - Asa Sul." },
    ],
  },

  L008: {
    id: "L008",
    nome: "Salvador-Barra",
    status: "Ativo",
    cidade: "Salvador",
    estado: "BA",
    dono: "Juliana Farias",
    gerente: GERENTE,
    abertura: "Fev 2020",
    rating: "B",
    ratingScore: 79,
    organizacional: [
      { id: "L008", nome: "Salvador-Barra", nivelLabel: "Licenciado 3.5", responsavel: "Juliana Farias", depth: 0 },
      { id: "PV-1410", nome: "Equipe Farol", nivelLabel: "Autorizado 2.2", responsavel: "Bruno Cardoso", depth: 1 },
    ],
    financeiro: {
      faturamentoConsolidado: 312600,
      ticketMedio: 6540,
      novosClientesMes: 7,
      meses: ["Jan/26", "Fev/26", "Mar/26", "Abr/26", "Mai/26", "Jun/26"],
      faturamentoSerie: [271000, 279000, 288000, 296000, 304000, 312600],
      vendasSerie: [33, 34, 35, 36, 38, 40],
    },
    consultoresVinculados: [
      { id: "C060", nome: "Bruno Cardoso", iniciais: "BC", nivel: "Autorizado 2.2", carteiraQtd: 14 },
    ],
    carteiras: [
      { id: "CRT-80", cliente: "Restaurante Porto da Barra", status: "Ativa", consultor: "Bruno Cardoso", orfa: false },
      { id: "CRT-81", cliente: "Pousada Farol", status: "Ativa", consultor: null, orfa: true },
    ],
    comissionamento: {
      basePct: 1.8,
      cascata: [
        { nivel: "Licenciado 3.5", pct: 1.8, qtd: 1 },
        { nivel: "Autorizado 2.2", pct: 0.5, qtd: 1 },
      ],
      penalidades: [],
    },
    avaliacao360: {
      ultimaAvaliacao: "Mai 2026",
      scoreGeral: 79,
      criterios: [
        { criterio: "Atendimento ao cliente", score: 82 },
        { criterio: "Padrão de comunicação visual", score: 75 },
        { criterio: "Cumprimento de metas", score: 78 },
        { criterio: "Conformidade documental", score: 81 },
      ],
    },
    societaria: [
      { razao: "Farias Negócios Ltda", cnpj: "89.012.345/0001-99", papel: "Licenciado Lojista", pct: 100, status: "Ativo" },
    ],
    historico: [
      { data: "Mai 2026", icon: ClipboardCheck, color: "gray", titulo: "Checklist gerencial semestral", desc: "Rating B, evolução de 5 pts vs. ciclo anterior." },
      { data: "Jan 2026", icon: Handshake, color: "green", titulo: "Visita técnica de acompanhamento", desc: "Plano de ação para carteira órfã CRT-81." },
      { data: "Fev 2020", icon: Store, color: "blue", titulo: "Abertura da unidade", desc: "Início de operação em Salvador - Barra." },
    ],
  },
};
