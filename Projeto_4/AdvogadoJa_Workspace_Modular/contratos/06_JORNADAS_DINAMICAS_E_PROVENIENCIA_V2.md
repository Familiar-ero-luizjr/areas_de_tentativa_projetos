# Jornadas dinâmicas e metadados — proposta incremental V2

## Fonte da participação

A única fonte persistida para saber **em quais jornadas uma tela aparece** é `catalogo/telas/.../<arquivo>.json` → `classificacao.jornadas[]`. Cada valor é um **ID textual estável**, não uma posição numérica e não um identificador do Flow.

Exemplo mínimo (trecho de uma tela):

```json
{
  "identidade": {"id": "advogado.home_advogado", "tipo": "tela", "nome": "Início Profissional", "versao": "3.0.0"},
  "classificacao": {
    "jornadas": ["advogado"],
    "subjornadas": ["area_profissional"],
    "localizacaoArvore": {"secao": "Telas", "segmentos": ["advogado"], "chave": "home_advogado", "ordem": 10}
  }
}
```

- `jornadas: ["cliente"]` → a tela aparece na aba Cliente.
- `jornadas: ["cliente", "advogado"]` → **a mesma tela**, sem duplicação de JSON, é apresentada em ambas.
- `jornadas: ["*"]` → tela comum, visível em toda jornada existente ou futura, sem criar aba `*`.
- `jornadas: ["mediacao"]` → a aba Mediação passa a existir automaticamente, sem mudar código nem criar manifesto novo.
- Se nenhuma tela declarar `mediacao`, essa aba deixa de ser gerada; seus outros arquivos e vínculos não são apagados automaticamente.
- `admin` é aceito como alias legada de `administrador` para leitura de `aplicaA`, preservando os IDs históricos de tela como `admin.dashboard.dashboard`. As seis telas administrativas agora declaram `administrador` em `classificacao.jornadas`.

A árvore de catálogo continua usando `classificacao.localizacaoArvore`, independente do número de jornadas. Assim uma tela usada três vezes não é salva em três pastas. `classificacao.subjornadas` e `localizacaoArvore.ordem` ordenam as listagens. **Números J1/J2 ou posições de Flow não se tornam identidade da tela** e são livres para mudar. `identidade.id` nunca muda ao mover uma ocorrência.

## Relações e componentes: contratos atuais reaproveitados

- `componentes.instancias[].ref` aponta para o `identidade.id` de um componente que existe uma vez na Store.
- `componentes.instancias[].slot`, `ordem`, `props` e `aplicaA` regulam o posicionamento, estado e jornada da instância.
- `acoes.grupos[].acoes[].destino` (e destinos condicionais) e `componentes.instancias[].props.itens[].destino` são **saídas operacionais**; o grafo do Flow, a lista de próximas telas e todas as **entradas** são recalculados deles.
- `flow.editor` guarda somente a posição editorial no Flow: entrada, ocorrências e bifurcações. Não deduzir uma transição operacional porque duas telas estão lado a lado na árvore.
- O painel Jornadas, Mapa, Árvore do catálogo, Motor de montagem, Flow e Protótipo leem os mesmos objetos de tela em memória, carregados dos JSONs físicos.

## Conciliação efetuada sem inventar telas

A base recebida tinha 50 telas com componentes *já* instanciados para jornadas que não constavam em `classificacao.jornadas`. `verificacao/reconciliar_jornadas_v2.py` somou **somente** os IDs presentes em `componentes.instancias[].aplicaA.jornadas` do próprio registro (nunca a partir do nome da tela). O resultado está documentado em `verificacao/relatorio_conciliacao_jornadas_v2.json`. Isso fez a jornada Estudante passar a aparecer, a partir de telas efetivamente declaradas para ela. As jornadas continuam totalmente editáveis: nenhuma lista fica fixa no frontend.

## Proveniência fora dos contratos

As 77 propriedades `migracaoProjeto1` foram removidas dos JSONs de tela e seus valores guardados em `verificacao/historico_migracao_projeto1.json`. Os metadados `proveniencia` de 225 componentes foram para `verificacao/historico_componentes_importados.json`. Sufixos como `-importado`, `-flow-migrado`, `-proposta` de `identidade.versao` foram registrados em `verificacao/historico_versoes_legadas.json` e a versão funcional ficou em formato `x.y.z`.

Esses históricos são **documentos de auditoria**, não arquivos consumidos ou atualizados pelos motores. Não contêm cópias completas de telas e componentes. A indicação `proposta` nos `schema` e documentos técnicos permanece porque os contratos **não foram homologados**.

## Limites preservados

O Flow V3 tinha 79 telas, 197 ocorrências, 33 bifurcações, 114 caminhos, 408 saídas legadas. O presente projeto também tem outras ações vindas das jornadas importadas (portanto **não** são apenas 408 conexões no painel de relações). Permanecem seis caminhos editoriais vazios, uma tela sem ocorrência e condições legadas não executáveis. Não são reparados automaticamente e devem ser resolvidos na especificação da jornada.
