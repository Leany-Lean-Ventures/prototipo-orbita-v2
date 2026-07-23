import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { DollarSign, ShoppingCart, UserPlus, type LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { useCountUp } from "@/hooks/use-count-up";
import { prefersReducedMotion } from "@/lib/motion";
import type { FinanceiroInfo } from "@/lib/mock-data/unidades";

const CHART_1 = "#dc2626";
const CHART_2 = "#8bc34b";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  prefix?: string;
}

function StatCard({ icon: Icon, label, value, prefix }: StatCardProps) {
  const valueRef = useCountUp(value);
  return (
    <Card className="flex items-center gap-4 p-6">
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="font-display text-xl font-bold tabular-nums text-foreground">
          {prefix}
          <span ref={valueRef}>0</span>
        </p>
      </div>
    </Card>
  );
}

interface FinanceiroPanelProps {
  info: FinanceiroInfo;
}

/** Aba Dados Financeiros — sem detalhamento no PRD (Q05); ver MEMORY.md. */
export function FinanceiroPanel({ info }: FinanceiroPanelProps) {
  const options: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      fontFamily: "'Lato', ui-sans-serif, system-ui, sans-serif",
      animations: { enabled: !prefersReducedMotion(), speed: 600 },
    },
    colors: [CHART_1, CHART_2],
    stroke: { curve: "smooth", width: [2.5, 2.5], dashArray: [0, 6] },
    fill: { type: "gradient", gradient: { opacityFrom: 0.2, opacityTo: 0 } },
    grid: { borderColor: "hsl(214 32% 91%)", strokeDashArray: 4 },
    dataLabels: { enabled: false },
    legend: {
      position: "bottom",
      fontFamily: "'Lato', ui-sans-serif, system-ui, sans-serif",
      fontSize: "13px",
      markers: { size: 5 },
    },
    xaxis: {
      categories: info.meses,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: "12px" } },
    },
    yaxis: [
      {
        title: { text: "Faturamento (R$)", style: { fontSize: "11px" } },
        labels: {
          formatter: (v: number) => `${(v / 1000).toFixed(0)}k`,
          style: { fontSize: "12px" },
        },
      },
      {
        opposite: true,
        title: { text: "Vendas", style: { fontSize: "11px" } },
        labels: { formatter: (v: number) => `${v.toFixed(0)}`, style: { fontSize: "12px" } },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: [
        { formatter: (v: number) => `R$ ${v.toLocaleString("pt-BR")}` },
        { formatter: (v: number) => `${v} vendas` },
      ],
    },
  };

  const series = [
    { name: "Faturamento", data: info.faturamentoSerie },
    { name: "Vendas", data: info.vendasSerie, yAxisIndex: 1 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={DollarSign}
          label="Faturamento consolidado"
          value={info.faturamentoConsolidado}
          prefix="R$ "
        />
        <StatCard icon={ShoppingCart} label="Ticket médio" value={info.ticketMedio} prefix="R$ " />
        <StatCard icon={UserPlus} label="Novos clientes (mês)" value={info.novosClientesMes} />
      </div>

      <Card className="p-6">
        <h4 className="mb-4 text-sm font-semibold text-foreground">
          Evolução de faturamento e vendas
        </h4>
        <p className="sr-only">
          Faturamento evoluiu de R$ {info.faturamentoSerie[0].toLocaleString("pt-BR")} em{" "}
          {info.meses[0]} para R$ {info.faturamentoSerie[info.faturamentoSerie.length - 1].toLocaleString("pt-BR")} em{" "}
          {info.meses[info.meses.length - 1]}. Vendas evoluíram de {info.vendasSerie[0]} para{" "}
          {info.vendasSerie[info.vendasSerie.length - 1]} no mesmo período.
        </p>
        <Chart options={options} series={series} type="area" height={280} />
      </Card>
    </div>
  );
}
