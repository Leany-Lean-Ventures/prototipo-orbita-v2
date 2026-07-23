import { useState } from "react";
import { Waypoints, Store, Building2, Users } from "lucide-react";

import {
  VINCULO_TIPO_LABEL,
  type VinculoEdge,
  type VinculoNode,
  type VinculoNodeType,
} from "@/lib/mock-data/vinculos";

const TIPO_ICON: Record<VinculoNodeType, typeof Store> = {
  macro: Waypoints,
  unidade: Store,
  pv: Building2,
  consultor: Users,
};

const TIPO_DEPTH: Record<VinculoNodeType, number> = { macro: 0, unidade: 1, pv: 2, consultor: 3 };

interface VinculosListViewProps {
  nodes: VinculoNode[];
  edges: VinculoEdge[];
  onSelect: (id: string) => void;
}

/**
 * Alternativa acessível ao grafo (ui-ux-pro-max, --domain chart: grafos de
 * rede têm grau D de acessibilidade — "sempre fornecer uma lista
 * alternativa"). Mesma hierarquia macro > unidade > PV > consultor, em
 * lista indentada navegável por teclado/leitor de tela, sem depender do
 * SVG.
 */
export function VinculosListView({ nodes, edges, onSelect }: VinculosListViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const connectionsOf = (id: string) =>
    edges
      .filter((edge) => edge.from === id || edge.to === id)
      .map((edge) => (edge.from === id ? edge.to : edge.from));

  return (
    <div className="rounded-card border border-border p-2">
      <div className="divide-y divide-border">
        {nodes.map((node) => {
          const Icon = TIPO_ICON[node.tipo];
          const expanded = expandedId === node.id;
          return (
            <div key={node.id}>
              <button
                type="button"
                className="flex w-full items-center gap-3 py-3 text-left transition-colors duration-micro ease-micro hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                style={{ paddingLeft: `${8 + TIPO_DEPTH[node.tipo] * 24}px` }}
                aria-expanded={expanded}
                onClick={() => {
                  setExpandedId((prev) => (prev === node.id ? null : node.id));
                  onSelect(node.id);
                }}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{node.label}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {VINCULO_TIPO_LABEL[node.tipo]} · {node.sublabel}
                  </p>
                </div>
              </button>
              {expanded && (
                <div className="ml-8 mb-3 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
                  {connectionsOf(node.id).length} conexão(ões) diretas —{" "}
                  {connectionsOf(node.id)
                    .map((id) => nodes.find((n) => n.id === id)?.label)
                    .filter(Boolean)
                    .join(", ") || "nenhuma"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
