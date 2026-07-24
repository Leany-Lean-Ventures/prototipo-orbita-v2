# Design System — Ademicon Dashboard (ORBITA) · v2.1

**Guia de estilos e design** do produto — a *linguagem* que garante consistência visual ao criar **qualquer** componente ou tela nova. Não é um catálogo dos componentes existentes: descreve tokens, princípios e regras que generalizam, não receitas de peças específicas (essas vivem no código).

> **Como usar**: ao criar qualquer componente ou tela, derive-o destas regras — elevação (§4), cor (§3), tipografia (§5), espaçamento (§6), motion (§7). Seções marcadas com ⚠️ são regras duras (acessibilidade/contraste) — nunca relaxar. O restante admite variação deliberada, desde que justificada pela identidade da §1.

---

## 1. Identidade e princípios de design

**Produto**: painel de gestão estratégica de consórcios (Ademicon) — dados de faturamento, vendas, unidades, consultores e conformidade. Audiência: gestores; uso em desktop no trabalho, sessões longas.

**Tese visual**: *precisão financeira com leveza* — dados densos apresentados em superfícies suaves e claras (soft cards flutuantes sobre fundo mesh), com o vermelho Ademicon usado com autoridade e parcimônia.

**Elemento assinatura**: o **mapa do Brasil interativo** no painel principal — é o hero da aplicação e o filtro-mestre de todos os dados. Nenhuma outra tela precisa competir com ele; nas demais páginas, a assinatura ecoa em detalhes (contornos, KPIs com count-up).

**Princípios (em ordem de prioridade):**

1. **Legibilidade acima de estética** — contraste AA é inegociável; dado numérico sempre em numerais tabulares.
2. **Uma ousadia por tela** — o elemento assinatura concentra a expressividade; todo o resto é quieto e disciplinado.
3. **Movimento com significado** — animação comunica hierarquia e causalidade (o que apareceu, o que mudou); nunca decoração gratuita.
4. **Densidade calibrada para dashboard** — espaçamento compacto (escala §6) sem parecer apertado.
5. **Consistência aprende-se** — mesmo padrão de card, badge, tabela e modal em todas as páginas; o usuário aprende uma vez.

---

## 2. Stack de UI

- **Framework**: React 18 + TypeScript + Vite
- **Estilização**: Tailwind CSS com tokens via CSS variables (HSL sem função, ex. `0 72% 51%`, consumidos como `hsl(var(--token))` — habilita opacidade `bg-primary/10`)
- **Componentes base**: shadcn/ui (`style: default`, `baseColor: slate`, `cssVariables: true`) sobre Radix UI
- **Ícones**: `lucide-react` (regras na §6)
- **Gráficos**: `recharts` (convenções na §9)
- **Animação**: **GSAP + @gsap/react** (`npm install gsap @gsap/react`) — sistema completo na §7
- **Variantes**: `class-variance-authority` + `cn()` (clsx + tailwind-merge)
- **Roteamento**: `react-router-dom` · **Dados**: `@tanstack/react-query` · **Toasts**: `sonner`
- **Fontes**: Google Fonts — **Montserrat** (títulos) + **IBM Plex Sans** (corpo e dados); ver §5

### components.json (para regenerar via shadcn)

```json
{
  "style": "default", "rsc": false, "tsx": true,
  "tailwind": { "config": "tailwind.config.ts", "css": "src/index.css", "baseColor": "slate", "cssVariables": true, "prefix": "" },
  "aliases": { "components": "@/components", "utils": "@/lib/utils", "ui": "@/components/ui", "lib": "@/lib", "hooks": "@/hooks" }
}
```

---

## 3. Cores ⚠️

### 3.1 Tokens — Light (`:root`)

| Token | HSL | Uso |
| --- | --- | --- |
| `--background` | `0 0% 95%` | fundo da página (com `.bg-mesh`) |
| `--foreground` | `215 25% 27%` | texto padrão (≈9,4:1 sobre background — AAA) |
| `--card` / `--card-foreground` | `0 0% 100%` / `215 25% 27%` | superfícies nível 1 |
| `--popover` / `--popover-foreground` | `0 0% 100%` / `215 25% 27%` | superfícies nível 2 |
| `--primary` / `--primary-foreground` | `0 72% 51%` / `0 0% 100%` | marca Ademicon; CTAs, destaques (4,8:1 com branco ✓) |
| `--secondary` / `--secondary-foreground` | `88 50% 53%` / `90 60% 12%` | verde de marca **decorativo** (gráficos, fills); texto sobre ele é ESCURO |
| `--success` / `--success-foreground` | `88 55% 31%` / `0 0% 100%` | estado positivo em TEXTO/badge (≈5,0:1 ✓) |
| `--warning` / `--warning-foreground` | `26 90% 37%` / `0 0% 100%` | atenção em TEXTO/badge (≈4,6:1 ✓) |
| `--destructive` / `--destructive-foreground` | `0 84% 60%` / `0 0% 100%` | erros destrutivos |
| `--muted` / `--muted-foreground` | `213 27% 84%` / `215 16% 40%` | fundos neutros / texto secundário (≥4,5:1 ✓) |
| `--accent` / `--accent-foreground` | `210 40% 96%` / `215 25% 27%` | hovers, fundos sutis |
| `--border` / `--input` | `214 32% 91%` | bordas e inputs |
| `--ring` | `0 72% 51%` | anel de foco (= primary) |
| `--radius` | `1rem` | raio-base do sistema |

