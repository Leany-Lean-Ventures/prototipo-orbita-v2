# Promoção de Consultores — Especificação para Kanban

> Documento técnico de apoio ao desenvolvimento de uma página Kanban onde o usuário cria um registro (card) de **solicitação de promoção** de um consultor e o avança pelas etapas do processo.
>
> Mesma lógica e estrutura do spec de *Abertura de Unidades*. A diferença central: aqui o card é validado contra uma **trilha de carreira** com critérios objetivos (Seção 2), e o processo separa **deliberação** (por evento) de **efetivação** (por janela mensal).
>
> Fontes: *Plano de Desenvolvimento — Grupo SAF (2026)* e diagnóstico AS-IS Ademicon (§3.4.4 · jornadas 7.1–7.4 · processo 5.3 `S-PROC-1` / `S-PROC-3` / `S-SIS-2`).

---

## 1. Modelo de dados (card)

Cada card representa **uma solicitação de promoção** de um consultor para o nível imediatamente superior.

### Metadados do card

| Campo | Chave | Tipo | Obrigatório | Observações |
|---|---|---|---|---|
| ID do registro | `id` | `uuid` | auto | |
| Consultor | `consultor_id` | `ref(Consultor)` | Sim | Matrícula no Newcon |
| Nível atual | `nivel_atual` | `enum(NivelId)` | Sim | Ver Seção 2 |
| Nível-alvo | `nivel_alvo` | `enum(NivelId)` | auto | Nível imediatamente acima de `nivel_atual` |
| Etapa atual | `etapa_atual` | `enum(EtapaId)` | auto | Ver Seção 3 |
| Status do card | `status` | `enum` | auto | `ativo` · `bloqueado` · `aprovado` · `reprovado` · `vigente` · `cancelado` |
| Tipo de movimento | `tipo_movimento` | `enum` | Sim | `promocao` · `troca_de_contrato` · `convite_socio` |
| Responsável atual | `responsavel_atual` | `ref(Usuario)` | auto | Derivado da etapa |
| Prazo da etapa (SLA) | `prazo_etapa` | `datetime` | auto | |
| Em atraso | `em_atraso` | `boolean` | auto | |
| Janela de efetivação | `janela_efetivacao` | `date` | auto | Calculada na etapa de efetivação (ver RN de janela) |
| Data de vigência | `data_vigencia` | `date` | auto | Preenchida quando a nova categoria entra em vigor |
| Histórico de etapas | `historico[]` | `array<LogEtapa>` | auto | |

### LogEtapa (item do histórico)

| Campo | Tipo | Observações |
|---|---|---|
| `etapa` | `enum(EtapaId)` | |
| `entrou_em` | `datetime` | |
| `saiu_em` | `datetime \| null` | |
| `responsavel` | `ref(Usuario)` | |
| `decisao` | `string \| null` | aprovado · reprovado · ajuste |
| `justificativa` | `text \| null` | **Obrigatória na deliberação** (hoje inexistente — dor do AS-IS) |

---

## 2. Trilha de carreira (dados de referência)

Régua que dirige a validação de critérios. Extraída do *Plano de Desenvolvimento SAF 2026*. Cada transição de nível tem requisitos objetivos que o card precisa comprovar.

### 2.1 Níveis e comissão

