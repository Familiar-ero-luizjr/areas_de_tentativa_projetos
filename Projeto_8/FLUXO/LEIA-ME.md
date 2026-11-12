# AdvogadoJá — Módulo Fluxo · UX/UI alinhados à referência

## O que foi alterado

- `index.html`: estrutura visual do workspace seguindo `referencia_visual/fluxo_autocontido.html`, com menu único e dois subitens: **Campos utilizados** e **Visualização do fluxo**.
- `script.js`: leitura dinâmica das telas, campos, relações, jornadas, sequências, bifurcações e prévias, sem copiar os dados fixos da referência.
- `modulo.json`: preservado integralmente, sem mudanças nos 110 contratos de tela.
- `referencia_visual/fluxo_autocontido.html`: mantido sem alteração para comparação visual.

## Funcionalidades

**Campos utilizados:** seleção de tela, árvore de propriedades com busca, inspeção da finalidade dos campos, leitura integral do valor JSON, edição explícita de valor com validação JSON e exportação do módulo alterado.

**Visualização do fluxo:** sequência de telas por jornada/subjornada, bifurcações baseadas nas relações declaradas, opções e destinos com navegação, modal de prévia, reordenação de telas dentro da mesma subjornada, remoção confirmada de participação e importação/exportação de JSON.

**Responsividade:** desktop e dispositivos móveis, com seleção por abas no mobile.

## Executar

1. Extraia o ZIP.
2. Abra o terminal na pasta em que ficam `index.html`, `script.js` e `modulo.json`.
3. Rode `python -m http.server 8000` ou outro servidor HTTP estático local.
4. Abra `http://localhost:8000/` no navegador.

O módulo lê apenas `./modulo.json`; não há dependências de CDN ou APIs externas. Se o `index.html` for aberto diretamente por `file://`, navegadores podem bloquear a leitura automática do JSON; nesse caso, use o botão **Importar JSON** e selecione o `modulo.json` da pasta.

## Observações

A **identidade visual e o comportamento de navegação** reproduzem a referência, adaptados ao contrato modular atual. A referência contém um modelo estático e um motor React embutidos; este módulo não transporta os dados estáticos nem o motor legado para a área de trabalho. Alterações de campos e ordenação só persistem após **Exportar JSON** e substituir o `modulo.json` desejado. As prévias dependem da composição visual existente em `componentes` e na estrutura CSS de cada contrato; telas incompletas podem exibir uma prévia parcial.
