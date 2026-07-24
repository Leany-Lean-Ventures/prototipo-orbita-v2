---
name: "Design System — Ademicon Dashboard (ORBITA) · v2.1"
category: Brands
surface: web
colors:
  canvas: "#f2f2f2"
  card: "#ffffff"
  foreground: "#344256"
  muted-foreground: "#566376"
  border: "#e1e7ef"
  ademicon-red-primary: "#dc2626"
  brand-green-decorative: "#8bc34b"
---

# Design System — Ademicon Dashboard (ORBITA) · v2.1

> Category: Brands

> Surface: web

*Precisão financeira com leveza — dados densos em superfícies suaves, com o vermelho Ademicon usado com autoridade e parcimônia.*

Guia de estilos e design do produto Ademicon (ORBITA): a linguagem visual que garante consistência ao criar qualquer componente ou tela nova — tokens, princípios e regras que generalizam. Descreve DESIGN, não conteúdo: nenhuma feature, entidade ou copy específica do produto vive aqui (isso mora no código e em context/input-DESIGN.md). Calibrado para interfaces de dados densos em desktop, uso profissional e sessões longas.

## Color Palette

| Role | Name | Hex | Usage |
| --- | --- | --- | --- |
| background | Canvas | `#f2f2f2` | fundo de página (nível 0) — sempre com .bg-mesh (radiais sutis vermelho/verde a 3% de opacidade). HSL 0 0% 95%. |
| surface | Card | `#ffffff` | superfícies nível 1 (.soft-card): KPIs, gráficos, tabelas, painéis, popovers, modais. HSL 0 0% 100%. |
| foreground | Foreground | `#344256` | texto padrão e títulos (≈9,4:1 sobre canvas — AAA). HSL 215 25% 27%. |
| muted | Muted foreground | `#566376` | texto secundário e metadados (≥4,5:1 ✓). Fundos neutros usam #e1e7ef (muted/20, muted/8). HSL 215 16% 40%. |
| border | Border | `#e1e7ef` | bordas, inputs e divisores; cards usam borda white/50 sobre a sombra soft. HSL 214 32% 91%. |
| accent | Ademicon Red (primary) | `#dc2626` | marca e cor de AÇÃO: botões primários (sólido), estado ativo de navegação (pill), abas ativas, seleções (chips/linhas) e switch 'ligado'; anel de foco; série principal de gráficos; um único KPI-herói de fundo vermelho por grupo. Parcimônia vale para grandes preenchimentos — como cor de ação, aparece em todas as telas. Foreground branco (4,8:1 ✓). HSL 0 72% 51%. |
| accent-secondary | Brand Green (decorative) | `#8bc34b` | verde de marca DECORATIVO — barras/fills de gráfico, progress. Reprova texto branco (~2,1:1): recebe texto ESCURO. Para comunicar sucesso em texto/badge, usar Success #527b24. HSL 88 50% 53%. |

## Typography
- **Display:** Montserrat — weights 600, 700 — fallbacks: system-ui, -apple-system, Segoe UI, Helvetica Neue, Arial, sans-serif
- **Body:** IBM Plex Sans — weights 400, 500, 600 — fallbacks: ui-sans-serif, system-ui, -apple-system, Segoe UI, Helvetica Neue, Arial, sans-serif

## Voice & Tone

- **Adjectives:** profissional, direta, precisa, disciplinada, densa mas legível
- **Tone:** Voz profissional direta, em pt-BR: sentence case (nunca Title Case em rótulos), verbos ativos, zero enchimento. Erros dizem o que houve + como resolver, sem desculpas teatrais. Vazios orientam a próxima ação.

### Messaging pillars
- Legibilidade acima de estética — contraste AA é inegociável; dado numérico sempre em numerais tabulares.
- Uma ousadia por tela — um único elemento-assinatura (a visualização-herói da tela) concentra a expressividade; todo o resto é quieto e disciplinado.
- Movimento com significado — animação comunica hierarquia e causalidade, nunca decoração gratuita.
- Densidade calibrada para dashboard — espaçamento compacto sem parecer apertado.
- Consistência aprende-se — mesmo padrão de card, badge, tabela e modal em todas as páginas.

### Vocabulary
- **Use:** Rótulo de botão = verbo do resultado (ex.: 'Exportar relatório', 'Salvar alterações'), Sentence case em rótulos, títulos e menus, Moeda abreviada em KPI (ex.: R$ 4,82M) e completa em tabela (ex.: R$ 3.862,00), Percentual com sinal explícito e vírgula decimal (ex.: +12,5%), Milhar com ponto (ex.: 1.248), Data: 14/07/2026 em tabela; 14 jul 2026 em texto corrido, Mensagens de erro dizem o que houve + como resolver; vazios orientam a próxima ação
- **Avoid:** Title Case em rótulos, Enviar / OK genéricos (usar o verbo do resultado), Ops! e desculpas teatrais, emoji como ícone, trocar de termo para o mesmo conceito entre telas (manter terminologia consistente), hex/hsl cru em componente

## Imagery

