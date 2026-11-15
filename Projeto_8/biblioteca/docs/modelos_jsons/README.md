# AdvogadoJá — Guia explicativo do contrato JSON de Tela e Componente

**Documento de referência** para o arquivo `advogadoja_maps_jornadas_atualizado.json`.

> Este documento descreve o que está efetivamente representado no arquivo e distingue **estrutura existente**, **campos ainda não preenchidos** e **recomendações de validação**. O JSON atual é um **modelo com placeholders**, não uma tela pronta nem um esquema formal JSON Schema.

## 1. Objetivo

Representar **uma tela** e **um modelo de componente** usando a mesma convenção de identidade e o mesmo catálogo `maps[]`. Cada bloco do mapa tem uma responsabilidade e contém sua própria `definition`. Os blocos permanecem dentro de `identidade.descricao.maps[]` e não são duplicados no nível principal de cada entidade.

O arquivo possui duas chaves-raiz:

- `tela`: objeto com `schema`, `schemaVersion` e `identidade`.
- `component`: objeto com `identidade` (sem `schema` e `schemaVersion` próprios neste arquivo).

## 2. Árvore geral

```text
raiz
├── tela
│   ├── schema
│   ├── schemaVersion
│   └── identidade
│       ├── id
│       ├── tipo
│       ├── namespace
│       ├── nome
│       └── descricao
│           ├── id
│           ├── title
│           ├── description
│           ├── pasta
│           │   ├── biblioteca
│           │   ├── flutter
│           │   └── react
│           └── maps[]
│               ├── estruturas
│               │   └── definition: html, css, componentes, mocks
│               ├── identidade
│               ├── classificacao
│               │   └── definition: escopo, reutilizavel, jornadas[]
│               ├── dados
│               │   └── definition: funcoes, backend, banco
│               ├── navegacao
│               │   └── definition: rotas, relacoes, bifurcacoes, entradas
│               ├── estados
│               │   └── definition: possiveis, fallbackSeguro
│               ├── variantes
│               │   └── definition: regras
│               ├── interacoes
│               │   └── definition: eventosPrototipo
│               ├── acoes
│               │   └── definition: itens
│               ├── testes
│               ├── implementacao
│               └── notas
└── component
    └── identidade
        └── descricao
            └── maps[] (mesmos 12 IDs, com conteúdo específico do componente)
```

**Observação:** o catálogo de blocos tem **12 IDs**: `estruturas`, `identidade`, `classificacao`, `dados`, `navegacao`, `estados`, `variantes`, `interacoes`, `acoes`, `testes`, `implementacao`, `notas`.

## 3. Contrato de identidade

```json
{
  "id": "<identificador>",
  "tipo": "<tipo>",
  "namespace": "<namespace>",
  "nome": "<nome>",
  "descricao": {
    "id": "<identificador-da-descricao>",
    "title": "<titulo>",
    "description": "<descricao>",
    "pasta": {
      "biblioteca": "<biblioteca/namespace/name>",
      "flutter": "<lib/namespace/name>",
      "react": "<src/namespace/name>"
    },
    "maps": []
  }
}
```

| Campo | Significado no contrato | Observação |
|---|---|---|
| `id` | Identificador da entidade (tela ou componente) | O componente-modelo atual traz o literal `"component"`, a tela usa placeholder. |
| `tipo` | Tipo da entidade | O arquivo ainda traz placeholder, não impõe valores fechados. |
| `namespace` | Agrupamento lógico | Ex.: uma área de negócio; o valor real não está definido. |
| `nome` | Nome da entidade | Diferente do `title` descritivo. |
| `descricao.id` | Identificador da descrição | É campo independente no JSON; não há regra de igualdade com `identidade.id`. |
| `title`, `description` | Título e explicação legíveis | Placeholders. |
| `pasta.biblioteca` | Caminho de catálogo/biblioteca | É um texto, não cria a pasta. |
| `pasta.flutter` | Caminho planejado para Flutter | É um texto, não cria arquivos. |
| `pasta.react` | Caminho planejado para React | É um texto, não cria arquivos. |
| `maps[]` | Blocos modulares de especificação | Cada item tem um `id` distinto dentro da entidade. |

### 3.1. Contrato comum de bloco Map

```json
{
  "id": "<identificador-do-bloco>",
  "title": "<titulo>",
  "description": "<descricao>",
  "status": "<status>",
  "definition": {},
  "pending": []
}
```

