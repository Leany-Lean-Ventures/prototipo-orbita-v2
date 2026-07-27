import { useMemo } from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { BarChart3 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { rotuloCurto, type MapSelection } from "@/lib/geo/selection";
import { agregar, MESES_SERIE } from "@/lib/mock-data/rede-agregada";
import { prefersReducedMotion } from "@/lib/motion";

interface OcorrenciasChartCardProps {
  sel: MapSelection;
  className?: string;
}

export function OcorrenciasChartCard({ sel, className }: OcorrenciasChartCardProps) {
  const rede = agregar(sel);
  const subtitulo = `Evolução mensal — ${rotuloCurto(sel)}`;

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: { show: false },
        animations: { enabled: !prefersReducedMotion() },
        background: "transparent",
      },
      plotOptions: {
        bar: { borderRadius: 4, columnWidth: "55%", borderRadiusApplication: "end" },
      },
      stroke: { width: 0 },
      colors: ["#dc2626", "#94a3b8"],
      xaxis: {
        categories: [...MESES_SERIE],
        labels: { style: { fontSize: "11px", colors: "#94a3b8" } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { labels: { style: { fontSize: "11px", colors: "#94a3b8" } } },
      grid: { borderColor: "#f1f5f9", strokeDashArray: 3 },
      dataLabels: { enabled: false },
      legend: {
        show: false,
      },
      tooltip: { theme: "light" },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const series = useMemo(
    () => [
      { name: "Abertas", data: [...rede.ocorrenciasAbertas] },
      { name: "Resolvidas", data: [...rede.ocorrenciasResolvidas] },
    ],
    [rede],
  );

  const legendActions = (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#dc2626]" />
        <span className="text-[11px] font-semibold text-muted-foreground">Abertas</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#94a3b8]" />
        <span className="text-[11px] font-semibold text-muted-foreground">Resolvidas</span>
      </div>
    </div>
  );

  return (
    <Card className={`dashboard-section p-6 ${className ?? ""}`}>
      <SectionHeader
        icon={BarChart3}
        title="Ocorrências"
        subtitle={subtitulo}
        actions={legendActions}
      />
      <div className="mt-4">
        <Chart options={options} series={series} type="bar" height={220} />
      </div>
    </Card>
  );
}
