import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import {
  BarChart3, CircleCheck, ChevronRight, TriangleAlert, ShieldAlert,
  ClipboardList, UserCog, Building2, AlertTriangle,
} from "lucide-react";

import { usePageEntrance } from "@/hooks/use-page-entrance";
import { useAlertsPanel } from "@/lib/alerts-panel-context";
import { EASE_SIGNATURE } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/motion";
import { kpis } from "@/lib/mock-data/dashboard";
import { ocorrenciasList } from "@/lib/mock-data/ocorrencias";
import { registrosAberturaUnidades } from "@/lib/mock-data/esteira-abertura-unidades";
import { registrosPromocaoConsultores } from "@/lib/mock-data/esteira-promocao-consultores";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { KpiCard } from "@/components/dashboard/KpiCard";

function EvolutionMiniChart() {
  const options: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false }, animations: { enabled: !prefersReducedMotion() } },
    plotOptions: { bar: { borderRadius: 4, columnWidth: "55%" } },
    stroke: { width: 0 },
    colors: ["#dc2626", "#f59e0b"],
    xaxis: { categories: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"], labels: { style: { fontSize: "11px", colors: "#94a3b8" } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { fontSize: "11px", colors: "#94a3b8" } } },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 3 },
    dataLabels: { enabled: false },
    legend: { position: "top", horizontalAlign: "right", fontSize: "12px", markers: { size: 6, shape: "circle" as const } },
  };
  const series = [
    { name: "Abertas", data: [8, 12, 6, 10, 9, 14] },
    { name: "Resolvidas", data: [5, 9, 7, 8, 11, 10] },
  ];
  return <Chart options={options} series={series} type="bar" height={220} />;
}

const resumo = { unidadesAtivas: 8, novasUnidades: 2, alertasCriticos: 4 };

const esteiraAbertura = {
  ativos: registrosAberturaUnidades.filter((r) => r.status === "ativo").length,
  emAtraso: registrosAberturaUnidades.filter((r) => r.emAtraso).length,
};
const esteiraPromocao = {
  ativos: registrosPromocaoConsultores.filter((r) => r.status === "ativo").length,
  emAtraso: registrosPromocaoConsultores.filter((r) => r.emAtraso).length,
};

const ocorrenciasAbertas = ocorrenciasList.filter((o) => o.status === "Aberto" || o.status === "Em andamento");

const penalidades = [
  { unidade: "SP-Centro", total: "2,0%", qtd: 2 },
  { unidade: "RJ-Barra", total: "3,0%", qtd: 2 },
  { unidade: "BH-Savassi", total: "1,5%", qtd: 1 },
  { unidade: "Curitiba-Norte", total: "1,0%", qtd: 1 },
];
const totalPenalidades = penalidades.reduce((a, p) => a + p.qtd, 0);

const previas = { emAnalise: 5, aprovadasMes: 3, reprovadasMes: 1 };

