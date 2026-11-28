# Especificação revisada — Profissionais e solicitações (Cliente)

**Versão documental V2 — em revisão; não aprovada integralmente.**

Escopo: as sete telas solicitadas, no novo contrato JSON. Decisão confirmada na conversa: preservar o conteúdo central legado, utilizar Layout Base/header/título/menu vigentes e extrair o detalhe/situação da solicitação como componente reutilizável. A confirmação do componente não equivale à aprovação deste documento integral (Guia V3, passo 4.4). Nenhum JSON de aplicação foi gerado.

## Fontes e auditoria

- `AdvogadoJa_V1_Pos_Home_Cliente.html`: payload, templates e CSS das sete páginas; Home apenas referência.
- `AdvogadoJa_V1_Pos_Home_Advogado.html`: Atendimentos, Solicitações recebidas, Análise da solicitação, Aceitar contato, Contato liberado, Recusar solicitação. O aceite libera contatos, a recusa registra decisão e o histórico distingue atendimentos em andamento e encerrados. Não se altera o catálogo Advogado.
- `projeto-11_28-11-2026_03-56.zip` → `projeto_11/dados/contrato_aplicacao.json`: 14 páginas, layout `base`, componentes `header`, `title_header`, `menu_drawer`.
- `AdvogadoJa_Pos_Home_Cliente_Levantamento_V1.md` e Guia V3: as extrações anteriores das sete telas são mantidas em cada seção como evidência, não como nova especificação definitiva.

## Composição e responsabilidade

Reutilizar `layouts.base`, `components.header`, `components.title_header` e `components.menu_drawer` sem copiar código visual ou criar versões locais. Configurar as propriedades vigentes (inclusive itens Estudante e regras por plano da Home Cliente). Preservar CSS e hierarquia da main exclusiva; para o bloco compartilhado do perfil e detalhe, preservar as duas aparências originais. Não carregar HTML pronto, motor ou controles de demonstração do legado no novo contrato.

O componente proposto `request_detail` é independente da página `client_request_detail`. Essa separação evita colisão global de identidades; os nomes técnicos novos são propostas, não IDs aprovados. Home já referencia `professional_profile`, `client_requests` e `client_contacts`, que devem ser mantidos.

## Componente compartilhado — Detalhe/situação da solicitação

- **identity:** `request_detail`, tipo `component`, nome Detalhe da solicitação.
- **classification:** reutilizável no contexto Cliente; não impor alcance global/múltiplos perfis ainda não formalizado.
- **properties:** proposta sem nomes finais de campos: apresentação (`profile` ou `detail`), registro da solicitação, profissional relacionado, autorização e canais de contato, avaliação associada. A ausência de registro só significa Não solicitado na apresentação perfil quando efetivamente confirmada; no detalhe é ausência de contexto.
- **structure:** uma estrutura recursiva com as duas apresentações condicionais e estilos próprios preservados; usar `visibleWhen` e dados, em vez de cópias por status. O perfil mantém o bloco de situação com seus cards/badges; o detalhe mantém o card de metadados e botões. Reutilizar o conteúdo e as condições de ação compatíveis.
- **states:** fallback 0 seguro (sem registro confirmado ou dados indisponíveis); estados condicionais conforme tabela. Números definitivos após aprovação. Avaliada é variação da solicitação encerrada com avaliação associada, não novo status persistido obrigatório. Contato liberado é consequência do aceite, não status paralelo.
- **interactions:** emitir eventos sem decidir rota (`request`, `cancel`, `whatsapp`, `call`, `close`, `review`, `support` — nomes propostos). A página trata as ações/rotas. Nenhum evento de contato pode ser emitido quando não autorizado.
- **data:** apenas informações consumidas e valores locais de apresentação. Não incluir banco, API, credenciais, código de motor ou regras de processamento de infraestrutura.
- **mocks:** cobrir os estados e as duas apresentações, usando fontes originais quando existirem; dados complementares explicitamente simulados. Seleção de mocks fora da main.

### Matriz de estados e ações

| Situação | Perfil público | Detalhe | Transição |
|---|---|---|---|
| Não solicitado | Solicitar contato | Não se aplica a registro existente | Solicitar → pendente |
| Pendente | Aguardar, cancelar | Acompanhar, cancelar, suporte | Advogado aceita/recusa; cliente cancela |
| Aceita | WhatsApp, ligação, encerrar | WhatsApp, ligação, encerrar, suporte | Cliente encerra |
| Recusada | Exibir situação | Histórico, suporte | Terminal para a solicitação |
| Cancelada | Exibir situação | Histórico, suporte | Terminal para a solicitação |
| Encerrada | Avaliar | Avaliar, suporte | Registrar avaliação |
| Encerrada e avaliada | Exibir avaliação da experiência | Consultar avaliação, suporte | Não reenviar |

