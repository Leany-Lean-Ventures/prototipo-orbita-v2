# PRD-02: Unidades (Lojas)
## Novo CRM Ademicon — Protótipo Órbita

### 1. Objetivo do Módulo
O módulo de Unidades gerencia as Lojas da rede (PVs de nível máximo, 3.5 - Licenciado Lojista). Ele permite a visualização em lista de todas as unidades e o detalhamento profundo de uma unidade específica, consolidando informações financeiras, estruturais, avaliações e histórico de relacionamento em um único local.

### 2. Visão de Lista (`/unidades`)

#### 2.1. Cabeçalho e Filtros
- **Título:** "Unidades da Rede"
- **Subtítulo:** "Gestão de lojas (Licenciado Lojista 3.5)"
- **Barra de Filtros:** 
  - Busca por nome/código.
  - Filtro por Regional/Estado.
  - Filtro por Status (Ativo, Inativo, Suspenso).
  - Filtro por Rating (A, B, C).

#### 2.2. Tabela de Listagem
Uma tabela (`table.t`) contendo:
- Código da Unidade (ex: L001)
- Nome da Unidade
- Localização (Cidade/UF)
- Dono (LL) - Nome do Licenciado Lojista
- Rating (Pill colorido)
- Status (Pill colorido)
- **Ação:** Clicar na linha redireciona para a página de detalhes da unidade.

### 3. Página de Detalhes da Unidade (`/unidades/:id`)

#### 3.1. Cabeçalho da Unidade (`.uhead`)
- **Título Principal:** Nome da Unidade + Status (Pill).
- **Bloco de Fatos (`.facts`):**
  - Localização (📍)
  - Dono (LL) (👤)
  - Gerente da BU
  - Data de Abertura (📅)
  - Código da Unidade
- **Ações Rápidas (`.actions`):**
  - Botão Primário: "Registrar Ocorrência"
  - Botão Secundário: "Registrar Visita"
- **Indicador de Rating (`.donut-wrap`):** Gráfico de donut mostrando o score (ex: 94) e a letra do Rating (ex: A) no centro.

#### 3.2. Navegação em Abas (`.tabs`)
A página deve possuir 8 abas de navegação interna:

1. **Estrutura Organizacional:** Hierarquia de pessoas e PVs associados à unidade.
2. **Dados Financeiros:** Faturamento consolidado, ticket médio e gráficos.
3. **Consultores Vinculados:** Lista de consultores que atuam na unidade.
4. **Carteiras Associadas:** Lista de carteiras sob gestão da unidade.
5. **Comissionamento (M3):** Regras de comissionamento e penalidades ativas.
6. **Avaliação 360º:** Resultados das avaliações trimestrais/semestrais.
7. **Estrutura Societária:** Informações sobre os CNPJs e sócios (visão legal).
8. **Histórico (Linha do Tempo):** Logbook e eventos temporais.

#### 3.3. Detalhamento das Abas Críticas

**Aba: Estrutura Organizacional**
- Visualização em árvore ou tabela indentada.
- Mostra a relação entre a Loja (3.5) e os PVs subordinados (3.0, 2.7, etc.).

**Aba: Carteiras Associadas**
- Tabela listando as carteiras.
- **Filtro importante:** Toggle "Exibir apenas carteiras órfãs".
- Colunas: ID, Cliente, Status, Consultor Responsável, Flag Órfã (Pill de alerta se não tiver dono).

**Aba: Comissionamento (M3)**
- Bloco mostrando a comissão base (ex: 2.0%).
- Tabela de Cascata: Mostra como a comissão se distribui pelos níveis hierárquicos abaixo da unidade.
- Bloco de Penalidades Ativas: Lista de descontos aplicados (motivo, % de desconto, vigência).

**Aba: Estrutura Societária**
- Tabela listando os CNPJs vinculados à unidade.
- Colunas: Razão Social, CNPJ, Papel (Licenciado Lojista, Sócio), % Participação, Status.

