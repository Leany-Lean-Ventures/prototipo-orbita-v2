# PRD-00: Visão Geral e Estrutura Compartilhada
## Novo CRM Ademicon — Protótipo Órbita

### 1. Objetivo do Documento
Este documento define a estrutura global, navegação, componentes visuais e padrões arquiteturais para a codificação do protótipo navegável do CRM Ademicon (Órbita). O objetivo é fornecer instruções claras para ferramentas de codificação (como Claude Code) implementarem a base do sistema, sobre a qual os módulos específicos serão construídos.

### 2. Visão Geral do Produto
O Órbita é um CRM e plataforma de gestão para a Rede & Expansão da Ademicon. Ele resolve o problema da fragmentação da informação, consolidando dados de Unidades, Pontos de Venda (PVs) e Consultores em um único ambiente. A plataforma permite gerenciar a estrutura comercial, acompanhar o desempenho, registrar o relacionamento (ocorrências) e processar o credenciamento de novos parceiros (prévias).

### 3. Padrões de Design e UI

#### 3.1. Paleta de Cores (CSS Variables)
A aplicação deve utilizar as seguintes variáveis CSS no `:root` para manter a consistência visual:

```css
:root {
  --maroon: #C43C30;
  --maroon-2: #E24A3C;
  --rust: #ED6151;
  --froly: #FBA39D;
  --ink: #211A15;
  --ink-2: #4A3E36;
  --paper: #F4EFE9;
  --card: #fff;
  --line: #E8DFD5;
  --line-2: #F1E9E0;
  --muted: #857a70;
  --muted-2: #A89C92;
  --green: #15803D;
  --amber: #B45309;
  --red: #B91C1C;
  --blue: #1D4ED8;
  --violet: #6D28D9;
  --cyan: #0E7490;
  --green-bg: #E7F4EC;
  --amber-bg: #FBF1E0;
  --red-bg: #FBE9E9;
  --blue-bg: #E7EDFB;
  --violet-bg: #F3E8FF;
  --maroon-bg: #FDF1F0;
  --shadow: 0 12px 32px -20px rgba(153,27,27,.32);
}
```

#### 3.2. Tipografia
- Fonte principal: `"Segoe UI", system-ui, -apple-system, sans-serif`
- Tamanho base: `14px`
- Altura da linha (line-height): `1.5`

#### 3.3. Componentes Compartilhados

**Cards (`.card`)**
Containers principais para agrupar informações.
- Fundo branco (`var(--card)`)
- Borda fina (`var(--line)`)
- Border-radius (`14px`)
- Sombra (`var(--shadow)`)

**Pills/Badges (`.pill`)**
Indicadores visuais de status ou categoria.
- Formato arredondado (`border-radius: 99px`)
- Texto pequeno (`11px`, `font-weight: 700`)
- Classes utilitárias: `.p-green`, `.p-amber`, `.p-red`, `.p-blue`, `.p-violet`, `.p-gray`, `.p-maroon` (cada uma combina a cor de texto e background correspondente).

**Botões (`.btn`)**
- Primário (`.btn.p`): Fundo `--maroon-2`, texto branco.
- Secundário (`.btn.s`): Fundo branco, borda `--line`, texto `--ink-2`.

**Tabelas (`table.t`)**
- Cabeçalho: Texto pequeno (`11px`), uppercase, cor `--muted`.
- Linhas: Borda superior `--line`, hover effect (`background: #FCFAF7`).

**Abas (`.tabs`)**
Navegação interna de páginas de entidade.
- Botões com borda inferior transparente.
- Estado ativo (`.on`): Borda inferior `--maroon-2`, texto `--maroon-2`, negrito.

### 4. Estrutura de Layout (App Shell)

A aplicação deve ter um layout de tela cheia (`100vh`) dividido em Sidebar e Área Principal.

#### 4.1. Sidebar (Menu Lateral)
- Largura fixa (`236px`).
- Fundo: Gradiente linear (`var(--maroon)` para `#9E2E24`).
- Cor do texto: `#f4e6df`.
- Estrutura do Menu Principal:
  1. Dashboard (`/`)
  2. Unidades (`/unidades`)
  3. Consultores (`/consultores`)
  4. PVs (`/pvs`)
  5. Prévias (`/previas`)
  6. Ocorrências (`/ocorrencias`)
  7. Visitas (`/visitas`)
  8. Relatórios (`/relatorios`)
  9. Configurações (`/configuracoes`)
- Rodapé do Sidebar: Perfil do usuário logado (ex: "Roberto Almeida - Gerente BU").

#### 4.2. Área Principal (`.main`)
- **Header (`.top`)**:
  - Altura fixa (`56px`).
  - Breadcrumb dinâmico.
  - Busca global.
  - **Sino de Alertas**: Ícone de sino com contador (badge vermelho). Ao clicar, deve abrir um painel lateral (slider) listando os alertas ativos.
  - Avatar do usuário.
- **Área de Conteúdo (`.view`)**:
  - Scrollável (`overflow-y: auto`).
  - Padding generoso (`26px`).
  - Container dinâmico que carrega as rotas/páginas.

### 5. Padrões de Navegação e Interação

- **Single Page Application (SPA)**: O protótipo deve funcionar sem recarregamento de página. A navegação entre as seções deve atualizar apenas a área `.view`.
- **Navegação por Entidade**: Ao clicar em uma linha de tabela (Unidade, Consultor, PV), o usuário deve ser levado para a página de detalhes daquela entidade.
- **Painel de Alertas**: O slider de alertas deve estar disponível em todas as páginas, ativado pelo ícone no header.
- **Ausência de Histórico no Menu**: Conforme definido, a funcionalidade de "Histórico" (Linha do Tempo) não existe como item de menu lateral, mas sim como uma aba embutida nas páginas das entidades (Unidade, Consultor, PV).

### 6. Estrutura de Dados Base (JSON)

Os dados globais e compartilhados que alimentam o protótipo devem ser estruturados conforme o exemplo abaixo. Os dados específicos de cada módulo estarão em seus respectivos documentos PRD.

```json
{
  "user": {
    "name": "Roberto Almeida",
    "role": "Gerente BU",
    "avatar": "RA"
  },
  "alerts": [
    {
      "id": "A001",
      "type": "inatividade",
      "icon": "⏱",
      "color": "red",
      "label": "Consultores em 4 meses sem venda",
      "count": 12,
      "action": "consultores?filter=inativos"
    },
    {
      "id": "A002",
      "type": "orfas",
      "icon": "⚠️",
      "color": "amber",
      "label": "Carteiras órfãs identificadas",
      "count": 5,
      "action": "pvs?filter=orfas"
    }
  ]
}
```

### 7. Instruções para Codificação (Claude Code)
1. Crie o `index.html` básico com o App Shell (Sidebar e Topbar).
2. Implemente o CSS global com as variáveis e classes utilitárias definidas na seção 3.
3. Crie uma estrutura de roteamento simples via JavaScript vanilla ou framework leve (se preferir) para alternar as views.
4. Implemente o painel lateral de alertas ativado pelo sino no header.
5. Deixe a área `.view` preparada para receber o conteúdo das páginas que serão definidas nos próximos PRDs.
