# Abertura de Unidades — Especificação para Kanban

> Documento técnico de apoio ao desenvolvimento de uma página Kanban onde o usuário cria um registro (card) de solicitação de abertura de unidade e o avança pelas etapas do processo.
>
> Fonte: diagnóstico AS-IS Ademicon (§3.4.2) e Blueprint de Transformação (processo 5.2 · `S-PROC-1`).

---

## 1. Modelo de dados (card)

Cada card do Kanban representa **uma solicitação de abertura de unidade**. Ele carrega os campos do formulário (Seção 3) e trafega pelas colunas/etapas (Seção 2).

### Metadados do card

| Campo | Chave | Tipo | Obrigatório | Observações |
|---|---|---|---|---|
| ID do registro | `id` | `uuid` | auto | Gerado na criação |
| Etapa atual | `etapa_atual` | `enum(EtapaId)` | auto | Ver Seção 2 |
| Status do card | `status` | `enum` | auto | `ativo` · `bloqueado` · `aprovado` · `reprovado` · `concluido` · `cancelado` |
| Data de criação | `created_at` | `datetime` | auto | |
| Última atualização | `updated_at` | `datetime` | auto | |
| Responsável atual | `responsavel_atual` | `ref(Usuario)` | auto | Derivado da etapa |
| Prazo da etapa (SLA) | `prazo_etapa` | `datetime` | auto | Calculado ao entrar na etapa |
| Sinalizador de atraso | `em_atraso` | `boolean` | auto | `true` quando `now > prazo_etapa` |
| Histórico de etapas | `historico[]` | `array<LogEtapa>` | auto | Ver abaixo |

### LogEtapa (item do histórico)

| Campo | Tipo | Observações |
|---|---|---|
| `etapa` | `enum(EtapaId)` | |
| `entrou_em` | `datetime` | |
| `saiu_em` | `datetime \| null` | |
| `responsavel` | `ref(Usuario)` | |
| `decisao` | `string \| null` | Ex.: aprovado, reprovado, retificar |
| `observacao` | `text \| null` | |

---

## 2. Etapas (colunas do Kanban)

O processo tem **8 etapas sequenciais**. A ordem é fixa; o avanço de uma para a próxima só é permitido quando o `criterio_avanco` da etapa é satisfeito.

### 2.1 Tabela-resumo

| Ordem | EtapaId | Nome | Responsável | SLA sugerido | Gatilho de entrada | Critério para avançar |
|:-:|---|---|---|:-:|---|---|
| 1 | `SOLICITACAO` | Solicitação de abertura | Licenciado solicitante | 3 dias | Card criado | Formulário base preenchido |
| 2 | `ELEGIBILIDADE` | Filtro de elegibilidade | Gerente regional | 5 dias | Solicitação recebida | Critérios de elegibilidade validados |
| 3 | `PLANO_NEGOCIO` | Plano de negócio | Gerente regional | 15 dias | Elegibilidade aprovada | Plano anexado e completo |
| 4 | `COMITE` | Comitê de expansão | Comitê (gerente + diretor + diretoria master) | 15 dias | Plano submetido | Decisão do comitê registrada (com scoring) |
| 5 | `DOCUMENTACAO` | Aprovação e coleta de documentos | Gerente regional + back-office | 20 dias | Aprovado em comitê | Checklist documental 100% recebido |
| 6 | `CONTRATO` | Contrato e dados bancários | Jurídico + licenciado | 20 dias | Documentos completos | Contrato assinado + dados bancários validados |
| 7 | `OBRA` | Planejamento e execução da obra | Licenciado + equipe de obra | 90 dias | Contrato assinado | Obra concluída e vistoriada |
| 8 | `ABERTURA` | Abertura e funcionamento | Licenciado / back-office | — | Obra concluída | Unidade ativada no sistema |

> **Prazo total de referência:** ≈ 8 meses (solicitação → funcionamento); **≈ 90 dias** da aprovação em comitê à abertura do PV (prazo administrativo). Os SLAs por etapa acima são confirmados na implementação.

### 2.2 Detalhe por etapa

Cada etapa é um objeto com as propriedades abaixo (útil para modelar a config das colunas).

