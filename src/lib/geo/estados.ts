import { BRAZIL_NOMES } from "./brazil-map-paths";

/**
 * Tabela canônica das 27 UFs — único mapa estado→região do projeto.
 * Centroides calculados a partir da geometria real dos paths de
 * `brazil-map-paths.ts` (centroide de área do maior sub-path de cada
 * estado), no mesmo espaço de coordenadas do BRAZIL_VIEWBOX.
 */

export type UF =
  | "AC" | "AL" | "AM" | "AP" | "BA" | "CE" | "DF" | "ES" | "GO"
  | "MA" | "MG" | "MS" | "MT" | "PA" | "PB" | "PE" | "PI" | "PR"
  | "RJ" | "RN" | "RO" | "RR" | "RS" | "SC" | "SE" | "SP" | "TO";

export type Regiao = "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul";

export interface Ponto {
  x: number;
  y: number;
}

export interface EstadoGeo {
  uf: UF;
  nome: string;
  regiao: Regiao;
  /** Centroide de área do maior sub-path, no espaço do BRAZIL_VIEWBOX. */
  centroide: Ponto;
  /** Deslocamento manual da bolha quando o centroide real colide com o vizinho (só DF). */
  bubbleOffset?: Ponto;
}

const REGIAO_POR_UF: Record<UF, Regiao> = {
  AC: "Norte", AM: "Norte", AP: "Norte", PA: "Norte", RO: "Norte", RR: "Norte", TO: "Norte",
  AL: "Nordeste", BA: "Nordeste", CE: "Nordeste", MA: "Nordeste", PB: "Nordeste",
  PE: "Nordeste", PI: "Nordeste", RN: "Nordeste", SE: "Nordeste",
  DF: "Centro-Oeste", GO: "Centro-Oeste", MS: "Centro-Oeste", MT: "Centro-Oeste",
  ES: "Sudeste", MG: "Sudeste", RJ: "Sudeste", SP: "Sudeste",
  PR: "Sul", RS: "Sul", SC: "Sul",
};

/** Centroides de área do maior sub-path, no espaço 612.51611 × 639.04297. */
const CENTROIDE_POR_UF: Record<UF, Ponto> = {
  AC: { x: 55.3, y: 227.0 }, AL: { x: 583.6, y: 230.3 }, AM: { x: 145.2, y: 147.3 },
  AP: { x: 344.1, y: 59.7 }, BA: { x: 504.3, y: 277.5 }, CE: { x: 537.2, y: 161.5 },
  DF: { x: 409.4, y: 329.8 }, ES: { x: 520.5, y: 391.8 }, GO: { x: 381.2, y: 333.9 },
  MA: { x: 448.3, y: 161.4 }, MG: { x: 458.0, y: 373.9 }, MS: { x: 299.5, y: 404.7 },
  MT: { x: 282.5, y: 285.4 }, PA: { x: 323.9, y: 147.3 }, PB: { x: 580.6, y: 192.8 },
  PE: { x: 562.4, y: 211.7 }, PI: { x: 484.6, y: 197.2 }, PR: { x: 349.6, y: 476.7 },
  RJ: { x: 489.5, y: 435.2 }, RN: { x: 582.8, y: 172.9 }, RO: { x: 174.5, y: 252.6 },
  RR: { x: 197.0, y: 50.0 }, RS: { x: 323.1, y: 566.1 }, SC: { x: 367.1, y: 521.8 },
  SE: { x: 570.8, y: 247.1 }, SP: { x: 394.9, y: 436.6 }, TO: { x: 401.1, y: 240.1 },
};

/** DF tem ~6px de largura na tela — a bolha real seria alvo inviável de clique/toque
 * e colide com a de GO (folga de apenas 2,8px em R_MAX). Deslocada para nordeste,
 * com uma linha-guia até o centroide real desenhada pelo componente. */
const DF_BUBBLE_OFFSET: Ponto = { x: 18, y: -12 };

function construirEstados(): Record<UF, EstadoGeo> {
  const ufs = Object.keys(REGIAO_POR_UF) as UF[];
  const out = {} as Record<UF, EstadoGeo>;
  for (const uf of ufs) {
    out[uf] = {
      uf,
      nome: BRAZIL_NOMES[uf],
      regiao: REGIAO_POR_UF[uf],
      centroide: CENTROIDE_POR_UF[uf],
      ...(uf === "DF" ? { bubbleOffset: DF_BUBBLE_OFFSET } : {}),
    };
  }
  return out;
}

export const ESTADOS: Record<UF, EstadoGeo> = construirEstados();

/** Ordem de leitura geográfica N→S, O→L — usada pela navegação por teclado. */
export const UFS: readonly UF[] = [
  "AC", "AM", "RR", "AP", "PA", "RO", "TO",
  "MA", "PI", "CE", "RN", "PB", "PE", "AL", "SE", "BA",
  "MT", "MS", "GO", "DF",
  "MG", "ES", "SP", "RJ",
  "PR", "SC", "RS",
];

export const REGIOES: readonly Regiao[] = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];

export const UFS_POR_REGIAO: Record<Regiao, readonly UF[]> = REGIOES.reduce((acc, regiao) => {
  acc[regiao] = UFS.filter((uf) => REGIAO_POR_UF[uf] === regiao);
  return acc;
}, {} as Record<Regiao, UF[]>);

/** Total nas 27 UFs — sem fallback "Outras". */
export function regiaoDaUF(uf: UF): Regiao {
  return REGIAO_POR_UF[uf];
}

export function ehUF(valor: string): valor is UF {
  return valor in REGIAO_POR_UF;
}

export function ehRegiao(valor: string): valor is Regiao {
  return (REGIOES as readonly string[]).includes(valor);
}