| Ordem | NivelId | Nome | Comissão base | Comissão total | Composição da comissão total |
|:-:|---|---|:-:|:-:|---|
| 0 | `PREVIA` | Prévia (candidato) | 2,0% | 2,0% | — |
| 1 | `AUTORIZADO_I` | Autorizado I | 2,0% | 3,11% | 2,0% + grupos novos 14º 0,3% + taxa futura 0,7% + seguro 0,11% |
| 2 | `AUTORIZADO_II` | Autorizado II | 2,2% | 3,37% | 2,2% + 0,3% + 0,7% + seguro 0,13% |
| 3 | `AUTORIZADO_III` | Autorizado III | 2,5% | 3,74% | 2,5% + 0,3% + taxa futura 0,8% + seguro 0,14% |
| 4 | `LICENCIADO_I` | Licenciado I | 2,7% | 3,99% | 2,7% + 0,3% + taxa futura 0,84% + seguro 0,15% |
| 5 | `LICENCIADO_II` | Licenciado II | 3,0% | 4,37% | 3,0% + 0,3% + taxa futura 0,90% + seguro 0,17% |
| 6 | `LICENCIADO_LOJISTA` | Licenciado Lojista (Sócio de Loja) | — | 4,8% | Convite; ver 2.3 |
| 7 | `DIRETOR_REGIONAL` | Diretor Regional Licenciado | — | — | Não detalhado no documento |
| 8 | `DIRETOR_MASTER` | Diretor Master Licenciado | — | — | Não detalhado no documento |

> ⚠️ **Divergência a validar:** a tabela-resumo do documento ("Comissão Total sobre o crédito") mostra valores arredondados (3,0% · 3,2% · 3,6% · 3,8% · 4,2% · 4,8%), enquanto os slides de detalhe mostram a composição fechada (3,11% · 3,37% · 3,74% · 3,99% · 4,37%). Usei os valores detalhados como comissão total e os arredondados como referência. **Confirmar qual é o oficial para efeito de cálculo.**

### 2.2 Requisitos por transição (níveis por meta)

Cada objeto abaixo é a régua que a etapa `VALIDACAO_CRITERIOS` verifica.

```yaml
PREVIA -> AUTORIZADO_I:
  emitir_matricula: true            # matrícula junto à Ademicon
  meta_mensal: 300000               # R$/mês
  prazo_dias: 90
  retencao_min: 95                  # %
  regra_prorrogacao: "Não atingindo a meta trimestral, avaliar com a gestão +30 dias"

AUTORIZADO_I -> AUTORIZADO_II:
  meta_mensal: 1500000
  prazo_meses: [6, 12]
  indicacoes_ativadas: 3            # 3 indicações a consultor, ativadas
  retencao_min: 95
  custo_loja_nao_atingiu: 750       # R$/mês
  custo_loja_atingiu: 500           # R$/mês

AUTORIZADO_II -> AUTORIZADO_III:
  meta_individual_mensal: 2000000
  meta_total_time_mensal: 5000000   # inclui a venda individual
  prazo_meses: [6, 12]
  consultores_autorizado_i: 6       # ativos, venda média 500.000/mês
  retencao_min: 95
  custo_loja_nao_atingiu: 1500
  custo_loja_atingiu: 1000

AUTORIZADO_III -> LICENCIADO_I:
  meta_time_mensal: 10000000
  experiencia_anos: 3
  consultores_autorizado_i: 6
  consultores_autorizado_ii: 1
  consultores_autorizado_iii: 1
  retencao_min: 95
  custo_loja_nao_atingiu: 4000
  custo_loja_atingiu: 3000

LICENCIADO_I -> LICENCIADO_II:
  meta_time_mensal: 20000000
  experiencia_anos: 3
  consultores_autorizado_i: 10
  consultores_autorizado_ii: 2
  consultores_autorizado_iii: 2
  retencao_min: 95
  custo_loja: "Rateado proporcionalmente entre os times de licenciados"
```

### 2.3 Transição por convite (não métrica)

```yaml
LICENCIADO_II -> LICENCIADO_LOJISTA:   # Sócio de Loja
  tipo_movimento: convite_socio
  gatilho: "Convite do licenciado lojista"
  tratativa: "Permanência na mesma unidade OU abertura de nova unidade"
  equipe_e_carteira: "Permanecem na unidade de origem"
  # Não passa por validação de meta; fluxo qualitativo (ver Seção 3, ramo de convite)
```

> Os níveis `DIRETOR_REGIONAL` e `DIRETOR_MASTER` aparecem na régua de comissão mas **não têm requisitos definidos no documento** — marcar como "a validar".

---

## 3. Etapas (colunas do Kanban)

