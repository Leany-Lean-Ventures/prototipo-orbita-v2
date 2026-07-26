# Relatório de Funcionalidades — Protótipo Órbita

Este documento descreve **o que já existe e funciona** no protótipo, módulo por módulo — não é um changelog de alterações técnicas, é um retrato do que o sistema faz hoje e como cada funcionalidade opera na prática. Serve de base para relatórios de avanço e atualização do time.

> Mantido vivo: atualizar esta lista sempre que uma funcionalidade nova for concluída (ver `MEMORY.md`).

---

## Acesso e estrutura geral

### Login
Tela de autenticação (mockada — sem backend real). Valida usuário/senha de teste e redireciona para o Dashboard. Se o usuário não estiver autenticado, qualquer rota interna redireciona automaticamente para o login.

### Estrutura do sistema (menu e navegação)
Menu lateral fixo com os 9 módulos do sistema (Dashboard, Unidades, PVs, Consultores, Prévias, Ocorrências, Visitas, Relatórios, Configurações). No topo da barra lateral fica o sino de alertas — clicar nele abre um painel lateral com os alertas ativos do sistema (ex.: unidades sem visita, SLA de prévia vencido), cada um com botão de ação direta para a tela correspondente. No rodapé, o menu do usuário logado com opção de sair.

---

## Dashboard

Tela inicial do sistema. Mostra:
- 5 indicadores principais (KPIs) com contador animado — total de unidades, PVs, consultores, alertas críticos, etc.
- Gráfico de evolução de faturamento e vendas dos últimos meses.
- Lista de "Alertas que exigem ação" — problemas que precisam de atenção, com atalho direto para resolver.
- Lista das últimas ocorrências registradas na rede.
- Ranking de unidades por desempenho.

---

## Unidades

### Lista de Unidades (`/unidades`)
Tabela com todas as unidades da rede, com busca por nome e filtros por estado, status (Ativo/Inativo/Suspenso) e rating (A/B/C) — os filtros ficam refletidos na URL, então o link pode ser compartilhado já filtrado. Clicar em uma linha abre o detalhe da unidade.

Uma segunda aba na mesma tela, **Mapa de Vínculos**, mostra um grafo interativo (zoom, arrastar, clicar nos nós) da hierarquia Macrorregião → Unidade → PV → Consultor, com uma versão em lista para quem preferir navegar sem o grafo.

### Detalhe da Unidade (`/unidades/:id`)
Página com cabeçalho (nome, cidade, status, rating em gráfico circular) e 5 abas:
- **Dados Básicos** — contato, tamanho da rede, gráfico de Avaliação 360, ranking de consultores e de carteiras.
- **Estrutura Organizacional** — hierarquia (árvore com PVs e consultores subordinados), consultores vinculados, estrutura societária e comissionamento.
- **Carteiras Associadas** — tabela de carteiras ativas/inativas, com filtro para mostrar só as órfãs (sem consultor responsável).
- **Histórico** — linha do tempo de eventos da unidade (visitas, avaliações, ocorrências).

---

## PVs (Pontos de Venda)

Estrutura equivalente à de Unidades (lista + detalhe), reaproveitando os mesmos componentes visuais — tabela com busca/filtro por unidade mãe, nível e status; detalhe com estrutura organizacional, consultores, carteiras e histórico. PV não tem rating nem avaliação 360 (esses conceitos são exclusivos de Unidade).

---

## Consultores

Lista + detalhe dos consultores da rede, identificados por **Razão Social e CNPJ** (pessoa jurídica, sem foto — usam um ícone padrão). O detalhe tem abas de Dados Básicos, Vínculos, Carteiras e Histórico.

---

## Ocorrências

Logbook central de relacionamento da rede — registra conflitos, penalidades, notificações, contratos e denúncias envolvendo unidades, PVs ou consultores. A lista permite buscar e filtrar por tipo e status (Aberto/Em andamento/Resolvido). Cada ocorrência pode ter uma **anotação privada**, visível só para a diretoria/backoffice, separada da descrição pública.

---

## Prévias