**Aba: Histórico (Linha do Tempo)**
- A consolidação do Logbook (ocorrências) e Eventos de Negócio (promoções, mudanças).
- **Filtros:** Por tipo (Ocorrência, Promoção, Penalidade), por status.
- **Estrutura Visual:** Uma linha vertical no lado esquerdo, com os itens ("cards") empilhados à direita.
- Cada item deve ter: Data, Ícone colorido, Título em negrito e Descrição.
- Ocorrências devem exibir seu status (Aberto/Resolvido).

### 4. Estrutura de Dados e Mock (JSON)

Os dados para renderizar este módulo devem seguir esta estrutura. O arquivo `data-unidades.json` pode ser utilizado.

```json
{
  "lista": [
    {
      "id": "L001",
      "nome": "SP-Centro",
      "cidade": "São Paulo/SP",
      "dono": "João Silva",
      "rating": "A",
      "ratingScore": 94,
      "status": "Ativo"
    },
    {
      "id": "L002",
      "nome": "Campinas",
      "cidade": "Campinas/SP",
      "dono": "Marina Reis",
      "rating": "A",
      "ratingScore": 87,
      "status": "Ativo"
    }
  ],
  "detalheMock": {
    "id": "L001",
    "nome": "SP-Centro",
    "status": "Ativo",
    "cidade": "São Paulo/SP",
    "dono": "João Silva",
    "gerente": "Roberto Almeida",
    "abertura": "Mar 2018",
    "rating": "A",
    "ratingScore": 94,
    "ratingColor": "green",
    
    "carteiras": [
      { "id": "CRT-01", "cliente": "Empresa X", "status": "Ativa", "consultor": "Maria Santos", "orfa": false },
      { "id": "CRT-02", "cliente": "Cliente Y", "status": "Inativa", "consultor": null, "orfa": true }
    ],
    
    "comissionamento": {
      "basePct": 2.0,
      "cascata": [
        { "nivel": "Licenciado 3.5", "pct": 2.0, "qtd": 1 },
        { "nivel": "Autorizado 2.5", "pct": 0.8, "qtd": 5 }
      ],
      "penalidades": [
        { "motivo": "Comunicação visual desatualizada", "descontoPct": 1.5, "vigenciaFim": "Dez 2024" }
      ]
    },
    
    "societaria": [
      { "razao": "Alpha Consultoria Ltda", "cnpj": "12.345.678/0001-90", "papel": "Licenciado Lojista", "pct": 60, "status": "Ativo" },
      { "razao": "Beta Soluções ME", "cnpj": "98.765.432/0001-10", "papel": "Sócio", "pct": 40, "status": "Ativo" }
    ],
    
    "historico": [
      { "data": "Jun 2024", "tipo": "avaliacao", "icon": "📋", "color": "gray", "titulo": "Checklist gerencial semestral", "desc": "Rating A mantido (94 pts)." },
      { "data": "Jul 2023", "tipo": "promocao", "icon": "🏆", "color": "green", "titulo": "João Silva → Licenciado 3.5", "desc": "Nível máximo atingido." },
      { "data": "Mai 2023", "tipo": "ocorrencia", "icon": "⚠️", "color": "red", "titulo": "Disputa de território", "desc": "Conflito com unidade vizinha. Resolvido por acordo.", "status": "Resolvido" }
    ]
  }
}
```

### 5. Instruções Específicas para o Claude Code
- Implemente a lógica de roteamento para capturar o ID da unidade na URL (ex: `#/unidades/L001`) e carregar os detalhes corretos.
- O componente de Abas (`.tabs`) deve controlar a visibilidade das seções (divs de conteúdo) via JavaScript, adicionando a classe `.on` à aba ativa e ocultando/exibindo o conteúdo correspondente.
- Na aba de Carteiras, o toggle "Exibir apenas órfãs" deve filtrar o array local via JavaScript.
- Na aba de Histórico, a renderização deve iterar sobre o array combinando eventos e ocorrências, ordenados por data decrescente.
