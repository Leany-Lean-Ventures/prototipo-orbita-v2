# PRD-04: Pontos de Venda (PVs)
## Novo CRM Ademicon — Protótipo Órbita

### 1. Objetivo do Módulo
O módulo de PVs gerencia as estruturas comerciais vinculadas a uma Unidade (Loja). PVs são as ramificações de níveis 3.0, 2.7, 2.5, 2.2 e 2.0. Estruturalmente e visualmente, a página de um PV é quase idêntica à página de uma Unidade, diferindo apenas pelo nível hierárquico, pela obrigatoriedade de estar subordinado a uma Unidade "mãe" e por não possuir a aba de Avaliação 360º.

### 2. Visão de Lista (`/pvs`)

#### 2.1. Cabeçalho e Filtros
- **Título:** "Pontos de Venda (PVs)"
- **Subtítulo:** "Gestão das estruturas comerciais subordinadas."
- **Barra de Filtros:** 
  - Busca por nome/código do PV.
  - Filtro por Unidade Mãe.
  - Filtro por Nível (3.0 a 2.0).
  - Filtro por Status (Ativo, Inativo, Suspenso).

#### 2.2. Tabela de Listagem
Uma tabela (`table.t`) contendo:
- Código do PV (ex: PV-1042)
- Nome do PV
- Unidade Mãe
- Gestor do PV (Pessoa responsável)
- Nível (Pill colorido, ex: `.p-blue` para 2.5)
- Status (Pill colorido)
- **Ação:** Clicar na linha redireciona para a página de detalhes do PV.

### 3. Página de Detalhes do PV (`/pvs/:id`)

#### 3.1. Cabeçalho do PV (`.uhead` adaptado)
- **Título Principal:** Nome do PV + Status (Pill).
- **Bloco de Fatos (`.facts`):**
  - Unidade Mãe (🏪) - Link para a unidade.
  - Gestor do PV (👤)
  - Data de Abertura (📅)
  - Código do PV
- **Ações Rápidas (`.actions`):**
  - Botão Primário: "Registrar Ocorrência"
  - Botão Secundário: "Ver no Grafo"

#### 3.2. Navegação em Abas (`.tabs`)
A página deve possuir 7 abas de navegação interna (idênticas às da Unidade, exceto Avaliação 360º):

1. **Estrutura Organizacional:** Hierarquia de consultores subordinados a este PV.
2. **Dados Financeiros:** Faturamento consolidado do PV.
3. **Consultores Vinculados:** Lista de consultores que atuam neste PV.
4. **Carteiras Associadas:** Lista de carteiras sob gestão deste PV (com filtro de órfãs).
5. **Comissionamento (M3):** Regras de comissionamento e penalidades ativas.
6. **Estrutura Societária:** Informações sobre os CNPJs e sócios.
7. **Histórico (Linha do Tempo):** Logbook e eventos temporais.

### 4. Estrutura de Dados e Mock (JSON)

```json
{
  "lista": [
    {
      "id": "PV-1042",
      "nome": "Equipe Alpha",
      "unidadeMae": "L001 (SP-Centro)",
      "gestor": "Carlos Oliveira",
      "nivel": "Autorizado 2.5",
      "status": "Ativo",
      "colorTheme": "blue"
    },
    {
      "id": "PV-2050",
      "nome": "Sigma Participações",
      "unidadeMae": "L003 (Curitiba-N)",
      "gestor": "Pedro Costa",
      "nivel": "Autorizado 2.0",
      "status": "Ativo",
      "colorTheme": "green"
    }
  ],
  "detalheMock": {
    "id": "PV-1042",
    "nome": "Equipe Alpha",
    "status": "Ativo",
    "unidadeMae": { "id": "L001", "nome": "SP-Centro" },
    "gestor": "Carlos Oliveira",
    "abertura": "Fev 2020",
    "nivel": "Autorizado 2.5",
    "colorTheme": "blue",
    
    "carteiras": [
      { "id": "CRT-10", "cliente": "Empresa Z", "status": "Ativa", "consultor": "Ana Lima", "orfa": false },
      { "id": "CRT-11", "cliente": "Cliente W", "status": "Inativa", "consultor": null, "orfa": true }
    ],
    
    "comissionamento": {
      "basePct": 0.8,
      "cascata": [
        { "nivel": "Autorizado 2.5", "pct": 0.8, "qtd": 1 },
        { "nivel": "Autorizado 2.2", "pct": 0.5, "qtd": 3 }
      ],
      "penalidades": []
    },
    
    "societaria": [
      { "razao": "Beta Soluções ME", "cnpj": "98.765.432/0001-10", "papel": "Sócio", "pct": 100, "status": "Ativo" }
    ],
    
    "historico": [
      { "data": "Jan 2022", "tipo": "promocao", "icon": "⬆️", "color": "blue", "titulo": "Promoção para 2.5", "desc": "Equipe atingiu meta semestral." },
      { "data": "Fev 2020", "tipo": "transferencia", "icon": "🏪", "color": "gray", "titulo": "Abertura do PV", "desc": "Vinculado à unidade SP-Centro." }
    ]
  }
}
```

### 5. Instruções Específicas para o Claude Code
- Para acelerar o desenvolvimento e manter a consistência, **reutilize os mesmos componentes de interface criados para a página de Unidade (`PRD-02`)**.
- A lógica das abas (`.tabs`), da tabela de carteiras (com o toggle de órfãs) e da linha do tempo (`.timeline`) é exatamente a mesma.
- A única diferença estrutural na UI é a ausência do gráfico de donut (Rating) no cabeçalho e a ausência da aba de Avaliação 360º.