> **Mudança v2.0**: `success` foi **separado** de `secondary`. O verde claro de marca (`secondary`, 53% de luminosidade) reprova contraste com texto branco (~2,1:1) — ele agora é exclusivamente decorativo (barras de gráfico, fills, progress) e recebe texto escuro. Para *comunicar* sucesso em texto ou badge, usar `success` (tom escurecido da mesma família de matiz 88). Mesmo racional para `warning`: o amarelo `45 93% 47%` reprovava (~1,9:1) e virou cor de gráfico (§3.4); o token semântico usa âmbar escurecido.

### 3.2 Tokens — Dark (`.dark`)

| Token | HSL |
| --- | --- |
| `--background` | `0 0% 7%` |
| `--foreground` | `210 40% 98%` |
| `--card` / `--popover` | `0 0% 12%` / `0 0% 14%` |
| `--primary` / `--primary-foreground` | `0 72% 55%` / `0 0% 100%` |
| `--secondary` / `--secondary-foreground` | `88 50% 53%` / `90 60% 12%` |
| `--success` / `--success-foreground` | `88 45% 62%` / `90 60% 10%` |
| `--warning` / `--warning-foreground` | `40 90% 60%` / `30 80% 12%` |
| `--destructive` / `--destructive-foreground` | `0 72% 55%` / `0 0% 100%` |
| `--muted` / `--muted-foreground` | `217 33% 17%` / `215 20% 68%` |
| `--accent` | `217 33% 17%` |
| `--border` / `--input` | `217 33% 20%` |

> No dark, tons semânticos **clareiam** (texto claro sobre fundo escuro) e recebem foreground escuro quando usados como fundo de badge. Elevação no dark é comunicada por luminosidade da superfície, não por sombra (§4).

### 3.3 Regras de uso de cor ⚠️

- **Nunca** hex/hsl cru em componente — sempre token semântico.
- Texto normal: contraste ≥ 4,5:1; texto grande (≥18px bold ou ≥24px): ≥ 3:1; componentes de UI e bordas de foco: ≥ 3:1.
- Pares aprovados para badge/texto: `text-success bg-success/10`, `text-warning bg-warning/10`, `text-primary bg-primary/10`, `text-destructive bg-destructive/10` — todos com `border border-{token}/20`.
- **Nunca comunicar estado só por cor**: badge de status sempre acompanha rótulo textual; ícone acompanha cor em alertas.
- `secondary` (verde claro) e a paleta de gráficos (§3.4): apenas em elementos decorativos ≥3:1 contra o fundo ou reforçados por rótulo.

### 3.4 Paleta de dados (gráficos)

Séries em ordem fixa — nunca reordenar entre telas:
| Ordem | Token sugerido | HSL | Nota |
|---|---|---|---|
| 1 | `--chart-1` | `0 72% 51%` | vermelho marca (série principal) |
| 2 | `--chart-2` | `88 50% 53%` | verde marca |
| 3 | `--chart-3` | `45 93% 47%` | âmbar (ex-warning, agora só dataviz) |
| 4 | `--chart-4` | `221 83% 53%` | azul |
| 5 | `--chart-5` | `272 72% 47%` | roxo |

### 3.5 Paleta estendida de categorias (tags)

Somente para diferenciar categorias nominais (Documentação, Compliance, Qualidade, Processos, Atendimento…), nunca para estados semânticos:

```
padrão light: bg-{cor}-100 text-{cor}-700 border-{cor}-200
padrão dark:  bg-{cor}-900/30 text-{cor}-400 border-{cor}-800
cores: blue | emerald | amber | purple | rose
```

---

## 4. Superfícies e elevação

Cinco níveis formais. Cada elemento declara **um** nível; não empilhar sombras ad-hoc.

