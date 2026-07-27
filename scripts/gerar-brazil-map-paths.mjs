// Gerador one-off — não faz parte do pipeline de build.
// Lê src/assets/brazil.svg (27 <path id="BR-XX" title="Nome" d="...">) e
// emite src/lib/geo/brazil-map-paths.ts (BRAZIL_VIEWBOX + BRAZIL_PATHS).
// Rodar à mão se o SVG de origem mudar: node scripts/gerar-brazil-map-paths.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const svgPath = path.join(__dirname, "..", "src", "assets", "brazil.svg");
const outPath = path.join(__dirname, "..", "src", "lib", "geo", "brazil-map-paths.ts");

const svg = readFileSync(svgPath, "utf-8");

const widthMatch = svg.match(/width="([\d.]+)"/);
const heightMatch = svg.match(/height="([\d.]+)"/);
const width = widthMatch[1];
const height = heightMatch[1];

const pathRegex = /<path\b([^>]*)\/>/g;
const attrRegex = /(\w[\w-]*)="([^"]*)"/g;

const entries = [];
let m;
while ((m = pathRegex.exec(svg))) {
  const attrsStr = m[1];
  const attrs = {};
  let a;
  while ((a = attrRegex.exec(attrsStr))) {
    attrs[a[1]] = a[2];
  }
  if (!attrs.id || !attrs.d) continue;
  const uf = attrs.id.replace("BR-", "");
  entries.push({ uf, nome: attrs.title ?? uf, d: attrs.d });
}

entries.sort((a, b) => a.uf.localeCompare(b.uf));

if (entries.length !== 27) {
  console.error(`Esperado 27 estados, encontrado ${entries.length}. Abortando.`);
  process.exit(1);
}

const header = `/**
 * GERADO AUTOMATICAMENTE por scripts/gerar-brazil-map-paths.mjs
 * a partir de src/assets/brazil.svg (fonte: primeiro protótipo Órbita,
 * plugin MapSVG). Não editar à mão — rodar o gerador novamente se o SVG
 * de origem mudar.
 */
import type { UF } from "./estados";

/** viewBox original do SVG de origem — usar sempre este valor no <svg>. */
export const BRAZIL_VIEWBOX = "0 0 ${width} ${height}";

/** Um \`d\` de <path> por UF, sem o atributo \`style\` inline do SVG original
 * (que teria prioridade sobre qualquer fill definido via CSS/style prop). */
export const BRAZIL_PATHS: Record<UF, string> = {
`;

const body = entries
  .map((e) => `  ${e.uf}: "${e.d}",`)
  .join("\n");

const footer = `\n};\n\n/** Nome por extenso de cada UF, extraído do atributo \`title\` do SVG. */
export const BRAZIL_NOMES: Record<UF, string> = {
${entries.map((e) => `  ${e.uf}: ${JSON.stringify(e.nome)},`).join("\n")}
};
`;

writeFileSync(outPath, header + body + footer, "utf-8");
console.log(`Gerado ${outPath} com ${entries.length} estados.`);
