# Laboratório Modular V2 — Protótipo do Workspace V6

## Responsabilidade
Percursos, sequências, relações e apresentação. É um laboratório HTML/CSS/JavaScript **independente** de seu irmão: sua pasta contém motor, resolvedor, montagem e leitura próprios.

## Origem dos dados
Lê somente `catalogo/indice.json`, `catalogo/telas/` e `catalogo/componentes/` pelo `catalogo.js` local. Não carrega HTML, dados ou rotas históricas do Projeto 6. Usa `mocks.cenarios` apenas dos contratos ativos para simular estados e resultados; não executa autenticação, banco nem APIs reais.

## Ferramentas disponíveis
- ◉ Experiência
- ⇄ Sequências
- ⌁ Relações
- ☷ Percurso
- ⚙ Apresentação
- { } Motor / JSON

## Limites
Os laboratórios de referência do Projeto 6 contêm muito mais telas; aqui as operações que dependem delas ficam limitadas às **cinco telas canônicas**, sem inventar etapas. As notas de relação e sequências editoriais não alteram rotas reais. Importação/exportação transfere só a sessão local.

## Regras
Leia `AGENTS.md`, teste as ações e a abertura por HTTP. Não importe arquivos JS/CSS de outros módulos. O menu geral permanece no próprio HTML; o submenu apenas alterna entre os dois laboratórios.
