# Banco — Workspace V6 · Projeção canônica

## Fonte única e funcionamento
O Banco **não utiliza mock, HTML histórico, tabelas fictícias ou catálogo paralelo**. `catalogo.js` carrega exclusivamente `catalogo/indice.json` e os JSONs nele indexados. `motor.js` consolida `dados.persistencia`, `dados.operacoes` e `dados.fontes`, registra referências e avisa se houver dados insuficientes.

A interface mantém o design do laboratório de Banco e o submenu local: Visão geral, Diagrama DER/UML, Relacionamentos, Telas → Entidades, Dicionário, SQL e Motor/JSON. O menu global do Workspace continua no cabeçalho.

**Limite fundamental:** as cinco telas de laboratório não declaram atualmente um modelo completo de entidades. É correto mostrar **0 entidades e 0 relacionamentos**, com um estado vazio informativo, e não reaproveitar as 12 tabelas do mock nem as 41 do Projeto 1. O SQL só aparece quando for explicitamente fundamentado; não há geração arbitrária de DDL.

## Arquivos privados
`index.html`, `style.css`, `app.js`, `motor.js`, `catalogo.js`, `README.md`, `AGENTS.md`, `manifesto.modulo.json`. Nenhum arquivo JS/CSS é importado de outro módulo.

## Teste
Executar `python iniciar.py` na raiz do Workspace, abrir este módulo por HTTP, verificar as cinco telas e o aviso de contrato incompleto. Quando houver entidades reais declaradas, testar diagrama, busca, inspetor, relações e exportação com fonte rastreável.
