import { unidadesList, unidadesDetalhe } from "./unidades";
import { regiaoDaUF, REGIOES, type UF } from "@/lib/geo/estados";

/**
 * Grafo do "Mapa de Vínculos da Rede" (aba de `UnidadesLista.tsx`) — não
 * especificado em nenhum PRD, origem em `PRD/prototipo-base.html` (rota
 * `/mapa`, função `Rede()`). Ver decisão em MEMORY.md.
 *
 * Deriva de `unidadesList`/`unidadesDetalhe` em vez de manter um mock
 * paralelo: macrorregião é a única camada nova (agrupamento por UF); PVs
 * vêm de `organizacional` (depth >= 1) e consultores de
 * `consultoresVinculados`. Como o schema atual não liga consultor→PV,
 * cada consultor é distribuído round-robin entre os PVs da própria
 * unidade (ou direto na unidade, se ela não tiver PV) — decisão só de
 * apresentação do grafo, não altera `UnidadeDetalhe`.
 */

export type VinculoNodeType = "macro" | "unidade" | "pv" | "consultor";

export interface VinculoNode {
  id: string;
  tipo: VinculoNodeType;
  label: string;
  sublabel: string;
  parentId: string | null;
  meta: Record<string, string | number>;
  /** Presente em nós "unidade" — navega de verdade para /unidades/:id. */
  unidadeId?: string;
}

export interface VinculoEdge {
  from: string;
  to: string;
}

export interface VinculosGraphData {
  nodes: VinculoNode[];
  edges: VinculoEdge[];
}

function macroId(nome: string): string {
  return `macro-${nome.toLowerCase().replace(/\s+/g, "-")}`;
}

function buildVinculosGraph(): VinculosGraphData {
  const nodes: VinculoNode[] = [];
  const edges: VinculoEdge[] = [];

  const unidadesPorMacro = new Map<string, typeof unidadesList>();
  unidadesList.forEach((unidade) => {
    const macro = regiaoDaUF(unidade.estado as UF);
    const lista = unidadesPorMacro.get(macro) ?? [];
    lista.push(unidade);
    unidadesPorMacro.set(macro, lista);
  });

  REGIOES.filter((macro) => unidadesPorMacro.has(macro)).forEach((macro) => {
    const unidadesDaMacro = unidadesPorMacro.get(macro)!;
    const id = macroId(macro);
    const ratingMedio = Math.round(
      unidadesDaMacro.reduce((soma, u) => soma + u.ratingScore, 0) / unidadesDaMacro.length
    );

    nodes.push({
      id,
      tipo: "macro",
      label: macro,
      sublabel: `${unidadesDaMacro.length} unidade${unidadesDaMacro.length > 1 ? "s" : ""}`,
      parentId: null,
      meta: { unidades: unidadesDaMacro.length, ratingMedio },
    });

    unidadesDaMacro.forEach((unidade) => {
      nodes.push({
        id: unidade.id,
        tipo: "unidade",
        label: unidade.nome,
        sublabel: `${unidade.cidade}/${unidade.estado}`,
        parentId: id,
        unidadeId: unidade.id,
        meta: {
          rating: unidade.rating,
          ratingScore: unidade.ratingScore,
          status: unidade.status,
          dono: unidade.dono,
        },
      });
      edges.push({ from: id, to: unidade.id });

      const detalhe = unidadesDetalhe[unidade.id];
      if (!detalhe) return;

      const pvs = detalhe.organizacional.filter((n) => n.depth >= 1);
      pvs.forEach((pv) => {
        nodes.push({
          id: pv.id,
          tipo: "pv",
          label: pv.nome,
          sublabel: pv.nivelLabel,
          parentId: unidade.id,
          unidadeId: unidade.id,
          meta: { responsavel: pv.responsavel, nivel: pv.nivelLabel, unidade: unidade.nome },
        });
        edges.push({ from: unidade.id, to: pv.id });
      });

      detalhe.consultoresVinculados.forEach((consultor, index) => {
        const parentId = pvs.length > 0 ? pvs[index % pvs.length].id : unidade.id;
        nodes.push({
          id: consultor.id,
          tipo: "consultor",
          label: consultor.razaoSocial,
          sublabel: consultor.nivel,
          parentId,
          unidadeId: unidade.id,
          meta: {
            matricula: consultor.matricula,
            nivel: consultor.nivel,
            carteiras: consultor.carteiraQtd,
            unidade: unidade.nome,
          },
        });
        edges.push({ from: parentId, to: consultor.id });
      });
    });
  });

  return { nodes, edges };
}

export const vinculosGraph: VinculosGraphData = buildVinculosGraph();

export const VINCULO_TIPO_LABEL: Record<VinculoNodeType, string> = {
  macro: "Macrorregião",
  unidade: "Unidade",
  pv: "PV",
  consultor: "Consultor",
};
