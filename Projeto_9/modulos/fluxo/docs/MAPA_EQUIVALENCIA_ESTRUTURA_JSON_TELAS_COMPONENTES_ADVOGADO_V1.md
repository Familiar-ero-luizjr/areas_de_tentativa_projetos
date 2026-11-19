# AdvogadoJá — Mapa de equivalência estrutural dos JSONs de Tela e Componente
**Documento novo · V1 · 19/11/2026 · Escopo: perfil Advogado · Tipo: especificação de migração (sem migração executada)**

> **Objeto da padronização:** a estrutura de **cada definição JSON de tela** e de **cada definição JSON de componente** do catálogo `advogado_catalogo_completo (1).json` deve ser equivalente ao contrato V0.10 exemplificado em `AdvogadoJa_Arvores_Modelo_Telas_Componentes_V010 (1).html`. Este documento mapeia origem → destino campo a campo, identifica decisões não automáticas e estabelece como preservar integralmente a origem. **Não** cria novo Fluxo, **não** converte os 33 JSONs nesta entrega e **não** trata `advogado.home` do exemplo como substituto homologado de `advogado.home_advogado` da origem.

## 1. Fontes e alcance verificados
- **Origem:** `advogado_catalogo_completo (1).json` (SHA-256 `670bbc235e8ced14a93228f48233f26d56bd4d1195b5fec0cc8b5460171fdcca`). Contém **33 telas**, **64 componentes referenciados** e **35 componentes locais incorporados**; total de **99 definições de componentes** a considerar.
- **Referência de estrutura:** o objeto `seed` do HTML V0.10, composto por `schema`, `schemaVersion`, `telas` e `componentes`. O exemplo de `advogado.home` contém **1 tela e 9 definições de componentes** e é apenas demonstrativo.
- **Direção funcional:** `ADVOGADOJA_DIRECAO_CANONICA_MODELO_TELAS_COMPONENTES_MODULOS_V1.md`; especialmente seções 1, 4, 5 e 6: uma fonte por informação, `identidade.id` estável, composição por instância, `props` na instância, HTML/CSS nas definições, preservação de campos desconhecidos e não confundir tela, jornada, fluxo e protótipo.
- **Contexto da origem:** **93 ocorrências de tela no Fluxo**; **2 telas com definição de Mapa**; preservar ambas em área de documentação/manifesto externo enquanto não houver contrato específico aprovado para essas informações.
- **Tipos de componentes no bloco `components`:** `local` = 45, `screen-component` = 1, `shared` = 18. Os 35 componentes de `localComponents` têm identidade local repetida como `content`, `hero` etc., mas IDs técnicos distintos em `engineering.componentId`.

## 2. O formato-alvo de **cada JSON de Tela**
A tela é uma definição unitária. O índice externo, quando usado no pacote, deve reproduzir `identidade.id` **exatamente**, sem outra identidade. A composição contém as instâncias dos componentes e os valores de cada ocorrência. A tela **não contém cópias completas da definição de todos os componentes**.

```json
{
  "schema": "advogadoja.tela",
  "schemaVersion": "0.10.0",
  "identidade": {
    "id": "advogado.assinatura.checkout",
    "tipo": "tela",
    "namespace": "advogado",
    "nome": "Pagamento"
  },
  "classificacao": {
    "localizacao": {"caminho": "biblioteca/telas/advogado/assinatura/checkout"}
  },
  "estrutura": {
    "html": {
      "raizRef": "<instancia-raiz-a-definir>",
      "composicao": {
        "<instancia-id-a-migrar>": {
          "paiRef": "<pai-ou-slot-confirmado>",
          "slot": "main",
          "ordem": 30,
          "componenteRef": "cmp_advogado_assinatura_checkout_main_content",
          "props": {"content": {"stripe_checkout": "Stripe Checkout"}}
        }
      }
    },
    "css": {"tokens": {}, "regras": {}}
  },
  "navegacao": {"rotas": []},
  "estados": {},
  "variantes": {"itens": []},
  "interacoes": {"eventos": []},
  "dados": {},
  "mocks": {"cenarios": []}
}
```
**Leitura do exemplo:** os valores `id`, `nome`, `slot`, `ordem`, `componenteRef` e `content.stripe_checkout` existem na origem. Os textos entre `<...>` são **pendências estruturais**, não campos/valores homologados. O caminho de `classificacao.localizacao` ilustra a convenção V0.10 e só será definitivo se a localização canônica for confirmada. `rotas: []` e os demais objetos vazios são apenas ilustração de forma, **não declaração de que a tela não possui interações**. Não implementar a tela a partir desse fragmento parcial.