- **`id`**: chave estável do tipo de bloco; é a forma mais segura de localizá-lo, independentemente da ordem.
- **`title`**: título exibível.
- **`description`**: explicação geral, não substitui a definição estruturada.
- **`status`**: situação do bloco; no documento-fonte ainda é `"<status>"`, sem vocabulário oficial.
- **`definition`**: dados e regras específicos daquele bloco; sua forma **não é igual** entre blocos.
- **`pending[]`**: coleção de pendências; atualmente todos os blocos a trazem vazia. Ainda não foi definido formato de item.

## 4. Blocos em `maps[]`

### 4.1. `estruturas`

```text
estruturas.definition
├── html
│   ├── raizRef
│   └── composicao                 [tela]
│       └── screen.* → {paiRef, slot, ordem}
│   OU elementos                   [component]
│       └── <id-elemento> → {tag, paiRef, ordem, atributos, texto}
├── css
│   ├── tokens                     [tela]
│   └── regras
├── componentes
│   └── instanciasRefs             [tela]
└── mocks
    └── cenarios[]                [tela]
```

Na **tela**, `html.composicao` posiciona instâncias como `screen.root`, `screen.header`, `screen.titlebar`, `screen.hero`, `screen.online`, `screen.actions`, `screen.drawer`, `screen.modal` e `screen.toast`. Cada composição tem `paiRef`, `slot` e `ordem`. `html.raizRef` aponta para a raiz pretendida.

No **componente**, `html.elementos` é um dicionário cujas entradas descrevem elementos (`tag`, `paiRef`, `ordem`, `atributos`, `texto`). Essa diferença é real no arquivo: **o contrato externo do bloco é uniforme, porém o conteúdo de `html` ainda difere entre tela e componente**.

O CSS da tela contém tokens nomeados (por exemplo, `--primary`, `--surface`, `--text`) e regras identificadas (`r001`, `r002` etc.). O componente-modelo contém `css.regras` com um exemplo genérico. Esses identificadores e valores são placeholders; não constituem regras CSS operacionais por si só.

`componentes.instanciasRefs` lista referências utilizadas na tela; não contém os objetos completos dos componentes. `mocks.cenarios[]` representa cenários com `id`, `cenarioRef`, `nome`, `uso` e `situacao`. No componente-modelo, `componentes` e `mocks` estão vazios.

### 4.2. `identidade`

A definição atual é:

```json
{"ref": "identidade"}
```

Isso evita copiar `id`, `tipo`, `namespace` e `nome`. A string `"identidade"` é uma **referência convencionada**, não um ponteiro JSON automaticamente resolvido; o consumidor deve implementar sua interpretação.

### 4.3. `classificacao`

```text
classificacao.definition
├── escopo
├── reutilizavel
└── jornadas[]
    └── participacao
        ├── id
        ├── jornada
        │   ├── id
        │   ├── nome
        │   └── ordem
        ├── subjornada
        │   ├── id
        │   ├── jornadaRef
        │   ├── nome
        │   └── ordem
        ├── ordemTela
        ├── ocorrenciaNo
        ├── condicaoRef
        └── contexto
            ├── descricao
            ├── branch
            └── pendente
```

- `escopo`: abrangência da entidade.
- `reutilizavel`: booleano, atualmente `false` como valor do template, não uma decisão universal.
- `jornadas[]`: participações da entidade em jornadas.
- `jornadas[].id`: ID da **participação**, diferente do ID da jornada e da subjornada.
- `jornada.id`, `jornada.nome`, `jornada.ordem`: identificação e posição da jornada.
- `subjornada.id`, `subjornada.nome`, `subjornada.ordem`: identificação e posição da subjornada.
- `subjornada.jornadaRef`: **referência à jornada-pai**, cujo valor deve corresponder a `jornada.id`.
- `ordemTela`: posição da tela nessa participação; o nome também aparece no modelo de componente, ainda sem regra própria para seu uso ali.
- `ocorrenciaNo`: referência/identificador da ocorrência no fluxo; **não é automaticamente o ID da tela**.
- `condicaoRef`: condição associada; `null` representa ausência de referência preenchida.
- `contexto.descricao`: descrição do contexto da participação.
- `contexto.branch`: ramificação contextual; o formato não foi formalizado.
- `contexto.pendente`: booleano de pendência do contexto, distinto de `maps[].pending`.

**Exemplo literal do template atualizado:**

