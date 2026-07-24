import { unidadesList } from "./unidades";
import { consultoresList } from "./consultores";

/**
 * Mock do módulo Prévias — PRD-05-Previas.md. Segue a spec detalhada do
 * PRD (Data Table + Tabs de status + Slider lateral) em vez do rótulo
 * "kanban" ainda presente em `sitemap.json`/`ordem-desenvolvimento.md`
 * (documentos mais antigos que o PRD-05 — ver MEMORY.md).
 */

export type PreviaTipo = "PF" | "PJ";

export type PreviaStatus = "Documental" | "Retificação" | "Jurídico" | "Aprovada" | "Reprovada";

/** Janela de credenciamento: 120 dias corridos a partir da abertura da prévia. */
export const LIMITE_DIAS_PROCESSO = 120;
/** A partir daqui o processo entra na zona de alerta (75% da janela). */
export const ALERTA_DIAS_PROCESSO = 90;

export type PrazoStatus = "no-prazo" | "alerta" | "estourado";

export interface PreviaIndicador {
  id: string;
  razaoSocial: string;
  matricula: string;
}

export interface PreviaItem {
  id: string;
  nome: string;
  tipo: PreviaTipo;
  documento: string;
  email: string;
  telefone: string;
  analista: string;
  unidadeId: string;
  unidadeNome: string;
  regional: string;
  dataCadastro: string;
  status: PreviaStatus;
  /** Dias corridos desde a abertura da prévia — limite de 120 dias. */
  diasProcesso: number;
  indicador: PreviaIndicador;
  matriculaAva: string | null;
  lojista: string;
  blacklist: boolean;
}

export const ANALISTAS = ["Katia Alves", "Gabriel Mendonça", "Luiza Fonseca", "Carlos Lima"] as const;

