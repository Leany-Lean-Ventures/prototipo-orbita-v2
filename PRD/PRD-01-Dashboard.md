# PRD-01: Dashboard
## Novo CRM Ademicon — Protótipo Órbita

### 1. Objetivo do Módulo
O Dashboard é a página inicial (home) do Órbita. Seu objetivo é fornecer uma visão executiva e em tempo real do estado da Rede & Expansão da Ademicon. Ele deve destacar métricas críticas (KPIs), exibir um resumo executivo em texto, listar os alertas que exigem ação imediata e mostrar o feed das últimas ocorrências registradas no sistema.

### 2. Estrutura da Página

A página de Dashboard deve ser renderizada dentro da área `.view` (definida no PRD-00) e deve conter as seguintes seções, de cima para baixo:

#### 2.1. Cabeçalho da Página (`.page-h`)
- **Título:** "Dashboard"
- **Subtítulo:** "Visão geral da rede — KPIs, evolução, alertas e ocorrências."
- **Badge de Atualização:** Indicador de frescor dos dados (ex: "🟢 Atualizado há 2h · fonte: Data Lake (Gold)").

#### 2.2. Resumo Executivo (`.exec`)
Um bloco de texto destacado que resume o cenário atual em linguagem natural, utilizando marcações de cor para enfatizar números positivos ou negativos.
- Fundo: Gradiente linear (`var(--maroon-bg)` para branco).
- Borda esquerda grossa (`var(--rust)`).
- Ícone de gráfico (📊).
- Exemplo de texto: "A rede conta com **312 unidades ativas**; <span class="g">8 novas</span> inauguradas no mês. <span class="r">23 alertas críticos</span> exigem atenção."

#### 2.3. Painel de KPIs (`.kpis`)
Um grid horizontal (5 colunas) exibindo os indicadores-chave de performance.
Cada KPI Card (`.kpi`) deve conter:
- **Título:** Nome do indicador (ex: "Lojas ativas", "Consultores").
- **Ícone:** Emoji com fundo colorido correspondente à categoria.
- **Valor Principal:** Número grande e em negrito.
- **Meta/Subtítulo:** Texto explicativo menor abaixo do número.
- **Barra de Progresso (Opcional):** Indicador visual de atingimento de meta.
- **Estado de Alerta:** Se o KPI estiver crítico, o card deve ter fundo e borda avermelhados (`.alert`).

#### 2.4. Seção Dupla (Alertas e Ocorrências)
Um grid de 2 colunas (`.grid` com `grid-template-columns: 1fr 1fr`) dividindo o espaço inferior.

**Coluna Esquerda: Alertas que exigem ação**
- Container tipo `.card`.
- Título: "Alertas que exigem ação".
- Lista de itens (`.alerts .a`), cada um contendo:
  - Ícone colorido.
  - Descrição do alerta.
  - Quantidade (número em destaque).
  - Botão "Resolver" (leva para a página correspondente).

**Coluna Direita: Últimas Ocorrências (Logbook)**
- Container tipo `.card`.
- Cabeçalho com Título "Últimas Ocorrências" e botão "Ver todas →" (leva para `/ocorrencias`).
- Lista de itens (`.occ`), cada um contendo:
  - Ícone (emoji).
  - Título da ocorrência.
  - Subtítulo: Unidade e Pessoa envolvida.
  - Meta-informações: Status (Pill) e Tempo decorrido.
  - Borda esquerda colorida indicando o tipo da ocorrência.

### 3. Estrutura de Dados e Mock (JSON)

Os dados para renderizar o Dashboard devem seguir esta estrutura. O arquivo `data-dashboard.json` pode ser utilizado para popular o protótipo.