A matriz complementa o legado: o perfil já contém não solicitado, pendente, aceita, encerrada; a lista já contém recusada; cancelar existe no perfil; manter histórico de cancelamento e impedir duplicidade de avaliação são decisões propostas. O registro não pode liberar canais em estado pendente/recusado/cancelado/encerrado. A visibilidade das ações não substitui autorização da operação em produção.

## Classificação e navegação propostas

Perfil e jornada Cliente (`client`, ordem vigente 1). Subjornada proposta `professional_requests` (ordem 5, depois das quatro existentes). Grupo organizacional Profissionais e solicitações. Usar a ordem das sete telas do catálogo (1–7) como inventário, não como sequência obrigatória. A classificação deve representar caminhos efetivos e as ocorrências compartilhadas de Home, perfil, lista, detalhe e contatos. Ainda falta fechar a divisão em subjornadas alternativas e a posição de cada ocorrência (D-02).

Caminhos funcionais: Home → perfil; Home/menu → Minhas solicitações → detalhe; Home/menu → Contatos liberados → detalhe; perfil/detalhe aceito → aviso WhatsApp; perfil/detalhe aceito → encerrar → avaliar (opcional) → detalhe; perfil/detalhe encerrado → avaliar → detalhe. Cancelar retorna à situação cancelada no contexto corrente. Todos os sete usam menu e header vigentes. Suporte e notificações são destinos externos ao recorte, não páginas a criar nesta entrega. A Home e seus destinos existentes devem ser preservados, com as referências de navegação atualizadas apenas após aprovação.

## Decisões e esclarecimentos

| ID | Decisão | Situação |
|---|---|---|
| D-01 | Reutilizar componentes vigentes, manter main e extrair componente de detalhe/situação com duas apresentações. | Confirmada |
| D-02 | Organizar classificação espelhando os caminhos acima; definir ocorrências/ordens e alternativas sem criar transições pela ordem. | Proposta, falta formalizar |
| D-03 | Levar ID selecionado entre páginas e devolver o mesmo registro ao retornar; sem contexto válido, não simular dados como reais. | Proposta; representação de contexto ainda não formalizada no contrato |
| D-04 | Uma solicitação por ID, manter histórico; definir se pode existir mais de uma ativa para um profissional e quando pode solicitar novamente. | Pergunta indispensável |
| D-05 | Manter quatro filtros existentes; encerradas/canceladas/avaliadas aparecem em Todas; Contatos liberados mostra somente aceitas ativas. | Proposta para preservar visual |
| D-06 | WhatsApp passa sempre pelo aviso, depois mantém origem; em prévia apenas simular, sem canais reais. | Proposta (retorno diferente do legado) |
| D-07 | Motivos de encerramento: manter seleção múltipla observada? Ao menos um obrigatório? Precisa confirmação adicional? | Pergunta indispensável |
| D-08 | Avaliação opcional, três notas obrigatórias se enviar; um envio por solicitação, sem edição nesta etapa; não definir moderação/publicação. | Proposta; moderação fora do recorte |
| D-09 | Suporte e Notificações ainda não definidos no recorte; manter destinos pendentes com aviso do visualizador, sem inventar tela. | Proposta |

**Limitação técnica identificada:** o motor vigente não garante transporte do registro selecionado nem continuidade de dados entre páginas. A representação desse contexto e o tratamento de eventos de componente devem ser verificados no contrato compartilhado antes da geração. Não inserir lógica de motor no JSON nem declarar o fluxo integrado sem teste. A auditoria foi estática.

## 01. Perfil público do profissional

### Fontes e finalidade

Referência: `cliente.profissionais.perfil_publico` · `/cliente/profissionais/perfil` (rota legada). Template exclusivo: `telas/cliente/profissionais/perfil_publico/main/content/template.html`. CSS correspondente: `telas/cliente/profissionais/perfil_publico/main/content/style.css`. Comportamento observado: `behavior-10`. Grupo do catálogo: Profissionais e solicitações.

### identity

`professional_profile` · page · Perfil público do profissional. ID já referenciado pela Home vigente.

### classification

Cliente; grupo Profissionais e solicitações; ocorrências e ordem final dependem de D-02.

