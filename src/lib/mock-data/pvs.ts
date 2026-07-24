import {
  Store,
  Handshake,
  Flag,
  ClipboardCheck,
  Trophy,
} from "lucide-react";

import type {
  Carteira,
  ComissionamentoInfo,
  SocietariaItem,
  HistoricoItem,
  ConsultorVinculado,
  OrganizacionalNode,
  FinanceiroInfo,
  DadosContatoInfo,
} from "./unidades";

// Re-export shared types for convenience
export type { Carteira, ComissionamentoInfo, SocietariaItem, HistoricoItem, ConsultorVinculado, OrganizacionalNode, FinanceiroInfo, DadosContatoInfo };

export type PVStatus = "Ativo" | "Inativo" | "Suspenso";

export interface PVListItem {
  id: string;
  nome: string;
  unidadeMae: string;
  unidadeMaeId: string;
  gestor: string;
  nivel: string;
  status: PVStatus;
  carteirasQtd: number;
}

export interface PVDetalhe {
  id: string;
  nome: string;
  status: PVStatus;
  unidadeMae: { id: string; nome: string };
  gestor: string;
  gestorAvatar?: string;
  abertura: string;
  nivel: string;
  heroImage: string;
  dadosContato: DadosContatoInfo;
  organizacional: OrganizacionalNode[];
  financeiro: FinanceiroInfo;
  consultoresVinculados: ConsultorVinculado[];
  carteiras: Carteira[];
  comissionamento: ComissionamentoInfo;
  societaria: SocietariaItem[];
  historico: HistoricoItem[];
}

// --------------- List data ---------------

export const pvsList: PVListItem[] = [
  { id: "PV-1042", nome: "PV Alpha", unidadeMae: "SP-Centro", unidadeMaeId: "L001", gestor: "Carlos Oliveira", nivel: "Autorizado 2.5", status: "Ativo", carteirasQtd: 4 },
  { id: "PV-1055", nome: "PV Vega", unidadeMae: "SP-Centro", unidadeMaeId: "L001", gestor: "Beatriz Souza", nivel: "Autorizado 2.2", status: "Ativo", carteirasQtd: 3 },
  { id: "PV-2091", nome: "PV Zeta", unidadeMae: "SP-Centro", unidadeMaeId: "L001", gestor: "Diego Farias", nivel: "Autorizado 2.0", status: "Ativo", carteirasQtd: 2 },
  { id: "PV-2050", nome: "Sigma Participações", unidadeMae: "Curitiba-Norte", unidadeMaeId: "L003", gestor: "Pedro Costa", nivel: "Autorizado 2.0", status: "Ativo", carteirasQtd: 5 },
  { id: "PV-3010", nome: "PV Orion", unidadeMae: "Campinas", unidadeMaeId: "L002", gestor: "Marcos Tavares", nivel: "Autorizado 2.5", status: "Ativo", carteirasQtd: 7 },
  { id: "PV-3022", nome: "PV Nova Era", unidadeMae: "RJ-Barra", unidadeMaeId: "L004", gestor: "Patrícia Nogueira", nivel: "Autorizado 2.2", status: "Suspenso", carteirasQtd: 2 },
  { id: "PV-4001", nome: "PV Horizonte", unidadeMae: "BH-Savassi", unidadeMaeId: "L005", gestor: "Eduardo Martins", nivel: "Autorizado 2.5", status: "Inativo", carteirasQtd: 0 },
  { id: "PV-4015", nome: "PV Atlântico", unidadeMae: "Porto Alegre-Moinhos", unidadeMaeId: "L006", gestor: "Camila Torres", nivel: "Autorizado 2.2", status: "Ativo", carteirasQtd: 6 },
  { id: "PV-5001", nome: "PV Estrela", unidadeMae: "Salvador-Barra", unidadeMaeId: "L008", gestor: "Juliana Farias", nivel: "Autorizado 2.5", status: "Ativo", carteirasQtd: 8 },
  { id: "PV-5020", nome: "PV Nordeste", unidadeMae: "Salvador-Barra", unidadeMaeId: "L008", gestor: "Thiago Alves", nivel: "Autorizado 2.0", status: "Ativo", carteirasQtd: 3 },
  { id: "PV-6001", nome: "PV Capital", unidadeMae: "Brasília-Asa Sul", unidadeMaeId: "L007", gestor: "Ricardo Peixoto", nivel: "Autorizado 2.2", status: "Inativo", carteirasQtd: 1 },
  { id: "PV-6010", nome: "PV Planalto", unidadeMae: "Brasília-Asa Sul", unidadeMaeId: "L007", gestor: "Fernanda Lopes", nivel: "Autorizado 2.0", status: "Ativo", carteirasQtd: 4 },
];