Processo de **6 etapas**. As três primeiras correm **por evento** (a qualquer momento); a efetivação está presa à **janela mensal de comissão**. Essa separação é obrigatória no modelo (ver RN9).

### 3.1 Tabela-resumo

| Ordem | EtapaId | Nome | Responsável | SLA sugerido | Gatilho de entrada | Critério para avançar |
|:-:|---|---|---|:-:|---|---|
| 1 | `SOLICITACAO` | Solicitação de promoção | Gestor da unidade (dono em cópia) | 3 dias | Card criado / acordo das partes | Dados obrigatórios preenchidos |
| 2 | `VALIDACAO_CRITERIOS` | Validação de critérios | Gerente de BU + Gestor | 5 dias | Solicitação recebida | Todos os critérios do nível-alvo atendidos |
| 3 | `ESTRUTURA_PV` | Estruturação do Ponto de Venda | Back-office + Comissões | 5 dias | Critérios validados | Distribuição do residual definida e coerente |
| 4 | `DELIBERACAO` | Deliberação / aprovação | Autoridade conforme nível-alvo (ver 3.3) | 10 dias | Estrutura validada | Decisão = aprovado, com justificativa |
| 5 | `EFETIVACAO` | Efetivação (janela mensal) | Comissões | até a janela | Promoção aprovada | Ajuste no Newcon + aditivo assinado |
| 6 | `VIGENTE` | Nova categoria vigente | — | — | Efetivada na janela | Etapa final |

### 3.2 Detalhe por etapa

#### Etapa 1 — `SOLICITACAO`
```yaml
id: SOLICITACAO
nome: "Solicitação de promoção"
ordem: 1
responsavel: "Gestor da unidade (dono da loja sempre em cópia)"
gatilho: "Acordo das partes / demanda da loja (por evento, a qualquer momento)"
resultado: "Solicitação registrada e enfileirada"
sla_dias: 3
campos_obrigatorios: [consultor_id, razao_social, matricula, percentual_atual, nivel_alvo, tera_equipe_abaixo]
acoes: [criar, editar, enviar_para_analise]
criterio_avanco: "Dados obrigatórios completos"
canais_reais: [email, whatsapp, telefone, visita]   # e-mail costuma ser o fim, não o começo
dor_atual: "E-mail a licenciamento@; zero volumetria, sem SLA, sem esteira, sem justificativa"
```

#### Etapa 2 — `VALIDACAO_CRITERIOS`
```yaml
id: VALIDACAO_CRITERIOS
nome: "Validação de critérios"
ordem: 2
responsavel: "Gerente de BU + Gestor da unidade"
gatilho: "Solicitação recebida"
resultado: "Elegibilidade confirmada ou permanência no nível atual"
sla_dias: 5
valida_contra: "Requisitos da transição (Seção 2.2)"
pilares:
  - tempo_de_casa        # verificado na matrícula do Newcon
  - pessoas_desenvolvidas # contagem de matrículas abaixo do consultor
  - volume_de_vendas      # produção no Newcon / Data Lake
  - retencao              # >= 95%
  - estrutura_de_equipe   # nº de consultores por nível exigido
campos_obrigatorios: [criterios_checados, evidencias_producao]
acoes: [validar_criterios, aprovar_elegibilidade, reprovar, solicitar_evidencia]
criterio_avanco: "Todos os critérios do nível-alvo = atendido"
melhoria_prevista: "Elegibilidade visível ANTES de a loja pedir (acompanhamento contínuo dos 3 pilares)"
```

#### Etapa 3 — `ESTRUTURA_PV`
```yaml
id: ESTRUTURA_PV
nome: "Estruturação do Ponto de Venda"
ordem: 3
responsavel: "Back-office + Comissões"
gatilho: "Critérios validados"
resultado: "Cadeia de comissão do PV definida, somando o total por construção"
sla_dias: 5
campos_obrigatorios: [distribuicao_residual, cadeia_comissao]
acoes: [informar_estrutura, validar_codigo, validar_monotonicidade]
criterio_avanco: "Distribuição do residual completa e cadeia monotônica"
validacoes:
  - "Cada matrícula que recebe fração do residual está identificada"
  - "Monotonicidade: nenhum nível recebe menos que o nível abaixo"
gargalo_conhecido: "Lojas não sabem informar quem recebe cada fração — hoje gera ligações e retrabalho"
observacao: "Validar na origem (S-PROC-3); não há material de apoio hoje"
```

