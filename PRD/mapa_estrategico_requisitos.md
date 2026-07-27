Ready for review
Select text to add comments on the plan
Refatoração completa do Dashboard — Mapa do Brasil como filtro global
Contexto
O Dashboard atual é uma colagem de cards sem um elemento central: 4 KPIs, um gráfico de ocorrências, 3 mini-cards de esteira e duas listas. Os números do topo (312 lojas, 1.842 PVs, 8.420 consultores, 1.847 prévias) são constantes hard-coded que não têm relação com nenhum dado do sistema, e não existe nenhuma leitura geográfica da rede.

A refatoração introduz um mapa do Brasil interativo como elemento central e filtro global: o usuário seleciona Brasil / região / estado e todos os cards da página se atualizam. O mapa acumula duas funções — filtro e visualização de povoamento da rede (bubble map).

Base geográfica reaproveitada do primeiro protótipo, conforme pedido: prototipo-orbita-v1/src/assets/brazil.svg (27 paths, id="BR-XX", title com o nome do estado).

Decisões já tomadas com o usuário
#	Decisão
1	Dados mock cobrem 15 UFs (SP, RJ, MG, ES, PR, SC, RS, GO, DF, MT, MS, BA, PE, CE, RN). Norte inteiro + AL/MA/PB/PI/SE ficam zerados de propósito — representa a cobertura real da rede.
2	O mapa é filtro. Isso contraria PRD/mapa_estrategico_requisitos.md §1 e §9 (que dizem "não é mais filtro" e põem bolha fora de escopo). O PRD fica intacto como registro histórico; a mudança é anotada no MEMORY.md.
3	Bolha por estado, no centroide, tamanho proporcional ao nº de lojas.
4	Fundo dos estados neutro — a cor indica apenas hover/seleção (e agrupamento no nível Regiões). Sem escala choropleth; as bolhas carregam a informação.
5	Estados sem cobertura não são clicáveis (cinza neutro, tooltip "Sem cobertura da rede", fora da navegação por teclado).
6	Card Avaliação 360 = radar ApexCharts com os 4 critérios.
7	Gráfico de ocorrências: mesmas barras, recoloridas para vermelho + cinza.
Consequência explícita do novo layout
O wireframe (PRD/DASHBOARD.png) tem 3 linhas apenas. Portanto saem do Dashboard: os 3 mini-cards de esteira (Prévias em análise / Abertura de Unidades / Promoção de Consultores) e as duas listas (Ocorrências pendentes / Penalidades ativas na rede). Os atalhos para as esteiras continuam existindo no menu lateral. Se quiser preservar algum deles, é o momento de dizer.

Arquitetura
Princípio central: os KPIs passam a ser derivados
Hoje os KPIs são constantes. Passam a ser a soma dos estados dentro da seleção — Global = soma das 27 UFs, Região = soma das suas UFs, Estado = a própria UF. Assim a coerência é garantida por construção (não existe "clicar em SP e ver 2 lojas embaixo de um KPI de 312"). A tabela por UF é calibrada para o total global cair em 312 / ~1842 / ~8420 / ~1847, mantendo continuidade visual com o que já está na tela.

goalText e progressPct também precisam ser derivados — selecionar RN e continuar lendo "meta 320" com barra em 98% quebraria a ilusão inteira.

