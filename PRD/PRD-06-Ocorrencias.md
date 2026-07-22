# PRD-06: Ocorrências (Logbook)
## Novo CRM Ademicon — Protótipo Órbita

### 1. Objetivo do Módulo
O módulo de Ocorrências gerencia o "Logbook" da rede. Ele resolve o problema de perda de memória institucional, registrando fatos de relacionamento (conflitos, penalidades, notificações, denúncias) que hoje se perdem no WhatsApp ou e-mails. Este módulo consolida todas as ocorrências da rede, permitindo o acompanhamento do status (Aberto/Resolvido) e a adição de contexto sensível (Anotações Privadas).

### 2. Visão de Lista (`/ocorrencias`)

#### 2.1. Cabeçalho e Filtros
- **Título:** "Ocorrências & Relacionamento"
- **Subtítulo:** "Logbook da rede — conflitos, penalidades e registros."
- **Ações:** Botão Primário "Nova Ocorrência".
- **Barra de Filtros:** 
  - Busca por título, unidade ou pessoa.
  - Filtro por Tipo (Conflito, Visita, Notificação, Penalidade, Contrato, Denúncia).
  - Filtro por Status (Aberto, Em andamento, Resolvido).
  - Filtro por Data (Período).

#### 2.2. Tabela de Listagem
Uma tabela (`table.t`) contendo:
- Tipo (Pill colorido com ícone)
- Título da Ocorrência
- Entidade Envolvida (Unidade e/ou Pessoa)
- Data de Abertura (Tempo decorrido, ex: "há 2h", "ontem")
- Responsável (Quem abriu)
- Status (Pill: Aberto, Em andamento, Resolvido)
- **Ação:** Clicar na linha abre o modal de detalhes/resolução.

### 3. Formulário de Nova Ocorrência (Modal)

Ao clicar em "Nova Ocorrência", abre-se um modal para registro manual.

**Campos Obrigatórios:**
- Tipo de Ocorrência (Select).
- Título (Texto curto).
- Entidade Principal (Select com autocomplete para buscar Unidade, PV ou Consultor).
- Entidade Secundária (Opcional - ex: outra unidade envolvida num conflito).
- Canal de Origem (WhatsApp, E-mail, Ligação, Sistema, Denúncia).
- Descrição (Textarea).

**Campos de Visibilidade (Sensível):**
- Anotação Privada (Textarea opcional): Campo destinado ao gestor para registrar percepções sensíveis que não devem ser compartilhadas com a rede, apenas com a Diretoria.
- *Regra de Negócio:* As anotações privadas ficam registradas permanentemente, mesmo que o gestor saia da empresa.

### 4. Modal de Detalhes e Resolução

Ao clicar em uma ocorrência existente, abre-se um modal detalhado que permite gerenciar o ciclo de vida do registro.

#### 4.1. Cabeçalho do Detalhe
- Tipo, Título e Status atual.
- Data de criação e criador.

#### 4.2. Corpo do Detalhe
- Descrição completa.
- Entidades vinculadas (com links para os perfis).
- Bloco de Anotação Privada (com fundo diferenciado, ex: amarelo claro, e ícone de cadeado 🔒 indicando restrição de acesso).

#### 4.3. Área de Interação e Resolução
Se o status for "Aberto" ou "Em andamento", exibe um formulário de resolução:
- **Novo Comentário/Ação:** Textarea para registrar a evolução do caso.
- **Desfecho (Select):** Acordo, Penalidade, Transferência, Descredenciamento, Outros.
- **Ações:** 
  - Botão "Adicionar Comentário" (mantém aberto).
  - Botão "Marcar como Resolvido" (encerra a ocorrência).

Se o status for "Resolvido", a área de interação é ocultada e exibe-se a "Data de Resolução" e o "Desfecho" final.

### 5. Estrutura de Dados e Mock (JSON)

```json
{
  "lista": [
    {
      "id": "OCC-001",
      "tipo": "Conflito",
      "icon": "⚠️",
      "colorTheme": "red",
      "titulo": "Disputa de território entre lojas",
      "entidade": "L001 (SP-Centro) / Ana Lima",
      "data": "2026-06-20T10:00:00Z",
      "tempo": "há 2h",
      "responsavel": "Roberto Almeida",
      "status": "Aberto"
    },
    {
      "id": "OCC-002",
      "tipo": "Penalidade",
      "icon": "🚩",
      "colorTheme": "violet",
      "titulo": "Comunicação visual desatualizada",
      "entidade": "L002 (Campinas)",
      "data": "2026-06-15T14:30:00Z",
      "tempo": "há 5d",
      "responsavel": "Gerente BU",
      "status": "Em andamento"
    },
    {
      "id": "OCC-003",
      "tipo": "Visita",
      "icon": "🤝",
      "colorTheme": "green",
      "titulo": "Visita semestral de acompanhamento",
      "entidade": "PV-1042 (Equipe Alpha)",
      "data": "2026-06-01T09:00:00Z",
      "tempo": "há 20d",
      "responsavel": "Roberto Almeida",
      "status": "Resolvido"
    }
  ],
  "detalheMock": {
    "id": "OCC-001",
    "tipo": "Conflito",
    "titulo": "Disputa de território entre lojas",
    "status": "Aberto",
    "dataCriacao": "2026-06-20 10:00",
    "criador": "Roberto Almeida",
    "descricao": "Consultor da unidade Campinas prospectou cliente na mesma rua da unidade SP-Centro. Gerou reclamação formal via WhatsApp.",
    "canal": "WhatsApp",
    "entidades": [
      { "tipo": "Unidade", "nome": "SP-Centro", "id": "L001" },
      { "tipo": "Consultor", "nome": "Ana Lima", "id": "C004" }
    ],
    "anotacaoPrivada": "Gestor da SP-Centro está insatisfeito há meses com a falta de limite territorial. Necessário intervir rápido para evitar perda do parceiro.",
    "historicoInteracoes": [
      { "data": "2026-06-20 10:30", "autor": "Roberto Almeida", "texto": "Liguei para as duas partes, agendada reunião de conciliação para amanhã." }
    ]
  },
  "formSchema": {
    "fields": [
      { "name": "tipo", "type": "select", "options": ["Conflito", "Visita", "Notificação", "Penalidade", "Contrato", "Denúncia"], "required": true },
      { "name": "titulo", "type": "text", "required": true },
      { "name": "entidadePrincipal", "type": "autocomplete", "label": "Unidade/Pessoa envolvida", "required": true },
      { "name": "canal", "type": "select", "options": ["WhatsApp", "E-mail", "Ligação", "Sistema", "Denúncia"], "required": true },
      { "name": "descricao", "type": "textarea", "required": true },
      { "name": "anotacaoPrivada", "type": "textarea", "label": "Anotação Privada (Apenas Diretoria)", "required": false }
    ]
  }
}
```

### 6. Instruções Específicas para o Claude Code
- Implemente a lógica de mudança de status: ao clicar em "Marcar como Resolvido" no modal, o objeto JSON deve ter seu status alterado para "Resolvido" e a UI deve ser atualizada para refletir isso (mudando a cor do Pill e ocultando a área de nova interação).
- O bloco de "Anotação Privada" deve ter um design claramente distinto do resto do conteúdo (ex: fundo amarelado, borda tracejada, ícone de cadeado) para deixar óbvio ao usuário que aquele texto é restrito.
- Este módulo não precisa de uma página dedicada de detalhes (`/ocorrencias/:id`), todas as interações de leitura e edição devem ocorrer via Modais/Overlays sobre a lista.
