# Promoção de Consultores — Especificação para Kanban

> Documento técnico de apoio ao desenvolvimento da esteira Kanban de **promoção de consultores** (card = solicitação de promoção que avança por etapas).
>
> **Prioridade de fontes (governança):** os documentos de discovery — Blueprint de Transformação e AS-IS Ademicon — **governam** esta especificação. O *Plano de Desenvolvimento — Grupo SAF (2026)* é tratado como **uma instância de plano de carreira de loja** (ver §2.2), não como régua universal. Onde os dois divergem, prevalece o discovery.
>
> Mapa de soluções: a esteira é `S-PROC-1` (fila, prazo, responsável); a estrutura de PV na origem é `S-PROC-3`; a escrita no transacional é `S-SIS-2` (M3); o plano/linha do tempo/score do consultor são M8 (`S-PROD-2`, `S-PROD-3`).
>
> Fontes: AS-IS §3.4.4 e jornadas 7.1–7.5; Blueprint M3 (régua de comissão, Pol. 01), M4 (esteiras) e M8 (plano de carreira).

---

## 0. Como o discovery governa este processo (leitura obrigatória)

Quatro invariantes do discovery que o desenvolvimento **não pode** contrariar:

1. **A esteira só entrega o pedido; a gravação válida é de M3.** A esteira (`S-PROC-1`) organiza fila/prazo/responsável. A alteração de comissão/hierarquia é gravada **exclusivamente** pelo caminho governado `S-SIS-2` — o Newcon nunca é tocado direto pela aplicação (Guardrail G1).

2. **Comissão-base = cadeia governada, teto de 3,5% por PV, imutável.** Só a **distribuição** varia; o cálculo é **por subtração** (cada nível recebe a diferença para o nível de baixo). Os "totais" acima de 3,5% do plano SAF somam **outras receitas** (grupos novos, taxa futura, seguro) — não são cadeia e não estouram o teto.

3. **Captura-se categoria por matrícula, nunca fração digitada** (ADR-19-02). A fração é derivada por subtração. Assim "soma errada" é **irrepresentável**, não "validada". Só se chega a 3,5% (Licenciado Lojista) **sendo dono de loja**; sem loja, no máximo 3,0%.

4. **Deliberação e efetivação são eventos distintos, com dois relógios.** Solicitação/deliberação correm **por evento** (a qualquer momento); só a **efetivação** obedece à janela mensal (até dia 13 → vigência dia 21 do mesmo mês). Colapsá-los cria atraso sistemático de até um mês contra o plano e torna "não foi promovido" indistinguível de "foi promovido, falta efetivar".

> ⚠️ **Conflito de interesse registrado (não resolvido no discovery):** o Comitê de Masters aprova promoções que alteram a cadeia — e os Masters mantêm unidades próprias. Quem decide a distribuição participa dela. Deve ser exibível na trilha de auditoria da deliberação.

---

## 1. Modelo de dados (card)

Cada card representa **uma solicitação de promoção** de um consultor para o nível imediatamente superior, validada contra o **plano de carreira da loja** (entidade M8) e gravada por `S-SIS-2`.

### Metadados do card

| Campo | Chave | Tipo | Obrigatório | Observações |
|---|---|---|---|---|
| ID do registro | `id` | `uuid` | auto | |
| Consultor | `consultor_id` | `ref(Consultor)` | Sim | Matrícula no Newcon |
| Plano de carreira aplicável | `plano_carreira_id` | `ref(PlanoCarreira)` | auto | Plano vigente da loja (§2.2) |
| Nível atual | `nivel_atual` | `enum(NivelId)` | Sim | Ver §2.1 |
| Nível-alvo | `nivel_alvo` | `enum(NivelId)` | auto | Nível imediatamente acima |
| Etapa atual | `etapa_atual` | `enum(EtapaId)` | auto | Ver §3 |
| Status do card | `status` | `enum` | auto | `ativo` · `bloqueado` · `aprovado` · `reprovado` · `vigente` · `cancelado` |
| Tipo de movimento | `tipo_movimento` | `enum` | Sim | `promocao` · `troca_de_contrato` · `convite_socio` |
| Responsável atual | `responsavel_atual` | `ref(Usuario)` | auto | Derivado da etapa |
| Prazo da etapa (SLA) | `prazo_etapa` | `datetime` | auto | |
| Em atraso | `em_atraso` | `boolean` | auto | |
| **Data da deliberação** | `data_deliberacao` | `datetime` | auto | Relógio de **evento** (não janela) |
| **Janela de efetivação** | `janela_efetivacao` | `date` | auto | Relógio de **calendário** (dia 21) |
| Data de vigência | `data_vigencia` | `date` | auto | Quando a nova categoria entra em vigor |
| Histórico de etapas | `historico[]` | `array<LogEtapa>` | auto | |