Arquivos novos
Caminho	Responsabilidade
src/assets/brazil.svg	Cópia do SVG da v1 (a pasta prototipo-orbita-v1/ está no .gitignore, então o asset precisa ser versionado aqui).
scripts/gerar-brazil-map-paths.mjs	Gerador one-off: lê o SVG e emite o módulo TS abaixo. Fora do pipeline de build; rodar à mão se o SVG mudar.
src/lib/geo/brazil-map-paths.ts	Gerado e commitado. BRAZIL_VIEWBOX + BRAZIL_PATHS: Record<UF, string>. Sem lógica. ~64 KB.
src/lib/geo/estados.ts	Tabela canônica das 27 UFs: nome, região, centroide, bubbleOffset?. Único mapa estado→região do projeto.
src/lib/geo/selection.ts	MapSelection + helpers puros (ufsDaSelecao, rotuloSelecao, serialização para URL).
src/lib/geo/bubble-layout.ts	raioBolha() (escala sqrt, área-proporcional) e posicaoBolha().
src/lib/mock-data/rede-por-uf.ts	Fonte única de verdade: LOJAS_POR_UF autoral + derivação determinística do resto.
src/lib/mock-data/rede-agregada.ts	API de agregação: agregar(selecao), kpisDaSelecao().
src/lib/mock-data/rede-agregada.test.ts	Testes de aditividade (ver Verificação).
src/components/dashboard/BrazilMapCard.tsx	Card + SectionHeader + Tabs de granularidade + legenda + Select de fallback + sr-only.
src/components/dashboard/BrazilMapSvg.tsx	SVG declarativo: 27 <path> + bolhas, hover/foco/seleção, roving tabindex.
src/components/dashboard/MapTooltip.tsx	Tooltip posicionado, pointer-events-none.
src/components/dashboard/RankingCard.tsx	Table com badge de posição w-8 h-8 rounded-full.
src/components/dashboard/OcorrenciasChartCard.tsx	Barras vermelho + cinza, escopadas pela seleção.
src/components/dashboard/Avaliacao360RadarCard.tsx	Radar de 4 critérios: seleção vs. média Brasil.
Arquivos modificados
Caminho	Mudança
src/pages/Dashboard.tsx	Reescrita. Seleção via useSearchParams (convenção do projeto: filtro sempre na URL → deep-link). 3 linhas. Timeline de entrada enxugada.
src/lib/mock-data/dashboard.ts	Mantém os tipos Kpi/KpiColorTheme + um KPI_TEMPLATES (id/label/icon/colorTheme/route). Remove kpis hard-coded, resumoExecutivo, ocorrenciasRecentes, evolucaoSerie, DashboardOcorrencia.
src/lib/mock-data/vinculos.ts	Remove o MACRO_POR_ESTADO privado (só 7 UFs, sem Norte, com fallback "Outras" — quebraria em SC/ES/GO/MT/MS/PE/CE/RN) e passa a importar regiaoDaUF de @/lib/geo/estados.
src/hooks/use-count-up.ts	Corrigir bug latente — ver Riscos §1.
src/index.css	Tokens --map-* em :root e .dark + utilitárias .map-state / .map-bubble.
package.json	Remover d3-geo, topojson-client, @types/d3-geo, @types/topojson-client — instalados e com zero imports em src/.
Arquivos deletados
src/components/dashboard/EvolutionChart.tsx — código morto (nenhum arquivo o importa; noUnusedLocals não pega export morto entre arquivos).
public/data/brazil-states.json (3,38 MB) e public/data/brazil-mesorregioes.json (614 KB) — não usados e, por estarem em public/, o Vite os copia inteiros para o dist/. Remove 3,99 MB do build.
Modelo de dados
// src/lib/geo/estados.ts
export type UF = "AC" | "AL" | ... | "TO";                       // 27
export type Regiao = "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul";

export interface EstadoGeo {
  uf: UF;
  nome: string;                    // do atributo `title` do SVG
  regiao: Regiao;
  centroide: { x: number; y: number };   // espaço do viewBox
  bubbleOffset?: { x: number; y: number };
}
export const ESTADOS: Record<UF, EstadoGeo>;
export function regiaoDaUF(uf: UF): Regiao;   // total, sem fallback
// src/lib/geo/selection.ts
export type MapSelection =
  | { nivel: "global" }
  | { nivel: "regioes"; regiao: Regiao | null }
  | { nivel: "estados"; uf: UF | null };
URL: ?nivel=estados&uf=SP · ?nivel=regioes&regiao=Sudeste · vazio = global.

