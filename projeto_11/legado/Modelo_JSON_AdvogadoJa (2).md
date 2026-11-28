# Modelo JSON — AdvogadoJá

> Em construção — especificação expandida. Base: 22 telas e 3 componentes do JSON experimental 0.4.0 e correções de hierarquia acordadas.

Cada seção apresenta objetivo, função, uso, estrutura e regras. Contratos compartilhados são repetidos no ponto de utilização para leitura independente. A coleção vazia representa ausência de itens, não ausência de definição. Campos opcionais podem ser omitidos; null só é aceito quando previsto. JSONC é documental e não deve ser enviado diretamente a um parser JSON padrão. Placeholders representam tipos ou valores genéricos, não valores executáveis. Os exemplos são modelos genéricos, não instâncias prontas para execução. Campos opcionais são indicados no texto. Identificadores numéricos exemplificativos não são valores fixos. Mapas de chaves livres são descritos por tipos recursivos; não é necessário inventar chaves específicas de uma tela. Onde a fonte não permite definir um contrato, a proposta é marcada explicitamente.

## 1 Estrutura Macro

**Objetivo:** delimitar as entidades do arquivo. **Função:** reunir telas e componentes por identificador. **Uso:** entrada do motor. Os mapas contêm objetos de tela e componente, apresentados na sequência deste documento. O campo `schema` vem do modelo documental anterior, não do JSON experimental.

```jsonc
{
  "schema": "advogadoja.tela.autocontidas",
  "schemaVersion": "0.4.0-experimental",
  "telas": { "<id_da_tela>": "<Tela>" },
  "componentes": { "<id_do_componente>": "<Componente>" }
}
```

## 2 Telas

**Objetivo:** descrever uma tela autocontida. **Função:** reunir identidade, contexto funcional, renderização e comportamento. **Uso:** catálogo, protótipo, fluxo e execução.

### 2.1 Estrutura Macro da Tela

| Campo | Tipo | Finalidade |
|---|---|---|
| identidade | objeto | Identificação |
| classificacao | objeto | Contexto funcional |
| estrutura | array de objetos | Estrutura visual |
| estados | array de objetos | Condições e variações |
| interacoes | array de objetos | Eventos e ações |
| navegacao | array de objetos | Rotas e transições |
| dados | objeto | Fontes e operações |
| mocks | objeto | Cenários simulados |

### 2.2 Identidade

**Objetivo:** identificar a tela. **Função:** definir tipo, agrupamento e nome. **Uso:** resolução de referências. `id` deve coincidir com a chave do mapa de telas; `nomeExibicao` foi removido.

```jsonc
{"identidade": {
  "id": "<id_da_tela>", // string única
  "tipo": "tela", // literal
  "namespace": "<namespace>", // agrupamento lógico
  "nome": "<nome_da_tela>" // nome único para apresentação e identificação humana
}}
```

### 2.3 Classificação

**Objetivo:** classificar a tela. **Função:** associar perfil e jornadas. **Uso:** agrupamento funcional. A estrutura aninhada é a correção acordada: substitui os arrays independentes de referências. Não contém rotas.

```jsonc
{"classificacao": {
  "perfilRef": "<id_do_perfil>", // string
  "jornadas": [{
    "id": "<id_da_jornada>", // string
    "subjornadas": [{
      "id": "<id_da_subjornada>" // string, vinculada à jornada pai
    }]
  }]
}}
```

#### 2.3.1 Jornadas e subjornadas

Cada item representa participação da tela na jornada; a subjornada é identificada no contexto da jornada pai. A ordem de navegação é derivada das entradas e saídas, não da posição destes arrays. Não há catálogo independente no JSON. A existência de múltiplos perfis e ordenação explícita não foi definida.

### 2.4 Estrutura

**Objetivo:** definir apresentação visual. **Função:** reunir HTML, composição e CSS. **Uso:** renderização por estado. Cada `id` inteiro identifica uma estrutura no contexto da tela.

```jsonc
{"estrutura": [{
  "id": 0,
  "html": "<HTML>",
  "css": "<CSS>"
}]}
```

#### 2.4.1 HTML

**Objetivo:** organizar a árvore de elementos e inserções. **Função:** resolver raiz, hierarquia e composição. **Uso:** criação da árvore visual. `raizRef` aponta para um elemento local.

```jsonc
{"html": {
  "raizRef": 0,
  "elementos": ["<Elemento>"],
  "composicao": ["<Composição>"]
}}
```

#### 2.4.2 Elementos

**Objetivo:** representar um nó HTML. **Função:** definir hierarquia, atributos e comportamento declarativo. **Uso:** montagem do DOM. `texto`, `valor`, `visivelQuando`, `repetir` e `payload` são opcionais conforme o nó.

```jsonc
{
  "id": 0, // inteiro local
  "tag": "<tag_html>", // string
  "paiRef": null, // inteiro ou null para raiz
  "ordem": 0, // inteiro para tela; componente também admite decimal observado
  "estiloRefs": [0], // IDs de regras CSS
  "atributos": { "<atributo_html>": "<Valor>" },
  "texto": "<Valor>", // literal ou expressão
  "valor": { "ref": "<caminho_do_dado>" }, // binding; expressão também pode ser avaliada conforme contrato
  "visivelQuando": { "op": "eq", "args": [{ "ref": "<caminho>" }, true] },
  "repetir": { "ref": "<caminho_da_colecao>" },
  "payload": { "ref": "<caminho_do_item>" }
}
```

`paiRef` aponta para outro elemento da mesma estrutura; `ordem` organiza irmãos. `atributos` é um mapa de nomes HTML/SVG para valores, inclusive expressões. `repetir` resolve uma coleção e fornece contexto do item. `payload` fornece o valor associado ao evento. A semântica de repetição, escopo e avaliação deve ser formalizada no motor; a fonte não contém sua implementação.

##### 2.4.2.1 Atributos, texto, valor, visibilidade, repetição e payload — contrato local

A representação abaixo é uma gramática documental, não uma instância JSON. Permite definir objetos e arrays até qualquer profundidade sem duplicar indefinidamente o modelo.

```text
Literal = string | number | boolean | null
        | array de Literal | mapa<string, Literal>
Referencia = { ref: string }
Expressao = { op: string, args: array de Valor }
Valor = Literal | Referencia | Expressao
      | array de Valor | mapa<string, Valor>
Condicao = Referencia | Expressao
```

`ref` contém caminho textual; `op` seleciona operador; `args` contém argumentos posicionais e aceita expressões aninhadas. Objetos com chaves reservadas `ref` ou `op` precisam ser diferenciados de dados literais pelo motor (regra a formalizar). Campos que aceitam apenas literal não devem automaticamente avaliar expressões.

**Operadores observados e interpretação proposta**

| Operador | Quantidade observada de argumentos | Interpretação proposta |
|---|---:|---|
| eq | 2 | igualdade |
| ne | 2 | desigualdade |
| lte | 2 | menor ou igual |
| or | 2 | disjunção |
| if | 3 | condição, resultado verdadeiro, resultado falso |
| length | 1 | tamanho |
| contains | 2 | verifica inclusão |
| intersects | 2 | verifica interseção |
| split | 2 | separa texto |
| join | 2 | composição textual; separador a confirmar |
| concat | 3 | concatenação |
| number | 1 | conversão numérica |

A aridade é observada, não necessariamente limite do motor. Tipos de retorno, coerção, tratamento de erros e valores ausentes precisam de validação com a implementação.

**Referências e escopo:** `ref` é um caminho textual. Os prefixos observados são `local`, `dados`, `props`, `registro`, `derivados` e `item`; somente os contextos efetivamente disponíveis podem ser usados. A resolução e coerção dependem de validação no motor.

#### 2.4.3 Composição

**Objetivo:** inserir componentes reutilizáveis. **Função:** vincular um componente a um ponto da árvore e passar propriedades. **Uso:** renderização sem duplicar a definição. `componenteRef` aponta para a chave em `componentes`; `paiRef` aponta para elemento da tela.

```jsonc
{
  "id": 0, // inteiro local da composição
  "paiRef": 0, // ID do elemento pai
  "ordem": 0,
  "componenteRef": "<id_do_componente>",
  "propriedades": {
    "<nome_da_propriedade>": "<Valor>"
  }
}
```

As chaves de `propriedades` correspondem às declarações do componente. Valores podem ser literais, referências ou coleções de objetos. A fonte contém uma propriedade de lista hierárquica com itens de campos `id` (inteiro), `texto` (string), `icone` (`viewBox` e `path`, strings), `paiRef` (inteiro ou null), `subitem`, `grupo` e `restrito` (booleanos). Esse formato é específico de uma propriedade, não obrigatório para todos os componentes. O contrato de tipos por propriedade ainda não está declarado no JSON original.

##### 2.4.3.1 Valores das propriedades — contrato local

A representação abaixo é uma gramática documental, não uma instância JSON. Permite definir objetos e arrays até qualquer profundidade sem duplicar indefinidamente o modelo.

```text
Literal = string | number | boolean | null
        | array de Literal | mapa<string, Literal>
Referencia = { ref: string }
Expressao = { op: string, args: array de Valor }
Valor = Literal | Referencia | Expressao
      | array de Valor | mapa<string, Valor>
Condicao = Referencia | Expressao
```

`ref` contém caminho textual; `op` seleciona operador; `args` contém argumentos posicionais e aceita expressões aninhadas. Objetos com chaves reservadas `ref` ou `op` precisam ser diferenciados de dados literais pelo motor (regra a formalizar). Campos que aceitam apenas literal não devem automaticamente avaliar expressões.

**Operadores observados e interpretação proposta**