#### Etapa 1 — `SOLICITACAO`
```yaml
id: SOLICITACAO
nome: "Solicitação de abertura"
ordem: 1
responsavel: "Licenciado solicitante"
gatilho: "Licenciado manifesta interesse em expandir"
resultado: "Solicitação registrada e enfileirada"
sla_dias: 3
campos_obrigatorios: [licenciado_id, loja_origem, cidade_alvo, uf, canal_origem]
acoes: [criar, editar, enviar_para_analise]
criterio_avanco: "Todos os campos base preenchidos e válidos"
dor_atual: "Hoje é só um e-mail ao gerente; sem fila visível, depende do relacionamento"
```

#### Etapa 2 — `ELEGIBILIDADE`
```yaml
id: ELEGIBILIDADE
nome: "Filtro de elegibilidade"
ordem: 2
responsavel: "Gerente regional"
gatilho: "Solicitação recebida"
resultado: "Solicitação elegível ou reprovada na triagem"
sla_dias: 5
campos_obrigatorios: [desempenho_percentual, conformidade_contratual, cidade_disponivel]
acoes: [validar, aprovar_elegibilidade, reprovar]
criterio_avanco: "Desempenho comprovado + conformidade contratual + cidade disponível"
regras: 
  - "Apenas licenciado dono de loja em conformidade contratual"
  - "Desempenho comprovado (referência: >= 2,7%)"
  - "Cidade de residência determina atuação"
```

#### Etapa 3 — `PLANO_NEGOCIO`
```yaml
id: PLANO_NEGOCIO
nome: "Plano de negócio"
ordem: 3
responsavel: "Gerente regional"
gatilho: "Elegibilidade aprovada"
resultado: "Plano de negócio pronto para o comitê"
sla_dias: 15
campos_obrigatorios: [plano_negocio_arquivo, projecao_faturamento, perfil_cidade]
acoes: [anexar_plano, editar, submeter_ao_comite]
criterio_avanco: "Plano completo e anexado"
```

#### Etapa 4 — `COMITE`
```yaml
id: COMITE
nome: "Comitê de expansão"
ordem: 4
responsavel: "Comitê (gerente + diretor regional + diretoria master)"
gatilho: "Plano submetido"
resultado: "Decisão de aprovação/reprovação com scoring registrado"
sla_dias: 15
campos_obrigatorios: [data_reuniao_comite, decisao_comite, score_comite]
acoes: [registrar_reuniao, aprovar, reprovar, solicitar_ajuste]
criterio_avanco: "Decisão = aprovado"
melhoria_prevista: "Scoring padronizado registrado (hoje critérios subjetivos, sem score)"
ramificacoes:
  aprovado: "-> DOCUMENTACAO"
  reprovado: "status = reprovado (card encerrado)"
  ajuste: "-> PLANO_NEGOCIO"
```

#### Etapa 5 — `DOCUMENTACAO`
```yaml
id: DOCUMENTACAO
nome: "Aprovação e coleta de documentos"
ordem: 5
responsavel: "Gerente regional + Back-office"
gatilho: "Aprovado em comitê"
resultado: "Checklist documental completo"
sla_dias: 20
campos_obrigatorios: [checklist_documentos]
acoes: [enviar_checklist, receber_documento, validar_documento]
criterio_avanco: "Todos os itens do checklist recebidos e válidos"
dor_atual: "E-mail com checklist; sem controle de prazo; documentos chegam fragmentados"
```

#### Etapa 6 — `CONTRATO`
```yaml
id: CONTRATO
nome: "Contrato e dados bancários"
ordem: 6
responsavel: "Jurídico + Licenciado"
gatilho: "Documentos completos"
resultado: "Contrato assinado e dados bancários registrados"
sla_dias: 20
campos_obrigatorios: [contrato_assinado, dados_bancarios, aceite_penalty]
acoes: [gerar_contrato, coletar_assinatura, validar_dados_bancarios]
criterio_avanco: "Contrato assinado + dados bancários validados"
sistema_externo: "Projuris"
dor_atual: "Demora por idas e vindas de documentos"
```

