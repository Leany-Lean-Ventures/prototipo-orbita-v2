# Design System — Ademicon Dashboard (ORBITA) · v2.1

**Guia de estilos e design** do produto Ademicon (ORBITA) — a linguagem visual que garante consistência ao criar qualquer componente ou tela nova. Descreve **design, não conteúdo**.

- **ID registrado:** `user:design-system-ademicon-dashboard-orbita-v2-1`
- **Fonte:** `designmd://design-system-ademicon-dashboard-orbita-v2-1`
- **Superfície:** web (dashboard de dados densos, desktop, sessões longas)
- **Proveniência:** DESIGN.md colado (`context/input-DESIGN.md`) + 6 telas reais (`01…04.1`) + HTML exportado (`01---Painel.html`). Valores marcados **(medido)** vêm do código/CSS computado; **(inferido)** vêm de screenshot.

> Como usar em uma nova tela: leia `SKILL.md` (receitas de componente) e `DESIGN.md` (princípios). Cole `system/variables.css` no primeiro `<style>` e derive tudo dos tokens — nunca hex cru.

---

## Manifesto de arquivos

| Caminho | O que é | Origem |
| --- | --- | --- |
| `brand.json` | **Fonte de verdade** — tokens, voz, imagery, layout, `seed`. Tudo regenera daqui. | editável |
| `DESIGN.md` · `guide.md` · `brand.html` | Guia distilado + preview. | gerado do `brand.json` |
| `README.md` · `SKILL.md` | Referência do pacote + receitas para o agente. | escrito à mão |
| `system/variables.css` · `variables.dark.css` | `:root{}` + `.dark{}` com `--brand-*` e tokens do produto. | gerado |
| `system/tokens.{default,dark,compact}.json` | DesignTokens derivados por tema. | gerado |
| `system/theme.json` · `seed.json` | Tema antd (token + algorithm). Overrides persistem em `brand.json.seed`. | gerado |
| `system/kit.html` · `kit.dark.html` | Showcase de componentes (claro/escuro). | gerado |
| `system/artifacts/*.html` | landing · deck · poster · email · newsletter · form. | gerado |
| `context/input-DESIGN.md` | Spec original completa (§1–13): elevação, motion GSAP, z-index, dataviz. **Referência profunda.** | proveniência |
| `logos/ademicon-logo.png` | Logo real. Preservar; não redesenhar. | asset real |
| `01…04.1` (`.png` / `.html`) | Telas reais e código exportado — evidência de extração. | proveniência |

Para re-tematizar: edite `brand.json` (ou `brand.json.seed`) e rode `od brand finalize <brand-id>`. Não edite arquivos `system/` à mão — o finalize os substitui.

---

## Tokens de cor