### 2.1. Campos da Tela: equivalência origem → V0.10
| Campo/fonte atual | Destino no JSON V0.10 | Natureza | Critério de equivalência |
| --- | --- | --- | --- |
| `screens[ID]` | `telas[ID]` | **Índice** | Transporte: mesma chave, sem duplicar identidade. |
| `screens[ID].screen.identity.id` | `identidade.id` | **Direto** | Manter `advogado.home_advogado` etc. exatamente. |
| `screen.identity.kind` (`screen`) | `identidade.tipo` (`tela`) | **Tradução** | Valor de classe de objeto; não confundir com tipo de componente. |
| `screen.identity.name` | `identidade.nome` | **Direto** | Nome editorial, não ID. |
| `screen.content.meta.documentTitle` / `screen.identity.name` | `identidade.nomeExibicao` (se pertinente) | **Condicional** | Só se confirmado que é o título mostrado na interface; não duplicar sem motivo. |
| `screen.identity.feature/section` | `identidade.namespace` e/ou `classificacao` | **Revisar** | Não transformar automaticamente `feature` em jornada ou novo `moduloRef`. |
| `screen.identity.screenId` | Nenhum campo canônico distinto | **Manifesto legado** | ID técnico legado `scr_*`; registrar equivalência com `identidade.id`. |
| `screen.identity.featureLabel/sectionLabel/order` | Sem campo V0.10 necessário | **Manifesto / editorial** | Ordenação da fonte não equivale a rota ou ordem em Jornada. |
| `screen.lifecycle.status` | Sem bloco obrigatório | **Metadados de migração** | Status de ciclo de vida editorial, não `estados.itens` da UI. |
| `screen.contract.route` | Índice externo de rotas da própria tela | **Preservar externamente** | `/subscription/checkout` não é uma rota de saída (`navegacao.rotas[]`). |
| `screen.contract.revision` | Registro de versão/auditoria | **Manifesto legado** | Não trocar `schemaVersion` por revisão do contrato original. |
| `screen.contract.definition.*` | Relatório de pendências/estado editorial | **Manifesto legado** | `defined`, `status`, `sourcePresent` não são estados da UI. |
| `screen.contract.requiredCapability` | Condição em navegação/interação, **se** validada | **Proposta** | Exigir semântica aprovada; não presumir autorização de backend. |
| `screen.contract.presentationStates[]` | `estados.itens[]`, se for catálogo de estados | **Proposta** | `query` é parâmetro de apresentação; não promover a regra de OAB real. |
| `screen.render.basePath` | `classificacao.localizacao.caminho` (se aprovado) | **Condicional** | Origem aponta para pasta visual; destino V0.10 pode ser pasta lógica da biblioteca. |
| `screen.engineering.screenConfig.composition[slot][]` | `estrutura.html.composicao[instanciaId]` | **Transformação principal** | Cada objeto da lista vira instância com `slot`, `ordem`, `componenteRef`, `paiRef` e `props`. |
| `composition[slot][].id` | Chave local `instanciaId` | **Mapear estável** | IDs `content`, `drawer` etc. repetem entre telas; usar tabela de migração de instâncias. |
| `composition[slot][].ref` | `componenteRef` | **Direto** | Resolver apenas se ID existe em `componentes`. Mantém ref original. |
| `composition[slot][].componentId` (local) | `componenteRef` | **Direto se fonte local** | Para `sourceType=local`, associar ao `engineering.componentId` de `localComponents`. |
| `composition[slot][].source` | Origem da definição do componente | **Localizador de migração** | Não usar caminho de arquivo como `componenteRef`. |
| `composition[slot][].order / .slot` | `ordem` / `slot` | **Direto** | Preservar ordenação por slot; `paiRef` precisa ser decidido pela árvore/slots expostos. |
| `composition[slot][].enabled / .required / .initiallyHidden` | Composição / variantes conforme semântica | **Revisar** | Não descarte propriedades operacionais; `initiallyHidden` pode exigir condição ou default. |
| `composition[slot][].sourceType` | Escolha da definição referenciada | **Sem campo duplicado** | Já representado por `componenteRef`; manter classificação de fonte no inventário. |
| `composition[slot][].label / .previousComponentId` | Documentação/legado | **Manifesto** | Rótulo do editor e ID histórico, não props de conteúdo da instância. |
| `screen.content.components[slotOuId]` | `estrutura.html.composicao[instanciaId].props` | **Transformação principal** | Manter tipos, arrays, strings e objetos originais exatamente; chave do componente da tela vincula à instância. |
| `screen.content.components[id].content.*` | `composicao[instanciaId].props.content.*` | **Direto sem renomear** | Os templates usam `{{content.chave}}`; preservar o nome para resolver `vinculos`. |
| `screen.content.components[id].items/avatar/name/...` | `composicao[instanciaId].props.items/avatar/name/...` | **Direto** | Sem criar bloco paralelo `conteudo.instancias`. |
| `screen.content.runtime.stateLabels` | `estados`/`variantes`, se semântica comprovada | **Revisar** | Tabela de rótulos da execução pode ser dado de prévia ou transição; não inventar estados. |
| `screen.content.runtime.professionalAccess` | `estados.dimensoes`, `capacidadesPorAcesso`, `variantes` (exemplo) | **Proposta** | Apenas como demonstração não homologada; não aprova regras de OAB. |
| `screen.engineering.screenConfig.state` | Estado inicial **da simulação** / estado declarado, quando couber | **Revisar** | Snapshot `online: true` não cria por si os estados `online/offline` do contrato. |
| `screen.engineering.screenConfig.theme` | `estrutura.css.tokens` | **Transformação** | Mapear nomes de tokens por convenção explícita (ex.: `primary` → `--primary`). |
| `screen.engineering.screenConfig.layout` | `estrutura.css.regras/tokens` (parte visual) | **Condicional** | Configuração do motor não deve virar CSS inválido; validar responsividade. |
| `screen.engineering.screenConfig.routes` | Índice auxiliar externo; `navegacao.rotas` apenas por vínculo real | **Separar** | Um dicionário de destinos possíveis **não é** a lista de conexões da tela. |
| `screen.engineering.screenConfig.slots` | Semântica dos `slot`/layout quando pertinente | **Parcial** | Não duplicar descrição do motor em cada JSON de Tela. |
| `screen.engineering.screenConfig.runtime/enginePolicy/organization/package/dataRef` | Metadados do motor/adaptador | **Manifesto externo** | Não inserir em `estrutura.html` ou `dados.fontes` por inércia. |
| `screen.content.meta.* / schemaVersion / screenKey` | `identidade.*` quando aplicável; demais origem | **Conferência** | `screenKey` deve igualar identidade; não criar outra chave de identidade. |
| `screens[ID].sourceFiles` | Definições `componentes[componenteRef].estrutura` | **Transformar a partir da fonte** | HTML/CSS visual do conteúdo local passa para o componente local; não duplicar texto cru na tela. |
| `screens[ID].componentRefs/localComponentRefs` | Índice derivado de `composicao.*.componenteRef` | **Não duplicar** | Conferir refs, mas a composição é fonte da associação. |
| `screens[ID].mapDefinition` | Documento específico de Mapa ou registro auxiliar | **Fora do núcleo V0.10** | 2 telas com dados; preservar integralmente sem copiar módulos Map para a tela. |
| `screens[ID].flowOccurrences` | Documento/manifesto do Fluxo por ocorrência | **Fora do núcleo V0.10** | 93 ocorrências distintas; manter IDs, trilhas, condições/branches, neighbors e JSON pointers. |
| `screens[ID].runtimeSourceRefs/assetRefs` | Manifesto de execução e ativos | **Externo** | Assets ficam acessíveis ao renderizador; não fazem parte de `props` se não forem props. |
| `navegacao.rotas` do alvo | Extração verificada de disparadores `data-goto`/interações | **Não derivar apenas de routes** | Registrar origem `instanciaRef`, `elementoRef`, destino ID e condição quando realmente declarados. |
| `interacoes.eventos` do alvo | Eventos `data-action`, controles e contexto | **Extrair/comprovar** | Eventos locais não são rotas entre telas. |
| `mocks.cenarios` do alvo | Cenários explícitos comprovados | **Só se existirem** | `state` e dados estáticos não viram mock automaticamente. |

