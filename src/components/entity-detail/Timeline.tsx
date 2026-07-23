import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export type TimelineColor = "gray" | "green" | "red" | "amber" | "blue" | "violet";

export interface TimelineEntry {
  data: string;
  icon: LucideIcon;
  color: TimelineColor;
  titulo: string;
  desc: string;
  status?: "Aberto" | "Resolvido";
}

const COLOR_CLASSES: Record<TimelineColor, string> = {
  gray: "bg-muted text-muted-foreground",
  green: "bg-success/10 text-success",
  red: "bg-destructive/10 text-destructive",
  amber: "bg-warning/10 text-warning",
  blue: "bg-info/10 text-info",
  violet: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
};

interface TimelineProps {
  items: TimelineEntry[];
}

/**
 * Linha do tempo genérica (PRD-02 §3.3 "Histórico"): linha vertical à
 * esquerda, itens empilhados à direita. Reutilizada por PV/Consultor.
 */
export function Timeline({ items }: TimelineProps) {
  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Nenhum evento registrado neste período.
      </p>
    );
  }

  return (
    <div className="relative">
      <div
        className="absolute left-3 top-3 bottom-3 w-px bg-border"
        aria-hidden="true"
      />
      <ol className="space-y-6">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <li key={`${item.data}-${index}`} className="relative flex gap-4">
              <span
                className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-4 ring-background ${COLOR_CLASSES[item.color]}`}
                aria-hidden="true"
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-foreground">{item.titulo}</p>
                  {item.status && (
                    <Badge
                      variant={item.status === "Resolvido" ? "success" : "destructive"}
                      className="text-[10px]"
                    >
                      {item.status}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{item.data}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
