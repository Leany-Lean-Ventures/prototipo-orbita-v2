# Ordem de Desenvolvimento — Protótipo Órbita

Sequência acordada para a construção das telas. Serve como checklist de progresso: marque cada etapa conforme for concluída.

Detalhamento completo de cada página (abas, filtros, overlays, dados, dependências) está em [`sitemap.json`](./sitemap.json).

## Roteiro

| # | Etapa | Rota | PRD | Status | Por quê nessa posição |
|---|---|---|---|---|---|
| 0 | Fundação visual | — | — | ✅ | Aplicar os tokens do `design-system/` no `tailwind.config.ts` e `src/index.css` (cores, Montserrat + IBM Plex Sans, raios, sombras, motion) e disponibilizar os logos. Feito antes, evita retrabalho de estilo em todas as telas |
| 1 | Login | `/login` | — | ✅ | Superfície pequena e isolada, fora do shell. Valida os tokens na prática antes de comprometer o layout inteiro e define o estado de usuário logado |
| 2 | App Shell | — | PRD-00 | ⬜ | Sidebar, topbar, painel de alertas e guard de rota. Todas as páginas seguintes dependem dele |
| 3 | Dashboard | `/` | PRD-01 | ⬜ | Home do sistema. Valida os componentes de card, pill e KPI e a navegação para as listas |
| 4 | Unidades (lista + detalhe) | `/unidades`, `/unidades/:id` | PRD-02 | ⬜ | ⭐ Etapa mais pesada e de maior retorno: cria abas, timeline, tabela de carteiras com toggle de órfãs, comissionamento e societária |
| 5 | PVs (lista + detalhe) | `/pvs`, `/pvs/:id` | PRD-04 | ⬜ | Reaproveitamento quase total da etapa 4 — custo baixo se feito na sequência, com o contexto fresco |
| 6 | Consultores (lista + detalhe) | `/consultores`, `/consultores/:id` | PRD-03 | ⬜ | Reaproveita abas e timeline; adiciona avatar por nível, visão econômica e vínculos |
| 7 | Ocorrências | `/ocorrencias` | PRD-06 | ⬜ | Logbook central. Cria o bloco de anotação privada e o padrão de modal de detalhe/resolução |
| 8 | Visitas | `/visitas` | PRD-07 | ⬜ | Depende do padrão de ocorrências (visitas alimentam o Logbook) e reutiliza a anotação privada e o formulário condicional |
| 9 | Prévias | `/previas` | PRD-05 | ⬜ | Kanban é um padrão visual novo e isolado; depende do autocomplete sobre a base de consultores |
| 10 | Relatórios | `/relatorios` | PRD-08 | ⬜ | Consome dados já modelados nos módulos anteriores |
| 11 | Configurações | `/configuracoes` | PRD-09 | ⬜ | Módulo mais simples, majoritariamente informativo |
| 12 | 404 + polimento | `*` | — | ⬜ | Ajuste final de estilo e revisão de consistência entre telas |

**Legenda:** ⬜ pendente · 🟡 em andamento · ✅ concluída

## Princípio da ordenação

A sequência **não segue a numeração dos PRDs de propósito**. Unidades (PRD-02) vem antes de PVs (PRD-04) e Consultores (PRD-03) porque é onde nascem os componentes compartilhados — abas, timeline, tabela de carteiras, blocos de comissionamento e societária. Os outros dois módulos reaproveitam esses componentes quase inteiros; inverter a ordem significaria construí-los duas vezes.

O mesmo raciocínio vale para Ocorrências antes de Visitas: visitas realizadas alimentam o Logbook, e ambas compartilham o bloco de anotação privada.

## Definição de pronto (por etapa)

Cada etapa só é considerada concluída após passar pelo fluxo definido no [`CLAUDE.md`](../CLAUDE.md):

1. PRD do módulo e `MEMORY.md` lidos
2. Tokens do `design-system/` aplicados (nunca valores arbitrários)
3. Revisão com `web-design-guidelines`
4. Validação visual no navegador com `webapp-testing`
5. `npm run lint` e `npm test` passando

## Questões em aberto

Seis pontos aguardam decisão e estão registrados em `sitemap.json` → `questoesEmAberto`. Os que afetam o roteiro:

- **Q04 — Botão "Ver no Grafo" (etapas 5 e 6):** previsto nos cabeçalhos de PV e Consultor, mas nenhum PRD especifica a visualização em grafo nem existe rota para ela.
- **Q05 — Abas sem detalhamento (etapas 4, 5 e 6):** "Dados Financeiros", "Consultores Vinculados", "Avaliação 360º" e "Estrutura Organizacional" (do PV) são apenas nomeadas nos PRDs.

Q01 (paleta de cores) já foi **resolvida**: segue-se sempre o `design-system/` oficial.
