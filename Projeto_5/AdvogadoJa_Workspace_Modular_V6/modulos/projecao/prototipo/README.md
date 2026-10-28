# Protótipo — Workspace V6 · dois submódulos reais

## Objetivo
O Protótipo é composto por **dois laboratórios independentes**, adaptados ao Projeto 5 com HTML, CSS e JS. O `index.html` desta pasta é somente o seletor de entrada. Não existe mais a alternância interna entre perspectivas num único motor.

| Laboratório | Responsabilidade | Pasta |
|---|---|---|
| Modular V2 | Experiência, sequências, relações, percurso, apresentação | `modular-v2/` |
| Cliente Interativo V3 | Telas HTML, dados, preenchimento, estados, eventos e rastreio | `cliente-v3/` |

Cada submódulo tem `index.html`, `style.css`, `app.js`, `motor.js`, `catalogo.js`, `montagem.js`, `resolvedor.js`, `regras.js`, `ui.js`, `README.md`, `AGENTS.md` e `manifesto.modulo.json` próprios.

## Fonte única
Ambos leem `catalogo/indice.json` e registros indexados de `catalogo/telas/` e `catalogo/componentes/`. Não carregam diretamente os arquivos HTML do Projeto 6, nem o acervo pendente. **Mocks de cenários** só existem quando declarados em `mocks.cenarios` das telas canônicas.

## Instruções
Abra a raiz do Workspace por HTTP usando `python iniciar.py`, navegue para Protótipo pelo menu e selecione um dos dois laboratórios. GitHub Pages também pode servir a aplicação em modo leitura/simulação.

## Limitações atuais
A referência funcional é o Projeto 6, mas a origem canônica do Projeto 5 tem cinco telas. Recursos dependentes de telas ausentes não devem ser artificialmente completados. Somente ações declaradas definem rotas funcionais; sequências editoriais não são rotas. No futuro, os dois laboratórios poderão evoluir independentemente com seus contratos.
