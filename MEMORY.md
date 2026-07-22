# Memória do Projeto — Órbita (Ademicon)

Registro de decisões, definições e aprendizados acumulados ao longo do projeto. Consulte este arquivo antes de iniciar qualquer trabalho novo — ele existe para não precisarmos re-explicar contexto a cada interação. Atualize sempre que uma decisão relevante for tomada (nova convenção, mudança de rumo, definição de escopo, correção de abordagem).

## Como usar

- Adicione uma entrada nova por decisão, na seção `## Decisões`, em ordem cronológica (mais recente no topo).
- Formato de cada entrada:
  ```
  ### AAAA-MM-DD — Título curto da decisão
  **Decisão:** o que foi definido.
  **Motivo:** por que essa escolha (contexto, restrição, pedido do usuário).
  **Status:** vigente | supersedida por [link/data] | revisar.
  ```
- Se uma decisão for revertida ou substituída, não apague a entrada antiga — marque `Status: supersedida por ...` e adicione a nova. O histórico de "por que mudamos de ideia" tem valor.
- Decisões de escopo muito específico de um módulo (ex: uma regra de negócio de uma tela) podem viver no próprio `PRD-XX` correspondente; aqui ficam decisões transversais ao projeto (stack, arquitetura, processo, ferramentas, convenções).

---

## Decisões

### 2026-07-22 — Redesign do App Shell para o padrão "flutuante" do protótipo V1
**Decisão:** `orbita-v1-paginas-exportadas/` (HTML + PNG do primeiro protótipo, pasta do usuário fora do controle de versão deste repo) passa a ser referência visual oficial, complementar ao `design-system/`. Inspecionei o HTML exportado diretamente (não só os prints) e extraí valores exatos:
- Fundo de página: `.bg-mesh` — gradiente radial `hsl(var(--primary)/0.03)` + `hsl(var(--secondary)/0.03)` nos cantos opostos. Implementado como utility em `src/index.css`, usando os tokens do projeto em vez dos valores fixos do V1 (dark-mode-safe).
- Header: **não** era só "arredondado" — era vidro fosco: `bg-card/80 backdrop-blur-md rounded-2xl shadow-soft border border-white/50`, dentro de um wrapper com `padding: 16px` que cria o vão até a borda da tela.
- Cards de conteúdo: a classe `.soft-card` do V1 (`border-radius: 1.5rem`, `border-color: white/50`, `shadow-soft`, hover `translateY(-2px)` 200ms) **já batia exatamente** com o que tínhamos implementado no componente `Card` desde a etapa 0/0.5 — validação cruzada da fundação visual.
- V1 não tinha sidebar (nav em pílulas dentro do próprio header, só 4 abas). Como o PRD-00 exige sidebar com 9 itens, perguntei ao usuário como adaptar o padrão flutuante a uma peça que não existia no V1 — decisão: **sidebar como painel flutuante independente**, mesmo tratamento visual do header (`rounded-2xl bg-card/80 backdrop-blur-md shadow-soft border-white/50`), com vão visível entre sidebar e header (não union num único shape).

Mudanças aplicadas: `AppShell.tsx` (layout com `p-4 gap-4 bg-mesh` no wrapper externo, sidebar e header como peças soltas), `AppSidebar.tsx` e `AppHeader.tsx` (glass + rounded-2xl), `Card` (agora aplica `.soft-card` — raio 24px, borda white/50, shadow-soft — **por padrão**, sem precisar repetir `rounded-card shadow-soft` em cada uso; `Index.tsx` limpo dessas classes redundantes), `Login.tsx` (bg-mesh + borda do card corrigida para white/50). Badge do sino e avatar do header ajustados para o detalhe exato do V1 (`border-2 border-card`, cutout).
**Motivo:** pedido explícito do usuário — os componentes já construídos (etapa 2) não refletiam a identidade visual "flutuante" do primeiro protótipo, que ele quer usar como referência para "impressionar visualmente o cliente" (objetivo já registrado). Uma divergência deliberada do V1: mantive `transition-[transform,box-shadow]` em vez do `transition: all` literal do V1 no `.soft-card` — já era regra dura nossa (`CLAUDE.md`) evitar `transition-all` por risco de animar propriedades não intencionais; o resultado visual é idêntico.
**Status:** vigente. Precedente para telas futuras: qualquer `<Card>` novo já nasce com o visual correto; não reintroduzir `border border-border` genérico em cards de conteúdo.