### LogEtapa

| Campo | Tipo | Observações |
|---|---|---|
| `etapa` | `enum(EtapaId)` | |
| `entrou_em` / `saiu_em` | `datetime` | |
| `responsavel` | `ref(Usuario)` | |
| `decisao` | `string \| null` | aprovado · reprovado · ajuste |
| `justificativa` | `text \| null` | **Obrigatória na deliberação** |

---

## 2. Dados de referência

### 2.1 Régua de comissão da matriz — GOVERNADA (Pol. 01, [primária])

Cadeia-base do PV. **Teto 3,5% por PV, imutável; distribuição por subtração; todo nível ≥ o de baixo (monotonicidade).**

| Ordem | NivelId | Nome (2026 / Agora) | Nome Pol. 01 (Antes) | Comissão-base (cadeia) | Categoria de gestão? |
|:-:|---|---|---|:-:|:-:|
| 0 | `PREVIA` | Prévia | Candidato em Prévia | 2,0% | Não |
| 1 | `AUTORIZADO_I` | Autorizado I | Autorizada | 2,0% | Não |
| 2 | `AUTORIZADO_II` | Autorizado II | Autorizada Pleno | 2,2% | Sim (≥2,2% pode ter equipe/PV) |
| 3 | `AUTORIZADO_III` | Autorizado III | Autorizada Sênior | 2,5% | Sim |
| 4 | `LICENCIADO_I` | Licenciado I | Licenciada Gestor | 2,7% | Sim |
| 5 | `LICENCIADO_II` | Licenciado II | Licenciada Sênior | 3,0% | Sim (máx. sem ser dono de loja) |
| 6 | `LICENCIADO_LOJISTA` | Licenciado Lojista (Sócio de Loja) | Licenciada Lojista | 3,5% | Sim — **só sendo dono de loja** |
| 7 | `DIRETOR_REGIONAL` | Diretor Regional Licenciado | — | (fora da cadeia de PV) | — |
| 8 | `DIRETOR_MASTER` | Diretor Master Licenciado | — | (fora da cadeia de PV) | — |

> **Reconciliação com o plano SAF.** Os "totais sobre o crédito" do SAF (3,11% · 3,37% · 3,74% · 3,99% · 4,37% · 4,8%) = comissão-base **+ receitas fora da cadeia**: grupos novos 14º (0,3%) + taxa futura (0,7–0,90%) + seguro (0,11–0,17%). Essas linhas **não** entram na cadeia de PV e **não** estão sujeitas ao teto de 3,5%. Para efeito de gravação (`S-SIS-2`), o que importa é a **categoria (coluna base)**; o "total" é informativo/remuneratório, calculado à parte.

### 2.2 Plano de Carreira — ENTIDADE POR LOJA (M8 · `S1`)

O plano de carreira é **definido pela unidade** sobre três pilares: **tempo de casa**, **pessoas desenvolvidas** (matrículas abaixo) e **volume de vendas**. Não é global. O card valida contra o plano **vigente da loja do consultor**.

O *Plano de Desenvolvimento SAF 2026* é **uma instância** desse tipo. Suas metas/estrutura são atributos configuráveis do `PlanoCarreira`, não constantes de sistema:

