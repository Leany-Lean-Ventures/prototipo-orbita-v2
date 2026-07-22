import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCountUp } from "@/hooks/use-count-up";
import type { Kpi, KpiColorTheme } from "@/lib/mock-data/dashboard";

const THEME: Record<
  KpiColorTheme,
  { iconBg: string; iconText: string; indicator: string }
> = {
  maroon: {
    iconBg: "bg-primary/10",
    iconText: "text-primary",
    indicator: "bg-primary",
  },
  green: {
    iconBg: "bg-success/10",
    iconText: "text-success",
    indicator: "bg-success",
  },
  amber: {
    iconBg: "bg-warning/10",
    iconText: "text-warning",
    indicator: "bg-warning",
  },
  violet: {
    iconBg: "bg-violet-100 dark:bg-violet-900/30",
    iconText: "text-violet-600 dark:text-violet-400",
    indicator: "bg-violet-600",
  },
  red: {
    iconBg: "bg-primary/10",
    iconText: "text-primary",
    indicator: "bg-primary",
  },
};

interface KpiCardProps {
  kpi: Kpi;
  onClick: () => void;
}

export function KpiCard({ kpi, onClick }: KpiCardProps) {
  const valueRef = useCountUp(kpi.value);
  const theme = THEME[kpi.colorTheme];

  return (
    <Card
      interactive
      onClick={onClick}
      className={
        kpi.isAlert
          ? "kpi-card flex min-h-36 flex-col justify-between p-5 !border-primary !bg-primary text-primary-foreground"
          : "kpi-card flex min-h-36 flex-col justify-between p-5"
      }
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={
              kpi.isAlert
                ? "text-[10px] font-bold uppercase tracking-widest text-primary-foreground/70"
                : "text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
            }
          >
            {kpi.label}
          </p>
          <h3 className="mt-1 font-display text-2xl font-bold tabular-nums">
            <span ref={valueRef}>0</span>
          </h3>
        </div>
        <div
          className={
            kpi.isAlert
              ? "flex h-9 w-9 items-center justify-center rounded-xl bg-primary-foreground/20 text-lg"
              : `flex h-9 w-9 items-center justify-center rounded-xl text-lg ${theme.iconBg} ${theme.iconText}`
          }
          aria-hidden="true"
        >
          {kpi.icon}
        </div>
      </div>

      <div className="space-y-1.5">
        <p
          className={
            kpi.isAlert
              ? "text-xs font-medium text-primary-foreground/70"
              : "text-xs font-medium text-muted-foreground"
          }
        >
          {kpi.goalText}
        </p>
        <Progress
          value={kpi.progressPct}
          aria-label={`Progresso de ${kpi.label}: ${kpi.progressPct}%`}
          className={kpi.isAlert ? "bg-primary-foreground/20" : undefined}
          indicatorClassName={kpi.isAlert ? "bg-primary-foreground" : theme.indicator}
        />
      </div>
    </Card>
  );
}