/** Cor por etapa da esteira (PRD-05 §3.3/§7), mesmo padrão de `TIPO_CONFIG` em ocorrencias.ts. */
export const STATUS_CONFIG: Record<PreviaStatus, { color: string; bg: string; border: string }> = {
  Documental: { color: "text-blue-600", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  "Retificação": { color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
  "Jurídico": { color: "text-violet-600", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  Aprovada: { color: "text-success", bg: "bg-success/10", border: "border-success/20" },
  Reprovada: { color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
};

/** Regional comercial por unidade — taxonomia própria do módulo (PRD-05 §3.4/§7), independente da macrorregião do Mapa de Vínculos. */
/** Descrição da etapa atual (rótulo mais específico que o nome do status, para header/sidebar/histórico da página de processo). */
export const STATUS_STAGE_LABEL: Record<PreviaStatus, string> = {
  Documental: "Assinatura de termo e envio de documentos",
  "Retificação": "Retificação de documentos pendente",
  "Jurídico": "Em análise jurídica",
  Aprovada: "Processo finalizado — credenciamento aprovado",
  Reprovada: "Prévia negada",
};

export const REGIONAL_POR_UNIDADE: Record<string, string> = {
  L001: "SP-Capital",
  L002: "SP-Interior",
  L003: "SUL-1",
  L004: "SE-2",
  L005: "SE-3",
  L006: "SUL-2",
  L007: "CO-1",
  L008: "NE-1",
};

export const REGIONAIS = Array.from(new Set(Object.values(REGIONAL_POR_UNIDADE))).sort();

/** Apenas consultores ativos podem indicar novos parceiros (PRD-05 §6, regra crítica). */
export const indicadoresDisponiveis: PreviaIndicador[] = consultoresList
  .filter((c) => c.status === "Ativo")
  .map((c) => ({ id: c.id, razaoSocial: c.razaoSocial, matricula: c.matricula }));

function unidadeNome(id: string): string {
  return unidadesList.find((u) => u.id === id)?.nome ?? id;
}

function indicador(id: string): PreviaIndicador {
  const found = indicadoresDisponiveis.find((i) => i.id === id);
  if (!found) throw new Error(`Indicador ${id} não encontrado ou inativo`);
  return found;
}

export function getPrazoStatus(diasProcesso: number): PrazoStatus {
  if (diasProcesso >= LIMITE_DIAS_PROCESSO) return "estourado";
  if (diasProcesso >= ALERTA_DIAS_PROCESSO) return "alerta";
  return "no-prazo";
}

export function formatDiasProcesso(diasProcesso: number): string {
  if (diasProcesso >= LIMITE_DIAS_PROCESSO) return `${diasProcesso}d — estourado`;
  return diasProcesso === 1 ? "1 dia" : `${diasProcesso} dias`;
}

/**
 * Escala de cor graduada (verde → âmbar → vermelho) proporcional aos dias
 * decorridos frente ao limite de 120 dias — usada no chip da tabela e no
 * indicador da página de processo. Retorna cores HSL prontas para uso
 * inline (`style`), não mapeáveis para os variants fixos de `Badge`.
 */
export function getDiasProcessoCor(diasProcesso: number): { text: string; bg: string } {
  const pct = Math.min(1, Math.max(0, diasProcesso / LIMITE_DIAS_PROCESSO));
  const hue = 142 - pct * 142; // 142 = verde (--success), 0 = vermelho (--destructive)
  return {
    text: `hsl(${hue.toFixed(0)}, 72%, 38%)`,
    bg: `hsl(${hue.toFixed(0)}, 80%, 94%)`,
  };
}

export const previasList: PreviaItem[] = [
  { id: "P001", nome: "Fernanda Costa Consultoria LTDA", tipo: "PJ", documento: "45.100.200/0001-99", email: "fernanda.costa@fcconsultoria.com.br", telefone: "(11) 98811-2233", analista: "Katia Alves", unidadeId: "L001", unidadeNome: unidadeNome("L001"), regional: REGIONAL_POR_UNIDADE.L001, dataCadastro: "2026-07-20", status: "Documental", diasProcesso: 107, indicador: indicador("C001"), matriculaAva: null, lojista: "ALPHA CONSULTORIA LTDA", blacklist: false },
  { id: "P002", nome: "Rodrigo Almeida Nascimento", tipo: "PF", documento: "384.221.560-10", email: "rodrigo.nascimento@gmail.com", telefone: "(11) 97722-1144", analista: "Gabriel Mendonça", unidadeId: "L001", unidadeNome: unidadeNome("L001"), regional: REGIONAL_POR_UNIDADE.L001, dataCadastro: "2026-07-22", status: "Documental", diasProcesso: 108, indicador: indicador("C002"), matriculaAva: null, lojista: "BETA FINANCIAMENTOS LTDA", blacklist: false },
  { id: "P003", nome: "Alpha Créditos Financeiros", tipo: "PJ", documento: "12.300.400/0001-08", email: "contato@alphacreditos.com.br", telefone: "(19) 98811-5566", analista: "Gabriel Mendonça", unidadeId: "L002", unidadeNome: unidadeNome("L002"), regional: REGIONAL_POR_UNIDADE.L002, dataCadastro: "2026-07-23", status: "Retificação", diasProcesso: 44, indicador: indicador("C009"), matriculaAva: null, lojista: "BETA FINANCIAMENTOS LTDA", blacklist: false },
  { id: "P004", nome: "Mariana Torres Vidal", tipo: "PF", documento: "221.334.980-55", email: "mariana.vidal@outlook.com", telefone: "(19) 99123-4455", analista: "Luiza Fonseca", unidadeId: "L002", unidadeNome: unidadeNome("L002"), regional: REGIONAL_POR_UNIDADE.L002, dataCadastro: "2026-07-19", status: "Retificação", diasProcesso: 45, indicador: indicador("C010"), matriculaAva: null, lojista: "CAMPINAS PARTICIPAÇÕES ME", blacklist: false },
  { id: "P005", nome: "Gamma Investimentos PJ", tipo: "PJ", documento: "99.888.777/0001-44", email: "financeiro@gammainvest.com.br", telefone: "(71) 98877-6655", analista: "Luiza Fonseca", unidadeId: "L008", unidadeNome: unidadeNome("L008"), regional: REGIONAL_POR_UNIDADE.L008, dataCadastro: "2026-07-15", status: "Jurídico", diasProcesso: 91, indicador: indicador("C003"), matriculaAva: null, lojista: "GAMMA HOLDING", blacklist: true },
  { id: "P006", nome: "Bruno Sales Figueiredo", tipo: "PF", documento: "556.712.340-22", email: "bruno.figueiredo@hotmail.com", telefone: "(71) 99001-2233", analista: "Carlos Lima", unidadeId: "L008", unidadeNome: unidadeNome("L008"), regional: REGIONAL_POR_UNIDADE.L008, dataCadastro: "2026-07-10", status: "Jurídico", diasProcesso: 92, indicador: indicador("C001"), matriculaAva: null, lojista: "NORDESTE CONSÓRCIOS LTDA", blacklist: false },
  { id: "P007", nome: "Delta Corretora de Consórcios", tipo: "PJ", documento: "33.221.100/0001-77", email: "atendimento@deltacorretora.com.br", telefone: "(41) 98123-4567", analista: "Katia Alves", unidadeId: "L003", unidadeNome: unidadeNome("L003"), regional: REGIONAL_POR_UNIDADE.L003, dataCadastro: "2026-06-28", status: "Aprovada", diasProcesso: 78, indicador: indicador("C011"), matriculaAva: "AVA-58231", lojista: "DELTA CORRETORA DE CONSÓRCIOS", blacklist: false },
  { id: "P008", nome: "Camila Ribeiro Duarte", tipo: "PF", documento: "112.998.765-40", email: "camila.duarte@gmail.com", telefone: "(41) 99234-5678", analista: "Katia Alves", unidadeId: "L003", unidadeNome: unidadeNome("L003"), regional: REGIONAL_POR_UNIDADE.L003, dataCadastro: "2026-06-25", status: "Aprovada", diasProcesso: 79, indicador: indicador("C011"), matriculaAva: "AVA-58244", lojista: "CURITIBA NORTE PARTICIPAÇÕES", blacklist: false },
  { id: "P009", nome: "Epsilon Assessoria de Crédito", tipo: "PJ", documento: "20.556.889/0001-31", email: "contato@epsilonassessoria.com.br", telefone: "(21) 98456-7788", analista: "Gabriel Mendonça", unidadeId: "L004", unidadeNome: unidadeNome("L004"), regional: REGIONAL_POR_UNIDADE.L004, dataCadastro: "2026-07-05", status: "Reprovada", diasProcesso: 112, indicador: indicador("C001"), matriculaAva: null, lojista: "EPSILON ASSESSORIA DE CRÉDITO", blacklist: true },
  { id: "P010", nome: "Thiago Barreto Xavier", tipo: "PF", documento: "334.556.712-88", email: "thiago.xavier@yahoo.com.br", telefone: "(21) 97345-6677", analista: "Gabriel Mendonça", unidadeId: "L004", unidadeNome: unidadeNome("L004"), regional: REGIONAL_POR_UNIDADE.L004, dataCadastro: "2026-07-08", status: "Reprovada", diasProcesso: 50, indicador: indicador("C002"), matriculaAva: null, lojista: "RJ CONSÓRCIOS PARTICIPAÇÕES", blacklist: false },
  { id: "P011", nome: "Zeta Corretora e Participações", tipo: "PJ", documento: "18.774.223/0001-05", email: "comercial@zetacorretora.com.br", telefone: "(31) 98776-5544", analista: "Luiza Fonseca", unidadeId: "L005", unidadeNome: unidadeNome("L005"), regional: REGIONAL_POR_UNIDADE.L005, dataCadastro: "2026-07-21", status: "Documental", diasProcesso: 5, indicador: indicador("C004"), matriculaAva: null, lojista: "ZETA CORRETORA E PARTICIPAÇÕES", blacklist: false },
  { id: "P012", nome: "Larissa Andrade Correia", tipo: "PF", documento: "667.889.100-33", email: "larissa.correia@gmail.com", telefone: "(31) 99887-6655", analista: "Luiza Fonseca", unidadeId: "L005", unidadeNome: unidadeNome("L005"), regional: REGIONAL_POR_UNIDADE.L005, dataCadastro: "2026-07-22", status: "Documental", diasProcesso: 6, indicador: indicador("C005"), matriculaAva: null, lojista: "MG PARCEIROS CONSÓRCIOS", blacklist: false },
  { id: "P013", nome: "Ômega Negócios e Participações", tipo: "PJ", documento: "27.665.410/0001-92", email: "adm@omeganegocios.com.br", telefone: "(51) 98234-1122", analista: "Carlos Lima", unidadeId: "L006", unidadeNome: unidadeNome("L006"), regional: REGIONAL_POR_UNIDADE.L006, dataCadastro: "2026-07-11", status: "Retificação", diasProcesso: 75, indicador: indicador("C006"), matriculaAva: null, lojista: "ÔMEGA NEGÓCIOS E PARTICIPAÇÕES", blacklist: false },
  { id: "P014", nome: "Patrícia Souza Meirelles", tipo: "PF", documento: "445.667.890-21", email: "patricia.meirelles@outlook.com", telefone: "(51) 99456-7890", analista: "Carlos Lima", unidadeId: "L006", unidadeNome: unidadeNome("L006"), regional: REGIONAL_POR_UNIDADE.L006, dataCadastro: "2026-07-14", status: "Retificação", diasProcesso: 76, indicador: indicador("C008"), matriculaAva: null, lojista: "RS CONSÓRCIOS PARTICIPAÇÕES", blacklist: false },
  { id: "P015", nome: "Sigma Corretora Financeira", tipo: "PJ", documento: "39.887.221/0001-60", email: "financeiro@sigmacorretora.com.br", telefone: "(11) 98123-9988", analista: "Katia Alves", unidadeId: "L001", unidadeNome: unidadeNome("L001"), regional: REGIONAL_POR_UNIDADE.L001, dataCadastro: "2026-07-17", status: "Jurídico", diasProcesso: 122, indicador: indicador("C003"), matriculaAva: null, lojista: "SIGMA CORRETORA FINANCEIRA", blacklist: false },
  { id: "P016", nome: "Eduardo Nogueira Prado", tipo: "PF", documento: "889.221.334-77", email: "eduardo.prado@gmail.com", telefone: "(11) 97998-2211", analista: "Katia Alves", unidadeId: "L001", unidadeNome: unidadeNome("L001"), regional: REGIONAL_POR_UNIDADE.L001, dataCadastro: "2026-07-12", status: "Jurídico", diasProcesso: 123, indicador: indicador("C004"), matriculaAva: null, lojista: "ALPHA CONSULTORIA LTDA", blacklist: false },
  { id: "P017", nome: "Theta Participações Societárias", tipo: "PJ", documento: "15.223.667/0001-18", email: "societario@thetapart.com.br", telefone: "(19) 98665-4433", analista: "Gabriel Mendonça", unidadeId: "L002", unidadeNome: unidadeNome("L002"), regional: REGIONAL_POR_UNIDADE.L002, dataCadastro: "2026-06-30", status: "Aprovada", diasProcesso: 38, indicador: indicador("C009"), matriculaAva: "AVA-58119", lojista: "THETA PARTICIPAÇÕES SOCIETÁRIAS", blacklist: false },
  { id: "P018", nome: "Vinícius Cardoso Teles", tipo: "PF", documento: "776.554.332-11", email: "vinicius.teles@gmail.com", telefone: "(19) 99223-3445", analista: "Gabriel Mendonça", unidadeId: "L002", unidadeNome: unidadeNome("L002"), regional: REGIONAL_POR_UNIDADE.L002, dataCadastro: "2026-07-01", status: "Aprovada", diasProcesso: 39, indicador: indicador("C010"), matriculaAva: "AVA-58127", lojista: "CAMPINAS PARTICIPAÇÕES ME", blacklist: false },
  { id: "P019", nome: "Iota Crédito e Investimentos", tipo: "PJ", documento: "44.556.778/0001-23", email: "contato@iotacredito.com.br", telefone: "(85) 98776-1122", analista: "Luiza Fonseca", unidadeId: "L008", unidadeNome: unidadeNome("L008"), regional: REGIONAL_POR_UNIDADE.L008, dataCadastro: "2026-07-18", status: "Documental", diasProcesso: 13, indicador: indicador("C001"), matriculaAva: null, lojista: "IOTA CRÉDITO E INVESTIMENTOS", blacklist: false },
  { id: "P020", nome: "Beatriz Lacerda Nunes", tipo: "PF", documento: "223.445.667-99", email: "beatriz.nunes@gmail.com", telefone: "(85) 99887-2233", analista: "Luiza Fonseca", unidadeId: "L008", unidadeNome: unidadeNome("L008"), regional: REGIONAL_POR_UNIDADE.L008, dataCadastro: "2026-07-24", status: "Documental", diasProcesso: 35, indicador: indicador("C003"), matriculaAva: null, lojista: "NORDESTE CONSÓRCIOS LTDA", blacklist: false },
  { id: "P021", nome: "Kappa Assessoria Empresarial", tipo: "PJ", documento: "51.223.899/0001-45", email: "adm@kappaassessoria.com.br", telefone: "(61) 98123-6677", analista: "Carlos Lima", unidadeId: "L007", unidadeNome: unidadeNome("L007"), regional: REGIONAL_POR_UNIDADE.L007, dataCadastro: "2026-07-09", status: "Retificação", diasProcesso: 104, indicador: indicador("C002"), matriculaAva: null, lojista: "KAPPA ASSESSORIA EMPRESARIAL", blacklist: false },
  { id: "P022", nome: "Henrique Vaz Monteiro", tipo: "PF", documento: "998.112.334-66", email: "henrique.monteiro@gmail.com", telefone: "(61) 99456-8899", analista: "Carlos Lima", unidadeId: "L007", unidadeNome: unidadeNome("L007"), regional: REGIONAL_POR_UNIDADE.L007, dataCadastro: "2026-07-16", status: "Retificação", diasProcesso: 105, indicador: indicador("C006"), matriculaAva: null, lojista: "DF PARTICIPAÇÕES CONSÓRCIOS", blacklist: false },
  { id: "P023", nome: "Lambda Corretora Nacional", tipo: "PJ", documento: "62.334.556/0001-89", email: "nacional@lambdacorretora.com.br", telefone: "(11) 98567-3322", analista: "Katia Alves", unidadeId: "L001", unidadeNome: unidadeNome("L001"), regional: REGIONAL_POR_UNIDADE.L001, dataCadastro: "2026-07-23", status: "Documental", diasProcesso: 38, indicador: indicador("C005"), matriculaAva: null, lojista: "LAMBDA CORRETORA NACIONAL", blacklist: false },
  { id: "P024", nome: "Renata Cavalcante Brito", tipo: "PF", documento: "556.223.887-10", email: "renata.brito@outlook.com", telefone: "(11) 97112-4488", analista: "Katia Alves", unidadeId: "L001", unidadeNome: unidadeNome("L001"), regional: REGIONAL_POR_UNIDADE.L001, dataCadastro: "2026-07-13", status: "Jurídico", diasProcesso: 46, indicador: indicador("C008"), matriculaAva: null, lojista: "ALPHA CONSULTORIA LTDA", blacklist: false },
  { id: "P025", nome: "Mu Investimentos e Participações", tipo: "PJ", documento: "71.445.223/0001-56", email: "financeiro@muinvest.com.br", telefone: "(19) 98123-7789", analista: "Gabriel Mendonça", unidadeId: "L002", unidadeNome: unidadeNome("L002"), regional: REGIONAL_POR_UNIDADE.L002, dataCadastro: "2026-07-02", status: "Reprovada", diasProcesso: 86, indicador: indicador("C009"), matriculaAva: null, lojista: "MU INVESTIMENTOS E PARTICIPAÇÕES", blacklist: false },
  { id: "P026", nome: "Otávio Ramos Guedes", tipo: "PF", documento: "334.998.112-55", email: "otavio.guedes@gmail.com", telefone: "(19) 99234-8899", analista: "Gabriel Mendonça", unidadeId: "L002", unidadeNome: unidadeNome("L002"), regional: REGIONAL_POR_UNIDADE.L002, dataCadastro: "2026-06-26", status: "Reprovada", diasProcesso: 87, indicador: indicador("C010"), matriculaAva: null, lojista: "CAMPINAS PARTICIPAÇÕES ME", blacklist: true },
  { id: "P027", nome: "Nu Corretora de Seguros e Consórcios", tipo: "PJ", documento: "84.223.667/0001-90", email: "contato@nucorretora.com.br", telefone: "(41) 98776-4455", analista: "Luiza Fonseca", unidadeId: "L003", unidadeNome: unidadeNome("L003"), regional: REGIONAL_POR_UNIDADE.L003, dataCadastro: "2026-07-06", status: "Aprovada", diasProcesso: 69, indicador: indicador("C011"), matriculaAva: "AVA-58098", lojista: "NU CORRETORA DE SEGUROS", blacklist: false },
  { id: "P028", nome: "Isabela Fontoura Ramalho", tipo: "PF", documento: "112.556.998-30", email: "isabela.ramalho@gmail.com", telefone: "(41) 99667-1122", analista: "Luiza Fonseca", unidadeId: "L003", unidadeNome: unidadeNome("L003"), regional: REGIONAL_POR_UNIDADE.L003, dataCadastro: "2026-06-29", status: "Aprovada", diasProcesso: 70, indicador: indicador("C011"), matriculaAva: "AVA-58076", lojista: "CURITIBA NORTE PARTICIPAÇÕES", blacklist: false },
  { id: "P029", nome: "Xi Holding Financeira", tipo: "PJ", documento: "29.887.556/0001-11", email: "holding@xifinanceira.com.br", telefone: "(31) 98445-6677", analista: "Carlos Lima", unidadeId: "L005", unidadeNome: unidadeNome("L005"), regional: REGIONAL_POR_UNIDADE.L005, dataCadastro: "2026-07-20", status: "Documental", diasProcesso: 44, indicador: indicador("C004"), matriculaAva: null, lojista: "XI HOLDING FINANCEIRA", blacklist: false },
  { id: "P030", nome: "Gustavo Peixoto Amaral", tipo: "PF", documento: "667.223.445-88", email: "gustavo.amaral@gmail.com", telefone: "(31) 99112-3344", analista: "Carlos Lima", unidadeId: "L005", unidadeNome: unidadeNome("L005"), regional: REGIONAL_POR_UNIDADE.L005, dataCadastro: "2026-07-04", status: "Jurídico", diasProcesso: 73, indicador: indicador("C005"), matriculaAva: null, lojista: "MG PARCEIROS CONSÓRCIOS", blacklist: false },
  { id: "P031", nome: "Ômicron Corretora Digital", tipo: "PJ", documento: "36.445.889/0001-77", email: "digital@omicroncorretora.com.br", telefone: "(51) 98234-9911", analista: "Katia Alves", unidadeId: "L006", unidadeNome: unidadeNome("L006"), regional: REGIONAL_POR_UNIDADE.L006, dataCadastro: "2026-07-21", status: "Retificação", diasProcesso: 135, indicador: indicador("C006"), matriculaAva: null, lojista: "ÔMEGA NEGÓCIOS E PARTICIPAÇÕES", blacklist: false },
  { id: "P032", nome: "Sabrina Correia Wagner", tipo: "PF", documento: "223.998.556-44", email: "sabrina.wagner@outlook.com", telefone: "(51) 99223-6677", analista: "Katia Alves", unidadeId: "L006", unidadeNome: unidadeNome("L006"), regional: REGIONAL_POR_UNIDADE.L006, dataCadastro: "2026-07-07", status: "Documental", diasProcesso: 68, indicador: indicador("C008"), matriculaAva: null, lojista: "RS CONSÓRCIOS PARTICIPAÇÕES", blacklist: false },
];

export function getPrevia(id: string): PreviaItem | undefined {
  return previasList.find((p) => p.id === id);
}

// --------------- Detalhe do processo (página /previas/:id) ---------------
// Derivado deterministicamente de cada PreviaItem — mesma técnica de arrays
// paralelos indexados usada no protótipo de referência (PRD/prototipo-base.html,
// funções sidebarHtml/dadosTab/docsTab/histTab), reimplementada como função pura
// em vez de dado bruto duplicado por registro.

export interface DocumentoAnalise {
  nome: string;
  status: "conforme" | "nao-conforme" | "analisando";
  analiseIA: string;
  confianca: number | null;
}

export interface ConsultaAutomatica {
  plataforma: string;
  status: "ok" | "alerta";
}

export type EventoCor = "gray" | "blue" | "amber" | "violet" | "green" | "red";

export interface EventoHistoricoProcesso {
  data: string;
  responsavel: string;
  statusLabel: string;
  cor: EventoCor;
  desc: string;
}

export interface ProcessoDetalhe {
  dadosPessoais: {
    rg: string;
    orgaoEmissor: string;
    nascimento: string;
    nacionalidade: string;
    profissao: string;
    cidadeNascimento: string;
    estadoNascimento: string;
    estadoCivil: string;
    conjuge: string;
    telefoneFixo: string;
  };
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    referencia: string;
    cidade: string;
    estado: string;
  };
  atuacao: {
    bu: string;
    idPessoaPJ: string | null;
    idPessoaSocio: string | null;
    situacaoNewcon: "Sem Cadastro" | "Cadastrado";
  };
  documentos: DocumentoAnalise[];
  consultas: ConsultaAutomatica[];
  historico: EventoHistoricoProcesso[];
}

const RG_POOL = ["40.936.565-8", "32.114.905-1", "28.774.330-2", "44.902.117-5", "19.556.884-0", "51.223.907-4", "63.118.550-7", "15.778.394-6", "26.881.005-3", "37.992.116-8"];
const UF_NASC_POOL = ["SP", "BA", "MT", "SP", "PE", "CE", "GO", "PA", "AM", "RN"];
const CIDADE_NASC_POOL = ["Cosmópolis", "Salvador", "Campo Verde", "São Paulo", "Recife", "Fortaleza", "Goiânia", "Belém", "Manaus", "Natal"];
const NASCIMENTO_POOL = ["04/07/1995", "25/07/1985", "03/11/1994", "18/02/1988", "30/09/1992", "07/05/1983", "21/12/1996", "14/08/1991", "09/06/1987", "27/01/1993"];
const PROFISSAO_POOL = ["Consultor(a) de Vendas", "Corretor(a) de Seguros", "Empresário(a)", "Analista Comercial", "Representante Comercial"];
const ESTADO_CIVIL_POOL = ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "União estável", "Solteiro(a)"];
const CONJUGE_POOL = ["Roberta Nunes", "Marcos Alves", "Helena Dias", "Fábio Ramos"];
const LOGRADOURO_POOL = ["Rua das Palmeiras", "Av. Sete de Setembro", "Rua Projetada A", "Av. Paulista", "Rua do Sol", "Av. Beira-Mar", "Rua 24 de Outubro", "Av. Nazaré", "Rua Eduardo Ribeiro", "Av. Rio Branco"];
const NUMERO_POOL = ["245", "1020", "57", "1578", "330", "900", "412", "210", "688", "145"];
const REFERENCIA_POOL = ["Próx. à praça central", "Ao lado do mercado", "Em frente à escola", "Esq. c/ a rua principal", "Próx. ao shopping", "Ao lado do posto", "Próx. à rodoviária", "Em frente ao banco", "Próx. à igreja", "Ao lado da farmácia"];
const CEP_POOL = ["13140-000", "40010-000", "78840-000", "01310-100", "50010-000", "60110-000", "74000-000", "66010-000", "69005-000", "59010-000"];
const TELEFONE_FIXO_LOCAL_POOL = ["3324-1762", "3255-0091", "3611-7845", "3901-2233", "3444-7788", "3277-1120", "3355-9080", "3220-4411", "3600-7766", "3210-9933"];

const STATUS_HISTORICO_COR: Record<PreviaStatus, EventoCor> = {
  Documental: "blue",
  "Retificação": "amber",
  "Jurídico": "violet",
  Aprovada: "green",
  Reprovada: "red",
};

function pick<T>(pool: T[], idx: number): T {
  return pool[idx % pool.length];
}

/** Data de referência do protótipo — mantém o histórico do processo sempre no passado/presente, nunca no futuro. */
const HOJE_ISO = "2026-07-24";

function addDias(dataIso: string, dias: number): string {
  const d = new Date(dataIso);
  d.setDate(d.getDate() + dias);
  return d.toLocaleDateString("pt-BR");
}

function addDiasIso(dataIso: string, dias: number): string {
  const d = new Date(dataIso);
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

/** Data de abertura real da prévia — derivada de `diasProcesso` (hoje − diasProcesso), não de `dataCadastro` (que é apenas ilustrativo). */
export function getDataAbertura(p: PreviaItem): string {
  return addDiasIso(HOJE_ISO, -p.diasProcesso);
}

function docsPorStatus(status: PreviaStatus): DocumentoAnalise[] {
  if (status === "Aprovada") {
    return [
      { nome: "RG/CNH", status: "conforme", analiseIA: "Dados legíveis e compatíveis com o cadastro.", confianca: 99 },
      { nome: "CPF", status: "conforme", analiseIA: "CPF válido e conferido na Receita.", confianca: 100 },
      { nome: "Comprovante de Endereço", status: "conforme", analiseIA: "Endereço confere com o cadastro.", confianca: 97 },
      { nome: "Documentos Complementares", status: "conforme", analiseIA: "Documentação completa e válida.", confianca: 95 },
    ];
  }
  if (status === "Retificação" || status === "Reprovada") {
    return [
      { nome: "RG/CNH", status: "conforme", analiseIA: "Dados legíveis e compatíveis.", confianca: 98 },
      { nome: "CPF", status: "conforme", analiseIA: "CPF válido e conferido.", confianca: 100 },
      { nome: "Comprovante de Endereço", status: "nao-conforme", analiseIA: "Comprovante fora do padrão aceito (água, luz, gás, telefone/internet em nome do candidato ou parente de 1º grau).", confianca: 88 },
      { nome: "Documentos Complementares", status: "nao-conforme", analiseIA: "Documento ilegível ou com dados divergentes do cadastro — reenvio solicitado.", confianca: 82 },
    ];
  }
  if (status === "Jurídico") {
    return [
      { nome: "RG/CNH", status: "conforme", analiseIA: "Aprovado pela IA.", confianca: 99 },
      { nome: "CPF", status: "conforme", analiseIA: "Aprovado pela IA.", confianca: 100 },
      { nome: "Comprovante de Endereço", status: "conforme", analiseIA: "Aprovado pela IA.", confianca: 96 },
      { nome: "Documentos Complementares", status: "analisando", analiseIA: "IA processando o documento…", confianca: null },
    ];
  }
  return [
    { nome: "RG/CNH", status: "analisando", analiseIA: "IA analisando o documento…", confianca: null },
    { nome: "CPF", status: "analisando", analiseIA: "IA analisando o documento…", confianca: null },
    { nome: "Comprovante de Endereço", status: "analisando", analiseIA: "Aguardando envio para análise.", confianca: null },
    { nome: "Documentos Complementares", status: "analisando", analiseIA: "Aguardando envio para análise.", confianca: null },
  ];
}

function consultasPorStatus(status: PreviaStatus): ConsultaAutomatica[] {
  return [
    { plataforma: "CNJ", status: "ok" },
    { plataforma: "CNDT", status: "ok" },
    { plataforma: "Google", status: "ok" },
    { plataforma: "Serasa", status: status === "Documental" ? "alerta" : "ok" },
  ];
}

function historicoPorPrevia(p: PreviaItem): EventoHistoricoProcesso[] {
  const abertura = getDataAbertura(p);
  const stageLabel = STATUS_STAGE_LABEL[p.status];
  const clamp = (dias: number) => Math.min(dias, p.diasProcesso);
  return [
    { data: addDias(abertura, 0), responsavel: "Automação", statusLabel: "Prévia aberta", cor: "gray", desc: "Ficha do candidato lançada — abertura da janela de 120 dias." },
    { data: addDias(abertura, clamp(1)), responsavel: p.nome, statusLabel: "Documentos enviados", cor: "blue", desc: "Documentos enviados pelo candidato para análise." },
    { data: addDias(abertura, clamp(2)), responsavel: p.analista, statusLabel: "Em análise", cor: "violet", desc: "Documentação em conferência pela validação automática de IA." },
    { data: addDias(abertura, clamp(3)), responsavel: "Automação", statusLabel: "Matricular UCA", cor: "amber", desc: "Candidato matriculado na Universidade Corporativa Ademicon (13 módulos)." },
    {
      data: addDias(abertura, p.diasProcesso),
      responsavel: "Sistema",
      statusLabel: stageLabel,
      cor: STATUS_HISTORICO_COR[p.status],
      desc: `Status atual do processo: ${stageLabel}.`,
    },
  ];
}

/** Deriva todo o conteúdo da página de processo a partir de um `PreviaItem`. */
export function getProcessoDetalhe(p: PreviaItem): ProcessoDetalhe {
  const idx = Math.max(0, previasList.findIndex((x) => x.id === p.id));
  const unidade = unidadesList.find((u) => u.id === p.unidadeId);
  const estadoCivil = pick(ESTADO_CIVIL_POOL, idx);
  const dddMatch = p.telefone.match(/\(\d{2}\)/);
  const ddd = dddMatch ? dddMatch[0] : "(11)";

  return {
    dadosPessoais: {
      rg: pick(RG_POOL, idx),
      orgaoEmissor: `SSP/${pick(UF_NASC_POOL, idx)}`,
      nascimento: pick(NASCIMENTO_POOL, idx),
      nacionalidade: "Brasileiro(a)",
      profissao: pick(PROFISSAO_POOL, idx),
      cidadeNascimento: pick(CIDADE_NASC_POOL, idx),
      estadoNascimento: pick(UF_NASC_POOL, idx),
      estadoCivil,
      conjuge: estadoCivil === "Casado(a)" || estadoCivil === "União estável" ? pick(CONJUGE_POOL, idx) : "—",
      telefoneFixo: `${ddd} ${pick(TELEFONE_FIXO_LOCAL_POOL, idx)}`,
    },
    endereco: {
      cep: pick(CEP_POOL, idx),
      logradouro: pick(LOGRADOURO_POOL, idx),
      numero: pick(NUMERO_POOL, idx),
      referencia: pick(REFERENCIA_POOL, idx),
      cidade: unidade?.cidade ?? p.unidadeNome,
      estado: unidade?.estado ?? "SP",
    },
    atuacao: {
      bu: `BU${(idx % 4) + 1}`,
      idPessoaPJ: p.tipo === "PJ" ? `PJ-${1000 + idx}` : null,
      idPessoaSocio: p.tipo === "PJ" ? `SO-${2000 + idx}` : null,
      situacaoNewcon: idx % 4 === 0 ? "Cadastrado" : "Sem Cadastro",
    },
    documentos: docsPorStatus(p.status),
    consultas: consultasPorStatus(p.status),
    historico: historicoPorPrevia(p),
  };
}
