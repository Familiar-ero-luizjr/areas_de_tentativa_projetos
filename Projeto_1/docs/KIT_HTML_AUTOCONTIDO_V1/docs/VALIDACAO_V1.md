# Validação técnica V1 — 16/10/2026

## O que foi testado

- Criação de projeto independente pelo scaffolder Python (`novo_html.py`).
- Compilação e recompilação determinística dos três exemplos: árvore, catálogo de módulos e painel genérico.
- Integridade do JSON embutido (schema, ids estáveis, sem ciclos e relacionamentos existentes), inclusive escape seguro do bloco de dados.
- HTML sem imports de scripts e folhas externas; todos os scripts, estilos e dados no arquivo final.
- Validação de sintaxe JavaScript com Node.js.
- Chromium headless: renderização dos 3 exemplos, busca, filtros, abertura de nós, detalhes, exportação JSON, ausência de erros JS e ausência de chamadas HTTP.
- Chromium headless: importação por ID (atualiza registros existentes, insere novos e preserva os demais).
- Chromium headless: índice e busca com 9.020 itens, resultado correto. Neste ambiente, a busca final levou cerca de 0,27 segundo (não é benchmark universal).

## Limite dos testes

O navegador automatizado deste ambiente bloqueia abrir diretamente `file://` via navegação (`ERR_BLOCKED_BY_ADMINISTRATOR`); a execução no Chromium foi feita com `page.set_content` do HTML já compilado, sem recursos externos. Esse teste confirma que o HTML embarcado funciona sem requests, **mas não é um teste direto de abertura por duplo clique no ambiente Windows**. A arquitetura não requer servidor nem fetch, então foi planejada para `file://`.

O gerador genérico de `aplicacao` entrega um **painel exploratório de cards e dados**, e não um sistema com regras de negócio completas. Para aplicações especializadas, usar o agente e implementar telas/ações concretas nas fontes locais.
