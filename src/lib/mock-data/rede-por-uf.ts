import type { UF } from "@/lib/geo/estados";

/**
 * Fonte única de verdade dos dados da rede por UF.
 *
 * Único dado autoral: `LOJAS_POR_UF` (soma = 312, valor histórico do KPI).
 * Todos os outros campos são derivados deterministicamente a partir do nº de
 * lojas e de um seed estável da sigla — mesmo padrão de gerarChecklist(seed)
 * usado em visitas.ts.
 *
 * As 12 UFs ausentes (Norte inteiro + AL/MA/PB/PI/SE) têm zero em tudo —
 * representa a cobertura real da rede.
 */

/** Único dado autoral. Soma = 312. */
const LOJAS_POR_UF: Partial<Record<UF, number>> = {
  SP: 84, MG: 38, PR: 30, RS: 28, RJ: 26, SC: 22, BA: 14, GO: 13,
  DF: 11, PE: 10, CE: 9, ES: 8, MT: 7, MS: 6, RN: 6,
};

/** Seed numérico estável baseado na sigla (evita Magic Numbers inline). */
function seedDaSigla(uf: UF): number {
  return uf.charCodeAt(0) * 31 + uf.charCodeAt(1);
}

/** Pseudo-random simples: LCG com seed. Range [0, 1). */
function prng(seed: number, index: number): number {
  const n = (seed * 1664525 + index * 1013904223 + 1013904223) >>> 0;
  return n / 0xffffffff;
}

export interface RedePorUF {
  uf: UF;
  lojas: number;
  pvs: number;
  consultores: number;
  previas: number;
  metaLojas: number;
  /** Série de 6 meses: [Jan, Fev, Mar, Abr, Mai, Jun] */
  ocorrenciasAbertas: readonly number[];
  /** Série de 6 meses: [Jan, Fev, Mar, Abr, Mai, Jun] */
  ocorrenciasResolvidas: readonly number[];
  /** Scores de avaliação 360 em 4 critérios: [gestão, atendimento, comunicação, financeiro] */
  avaliacao360: readonly [number, number, number, number];
}

function derivarUF(uf: UF): RedePorUF {
  const lojas = LOJAS_POR_UF[uf] ?? 0;
  const s = seedDaSigla(uf);

  if (lojas === 0) {
    return {
      uf,
      lojas: 0,
      pvs: 0,
      consultores: 0,
      previas: 0,
      metaLojas: 0,
      ocorrenciasAbertas: [0, 0, 0, 0, 0, 0],
      ocorrenciasResolvidas: [0, 0, 0, 0, 0, 0],
      avaliacao360: [0, 0, 0, 0],
    };
  }

  // PVs: lojas × multiplicador no intervalo [5.4, 6.4]
  const multPvs = 5.4 + prng(s, 1) * 1.0;
  const pvs = Math.round(lojas * multPvs);

  // Consultores: pvs × multiplicador no intervalo [4.2, 4.9]
  const multConsultores = 4.2 + prng(s, 2) * 0.7;
  const consultores = Math.round(pvs * multConsultores);

  // Prévias: lojas × multiplicador no intervalo [5.1, 5.9]
  const multPrevias = 5.1 + prng(s, 3) * 0.8;
  const previas = Math.round(lojas * multPrevias);

  // Meta de lojas: ceil(lojas × 1.026)
  const metaLojas = Math.ceil(lojas * 1.026);

  // Ocorrências por mês — escala proporcional ao tamanho da rede
  const ocorrenciasAbertas = Array.from({ length: 6 }, (_, i) =>
    Math.max(0, Math.round(lojas * (0.08 + prng(s, 10 + i) * 0.06)))
  ) as readonly number[];

  const ocorrenciasResolvidas = Array.from({ length: 6 }, (_, i) =>
    Math.max(0, Math.round(ocorrenciasAbertas[i] * (0.6 + prng(s, 20 + i) * 0.35)))
  ) as readonly number[];

  // Avaliação 360 — 4 critérios: gestão, atendimento, comunicação, financeiro
  // Comunicação é o ponto fraco sistemático (coerente com unidadesDetalhe.L001: 96/82/98/95)
  const gestao = Math.round(75 + prng(s, 30) * 22);
  const atendimento = Math.round(78 + prng(s, 31) * 18);
  const comunicacao = Math.round(68 + prng(s, 32) * 18); // propositalmente menor
  const financeiro = Math.round(72 + prng(s, 33) * 24);
  const avaliacao360 = [gestao, atendimento, comunicacao, financeiro] as [number, number, number, number];

  return { uf, lojas, pvs, consultores, previas, metaLojas, ocorrenciasAbertas, ocorrenciasResolvidas, avaliacao360 };
}

/** Todas as 27 UFs. UFs sem cobertura têm zeros em todos os campos. */
export const REDE_POR_UF: Record<UF, RedePorUF> = (() => {
  const UFS: readonly UF[] = [
    "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO",
    "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR",
    "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO",
  ];
  return Object.fromEntries(UFS.map((uf) => [uf, derivarUF(uf)])) as Record<UF, RedePorUF>;
})();