// --------------- Detail data ---------------

export const pvsDetalhe: Record<string, PVDetalhe> = {
  "PV-1042": {
    id: "PV-1042",
    nome: "PV Alpha",
    status: "Ativo",
    unidadeMae: { id: "L001", nome: "SP-Centro" },
    gestor: "Carlos Oliveira",
    gestorAvatar: "https://i.pravatar.cc/80?img=7",
    abertura: "Fev 2020",
    nivel: "Autorizado 2.5",
    heroImage: "/images/unidades/hero-city.jpg",
    dadosContato: {
      endereco: "Av. Paulista, 1000 — Sala 1204",
      bairro: "Bela Vista",
      cep: "01310-100",
      telefone: "(11) 3256-1042",
      email: "pv-alpha@ademicon.com.br",
      horarioFuncionamento: "Seg a Sex, 9h–18h",
    },
    organizacional: [
      {
        id: "PV-1042",
        nome: "PV Alpha",
        nivelLabel: "Autorizado 2.5",
        responsavel: "Carlos Oliveira",
        depth: 0,
        tipo: "pv",
        documento: "23.456.789/0001-11",
        children: [
          { id: "S-PV1042-01", nome: "Carlos Oliveira", nivelLabel: "Sócio Administrador", responsavel: "Sócio", depth: 1, tipo: "socio", documento: "123.456.789-00", avatarUrl: "https://i.pravatar.cc/80?img=7", participacaoPct: 60, comissaoPct: 0.8 },
          { id: "S-PV1042-02", nome: "Juliana Mendes", nivelLabel: "Sócio", responsavel: "Sócio", depth: 1, tipo: "socio", documento: "234.567.890-11", avatarUrl: "https://i.pravatar.cc/80?img=25", participacaoPct: 40, comissaoPct: 0.5 },
          { id: "C001", nome: "MS Assessoria Ltda", nivelLabel: "Consultor", responsavel: "Maria Santos", depth: 1, tipo: "consultor", documento: "55.123.456/0001-01", matricula: "M-30001" },
          { id: "C005", nome: "FL Participações ME", nivelLabel: "Consultor", responsavel: "Fernanda Lima", depth: 1, tipo: "consultor", documento: "55.234.567/0001-02", matricula: "M-30005" },
        ],
      },
    ],
    financeiro: {
      faturamentoConsolidado: 198500,
      ticketMedio: 7200,
      novosClientesMes: 6,
      meses: ["Jan/26", "Fev/26", "Mar/26", "Abr/26", "Mai/26", "Jun/26"],
      faturamentoSerie: [160000, 168000, 175000, 182000, 190000, 198500],
      vendasSerie: [18, 20, 21, 23, 25, 27],
    },
    consultoresVinculados: [
      { id: "C001", nome: "Maria Santos", razaoSocial: "MS Assessoria Ltda", cnpj: "55.123.456/0001-01", matricula: "M-30001", nivel: "Consultor", carteiraQtd: 22, faturamento: 108000 },
      { id: "C005", nome: "Fernanda Lima", razaoSocial: "FL Participações ME", cnpj: "55.234.567/0001-02", matricula: "M-30005", nivel: "Consultor", carteiraQtd: 18, faturamento: 90500 },
    ],
    carteiras: [
      { id: "CRT-10", cliente: "Empresa Z", status: "Ativa", consultor: "MS Assessoria Ltda", pvMatricula: "M-20042", qtdClientes: 24, valor: 122300, orfa: false },
      { id: "CRT-11", cliente: "Cliente W", status: "Inativa", consultor: null, pvMatricula: "M-20042", qtdClientes: 3, valor: 6100, orfa: true },
      { id: "CRT-12", cliente: "Tech Solutions", status: "Ativa", consultor: "FL Participações ME", pvMatricula: "M-20042", qtdClientes: 21, valor: 107000, orfa: false },
      { id: "CRT-13", cliente: "Consórcio Alfa", status: "Ativa", consultor: "MS Assessoria Ltda", pvMatricula: "M-20042", qtdClientes: 16, valor: 81600, orfa: false },
    ],
    comissionamento: {
      basePct: 0.8,
      cascata: [
        { nivel: "Autorizado 2.5", pct: 0.8, qtd: 1 },
        { nivel: "Consultor", pct: 0.3, qtd: 2 },
      ],
      penalidades: [],
    },
    societaria: [
      { razao: "Alpha Consórcios LTDA", cnpj: "23.456.789/0001-11", papel: "Titular", pct: 60, status: "Ativo" },
      { razao: "JM Participações ME", cnpj: "34.567.890/0001-22", papel: "Sócio", pct: 40, status: "Ativo" },
    ],
    historico: [
      { data: "Jun 2026", icon: Flag, color: "blue", titulo: "Meta trimestral atingida", desc: "Equipe superou meta em 12%.", tipo: "evento", detalhe: { responsavel: "Carlos Oliveira", observacao: "Faturamento trimestral de R$ 198.500, acima da meta de R$ 177.000.", acao: "Bonificação aplicada à equipe." } },
      { data: "Mai 2026", icon: ClipboardCheck, color: "gray", titulo: "Revisão de carteiras", desc: "Auditoria interna de carteiras ativas.", tipo: "avaliacao", detalhe: { responsavel: "Carlos Oliveira", observacao: "4 carteiras ativas, 1 órfã identificada e redistribuída.", acao: "Carteira CRT-11 atribuída a Fernanda Lima." } },
      { data: "Abr 2026", icon: Handshake, color: "green", titulo: "Visita de acompanhamento", desc: "Revisão de performance individual dos consultores.", tipo: "visita", detalhe: { responsavel: "Roberto Almeida", observacao: "Maria Santos com excelente desempenho. Fernanda Lima precisa ampliar prospecção.", acao: "Meta individual ajustada para Fernanda." } },
      { data: "Mar 2026", icon: Handshake, color: "green", titulo: "Novo consultor vinculado", desc: "Fernanda Lima ingressou na equipe.", tipo: "evento", detalhe: { responsavel: "Carlos Oliveira", observacao: "Transferência do PV Vega. Carteira inicial de 18 clientes.", acao: "Onboarding concluído." } },
      { data: "Fev 2026", icon: Flag, color: "amber", titulo: "Alerta de produtividade", desc: "Faturamento mensal abaixo da meta por 2 meses consecutivos.", tipo: "ocorrencia", status: "Resolvido", detalhe: { responsavel: "Carlos Oliveira", observacao: "Dez/2025 e Jan/2026 abaixo de 85% da meta.", acao: "Plano de recuperação implementado com sucesso.", dataResolucao: "Mar 2026" } },
      { data: "Nov 2025", icon: ClipboardCheck, color: "gray", titulo: "Avaliação semestral", desc: "Performance geral classificada como satisfatória.", tipo: "avaliacao", detalhe: { responsavel: "Roberto Almeida", observacao: "Score de 78/100. Ponto de melhoria: prospecção de novos clientes.", acao: "Meta de 3 novos clientes/mês definida." } },
      { data: "Jul 2025", icon: Trophy, color: "green", titulo: "Maria Santos → Top faturamento PV", desc: "Melhor desempenho individual do semestre.", tipo: "promocao", detalhe: { responsavel: "Sistema", observacao: "Faturamento de R$ 108.000 no semestre.", acao: "Reconhecimento público na reunião mensal." } },
      { data: "Jan 2022", icon: Flag, color: "blue", titulo: "Promoção para 2.5", desc: "Equipe atingiu meta semestral.", tipo: "promocao", detalhe: { responsavel: "Diretoria", observacao: "Cumprimento de requisitos de faturamento e carteiras por 2 semestres.", acao: "Certificado emitido." } },
      { data: "Fev 2020", icon: Store, color: "gray", titulo: "Abertura do PV", desc: "Vinculado à unidade SP-Centro.", tipo: "evento", detalhe: { responsavel: "Diretoria", observacao: "Carlos Oliveira assume como gestor. Meta inicial: 15 carteiras em 12 meses.", acao: "Acompanhamento mensal definido." } },
    ],
  },
  "PV-1055": {
    id: "PV-1055",
    nome: "PV Vega",
    status: "Ativo",
    unidadeMae: { id: "L001", nome: "SP-Centro" },
    gestor: "Beatriz Souza",
    gestorAvatar: "https://i.pravatar.cc/80?img=16",
    abertura: "Ago 2021",
    nivel: "Autorizado 2.2",
    heroImage: "/images/unidades/hero-city.jpg",
    dadosContato: {
      endereco: "Rua Vergueiro, 3185 — Conj. 42",
      bairro: "Vila Mariana",
      cep: "04101-300",
      telefone: "(11) 3256-1055",
      email: "pv-vega@ademicon.com.br",
      horarioFuncionamento: "Seg a Sex, 9h–18h",
    },
    organizacional: [
      {
        id: "PV-1055",
        nome: "PV Vega",
        nivelLabel: "Autorizado 2.2",
        responsavel: "Beatriz Souza",
        depth: 0,
        tipo: "pv",
        documento: "34.567.890/0001-22",
        children: [
          { id: "S-PV1055-01", nome: "Beatriz Souza", nivelLabel: "Sócio Administrador", responsavel: "Sócio", depth: 1, tipo: "socio", documento: "345.678.901-22", avatarUrl: "https://i.pravatar.cc/80?img=16", participacaoPct: 70, comissaoPct: 0.5 },
          { id: "S-PV1055-02", nome: "André Pereira", nivelLabel: "Sócio", responsavel: "Sócio", depth: 1, tipo: "socio", documento: "456.789.012-33", avatarUrl: "https://i.pravatar.cc/80?img=12", participacaoPct: 30, comissaoPct: 0.3 },
          { id: "C003", nome: "BS Investimentos Ltda", nivelLabel: "Consultor", responsavel: "Beatriz Souza", depth: 1, tipo: "consultor", documento: "55.345.678/0001-03", matricula: "M-30003" },
          { id: "C006", nome: "RC Consórcios ME", nivelLabel: "Consultor", responsavel: "Rafael Costa", depth: 1, tipo: "consultor", documento: "55.456.789/0001-04", matricula: "M-30006" },
        ],
      },
    ],
    financeiro: {
      faturamentoConsolidado: 141600,
      ticketMedio: 6800,
      novosClientesMes: 4,
      meses: ["Jan/26", "Fev/26", "Mar/26", "Abr/26", "Mai/26", "Jun/26"],
      faturamentoSerie: [115000, 120000, 126000, 131000, 136000, 141600],
      vendasSerie: [14, 15, 16, 17, 18, 20],
    },
    consultoresVinculados: [
      { id: "C003", nome: "Beatriz Souza", razaoSocial: "BS Investimentos Ltda", cnpj: "55.345.678/0001-03", matricula: "M-30003", nivel: "Consultor", carteiraQtd: 15, faturamento: 78000 },
      { id: "C006", nome: "Rafael Costa", razaoSocial: "RC Consórcios ME", cnpj: "55.456.789/0001-04", matricula: "M-30006", nivel: "Consultor", carteiraQtd: 14, faturamento: 63600 },
    ],
    carteiras: [
      { id: "CRT-20", cliente: "Investe Mais LTDA", status: "Ativa", consultor: "BS Investimentos Ltda", pvMatricula: "M-20055", qtdClientes: 18, valor: 92300, orfa: false },
      { id: "CRT-21", cliente: "Costa & Filhos", status: "Ativa", consultor: "RC Consórcios ME", pvMatricula: "M-20055", qtdClientes: 15, valor: 76900, orfa: false },
      { id: "CRT-22", cliente: "Patrimônio Seguro", status: "Inativa", consultor: null, pvMatricula: "M-20055", qtdClientes: 4, valor: 8200, orfa: true },
    ],
    comissionamento: {
      basePct: 0.5,
      cascata: [
        { nivel: "Autorizado 2.2", pct: 0.5, qtd: 1 },
        { nivel: "Consultor", pct: 0.2, qtd: 2 },
      ],
      penalidades: [],
    },
    societaria: [
      { razao: "Vega Assessoria ME", cnpj: "34.567.890/0001-22", papel: "Titular", pct: 70, status: "Ativo" },
      { razao: "AP Investimentos", cnpj: "45.678.901/0001-33", papel: "Sócio", pct: 30, status: "Ativo" },
    ],
    historico: [
      { data: "Mai 2026", icon: Flag, color: "green", titulo: "Meta mensal atingida", desc: "Equipe superou meta em 8%.", tipo: "evento", detalhe: { responsavel: "Beatriz Souza", observacao: "Faturamento de R$ 141.600 contra meta de R$ 131.000.", acao: "Bonificação aplicada." } },
      { data: "Abr 2026", icon: ClipboardCheck, color: "gray", titulo: "Revisão de carteiras", desc: "3 carteiras verificadas, 1 órfã redistribuída.", tipo: "avaliacao", detalhe: { responsavel: "Beatriz Souza", observacao: "Carteira CRT-22 sem consultor há 45 dias.", acao: "Atribuída a Rafael Costa." } },
      { data: "Mar 2026", icon: Handshake, color: "green", titulo: "Visita de acompanhamento", desc: "Avaliação de performance do PV.", tipo: "visita", detalhe: { responsavel: "Roberto Almeida", observacao: "PV operando dentro dos parâmetros. Potencial para upgrade de nível.", acao: "Análise de promoção para 2.5 em Jun 2026." } },
      { data: "Jan 2026", icon: Flag, color: "amber", titulo: "Atraso em relatório mensal", desc: "Relatório de Dez/2025 entregue com 10 dias de atraso.", tipo: "ocorrencia", status: "Resolvido", detalhe: { responsavel: "Beatriz Souza", observacao: "Motivo: férias de gestor sem delegação.", acao: "Processo de delegação formalizado.", dataResolucao: "Jan 2026" } },
      { data: "Nov 2025", icon: ClipboardCheck, color: "gray", titulo: "Avaliação semestral", desc: "Score de 74/100. Estável.", tipo: "avaliacao", detalhe: { responsavel: "Roberto Almeida", observacao: "Boa performance, mas carteira ainda pequena para o nível.", acao: "Meta de 20 carteiras até Jun 2026." } },
      { data: "Set 2025", icon: Trophy, color: "green", titulo: "Rafael Costa → Destaque mensal", desc: "Maior número de novos clientes no mês.", tipo: "promocao", detalhe: { responsavel: "Sistema", observacao: "5 novos clientes conquistados em Set 2025.", acao: "Reconhecimento interno." } },
      { data: "Ago 2021", icon: Store, color: "gray", titulo: "Abertura do PV", desc: "Vinculado à unidade SP-Centro.", tipo: "evento", detalhe: { responsavel: "Diretoria", observacao: "Beatriz Souza assume como gestora. Meta: 10 carteiras em 12 meses.", acao: "Operação iniciada." } },
    ],
  },
  "PV-2091": {
    id: "PV-2091",
    nome: "PV Zeta",
    status: "Ativo",
    unidadeMae: { id: "L001", nome: "SP-Centro" },
    gestor: "Diego Farias",
    gestorAvatar: "https://i.pravatar.cc/80?img=11",
    abertura: "Mar 2022",
    nivel: "Autorizado 2.0",
    heroImage: "/images/unidades/hero-city.jpg",
    dadosContato: {
      endereco: "Rua Haddock Lobo, 595 — 8º andar",
      bairro: "Cerqueira César",
      cep: "01414-001",
      telefone: "(11) 3256-2091",
      email: "pv-zeta@ademicon.com.br",
      horarioFuncionamento: "Seg a Sex, 9h–18h",
    },
    organizacional: [
      {
        id: "PV-2091",
        nome: "PV Zeta",
        nivelLabel: "Autorizado 2.0",
        responsavel: "Diego Farias",
        depth: 0,
        tipo: "pv",
        documento: "45.678.901/0001-33",
        children: [
          { id: "S-PV2091-01", nome: "Diego Farias", nivelLabel: "Sócio Administrador", responsavel: "Sócio", depth: 1, tipo: "socio", documento: "567.890.123-44", avatarUrl: "https://i.pravatar.cc/80?img=11", participacaoPct: 100, comissaoPct: 0.4 },
          { id: "C004", nome: "DF Consórcios ME", nivelLabel: "Consultor", responsavel: "Diego Farias", depth: 1, tipo: "consultor", documento: "55.567.890/0001-05", matricula: "M-30004" },
        ],
      },
    ],
    financeiro: {
      faturamentoConsolidado: 108000,
      ticketMedio: 5400,
      novosClientesMes: 3,
      meses: ["Jan/26", "Fev/26", "Mar/26", "Abr/26", "Mai/26", "Jun/26"],
      faturamentoSerie: [85000, 90000, 94000, 98000, 103000, 108000],
      vendasSerie: [10, 11, 12, 13, 14, 15],
    },
    consultoresVinculados: [
      { id: "C004", nome: "Diego Farias", razaoSocial: "DF Consórcios ME", cnpj: "55.567.890/0001-05", matricula: "M-30004", nivel: "Consultor", carteiraQtd: 12, faturamento: 108000 },
    ],
    carteiras: [
      { id: "CRT-30", cliente: "Grupo Farias", status: "Ativa", consultor: "DF Consórcios ME", pvMatricula: "M-20091", qtdClientes: 12, valor: 61900, orfa: false },
      { id: "CRT-31", cliente: "Capital Norte", status: "Ativa", consultor: "DF Consórcios ME", pvMatricula: "M-20091", qtdClientes: 8, valor: 41300, orfa: false },
    ],
    comissionamento: {
      basePct: 0.4,
      cascata: [
        { nivel: "Autorizado 2.0", pct: 0.4, qtd: 1 },
        { nivel: "Consultor", pct: 0.15, qtd: 1 },
      ],
      penalidades: [],
    },
    societaria: [
      { razao: "Zeta Negócios ME", cnpj: "45.678.901/0001-33", papel: "Titular", pct: 100, status: "Ativo" },
    ],
    historico: [
      { data: "Abr 2026", icon: Handshake, color: "green", titulo: "Renovação de contrato", desc: "Contrato renovado por mais 12 meses.", tipo: "evento", detalhe: { responsavel: "Jurídico Ademicon", observacao: "Renovação automática sem reajuste (primeiro ciclo).", acao: "Contrato registrado." } },
      { data: "Mar 2026", icon: ClipboardCheck, color: "gray", titulo: "Revisão de carteiras", desc: "2 carteiras ativas verificadas.", tipo: "avaliacao", detalhe: { responsavel: "Diego Farias", observacao: "Ambas as carteiras em dia. Nenhuma pendência.", acao: "Manter acompanhamento padrão." } },
      { data: "Fev 2026", icon: Flag, color: "amber", titulo: "Meta não atingida em Jan/2026", desc: "Faturamento 15% abaixo da meta mensal.", tipo: "ocorrencia", status: "Resolvido", detalhe: { responsavel: "Diego Farias", observacao: "Período de férias impactou prospecção.", acao: "Compensação realizada em Fev 2026.", dataResolucao: "Fev 2026" } },
      { data: "Jan 2026", icon: Handshake, color: "green", titulo: "Visita de início de ano", desc: "Alinhamento de metas 2026.", tipo: "visita", detalhe: { responsavel: "Roberto Almeida", observacao: "Meta definida: 15 vendas/mês e 4 carteiras ativas até Jun 2026.", acao: "Plano de ação registrado." } },
      { data: "Nov 2025", icon: ClipboardCheck, color: "gray", titulo: "Avaliação semestral", desc: "Score de 68/100. Em desenvolvimento.", tipo: "avaliacao", detalhe: { responsavel: "Roberto Almeida", observacao: "PV ainda em fase de maturação. Prospecção precisa melhorar.", acao: "Mentoria com gestor da unidade programada." } },
      { data: "Set 2025", icon: Trophy, color: "green", titulo: "Primeira meta trimestral atingida", desc: "PV superou meta do Q3 2025.", tipo: "evento", detalhe: { responsavel: "Sistema", observacao: "Faturamento de R$ 94.000 contra meta de R$ 85.000.", acao: "Reconhecimento interno." } },
      { data: "Mar 2022", icon: Store, color: "gray", titulo: "Abertura do PV", desc: "Vinculado à unidade SP-Centro.", tipo: "evento", detalhe: { responsavel: "Diretoria", observacao: "Diego Farias assume como gestor e único consultor.", acao: "Meta inicial: 8 carteiras em 12 meses." } },
    ],
  },
};