```yaml
# Instância: PlanoCarreira "Grupo SAF 2026" (exemplo de configuração por loja)
PREVIA -> AUTORIZADO_I:
  emitir_matricula: true
  meta_mensal: 300000
  prazo_dias: 90
  retencao_min: 95
  regra_prorrogacao: "Não atingindo a meta trimestral, avaliar com a gestão +30 dias"
AUTORIZADO_I -> AUTORIZADO_II:
  meta_mensal: 1500000
  prazo_meses: [6, 12]
  indicacoes_ativadas: 3
  retencao_min: 95
  custo_loja_nao_atingiu: 750
  custo_loja_atingiu: 500
AUTORIZADO_II -> AUTORIZADO_III:
  meta_individual_mensal: 2000000
  meta_total_time_mensal: 5000000
  prazo_meses: [6, 12]
  consultores_autorizado_i: 6      # ativos, venda média 500.000/mês
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

> **Implicação de arquitetura:** modele `PlanoCarreira` como entidade versionada por loja, com um conjunto de transições. O motor de validação lê o plano vigente da loja do consultor — **nunca** valores hard-coded.

### 2.3 Transição por convite — Sócio de Loja (não métrica)

```yaml
LICENCIADO_II -> LICENCIADO_LOJISTA:
  tipo_movimento: convite_socio
  gatilho: "Convite do licenciado lojista"
  pre_requisito_matriz: "Chegar a 3,5% exige ser dono de loja (regra Pol. 01)"
  tratativa: "Permanência na mesma unidade OU abertura de nova unidade"
  equipe_e_carteira: "Permanecem na unidade de origem"
  # Pula validação métrica; se 'abertura de nova unidade', dispara o processo de Abertura de Unidades