### structure

Título no componente vigente: **Perfil profissional**. Preservar a identidade profissional, áreas, disponibilidade, resumo, avaliações e botão Voltar ao mapa. Substituir somente o bloco de contato por uma instância de `request_detail` na apresentação `profile`. Retirar os controles de simulação do conteúdo final. A aparência dessa instância deve seguir o bloco de contato legado, não o card de detalhe da tela 03.

### states

A página mantém estado padrão. A instância de `request_detail` determina a situação de contato: não solicitado, pendente, aceita, recusada, cancelada, encerrada ou avaliada. Dados insuficientes não habilitam contato.

### navigation e interactions

Home → perfil, com identificação do profissional selecionado. Solicitar/cancelar contato emitem eventos; WhatsApp → tela 05; ligação somente quando aceita; encerrar → tela 06; avaliar → tela 07; voltar ao mapa → Home vigente. A página trata os eventos do componente, não o componente navega diretamente.

### data e mocks

Profissional selecionado, áreas, identificação OAB, disponibilidade, resumo, avaliações e solicitação associada. Não reutilizar literalmente o nome demonstrativo para todos os profissionais. Cenários: os quatro estados originais e os três complementares recusada, cancelada e avaliada. A regra de nova solicitação após conclusão/recusa/cancelamento depende de confirmação (D-04).

### Evidência preservada da fonte legada

Conteúdo observado (inclui textos de demonstração que não entram no produto):

- AS
- Dra. Ana Souza
- OAB/SP 123456 · perfil validado
- 4.8
- Áreas
- Criminal, Família e Trabalhista
- Disponibilidade
- Online hoje · presencial em São Paulo
- Resumo
- Perfil informativo com formação, experiência e disponibilidade, sem valores ou garantias.
- Contato
- Situação com este profissional
- Solicitar contato com este profissional
- Envie a solicitação. Os canais diretos só serão liberados se o profissional aceitar.
- NÃO SOLICITADO
- Solicitar contato
- WhatsApp e telefone permanecem ocultos nesta etapa.
- Solicitação enviada
- A profissional ainda precisa aceitar o contato. A situação também pode ser acompanhada em Minhas solicitações.
- AGUARDANDO
- Aguardando resposta
- Cancelar solicitação
- Enquanto estiver aguardando, os dados de contato não são exibidos.
- Contato aceito
- A profissional aceitou sua solicitação. Os canais de contato estão liberados.
- CONTATO LIBERADO
- Acessar WhatsApp
- Ligar para a profissional
- Encerrar solicitação
- A conversa acontece fora do aplicativo. A avaliação é liberada depois que a solicitação é encerrada no AdvogadoJá+.
- Solicitação encerrada
- O atendimento foi encerrado dentro do aplicativo. Agora esta experiência pode ser avaliada.
- ENCERRADA
- Avaliar atendimento
- A avaliação pertence à solicitação encerrada e não depende do conteúdo da conversa externa.
- Avaliações
- Experiência de outros clientes
- média das avaliações recebidas
- Clareza
- 4.9
- Tempo de resposta
- 4.7
- Avaliações refletem experiências de atendimento e não indicam resultado de causa ou promessa de êxito.
- Cliente verificado
- há 8 dias
- Atendimento claro e objetivo. Explicou os próximos passos de forma simples.
- há 3 semanas
- Respondeu rápido e esclareceu minhas principais dúvidas durante o atendimento.
- Voltar ao mapa
- O acesso direto por WhatsApp e telefone só aparece depois que o profissional aceita a solicitação de contato.
- CONTROLE DE DEMONSTRAÇÃO · NÃO FAZ PARTE DA TELA FINAL
- Simular estado
- CONTROLE DE SIMULAÇÃO
- Simular estado do contato
- Este controle existe somente para demonstrar os estados desta tela. Ele não representa uma ação disponível ao cliente no aplicativo final.
- Estado a visualizar
- Não solicitado
- Mostra a ação para solicitar contato.
- Simula solicitação enviada e ainda não aceita.
- Libera WhatsApp, ligação e encerramento.
- Atendimento encerrado
- Libera a ação de avaliar atendimento.
- Cancelar
- Aplicar estado
- ×

Controles/ações observados no legado (não são a especificação reconstruída):

