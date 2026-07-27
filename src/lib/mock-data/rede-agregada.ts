import {
  REGIOES, UFS, UFS_POR_REGIAO,
  type Regiao, type UF,
} from "@/lib/geo/estados";
import { ufsDaSelecao, type MapSelection } from "@/lib/geo/selection";
import { REDE_POR_UF, type RedePorUF } from "./rede-por-uf";
import type { Kpi, KpiColorTheme } from "./dashboard";
import { Store, Building2, Users, ClipboardList, type LucideIcon } from "lucide-react";

/**
 * Camada de agregação de rede — transforma a seleção do mapa em KPIs e
 * séries prontas para renderização. Toda a coerência é garantida por
 * construção: Global = soma das 27 UFs, Região = soma das suas UFs,
 * Estado = a própria UF — não existe "clicar em SP e ver 312 lojas acima".
 */

// ─── Tipos agregados ────────────────────────────────────────────────────────

export interface RedeAgregada {
  lojas: number;
  pvs: number;
  consultores: number;
  previas: number;
  metaLojas: number;
  /** Série de 6 meses: [Jan, Fev, Mar, Abr, Mai, Jun] */
  ocorrenciasAbertas: readonly number[];
  ocorrenciasResolvidas: readonly number[];
  /** Scores 0–100 nos 4 critérios: [gestão, atendimento, comunicação, financeiro] */
  avaliacao360: readonly [number, number, number, number];
}

export interface KpiDerived extends Kpi {
  value: number;
  progressPct: number;
  goalText: string;
}

// ─── Rótulos dos meses ──────────────────────────────────────────────────────

export const MESES_SERIE = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"] as const;
export const CRITERIOS_360 = ["Gestão", "Atendimento", "Comunicação", "Financeiro"] as const;

// ─── Global pré-calculado (soma das 27 UFs) ─────────────────────────────────

function somarUFs(ufs: readonly UF[]): RedeAgregada {
  let lojas = 0, pvs = 0, consultores = 0, previas = 0, metaLojas = 0;
  const abertas = [0, 0, 0, 0, 0, 0];
  const resolvidas = [0, 0, 0, 0, 0, 0];
  let somaPeso = 0;
  const somaScores: [number, number, number, number] = [0, 0, 0, 0];

  for (const uf of ufs) {
    const r: RedePorUF = REDE_POR_UF[uf];
    lojas += r.lojas;
    pvs += r.pvs;
    consultores += r.consultores;
    previas += r.previas;
    metaLojas += r.metaLojas;
    for (let i = 0; i < 6; i++) {
      abertas[i] += r.ocorrenciasAbertas[i];
      resolvidas[i] += r.ocorrenciasResolvidas[i];
    }
    if (r.lojas > 0) {
      somaPeso += r.lojas;
      for (let c = 0; c < 4; c++) {
        somaScores[c] += r.avaliacao360[c] * r.lojas;
      }
    }
  }

  const avaliacao360: [number, number, number, number] =
    somaPeso > 0
      ? [
          Math.round(somaScores[0] / somaPeso),
          Math.round(somaScores[1] / somaPeso),
          Math.round(somaScores[2] / somaPeso),
          Math.round(somaScores[3] / somaPeso),
        ]
      : [0, 0, 0, 0];

  return {
    lojas, pvs, consultores, previas, metaLojas,
    ocorrenciasAbertas: abertas as readonly number[],
    ocorrenciasResolvidas: resolvidas as readonly number[],
    avaliacao360,
  };
}

export const REDE_GLOBAL: RedeAgregada = somarUFs(UFS);

/** Pré-calcula por região para não recomputar a cada render. */
export const REDE_POR_REGIAO: Record<Regiao, RedeAgregada> = Object.fromEntries(
  REGIOES.map((r) => [r, somarUFs(UFS_POR_REGIAO[r])])
) as Record<Regiao, RedeAgregada>;

// ─── API pública ─────────────────────────────────────────────────────────────

/** Agrega os dados da rede para a seleção do mapa. */
export function agregar(sel: MapSelection): RedeAgregada {
  if (sel.nivel === "global") return REDE_GLOBAL;
  if (sel.nivel === "regioes") {
    if (!sel.regiao) return REDE_GLOBAL;
    return REDE_POR_REGIAO[sel.regiao];
  }
  // estados
  if (!sel.uf) return REDE_GLOBAL;
  return somarUFs([sel.uf]);
}

// ─── KPI Templates → KPIs derivados ─────────────────────────────────────────