```json
{
  "jornadas": [
    {
      "id": "<identificador-da-participacao>",
      "jornada": {
        "id": "<identificador-da-jornada>",
        "nome": "<nome>",
        "ordem": 0
      },
      "subjornada": {
        "id": "<identificador-da-subjornada>",
        "jornadaRef": "<identificador-da-jornada>",
        "nome": "<nome>",
        "ordem": 0
      },
      "ordemTela": 0,
      "ocorrenciaNo": "<ocorrencia-no>",
      "condicaoRef": null,
      "contexto": {
        "descricao": "<descricao>",
        "branch": "<branch>",
        "pendente": false
      }
    }
  ]
}
```

`"<identificador-da-jornada>"` é texto substituível. A igualdade entre os dois locais que o usam deve ser verificada pelo validador ou editor.

### 4.4. `dados`

```text
dados.definition
├── funcoes
├── backend
└── banco
    ├── fontes[]
    ├── operacoes[]
    └── persistencia[]
```

`funcoes` e `backend` são objetos vazios no modelo enviado. Na tela, `banco` traz listas vazias de fontes, operações e persistência; no componente, `banco` é `{}`. O arquivo **não** define, por enquanto, formatos de função, chamada de API, coleção, tabela ou operação de banco.

### 4.5. `navegacao`

Na tela, a definição contém quatro coleções:

- `rotas[]`: lista reservada de rotas; sem itens no template.
- `relacoes[]`: ligações entre origem e destino; inclui `id`, `tipo`, `origem`, `destino`, `opcao`, `rotulo`, `descricao`, `gatilho`, `condicaoRef`, `parametros`, `comportamento`, `ordem`, `participacaoRef`, `prioridade` e `jornadaRef`.
- `bifurcacoes[]`: pontos de escolha, com `origemNoRef`, `criterioRef`, alternativas e `fallbackRelacaoRef`.
- `entradas[]`: relações de entrada com `relacaoRef`, `origem`, `destino` e `jornadaRef`.

Origem e destino utilizam referências (`ref`, `noRef`, `telaContextoRef`, `portaRef`), e um gatilho pode apontar para `instanciaRef`, `elementoRef`, `eventoRef` e `acaoRef`. No componente, `navegacao.definition` está vazio.

**Separação:** `navegacao` registra ligações e caminhos; `acoes` descreve ações disparadas; `interacoes` registra eventos/atributos de interação. Elas podem compartilhar referências, mas não são cópias da mesma entidade.

### 4.6. `estados`

Na tela:

```json
{
  "possiveis": [
    {"id": "<identificador>", "nome": "<nome>"}
  ],
  "fallbackSeguro": "<fallback-seguro>"
}
```

Define o catálogo de estados possíveis e um fallback previsto. O documento não detalha transições ou condições neste bloco; no componente, a definição está vazia.

### 4.7. `variantes`

Na tela, `regras[]` contém `id`, `origem`, `gatilho`, `opcao`, `estadoAlvo`, `nota` e `jornadaRef`. O modelo permite representar variantes relacionadas a um gatilho e estado-alvo. No componente, está vazio.

### 4.8. `interacoes`

Na tela, `eventosPrototipo[]` traz `id`, `atributosHTML` e `status`. Os atributos de exemplo incluem `data-action` e `data-online-root`. Não há mecanismo de execução definido pelo JSON; no componente, a definição está vazia.

### 4.9. `acoes`

Na tela, `itens[]` contém `id`, `evento`, `rotas[]` e `jornadaRef`. Cada rota de ação possui `id`, `rotulo`, `descricao`, `destino` (`tipo`, `telaId`, `noId`), `relacaoDireta` e `origemNo`. No componente, a definição está vazia.

### 4.10. `testes`, `implementacao`, `notas`

Esses três blocos estão presentes nas duas entidades, mas `definition` é `{}` nos dois casos. Seus conteúdos e contratos internos **ainda não foram especificados** no arquivo.

## 5. O que é igual e o que difere entre tela e componente

| Aspecto | Tela | Componente |
|---|---|---|
| Chave-raiz | `tela` | `component` |
| `schema` e `schemaVersion` | Presentes | Ausentes no exemplo |
| Campos de identidade e pasta | Mesma forma | Mesma forma |
| IDs e envelope de `maps[]` | 12 blocos | Os mesmos 12 blocos |
| `estruturas.definition.html` | `raizRef` e `composicao` | `raizRef` e `elementos` |
| `estruturas.definition.css` | `tokens` e `regras` | `regras` |
| `estruturas.definition.componentes` | `instanciasRefs` | `{}` |
| `estruturas.definition.mocks` | `cenarios[]` | `{}` |
| `classificacao.definition` | Participações em jornadas | Mesmo contrato |
| `navegacao`, `estados`, `variantes`, `interacoes`, `acoes` | Exemplos estruturados | `definition: {}` |

