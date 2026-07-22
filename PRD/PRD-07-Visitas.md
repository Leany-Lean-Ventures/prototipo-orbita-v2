# PRD-07: Visitas (Alcance de Campo)
## Novo CRM Ademicon — Protótipo Órbita

### 1. Objetivo do Módulo
O módulo de Visitas gerencia o alcance de campo da equipe Ademicon. Ele permite planejar, registrar e acompanhar as visitas técnicas, comerciais ou de auditoria realizadas nas Unidades e PVs. As visitas registradas aqui alimentam automaticamente o Logbook (Ocorrências) da unidade visitada, garantindo que o histórico de relacionamento esteja sempre atualizado.

### 2. Visão de Lista e Calendário (`/visitas`)

#### 2.1. Cabeçalho e Filtros
- **Título:** "Visitas & Alcance de Campo"
- **Subtítulo:** "Planejamento e registro de visitas às unidades."
- **Ações:** Botão Primário "Agendar/Registrar Visita".
- **Toggle de Visão:** Alternador entre "Visão em Lista" e "Visão Calendário".
- **Barra de Filtros:** 
  - Busca por Unidade.
  - Filtro por Responsável (Gestor BU).
  - Filtro por Status (Agendada, Realizada, Cancelada).
  - Filtro por Tipo de Visita (Comercial, Auditoria, Estruturação).

#### 2.2. Visão em Lista
Uma tabela (`table.t`) contendo:
- Data e Hora
- Unidade/PV Visitado
- Tipo de Visita
- Responsável
- Status (Pill: Agendada, Realizada, Cancelada)
- **Ação:** Clicar na linha abre o modal de detalhes/relatório da visita.

#### 2.3. Alertas de Cobertura
No topo da página, um card de alerta dinâmico indicando unidades que estão sem receber visitas há muito tempo (ex: "⚠️ 18 unidades sem visita há mais de 180 dias").

### 3. Formulário de Agendamento/Registro (Modal)

Ao clicar em "Agendar/Registrar Visita", abre-se um modal.

**Campos Obrigatórios:**
- Unidade/PV de Destino (Autocomplete).
- Tipo de Visita (Comercial, Auditoria, Avaliação 360, Estruturação).
- Data e Hora.
- Status (Agendada, Realizada).
- Objetivos da Visita (Textarea).

**Se Status = Realizada, expande para:**
- Relatório da Visita (Textarea detalhada).
- Anexos (Fotos, checklists assinados).
- **Anotação Privada (Opcional):** Mesmo conceito do módulo de ocorrências, campo restrito para percepções do gestor.
- *Check:* "Gerar ocorrência no Logbook da unidade?" (Default: Sim).

### 4. Estrutura de Dados e Mock (JSON)

```json
{
  "lista": [
    {
      "id": "VIS-001",
      "data": "2026-06-25T14:00:00Z",
      "unidade": "L001 (SP-Centro)",
      "tipo": "Comercial",
      "responsavel": "Roberto Almeida",
      "status": "Agendada"
    },
    {
      "id": "VIS-002",
      "data": "2026-06-10T09:00:00Z",
      "unidade": "L002 (Campinas)",
      "tipo": "Auditoria",
      "responsavel": "Roberto Almeida",
      "status": "Realizada"
    }
  ],
  "alertasCobertura": {
    "totalSemVisita180d": 18,
    "unidadesCriticas": ["L004 (Recife-Sul)", "L005 (Natal)"]
  },
  "detalheMock": {
    "id": "VIS-002",
    "data": "2026-06-10 09:00",
    "unidade": { "id": "L002", "nome": "Campinas" },
    "tipo": "Auditoria",
    "responsavel": "Roberto Almeida",
    "status": "Realizada",
    "objetivos": "Verificar adequação do novo layout visual e repassar metas do Q3.",
    "relatorio": "Layout visual adequado em 80%. Fachada ainda com logo antigo. Meta do Q3 alinhada com os sócios.",
    "anotacaoPrivada": "Sócios demonstraram desmotivação com as novas regras de comissionamento. Ficar de olho no engajamento deste PV.",
    "ocorrenciaGerada": "OCC-045"
  },
  "formSchema": {
    "fields": [
      { "name": "unidade", "type": "autocomplete", "label": "Unidade de Destino", "required": true },
      { "name": "tipo", "type": "select", "options": ["Comercial", "Auditoria", "Avaliação 360", "Estruturação"], "required": true },
      { "name": "data", "type": "datetime", "required": true },
      { "name": "status", "type": "select", "options": ["Agendada", "Realizada", "Cancelada"], "required": true },
      { "name": "objetivos", "type": "textarea", "required": true },
      { "name": "relatorio", "type": "textarea", "required": false, "dependsOn": { "field": "status", "value": "Realizada" } },
      { "name": "anotacaoPrivada", "type": "textarea", "label": "Anotação Privada (Apenas Diretoria)", "required": false, "dependsOn": { "field": "status", "value": "Realizada" } }
    ]
  }
}
```

### 5. Instruções Específicas para o Claude Code
- Para o protótipo, a "Visão Calendário" pode ser apenas um mockup visual estático ou omitida caso complexifique demais a UI. Focar na "Visão em Lista" que é a mais crítica para gestão.
- Implemente a lógica condicional no formulário: os campos "Relatório" e "Anotação Privada" só devem aparecer se o usuário selecionar o Status "Realizada".
- Como nos outros módulos, interações de detalhe e criação devem ocorrer via Modais, mantendo o usuário na página de listagem.