#### Etapa 7 — `OBRA`
```yaml
id: OBRA
nome: "Planejamento e execução da obra"
ordem: 7
responsavel: "Licenciado + equipe de obra"
gatilho: "Contrato assinado"
resultado: "Ponto de venda físico pronto"
sla_dias: 90   # ≈ 3 meses — prazo administrativo da aprovação em comitê à abertura do PV
campos_obrigatorios: [prazo_previsto_obra, data_inicio_obra]
campos_opcionais: [data_conclusao_obra, extrapolacao_prazo, motivo_extrapolacao]
acoes: [registrar_inicio, atualizar_andamento, registrar_extrapolacao, concluir_obra]
criterio_avanco: "Obra concluída e vistoriada"
regras:
  - "Extrapolação de prazo deveria cancelar o processo (na prática há flexibilidade — registrar como objeto)"
  - "Lojas que atrasam perdem posição no ranking e campanhas"
dor_atual: "Processo externo; obra frequentemente atrasa; sem notificação automática de vencimento"
```

#### Etapa 8 — `ABERTURA`
```yaml
id: ABERTURA
nome: "Abertura e funcionamento"
ordem: 8
responsavel: "Licenciado / Back-office"
gatilho: "Obra concluída"
resultado: "Unidade ativa; território consolidado"
sla_dias: null
campos_obrigatorios: [data_abertura, email_corporativo_criado, publicacao_site, meta_definida]
acoes: [ativar_unidade, credenciar_primeiros_consultores]
criterio_avanco: "Unidade ativada (etapa final)"
efeitos_colaterais:
  - "Território bloqueado para prévias de outras cidades na localidade"
  - "Consultores existentes migram com penalty ou permanecem"
  - "Disparo de ações paralelas: marketing, e-mail, meta, publicação no site"
```

---

## 3. Formulário de cadastro

Formulário único do card, **organizado por etapa de preenchimento**. Cada campo traz `tipo de input`, obrigatoriedade, validação e a etapa em que é preenchido/editável.

> Legenda de tipos: `text` · `textarea` · `number` · `currency` · `percent` · `date` · `datetime` · `select` · `multiselect` · `radio` · `checkbox` · `file` · `ref` (relacionamento) · `readonly` (auto).

### 3.1 Bloco A — Solicitação (Etapa `SOLICITACAO`)

| Label | Chave | Tipo de input | Obrigatório | Validação / Opções |
|---|---|---|:-:|---|
| Licenciado solicitante | `licenciado_id` | `ref(Licenciado)` | Sim | Deve ser licenciado ativo |
| É dono da loja de origem | `eh_dono` | `boolean` (toggle) | Sim | Apenas donos podem solicitar — alertar se `false` |
| Categoria de comissão | `categoria_licenciado` | `select` | Sim | `2.5%` · `2.7%+` |
| Loja de origem | `loja_origem` | `select` | Sim | Lista de lojas do licenciado |
| Cidade-alvo | `cidade_alvo` | `text` | Sim | Máx. 120 caracteres |
| UF | `uf` | `select` | Sim | 27 UFs |
| Canal de origem da solicitação | `canal_origem` | `select` | Sim | `email` · `whatsapp` · `telefone` · `visita` · `sistema` |
| Data da solicitação | `data_solicitacao` | `date` | Auto | Preenchida na criação |
| Observações iniciais | `observacoes_iniciais` | `textarea` | Não | Máx. 1000 caracteres |

### 3.2 Bloco B — Elegibilidade (Etapa `ELEGIBILIDADE`)

| Label | Chave | Tipo de input | Obrigatório | Validação / Opções |
|---|---|---|:-:|---|
| Desempenho comprovado | `desempenho_percentual` | `percent` | Sim | Referência mínima: 2,7% |
| Conformidade contratual | `conformidade_contratual` | `checkbox` | Sim | Deve ser `true` para avançar |
| Cidade disponível (sem bloqueio) | `cidade_disponivel` | `radio` | Sim | `sim` · `nao` |
| Parecer de elegibilidade | `parecer_elegibilidade` | `textarea` | Não | Justificativa da triagem |

### 3.3 Bloco C — Plano de negócio (Etapa `PLANO_NEGOCIO`)