**Conclusão:** a padronização atual estabelece um **envelope único**, mas **não** iguala todos os detalhes internos de tela e componente. Isso não deve ser confundido com erro: os formatos internos podem ter necessidades distintas.

## 6. Placeholders, referências e tipos

| Forma | Interpretação |
|---|---|
| `"<identificador>"` | Texto de exemplo a substituir. |
| `"<jornada-ref>"` | Placeholder para um ID de outra entidade; exige validação de referência. |
| `"identidade"` em `definition.ref` | Referência convencional de contrato, não JSON Pointer nativo. |
| `null` | Referência/valor não preenchido ou ausente no template. |
| `{}` | Objeto definido, mas sem conteúdo. |
| `[]` | Coleção definida, mas sem itens. |
| `0` | Número de exemplo, não necessariamente ordem definitiva. |
| `false` e `true` | Booleanos reais, não strings; devem refletir o caso concreto ao preencher. |

**Importante:** JSON comum não resolve referências por conta própria. É o editor, validador ou aplicação que deverá identificar o objeto referenciado, verificar a existência do ID e montar os relacionamentos.

## 7. Regras de consistência sugeridas (não implementadas no JSON)

Estas são **recomendações para o validador futuro**, não regras já executadas pelo arquivo:

1. Garantir que `identidade.id` identifique unicamente a entidade em seu escopo.
2. Garantir IDs únicos em cada array `maps[]` e preservar os 12 IDs previstos no contrato.
3. Tratar `maps[]` por `id`, nunca depender exclusivamente do índice no array.
4. Conferir `subjornada.jornadaRef === jornada.id` na participação.
5. Verificar se as referências `*Ref` apontam para registros existentes; respeitar `null` quando permitido.
6. Verificar que `html.raizRef` aponta para uma instância/elemento conhecido.
7. Verificar que `paiRef` aponta para um elemento existente ou é `null` para uma raiz permitida; impedir ciclos.
8. Padronizar o vocabulário de `status` e o formato dos itens de `pending[]` antes do uso em produção.
9. Definir formalmente se `tipo` será `tela`, `header`, `secao`, `menu`, etc., e como `namespace` participa da unicidade.
10. Definir um contrato de navegação para componentes apenas quando eles possuírem comportamento navegável.

## 8. Fluxo de preenchimento recomendado

1. Atribuir o ID real e os metadados de `identidade`.
2. Definir ou revisar `descricao.pasta` para as tecnologias pertinentes.
3. Preencher `classificacao.definition.jornadas[]` com IDs distintos de participação, jornada e subjornada; relacioná-los por `jornadaRef`.
4. Preencher `estruturas` com HTML, CSS, referências de componentes e cenários de mock.
5. Completar as definições de dados, navegação, estados, variantes, interações e ações conforme o comportamento real.
6. Registrar testes, detalhes de implementação e notas quando seus contratos internos forem definidos.
7. Validar todas as referências e trocar os placeholders remanescentes antes de usar o modelo como fonte de execução.

## 9. Caminhos de referência para ferramentas

```text
tela.identidade
tela.identidade.descricao.pasta
tela.identidade.descricao.maps[]
component.identidade
component.identidade.descricao.maps[]

maps[id="estruturas"].definition.html
maps[id="estruturas"].definition.css
maps[id="estruturas"].definition.componentes
maps[id="estruturas"].definition.mocks
maps[id="classificacao"].definition.jornadas[]
maps[id="dados"].definition.banco
maps[id="navegacao"].definition.relacoes[]
maps[id="acoes"].definition.itens[]
```

Os caminhos `maps[id="..."]` acima são uma **notação de documentação**, não uma sintaxe JSONPath universal. Na implementação, filtre o array pelo campo `id`.

## 10. Estado atual da especificação

O JSON é adequado como **contrato inicial de organização e preenchimento**. Ele não inclui dados concretos de negócio, não possui definições operacionais para várias seções e não implementa resolução automática de referências nem validação formal. A próxima evolução pode acrescentar um JSON Schema, um validador e os contratos internos ainda vazios, sem alterar o envelope dos blocos.