| Controle / elemento | Ação ou destino observado |
|---|---|
| Solicitar contato | Ação legada `contact.request`; reconstruir pelo comportamento, não pelo nome do comando. |
| Aguardando resposta | Desabilitado. |
| Cancelar solicitação | Ação legada `contact.cancel`; reconstruir pelo comportamento, não pelo nome do comando. |
| Acessar WhatsApp | Ação legada `contact.whatsapp`; reconstruir pelo comportamento, não pelo nome do comando. |
| Ligar para a profissional | Ação legada `contact.call`; reconstruir pelo comportamento, não pelo nome do comando. |
| Encerrar solicitação | Ação legada `contact.close`; reconstruir pelo comportamento, não pelo nome do comando. |
| Avaliar atendimento | Ação legada `contact.review`; reconstruir pelo comportamento, não pelo nome do comando. |
| Voltar ao mapa | Destino Home (`cliente.home_cliente`) |
| Simular estado | Ação legada `contact.simulation.open`; reconstruir pelo comportamento, não pelo nome do comando. |
| × | Ação legada `contact.simulation.close`; reconstruir pelo comportamento, não pelo nome do comando. |
| Cancelar | Ação legada `contact.simulation.close`; reconstruir pelo comportamento, não pelo nome do comando. |
| Aplicar estado | Ação legada `contact.simulation.apply`; reconstruir pelo comportamento, não pelo nome do comando. |

Campos observados no legado:

| Campo/controle observado | Tipo | Valor/restrição no HTML |
|---|---|---|
| contactSimulationStatus | radio | value=none |
| contactSimulationStatus | radio | value=pending |
| contactSimulationStatus | radio | value=accepted |
| contactSimulationStatus | radio | value=closed |

### Validação

Conferir main em mobile/desktop, componentes vigentes, IDs e referências, todas as condições de ação e seleção do registro. Não liberar o JSON antes de resolver as questões aplicáveis e aprovar o documento completo.

---

## 02. Minhas solicitações

### Fontes e finalidade

Referência: `cliente.profissionais.minhas_solicitacoes` · `/cliente/solicitacoes` (rota legada). Template exclusivo: `telas/cliente/profissionais/minhas_solicitacoes/main/content/template.html`. CSS correspondente: `telas/cliente/profissionais/minhas_solicitacoes/main/content/style.css`. Comportamento observado: `behavior-09`. Grupo do catálogo: Profissionais e solicitações.

### identity

`client_requests` · page · Minhas solicitações. ID já referenciado pela Home vigente.

### classification

Cliente; grupo Profissionais e solicitações; ocorrências e ordem final dependem de D-02.

### structure

Título no componente vigente: **Minhas solicitações**. Preservar cabeçalho de conteúdo, contador, quatro filtros e cards. Os cards passam a repetir a coleção de solicitações, com dados reais do registro na simulação. Manter o estilo dos cards. Não importar as ações de filtro do motor legado.

### states

Estado 0, com lista preenchida ou vazia conforme dados. Filtro é valor local, não novo estado de página. Preservar os quatro filtros atuais; proposta: encerradas, canceladas e avaliadas aparecem em Todas (D-05).

### navigation e interactions

Home/menu → lista; selecionar qualquer card → tela 03 com ID da solicitação selecionada. Trocar filtro atualiza a lista, contador e mensagem de vazio, sem navegar.

### data e mocks

Coleção de solicitações, filtro escolhido, totais derivados. Mocks originais AJ-1042 e AJ-1029 pendentes, AJ-1038 aceita, AJ-1032 recusada. Acrescentar cenários sintéticos de encerrada, cancelada, avaliada e lista vazia, separados do conjunto original. Não atribuir profissional ou resumo ao registro se a fonte não fornece esses dados; usar valores de demonstração explicitamente identificados ou ausentes.

### Evidência preservada da fonte legada

Conteúdo observado (inclui textos de demonstração que não entram no produto):

- Minhas solicitações
- Acompanhe solicitações pendentes, aceitas e recusadas.
- Todas
- Pendentes
- Aceitas
- Recusadas
- Criminal
- Contato prioritário · Hoje, 14:20
- Pendente
- #AJ-1042
- Cível
- Consultoria · 16/09, 09:10
- #AJ-1029
- Família
- Consultoria · Ontem, 18:45
- Aceita
- #AJ-1038
- Trabalhista
- Contato prioritário · 17/09, 11:05
- Recusada
- #AJ-1032
- Nenhuma solicitação neste estado.
- As solicitações aparecerão aqui conforme o andamento.
- 4
- 2
- 1

Controles/ações observados no legado (não são a especificação reconstruída):

