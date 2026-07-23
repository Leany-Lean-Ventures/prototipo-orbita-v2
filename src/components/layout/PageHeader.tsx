import * as React from "react";

import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Slot para o seletor de abas da página (`<TabsList>...</TabsList>`) — ver CLAUDE.md "Abas". */
  tabs?: React.ReactNode;
  /** Slot para botões de ação alinhados à direita do título. */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Cabeçalho padrão de página: título + subtítulo à esquerda, abas/ações à
 * direita. Área intencionalmente parametrizada para hospedar `tabs` sempre
 * que uma página precisar de um seletor — ver `UnidadesLista.tsx`.
 */
export function PageHeader({ title, subtitle, tabs, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {(tabs || actions) && (
        <div className="flex items-center gap-3">
          {tabs}
          {actions}
        </div>
      )}
    </div>
  );
}
