import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  /** Lucide icon displayed at the left. */
  icon: LucideIcon;
  /** Section title. */
  title: string;
  /** Required subtitle below the title. */
  subtitle: string;
  /** Optional slot for action buttons or filters on the right side. */
  actions?: ReactNode;
  className?: string;
}

/**
 * Standard container header: icon + title/subtitle on the left, actions/filters on the right.
 * Use inside every Card/container that has a heading — established as a project-wide pattern.
 */
export function SectionHeader({ icon: Icon, title, subtitle, actions, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-6 flex items-start justify-between gap-4", className)}>
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/40 text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold leading-tight text-foreground">{title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
