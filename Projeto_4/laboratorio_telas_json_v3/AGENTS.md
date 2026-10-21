# AGENTS — Laboratório de telas JSON V3

## Objetivo

Construir, modificar e testar telas do Advogado Já unicamente por JSON, mantendo motor HTML/JS universal e HTML final autocontido. As telas não devem ser programadas diretamente no JavaScript nem inseridas como strings HTML no JSON.

## Regras obrigatórias

1. A fonte da definição das telas é `dados/conteudo.json`, no contrato `advogadoja-laboratorio-telas-v2`.
2. Toda composição visual deve existir em `telas[id].estrutura.fragmentos[].arvore`, com IDs únicos. **Proibido introduzir `template` HTML**.
3. Estilos específicos de tela ficam em `estilos` dentro do JSON; `estilos/tema.css` configura somente o laboratório.
4. Ações pertencem ao catálogo `acoes`; interações referenciam `acaoRef`. Não codifique `if (id da tela)` para implementar navegação ou apresentação visual.
5. Variáveis de conteúdo devem ser preferencialmente vinculadas por objetos `{ "ref": "dados..." }`, em vez de duplicadas em diversos nós.
6. O motor deve criar elementos por DOM nativo, sem `innerHTML` para renderizar JSON importado.
7. Nenhum backend, autenticação ou serviço remoto durante a simulação; dados em `mocks` são fictícios.
8. O HTML final deve conter os dados e recursos necessários à execução offline.
9. Antes de exportar, valide JSON, renderização de Entrar e Home Profissional, edição de nó, ação, mock, exportação individual/seletiva/completa, importação sem perda de telas, e ausência de requisições externas.
10. Preservar as referências visuais da biblioteca V2 e distinguir alterações experimentais de sua linha de base original.

## Mudanças desejadas

- Para texto, preferir atualizar a referência em `dados` ou a folha do nó em `estrutura`.
- Para reposicionar um ícone, atualizar `estilos.elementos[id]`.
- Para substituir clique por pop-up, atualizar `acoes` e `interacoes`.
- Para nova tela, inserir `telas[id]` e seus fragmentos; nunca acrescentar um branch fixo por tela em `02-renderizador.js`.

11. A aba Árvore JSON deve ler **o mesmo objeto em memória `projeto.telas`** usado pelo renderizador e editor; não criar duplicatas independentes.
12. Exportações e importações de telas utilizam `advogadoja-laboratorio-telas-v2-export`, com tipo `tela` ou `colecao` e dependências (`mocks`, `assets`).
13. Antes de atualizar telas importadas com IDs existentes, exigir confirmação explícita; opção segura padrão: preservar existente. Não excluir telas ausentes do arquivo importado.
14. Preservar compatibilidade com o contrato original V2. O nome V3 designa a interface do laboratório e o fluxo de importação/exportação, não uma migração destrutiva do JSON de cada tela.

Consulte `CONTRATO_JSON.md` para esquema, exemplos e limites.
