# PRD-05: Prévias e Credenciamento
## Novo CRM Ademicon — Protótipo Órbita

### 1. Objetivo do Módulo
O módulo de Prévias gerencia a "esteira" de entrada de novos parceiros (consultores ou empresas) na rede Ademicon. Ele transforma um processo que hoje é feito por e-mail em um fluxo estruturado (Kanban), com controle de prazos (SLA), atribuição de analistas, integração com a Blacklist e captura de dados fundamentais (como o Indicador/Formador) logo na entrada.

### 2. Visão Geral (Kanban) (`/previas`)

#### 2.1. Cabeçalho e Filtros
- **Título:** "Esteira de Prévias"
- **Subtítulo:** "Gestão do fluxo de credenciamento de novos parceiros."
- **Ações:** Botão Primário "Nova Prévia".
- **Barra de Filtros:** 
  - Regional / Estado / Cidade / Unidade.
  - Filtro por Analista.
  - Filtro por Tipo (PF / PJ).
- **Indicador de Volume:** Texto dinâmico mostrando o total de prévias no filtro atual (ex: "<b>12</b> prévia(s) no filtro").

#### 2.2. Quadro Kanban (`.kanwrap`)
O fluxo é dividido em 5 colunas fixas:

1. **Documental** (Azul): Triagem inicial.
2. **Retificação** (Âmbar): Aguardando correção do candidato.
3. **Jurídico** (Violeta): Análise de contratos e restrições.
4. **Aprovado** (Verde): Processo finalizado com sucesso.
5. **Reprovado** (Vermelho): Prévia negada (inclui retenção por Blacklist).

#### 2.3. Cartão da Prévia (`.kcard2`)
Cada cartão no Kanban representa um candidato e deve exibir:
- **Tags Superiores:** Tipo (PF/PJ em azul/violeta) e SLA (Pill verde/âmbar/vermelho indicando dias restantes ou atraso).
- **Nome do Candidato:** Em negrito.
- **Unidade de Destino:** Onde ele vai atuar.
- **Analista Responsável:** Nome ou iniciais de quem está tocando o processo.
- **Ação:** Clicar no cartão abre o painel lateral de detalhes (Slider).

### 3. Painel de Detalhes da Prévia (Slider Lateral)

Ao clicar em um cartão, um painel lateral desliza da direita (`.pvside`), contendo:

#### 3.1. Cabeçalho do Painel
- Status atual da prévia.
- Botão "Aprovar" e link "🚫 Negar pedido de prévia".

#### 3.2. Dados do Candidato
- Nome completo.
- CPF/CNPJ.
- Data do registro.
- **Indicador/Formador:** Nome da pessoa que o indicou (dado crucial para a árvore hierárquica futura).

#### 3.3. Dados Operacionais
- Matrícula AVA (se já gerada).
- BU e Unidade de atuação.
- Empresa Lojista vinculada.
- IDs gerados no sistema (se aplicável).

#### 3.4. Blacklist Integrada
- Um bloco de alerta dentro do painel verificando se o CPF/CNPJ consta na Blacklist da Ademicon.
- Se constar, o botão de aprovação é bloqueado e o analista deve justificar a recusa.

### 4. Formulário de Nova Prévia (Modal)

Ao clicar em "Nova Prévia", abre-se um modal com o formulário de entrada.

**Campos Obrigatórios:**
- Tipo de Pessoa (PF ou PJ).
- Nome Completo / Razão Social.
- CPF / CNPJ.
- Email e Telefone.
- Unidade de Destino (seleção).
- **Indicador/Formador:** Campo de busca (autocomplete) buscando na base de Consultores ativos. *Regra de negócio: Apenas uma pessoa já cadastrada pode indicar outra.*
- Anexos (upload de documentos básicos).

### 5. Estrutura de Dados e Mock (JSON)

```json
{
  "kanban": {
    "Documental": {
      "color": "blue",
      "cards": [
        { "id": "p1", "nome": "Fernanda Costa", "tipo": "PF", "analista": "K.A.", "loja": "SP-Centro", "sla": 3, "slaStatus": "g" },
        { "id": "p2", "nome": "Alpha Consultoria", "tipo": "PJ", "analista": "G.M.", "loja": "Campinas", "sla": 1, "slaStatus": "a" }
      ]
    },
    "Retificação": {
      "color": "amber",
      "cards": [
        { "id": "p4", "nome": "Gamma Invest.", "tipo": "PJ", "analista": "L.F.", "loja": "Salvador", "sla": -1, "slaStatus": "r" }
      ]
    },
    "Jurídico": {
      "color": "violet",
      "cards": []
    },
    "Aprovado": {
      "color": "green",
      "cards": [
        { "id": "p8", "nome": "Camila Santos", "tipo": "PF", "analista": "L.F.", "loja": "Belém", "sla": 5, "slaStatus": "g" }
      ]
    },
    "Reprovado": {
      "color": "red",
      "cards": [
        { "id": "p10", "nome": "Zeta Negócios", "tipo": "PJ", "analista": "C.L.", "loja": "Natal", "sla": 0, "slaStatus": "r" }
      ]
    }
  },
  "detalheMock": {
    "id": "p1",
    "nome": "Fernanda Costa",
    "cpf": "435.999.788-40",
    "dataRegistro": "08/06/2026",
    "indicador": { "id": "C001", "nome": "João Silva" },
    "matAva": "7730049614",
    "bu": "BU3",
    "loja": "SP-Centro",
    "lojista": "ALPHA CONSULTORIA LTDA",
    "blacklist": false
  },
  "formSchema": {
    "fields": [
      { "name": "tipo", "type": "select", "options": ["PF", "PJ"], "required": true },
      { "name": "nome", "type": "text", "label": "Nome Completo", "required": true },
      { "name": "documento", "type": "text", "label": "CPF/CNPJ", "required": true },
      { "name": "unidade", "type": "select", "label": "Unidade de Destino", "required": true },
      { "name": "indicador", "type": "autocomplete", "label": "Indicador/Formador (Buscar consultor)", "required": true }
    ]
  }
}
```

### 6. Instruções Específicas para o Claude Code
- Implemente o Kanban usando CSS Grid ou Flexbox para as colunas.
- O campo "SLA" no cartão deve usar a classe `.p-green` se `slaStatus === 'g'`, `.p-amber` se `'a'` e `.p-red` se `'r'`.
- O formulário de "Nova Prévia" deve simular o autocomplete do campo "Indicador/Formador", permitindo selecionar um nome (ex: "João Silva"). Este é um requisito crítico levantado no Onboarding.
- O slider lateral (`.pvside`) deve ser implementado com uma transição CSS suave (`transform: translateX(0)` para mostrar, `translateX(100%)` para esconder).