| Operador | Quantidade observada de argumentos | Interpretação proposta |
|---|---:|---|
| eq | 2 | igualdade |
| ne | 2 | desigualdade |
| lte | 2 | menor ou igual |
| or | 2 | disjunção |
| if | 3 | condição, resultado verdadeiro, resultado falso |
| length | 1 | tamanho |
| contains | 2 | verifica inclusão |
| intersects | 2 | verifica interseção |
| split | 2 | separa texto |
| join | 2 | composição textual; separador a confirmar |
| concat | 3 | concatenação |
| number | 1 | conversão numérica |

A aridade é observada, não necessariamente limite do motor. Tipos de retorno, coerção, tratamento de erros e valores ausentes precisam de validação com a implementação.

**Referências e escopo:** `ref` é um caminho textual. Os prefixos observados são `local`, `dados`, `props`, `registro`, `derivados` e `item`; somente os contextos efetivamente disponíveis podem ser usados. A resolução e coerção dependem de validação no motor.

#### 2.4.4 CSS

**Objetivo:** definir estilos. **Função:** reunir tokens e regras. **Uso:** aplicar estilos referenciados pelo HTML. `tokens` é um mapa de nome de token para valor CSS textual.

```jsonc
{"css": {
  "tokens": { "<nome_do_token>": "<valor_css>" },
  "regras": [
    { "id": 0, "seletor": "<seletor_css>", "declaracoes": "<declaracoes_css>", "classe": "<classe_css>" },
    { "id": 1, "bloco": "<bloco_css_completo>" }
  ]
}}
```

As duas formas de regra foram observadas: seletor e declarações textuais (com `classe` opcional), ou bloco CSS textual completo. IDs são inteiros. Não converter declarações em objetos sem migração explícita. A relação entre `classe` e seletor deve ser consistente.

##### 2.4.4.1 Tokens — campos e valores

- Chave: string que identifica o token de estilo.
- Valor: string CSS, por exemplo `<cor_css>`, `<medida_css>` ou `<valor_css>`.
- O mapa pode estar vazio quando não existem tokens.

##### 2.4.4.2 Regras — campos e variantes

| Campo | Tipo | Uso |
|---|---|---|
| `id` | inteiro | Identificador único da regra no CSS local. |
| `seletor` | string | Seletor CSS da regra declarativa. |
| `declaracoes` | string | Lista textual de declarações CSS. |
| `classe` | string opcional | Nome da classe associada à regra. |
| `bloco` | string | Bloco CSS completo, variante alternativa. |

**Declarações e propriedades CSS:** no formato observado, as propriedades não são chaves JSON independentes: integram a string `declaracoes` no formato `<propriedade_css>: <valor_css>;`. O valor é texto CSS, podendo conter funções e unidades CSS. O campo `bloco` contém texto CSS completo. Não há um contrato observado de expressões JSON dentro desses valores; introduzi-lo exigiria migração.

**Integridade:** cada referência de estilo deve resolver um ID existente no CSS da entidade. IDs duplicados e referências inexistentes devem ser sinalizados.

### 2.5 Estados

**Objetivo:** representar condições da tela. **Função:** selecionar estrutura e navegação. **Uso:** variações de interface. IDs são inteiros locais; referências apontam para a mesma tela.

```jsonc
{"estados": [{
  "id": 0,
  "nome": "<nome_do_estado>",
  "condicoes": [{ "op": "eq", "args": [{ "ref": "<caminho_do_dado>" }, 0] }],
  "estruturaRef": 0,
  "navegacaoRef": 0
}]}
```

#### 2.5.1 Condições

Cada condição é uma referência ou expressão que deve produzir um resultado lógico. No arquivo há arrays vazios (sem condições explícitas). A regra de combinação das condições, a prioridade entre estados simultaneamente válidos e o estado padrão não estão formalizados. Proposta: conjunção lógica e validação de exclusividade; não assumir implementação existente.

##### 2.5.1.1 Condições do estado — contrato local

A representação abaixo é uma gramática documental, não uma instância JSON. Permite definir objetos e arrays até qualquer profundidade sem duplicar indefinidamente o modelo.

```text
Literal = string | number | boolean | null
        | array de Literal | mapa<string, Literal>
Referencia = { ref: string }
Expressao = { op: string, args: array de Valor }
Valor = Literal | Referencia | Expressao
      | array de Valor | mapa<string, Valor>
Condicao = Referencia | Expressao
```

`ref` contém caminho textual; `op` seleciona operador; `args` contém argumentos posicionais e aceita expressões aninhadas. Objetos com chaves reservadas `ref` ou `op` precisam ser diferenciados de dados literais pelo motor (regra a formalizar). Campos que aceitam apenas literal não devem automaticamente avaliar expressões.

**Operadores observados e interpretação proposta**

| Operador | Quantidade observada de argumentos | Interpretação proposta |
|---|---:|---|
| eq | 2 | igualdade |
| ne | 2 | desigualdade |
| lte | 2 | menor ou igual |
| or | 2 | disjunção |
| if | 3 | condição, resultado verdadeiro, resultado falso |
| length | 1 | tamanho |
| contains | 2 | verifica inclusão |
| intersects | 2 | verifica interseção |
| split | 2 | separa texto |
| join | 2 | composição textual; separador a confirmar |
| concat | 3 | concatenação |
| number | 1 | conversão numérica |

A aridade é observada, não necessariamente limite do motor. Tipos de retorno, coerção, tratamento de erros e valores ausentes precisam de validação com a implementação.

**Referências e escopo:** `ref` é um caminho textual. Os prefixos observados são `local`, `dados`, `props`, `registro`, `derivados` e `item`; somente os contextos efetivamente disponíveis podem ser usados. A resolução e coerção dependem de validação no motor.

### 2.6 Interações

**Objetivo:** representar eventos e respostas. **Função:** associar origem, condições e ações. **Uso:** atualizar dados ou iniciar navegação.

```jsonc
{"interacoes": [{
  "id": 0,
  "origem": { "elementoRef": 0, "evento": "<evento>" },
  "condicoes": [{ "ref": "<caminho_do_dado>" }],
  "acoes": [{ "tipo": "definir", "campo": "<caminho_do_campo>", "valor": "<Valor>" }]
}]}
```

#### 2.6.1 Origem

Duas variantes observadas: elemento HTML ou instância de componente; usar uma referência de origem por interação. `evento` é string.

```jsonc
// Variante elemento
{ "elementoRef": 0, "evento": "<evento>" }
// Variante composição (modelo alternativo separado)
{ "composicaoRef": 0, "evento": "<evento_emitido>" }
```

#### 2.6.2 Condições

Cada condição é uma referência ou expressão que deve produzir um resultado lógico. A combinação de condições, inclusive lista vazia, ainda requer definição. Uma condição direta pode ser `{ "ref": "<caminho>" }`; uma comparação pode ser `{ "op": "eq", "args": [{ "ref": "<caminho>" }, "<valor>"] }`.

##### 2.6.2.1 Condições da interação — contrato local

A representação abaixo é uma gramática documental, não uma instância JSON. Permite definir objetos e arrays até qualquer profundidade sem duplicar indefinidamente o modelo.

```text
Literal = string | number | boolean | null
        | array de Literal | mapa<string, Literal>
Referencia = { ref: string }
Expressao = { op: string, args: array de Valor }
Valor = Literal | Referencia | Expressao
      | array de Valor | mapa<string, Valor>
Condicao = Referencia | Expressao
```

`ref` contém caminho textual; `op` seleciona operador; `args` contém argumentos posicionais e aceita expressões aninhadas. Objetos com chaves reservadas `ref` ou `op` precisam ser diferenciados de dados literais pelo motor (regra a formalizar). Campos que aceitam apenas literal não devem automaticamente avaliar expressões.

**Operadores observados e interpretação proposta**

| Operador | Quantidade observada de argumentos | Interpretação proposta |
|---|---:|---|
| eq | 2 | igualdade |
| ne | 2 | desigualdade |
| lte | 2 | menor ou igual |
| or | 2 | disjunção |
| if | 3 | condição, resultado verdadeiro, resultado falso |
| length | 1 | tamanho |
| contains | 2 | verifica inclusão |
| intersects | 2 | verifica interseção |
| split | 2 | separa texto |
| join | 2 | composição textual; separador a confirmar |
| concat | 3 | concatenação |
| number | 1 | conversão numérica |

A aridade é observada, não necessariamente limite do motor. Tipos de retorno, coerção, tratamento de erros e valores ausentes precisam de validação com a implementação.

**Referências e escopo:** `ref` é um caminho textual. Os prefixos observados são `local`, `dados`, `props`, `registro`, `derivados` e `item`; somente os contextos efetivamente disponíveis podem ser usados. A resolução e coerção dependem de validação no motor.

#### 2.6.3 Ações

Variantes observadas no arquivo. `campo` é caminho textual; `valor` é valor recursivo; `eventoRef` é inteiro e aponta para evento de navegação. O tipo discrimina os campos aplicáveis.

```jsonc
[
  { "tipo": "definir", "campo": "<caminho>", "valor": "<Valor>" },
  { "tipo": "alternarLista", "campo": "<caminho_da_lista>", "valor": { "ref": "<caminho_do_item>" } },
  { "tipo": "navegar", "eventoRef": 0 }
]
```

##### 2.6.3.1 Valor das ações — contrato local

A representação abaixo é uma gramática documental, não uma instância JSON. Permite definir objetos e arrays até qualquer profundidade sem duplicar indefinidamente o modelo.

```text
Literal = string | number | boolean | null
        | array de Literal | mapa<string, Literal>
Referencia = { ref: string }
Expressao = { op: string, args: array de Valor }
Valor = Literal | Referencia | Expressao
      | array de Valor | mapa<string, Valor>
Condicao = Referencia | Expressao
```

`ref` contém caminho textual; `op` seleciona operador; `args` contém argumentos posicionais e aceita expressões aninhadas. Objetos com chaves reservadas `ref` ou `op` precisam ser diferenciados de dados literais pelo motor (regra a formalizar). Campos que aceitam apenas literal não devem automaticamente avaliar expressões.

**Operadores observados e interpretação proposta**