```json
{
  "resumoExecutivo": {
    "mesAno": "Junho/2026",
    "unidadesAtivas": 312,
    "novasUnidades": 8,
    "alertasCriticos": 23,
    "slaPrevias": 2.1,
    "metaPrevias": 3
  },
  "kpis": [
    {
      "id": "k1",
      "label": "Lojas ativas",
      "icon": "🏪",
      "colorTheme": "maroon",
      "value": "312",
      "goalText": "meta 320",
      "progressPct": 98,
      "route": "unidades",
      "isAlert": false
    },
    {
      "id": "k2",
      "label": "Consultores",
      "icon": "👥",
      "colorTheme": "green",
      "value": "8.420",
      "goalText": "▲ +142 mês",
      "progressPct": 82,
      "route": "consultores",
      "isAlert": false
    },
    {
      "id": "k3",
      "label": "Em prévia",
      "icon": "📋",
      "colorTheme": "amber",
      "value": "1.847",
      "goalText": "SLA 2,1d · meta 3d",
      "progressPct": 70,
      "route": "previas",
      "isAlert": false
    },
    {
      "id": "k4",
      "label": "CNPJs",
      "icon": "🏢",
      "colorTheme": "violet",
      "value": "7.103",
      "goalText": "▲ +34 mês",
      "progressPct": 60,
      "route": "consultores",
      "isAlert": false
    },
    {
      "id": "k5",
      "label": "Alertas críticos",
      "icon": "⚠️",
      "colorTheme": "red",
      "value": "23",
      "goalText": "requer ação",
      "progressPct": 40,
      "route": "alertas",
      "isAlert": true
    }
  ],
  "alertas": [
    {
      "id": "a1",
      "icon": "⏱",
      "colorTheme": "red",
      "label": "Consultores em 4 meses sem venda",
      "count": 12,
      "route": "consultores?filter=inativos"
    },
    {
      "id": "a2",
      "icon": "🔄",
      "colorTheme": "amber",
      "label": "Mudança societária não comunicada",
      "count": 3,
      "route": "unidades"
    },
    {
      "id": "a3",
      "icon": "📋",
      "colorTheme": "amber",
      "label": "Prévias com SLA vencido",
      "count": 5,
      "route": "previas"
    },
    {
      "id": "a4",
      "icon": "📍",
      "colorTheme": "gray",
      "label": "Lojas sem visita há +180 dias",
      "count": 18,
      "route": "visitas"
    }
  ],
  "ocorrenciasRecentes": [
    {
      "id": "o1",
      "tipo": "Conflito",
      "colorTheme": "red",
      "icon": "⚠️",
      "titulo": "Disputa de território entre lojas",
      "unidade": "Unidade SP-Centro",
      "pessoa": "Ana Lima",
      "tempo": "há 2h",
      "status": "Aberto"
    },
    {
      "id": "o2",
      "tipo": "Visita",
      "colorTheme": "green",
      "icon": "🤝",
      "titulo": "Visita técnica de acompanhamento",
      "unidade": "Unidade Campinas",
      "pessoa": "Pedro Costa",
      "tempo": "há 5h",
      "status": "Resolvido"
    },
    {
      "id": "o3",
      "tipo": "Penalidade",
      "colorTheme": "violet",
      "icon": "🚩",
      "titulo": "Mudança societária não comunicada",
      "unidade": "Unidade Brasília",
      "pessoa": "Roberto Alves",
      "tempo": "há 3d",
      "status": "Aberto"
    }
  ]
}
```

### 4. Interações Esperadas
- **Cliques nos KPIs:** Devem redirecionar para a lista correspondente (ex: clicar no KPI "Lojas Ativas" leva para `/unidades`).
- **Botões "Resolver" nos Alertas:** Devem redirecionar para a lista correspondente com os filtros já aplicados (ex: `/consultores?filter=inativos`).
- **Botão "Ver todas" em Ocorrências:** Redireciona para `/ocorrencias`.

### 5. Instruções Específicas para o Claude Code
- Utilize as classes CSS definidas no `PRD-00` para construir os componentes.
- A função de renderização do Dashboard deve receber o JSON mockado acima e gerar o HTML dinamicamente.
- O bloco `.exec` deve ter marcação HTML embutida (`<b>`, `<span class="g">`, `<span class="r">`) para dar destaque às métricas no texto.
