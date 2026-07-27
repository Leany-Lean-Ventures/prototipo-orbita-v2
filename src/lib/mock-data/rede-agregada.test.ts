import { describe, it, expect } from "vitest";
import { REGIOES, UFS, UFS_POR_REGIAO } from "@/lib/geo/estados";
import { REDE_POR_UF } from "./rede-por-uf";
import {
  REDE_GLOBAL,
  REDE_POR_REGIAO,
  agregar,
  CRITERIOS_360,
} from "./rede-agregada";

describe("rede-agregada — aditividade", () => {
  it("total global de lojas === 312", () => {
    expect(REDE_GLOBAL.lojas).toBe(312);
  });

  const campos = ["lojas", "pvs", "consultores", "previas"] as const;

  it("soma das 5 regiões === global (lojas/pvs/consultores/prévias)", () => {
    for (const campo of campos) {
      const somaRegioes = REGIOES.reduce((acc, r) => acc + REDE_POR_REGIAO[r][campo], 0);
      expect(somaRegioes, `campo ${campo}`).toBe(REDE_GLOBAL[campo]);
    }
  });

  it("soma das 27 UFs === global (lojas/pvs/consultores/prévias)", () => {
    for (const campo of campos) {
      const somaUFs = UFS.reduce((acc, uf) => acc + REDE_POR_UF[uf][campo], 0);
      expect(somaUFs, `campo ${campo}`).toBe(REDE_GLOBAL[campo]);
    }
  });

  it("soma das séries de ocorrências das regiões === global", () => {
    for (let i = 0; i < 6; i++) {
      const somaAbertas = REGIOES.reduce((acc, r) => acc + REDE_POR_REGIAO[r].ocorrenciasAbertas[i], 0);
      const somaResolvidas = REGIOES.reduce((acc, r) => acc + REDE_POR_REGIAO[r].ocorrenciasResolvidas[i], 0);
      expect(somaAbertas, `abertas[${i}]`).toBe(REDE_GLOBAL.ocorrenciasAbertas[i]);
      expect(somaResolvidas, `resolvidas[${i}]`).toBe(REDE_GLOBAL.ocorrenciasResolvidas[i]);
    }
  });

  it("totais globais dentro de ±3% dos valores históricos", () => {
    const historico = { pvs: 1842, consultores: 8420, previas: 1847 };
    for (const [campo, ref] of Object.entries(historico) as [keyof typeof historico, number][]) {
      const v = REDE_GLOBAL[campo];
      expect(v, campo).toBeGreaterThanOrEqual(ref * 0.97);
      expect(v, campo).toBeLessThanOrEqual(ref * 1.03);
    }
  });

  it("regiaoDaUF cobre todas as 27 UFs e soma === 27", () => {
    const totalMapeado = REGIOES.reduce((acc, r) => acc + UFS_POR_REGIAO[r].length, 0);
    expect(totalMapeado).toBe(27);
  });

  it("avaliação ponderada de UF isolada === scores crus da UF", () => {
    const sp = agregar({ nivel: "estados", uf: "SP" });
    const spRaw = REDE_POR_UF["SP"].avaliacao360;
    // Com apenas uma UF, a ponderação devolve os scores dela própria
    expect(sp.avaliacao360).toEqual(spRaw);
  });

  it("CRITERIOS_360 tem exatamente 4 itens", () => {
    expect(CRITERIOS_360.length).toBe(4);
  });

  it("nenhuma UF tem lojas negativas", () => {
    for (const uf of UFS) {
      expect(REDE_POR_UF[uf].lojas).toBeGreaterThanOrEqual(0);
    }
  });
});