| Operador | Quantidade observada de argumentos | Interpretação proposta |
|---|---:|---|
| eq | 2 | igualdade |
| ne | 2 | desigualdade |
| lte | 2 | menor ou igual |
| or | 2 | disjunção |
| if | 3 | condição, resultado verdadeiro, resultado falso |
| length | 1 | tamanho |
| contains | 2 | verifica inclusão |
| intersects | 2 | verifica interseção |
| split | 2 | separa texto |
| join | 2 | composição textual; separador a confirmar |
| concat | 3 | concatenação |
| number | 1 | conversão numérica |

A aridade é observada, não necessariamente limite do motor. Tipos de retorno, coerção, tratamento de erros e valores ausentes precisam de validação com a implementação.

**Referências e escopo:** `ref` é um caminho textual. Os prefixos observados são `local`, `dados`, `props`, `registro`, `derivados` e `item`; somente os contextos efetivamente disponíveis podem ser usados. A resolução e coerção dependem de validação no motor.

### 2.7 Navegação

**Objetivo:** descrever entradas e saídas. **Função:** concentrar rotas e transições. **Uso:** fluxo e roteamento. A fonte contém entradas e saídas com alternativas; a inclusão de rotas locais é a correção arquitetural acordada, ainda sem catálogo original disponível.

```jsonc
{"navegacao": [{
  "id": 0,
  "rotas": ["<Rota>"],
  "entradas": ["<Entrada>"],
  "saidas": ["<Saída>"]
}]}
```

#### 2.7.1 Rotas

**Proposta pendente de validação:** o arquivo original apenas referencia `rotas.json`, não traz a definição das rotas. Manter rotas dentro de navegação. O formato mínimo abaixo segue o Markdown anterior; IDs devem ter escopo inequívoco (proposta: global). Não migrar IDs sem verificar destinos.

```jsonc
{"rotas": [{
  "id": 0, // inteiro
  "path": "<caminho_da_rota>" // string
}]}
```

#### 2.7.2 Entradas

Descrevem origem, evento, alternativa, condições e rota. Referências de estado pertencem à tela de origem; o estado de destino é identificado pelo bloco de navegação associado.

```jsonc
{"entradas": [{
  "origemTelaRef": "<id_da_tela_origem>",
  "origemEstadoRef": 0,
  "eventoRef": 0,
  "alternativaRef": 0,
  "condicoesOrigem": [{ "ref": "<caminho>" }],
  "condicoesDestino": [{ "op": "eq", "args": [{ "ref": "<caminho>" }, 0] }],
  "rotaRef": 0
}]}
```

##### 2.7.2.1 Condições de origem e destino — contrato local

A representação abaixo é uma gramática documental, não uma instância JSON. Permite definir objetos e arrays até qualquer profundidade sem duplicar indefinidamente o modelo.

```text
Literal = string | number | boolean | null
        | array de Literal | mapa<string, Literal>
Referencia = { ref: string }
Expressao = { op: string, args: array de Valor }
Valor = Literal | Referencia | Expressao
      | array de Valor | mapa<string, Valor>
Condicao = Referencia | Expressao
```

`ref` contém caminho textual; `op` seleciona operador; `args` contém argumentos posicionais e aceita expressões aninhadas. Objetos com chaves reservadas `ref` ou `op` precisam ser diferenciados de dados literais pelo motor (regra a formalizar). Campos que aceitam apenas literal não devem automaticamente avaliar expressões.

**Operadores observados e interpretação proposta**

| Operador | Quantidade observada de argumentos | Interpretação proposta |
|---|---:|---|
| eq | 2 | igualdade |
| ne | 2 | desigualdade |
| lte | 2 | menor ou igual |
| or | 2 | disjunção |
| if | 3 | condição, resultado verdadeiro, resultado falso |
| length | 1 | tamanho |
| contains | 2 | verifica inclusão |
| intersects | 2 | verifica interseção |
| split | 2 | separa texto |
| join | 2 | composição textual; separador a confirmar |
| concat | 3 | concatenação |
| number | 1 | conversão numérica |

A aridade é observada, não necessariamente limite do motor. Tipos de retorno, coerção, tratamento de erros e valores ausentes precisam de validação com a implementação.

**Referências e escopo:** `ref` é um caminho textual. Os prefixos observados são `local`, `dados`, `props`, `registro`, `derivados` e `item`; somente os contextos efetivamente disponíveis podem ser usados. A resolução e coerção dependem de validação no motor.

#### 2.7.3 Saídas

A fonte usa alternativas por evento. Preservar bifurcações em vez de achatar cada destino. `alternativaRef` das entradas deve resolver uma alternativa; o arquivo não define ID explícito nela, portanto o critério de resolução precisa ser validado.

```jsonc
{"saidas": [{
  "eventoRef": 0,
  "alternativas": [{
    "condicoes": [{ "ref": "<caminho>" }],
    "rotaRef": 0,
    "efeitos": [{ "tipo": "definir", "campo": "<caminho>", "valor": true }]
  }]
}]}
```

##### 2.7.3.1 Condições e efeitos das alternativas — contrato local

A representação abaixo é uma gramática documental, não uma instância JSON. Permite definir objetos e arrays até qualquer profundidade sem duplicar indefinidamente o modelo.

```text
Literal = string | number | boolean | null
        | array de Literal | mapa<string, Literal>
Referencia = { ref: string }
Expressao = { op: string, args: array de Valor }
Valor = Literal | Referencia | Expressao
      | array de Valor | mapa<string, Valor>
Condicao = Referencia | Expressao
```

`ref` contém caminho textual; `op` seleciona operador; `args` contém argumentos posicionais e aceita expressões aninhadas. Objetos com chaves reservadas `ref` ou `op` precisam ser diferenciados de dados literais pelo motor (regra a formalizar). Campos que aceitam apenas literal não devem automaticamente avaliar expressões.

**Operadores observados e interpretação proposta**

| Operador | Quantidade observada de argumentos | Interpretação proposta |
|---|---:|---|
| eq | 2 | igualdade |
| ne | 2 | desigualdade |
| lte | 2 | menor ou igual |
| or | 2 | disjunção |
| if | 3 | condição, resultado verdadeiro, resultado falso |
| length | 1 | tamanho |
| contains | 2 | verifica inclusão |
| intersects | 2 | verifica interseção |
| split | 2 | separa texto |
| join | 2 | composição textual; separador a confirmar |
| concat | 3 | concatenação |
| number | 1 | conversão numérica |

A aridade é observada, não necessariamente limite do motor. Tipos de retorno, coerção, tratamento de erros e valores ausentes precisam de validação com a implementação.

**Referências e escopo:** `ref` é um caminho textual. Os prefixos observados são `local`, `dados`, `props`, `registro`, `derivados` e `item`; somente os contextos efetivamente disponíveis podem ser usados. A resolução e coerção dependem de validação no motor.

#### 2.7.4 Alternativas e efeitos

Alternativas agrupam condições, rota e efeitos. `efeitos` admite a variante observada `definir`: `tipo` é o literal `definir`, `campo` é o caminho textual do dado a atualizar e `valor` é o valor literal ou expressão a atribuir. Não há `destinoTelaRef` nem `destinoEstadoRef` nas saídas originais; a resolução de destino depende das rotas e entradas. Ordem de avaliação e tratamento de alternativas concorrentes são pendências do contrato.

##### 2.7.4.1 Condições e valores dos efeitos — contrato local

A representação abaixo é uma gramática documental, não uma instância JSON. Permite definir objetos e arrays até qualquer profundidade sem duplicar indefinidamente o modelo.

```text
Literal = string | number | boolean | null
        | array de Literal | mapa<string, Literal>
Referencia = { ref: string }
Expressao = { op: string, args: array de Valor }
Valor = Literal | Referencia | Expressao
      | array de Valor | mapa<string, Valor>
Condicao = Referencia | Expressao
```

`ref` contém caminho textual; `op` seleciona operador; `args` contém argumentos posicionais e aceita expressões aninhadas. Objetos com chaves reservadas `ref` ou `op` precisam ser diferenciados de dados literais pelo motor (regra a formalizar). Campos que aceitam apenas literal não devem automaticamente avaliar expressões.

**Operadores observados e interpretação proposta**

| Operador | Quantidade observada de argumentos | Interpretação proposta |
|---|---:|---|
| eq | 2 | igualdade |
| ne | 2 | desigualdade |
| lte | 2 | menor ou igual |
| or | 2 | disjunção |
| if | 3 | condição, resultado verdadeiro, resultado falso |
| length | 1 | tamanho |
| contains | 2 | verifica inclusão |
| intersects | 2 | verifica interseção |
| split | 2 | separa texto |
| join | 2 | composição textual; separador a confirmar |
| concat | 3 | concatenação |
| number | 1 | conversão numérica |

A aridade é observada, não necessariamente limite do motor. Tipos de retorno, coerção, tratamento de erros e valores ausentes precisam de validação com a implementação.

**Referências e escopo:** `ref` é um caminho textual. Os prefixos observados são `local`, `dados`, `props`, `registro`, `derivados` e `item`; somente os contextos efetivamente disponíveis podem ser usados. A resolução e coerção dependem de validação no motor.

### 2.8 Dados

**Objetivo:** definir informações consumidas pela tela. **Função:** reunir fontes, operações e valores locais. **Uso:** alimentar expressões e renderização. O objeto pode não conter esses campos na fonte quando não são utilizados.

```jsonc
{"dados": {
  "fontes": ["<Fonte>"],
  "operacoes": ["<Operação>"],
  "locaisIniciais": { "<nome_do_campo>": "<Valor literal>" }
}}
```

#### 2.8.1 Fontes

`id` inteiro identifica a fonte local. `tipo` observado: mock. `registros` é coleção de mapas de campos específicos da fonte; valores seguem a gramática de valores literais. Não há contrato de banco ou API no material original.