Centroides: usar os centroides geométricos (centroide de área do maior sub-path), já calculados a partir da geometria real, e não a fórmula equirretangular do mapsvg:geoViewBox — esta coloca SP 13 unidades abaixo do centro visual. Valores conferidos (bbox global 0.26,0.26 → 612.26,638.79); único ajuste manual necessário: DF: bubbleOffset { x: 18, y: -12 } + linha-guia de 1px, porque DF tem ~6 px de largura na tela e a bolha é o único alvo clicável viável.

Geração dos dados por UF
Autorar 27 × 8 campos seria o "blob paralelo" que a convenção do projeto proíbe. Autoramos apenas lojas e derivamos o resto de forma determinística a partir de um seed estável da sigla — mesmo padrão de gerarChecklist(seed) em visitas.ts.

/** Único dado autoral. Soma = 312 (o valor histórico do KPI "Lojas ativas"). */
const LOJAS_POR_UF: Partial<Record<UF, number>> = {
  SP: 84, MG: 38, PR: 30, RS: 28, RJ: 26, SC: 22, BA: 14, GO: 13,
  DF: 11, PE: 10, CE: 9, ES: 8, MT: 7, MS: 6, RN: 6,
};   // 12 UFs ausentes = zero, de propósito
Derivados por UF: pvs ≈ lojas × 5.4–6.4, consultores ≈ pvs × 4.2–4.9, previas ≈ lojas × 5.4–6.4, metaLojas = ceil(lojas × 1.026), série de 6 meses de ocorrências (abertas/resolvidas) e 4 scores de avaliação. Os critérios mantêm uma "personalidade" estável na rede (comunicação visual sempre é o ponto fraco), coerente com unidadesDetalhe.L001 (96/82/98/95).

Agregação: tudo soma, exceto avaliação 360, que é média ponderada por lojas (UFs com zero lojas saem do numerador e do denominador).

Ranking por seleção
Seleção	Conteúdo
Global / Regiões sem seleção	as 5 regiões
Região X	UFs com cobertura de X
Estados sem seleção	top 10 UFs
Estado Y	UFs da região de Y, com a linha de Y destacada
A última linha é a decisão importante: rankear um único estado selecionado geraria uma tabela de 1 linha. Mostrá-lo dentro do ranking da própria região dá contexto ("SP é #1 de 4 no Sudeste") e mantém o card útil em todos os níveis. Clicar numa linha altera a seleção — vira uma segunda porta de entrada, acessível por teclado.

Componente do mapa
Renderização declarativa, não a abordagem imperativa da v1 (fetch + DOMParser + addEventListener por path, que briga com o React). Motivo adicional: cada <path> no SVG original traz style="fill:#ec8989" inline, que venceria qualquer classe CSS — o gerador descarta esse atributo e mantém só id/title/d.

Nível	Fundo dos estados	Bolhas	Clique
Global	neutro uniforme	uma por UF com cobertura	inerte
Regiões	5 cores de região (dessaturadas); selecionada em destaque	uma por região, no centroide ponderado por lojas	seleciona a região (clicar numa UF resolve para a região dela)
Estados	neutro; hover e selecionado em destaque	uma por UF com cobertura	seleciona a UF
Trocar de nível reseta a seleção (evita "Sudeste selecionado com nível = estados").

Bolhas: raio R_MAX × √(valor / max) com R_MAX = 34 — escala de área, não linear (linear faria estados pequenos parecerem maiores do que são). Já verifiquei que não há colisão nessa escala; o único par apertado é DF↔GO (folga de 2,8 px), resolvido pelo bubbleOffset do DF. Sem simulação de força, sem relaxamento em runtime. Um teste garante a não-sobreposição caso LOJAS_POR_UF mude.

Acessibilidade (duas camadas):

