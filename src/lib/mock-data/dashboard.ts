/**
 * Mock do Dashboard — schema e dados de PRD/PRD-01-Dashboard.md §3.
 * `alertas` não é duplicado aqui — reaproveita src/lib/mock-data/alerts.ts,
 * a mesma fonte usada pelo AlertsPanel do header (ver MEMORY.md).
 *
 * `evolucaoSerie` não vem do PRD (a seção 2 não especifica um gráfico,
 * só o subtítulo menciona "evolução") — mock adicional para o card de
 * evolução com ApexCharts, decisão registrada em MEMORY.md.
 */

export type KpiColorTheme = "maroon" | "green" | "amber" | "violet" | "red";

export interface Kpi {
  id: string;
  label: string;
  icon: string;
  colorTheme: KpiColorTheme;
  value: number;
  goalText: string;
  progressPct: number;
  route: string;
  isAlert: boolean;
}

export interface DashboardOcorrencia {
  id: string;
  tipo: string;
  colorTheme: "red" | "green" | "violet" | "amber" | "blue";
  icon: string;
  titulo: string;
  unidade: string;
  pessoa: string;
  tempo: string;
  status: "Aberto" | "Em andamento" | "Resolvido";
}

export const resumoExecutivo = {
  mesAno: "Junho/2026",
  unidadesAtivas: 312,
  novasUnidades: 8,
  alertasCriticos: 23,
  slaPrevias: 2.1,
  metaPrevias: 3,
};

export const kpis: Kpi[] = [
  {
    id: "k1",
    label: "Lojas ativas",
    icon: "🏪",
    colorTheme: "maroon",
    value: 312,
    goalText: "meta 320",
    progressPct: 98,
    route: "/unidades",
    isAlert: false,
  },
  {
    id: "k2",
    label: "Consultores",
    icon: "👥",
    colorTheme: "green",
    value: 8420,
    goalText: "▲ +142 mês",
    progressPct: 82,
    route: "/consultores",
    isAlert: false,
  },
  {
    id: "k3",
    label: "Em prévia",
    icon: "📋",
    colorTheme: "amber",
    value: 1847,
    goalText: "SLA 2,1d · meta 3d",
    progressPct: 70,
    route: "/previas",
    isAlert: false,
  },
  {
    id: "k4",
    label: "CNPJs",
    icon: "🏢",
    colorTheme: "violet",
    value: 7103,
    goalText: "▲ +34 mês",
    progressPct: 60,
    route: "/consultores",
    isAlert: false,
  },
  {
    id: "k5",
    label: "Alertas críticos",
    icon: "⚠️",
    colorTheme: "red",
    value: 23,
    goalText: "requer ação",
    progressPct: 40,
    route: "/alertas",
    isAlert: true,
  },
];

export const ocorrenciasRecentes: DashboardOcorrencia[] = [
  {
    id: "o1",
    tipo: "Conflito",
    colorTheme: "red",
    icon: "⚠️",
    titulo: "Disputa de território entre lojas",
    unidade: "Unidade SP-Centro",
    pessoa: "Ana Lima",
    tempo: "há 2h",
    status: "Aberto",
  },
  {
    id: "o2",
    tipo: "Visita",
    colorTheme: "green",
    icon: "🤝",
    titulo: "Visita técnica de acompanhamento",
    unidade: "Unidade Campinas",
    pessoa: "Pedro Costa",
    tempo: "há 5h",
    status: "Resolvido",
  },
  {
    id: "o3",
    tipo: "Penalidade",
    colorTheme: "violet",
    icon: "🚩",
    titulo: "Mudança societária não comunicada",
    unidade: "Unidade Brasília",
    pessoa: "Roberto Alves",
    tempo: "há 3d",
    status: "Aberto",
  },
];

export const evolucaoSerie = {
  meses: ["Jan/26", "Fev/26", "Mar/26", "Abr/26", "Mai/26", "Jun/26"],
  faturamentoMilhoes: [58.2, 61.4, 63.8, 67.1, 70.5, 74.2],
  vendas: [980, 1050, 1120, 1180, 1240, 1310],
};
