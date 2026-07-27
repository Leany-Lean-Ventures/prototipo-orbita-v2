import { ESTADOS, UFS, UFS_POR_REGIAO, ehRegiao, ehUF, type Regiao, type UF } from "./estados";

/**
 * Seleção do Mapa da Rede — dirige o filtro de todo o Dashboard. Serializada
 * na URL (`?nivel=estados&uf=SP`) seguindo a convenção do projeto de
 * "filtros de lista sempre na URL" (ver `UnidadesLista.tsx`), o que torna
 * o Dashboard deep-linkável.
 */
export type MapSelection =
  | { nivel: "global" }
  | { nivel: "regioes"; regiao: Regiao | null }
  | { nivel: "estados"; uf: UF | null };

export const SELECAO_GLOBAL: MapSelection = { nivel: "global" };

/** UFs cobertas pela seleção. Global e nível sem item selecionado → todas as 27. */
export function ufsDaSelecao(sel: MapSelection): readonly UF[] {
  if (sel.nivel === "global") return UFS;
  if (sel.nivel === "regioes") return sel.regiao ? UFS_POR_REGIAO[sel.regiao] : UFS;
  return sel.uf ? [sel.uf] : UFS;
}

/** "Brasil" · "Região Sudeste" · "São Paulo (SP)" */
export function rotuloSelecao(sel: MapSelection): string {
  if (sel.nivel === "global") return "Brasil";
  if (sel.nivel === "regioes") return sel.regiao ? `Região ${sel.regiao}` : "Brasil";
  return sel.uf ? `${ESTADOS[sel.uf].nome} (${sel.uf})` : "Brasil";
}

/** Rótulo curto p/ chips e subtítulos: "Brasil" · "Sudeste" · "SP" */
export function rotuloCurto(sel: MapSelection): string {
  if (sel.nivel === "global") return "Brasil";
  if (sel.nivel === "regioes") return sel.regiao ?? "Brasil";
  return sel.uf ?? "Brasil";
}

export function selecaoDaURL(params: URLSearchParams): MapSelection {
  const nivel = params.get("nivel");
  if (nivel === "regioes") {
    const regiao = params.get("regiao");
    return { nivel: "regioes", regiao: regiao && ehRegiao(regiao) ? regiao : null };
  }
  if (nivel === "estados") {
    const uf = params.get("uf");
    return { nivel: "estados", uf: uf && ehUF(uf) ? uf : null };
  }
  return SELECAO_GLOBAL;
}

export function paramsDaSelecao(sel: MapSelection): Record<string, string> {
  if (sel.nivel === "global") return {};
  if (sel.nivel === "regioes") return sel.regiao ? { nivel: "regioes", regiao: sel.regiao } : { nivel: "regioes" };
  return sel.uf ? { nivel: "estados", uf: sel.uf } : { nivel: "estados" };
}