| Nível | Nome | Fundo (light) | Sombra | Borda | Usos |
| --- | --- | --- | --- | --- | --- |
| 0   | Canvas | `background` + `.bg-mesh` | —   | —   | fundo de página |
| 1   | Card | `card` | `--shadow-soft` | `border-white/50` (dark: `white/5`) | `.soft-card`: KPIs, gráficos, tabelas, painéis |
| 2   | Raised | `popover` | `--shadow-md` | `border-border` | dropdowns, popovers, selects abertos, hover-cards |
| 3   | Overlay | `card` | `--shadow-xl` + backdrop `bg-black/40` | `border-border` | modais (Dialog), drawers, sheets |
| 4   | Glass | translúcido + blur | `--shadow-xl` | `border-white/40` | header sticky, tooltips de gráfico (`.glass-tooltip`) |

```css
--shadow-soft: 0 10px 25px -5px rgba(0,0,0,0.04), 0 8px 10px -6px rgba(0,0,0,0.04);
--shadow-md:   0 6px 16px -4px rgba(0,0,0,0.10), 0 3px 6px -3px rgba(0,0,0,0.06);
--shadow-xl:   0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
--shadow-glow-primary: 0 0 20px hsla(0,72%,51%,0.35);   /* só para o destaque #1 de ranking */
```

**Dark mode**: sombras quase somem; elevação = luminosidade (`card` 12% → `popover` 14% → overlay 16%). Manter as bordas `white/5` para separar planos.

### Utilities canônicas

```css
.soft-card {  /* nível 1 — unidade básica de composição */
  @apply bg-card border border-white/50 dark:border-white/5 rounded-2xl transition-all duration-200;
  box-shadow: var(--shadow-soft);
}
.soft-card:hover { transform: translateY(-2px); }   /* só em cards clicáveis/interativos */

.glass-tooltip {  /* nível 4 */
  @apply bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/40 dark:border-slate-700/40;
  box-shadow: var(--shadow-xl);
}

.bg-mesh {  /* nível 0 */
  background-image: radial-gradient(at 0% 0%, hsla(0,72%,51%,0.03) 0px, transparent 50%),
                    radial-gradient(at 100% 100%, hsla(88,50%,53%,0.03) 0px, transparent 50%);
}
```

### Z-index (escala fechada)

`0` conteúdo · `10` decoração interna de card · `40` header sticky de tabela · `50` header da página · `60` dropdown/popover · `80` modal/drawer · `90` toast · `100` tooltip flutuante

---

## 5. Tipografia

### 5.1 Par tipográfico (mudança v2.0)

| Papel | Fonte | Pesos | Uso |
| --- | --- | --- | --- |
| **Display/Títulos** | Montserrat | 600, 700 | h1–h4, valores de KPI, nome da marca, nav |
| **Corpo/Dados** | IBM Plex Sans | 400, 500, 600 | parágrafos, tabelas, labels, inputs, tooltips |

