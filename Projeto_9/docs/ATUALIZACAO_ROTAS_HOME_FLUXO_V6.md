# Projeto 9 — rotas verificáveis da Home no Fluxo (patch V6)

## Objetivo

Conservar a composição visual do módulo Jornadas, declarar as rotas dos cinco botões da tela `advogado.home` **no módulo Fluxo** e permitir que sua visualização teste a navegação entre telas existentes, sem reintroduzir o modal artificial.

## Alterações mínimas

- `modulos/fluxo/visualizacao_fluxo/data/documento.json`: acrescentadas **5 saídas** a `telas["advogado.home"].navegacao.saidas`, cada uma com a instância/elemento de origem e destino existentes. Criados **5 espelhos de entrada** nas três telas de destino. Nenhuma outra tela/componente modificado.
- `modulos/fluxo/visualizacao_fluxo/js/motor.js`: a prévia interpreta exclusivamente as saídas da própria tela (`navegacao.saidas`), deriva o mapeamento clique→destino em memória, distingue três botões com destino comum pelos refs dos elementos e permite Voltar pelo histórico existente.
- `modulos/fluxo/visualizacao_fluxo/index.html`: botão **Testar Home** para abrir diretamente a prévia, inclusive quando a Home não está entre os cartões visíveis do grafo.
- `modulos/jornadas/data/documento.json`: **inalterado**, pois Jornada define a tela e os componentes; Fluxo é o proprietário das rotas.
- `Dados_Motor_V4/documento.json`: **inalterado**; os cinco destinos foram encontrados nele e serviram de referência documental, não de regra executável automática.

## Destinos de ensaio

| Origem (elemento) | Destino | Situação |
|---|---|---|
| `screen.header / app_header.e001.chrome.016` | `notificacoes.lista.notificacoes` | Candidata |
| `screen.hero / hero_restricted.e005` | `advogado.configuracao.validacao_oab` | Candidata |
| `screen.actions / actions.e007` | `advogado.clientes.detalhe_solicitacao` | Candidata |
| `screen.actions / actions.e016` | `advogado.clientes.detalhe_solicitacao` | Candidata |
| `screen.actions / actions.e025` | `advogado.clientes.detalhe_solicitacao` | Candidata |

O fluxo marca cada ligação `situacao: candidata_pendente_homologacao`. A navegação é **somente ensaio no visualizador do Fluxo**. Não confirma autorização de backend, parâmetros necessários do destino, condições OAB, permissões ou navegação de produção. O protótipo definitivo ainda precisa consumir esse contrato, não copiar destinos para seus próprios dados.

## Como testar

Abra `modulos/fluxo/visualizacao_fluxo/index.html` por servidor local e clique em **Testar Home** (ou em **Visual** na Home, quando disponível). Clique em notificações, validação da OAB ou em um cartão de solicitação e use **Voltar**. O visualizador recupera a tela pelo mesmo JSON do Fluxo. Botões sem destino definido continuam sem navegação e precisam de especificação, não de rota inventada.

## Critérios de integridade

- 110 telas e 387 componentes preservados no módulo Fluxo.
- Cinco destinos existentes e cinco refs exatos de botões encontrados.
- Nenhum modal de navegação artificial reintroduzido.
- Nenhuma alteração nos módulos Jornada, Motor V4, demais arquivos do Projeto 9 ou suas fontes históricas.
- Sintaxe JS e integridade dos ZIPs verificadas; teste visual da interação em navegador conforme resultado registrado na resposta.
