# Motor do Flow — PROPOSTA V1

## Fonte única por tela

```json
{"flow":{"editor":{"entrypoint":false,"rootSequenceId":null,"occurrences":[{"id":"screen-001","sequenceId":"sequence-001","order":0,"variant":"default"}],"branches":[{"id":"branch-001","sequenceId":"sequence-001","order":1,"title":"Escolhas","paths":[{"id":"path-001","label":"Caminho A","sequenceId":"sequence-002"}]}]}}}
```

O exemplo mostra a estrutura, não os IDs reais do catálogo.

## Separação de responsabilidades

1. **Árvore editorial:** varre `flow.editor` de todas as telas, identifica entrada, insere ocorrências na sequência por `order`, resolve branches e paths. Uma tela pode aparecer em múltiplas ocorrências, cada uma com ID de ocorrência próprio.
2. **Navegação operacional:** deriva arestas da tela proprietária a partir de `acoes.grupos[].acoes[].destino`, `seSucesso.destino`, `seErro.destino`, `rotas[]` e itens `componentes.instancias[].props.itens[].destino`. Nenhuma tela guarda lista `inbound`.
3. **Escrita:** mover, adicionar ou apagar uma ocorrência atualiza somente `flow.editor` do(s) documento(s) afetado(s). Adicionar uma conexão operacional edita ação da tela de origem; apagar uma conexão remove/edita aquela ação, não um `graph.edges` separado.
4. **Projeção:** árvore renderizada, grafo de navegação, índices e diagnósticos são reconstruídos em memória e descartáveis.

## Invariantes

- `identidade.id` da tela é estável.
- `flow.editor.entrypoint` único; `rootSequenceId` refere a sequência inicial.
- IDs de ocorrências e branches são únicos no catálogo.
- Branch `paths[].sequenceId` aponta para sequência com nós próprios ou vazia (caminhos ainda não construídos).
- Ausências são diagnósticos, nunca corrigidas por invenção.

## Situação real preservada

79 telas, 197 ocorrências, 33 branches, 114 caminhos, 408 ações originais de navegação. Existe uma tela sem ocorrência: `advogado.disponibilidade.raio_atendimento`. Os IDs de ordenação e posição são do Flow V3.

## Pendente

`quandoLegado` contém condições legadas que **ainda não são avaliadas**. Concluir um contrato de regras executáveis é uma tarefa de produto e implementação posterior. Também é preciso decidir como representar eventId e ports ao migrar os antigos gatilhos; atualmente portas herdadas ficam nos metadados das ações importadas.

## Edição de conexões na interface atual

Na aba **Flow & referências**, escolha a tela de origem e use **+ Conectar outra tela** para criar uma ação em `acoes.grupos[id=navegacao_editor_relacoes]`. O botão **Desconectar** altera ou remove a ação proprietária e força o recálculo de entradas. Se a saída pertence a um item de menu ou rota condicional complexa, o editor orienta alterar a declaração no JSON da tela em vez de apagar dados de interface sem segurança. Isso evita criar uma segunda cópia persistida do vínculo.