```jsonc
{"fontes": [{
  "id": 0,
  "tipo": "mock",
  "registros": [{ "<campo_do_registro>": "<Valor literal>" }]
}]}
```

##### 2.8.1.1 Registros da fonte — contrato local

```text
Literal = string | number | boolean | null
        | array de Literal | mapa<string, Literal>
```

Cada chave dinâmica é textual; cada item de array e cada valor de mapa segue recursivamente o mesmo contrato, até chegar a um valor primitivo. Objetos e arrays vazios são válidos quando o contexto permite ausência de itens. Não avaliar `ref` ou `op` automaticamente em campos literais. A obrigatoriedade das chaves específicas de domínio depende do contrato da fonte, cenário ou propriedade.

#### 2.8.2 Operações

Variante observada: `filtrar`. `fonteRef` aponta para fonte da tela; `saida` nomeia resultado derivado; `campoResultado` seleciona campo do registro. Condições usam referências e expressões.

```jsonc
{"operacoes": [{
  "id": 0,
  "tipo": "filtrar",
  "fonteRef": 0,
  "saida": "<nome_do_resultado>",
  "campoResultado": "<campo_do_registro>",
  "condicoes": [{ "op": "eq", "args": [{ "ref": "registro.<campo>" }, "<valor>"] }]
}]}
```

##### 2.8.2.1 Condições das operações — contrato local

A representação abaixo é uma gramática documental, não uma instância JSON. Permite definir objetos e arrays até qualquer profundidade sem duplicar indefinidamente o modelo.

```text
Literal = string | number | boolean | null
        | array de Literal | mapa<string, Literal>
Referencia = { ref: string }
Expressao = { op: string, args: array de Valor }
Valor = Literal | Referencia | Expressao
      | array de Valor | mapa<string, Valor>
Condicao = Referencia | Expressao
```

`ref` contém caminho textual; `op` seleciona operador; `args` contém argumentos posicionais e aceita expressões aninhadas. Objetos com chaves reservadas `ref` ou `op` precisam ser diferenciados de dados literais pelo motor (regra a formalizar). Campos que aceitam apenas literal não devem automaticamente avaliar expressões.

**Operadores observados e interpretação proposta**

| Operador | Quantidade observada de argumentos | Interpretação proposta |
|---|---:|---|
| eq | 2 | igualdade |
| ne | 2 | desigualdade |
| lte | 2 | menor ou igual |
| or | 2 | disjunção |
| if | 3 | condição, resultado verdadeiro, resultado falso |
| length | 1 | tamanho |
| contains | 2 | verifica inclusão |
| intersects | 2 | verifica interseção |
| split | 2 | separa texto |
| join | 2 | composição textual; separador a confirmar |
| concat | 3 | concatenação |
| number | 1 | conversão numérica |

A aridade é observada, não necessariamente limite do motor. Tipos de retorno, coerção, tratamento de erros e valores ausentes precisam de validação com a implementação.

**Referências e escopo:** `ref` é um caminho textual. Os prefixos observados são `local`, `dados`, `props`, `registro`, `derivados` e `item`; somente os contextos efetivamente disponíveis podem ser usados. A resolução e coerção dependem de validação no motor.

#### 2.8.3 Dados locais iniciais

Mapa aberto de nomes de variáveis locais e seus valores iniciais. O tipo depende do campo. Exemplos genéricos mostram booleano, número, texto e lista.

```jsonc
{"locaisIniciais": {
  "<campo_booleano>": false,
  "<campo_numerico>": 0,
  "<campo_textual>": "<valor>",
  "<campo_lista>": ["<item>"]
}}
```

##### 2.8.3.1 Valores iniciais — contrato local

```text
Literal = string | number | boolean | null
        | array de Literal | mapa<string, Literal>
```

Cada chave dinâmica é textual; cada item de array e cada valor de mapa segue recursivamente o mesmo contrato, até chegar a um valor primitivo. Objetos e arrays vazios são válidos quando o contexto permite ausência de itens. Não avaliar `ref` ou `op` automaticamente em campos literais. A obrigatoriedade das chaves específicas de domínio depende do contrato da fonte, cenário ou propriedade.

### 2.9 Mocks

**Objetivo:** representar cenários simulados. **Função:** oferecer valores por cenário. **Uso:** prototipação e testes de estados. IDs são inteiros locais; não há referência explícita de cenário em estado na fonte.

```jsonc
{"mocks": { "cenarios": [{
  "id": 0,
  "nome": "<nome_do_cenario>",
  "dados": { "<campo_simulado>": "<Valor literal>" }
}]}}
```

#### 2.9.1 Dados de cenário

Mapa de campos específicos do contexto simulado. A fonte registra valores numéricos e mapas sem dados; o formato genérico literal é proposta extensível. Como o cenário é selecionado e como seus valores se combinam com os dados locais são pendências.

##### 2.9.1.1 Valores simulados — contrato local

```text
Literal = string | number | boolean | null
        | array de Literal | mapa<string, Literal>
```

Cada chave dinâmica é textual; cada item de array e cada valor de mapa segue recursivamente o mesmo contrato, até chegar a um valor primitivo. Objetos e arrays vazios são válidos quando o contexto permite ausência de itens. Não avaliar `ref` ou `op` automaticamente em campos literais. A obrigatoriedade das chaves específicas de domínio depende do contrato da fonte, cenário ou propriedade.

## 3 Componentes

**Objetivo:** definir entidades reutilizáveis. **Função:** encapsular propriedades, estrutura e eventos. **Uso:** composição das telas. O padrão documental é o mesmo das telas, mas o contrato atual não é idêntico.

### 3.1 Estrutura Macro do Componente

| Campo | Tipo | Finalidade |
|---|---|---|
| identidade | objeto | Identificação |
| propriedades | array de strings | Entradas configuráveis |
| estrutura | objeto | Estrutura visual |
| estados | array | Variações (pendente) |
| interacoes | array de strings | Eventos emitidos |

### 3.2 Identidade

**Objetivo:** identificar componente. **Função:** definir ID e tipo. **Uso:** resolver composição. Nome e namespace não aparecem na identidade dos três componentes originais.

```jsonc
{"identidade": { "id": "<id_do_componente>", "tipo": "componente" }}
```

### 3.3 Propriedades

**Objetivo:** declarar entradas. **Função:** permitir configuração. **Uso:** receber valores da composição. A fonte só declara nomes (strings), não tipos, obrigatoriedade ou defaults.

```jsonc
{"propriedades": ["<nome_da_propriedade>"]}
```

#### 3.3.1 Contrato de propriedade — proposta

Para eliminar ambiguidade futuramente, pode-se migrar a lista de strings para objetos tipados. Não é compatível automaticamente com o formato existente; requer aprovação e adaptação do motor.

```jsonc
{
  "nome": "<nome_da_propriedade>",
  "tipo": "<string|number|boolean|object|array|null>",
  "obrigatoria": false,
  "valorPadrao": null
}
```

##### 3.3.1.1 Valor padrão (proposta) — contrato local

```text
Literal = string | number | boolean | null
        | array de Literal | mapa<string, Literal>
```

Cada chave dinâmica é textual; cada item de array e cada valor de mapa segue recursivamente o mesmo contrato, até chegar a um valor primitivo. Objetos e arrays vazios são válidos quando o contexto permite ausência de itens. Não avaliar `ref` ou `op` automaticamente em campos literais. A obrigatoriedade das chaves específicas de domínio depende do contrato da fonte, cenário ou propriedade.

### 3.4 Estrutura

**Objetivo:** definir visual. **Função:** reunir HTML e CSS. **Uso:** reutilização na árvore da tela. Diferente da tela, a estrutura é um objeto na fonte.

```jsonc
{"estrutura": {
  "html": "<HTML de componente>",
  "css": "<CSS>"
}}
```

#### 3.4.1 HTML

A raiz referencia um elemento local. O arquivo não possui `composicao` no HTML de componente.

```jsonc
{"html": { "raizRef": 0, "elementos": ["<Elemento de componente>"] }}
```

#### 3.4.2 Elementos

Cada nó tem `id` inteiro local, `tag` textual, `paiRef` inteiro ou null para a raiz e `ordem` numérica (inclusive decimal observado). `estiloRefs` referencia regras CSS locais; também admite expressões condicionais. Validar existência dos pais e ausência de ciclos. O mapa `atributos` contém nomes HTML/SVG e valores; `texto` define conteúdo, `visivelQuando` controla visibilidade e `repetir` resolve uma coleção com contexto do item. Inclui emissão de evento. Campos dinâmicos são opcionais.

```jsonc
{
  "id": 0,
  "tag": "<tag_html>",
  "paiRef": null,
  "ordem": 0,
  "estiloRefs": [0, { "op": "if", "args": [{ "ref": "props.<campo>" }, 1, null] }],
  "atributos": { "<atributo>": "<Valor>" },
  "texto": { "ref": "props.<propriedade>" },
  "visivelQuando": { "ref": "props.<condicao>" },
  "repetir": { "ref": "props.<colecao>" },
  "emite": { "evento": "<evento_declarado>", "valor": { "ref": "<caminho_do_item>" } }
}
```

##### 3.4.2.1 Estilos condicionais, atributos e conteúdo — contrato local

A representação abaixo é uma gramática documental, não uma instância JSON. Permite definir objetos e arrays até qualquer profundidade sem duplicar indefinidamente o modelo.

```text
Literal = string | number | boolean | null
        | array de Literal | mapa<string, Literal>
Referencia = { ref: string }
Expressao = { op: string, args: array de Valor }
Valor = Literal | Referencia | Expressao
      | array de Valor | mapa<string, Valor>
Condicao = Referencia | Expressao
```

`ref` contém caminho textual; `op` seleciona operador; `args` contém argumentos posicionais e aceita expressões aninhadas. Objetos com chaves reservadas `ref` ou `op` precisam ser diferenciados de dados literais pelo motor (regra a formalizar). Campos que aceitam apenas literal não devem automaticamente avaliar expressões.

