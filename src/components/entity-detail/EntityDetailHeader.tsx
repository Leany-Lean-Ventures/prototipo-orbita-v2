import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";

export interface EntityFact {
  icon: LucideIcon;
  label: string;
  value: string;
}

interface EntityDetailHeaderProps {
  nome: string;
  statusLabel: string;
  statusVariant: BadgeProps["variant"];
  facts: EntityFact[];
  actions?: ReactNode;
  indicator?: ReactNode;
  className?: string;
}

/**
 * Cabeçalho reutilizável para páginas de detalhe (Unidade, PV, Consultor —
 * PRD-04 §5 pede reaproveitamento explícito). `indicator` é opcional
 * (Unidade tem o donut de rating, PV não).
 */
export function EntityDetailHeader({
  nome,
  statusLabel,
  statusVariant,
  facts,
  actions,
  indicator,
  className,
}: EntityDetailHeaderProps) {
  return (
    <Card
      className={cn(
        "entity-detail-header flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between",
        className
      )}
    >
      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-bold text-foreground">{nome}</h1>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {facts.map((fact) => {
            const Icon = fact.icon;
            return (
              <div
                key={fact.label}
                className="flex items-center gap-2 text-sm text-muted-foreground"
                aria-label={fact.label}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{fact.value}</span>
              </div>
            );
          })}
        </div>

        {actions && <div className="flex flex-wrap gap-2 pt-1">{actions}</div>}
      </div>

      {indicator && <div className="shrink-0 self-center">{indicator}</div>}
    </Card>
  );
}
