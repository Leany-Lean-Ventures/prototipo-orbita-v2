import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Store, Trophy, TrendingUp, Briefcase, BriefcaseBusiness, Star, Eye } from "lucide-react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { prefersReducedMotion } from "@/lib/motion";
import type {
  ConsultorVinculado,
  Carteira,
  Avaliacao360Info,
  OrganizacionalNode,
  Rating,
} from "@/lib/mock-data/unidades";

// Colors for each criterion line in the chart
const CRITERIO_COLORS = [
  "#dc2626", // Atendimento — primary red
  "#8bc34b", // Comunicação visual — green
  "#3b82f6", // Cumprimento de metas — blue
  "#f59e0b", // Conformidade — amber
];

interface DadosBasicosPanelProps {
  organizacional: OrganizacionalNode[];
  consultoresVinculados: ConsultorVinculado[];
  carteiras: Carteira[];
  avaliacao360: Avaliacao360Info;
  rating: Rating;
  ratingScore: number;
}

/**
 * Bento grid — "Dados Básicos" tab (default) for the Unidade detail page.
 * Layout: 3 stat cards → radar chart (full width with legend) → 2 rankings.
 */
export function DadosBasicosPanel({
  organizacional,
  consultoresVinculados,
  carteiras,
  avaliacao360,
  rating,
  ratingScore,
}: DadosBasicosPanelProps) {
  // Count PVs recursively (handles both flat and tree structures)
  const pvCount = useMemo(() => {
    let count = 0;
    const countPvs = (nodes: OrganizacionalNode[]) => {
      for (const node of nodes) {
        if (node.tipo === "pv") count++;
        if (node.children) countPvs(node.children);
      }
    };
    countPvs(organizacional);
    return count;
  }, [organizacional]);
  const consultorCount = consultoresVinculados.length;

  // Ranking consultores por faturamento (desc)
  const consultoresRanking = useMemo(
    () =>
      [...consultoresVinculados]
        .filter((c) => c.faturamento != null)
        .sort((a, b) => (b.faturamento ?? 0) - (a.faturamento ?? 0)),
    [consultoresVinculados]
  );

  // Carteiras ativas
  const carteirasAtivas = useMemo(
    () =>
      carteiras
        .filter((c) => c.status === "Ativa")
        .sort((a, b) => a.cliente.localeCompare(b.cliente)),
    [carteiras]
  );

  // Pagination state
  const [consultorPage, setConsultorPage] = useState(0);
  const [carteiraPage, setCarteiraPage] = useState(0);
  const PAGE_SIZE = 5;

  const consultorTotalPages = Math.ceil(consultoresRanking.length / PAGE_SIZE);
  const consultorPaged = consultoresRanking.slice(consultorPage * PAGE_SIZE, (consultorPage + 1) * PAGE_SIZE);

  const carteiraTotalPages = Math.ceil(carteirasAtivas.length / PAGE_SIZE);
  const carteiraPaged = carteirasAtivas.slice(carteiraPage * PAGE_SIZE, (carteiraPage + 1) * PAGE_SIZE);

  const navigate = useNavigate();

  // Line chart for Avaliação 360 — one line per criterion, X axis = years
  const anos = (avaliacao360.historicoAnual ?? []).map((e) => e.ano);

  const lineChartOptions: ApexOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      animations: { enabled: !prefersReducedMotion(), speed: 600 },
      fontFamily: "'Lato', ui-sans-serif, system-ui, sans-serif",
    },
    colors: CRITERIO_COLORS.slice(0, avaliacao360.criterios.length),
    stroke: { curve: "smooth", width: 2.5 },
    markers: { size: 5, strokeWidth: 2, strokeColors: "#fff" },
    xaxis: {
      categories: anos,
      labels: {
        style: { fontSize: "12px", colors: "hsl(var(--muted-foreground))" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: { style: { fontSize: "11px", colors: "hsl(var(--muted-foreground))" } },
    },
    grid: { borderColor: "hsl(var(--border))", strokeDashArray: 3 },
    legend: { show: false },
    tooltip: { theme: "light" },
    dataLabels: { enabled: false },
  };

  // Each line = one criterion, data points = its score across years
  const lineChartSeries = avaliacao360.criterios.map((criterio, idx) => ({
    name: criterio.criterio,
    data: (avaliacao360.historicoAnual ?? []).map((entry) => entry.scores[idx]),
  }));

  return (
    <div className="space-y-6">
      {/* Row 1: 3 bold stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Card PVs */}
        <Card className="relative overflow-hidden p-6">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5" />
          <div className="absolute -right-1 -top-1 h-16 w-16 rounded-full bg-gradient-to-br from-primary/10 to-transparent" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pontos de venda</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">{pvCount}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Store className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        {/* Card Consultores */}
        <Card className="relative overflow-hidden p-6">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/5" />
          <div className="absolute -right-1 -top-1 h-16 w-16 rounded-full bg-gradient-to-br from-secondary/10 to-transparent" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Consultores ativos</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">{consultorCount}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        {/* Card Rating */}
        <Card className="relative overflow-hidden p-6">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-500/5" />
          <div className="absolute -right-1 -top-1 h-16 w-16 rounded-full bg-gradient-to-br from-amber-500/10 to-transparent" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Rating geral</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                {rating} <span className="text-lg font-medium text-muted-foreground">({ratingScore}pts)</span>
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Row 2: Avaliação 360 — full width, legend on left + line chart on right */}
      <Card className="p-6">
        <SectionHeader
          icon={Star}
          title="Avaliação 360º"
          subtitle={`Última avaliação: ${avaliacao360.ultimaAvaliacao}`}
          actions={
            <Badge variant="outline" className="text-sm font-semibold">
              Score geral: {avaliacao360.scoreGeral}/100
            </Badge>
          }
        />

        {avaliacao360.criterios.length > 0 ? (
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-5">
            {/* Left: Current scores in single column */}
            <div className="flex flex-col justify-between lg:col-span-2 h-full">
              {avaliacao360.criterios.map((criterio, index) => (
                <div key={criterio.criterio} className="flex flex-col gap-2 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 shrink-0 rounded-sm"
                      style={{ backgroundColor: CRITERIO_COLORS[index % CRITERIO_COLORS.length] }}
                    />
                    <span className="min-w-0 flex-1 text-[13px] font-medium text-foreground">
                      {criterio.criterio}
                    </span>
                    <span className="shrink-0 text-right text-lg font-bold tracking-tight text-foreground">
                      {criterio.score}<span className="text-xs font-normal text-muted-foreground">/100</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${criterio.score}%`, backgroundColor: CRITERIO_COLORS[index % CRITERIO_COLORS.length] }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Line chart */}
            <div className="lg:col-span-3 min-h-[280px]">
              <Chart
                options={lineChartOptions}
                series={lineChartSeries}
                type="line"
                height={280}
              />
            </div>
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">Sem dados de avaliação</p>
        )}
      </Card>

      {/* Row 3: Rankings side by side */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Ranking de Consultores */}
        <Card className="flex flex-col p-6">
          <SectionHeader
            icon={TrendingUp}
            title="Top consultores"
            subtitle="Ranking por faturamento individual"
          />
          {consultoresRanking.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Nenhum consultor</p>
          ) : (
            <>
              <div className="flex-1 divide-y divide-border">
                {consultorPaged.map((consultor, index) => (
                  <div key={consultor.id} className="flex items-center gap-3 py-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-foreground">
                      {consultorPage * PAGE_SIZE + index + 1}
                    </div>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-secondary/20 bg-secondary/10">
                      <BriefcaseBusiness className="h-4 w-4 text-secondary" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-foreground">{consultor.razaoSocial}</p>
                      <p className="text-[11px] text-muted-foreground">{consultor.matricula} • {consultor.carteiraQtd} carteiras</p>
                    </div>
                    <span className="text-[12px] font-semibold text-foreground">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(consultor.faturamento ?? 0)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
                      onClick={() => navigate(`/consultores/${consultor.id}`)}
                      aria-label={`Ver perfil de ${consultor.razaoSocial}`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
              {consultorTotalPages > 1 && (
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-[11px] text-muted-foreground">
                    {consultorPage + 1}/{consultorTotalPages}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" disabled={consultorPage === 0} onClick={() => setConsultorPage(p => p - 1)}>Ant.</Button>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" disabled={consultorPage >= consultorTotalPages - 1} onClick={() => setConsultorPage(p => p + 1)}>Próx.</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>

        {/* Ranking de Carteiras */}
        <Card className="flex flex-col p-6">
          <SectionHeader
            icon={Briefcase}
            title="Carteiras ativas"
            subtitle="Carteiras com status ativo vinculadas à unidade"
          />
          {carteirasAtivas.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Nenhuma carteira ativa</p>
          ) : (
            <>
              <div className="flex-1 divide-y divide-border">
                {carteiraPaged.map((carteira) => (
                  <div key={carteira.id} className="flex items-center justify-between py-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-foreground">{carteira.cliente}</p>
                      <p className="text-[11px] text-muted-foreground">{carteira.id}</p>
                    </div>
                    {carteira.consultor ? (
                      <span className="text-[11px] text-muted-foreground">{carteira.consultor}</span>
                    ) : (
                      <Badge variant="warning" className="text-[10px]">Órfã</Badge>
                    )}
                  </div>
                ))}
              </div>
              {carteiraTotalPages > 1 && (
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-[11px] text-muted-foreground">
                    {carteiraPage + 1}/{carteiraTotalPages}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" disabled={carteiraPage === 0} onClick={() => setCarteiraPage(p => p - 1)}>Ant.</Button>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" disabled={carteiraPage >= carteiraTotalPages - 1} onClick={() => setCarteiraPage(p => p + 1)}>Próx.</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
