# Advogado Já — Projeto 9: telas independentes em HTML autocontido

**Fonte:** `Projeto_9.zip`

**Quantidade:** 110 telas, extraídas de `modulos/jornadas/data/documento.json` (110 contratos da coleção). O motor de montagem foi extraído de `modulos/jornadas/js/motor.js`, e incorporado em cada HTML com os componentes e estilos utilizados por aquela tela.

**Distribuição por área:** admin: 15, advogado: 41, auth: 13, cliente: 21, escritorio: 7, estudante: 11, notificacoes: 2.

## Como utilizar

1. Extraia o ZIP.
2. Abra `index.html` com seu navegador: selecione a área, pesquise, alterne mobile/ampliada e clique em uma tela.
3. Ou abra individualmente qualquer `telas/**/P9_XXX_*.html` — os estilos e componentes são internos.

## Origem e diferenciação da V1

- Esta exportação usa os **110 contratos completos** da coleção do Projeto 9, e não somente os **78 registros da pasta auxiliar `docs/auxiliar/telas_v1`**, que reproduzem o material da V1. Assim, o pacote tem telas que não estão no inventário anterior.
- Nenhuma tela foi mesclada, eliminada ou renomeada em seu ID canônico. Os IDs `P9_001` até `P9_110` servem apenas para triagem.
- Mantidas identidades, composição estrutural por `paiRef`, ordenação, CSS, tokens, componentes e estados visuais definidos nos contratos.
- Recursos visuais das definições estão embutidos (não precisam de internet). Botões e caminhos externos são **simulados**, sem acesso ao backend/Flutter.
- Os formulários são exibidos, mas o envio é interceptado em pré-visualização para não transmitir informações.
- Duas telas de notificações declaram menus que variam conforme o perfil; para visualização inicial isolada foi selecionado o menu `advogado`, preservando as demais alternativas no inventário e na composição da tela.
- Algumas telas são propostas/legados e não representam aprovação funcional ou homologação de produção, conforme o README canônico do Projeto 9.

## Arquivos principais

- `index.html`: navegação e visualização das telas offline.
- `inventario_telas.json`: ID original, arquivo HTML gerado, área, componentes, origem e eventuais avisos.
- `telas/`: 110 arquivos HTML autocontidos, agrupados por caminho declarado no contrato.


## Índice reorganizado por jornada

O `index.html` apresenta as telas na ordem: públicas e acesso → cadastro → área do usuário (onboarding, home, funcionalidades, perfil, assinaturas, configurações) → administração → notificações.

Foram incluídas 1 telas complementares **propostas**, não presentes na origem. Elas são demos visuais offline, sem autenticação real. O acervo original de 110 telas foi preservado.
