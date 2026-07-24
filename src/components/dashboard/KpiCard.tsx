import { TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCountUp } from "@/hooks/use-count-up";
import type { Kpi, KpiColorTheme } from "@/lib/mock-data/dashboard";

const THEME: Record<KpiColorTheme, { color: string; indicator: string }> = {
  maroon: { color: "#dc2626", indicator: "bg-primary" },
  green: { color: "#8bc34b", indicator: "bg-success" },
  amber: { color: "#f59e0b", indicator: "bg-warning" },
  violet: { color: "#8b5cf6", indicator: "bg-violet-600" },
  red: { color: "#dc2626", indicator: "bg-primary" },
};

interface KpiCardProps {
  kpi: Kpi;
  onClick: () => void;
}

export function KpiCard({ kpi, onClick }: KpiCardProps) {
  const valueRef = useCountUp(kpi.value);
  const theme = THEME[kpi.colorTheme];
  const Icon = kpi.icon;

  // Alert card keeps the solid primary background treatment
  if (kpi.isAlert) {
    return (
      <Card
        interactive
        onClick={onClick}
        className="kpi-card relative flex min-h-36 flex-col justify-between overflow-hidden p-6 !border-primary !bg-primary text-primary-foreground"
      >
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
        <div className="absolute -right-1 -top-1 h-16 w-16 rounded-full bg-white/5" />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/70">
                {kpi.label}
              </p>
              <h3 className="mt-1 font-display text-3xl font-bold tabular-nums tracking-tight">
                <span ref={valueRef}>0</span>
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 shadow-lg">
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="relative space-y-1.5">
          <p className="flex items-center gap-1 text-xs font-medium text-primary-foreground/70">
            {kpi.hasTrendUp && <TrendingUp className="h-3 w-3" aria-hidden="true" />}
            {kpi.goalText}
          </p>
          <Progress
            value={kpi.progressPct}
            aria-label={`Progresso de ${kpi.label}: ${kpi.progressPct}%`}
            className="bg-primary-foreground/20"
            indicatorClassName="bg-primary-foreground"
          />
        </div>
      </Card>
    );
  }

  return (
    <Card
      interactive
      onClick={onClick}
      className="kpi-card relative flex min-h-36 flex-col justify-between overflow-hidden p-6"
    >
      {/* Gradient decoration */}
      <div
        className="absolute -right-4 -top-4 h-24 w-24 rounded-full"
        style={{ background: `linear-gradient(135deg, ${theme.color}33, ${theme.color}0d)` }}
      />
      <div
        className="absolute -right-1 -top-1 h-16 w-16 rounded-full"
        style={{ background: `linear-gradient(135deg, ${theme.color}1a, transparent)` }}
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {kpi.label}
            </p>
            <h3 className="mt-1 font-display text-3xl font-bold tabular-nums tracking-tight text-foreground">
              <span ref={valueRef}>0</span>
            </h3>
          </div>
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg"
            style={{ background: `linear-gradient(135deg, ${theme.color}, ${theme.color}cc)` }}
            aria-hidden="true"
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      <div className="relative space-y-1.5">
        <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          {kpi.hasTrendUp && <TrendingUp className="h-3 w-3" aria-hidden="true" />}
          {kpi.goalText}
        </p>
        <Progress
          value={kpi.progressPct}
          aria-label={`Progresso de ${kpi.label}: ${kpi.progressPct}%`}
          indicatorClassName={theme.indicator}
        />
      </div>
    </Card>
  );
}