### Paleta de marca (7 papéis registrados)
| Papel | Hex | HSL | Uso |
| --- | --- | --- | --- |
| background (Canvas) | `#f2f2f2` | `0 0% 95%` | fundo de página + `.bg-mesh` |
| surface (Card) | `#ffffff` | `0 0% 100%` | `.soft-card`: KPIs, gráficos, tabelas, modais |
| foreground | `#344256` | `215 25% 27%` | texto/títulos (≈9,4:1 — AAA) |
| muted | `#566376` | `215 16% 40%` | texto secundário (≥4,5:1). *Código real usa 47% (~#65758b) — DS mantém 40% por contraste.* |
| border | `#e1e7ef` | `214 32% 91%` | bordas, inputs, divisores |
| accent (Ademicon Red) | `#dc2626` | `0 72% 51%` | **cor de ação**: CTA, nav ativo, seleção, foco, série 1 |
| accent-secondary (Green) | `#8bc34b` | `88 50% 53%` | verde **decorativo** (fills/dataviz). Texto branco reprova (~2,1:1). |

### Paleta funcional (não são papéis de marca — semânticas e dataviz)
**Status (texto/badge, versões AA-escurecidas, texto branco):**
`success #527b24` (`88 55% 31%`) · `warning #b35309` (`26 90% 37%`) · `destructive/error #ef4343` (`0 84% 60%`).
Par de badge: `text-{cor} bg-{cor}/10 border border-{cor}/20`.
⚠️ **(medido)** O código exportado ainda define `--success: 88 50% 53%` e `--warning: 45 93% 47%` com foreground branco — **reprovam ~2:1**. Migrar o produto para os tons escurecidos acima.

**Gráficos (`--chart-N`, ordem fixa, nunca reordenar):**
`chart-1 #dc2626` (marca) · `chart-2 #8bc34b` (verde) · `chart-3 #e7b008` (âmbar) · `chart-4 #2463eb` (azul) · `chart-5 #7e22ce` (roxo).

**Categorias nominais (tags — nunca para estado semântico):** `blue · emerald · amber · purple · rose` → light `bg-{c}-100 text-{c}-700 border-{c}-200`, dark `bg-{c}-900/30 text-{c}-400 border-{c}-800`.

---

## Tipografia
- **Display:** Montserrat (600, 700) — h1–h4, valores de KPI, nav, marca. `tracking-tight`.
- **Corpo/Dados:** IBM Plex Sans (400, 500, 600) — texto, tabelas, inputs. Base **15px**, `line-height 1.6`, `letter-spacing -0.01em`.
- Fallbacks: `system-ui, -apple-system, Segoe UI, Helvetica Neue, Arial, sans-serif`.
- ⚠️ **Números tabulares obrigatórios** em coluna numérica / KPI / eixo: `font-variant-numeric: tabular-nums lining-nums`. **(medido)**

---

## Elevação, raio, espaçamento, motion

### Sombras **(medido no código)**
```css
--shadow-soft: 0 10px 25px -5px rgba(0,0,0,0.04), 0 8px 10px -6px rgba(0,0,0,0.04);
--shadow-md:   0 6px 16px -4px rgba(0,0,0,0.10), 0 3px 6px -3px rgba(0,0,0,0.06); /* nível 2 */
--shadow-xl:   0 20px 25px -5px rgba(0,0,0,0.1),  0 8px 10px -6px rgba(0,0,0,0.1);
--shadow-glow-primary: 0 0 20px hsla(0,72%,51%,0.35); /* só série principal do gráfico-herói */
```
Cinco níveis: 0 Canvas · 1 Card (`.soft-card`, `--shadow-soft`, borda `white/50`) · 2 Raised (`--shadow-md`) · 3 Overlay (`--shadow-xl` + backdrop `black/40`) · 4 Glass (`.glass-tooltip`). No dark, elevação = luminosidade da superfície, não sombra.

### Raio
- Base shadcn `--radius: 1rem` (16px) → controles em `rounded-md` ~14px.
- **Cards/painéis/modais/header: 24px** — `.soft-card { border-radius: 1.5rem }` **(medido)**.
- Ícone-box: circular · badge de status: 6px · chips/categoria/tier/avatar/nav-ativo/dot: pill.

### Espaçamento (grid base 8px)
Escala fechada `4 · 8 · 12 · 16 · 20 · 24 · 32 · 48`. Card `p-5` (KPI) / `p-6` (gráfico-tabela); `gap-4` (KPIs) / `gap-6` (seções); **48px** entre seções tituladas. Container máx. **1440px**.

### Motion (GSAP)
Tokens: `dur-micro .15–.2s` · `dur-base .25–.3s` · `dur-enter .4–.5s` · `stagger .03–.06s` · ease `power1.out` (micro) / `power2.out` (entrada) / `back.out(1.4)` (assinatura, só KPIs). Regras duras: animar só `transform`/`opacity`; saída ~60% da entrada; `prefers-reduced-motion`; watchdog de visibilidade ~2,5s. **(medido)** `.soft-card` transiciona `all 200ms cubic-bezier(0.4,0,0.2,1)`, hover `translateY(-2px)`.

### Z-index (escala fechada)
`0` conteúdo · `10` decoração de card · `40` header sticky de tabela · `50` header de página · `60` dropdown/popover · `80` modal/drawer · `90` toast · `100` tooltip. **(medido: 10/20/50/100 em uso)**

---

## Caveats / lacunas
- **Cores de status no produto reprovam AA** (success/warning claros + texto branco) — DS já traz os tons corretos; falta migrar o `index.css` do produto.
- **Paleta funcional** (chart/status/categoria) documentada aqui e em `context/input-DESIGN.md`, mas **não** registrada como papéis do DS (a paleta registrada tem 7 papéis). Promover a tokens é decisão pendente do usuário.
- `muted` diverge: DS 40% vs código 47% — mantido 40% por contraste.
- Sem web/Figma para re-medir; toda evidência é local (spec + telas + HTML exportado).
