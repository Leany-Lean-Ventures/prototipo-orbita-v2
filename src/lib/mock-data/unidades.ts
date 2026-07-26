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
  matricula: string;
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
  pvMatricula: string | null;
  qtdClientes: number;
  valor: number;
  orfa: boolean;
}

export interface CascataItem {
  nivel: string;
  pct: number;
  qtd: number;
}

export interface Penalidade {
  id: string;
  motivo: string;
  descontoPct: number;
  vigenciaFim: string;
  descricao?: string;
  dataAplicacao?: string;
  aplicadoPor?: string;
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

export type HistoricoTipo = "avaliacao" | "promocao" | "ocorrencia" | "visita" | "penalidade" | "evento";

export interface HistoricoItem {
  data: string;
  icon: LucideIcon;
  color: HistoricoColor;
  titulo: string;
  desc: string;
  status?: "Aberto" | "Resolvido";
  /** Tipo para filtro. */
  tipo?: HistoricoTipo;
  /** Detalhe expandido — dados adicionais para o painel de detalhe. */
  detalhe?: {
    responsavel?: string;
    observacao?: string;
    acao?: string;
    dataResolucao?: string;
    /** Referencia a Penalidade.id — habilita o botão "Ver penalidade" quando tipo === "penalidade". */
    penalidadeId?: string;
  };
}

export type OrganizacionalTipo = "loja" | "pv" | "consultor" | "socio";

export interface OrganizacionalNode {
  id: string;
  nome: string;
  nivelLabel: string;
  responsavel: string;
  depth: number;
  /** Type of entity for icon/color differentiation. */
  tipo: OrganizacionalTipo;
  /** CNPJ for PV/Loja/Consultor. */
  documento?: string;
  /** Matrícula code. */
  matricula?: string;
  /** Avatar URL for sócios. */
  avatarUrl?: string;
  /** % de participação societária (sócios). */
  participacaoPct?: number;
  /** % de comissão (sócios — modelo M3). */
  comissaoPct?: number;
  /** Children nodes (for expand/collapse tree). */
  children?: OrganizacionalNode[];
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
  razaoSocial: string;
  cnpj: string;
  matricula: string;
  nivel: string;
  carteiraQtd: number;
  /** Faturamento individual para ranking (R$). */
  faturamento?: number;
}

export interface CriterioAvaliacao {
  criterio: string;
  score: number;
}

export interface Avaliacao360Info {
  ultimaAvaliacao: string;
  scoreGeral: number;
  criterios: CriterioAvaliacao[];
  /** Série histórica de scores por ano para gráfico de linhas. */
  historicoAnual?: {
    ano: string;
    scores: number[]; // score por critério na mesma ordem de `criterios`
  }[];
}

/** Informações de contato e endereço da unidade. */
export interface DadosContatoInfo {
  endereco: string;
  bairro: string;
  cep: string;
  telefone: string;
  email: string;
  horarioFuncionamento: string;
}

export interface UnidadeDetalhe {
  id: string;
  nome: string;
  matricula: string;
  status: UnidadeStatus;
  cidade: string;
  estado: string;
  dono: string;
  gerente: string;
  abertura: string;
  rating: Rating;
  ratingScore: number;
  /** Background image for the hero header (path relative to public/). */
  heroImage: string;
  /** Optional avatar image for the gestor. Falls back to initials. */
  gestorAvatar?: string;
  /** Fotos da fachada e ambientes internos (aba Dados Básicos → Fotos da Unidade). */
  fotos: string[];
  /** Dados de contato e endereço. */
  dadosContato: DadosContatoInfo;
  organizacional: OrganizacionalNode[];
  /** Sócios da unidade (exibidos na modal, não na hierarquia). */
  socios?: { nome: string; nivelLabel: string; documento?: string }[];
  financeiro: FinanceiroInfo;
  consultoresVinculados: ConsultorVinculado[];
  carteiras: Carteira[];
  comissionamento: ComissionamentoInfo;
  avaliacao360: Avaliacao360Info;
  societaria: SocietariaItem[];
  historico: HistoricoItem[];
}

export const unidadesList: UnidadeListItem[] = [
  { id: "L001", matricula: "M-10001", nome: "SP-Centro", cidade: "São Paulo", estado: "SP", dono: "João Silva", rating: "A", ratingScore: 94, status: "Ativo" },
  { id: "L002", matricula: "M-10002", nome: "Campinas", cidade: "Campinas", estado: "SP", dono: "Marina Reis", rating: "A", ratingScore: 87, status: "Ativo" },
  { id: "L003", matricula: "M-10003", nome: "Curitiba-Norte", cidade: "Curitiba", estado: "PR", dono: "Fernando Dias", rating: "B", ratingScore: 76, status: "Ativo" },
  { id: "L004", matricula: "M-10004", nome: "RJ-Barra", cidade: "Rio de Janeiro", estado: "RJ", dono: "Patrícia Nogueira", rating: "B", ratingScore: 71, status: "Suspenso" },
  { id: "L005", matricula: "M-10005", nome: "BH-Savassi", cidade: "Belo Horizonte", estado: "MG", dono: "Eduardo Martins", rating: "C", ratingScore: 58, status: "Ativo" },
  { id: "L006", matricula: "M-10006", nome: "Porto Alegre-Moinhos", cidade: "Porto Alegre", estado: "RS", dono: "Camila Torres", rating: "A", ratingScore: 91, status: "Ativo" },
  { id: "L007", matricula: "M-10007", nome: "Brasília-Asa Sul", cidade: "Brasília", estado: "DF", dono: "Ricardo Peixoto", rating: "C", ratingScore: 52, status: "Inativo" },
  { id: "L008", matricula: "M-10008", nome: "Salvador-Barra", cidade: "Salvador", estado: "BA", dono: "Juliana Farias", rating: "B", ratingScore: 79, status: "Ativo" },
];

const GERENTE = "Roberto Almeida";

export const unidadesDetalhe: Record<string, UnidadeDetalhe> = {
  L001: {
    id: "L001",
    nome: "SP-Centro",
    matricula: "M-10001",
    status: "Ativo",
    cidade: "São Paulo",
    estado: "SP",
    dono: "João Silva",
    gerente: GERENTE,
    abertura: "Mar 2018",
    rating: "A",
    ratingScore: 94,
    heroImage: "/images/unidades/hero-city.jpg",
    gestorAvatar: "/images/foto-lojas/01.jpg",
    fotos: [
      "/images/unidades-fotos/fachada-canoas.jpg",
      "/images/unidades-fotos/sala-reuniao.png",
      "/images/unidades-fotos/recepcao-loja.webp",
      "/images/unidades-fotos/retrato-equipe.webp",
    ],
    dadosContato: {
      endereco: "Rua Augusta, 1508",
      bairro: "Consolação",
      cep: "01304-001",
      telefone: "(11) 3256-8900",
      email: "sp-centro@ademicon.com.br",
      horarioFuncionamento: "Seg a Sex, 9h–18h",
    },
    organizacional: [
      {
        id: "L001", nome: "Unidade SP-Centro", nivelLabel: "Licenciado 3.5", responsavel: "Alpha Consultoria Ltda", depth: 0, tipo: "loja",
        documento: "12.345.678/0001-90", matricula: "M-10001",
        children: [
          {
            id: "PV-1042", nome: "PV Alpha", nivelLabel: "Autorizado 2.5", responsavel: "Alpha Consórcios LTDA", depth: 1, tipo: "pv",
            documento: "23.456.789/0001-11", matricula: "M-20042",
            children: [
              { id: "C001", nome: "MS Assessoria Ltda", nivelLabel: "Consultor", responsavel: "MS Assessoria Ltda", depth: 2, tipo: "consultor", documento: "55.123.456/0001-01", matricula: "M-30001" },
              { id: "C005", nome: "FL Participações ME", nivelLabel: "Consultor", responsavel: "FL Participações ME", depth: 2, tipo: "consultor", documento: "55.234.567/0001-02", matricula: "M-30005" },
            ],
          },
          {
            id: "PV-1055", nome: "PV Vega", nivelLabel: "Autorizado 2.2", responsavel: "Vega Assessoria ME", depth: 1, tipo: "pv",
            documento: "34.567.890/0001-22", matricula: "M-20055",
            children: [
              { id: "C003", nome: "BS Investimentos Ltda", nivelLabel: "Consultor", responsavel: "BS Investimentos Ltda", depth: 2, tipo: "consultor", documento: "55.345.678/0001-03", matricula: "M-30003" },
              { id: "C006", nome: "RC Consórcios ME", nivelLabel: "Consultor", responsavel: "RC Consórcios ME", depth: 2, tipo: "consultor", documento: "55.456.789/0001-04", matricula: "M-30006" },
            ],
          },
          {
            id: "PV-2091", nome: "PV Zeta", nivelLabel: "Autorizado 2.0", responsavel: "Zeta Negócios ME", depth: 2, tipo: "pv",
            documento: "45.678.901/0001-33", matricula: "M-20091",
            children: [
              { id: "C004", nome: "DF Consórcios ME", nivelLabel: "Consultor", responsavel: "DF Consórcios ME", depth: 3, tipo: "consultor", documento: "55.567.890/0001-05", matricula: "M-30004" },
            ],
          },
        ],
      },
    ],
    socios: [
      { nome: "Roberto Almeida", nivelLabel: "Gestor Responsável", documento: "111.222.333/0001-44" },
      { nome: "Ana Paula Silva", nivelLabel: "Sócio", documento: "222.333.444/0001-55" },
      { nome: "Ricardo Mendonça", nivelLabel: "Sócio", documento: "333.444.555/0001-66" },
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
      { id: "C001", nome: "Maria Santos", razaoSocial: "MS Assessoria Ltda", cnpj: "55.123.456/0001-01", matricula: "M-30001", nivel: "Autorizado 2.5", carteiraQtd: 22, faturamento: 198500 },
      { id: "C002", nome: "Carlos Oliveira", razaoSocial: "Alpha Consórcios LTDA", cnpj: "23.456.789/0001-11", matricula: "M-20042", nivel: "Autorizado 2.5", carteiraQtd: 19, faturamento: 172300 },
      { id: "C003", nome: "Beatriz Souza", razaoSocial: "BS Investimentos Ltda", cnpj: "55.345.678/0001-03", matricula: "M-30003", nivel: "Autorizado 2.2", carteiraQtd: 15, faturamento: 141600 },
      { id: "C004", nome: "Diego Farias", razaoSocial: "DF Consórcios ME", cnpj: "55.567.890/0001-05", matricula: "M-30004", nivel: "Autorizado 2.0", carteiraQtd: 12, faturamento: 108000 },
      { id: "C005", nome: "Fernanda Lima", razaoSocial: "FL Participações ME", cnpj: "55.234.567/0001-02", matricula: "M-30005", nivel: "Autorizado 2.5", carteiraQtd: 18, faturamento: 162000 },
      { id: "C006", nome: "Rafael Costa", razaoSocial: "RC Consórcios ME", cnpj: "55.456.789/0001-04", matricula: "M-30006", nivel: "Autorizado 2.2", carteiraQtd: 14, faturamento: 126000 },
      { id: "C007", nome: "Juliana Mendes", razaoSocial: "JM Assessoria ME", cnpj: "55.678.901/0001-07", matricula: "M-30007", nivel: "Autorizado 2.0", carteiraQtd: 9, faturamento: 81000 },
      { id: "C008", nome: "André Pereira", razaoSocial: "AP Investimentos", cnpj: "55.789.012/0001-08", matricula: "M-30008", nivel: "Autorizado 2.2", carteiraQtd: 11, faturamento: 99000 },
      { id: "C009", nome: "Camila Rocha", razaoSocial: "CR Consórcios Ltda", cnpj: "55.890.123/0001-09", matricula: "M-30009", nivel: "Autorizado 2.5", carteiraQtd: 16, faturamento: 144000 },
      { id: "C010", nome: "Lucas Martins", razaoSocial: "LM Participações ME", cnpj: "55.901.234/0001-10", matricula: "M-30010", nivel: "Autorizado 2.0", carteiraQtd: 8, faturamento: 72000 },
    ],
    carteiras: [
      { id: "CRT-01", cliente: "Empresa X", status: "Ativa", consultor: "MS Assessoria Ltda", pvMatricula: "M-20042", qtdClientes: 24, valor: 121600, orfa: false },
      { id: "CRT-02", cliente: "Cliente Y", status: "Inativa", consultor: null, pvMatricula: null, qtdClientes: 3, valor: 6100, orfa: true },
      { id: "CRT-03", cliente: "Construtora Alfa", status: "Ativa", consultor: "Alpha Consórcios LTDA", pvMatricula: "M-20042", qtdClientes: 31, valor: 157100, orfa: false },
      { id: "CRT-04", cliente: "Grupo Nortel", status: "Ativa", consultor: null, pvMatricula: null, qtdClientes: 9, valor: 18200, orfa: true },
      { id: "CRT-05", cliente: "Indústria Beta", status: "Ativa", consultor: "BS Investimentos Ltda", pvMatricula: "M-20055", qtdClientes: 18, valor: 91200, orfa: false },
      { id: "CRT-06", cliente: "Logística Express", status: "Ativa", consultor: "DF Consórcios ME", pvMatricula: "M-20091", qtdClientes: 12, valor: 60800, orfa: false },
      { id: "CRT-07", cliente: "Tech Solutions", status: "Ativa", consultor: "FL Participações ME", pvMatricula: "M-20042", qtdClientes: 21, valor: 106500, orfa: false },
      { id: "CRT-08", cliente: "Farmácia Central", status: "Ativa", consultor: "RC Consórcios ME", pvMatricula: "M-20055", qtdClientes: 15, valor: 76100, orfa: false },
      { id: "CRT-09", cliente: "Auto Peças Premium", status: "Ativa", consultor: "AP Investimentos", pvMatricula: "M-20042", qtdClientes: 11, valor: 55800, orfa: false },
      { id: "CRT-10", cliente: "Restaurante Vila", status: "Ativa", consultor: "CR Consórcios Ltda", pvMatricula: "M-20055", qtdClientes: 16, valor: 81500, orfa: false },
      { id: "CRT-11", cliente: "Padaria Ouro", status: "Ativa", consultor: "LM Participações ME", pvMatricula: "M-20091", qtdClientes: 8, valor: 40800, orfa: false },
      { id: "CRT-12", cliente: "Clínica Saúde+", status: "Inativa", consultor: null, pvMatricula: null, qtdClientes: 2, valor: 4100, orfa: true },
    ],
    comissionamento: {
      basePct: 3.5,
      cascata: [
        { nivel: "Licenciado 3.5", pct: 2.0, qtd: 1 },
        { nivel: "Autorizado 2.5", pct: 0.8, qtd: 5 },
        { nivel: "Autorizado 2.2", pct: 0.5, qtd: 8 },
      ],
      penalidades: [
        {
          id: "PEN-L001-01",
          motivo: "Conflito entre sócios",
          descontoPct: 0.4,
          vigenciaFim: "Dez 2026",
          descricao: "Divergência entre os sócios da unidade quanto à gestão administrativa, impactando a conformidade operacional até a resolução do quadro societário.",
          dataAplicacao: "10/10/2026",
          aplicadoPor: "Roberto Almeida",
        },
        {
          id: "PEN-L001-02",
          motivo: "Transferência de consultor para unidade Campinas",
          descontoPct: 1.6,
          vigenciaFim: "Set 2026",
          descricao: "Consultor vinculado transferido para outra unidade sem comunicação prévia, gerando desconto sobre a comissão até a regularização do vínculo.",
          dataAplicacao: "02/09/2026",
          aplicadoPor: "Roberto Almeida",
        },
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
      historicoAnual: [
        { ano: "2023", scores: [78, 65, 80, 72] },
        { ano: "2024", scores: [85, 72, 88, 81] },
        { ano: "2025", scores: [91, 78, 94, 89] },
        { ano: "2026", scores: [96, 82, 98, 95] },
      ],
    },
    societaria: [
      { razao: "Alpha Consultoria Ltda", cnpj: "12.345.678/0001-90", papel: "Licenciado Lojista", pct: 60, status: "Ativo" },
      { razao: "Beta Soluções ME", cnpj: "98.765.432/0001-10", papel: "Sócio", pct: 40, status: "Ativo" },
    ],
    historico: [
      { data: "Jul 2026", icon: Flag, color: "amber", titulo: "Visita de rotina agendada", desc: "Visita programada para avaliação de padrão visual.", tipo: "visita", detalhe: { responsavel: "Roberto Almeida", observacao: "Verificar adequação da fachada às normas de 2026.", acao: "Agendar visita para 15/07/2026" } },
      { data: "Jun 2026", icon: ClipboardCheck, color: "gray", titulo: "Checklist gerencial semestral", desc: "Rating A mantido (94 pts).", tipo: "avaliacao", detalhe: { responsavel: "Roberto Almeida", observacao: "Desempenho consistente em todos os critérios. Destaque para cumprimento de metas (98/100).", acao: "Nenhuma ação necessária." } },
      { data: "Mai 2026", icon: Handshake, color: "green", titulo: "Visita técnica realizada", desc: "Consultoria sobre expansão de PV Zeta.", tipo: "visita", detalhe: { responsavel: "Roberto Almeida", observacao: "PV Zeta com potencial para upgrade de nível. Sugerida meta trimestral de 15 carteiras.", acao: "Enviar proposta de meta ao gestor do PV." } },
      { data: "Abr 2026", icon: Trophy, color: "green", titulo: "Maria Santos → Top 1 faturamento", desc: "Maior faturamento individual da unidade no trimestre.", tipo: "promocao", detalhe: { responsavel: "Sistema", observacao: "Faturamento de R$ 198.500 no trimestre. Superou meta em 12%.", acao: "Bonificação trimestral aplicada." } },
      { data: "Mar 2026", icon: Flag, color: "red", titulo: "Conflito entre sócios", desc: "Penalidade aplicada: desconto de 0,4% na comissão.", tipo: "penalidade", status: "Aberto", detalhe: { responsavel: "Diretoria", observacao: "Divergência entre os sócios da unidade quanto à gestão administrativa, impactando a conformidade operacional.", acao: "Regularizar até Dez 2026 para remoção da penalidade.", penalidadeId: "PEN-L001-01" } },
      { data: "Fev 2026", icon: RefreshCw, color: "blue", titulo: "Atualização de contrato societário", desc: "Alteração no percentual de participação dos sócios registrada.", tipo: "evento", detalhe: { responsavel: "Jurídico Ademicon", observacao: "João Silva passou de 70% para 60%. Beta Soluções ME de 30% para 40%.", acao: "Contrato atualizado no sistema." } },
      { data: "Jan 2026", icon: Store, color: "blue", titulo: "Inauguração PV Zeta", desc: "Novo ponto de venda subordinado à unidade SP-Centro.", tipo: "evento", detalhe: { responsavel: "Roberto Almeida", observacao: "PV Zeta inicia operação com Diego Farias como gestor. Meta inicial: 8 carteiras em 6 meses.", acao: "Acompanhamento mensal nos primeiros 90 dias." } },
      { data: "Nov 2025", icon: ClipboardCheck, color: "gray", titulo: "Checklist gerencial trimestral", desc: "Rating A mantido (92 pts).", tipo: "avaliacao", detalhe: { responsavel: "Roberto Almeida", observacao: "Leve queda em comunicação visual (de 85 para 78). Demais critérios estáveis.", acao: "Notificar sobre adequação visual." } },
      { data: "Set 2025", icon: Handshake, color: "green", titulo: "Visita de auditoria", desc: "Auditoria semestral de conformidade.", tipo: "visita", detalhe: { responsavel: "Equipe de Auditoria", observacao: "Documentação em ordem. Fachada com pequenas divergências.", acao: "Relatório enviado à gerência." } },
      { data: "Jul 2025", icon: Trophy, color: "green", titulo: "João Silva → Licenciado 3.5", desc: "Nível máximo atingido.", tipo: "promocao", detalhe: { responsavel: "Diretoria", observacao: "Cumprimento de todos os requisitos de promoção: faturamento, carteiras e tempo de atuação.", acao: "Certificado emitido." } },
      { data: "Mai 2025", icon: Flag, color: "red", titulo: "Disputa de território", desc: "Conflito com unidade vizinha. Resolvido por acordo.", tipo: "ocorrencia", status: "Resolvido", detalhe: { responsavel: "Roberto Almeida", observacao: "Sobreposição de área de atuação com Unidade Campinas em região limítrofe.", acao: "Acordo firmado: divisa pela Av. Paulista.", dataResolucao: "Jun 2025" } },
      { data: "Mar 2018", icon: Store, color: "blue", titulo: "Abertura da unidade", desc: "Início de operação em São Paulo - Centro.", tipo: "evento", detalhe: { responsavel: "Diretoria", observacao: "Unidade inaugurada com João Silva como licenciado lojista. Endereço: Rua Augusta, 1508.", acao: "Operação iniciada com 2 consultores." } },
    ],
  },

  L002: {
    id: "L002",
    nome: "Campinas",
    matricula: "M-10002",
    status: "Ativo",
    cidade: "Campinas",
    estado: "SP",
    dono: "Marina Reis",
    gerente: GERENTE,
    abertura: "Ago 2019",
    rating: "A",
    ratingScore: 87,
    heroImage: "/images/unidades/unit-saopaulo.png",
    fotos: [
      "/images/unidades-fotos/fachada-jaguariaiva.jpg",
      "/images/unidades-fotos/inauguracao-loja.jpg",
      "/images/unidades-fotos/escritorio-rioofficemall.png",
    ],
    dadosContato: {
      endereco: "Rua Barão de Jaguara, 1100",
      bairro: "Centro",
      cep: "13015-001",
      telefone: "(19) 3234-5600",
      email: "campinas@ademicon.com.br",
      horarioFuncionamento: "Seg a Sex, 9h–18h",
    },
    organizacional: [
      { id: "L002", nome: "Campinas", nivelLabel: "Licenciado 3.5", responsavel: "Marina Reis", depth: 0, tipo: "loja", documento: "23.456.789/0001-11" },
      { id: "PV-1108", nome: "PV Orion", nivelLabel: "Autorizado 2.7", responsavel: "Tiago Almeida", depth: 1, tipo: "pv", documento: "24.567.890/0001-12" },
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
      { id: "C110", nome: "Tiago Almeida", razaoSocial: "TA Consórcios Ltda", cnpj: "56.100.200/0001-10", matricula: "M-30010", nivel: "Autorizado 2.7", carteiraQtd: 18, faturamento: 162000 },
      { id: "C111", nome: "Larissa Prado", razaoSocial: "LP Assessoria ME", cnpj: "56.200.300/0001-11", matricula: "M-30011", nivel: "Autorizado 2.2", carteiraQtd: 12, faturamento: 108000 },
    ],
    carteiras: [
      { id: "CRT-20", cliente: "Metalúrgica Souza", status: "Ativa", consultor: "TA Consórcios Ltda", pvMatricula: "M-20108", qtdClientes: 19, valor: 97400, orfa: false },
      { id: "CRT-21", cliente: "Padaria Bom Pão", status: "Ativa", consultor: "LP Assessoria ME", pvMatricula: "M-20108", qtdClientes: 13, valor: 66700, orfa: false },
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
      historicoAnual: [
        { ano: "2023", scores: [75, 72, 70, 74] },
        { ano: "2024", scores: [82, 80, 76, 79] },
        { ano: "2025", scores: [87, 85, 81, 83] },
        { ano: "2026", scores: [90, 88, 84, 86] },
      ],
    },
    societaria: [
      { razao: "Reis Participações Ltda", cnpj: "23.456.789/0001-11", papel: "Licenciado Lojista", pct: 100, status: "Ativo" },
    ],
    historico: [
      { data: "Mai 2026", icon: ClipboardCheck, color: "gray", titulo: "Checklist gerencial semestral", desc: "Rating A mantido (87 pts).", tipo: "avaliacao", detalhe: { responsavel: "Roberto Almeida", observacao: "Todos os indicadores acima da média. Ponto de destaque: carteira cresceu 18% no semestre.", acao: "Manter acompanhamento padrão." } },
      { data: "Abr 2026", icon: Trophy, color: "green", titulo: "Tiago Almeida → Top consultor trimestral", desc: "Maior faturamento individual do trimestre.", tipo: "promocao", detalhe: { responsavel: "Sistema", observacao: "Faturamento de R$ 162.000 no Q1 2026.", acao: "Bonificação aplicada." } },
      { data: "Mar 2026", icon: Handshake, color: "green", titulo: "Visita de acompanhamento", desc: "Revisão de metas e carteiras para o segundo trimestre.", tipo: "visita", detalhe: { responsavel: "Roberto Almeida", observacao: "Meta ajustada para 50 vendas/mês. Expansão de PV Orion avaliada.", acao: "Proposta de expansão enviada." } },
      { data: "Fev 2026", icon: Flag, color: "amber", titulo: "Alerta de carteira órfã", desc: "3 carteiras sem consultor atribuído identificadas.", tipo: "ocorrencia", status: "Resolvido", detalhe: { responsavel: "Marina Reis", observacao: "Carteiras migradas de consultor desligado.", acao: "Redistribuição concluída em 5 dias.", dataResolucao: "Fev 2026" } },
      { data: "Jan 2026", icon: RefreshCw, color: "blue", titulo: "Renovação de contrato operacional", desc: "Contrato renovado por 24 meses com reajuste de 4,5%.", tipo: "evento", detalhe: { responsavel: "Jurídico Ademicon", observacao: "Renovação automática conforme cláusula contratual.", acao: "Contrato assinado e registrado." } },
      { data: "Nov 2025", icon: ClipboardCheck, color: "gray", titulo: "Checklist gerencial trimestral", desc: "Rating A (85 pts). Leve melhora em comunicação visual.", tipo: "avaliacao", detalhe: { responsavel: "Roberto Almeida", observacao: "Adequação visual da fachada concluída.", acao: "Nenhuma pendência." } },
      { data: "Set 2025", icon: Handshake, color: "green", titulo: "Visita técnica de auditoria", desc: "Auditoria semestral de conformidade documental.", tipo: "visita", detalhe: { responsavel: "Equipe de Auditoria", observacao: "Toda documentação em conformidade. Nenhum achado.", acao: "Relatório positivo enviado." } },
      { data: "Jul 2025", icon: Flag, color: "red", titulo: "Penalidade por atraso de prévia", desc: "Desconto de 0,5% aplicado por 60 dias.", tipo: "penalidade", status: "Resolvido", detalhe: { responsavel: "Diretoria", observacao: "SLA de resposta de prévia excedido em 3 dias.", acao: "Penalidade encerrada em Set 2025.", dataResolucao: "Set 2025" } },
      { data: "Ago 2019", icon: Store, color: "blue", titulo: "Abertura da unidade", desc: "Início de operação em Campinas.", tipo: "evento", detalhe: { responsavel: "Diretoria", observacao: "Marina Reis assume como licenciada lojista. Endereço: Rua Barão de Jaguara, 1100.", acao: "Operação iniciada com 1 consultor." } },
    ],
  },

  L003: {
    id: "L003",
    nome: "Curitiba-Norte",
    matricula: "M-10003",
    status: "Ativo",
    cidade: "Curitiba",
    estado: "PR",
    dono: "Fernando Dias",
    gerente: GERENTE,
    abertura: "Jan 2021",
    rating: "B",
    ratingScore: 76,
    heroImage: "/images/unidades/unit-curitiba.png",
    fotos: [
      "/images/unidades-fotos/fachada-noturna.webp",
      "/images/unidades-fotos/sala-reuniao.png",
      "/images/unidades-fotos/fachada-campoverde.jpg",
    ],
    dadosContato: {
      endereco: "Av. Sete de Setembro, 4700",
      bairro: "Batel",
      cep: "80250-210",
      telefone: "(41) 3322-7800",
      email: "curitiba-norte@ademicon.com.br",
      horarioFuncionamento: "Seg a Sex, 9h–18h",
    },
    organizacional: [
      { id: "L003", nome: "Curitiba-Norte", nivelLabel: "Licenciado 3.5", responsavel: "Fernando Dias", depth: 0, tipo: "loja", documento: "34.567.890/0001-22" },
      { id: "PV-1200", nome: "PV Pinheiro", nivelLabel: "Autorizado 2.5", responsavel: "Renata Lopes", depth: 1, tipo: "pv", documento: "35.678.901/0001-23" },
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
      { id: "C020", nome: "Renata Lopes", razaoSocial: "RL Negócios Ltda", cnpj: "57.100.200/0001-20", matricula: "M-30020", nivel: "Autorizado 2.5", carteiraQtd: 13, faturamento: 117000 },
    ],
    carteiras: [
      { id: "CRT-30", cliente: "Auto Peças Sul", status: "Ativa", consultor: "RL Negócios Ltda", pvMatricula: "M-20200", qtdClientes: 14, valor: 72200, orfa: false },
      { id: "CRT-31", cliente: "Comércio Araucária", status: "Inativa", consultor: null, pvMatricula: null, qtdClientes: 2, valor: 4100, orfa: true },
    ],
    comissionamento: {
      basePct: 1.8,
      cascata: [
        { nivel: "Licenciado 3.5", pct: 1.8, qtd: 1 },
        { nivel: "Autorizado 2.5", pct: 0.8, qtd: 2 },
      ],
      penalidades: [
        { id: "PEN-L003-01", motivo: "SLA de prévia vencido reincidente", descontoPct: 1.0, vigenciaFim: "Set 2026" },
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
      historicoAnual: [
        { ano: "2023", scores: [82, 75, 80, 81] },
        { ano: "2024", scores: [81, 73, 78, 80] },
        { ano: "2025", scores: [80, 71, 76, 79] },
        { ano: "2026", scores: [80, 70, 74, 79] },
      ],
    },
    societaria: [
      { razao: "Dias & Cia Ltda", cnpj: "34.567.890/0001-22", papel: "Licenciado Lojista", pct: 100, status: "Ativo" },
    ],
    historico: [
      { data: "Abr 2026", icon: ClipboardCheck, color: "gray", titulo: "Checklist gerencial trimestral", desc: "Rating B, queda de 3 pts vs. ciclo anterior.", tipo: "avaliacao", detalhe: { responsavel: "Roberto Almeida", observacao: "Queda em cumprimento de metas e comunicação visual. Necessário plano de ação.", acao: "Reunião com gestor agendada para Mai 2026." } },
      { data: "Fev 2026", icon: Flag, color: "amber", titulo: "SLA de prévia vencido", desc: "Segunda ocorrência no trimestre.", tipo: "ocorrencia", status: "Resolvido", detalhe: { responsavel: "Fernando Dias", observacao: "Resposta a prévia excedeu SLA em 5 dias úteis.", acao: "Penalidade de 1% aplicada por reincidência.", dataResolucao: "Mar 2026" } },
      { data: "Jan 2026", icon: Handshake, color: "green", titulo: "Visita de início de ano", desc: "Alinhamento de metas para 2026.", tipo: "visita", detalhe: { responsavel: "Roberto Almeida", observacao: "Definidas metas de 36 vendas/mês e expansão de 2 consultores.", acao: "Plano de ação registrado." } },
      { data: "Nov 2025", icon: Flag, color: "amber", titulo: "SLA de prévia vencido (1ª ocorrência)", desc: "Resposta fora do prazo de 48h.", tipo: "ocorrencia", status: "Resolvido", detalhe: { responsavel: "Fernando Dias", observacao: "Prévia respondida com 72h de atraso.", acao: "Advertência registrada.", dataResolucao: "Nov 2025" } },
      { data: "Set 2025", icon: ClipboardCheck, color: "gray", titulo: "Checklist gerencial trimestral", desc: "Rating B (79 pts). Estável.", tipo: "avaliacao", detalhe: { responsavel: "Roberto Almeida", observacao: "Sem alterações significativas. Comunicação visual ainda abaixo.", acao: "Prazo para adequação: Dez 2025." } },
      { data: "Jul 2025", icon: Trophy, color: "green", titulo: "Renata Lopes → Autorizado 2.5", desc: "Promoção por atingimento de metas consecutivas.", tipo: "promocao", detalhe: { responsavel: "Diretoria", observacao: "3 trimestres consecutivos acima da meta.", acao: "Certificado emitido." } },
      { data: "Mai 2025", icon: Handshake, color: "green", titulo: "Visita técnica de auditoria", desc: "Auditoria de conformidade.", tipo: "visita", detalhe: { responsavel: "Equipe de Auditoria", observacao: "Documentação OK. Fachada com pendência menor.", acao: "Prazo de 30 dias para adequação." } },
      { data: "Jan 2021", icon: Store, color: "blue", titulo: "Abertura da unidade", desc: "Início de operação em Curitiba - região Norte.", tipo: "evento", detalhe: { responsavel: "Diretoria", observacao: "Fernando Dias assume como licenciado lojista.", acao: "Operação iniciada." } },
    ],
  },

  L004: {
    id: "L004",
    nome: "RJ-Barra",
    matricula: "M-10004",
    status: "Suspenso",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    dono: "Patrícia Nogueira",
    gerente: GERENTE,
    abertura: "Set 2017",
    rating: "B",
    ratingScore: 71,
    heroImage: "/images/unidades/hero-city.jpg",
    fotos: [
      "/images/unidades-fotos/recepcao-loja.webp",
      "/images/unidades-fotos/gestor-retrato.jpg",
      "/images/unidades-fotos/fachada-canoas.jpg",
    ],
    dadosContato: {
      endereco: "Av. das Américas, 3500",
      bairro: "Barra da Tijuca",
      cep: "22640-102",
      telefone: "(21) 2421-3400",
      email: "rj-barra@ademicon.com.br",
      horarioFuncionamento: "Seg a Sex, 9h–18h",
    },
    organizacional: [
      { id: "L004", nome: "RJ-Barra", nivelLabel: "Licenciado 3.5", responsavel: "Patrícia Nogueira", depth: 0, tipo: "loja", documento: "45.678.901/0001-33" },
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
      { id: "C030", nome: "Gustavo Ramos", razaoSocial: "GR Participações Ltda", cnpj: "58.100.200/0001-30", matricula: "M-30030", nivel: "Autorizado 2.2", carteiraQtd: 7, faturamento: 63000 },
    ],
    carteiras: [
      { id: "CRT-40", cliente: "Imobiliária Atlântica", status: "Inativa", consultor: null, pvMatricula: null, qtdClientes: 1, valor: 2100, orfa: true },
      { id: "CRT-41", cliente: "Studio Fitness RJ", status: "Ativa", consultor: "GR Participações Ltda", pvMatricula: null, qtdClientes: 7, valor: 36300, orfa: false },
    ],
    comissionamento: {
      basePct: 1.6,
      cascata: [
        { nivel: "Licenciado 3.5", pct: 1.6, qtd: 1 },
        { nivel: "Autorizado 2.2", pct: 0.5, qtd: 1 },
      ],
      penalidades: [
        { id: "PEN-L004-01", motivo: "Mudança societária não comunicada", descontoPct: 2.0, vigenciaFim: "Ago 2026" },
        { id: "PEN-L004-02", motivo: "Comunicação visual desatualizada", descontoPct: 1.0, vigenciaFim: "Ago 2026" },
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
      historicoAnual: [
        { ano: "2023", scores: [85, 72, 80, 78] },
        { ano: "2024", scores: [82, 68, 76, 72] },
        { ano: "2025", scores: [78, 62, 72, 66] },
        { ano: "2026", scores: [75, 58, 68, 62] },
      ],
    },
    societaria: [
      { razao: "Nogueira Empreendimentos Ltda", cnpj: "45.678.901/0001-33", papel: "Licenciado Lojista", pct: 55, status: "Ativo" },
      { razao: "RJ Capital Participações", cnpj: "45.678.902/0001-44", papel: "Sócio", pct: 45, status: "Inativo" },
    ],
    historico: [
      { data: "Jul 2026", icon: Flag, color: "red", titulo: "Suspensão temporária", desc: "Pendências societárias não regularizadas no prazo.", tipo: "penalidade", status: "Aberto", detalhe: { responsavel: "Diretoria", observacao: "Prazo de regularização expirou em Jun 2026. Unidade suspensa até resolução.", acao: "Aguardando documentação do novo quadro societário." } },
      { data: "Jun 2026", icon: ClipboardCheck, color: "gray", titulo: "Checklist gerencial — não realizado", desc: "Checklist cancelado por suspensão.", tipo: "avaliacao", detalhe: { responsavel: "Roberto Almeida", observacao: "Unidade em processo de suspensão. Checklist não aplicável.", acao: "Reagendar após regularização." } },
      { data: "Mar 2026", icon: RefreshCw, color: "amber", titulo: "Mudança societária não comunicada", desc: "Alteração de quadro sem notificação prévia.", tipo: "ocorrencia", status: "Aberto", detalhe: { responsavel: "Jurídico Ademicon", observacao: "Identificada saída de sócio sem comunicação formal à Ademicon.", acao: "Notificação extrajudicial enviada." } },
      { data: "Jan 2026", icon: Handshake, color: "green", titulo: "Visita de acompanhamento", desc: "Verificação de conformidade operacional.", tipo: "visita", detalhe: { responsavel: "Roberto Almeida", observacao: "Operação funcionando normalmente. Documentação societária pendente de atualização.", acao: "Prazo de 90 dias para regularização." } },
      { data: "Nov 2025", icon: ClipboardCheck, color: "gray", titulo: "Checklist gerencial trimestral", desc: "Rating B (73 pts). Queda significativa.", tipo: "avaliacao", detalhe: { responsavel: "Roberto Almeida", observacao: "Queda em conformidade documental e comunicação visual.", acao: "Plano de ação emergencial solicitado." } },
      { data: "Ago 2025", icon: Flag, color: "amber", titulo: "Atraso no pagamento de royalties", desc: "Parcela de Jul/2025 em aberto por 15 dias.", tipo: "ocorrencia", status: "Resolvido", detalhe: { responsavel: "Financeiro", observacao: "Pagamento regularizado com multa.", acao: "Monitoramento financeiro intensificado.", dataResolucao: "Ago 2025" } },
      { data: "Mai 2025", icon: Handshake, color: "green", titulo: "Visita técnica de auditoria", desc: "Auditoria semestral realizada.", tipo: "visita", detalhe: { responsavel: "Equipe de Auditoria", observacao: "Divergências encontradas na documentação societária.", acao: "Relatório enviado com prazo de 60 dias." } },
      { data: "Set 2017", icon: Store, color: "blue", titulo: "Abertura da unidade", desc: "Início de operação no Rio de Janeiro - Barra.", tipo: "evento", detalhe: { responsavel: "Diretoria", observacao: "Patrícia Nogueira assume como licenciada lojista.", acao: "Operação iniciada com 3 consultores." } },
    ],
  },

  L005: {
    id: "L005",
    nome: "BH-Savassi",
    matricula: "M-10005",
    status: "Ativo",
    cidade: "Belo Horizonte",
    estado: "MG",
    dono: "Eduardo Martins",
    gerente: GERENTE,
    abertura: "Mai 2022",
    rating: "C",
    ratingScore: 58,
    heroImage: "/images/unidades/unit-joinville.png",
    fotos: [
      "/images/unidades-fotos/fachada-campoverde.jpg",
      "/images/unidades-fotos/inauguracao-loja.jpg",
    ],
    dadosContato: {
      endereco: "Rua Pernambuco, 1000",
      bairro: "Savassi",
      cep: "30130-151",
      telefone: "(31) 3261-4500",
      email: "bh-savassi@ademicon.com.br",
      horarioFuncionamento: "Seg a Sex, 9h–18h",
    },
    organizacional: [
      { id: "L005", nome: "BH-Savassi", nivelLabel: "Licenciado 3.5", responsavel: "Eduardo Martins", depth: 0, tipo: "loja", documento: "56.789.012/0001-55" },
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
      { id: "C040", nome: "Priscila Gomes", razaoSocial: "PG Consórcios ME", cnpj: "59.100.200/0001-40", matricula: "M-30040", nivel: "Autorizado 2.0", carteiraQtd: 5, faturamento: 45000 },
    ],
    carteiras: [
      { id: "CRT-50", cliente: "Mercearia Central", status: "Ativa", consultor: "PG Consórcios ME", pvMatricula: null, qtdClientes: 5, valor: 26100, orfa: false },
      { id: "CRT-51", cliente: "Ateliê Savassi", status: "Inativa", consultor: null, pvMatricula: null, qtdClientes: 1, valor: 2100, orfa: true },
    ],
    comissionamento: {
      basePct: 1.4,
      cascata: [
        { nivel: "Licenciado 3.5", pct: 1.4, qtd: 1 },
        { nivel: "Autorizado 2.0", pct: 0.4, qtd: 1 },
      ],
      penalidades: [
        { id: "PEN-L005-01", motivo: "Prévias com SLA vencido", descontoPct: 1.5, vigenciaFim: "Out 2026" },
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
      historicoAnual: [
        { ano: "2023", scores: [68, 60, 65, 70] },
        { ano: "2024", scores: [66, 56, 60, 67] },
        { ano: "2025", scores: [64, 53, 57, 65] },
        { ano: "2026", scores: [62, 51, 55, 64] },
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
    matricula: "M-10006",
    status: "Ativo",
    cidade: "Porto Alegre",
    estado: "RS",
    dono: "Camila Torres",
    gerente: GERENTE,
    abertura: "Jun 2016",
    rating: "A",
    ratingScore: 91,
    heroImage: "/images/unidades/unit-portoalegre.jpg",
    fotos: [
      "/images/unidades-fotos/fachada-jaguariaiva.jpg",
      "/images/unidades-fotos/retrato-equipe.webp",
      "/images/unidades-fotos/escritorio-rioofficemall.png",
    ],
    dadosContato: {
      endereco: "Rua Padre Chagas, 500",
      bairro: "Moinhos de Vento",
      cep: "90570-080",
      telefone: "(51) 3346-7200",
      email: "poa-moinhos@ademicon.com.br",
      horarioFuncionamento: "Seg a Sex, 9h–18h",
    },
    organizacional: [
      { id: "L006", nome: "Porto Alegre-Moinhos", nivelLabel: "Licenciado 3.5", responsavel: "Camila Torres", depth: 0, tipo: "loja", documento: "67.890.123/0001-66" },
      { id: "PV-1310", nome: "PV Guaíba", nivelLabel: "Autorizado 2.5", responsavel: "Henrique Bastos", depth: 1, tipo: "pv", documento: "68.901.234/0001-67" },
      { id: "PV-1322", nome: "PV Ipiranga", nivelLabel: "Autorizado 2.7", responsavel: "Sabrina Kunz", depth: 1, tipo: "pv", documento: "69.012.345/0001-68" },
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
      { id: "C050", nome: "Henrique Bastos", razaoSocial: "HB Negócios Ltda", cnpj: "60.100.200/0001-50", matricula: "M-30050", nivel: "Autorizado 2.5", carteiraQtd: 20, faturamento: 180000 },
      { id: "C051", nome: "Sabrina Kunz", razaoSocial: "SK Consórcios ME", cnpj: "60.200.300/0001-51", matricula: "M-30051", nivel: "Autorizado 2.7", carteiraQtd: 17, faturamento: 153000 },
    ],
    carteiras: [
      { id: "CRT-60", cliente: "Vinícola Serra Gaúcha", status: "Ativa", consultor: "HB Negócios Ltda", pvMatricula: "M-20310", qtdClientes: 22, valor: 115500, orfa: false },
      { id: "CRT-61", cliente: "Frigorífico Pampa", status: "Ativa", consultor: "SK Consórcios ME", pvMatricula: "M-20322", qtdClientes: 17, valor: 89300, orfa: false },
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
      historicoAnual: [
        { ano: "2023", scores: [80, 76, 79, 78] },
        { ano: "2024", scores: [86, 82, 85, 84] },
        { ano: "2025", scores: [90, 86, 89, 88] },
        { ano: "2026", scores: [93, 89, 92, 90] },
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
    matricula: "M-10007",
    status: "Inativo",
    cidade: "Brasília",
    estado: "DF",
    dono: "Ricardo Peixoto",
    gerente: GERENTE,
    abertura: "Out 2015",
    rating: "C",
    ratingScore: 52,
    heroImage: "/images/unidades/hero-city.jpg",
    fotos: [
      "/images/unidades-fotos/fachada-noturna.webp",
      "/images/unidades-fotos/gestor-retrato.jpg",
    ],
    dadosContato: {
      endereco: "SCS Quadra 6, Bloco A",
      bairro: "Asa Sul",
      cep: "70306-000",
      telefone: "(61) 3224-8900",
      email: "brasilia-sul@ademicon.com.br",
      horarioFuncionamento: "Seg a Sex, 9h–18h",
    },
    organizacional: [
      { id: "L007", nome: "Brasília-Asa Sul", nivelLabel: "Licenciado 3.5", responsavel: "Ricardo Peixoto", depth: 0, tipo: "loja", documento: "78.901.234/0001-88" },
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
      { id: "CRT-70", cliente: "Gráfica Capital", status: "Inativa", consultor: null, pvMatricula: null, qtdClientes: 1, valor: 2100, orfa: true },
    ],
    comissionamento: {
      basePct: 1.0,
      cascata: [{ nivel: "Licenciado 3.5", pct: 1.0, qtd: 1 }],
      penalidades: [
        { id: "PEN-L007-01", motivo: "Inatividade comercial prolongada", descontoPct: 3.0, vigenciaFim: "Indeterminado" },
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
      historicoAnual: [
        { ano: "2023", scores: [65, 58, 62, 68] },
        { ano: "2024", scores: [58, 50, 55, 62] },
        { ano: "2025", scores: [52, 44, 48, 58] },
        { ano: "2026", scores: [48, 40, 45, 55] },
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
    matricula: "M-10008",
    status: "Ativo",
    cidade: "Salvador",
    estado: "BA",
    dono: "Juliana Farias",
    gerente: GERENTE,
    abertura: "Fev 2020",
    rating: "B",
    ratingScore: 79,
    heroImage: "/images/unidades/unit-saopaulo.png",
    fotos: [
      "/images/unidades-fotos/sala-reuniao.png",
      "/images/unidades-fotos/fachada-canoas.jpg",
      "/images/unidades-fotos/recepcao-loja.webp",
      "/images/unidades-fotos/inauguracao-loja.jpg",
    ],
    dadosContato: {
      endereco: "Av. Oceânica, 2400",
      bairro: "Barra",
      cep: "40140-130",
      telefone: "(71) 3264-5100",
      email: "salvador-barra@ademicon.com.br",
      horarioFuncionamento: "Seg a Sex, 9h–18h",
    },
    organizacional: [
      { id: "L008", nome: "Salvador-Barra", nivelLabel: "Licenciado 3.5", responsavel: "Juliana Farias", depth: 0, tipo: "loja", documento: "89.012.345/0001-99" },
      { id: "PV-1410", nome: "PV Farol", nivelLabel: "Autorizado 2.2", responsavel: "Bruno Cardoso", depth: 1, tipo: "pv", documento: "90.123.456/0001-00" },
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
      { id: "C060", nome: "Bruno Cardoso", razaoSocial: "BC Assessoria ME", cnpj: "61.100.200/0001-60", matricula: "M-30060", nivel: "Autorizado 2.2", carteiraQtd: 14, faturamento: 126000 },
    ],
    carteiras: [
      { id: "CRT-80", cliente: "Restaurante Porto da Barra", status: "Ativa", consultor: "BC Assessoria ME", pvMatricula: "M-20410", qtdClientes: 20, valor: 106200, orfa: false },
      { id: "CRT-81", cliente: "Pousada Farol", status: "Ativa", consultor: null, pvMatricula: "M-20410", qtdClientes: 4, valor: 8500, orfa: true },
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
      historicoAnual: [
        { ano: "2023", scores: [70, 62, 66, 69] },
        { ano: "2024", scores: [75, 68, 72, 74] },
        { ano: "2025", scores: [79, 72, 75, 78] },
        { ano: "2026", scores: [82, 75, 78, 81] },
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
