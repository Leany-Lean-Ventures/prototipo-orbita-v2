# Órbita — Protótipo (Ademicon)

Protótipo de interface web do projeto Órbita para a Ademicon. Stack: Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui (Radix), React Router, TanStack Query, Sonner.

## Fontes de verdade (leia antes de construir qualquer tela)

0. **`MEMORY.md`** — decisões, definições e aprendizados do projeto (stack, arquitetura, processo, ferramentas, convenções). Leia antes de iniciar qualquer trabalho novo e adicione uma entrada sempre que uma decisão relevante for tomada, revertida ou substituída.
1. **`PRD/`** — especificação funcional, módulo por módulo. Antes de implementar uma tela, leia o PRD correspondente:
   - `PRD-00-Visao-Geral.md` — contexto geral do produto
   - `PRD-01-Dashboard.md`, `PRD-02-Unidades.md`, `PRD-03-Consultores.md`, `PRD-04-PVs.md`, `PRD-05-Previas.md`, `PRD-06-Ocorrencias.md`, `PRD-07-Visitas.md`, `PRD-08-Relatorios.md`, `PRD-09-Configuracoes.md` — um por módulo/tela
   - `data-schema.json` — modelo de dados
   - `form-schemas.json` — validação e estrutura de formulários
2. **`design-system/`** — repositório próprio (clonado separadamente, não versionado neste repo) com a linguagem visual do produto. Sempre derive estilos daqui, nunca de valores arbitrários:
   - `design-system/brand.json` — fonte de verdade dos tokens (cor, tipografia, espaçamento, motion)
   - `design-system/system/variables.css` + `variables.dark.css` — tokens prontos em CSS custom properties (light/dark)
   - `design-system/system/kit.html` / `kit.dark.html` — showcase de componentes já estilizados
   - `design-system/logos/` — marca oficial (não recolorir/distorcer)
   - `design-system/DESIGN.md`, `SKILL.md`, `guide.md`, `context/input-DESIGN.md` — princípios, receitas e spec profunda (elevação, motion GSAP, z-index, dataviz)
3. **`orbita-v1-paginas-exportadas/`** — HTML + PNG do primeiro protótipo (não versionado). Referência visual do padrão "flutuante": telas completas (Painel, Unidades, Consultores, Relatórios) com o layout, hierarquia e microcopy reais. Ao construir uma tela nova cujo módulo exista no V1, abrir o PNG/HTML correspondente antes de desenhar do zero — inspecionar o HTML exportado direto (classes Tailwind reais), não só o print, quando precisar de um valor exato (raio, opacidade, espaçamento). V1 não tinha sidebar (nav em pílulas no header, só 4 módulos) — nosso shell tem 9 itens via sidebar (PRD-00), então nem toda estrutura do V1 se aplica 1:1; ver `MEMORY.md` para as adaptações já decididas.

**Regra geral:** tokens do `design-system/` sempre têm prioridade sobre sugestões genéricas de qualquer skill abaixo. Skills preenchem lacunas (padrões de UX, motion, gráficos) que o design system não cobre — não substituem os tokens de marca já definidos.

## Skills disponíveis (`.claude/skills/`)

Use estas skills ao criar ou revisar qualquer tela:

### `ui-ux-pro-max`
Base de dados local (estilos, paletas, tipografia, padrões de UX, ícones, motion GSAP, gráficos) pesquisável por script Python. Use no início do trabalho de cada tela nova para:
- Validar padrões de UX/acessibilidade por categoria de prioridade (contraste, touch target, layout responsivo, formulários, navegação, gráficos)
- Consultar recomendações específicas de stack (`--stack react` ou `--stack shadcn`)
- Consultar padrões de motion GSAP quando a tela precisar de animação

Invocação:
```bash
python .claude/skills/ui-ux-pro-max/scripts/search.py "<consulta>" --domain <dominio>
```
Combine com os tokens do `design-system/` — se a skill sugerir uma cor/fonte que conflite com a marca Ademicon, os tokens do design system vencem.

