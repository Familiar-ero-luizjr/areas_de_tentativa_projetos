# Projeto 7 — Estrutura complementar de Fluxo e Jornadas (V1)

**Escopo:** definição dos dados, sem importação de telas e sem mesclar HTML/JavaScript/CSS dos Projetos 7 e 8. **Estado:** contrato estrutural documentado; interpretação de novas opções pelos motores ainda precisa de teste próprio.

## Fonte canônica
O arquivo de cada tela em `catalog/catalogo/` segue com os 17 campos de primeiro nível já definidos. Seu `identidade.id` é a autoridade lógica, mesmo que o nome físico do arquivo esteja desalinhado. O módulo Master inspeciona e valida esse contrato; Flow interpreta `navegacao`; Jornadas apresenta `navegacao.participacoes` e `ocorrencias`. Não criar listas paralelas autoritativas de tela/fluxo/jornada.

A `biblioteca_telas/modelo.json` é exemplo **não autoritativo**. A participação originalmente em `classificacao.jornadas` foi apenas reorganizada em `navegacao.participacoes`, sem inventar arestas ou ocorrências. Contratos reais não foram migrados.

## Correspondência estrutural Projeto 8 → Projeto 7

| Origem no Projeto 8 | Destino já existente no Projeto 7 | Regra |
|---|---|---|
| `fluxoFonte.fases[]` e participações de Jornada | `navegacao.participacoes[].jornada/subjornada/ordem` | Classificar e ordenar, sem duplicar telas |
| `fluxoFonte.nos` vinculados a tela | `navegacao.participacoes[].ocorrenciaNoRef` e `ocorrencias[].noOrigemRef` | Mesmo ID de tela pode aparecer em vários nós/ocorrências |
| `fluxoFonte.arestas[]` | `navegacao.saidas[]` (com `origemNoRef`, `destinoNoRef`, `destinoRef`) | Uma relação declarada; `entradas[]` pode ser projeção derivada, não segunda autoridade |
| `fluxoFonte.nos[].routes[]` | `navegacao.bifurcacoes[].caminhos[]` e `navegacao.saidas[]` | Reaproveitar `caminhoRef`, `bifurcacaoRef`, `relacaoRef`, condições e referências |
| Sequências diretas | `navegacao.caminhosLineares[]` e `saidas[]` | Não inferir transição pela mera ordem visual |
| Estados/variações vinculados à tela | `estados`, `variantes` e ocorrências | Não criar uma tela para cada estado |
| `fluxoFonte.selecoesPadrao` | `mocks`, **somente quando documentado como preferência de apresentação** | Não converter a seleção visual em regra de negócio/rota automática |
| Nós sem tela e sem representação suficiente em `estados` | **Opcional:** `navegacao.nosContextuais[]` | Único acréscimo de campo, exclusivamente para nó de decisão/estado/conector sem tela própria |

## Definição de `navegacao.nosContextuais` (opcional)

Array de nós documentais associados a uma tela, utilizado **somente** para um nó do fluxo que não é uma ocorrência de tela nem um estado já descrito. Se nenhum existir, omitir o campo ou manter `[]`.

Cada item pode conter apenas referências e metadados existentes na fonte:

```json
{
  "id": "identificador-estavel-do-no",
  "tipo": "estado | decisao | conector | fim",
  "rotulo": "Nome declarado na fonte",
  "telaContextoRef": null,
  "estadoRef": null,
  "descricao": null,
  "origem": "fonte_documentada",
  "pendente": false
}
```

Não preencher exemplos com IDs que não existam no fluxo real. O nó é referenciado por `origemNoRef`/`destinoNoRef` das relações, nunca por tela fictícia.

## Regras não negociáveis

1. Preservar os 17 campos da tela e todos os dados já válidos; adicionar apenas o que estiver ausente e comprovado.
2. Identidade da tela e identidade da ocorrência são diferentes; não duplicar telas para representar reentradas, bifurcações ou estados.
3. Destinos/condições vazios ficam vazios; não inferir a partir de rótulos, posição ou exemplo visual.
4. Participações de Jornada são parte da navegação de cada tela, não um segundo catálogo.
5. `classificacao.jornadas` (padrão legado de alguns modelos) deve ser **migrado**, não duplicado, quando a tela for trabalhada.
6. A construção/edição do Flow não altera silenciosamente o contrato da tela; mudanças devem ser rastreáveis e validadas.
7. Preservar código existente do Master, Flow e demais módulos. Atualizar interpretadores apenas após definir/validar um campo que eles não reconheçam.
8. A análise das 50 telas e 79 arestas do Projeto 8 é **referência estrutural**, não autorização para copiá-las ao Projeto 7.

## Limite desta alteração

O `biblioteca_telas/modelo.json` foi alinhado ao formato `navegacao` do Projeto 7. Nenhuma tela de `catalog/catalogo/` foi substituída, nenhuma rota operacional nova foi criada e nenhum motor visual foi atualizado. A pasta `jornadas/` foi adicionada somente como área estrutural do módulo futuro.
