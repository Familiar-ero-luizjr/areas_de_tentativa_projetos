# AdvogadoJá — Contrato Vivo Modular V1

Origem: HTML autocontido `ADVOGADOJA_CONTRATO_VIVO_ARVORE_E_MOTORES_AUTOCONTIDO (2).html`.

## Estrutura
- `index.html`: hub de navegação
- `master/`, `flow/`, `prototype/`, `map/`, `catalog/`, `database/`, `generator/`, `audit/`: motores HTML autocontidos.
- `jornadas/`: estrutura do novo módulo, sem copiar o visualizador do Projeto 8.
- `biblioteca_telas/ESTRUTURA_FLOW_JORNADAS_V1.md`: regras estruturais de aproveitamento dos dados de fluxo e jornadas.

## Preservação
Os módulos preservam os componentes e a lógica do HTML original (incluindo modelos iniciais, subabas, edição, importação de auditoria/JSON e exportação). A navegação lateral agora abre os outros HTMLs em vez de alternar de modo internamente.

## Dados e armazenamento
Cada HTML inclui o contrato de exemplo e a implementação necessária para rodar offline. O projeto editado é exportável/importável em JSON. Eles usam a chave original de `localStorage` (`advogadoja.contrato-vivo.v1`), podendo compartilhar o projeto quando hospedados na mesma origem; em acesso `file://`, o compartilhamento de `localStorage` pode variar conforme navegador. Por isso, não dependa de sincronização automática: exporte o projeto e importe no módulo desejado.

## Catálogo
`catalog/index.html` contém o motor de interface autocontido, não um JSON externo obrigatório. Use os controles existentes de importação/exportação.

## Limitação
É uma separação de distribuição e navegação sem refatorar o JavaScript interno de cada módulo. Cada HTML retém a base comum original, o que aumenta o tamanho total do ZIP, mas evita perder funções durante a divisão.

## Evolução estrutural de Flow e Jornadas

As relações de fluxo e as participações em jornadas continuam nos campos existentes do contrato de cada tela, especialmente `navegacao`. A única extensão opcional é `navegacao.nosContextuais` para nós sem tela própria que não tenham representação suficiente em `estados`. O modelo estrutural foi atualizado; nenhum contrato real de tela foi migrado e nenhum motor HTML foi fundido ou reescrito nesta rodada. Consulte `biblioteca_telas/ESTRUTURA_FLOW_JORNADAS_V1.md`.