### `frontend-design`
Guia de direção de design para evitar telas "genéricas de IA". Use ao desenhar a composição de uma tela nova (hero, hierarquia tipográfica, estrutura, motion, copy) para garantir que a execução tenha intenção, dentro dos limites do design system (paleta, tipografia e raios já são fixos pela marca — a skill orienta composição e hierarquia, não substitui os tokens).

### `web-design-guidelines`
Skill de revisão (Vercel Web Interface Guidelines). Use **depois** de implementar uma tela, para auditar o código contra boas práticas de interface (acessibilidade, estados, responsividade). Busca as regras mais recentes via rede antes de cada revisão.

### `webapp-testing`
Toolkit Playwright para testar a aplicação rodando de verdade no navegador: screenshots, interação com elementos, logs do console. Use **depois** de implementar uma tela para validar visualmente (golden path + estados/erros) com o servidor de dev (`npm run dev`) ativo — fecha o loop que a revisão estática de código (`web-design-guidelines`) não cobre.

Scripts em `.claude/skills/webapp-testing/scripts/with_server.py` (gerencia o ciclo de vida do servidor) e exemplos em `.claude/skills/webapp-testing/examples/`. Rodar `--help` antes de usar qualquer script.

### `skill-creator`
Meta-skill para criar/editar/otimizar skills do projeto. Use quando surgir uma necessidade recorrente que as skills atuais não cobrem bem (ex.: um fluxo específico de leitura de PRD + design-system que vale empacotar como skill própria do Órbita) — não para o dia a dia de construção de tela.

### `gsap-core`, `gsap-react`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-performance`
Skills oficiais do GreenSock para a biblioteca de animação adotada pelo design-system (`design-system/context/input-DESIGN.md` §7). Use ao implementar qualquer animação GSAP (ver seção "Motion e microinterações" abaixo para quando usar GSAP vs. CSS puro):
- `gsap-core` — API base (`gsap.to/from/fromTo`, easing, stagger, `gsap.matchMedia()`)
- `gsap-react` — integração com React (`useGSAP`, `scope`, cleanup automático) — **preferir sempre a `useGSAP` em vez de `useEffect` puro**
- `gsap-timeline` — sequenciamento (timelines, labels, position parameters)
- `gsap-scrolltrigger` — reveals ao rolar a página (conteúdo abaixo da dobra)
- `gsap-performance` — otimização (`gsap.quickTo`, transforms vs. layout)

## Motion e microinterações

O objetivo do protótipo inclui impressionar visualmente — toda tela nova deve ter hover, foco, press e entrada tratados com intenção, nunca mudança instantânea. O design-system (`design-system/context/input-DESIGN.md` §7) define duas ferramentas, cada uma para um tipo de movimento — **não misturar**:

| Tipo de movimento | Ferramenta | Exemplos |
|---|---|---|
| Hover, foco, press em elementos simples | **CSS puro** (`transition-*` do Tailwind, tokens `duration-micro`/`duration-base`/`ease-micro`) | Botão (`active:scale-[0.98]`, hover lift), input (fade de cor de borda no foco), linha de tabela (`hover:bg-muted/8`), card clicável (`Card interactive`) |
| Orquestração — entrada de página/seção, listas/grids, scroll, elementos-assinatura | **GSAP** (`useGSAP`, timelines, `ScrollTrigger`) | Coreografia de entrada (`usePageEntrance`), stagger de KPIs/tabelas, reveal abaixo da dobra, count-up de KPI |

⚠️ Regras duras (design-system §7.1/§7.3, não relaxar): animar só `transform`/`opacity`/`box-shadow`/cor (nunca `width`/`height`/`margin` ou `transition-all`); saída sempre mais rápida que entrada (~60%); `prefers-reduced-motion` obrigatório em ambos os lados (CSS e GSAP).

### Infraestrutura disponível