| Controle / elemento | Ação ou destino observado |
|---|---|
| Todas 4 | Filtrar lista por `all`; atualizar contador visível e vazio. |
| Pendentes 2 | Filtrar lista por `pending`; atualizar contador visível e vazio. |
| Aceitas 1 | Filtrar lista por `accepted`; atualizar contador visível e vazio. |
| Recusadas 1 | Filtrar lista por `declined`; atualizar contador visível e vazio. |
| Criminal Contato prioritário · Hoje, 14:20 Pendente #AJ-1042 › | Destino Solicitação · Detalhe (`cliente.profissionais.detalhe_solicitacao`) |
| Cível Consultoria · 16/09, 09:10 Pendente #AJ-1029 › | Destino Solicitação · Detalhe (`cliente.profissionais.detalhe_solicitacao`) |
| Família Consultoria · Ontem, 18:45 Aceita #AJ-1038 › | Destino Solicitação · Detalhe (`cliente.profissionais.detalhe_solicitacao`) |
| Trabalhista Contato prioritário · 17/09, 11:05 Recusada #AJ-1032 › | Destino Solicitação · Detalhe (`cliente.profissionais.detalhe_solicitacao`) |

Campos observados no legado:

Sem campo de entrada nativo no conteúdo principal.

### Validação

Conferir main em mobile/desktop, componentes vigentes, IDs e referências, todas as condições de ação e seleção do registro. Não liberar o JSON antes de resolver as questões aplicáveis e aprovar o documento completo.

---

## 03. Detalhe da solicitação

### Fontes e finalidade

Referência: `cliente.profissionais.detalhe_solicitacao` · `/cliente/solicitacoes/detalhe` (rota legada). Template exclusivo: `telas/cliente/profissionais/detalhe_solicitacao/main/content/template.html`. CSS correspondente: `telas/cliente/profissionais/detalhe_solicitacao/main/content/style.css`. Comportamento observado: `behavior-01`. Grupo do catálogo: Profissionais e solicitações.

### identity

`client_request_detail` · page · Detalhe da solicitação. ID proposto.

### classification

Cliente; grupo Profissionais e solicitações; ocorrências e ordem final dependem de D-02.

### structure

Título no componente vigente: **Detalhe da solicitação**. O conteúdo central será uma instância de `request_detail` na apresentação `detail`. Reutilizar o card original (Área, Status, Profissional, resumo quando disponível), seus estilos e área de ações. A apresentação aceita preserva a referência visual legada; outros status exibem o mesmo card, alterando textos e ações. Ligação é complemento proposto, sustentado pelo perfil público. Não mostrar botões de contato em estados incompatíveis.

### states

A página possui estado padrão e recebe o registro selecionado. As variações de conteúdo pertencem ao componente, não são seis páginas nem seis cópias de estrutura. Ver matriz de estados compartilhada. Ausência de ID ou registro inválido deve apresentar mensagem segura e permitir retorno, sem exibir registro fixo.

### navigation e interactions

Entradas: telas 02 e 04, retorno da tela 07. Ações emitidas pelo componente: cancelar, WhatsApp, ligação, suporte, encerrar e avaliar. Destinos 05, 06, 07 ou suporte conforme ação permitida. Retorno preserva registro e origem quando aplicável. A página resolve os destinos.

### data e mocks

ID e dados da solicitação selecionada, profissional associado, status, resumo se existente, dados de contato somente quando autorizados, avaliação quando existente. Mocks para cada estado, incluindo ausência de seleção. O único detalhe legado é aceito (Criminal/Dra. Ana); não assumir que pertence ao AJ-1038 de Família.

### Evidência preservada da fonte legada

Conteúdo observado (inclui textos de demonstração que não entram no produto):

- Área
- Criminal
- Status
- Contato liberado
- Profissional
- Dra. Ana Souza
- Resumo enviado pelo Cliente para triagem de contato.
- WhatsApp
- Suporte
- Encerrar solicitação

Controles/ações observados no legado (não são a especificação reconstruída):

| Controle / elemento | Ação ou destino observado |
|---|---|
| WhatsApp | Destino Aviso antes do WhatsApp (`cliente.profissionais.aviso_canal_externo`) |
| Suporte | Destino Suporte (`cliente.configuracao.suporte`) |
| Encerrar solicitação | Destino Solicitação · Encerrar (`cliente.profissionais.encerrar_solicitacao`) |

Campos observados no legado:

Sem campo de entrada nativo no conteúdo principal.

### Validação