### 2026-07-22 — Etapa 2 concluída: App Shell, sem busca global, módulos pendentes como "Em construção"
**Decisão:** implementado o App Shell (`src/components/shell/`: `AppSidebar`, `AppHeader`, `AlertsPanel`, `AppShell`) conforme PRD-00 §4, com duas divergências deliberadas do PRD:
1. **Busca global removida do escopo** — o PRD-00 §4.2 lista um campo de busca no header, mas o usuário decidiu explicitamente que não faz sentido tê-lo agora (nenhum módulo com dados existe ainda). Não implementada; se for retomada no futuro, plugar quando os módulos com dados mock existirem (etapa 4+).
2. **Rotas dos 8 módulos ainda não construídos** (Unidades, Consultores, PVs, Prévias, Ocorrências, Visitas, Relatórios, Configurações) apontam para `src/pages/ComingSoon.tsx` em vez de ficarem sem rota — decisão do usuário para o sidebar ficar 100% navegável desde já, sem links quebrados numa demo. Cada uma é trocada pela página real na sua própria etapa (ver `PRD/ordem-desenvolvimento.md`).

Roteamento reestruturado em `src/App.tsx` para uma rota de layout (`<Route element={<RequireAuth><AppShell /></RequireAuth>}>` com as páginas como filhas) — `RequireAuth` não precisou mudar, `AppShell` renderiza `<Outlet/>`. O painel de alertas usa `src/lib/mock-data/alerts.ts`, populado com o array de 4 alertas de `PRD-01-Dashboard.md` §3 (mais completo que o exemplo de 2 itens do PRD-00 §6) — mesma fonte que o card de alertas do Dashboard vai reaproveitar na etapa 3. Avatar do header ganhou dropdown com "Sair" (usa `useAuth().logout()`, que já existia desde a etapa 1 mas nunca tinha UI para acioná-lo).
**Motivo:** fidelidade ao PRD-00 onde ele faz sentido hoje, com dois desvios justificados por decisão explícita do usuário (busca sem dado para buscar; placeholders em vez de links mortos para manter o protótipo demonstrável a qualquer momento do desenvolvimento).
**Status:** vigente. Novos componentes shadcn/ui de suporte: `badge`, `avatar`, `dropdown-menu`, `separator`, `sheet` — todos sobre dependências Radix já instaladas, sem `npm install` novo.

