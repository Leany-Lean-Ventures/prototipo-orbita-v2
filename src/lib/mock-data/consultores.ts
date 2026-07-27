import {
  Store,
  Handshake,
  Flag,
  ClipboardCheck,
  Trophy,
  RefreshCw,
} from "lucide-react";

import type {
  Carteira,
  HistoricoItem,
  FinanceiroInfo,
} from "./unidades";

export type { Carteira, HistoricoItem, FinanceiroInfo };

export type ConsultorStatus = "Ativo" | "Inativo" | "Descredenciado";

export interface ConsultorListItem {
  id: string;
  nome: string;
  razaoSocial: string;
  cnpj: string;
  matricula: string;
  nivel: string;
  lojaPrincipal: string;
  lojaPrincipalId: string;
  empresas: number;
  status: ConsultorStatus;
}

export interface VinculoItem {
  pv: string;
  pvId: string;
  papel: string;
  inicio: string;
  status: "Ativo" | "Encerrado";
}

export interface DadosBasicosConsultor {
  rg: string;
  nascimento: string;
  email: string;
  telefone: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface VisaoEconomica {
  scoreInterno: number;
  faturamentoConsolidado: number;
  totalCarteiras: number;
  cnpjsVinculados: number;
  meses: string[];
  faturamentoSerie: number[];
}

export interface ComissionamentoConsultor {
  nivelAtual: string;
  pctAtual: number;
  penalidades: { motivo: string; descontoPct: number; vigenciaFim: string }[];
}

export interface ConsultorDetalhe {
  id: string;
  nome: string;
  razaoSocial: string;
  cnpj: string;
  matricula: string;
  nivel: string;
  lojaPrincipal: { id: string; nome: string };
  indicador: { id: string; nome: string; razaoSocial: string } | null;
  ingresso: string;
  status: ConsultorStatus;
  dadosBasicos: DadosBasicosConsultor;
  vinculos: VinculoItem[];
  visaoEconomica: VisaoEconomica;
  comissionamento: ComissionamentoConsultor;
  carteiras: Carteira[];
  historico: HistoricoItem[];
}

// --------------- List data ---------------

export const consultoresList: ConsultorListItem[] = [
  { id: "C100", nome: "João Silva", razaoSocial: "Alpha Consultoria Ltda", cnpj: "12.345.678/0001-90", matricula: "M-10001", nivel: "Licenciado 3.5", lojaPrincipal: "SP-Centro", lojaPrincipalId: "L001", empresas: 2, status: "Ativo" },
  { id: "C101", nome: "Marina Reis", razaoSocial: "Reis Participações Ltda", cnpj: "23.456.789/0001-11", matricula: "M-10002", nivel: "Licenciado 3.5", lojaPrincipal: "Campinas", lojaPrincipalId: "L002", empresas: 1, status: "Ativo" },
  { id: "C001", nome: "Maria Santos", razaoSocial: "MS Assessoria Ltda", cnpj: "55.123.456/0001-01", matricula: "M-00101", nivel: "Consultor", lojaPrincipal: "SP-Centro", lojaPrincipalId: "L001", empresas: 1, status: "Ativo" },
  { id: "C002", nome: "Carlos Oliveira", razaoSocial: "Alpha Consórcios LTDA", cnpj: "23.456.789/0001-11", matricula: "M-00102", nivel: "Autorizado 2.5", lojaPrincipal: "SP-Centro", lojaPrincipalId: "L001", empresas: 2, status: "Ativo" },
  { id: "C003", nome: "Beatriz Souza", razaoSocial: "BS Investimentos Ltda", cnpj: "55.345.678/0001-03", matricula: "M-00103", nivel: "Autorizado 2.2", lojaPrincipal: "SP-Centro", lojaPrincipalId: "L001", empresas: 1, status: "Ativo" },
  { id: "C004", nome: "Diego Farias", razaoSocial: "DF Consórcios ME", cnpj: "55.567.890/0001-05", matricula: "M-00104", nivel: "Autorizado 2.0", lojaPrincipal: "SP-Centro", lojaPrincipalId: "L001", empresas: 1, status: "Ativo" },
  { id: "C005", nome: "Fernanda Lima", razaoSocial: "FL Participações ME", cnpj: "55.234.567/0001-02", matricula: "M-00105", nivel: "Consultor", lojaPrincipal: "SP-Centro", lojaPrincipalId: "L001", empresas: 1, status: "Ativo" },
  { id: "C006", nome: "Rafael Costa", razaoSocial: "RC Consórcios ME", cnpj: "55.456.789/0001-04", matricula: "M-00106", nivel: "Consultor", lojaPrincipal: "SP-Centro", lojaPrincipalId: "L001", empresas: 1, status: "Ativo" },
  { id: "C007", nome: "Juliana Mendes", razaoSocial: "JM Assessoria ME", cnpj: "55.678.901/0001-07", matricula: "M-00107", nivel: "Consultor", lojaPrincipal: "SP-Centro", lojaPrincipalId: "L001", empresas: 1, status: "Inativo" },
  { id: "C008", nome: "André Pereira", razaoSocial: "AP Investimentos", cnpj: "55.789.012/0001-08", matricula: "M-00108", nivel: "Consultor", lojaPrincipal: "SP-Centro", lojaPrincipalId: "L001", empresas: 1, status: "Ativo" },
  { id: "C009", nome: "Camila Rocha", razaoSocial: "CR Consórcios Ltda", cnpj: "55.890.123/0001-09", matricula: "M-00109", nivel: "Autorizado 2.5", lojaPrincipal: "Campinas", lojaPrincipalId: "L002", empresas: 2, status: "Ativo" },
  { id: "C010", nome: "Lucas Martins", razaoSocial: "LM Participações ME", cnpj: "55.901.234/0001-10", matricula: "M-00110", nivel: "Consultor", lojaPrincipal: "Campinas", lojaPrincipalId: "L002", empresas: 1, status: "Ativo" },
  { id: "C011", nome: "Renata Lopes", razaoSocial: "RL Negócios Ltda", cnpj: "57.100.200/0001-20", matricula: "M-00111", nivel: "Autorizado 2.5", lojaPrincipal: "Curitiba-Norte", lojaPrincipalId: "L003", empresas: 1, status: "Ativo" },
  { id: "C012", nome: "Pedro Costa", razaoSocial: "PC Negócios ME", cnpj: "57.200.300/0001-21", matricula: "M-00112", nivel: "Autorizado 2.0", lojaPrincipal: "Curitiba-Norte", lojaPrincipalId: "L003", empresas: 1, status: "Descredenciado" },
];

// --------------- Detail data ---------------

export const consultoresDetalhe: Record<string, ConsultorDetalhe> = {
  C001: {
    id: "C001",
    nome: "Maria Santos",
    razaoSocial: "MS Assessoria Ltda",
    cnpj: "55.123.456/0001-01",
    matricula: "M-00101",
    nivel: "Consultor",
    lojaPrincipal: { id: "L001", nome: "SP-Centro" },
    indicador: { id: "C002", nome: "Carlos Oliveira", razaoSocial: "Alpha Consórcios LTDA" },
    ingresso: "Jan 2021",
    status: "Ativo",
    dadosBasicos: {
      rg: "40.936.565-8",
      nascimento: "12/03/1992",
      email: "maria.santos@email.com",
      telefone: "(11) 99123-4567",
      endereco: "Rua das Flores, 234 — Apto 12",
      bairro: "Vila Mariana",
      cidade: "São Paulo",
      estado: "SP",
      cep: "04101-000",
    },
    vinculos: [
      { pv: "PV Alpha (PV-1042)", pvId: "PV-1042", papel: "Consultor", inicio: "Jan 2021", status: "Ativo" },
    ],
    visaoEconomica: {
      scoreInterno: 780,
      faturamentoConsolidado: 198500,
      totalCarteiras: 22,
      cnpjsVinculados: 1,
      meses: ["Jan/26", "Fev/26", "Mar/26", "Abr/26", "Mai/26", "Jun/26"],
      faturamentoSerie: [28000, 30000, 32000, 34500, 36000, 38000],
    },
    comissionamento: {
      nivelAtual: "Consultor",
      pctAtual: 0.3,
      penalidades: [],
    },
    carteiras: [
      { id: "CRT-50", cliente: "Empresa Z", status: "Ativa", consultor: "MS Assessoria Ltda", pvMatricula: "M-20042", qtdClientes: 24, valor: 125300 },
      { id: "CRT-51", cliente: "Tech Solutions", status: "Ativa", consultor: "MS Assessoria Ltda", pvMatricula: "M-20042", qtdClientes: 21, valor: 109600 },
      { id: "CRT-52", cliente: "Consórcio Alfa", status: "Ativa", consultor: "MS Assessoria Ltda", pvMatricula: "M-20042", qtdClientes: 16, valor: 83500 },
      { id: "CRT-53", cliente: "Grupo Beta", status: "Órfã", consultor: "MS Assessoria Ltda", pvMatricula: "M-20042", qtdClientes: 5, valor: 26100 },
    ],
    historico: [
      { data: "Jun 2026", icon: Trophy, color: "green", titulo: "Top 1 faturamento do PV", desc: "Maior faturamento individual no trimestre.", tipo: "promocao", detalhe: { responsavel: "Sistema", observacao: "Faturamento de R$ 108.000 no Q2 2026.", acao: "Bonificação aplicada." } },
      { data: "Mar 2026", icon: Flag, color: "blue", titulo: "Meta trimestral atingida", desc: "Superou meta em 15%.", tipo: "evento", detalhe: { responsavel: "Carlos Oliveira", observacao: "22 carteiras ativas, acima da meta de 18.", acao: "Reconhecimento na reunião mensal." } },
      { data: "Nov 2025", icon: ClipboardCheck, color: "gray", titulo: "Avaliação semestral", desc: "Score de 82/100. Excelente desempenho.", tipo: "avaliacao", detalhe: { responsavel: "Roberto Almeida", observacao: "Destaque em prospecção e relacionamento.", acao: "Candidata a promoção em 2026." } },
      { data: "Jul 2025", icon: Handshake, color: "green", titulo: "Visita de acompanhamento", desc: "Mentoria com gestor do PV.", tipo: "visita", detalhe: { responsavel: "Carlos Oliveira", observacao: "Orientação sobre gestão de carteiras grandes.", acao: "Plano de desenvolvimento individual atualizado." } },
      { data: "Mar 2025", icon: Flag, color: "amber", titulo: "Alerta de carteira órfã", desc: "2 carteiras sem movimentação por 60 dias.", tipo: "ocorrencia", status: "Resolvido", detalhe: { responsavel: "Maria Santos", observacao: "Clientes contatados e reativados.", acao: "Carteiras normalizadas.", dataResolucao: "Abr 2025" } },
      { data: "Jan 2021", icon: Store, color: "blue", titulo: "Ingresso na rede", desc: "Vinculada ao PV Alpha como consultora.", tipo: "evento", detalhe: { responsavel: "Carlos Oliveira", observacao: "Indicação de Carlos Oliveira. Meta inicial: 10 carteiras em 12 meses.", acao: "Onboarding concluído." } },
    ],
  },
  C002: {
    id: "C002",
    nome: "Carlos Oliveira",
    razaoSocial: "Alpha Consórcios LTDA",
    cnpj: "23.456.789/0001-11",
    matricula: "M-00102",
    nivel: "Autorizado 2.5",
    lojaPrincipal: { id: "L001", nome: "SP-Centro" },
    indicador: null,
    ingresso: "Mar 2018",
    status: "Ativo",
    dadosBasicos: {
      rg: "32.456.789-1",
      nascimento: "04/07/1985",
      email: "carlos.oliveira@email.com",
      telefone: "(11) 99234-5678",
      endereco: "Av. Paulista, 1000 — Sala 1204",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01310-100",
    },
    vinculos: [
      { pv: "PV Alpha (PV-1042)", pvId: "PV-1042", papel: "Gestor / Sócio", inicio: "Fev 2020", status: "Ativo" },
      { pv: "SP-Centro (L001)", pvId: "L001", papel: "Consultor", inicio: "Mar 2018", status: "Encerrado" },
    ],
    visaoEconomica: {
      scoreInterno: 920,
      faturamentoConsolidado: 512000,
      totalCarteiras: 40,
      cnpjsVinculados: 2,
      meses: ["Jan/26", "Fev/26", "Mar/26", "Abr/26", "Mai/26", "Jun/26"],
      faturamentoSerie: [78000, 82000, 85000, 88000, 90000, 89000],
    },
    comissionamento: {
      nivelAtual: "Autorizado 2.5",
      pctAtual: 0.8,
      penalidades: [],
    },
    carteiras: [
      { id: "CRT-60", cliente: "Capital Invest", status: "Ativa", consultor: "Alpha Consórcios LTDA", pvMatricula: "M-20042", qtdClientes: 31, valor: 162800 },
      { id: "CRT-61", cliente: "Prime Assets", status: "Ativa", consultor: "Alpha Consórcios LTDA", pvMatricula: "M-20042", qtdClientes: 19, valor: 99800 },
      { id: "CRT-62", cliente: "Oliveira & Filhos", status: "Ativa", consultor: "Alpha Consórcios LTDA", pvMatricula: "M-20042", qtdClientes: 14, valor: 73500 },
    ],
    historico: [
      { data: "Mai 2026", icon: ClipboardCheck, color: "gray", titulo: "Avaliação semestral", desc: "Score de 92/100. Performance excepcional.", tipo: "avaliacao", detalhe: { responsavel: "Roberto Almeida", observacao: "Líder em faturamento e mentoria de equipe.", acao: "Análise de promoção para 2.7 em andamento." } },
      { data: "Mar 2026", icon: Trophy, color: "green", titulo: "Melhor gestor do trimestre", desc: "PV Alpha superou todas as metas.", tipo: "promocao", detalhe: { responsavel: "Diretoria", observacao: "Faturamento 18% acima da meta. Equipe com zero inadimplência.", acao: "Prêmio trimestral aplicado." } },
      { data: "Fev 2026", icon: Handshake, color: "green", titulo: "Novo consultor vinculado", desc: "Fernanda Lima transferida para PV Alpha.", tipo: "evento", detalhe: { responsavel: "Carlos Oliveira", observacao: "Transferência aprovada pela diretoria.", acao: "Onboarding concluído em 5 dias." } },
      { data: "Fev 2020", icon: Store, color: "blue", titulo: "Abertura do PV Alpha", desc: "Assumiu como gestor e sócio do PV-1042.", tipo: "evento", detalhe: { responsavel: "Diretoria", observacao: "PV inaugurado com meta de 15 carteiras em 12 meses.", acao: "Operação iniciada." } },
      { data: "Jul 2019", icon: Trophy, color: "green", titulo: "Promoção para Autorizado 2.5", desc: "Metas consecutivas atingidas por 3 trimestres.", tipo: "promocao", detalhe: { responsavel: "Diretoria", observacao: "Cumpriu requisitos de faturamento e expansão.", acao: "Certificado emitido." } },
      { data: "Mar 2018", icon: Store, color: "blue", titulo: "Ingresso na rede", desc: "Vinculado à unidade SP-Centro como consultor.", tipo: "evento", detalhe: { responsavel: "João Silva", observacao: "Entrada como consultor nível inicial.", acao: "Meta: 8 carteiras em 12 meses." } },
    ],
  },
  C003: {
    id: "C003",
    nome: "Beatriz Souza",
    razaoSocial: "BS Investimentos Ltda",
    cnpj: "55.345.678/0001-03",
    matricula: "M-00103",
    nivel: "Autorizado 2.2",
    lojaPrincipal: { id: "L001", nome: "SP-Centro" },
    indicador: { id: "C002", nome: "Carlos Oliveira", razaoSocial: "Alpha Consórcios LTDA" },
    ingresso: "Ago 2021",
    status: "Ativo",
    dadosBasicos: {
      rg: "45.678.901-2",
      nascimento: "15/11/1990",
      email: "beatriz.souza@email.com",
      telefone: "(11) 99345-6789",
      endereco: "Rua Vergueiro, 3185 — Conj. 42",
      bairro: "Vila Mariana",
      cidade: "São Paulo",
      estado: "SP",
      cep: "04101-300",
    },
    vinculos: [
      { pv: "PV Vega (PV-1055)", pvId: "PV-1055", papel: "Gestor / Sócio", inicio: "Ago 2021", status: "Ativo" },
    ],
    visaoEconomica: {
      scoreInterno: 740,
      faturamentoConsolidado: 284000,
      totalCarteiras: 15,
      cnpjsVinculados: 1,
      meses: ["Jan/26", "Fev/26", "Mar/26", "Abr/26", "Mai/26", "Jun/26"],
      faturamentoSerie: [42000, 44000, 46000, 47000, 48000, 50000],
    },
    comissionamento: {
      nivelAtual: "Autorizado 2.2",
      pctAtual: 0.5,
      penalidades: [],
    },
    carteiras: [
      { id: "CRT-70", cliente: "Investe Mais LTDA", status: "Ativa", consultor: "BS Investimentos Ltda", pvMatricula: "M-20055", qtdClientes: 18, valor: 95100 },
      { id: "CRT-71", cliente: "Costa & Filhos", status: "Ativa", consultor: "BS Investimentos Ltda", pvMatricula: "M-20055", qtdClientes: 15, valor: 79200 },
    ],
    historico: [
      { data: "Mai 2026", icon: Flag, color: "green", titulo: "Meta mensal atingida", desc: "Faturamento acima de 100% da meta.", tipo: "evento", detalhe: { responsavel: "Beatriz Souza", observacao: "R$ 50.000 contra meta de R$ 45.000.", acao: "Bonificação aplicada." } },
      { data: "Mar 2026", icon: Handshake, color: "green", titulo: "Visita de acompanhamento", desc: "Avaliação de potencial para upgrade.", tipo: "visita", detalhe: { responsavel: "Roberto Almeida", observacao: "PV Vega com bom crescimento. Análise para 2.5 em Jun 2026.", acao: "Documentação de promoção preparada." } },
      { data: "Nov 2025", icon: ClipboardCheck, color: "gray", titulo: "Avaliação semestral", desc: "Score de 74/100. Bom desempenho.", tipo: "avaliacao", detalhe: { responsavel: "Roberto Almeida", observacao: "Carteira ainda pequena para o nível, mas crescimento consistente.", acao: "Meta de 20 carteiras até Jun 2026." } },
      { data: "Sep 2025", icon: RefreshCw, color: "blue", titulo: "Renovação de contrato", desc: "Contrato renovado por 24 meses.", tipo: "evento", detalhe: { responsavel: "Jurídico Ademicon", observacao: "Renovação sem reajuste.", acao: "Contrato assinado." } },
      { data: "Ago 2021", icon: Store, color: "blue", titulo: "Ingresso e abertura do PV Vega", desc: "Assumiu como gestora do PV-1055.", tipo: "evento", detalhe: { responsavel: "Diretoria", observacao: "Meta inicial: 10 carteiras em 12 meses.", acao: "Operação iniciada." } },
    ],
  },
};