Conferir main em mobile/desktop, componentes vigentes, IDs e referências, todas as condições de ação e seleção do registro. Não liberar o JSON antes de resolver as questões aplicáveis e aprovar o documento completo.

---

## 04. Contatos liberados

### Fontes e finalidade

Referência: `cliente.profissionais.contatos_liberados` · `/cliente/contatos` (rota legada). Template exclusivo: `telas/cliente/profissionais/contatos_liberados/main/content/template.html`. CSS correspondente: `telas/cliente/profissionais/contatos_liberados/main/content/style.css`. Comportamento observado: `behavior-01`. Grupo do catálogo: Profissionais e solicitações.

### identity

`client_contacts` · page · Contatos liberados. ID já referenciado pela Home vigente.

### classification

Cliente; grupo Profissionais e solicitações; ocorrências e ordem final dependem de D-02.

### structure

Título no componente vigente: **Contatos liberados**. Preservar botões/cards compactos e informações de nome e área. A lista repete apenas solicitações aceitas com contato disponível. Se vazia, exibir mensagem neutra de ausência de contatos (complemento proposto).

### states

Estado 0; preenchida ou vazia por dados. Encerradas, canceladas e recusadas não aparecem como contatos ativos (D-05).

### navigation e interactions

Home/menu → lista. Selecionar contato → tela 03, levando a solicitação associada. Não substituir por perfil público, pois o destino original é detalhe.

### data e mocks

Coleção de solicitações aceitas; nomes e áreas. Mock original Dra. Ana Souza/Criminal e Dra. Laura Campos/Trabalhista; não presumir IDs correspondentes aos cards de Minhas solicitações. Cenário vazio adicional.

### Evidência preservada da fonte legada

Conteúdo observado (inclui textos de demonstração que não entram no produto):

- Dra. Ana Souza
- Criminal · contato liberado
- Dra. Laura Campos
- Trabalhista · contato liberado

Controles/ações observados no legado (não são a especificação reconstruída):

| Controle / elemento | Ação ou destino observado |
|---|---|
| Dra. Ana Souza Criminal · contato liberado | Destino Solicitação · Detalhe (`cliente.profissionais.detalhe_solicitacao`) |
| Dra. Laura Campos Trabalhista · contato liberado | Destino Solicitação · Detalhe (`cliente.profissionais.detalhe_solicitacao`) |

Campos observados no legado:

Sem campo de entrada nativo no conteúdo principal.

### Validação

Conferir main em mobile/desktop, componentes vigentes, IDs e referências, todas as condições de ação e seleção do registro. Não liberar o JSON antes de resolver as questões aplicáveis e aprovar o documento completo.

---

## 05. Aviso antes do WhatsApp

### Fontes e finalidade

Referência: `cliente.profissionais.aviso_canal_externo` · `/cliente/contato/whatsapp` (rota legada). Template exclusivo: `telas/cliente/profissionais/aviso_canal_externo/main/content/template.html`. CSS correspondente: `telas/cliente/profissionais/aviso_canal_externo/main/content/style.css`. Comportamento observado: `behavior-01`. Grupo do catálogo: Profissionais e solicitações.

### identity

`external_contact_notice` · page · Aviso antes do WhatsApp. ID proposto.

### classification

Cliente; grupo Profissionais e solicitações; ocorrências e ordem final dependem de D-02.

### structure

Título no componente vigente: **Contato externo**. Preservar os dois cards informativos e botão Abrir WhatsApp. O aviso é uma página, não a cópia de um modal do motor legado.

### states

Estado 0 com contexto aceito válido. Sem contato autorizado, não habilitar abertura. Simulação não envia mensagens.

### navigation e interactions

Entrada a partir do perfil público ou detalhe aceito. Proposta: todo acesso WhatsApp passa pelo aviso; Abrir WhatsApp solicita abertura do canal com o contato autorizado; na prévia, apenas simular e manter a origem para retorno. O legado navega para Contatos liberados após simular; a escolha do retorno precisa ser aprovada (D-06).

### data e mocks

Solicitação selecionada, canal de contato autorizado e origem. Mock aceito, sem número real, e cenário de bloqueio. Textos informativos preservados.

### Evidência preservada da fonte legada

Conteúdo observado (inclui textos de demonstração que não entram no produto):

- Você será direcionado ao WhatsApp. Honorários, documentos, contrato e condições de atendimento são tratados diretamente entre Cliente e Advogado.
- Sem pagamento de honorários no app
- A plataforma não recebe percentual da relação profissional.
- Abrir WhatsApp