- **`src/lib/motion.ts`** — registra os plugins GSAP uma vez (`useGSAP`, `ScrollTrigger`), exporta os tokens de easing/duração (`EASE_MICRO`, `EASE_ENTER`, `EASE_SIGNATURE`, `DUR_MICRO`, `DUR_BASE`, `DUR_ENTER`, `STAGGER_LIST`) e `prefersReducedMotion()`. Importado uma única vez em `src/main.tsx` — não reimportar em cada página.
- **`src/hooks/use-page-entrance.ts`** — hook `usePageEntrance<T>(steps)` para a coreografia de entrada (§7.2): recebe uma lista `{ selector, vars, position? }` escopada ao elemento que recebe o ref retornado. Já trata `prefers-reduced-motion` (aplica o estado final sem animar) e o failsafe obrigatório (~2,5s — força o estado final se a timeline não completar). Ver uso em `src/pages/Login.tsx`.
- Tokens CSS já em `src/index.css`/`tailwind.config.ts`: `duration-micro/base/enter`, `ease-micro`, `shadow-soft/elevated/overlay/glow-primary`, `rounded-card`. Regra `@media (prefers-reduced-motion: reduce)` global já cobre as transições CSS puras.

### Componentes base já com microinterações

`Button` (press + hover lift + sombra), `Input` (fade de borda no foco) e `Card` (prop `interactive` — só ativar em cards clicáveis, nunca em cards estáticos, conforme §8.2). Reutilizar esses componentes em vez de recriar hover/focus/press do zero.

## Ícones, cor de destaque e espaçamento (regras duras — nunca relaxar)

1. **Nunca usar emoji ou glifo unicode como ícone em qualquer elemento renderizado da UI** (texto, badge, chip, mock data). Todo ícone é um componente **Lucide React** (`lucide-react`, já é dependência do projeto). Mock data que precisa de um ícone por item (KPI, alerta, ocorrência, etc.) tipa o campo como `LucideIcon` (`import type { LucideIcon } from "lucide-react"`) e guarda o componente, nunca uma string de emoji — ver `src/lib/mock-data/dashboard.ts`/`alerts.ts`. Quem renderiza captura numa variável maiúscula antes de usar como tag JSX: `const Icon = item.icon; <Icon className="h-4 w-4" />`. Isso vale também para indicadores textuais tipo seta de tendência ("▲") — usar `TrendingUp`/`TrendingDown` de verdade, não o glifo. Comentários de código (não renderizados) estão fora do escopo da regra.
2. **Nunca usar stroke deslocado de um lado (`border-l-4`, `border-t-4`, etc.) para destacar/categorizar um container por cor.** Padrão correto: borda completa neutra (`border border-border` ou uma variante sutil como `border-primary/20`) + **chip de ícone colorido** (`flex h-9 w-9 items-center justify-center rounded-xl bg-{cor}/10 text-{cor}`) carregando a cor/categoria — ver o padrão em "Alertas que exigem ação" e "Últimas Ocorrências" do `Dashboard.tsx`. Reaproveitar esse padrão em qualquer lista/linha futura que precise indicar categoria por cor (ex.: linhas de tabela em Unidades/PVs/Consultores).
3. **Padding interno de card sempre `p-6` (24px), nunca um valor único fora do padrão** (ex.: `p-5`) — mesmo que o card pareça precisar de menos espaço por ter pouco conteúdo. Cards com padding diferente do resto da página quebram a percepção de espaçamento consistente entre blocos vizinhos, mesmo quando o gap externo (`space-y-*`/`gap-*`) está correto — ver o caso do `KpiCard` em `MEMORY.md` (2026-07-22). Se o espaçamento entre dois blocos "parecer" errado numa revisão visual mesmo com o gap externo certo, suspeitar primeiro do padding *interno* dos cards adjacentes, não do gap — medir com Playwright (`getBoundingClientRect()`) antes de alterar CSS às cegas.

## App Shell (`src/components/shell/`)

Layout persistente que envolve todas as páginas autenticadas (PRD-00 §4), no padrão "flutuante" do protótipo V1 (`orbita-v1-paginas-exportadas/`, decisão em `MEMORY.md`): sidebar e header são painéis soltos sobre o canvas `bg-mesh`, não barras coladas nas bordas.

