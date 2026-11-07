# Projeto 8 — Migração estrutural das telas de Jornadas

**Status:** migração técnica concluída; homologação visual e funcional pendente.
**Base de origem:** 50 arquivos de `JORNADAS/telas/advogado/` e `JORNADAS/dados/manifest.json`.
**Escopo:** apenas o módulo `Projeto_8/JORNADAS`.

## O que mudou

- Foram substituídos os **50 JSONs de tela** pelos contratos `{ "<telaId>": { "tela": {...}, "componentes": {...} } }` nos **mesmos caminhos**.
- As participações em jornada/subjornada migraram de `navegacao.participacoes` para `tela.classificacao.jornadas`. Nenhum vínculo de jornada foi inferido fora da fonte.
- A navegação passou a usar `rotas`, `relacoes` e `bifurcacoes`. As **79 arestas documentais** de `manifest.fluxoFonte.arestas` foram atribuídas às telas de origem; saídas de estados internos permanecem vinculadas à tela contextual.
- O HTML foi convertido em árvore de elementos por componente: `estrutura.html.elementos` contém `tag`, `paiRef`, `ordem`, `atributos` e `texto`. Nós `#text` conservam o conteúdo textual e a ordem de composição. Marcação de comentários e declarações também é suportada.
- O CSS integral de cada tela foi preservado no componente visual `estrutura.css.regras["css.origem"]`; as imagens e dados embutidos no HTML foram preservados nos atributos.
- Mantiveram-se os dados documentais existentes em `acoes`, `estados`, `dados`, `variantes` e `mocks`, sem transformá-los em comandos executáveis.
- `conector/montador.js` projeta a estrutura canônica para o visualizador estático existente; a árvore de telas usada na interface não é restaurada ao formato antigo em disco.
- `visualizador/app.js` mostra o contrato canônico nos detalhes e exporta os JSONs canônicos quando presentes; importações antigas continuam compatíveis.

## Sem mudanças nesta rodada

- Não foram alterados `CONTRATO`, `PROTOTIPO`, `BANCO` ou `htmls_autocontidos`.
- Não foram inventadas permissões, validações, condições, rotas de produção nem endpoints.
- A Jornada continua **visualização estática**: a prévia usa `iframe` e bloqueia eventos de clique/toque nos elementos da tela. Isso é uma limitação do visualizador, não do JSON.
- As relações existentes no `fluxoFonte` permaneceram no manifesto como fonte de rastreabilidade.

## Validações de dados

- 50 arquivos JSON convertidos e preservados no mesmo inventário do manifesto.
- 79 relações mapeadas a seus nós e telas de origem; identificadores de ligação derivados de origem, destino e alternativa.
- Bifurcações apontam para relações do respectivo contexto; estados não receberam telas fictícias.
- Estruturas HTML balanceadas durante a conversão; componentes mantêm CSS e atributos originais.
- O carregamento efetivo em navegador, equivalência visual em múltiplos dispositivos, importação/exportação no navegador e controle de regressão precisam de teste de execução antes de declarar o módulo homologado.

## Atenção sobre dados locais

O visualizador antigo pode priorizar uma jornada importada anteriormente via `localStorage` sob a chave `advogadoja.jornadas.v3`. Se a página continuar mostrando dados antigos depois da atualização, remover essa entrada local e recarregar para utilizar os novos contratos do manifesto.
