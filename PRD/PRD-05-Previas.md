# PRD-05: Prévias e Credenciamento
## Novo CRM Ademicon — Protótipo Órbita

### 1. Objetivo do Módulo
O módulo de Prévias gerencia a esteira de entrada de novos parceiros (consultores ou empresas) na rede Ademicon. Devido ao alto volume de cadastros (milhares de registros), o fluxo utiliza uma interface baseada em **Tabela de Dados de Alta Performance (Data Table)** combinada com um **Painel de Filtros e Ordenação Avançados**, garantindo que os analistas consigam triar, pesquisar e gerenciar com facilidade a entrada de novos credenciados.

---

### 2. Layout Geral da Página (`/previas`)

A página é dividida em quatro áreas principais:
1. **Resumo Executivo (Stat Cards):** Métricas consolidadas da esteira.
2. **Navegação por Etapas (Tabs):** Abas superiores dividindo o status atual das prévias.
3. **Painel de Filtros e Busca:** Controles avançados de pesquisa e ordenação.
4. **Tabela de Dados (Data Table):** Listagem densa e paginada dos registros.

---

### 3. Detalhamento dos Componentes

#### 3.1. Cabeçalho Principal
- **Título:** "Esteira de Prévias"
- **Subtítulo:** "Gestão e credenciamento de novos parceiros da rede."
- **Ações:** Botão Primário "Nova Prévia" (abre modal de criação).

#### 3.2. Resumo de Métricas (Stat Cards)
No topo da página, são exibidos 4 cards no padrão premium (`StatCard` do projeto) com as métricas do período atual:
- **Card 1 (Total na Esteira):** Volume total de prévias em andamento.
- **Card 2 (Alerta de SLA):** Quantidade de prévias com SLA crítico ou estourado.
- **Card 3 (Aprovados):** Total de parceiros credenciados no mês corrente.
- **Card 4 (Reprovados):** Total de prévias negadas/reprovadas no mês corrente.

#### 3.3. Navegação por Status (Tabs)
Uma barra de abas (`Tabs` com `variant="secondary"`) para segmentar rapidamente a tabela por etapa da esteira:
- **Todas** (Soma de todos os registros ativos)
- **Documental** (Triagem inicial de documentação)
- **Retificação** (Aguardando correções/ajustes por parte do candidato)
- **Jurídico** (Análise detalhada de contratos e restrições)
- **Aprovadas** (Credenciamentos concluídos com sucesso)
- **Reprovadas** (Prévia negada ou barrada em triagem/blacklist)

#### 3.4. Container de Filtros e Ordenação (`.filter-container`)
Um painel expansível/retrátil robusto localizado logo acima da tabela contendo:
- **Filtros Rápidos:**
  - Busca textual (Nome do Candidato, Razão Social, CNPJ/CPF ou Matrícula).
  - Seleção por Unidade de Destino.
  - Seleção por Regional de Atuação.
- **Filtros Avançados (Colapsáveis):**
  - Tipo de Pessoa (PF / PJ).
  - Analista Responsável.
  - Período de Registro (De/Até).
  - Status do SLA (No Prazo / Alerta / Estourado).
- **Ordenação Dinâmica:**
  - Dropdown para definir a prioridade de ordenação:
    1. *SLA mais crítico* (Padrão)
    2. *Data de cadastro (Mais recentes)*
    3. *Data de cadastro (Mais antigos)*
    4. *Nome do Candidato (A-Z)*

---

### 4. Tabela de Dados (Data Table)

A listagem deve suportar paginação robusta e ações em lote.

#### 4.1. Colunas da Tabela
1. **Checkbox (Seleção):** Para ações em lote.
2. **Candidato:** Exibe o Nome/Razão Social (em destaque) + CPF/CNPJ (texto discreto).
3. **Tipo:** Badge indicando `PF` (azul) ou `PJ` (violeta).
4. **Destino:** Unidade associada + sigla da Regional.
5. **Analista:** Nome do analista responsável pela triagem.
6. **Data de Cadastro:** Data em que a prévia deu entrada na esteira.
7. **SLA:** Pill colorido indicando o prazo restante:
   - `.p-green` (No Prazo - ex: "4 dias")
   - `.p-amber` (Alerta - ex: "1 dia")
   - `.p-red` (Atrasado - ex: "Atrasado 2d")
8. **Ações:** Botão para visualizar detalhes (abre o Slider Lateral).

#### 4.2. Paginação
- Controles no rodapé da tabela: "Mostrando X-Y de Z registros".
- Seleção de tamanho de página (10, 20, 50 registros por página).
- Botões de navegação para página Anterior/Próxima e numeração de páginas.

#### 4.3. Ações em Lote (Bulk Actions Bar)
Ao selecionar uma ou mais linhas via Checkbox, surge uma barra flutuante no rodapé com ações rápidas:
- "Atribuir Analista em Lote" (abre seletor rápido).
- "Exportar Selecionados" (opções Excel / PDF).

---

### 5. Painel de Detalhes da Prévia (Slider Lateral)

Ao clicar em um registro na tabela, abre-se o slider lateral da direita (`.pvside`) contendo:

#### 5.1. Ações Rápidas do Cabeçalho
- Status atual do processo.
- Botão "Aprovar Credenciamento" (converte a prévia em consultor ativo se os critérios forem atendidos).
- Link "🚫 Negar Credenciamento" (exige preenchimento de justificativa).

#### 5.2. Dados do Candidato
- Nome completo / Razão Social.
- CPF / CNPJ e dados de contato (E-mail e Telefone).
- Data de Registro.
- **Indicador/Formador:** Exibe a Razão Social e Matrícula do Consultor que indicou o novo parceiro (informação fundamental para a estruturação societária da rede).

#### 5.3. Dados Operacionais
- Matrícula AVA (se gerada).
- Unidade de atuação designada.
- Empresa Lojista vinculada.

#### 5.4. Blacklist Integrada (Regra Crítica)
- Bloco de alerta de segurança que executa uma verificação contra a base de CPFs/CNPJs bloqueados.
- Se houver correspondência:
  - Exibe um banner vermelho proeminente: "⚠️ Candidato em Blacklist".
  - O botão de aprovação é **bloqueado de forma impeditiva**.
  - O analista é obrigado a registrar a justificativa de recusa para arquivar a prévia.

---

### 6. Formulário de Nova Prévia (Modal)

Ao clicar em "Nova Prévia", abre-se um modal com formulário estruturado em etapas ou colunas:

**Campos Obrigatórios:**
1. **Tipo de Credenciado:** Select (`PF` ou `PJ`).
2. **Nome/Razão Social:** Input de texto.
3. **CPF/CNPJ:** Campo formatado de acordo com o tipo selecionado.
4. **Contato:** E-mail e Telefone comercial.
5. **Unidade de Destino:** Select buscando unidades ativas da rede.
6. **Indicador/Formador (Crítico):** Input com **Autocomplete** integrado buscando na base de consultores ativos do sistema. Apenas parceiros credenciados ativos podem indicar novos parceiros.
7. **Documentos Obrigatórios:** Campo de upload de arquivos (RG, Contrato Social, etc.).

---

### 7. Estrutura de Dados e Mock (JSON)

```json
{
  "previas": [
    {
      "id": "p1",
      "nome": "Fernanda Costa Consultoria LTDA",
      "tipo": "PJ",
      "documento": "45.100.200/0001-99",
      "analista": "Katia Alves",
      "unidade": "SP-Centro",
      "regional": "SP-Interior",
      "dataCadastro": "2026-07-20",
      "status": "Documental",
      "slaDias": 3,
      "slaStatus": "g",
      "indicador": { "id": "C001", "razaoSocial": "Silva & Associados Negocios", "matricula": "10002" },
      "matAva": "",
      "lojista": "ALPHA CONSULTORIA LTDA",
      "blacklist": false
    },
    {
      "id": "p2",
      "nome": "Alpha Creditos Financeiros",
      "tipo": "PJ",
      "documento": "12.300.400/0001-08",
      "analista": "Gabriel Mendonca",
      "unidade": "Campinas",
      "regional": "SP-Interior",
      "dataCadastro": "2026-07-23",
      "status": "Retificação",
      "slaDias": 1,
      "slaStatus": "a",
      "indicador": { "id": "C002", "razaoSocial": "Almeida Promotora de Vendas", "matricula": "10005" },
      "matAva": "",
      "lojista": "BETA FINANCIAMENTOS LTDA",
      "blacklist": false
    },
    {
      "id": "p3",
      "nome": "Gamma Investimentos PJ",
      "tipo": "PJ",
      "documento": "99.888.777/0001-44",
      "analista": "Luiza Fonseca",
      "unidade": "Salvador",
      "regional": "NE-1",
      "dataCadastro": "2026-07-15",
      "status": "Jurídico",
      "slaDias": -2,
      "slaStatus": "r",
      "indicador": { "id": "C003", "razaoSocial": "Oliveira & Martins Corp", "matricula": "10012" },
      "matAva": "",
      "lojista": "GAMMA HOLDING",
      "blacklist": true
    }
  ],
  "filtrosDisponiveis": {
    "regionais": ["SP-Interior", "SP-Capital", "NE-1", "SUL-2"],
    "unidades": ["SP-Centro", "Campinas", "Salvador", "Curitiba"],
    "analistas": ["Katia Alves", "Gabriel Mendonca", "Luiza Fonseca", "Carlos Lima"]
  }
}
```

---

### 8. Diretrizes de Implementação UI/UX

1. **Responsividade e Performance:** A tabela deve utilizar renderização otimizada para evitar lentidão com milhares de linhas. Utilizar paginação no lado do cliente com dados simulados no mock.
2. **Estética Premium:**
   - A barra de filtros deve usar animações de transição suaves ao expandir/colapsar.
   - Usar ícones apropriados do `lucide-react` para cada coluna e botão de filtro.
   - Alertas de Blacklist devem usar o padrão de alerta premium do design system (fundo vermelho sutil com borda, ícone e tipografia branca/vermelha escura).
3. **Tratamento de Prefers-Reduced-Motion:** Transições da barra de filtros e do slider lateral devem respeitar as preferências de acessibilidade do usuário.