Controles/ações observados no legado (não são a especificação reconstruída):

| Controle / elemento | Ação ou destino observado |
|---|---|
| Abrir WhatsApp | Destino Contatos liberados (`cliente.profissionais.contatos_liberados`); aviso de simulação antes do destino. |

Campos observados no legado:

Sem campo de entrada nativo no conteúdo principal.

### Validação

Conferir main em mobile/desktop, componentes vigentes, IDs e referências, todas as condições de ação e seleção do registro. Não liberar o JSON antes de resolver as questões aplicáveis e aprovar o documento completo.

---

## 06. Encerrar solicitação

### Fontes e finalidade

Referência: `cliente.profissionais.encerrar_solicitacao` · `/cliente/solicitacoes/encerrar` (rota legada). Template exclusivo: `telas/cliente/profissionais/encerrar_solicitacao/main/content/template.html`. CSS correspondente: `telas/cliente/profissionais/encerrar_solicitacao/main/content/style.css`. Comportamento observado: `behavior-01`. Grupo do catálogo: Profissionais e solicitações.

### identity

`request_close` · page · Encerrar solicitação. ID proposto.

### classification

Cliente; grupo Profissionais e solicitações; ocorrências e ordem final dependem de D-02.

### structure

Título no componente vigente: **Motivo do encerramento**. Preservar chips, observação e botão. Os chips são independentes e o primeiro vem ativo no legado; a fonte não define obrigatoriedade nem validação de seleção. Não trocar por rádio ou adicionar confirmação sem aprovação (D-07).

### states

Estado 0, acessível somente para solicitação aceita. Em encerramento bem-sucedido, a solicitação passa para encerrada. A prévia simula o resultado, sem persistência real.

### navigation e interactions

Entrada por perfil/detalhe aceito. Ao confirmar Encerrar solicitação, atualizar a situação simulada e encaminhar para tela 07, como no legado. Avaliação permanece opcional: voltar sem avaliar mantém estado encerrada; nenhuma abertura automática de canal. Seleção de motivo e observação vinculadas ao mesmo registro.

### data e mocks

ID da solicitação, motivos escolhidos, observação opcional. Preservar os cinco motivos e estilos. Cenários: motivo inicial, outros motivos e observação; validar regras de seleção conforme D-07.

### Evidência preservada da fonte legada

Conteúdo observado (inclui textos de demonstração que não entram no produto):

- Já conversei
- Não preciso mais
- Escolhi outro profissional
- Não houve resposta
- Outro
- Observação opcional
- Informação operacional, sem análise jurídica.
- Encerrar solicitação

Controles/ações observados no legado (não são a especificação reconstruída):

| Controle / elemento | Ação ou destino observado |
|---|---|
| Já conversei | Alternar seleção local de forma independente. |
| Não preciso mais | Alternar seleção local de forma independente. |
| Escolhi outro profissional | Alternar seleção local de forma independente. |
| Não houve resposta | Alternar seleção local de forma independente. |
| Outro | Alternar seleção local de forma independente. |
| Encerrar solicitação | Destino Avaliar experiência (`cliente.profissionais.avaliar_experiencia`) |

Campos observados no legado:

| Campo/controle observado | Tipo | Valor/restrição no HTML |
|---|---|---|
| Observação opcional Informação operacional, sem análise jurídica. | textarea | Não declarado |

### Validação

Conferir main em mobile/desktop, componentes vigentes, IDs e referências, todas as condições de ação e seleção do registro. Não liberar o JSON antes de resolver as questões aplicáveis e aprovar o documento completo.

---

## 07. Avaliar experiência

### Fontes e finalidade

Referência: `cliente.profissionais.avaliar_experiencia` · `/cliente/avaliacao` (rota legada). Template exclusivo: `telas/cliente/profissionais/avaliar_experiencia/main/content/template.html`. CSS correspondente: `telas/cliente/profissionais/avaliar_experiencia/main/content/style.css`. Comportamento observado: `behavior-01`. Grupo do catálogo: Profissionais e solicitações.

### identity

`experience_review` · page · Avaliar experiência. ID proposto.

### classification

Cliente; grupo Profissionais e solicitações; ocorrências e ordem final dependem de D-02.

### structure

Título no componente vigente: **Avaliar atendimento**. Preservar apresentação do profissional, três grupos de estrelas, comentário e textos de orientação. Remover somente dependências do motor legado. O texto sobre moderação ainda não é regra de publicação definitiva.