**Operadores observados e interpretação proposta**

| Operador | Quantidade observada de argumentos | Interpretação proposta |
|---|---:|---|
| eq | 2 | igualdade |
| ne | 2 | desigualdade |
| lte | 2 | menor ou igual |
| or | 2 | disjunção |
| if | 3 | condição, resultado verdadeiro, resultado falso |
| length | 1 | tamanho |
| contains | 2 | verifica inclusão |
| intersects | 2 | verifica interseção |
| split | 2 | separa texto |
| join | 2 | composição textual; separador a confirmar |
| concat | 3 | concatenação |
| number | 1 | conversão numérica |

A aridade é observada, não necessariamente limite do motor. Tipos de retorno, coerção, tratamento de erros e valores ausentes precisam de validação com a implementação.

**Referências e escopo:** `ref` é um caminho textual. Os prefixos observados são `local`, `dados`, `props`, `registro`, `derivados` e `item`; somente os contextos efetivamente disponíveis podem ser usados. A resolução e coerção dependem de validação no motor.

#### 3.4.3 Emissão de eventos

`emite.evento` é string declarada em `interacoes` do componente. `emite.valor` é objeto: na fonte, objeto sem campos ou referência `ref`. A tela captura via `origem.composicaoRef` e `origem.evento`. Um evento sem payload pode usar objeto vazio por significado, não por falta de documentação.

##### 3.4.3.1 Valor emitido — contrato local

A representação abaixo é uma gramática documental, não uma instância JSON. Permite definir objetos e arrays até qualquer profundidade sem duplicar indefinidamente o modelo.

```text
Literal = string | number | boolean | null
        | array de Literal | mapa<string, Literal>
Referencia = { ref: string }
Expressao = { op: string, args: array de Valor }
Valor = Literal | Referencia | Expressao
      | array de Valor | mapa<string, Valor>
Condicao = Referencia | Expressao
```

`ref` contém caminho textual; `op` seleciona operador; `args` contém argumentos posicionais e aceita expressões aninhadas. Objetos com chaves reservadas `ref` ou `op` precisam ser diferenciados de dados literais pelo motor (regra a formalizar). Campos que aceitam apenas literal não devem automaticamente avaliar expressões.

**Operadores observados e interpretação proposta**

| Operador | Quantidade observada de argumentos | Interpretação proposta |
|---|---:|---|
| eq | 2 | igualdade |
| ne | 2 | desigualdade |
| lte | 2 | menor ou igual |
| or | 2 | disjunção |
| if | 3 | condição, resultado verdadeiro, resultado falso |
| length | 1 | tamanho |
| contains | 2 | verifica inclusão |
| intersects | 2 | verifica interseção |
| split | 2 | separa texto |
| join | 2 | composição textual; separador a confirmar |
| concat | 3 | concatenação |
| number | 1 | conversão numérica |

A aridade é observada, não necessariamente limite do motor. Tipos de retorno, coerção, tratamento de erros e valores ausentes precisam de validação com a implementação.

**Referências e escopo:** `ref` é um caminho textual. Os prefixos observados são `local`, `dados`, `props`, `registro`, `derivados` e `item`; somente os contextos efetivamente disponíveis podem ser usados. A resolução e coerção dependem de validação no motor.

#### 3.4.4 CSS

**Objetivo:** definir estilos. **Função:** reunir tokens e regras. **Uso:** aplicar estilos referenciados pelo HTML. `tokens` é um mapa de nome de token para valor CSS textual.

```jsonc
{"css": {
  "tokens": { "<nome_do_token>": "<valor_css>" },
  "regras": [
    { "id": 0, "seletor": "<seletor_css>", "declaracoes": "<declaracoes_css>", "classe": "<classe_css>" },
    { "id": 1, "bloco": "<bloco_css_completo>" }
  ]
}}
```

As duas formas de regra foram observadas: seletor e declarações textuais (com `classe` opcional), ou bloco CSS textual completo. IDs são inteiros. Não converter declarações em objetos sem migração explícita. A relação entre `classe` e seletor deve ser consistente.

 A referência de estilo de componente pode ser inteiro ou expressão que retorna um ID ou null, conforme observado.

##### 3.4.4.1 Tokens — campos e valores

- Chave: string que identifica o token de estilo.
- Valor: string CSS, por exemplo `<cor_css>`, `<medida_css>` ou `<valor_css>`.
- O mapa pode estar vazio quando não existem tokens.

##### 3.4.4.2 Regras — campos e variantes

| Campo | Tipo | Uso |
|---|---|---|
| `id` | inteiro | Identificador único da regra no CSS local. |
| `seletor` | string | Seletor CSS da regra declarativa. |
| `declaracoes` | string | Lista textual de declarações CSS. |
| `classe` | string opcional | Nome da classe associada à regra. |
| `bloco` | string | Bloco CSS completo, variante alternativa. |

**Declarações e propriedades CSS:** no formato observado, as propriedades não são chaves JSON independentes: integram a string `declaracoes` no formato `<propriedade_css>: <valor_css>;`. O valor é texto CSS, podendo conter funções e unidades CSS. O campo `bloco` contém texto CSS completo. Não há um contrato observado de expressões JSON dentro desses valores; introduzi-lo exigiria migração.

**Integridade:** cada referência de estilo deve resolver um ID existente no CSS da entidade. IDs duplicados e referências inexistentes devem ser sinalizados.

### 3.5 Estados

**Objetivo:** representar variações. **Função:** adaptar componente ao contexto. **Uso:** seleção de comportamento. Todos os componentes originais têm array vazio, sem contrato interno observável. Abaixo, proposta mínima para discussão, usando a estrutura única existente; não é um contrato confirmado.

```jsonc
{"estados": [{
  "id": 0,
  "nome": "<nome_do_estado>",
  "condicoes": [{ "ref": "props.<campo>" }]
}]}
```

#### 3.5.1 Condições do componente — contrato local

A representação abaixo é uma gramática documental, não uma instância JSON. Permite definir objetos e arrays até qualquer profundidade sem duplicar indefinidamente o modelo.

```text
Literal = string | number | boolean | null
        | array de Literal | mapa<string, Literal>
Referencia = { ref: string }
Expressao = { op: string, args: array de Valor }
Valor = Literal | Referencia | Expressao
      | array de Valor | mapa<string, Valor>
Condicao = Referencia | Expressao
```

`ref` contém caminho textual; `op` seleciona operador; `args` contém argumentos posicionais e aceita expressões aninhadas. Objetos com chaves reservadas `ref` ou `op` precisam ser diferenciados de dados literais pelo motor (regra a formalizar). Campos que aceitam apenas literal não devem automaticamente avaliar expressões.

**Operadores observados e interpretação proposta**

| Operador | Quantidade observada de argumentos | Interpretação proposta |
|---|---:|---|
| eq | 2 | igualdade |
| ne | 2 | desigualdade |
| lte | 2 | menor ou igual |
| or | 2 | disjunção |
| if | 3 | condição, resultado verdadeiro, resultado falso |
| length | 1 | tamanho |
| contains | 2 | verifica inclusão |
| intersects | 2 | verifica interseção |
| split | 2 | separa texto |
| join | 2 | composição textual; separador a confirmar |
| concat | 3 | concatenação |
| number | 1 | conversão numérica |

A aridade é observada, não necessariamente limite do motor. Tipos de retorno, coerção, tratamento de erros e valores ausentes precisam de validação com a implementação.

**Referências e escopo:** `ref` é um caminho textual. Os prefixos observados são `local`, `dados`, `props`, `registro`, `derivados` e `item`; somente os contextos efetivamente disponíveis podem ser usados. A resolução e coerção dependem de validação no motor.

### 3.6 Interações

**Objetivo:** declarar eventos disponibilizados. **Função:** identificar eventos emitidos. **Uso:** comunicação com tela. A fonte usa strings, não objetos de ações; o comportamento é configurado pela tela.

```jsonc
{"interacoes": ["<nome_do_evento>"]}
```

## 4 Relação com os módulos do sistema

| Módulo | Fonte |
|---|---|
| Catálogo de telas | `identidade` |
| Perfis | `classificacao.perfilRef` |
| Jornadas | `classificacao.jornadas` |
| Subjornadas | `classificacao.jornadas[].subjornadas` |
| Fluxo | `navegacao` |
| Catálogo de rotas | `navegacao[].rotas` |
| Protótipo | `estrutura` + `estados` |
| Mapa de interações | `interacoes` + `navegacao` |
| Banco | `dados` |
| Simulação | `mocks` |

## 5 Situação da especificação

Documento em construção, não um JSON Schema validado nem confirmação de compatibilidade com o motor. Jornadas ficam em classificação e rotas em navegação; a migração do JSON original ainda não foi executada. `nomeExibicao` foi removido da proposta. O formato original de saídas com alternativas foi preservado. As pendências de tipos, propriedades, estados, rotas, referências, operadores e cenários estão descritas junto aos respectivos campos. A uniformização integral de telas e componentes não foi presumida.

## 6 Módulos

Especificações dos módulos do sistema.

### 6.1 Fluxo

**Especificação de requisitos — Visualizador de Fluxo.**

O HTML deverá reproduzir fielmente o design da imagem apresentada, mantendo a organização visual, as proporções, os espaçamentos, os cards, as bifurcações e os controles de interação. A proposta é que o HTML seja uma interface dinâmica, alimentada por JSON, e não uma representação estática das telas.

#### 6.1.1 Requisitos de design (UI)

Reproduzir fielmente a imagem de referência: organização visual, proporções, espaçamentos, cards, bifurcações e controles.

##### 6.1.1.1 Layout geral

