# AdvogadoJá — Contrato Vivo Modular V1

Origem: HTML autocontido `ADVOGADOJA_CONTRATO_VIVO_ARVORE_E_MOTORES_AUTOCONTIDO (2).html`.

## Estrutura
- `index.html`: hub de navegação
- `master/`, `flow/`, `prototype/`, `map/`, `catalog/`, `database/`, `generator/`, `audit/`: HTML autocontido em cada pasta.

## Preservação
Os módulos preservam os componentes e a lógica do HTML original (incluindo modelos iniciais, subabas, edição, importação de auditoria/JSON e exportação). A navegação lateral agora abre os outros HTMLs em vez de alternar de modo internamente.

## Dados e armazenamento
Cada HTML inclui o contrato de exemplo e a implementação necessária para rodar offline. O projeto editado é exportável/importável em JSON. Eles usam a chave original de `localStorage` (`advogadoja.contrato-vivo.v1`), podendo compartilhar o projeto quando hospedados na mesma origem; em acesso `file://`, o compartilhamento de `localStorage` pode variar conforme navegador. Por isso, não dependa de sincronização automática: exporte o projeto e importe no módulo desejado.

## Catálogo
`catalog/index.html` contém o motor de interface autocontido, não um JSON externo obrigatório. Use os controles existentes de importação/exportação.

## Limitação
É uma separação de distribuição e navegação sem refatorar o JavaScript interno de cada módulo. Cada HTML retém a base comum original, o que aumenta o tamanho total do ZIP, mas evita perder funções durante a divisão.
