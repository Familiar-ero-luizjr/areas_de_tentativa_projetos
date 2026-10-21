# Decisões arquiteturais

**Arquitetura com duas perspectivas, que não devem ser confundidas:**

| Vista de manutenção | Vista de entrega |
|---|---|
| Arquivos `.css`, `.js`, `.json`, `.html` por responsabilidade e por projeto | Um arquivo `nome.html`, com conteúdo, CSS, JS e dados embutidos |
| Fácil alterar partes sem reescrever tudo | Fácil transportar, abrir offline e enviar a outra pessoa |
| Módulos/fonte possuem nenhuma dependência em código de outro projeto | Nenhuma dependência obrigatória em outro arquivo, CDN, servidor ou banco |

**Localização por responsabilidades:**

`dados` → JSON estável por ID; `interface` → semântica e placeholders; `estilos` → aparência; `estado/índices` → relacionamentos; `componentes` → interface reativa; `busca` → indexação e consultas; `ações` → eventos, importação/exportação.

**Otimização:** volume grande em si não torna busca rápida. O gerador inclui `Map` para ID e filhos, texto normalizado uma vez, lista paginada, busca em lotes de 500 e criação progressiva de até 100 nós por ramo. Para acervos realmente gigantescos, o agente deve evoluir o índice e a compactação específica do caso e verificar desempenho real. Não considerar esta demo prova de escalabilidade irrestrita.

**Dados importados:** a importação local é uma ação temporária no browser. Para incorporar alterações ao HTML autocontido, exportar JSON, atualizar `dados/conteudo.json` e recompilar. O comando não tenta reescrever o próprio arquivo HTML aberto no browser.

**Referências observadas:** o padrão de visualizador de árvore autocontido incorpora a ideia de conteúdo separado do shell, busca por nome/caminho/conteúdo e carregamento sob demanda presente nos HTMLs de referência do projeto, mas não reproduz seus dados nem afirma identidade funcional com o seu repositório original. É um padrão geral, sem dependência do AdvogadoJá.