Racional: Montserrat (geométrica, já era a voz da marca) fica restrita a títulos, onde tem personalidade; IBM Plex Sans — desenhada para dados financeiros, excelente em números — assume corpo e tabelas. O contraste display-geométrica × corpo-técnica é a hierarquia.

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
/* tailwind.config: fontFamily: { display: ['Montserrat','sans-serif'], sans: ['IBM Plex Sans','ui-sans-serif','system-ui','sans-serif'] } */
```

⚠️ **Números tabulares obrigatórios** em qualquer coluna numérica, KPI ou eixo de gráfico:

```css
.tabular { font-variant-numeric: tabular-nums lining-nums; }
```

### 5.2 Escala

Body base **15px** (`0.9375rem`), `line-height: 1.6`, `letter-spacing: -0.01em`; `html { font-size: 16px }` com antialiasing.

| Classe | Tamanho | LH  | Papel |
| --- | --- | --- | --- |
| `text-xs` | 13px | 1.5 | captions, células compactas (⚠️ mínimo absoluto de corpo: 12px) |
| `text-sm` | 15px | 1.5 | corpo padrão, tabelas |
| `text-base` | 16px | 1.6 | corpo confortável |
| `text-lg` | 18px | 1.4 | h3, títulos de card |
| `text-xl` | 20px | 1.35 | h2 mobile |
| `text-2xl` | 24px | 1.3 | h2, valores de KPI |
| `text-3xl` | 30px | 1.25 | h1  |
| `text-4xl` | 36px | 1.2 | número-herói (raro) |

### 5.3 Estilos compostos

```css
h1 { font-family: display; text-2xl→text-3xl; font-bold; tracking-tight }
h2 { font-family: display; text-xl→text-2xl;  font-bold; tracking-tight }
h3 { font-family: display; text-lg; font-semibold }
.text-label   { 13px, semibold, uppercase, tracking-wider, muted-foreground }
.text-micro   { 10px, bold, uppercase, tracking-widest }  /* títulos de KPI, headers de tabela — sempre uppercase p/ compensar o tamanho */
.text-value   { display, 24px, bold, tracking-tight, tabular-nums }
.text-caption { 13px, muted-foreground }
```

---

## 6. Espaçamento, grid, raio, iconografia

### Espaçamento (densidade dashboard)

Escala fechada: **4 · 8 · 12 · 16 · 20 · 24 · 32 · 48px**.

- Padding de card: `p-5` (20px) para KPI, `p-6` (24px) para gráficos/tabelas
- Gap entre cards: `gap-4` (KPIs) e `gap-6` (seções); entre seções verticais: `space-y-6`
- **Seções com título próprio**: 48px (`space-y-12`/`gap-12`) entre o fim de uma seção e o título da próxima — título nunca "cola" no bloco anterior
- Alvo de toque mínimo: **44×44px** em qualquer elemento interativo; espaçamento mínimo entre alvos: 8px ⚠️

### Grid e breakpoints

Container máx. **1440px** (`max-w-[1440px] mx-auto px-6`). Testar em **375 / 768 / 1024 / 1440**. Mobile-first; sem scroll horizontal ⚠️; tabelas largas rolam dentro do card (`overflow-x-auto`).

### Border radius

Base `--radius: 1rem`. Cards e modais `rounded-2xl` (24px) · botões-chip e ícones-box `rounded-xl` · badges retangulares `rounded-md` · pills/avatares/nav `rounded-full` ou `rounded-lg`.

### Iconografia — família padrão: Lucide ⚠️

Família **única e obrigatória**: [Lucide](https://lucide.dev/icons/) — nunca misturar com outra família (Heroicons, Font Awesome, Material…) nem usar emoji como ícone.

- **React**: `lucide-react` (já no projeto) — `import { Bell } from "lucide-react"`
- **Páginas estáticas/protótipos**: build UMD `lucide.min.js` + `<i data-lucide="bell"></i>` + `lucide.createIcons()` (self-host; CDN só como fallback)
- Tamanhos fechados: **12px** (dentro de badge), **14px** (chip/botão sm), **16px** (inline/tabela/busca), **20px** (padrão em botões e KPIs), **24px** (herói de empty state)
- `stroke-width: 2` sempre (nunca variar o peso do traço entre ícones)
- Cor herda do contexto (`currentColor`); ícone em box: container `p-2 rounded-xl bg-{cor}/10 text-{cor}`
- Nomes canônicos atuais (renomeações do Lucide): `chart-column` (não `bar-chart-3`), `circle-alert` (não `alert-circle`), `circle-check-big` (não `check-circle`)
- Ícones de uso fixo no produto: busca `search` · notificações `bell` · dinheiro `dollar-sign` · vendas `chart-column` · meta `target` · conformidade `shield-check` · exportar `download` · adicionar `plus` · fechar `x` · Documentação `file-text` · Compliance `shield-check` · Qualidade `star` · Processos `settings` · Atendimento `headphones` · sucesso `circle-check-big` · erro/alerta `circle-alert`
- ⚠️ Botão só-ícone exige `aria-label`

---

## 7. Motion System (GSAP)

Biblioteca oficial: **GSAP + @gsap/react** (`useGSAP` com `scope`; cleanup automático). Registrar plugins uma vez: `gsap.registerPlugin(useGSAP, ScrollTrigger)`.

### 7.1 Tokens de movimento

| Token | Valor | Uso |
| --- | --- | --- |
| `dur-micro` | 0.15–0.2s | hover, press, focus |
| `dur-base` | 0.25–0.3s | transições de estado, tooltips |
| `dur-enter` | 0.4–0.5s | entrada de elementos/página |
| `stagger-list` | 0.03–0.06s/item | listas e grids (máx. ~8 itens animados) |
| `ease-micro` | `power1.out` | microinterações |
| `ease-enter` | `power2.out` | entradas padrão |
| `ease-signature` | `back.out(1.4)` | entrada de KPIs (único easing expressivo) |

⚠️ Regras duras: animar **somente `transform` e `opacity`** (nunca width/height/margin — layout thrashing); saída sempre mais rápida que entrada (~60% da duração); `prefers-reduced-motion` obrigatório (§7.5).

### 7.2 Coreografia de entrada de página (sequência única, orquestrada)

Uma timeline por página, nesta ordem — total < 1s:

```tsx
useGSAP(() => {
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
  tl.from(".dash-header",  { y: -16, opacity: 0, duration: 0.4 })
    .from(".kpi-card",     { y: 16, opacity: 0, scale: 0.97, duration: 0.4,
                             stagger: { each: 0.06, grid: "auto" }, ease: "back.out(1.4)" }, "-=0.15")
    .from(".chart-card",   { y: 16, opacity: 0, duration: 0.45 }, "-=0.2")
    .from(".table-card",   { y: 16, opacity: 0, duration: 0.45, stagger: 0.08 }, "-=0.25");
}, { scope: containerRef });
```

- Deslocamento de entrada pequeno (8–16px): lê-se como *fade*, não slide.
- Conteúdo abaixo da dobra: scroll reveal com `ScrollTrigger` (`start: 'top 85%'`, `toggleActions: 'play none none reverse'`), stagger nos filhos ≤ 8.
- **Count-up de KPI** (par com o elemento assinatura): números sobem do valor anterior ao atual em 0.6s com `snap` — exige `tabular-nums` para não tremer o layout.

### 7.3 Microinterações

| Elemento | Interação | Spec |
| --- | --- | --- |
| `.soft-card` interativo | hover | CSS: `translateY(-2px)` + transição 200ms (já na utility). Não duplicar em GSAP |
| Card em lista longa (20+) | hover | `gsap.quickTo(el, 'y')` para evitar recriar tweens |
| Botão | press | `scale: 0.98`, 0.15s, `power1.out`; retorno no release |
| Botão primário | hover | `bg-primary/90` via CSS, 150ms |
| Linha de tabela | hover | `bg-muted/8`, 150ms, CSS puro |
| Badge/status novo | surgimento | `scale: 0.8 → 1, opacity 0 → 1`, 0.25s, `back.out(1.4)` |
| Tooltip de gráfico | show/hide | fade+shift 4px, 0.2s in / 0.12s out |
| Modal (nível 3) | open | overlay fade 0.2s; conteúdo `y: 12, scale: 0.98 → 1`, 0.3s. Close: 0.18s |
| Toast | in/out | slide da borda + fade; auto-dismiss ≥ 5s |
| Ícone de KPI | hover do card | `scale(1.1) rotate(-5deg)`, 0.2s — o ícone "acompanha" o lift do card |
| Sparkline | hover do card | redesenha via `stroke-dashoffset`, 0.7s |
| Barra de gráfico | hover | `brightness(1.12)`, 0.15s, cursor pointer (tooltip junto) |
| Donut ↔ legenda | hover em qualquer um | fatia ativa engrossa (`stroke-width` +~20%), demais caem para `opacity 0.25`, 0.25s; legenda desliza 2px |
| Linha de ranking | hover | posição `scale(1.12)`, progresso `brightness(1.12)`, badge sobe 1px |

- Hover nunca é o único caminho para uma informação (touch existe) ⚠️
- Feedback de loading imediato: qualquer ação > 300ms mostra spinner/skeleton
- ⚠️ **Failsafe de entrada obrigatório**: conteúdo nunca depende de JS para ficar visível — toda coreografia `gsap.from` tem um watchdog (~2,5s) que, se a timeline não completou, força `progress(1)` + `clearProps` e aplica os valores finais de count-up
- ⚠️ CSS `transition` **nunca em `all`** sobre elementos animados por GSAP — restringir às propriedades de hover (`transform`, `box-shadow`); `opacity`/`transform` de entrada pertencem ao GSAP

### 7.4 Gráficos

- Recharts anima a série principal no mount (default ~1s; reduzir para 600ms)
- Barras: crescer do eixo (`y`); linhas: desenhar da esquerda; nunca re-animar em re-render de filtro — transicionar valores
- Mudança de filtro (ex.: seleção no mapa): crossfade 0.25s do conteúdo afetado, não reload visual completo

### 7.5 Movimento reduzido ⚠️

```tsx
const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: reduce)", () => {
  gsap.globalTimeline.timeScale(100);  // ou pular tweens: entradas viram opacity simples
});
```

CSS equivalente para transições: `@media (prefers-reduced-motion: reduce) { * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important } }`

---

## 8. Componentes — princípios de composição e estados

> Este documento **não cataloga** os componentes do produto — define as regras para compor *qualquer* um com consistência. Todo componente novo nasce de um nível de elevação (§4), tokens de cor (§3), a escala tipográfica (§5), o espaçamento (§6) e o motion (§7). As subseções abaixo são regras transversais, não receitas de peças específicas.

### 8.1 Estados obrigatórios (todo componente interativo)

| Estado | Spec |
| --- | --- |
| hover | ver §7.3; sempre com transição, nunca mudança instantânea |
| focus-visible ⚠️ | `ring-2 ring-ring ring-offset-2` — **nunca remover**; navegação completa por teclado |
| active/press | scale 0.98 ou tom -10% |
| disabled | `opacity-50 pointer-events-none` — nunca só cor |
| loading | Skeleton (shape do conteúdo final, `animate-pulse bg-muted/40`) para conteúdo; spinner inline para botão (`Loader2` girando + rótulo "Salvando…") |
| empty | ícone 24px em box `bg-muted/20` + título curto + frase de ação + CTA quando aplicável. Vazio é convite à ação, não beco |
| error | mensagem junto ao campo/card afetado, tom objetivo: o que houve + como resolver. Sem "Ops!", sem culpa |

⚠️ Reservar espaço do conteúdo carregando (skeleton com mesmas dimensões) — CLS < 0.1.

### 8.2 Composição de superfícies (qualquer card ou bloco)

Toda "caixa" de conteúdo — métrica, gráfico, tabela, painel, item de lista — herda a mesma base; o que varia é o conteúdo, não as regras.

- **Base**: `.soft-card` (nível 1). Clicável usa a variante interativa (hover lift `-2px`); estático não tem hover.
- **Anatomia recorrente**: rótulo (`.text-micro`) → valor/conteúdo (`.text-value` em display+tabular, ou corpo) → apoio (tendência, legenda, ação secundária).
- **Ícone contextual**: em box `p-2 rounded-xl bg-{cor}/10 text-{cor}`, cor derivada do significado, não decorativa.
- **Delta/tendência**: sempre com sinal (`+`/`−`) além da cor — positivo `text-success bg-success/10`, negativo `text-primary bg-primary/10`; nunca comunicar direção só por cor ⚠️.
- **Uma ênfase por grupo**: no máximo um bloco "primário" (fundo `primary`, textos invertidos `/70`, `/20`) por conjunto — concentra a atenção (§1, princípio 2).
- Números sempre tabulares; valor de destaque em fonte display.

### 8.3 Controles acionáveis (botões, chips, seleção)

- **Botão**: variantes `default | destructive | outline | secondary | ghost | link`; tamanhos `sm | default | lg | icon`; press `scale .98`, hover lift `1px`.
- **Rótulo = verbo do resultado** ("Salvar alterações", "Gerar relatório" — nunca "Enviar"/"OK"), mantido em todo o fluxo (botão "Publicar" → toast "Publicado").
- **Seleção** (chips, toggles, segmented, radio/checkbox estilizados): o estado ativo usa borda + `bg-primary/.06` **e** uma marca visível (check, preenchimento, posição) — nunca só cor ⚠️. Toggle booleano usa `success` quando "ligado".
- **Ação secundária inline**: `text-primary text-xs uppercase hover:underline`.

### 8.4 Badges

Status: `rounded-md text-[9px]→text-[10px] bold uppercase border` + par aprovado §3.3, **com rótulo textual**.
Categoria: paleta estendida §3.5 + ícone Lucide 12px.

### 8.5 Tabelas e listas densas

- Dentro de um `.soft-card`; `thead` sticky em `.text-micro` sobre `bg-card` (z-40); linhas `border-t border-muted/10`, e `hover:bg-muted/8 cursor-pointer` **apenas** quando clicáveis (abrem detalhe).
- Colunas numéricas alinhadas à direita e em `tabular-nums` ⚠️.
- **Destaque de posição** (ranking, prioridade): marcador em box; o item nº 1 pode usar `bg-primary + shadow-glow-primary` — este é o **único** uso permitido do glow no sistema.
- Tabela larga rola dentro do card (`overflow-x-auto`), sem quebrar o layout ⚠️.
- Estado de carregamento: linhas-fantasma (skeleton) na altura real.

### 8.6 Sobreposições (modais, drawers, popovers)

- Vivem nos níveis 2–3 (§4): backdrop `bg-black/40`, conteúdo `rounded-2xl bg-card`.
- **Anatomia**: cabeçalho (título + fechar) · corpo rolável · rodapé de ações fixo. Pares label/valor em grid; texto longo em painel `bg-muted/20 rounded-lg`.
- Animação de abertura/fechamento na §7.3; **fecha por X, ESC e clique no backdrop** ⚠️; foco inicial no primeiro campo/ação.

### 8.7 Navegação primária

Princípio, não um header específico. A navegação principal vive numa superfície **nível 4 (glass)**, sticky e com respiro em volta; o destino **ativo** é sempre marcado em `primary`; e três afordances são constantes — **busca**, **notificações** (contador em `primary` com borda da própria superfície) e **identidade** (avatar `rounded-full`). Vale igual para barra superior ou lateral: muda o arranjo, não as regras.

### 8.8 Imagem e identidade

- **Texto sobre imagem** exige overlay (gradiente escuro) que garanta contraste ≥ 4,5:1 ⚠️ — nunca texto direto sobre foto.
- **Avatares/thumbs**: sempre com fallback de **iniciais** (até 2 letras em fonte display) quando não há foto; forma consistente por tipo (círculo para pessoa, `rounded-xl` para entidade/unidade).
- **Upload**: box tracejado + rótulo de ação (verbo) + hint de formato e limite.

---

## 9. Visualização de dados

Ferramenta padrão para gráficos: **Recharts**. As regras abaixo valem para qualquer visualização — gráfico, mapa, grafo, medidor — não só para os tipos já usados.

### 9.1 Convenções de gráfico

- Container: `.soft-card` com header (título display + subtítulo caption) e altura fixa (`h-[240px]`–`h-[280px]`).
- **Cor sempre da paleta de dados §3.4** via `hsl(var(--chart-N))`, em ordem fixa; série principal = `chart-1`. Nunca hex cru.
- Grid: `strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))"`. Eixos: `axisLine={false} tickLine={false}`, ticks 11–12px `muted-foreground`, valores abreviados (`1,2M`, `45%`).
- **Eixo duplo**: quando duas séries têm unidades diferentes (ex.: R$ à esquerda, contagem à direita), rotular os dois eixos e mapear cada série a um; a legenda nomeia a série, não o eixo.
- Tooltip custom em `.glass-tooltip` (dot da série + rótulo + valor bold); `cursor` sutil (`fill muted, opacity .2`). Legenda com círculos 8px — **obrigatória com 2+ séries** ⚠️.
- Barras: topo arredondado (`radius=[8,8,0,0]`), `barSize` ~20, gradiente vertical do token (1 → 0.7); meta/referência: `ReferenceLine strokeDasharray="6 4"` + label 10px.
- **Pizza/donut**: fatias sempre como **arcos de `<path>` preenchidos** (geometria explícita) — nunca o truque de `stroke-dasharray`/`stroke-dashoffset` em círculos, que quebra entre navegadores; separação por `stroke` da cor do card; hover `scale(1.05)` com `transform-box: fill-box`.
- Glow (`feGaussianBlur`) apenas na série principal do gráfico-herói (par com o §8.5, único glow do sistema).