### 2.2. Algoritmo de montagem das instâncias
1. Ler a `composition` original, por slot, e construir tabela de migração **dentro de cada tela**: `(screen.identity.id, slot, item.id, componentId/ref) → instanciaId` estável. Nunca usar só `item.id` como ID global.
2. Resolver `componenteRef`: item `shared` usa `item.ref` que precisa existir em `components`; item `local` usa `item.componentId` que precisa existir em `localComponents[...].component.engineering.componentId`. Os componentes `screen.*` rotulados como `local` dentro do bloco `components` mantêm seu `component.identity.id` (não criar duplicado).
3. Atribuir `props` recuperando `screen.content.components[item.id]`. **Validar** se há mais de uma instância com mesmo `id` na mesma tela; se houver, solicitar desambiguação em vez de propagar valores indiscriminadamente.
4. Converter `order` numérico para `ordem` sem renumerar desnecessariamente; criar a relação de hierarquia `paiRef` por um **layout/slot real**. O catálogo original só lista slots e não fornece `raizRef` nem uma árvore `paiRef`, portanto a raiz da composição é **lacuna a resolver**, não dado implícito.
5. Migrar tokens/estilos necessários, preservando CSS e o escopo visual. Definições de componentes carregam HTML/CSS; a tela só carrega CSS realmente próprio da tela, evitando cópias dos estilos de cada componente.
6. Registrar, fora do contrato unitário, as referências de origem usadas na migração, os atributos antigos sem correspondente e as ocorrências de Fluxo. Exportar a tela e suas dependências como pacote se for necessário renderizá-la fora do catálogo.

## 3. O formato-alvo de **cada JSON de Componente**
As **99 definições** são componentes, ainda que 35 venham incorporadas em `localComponents`. Componentes carregam **estrutura visual reutilizável** e vinculação das propriedades; não guardam os textos específicos das instâncias de cada tela. O componente pode ser usado por mais de uma tela sem ser copiado.

```json
{
  "identidade": {
    "id": "header.app-header.v01",
    "tipo": "componente",
    "nome": "Cabeçalho"
  },
  "classificacao": {
    "localizacao": {"caminho": "components/headers/app-header/v01"}
  },
  "estrutura": {
    "html": {
      "raizRef": "header.raiz",
      "elementos": {
        "header.raiz": {
          "tag": "header",
          "ordem": 10,
          "atributos": {"class": "app-header"}
        },
        "header.marca": {
          "tag": "strong",
          "paiRef": "header.raiz",
          "ordem": 20,
          "atributos": {},
          "texto": ""
        }
      },
      "vinculos": [
        {"elementoRef": "header.marca", "propriedade": "texto", "campo": "content.advogadoja"}
      ]
    },
    "css": {"regras": {}}
  }
}
```
**Exemplo parcial de mapeamento**, não a definição completa: `header.app-header.v01` possui `{{content.advogadoja}}` no template de origem, que é vínculo para `props.content.advogadoja` da instância. A árvore acima não substitui a extração integral do header, incluindo outros botões, spans, atributos, recursos, estilos e vínculos. A localização física do componente é fonte para conferência, não necessariamente o caminho definitivo dentro de `biblioteca/componentes`.

