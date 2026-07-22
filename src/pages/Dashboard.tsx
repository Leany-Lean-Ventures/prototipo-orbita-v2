import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { useAlertsPanel } from "@/lib/alerts-panel-context";
import { EASE_SIGNATURE } from "@/lib/motion";
import { alerts } from "@/lib/mock-data/alerts";
import {
  kpis,
  ocorrenciasRecentes,
  resumoExecutivo,
  type DashboardOcorrencia,
} from "@/lib/mock-data/dashboard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { EvolutionChart } from "@/components/dashboard/EvolutionChart";

const OCORRENCIA_BORDER: Record<DashboardOcorrencia["colorTheme"], string> = {
  red: "border-destructive",
  green: "border-success",
  violet: "border-violet-500",
  amber: "border-warning",
  blue: "border-info",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { open: openAlertsPanel } = useAlertsPanel();

  // Timeline única, total < 1s (design-system §7.2) — overlaps agressivos
  // porque a página tem 5 grupos (header, resumo, 5 KPIs, gráfico, 2 listas).
  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".dashboard-header", vars: { y: -16, opacity: 0, duration: 0.35 } },
    {
      selector: ".dashboard-resumo",
      vars: { y: 16, opacity: 0, duration: 0.3 },
      position: "-=0.2",
    },
    {
      selector: ".kpi-card",
      vars: {
        y: 16,
        opacity: 0,
        scale: 0.97,
        duration: 0.35,
        stagger: { each: 0.045, from: "start" },
        ease: EASE_SIGNATURE,
      },
      position: "-=0.15",
    },
    {
      selector: ".evolution-chart",
      vars: { y: 16, opacity: 0, duration: 0.35 },
      position: "-=0.25",
    },
    {
      selector: ".dashboard-lists",
      vars: { y: 16, opacity: 0, duration: 0.35, stagger: 0.06 },
      position: "-=0.25",
    },
  ]);

  const handleKpiClick = (kpi: (typeof kpis)[number]) => {
    if (kpi.isAlert) {
      openAlertsPanel();
      return;
    }
    navigate(kpi.route);
  };

  return (
    <div ref={entranceRef} className="space-y-6">
      <div className="dashboard-header flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Visão geral da rede — KPIs, evolução, alertas e ocorrências.
          </p>
        </div>
        <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
          🟢 Atualizado há 2h · fonte: Data Lake (Gold)
        </Badge>
      </div>

      <div className="dashboard-resumo rounded-card border-l-4 border-primary bg-gradient-to-r from-primary/5 to-transparent p-6 shadow-soft">
        <p className="text-sm leading-relaxed text-foreground">
          📊 A rede conta com{" "}
          <strong className="font-semibold">
            {resumoExecutivo.unidadesAtivas} unidades ativas
          </strong>
          ;{" "}
          <span className="font-semibold text-success">
            {resumoExecutivo.novasUnidades} novas
          </span>{" "}
          inauguradas no mês.{" "}
          <span className="font-semibold text-destructive">
            {resumoExecutivo.alertasCriticos} alertas críticos
          </span>{" "}
          exigem atenção.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} onClick={() => handleKpiClick(kpi)} />
        ))}
      </div>

      <EvolutionChart />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="dashboard-lists p-6">
          <h3 className="mb-4 font-display text-base font-bold text-foreground">
            Alertas que exigem ação
          </h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-lg"
                  aria-hidden="true"
                >
                  {alert.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {alert.label}
                  </p>
                </div>
                <span className="font-display text-lg font-bold text-foreground">
                  {alert.count}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(alert.actionRoute)}
                >
                  Resolver
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="dashboard-lists p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-foreground">
              Últimas Ocorrências
            </h3>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs uppercase"
              onClick={() => navigate("/ocorrencias")}
            >
              Ver todas
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-3">
            {ocorrenciasRecentes.map((occ) => (
              <div
                key={occ.id}
                className={`flex items-start gap-3 border-l-4 py-1 pl-3 ${OCORRENCIA_BORDER[occ.colorTheme]}`}
              >
                <span className="text-lg" aria-hidden="true">
                  {occ.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {occ.titulo}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {occ.unidade} · {occ.pessoa}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Badge
                    variant={occ.status === "Resolvido" ? "success" : "destructive"}
                    className="text-[10px]"
                  >
                    {occ.status}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {occ.tempo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
