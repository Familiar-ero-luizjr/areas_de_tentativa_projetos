# Campos → frontend do módulo Flow

> Revisão aditiva. Chaves do bloco canônico proposto ainda são **convenções em validação**, não autorização para produção.

| Campo no `modelo` | Fonte / situação | Comportamento do frontend |
|---|---|---|
| `identidade.id` | Contrato já existente | Identifica uma definição única da Home e permite links reversos. |
| `navegacao.participacoes[]` | Legado Flow V2 | Continua sendo lido na árvore de ocorrências; não é recriado da geometria. |
| `navegacao.bifurcacoes[]` | Editorial legado | Permanece separado das bifurcações condicionais inferidas. |
| `navegacao.saidas[]` | Legado / proposta anterior | Fonte de normalização das oito conexões; não foi apagado. |
| `navegacao.entradas[]` | Legado, com espelhos derivados | Mantido para rastreabilidade; não deve ser fonte dupla de transições. |
| `conexoes.itens[].id` | Proposta normalizada | ID estável da ligação, selecionável e editável. |
| `conexoes.itens[].origem.telaRef` | Fonte normalizada da Home | Identifica a tela de origem, não a posição desenhada. |
| `conexoes.itens[].origem.saida` | Ação/evento legado, ainda não homologado como DOM | Agrupa saídas do mesmo evento para inferência de bifurcações. |
| `conexoes.itens[].destino.telaRef` | Saída do legado | Exibe destino; sinaliza se está fora do recorte de uma tela. |
| `conexoes.itens[].condicaoRef` | Registro de condições | Informa condição; ausência não cria condição fictícia. |
| `conexoes.itens[].navegacao` | Política ainda indefinida | Editável, sem afirmar que Flutter/React já a executa. |
| `condicoes.itens[].variavel/operador/valor` | Proposta derivada de `estados.itens[]` | Avaliação declarativa limitada (`igual`, `diferente_de`), sem `eval`; permite simulação. |
| `segmentos.itens[]` | Vazio, aguardando confirmação | Não há deduplicação automática por semelhança. |
| `referencias.aliases[]` | Alias candidato não aprovado | Exibe pendência; não une IDs silenciosamente. |
| `referencias.composicaoBiblioteca[]` | `catalogo.telas.advogado.home.estrutura.html.composicao` | Associa slots da Home a componentes com ID real. |
| `referencias.eventosObservados[]` | `catalogo.componentes.*.estrutura.html.elementos.*.atributos` | Mostra `data-action`, `data-demo-action` e `data-item-id` observados, sem supor integração backend. |
| `referencias.indicesReversos` | Política de derivação | A interface consulta as referências; não mantém cópias de cada consumidor. |

## Bifurcação inferida

Para cada par `(origem.telaRef, origem.saida)`:

- Uma conexão → linha direta ou uma saída condicional;
- Duas condições complementares (`igual true` versus `igual false`, ou `igual x` versus `diferente_de x`) → bifurcação automática;
- Múltiplas condições ainda não comprovadamente excludentes → bifurcação a validar;
- Ausência de evento/destino/condição referenciada → sinalização de pendência, sem destino criado pelo motor.

Botões **Editar** e **＋ Conexão** atualizam `conexoes.itens` na árvore do contrato, e **Editar condição** atualiza `condicoes.itens`. **Ver campos** abre o modelo mestre no caminho selecionado. **Exportar JSON** gera o contrato completo. Dados são salvos localmente quando o navegador permite.

## Diferenças entre fontes

O documento canônico anterior descreve um Flow com 78 telas, 197 ocorrências e 36 bifurcações editoriais; a fonte `advogadoja-fluxo-projecao.json` anexada nesta atualização é um catálogo autocontido **apenas da Home**, não aquele grafo completo. Não foram combinadas contagens nem criados caminhos ausentes.

`estrutura.html`, `estrutura.css`, estados de componente, validação de capacidades, estado da jornada e histórico real de navegação continuam em camadas distintas conforme contrato canônico.
