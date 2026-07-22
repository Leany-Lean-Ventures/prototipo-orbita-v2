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

## Fluxo de trabalho para construir uma tela

1. Ler o `PRD-XX` do módulo correspondente + `data-schema.json`/`form-schemas.json` se houver formulário ou dado envolvido.
2. Ler os tokens relevantes em `design-system/` (`brand.json` e `system/variables.css`) e, se útil, abrir `system/kit.html` para ver componentes equivalentes já estilizados.
3. Rodar `ui-ux-pro-max` (`--design-system` ou `--domain`) para padrões de UX/motion/gráfico que o design system não especifica.
4. Aplicar os princípios de `frontend-design` para a composição e hierarquia da tela, sempre respeitando os tokens de marca.
5. Implementar em `src/pages` (ou `src/components`), reutilizando/estendendo os componentes de `src/components/ui`.
6. Rodar `web-design-guidelines` para revisar o resultado antes de considerar a tela pronta.
7. Rodar `webapp-testing` para validar a tela no navegador (golden path + estados/erros) com o servidor de dev ativo.
8. Validar com `npm run lint`, `npm test` e, quando fizer sentido, `npm run build`.

## Comandos

- `npm run dev` — servidor de desenvolvimento (porta 8080)
- `npm run build` / `npm run build:dev` — build de produção / desenvolvimento
- `npm run lint` — ESLint
- `npm test` / `npm run test:watch` — Vitest
- `npm run preview` — pré-visualizar o build