#### Etapa 4 — `DELIBERACAO`
```yaml
id: DELIBERACAO
nome: "Deliberação / aprovação"
ordem: 4
responsavel: "Autoridade conforme nível-alvo (ver 3.3)"
gatilho: "Estrutura do PV validada"
resultado: "Decisão registrada com justificativa"
sla_dias: 10
campos_obrigatorios: [decisao, justificativa, autoridade_aprovadora, data_deliberacao]
acoes: [deliberar, aprovar, reprovar, solicitar_ajuste]
criterio_avanco: "decisao = aprovado"
clock: "por_evento"     # NÃO usar a janela mensal aqui
ramificacoes:
  aprovado: "-> EFETIVACAO"
  reprovado: "status = reprovado; registrar bandeira de conflito (ver RN10)"
  ajuste: "-> VALIDACAO_CRITERIOS ou ESTRUTURA_PV"
```

#### Etapa 5 — `EFETIVACAO`
```yaml
id: EFETIVACAO
nome: "Efetivação na janela mensal"
ordem: 5
responsavel: "Comissões"
gatilho: "Promoção aprovada"
resultado: "Percentual e hierarquia ajustados; contrato aditivo assinado"
sla: "Limitado pela janela mensal (ver RN9)"
campos_obrigatorios: [janela_efetivacao, ajuste_newcon_ok, aditivo_assinado]
acoes: [calcular_janela, ajustar_newcon, gerar_aditivo, coletar_assinatura]
criterio_avanco: "Ajuste aplicado no Newcon na janela + aditivo assinado"
clock: "janela_mensal"
sistema: "Newcon (ajuste manual hoje)"
```

#### Etapa 6 — `VIGENTE`
```yaml
id: VIGENTE
nome: "Nova categoria vigente"
ordem: 6
responsavel: "—"
gatilho: "Efetivada na janela"
resultado: "Nova categoria e comissão vigentes; nova equipe, se houver"
acoes: [encerrar_card, iniciar_novo_ciclo_carreira]
criterio_avanco: "Etapa final"
efeitos:
  - "Trajetória do consultor atualizada e comparável ao plano de carreira"
  - "Se houver equipe abaixo, hierarquia atualizada no PV"
```

### 3.3 Autoridade de aprovação por nível-alvo

A etapa `DELIBERACAO` roteia o aprovador conforme o nível-alvo:

| Transição (nível-alvo) | Autoridade aprovadora |
|---|---|
| Autorizado I / II / III | Gerente de BU + Gestor da unidade |
| Licenciado I (entrada na faixa de licenciado) | Entrevista com Vice-Presidência e CEO |
| Licenciado II | Comitê dos 3 Masters |
| Licenciado Lojista (Sócio de Loja) | Convite do licenciado lojista (ramo de convite, ver 3.4) |

> ⚠️ As regras de autoridade vêm do AS-IS, que citava percentuais do **modelo antigo** ("de 2,7 para 3,0 por comitê dos 3 Masters"; "a licenciado passa por entrevista com VP e CEO"). O mapeamento para os níveis novos acima é **proposto — a validar** com Comissões / Back-office.

### 3.4 Ramo de convite (Sócio de Loja)

Quando `tipo_movimento = convite_socio` (Licenciado II → Licenciado Lojista), o card **pula** `VALIDACAO_CRITERIOS` e `ESTRUTURA_PV` métricas e segue um fluxo qualitativo:

```
SOLICITACAO(convite) -> DELIBERACAO(tratativa: permanência ou nova unidade) -> EFETIVACAO -> VIGENTE
```
Equipe formada e carteira de clientes permanecem na unidade de origem. Se a tratativa for "abertura de nova unidade", **dispara o processo de Abertura de Unidades** (spec correlato).

---

## 4. Formulário de cadastro

Formulário único do card, organizado por etapa de preenchimento.

> Legenda de tipos: `text` · `textarea` · `number` · `currency` · `percent` · `date` · `select` · `multiselect` · `radio` · `checkbox` · `file` · `ref` · `readonly` (auto) · `repeater` (lista dinâmica de itens).

### 4.1 Bloco A — Solicitação (Etapa `SOLICITACAO`)

| Label | Chave | Tipo de input | Obrigatório | Validação / Opções |
|---|---|---|:-:|---|
| Consultor | `consultor_id` | `ref(Consultor)` | Sim | Deve existir matrícula no Newcon |
| Razão social | `razao_social` | `text` | Sim | |
| Matrícula | `matricula` | `text` | Sim | Chave no Newcon |
| Nível atual | `nivel_atual` | `select` | Sim | Enum `NivelId` |
| Nível-alvo | `nivel_alvo` | `readonly` | Auto | Nível imediatamente acima |
| Tipo de movimento | `tipo_movimento` | `radio` | Sim | `promocao` · `troca_de_contrato` · `convite_socio` |
| Percentual atual | `percentual_atual` | `percent` | Sim | |
| Haverá equipe abaixo após a promoção? | `tera_equipe_abaixo` | `radio` | Sim | `sim` · `nao` |
| Canal de origem | `canal_origem` | `select` | Sim | `email` · `whatsapp` · `telefone` · `visita` · `sistema` |
| Dono da loja em cópia | `dono_em_copia` | `ref(Licenciado)` | Sim | Regra: dono sempre ciente |
| Observações | `observacoes` | `textarea` | Não | |

### 4.2 Bloco B — Validação de critérios (Etapa `VALIDACAO_CRITERIOS`)

Campos **dinâmicos** conforme o `nivel_alvo` (renderizar a partir da régua da Seção 2.2).

| Label | Chave | Tipo de input | Obrigatório | Validação / Opções |
|---|---|---|:-:|---|
| Tempo de casa | `tempo_casa_meses` | `number` | Sim | Verificado no Newcon |
| Volume de vendas (mês) | `volume_vendas_mensal` | `currency` | Sim | ≥ meta do nível-alvo |
| Volume de vendas do time (mês) | `volume_time_mensal` | `currency` | Cond. | Exigido dos níveis com meta de time |
| Retenção | `retencao_percentual` | `percent` | Sim | ≥ 95% |
| Indicações ativadas | `indicacoes_ativadas` | `number` | Cond. | Exigido em Autorizado II (≥ 3) |
| Consultores Autorizado I (ativos) | `qtd_autorizado_i` | `number` | Cond. | Conforme nível-alvo |
| Consultores Autorizado II (ativos) | `qtd_autorizado_ii` | `number` | Cond. | Conforme nível-alvo |
| Consultores Autorizado III (ativos) | `qtd_autorizado_iii` | `number` | Cond. | Conforme nível-alvo |
| Evidências de produção | `evidencias_producao` | `file[]` | Não | Print/extrato Newcon ou Data Lake |
| Resultado da checagem | `criterios_checados` | `checklist` | Sim | Item por critério: `atende` · `nao_atende` |

### 4.3 Bloco C — Estruturação do PV (Etapa `ESTRUTURA_PV`)

| Label | Chave | Tipo de input | Obrigatório | Validação / Opções |
|---|---|---|:-:|---|
| Distribuição do residual | `distribuicao_residual` | `repeater` | Sim | Itens: `{ matricula, percentual }` |
| Cadeia de comissão resultante | `cadeia_comissao` | `readonly` | Auto | Soma deve fechar o total do PV |
| Código do PV validado | `codigo_pv_valido` | `checkbox` | Sim | |
| Monotonicidade validada | `monotonicidade_ok` | `checkbox` | Auto | Nenhum nível abaixo do inferior |