```

### 2.4 Score do Consultor (insumo da deliberação — M8)

A deliberação confronta **três** objetos, não dois: **plano** (o combinado da §2.2), **trajetória** (o percorrido, do Newcon/Data Lake via linha do tempo `S-PROD-2`) e **score** (o critério do aprovador). O score é entrada distinta e deve ser exibido lado a lado com plano e trajetória na tela de deliberação.

---

## 3. Etapas (colunas do Kanban)

Duas peças **precedem** o card e o alimentam (M8): o **Plano de Carreira registrado** (P1, pré-requisito por loja) e o **Acompanhamento contínuo** (P2, elegibilidade visível *antes* do pedido — driver de origem do projeto). O card em si tem **6 etapas**; as três primeiras correm por evento, a efetivação obedece à janela mensal.

### 3.0 Pré-esteira (M8, contínuo)

| Peça | Papel | Solução |
|---|---|---|
| **Plano de Carreira** | Loja registra marcos, prazos e critérios por consultor | M8 `S1` |
| **Acompanhamento** | Compara trajetória (Newcon) × plano e sinaliza quem está perto de bater critérios | M8 `S-PROD-2`/`S-PROD-3` |

### 3.1 Tabela-resumo das etapas do card

| Ordem | EtapaId | Nome | Responsável | Relógio | Gatilho | Critério p/ avançar | Solução |
|:-:|---|---|---|:-:|---|---|:-:|
| 1 | `SOLICITACAO` | Solicitação de promoção | Gestor da unidade (dono em cópia) | evento | Acordo das partes | Dados obrigatórios completos | `S-PROC-1` |
| 2 | `VALIDACAO` | Validação: plano × trajetória × score | Gerente de BU + Gestor | evento | Solicitação recebida | Critérios do nível-alvo atendidos | M8 |
| 3 | `ESTRUTURA_PV` | Estrutura de PV na origem | Loja (assistida) + Back-office | evento | Critérios validados | Categoria por matrícula declarada e coerente | `S-PROC-3` |
| 4 | `DELIBERACAO` | Deliberação / aprovação | Autoridade por nível (§3.3) | evento | Estrutura declarada | Decisão = aprovado, c/ justificativa | AS-IS 7.3 |
| 5 | `EFETIVACAO` | Escrita governada + janela mensal | Comissões + TI | **janela** | Promoção aprovada | Gravação válida (`S-SIS-2`) + aditivo | `S-SIS-2` |
| 6 | `VIGENTE` | Nova categoria vigente | — | — | Efetivada na janela | Etapa final | — |

### 3.2 Detalhe por etapa

#### Etapa 1 — `SOLICITACAO`  (`S-PROC-1`, evento)
```yaml
responsavel: "Gestor da unidade (dono da loja sempre em cópia)"
gatilho: "Acordo das partes / demanda da loja, a qualquer momento"
sla_dias: 3
campos_obrigatorios: [consultor_id, razao_social, matricula, percentual_atual, nivel_alvo, tera_equipe_abaixo, tipo_movimento]
canais_reais: [whatsapp, telefone, visita, email]   # e-mail costuma ser o fim, não o começo
acoes: [criar, editar, enviar_para_analise]
criterio_avanco: "Dados obrigatórios completos"
dor_atual: "E-mail a licenciamento@; zero volumetria, sem SLA, sem esteira"
```

#### Etapa 2 — `VALIDACAO` (M8, evento)
```yaml
responsavel: "Gerente de BU + Gestor da unidade"
confronta: [plano_carreira, trajetoria_newcon, score_consultor]   # três objetos
pilares: [tempo_de_casa, pessoas_desenvolvidas, volume_de_vendas, retencao, estrutura_de_equipe]
sla_dias: 5
acoes: [comparar_plano_trajetoria_score, aprovar_elegibilidade, reprovar, solicitar_evidencia]
criterio_avanco: "Todos os critérios do nível-alvo do plano da loja = atendido"
principio: "Elegibilidade deveria estar visível ANTES do pedido (Acompanhamento, §3.0)"
```

#### Etapa 3 — `ESTRUTURA_PV` (`S-PROC-3`, evento — captura na origem)
```yaml
responsavel: "Loja declara (assistida) + Back-office"
natureza: "Assistiva — reprova e ASSISTE; não é bloqueio garantido (isso é S-SIS-2)"
captura: "CATEGORIA por matrícula (nunca fração digitada) — ADR-19-02"
sla_dias: 5
acoes: [declarar_categoria_por_matricula, validar_coerencia, encaminhar_apoio]
criterio_avanco: "Toda matrícula da cadeia tem categoria declarada e a cadeia deriva coerente"
gargalo_conhecido: "Lojas não sabem informar a estrutura -> hoje gera ligações e retrabalho"
exemplo: "Promoção a 2,2%: diferença até 3,5% = 1,3 -> a loja informa QUEM recebe o residual (por categoria)"
```

#### Etapa 4 — `DELIBERACAO` (AS-IS 7.3, evento)
```yaml
responsavel: "Autoridade conforme nível-alvo (§3.3)"
clock: por_evento     # NUNCA usar a janela mensal aqui
pontos_decisao: ["Há acordo?", "O comitê aprova?", "É promoção ou troca de contrato?"]
campos_obrigatorios: [decisao, justificativa, autoridade_aprovadora, data_deliberacao, score_consultor]
acoes: [deliberar, aprovar, reprovar, solicitar_ajuste]
ramificacoes:
  aprovado: "-> EFETIVACAO"
  reprovado: "status=reprovado; registrar BANDEIRA DE CONFLITO (AS-IS 7.5)"
  ajuste: "-> VALIDACAO ou ESTRUTURA_PV"
auditoria: "Registrar autoria; exibir conflito de interesse quando aprovador for Master com unidade própria"
```

#### Etapa 5 — `EFETIVACAO` (`S-SIS-2`, janela mensal)
```yaml
responsavel: "Comissões (configura) + TI (escreve)"
clock: janela_mensal
regra_janela: "Solicitação até dia 13 -> vigência dia 21 do mesmo mês; após, dia 21 do mês seguinte"
grava_via: "S-SIS-2 (caminho único governado; Newcon nunca tocado direto)"
validacoes_de_escrita: [codigo_valido, monotonicidade_cadeia, dentro_da_janela]
efeito_reprovacao: "Cadeia não monotônica ou código inválido -> recusa motivada; pedido NÃO submetido"
campos_obrigatorios: [janela_efetivacao, gravacao_sis2_ok, autoria_registrada, aditivo_assinado]
saida: "Percentual e hierarquia vigentes; nova equipe se houver; contrato aditivo"
```

#### Etapa 6 — `VIGENTE`
```yaml
gatilho: "Efetivada na janela"
efeitos:
  - "Trajetória do consultor atualizada e comparável ao plano (M8)"
  - "Evento gravado na linha do tempo (M2) e na trilha de auditoria de comissão (M3)"
