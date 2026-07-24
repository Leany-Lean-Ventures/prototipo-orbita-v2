import { Clock, AlertTriangle, Users, ShieldAlert, RefreshCw, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface FiltroRelatorio {
  name: string;
  label: string;
  type: "select" | "autocomplete" | "checkbox";
  options?: string[];
}

export interface TipoRelatorio {
  id: string;
  titulo: string;
  icon: LucideIcon;
  desc: string;
  color: string;
  filtros: FiltroRelatorio[];
}

export interface ResultadoRelatorio {
  colunas: string[];
  dados: string[][];
}

// --------------- Report types ---------------

export const tiposRelatorio: TipoRelatorio[] = [
  {
    id: "R01",
    titulo: "Consultores Inativos",
    icon: Clock,
    desc: "Consultores sem vendas, agrupados por tempo de inatividade.",
    color: "#f59e0b",
    filtros: [
      { name: "tempo", label: "Tempo de inatividade", type: "select", options: ["+3 meses", "+6 meses", "+12 meses"] },
      { name: "nivel", label: "Nível", type: "select", options: ["Todos", "Consultor", "Autorizado 2.0", "Autorizado 2.2", "Autorizado 2.5"] },
      { name: "regional", label: "Regional", type: "select", options: ["Todas", "Sul", "Sudeste", "Nordeste", "Centro-Oeste"] },
    ],
  },
  {
    id: "R02",
    titulo: "Carteiras Órfãs",
    icon: AlertTriangle,
    desc: "Carteiras sem consultor responsável vinculado.",
    color: "#dc2626",
    filtros: [
      { name: "unidade", label: "Unidade", type: "select", options: ["Todas", "SP-Centro", "Campinas", "Curitiba-Norte", "RJ-Barra"] },
      { name: "faixa", label: "Faixa de Faturamento", type: "select", options: ["Todas", "Até R$ 10k", "R$ 10k–50k", "Acima de R$ 50k"] },
    ],
  },
  {
    id: "R03",
    titulo: "Visão de Grupo Econômico",
    icon: Users,
    desc: "Consolidação de faturamento e estrutura por CPF.",
    color: "#6366f1",
    filtros: [
      { name: "filtro", label: "Filtro", type: "select", options: ["Top 10 maiores grupos", "CPF específico"] },
    ],
  },
  {
    id: "R04",
    titulo: "Penalidades Ativas",
    icon: ShieldAlert,
    desc: "Lista de descontos e penalidades vigentes na rede.",
    color: "#8b5cf6",
    filtros: [
      { name: "unidade", label: "Unidade", type: "select", options: ["Todas", "SP-Centro", "Campinas", "Curitiba-Norte", "RJ-Barra"] },
      { name: "tipo", label: "Tipo de Penalidade", type: "select", options: ["Todos", "Comunicação visual", "SLA vencido", "Conduta irregular"] },
    ],
  },
  {
    id: "R05",
    titulo: "Histórico de Mobilidade",
    icon: RefreshCw,
    desc: "Registro de transferências e promoções de consultores.",
    color: "#0ea5e9",
    filtros: [
      { name: "periodo", label: "Período", type: "select", options: ["Último mês", "Últimos 3 meses", "Últimos 6 meses", "Último ano"] },
      { name: "regional", label: "Regional", type: "select", options: ["Todas", "Sul", "Sudeste", "Nordeste", "Centro-Oeste"] },
    ],
  },
  {
    id: "R06",
    titulo: "Relatório de Visitas (Alcance)",
    icon: MapPin,
    desc: "Cobertura de visitas e relatórios de campo.",
    color: "#16a34a",
    filtros: [
      { name: "periodo", label: "Período", type: "select", options: ["Último mês", "Últimos 3 meses", "Últimos 6 meses", "Último ano"] },
      { name: "gestor", label: "Gestor BU", type: "select", options: ["Todos", "Roberto Almeida", "Equipe de Auditoria"] },
      { name: "privadas", label: "Incluir anotações privadas", type: "checkbox" },
    ],
  },
];

// --------------- Mock results ---------------

export const mockResultados: Record<string, ResultadoRelatorio> = {
  R01: {
    colunas: ["Consultor", "Matrícula", "Nível", "Unidade", "Última Venda", "Tempo Inativo"],
    dados: [
      ["Juliana Mendes", "M-00107", "Consultor", "SP-Centro", "15/03/2026", "4 meses"],
      ["Pedro Costa", "M-00112", "Autorizado 2.0", "Curitiba-Norte", "10/01/2026", "6 meses"],
      ["Ana Lima", "M-00422", "Autorizado 2.2", "Campinas", "20/02/2026", "5 meses"],
      ["Marcos Tavares", "M-00315", "Consultor", "RJ-Barra", "05/12/2025", "7 meses"],
      ["Patrícia Fonseca", "M-00289", "Consultor", "Porto Alegre-Moinhos", "18/04/2026", "3 meses"],
    ],
  },
  R02: {
    colunas: ["ID Carteira", "Cliente", "Unidade", "Faturamento Médio", "Órfã Desde"],
    dados: [
      ["CRT-02", "Cliente Y", "SP-Centro", "R$ 12.500", "01/05/2026"],
      ["CRT-22", "Patrimônio Seguro", "SP-Centro", "R$ 8.200", "15/04/2026"],
      ["CRT-31", "Comércio Araucária", "Curitiba-Norte", "R$ 6.800", "10/03/2026"],
      ["CRT-11", "Cliente W", "SP-Centro", "R$ 15.000", "22/02/2026"],
    ],
  },
  R03: {
    colunas: ["CPF (Dono)", "Nome", "CNPJs", "Faturamento Total", "Carteiras", "Score"],
    dados: [
      ["***.567.890-**", "Carlos Oliveira", "2", "R$ 512.000", "40", "920"],
      ["***.678.901-**", "Beatriz Souza", "1", "R$ 284.000", "15", "740"],
      ["***.456.789-**", "Maria Santos", "1", "R$ 198.500", "22", "780"],
      ["***.234.567-**", "Camila Rocha", "2", "R$ 176.000", "16", "710"],
      ["***.789.012-**", "Diego Farias", "1", "R$ 108.000", "12", "680"],
    ],
  },
  R04: {
    colunas: ["Unidade", "Motivo", "Desconto", "Vigência Até", "Status"],
    dados: [
      ["SP-Centro", "Comunicação visual desatualizada", "-1,5%", "Dez 2026", "Ativa"],
      ["SP-Centro", "Atraso reincidente em relatório", "-0,5%", "Set 2026", "Ativa"],
      ["Curitiba-Norte", "SLA de prévia vencido reincidente", "-1,0%", "Set 2026", "Ativa"],
      ["RJ-Barra", "Mudança societária não comunicada", "-2,0%", "Ago 2026", "Ativa"],
      ["RJ-Barra", "Comunicação visual desatualizada", "-1,0%", "Ago 2026", "Ativa"],
      ["BH-Savassi", "Prévias com SLA vencido", "-1,5%", "Out 2026", "Ativa"],
    ],
  },
  R05: {
    colunas: ["Consultor", "Tipo", "De", "Para", "Data"],
    dados: [
      ["Fernanda Lima", "Transferência", "PV Vega", "PV Alpha", "Mar 2026"],
      ["Diego Farias", "Promoção", "Autorizado 2.0", "Autorizado 2.0 (Gestor)", "Mar 2022"],
      ["Carlos Oliveira", "Promoção", "Consultor", "Autorizado 2.5", "Jul 2019"],
      ["Beatriz Souza", "Abertura de PV", "—", "PV Vega (Gestora)", "Ago 2021"],
      ["Renata Lopes", "Promoção", "Autorizado 2.2", "Autorizado 2.5", "Jul 2025"],
    ],
  },
  R06: {
    colunas: ["Data", "Unidade/PV", "Tipo", "Responsável", "Status", "Ocorrência"],
    dados: [
      ["28/07/2026", "SP-Centro (L001)", "Comercial", "Roberto Almeida", "Agendada", "—"],
      ["25/07/2026", "Campinas (L002)", "Auditoria", "Roberto Almeida", "Agendada", "—"],
      ["20/07/2026", "PV Alpha (PV-1042)", "Comercial", "Roberto Almeida", "Realizada", "OCC-003"],
      ["15/07/2026", "PV Vega (PV-1055)", "Estruturação", "Roberto Almeida", "Realizada", "—"],
      ["10/07/2026", "Curitiba-Norte (L003)", "Auditoria", "Equipe de Auditoria", "Realizada", "OCC-009"],
      ["05/07/2026", "SP-Centro (L001)", "Avaliação 360", "Roberto Almeida", "Realizada", "—"],
    ],
  },
};
