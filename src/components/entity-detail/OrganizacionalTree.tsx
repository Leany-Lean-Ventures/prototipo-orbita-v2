import { Store, Building2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { OrganizacionalNode } from "@/lib/mock-data/unidades";

interface OrganizacionalTreeProps {
  nodes: OrganizacionalNode[];
}

/**
 * Aba Estrutura Organizacional (PRD-02 §3.3): lista indentada por nível
 * hierárquico — não uma árvore interativa, a profundidade do mock não
 * justifica expand/collapse ainda.
 */
export function OrganizacionalTree({ nodes }: OrganizacionalTreeProps) {
  if (nodes.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Nenhuma estrutura subordinada registrada.
      </p>
    );
  }

  return (
    <div className="divide-y divide-border">
      {nodes.map((node) => {
        const Icon = node.depth === 0 ? Store : Building2;
        return (
          <div
            key={node.id}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            style={{ paddingLeft: `${node.depth * 1.5}rem` }}
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground"
              aria-hidden="true"
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{node.nome}</p>
              <p className="truncate text-xs text-muted-foreground">{node.responsavel}</p>
            </div>
            <Badge variant="outline">{node.nivelLabel}</Badge>
          </div>
        );
      })}
    </div>
  );
}
