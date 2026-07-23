import { useMemo, useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type NodeChange,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { prefersReducedMotion } from "@/lib/motion";
import {
  vinculosGraph,
  VINCULO_TIPO_LABEL,
  type VinculoNode,
  type VinculoNodeType,
} from "@/lib/mock-data/vinculos";
import { computeRadialLayout } from "@/lib/graph-layout";
import { GraphNodeChip, NODE_COLOR, TIPO_ICON, type GraphFlowNode } from "./GraphNodeChip";
import { VinculosGraphPanel } from "./VinculosGraphPanel";
import { VinculosListView } from "./VinculosListView";

const NODE_TYPES = { chip: GraphNodeChip };

// Raios calibrados para o SVG cru foram pensados para círculos pequenos;
// nós-chip do React Flow ocupam mais espaço real em px — escala maior
// evita sobreposição (ver graph-layout.ts).
const LAYOUT_SCALE = 2.4;

const FILTROS: Array<{ value: VinculoNodeType | "todos"; label: string }> = [
  { value: "todos", label: "Todos" },
  { value: "macro", label: "Macrorregiões" },
  { value: "unidade", label: "Unidades" },
  { value: "pv", label: "PVs" },
  { value: "consultor", label: "Consultores" },
];

export function VinculosGraph() {
  const { nodes: dataNodes, edges: dataEdges } = vinculosGraph;
  const positions = useMemo(
    () => computeRadialLayout(dataNodes, dataEdges, LAYOUT_SCALE),
    [dataNodes, dataEdges]
  );
  const nodeById = useMemo(() => new Map(dataNodes.map((n) => [n.id, n])), [dataNodes]);
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<VinculoNodeType | "todos">("todos");
  const [viewList, setViewList] = useState(false);
  const [positionOverrides, setPositionOverrides] = useState<Map<string, { x: number; y: number }>>(
    new Map()
  );

  const toggleSelect = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const isConnected = useCallback(
    (id: string) => {
      if (!selectedId) return true;
      if (id === selectedId) return true;
      return dataEdges.some(
        (edge) =>
          (edge.from === selectedId && edge.to === id) ||
          (edge.to === selectedId && edge.from === id)
      );
    },
    [selectedId, dataEdges]
  );

  const isVisible = useCallback(
    (node: VinculoNode) => (filtro === "todos" ? isConnected(node.id) : node.tipo === filtro),
    [filtro, isConnected]
  );

  const selectedNode = selectedId ? nodeById.get(selectedId) ?? null : null;
  const connections = selectedNode
    ? dataEdges
        .filter((edge) => edge.from === selectedNode.id || edge.to === selectedNode.id)
        .map((edge) => (edge.from === selectedNode.id ? edge.to : edge.from))
        .map((id) => nodeById.get(id))
        .filter((n): n is VinculoNode => Boolean(n))
    : [];

  const flowNodes: GraphFlowNode[] = useMemo(
    () =>
      dataNodes.map((node) => {
        const base = positionOverrides.get(node.id) ?? positions.get(node.id) ?? { x: 0, y: 0 };
        return {
          id: node.id,
          type: "chip",
          position: base,
          width: node.tipo === "consultor" ? 44 : 170,
          height: 44,
          data: {
            node,
            connected: isVisible(node),
            isSelected: node.id === selectedId,
            onSelect: toggleSelect,
          },
          draggable: true,
        };
      }),
    [dataNodes, positions, positionOverrides, isVisible, selectedId, toggleSelect]
  );

  const flowEdges: Edge[] = useMemo(
    () =>
      dataEdges.map((edge) => {
        const nodeA = nodeById.get(edge.from);
        const on =
          filtro === "todos"
            ? isConnected(edge.from) && isConnected(edge.to)
            : nodeA?.tipo === filtro || nodeById.get(edge.to)?.tipo === filtro;
        return {
          id: `${edge.from}-${edge.to}`,
          source: edge.from,
          target: edge.to,
          type: "simplebezier",
          animated: on && !reducedMotion && Boolean(selectedId),
          style: {
            stroke: nodeA ? NODE_COLOR[nodeA.tipo] : undefined,
            strokeWidth: on ? 2 : 1,
            opacity: on ? 0.6 : 0.08,
          },
        };
      }),
    [dataEdges, nodeById, filtro, isConnected, reducedMotion, selectedId]
  );

  const onNodesChange = useCallback((changes: NodeChange<GraphFlowNode>[]) => {
    setPositionOverrides((prev) => {
      const next = new Map(prev);
      let changed = false;
      changes.forEach((change) => {
        if (change.type === "position" && change.position) {
          next.set(change.id, change.position);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, []);

  const counts = useMemo(() => {
    const acc: Record<VinculoNodeType, number> = { macro: 0, unidade: 0, pv: 0, consultor: 0 };
    dataNodes.forEach((n) => acc[n.tipo]++);
    return acc;
  }, [dataNodes]);

  return (
    <div className="unidades-grafo space-y-3">
      <p className="sr-only">
        Mapa de vínculos da rede: {counts.macro} macrorregiões, {counts.unidade} unidades,{" "}
        {counts.pv} PVs e {counts.consultor} consultores conectados. Use Tab para navegar pelos
        nós e Enter para selecionar. É possível arrastar nós, ampliar e navegar pelo mapa. Uma
        alternativa em lista está disponível pelo botão &quot;Ver como lista&quot;.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTROS.map((f) => (
            <Button
              key={f.value}
              type="button"
              size="sm"
              variant={filtro === f.value ? "default" : "outline"}
              onClick={() => setFiltro(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
        <Button type="button" size="sm" variant="outline" onClick={() => setViewList((v) => !v)}>
          <List className="h-3.5 w-3.5" aria-hidden="true" />
          {viewList ? "Ver como grafo" : "Ver como lista"}
        </Button>
      </div>

      {viewList ? (
        <VinculosListView nodes={dataNodes} edges={dataEdges} onSelect={toggleSelect} />
      ) : (
        <div className="relative h-[calc(100vh-210px)] min-h-[420px] overflow-hidden rounded-card border border-border bg-muted/20">
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            nodeTypes={NODE_TYPES}
            onNodesChange={onNodesChange}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            minZoom={0.3}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
            nodesFocusable
            edgesFocusable={false}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
            <Controls showInteractive={false} />
            <MiniMap
              pannable
              zoomable
              nodeColor={(n) => {
                const flowNode = n as GraphFlowNode;
                return NODE_COLOR[flowNode.data.node.tipo];
              }}
              maskColor="hsl(var(--muted) / 0.6)"
              className="!bg-card"
            />
          </ReactFlow>

          <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex flex-wrap gap-3 rounded-lg border border-border bg-card/90 px-3 py-2 text-xs text-muted-foreground shadow-soft backdrop-blur-sm">
            {(Object.keys(VINCULO_TIPO_LABEL) as VinculoNodeType[]).map((tipo) => {
              const Icon = TIPO_ICON[tipo];
              return (
                <span key={tipo} className="flex items-center gap-1.5">
                  <Icon className="h-3 w-3" style={{ color: NODE_COLOR[tipo] }} aria-hidden="true" />
                  {VINCULO_TIPO_LABEL[tipo]}
                </span>
              );
            })}
          </div>

          <VinculosGraphPanel node={selectedNode} connections={connections} onSelect={toggleSelect} />
        </div>
      )}
    </div>
  );
}