| ID | Propriedade | Requisito |
| --- | --- | --- |
| UI-001 | Organização | Fluxo vertical de cards |
| UI-002 | Fundo | Cinza azulado muito claro |
| UI-003 | Alinhamento | Conteúdo centralizado horizontalmente |
| UI-004 | Largura | Aproximadamente 90% da área disponível |
| UI-005 | Espaçamento | Uniforme entre cards |
| UI-006 | Separadores | Linhas horizontais finas entre etapas |
| UI-007 | Bordas | Finas, azul-acinzentadas |
| UI-008 | Sombras | Suaves e discretas |
| UI-009 | Responsividade | Desktop, tablet e mobile |
| UI-010 | Densidade | Interface compacta, sem espaços excessivos |

##### 6.1.1.2 Paleta de cores

As cores abaixo são estimativas visuais da imagem e deverão ser refinadas durante a implementação.

| Elemento | Cor |
| --- | --- |
| Fundo geral | #EFF3F8 |
| Fundo dos cards | #FFFFFF |
| Bordas dos cards | #D2DEED |
| Títulos e aba ativa | #12243E |
| Textos secundários | #64748B |
| Identificador de tela | #E8F0FA |
| Identificador de bifurcação | #E5F1E4 |
| Ações de remoção | #A33F49 |

##### 6.1.1.3 Dimensões e tipografia

| Elemento | Especificação |
| --- | --- |
| Margem lateral | 4% a 6% |
| Altura mínima do card | 52 px na escala da referência |
| Espaçamento entre cards | 15–16 px |
| Padding interno | 8–12 px |
| Arredondamento do card | 8–10 px |
| Espessura da borda | 1 px |
| Título da tela | Negrito, compacto |
| Classificação | Texto pequeno, cor secundária |
| Identificador técnico | Texto pequeno, sem negrito |
| Botões | Compactos, com borda e fundo claro |
| Fonte sugerida | Arial ou Inter |

Os valores não devem ser tratados como dimensões originais confirmadas, pois a imagem pode estar redimensionada.

#### 6.1.2 Componentes visuais



##### 6.1.2.1 Card de tela

1. Alça de movimentação do card.
2. Identificador do tipo: TELA.
3. Classificação e contexto da tela.
4. Nome da tela.
5. Identificador técnico único.
6. Indicador da situação do mapa (Mapa: A DEFINIR).
7. Grupo de ações disponíveis (↑, ↓, Visual, Remover).

A alça fica à esquerda, os metadados e título ao centro-esquerda, o indicador e ações à direita. Exemplos da referência: Splash — `auth.inicializacao.splash`; Boas-vindas — `auth.inicializacao.boas_vindas`; Entrar — `auth.sessao.entrar`.

##### 6.1.2.2 Card de bifurcação

A bifurcação deverá ser um componente diferente do card de tela, embora utilize a mesma identidade visual.

| Elemento | Requisito |
| --- | --- |
| Cabeçalho | Fundo levemente diferente do conteúdo |
| Identificador | BIFURCAÇÃO, com fundo verde-claro |
| Nome | Título da bifurcação em negrito |
| Abas | Uma aba para cada caminho possível |
| Contadores | Quantidade de elementos vinculados à rota |
| Aba ativa | Fundo azul-escuro e texto branco |
| Aba inativa | Fundo cinza azulado e borda fina |
| Conteúdo | Cards pertencentes à rota selecionada |
| Hierarquia | Possibilidade de bifurcações internas |
| Delimitação | Borda envolvendo toda a bifurcação |

Exemplo visual: Fluxo de login, com ações ↑, ↓, Editar e Remover; abas Entrar (1), Cadastrar (2), Esqueceu a senha (0). Os conteúdos internos não são visíveis na referência; nomes utilizados na demonstração anterior eram ilustrativos.

#### 6.1.3 Requisitos funcionais (UX)



##### 6.1.3.1 Gerenciamento das telas

| ID | Funcionalidade | Requisito |
| --- | --- | --- |
| RF-001 | Adicionar tela | Inserir uma tela em uma posição do fluxo |
| RF-002 | Remover tela | Retirar a ocorrência da tela no fluxo |
| RF-003 | Mover para cima | Alterar a posição dentro da mesma rota |
| RF-004 | Mover para baixo | Alterar a posição dentro da mesma rota |
| RF-005 | Arrastar e soltar | Reordenar elementos pela alça lateral |
| RF-006 | Visual | Abrir o protótipo visual da tela |
| RF-007 | Abrir mapa | Clicar no card para acessar o mapa da tela |
| RF-008 | Classificação | Exibir jornada e subjornada |
| RF-009 | Identificação | Exibir o ID técnico da tela |
| RF-010 | Indicador do mapa | Informar se existe mapa vinculado |

##### 6.1.3.2 Gerenciamento de bifurcações

| ID | Funcionalidade | Requisito |
| --- | --- | --- |
| RF-011 | Adicionar bifurcação | Criar uma divisão de caminhos |
| RF-012 | Editar bifurcação | Alterar nome e configuração |
| RF-013 | Remover bifurcação | Remover mediante confirmação |
| RF-014 | Reordenar bifurcação | Movimentar todo o bloco |
| RF-015 | Adicionar rota | Criar uma nova aba |
| RF-016 | Editar rota | Alterar nome e condição |
| RF-017 | Remover rota | Excluir uma aba e tratar seus vínculos |
| RF-018 | Alternar rota | Exibir apenas o conteúdo da aba ativa |
| RF-019 | Contador automático | Atualizar a quantidade de elementos |
| RF-020 | Bifurcações aninhadas | Permitir bifurcações dentro de outras rotas |
| RF-021 | Estados | Representar caminhos condicionados por estados |
| RF-022 | Rota vazia | Permitir uma aba sem telas vinculadas |

##### 6.1.3.3 Interações visuais

| Interação | Resultado |
| --- | --- |
| Passar mouse sobre card | Realce discreto da borda |
| Clicar no card | Abrir mapa correspondente |
| Clicar em Visual | Abrir visualização da tela |
| Clicar na seta para cima | Mover elemento |
| Clicar na seta para baixo | Mover elemento |
| Clicar em Remover | Solicitar confirmação |
| Clicar em Editar | Abrir modal de edição |
| Clicar em uma aba | Alternar rota ativa |
| Arrastar pela alça | Reordenar elemento |
| Primeiro elemento | Seta para cima desabilitada |
| Último elemento | Seta para baixo desabilitada |

#### 6.1.4 Organização hierárquica do fluxo

A interface deverá trabalhar de maneira recursiva. Isso permitirá acrescentar novas telas, rotas e bifurcações sem modificar o HTML estrutural.

```text
Fluxo
├── Tela: Splash
├── Tela: Boas-vindas
├── Tela: Entrar
└── Bifurcação: Fluxo de login
    ├── Rota: Entrar
    │   └── Tela
    ├── Rota: Cadastrar
    │   ├── Tela
    │   └── Tela
    └── Rota: Esqueceu a senha
```

Cada rota poderá conter telas e novas bifurcações, utilizando os mesmos componentes visuais.

#### 6.1.5 Estrutura de dados JSON

O JSON deverá fornecer os dados necessários para renderizar a interface.

```json
{
  "id": "fluxo.autenticacao",
  "nome": "Autenticação e cadastro",
  "elementos": [
    {
      "id": "no.splash",
      "tipo": "tela",
      "telaRef": "auth.inicializacao.splash",
      "ordem": 1
    },
    {
      "id": "no.boas_vindas",
      "tipo": "tela",
      "telaRef": "auth.inicializacao.boas_vindas",
      "ordem": 2
    },
    {
      "id": "no.entrar",
      "tipo": "tela",
      "telaRef": "auth.sessao.entrar",
      "ordem": 3
    },
    {
      "id": "bifurcacao.login",
      "tipo": "bifurcacao",
      "nome": "Fluxo de login",
      "ordem": 4,
      "rotas": [
        {
          "id": "rota.entrar",
          "nome": "Entrar",
          "ordem": 1,
          "condicaoRef": null,
          "elementos": []
        },
        {
          "id": "rota.cadastrar",
          "nome": "Cadastrar",
          "ordem": 2,
          "condicaoRef": null,
          "elementos": []
        },
        {
          "id": "rota.recuperar_senha",
          "nome": "Esqueceu a senha",
          "ordem": 3,
          "condicaoRef": null,
          "elementos": []
        }
      ]
    }
  ]
}
```

O JSON acima representa um modelo estrutural. As rotas internas estão vazias porque a imagem não apresenta seus conteúdos completos.

##### 6.1.5.1 Regras de dados

| Campo | Responsabilidade |
| --- | --- |
| `id` | Identificador permanente da ocorrência |
| `tipo` | Determinar o componente renderizado |
| `telaRef` | Referenciar a tela no catálogo |
| `ordem` | Definir a posição visual |
| `rotas` | Armazenar os caminhos da bifurcação |
| `elementos` | Armazenar telas e bifurcações |
| `condicaoRef` | Referenciar a condição de navegação |

**O ID nunca deverá mudar ao reordenar um elemento.** Apenas sua posição será atualizada. A ordem inicial deverá respeitar as rotas de entrada e saída das telas, e não a ordem arbitrária do catálogo. O modelo de fluxo é uma projeção proposta da navegação original; não substitui o contrato de navegação existente.

#### 6.1.6 Arquitetura de arquivos

```text
projeto/
├── index.html
├── estilo.css
├── motor.js
├── dados/
│   ├── modulos.json
│   ├── fluxo.json
│   ├── telas.json
│   └── mapa.json
└── modulos/
    └── fluxo/
        ├── index.html
        ├── estilo.css
        └── motor.js
```

##### 6.1.6.1 Separação de responsabilidades

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` geral | Estrutura principal e menu de módulos |
| `estilo.css` geral | Identidade visual compartilhada |
| `motor.js` geral | Carregar módulos e distribuir dados |
| `modulos.json` | Registro dos módulos disponíveis |
| `fluxo/index.html` | Estrutura da interface do fluxo |
| `fluxo/estilo.css` | Design específico da imagem |
| `fluxo/motor.js` | Renderização e interações do fluxo |
| `fluxo.json` | Organização das ocorrências e bifurcações |
| `telas.json` | Definições das telas |
| `mapa.json` | Informações e relações de cada tela |

##### 6.1.6.2 Comunicação entre os componentes

```text
Motor geral (carregamento e distribuição)
    ├── fluxo.json
    ├── telas.json
    └── mapa.json
            ↓
