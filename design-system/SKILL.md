---
name: ademicon-orbita-dashboard
description: Construir qualquer tela/componente novo na linguagem do Design System Ademicon Dashboard (ORBITA) v2.1 — dashboard de dados densos, vermelho Ademicon como cor de ação, soft cards sobre fundo mesh. Use quando o design system ativo for o ORBITA.
---

# Construir na linguagem ORBITA

Guia acionável para compor **qualquer** tela nova com consistência. Princípios em `DESIGN.md`, referência de tokens em `README.md`, spec profunda em `context/input-DESIGN.md`. Toda superfície nasce de: elevação → cor → tipografia → espaçamento → motion.

## 0. Antes de tudo
- Cole `system/variables.css` (ou o `:root` abaixo) no primeiro `<style>`. **Nunca hex cru** — sempre token semântico.
- Fontes: `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap')`.
- Ícones: **Lucide apenas** (`stroke-width: 2`). Nunca emoji nem misturar famílias.
- Copy em **pt-BR**, sentence case, rótulo = verbo do resultado.

## 1. Envelope de página
```html
<div class="min-h-screen bg-background bg-mesh">
  <div class="sticky top-0 z-50 p-4 pb-0"><!-- nav primária --></div>
  <div class="max-w-[1440px] mx-auto px-6 py-6 space-y-6"><!-- seções --></div>
</div>
```
- **Nav primária:** barra branca flutuante (raio 24px), logo à esquerda · trilho interno de itens (ativo = **pill vermelho**, texto branco) · à direita busca + sino com contador vermelho + avatar (`rounded-full`).
- Uma **ousadia por tela**: o elemento-assinatura (visualização-herói) concentra a expressividade; no máx. **um** bloco de fundo vermelho por grupo. KPIs antes de gráficos; tabela nunca na 1ª dobra.

## 2. Classes canônicas (medidas — cole verbatim)
```css
.bg-mesh { background-image:
  radial-gradient(at 0% 0%, hsla(0,72%,51%,.03) 0, transparent 50%),
  radial-gradient(at 100% 100%, hsla(88,50%,53%,.03) 0, transparent 50%); }

.soft-card {              /* nível 1 — unidade básica de composição */
  border-radius: 1.5rem; border: 1px solid rgb(255 255 255 / .5);
  background: hsl(var(--card)); box-shadow: var(--shadow-soft);
  transition: all .2s cubic-bezier(.4,0,.2,1); }
.dark .soft-card { border-color: rgb(255 255 255 / .05); }
.soft-card:hover { transform: translateY(-2px); }  /* só se clicável */

.glass-tooltip {          /* nível 4 — tooltip de gráfico */
  border:1px solid rgb(255 255 255 / .4); background: rgb(255 255 255 / .7);
  backdrop-filter: blur(12px); box-shadow: var(--shadow-xl); }

.tabular { font-variant-numeric: tabular-nums lining-nums; }
```

## 3. Anatomia do card / KPI
Rótulo (`.text-micro`, 10px bold uppercase, muted) → valor (**display, 24px, bold, .tabular**) → apoio (delta/tendência).
- **Ícone contextual:** container **circular** tingido `p-2 rounded-full bg-{cor}/10 text-{cor}` (topo-direita ou ao lado do rótulo).
- **Delta:** pill com **sinal + cor** — positivo `text-success bg-success/10`, negativo `text-primary bg-primary/10`. Nunca só cor.
- **KPI-herói:** um único card de **fundo vermelho** por grupo, textos invertidos (`white`, `white/70`), delta em pill invertido. É a ênfase do grupo.
- Count-up nos números (0.6s, `snap`) — exige `.tabular` para não tremer.

## 4. Arquétipos de layout
- **Foco único:** herói (mapa/gráfico/número) + blocos de apoio. Visões-resumo.
- **Mestre-detalhe:** painel-companheiro sticky (~1/3) + detalhe (~2/3). Item selecionado = `bg-primary/.07` + **marca lateral vermelha**; colapsa em 1 coluna no mobile. (telas Unidades/Consultores)
- **Grade de catálogo:** cards uniformes autoexplicativos, 2–3 col. (tela Relatórios)
- **Formulário/assistente:** seções rotuladas (`.text-micro`), obrigatórios com **asterisco vermelho**, ações fixas no rodapé.

## 5. Controles e estados
- **Botão primário:** vermelho sólido, texto branco, `rounded-md`, ícone Lucide; press `scale .98`; hover `bg-primary/90`. **Secundário:** preenchimento cinza suave + texto escuro.
- **Inputs/selects/date:** **preenchimento suave** (bg neutro claro), borda mínima, ~14px, foco `ring-2 ring-ring`. Label micro-uppercase.
- **Seleção** (chip/radio/checkbox/segmented): ativo = borda + `bg-primary/.06` + **marca visível** (check/preenchimento/segmento branco elevado). **Switch 'ligado' = vermelho.**
- **Abas:** sublinhado vermelho (seções) OU segmented (subvisões) — ativo sempre vermelho.
- **Todo componente interativo:** hover · `focus-visible` (nunca remover) · active · disabled (`opacity-50 pointer-events-none`) · loading (skeleton com dimensão real, CLS<0,1) · empty (convite à ação) · error (junto ao campo, objetivo).

## 6. Badges, ranking, dataviz
- **Status:** `rounded-md` uppercase + rótulo textual, par `bg-{cor}/10 border-{cor}/20`, tons AA (success `#527b24`, warning `#b35309`).
- **Categoria/tier:** **pill** (`rounded-full`) + ícone 12px, paleta de categorias (blue/emerald/amber/purple/rose).
- **Ranking:** top 3 com **medalha ouro/prata/bronze** em box circular; demais em número/círculo neutro. **Sem glow** (glow só na série principal do gráfico-herói).
- **Gráficos:** cor sempre de `--chart-N` (ordem fixa, série 1 = vermelho). Grid `strokeDasharray="3 3"` `vertical=false`; eixos sem linha, ticks muted; barras topo arredondado `radius=[8,8,0,0]`; pizza/donut como `<path>` preenchido (nunca `stroke-dashoffset`); tooltip em `.glass-tooltip`; **legenda obrigatória com 2+ séries**. Toda viz não-textual precisa de alternativa em texto/tabela.

## 7. Motion de entrada (GSAP, uma timeline por página, <1s)
```js
const tl = gsap.timeline({ defaults:{ ease:"power2.out" }});
tl.from(".dash-header",{ y:-16, opacity:0, duration:.4 })
  .from(".kpi-card",{ y:16, opacity:0, scale:.97, duration:.4,
        stagger:{ each:.06, grid:"auto" }, ease:"back.out(1.4)" }, "-=0.15")
  .from(".chart-card",{ y:16, opacity:0, duration:.45 }, "-=0.2")
  .from(".table-card",{ y:16, opacity:0, duration:.45, stagger:.08 }, "-=0.25");
```
Animar só `transform`/`opacity`; saída ~60% da entrada; `prefers-reduced-motion` obrigatório; watchdog ~2,5s força estado final se a timeline não completar.

## 8. Nunca faça
Hex cru · emoji como ícone · misturar famílias de ícones · texto direto sobre foto (usar overlay ≥4,5:1) · comunicar estado só por cor · verde claro/âmbar claro com texto branco · glow fora do gráfico-herói · Title Case em rótulos · números não-tabulares em coluna · empilhar sombras ad-hoc.
