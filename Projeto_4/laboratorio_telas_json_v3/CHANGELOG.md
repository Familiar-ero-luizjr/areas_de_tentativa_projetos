# Histórico

## 3.0.0 — 20/10/2026

- Criada a terceira aba principal **Árvore JSON**, independente do simulador e do inspetor.
- Árvore JSON por tela com abertura sob demanda, busca por caminho/chave/valor e inspeção de detalhes.
- Exportação individual, por seleção, completa (todas as telas) e preservação do exportador de projeto V2.
- Envelope portátil com `mocks` e `assets`, e importação com validação, prévia de conflitos e política segura de preservação.
- Compatibilidade mantida com os mesmos nós declarativos do contrato V2.
- Testes automatizados de integridade, navegação, árvore, exportações e importações.


## 2.0.0 — 20/10/2026

- Migração do protótipo de três telas da V1 para árvore JSON de nós DOM explícitos.
- Remoção de `fragmentos[].template` e da expansão de HTML por moustache em tempo de execução.
- Implementação de DOM builder universal sem `innerHTML` para nós importados.
- Catálogo `acoes` desacoplado de `interacoes` por `acaoRef`.
- Vínculos de dados `ref`, `partes` e de estados declarados nos nós JSON.
- Edição de texto alterando `dados` ou `estrutura`; atributos CSS e deslocamentos no bloco `estilos`.
- Validação de nós, IDs e referências; importação/exportação de JSON.
- Preservação visual comparada com a V1 e testes funcionais no Chromium.

### Limitação conhecida

Itens repetidos da V1 foram materializados como nós JSON individuais; inserir novo elemento de lista exige alterar a árvore `estrutura`, além dos dados.
