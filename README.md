# Órbita — Protótipo (Ademicon)

Segunda versão do protótipo de interface web do projeto Órbita para a Ademicon: um dashboard operacional para gestão de unidades, consultores, pontos de venda, prévias, ocorrências, visitas e relatórios.

## Stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (sobre [Radix UI](https://www.radix-ui.com/))
- [React Router](https://reactrouter.com/), [TanStack Query](https://tanstack.com/query), [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/), [Sonner](https://sonner.emilkowal.ski/)
- [Vitest](https://vitest.dev/) + Testing Library, [ESLint](https://eslint.org/)

## Como rodar

```bash
npm install
npm run dev       # servidor de desenvolvimento, http://localhost:8080
```

Outros comandos:

| Comando | Descrição |
|---|---|
| `npm run build` | build de produção |
| `npm run build:dev` | build em modo desenvolvimento |
| `npm run preview` | pré-visualiza o build |
| `npm run lint` | ESLint |
| `npm test` / `npm run test:watch` | Vitest |

## Estrutura do projeto

```
.
├── CLAUDE.md              # instruções de trabalho para agentes de IA (fluxo, fontes de verdade, skills)
├── MEMORY.md              # registro de decisões, definições e aprendizados do projeto
├── PRD/                   # especificação funcional, módulo por módulo
│   ├── PRD-00-Visao-Geral.md
│   ├── PRD-01-Dashboard.md … PRD-09-Configuracoes.md
│   ├── data-schema.json
│   └── form-schemas.json
├── design-system/         # repositório próprio da marca Ademicon (clonado à parte, não versionado aqui)
├── src/
│   ├── components/ui/     # componentes shadcn/ui
│   ├── lib/utils.ts        # helper `cn`
│   ├── pages/              # telas (roteadas via react-router-dom)
│   ├── test/setup.ts        # setup do Vitest
│   ├── App.tsx / main.tsx / index.css
├── .claude/skills/         # skills instaladas (ver harness abaixo)
└── .agents/skills/         # cópia universal das mesmas skills (outras ferramentas de IA)
```

## Harness de desenvolvimento assistido por IA

O projeto é construído com apoio de agentes de IA (Claude Code), orientados por três fontes de verdade e um conjunto de skills instaladas em `.claude/skills/`. O fluxo completo está documentado em [`CLAUDE.md`](./CLAUDE.md); resumo:

### Fontes de verdade

1. **[`MEMORY.md`](./MEMORY.md)** — decisões e definições acumuladas do projeto (stack, arquitetura, processo, convenções). Consultado antes de qualquer trabalho novo.
2. **[`PRD/`](./PRD)** — especificação funcional por módulo/tela, incluindo modelo de dados (`data-schema.json`) e schemas de formulário (`form-schemas.json`).
3. **`design-system/`** — repositório próprio da marca Ademicon ([`Leany-Lean-Ventures/ademicon-design-system`](https://github.com/Leany-Lean-Ventures/ademicon-design-system)), clonado separadamente na raiz do projeto. Fonte de verdade dos tokens visuais (cor, tipografia, espaçamento, motion) — sempre tem prioridade sobre sugestões genéricas de qualquer skill.

### Skills instaladas (`.claude/skills/`)

| Skill | Papel no fluxo |
|---|---|
| `ui-ux-pro-max` | Base de dados local de padrões de UX, estilo, tipografia, motion e gráficos — consultada no início de cada tela nova |
| `frontend-design` | Direção de composição visual (hierarquia, tipografia, motion) para evitar telas "genéricas de IA" |
| `web-design-guidelines` | Revisão de código contra as Web Interface Guidelines (Vercel), após implementar |
| `webapp-testing` | Validação visual real via Playwright (screenshots, interação, logs), após implementar |
| `skill-creator` | Meta-skill para empacotar fluxos recorrentes do projeto como skills próprias, quando necessário |

### Fluxo de construção de uma tela

1. Ler `MEMORY.md` e o `PRD-XX` do módulo correspondente.
2. Ler os tokens relevantes em `design-system/`.
3. Consultar `ui-ux-pro-max` para padrões de UX/motion/gráfico não cobertos pelo design system.
4. Aplicar `frontend-design` na composição da tela.
5. Implementar em `src/pages`, reutilizando/estendendo `src/components/ui`.
6. Revisar com `web-design-guidelines`.
7. Validar visualmente com `webapp-testing`.
8. Rodar `npm run lint`, `npm test` e, quando fizer sentido, `npm run build`.

Detalhes completos, incluindo como invocar cada skill, estão em [`CLAUDE.md`](./CLAUDE.md).
