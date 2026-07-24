import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

export interface StatCardProps {
  /** Lucide icon displayed in the gradient container (top-right). */
  icon: LucideIcon;
  /** Label text (uppercase, above the value). */
  label: string;
  /** Main value or ReactNode to render as the big number. */
  children: ReactNode;
  /** Hex color for the gradient icon and decorative circles. */
  color: string;
  /** Optional className for the outer Card. */
  className?: string;
}

/**
 * Standard "gradient icon stat card" — project-wide pattern for KPI/metric display.
 *
 * Layout: label (uppercase) + value on the left, gradient icon on the top-right,
 * decorative gradient circles in the background.
 *
 * Usage:
 * ```tsx
 * <StatCard icon={Store} label="Pontos de venda" color="#dc2626">
 *   12
 * </StatCard>
 * ```
 *
 * Registered as a project pattern in MEMORY.md (2026-07-23).
 */
export function StatCard({ icon: Icon, label, children, color, className }: StatCardProps) {
  return (
    <Card className={`relative overflow-hidden p-6 ${className ?? ""}`}>
      {/* Decorative gradient circles */}
      <div
        className="absolute -right-4 -top-4 h-24 w-24 rounded-full"
        style={{ background: `linear-gradient(135deg, ${color}33, ${color}0d)` }}
      />
      <div
        className="absolute -right-1 -top-1 h-16 w-16 rounded-full"
        style={{ background: `linear-gradient(135deg, ${color}1a, transparent)` }}
      />

      {/* Content */}
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <div className="mt-1 font-display text-3xl font-bold tabular-nums tracking-tight text-foreground">
            {children}
          </div>
        </div>
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  );
}