| Label | Chave | Tipo de input | Obrigatório | Validação / Opções |
|---|---|---|:-:|---|
| Plano de negócio (arquivo) | `plano_negocio_arquivo` | `file` | Sim | PDF/DOCX, máx. 20 MB |
| Projeção de faturamento | `projecao_faturamento` | `currency` | Sim | > 0 |
| Perfil da cidade / mercado | `perfil_cidade` | `textarea` | Sim | |
| Número estimado de pessoas/equipe | `equipe_estimada` | `number` | Não | Inteiro ≥ 0 |

### 3.4 Bloco D — Comitê de expansão (Etapa `COMITE`)

| Label | Chave | Tipo de input | Obrigatório | Validação / Opções |
|---|---|---|:-:|---|
| Data da reunião do comitê | `data_reuniao_comite` | `date` | Sim | |
| Participantes do comitê | `participantes_comite` | `multiselect` | Sim | Gerente · Diretor regional · Diretoria master |
| Score do comitê | `score_comite` | `number` | Sim | Escala 0–100 (a definir) |
| Decisão do comitê | `decisao_comite` | `radio` | Sim | `aprovado` · `reprovado` · `ajuste` |
| Justificativa da decisão | `justificativa_comite` | `textarea` | Sim | Rastro obrigatório |

### 3.5 Bloco E — Documentação (Etapa `DOCUMENTACAO`)

| Label | Chave | Tipo de input | Obrigatório | Validação / Opções |
|---|---|---|:-:|---|
| Checklist de documentos | `checklist_documentos` | `checklist` (lista de itens) | Sim | Cada item: `pendente` · `recebido` · `validado` |
| Anexos dos documentos | `documentos_anexos` | `file[]` (múltiplos) | Sim | PDF/imagem, máx. 20 MB cada |
| Data de recebimento completo | `data_docs_completos` | `date` | Auto | Preenchida quando checklist = 100% |

> Itens do checklist (confirmados): documento de identidade do responsável, comprovante de endereço, contrato social da PJ, **contrato de locação**, comprovantes de conformidade contratual.

### 3.6 Bloco F — Contrato e dados bancários (Etapa `CONTRATO`)

| Label | Chave | Tipo de input | Obrigatório | Validação / Opções |
|---|---|---|:-:|---|
| Contrato assinado | `contrato_assinado` | `file` | Sim | PDF; integração Projuris |
| Status da assinatura | `status_assinatura` | `select` | Sim | `pendente` · `em_assinatura` · `assinado` |
| Banco (Conta PJ) | `banco_pj` | `select` | Sim | Lista de bancos |
| Agência (Conta PJ) | `agencia_pj` | `text` | Sim | Numérico |
| Conta PJ | `conta_pj` | `text` | Sim | Numérico |
| Aceite da cláusula de penalty | `aceite_penalty` | `checkbox` | Sim | Penalty 0,5% à loja de origem por até 24 meses |
| Cadastrado no Newcon | `cadastrado_newcon` | `boolean` | Sim | Área de Comissões cadastra o PV no Newcon |
| Tipo PV no Newcon | `tipo_pv_newcon` | `readonly` | Auto | Fixo: "00 — PV de venda" |
| Data do cadastro no Newcon | `data_cadastro_newcon` | `date` | Condicional | Preenchida quando `cadastrado_newcon = true` |

### 3.7 Bloco G — Obra (Etapa `OBRA`)

| Label | Chave | Tipo de input | Obrigatório | Validação / Opções |
|---|---|---|:-:|---|
| Data de início da obra | `data_inicio_obra` | `date` | Sim | |
| Prazo previsto (conclusão) | `prazo_previsto_obra` | `date` | Sim | ≥ data de início |
| Andamento da obra | `andamento_obra` | `percent` | Não | 0–100% |
| Data de conclusão | `data_conclusao_obra` | `date` | Não | Preenchida ao concluir |
| Houve extrapolação de prazo? | `extrapolacao_prazo` | `radio` | Não | `sim` · `nao` |
| Motivo da extrapolação | `motivo_extrapolacao` | `textarea` | Condicional | Obrigatório se `extrapolacao_prazo = sim` |

### 3.8 Bloco H — Abertura (Etapa `ABERTURA`)