Motor do módulo Fluxo (relaciona, ordena e renderiza)
    ├── Card de tela
    ├── Bifurcação
    └── Rotas e abas
            ↓
Interface visual
```

#### 6.1.7 Importação, exportação e persistência

| ID | Funcionalidade | Requisito |
| --- | --- | --- |
| RF-023 | Importar JSON | Reconstruir o fluxo automaticamente |
| RF-024 | Exportar JSON | Exportar a estrutura atualizada |
| RF-025 | Validar JSON | Verificar campos e referências |
| RF-026 | Persistência local | Preservar alterações após atualizar a página |
| RF-027 | Sincronização | Atualizar interface após alterações |
| RF-028 | Integridade | Impedir IDs duplicados de ocorrências |
| RF-029 | Referências | Identificar telas ou mapas inexistentes |
| RF-030 | Reutilização | Permitir a mesma tela em diferentes rotas |

#### 6.1.8 Critérios de aceite

- [ ] Design fiel à imagem de referência.
- [ ] Cards compactos com a mesma organização visual.
- [ ] Mesma identidade visual para telas e bifurcações.
- [ ] Abas e contadores funcionando dinamicamente.
- [ ] Bifurcações com múltiplos níveis.
- [ ] Reordenação por setas e arrastar e soltar.
- [ ] Clique no card abrindo o mapa correspondente.
- [ ] Botão Visual abrindo o protótipo.
- [ ] Renderização alimentada por JSON.
- [ ] IDs permanentes e ordem independente.
- [ ] Importação e exportação funcionais.
- [ ] Separação entre HTML, CSS, motor e dados.
- [ ] Ausência de telas fixas escritas diretamente no HTML.
- [ ] Preservação da navegação por rotas e estados.

#### 6.1.9 Diretrizes obrigatórias de implementação

- Não redesenhar a interface original.
- Não substituir os cards por tabelas ou diagramas de nós.
- Não aumentar desnecessariamente os botões, fontes e espaçamentos.
- Não duplicar as definições das telas no JSON de fluxo.
- Não criar bifurcações automaticamente sem fundamento nas rotas existentes.
- Não concentrar todas as responsabilidades no motor geral.
- Não alterar o design ao adicionar novas funcionalidades.
- Utilizar componentes reutilizáveis e renderização recursiva.

**A ideia central é preservar integralmente a interface da referência e construir um motor novo, simples e orientado a dados por trás dela.** O design permanece estável, enquanto as telas, rotas, estados e bifurcações passam a ser dinâmicos.

As funcionalidades não demonstradas diretamente na imagem, como persistência, importação, exportação e bifurcações aninhadas, são requisitos propostos para manter a compatibilidade com a arquitetura do projeto. Esta etapa é documental, não constitui implementação do HTML.

### 6.2 Jornadas



#### 6.2.1 Objetivo e escopo

Visualizar as telas do AdvogadoJá Plus agrupadas por jornada e subjornada, em sequência de navegação, com protótipos mobile lado a lado. O módulo é um inventário visual navegável, não um diagrama de fluxo nem um editor de telas. O design deve reproduzir a imagem de referência: cabeçalho azul-marinho compacto, barra de controles branca, fundo cinza azulado e grupos brancos horizontais com miniaturas reais das telas.

A imagem mostra três grupos: Inicialização e login, Cadastro comum e Recuperação de acesso. Os demais grupos devem vir do JSON, sem limitar o módulo aos exemplos.

#### 6.2.2 Requisitos de design (UI)

| ID | Elemento | Requisito |
|---|---|---|
| UI-001 | Cabeçalho | Faixa horizontal azul-marinho, título branco alinhado à esquerda, subtítulo pequeno e destaque dourado no Plus, como na referência. |
| UI-002 | Barra de controles | Faixa branca compacta imediatamente abaixo do cabeçalho, com seletores de escala e tela. |
| UI-003 | Fundo | Cinza azulado muito claro, sem decoração adicional. |
| UI-004 | Grupos | Seções brancas de largura disponível, borda fina azul-acinzentada, cantos discretamente arredondados. |
| UI-005 | Título do grupo | Numeração sequencial de apresentação, nome em negrito, alinhado no canto superior esquerdo. |
| UI-006 | Galeria | Telas em uma linha horizontal, alinhadas pelo topo, da esquerda para a direita. |
| UI-007 | Espaço livre | Preservar a área branca à direita quando houver poucas telas; não centralizar nem esticar as miniaturas. |
| UI-008 | Identificação | Acima de cada miniatura: número da tela, nome em negrito e identificador técnico menor. |
| UI-009 | Protótipo | Moldura retangular vertical, borda fina, cantos pequenos; sem simulação decorativa de aparelho. |
| UI-010 | Conteúdo | Renderizar HTML/CSS real de cada tela, preservando cores, fontes, imagens, componentes, proporções e estados. |
| UI-011 | Rolagem | Tela longa com rolagem vertical interna; não comprimir o conteúdo para fazê-lo caber. |
| UI-012 | Ampliação | Botão pequeno “Ampliar tela”, abaixo de cada miniatura, alinhado à esquerda. |
| UI-013 | Densidade | Interface compacta, margens e espaçamentos pequenos e consistentes. |
| UI-014 | Responsividade | Em telas estreitas, manter a proporção e permitir rolagem horizontal dentro do grupo; página com rolagem vertical. |
| UI-015 | Integração | Quando incorporado ao projeto, usar menu global existente, sem duplicar cabeçalho ou navegação; manter a faixa de identificação do módulo quando necessária. |

##### 6.2.2.1 Paleta visual proposta

| Token | Cor aproximada | Uso |
|---|---|---|
| `--navy` | `#10223B` | Cabeçalho e texto principal |
| `--gold` | `#C9A45A` | Destaque Plus |
| `--canvas` | `#EDF2F6` | Fundo geral |
| `--surface` | `#FFFFFF` | Grupos e controles |
| `--border` | `#CCD9E8` | Bordas |
| `--muted` | `#64748B` | Identificadores e textos secundários |

Cores são estimativas da captura; não substituem os tokens originais das telas.

##### 6.2.2.2 Dimensões e escala

Na captura de 1366 × 768, a área do aplicativo começa abaixo da interface do navegador. Observam-se margem externa de aproximadamente 5–7 px, miniaturas de cerca de 79 × 172 px, intervalo horizontal de 5–6 px e grupos separados por cerca de 7 px. Essas são medidas na escala exibida na captura, não dimensões nativas dos protótipos.

- Usar escala configurável; proposta: 20%, 30%, 50%, 75%, 100%.
- Usar viewport mobile configurável (referência inicial proposta: 390 × 844 CSS px).
- Calcular largura e altura externas pela escala escolhida, preservando proporção e viewport lógico; não usar zoom que altere a estrutura responsiva da tela.
- Tipografia da interface externa: compacta, sans-serif; fonte original de cada protótipo deve ser mantida.
- Não impor largura máxima centralizada à galeria; ela ocupa a área disponível.

#### 6.2.3 Componentes visuais



##### 6.2.3.1 Estrutura geral

```text
Módulo Jornadas
├── Cabeçalho / identificação do módulo
├── Barra de controles
│   ├── Escala
│   ├── Selecionar tela
│   └── Filtros e ações complementares (propostos)
└── Área de jornadas
    ├── Grupo 01 — Inicialização e login
    │   ├── Splash
    │   ├── Boas-vindas
    │   └── Login
    ├── Grupo 02 — Cadastro comum
    │   ├── Tipo de conta
    │   ├── Identificação
    │   ├── Contato
    │   ├── Endereço
    │   ├── Acesso e segurança
    │   ├── Termos e privacidade
    │   ├── Revisão de cadastro
    │   └── Cadastro concluído
    └── Grupo 03 — Recuperação de acesso
        ├── Recuperação de senha
        └── Redefinição de senha
```

Os nomes acima são transcrições visuais/descrições dos exemplos exibidos; o JSON vigente é a fonte dos nomes e IDs reais.

##### 6.2.3.2 Grupo de jornada/subjornada

Título compacto seguido de uma galeria horizontal. Quando uma jornada possui várias subjornadas, renderizar um grupo por subjornada, preservando o vínculo com a jornada pai. A numeração é visual e derivada da ordenação; não serve como identificador. Não criar abas de bifurcação neste módulo: essa representação pertence ao módulo Fluxo.

##### 6.2.3.3 Card de ocorrência de tela

```text
Número da tela
Nome da tela
ID técnico
┌─────────────────┐
│ HTML/CSS real   │
│ da tela mobile  │
│                 │
│ rolagem interna │
└─────────────────┘
[ Ampliar tela ]
```

O card é uma ocorrência, não uma cópia da definição da tela. A mesma tela pode aparecer em várias jornadas/subjornadas. O nome e o ID técnico são obtidos do catálogo. A ordem visual e o identificador da ocorrência são independentes.

##### 6.2.3.4 Visualização ampliada (proposta)

Modal com título, identificação técnica, jornada/subjornada, protótipo em escala legível e controle de fechar. Se houver múltiplos estados, oferecer seletor discreto na parte inferior da visualização. Exibir estado atual, sem alterar a definição original. Disponibilizar informações da ocorrência e acesso ao mapa, se integrado. Fechar retorna ao mesmo ponto da galeria.

#### 6.2.4 Requisitos funcionais (UX)

