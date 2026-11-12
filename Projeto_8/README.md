# AdvogadoJá — Projeto 8 · Workspace com menu unificado e módulos independentes

## Executar

Executar `python iniciar_local.py` e acessar **http://127.0.0.1:8768/**. O endereço é apenas um servidor **local** para permitir que o navegador leia os arquivos JSON na mesma pasta; não faz nenhuma chamada de rede a serviços externos.

Também é possível copiar **somente** `BANCO/`, `FLUXO/`, `JORNADAS/` ou `PROTOTIPO/` para outro local e executá-lo como site estático. Cada pasta contém `index.html`, `script.js` e `modulo.json`: nenhuma consulta à biblioteca editorial ou a outras pastas é executada. Se abrir `index.html` diretamente com `file://`, o navegador pode bloquear `fetch()` local; use o seletor de **modulo.json** exibido na própria página. Não há qualquer duplicação do JSON dentro do HTML.

## Estrutura

- `biblioteca/ui_library/conteudo/telas/`: fonte editorial consolidada, com 110 registros de telas; 12 estão claramente marcados como **rascunhos sem HTML/CSS homologados**.
- `biblioteca/mocks/simulacoes.json`: cinco cenários e 12 roteiros fictícios originais, além de dados de simulação.
- `BANCO/modulo.json`: snapshot completo e independente para projetar campos, entidades, relacionamentos e operações; nenhuma tabela é inventada.
- `FLUXO/modulo.json`: snapshot completo e independente para examinar e editar relações entre telas.
- `JORNADAS/modulo.json`: snapshot completo e independente para organizar jornadas, ver as telas e inserir participações.
- `PROTOTIPO/modulo.json`: snapshot completo e independente com os mocks, roteiros e telas para simulação local.
- `auditoria/`: comparação tela por tela, fontes, mudanças, pendências e testes.

A biblioteca não é acessada em tempo de execução por nenhum módulo. A **replicação é um snapshot intencional no momento da exportação**, não sincronização entre módulos. Cada JSON tem um único conjunto local de contratos de telas. Alterações realizadas em um módulo permanecem naquele módulo até serem exportadas e consolidadas explicitamente.

## Estado de homologação

Esta versão é um **primeiro ciclo de normalização técnica/funcional**; não equivale à aprovação de cada uma das 110 telas, nem das regras de negócio. Os HTML/CSS das 98 telas originais foram preservados. O Protótipo acrescentou dados de formulário, eventos documentais e referências de mock; componentes marcados como rascunho são apenas um suporte de inspeção. O Banco pode mostrar dados de UI, mas persistência e tabelas de produção só aparecem após declaração explícita.

## Processo de revisão

1. Comparar `auditoria/AUDITORIA_TELA_A_TELA.csv` com a biblioteca.
2. Priorizar os 12 rascunhos e as 51 telas com dados enriquecidos.
3. Homologar estados, eventos e ações por tela; separar HTML, CSS e comportamento conforme Direção V5.
4. Exportar de um módulo quando alterado e incorporar à biblioteca editorial via revisão explícita; **não sobrescrever silenciosamente** os outros módulos.
5. Gerar novamente os snapshots dos módulos quando a biblioteca editorial for homologada.

O projeto original permanece congelado em `Projeto_8.zip`, SHA informado em `auditoria/FONTE_CONGELADA.txt`.


## Menu unificado do Workspace

O `index.html` na raiz é o único responsável pelo menu lateral.
`workspace/menu.json` contém os módulos Documento Base, Banco, Contrato JSON, Fluxo, Jornadas e Protótipo e seus subitens reais.
O documento possui um índice de 52 seções (agrupadas) e Trabalho estrutural reúne seu índice de comparação e os dois catálogos HTML autocontidos.

Ao carregar um módulo dentro do Workspace, `workspace/embedded.css` oculta seus menus de navegação internos e sua marca duplicada; as ações funcionais (importar/exportar, filtros, controles de fluxo, edição) permanecem no conteúdo. As páginas independentes continuam abrindo normalmente fora do Workspace.

Não é necessário manter abas ou botões de módulos no cabeçalho. A navegação e o estado selecionado são geridos no `workspace/app.js`. Alterações na lista de jornadas/roteiros após importar dados locais são refletidas no menu.
