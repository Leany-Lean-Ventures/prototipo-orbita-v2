import type { VinculoEdge, VinculoNode, VinculoNodeType } from "./mock-data/vinculos";

export interface GraphPoint {
  x: number;
  y: number;
}

export const GRAPH_VIEWBOX = 700;
const CENTER = GRAPH_VIEWBOX / 2;

const RING_RADIUS: Record<VinculoNodeType, number> = {
  macro: 90,
  unidade: 190,
  pv: 270,
  consultor: 335,
};

export const NODE_RADIUS: Record<VinculoNodeType, number> = {
  macro: 22,
  unidade: 15,
  pv: 10,
  consultor: 6,
};

/**
 * Layout radial determinístico: cada nó recebe uma fatia angular
 * proporcional ao número de folhas descendentes (mesma técnica de
 * partição do Sunburst de `prototipo-base.html`, aplicada a um
 * grafo de nó-aresta em vez de arcos) — sem sobreposição, sem
 * simulação de força.
 *
 * `scale` multiplica os raios de anel — os valores de `RING_RADIUS`
 * foram calibrados para círculos pequenos de SVG; nós-chip do React
 * Flow (VinculosGraph.tsx) ocupam bem mais espaço em px reais, então
 * a chamada do grafo usa um `scale` maior para não sobrepor.
 */
export function computeRadialLayout(
  nodes: VinculoNode[],
  edges: VinculoEdge[],
  scale = 1
): Map<string, GraphPoint> {
  const childrenOf = new Map<string, string[]>();
  edges.forEach((edge) => {
    const list = childrenOf.get(edge.from) ?? [];
    list.push(edge.to);
    childrenOf.set(edge.from, list);
  });

  const leafCountCache = new Map<string, number>();
  function leafCount(id: string): number {
    if (leafCountCache.has(id)) return leafCountCache.get(id)!;
    const kids = childrenOf.get(id) ?? [];
    const count = kids.length === 0 ? 1 : kids.reduce((sum, kid) => sum + leafCount(kid), 0);
    leafCountCache.set(id, count);
    return count;
  }

  const positions = new Map<string, GraphPoint>();
  const nodeById = new Map(nodes.map((n) => [n.id, n]));

  function polar(radius: number, angleDeg: number): GraphPoint {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: CENTER + radius * Math.cos(angleRad),
      y: CENTER + radius * Math.sin(angleRad),
    };
  }

  function place(id: string, angleStart: number, angleEnd: number) {
    const node = nodeById.get(id);
    if (!node) return;
    positions.set(id, polar(RING_RADIUS[node.tipo] * scale, (angleStart + angleEnd) / 2));

    const kids = childrenOf.get(id) ?? [];
    if (kids.length === 0) return;

    const total = kids.reduce((sum, kid) => sum + leafCount(kid), 0);
    let cursor = angleStart;
    kids.forEach((kid) => {
      const span = (angleEnd - angleStart) * (leafCount(kid) / total);
      place(kid, cursor, cursor + span);
      cursor += span;
    });
  }

  const macros = nodes.filter((n) => n.tipo === "macro");
  const totalLeaves = macros.reduce((sum, m) => sum + leafCount(m.id), 0) || 1;
  let cursor = 0;
  macros.forEach((macro) => {
    const span = 360 * (leafCount(macro.id) / totalLeaves);
    place(macro.id, cursor, cursor + span);
    cursor += span;
  });

  return positions;
}
