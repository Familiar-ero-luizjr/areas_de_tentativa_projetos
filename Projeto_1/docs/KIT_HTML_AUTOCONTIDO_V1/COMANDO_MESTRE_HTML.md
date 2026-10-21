# COMANDO MESTRE — CRIAR HTML CANÔNICO

Use este texto como comando rápido para um agente (ChatGPT, Codex ou outra ferramenta de programação) e anexe/instale `AGENTS.md` na pasta do projeto.

> **/html-autocontido** — Crie ou atualize o HTML solicitado seguindo integralmente `AGENTS.md`. Primeiro classifique como aplicação, árvore, módulo, fluxo, catálogo ou outro. Preserve meus dados e design reais. Organize o código-fonte por responsabilidades **na pasta exclusiva deste HTML**, em vez de misturar dados, visual, estado, busca e ações. Entregue **um arquivo HTML autocontido**, funcional offline, com CSS, JS, dados e mídias necessários embutidos, sem dependências externas, sem motor compartilhado com outros módulos. Use IDs estáveis, esquema JSON versionado, interface reativa à fonte, índices de pesquisa, árvore com abertura sob demanda, filtros e paginação progressiva quando houver grandes volumes. Otimize a facilidade de encontrar e substituir trechos, não apenas a contagem de linhas. Não elimine conteúdo nem mude regras sem autorização. Recompile e teste o resultado em navegador, documentando arquivos internos, contratos, pontos de alteração, testes e limitações. Se eu solicitar apenas um HTML, entregue apenas o HTML final; se pedir manutenção evolutiva, inclua também a pasta-fonte. 

## Exemplos de acionamento

- `/html-autocontido Gere uma árvore navegável deste ZIP, com pesquisa por pasta, arquivo e conteúdo.`
- `/html-autocontido Transforme estas telas e fluxos em um HTML de navegação interativa, sem alterar meus dados.`
- `/html-autocontido Crie o módulo Reservas para demonstração independente, com dados e estados separados.`
- `/html-autocontido Acrescente importação JSON ao HTML existente, mantendo IDs e layout.`

## Contrato de saída do agente

1. Arquivo final `<nome>.html` que abre desconectado.
2. Fonte separada e compilável quando a tarefa requer manutenção futura.
3. Resumo objetivo dos componentes, dados, comportamentos, busca e estados.
4. Testes executados, com erros/limitações explicitados.
