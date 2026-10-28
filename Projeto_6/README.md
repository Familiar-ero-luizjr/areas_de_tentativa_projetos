# Projeto 6 — Advogado Já · Laboratórios de protótipos

Este projeto reúne dois protótipos HTML autocontidos e um índice de acesso, preservando as versões recebidas.

## Abrir

Abra [index.html](./index.html) para escolher o laboratório. Os três HTMLs ficam na mesma pasta e usam links relativos.

- [Laboratório Modular V2](./AdvogadoJa_Prototipo_Laboratorio_Modular_V2.html) — simulação de jornadas de cliente e advogado, estados, sequências e relações.
- [Laboratório Cliente Interativo V3](./AdvogadoJa_Laboratorio_Cliente_Interativo_V3.html) — telas da jornada cliente, dados e mocks, preenchimento dos campos vazios, estados e eventos simulados.

## Execução e publicação

Os arquivos são autocontidos, podem ser abertos localmente e também publicados como páginas estáticas no GitHub Pages. Ao usar `file://`, a persistência do navegador pode variar. Para uma origem estável, execute a raiz do repositório com `python -m http.server 8000` ou acesse o projeto pelo GitHub Pages.

O menu `index.html` apenas abre cada laboratório; seus estados internos e armazenamento não são compartilhados entre os dois protótipos.

## Manutenção

As versões V2 e V3 foram copiadas sem alterações. Para substituir qualquer HTML ou adicionar outra versão, atualize o índice do Projeto 6 e mantenha o catálogo raiz apontando para `Projeto_6/`. Consulte [AGENTS.md](./AGENTS.md).

Não insira dados pessoais verdadeiros nem credenciais de produção nas simulações.
