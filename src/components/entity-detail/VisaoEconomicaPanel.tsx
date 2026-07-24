import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { TrendingUp, Wallet, Briefcase, Building2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { prefersReducedMotion } from "@/lib/motion";
import type { VisaoEconomica } from "@/lib/mock-data/consultores";

interface VisaoEconomicaPanelProps {
  info: VisaoEconomica;
}

const CHART_COLOR = "#dc2626";

/**
 * Aba "Visão Econômica" do consultor — score interno, faturamento consolidado,
 * carteiras, CNPJs e gráfico de evolução.
 */
export function VisaoEconomicaPanel({ info }: VisaoEconomicaPanelProps) {
  const chartOptions: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      animations: { enabled: !prefersReducedMotion() },
      sparkline: { enabled: false },
    },
    stroke: { curve: "smooth", width: 2.5, colors: [CHART_COLOR] },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05, stops: [0, 100] },
    },
    colors: [CHART_COLOR],
    xaxis: {
      categories: info.meses,
      labels: { style: { fontSize: "11px", colors: "#94a3b8" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "11px", colors: "#94a3b8" },
        formatter: (v) => `R$ ${(v / 1000).toFixed(0)}k`,
      },
    },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 3 },
    dataLabels: { enabled: false },
    tooltip: {
      y: { formatter: (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v) },
    },
  };

  const chartSeries = [{ name: "Faturamento", data: info.faturamentoSerie }];

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={TrendingUp} label="Score Interno" color="#6366f1">
          {info.scoreInterno} pts
        </StatCard>
        <StatCard icon={Wallet} label="Faturamento Consolidado" color="#dc2626">
          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(info.faturamentoConsolidado)}
        </StatCard>
        <StatCard icon={Briefcase} label="Carteiras Ativas" color="#16a34a">
          {info.totalCarteiras}
        </StatCard>
        <StatCard icon={Building2} label="CNPJs Vinculados" color="#f59e0b">
          {info.cnpjsVinculados}
        </StatCard>
      </div>

      {/* Gráfico de evolução */}
      <Card className="p-6">
        <SectionHeader
          icon={TrendingUp}
          title="Evolução de Faturamento"
          subtitle="Faturamento mensal individual (últimos 6 meses)"
        />
        <div className="mt-4">
          <Chart options={chartOptions} series={chartSeries} type="area" height={260} />
        </div>
      </Card>
    </div>
  );
}