### 2026-07-22 — Fundação de motion (GSAP): CSS para microinteração, GSAP para orquestração
**Decisão:** adotado GSAP + `@gsap/react` (`useGSAP`) como biblioteca de animação, com uma regra de divisão clara: **CSS puro** (Tailwind `transition-*`) para hover/foco/press em elementos simples (botão, input, linha de tabela, card clicável); **GSAP** reservado para orquestração (entrada de página/seção, stagger de listas/grids, `ScrollTrigger`, count-up de KPI). Infraestrutura criada: `src/lib/motion.ts` (registro de plugins, tokens de easing/duração, `prefersReducedMotion()`, rede de segurança global via `gsap.matchMedia` + `globalTimeline.timeScale(100)`) e `src/hooks/use-page-entrance.ts` (hook reutilizável para a coreografia de entrada, com failsafe de ~2,5s). Componentes base (`Button`, `Input`, `Card`) atualizados com press/hover/foco; `Card` ganhou prop `interactive` (hover lift só em cards clicáveis, nunca em estáticos). Aplicado como prova de conceito em `Login.tsx`. `prefers-reduced-motion` tratado nos dois lados: `@media` global em `src/index.css` para as transições CSS, e checagem explícita no hook para o GSAP.
**Motivo:** pedido do usuário (impressionar visualmente o cliente com animações/hover/microinterações), mas a pesquisa mostrou que **isso já era a decisão oficial do design-system** (`design-system/context/input-DESIGN.md` §7 "Motion System"), não uma escolha nova — a paleta de duração/easing já tinha sido parcialmente antecipada em `src/index.css` na etapa 0. A divisão CSS vs. GSAP também vem do próprio spec (§7.3: "`.soft-card` hover — não duplicar em GSAP"), evitando usar GSAP para efeitos que o CSS já resolve com menos custo.
**Status:** vigente. Skills instaladas (todas "Safe" no scan): `gsap-core`, `gsap-react`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-performance`. Ficaram de fora `gsap-plugins`, `gsap-utils` (sem uso especificado no spec atual) e `gsap-frameworks` (Vue/Svelte, não se aplica). Toda tela nova a partir daqui deve usar `usePageEntrance` na entrada e os componentes base (que já têm as microinterações) — documentado em `CLAUDE.md`.

### 2026-07-22 — Etapa 1 concluída: Login com usuário fixo, sem seletor de perfil (Q07 resolvida)
**Decisão:** página `/login` implementada com autenticação mockada — qualquer e-mail válido + senha não vazia autentica como usuário fixo (Roberto Almeida / Gerente BU, `id: "U001"`), **sem** seletor de perfil RBAC. Estado de auth em `src/lib/auth-context.tsx` (`AuthProvider`/`useAuth`), persistido em `localStorage` (chave `orbita:auth`), lido de forma síncrona na inicialização para não piscar a tela de login em usuário já autenticado. Guarda de rota em `src/components/RequireAuth.tsx`, já aplicada à rota `/` em `App.tsx` (mesmo antes do App Shell existir). Senha de teste `senha-invalida` dispara o estado de erro visual (não há backend real).
**Motivo:** decisão do usuário durante o planejamento — manter simples agora; a matriz RBAC do PRD-09 (Diretoria, Gerente BU, Backoffice, Lojista) segue só como tabela informativa na etapa 11 (Configurações), sem afetar o que outras telas mostram/escondem. Resolve a questão Q07 do `sitemap.json`.
**Status:** vigente. Relevante para a etapa 2 (App Shell): reaproveitar `useAuth()` para o rodapé da sidebar/avatar do topbar, e envolver todas as rotas do shell (exceto `/login`) com `RequireAuth`.

### 2026-07-22 — Conflito com generic web-interface-guidelines: sentence case vence Title Case
**Decisão:** ao revisar `Login.tsx` com a skill `web-design-guidelines`, uma das regras genéricas (Vercel) recomenda Title Case em headings — mas o `design-system/brand.json` (voice.vocabulary.avoid) proíbe explicitamente Title Case em rótulos/títulos/menus, exigindo sentence case. Mantido sentence case ("Acessar o Órbita", "Esqueci minha senha").
**Motivo:** regra já estabelecida no `CLAUDE.md` — tokens/voz do design-system sempre vencem sugestões genéricas de qualquer skill. Registrado aqui para não reabrir a dúvida em revisões futuras com a mesma skill.
**Status:** vigente.

### 2026-07-22 — Sitemap como guia de desenvolvimento e ordem de construção
**Decisão:** `PRD/sitemap.json` é o documento que guia o pedido de desenvolvimento das páginas — 14 páginas mapeadas (13 dos PRDs + Login), com rotas, abas, overlays, componentes compartilhados, ordem sugerida e questões em aberto. Ordem de construção acordada: (0) fundação visual com tokens do design-system, (1) Login, (2) App Shell, (3) Dashboard, (4) Unidades lista+detalhe, (5) PVs, (6) Consultores, (7) Ocorrências, (8) Visitas, (9) Prévias, (10) Relatórios, (11) Configurações, (12) 404 e polimento.
**Motivo:** a ordem não segue a numeração dos PRDs de propósito — Unidades vem antes de PVs e Consultores porque cria os componentes reutilizáveis (abas, timeline, carteiras, comissionamento, societária) que os outros dois reaproveitam quase inteiros; Login vem antes do Shell por ser uma superfície pequena e isolada, ideal para validar os tokens do design system antes de comprometer o layout inteiro.
**Status:** vigente.

### 2026-07-22 — Design system oficial vence a paleta do PRD-00 (questão Q01)
**Decisão:** seguir **sempre** os tokens do `design-system/` oficial (accent `#dc2626`, background `#f2f2f2`, Montserrat + IBM Plex Sans, base 15px, raio 24px em cards). A paleta e a tipografia definidas no PRD-00 §3.1 (`--maroon #C43C30`, `--paper #F4EFE9`, Segoe UI, base 14px) estão **obsoletas**.
**Motivo:** o PRD-00 antecede a formalização do design system. Confirmado explicitamente pelo usuário. As classes utilitárias descritas no PRD-00 §3.3 (`.card`, `.pill`, `.btn`, `.tabs`, `table.t`) seguem valendo como *estrutura* de componente — o que muda são os valores visuais, que vêm do design system.
**Status:** vigente.

### 2026-07-22 — Página de Login adicionada ao escopo
**Decisão:** incluir uma página `/login` fora do App Shell (sem sidebar/topbar), com autenticação mockada — qualquer credencial entra como Roberto Almeida (Gerente BU). Link de "esqueci minha senha" apenas visual.
**Motivo:** solicitada pelo usuário; não consta em nenhum PRD. Fica registrada como questão Q07 no sitemap a definição pendente: se o protótipo precisa demonstrar múltiplos perfis de acesso (a matriz RBAC do PRD-09 prevê Diretoria, Gerente BU, Backoffice e Lojista), o login pode oferecer seleção de perfil.
**Status:** vigente.