### 3.1. Campos do Componente: equivalência origem → V0.10
| Campo/fonte atual | Destino no JSON V0.10 | Natureza | Critério de equivalência |
| --- | --- | --- | --- |
| `components[ref]` | `componentes[ref]` | **Direto** | A chave é exatamente `component.identity.id`. |
| `components[ref].component.identity.id` | `identidade.id` | **Direto** | 64 IDs já únicos, inclusive `screen.*` dos componentes locais registrados como referenciados. |
| `component.identity.kind` | `identidade.tipo = "componente"` | **Tradução** | Valor antigo `component` não altera identidade. |
| `component.identity.name` | `identidade.nome` | **Direto** | Preservar nome editorial. |
| `component.identity.slot` | `estrutura`/inventário de uso | **Não duplicar por padrão** | Slot da ocorrência está em `composicao`; campo legado no manifesto, se necessário. |
| `component.identity.variant` | Classificação/controle de versão externo | **Revisar** | `v01` é variante da definição, **não** `variantes.itens` de estado de uma tela. |
| `component.render.basePath` | `classificacao.localizacao.caminho` (se aprovado) | **Condicional** | Caminho físico da fonte do componente. |
| `component.render.template` / `sourceFiles[*template.html]` | `estrutura.html.raizRef` + `elementos` | **Transformação principal** | Analisar DOM, gerar IDs de elementos e preservar tags, hierarquia, ordem e atributos. |
| `{{content.chave}}`, `{{name}}` etc. no template | `estrutura.html.vinculos[]` | **Transformação principal** | Mapear cada token ao `campo` de `props`, com `elementoRef` e `propriedade`. |
| `{{#each items}}` / `{{/each}}` | `estrutura.html.colecoes[]` + elemento-modelo | **Transformação** | Preservar chave dos itens por `id` existente; quando ausente, **pendência**, não gerar ID pelo índice. |
| `{{#if showOnline}}` etc. | Condição declarativa / variante conforme contrato aprovado | **Revisar** | Não executar JS textual; preservar o template até modelar sem perda o condicional. |
| `component.render.style` / `sourceFiles[*style.css]` | `estrutura.css.regras` | **Transformação principal** | Preservar seletor, cascata, media queries e ordem; sem parser ingênuo. |
| `component.render.manifest.data` | `props` defaults só quando semântica válida | **Revisar** | Não duplicar dados que já estão em `screen.content.components`. |
| `component.render.manifest.id/name/kind/defaultSlot` | `identidade` e/ou documentação | **Sem duplicação** | Detalhes da definição ou do motor; conferir com fonte primária. |
| `component.engineering.componentId` | Tabela de equivalências legado | **Manifesto** | Para componentes `screen.*` manter `identidade.id` da definição, não substituir por ID técnico. |
| `component.engineering.origin/current` | Histórico/caminho da migração | **Manifesto** | Não confundir caminho de código com identidade lógica. |
| `component.engineering.structure.*` | Regras de instância/renderização quando necessárias | **Revisar** | `order` da instância já está na composição da tela, não repetir na definição. |
| `component.engineering.sharing.*` | Índice derivado/manifesto de reutilização | **Externo** | Mesmo ID compartilhado; `usedBy` calculado pelas instâncias. |
| `component.usage.*` / `engineering.usedBy` | Índice derivado de dependências | **Externo** | Não criar 99 cópias das listas de telas usuárias. |
| `component.engineering.dataSource/dataRefs` | `dados` somente com fonte real identificada | **Não inferir** | `type=screen-data` não é endpoint ou coleção de banco. |
| `component.lifecycle.*` | Metadados editoriais/auditoria | **Manifesto** | Não virar `estados` da tela. |
| `localComponents[owner::local::key]` | `componentes[engineering.componentId]` | **Conversão por ID existente** | O índice composto `owner::local::content` é localizador de exportação; o ID técnico único já existe. |
| `localComponents[...].component.identity.id` (`content`, `hero`, etc.) | Nome/slot ou localizador legado, **não** ID canônico global | **Desambiguar** | `content` reaparece em muitas telas; não é identidade única no pacote. |
| `localComponents[...].ownerScreenKey` | Associação via `estrutura.html.composicao` da tela | **Não duplicar** | Componentes locais têm dono por instância; manter também em manifesto se necessário. |
| `localComponents[...].component.engineering.componentId` | `componentes[ID].identidade.id` | **Direto** | 35 IDs `cmp_*` únicos verificados; não renomear automaticamente. |
| `localComponents[...].sourceFiles` | `estrutura.html.*` + `estrutura.css.regras` | **Transformação principal** | Mesmo tratamento de HTML/CSS dos componentes referenciados. |
| `runtimeSources` + `visualAssets` | Artefatos de execução e recursos do pacote | **Manifesto / assets** | Importantes para teste de fidelidade, mas não introduzir código motor arbitrário no JSON. |

### 3.2. Regra de identidade para componentes locais
Há **dois tipos de localidade** na origem:
- Componentes que já estão em `components` com ID `screen.advogado.*`: seus IDs já são globais no pacote e **devem ser mantidos** em `componentes[ref]`, mesmo que `engineering.sharing.mode=local` no legado. Não recriar o mesmo componente no bloco `localComponents`.
- Componentes que estão efetivamente em `localComponents[advogado.*::local::...]`: a chave local e `identity.id` (`content`, `hero` etc.) **não** substituem o ID único `engineering.componentId` (`cmp_*`). O novo `identidade.id` usa esse ID comprovado; a tela consome pelo `componenteRef` correspondente.

