# Ajustes — Esteira de Abertura de Unidades

> Documento de apoio para uma próxima rodada de implementação — **descreve o que precisa mudar**, não o que já foi feito. Origem: conferência do Kanban de Abertura de Unidades (`src/lib/mock-data/esteira-abertura-unidades.ts` + páginas em `src/pages/AberturaUnidades*`/`NovoRegistroAberturaPage.tsx`) contra o relato do processo real (AS-IS) feito pelo usuário em 2026-07-26, que é mais preciso em alguns pontos do que `PRD/abertura_unidades_kanban_spec.md` (documento original usado para construir a feature). Antes de mexer no código da esteira de Abertura de Unidades, ler este arquivo além do spec original.

---

## 1. Solicitação — distinguir "dono" de "autorizado" e checar categoria 2,7%+

**Situação hoje:** a etapa `SOLICITACAO` e o formulário "Adicionar registro" (`NovoRegistroAberturaPage.tsx`) só pedem o nome do licenciado solicitante, texto livre. Não existe nenhum campo que marque se quem está solicitando é o **dono** da loja de origem ou um **autorizado**, nem a **categoria de comissão** do licenciado (2,5% / 2,7%+).

**Processo real:** só o licenciado **dono** da loja, preferencialmente já na categoria **2,7%+**, pode solicitar abertura — pedido feito por um autorizado não é considerado.

**Ajuste necessário:**
- Novo campo no Bloco A (Solicitação): `ehDono: boolean` (ou equivalente) e `categoriaLicenciado: "2.5%" | "2.7%+"`.
- Regra de validação/alerta: se `ehDono = false`, o registro não deveria avançar (hoje nada bloqueia isso).
- Refletir esses dois dados no formulário de "Adicionar registro" e na página de detalhe (Bloco 1).

---

## 2. Checklist documental incompleto (Bloco E — Documentação)

**Situação hoje:** `CHECKLIST_PADRAO` em `esteira-abertura-unidades.ts` tem 4 itens: "Documento de identidade do responsável", "Comprovante de endereço", "Contrato social da PJ", "Comprovantes de conformidade contratual". `CONTRATO` (Bloco F) tem `banco`/`agencia`/`conta`/`aceitePenalty`, sem um campo específico de "conta PJ".

**Processo real:** após aprovação em comitê, são reunidos **contrato de locação**, **conta PJ**, **contrato social** e **dados bancários**.

**Ajuste necessário:**
- Adicionar **"Contrato de locação"** ao `CHECKLIST_PADRAO` (ou a um checklist específico da etapa, se fizer sentido separar do checklist de identificação pessoal).
- Adicionar um campo explícito de **conta PJ** (hoje só existe banco/agência/conta genéricos) — decidir se é um campo novo em `CONTRATO` ou se os campos atuais já bastam e só falta renomear/deixar claro que são da conta PJ.

---

## 3. Etapa/ator "Comissões" e cadastro no Newcon — ausente

**Situação hoje:** não existe nenhuma etapa, ator ou campo relacionado a "Comissões" ou ao sistema **Newcon** em `ETAPAS_ABERTURA` nem em `RegistroAberturaUnidade`. A etapa final `ABERTURA` só tem `emailCorporativoCriado`, `publicacaoSite`, `metaDefinida`, `territorioBloqueado`.

**Processo real:** depois do contrato/documentação, o processo passa para a área de **Comissões**, que cadastra o PV no **Newcon** como tipo **"00 — PV de venda"**.

**Ajuste necessário (a decidir com o usuário antes de implementar):**
- **Opção A:** criar uma 9ª etapa `COMISSOES` entre `CONTRATO` e `OBRA` (ou entre `OBRA` e `ABERTURA` — depende se o cadastro no Newcon acontece antes ou em paralelo à obra física; ver item 4).
- **Opção B:** manter as 8 etapas e adicionar campos de "cadastro no Newcon" dentro de uma etapa já existente (`CONTRATO` ou `ABERTURA`).
- Campos mínimos, em qualquer opção: `cadastradoNewcon: boolean`, `tipoPVNewcon` (fixo "00 — PV de venda" ou enum se houver outros tipos), `dataCadastroNewcon`, responsável = "Comissões".
- Impacto: mexe em `ETAPAS_ABERTURA`, no gerador `gerarRegistro`, na página de detalhe (novo bloco) e possivelmente na tela de configuração de etapas (`EtapasAberturaConfigPage.tsx`).

---

## 4. Prazo divergente — 90 dias vs. 180 dias (Obra)

**Situação hoje:** `ETAPAS_ABERTURA` define `slaDias: 180` para `OBRA` (baseado no spec original: "150–210 dias" / "≈ 6 meses do comitê à abertura física").

**Processo real (relato do usuário):** "prazo de referência de aproximadamente 8 meses até a conclusão da obra e **até 90 dias entre comitê e abertura do PV**".

**Pendência — perguntar ao usuário antes de ajustar:** os 90 dias citados são...
- (a) o mesmo intervalo hoje modelado como `slaDias: 180` de `OBRA` (ou seja, o dado atual estaria **errado** e devia cair para ~90 dias), **ou**
- (b) um sub-prazo diferente — por exemplo, o tempo entre a aprovação em comitê e a **abertura administrativa do PV** (cadastro no Newcon, ver item 3), que rodaria **em paralelo** à obra física de ~8 meses, não em série.

Sem essa resposta, não dá para saber se o ajuste é só trocar um número (`slaDias: 180` → `90`) ou se é preciso modelar dois prazos paralelos distintos (obra física vs. abertura administrativa do PV).

---

## Fora de escopo deste documento

O segundo processo relatado pelo usuário na mesma conversa (critérios de carreira por loja, pedido para `licenciamento@ademicon.com.br`, back-office redistribuindo comissão do PV mantendo a soma em 3,5%, aditivo contratual, Comissões criando/ajustando o PV no Newcon + liberando acesso de gestor no AVA Pro, corte de alterações no dia 13 com vigência no dia 21, e promoção a licenciado 2,7%+ com entrevista VP/CEO) **não é sobre Abertura de Unidades** — é o processo real da futura esteira **Promoção de Consultores** (`/esteira/promocao-consultores`, hoje só um placeholder). Deve virar a base de um PRD/spec próprio quando esse módulo for construído (ver nota em `MEMORY.md` sobre reaproveitamento entre as duas esteiras).

---

## Ordem sugerida de implementação

1. Esclarecer a pendência do item 4 (prazo) com o usuário — desbloqueia decisões de modelagem dos itens 3 e 4 juntos.
2. Item 1 (dono/autorizado + categoria) — mudança pequena e isolada no Bloco A.
3. Item 2 (checklist + conta PJ) — mudança pequena e isolada no Bloco E/F.
4. Item 3 (etapa/ator Comissões + Newcon) — mudança maior, mexe em etapas, gerador de mock, página de detalhe e possivelmente a tela de config de etapas.