### 4.4 Bloco D — Deliberação (Etapa `DELIBERACAO`)

| Label | Chave | Tipo de input | Obrigatório | Validação / Opções |
|---|---|---|:-:|---|
| Autoridade aprovadora | `autoridade_aprovadora` | `select` | Sim | Roteada por nível-alvo (3.3) |
| Data da deliberação | `data_deliberacao` | `date` | Sim | |
| Decisão | `decisao` | `radio` | Sim | `aprovado` · `reprovado` · `ajuste` |
| Justificativa | `justificativa` | `textarea` | Sim | **Rastro obrigatório** |

### 4.5 Bloco E — Efetivação (Etapa `EFETIVACAO`)

| Label | Chave | Tipo de input | Obrigatório | Validação / Opções |
|---|---|---|:-:|---|
| Janela de efetivação | `janela_efetivacao` | `readonly` | Auto | Calculada (RN9) |
| Ajuste aplicado no Newcon | `ajuste_newcon_ok` | `checkbox` | Sim | |
| Contrato aditivo | `aditivo_assinado` | `file` | Sim | PDF assinado |
| Data de vigência | `data_vigencia` | `date` | Auto | Dia 21 da janela |

---

## 5. Regras de negócio (validações)

| # | Regra | Aplicação |
|---|---|---|
| RN1 | Promoção exige **acordo das partes** com o dono da loja em cópia | `SOLICITACAO` |
| RN2 | O nível-alvo é sempre o **imediatamente superior** ao nível atual | `SOLICITACAO` |
| RN3 | Todos os critérios do nível-alvo (Seção 2.2) devem ser **atendidos** para avançar | `VALIDACAO_CRITERIOS` |
| RN4 | Retenção mínima de **95%** em todas as transições por meta | `VALIDACAO_CRITERIOS` |
| RN5 | Prévia → Autorizado I: não atingindo a meta trimestral, avaliar com a gestão **+30 dias** | `VALIDACAO_CRITERIOS` |
| RN6 | A **estrutura do PV** deve identificar quem recebe cada fração do residual | `ESTRUTURA_PV` |
| RN7 | **Monotonicidade da cadeia:** nenhum nível pode receber menos que o nível abaixo (diferencial negativo é impossível de gravar) | `ESTRUTURA_PV` |
| RN8 | Deliberação exige **decisão + justificativa** registradas (hoje inexistente) | `DELIBERACAO` |
| RN9 | **Janela mensal:** solicitações efetivadas até o **dia 13** valem a partir do **dia 21 do mesmo mês**; depois, dia 21 do mês seguinte. Aplica-se **só à efetivação**, não à deliberação | `EFETIVACAO` |
| RN10 | Promoção negada a consultor que cumpriu o plano deve **registrar bandeira de conflito** (hoje invisível ao sistema) | `DELIBERACAO` (ramo reprovado) |
| RN11 | Autoridade de aprovação varia por nível-alvo (Gerente BU / Entrevista VP+CEO / Comitê 3 Masters / Convite) | `DELIBERACAO` |
| RN12 | Sócio de Loja é por **convite**, não por meta; equipe e carteira ficam na unidade de origem | Ramo de convite |

> 🔑 **Ponto de engenharia (RN9):** deliberação e efetivação são **eventos distintos, com dois relógios e dois donos**. Se forem colapsados em um só, toda promoção exibe atraso sistemático de até um mês contra o plano, e o caso "cumpriu o plano e não foi promovido" fica indistinguível de "foi promovido e ainda não efetivou". Modele os dois `timestamps` separadamente.

---

## 6. Enums de referência

