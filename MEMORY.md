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
