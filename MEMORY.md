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
