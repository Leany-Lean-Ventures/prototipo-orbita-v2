# PRD-09: Configurações
## Novo CRM Ademicon — Protótipo Órbita

### 1. Objetivo do Módulo
O módulo de Configurações permite gerenciar os parâmetros globais do sistema. Para o escopo do protótipo, este módulo focará na parametrização dos Alertas do sistema (definindo gatilhos e severidades) e exibirá uma visão simplificada de Perfis de Acesso (RBAC - Role-Based Access Control), sem necessidade de implementar a lógica complexa de permissões.

### 2. Visão Principal (`/configuracoes`)

#### 2.1. Cabeçalho
- **Título:** "Configurações do Sistema"
- **Subtítulo:** "Gestão de alertas, parâmetros e perfis de acesso."

#### 2.2. Navegação em Abas (`.tabs`)
A página deve possuir 2 abas principais:

1. **Gestão de Alertas:** Parametrização dos gatilhos que disparam alertas no Dashboard.
2. **Perfis de Acesso (RBAC):** Visão estrutural de quem pode fazer o quê (apenas visualização para o protótipo).

### 3. Aba: Gestão de Alertas

Esta aba permite que administradores configurem as regras de negócio que geram as notificações automáticas.

#### 3.1. Tabela de Regras de Alerta
Lista as regras configuradas, contendo:
- Nome da Regra
- Gatilho (Condição)
- Severidade (Alta/Média/Baixa)
- Status (Ativo/Inativo)
- Ação (Editar/Desativar)

#### 3.2. Modal de Edição de Regra
Ao clicar em "Editar", abre-se um formulário:
- **Nome da Regra:** (ex: "Consultores Inativos")
- **Entidade Alvo:** (Consultor, Unidade, PV, Prévia)
- **Condição:** (ex: "Tempo sem venda")
- **Operador:** (ex: "Maior que")
- **Valor:** (ex: "120" dias)
- **Severidade:** (Alta = Vermelho, Média = Âmbar, Baixa = Cinza)

### 4. Aba: Perfis de Acesso (RBAC) - Simplificado

Esta aba documenta e exibe a matriz de responsabilidades. Para o protótipo, é apenas uma tabela informativa.

#### 4.1. Matriz de Permissões
Uma tabela (`table.t`) cruzando Perfis (Colunas) x Funcionalidades (Linhas).

**Perfis:**
- Diretoria
- Gerente BU
- Analista de Backoffice
- Consultor/LL (Acesso restrito à própria unidade)

**Funcionalidades (Linhas):**
- Aprovar Prévia
- Aplicar Penalidade
- Inserir Anotação Privada
- Visualizar Anotação Privada
- Editar Cascata de Comissão

*O cruzamento exibe ícones de check (✅) ou bloqueio (❌).*

### 5. Estrutura de Dados e Mock (JSON)

```json
{
  "alertasConfig": [
    {
      "id": "CFG-A01",
      "nome": "Consultores Inativos",
      "entidade": "Consultor",
      "condicao": "Tempo sem venda > 120 dias",
      "severidade": "Alta",
      "colorTheme": "red",
      "status": "Ativo"
    },
    {
      "id": "CFG-A02",
      "nome": "Prévias Vencidas",
      "entidade": "Prévia",
      "condicao": "SLA < 0 dias",
      "severidade": "Média",
      "colorTheme": "amber",
      "status": "Ativo"
    },
    {
      "id": "CFG-A03",
      "nome": "Unidades sem Visita",
      "entidade": "Unidade",
      "condicao": "Última visita > 180 dias",
      "severidade": "Alta",
      "colorTheme": "red",
      "status": "Ativo"
    }
  ],
  "rbacMock": {
    "funcionalidades": [
      "Aprovar Prévia",
      "Aplicar Penalidade",
      "Inserir Anotação Privada",
      "Visualizar Anotação Privada",
      "Editar Cascata de Comissão"
    ],
    "perfis": {
      "Diretoria": [true, true, false, true, true],
      "Gerente BU": [false, false, true, true, false],
      "Backoffice": [true, false, false, false, true],
      "Lojista (LL)": [false, false, false, false, false]
    }
  }
}
```

### 6. Instruções Específicas para o Claude Code
- A aba de RBAC não precisa de interatividade (edição) para este protótipo, apenas renderize a tabela com os dados mockados para demonstrar que a plataforma prevê essa gestão.
- A aba de Gestão de Alertas pode ter uma interatividade simples de ligar/desligar o status (toggle switch) para demonstrar a funcionalidade.