interface KpiTemplate {
  id: string;
  label: string;
  icon: LucideIcon;
  colorTheme: KpiColorTheme;
  route: string;
  campo: keyof Pick<RedeAgregada, "lojas" | "pvs" | "consultores" | "previas">;
  campMeta: keyof Pick<RedeAgregada, "metaLojas"> | null;
  goalLabel: (v: number, g: number | null) => string;
}

const KPI_TEMPLATES: readonly KpiTemplate[] = [
  {
    id: "k1",
    label: "Lojas ativas",
    icon: Store,
    colorTheme: "maroon",
    route: "/unidades",
    campo: "lojas",
    campMeta: "metaLojas",
    goalLabel: (v, g) => `meta ${g ?? v + 8}`,
  },
  {
    id: "k4",
    label: "PVs",
    icon: Building2,
    colorTheme: "violet",
    route: "/pvs",
    campo: "pvs",
    campMeta: null,
    goalLabel: (v) => `+${Math.round(v * 0.018)} no mês`,
  },
  {
    id: "k2",
    label: "Consultores",
    icon: Users,
    colorTheme: "green",
    route: "/consultores",
    campo: "consultores",
    campMeta: null,
    goalLabel: (v) => `+${Math.round(v * 0.017)} no mês`,
  },
  {
    id: "k3",
    label: "Em prévia",
    icon: ClipboardList,
    colorTheme: "amber",
    route: "/previas",
    campo: "previas",
    campMeta: null,
    goalLabel: () => "SLA 2,1d · meta 3d",
  },
] as const;

/** KPIs derivados da seleção do mapa — valores coerentes por construção. */
export function kpisDaSelecao(rede: RedeAgregada): KpiDerived[] {
  return KPI_TEMPLATES.map((t) => {
    const value = rede[t.campo];
    const meta = t.campMeta ? rede[t.campMeta] : null;
    const progressPct = meta ? Math.min(100, Math.round((value / meta) * 100)) : 70;
    const goalText = t.goalLabel(value, meta);

    return {
      id: t.id,
      label: t.label,
      icon: t.icon,
      colorTheme: t.colorTheme,
      route: t.route,
      isAlert: false,
      hasTrendUp: t.campo === "pvs" || t.campo === "consultores",
      value,
      goalText,
      progressPct,
    } satisfies KpiDerived;
  });
}

// ─── Ranking ─────────────────────────────────────────────────────────────────

export interface RankingRow {
  id: string;         // UF ou nome de Regiao
  label: string;      // nome de exibição
  lojas: number;
  isHighlighted: boolean;
}

/** Linhas do RankingCard conforme a seleção. */
export function rankingDaSelecao(sel: MapSelection): RankingRow[] {
  // Global ou Regiões sem seleção → 5 regiões
  if (sel.nivel === "global" || (sel.nivel === "regioes" && !sel.regiao)) {
    return REGIOES.map((r) => ({
      id: r,
      label: r,
      lojas: REDE_POR_REGIAO[r].lojas,
      isHighlighted: sel.nivel === "regioes" && sel.regiao === r,
    })).sort((a, b) => b.lojas - a.lojas);
  }

  // Região X → UFs com cobertura de X
  if (sel.nivel === "regioes" && sel.regiao) {
    return UFS_POR_REGIAO[sel.regiao]
      .filter((uf) => REDE_POR_UF[uf].lojas > 0)
      .map((uf) => ({
        id: uf,
        label: `${uf}`,
        lojas: REDE_POR_UF[uf].lojas,
        isHighlighted: false,
      }))
      .sort((a, b) => b.lojas - a.lojas);
  }

  // Estados sem seleção → todas as UFs com cobertura
  if (sel.nivel === "estados" && !sel.uf) {
    return UFS
      .filter((uf) => REDE_POR_UF[uf].lojas > 0)
      .map((uf) => ({ id: uf, label: uf, lojas: REDE_POR_UF[uf].lojas, isHighlighted: false }))
      .sort((a, b) => b.lojas - a.lojas);
  }

  // Estado Y → UFs da região de Y, Y em destaque
  const { uf } = sel as { uf: UF; nivel: "estados" };
  const regiaoUF = REDE_POR_UF[uf].lojas > 0
    ? UFS_POR_REGIAO[
        REGIOES.find((r) => UFS_POR_REGIAO[r].includes(uf))!
      ]
    : ufsDaSelecao({ nivel: "estados", uf });

  const contexto = Array.from(
    new Set([uf, ...regiaoUF])
  ).filter((u) => REDE_POR_UF[u].lojas > 0);

  return contexto
    .map((u) => ({
      id: u,
      label: u,
      lojas: REDE_POR_UF[u].lojas,
      isHighlighted: u === uf,
    }))
    .sort((a, b) => b.lojas - a.lojas);
}
