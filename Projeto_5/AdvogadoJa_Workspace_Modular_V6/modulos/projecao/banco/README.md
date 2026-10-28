# Banco — módulo independente do Workspace V6

Este módulo reproduz o **Banco visual** aprovado no laboratório, preservando o desenho de diagramas, tabelas, zoom, filtros, SQL e inspetor. A referência completa está no arquivo `referencia_visual_mock_autocontida.html`.

## Arquivos
- `index.html`: interface, com menu superior de módulos e submenu de Banco.
- `style.css`: CSS integral de modelagem e estilos do menu do Workspace; sem CSS externo.
- `app.js`: ações e renderização SVG, filtros, inspeção, modos e exportação.
- `motor.js`: motor local de relações, classificação, consultas e rastreabilidade.
- `mock.js`: 12 tabelas, 14 relações, cinco interfaces e SQL *fictícios*.
- `referencia_visual_mock_autocontida.html`: referência visual original e isolada, não é usada pelos motores.
- `AGENTS.md`: orientações de manutenção.

## Menus independentes
1. **Menu geral do Workspace:** no cabeçalho, troca entre os 12 módulos.
2. **Submenu do Banco:** na lateral (ou botão de menu no celular), alterna Visão geral, Diagramas, domínios, Relacionamentos, interfaces, tabelas e SQL.

## Modos
O padrão é **Modo mock**. O botão **Catálogo (futuro)** é apenas reserva visual e não busca qualquer JSON do Catálogo, das cinco telas ou do legado. **Nenhuma tabela real/histórica está incluída.**

## Execução
Abra via servidor HTTP (p.ex. `python iniciar.py` na raiz do Workspace) ou GitHub Pages. Como há módulos JS locais (`type="module"`), abrir apenas o `index.html` com `file://` pode falhar. O arquivo `referencia_visual_mock_autocontida.html` preserva a demonstração original que abre diretamente.

## Próxima fase
Somente após aprovação visual, discutir um resolvedor próprio que leia `catalogo/indice.json` e as declarações em `dados` das telas canônicas. Não sincronizar funções entre módulos e não inferir entidades, cardinalidades ou campos não declarados.