### 3.3. Diferenciar elemento, instância e valor
Exemplo real da origem `advogado.assinatura.checkout`:
```text
Tela: advogado.assinatura.checkout
  composition.main[0].id           = content
  composition.main[0].componentId  = cmp_advogado_assinatura_checkout_main_content
  screen.content.components.content.content.stripe_checkout = "Stripe Checkout"
  localComponents["advogado.assinatura.checkout::local::content"]
     .sourceFiles[".../template.html"] contém {{content.stripe_checkout}}

Equivalência pretendida:
  tela.estrutura.html.composicao[instanciaId].componenteRef = cmp_advogado_assinatura_checkout_main_content
  tela.estrutura.html.composicao[instanciaId].props.content.stripe_checkout = "Stripe Checkout"
  componente.identidade.id = cmp_advogado_assinatura_checkout_main_content
  componente.estrutura.html.vinculos[] -> elementoRef que usa campo "content.stripe_checkout"
```
**Atenção:** `instanciaId` e o elemento concreto que recebe o texto ainda têm de ser definidos ao decompor o template. Não há motivo para duplicar `stripe_checkout` em `tela.conteudo`, `componente.conteudo` e `props` simultaneamente.

## 4. Campos canônicos previstos: evidência e lacunas
| Bloco de destino | Evidência da origem | Tratamento sem suposição |
| --- | --- | --- |
| `identidade` | Há `screen.identity` ou `component.identity` | Convertível com IDs originais. |
| `classificacao.localizacao` | Há caminhos físicos visuais | Caminho lógico V0.10 requer confirmação; não inferir jornada do diretório. |
| `classificacao.jornadas` | Não há declaração de jornada no JSON fonte de cada tela | Deixar ausente até vínculo editorial aprovado; flowOccurrences não é jornada. |
| `estrutura.html.composicao` (Tela) | Há `screenConfig.composition` com 186 ocorrências no conjunto | Converter cada item; gerar mapa estável de IDs de instância; resolver raiz/paiRef. |
| `estrutura.html.elementos` (Componente) | Há `template.html` por definição | Parsear e identificar elementos; 99 componentes demandam conversão visual. |
| `estrutura.html.vinculos/colecoes` (Componente) | Há tokens e alguns `#each`/`#if` | Ligar refs a props e modelar repetição/condição de modo declarativo. |
| `estrutura.css` | Há `style.css` e tokens de tema | Retornar CSS com cascata/escopo equivalentes; não juntar tudo em única string de tela. |
| `navegacao.rotas` | Há lista geral `screenConfig.routes` e `data-goto` nos templates | Rotas reais por disparador precisam ser verificadas; lista geral não prova que cada saída existe. |
| `estados/variantes` | Há snapshots de state, estados de apresentação e runtime no subconjunto | Catálogo de estados e alvos de variante exigem definição semântica, não extrapolação. |
| `interacoes.eventos` | Há `data-action`, botões e template condicional | Resolver elemento origem e operação; não chamar backend nem inventar comportamento. |
| `dados` | Há dados de conteúdo estáticos e `dataSource=screen-data` | Não criar coleção Firestore/endpoint sem fonte real; texto visível continua em props. |
| `mocks` | Há estados de demonstração e valores estáticos em alguns campos | Cenários somente quando explicitamente identificados; não converter todo dado estático em mock. |

## 5. O que **não** é parte da estrutura canônica da tela ou componente
`flowOccurrences`, seus `node.id`, `location.jsonPointer`, `sequenceId`, `branchTrail`, `adjacentNodes` são **ocorrências no Fluxo**, não identidade de tela, instância visual ou definição de componente. O mesmo ID de tela pode ter três, dez ou mais ocorrências no fluxo sem virar vários JSONs de tela. Devem continuar rastreáveis por `entityRef` num registro externo ao contrato V0.10, sem descarte.

`mapDefinition`, `mapModuleCatalog` e atributos de status editorial são informações de documentação/Mapa (2 telas nesta origem), não uma justificativa para criar automaticamente blocos `mapa` ou `fluxo` dentro de **cada** JSON da tela. `runtimeSources`, `visualAssets`, `enginePolicy`, `organization`, `schemaVersion` legado interno, índices `usage`, `sourceFiles` crus e dados de auditoria pertencem ao pacote de transporte, ao manifesto de migração ou aos artefatos de origem. **Preservação obrigatória** não significa inserir todos esses dados no contrato canônico.

**Regra de compatibilidade:** caso um módulo precise reexportar a origem, carregar um pacote com `(1)` contratos V0.10, `(2)` manifesto de rastreabilidade, `(3)` fontes/ativos e `(4)` ocorrências externas. Não incluir cópias concorrentes do mesmo conteúdo em todos os JSONs de Tela e Componente.