| ID | Funcionalidade | Comportamento |
|---|---|---|
| RF-001 | Carregar catálogo | Ler as definições de telas e componentes do JSON compartilhado. |
| RF-002 | Agrupar | Associar as telas às jornadas e subjornadas declaradas em classificação. |
| RF-003 | Ordenar | Derivar sequência pelas entradas e saídas de navegação, não pela ordem das chaves do catálogo. |
| RF-004 | Renderizar miniaturas | Exibir protótipos reais, não imagens estáticas nem cards genéricos. |
| RF-005 | Escala global | Alterar simultaneamente a escala de todas as miniaturas. |
| RF-006 | Selecionar tela | Localizar a ocorrência escolhida, deslocar a página até ela e destacá-la temporariamente. |
| RF-007 | Ampliar tela | Abrir visualização legível sem perder a posição da galeria. |
| RF-008 | Rolagem interna | Navegar pelo conteúdo longo de cada protótipo sem deslocar toda a página indevidamente. |
| RF-009 | Estados | Selecionar estados disponíveis em telas com múltiplos estados, no visual ampliado. |
| RF-010 | Componentes | Resolver componentes reutilizáveis e suas propriedades pelo motor compartilhado. |
| RF-011 | Mocks | Alimentar o protótipo com dados simulados e indicar erros de resolução. |
| RF-012 | Ocorrências | Preservar participações repetidas da mesma tela em jornadas ou caminhos distintos. |
| RF-013 | Informações | Exibir identidade, classificação, estado e contexto de navegação da ocorrência. |
| RF-014 | Mapa | Abrir o mapa correspondente por ação explícita, quando disponível. |
| RF-015 | Filtros | Filtrar por perfil, jornada, subjornada e busca por nome/ID, como extensão proposta. |
| RF-016 | Limpar filtros | Restaurar a galeria completa. |
| RF-017 | Importar JSON | Validar e carregar dados do módulo, preservando os demais módulos. |
| RF-018 | Exportar JSON | Exportar individualmente os dados/projeção do módulo Jornadas. |
| RF-019 | Exportar Markdown | Gerar inventário textual das jornadas exibidas, com nomes, IDs, ocorrências e ordem; ação complementar proposta. |
| RF-020 | Persistência | Preservar preferências de escala e filtros localmente, sem modificar catálogo. |
| RF-021 | Dados incompletos | Sinalizar ausência de classificação, estrutura, rota ou referência sem inventar informações. |
| RF-022 | Atualização | Recalcular a projeção quando os dados compartilhados forem alterados. |
| RF-023 | Isolamento | Impedir que CSS ou eventos internos de uma tela modifiquem outras miniaturas ou a interface geral. |
| RF-024 | Desempenho | Renderizar sob demanda grupos/miniaturas fora da área visível, mantendo dimensões e ordem. |

RF-001 a RF-024 são requisitos propostos para implementação; a captura confirma a disposição visual, os seletores e a ação de ampliação, mas não comprova o comportamento interno do HTML original.

#### 6.2.5 Contrato de dados e motor



##### 6.2.5.1 Fontes de verdade

| Informação | Origem |
|---|---|
| ID e nome | `telas[id].identidade` |
| Perfil | `classificacao.perfilRef` |
| Jornada | `classificacao.jornadas[].id` |
| Subjornada | `classificacao.jornadas[].subjornadas[].id` |
| Ordem e caminhos | `navegacao[].entradas`, `navegacao[].saidas`, `navegacao[].rotas` |
| Estado | `estados` e suas referências |
| Protótipo | `estrutura` selecionada pelo estado |
| Componentes | coleção `componentes` e referências de composição |
| Dados de exemplo | `dados` e `mocks` |

A classificação não contém rotas. A navegação determina a sequência; não duplicar as definições de tela na projeção do módulo. Nomes de jornadas/subjornadas só devem ser resolvidos a partir de dados disponíveis; se houver apenas ID, exibi-lo como fallback.

##### 6.2.5.2 Projeção proposta (não é alteração do JSON mestre)

```json
{
  "schema": "advogadoja.modulo.jornadas",
  "schemaVersion": "1.0.0",
  "jornadas": [
    {
      "id": "<jornadaRef>",
      "nome": "<nome_resolvido>",
      "ordem": 1,
      "subjornadas": [
        {
          "id": "<subjornadaRef>",
          "nome": "<nome_resolvido>",
          "ordem": 1,
          "ocorrencias": [
            {
              "id": "<id_permanente_da_ocorrencia>",
              "telaRef": "<id_da_tela>",
              "ordemTela": 1,
              "estadoRef": null
            }
          ]
        }
      ]
    }
  ]
}
```

IDs de ocorrências não mudam com reordenação; não usar índice de array como identidade permanente. `estadoRef: null` indica que a seleção inicial será resolvida pelo contrato de estados, sem presumir um estado não declarado. `ordem` e `ordemTela` são projeções calculadas. Identificadores de jornada/subjornada referenciam os existentes no catálogo; não gerar novos quando já existem.

##### 6.2.5.3 Algoritmo de organização

1. Validar catálogo e indexar telas e componentes por ID.
2. Ler classificação e criar agrupamentos por jornada/subjornada.
3. Resolver ligações de navegação por referências de rotas, entradas, saídas e alternativas, respeitando o escopo dos IDs.
4. Ordenar ocorrências seguindo caminhos documentados. Quando houver alternativas, manter a relação com o caminho; não inventar uma sequência única que contradiga a navegação.
5. Detectar ciclos, referências ausentes, caminhos independentes e ordem ambígua; sinalizar pendências e usar ordem de apresentação determinística quando necessário, sem confundi-la com ordem de navegação confirmada.
6. Resolver estado, estrutura, composição e mocks; renderizar cada miniatura com isolamento.
7. Aplicar filtros e escala somente à projeção visual.

#### 6.2.6 Arquitetura modular

```text
projeto/
├── index.html
├── estilo.css
├── motor.js
├── dados/
│   ├── modulos.json
│   ├── telas.json
│   ├── mapa.json
│   └── jornadas.json
└── modulos/
    └── jornadas/
        ├── index.html
        ├── estilo.css
        └── motor.js
```

| Arquivo | Responsabilidade |
|---|---|
| `index.html` geral | Menu global e área de carregamento dos módulos |
| `motor.js` geral | Registro de módulos, carregamento e compartilhamento dos dados |
| `dados/telas.json` | Fonte canônica das telas e componentes |
| `dados/jornadas.json` | Projeção opcional persistida do módulo; não fonte concorrente de navegação |
| `dados/mapa.json` | Dados para integração com mapa |
| `modulos/jornadas/index.html` | Estrutura da interface e pontos de montagem |
| `modulos/jornadas/estilo.css` | Galeria, grupos, controles, escala, modal e responsividade |
| `modulos/jornadas/motor.js` | Agrupamento, ordenação, renderização, filtros, ampliação e exportações |

O motor de Jornadas consome o renderizador compartilhado de telas; não implementa novamente o HTML/CSS de cada tela. Proposta de isolamento: iframe com viewport lógico e transformação de escala; outra solução é aceitável se preservar o mesmo resultado. O carregamento por `fetch` de arquivos locais pode exigir servidor HTTP; importação por seletor de arquivos pode funcionar offline. A forma de distribuição deverá ser validada no ambiente do projeto.

#### 6.2.7 Importação, exportação e persistência

- Importação individual por módulo, sem substituir o documento geral ou os dados de outros módulos.
- Validar schema, IDs, tipos e referências antes de aplicar alterações; em caso de erro, preservar dados anteriores.
- Exportação JSON com projeção do módulo, mantendo referências e IDs permanentes.
- Exportação Markdown do inventário com hierarquia e tabelas de ocorrências; indicar escopo (todas as jornadas ou filtro atual).
- Não exportar preferências visuais como se fossem definições de tela.
- Persistir escala, filtros e seleção separadamente dos dados canônicos.

#### 6.2.8 Critérios de aceite

- [ ] Cabeçalho, barra compacta, fundo e grupos fiéis à referência.
- [ ] Miniaturas lado a lado, alinhadas à esquerda, mantendo proporção mobile e espaço livre.
- [ ] Identificação acima e botão Ampliar tela abaixo de cada miniatura.
- [ ] HTML/CSS real, componentes e imagens preservados.
- [ ] Rolagem interna em telas longas.
- [ ] Escala global funcional sem deformação do layout.
- [ ] Seletor de tela localiza ocorrências corretamente.
- [ ] Modal ampliado preserva o visual e o contexto.
- [ ] Estados selecionáveis quando disponíveis.
- [ ] Agrupamento a partir da classificação e ordem a partir da navegação.
- [ ] Ocorrências repetidas preservadas com IDs próprios.
- [ ] Referências ausentes sinalizadas, sem inventar rotas.
- [ ] Importação/exportação individual sem afetar outros módulos.
- [ ] HTML, CSS, motor e dados separados.
- [ ] Responsividade sem deformar os protótipos.
- [ ] Comparação visual na mesma resolução e escala da captura de referência.

#### 6.2.9 Diretrizes obrigatórias

- Não redesenhar as telas ou substituí-las por mockups genéricos.
- Não transformar a galeria em fluxo de cards, tabela ou diagrama de nós.
- Não preencher o espaço livre esticando as miniaturas.
- Não duplicar o menu principal no módulo integrado.
- Não fixar telas, jornadas ou quantidade de cards diretamente no HTML.
- Não derivar navegação da ordem de classificação nem inventar bifurcações.
- Não alterar IDs por mudança de posição.
- Não substituir outros módulos durante a importação.
- Não tratar as dimensões estimadas da captura como CSS original confirmado.

#### 6.2.10 Limites e decisões propostas

A referência disponível é uma captura de tela, não o HTML/CSS/JS original. As medidas, cores, opções de escala, comportamento do modal, filtros, exportações, estratégia de isolamento e contrato de projeção são propostas de implementação, não funcionalidades verificadas no arquivo original. O objetivo deste Markdown é especificar o módulo; não implementa nem testa um HTML. A fidelidade final deverá ser aferida com comparação visual e testes funcionais quando o módulo for desenvolvido.