acoes: [encerrar_card, reabrir_ciclo_carreira]
```

### 3.3 Autoridade de aprovação por nível-alvo

| Nível-alvo | Autoridade | Fonte |
|---|---|---|
| Autorizado I / II / III | Gerente de BU + Gestor da unidade | AS-IS 7.3 |
| Entrada na faixa de Licenciado (Licenciado I) | Entrevista com Vice-Presidência e CEO | Blueprint (a validar mapeamento) |
| Licenciado II | Comitê dos 3 Masters | AS-IS 7.3 |
| Licenciado Lojista (Sócio de Loja) | Convite do licenciado lojista + ser dono de loja | Pol. 01 / §2.3 |

> ⚠️ As autoridades vêm do discovery com percentuais do **modelo antigo** ("de 2,7 para 3,0 pelo Comitê dos 3 Masters"; "a licenciado passa por entrevista com VP e CEO"). O mapeamento exato para os níveis novos é **proposto — a validar** com Comissões/Back-office.

### 3.4 Ramo de convite (Sócio de Loja)

`tipo_movimento = convite_socio` pula `VALIDACAO` e a validação métrica de `ESTRUTURA_PV`:
```
SOLICITACAO(convite) -> DELIBERACAO(permanência ou nova unidade) -> EFETIVACAO -> VIGENTE
```
Equipe e carteira ficam na unidade de origem. "Abertura de nova unidade" **dispara o processo de Abertura de Unidades** (spec correlato). Requer ser dono de loja (Pol. 01).

---

## 4. Formulário de cadastro

Organizado por etapa. Tipos: `text` · `textarea` · `number` · `currency` · `percent` · `date` · `select` · `multiselect` · `radio` · `checkbox` · `file` · `ref` · `readonly` · `repeater`.

### 4.1 Bloco A — Solicitação (`SOLICITACAO`)

| Label | Chave | Tipo | Obrig. | Validação / Opções |
|---|---|---|:-:|---|
| Consultor | `consultor_id` | `ref(Consultor)` | Sim | Matrícula no Newcon |
| Razão social | `razao_social` | `text` | Sim | |
| Matrícula | `matricula` | `text` | Sim | Chave no Newcon |
| Nível atual | `nivel_atual` | `select` | Sim | Enum `NivelId` |
| Nível-alvo | `nivel_alvo` | `readonly` | Auto | Nível imediatamente acima |
| Tipo de movimento | `tipo_movimento` | `radio` | Sim | `promocao` · `troca_de_contrato` · `convite_socio` |
| Percentual (categoria) atual | `percentual_atual` | `select` | Sim | Categoria da cadeia (§2.1) |
| Haverá equipe abaixo? | `tera_equipe_abaixo` | `radio` | Sim | `sim` · `nao` |
| Canal de origem | `canal_origem` | `select` | Sim | `whatsapp` · `telefone` · `visita` · `email` · `sistema` |
| Dono da loja em cópia | `dono_em_copia` | `ref(Licenciado)` | Sim | Regra: dono sempre ciente |

### 4.2 Bloco B — Validação: plano × trajetória × score (`VALIDACAO`)

Campos **dinâmicos** conforme o `nivel_alvo` do **plano vigente da loja** (§2.2).

| Label | Chave | Tipo | Obrig. | Validação |
|---|---|---|:-:|---|
| Tempo de casa | `tempo_casa_meses` | `number` | Sim | Newcon |
| Volume de vendas (mês) | `volume_vendas_mensal` | `currency` | Sim | ≥ meta do plano |
| Volume do time (mês) | `volume_time_mensal` | `currency` | Cond. | Níveis com meta de time |
| Retenção | `retencao_percentual` | `percent` | Sim | ≥ meta do plano (SAF: 95%) |
| Indicações ativadas | `indicacoes_ativadas` | `number` | Cond. | Ex.: Autorizado II ≥ 3 |
| Consultores Aut. I / II / III | `qtd_autorizado_i/ii/iii` | `number` | Cond. | Conforme plano |
| **Score do consultor** | `score_consultor` | `readonly` | Auto | Insumo M8 (§2.4) |
| Trajetória (linha do tempo) | `trajetoria_ref` | `readonly` | Auto | `S-PROD-2` |
| Evidências de produção | `evidencias_producao` | `file[]` | Não | Newcon / Data Lake |
| Resultado da checagem | `criterios_checados` | `checklist` | Sim | Por critério: `atende`·`nao_atende` |

### 4.3 Bloco C — Estrutura de PV na origem (`ESTRUTURA_PV`)

| Label | Chave | Tipo | Obrig. | Validação |
|---|---|---|:-:|---|
| Cadeia do PV (categoria por matrícula) | `cadeia_pv` | `repeater` | Sim | Itens: `{ matricula, categoria }` — **categoria, não fração** |
| Distribuição derivada | `distribuicao_derivada` | `readonly` | Auto | Frações calculadas por subtração |
| Monotonicidade | `monotonicidade_ok` | `readonly` | Auto | Todo nível ≥ o de baixo |
| Encaminhado a apoio? | `apoio_solicitado` | `checkbox` | Não | Fluxo assistido (`S-PROC-3`) |

### 4.4 Bloco D — Deliberação (`DELIBERACAO`)

| Label | Chave | Tipo | Obrig. | Validação |
|---|---|---|:-:|---|
| Autoridade aprovadora | `autoridade_aprovadora` | `select` | Sim | Roteada por nível (§3.3) |
| Data da deliberação | `data_deliberacao` | `date` | Sim | Relógio de evento |
| É promoção ou troca de contrato? | `natureza_movimento` | `radio` | Sim | `promocao` · `troca_de_contrato` |
| Decisão | `decisao` | `radio` | Sim | `aprovado`·`reprovado`·`ajuste` |
| Justificativa | `justificativa` | `textarea` | Sim | **Rastro obrigatório** |

### 4.5 Bloco E — Efetivação (`EFETIVACAO`)

| Label | Chave | Tipo | Obrig. | Validação |
|---|---|---|:-:|---|
| Janela de efetivação | `janela_efetivacao` | `readonly` | Auto | Regra dia 13/21 |
| Gravação `S-SIS-2` OK | `gravacao_sis2_ok` | `readonly` | Auto | Código + monotonicidade + janela |
| Autoria registrada | `autoria_registrada` | `readonly` | Auto | Quem solicitou/aprovou/gravou |
| Contrato aditivo | `aditivo_assinado` | `file` | Sim | PDF assinado |
| Data de vigência | `data_vigencia` | `date` | Auto | Dia 21 da janela |

---

## 5. Regras de negócio (validações)

| # | Regra | Aplicação | Fonte |
|---|---|---|---|
| RN1 | Promoção exige acordo das partes, dono da loja em cópia | `SOLICITACAO` | AS-IS 7.3 |
| RN2 | Nível-alvo = imediatamente superior ao atual | `SOLICITACAO` | — |
| RN3 | Validar contra o **plano de carreira vigente da loja** (não régua global) | `VALIDACAO` | M8 |
| RN4 | Deliberação confronta **plano × trajetória × score** | `VALIDACAO`/`DELIBERACAO` | M8 |
| RN5 | Prévia→Autorizado I: não atingiu meta trimestral → avaliar +30 dias | `VALIDACAO` | Plano SAF |
| RN6 | Estrutura de PV capturada por **categoria por matrícula**, nunca fração | `ESTRUTURA_PV` | ADR-19-02 |
| RN7 | Cadeia **monotônica** (todo nível ≥ o de baixo); diferencial negativo é impossível de gravar | `ESTRUTURA_PV`/`EFETIVACAO` | M3 §10 |
| RN8 | Teto **3,5% por PV imutável**; distribuição por subtração; só chega a 3,5% sendo dono de loja | `ESTRUTURA_PV`/`EFETIVACAO` | Pol. 01 |
| RN9 | Deliberação exige decisão + **justificativa** e distingue promoção × troca de contrato | `DELIBERACAO` | AS-IS 7.3 |
| RN10 | **Dois relógios:** deliberação por evento; efetivação na janela (dia 13→21) | `DELIBERACAO`/`EFETIVACAO` | §0.9 c1 |
| RN11 | Escrita **exclusiva por `S-SIS-2`**; Newcon nunca tocado direto (G1) | `EFETIVACAO` | Guardrail G1 |
| RN12 | Promoção negada a quem cumpriu o plano → registrar **bandeira de conflito** | `DELIBERACAO` (reprovado) | AS-IS 7.5 |
| RN13 | Autoridade varia por nível (Gerente BU / VP+CEO / Comitê 3 Masters / Convite) | `DELIBERACAO` | AS-IS 7.3 |
| RN14 | Sócio de Loja é por convite (não métrica); equipe e carteira ficam na origem | Ramo convite | §2.3 |

> ⚠️ **Governança a exibir (não bloqueia):** quando o aprovador for Master com unidade própria, sinalizar o conflito de interesse estrutural na trilha da deliberação.

---

## 6. Enums de referência

```ts
enum NivelId {
  PREVIA, AUTORIZADO_I, AUTORIZADO_II, AUTORIZADO_III,
  LICENCIADO_I, LICENCIADO_II, LICENCIADO_LOJISTA,
  DIRETOR_REGIONAL, DIRETOR_MASTER,
}
enum EtapaId {
  SOLICITACAO, VALIDACAO, ESTRUTURA_PV, DELIBERACAO, EFETIVACAO, VIGENTE,
}
enum StatusCard { ativo, bloqueado, aprovado, reprovado, vigente, cancelado }
enum TipoMovimento { promocao, troca_de_contrato, convite_socio }
enum DecisaoDeliberacao { aprovado, reprovado, ajuste }
```

---

## 7. Programa correlato — Bônus ANJO

Não é promoção; usa consultor + prévia ativada. Modelar à parte, referenciável pelo card.

```yaml
programa: "ANJO — Premiação Bônus"
gatilho: "Autorizado I traz nova prévia e ela é ativada"
beneficio: "0,20% do valor comercializado nos primeiros 3 meses"
repasse: "Supervisor direto da prévia"
```

---

## 8. Observações para o desenvolvimento

- **Plano de carreira como entidade versionada por loja** (§2.2). O motor de validação lê o plano vigente da loja do consultor — nunca constantes de sistema.
- **Categoria, não fração** (RN6/ADR-19-02): o `repeater` da cadeia captura `{matricula, categoria}`; a fração é derivada por subtração. Torna "soma errada" irrepresentável.
- **Dois relógios** (RN10): persista `data_deliberacao` (evento) e `janela_efetivacao`/`data_vigencia` (calendário) separadamente; não derive um do outro.
- **Escrita governada** (RN11): a etapa de efetivação **não escreve no Newcon** — emite o pedido para `S-SIS-2`, que valida código/monotonicidade/janela e grava com autoria. A UI reflete o resultado.
- **Score como insumo distinto** (§2.4): trazer o score do consultor para a tela de deliberação, ao lado de plano e trajetória.
- **Acompanhamento proativo** (§3.0): implementar o painel que compara trajetória (Newcon) × plano e sinaliza quem está perto dos critérios — é o driver de origem do projeto (demanda da VP).
- **Bandeira de conflito** (RN12): ao reprovar quem cumpriu o plano, gerar registro consultável ("por que não fui promovido?").
- **Ramo de convite** (§3.4): desvia o fluxo; se "abrir nova unidade", dispara o processo de Abertura.

### Itens a validar (lacunas/decisões do discovery, não do dev)
- Mapeamento das autoridades de aprovação para os níveis novos (percentuais citados eram do modelo antigo).
- Requisitos de Diretor Regional e Diretor Master (ausentes nos documentos; fora da cadeia de PV).
- Se "custo de loja" (SAF) é gate de promoção ou encargo pós-promoção.
- Reconhecer o conflito de interesse do Comitê de Masters (registrado, não resolvido no discovery).

---

*Fontes: AS-IS Ademicon §3.4.4 e jornadas 7.1–7.5; Blueprint M3 (Pol. 01, régua de comissão; `S-SIS-2`), M4 (`S-PROC-1`, `S-PROC-3`) e M8 (plano de carreira, linha do tempo, score); Plano de Desenvolvimento — Grupo SAF (2026), tratado como instância de plano de carreira de loja.*
