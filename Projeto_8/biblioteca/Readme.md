# Biblioteca modular — AdvogadoJá+

A biblioteca é um módulo independente. O menu principal preserva as seis telas e a área Global de componentes, com abas **Tela/Padrões**, **JSON**, **Componentes**, **Visuais** e **Documentação**.

## Organização

- `index.html`: índice e navegação principal com CSS da interface.
- `app.js`: leitura dos JSONs locais e lógica de prévias, menus, simulações e exportações.
- `<Tela>/index.html`: entrada direta da tela, com CSS da interface.
- `<Tela>/documento.json`: contrato completo da respectiva tela (`tela` + `componentes`), incluindo HTML e CSS necessários à montagem.
- `Global/Componentes/index.html`: entrada direta para a biblioteca de componentes.
- `Global/Componentes/documento.json`: catálogo das definições de componentes e elementos atômicos encontrados nas seis telas.

## Identidades e edição

Cada contrato mantém os IDs existentes para seus elementos, componentes e telas. Para mudar o visual de uma tela, altere apenas seu `documento.json`. Para adicionar uma tela ao menu, crie sua pasta e registre nome, ID e caminho no manifesto `LAB_MANIFEST` em `app.js`.

O catálogo Global reúne cópias de consulta das definições dos componentes, com a tela de origem registrada por ID. Alterar um registro no Global **não atualiza automaticamente** as seis telas; qualquer propagação futura por ID deve ser uma operação explícita.

## Execução

Execute por GitHub Pages ou servidor HTTP local, por exemplo: `python -m http.server 8000`, abrindo `http://localhost:8000/BIBLIOTECA/` a partir do diretório que contém `BIBLIOTECA`. Também é possível abrir diretamente um `index.html` interno pelo servidor.

Se o navegador abrir o HTML pelo disco (`file://`) e bloquear a leitura de JSON, o editor oferecerá a seleção da pasta `BIBLIOTECA` para carregar os contratos localmente. Não precisa de backend nem de serviços externos.

A prévia permite navegação interna de menus e mudanças de estado locais; ações externas apenas mostram o destino simulado. Os contratos são consultados e exportados, não gravados automaticamente.