Esteira de credenciamento de novos parceiros (candidatos a lojista/consultor). A lista é organizada em abas por etapa do processo (Documental, Retificação, Jurídico, Aprovadas, Reprovadas), com busca, filtros avançados (unidade, regional, tipo, analista, período, SLA) e ações em lote (atribuir analista, exportar). Cada linha abre uma **página de processo** dedicada com os dados cadastrais do candidato, documentos analisados automaticamente (validação simulada por IA) e histórico do andamento. Candidatos em blacklist têm a aprovação bloqueada e exigem justificativa de recusa.

---

## Visitas

O módulo mudou de conceito: não é mais sobre **agendar** uma visita futura, e sim sobre **registrar** uma visita que já aconteceu, usando o checklist gerencial oficial de visita à rede.

### Lista de Visitas (`/visitas`)
Mostra todas as visitas já registradas — data da visita, unidade/PV visitado, tipo (Comercial/Auditoria/Avaliação 360/Estruturação) e responsável. Um alerta no topo aponta unidades sem visita há mais de 180 dias. Cada linha tem um botão de "olho" que abre a página com todas as respostas daquele registro.

### Registrar uma visita
Ao clicar em "Registrar visita", abre-se primeiro um modal para escolher **qual modelo de formulário** usar (ver módulo Configurações → Modelos de Formulário abaixo). Confirmado o modelo, abre-se a página completa do checklist, dividida em seções:
1. Identificação da visita (loja, licenciado/gestor — preenchido automaticamente ao escolher a loja —, tipo, data, responsável)
2. Plano de carreiras, Processo de contratação, Acelerador Ademicon, Multiplicador, Avaliações prévias, Devolutiva BackOffice, Visita diretoria, Normativa Digital, Avaliação 360 e premissas — cada um com perguntas Sim/Não e observações
3. Comunicação Visual — upload de fotos por ambiente da loja (fachada, recepção, salas, etc.)
4. Observações adicionais

Uma barra lateral fixa permite navegar rapidamente entre as seções e mostra o progresso. Ao salvar, o registro é confirmado e o usuário volta para a lista.

*Observação de escopo do protótipo:* qualquer modelo escolhido abre hoje o mesmo checklist padrão — a seleção já flui pelo sistema (aparece indicada na página), mas a exibição de um formulário diferente por modelo ainda não foi implementada.

### Ver respostas de uma visita (`/visitas/:id`)
Página somente leitura com todas as respostas dadas naquele registro, seção por seção, incluindo quantas fotos foram enviadas por ambiente, observações e eventual anotação privada ou ocorrência gerada a partir da visita.

---

## Configurações

Nova tela central (`/configuracoes`) com um painel de cards grandes apontando para as sub-áreas de configuração do sistema:
- **Gestão de Alertas** — ainda não implementado (placeholder).
- **Perfis de Acesso (RBAC)** — ainda não implementado (placeholder).
- **Modelos de Formulário** — implementado.

### Modelos de Formulário
Permite ao operador **criar checklists reutilizáveis** para o registro de visitas, sem precisar de desenvolvimento.
- A lista de modelos mostra cada um em um card com nome, descrição, quantidade de campos e **quantidade de respostas já recebidas** com aquele modelo.
- Ao criar um modelo novo (ou editar um existente), o usuário dá um nome ao modelo e vai empilhando campos: cada campo tem um rótulo, um tipo (texto curto, texto longo, número, data, Sim/Não, lista de opções ou upload de foto/arquivo) e a opção de marcar como obrigatório. É possível reordenar ou remover campos.
- Três campos — **Loja**, **Licenciado ou gestor** e **Data da aplicação do checklist** — vêm sempre fixos e obrigatórios em todo modelo, já que são a identificação mínima de qualquer visita.

---

## Ainda não implementado

- **Relatórios** (`/relatorios`) — módulo de relatórios consolidados por tema (consultores inativos, prévias vencidas, cobertura de visitas etc.); hoje é uma tela "em construção".
- **Configurações → Gestão de Alertas** e **Perfis de Acesso (RBAC)** — telas "em construção".