## 6. Inventário verificado: equivalência das **33 Telas**
A tabela permite preparar uma migração **por tela** com ID estável e contagem real de instâncias. As quantidades de **componentes referenciados** e de **componentes locais incorporados** são aferidas no catálogo; uma tela pode usar várias definições locais na área principal.
| Tela — ID original a manter | Instâncias | Ref. | Locais | No Fluxo | Mapa | Props sem instância |
| --- | --- | --- | --- | --- | --- | --- |
| `advogado.assinatura.checkout` | 7 | 6 | 1 | 3 | Não | — |
| `advogado.assinatura.gestao_assinatura` | 6 | 5 | 1 | 3 | Não | — |
| `advogado.assinatura.historico_assinatura` | 6 | 5 | 1 | 3 | Não | — |
| `advogado.assinatura.planos` | 6 | 5 | 1 | 3 | Não | — |
| `advogado.atendimentos_advogado` | 6 | 5 | 1 | 3 | Sim | — |
| `advogado.clientes.aceitar_contato` | 6 | 5 | 1 | 3 | Não | — |
| `advogado.clientes.contato_liberado` | 6 | 5 | 1 | 3 | Não | — |
| `advogado.clientes.detalhe_solicitacao` | 6 | 5 | 1 | 3 | Não | — |
| `advogado.clientes.recusar_solicitacao` | 6 | 5 | 1 | 3 | Não | — |
| `advogado.clientes.solicitacoes_recebidas` | 6 | 5 | 1 | 3 | Não | — |
| `advogado.configuracao.agenda_semanal` | 6 | 5 | 1 | 3 | Não | — |
| `advogado.configuracao.central_ajuda` | 6 | 5 | 1 | 3 | Não | — |
| `advogado.configuracao.configuracao` | 6 | 5 | 1 | 3 | Não | — |
| `advogado.configuracao.consentimentos` | 6 | 5 | 1 | 3 | Não | — |
| `advogado.configuracao.falar_suporte` | 6 | 5 | 1 | 3 | Não | — |
| `advogado.configuracao.meus_chamados` | 6 | 5 | 1 | 3 | Não | — |
| `advogado.configuracao.politica_privacidade` | 6 | 5 | 1 | 3 | Não | — |
| `advogado.configuracao.preferencias_atendimento` | 6 | 5 | 1 | 3 | Não | — |
| `advogado.configuracao.suporte` | 6 | 5 | 1 | 3 | Não | — |
| `advogado.configuracao.termos_privacidade` | 6 | 5 | 1 | 3 | Não | — |
| `advogado.configuracao.termos_uso` | 6 | 5 | 1 | 3 | Não | — |
| `advogado.configuracao.validacao_oab` | 6 | 5 | 1 | 3 | Não | — |
| `advogado.dados_oab` | 4 | 3 | 1 | 2 | Não | — |
| `advogado.disponibilidade` | 7 | 6 | 1 | 2 | Não | — |
| `advogado.home_advogado` | 8 | 5 | 3 | 6 | Sim | — |
| `advogado.onboarding.areas_atuacao` | 4 | 3 | 1 | 2 | Não | — |
| `advogado.onboarding.dados_academicos` | 4 | 3 | 1 | 2 | Não | — |
| `advogado.onboarding.dados_profissionais` | 4 | 3 | 1 | 2 | Não | — |
| `advogado.onboarding.disponibilidade` | 4 | 3 | 1 | 2 | Não | — |
| `advogado.onboarding.perfil_profissional` | 4 | 3 | 1 | 2 | Não | — |
| `advogado.onboarding.revisao_profissional` | 4 | 3 | 1 | 2 | Não | — |
| `advogado.perfil_profissional` | 6 | 5 | 1 | 3 | Não | — |
| `advogado.validacao_profissional` | 4 | 3 | 1 | 2 | Não | — |

**Leitura da última coluna:** os nomes presentes em `screen.content.components` sem `item.id` correspondente em `composition` devem ser **auditados**, não apagados nem associados por semelhança. `Ref.` conta as posições com `ref` no slot; `Locais` conta instâncias com `sourceType=local`.

