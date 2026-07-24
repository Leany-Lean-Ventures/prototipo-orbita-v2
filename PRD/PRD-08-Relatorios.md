# PRD-08: Relatórios
## Novo CRM Ademicon — Protótipo Órbita

### 1. Objetivo do Módulo
O módulo de Relatórios fornece extrações de dados consolidados e formatados para análise gerencial. Ele resolve a dor de relatórios genéricos, oferecendo visões específicas levantadas durante o onboarding, como inatividade, carteiras órfãs, histórico de mobilidade e desempenho econômico.

### 2. Visão Principal (`/relatorios`)

#### 2.1. Cabeçalho
- **Título:** "Central de Relatórios"
- **Subtítulo:** "Extração de dados consolidados e visões gerenciais."

#### 2.2. Grid de Tipos de Relatórios
Um grid de cards (`.card`), onde cada card representa um tipo de relatório disponível para geração.

**Tipos de Relatórios (Cards):**

1. **Consultores Inativos**
   - *Descrição:* Lista de consultores sem vendas, agrupados por tempo de inatividade.
   - *Filtros de Geração:* Range de tempo (ex: +3 meses, +6 meses), Nível, Regional.

2. **Carteiras Órfãs**
   - *Descrição:* Carteiras sem consultor responsável vinculado.
   - *Filtros de Geração:* Regional, Unidade, Faixa de Faturamento.

3. **Visão de Grupo Econômico**
   - *Descrição:* Consolidação de faturamento e estrutura por CPF (Dono) ou CNPJ.
   - *Filtros de Geração:* CPFs específicos, CNPJs especificos ou Top 10 maiores grupos.

4. **Penalidades Ativas**
   - *Descrição:* Lista de descontos e penalidades vigentes na rede.
   - *Filtros de Geração:* Unidade, Tipo de Penalidade.

5. **Histórico de Mobilidade**
   - *Descrição:* Registro de transferências e promoções de consultores.
   - *Filtros de Geração:* Período, Regional.

6. **Relatório de Visitas (Alcance)**
   - *Descrição:* Cobertura de visitas e relatórios de campo.
   - *Filtros de Geração:* Período, Gestor BU.
   - *Opção Especial:* Checkbox "Incluir anotações privadas" (apenas para perfis autorizados).

Incluir campos de opção de download em excel ou pdf.

### 3. Interface de Geração de Relatório

Ao clicar em um card de relatório, a interface deve expandir (ou abrir um modal/nova view) mostrando as opções de parametrização.

#### 3.1. Área de Parametrização
- Formulário dinâmico com os filtros específicos do relatório selecionado.
- Botão "Gerar Visualização".
- Botão "Exportar (CSV/PDF)".

#### 3.2. Área de Resultados (Preview)
- Uma tabela (`table.t`) renderizando os dados gerados com base nos filtros.
- Deve conter paginação simples se houver muitos registros.

### 4. Estrutura de Dados e Mock (JSON)

```json
{
  "tiposRelatorio": [
    {
      "id": "R01",
      "titulo": "Consultores Inativos",
      "icon": "⏱",
      "desc": "Consultores sem vendas, agrupados por tempo.",
      "filtros": [
        { "name": "tempo", "type": "select", "options": ["+3 meses", "+6 meses", "+12 meses"] },
        { "name": "regional", "type": "select", "options": ["Todas", "Sul", "Sudeste", "Nordeste"] }
      ]
    },
    {
      "id": "R02",
      "titulo": "Carteiras Órfãs",
      "icon": "⚠️",
      "desc": "Carteiras sem consultor responsável vinculado.",
      "filtros": [
        { "name": "unidade", "type": "autocomplete", "label": "Filtrar por Unidade" }
      ]
    }
  ],
  "mockResultados": {
    "R01": {
      "colunas": ["Consultor", "Matrícula", "Nível", "Unidade", "Última Venda", "Tempo Inativo"],
      "dados": [
        ["Ana Lima", "M-00422", "Autorizado 2.2", "SP-Interior", "15/02/2026", "4 meses"],
        ["Pedro Costa", "M-00501", "Autorizado 2.0", "SP-Centro", "10/01/2026", "5 meses"]
      ]
    },
    "R02": {
      "colunas": ["ID Carteira", "Cliente", "Unidade", "Faturamento Médio", "Órfã Desde"],
      "dados": [
        ["CRT-042", "Empresa Y", "SP-Centro", "R$ 15.000", "01/05/2026"],
        ["CRT-088", "Cliente Z", "Campinas", "R$ 8.500", "15/04/2026"]
      ]
    }
  }
}
```

### 5. Instruções Específicas para o Claude Code
- Crie um layout em grid para os cards de seleção de relatório (`display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));`).
- Para o protótipo, não é necessário implementar a lógica real de exportação de PDF/CSV. Apenas exiba a "Área de Resultados (Preview)" com dados mockados (como `mockResultados.R01`) quando o usuário clicar em "Gerar Visualização".
- A opção de "Incluir anotações privadas" no Relatório de Visitas deve ser apenas um checkbox visual para demonstrar a funcionalidade discutida no PRD.
