# Protótipo HTML — Workspace V6

## Referências do Projeto 6
Integra conceitos dos dois laboratórios: Modular V2 (experiência, sequências, relações, execução automática, apresentação, importação/exportação, percurso) e Cliente V3 (configuração, dados, preenchimento, estados, eventos, inventário e rastreio).

## Fonte real
Lê apenas os cinco contratos ativos e seus componentes por `catalogo.js`; o renderer `montagem.js` gera visualização HTML/CSS isolada em Shadow DOM. Não copia os arquivos gigantes históricos do Projeto 6, não usa Flutter e não cria outra fonte de telas.

## Subabas e perspectivas
Perspectivas **Modular V2** e **Cliente V3**: organizam o trabalho no mesmo módulo. Subabas: Experiência, Configuração, Dados e cenários, Estados, Eventos, Telas, Sequências, Relações, Percurso, Motor/JSON. As sequências, notas de relações e dados editados são temporários e não reescrevem `acoes` nem o catálogo. Exportação/importação gera apenas sessão de laboratório.

## Arquivos
`index.html`, `style.css`, `app.js`, `motor.js`, `montagem.js`, `catalogo.js`, `regras.js`, `resolvedor.js`, `ui.js`, `AGENTS.md`, `README.md`, `manifesto.modulo.json`. Todo código é local.

## Limites
As funcionalidades que no Projeto 6 dependiam de 31+ telas, solicitações e estados específicos não são inventadas; a versão do Projeto 5 tem cinco telas de laboratório. Transições reais só vêm de ações declaradas, e autenticação/API real não é executada.
