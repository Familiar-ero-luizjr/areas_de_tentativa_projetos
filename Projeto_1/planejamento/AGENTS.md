# AGENTS.md — Planejamento/Memória Advogado Já V1

## Missão

Preservar a sequência de trabalho e decisões explícitas do usuário em dados externos, sem inventar funcionalidades.

## Fonte única por responsabilidade

1. `planejamento.json`: fases, etapas, status e jornada principal.
2. `registros.csv`: decisões, hipóteses, perguntas, ideias futuras, riscos e referências.
3. `index.html`/`app.js`/`estilos.css`: visualização e edição local; **não são repositório de dados**.

## Política anti-alucinação

- A proposta de **Home Estudante como área do Cliente** ainda depende de aprovação detalhada. A condição de Estudante vinculada à conta Cliente foi decidida.
- Não converter `proposto`, `a_analisar` ou `em_entrevista` em `confirmado` por inferência.
- Sempre identificar origem, status, ID, jornada e etapa em um novo registro.
- Cada ideia ou pendência precisa continuar visível, mesmo após muitos ciclos.
- Nunca usar credenciais, tokens, dados pessoais reais nem segredos em arquivos públicos.

## Formatos, importação e validação

- Não reutilizar ID; arquivos importados devem manter campos e cabeçalho.
- CSV UTF-8 BOM separado por `;`; respeitar as 13 colunas originais.
- JSON com `schema: advogadoja.planejamento.v1`; etapa com ID estável e um dos estados previstos.
- Antes de salvar no GitHub: rodar `python validar_dados.py` na raiz do pacote.
- Exportar JSON após mudar etapas; exportar CSV após editar registros.
- `snapshot-planejamento.json` é backup e intercâmbio, não substitui os dois arquivos de origem.
- HTML não possui permissão de escrever em arquivos do servidor ou de commitar no GitHub.

## Método de execução

Três jornadas: Cliente (com área Estudante por assinatura) → Advogado → Administrador.
Entrevistar, revisar telas/legado, modelar banco e integrações, validar, atualizar protótipo/inventário/mapa, depois iniciar próxima.