### states

Estado 0, acessível quando encerrada e ainda não avaliada. As três notas de 1 a 5 são obrigatórias, conforme os controles HTML; comentário opcional até 600 caracteres. Envio inválido não navega. Após avaliação registrada, não oferecer novo envio (proposta D-08).

### navigation e interactions

Entradas: tela 06 após encerrar ou componente no perfil/detalhe encerrado. Enviar avaliação válida → tela 03 com a mesma solicitação e indicação avaliada. Voltar sem enviar mantém encerrada. Edição/moderação/publicação não fazem parte desta entrega sem definição.

### data e mocks

ID da solicitação, profissional correspondente, nota geral, clareza, tempo de resposta e comentário. Mocks: formulário inicial, notas válidas, comentário opcional, validação incompleta e registro avaliado. Não calcular agregados públicos nem publicar conteúdo real.

### Evidência preservada da fonte legada

Conteúdo observado (inclui textos de demonstração que não entram no produto):

- 5 estrelas
- 4 estrelas
- 3 estrelas
- 2 estrelas
- 1 estrela
- Conte como foi o atendimento, sem incluir dados pessoais ou informações sensíveis do seu caso.
- ATENDIMENTO ENCERRADO
- Avalie sua experiência
- Sua avaliação ajuda a representar a experiência de atendimento. Ela não avalia o resultado jurídico da causa.
- AS
- Dra. Ana Souza
- OAB/SP 123456
- Avaliação geral
- Como você avalia a experiência de atendimento?
- Avaliação geral de 1 a 5 estrelas
- Obrigatório · 1 a 5 estrelas
- Clareza
- As orientações e explicações foram claras?
- Nota de clareza de 1 a 5 estrelas
- Essa nota alimenta o indicador de clareza do perfil.
- Tempo de resposta
- Como você avalia o tempo de resposta durante o atendimento?
- Nota de tempo de resposta de 1 a 5 estrelas
- Essa nota alimenta o indicador de tempo de resposta do perfil.
- Comentário
- opcional
- Até 600 caracteres. A regra de publicação/moderação do comentário será definida separadamente.
- Importante
- A avaliação deve refletir atendimento, comunicação e experiência de contato. Não use a nota para indicar promessa de êxito ou resultado jurídico.
- Enviar avaliação

Controles/ações observados no legado (não são a especificação reconstruída):

| Controle / elemento | Ação ou destino observado |
|---|---|
| Enviar avaliação | Destino Solicitação · Detalhe (`cliente.profissionais.detalhe_solicitacao`) |

Campos observados no legado:

| Campo/controle observado | Tipo | Valor/restrição no HTML |
|---|---|---|
| overallRating | radio | value=5, required |
| overallRating | radio | value=4 |
| overallRating | radio | value=3 |
| overallRating | radio | value=2 |
| overallRating | radio | value=1 |
| clarityRating | radio | value=5, required |
| clarityRating | radio | value=4 |
| clarityRating | radio | value=3 |
| clarityRating | radio | value=2 |
| clarityRating | radio | value=1 |
| responseTimeRating | radio | value=5, required |
| responseTimeRating | radio | value=4 |
| responseTimeRating | radio | value=3 |
| responseTimeRating | radio | value=2 |
| responseTimeRating | radio | value=1 |
| comment | textarea | maxlength=600 |

### Validação

Conferir main em mobile/desktop, componentes vigentes, IDs e referências, todas as condições de ação e seleção do registro. Não liberar o JSON antes de resolver as questões aplicáveis e aprovar o documento completo.

---

## Critérios de aceite

- Uma única identidade por página/componente, sem colisão.
- Mesma main nos casos originalmente presentes, ressalvadas as complementações aprovadas; duas apresentações do componente com aparência correspondente ao legado.
- Layout Base e três componentes atuais reutilizados; menu atual integral, não drawer antigo.
- Cada solicitação abre seu próprio detalhe; filtros, contatos e status coerentes.
- Canais de contato somente após aceite; encerramento/avaliação associados ao mesmo ID.
- Documento concluído e aprovado antes da geração de `identity`, `classification`, `structure`, `states`, `navigation`, `interactions`, `data`, `mocks` e propriedades do componente no novo JSON.
- Renderização exclusivamente pelo JSON, abas Visualização, JSON e Documento da tela. Testes de navegador somente após geração.

**Status:** aguardando esclarecimentos e aprovação integral. Nenhum arquivo da aplicação ou catálogo legado foi alterado.