Roving tabindex no SVG — 27 tab stops seria hostil; apenas um path é focável por vez, setas navegam, Enter seleciona, Esc limpa. Anel de foco desenhado como <path> duplicado (outline em SVG é inconsistente entre navegadores).
Alternativa não-SVG — Select "Ir para estado/região" na barra de legenda. É precedente do projeto: o CLAUDE.md já exige isso para o VinculosGraph ("grafos de rede têm grau D de acessibilidade, sempre precisam de uma alternativa navegável por teclado" → VinculosListView.tsx). Também resolve o mobile (DF é intocável com o dedo).
Parágrafo sr-only com o top 5 e as regiões sem cobertura, conforme a regra "dado crítico sempre disponível como texto".
Layout
<div ref={entranceRef} className="flex flex-col gap-6">
  <div className="dashboard-header …">…</div>

  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {kpis.map(k => <KpiCard key={k.id} kpi={k} … />)}
  </div>

  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
    <BrazilMapCard className="lg:col-span-2" … />   {/* 2/3, conforme PRD §8 */}
    <RankingCard … />
  </div>

  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
    <OcorrenciasChartCard … /><Avaliacao360RadarCard … />
  </div>
</div>
Os 4 cards novos levam className="dashboard-section" (para entrar na timeline existente) e nenhum deles é Card interactive — foi exatamente essa combinação que causou o bug de transform congelado corrigido hoje.

Riscos e armadilhas específicas deste código
🔴 useCountUp vai quebrar visivelmente com filtro. Dois bugs dormentes hoje (os valores nunca mudam): (a) sempre anima a partir do zero — cada clique no mapa faria os 4 KPIs despencarem a zero e subirem de novo; (b) useGSAP não reverte por mudança de dependência (revertOnUpdate é false por padrão), então cliques rápidos empilham tweens concorrentes escrevendo no mesmo textContent e o número pode parar no valor errado. Corrigir para animar do valor anterior e matar o tween anterior.
🔴 Nunca animar via GSAP uma propriedade com transition CSS. fill/stroke das UFs → só CSS. Entrada das bolhas → só GSAP, e no <g> wrapper (não no <circle> que tem a transition). Elementos diferentes, regra respeitada. Também: não animar o atributo r por CSS (suporte irregular no Safari) — escalar o <g>.
🟠 Orçamento da timeline de entrada (< 1 s). Remover o grupo .dashboard-resumo (os cards sumiram) deixa ≈ 0,77 s. A entrada das bolhas não entra nessa timeline — roda como useGSAP próprio dentro do BrazilMapSvg, concorrente, custo zero no orçamento.
🟠 noUnusedLocals está ligado. Remover os mini-cards deixa ~12 imports órfãos em Dashboard.tsx e o tsc vai falhar em todos. (Já existem 6 erros TS6133 pré-existentes em outros arquivos, de trabalho em andamento seu — não vou mexer neles, mas eles poluem a saída do type-check.)
🟠 O mapa vai contradizer unidadesList. SP mostrará 84 lojas enquanto /unidades lista 8 no total. Essa inconsistência já existe hoje (o KPI diz 312), mas fica mais visível. Registrar no MEMORY.md: redePorUF é o mock de escala de rede (dashboard), unidadesList é o mock de amostra detalhada (telas de lista/detalhe).
🟠 Bundle: +64 KB de geometria (~19 KB gzip) no chunk principal, −3,99 MB de JSON morto no dist/. Saldo fortemente positivo.
🟡 Dark mode: todas as cores do mapa como custom properties --map-* em :root e .dark, referenciadas via style={{ fill: 'var(--map-…)' }}. SVG fill aceita CSS var — a restrição de "hex literal" vale só para o ApexCharts.
🟡 ApexCharts: useMemo no objeto options (recriar força updateOptions e re-anima os eixos); radar de 4 categorias precisa de plotOptions.radar.polygons explícito ou fica com cara de inacabado; não adicionar teste que renderize o Dashboard sem mockar react-apexcharts (jsdom não tem layout engine).
Verificação
Testes unitários (rede-agregada.test.ts) — verdes antes de encostar na UI:

