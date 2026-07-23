import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Waypoints, Store, Building2, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  VINCULO_TIPO_LABEL,
  type VinculoNode,
  type VinculoNodeType,
} from "@/lib/mock-data/vinculos";

export const NODE_COLOR: Record<VinculoNodeType, string> = {
  macro: "hsl(var(--chart-1))",
  unidade: "hsl(var(--chart-2))",
  pv: "hsl(var(--chart-3))",
  consultor: "hsl(var(--chart-4))",
};

export const TIPO_ICON: Record<VinculoNodeType, typeof Store> = {
  macro: Waypoints,
  unidade: Store,
  pv: Building2,
  consultor: Users,
};

export interface GraphNodeData extends Record<string, unknown> {
  node: VinculoNode;
  connected: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export type GraphFlowNode = Node<GraphNodeData, "chip">;

const handleStyle = { opacity: 0, pointerEvents: "none" as const };

/**
 * Nó custom único, parametrizado por `data.node.tipo` (macro/unidade/PV/
 * consultor) — chip com ícone-chip colorido (padrão já estabelecido no
 * projeto, CLAUDE.md regra 2: nunca stroke lateral para indicar categoria)
 * em vez das formas geométricas do grafo em SVG cru anterior.
 */
export function GraphNodeChip({ data }: NodeProps<GraphFlowNode>) {
  const { node, connected, isSelected, onSelect } = data;
  const Icon = TIPO_ICON[node.tipo];
  const color = NODE_COLOR[node.tipo];
  const compact = node.tipo === "consultor";

  return (
    <>
      <Handle type="target" position={Position.Top} style={handleStyle} isConnectable={false} />
      <div
        role="button"
        tabIndex={0}
        aria-label={`${VINCULO_TIPO_LABEL[node.tipo]}: ${node.label}`}
        aria-pressed={isSelected}
        onClick={() => onSelect(node.id)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect(node.id);
          }
        }}
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-lg border bg-card shadow-soft transition-[opacity,box-shadow,border-color] duration-base ease-micro hover:shadow-elevated focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          compact ? "px-2 py-1.5" : "px-3 py-2",
          isSelected ? "shadow-elevated" : "border-border"
        )}
        style={{
          opacity: connected ? 1 : 0.25,
          borderColor: isSelected ? color : undefined,
          borderWidth: isSelected ? 2 : 1,
        }}
      >
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: `${color}1a`, color }}
          aria-hidden="true"
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        {!compact && (
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-foreground">{node.label}</p>
            <p className="truncate text-[10px] text-muted-foreground">{node.sublabel}</p>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} style={handleStyle} isConnectable={false} />
    </>
  );
}
