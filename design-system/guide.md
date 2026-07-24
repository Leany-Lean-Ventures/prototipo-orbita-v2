# Design System — Ademicon Dashboard (ORBITA) · v2.1 — Brand Guide

*Precisão financeira com leveza — dados densos em superfícies suaves, com o vermelho Ademicon usado com autoridade e parcimônia.*

Guia de estilos e design do produto Ademicon (ORBITA): a linguagem visual que garante consistência ao criar qualquer componente ou tela nova — tokens, princípios e regras que generalizam. Descreve DESIGN, não conteúdo: nenhuma feature, entidade ou copy específica do produto vive aqui (isso mora no código e em context/input-DESIGN.md). Calibrado para interfaces de dados densos em desktop, uso profissional e sessões longas.

Extracted from designmd://design-system-ademicon-dashboard-orbita-v2-1.

## Color roles

- **Canvas** (`#f2f2f2`) — background: fundo de página (nível 0) — sempre com .bg-mesh (radiais sutis vermelho/verde a 3% de opacidade). HSL 0 0% 95%.
- **Card** (`#ffffff`) — surface: superfícies nível 1 (.soft-card): KPIs, gráficos, tabelas, painéis, popovers, modais. HSL 0 0% 100%.
- **Foreground** (`#344256`) — foreground: texto padrão e títulos (≈9,4:1 sobre canvas — AAA). HSL 215 25% 27%.
- **Muted foreground** (`#566376`) — muted: texto secundário e metadados (≥4,5:1 ✓). Fundos neutros usam #e1e7ef (muted/20, muted/8). HSL 215 16% 40%.
- **Border** (`#e1e7ef`) — border: bordas, inputs e divisores; cards usam borda white/50 sobre a sombra soft. HSL 214 32% 91%.
- **Ademicon Red (primary)** (`#dc2626`) — accent: marca e cor de AÇÃO: botões primários (sólido), estado ativo de navegação (pill), abas ativas, seleções (chips/linhas) e switch 'ligado'; anel de foco; série principal de gráficos; um único KPI-herói de fundo vermelho por grupo. Parcimônia vale para grandes preenchimentos — como cor de ação, aparece em todas as telas. Foreground branco (4,8:1 ✓). HSL 0 72% 51%.
- **Brand Green (decorative)** (`#8bc34b`) — accent-secondary: verde de marca DECORATIVO — barras/fills de gráfico, progress. Reprova texto branco (~2,1:1): recebe texto ESCURO. Para comunicar sucesso em texto/badge, usar Success #527b24. HSL 88 50% 53%.

## Typography

- Display: Montserrat
- Body: IBM Plex Sans

## Messaging pillars

- Legibilidade acima de estética — contraste AA é inegociável; dado numérico sempre em numerais tabulares.
- Uma ousadia por tela — um único elemento-assinatura (a visualização-herói da tela) concentra a expressividade; todo o resto é quieto e disciplinado.
- Movimento com significado — animação comunica hierarquia e causalidade, nunca decoração gratuita.
- Densidade calibrada para dashboard — espaçamento compacto sem parecer apertado.
- Consistência aprende-se — mesmo padrão de card, badge, tabela e modal em todas as páginas.
