# AGENTS.md — Banco (Workspace V6)

## Escopo
Este módulo é um laboratório de interface/estruturas do Banco, com mock local. Alterar somente esta pasta, sem afetar os outros módulos.

## Arquitetura
- **Menu geral** no cabeçalho: alterna módulos do Workspace, implementado localmente em `index.html` e `style.css`.
- **Submenu Banco** lateral: alterna diagramas/domínios/relacionamentos/catálogos/SQL; não deve ser transformado em outro menu global.
- `index.html` é a estrutura; `style.css` é o visual; `app.js` é a interface; `motor.js` é o resolvedor privado; `mock.js` é a única fonte nesta fase.
- Não ler `catalogo/`, `acervo_pendente/` ou modelagem histórica do Projeto 1; não importar `catalogo.js` e `ui.js` do módulo antigo.
- `referencia_visual_mock_autocontida.html` é somente backup da aparência e não fonte funcional da versão modular.
- Não declarar dados fictícios, SQL ou relações como modelagem homologada ou serviço real.
- Preservar zoom, busca, filtros, seleção, inspetor, FK/PK, relações e exportações.

## Validação
- Testar 12 tabelas, 14 relações e cinco interfaces do mock; início em modo mock.
- Testar menu geral e submenu em celular e desktop, Escape, foco e indicadores de página.
- Testar Catálogo (futuro) como placeholder sem `fetch` de JSONs.
- Rodar `node --check` em `app.js`, `motor.js` e `mock.js`, e verificar carregamento por HTTP.
- Futuras integrações com Catálogo deverão ser aprovadas separadamente.
