import { ESTADOS, UFS_POR_REGIAO, type Ponto, type Regiao, type UF } from "./estados";

const R_MAX = 34;
const R_MIN = 6;

/**
 * Raio da bolha — escala de ÁREA (sqrt), não linear. Uma escala linear faria
 * estados pequenos parecerem desproporcionalmente maiores do que são.
 * Verificado sem colisão entre pares de UF nesta escala (único par apertado,
 * DF↔GO, resolvido via `bubbleOffset` em estados.ts).
 */
export function raioBolha(valor: number, maxValor: number): number {
  if (valor <= 0 || maxValor <= 0) return 0;
  return Math.max(R_MIN, R_MAX * Math.sqrt(valor / maxValor));
}

/** Posição de renderização da bolha — centroide real, exceto onde `bubbleOffset` (só DF) desloca. */
export function posicaoBolha(uf: UF): Ponto {
  const estado = ESTADOS[uf];
  if (!estado.bubbleOffset) return estado.centroide;
  return {
    x: estado.centroide.x + estado.bubbleOffset.x,
    y: estado.centroide.y + estado.bubbleOffset.y,
  };
}

/** Centroide de uma região, ponderado pelo peso (nº de lojas) de cada UF membro. */
export function centroideRegiao(regiao: Regiao, pesos: Record<UF, number>): Ponto {
  const ufs = UFS_POR_REGIAO[regiao];
  let somaPeso = 0;
  let somaX = 0;
  let somaY = 0;
  for (const uf of ufs) {
    const peso = pesos[uf] ?? 0;
    if (peso <= 0) continue;
    const c = ESTADOS[uf].centroide;
    somaPeso += peso;
    somaX += c.x * peso;
    somaY += c.y * peso;
  }
  if (somaPeso === 0) {
    // Sem cobertura na região: centroide geométrico simples dos membros.
    const n = ufs.length;
    const soma = ufs.reduce(
      (acc, uf) => ({ x: acc.x + ESTADOS[uf].centroide.x, y: acc.y + ESTADOS[uf].centroide.y }),
      { x: 0, y: 0 }
    );
    return { x: soma.x / n, y: soma.y / n };
  }
  return { x: somaX / somaPeso, y: somaY / somaPeso };
}
