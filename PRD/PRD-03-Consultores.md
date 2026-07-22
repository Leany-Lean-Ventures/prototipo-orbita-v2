# PRD-03: Consultores (Pessoas)
## Novo CRM Ademicon — Protótipo Órbita

### 1. Objetivo do Módulo
O módulo de Consultores foca na Pessoa Física (CPF) como entidade central. Ele resolve o problema da visão fragmentada de pessoas na rede, consolidando a trajetória funcional, a visão de grupo econômico, as matrículas e o relacionamento em um único perfil, independente de quantas empresas (CNPJs) a pessoa possua.

### 2. Visão de Lista (`/consultores`)

#### 2.1. Cabeçalho e Filtros
- **Título:** "Pessoas & Consultores"
- **Subtítulo:** "Visão unificada por CPF — Matrículas, nível e empresas."
- **Barra de Filtros:** 
  - Busca por nome, CPF ou matrícula.
  - Filtro por Nível (Licenciado, Autorizado, Em Prévia).
  - Filtro por Loja/Unidade.
  - Filtro por Status (Ativo, Inativo, Descredenciado).

#### 2.2. Tabela de Listagem
Uma tabela (`table.t`) contendo:
- Nome e Matrícula (agrupados)
- Avatar (Iniciais do nome com cor baseada no nível)
- CPF (mascarado)
- Nível (Pill colorido, ex: `.p-violet` para Licenciado)
- Loja Principal
- Empresas (Quantidade de CNPJs associados)
- Status (Pill colorido)
- **Ação:** Clicar na linha redireciona para a página de detalhes do consultor.

### 3. Página de Detalhes do Consultor (`/consultores/:cpf`)

#### 3.1. Cabeçalho do Consultor (`.uhead` adaptado)
- **Título Principal:** Nome do Consultor + Nível (Pill).
- **Avatar:** Circular grande com iniciais.
- **Bloco de Fatos (`.facts`):**
  - CPF
  - Matrícula Principal
  - Loja Principal
  - Indicador/Formador (Link para outro consultor)
  - Data de Ingresso
- **Ações Rápidas (`.actions`):**
  - Botão Primário: "Registrar Ocorrência"
  - Botão Secundário: "Ver no Grafo"

#### 3.2. Navegação em Abas (`.tabs`)
A página deve possuir 8 abas de navegação interna:

1. **Dados Básicos:** Informações cadastrais completas.
2. **Vínculos (Matrículas/PVs):** Lista de todos os PVs associados a este CPF.
3. **Visão Econômica:** Consolidação de faturamento (Grupo Econômico) e Score Interno.
4. **Comissionamento (M3):** Nível atual, histórico de promoção e penalidades ativas.
5. **Carteiras Associadas:** Lista de carteiras geridas pela pessoa.
6. **Avaliação 360º:** Resultados de avaliações de desempenho.
7. **Ocorrências (Logbook):** Lista de ocorrências ligadas diretamente a esta pessoa.
8. **Histórico (Linha do Tempo):** Log completo de eventos da carreira (promoções, transferências).

#### 3.3. Detalhamento das Abas Críticas

**Aba: Dados Básicos**
- Exibe dados como RG, Nascimento, Endereço, Contatos e o **Indicador/Formador**.
- O Indicador é selecionado no formulário de prévia e referenciado aqui.

**Aba: Visão Econômica (Grupo Econômico)**
- Resolve a dor de "ver o tamanho do parceiro".
- **Score Interno:** Um número grande fornecido via API (ex: 850 pts).
- **Consolidação:** Soma do faturamento de todos os CNPJs/PVs associados a este CPF.
- Gráficos simples de evolução.

**Aba: Vínculos**
- Tabela listando as matrículas ativas e inativas deste CPF.
- Colunas: PV/Unidade, Papel (Gestor, Sócio, Consultor), Data Início, Status.

**Aba: Comissionamento (M3)**
- **Regra de Negócio Simplificada:** A comissão é diretamente atrelada ao nível (ex: Autorizado 2.0 = 2.0%).
- Exibe o nível atual e o % correspondente.
- Lista penalidades ativas (descontos temporários).

**Aba: Histórico (Linha do Tempo)**
- A "câmera" da carreira da pessoa.
- Mostra transferências de loja, promoções de nível, ocorrências e descredenciamentos.
- Estrutura visual idêntica à linha do tempo da Unidade.

### 4. Estrutura de Dados e Mock (JSON)

```json
{
  "lista": [
    {
      "id": "C001",
      "nome": "João Silva",
      "cpf": "***.456.789-**",
      "mat": "M-00123",
      "nivel": "Licenciado 3.5",
      "loja": "SP-Centro",
      "empresas": 2,
      "status": "Ativo",
      "colorTheme": "violet"
    }
  ],
  "detalheMock": {
    "id": "C001",
    "nome": "João Silva",
    "cpfCompleto": "123.456.789-00",
    "mat": "M-00123",
    "nivel": "Licenciado 3.5",
    "loja": "SP-Centro",
    "ingresso": "Mar 2018",
    "indicador": { "nome": "Carlos Oliveira", "id": "C003" },
    "status": "Ativo",
    
    "dadosBasicos": {
      "rg": "40.936.565-8",
      "nascimento": "04/07/1985",
      "email": "joao.silva@email.com",
      "telefone": "(11) 99123-4567"
    },
    
    "visaoEconomica": {
      "scoreInterno": 850,
      "faturamentoConsolidado": "R$ 1.250.000",
      "totalCarteiras": 142,
      "cnpjsVinculados": 2
    },
    
    "vinculos": [
      { "pv": "L001 (SP-Centro)", "papel": "Licenciado Lojista", "inicio": "Mar 2018", "status": "Ativo" },
      { "pv": "PV-1042", "papel": "Consultor", "inicio": "Jan 2016", "status": "Encerrado" }
    ],
    
    "comissionamento": {
      "nivelAtual": "Licenciado 3.5",
      "pctAtual": 3.5,
      "penalidades": []
    },
    
    "historico": [
      { "data": "Jul 2023", "tipo": "promocao", "icon": "🏆", "color": "green", "titulo": "Promoção para Licenciado 3.5", "desc": "Atingiu meta de faturamento e expansão." },
      { "data": "Mar 2018", "tipo": "transferencia", "icon": "🔄", "color": "blue", "titulo": "Abertura de Loja", "desc": "Assumiu a unidade SP-Centro como Lojista." }
    ]
  }
}
```

### 5. Instruções Específicas para o Claude Code
- O avatar deve extrair as duas primeiras iniciais do nome (ex: "João Silva" -> "JS") e aplicar a cor de fundo correspondente ao nível (`.p-violet`, `.p-blue`, etc.).
- A aba de "Visão Econômica" deve ter destaque visual para o `scoreInterno`, simulando o retorno de uma API.
- Reutilize a estrutura CSS de `.tabs` e `.timeline` criadas no módulo de Unidades, garantindo consistência visual.