### 9.2 SVG complexo, mapas e grafos

- ⚠️ **Renderizar como componente ou `<img>`, nunca por injeção de string em `innerHTML`** — paths inline injetados dessa forma não pintam de modo confiável entre navegadores.
- Tingir com **um único token** de marca (ex.: `fill: hsl(var(--primary)/.72)`); estados por opacidade/escala, não por nova cor.
- No dark, ajustar por filtro (`brightness`/`saturate`) em vez de recolorir path a path.

### 9.3 Acessibilidade da informação visual ⚠️

- **Nunca só cor** para distinguir séries/estados — legenda, rótulo ou ícone acompanham.
- **Toda representação não-textual** (gráfico, mapa, grafo, sunburst, treemap) que for a única fonte de um dado precisa de **alternativa em texto ou tabela** (ex.: lista de adjacência para um grafo; tabela para um mapa). O visual encanta; o texto garante que a informação exista para todos.

---

## 10. Composição de página

Princípios de arranjo — **não** modelos das telas do produto. Qualquer página nova se compõe destas regras e de um dos arquétipos abaixo.

### Envelope e regras transversais

```tsx
<div className="min-h-screen bg-background bg-mesh">
  <div className="sticky top-0 z-50 p-4 pb-0">{/* navegação primária §8.7 */}</div>
  <div className="max-w-[1440px] mx-auto px-6 py-6 space-y-6">{/* seções */}</div>
</div>
```