- **`AppShell.tsx`** — wrapper externo `min-h-screen p-4 gap-4 bg-background bg-mesh`, **sem** `overflow-y-auto`/`overflow-hidden` em nenhum nível: a página rola pelo scroll nativo do navegador (barra na borda real da janela, como no V1), não por uma div interna. Sidebar e header ficam parados na tela via `position: sticky` (`AppSidebar.tsx`: `sticky top-4 h-[calc(100vh-2rem)]`; `AppHeader.tsx`: `sticky top-4 z-page-header`), não por estarem dentro de um container de scroll isolado. Isso é o que faz o conteúdo passar por baixo do header e aparecer borrado através do `backdrop-blur-md`. **Nunca** reintroduzir `overflow-y-auto` num container que envolva o header ou a sidebar — já quebrou o efeito de vidro fosco e a barra de rolagem nativa duas vezes (ver `MEMORY.md`). `.bg-mesh` tem `background-attachment: fixed` por causa disso (o gradiente precisa ficar ancorado ao viewport, não ao documento, já que a página pode ser bem mais alta que a tela).
- **`AppSidebar.tsx`** — 236px, painel próprio `rounded-2xl bg-card/80 backdrop-blur-md shadow-soft border-white/50` (vidro fosco, mesmo tratamento do header). Tokens `sidebar-*` para o estado dos itens (claro, pill vermelho no ativo — decisão em `MEMORY.md`), rodapé com `useAuth().user`.
- **`AppHeader.tsx`** — mesmo tratamento glass, 64px. Breadcrumb dinâmico, sino de alertas (badge estilo V1: `border-2 border-card` criando efeito de recorte) e avatar (`border-2 border-card shadow-md`) com `DropdownMenu` (inclui "Sair" → `logout()`). **Sem busca global** — removida do escopo, ver `MEMORY.md`.
- **`AlertsPanel.tsx`** — `Sheet` lateral com os alertas mockados (`src/lib/mock-data/alerts.ts`); "Resolver" navega para a rota do alerta e fecha o painel.
- **`nav-items.ts`** — fonte única dos 9 itens do menu principal (`{ label, path, icon }`). Usada pelo `AppSidebar` **e** pelo breadcrumb do `AppHeader` (`resolveNavLabel(pathname)`). Ao adicionar uma rota nova (etapas 4+), registrar aqui ou o breadcrumb cai no fallback `"Órbita"`.

`src/App.tsx` usa uma rota de layout: `<Route element={<RequireAuth><AppShell /></RequireAuth>}>` com as páginas como filhas. Toda página nova protegida entra como filha dessa rota, não precisa de `RequireAuth` individual.

**`Card` (`src/components/ui/card.tsx`) já aplica `.soft-card` por padrão** — `rounded-card` (24px), borda `white/50`, `shadow-soft`. Não repetir essas classes ao usar `<Card>`; usar a prop `interactive` só em cards clicáveis (hover lift). Quando `interactive` recebe `onClick`, o próprio componente adiciona `role="button"`, `tabIndex`, `onKeyDown` (Enter/Espaço) e anel de foco — não precisa reimplementar acessibilidade de teclado em cada uso. `.bg-mesh` (utility em `src/index.css`) vai no wrapper de fundo de qualquer tela de página inteira (já aplicado em `AppShell` e `Login.tsx`).

**`src/lib/alerts-panel-context.tsx`** (`AlertsPanelProvider`/`useAlertsPanel`) — estado do painel de alertas (Sheet), envolvendo o `AppShell` inteiro. Qualquer página protegida pode abrir o painel via `useAlertsPanel().open()` (ex.: um KPI de alerta) em vez de navegar para uma rota que não existe.

**Módulos ainda não construídos** (Unidades, Consultores, PVs, Prévias, Ocorrências, Visitas, Relatórios, Configurações) apontam para `src/pages/ComingSoon.tsx` — um placeholder consistente com o design-system (§8.1 "empty"), não um 404. Ao construir o módulo de verdade (sua etapa em `PRD/ordem-desenvolvimento.md`), troque o `element` da rota em `App.tsx` de `<ComingSoon />` para a página real — `ComingSoon` não precisa ser removida de lugar nenhum além dali.

