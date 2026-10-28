# Contrato de estrutura dos módulos — Workspace V6

## Objetivo
Todos os 12 módulos são independentes. **Cada módulo possui `index.html`, `style.css`, `app.js`, `motor.js`, `README.md`, `AGENTS.md` e `manifesto.modulo.json`**. Auxiliares de renderização, resolução, leitura e validação pertencem exclusivamente ao módulo que os utiliza.

## Navegação e subabas
O menu global troca de módulo, mas deve ser implementado com os arquivos **locais**; o submenu é interno de cada módulo (p. ex. diagramas do Banco, experiências do Protótipo). Um módulo não depende do CSS/JS de outro.

## Fonte dos dados
Somente `catalogo/indice.json`, os JSONs ativos de telas e os JSONs de componentes são compartilhados. Documentos auxiliares locais podem existir nos módulos de documentação e questionário. `acervo_pendente` nunca é consumido automaticamente. Mocks declarados nos contratos são permitidos para cenários no Protótipo; o Banco **não** usa mock nem entidades históricas.

## Responsabilidades
- Catálogo: contratos e montagem.
- Jornadas: participações e agrupamentos.
- Flow: conexões efetivamente declaradas em `acoes`, sem coordenadas nos JSONs.
- Protótipo: simulação HTML/CSS com Experiência, Configuração, Dados, Estados, Eventos, Telas, Sequências, Relações, Percurso e Motor/JSON. Sequências e notas são locais.
- Banco: projeção de `dados` com entidades/campos/relacionamentos quando declarados. Não inventa SQL.
- Mapa de Interações: operações e efeitos, não navegação duplicada.
- Demais módulos: leitura, planejamento, auditoria e transporte dos contratos.

## Validação obrigatória
1. Confirmar estrutura dos sete arquivos obrigatórios e que o manifesto corresponda à implementação.
2. Verificar links relativos e imports privados. Servir a raiz por HTTP.
3. Verificar que nenhuma operação grava dados derivados sobre telas sem confirmação.
4. Verificar o comportamento real de estados vazios; a ausência de dados não autoriza inventá-los.
5. Distinguir capacidades presentes de objetivos e propostas nos READMEs e AGENTS.