const Dashboard = () => {
  const navigate = useNavigate();
  const { open: openAlertsPanel } = useAlertsPanel();

  const entranceRef = usePageEntrance<HTMLDivElement>([
    { selector: ".dashboard-header", vars: { y: -16, opacity: 0, duration: 0.35 } },
    { selector: ".dashboard-resumo", vars: { y: 16, opacity: 0, duration: 0.3 }, position: "-=0.2" },
    { selector: ".kpi-card", vars: { y: 16, opacity: 0, scale: 0.97, duration: 0.35, stagger: { each: 0.045, from: "start" }, ease: EASE_SIGNATURE }, position: "-=0.15" },
    { selector: ".dashboard-section", vars: { y: 16, opacity: 0, duration: 0.35, stagger: 0.06 }, position: "-=0.2" },
  ]);

  const handleKpiClick = (kpi: (typeof kpis)[number]) => {
    if (kpi.isAlert) { openAlertsPanel(); return; }
    navigate(kpi.route);
  };

  return (
    <div ref={entranceRef} className="flex flex-col gap-6">
      <div className="dashboard-header flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Visão geral da rede — processos, ocorrências e indicadores.</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1.5 border-success/30 bg-success/10 text-success">
          <CircleCheck className="h-3.5 w-3.5" />
          Atualizado há 2h · fonte: Data Lake (Gold)
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} onClick={() => handleKpiClick(kpi)} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        {/* Gráfico de evolução de vendas da rede */}
        <Card className="dashboard-section p-6">
          <SectionHeader
            icon={BarChart3}
            title="Ocorrências"
            subtitle="Evolução mensal — abertas vs. resolvidas"
          />
          <div className="mt-4">
            <EvolutionMiniChart />
          </div>
        </Card>

        {/* 3 cards de esteira/prévias empilhados — stretch to fill height */}
        <div className="flex flex-col gap-3">
          <Card interactive onClick={() => navigate("/previas")} className="dashboard-section relative flex flex-1 items-center gap-4 overflow-hidden p-5">
            <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full" style={{ background: "linear-gradient(135deg, #f59e0b33, #f59e0b0d)" }} />
            <div className="absolute -right-0.5 -top-0.5 h-14 w-14 rounded-full" style={{ background: "linear-gradient(135deg, #f59e0b1a, transparent)" }} />
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm" style={{ background: "linear-gradient(135deg, #f59e0b, #f59e0bcc)" }}>
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">Prévias em análise</p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{previas.emAnalise}</span> em análise
                · <span className="font-medium text-success">{previas.aprovadasMes} aprovadas</span>
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Card>

          <Card interactive onClick={() => navigate("/esteira/abertura-unidades")} className="dashboard-section relative flex flex-1 items-center gap-4 overflow-hidden p-5">
            <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full" style={{ background: "linear-gradient(135deg, #8bc34b33, #8bc34b0d)" }} />
            <div className="absolute -right-0.5 -top-0.5 h-14 w-14 rounded-full" style={{ background: "linear-gradient(135deg, #8bc34b1a, transparent)" }} />
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm" style={{ background: "linear-gradient(135deg, #8bc34b, #8bc34bcc)" }}>
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">Abertura de Unidades</p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{esteiraAbertura.ativos}</span> na esteira
                {esteiraAbertura.emAtraso > 0 && <> · <span className="font-medium text-destructive">{esteiraAbertura.emAtraso} em atraso</span></>}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Card>

          <Card interactive onClick={() => navigate("/esteira/promocao-consultores")} className="dashboard-section relative flex flex-1 items-center gap-4 overflow-hidden p-5">
            <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full" style={{ background: "linear-gradient(135deg, #3b82f633, #3b82f60d)" }} />
            <div className="absolute -right-0.5 -top-0.5 h-14 w-14 rounded-full" style={{ background: "linear-gradient(135deg, #3b82f61a, transparent)" }} />
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm" style={{ background: "linear-gradient(135deg, #3b82f6, #3b82f6cc)" }}>
              <UserCog className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">Promoção de Consultores</p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{esteiraPromocao.ativos}</span> na esteira
                {esteiraPromocao.emAtraso > 0 && <> · <span className="font-medium text-destructive">{esteiraPromocao.emAtraso} em atraso</span></>}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="dashboard-section p-6">
          <SectionHeader
            icon={TriangleAlert}
            title="Ocorrências pendentes"
            subtitle={`${ocorrenciasAbertas.length} abertas ou em andamento`}
            actions={
              <Button variant="link" size="sm" className="h-auto p-0 text-xs uppercase" onClick={() => navigate("/ocorrencias")}>
                Ver todas<ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            }
          />
          <div className="divide-y divide-border">
            {ocorrenciasAbertas.slice(0, 4).map((occ) => (
              <div key={occ.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{occ.titulo}</p>
                  <p className="truncate text-xs text-muted-foreground">{occ.entidade} · {occ.tempo}</p>
                </div>
                <Badge variant={occ.status === "Aberto" ? "destructive" : "warning"} className="text-[10px]">
                  {occ.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="dashboard-section p-6">
          <SectionHeader
            icon={ShieldAlert}
            title="Penalidades ativas na rede"
            subtitle={`${totalPenalidades} penalidades em ${penalidades.length} unidades`}
            actions={
              <Button variant="link" size="sm" className="h-auto p-0 text-xs uppercase" onClick={() => navigate("/relatorios")}>
                Relatório<ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            }
          />
          <div className="divide-y divide-border">
            {penalidades.map((p) => (
              <div key={p.unidade} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                    <ShieldAlert className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.unidade}</p>
                    <p className="text-xs text-muted-foreground">{p.qtd} penalidade{p.qtd > 1 ? "s" : ""}</p>
                  </div>
                </div>
                <span className="font-display text-sm font-bold text-destructive">-{p.total}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
};

export default Dashboard;