## 7. Inventário verificado: **64 Componentes referenciados**
Na migração, manter **o mesmo ID** de componente. `sharing.mode` descreve como ele está cadastrado na origem; não alterar o ID porque a fonte o chama de local. A identificação do elemento e de seus vínculos vem do HTML completo.
| ID de componente (mantido) | Nome da origem | Modo legado | Arquivos HTML/CSS | Usos (legado) |
| --- | --- | --- | --- | --- |
| `header.app-header.v01` | Cabeçalho | shared | 2 | 25 |
| `header.app-header.v04` | Cabeçalho Profissional | shared | 2 | 3 |
| `header.titlebar.v01` | Barra de título | shared | 2 | 3 |
| `header.titlebar.v02` | Barra de título | shared | 2 | 2 |
| `header.titlebar.v03` | Barra de título | shared | 2 | 2 |
| `header.titlebar.v04` | Barra de título | shared | 2 | 2 |
| `header.titlebar.v05` | Barra de título | shared | 2 | 2 |
| `header.titlebar.v06` | Barra de título | shared | 2 | 2 |
| `header.titlebar.v07` | Barra de título | shared | 2 | 2 |
| `header.titlebar.v08` | Barra de título | shared | 2 | 2 |
| `header.titlebar.v09` | Barra de título | shared | 2 | 2 |
| `header.titlebar.v10` | Barra de título | shared | 2 | 2 |
| `header.topbar.v01` | Cabeçalho | shared | 2 | 19 |
| `menu.drawer.v01` | Menu lateral Profissional | shared | 2 | 25 |
| `modal.flow-checkout-return.v01` | Modal · Retorno do checkout | shared | 2 | 1 |
| `modal.route-modal.v01` | Modal de navegação | shared | 2 | 74 |
| `modal.route-modal.v02` | Modal de navegação simulada | shared | 2 | 4 |
| `popup.status-toast.v01` | Toast de alteração de status | shared | 2 | 3 |
| `screen.advogado.assinatura.checkout.header.titlebar` | Barra de título | local | 2 | 1 |
| `screen.advogado.assinatura.checkout.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.assinatura.gestao_assinatura.header.titlebar` | Barra de título | local | 2 | 1 |
| `screen.advogado.assinatura.gestao_assinatura.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.assinatura.historico_assinatura.header.titlebar` | Barra de título | local | 2 | 1 |
| `screen.advogado.assinatura.historico_assinatura.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.assinatura.planos.header.app-header` | Cabeçalho Profissional | local | 2 | 1 |
| `screen.advogado.assinatura.planos.header.titlebar` | Barra de título | local | 2 | 1 |
| `screen.advogado.assinatura.planos.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.clientes.aceitar_contato.header.titlebar` | Barra de título | local | 2 | 1 |
| `screen.advogado.clientes.aceitar_contato.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.clientes.contato_liberado.header.titlebar` | Barra de título | local | 2 | 1 |
| `screen.advogado.clientes.contato_liberado.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.clientes.detalhe_solicitacao.header.titlebar` | Barra de título | local | 2 | 1 |
| `screen.advogado.clientes.detalhe_solicitacao.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.clientes.recusar_solicitacao.header.titlebar` | Barra de título | local | 2 | 1 |
| `screen.advogado.clientes.recusar_solicitacao.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.clientes.solicitacoes_recebidas.header.titlebar` | Barra de título | local | 2 | 1 |
| `screen.advogado.clientes.solicitacoes_recebidas.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.configuracao.agenda_semanal.header.app-header` | Cabeçalho profissional | local | 2 | 1 |
| `screen.advogado.configuracao.agenda_semanal.header.titlebar` | Barra de título | local | 2 | 1 |
| `screen.advogado.configuracao.agenda_semanal.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.configuracao.central_ajuda.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.configuracao.configuracao.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.configuracao.consentimentos.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.configuracao.falar_suporte.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.configuracao.meus_chamados.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.configuracao.politica_privacidade.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.configuracao.preferencias_atendimento.header.titlebar` | Barra de título | local | 2 | 1 |
| `screen.advogado.configuracao.preferencias_atendimento.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.configuracao.suporte.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.configuracao.termos_privacidade.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.configuracao.termos_uso.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.configuracao.validacao_oab.header.titlebar` | Barra de título | local | 2 | 1 |
| `screen.advogado.configuracao.validacao_oab.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.dados_oab.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.disponibilidade.component.raio-atendimento` | Raio de atendimento | screen-component | 2 | 1 |
| `screen.advogado.disponibilidade.header.titlebar` | Barra de título | local | 2 | 1 |
| `screen.advogado.disponibilidade.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.onboarding.areas_atuacao.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.onboarding.dados_academicos.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.onboarding.dados_profissionais.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.onboarding.disponibilidade.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.onboarding.perfil_profissional.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.onboarding.revisao_profissional.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |
| `screen.advogado.validacao_profissional.popup.screen-note` | Identificação da tela isolada | local | 2 | 1 |

## 8. Inventário verificado: **35 Componentes locais incorporados**
Cada linha representa uma definição de componente que era incorporada à tela. O novo `identidade.id` **é o `engineering.componentId` já existente**, não o texto genérico `content`/`hero`. A forma V0.10 permite referenciação direta pela composição.
| Localizador no JSON original | ID canônico já disponível | Nome local | Fontes |
| --- | --- | --- | --- |
| `advogado.assinatura.checkout::local::content` | `cmp_advogado_assinatura_checkout_main_content` | content | 2 |
| `advogado.assinatura.gestao_assinatura::local::content` | `cmp_advogado_assinatura_gestao_assinatura_main_content` | content | 2 |
| `advogado.assinatura.historico_assinatura::local::content` | `cmp_advogado_assinatura_historico_assinatura_main_content` | content | 2 |
| `advogado.assinatura.planos::local::content` | `cmp_advogado_assinatura_planos_main_content` | content | 2 |
| `advogado.atendimentos_advogado::local::content` | `cmp_advogado_atendimentos_advogado_main_content` | content | 2 |
| `advogado.clientes.aceitar_contato::local::content` | `cmp_advogado_clientes_aceitar_contato_main_content` | content | 2 |
| `advogado.clientes.contato_liberado::local::content` | `cmp_advogado_clientes_contato_liberado_main_content` | content | 2 |
| `advogado.clientes.detalhe_solicitacao::local::content` | `cmp_advogado_clientes_detalhe_solicitacao_main_content` | content | 2 |
| `advogado.clientes.recusar_solicitacao::local::content` | `cmp_advogado_clientes_recusar_solicitacao_main_content` | content | 2 |
| `advogado.clientes.solicitacoes_recebidas::local::content` | `cmp_advogado_clientes_solicitacoes_recebidas_main_content` | content | 2 |
| `advogado.configuracao.agenda_semanal::local::content` | `cmp_advogado_configuracao_agenda_semanal_main_content` | content | 2 |
| `advogado.configuracao.central_ajuda::local::content` | `cmp_advogado_configuracao_central_ajuda_main_content` | content | 2 |
| `advogado.configuracao.configuracao::local::content` | `cmp_advogado_configuracao_configuracao_main_content` | content | 2 |
| `advogado.configuracao.consentimentos::local::content` | `cmp_advogado_configuracao_consentimentos_main_content` | content | 2 |
| `advogado.configuracao.falar_suporte::local::content` | `cmp_advogado_configuracao_falar_suporte_main_content` | content | 2 |
| `advogado.configuracao.meus_chamados::local::content` | `cmp_advogado_configuracao_meus_chamados_main_content` | content | 2 |
| `advogado.configuracao.politica_privacidade::local::content` | `cmp_advogado_configuracao_politica_privacidade_main_content` | content | 2 |
| `advogado.configuracao.preferencias_atendimento::local::content` | `cmp_advogado_configuracao_preferencias_atendimento_main_content` | content | 2 |
| `advogado.configuracao.suporte::local::content` | `cmp_advogado_configuracao_suporte_main_content` | content | 2 |
| `advogado.configuracao.termos_privacidade::local::content` | `cmp_advogado_configuracao_termos_privacidade_main_content` | content | 2 |
| `advogado.configuracao.termos_uso::local::content` | `cmp_advogado_configuracao_termos_uso_main_content` | content | 2 |
| `advogado.configuracao.validacao_oab::local::content` | `cmp_advogado_configuracao_validacao_oab_main_content` | content | 2 |
| `advogado.dados_oab::local::content` | `cmp_advogado_dados_oab_main_content` | content | 2 |
| `advogado.disponibilidade::local::content` | `cmp_advogado_disponibilidade_main_content` | content | 2 |
| `advogado.home_advogado::local::actions` | `cmp_advogado_home_advogado_main_actions` | actions | 2 |
| `advogado.home_advogado::local::hero` | `cmp_advogado_home_advogado_main_hero` | hero | 2 |
| `advogado.home_advogado::local::online-status` | `cmp_advogado_home_advogado_main_online_status` | online-status | 2 |
| `advogado.onboarding.areas_atuacao::local::content` | `cmp_advogado_onboarding_areas_atuacao_main_content` | content | 2 |
| `advogado.onboarding.dados_academicos::local::content` | `cmp_advogado_onboarding_dados_academicos_main_content` | content | 2 |
| `advogado.onboarding.dados_profissionais::local::content` | `cmp_advogado_onboarding_dados_profissionais_main_content` | content | 2 |
| `advogado.onboarding.disponibilidade::local::content` | `cmp_advogado_onboarding_disponibilidade_main_content` | content | 2 |
| `advogado.onboarding.perfil_profissional::local::content` | `cmp_advogado_onboarding_perfil_profissional_main_content` | content | 2 |
| `advogado.onboarding.revisao_profissional::local::content` | `cmp_advogado_onboarding_revisao_profissional_main_content` | content | 2 |
| `advogado.perfil_profissional::local::content` | `cmp_advogado_perfil_profissional_main_content` | content | 2 |
| `advogado.validacao_profissional::local::content` | `cmp_advogado_validacao_profissional_main_content` | content | 2 |

## 9. Pendências objetivas de modelagem (antes de padronizar de fato)
1. **Raiz e hierarquia:** `composition` original lista slots, mas não fornece uma `raizRef` ou `paiRef` V0.10. É necessário definir/extrair layout real ou um componente de layout já existente, sem inventar outro obrigatório só para satisfazer o exemplo `advogado.home`.
2. **IDs de instância:** escolher convenção estável e tabela de mapeamento única por tela; resolver colisões entre slots antes de converter.
3. **Template estruturado:** converter integralmente HTML com tags, SVG, atributos, texto, tokens, condicionais e repetições para `elementos`, `vinculos`, `colecoes` e condições declarativas onde possível; registrar incompatibilidades sem perda.
4. **Dados repetíveis:** algumas listas da origem podem não ter `id` por item. Não gerar IDs de negócio com índices transitórios; registrar ausência e pedir decisão antes de atribuir identidade persistente.
5. **Mapa de rotas:** separar `screenConfig.routes` (catálogo auxiliar de destinos) de `navegacao.rotas` (ligações reais com origem verificável). Manter as rotas da própria tela em índice de entrada/manifesto até decisão de extensão.
6. **Estado vs snapshot:** diferenciar `state` inicial de prévia, `presentationStates`, valores `runtime.stateLabels` e estados de negócio aprovados. Não criar 33 blocos idênticos `estados` a partir de `online: true`.
7. **Nomenclatura da Home:** origem `advogado.home_advogado` **não** é `advogado.home` do exemplo V0.10. Registrar diferença e exigir equivalência expressa antes de renomear.
8. **Classificação em jornadas:** a origem deste recorte não declara `classificacao.jornadas`. Ocorrência em Fluxo não define automaticamente jornada/subjornada ou ordem editorial.
9. **Metadados de projeto:** preservar sem inseri-los em cada unidade. A migração não está autorizada a descartar conteúdos que o V0.10 não consome.
10. **Revisão visual:** comparar o render original com o render por contrato em mobile/desktop, estados, menu, ações e modais. Não afirmar equivalência apenas por preservar os nomes dos campos.

## 10. Checklist de aceite do **mapa estrutural**
- [x] Identificar os dois contratos-alvo V0.10 (Tela e Componente) e separar suas responsabilidades.
- [x] Inventariar 33 telas, 64 componentes referenciados e 35 componentes locais na origem carregada.
- [x] Definir mapa de origem → destino por família de campos, incluindo `props`, HTML/CSS e composição.
- [x] Diferenciar `components`, `localComponents`, `screen.content.components`, IDs de tela e IDs de instância.
- [x] Separar dados do Fluxo/Mapa e os do motor **sem indicar perda ou conversão já executada**.
- [ ] Aprovar convenção de `raizRef`, `paiRef` e `instanciaId` em caso real.
- [ ] Converter um componente com template condicional/repetível e verificar fidelidade.
- [ ] Converter uma tela real completa preservando todas as suas props e dependências.
- [ ] Verificar automaticamente integridade e round-trip dos 33 contratos de tela e 99 contratos de componente.

**Resultado desta etapa:** documento de equivalência estrutural pronto. O arquivo `advogado_catalogo_completo (1).json` **permanece inalterado**. Este documento não homologa a Home nem autoriza supor regras, rotas, banco ou estados sem evidência; é a orientação para padronizar **a estrutura de cada JSON**, preservando conteúdo e vinculações.