```ts
enum NivelId {
  PREVIA = "PREVIA",
  AUTORIZADO_I = "AUTORIZADO_I",
  AUTORIZADO_II = "AUTORIZADO_II",
  AUTORIZADO_III = "AUTORIZADO_III",
  LICENCIADO_I = "LICENCIADO_I",
  LICENCIADO_II = "LICENCIADO_II",
  LICENCIADO_LOJISTA = "LICENCIADO_LOJISTA",
  DIRETOR_REGIONAL = "DIRETOR_REGIONAL",
  DIRETOR_MASTER = "DIRETOR_MASTER",
}

enum EtapaId {
  SOLICITACAO = "SOLICITACAO",
  VALIDACAO_CRITERIOS = "VALIDACAO_CRITERIOS",
  ESTRUTURA_PV = "ESTRUTURA_PV",
  DELIBERACAO = "DELIBERACAO",
  EFETIVACAO = "EFETIVACAO",
  VIGENTE = "VIGENTE",
}

enum StatusCard {
  ATIVO = "ativo",
  BLOQUEADO = "bloqueado",
  APROVADO = "aprovado",
  REPROVADO = "reprovado",
  VIGENTE = "vigente",
  CANCELADO = "cancelado",
}

enum TipoMovimento {
  PROMOCAO = "promocao",
  TROCA_DE_CONTRATO = "troca_de_contrato",
  CONVITE_SOCIO = "convite_socio",
}

enum DecisaoDeliberacao {
  APROVADO = "aprovado",
  REPROVADO = "reprovado",
  AJUSTE = "ajuste",
}
```

---

## 7. Programa correlato — Bônus ANJO

Não é uma promoção, mas usa a mesma base de dados (consultor + prévia ativada). Vale modelar como registro à parte, referenciável pelo card.

```yaml
programa: "ANJO — Premiação Bônus"
gatilho: "Autorizado I traz nova prévia e ela é ativada"
beneficio: "0,20% de comissão do valor comercializado nos primeiros 3 meses"
repasse: "Feito pelo Supervisor direto da prévia"
campos:
  - consultor_padrinho: ref(Consultor)   # deve ser Autorizado I
  - previa_id: ref(Previa)
  - data_ativacao: date
  - percentual_bonus: 0.20               # %
  - janela_meses: 3
  - supervisor_repasse: ref(Usuario)
```

---

## 8. Observações para o desenvolvimento

- **Campos dinâmicos por nível-alvo:** o Bloco B deve renderizar apenas os critérios da transição correspondente (Seção 2.2). Guarde a régua como configuração, não hard-coded, para permitir ajuste de metas.
- **Dois relógios (RN9):** persista `data_deliberacao` (evento) e `janela_efetivacao`/`data_vigencia` (calendário) separadamente. Não derive uma da outra.
- **Ramo de convite:** `tipo_movimento = convite_socio` desvia o fluxo — trate como caminho alternativo no motor de etapas, pulando as validações métricas.
- **Acompanhamento proativo:** o maior ganho apontado no AS-IS é tornar a **elegibilidade visível antes** do pedido. Considere um painel/alerta que compare a trajetória do consultor (Newcon/Data Lake) com a régua e sinalize quem está próximo de bater os critérios.
- **Estrutura do PV como sub-objeto:** `distribuicao_residual` é uma lista `{matricula, percentual}` com validação de soma e de monotonicidade — não um campo único.
- **Bandeira de conflito (RN10):** ao reprovar, gere um registro consultável ("por que não fui promovido se cumpri o plano?") — hoje esse atrito é invisível ao sistema.
- **Itens a validar com Comissões / Back-office:**
  - Qual comissão total é oficial (arredondada da tabela × composição dos slides).
  - Mapeamento das autoridades de aprovação (percentuais do AS-IS eram do modelo antigo).
  - Requisitos de Diretor Regional e Diretor Master (ausentes no documento).
  - Se "custo de loja" impacta o gate de promoção ou é apenas encargo pós-promoção.

---

*Referências: Plano de Desenvolvimento — Grupo SAF (2026); AS-IS Ademicon §3.4.4 (Promoção de Consultores) e jornadas micro 7.1–7.4; Blueprint — processo 5.3 e soluções `S-PROC-1`, `S-PROC-3`, `S-SIS-2`.*
