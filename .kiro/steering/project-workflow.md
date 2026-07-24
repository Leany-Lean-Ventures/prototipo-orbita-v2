---
inclusion: always
---

# Órbita — Workflow e Skills do Projeto

Este arquivo orienta o uso das skills instaladas em `.kiro/skills/` durante o desenvolvimento do protótipo Órbita (Ademicon).

## Fontes de verdade (ler antes de construir qualquer tela)

1. **`MEMORY.md`** — decisões, definições e aprendizados do projeto. Leia antes de iniciar qualquer trabalho novo.
2. **`PRD/`** — especificação funcional por módulo (PRD-00 a PRD-09 + data-schema.json + form-schemas.json).
3. **`design-system/`** — tokens visuais da marca Ademicon (cores, tipografia, raios, sombras, motion). Tokens do design-system **sempre vencem** sugestões genéricas de qualquer skill.
4. **`orbita-v1-paginas-exportadas/`** — HTML + PNG do primeiro protótipo. Referência visual do padrão "flutuante".
5. **`CLAUDE.md`** — convenções de código, padrões de componente e regras duras do projeto.

## Quando usar cada skill

### `/ui-ux-pro-max`
Use ao **iniciar o trabalho em cada tela nova** para:
- Validar padrões de UX/acessibilidade por domínio (contraste, touch target, formulários, gráficos, navigation)
- Consultar recomendações de stack (`--stack react` ou `--stack shadcn`)
- Consultar presets de motion GSAP quando a tela precisar de animação
- Verificar boas práticas de chart/dataviz

### `/frontend-design`
Use ao **desenhar a composição** de uma tela nova (hierarquia visual, hero, estrutura, motion, copy) para garantir que o resultado tenha intenção de design. Respeitar sempre os tokens de marca (paleta, tipografia e raios já são fixos — a skill orienta composição e hierarquia, não substitui tokens).

### `/web-design-guidelines`
Use **depois de implementar** uma tela, como **revisão/auditoria** do código contra boas práticas de interface web (acessibilidade, estados, responsividade). Busca as guidelines mais recentes antes de cada revisão.

### `/gsap-core`, `/gsap-react`, `/gsap-timeline`, `/gsap-scrolltrigger`, `/gsap-performance`
Use ao implementar **qualquer animação GSAP**:
- `gsap-core` — API base (`gsap.to/from/fromTo`, easing, stagger, `gsap.matchMedia()`)
- `gsap-react` — integração React (`useGSAP`, scope, cleanup) — preferir `useGSAP` em vez de `useEffect`
- `gsap-timeline` — sequenciamento (timelines, labels, position parameters)
- `gsap-scrolltrigger` — reveals ao scroll
- `gsap-performance` — otimização (`gsap.quickTo`, transforms vs. layout)

## Fluxo de trabalho para construir uma tela

1. Ler `MEMORY.md` + PRD do módulo + `data-schema.json`/`form-schemas.json` se houver formulário.
2. Ler tokens em `design-system/` (`brand.json`, `system/variables.css`).
3. Usar `/ui-ux-pro-max` para padrões de UX/motion/gráfico que o design system não especifica.
4. Aplicar princípios de `/frontend-design` para composição e hierarquia, respeitando tokens.
5. Implementar em `src/pages` ou `src/components`, reutilizando componentes de `src/components/ui`.
6. Aplicar motion: microinterações CSS nos componentes base + `usePageEntrance` para entrada (usar skills `/gsap-*` quando necessário).
7. Usar `/web-design-guidelines` para revisar o resultado.
8. Validar com `npm run lint`, `npm test` e `npm run build`.

## Regra de prioridade

Se uma skill sugerir algo que conflite com os tokens do `design-system/` ou com uma decisão registrada em `MEMORY.md`, **o design-system e o MEMORY.md vencem**. Skills preenchem lacunas — não substituem decisões de marca ou decisões explícitas do usuário.
