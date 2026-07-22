/**
 * Mock de alertas — schema em PRD/data-schema.json (Alert), dados de
 * PRD/PRD-01-Dashboard.md §3 (conjunto de 4, mais completo que o exemplo
 * de PRD-00 §6). Compartilhado entre o painel de alertas do header e,
 * na etapa 3, o card "Alertas que exigem ação" do Dashboard.
 */
export type AlertColorTheme = "red" | "amber" | "gray" | "green" | "blue" | "violet";

export interface Alert {
  id: string;
  icon: string;
  colorTheme: AlertColorTheme;
  label: string;
  count: number;
  actionRoute: string;
}

export const alerts: Alert[] = [
  {
    id: "a1",
    icon: "⏱",
    colorTheme: "red",
    label: "Consultores em 4 meses sem venda",
    count: 12,
    actionRoute: "/consultores?filter=inativos",
  },
  {
    id: "a2",
    icon: "🔄",
    colorTheme: "amber",
    label: "Mudança societária não comunicada",
    count: 3,
    actionRoute: "/unidades",
  },
  {
    id: "a3",
    icon: "📋",
    colorTheme: "amber",
    label: "Prévias com SLA vencido",
    count: 5,
    actionRoute: "/previas",
  },
  {
    id: "a4",
    icon: "📍",
    colorTheme: "gray",
    label: "Lojas sem visita há +180 dias",
    count: 18,
    actionRoute: "/visitas",
  },
];