| Label | Chave | Tipo de input | Obrigatório | Validação / Opções |
|---|---|---|:-:|---|
| Data de abertura | `data_abertura` | `date` | Sim | |
| E-mail corporativo criado | `email_corporativo_criado` | `checkbox` | Sim | |
| Publicado no site | `publicacao_site` | `checkbox` | Sim | |
| Meta definida | `meta_definida` | `checkbox` | Sim | |
| Território bloqueado para prévias externas | `territorio_bloqueado` | `checkbox` | Auto | Efeito da ativação |

---

## 4. Regras de negócio (validações)

| # | Regra | Aplicação |
|---|---|---|
| RN1 | Solicitante deve ser licenciado dono de loja em conformidade contratual | Etapa `ELEGIBILIDADE` |
| RN2 | Desempenho comprovado (referência ≥ 2,7%) | Etapa `ELEGIBILIDADE` |
| RN3 | Cidade de residência do licenciado determina a área de atuação | Etapa `SOLICITACAO`/`ELEGIBILIDADE` |
| RN4 | Nova loja aberta bloqueia prévias de outras cidades na localidade | Etapa `ABERTURA` (efeito) |
| RN5 | Novos consultores da nova loja podem pagar penalty de 0,5% à loja de origem por até 24 meses | Etapa `CONTRATO` |
| RN6 | Prazo total de referência ≈ 8 meses; ≈ 90 dias do comitê à abertura | SLA global |
| RN7 | Extrapolação de prazo de obra deveria cancelar o processo (registrar como objeto; hoje há flexibilidade) | Etapa `OBRA` |
| RN8 | Lojas que atrasam a abertura perdem posição no ranking e campanhas | Etapa `OBRA`/`ABERTURA` |
| RN9 | Decisão do comitê exige score e justificativa registrados (rastro) | Etapa `COMITE` |

---

## 5. Enums de referência

```ts
enum EtapaId {
  SOLICITACAO = "SOLICITACAO",
  ELEGIBILIDADE = "ELEGIBILIDADE",
  PLANO_NEGOCIO = "PLANO_NEGOCIO",
  COMITE = "COMITE",
  DOCUMENTACAO = "DOCUMENTACAO",
  CONTRATO = "CONTRATO",
  OBRA = "OBRA",
  ABERTURA = "ABERTURA",
}

enum StatusCard {
  ATIVO = "ativo",
  BLOQUEADO = "bloqueado",
  APROVADO = "aprovado",
  REPROVADO = "reprovado",
  CONCLUIDO = "concluido",
  CANCELADO = "cancelado",
}

enum CanalOrigem {
  EMAIL = "email",
  WHATSAPP = "whatsapp",
  TELEFONE = "telefone",
  VISITA = "visita",
  SISTEMA = "sistema",
}

enum DecisaoComite {
  APROVADO = "aprovado",
  REPROVADO = "reprovado",
  AJUSTE = "ajuste",
}
```

---

## 6. Observações para o desenvolvimento

- **Campos condicionais:** `motivo_extrapolacao` só é exigido quando `extrapolacao_prazo = "sim"`. Trate a validação no front e no back.
- **Progressão controlada:** o botão "Avançar etapa" deve verificar o `criterio_avanco` da etapa atual antes de mover o card.
- **Ramificação no comitê:** `COMITE` não é linear — pode aprovar (→ `DOCUMENTACAO`), reprovar (encerra) ou pedir ajuste (→ `PLANO_NEGOCIO`).
- **SLA e alerta de atraso:** ao entrar em uma etapa, calcule `prazo_etapa = entrou_em + sla_dias`. Marque `em_atraso = true` quando estourar e escale ao responsável.
- **Checklist como sub-objeto:** `checklist_documentos` deve ser uma lista de itens com status individual, não um único booleano, para permitir controle granular.
- **Itens não confirmados no AS-IS:** o checklist documental completo, o intervalo exato dos SLAs por etapa e a escala do score do comitê não estão detalhados na fonte — marcados como "a validar no detalhamento funcional".

---

*Referências: AS-IS Ademicon §3.4.2 (Abertura de Novas Unidades) e Blueprint de Transformação — processo 5.2 e solução `S-PROC-1` (esteiras com responsável, fila e prazo).*
