# Decisões de componentes — AdvogadoJá+ (V2)

## O que é
`index.html` é um editor/visualizador autocontido. `decisoes_componentes.json` é a fonte canônica inicial, com os três headers escolhidos pelo usuário em 23/11/2026. O HTML contém uma cópia desse JSON, portanto pode ser aberto diretamente no navegador sem servidor.

## Escolha e redução
Cada componente é um modelo independente e recebe `decisao`: `manter`, `candidato` ou `descartar`. `Mantidos · JSON` e `Mantidos · HTML` exportam **somente os mantidos**; `Backup completo` salva todos. `Excluir` remove da galeria local, sem excluir arquivos originais. Os dados ficam no armazenamento local do navegador: para preservar/compartilhar, exporte um JSON. Importar JSON completo usando **Substituir catálogo** substitui as decisões atuais. Usando **Adicionar JSON**, novos componentes são mesclados, sem eliminar as decisões existentes.

## Menu com estados
Em vez de duplicar menu por assinatura/OAB, represente um componente-base com `estados[]`. Cada estado contém `id`, `nome`, `alteracoes.ocultar` (array de IDs dos nós), `alteracoes.texto` (mapa ID→texto) e `alteracoes.atributos` (mapa ID→atributos). O seletor no cartão permite pré-visualizar as alterações sem duplicar o componente. `+ Menu com estados` cria um modelo editável da área Cliente (novo item como **candidato**, não aprovado). O estudante continua uma área adicional do Cliente.

## Três componentes selecionados inicialmente
- P9 · Header Administração (`component.header.application.v2`)
- P9 · Header Cliente (`component.header.application.v1`)
- V1 · Home Advogado (`header.app-header.v04`)

Os modelos de origem foram importados sem mudanças nos elementos HTML e CSS. A decisão `manter` não deve ser confundida com homologação de todas as telas do aplicativo.
