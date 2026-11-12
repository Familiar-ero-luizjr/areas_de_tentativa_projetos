# Documento Base — pacote de integração

**Pasta exportada:** somente `Documento_base/`, sem a estrutura maior dos Projetos 7 e 8.

## Módulo principal

- `index.html`: editor de seções original do Projeto 8, preservando o mesmo HTML e CSS, com navegação adicional aos dois submódulos. Inclui os dados do `documento.json` e o JS no HTML para abrir por arquivo local sem servidor.
- `documento.json`: fonte documental original, sem mudanças no conteúdo. Quando servido via HTTP, `index.html` prioriza este JSON externo; no modo `file://`, usa a cópia interna como alternativa.
- `app.js`: mesma implementação original com fallback de leitura local. `app_original.js`: cópia imutável do JS da origem.
- `trabalho_estrutural/`: preservado integralmente.

## Submódulos

### `contrato/` — Projeto 8

- `index.html`: HTML autocontido, com **o mesmo DOM, CSS e JS da aplicação original**, e os quatro conjuntos de dados JSON embutidos em memória (telas, modelo, glossário e documentação). Abre por `file://`.
- `index_modular_original.html`: entrada original que carrega arquivos por `fetch`, indicada para servidor local; `conector/`, `dados/`, `telas/` e `visualizador/` foram preservados integralmente para edição e futura integração.
- As três abas originais continuam disponíveis: Modelo explicado, Home do Advogado e Documentação.

### `modelo_mestre/` — Projeto 7

- `index.html`: motor autocontido e editável com a árvore, painéis e CSS originais. Link «Laboratório» volta ao Documento Base.
- `index_original.html`: HTML de origem integral, sem alterações.
- `referencias/`: referências estruturais originais do Projeto 7.
- Os itens da navegação para motores externos ao Modelo Mestre apresentam aviso em vez de abrir caminhos ausentes. Os demais módulos do Projeto 7 não foram copiados, por não fazerem parte do escopo.

**Observação:** não houve unificação dos contratos JSON nem migração automática entre os dois módulos. Os dados e a lógica de cada um foram mantidos independentes.