- Container máx. **1440px**; navegação primária sticky com respiro; seções tituladas separadas por 48px (§6).
- **Hierarquia**: no máximo **um elemento-herói** por página (§1, princípio 2); KPIs antes de gráficos; tabela nunca na primeira dobra de um painel.
- **Toda página** tem estado de carregamento (skeleton da própria estrutura) e de vazio (§8.1).

### Arquétipos de layout (reutilizáveis)

- **Foco único** — um herói (mapa, gráfico, número) + blocos de apoio ao redor. Para visões-resumo.
- **Mestre-detalhe** — índice/lista num **painel-companheiro sticky** (~1/3) + detalhe (~2/3). O item selecionado é sinalizado (fundo `primary/.07` + marca lateral); colapsa para uma coluna no mobile. Para navegar coleções (entidades, pessoas).
- **Grade de catálogo** — cards uniformes e autoexplicativos em grid responsivo (2–3 colunas). Para conjuntos de opções/ações equivalentes.
- **Formulário / assistente** — seções rotuladas, campos obrigatórios marcados, ações fixas no rodapé; passos quando o fluxo é longo.

---

## 11. Copy e formatos (pt-BR)

- **Voz**: profissional direta, sentence case (nunca Title Case em rótulos), verbos ativos, zero enchimento
- Botões dizem o resultado: "Exportar relatório", "Registrar infração"
- Erros: o que houve + como resolver ("Não foi possível salvar. Verifique a conexão e tente novamente."), sem desculpas teatrais
- Vazios orientam: "Nenhuma infração registrada neste período. Ajuste o filtro ou registre a primeira."
- **Números**: `R$ 4,82M` (moeda abreviada em KPI), `R$ 3.862,00` (tabela), `1.248` (milhar com ponto), `+12,5%` (vírgula decimal, sinal explícito)
- **Datas**: `14/07/2026` em tabelas; `14 jul 2026` em texto corrido; períodos "Últimos 6 meses"
- Terminologia fixa: Unidade, Consultor, Infração, Conformidade, Meta, Faturamento — nunca sinônimos alternados