- **Style:** Superfícies suaves e claras (soft cards flutuantes) sobre fundo mesh; a informação é a imagem — dataviz e a visualização-herói da tela, não fotografia decorativa.
- **Subjects:** dashboards e KPIs com count-up, visualização-herói / elemento-assinatura (uma por tela, podendo atuar como filtro-mestre), gráficos (barras, linhas, donut), tabelas e listas densas, avatares de pessoa (círculo) e de entidade (rounded-xl)
- **Treatment:** Texto sobre imagem exige overlay escuro garantindo ≥4,5:1. Avatares/thumbs com fallback de iniciais (até 2 letras, fonte display). SVG/mapa complexo renderizado como componente ou <img> (nunca innerHTML) e tingido por um único token de marca; estados por opacidade/escala.
- **Avoid:** texto direto sobre foto sem overlay, emoji como ícone, misturar famílias de ícones (padrão único: Lucide), glow / neon como decoração — o token --shadow-glow-primary é reservado só ao realce da série principal do gráfico-herói; ranking destaca com medalha ouro/prata/bronze, nunca glow, recolorir SVG path a path no dark (usar filtro)

## Layout

- **Radius:** Base shadcn --radius: 1rem (16px) → controles shadcn (botões, inputs, selects, date pickers) em rounded-md ~14px. Cards, painéis, modais e header flutuante: 24px — a classe canônica .soft-card fixa border-radius: 1.5rem (medido no código). Ícone-box contextual: circular (rounded-full) tingido. Badge de status: 6px (rounded-md). Chips de filtro, badges de categoria/tier, avatares, item ativo de nav e dot de status: pill (rounded-full).
- **Border weight:** 1px
- **Spacing:** escala fechada 4 · 8 · 12 · 16 · 20 · 24 · 32 · 48px (grid base 8px). Card p-5 (KPI) / p-6 (gráfico-tabela); gap-4 KPIs, gap-6 seções; 48px entre seções tituladas

### Posture rules
- Cinco níveis de elevação (Canvas · Card · Raised · Overlay · Glass); cada elemento declara UM nível — nunca empilhar sombras ad-hoc. No dark, elevação = luminosidade da superfície, não sombra.
- Uma ousadia por tela: o elemento-assinatura concentra a expressividade; no máximo um bloco 'primário' (fundo vermelho) por grupo.
- Container máx. 1440px (mx-auto px-6); navegação primária sticky em barra branca flutuante arredondada (mesmo raio de card, 24px), com logo à esquerda, trilho interno de itens (ativo = pill vermelho) e busca + notificações (contador vermelho) + identidade (avatar) à direita; seções tituladas separadas por 48px. KPIs antes de gráficos; tabela nunca na primeira dobra.
- Alvo de toque ≥ 44×44px, gap ≥ 8px; sem scroll horizontal em 375px; tabela larga rola dentro do card (overflow-x-auto). Testar em 375 / 768 / 1024 / 1440.
- Números sempre em tabular-nums; colunas numéricas alinhadas à direita; valor de destaque em fonte display.
- Motion GSAP: animar só transform e opacity (nunca width/height/margin); saída ~60% da entrada; ease-signature back.out(1.4) só na entrada de KPIs; prefers-reduced-motion obrigatório; failsafe de visibilidade (watchdog ~2,5s).
- Estado nunca comunicado só por cor — badge, delta e série sempre com rótulo/ícone/sinal (+/−). focus-visible (ring-2 ring-ring ring-offset-2) nunca removido.
- Todo componente interativo declara hover · focus-visible · active · disabled · loading (skeleton com dimensão real, CLS < 0,1) · empty (convite à ação) · error (junto ao campo).
- Vermelho é a cor de ação/seleção: botão primário (sólido), nav ativo (pill), aba ativa (sublinhado OU segmented com segmento branco elevado), chip/linha selecionada (borda + bg vermelho/.06 + marca visível) e switch 'ligado'. Verde é só delta positivo e status de sucesso — nunca ação. Delta sempre com sinal (+/−) além da cor.
- Ranking/prioridade: top 3 com medalha (ouro/prata/bronze) em box circular; demais posições com número em círculo neutro — nunca glow no ranking. Glow (--shadow-glow-primary) é reservado exclusivamente à série principal do gráfico-herói. Coluna de valor em bold display + tabular-nums; contagens em texto muted.
- Inputs, selects e date pickers: preenchimento suave (bg neutro claro), borda mínima, raio ~12px; foco com anel primary. Label em micro-uppercase com asterisco vermelho quando obrigatório. Upload = box tracejado + verbo em vermelho + hint de formato/limite.
- Ícone contextual em container circular tingido (bg-{cor}/10, ícone na cor). Badges de categoria/tier e chips de filtro em pill (rounded-full) com ícone 12px; badge de status retangular (rounded-md) com rótulo textual. Master-detail: item selecionado com bg vermelho/.07 + marca lateral vermelha.
- Cores de status (texto/badge) usam versões escurecidas AA com texto branco, no par bg-{cor}/10 + border/20: sucesso #527b24, atenção #b35309, erro/destrutivo #ef4343. ⚠️ O código exportado ainda define --success 88 50% 53% e --warning 45 93% 47% com foreground branco (reprovam ~2:1) — ao evoluir o produto, migrar para estes tons escurecidos. O verde/âmbar claros ficam só para dataviz.