### 2026-07-22 — Criação deste arquivo de memória
**Decisão:** manter `MEMORY.md` versionado no repositório como registro formal de decisões do projeto, complementar à memória automática interna do Claude (que fica focada em preferências de colaboração, não em decisões técnicas do Órbita).
**Motivo:** usuário pediu um local único de registro/consulta para não precisar reespecificar contexto a cada interação. Um arquivo no repo é visível, editável, versionado e portável entre máquinas/pessoas — diferente da memória automática, que é interna e não aparece para o time.
**Status:** vigente.

### 2026-07-22 — Skills de design instaladas no projeto
**Decisão:** instalar e documentar em `CLAUDE.md` cinco skills em `.claude/skills/`: `frontend-design` (direção/composição visual), `ui-ux-pro-max` (base pesquisável de padrões UX/motion/gráficos), `web-design-guidelines` (revisão de código contra Web Interface Guidelines da Vercel), `webapp-testing` (teste visual real via Playwright), `skill-creator` (meta-skill para criar skills próprias do projeto quando necessário).
**Motivo:** dar suporte ao fluxo de criação de telas guiado por design system + PRD. Avaliadas e descartadas por não se aplicarem ao escopo (dashboard interno, não marketing/marca): `ui-styling`, `design-system`, `design`, `brand`, `banner-design`, `slides` (do repo `ui-ux-pro-max-skill`) e `brand-guidelines`, `theme-factory`, `web-artifacts-builder`, `canvas-design`, `algorithmic-art`, `pdf`, `xlsx`, `pptx`, `docx`, `doc-coauthoring`, `internal-comms`, `claude-api`, `mcp-builder`, `slack-gif-creator` (do repo `anthropics/skills`). `ui-styling` ficou como candidata pendente, não instalada.
**Status:** vigente.

### 2026-07-22 — Repositório Git criado e sincronizado
**Decisão:** repositório GitHub `AngeloRosaLeany/prototipo-orbita-v2` (conta `angelo.rosa@leany.com.br`), remoto configurado via SSH usando o alias `github-leany` (chave `~/.ssh/id_ed25519_leany`). Identidade git local do repo (`user.name`/`user.email`) fixada para a conta Leany, independente da config global da máquina.
**Motivo:** máquina tem múltiplas identidades GitHub configuradas (conta pessoal "foxbit" via `gh` e conta Leany via SSH); o projeto deve ficar sob a conta Leany.
**Status:** vigente.

### 2026-07-22 — Design system oficial Ademicon como fonte de verdade visual
**Decisão:** clonado o repositório `Leany-Lean-Ventures/ademicon-design-system` para `design-system/` na raiz do projeto — **não versionado** neste repo (está no `.gitignore`), pois é um repositório próprio e independente. Tokens de marca (`brand.json`, `system/variables.css`) sempre têm prioridade sobre qualquer sugestão genérica de skill.
**Motivo:** garantir consistência visual com a marca Ademicon (cores, tipografia Montserrat + IBM Plex Sans, raio de 24px em cards, sombras, motion) em vez de decisões arbitrárias de estilo.
**Status:** vigente.

### 2026-07-22 — Stack técnica do protótipo definida
**Decisão:** Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui (Radix UI) + React Router + TanStack Query + Sonner + React Hook Form/Zod + Vitest, replicando o `package.json` de referência fornecido pelo usuário. Estrutura scaffolded manualmente (configs, `src/`, componentes base, testes) já que o pacote continha só as dependências.
**Motivo:** stack já era o padrão adotado pelo usuário para esse tipo de protótipo (nome do pacote original: `vite_react_shadcn_ts`).
**Status:** vigente.

### 2026-07-22 — PRDs como fonte de verdade funcional
**Decisão:** `PRD/` (já existente no diretório do projeto, versionado) contém a especificação funcional por módulo — `PRD-00` a `PRD-09`, mais `data-schema.json` e `form-schemas.json`. Toda tela nova deve começar pela leitura do PRD correspondente.
**Motivo:** evitar inventar comportamento/dado que já está especificado. Exemplo já aplicado: PRD-08 (Relatórios) define explicitamente que exportação PDF/CSV é só mock/preview no protótipo, não lógica real — isso guiou a decisão de não instalar skills `pdf`/`xlsx`.
**Status:** vigente.