agregar(global).lojas === 312.
Aditividade: soma das 5 regiões === global, para lojas/pvs/consultores/prévias e para os 6 meses das duas séries de ocorrências.
Soma das 27 UFs === global.
Totais globais dentro de ±3% de 1842 / 8420 / 1847.
regiaoDaUF é total nas 27 UFs e Σ|UFS_POR_REGIAO| === 27.
Avaliação ponderada de uma UF isolada === os scores crus dela.
Todo UF de BRAZIL_PATHS existe em ESTADOS e vice-versa (27 = 27).
Bolhas não se sobrepõem em R_MAX (protege contra edições futuras de LOJAS_POR_UF).
Comandos: npx tsc --noEmit -p tsconfig.app.json · npm run lint · npx vitest run · npm run build (comparar tamanho do dist).

Playwright (dev server na :8080):

Propagação do filtro: clicar SP → os 4 KPIs mudam, subtítulo do ranking vira "Estados do Sudeste · SP em destaque", subtítulo do gráfico diz "SP", série do radar muda. Clicar SP de novo → volta para Brasil.
Coerência (a aposta arquitetural): ler os 4 KPIs no Global; somar as 5 seleções de região; afirmar igualdade no DOM, não só no teste unitário.
Estados vazios: hover/clique em AM, PA, MA → tooltip "Sem cobertura", aria-disabled="true", seleção não muda.
Geometria das bolhas: getBoundingClientRect() em todas; nenhuma sobreposição (distância entre centros ≥ r₁+r₂), atenção especial a DF/GO.
Regressão de motion (o bug de hoje): após load, transform computado === matrix(1,0,0,1,0,0) ou none em todo .kpi-card e .dashboard-section, sem resíduo de style inline. Repetir em 4 reloads (era uma corrida, não determinístico).
Count-up sob filtro: clicar 5 estados em sequência rápida; o texto final de cada KPI deve bater com a última seleção (pega o bug de tweens empilhados).
Teclado: Tab entra no mapa com exatamente 1 tab stop; seta move o anel de foco; Enter seleciona (aria-pressed="true" + KPIs mudam); Esc limpa.
Reduced motion: emulateMedia({ reducedMotion: 'reduce' }) → tudo visível, sem transform residual, KPIs já no valor final.
Deep link: abrir /?nivel=estados&uf=SP direto → página já renderiza filtrada; Voltar do navegador restaura Brasil.
Layout: gaps uniformes de 24 px nas 3 linhas; mapa ≈ 2/3 e ranking ≈ 1/3, com alturas iguais.
Responsivo: em 1024 px e 768 px as linhas empilham e o Select de fallback continua alcançável.
Ordem de execução
#	Passo	Depende de
1	Copiar brazil.svg → src/assets/; escrever o gerador; gerar e commitar brazil-map-paths.ts	—
2	src/lib/geo/estados.ts (27 UFs, regiões, centroides, offset do DF)	1
3	Refatorar vinculos.ts para consumir regiaoDaUF; conferir que a aba "Mapa de Vínculos" segue renderizando (agora com 5 regiões)	2
4	selection.ts + bubble-layout.ts + tokens --map-* no index.css	2
5	rede-por-uf.ts — LOJAS_POR_UF + derivação determinística	2
6	rede-agregada.ts + testes; verdes antes de qualquer UI	5
7	Corrigir use-count-up.ts	—
8	BrazilMapSvg.tsx (paths, bolhas, hover, roving tabindex, anel de foco)	4, 6
9	BrazilMapCard.tsx + MapTooltip.tsx	8
10	RankingCard.tsx	6
11	OcorrenciasChartCard.tsx + Avaliacao360RadarCard.tsx	6
12	Reescrever Dashboard.tsx	9–11
13	Limpeza: podar dashboard.ts, deletar EvolutionChart.tsx e public/data/*.json, remover as 4 deps	12
14	tsc · lint · vitest · build	13
15	Passada de Playwright (1–11)	14
16	MEMORY.md + PRD/relatorio-funcionalidades.md	15
Add Comment