## Gráficos e dados de página (Dashboard e módulos futuros)

- **ApexCharts** (`apexcharts` + `react-apexcharts`) é a biblioteca de gráficos oficial do projeto — não usar outra. Cores das séries sempre a partir de `chart-1`..`chart-5` (hex fixos, ver `design-system/brand.json` — mesma ordem usada em `tailwind.config.ts`/`index.css`). Diferenciar séries por estilo de linha além de cor (`dashArray`), não só cor — acessibilidade (ver `EvolutionChart.tsx`). Reduzir a animação padrão da lib para ~600ms (design-system §7.4) e desabilitar sob `prefersReducedMotion()`.
- **Dado crítico sempre disponível como texto**, não só no gráfico (design-system §12) — ver o parágrafo `sr-only` em `EvolutionChart.tsx` como padrão a repetir.
- **`src/lib/mock-data/`** — um arquivo por módulo/domínio (`alerts.ts`, `dashboard.ts`, ...), tipado, comentado com a origem no PRD. Dados compartilhados entre telas (ex.: `alerts` usado tanto no `AlertsPanel` do header quanto no card de alertas do Dashboard) vivem em um único arquivo e são importados, nunca duplicados.
- **`src/hooks/use-count-up.ts`** — count-up de KPI (design-system §7.2: 0→valor em 0.6s, `snap`, formatado com `Intl.NumberFormat('pt-BR')`). Usar em qualquer número de destaque que mereça entrada animada.
- **Ao montar a timeline de `usePageEntrance` de uma tela nova, somar as durações + overlaps antes de implementar** — a regra do design-system é "timeline total < 1s" (§7.2), e overlaps padrão (`-=0.15`/`-=0.2`) não bastam quando a página tem muitos grupos (ex.: Dashboard tem 5). Já aconteceu de passar de 1,7s — ver `MEMORY.md`.
- **Nunca registrar `ScrollTrigger` em ambiente de teste** — `src/lib/motion.ts` já faz o guard (`!import.meta.env.TEST`); se um componente novo precisar de scroll reveal, testar rodando a suíte de testes várias vezes antes de considerar concluído (o erro é intermitente, não determinístico) — ver `MEMORY.md`.

## Fluxo de trabalho para construir uma tela

1. Ler `MEMORY.md` + o `PRD-XX` do módulo correspondente + `data-schema.json`/`form-schemas.json` se houver formulário ou dado envolvido.
2. Ler os tokens relevantes em `design-system/` (`brand.json` e `system/variables.css`) e, se útil, abrir `system/kit.html` para ver componentes equivalentes já estilizados.
3. Rodar `ui-ux-pro-max` (`--design-system` ou `--domain gsap` para presets de motion) para padrões de UX/motion/gráfico que o design system não especifica.
4. Aplicar os princípios de `frontend-design` para a composição e hierarquia da tela, sempre respeitando os tokens de marca.
5. Implementar em `src/pages` (ou `src/components`), reutilizando/estendendo os componentes de `src/components/ui`.
6. Aplicar motion: microinterações CSS nos componentes (já cobertas por `Button`/`Input`/`Card`) e `usePageEntrance` para a entrada da tela — ver seção "Motion e microinterações" acima.
7. Rodar `web-design-guidelines` para revisar o resultado antes de considerar a tela pronta.
8. Rodar `webapp-testing` para validar a tela no navegador (golden path + estados/erros + hover/foco/entrada, com e sem `prefers-reduced-motion`) com o servidor de dev ativo.
9. Validar com `npm run lint`, `npm test` e, quando fizer sentido, `npm run build`.

## Comandos

- `npm run dev` — servidor de desenvolvimento (porta 8080)
- `npm run build` / `npm run build:dev` — build de produção / desenvolvimento
- `npm run lint` — ESLint
- `npm test` / `npm run test:watch` — Vitest
- `npm run preview` — pré-visualizar o build
