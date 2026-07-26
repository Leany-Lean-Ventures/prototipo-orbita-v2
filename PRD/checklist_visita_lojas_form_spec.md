# Check List – Visita à Rede

Especificação estruturada do formulário para conversão em HTML.

---

## Cabeçalho (identificação da visita)

| Campo | Tipo (HTML) | Obrigatório | Observações |
|---|---|---|---|
| Loja | `text` | Sim | Nome/identificação da unidade visitada |
| Licenciado ou gestor | `text` | Sim | Responsável pela loja |
| Data da aplicação do checklist | `date` | Sim | Data em que a visita/checklist foi realizada |

---

## Itens a serem avaliados

Cada item segue o mesmo padrão base: um **Status** (Sim/Não), campos de **Ações** e um campo de **Observações**. Abaixo, cada item com o formato específico de resposta esperado.

### 1. Plano de carreiras

| Campo | Tipo (HTML) | Opções / Valor esperado | Obrigatório |
|---|---|---|---|
| Status | `radio` | Sim / Não | Sim |
| Formalizado para o front (e-mail)? | `radio` | Sim / Não | Sim |
| Comprovação de divulgação na loja | `file` ou `text` | Anexo/descrição da comprovação | Não |
| Observações | `textarea` | Texto livre | Não |

> **Regra de negócio:** só será considerado se enviado por e-mail em até **5 dias úteis** após a visita à loja.

### 2. Processo de contratação e periodicidade

| Campo | Tipo (HTML) | Opções / Valor esperado | Obrigatório |
|---|---|---|---|
| Status | `radio` | Sim / Não | Sim |
| Existe um processo periódico? | `radio` | Sim / Não | Sim |
| Observações | `textarea` | Texto livre | Não |

### 3. Acelerador Ademicon (candidatos recebidos)

| Campo | Tipo (HTML) | Opções / Valor esperado | Obrigatório |
|---|---|---|---|
| Status | `radio` | Sim / Não | Sim |
| Treinamento plataforma, playbook e dashboard da loja | `radio` | Sim / Não | Sim |
| Quem é o focal da loja? | `text` | Nome do responsável focal | Sim |
| Observações | `textarea` | Texto livre | Não |

### 4. Multiplicador

| Campo | Tipo (HTML) | Opções / Valor esperado | Obrigatório |
|---|---|---|---|
| Status | `radio` | Sim / Não | Sim |
| Nome do multiplicador | `text` | Nome | Sim |
| Observações | `textarea` | Texto livre | Não |

> **Orientação:** ressaltar que o multiplicador deve ser **administrativo**, não comercial.

### 5. Avaliações prévias

| Campo | Tipo (HTML) | Opções / Valor esperado | Obrigatório |
|---|---|---|---|
| Explorar o dashboard da unidade | `checkbox` | Realizado (marcado/desmarcado) | Não |
| Explorar quais candidatos estão utilizando | `textarea` | Texto livre | Não |
| Observações | `textarea` | Texto livre | Não |

> **Orientação:** ressaltar o candidato com **alta indicação e pouca conversão** dos gestores.

### 6. Devolutiva BackOffice

| Campo | Tipo (HTML) | Opções / Valor esperado | Obrigatório |
|---|---|---|---|
| Feedback informal sobre SLA de prévias e qualitativo | `textarea` | Texto livre | Não |
| Observações | `textarea` | Texto livre | Não |

> **Orientação:** explicar que a Ademicon tem o direito de não aceitar candidatos para prevenir problemas futuros, sem necessidade de informar o motivo.

### 7. Visita diretoria (Master / Regional)

| Campo | Tipo (HTML) | Opções / Valor esperado | Obrigatório |
|---|---|---|---|
| Última data | `date` | Data da última visita da diretoria | Não |
| Quem foi? | `text` | Nome do diretor/responsável | Não |
| Necessidades de treinamento a informar ao diretor | `textarea` | Texto livre | Não |
| Observações | `textarea` | Texto livre | Não |

### 8. Normativa Digital

| Campo | Tipo (HTML) | Opções / Valor esperado | Obrigatório |
|---|---|---|---|
| Conteúdo repassado com a unidade | `checkbox` / `radio` | Sim / Não | Sim |
| Observações | `textarea` | Texto livre | Não |

### 9. Avaliação 360 e premissas

| Campo | Tipo (HTML) | Opções / Valor esperado | Obrigatório |
|---|---|---|---|
| Devolutiva de rating + planos de ações | `textarea` | Texto livre | Não |
| Novas premissas e atualizações explicadas | `checkbox` / `radio` | Sim / Não | Não |
| Observações | `textarea` | Texto livre | Não |

### 10. Comunicação Visual

Coleta de fotos dos ambientes da loja. Cada ambiente deve permitir **upload de imagem(ns)**.

| Ambiente | Tipo (HTML) | Detalhe |
|---|---|---|
| Fachada | `file` (`image/*`, múltiplo) | Totem e selo |
| Recepção | `file` (`image/*`, múltiplo) | Painel, balcão e poltronas |
| Sala de atendimento | `file` (`image/*`, múltiplo) | — |
| Sala do gestor | `file` (`image/*`, múltiplo) | — |
| Sala de reunião | `file` (`image/*`, múltiplo) | — |
| Sala de treinamento | `file` (`image/*`, múltiplo) | Se houver |
| Área dos consultores | `file` (`image/*`, múltiplo) | — |
| BWC (banheiro) | `file` (`image/*`, múltiplo) | — |
| Copa | `file` (`image/*`, múltiplo) | — |
| Observações | `textarea` | Texto livre |

---

## Observações Adicionais

| Campo | Tipo (HTML) | Obrigatório |
|---|---|---|
| Observações adicionais | `textarea` | Não |

---

## Notas de implementação para o HTML

- **Status (Sim/Não):** usar `radio` agrupado por item (`name` único por item) em vez de `checkbox`, garantindo seleção única.
- **Campos condicionais:** quando o Status for "Não", considerar exibir/obrigar o campo de Observações (validação via JS).
- **Uploads:** a seção de Comunicação Visual precisa de `input type="file" accept="image/*" multiple` por ambiente; preview de miniatura é recomendável.
- **Datas:** usar `input type="date"` (formato ISO no valor, exibição pt-BR).
- **Agrupamento visual:** usar `<fieldset>` + `<legend>` por item avaliado para acessibilidade.
- **Validação de prazo:** a regra dos 5 dias úteis (item 1) é de negócio/pós-visita — sinalizar como nota no formulário, não como validação bloqueante.
