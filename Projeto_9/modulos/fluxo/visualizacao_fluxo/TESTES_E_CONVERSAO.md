# Testes e contrato de preservação — Fluxo do Projeto 9

## Contrato de conversão desta entrega

1. Ler somente `data/documento.json` deste módulo, mantendo as 4 chaves de raiz.
2. Não agrupar relações diferentes por coincidência de origem/destino/condição. **O ID da relação é a identidade primária.**
3. Não converter estados/processos em telas. Preservar `destinoTipo`, `destinoRef`, condições e metadados de ações.
4. Exportar sem edições deve reproduzir exatamente o JSON parseado do documento de origem.
5. Edições por ID só alteram a relação escolhida e seus espelhos diretos; não modificar outras ações com o mesmo destino.
6. A relação gráfica pode ser agrupada por evento para apresentação, mas cada conexão preserva sua identidade durante edição/remoção.
7. Refusar versões desconhecidas quando a conversão integral não estiver demonstrada. Nunca descartar entradas de uma importação por ausência de alias.
8. O motor reporta destinos ausentes/condições não resolvidas e não inventa destino ou regra.

## Testes executados (Node.js)

| Caso | Resultado |
|---|---|
| 110 telas, 388 componentes, 163 relações nativas (119 tela + 44 internas) | passou |
| Exportação sem edição integral (JSON estrutural idêntico ao original) | passou |
| Duas ações distintas para a mesma tela continuam independentes | passou |
| Remover uma das ações não remove a outra | passou |
| Editar destino atualiza saída, espelho de entrada e caminho direto | passou |
| Criar relação nova com ID conserva rota e entrada correspondente | passou |
| Importação V3 sem mapeamento completo é recusada com detalhe | passou |
| IDs de relação duplicados são rejeitados | passou |
| Estados/processos internos aparecem na inspeção da tela de origem | passou |
| Verificação de integridade não acusa falsas duplicações | passou |
| Renderização da árvore no ambiente de testes por DOM simulado | passou |

**Teste em navegador completo:** tentativa realizada, porém a política do ambiente bloqueou tanto URL local quanto `file://`. Não classificar como aprovado sem execução e confirmação da UI real no navegador do Projeto.

## Pontos que exigem validação integrada

- Ciclos completos de navegação, retorno de onboarding e seleção real de rota por evento/condição.
- Uso de dados/contexto oficiais para condições e capacidades.
- Integridade semântica de ocorrências editoriais e participações após **alteração de destino**: a referência antiga não pode ser usada como se fosse válida para a nova tela.
- Importação de versões V3 em formato diferente do documento nativo: exige um conversor próprio, com mapa de equivalências demonstrado e testes de ida e volta. Esta entrega **não** declara essa migração homologada.
- Compatibilidade de tela/iframe com o navegador e com o shell do Projeto 9.

**Não confundir** validação estrutural do motor com homologação do percurso de negócio: são níveis diferentes de prova.
