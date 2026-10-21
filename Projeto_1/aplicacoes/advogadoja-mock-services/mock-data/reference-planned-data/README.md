# Mocks — AdvogadoJá+

Pasta criada a partir do **modelo de dados de `index(1).html`**. Os arquivos `.mock.js` anteriores foram usados somente como referência de formato (`window.MOCKS = window.MOCKS || {};`).

## Cenário principal

- 2 clientes: `client-001` e `client-002`.
- 4 advogados: `lawyer-001`, `lawyer-002`, `lawyer-003`, `lawyer-004`.
- `lawyer-001` é advogado independente, sem vínculo com escritório.
- `lawyer-002` é owner de `office-001`.
- `lawyer-003` foi convidada por `lawyer-002` e **aceitou**; é membro ativo.
- `lawyer-004` foi convidado por `lawyer-002` e o convite está **pendente**.
- O owner e o membro aceito aparecem em `law_offices/{officeId}/members/{uid}`. O advogado com convite pendente fica em `office_invites` e possui `officeMembershipStatus: "pending"`.

## Regra do `id`

Cada documento do mock possui uma propriedade `id` apenas para facilitar uso no front-end. Ela representa o **ID do documento** (`uid`, `requestId`, `officeId`, etc.) e não é um campo adicional do modelo Firestore descrito no HTML. Todos os demais campos seguem o índice.

## Estruturas que não são coleções

`structures.mock.js` contém exemplos de `address` e `location`. Elas são estruturas reutilizáveis do índice, não tabelas/coleções independentes. `firebase-auth.mock.js` representa o registro técnico do Firebase Auth e também não é uma coleção Firestore.

## Organização

Há um arquivo para cada coleção/subcoleção persistente do índice, além de `structures.mock.js`, `firebase-auth.mock.js`, `manifest.json` e `load-order.js`. Os IDs foram mantidos coerentes entre usuários, clientes, advogados, escritório, convites, solicitações, eventos, contatos, avaliações, notificações, suporte, financeiro, privacidade, auditoria, sessões e migração.

## Uso

Carregue os `.mock.js` antes dos scripts que consomem `window.MOCKS`. O arquivo `load-order.js` lista a ordem sugerida.


## Enriquecimento pelo ambiente.zip

Este pacote possui uma revisão aditiva baseada no `ambiente.zip`. Veja `ENRIQUECIMENTO_AMBIENTE.md` para a lista de campos e opções acrescentados. Nenhum campo anterior foi removido ou renomeado.
