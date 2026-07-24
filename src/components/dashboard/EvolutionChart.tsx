import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { BarChart3 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { prefersReducedMotion } from "@/lib/motion";
import { evolucaoSerie } from "@/lib/mock-data/dashboard";

// chart-1 (marca) e chart-2 (verde) — design-system/brand.json, ordem fixa.
const CHART_1 = "#dc2626";
const CHART_2 = "#8bc34b";

const options: ApexOptions = {
  chart: {
    type: "area",
    toolbar: { show: false },
    fontFamily: "'Lato', ui-sans-serif, system-ui, sans-serif",
    animations: {
      enabled: !prefersReducedMotion(),
      speed: 600, // design-system §7.4: reduzir de ~1s padrão para 600ms
    },
  },
  colors: [CHART_1, CHART_2],
  stroke: {
    curve: "smooth",
    width: [2.5, 2.5],
    // Diferenciar séries por estilo de linha, não só cor (a11y — ui-ux-pro-max §chart)
    dashArray: [0, 6],
  },
  fill: {
    type: "gradient",
    gradient: { opacityFrom: 0.2, opacityTo: 0 },
  },
  grid: {
    borderColor: "hsl(214 32% 91%)",
    strokeDashArray: 4,
  },
  dataLabels: { enabled: false },
  legend: {
    position: "bottom",
    fontFamily: "'Lato', ui-sans-serif, system-ui, sans-serif",
    fontSize: "13px",
    markers: { size: 5 },
  },
  xaxis: {
    categories: evolucaoSerie.meses,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { fontSize: "12px" } },
  },
  yaxis: [
    {
      title: { text: "Faturamento (R$M)", style: { fontSize: "11px" } },
      labels: {
        formatter: (v: number) => `${v.toFixed(0)}M`,
        style: { fontSize: "12px" },
      },
    },
    {
      opposite: true,
      title: { text: "Vendas", style: { fontSize: "11px" } },
      labels: {
        formatter: (v: number) => `${v.toFixed(0)}`,
        style: { fontSize: "12px" },
      },
    },
  ],
  tooltip: {
    shared: true,
    intersect: false,
    y: [
      { formatter: (v: number) => `R$ ${v.toFixed(1)}M` },
      { formatter: (v: number) => `${v} vendas` },
    ],
  },
};

const series = [
  { name: "Faturamento", data: evolucaoSerie.faturamentoMilhoes },
  { name: "Vendas", data: evolucaoSerie.vendas, yAxisIndex: 1 },
];

export function EvolutionChart() {
  return (
    <Card className="evolution-chart p-6">
      <SectionHeader
        icon={BarChart3}
        title="Evolução de Faturamento e Vendas"
        subtitle="Últimos 6 meses"
      />
      {/* Dado crítico disponível como texto (design-system §12) — o gráfico não é a única forma de acesso à tendência. */}
      <p className="sr-only">
        Faturamento evoluiu de R$ {evolucaoSerie.faturamentoMilhoes[0]} milhões em{" "}
        {evolucaoSerie.meses[0]} para R${" "}
        {evolucaoSerie.faturamentoMilhoes[evolucaoSerie.faturamentoMilhoes.length - 1]}{" "}
        milhões em {evolucaoSerie.meses[evolucaoSerie.meses.length - 1]}. Vendas
        evoluíram de {evolucaoSerie.vendas[0]} para{" "}
        {evolucaoSerie.vendas[evolucaoSerie.vendas.length - 1]} no mesmo período.
      </p>
      <Chart options={options} series={series} type="area" height={320} />
    </Card>
  );
}
