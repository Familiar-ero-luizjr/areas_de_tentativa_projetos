# AGENTS.md — Banco do Workspace V6

1. A fonte de dados é exclusivamente o catálogo canônico ativo; acervo, Projeto 1 e mocks não são consultados.
2. Não criar `mock.js`, `flow` nas telas, modelagem paralela nem um motor global.
3. O motor **projeta** entidades, campos e relacionamentos **declarados**, nunca os inventa. Divergências e campos ausentes geram avisos.
4. O menu superior troca de módulo; o menu lateral é o submenu privado do Banco.
5. Manter HTML, CSS, JS, motor e carregador dentro desta pasta. Preservar a acessibilidade dos controles e a opção Motor/JSON.
6. Antes de propor geração de SQL, precisar de contrato explícito de tipos, chaves, cardinalidades, índices e integridade.
7. Testar por HTTP: catálogo ativo, estado vazio, exportação, navegação, diagrama e inspector, quando houver informações suficientes.