---

## 12. Acessibilidade — checklist de entrega ⚠️

- [ ] Contraste: texto ≥ 4,5:1; texto grande e UI ≥ 3:1 (validar tokens §3 a cada mudança)
- [ ] Estado nunca comunicado só por cor (rótulo/ícone junto)
- [ ] `focus-visible` em tudo; fluxo de teclado completo (Tab, ESC fecha modal, Enter aciona)
- [ ] Botões só-ícone com `aria-label`; imagens com `alt`
- [ ] Alvos ≥ 44×44px, gap ≥ 8px
- [ ] `prefers-reduced-motion` respeitado (§7.5)
- [ ] Skeletons reservam espaço (CLS < 0,1); lazy-load de imagens
- [ ] Sem scroll horizontal em 375px; zoom não bloqueado
- [ ] Gráficos com legenda + tooltip; dado crítico disponível como texto

---

## 13. Checklist para replicar do zero

1. Vite + React + TS; Tailwind + `tailwindcss-animate`; **GSAP**: `npm i gsap @gsap/react`
2. `tailwind.config.ts`: cores por CSS vars, `fontFamily.display` Montserrat / `fontFamily.sans` IBM Plex Sans, fontSize custom (§5.2), radius custom (§6)
3. `index.css`: tokens §3.1/3.2 (incluindo `--chart-*` e `--shadow-*`), base §5.3, utilities §4
4. Import das fontes (§5.1) — self-host em produção
5. `npx shadcn init` com o components.json §2 + `add` dos componentes usados
6. `lib/utils.ts` com `cn()`
7. Provider de animação: registrar `useGSAP` e `ScrollTrigger`; criar hook `usePageEntrance` com a timeline §7.2
8. Compor páginas pelos arquétipos de layout §10; toda superfície nasce do `.soft-card` (§8.2)
9. Visualização de dados pelas convenções §9; tabelas §8.5; estados §8.1 em todos os componentes
10. Rodar o checklist §12 antes de entregar qualquer tela

---

## Changelog

- **v2.1** — Refino para **guia de estilos** (não catálogo): §8 reescrita como princípios de composição agnósticos (superfícies/card, controles e seleção, sobreposições, navegação primária, imagem e identidade) no lugar de specs de componentes nomeados; §9 generalizada de "Gráficos (Recharts)" para "Visualização de dados", com regra de renderização de SVG/mapa complexo (componente ou `<img>`, nunca `innerHTML`) e alternativa textual para toda viz não-textual; §10 convertida de templates de tela para arquétipos de layout reutilizáveis (foco único, mestre-detalhe, grade de catálogo, formulário).
- **v2.0** — Par tipográfico Montserrat + IBM Plex Sans; `success`/`warning` recalibrados para WCAG AA (verde e âmbar escurecidos; tons antigos movidos para paleta de dados); dark mode completo (success/warning definidos); escala formal de elevação (5 níveis) e z-index; sistema de motion GSAP (tokens, coreografia de entrada, microinterações, reduced-motion); estados obrigatórios de componentes (loading/empty/error/disabled/focus); paleta de dados fixa; templates de página; guia de copy pt-BR; checklist de acessibilidade.
- **v1.0** — Extração inicial do design do projeto.