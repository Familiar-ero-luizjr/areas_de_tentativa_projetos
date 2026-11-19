# AdvogadoJá — Garantia de Conversão Integral do Fluxo

**Versão:** 1.0 — especificação de conversão e critérios de aceite  
**Data:** 19/11/2026  
**Status:** diretriz técnica proposta para aprovação e implementação; conversor ainda não homologado  
**Escopo exclusivo:** **Fluxo** — transformação entre a representação legada/projetada, a apresentação Flow V3, o contrato normalizado de conexões e a reconstrução do Fluxo.  
**Fora de escopo:** converter HTML/CSS em React ou Flutter; gerar telas; executar autenticação; substituir o contrato de componentes; migrar banco de produção; implementar o Motor V4 neste documento.

> **Regra absoluta:** conversão integral não é apenas produzir um JSON válido ou um desenho parecido. É preservar **100% das informações de origem**, identificar **100% das relações que de fato estejam declaradas** e provar, por testes de ida e volta, que nenhuma identidade, ocorrência, ramificação, caminho, ordem, contexto ou metadado foi perdido ou reinterpretado silenciosamente. Se a semântica for desconhecida, preservá-la e sinalizá-la; **não inventá-la**.

---

## 1. Finalidade e fronteira do trabalho

Este documento complementa a **Direção Canônica do Modelo de Telas e Componentes** e o **Contrato Canônico de Telas, Componentes, Conexões e Visualização do Fluxo** somente no assunto **conversão do Fluxo**. Não redefine tela, Jornada ou Protótipo.

A conversão precisa suportar, no mínimo:

1. **Origem → modelo de Fluxo:** ler o Fluxo atual e normalizar sem omitir informação.
2. **Modelo → visualização do Fluxo:** reconstruir a árvore/diagrama, distinguindo continuidade, escolha, condição, retorno, estado e erro.
3. **Modelo → formato de origem:** exportar novamente uma representação equivalente à importada, mantendo todos os dados e a ordem.
4. **Edição → exportação → reimportação:** preservar IDs e aplicar **somente** as alterações declaradas pelo usuário, com diferenças auditáveis.

**Não se promete que um conversor já implementado cumpre isso.** Este documento fixa os critérios verificáveis que qualquer conversor deve passar antes de receber o status `homologado`.

### 1.1 O que a palavra “total” significa

| Dimensão | Condição de aceite |
|---|---|
| Integridade documental | Todos os campos, inclusive desconhecidos e extensões, são mantidos ou recuperáveis sem alteração. |
| Estrutura do fluxo | Todas as sequências, ocorrências, ramificações, alternativas e caminhos preservam seus IDs, posições e hierarquia. |
| Referências | Identificadores continuam apontando ao mesmo objeto lógico; divergência gera erro explícito, nunca correção por semelhança. |
| Semântica comprovada | Eventos, condições e destinos são preservados quando **explicitamente** definidos na fonte. |
| Semântica não comprovada | O conversor mantém o dado original e marca o vínculo como não resolvido; não transforma desenho em regra de negócio. |
| Reconstrução visual | O Fluxo reconstruído conserva hierarquia, alternativas, títulos, rótulos, ordem e indicadores observáveis. |
| Reversibilidade | A conversão inversa reconstrói a origem estruturalmente sem perda, com metadados residuais quando necessários. |
| Edição localizada | Modificar uma ocorrência não altera outra; modificar uma definição compartilhada requer referência/escopo explícito. |
| Compatibilidade | Versões e campos adicionais não são descartados; incompatibilidades são relatadas. |

### 1.2 Dois níveis de sucesso, que não podem ser confundidos

- **Preservação integral do conteúdo (obrigatória):** todos os dados da fonte são representados no modelo normalizado **ou preservados num bloco residual versionado**, com mapeamento verificável; não há descarte.
- **Equivalência funcional integral (mais forte):** todos os destinos, gatilhos, condições, prioridades e políticas necessários à execução têm base **explícita e validada**. Esse nível **não** pode ser certificado quando a fonte registra apenas uma seta, posição, rótulo ou sequência editorial.

Uma conversão pode passar na **preservação** e continuar **pendente de equivalência funcional**. Não rotular ambas como “100% funcional”.

---

## 2. Fontes e inventário real de referência

As duas formas abaixo foram inspecionadas e **não são versões estruturalmente idênticas**:

| Fonte | Local | Conteúdo observado |
|---|---|---|
| Projeção do Fluxo | `advogadoja-fluxo-projecao (7).json` → `domain.flow.graph.root` | `118` sequências, `197` ocorrências de tela, `36` branches (`32 navigation`, `4 condition`) e `117` paths. |
| Projeção do Fluxo — demais blocos | Mesmo JSON | `core.screens` com `78` chaves; `catalog.entries` com `78` entradas; `domain.flow.state` com `nodes`, `paths`, `transitions`, `segments` vazios na fonte inspecionada, além de `history`; metadados, timestamps e revisões. |
| Apresentação Flow V3 | `ADVOGADOJA_FLOW_V3_BASE_CONTRATO_V02 (1).zip` → `flow_apresentacao_v3.json` | `115` sequências, `197` ocorrências de tela, `33` branches e `114` paths; `aliasMap` com 11 entradas, `legacyScreens`, `politica` e metadados de origem. |
| Catálogo referenciado no pacote V3 | ZIP → `catalogo/catalogo.json` | Índice de telas e componentes associado à apresentação; é uma **referência** do Fluxo, não autorização para alterar o modelo visual das telas. |
| Documento de direção das conexões | `CONTRATO_CANONICO_TELAS_COMPONENTES_CONEXOES_FLUXO_V1.md` | Regras conceituais de IDs, conexões, bifurcação inferida, entradas, retornos, estados e não inferência de negócio. |

**Atenção:** as contagens são de **arquivos específicos inspecionados**, não metas universais. Cada importação deve calcular novamente o inventário do próprio arquivo. `197` ocorrências em ambas as fontes não prova equivalência: há diferença de **3 branches, 3 sequências e 3 paths**.

### 2.2 Divergência concreta já localizada — três resultados de checkout

A comparação entre os IDs das duas árvores encontrou **os mesmos 197 IDs de ocorrências de tela**, mas a V3 omite os seguintes objetos que existem na projeção (7):

| Pai | Branch presente na projeção (7) | Path e sequência presentes na projeção (7) | Substituição observada na apresentação V3 |
|---|---|---|---|
| `sequence-0168` | `branch-checkout-0142` (`condition`, “Resultado do checkout”) | `path-checkout-0142`, `sequence-checkout-0142` | `screen-0143` aparece diretamente como item da sequência. |
| `sequence-0236` | `branch-checkout-0210` (`condition`, “Resultado do checkout”) | `path-checkout-0210`, `sequence-checkout-0210` | `screen-0211` aparece diretamente como item da sequência. |
| `sequence-0408` | `branch-checkout-0382` (`condition`, “Resultado do checkout”) | `path-checkout-0382`, `sequence-checkout-0382` | `screen-0383` aparece diretamente como item da sequência. |

Portanto, **a apresentação V3 achatou três agrupamentos condicionais de checkout**. Os nós finais continuam presentes, mas os IDs, títulos, rótulos e contêineres das ramificações não foram representados na árvore V3. **Reconstituir a projeção (7) somente a partir da árvore V3 não é uma conversão estruturalmente completa**, a menos que essas informações sejam fornecidas em um complemento verificável. Nenhum conversor deve recriar as branches por dedução ou afirmar que as duas fontes são equivalentes.


### 2.1 Estruturas que precisam entrar no inventário

**Projeção (7):**

```text
format / schemaVersion / sourceCatalog / updatedAt
core.revision
core.screens[<screenKey>].entityRef / fingerprint
catalog.schemaVersion / generatedAt / project / source / entries[]
domain.flow.format / schemaVersion / createdAt / updatedAt
domain.flow.graph.root
  sequence { id, type, items[] }
  screen   { id, type, entityRef }
  branch   { id, type, branchType, title, paths[] }
  path     { id, label, sequence }
domain.flow.state { contractVersion, nodes, paths, transitions, segments, history }
```

**Apresentação V3:**

```text
schema / schemaVersion / origem / titulo / politica
root
  sequence { id, type, items[] }
  screen   { id, type, screenKey, variant, telaRef, mapeamento }
  branch   { id, type, title, paths[] }
  path     { id, label, isDefault?, sequence }
aliasMap { <screenKey>: <telaId> }
legacyScreens { <screenKey>: { ...dados originais } }
```

Campos opcionais, blocos não listados e extensões futuras também devem ser preservados. A ausência de `branchType` na apresentação V3 **não autoriza inferir** `navigation` ou `condition` a partir do título.

---

## 3. Conceitos e identidades imutáveis na conversão

| Conceito | Responsabilidade | Regra |
|---|---|---|
| **Definição de tela (`telaId`)** | Identificar a tela única do produto | Não criar nova tela porque aparece mais de uma vez no grafo. |
| **Ocorrência de tela (`occurrenceId`)** | Identificar cada presença da tela num percurso | Preservar todas as ocorrências e sua posição contextual. |
| **Sequência (`sequenceId`)** | Preservar a ordenação e o agrupamento da árvore | Preservar inclusive sequências com um ou zero elementos. |
| **Ramificação (`branchId`)** | Preservar agrupamento e título das alternativas | Não confundir objeto editorial com condição executável. |
| **Caminho (`pathId`)** | Identificar alternativa e sequência descendente | Preservar rótulo, prioridade e `isDefault` quando existirem. |
| **Conexão (`connectionId`)** | Ligar origem/saída a destino/entrada declarados | Uma relação funcional precisa de dados explícitos; não nasce só da proximidade. |
| **Condição (`conditionId`)** | Predicado que escolhe transição | Referência a condição validada; não avaliar texto livre. |
| **Ação/evento** | Gatilho de uma possível transição | Menu com várias ações não é bifurcação booleana. |
| **Estado/variante** | Contexto da ocorrência ou apresentação | Não alterar telaId nem converter mudança visual em navegação. |
| **Referência legada** | Chave usada pela fonte de importação | Conservar como referência de origem; não criar uma segunda tela. |

### 3.1 Exemplo delicado: Home

Na apresentação Flow V3 inspecionada, `aliasMap` declara explicitamente:

```json
{ "advogado.home_advogado": "advogado.home" }
```

Para essa **fonte específica**, `advogado.home` é a identidade canônica indicada; `advogado.home_advogado` é a chave legada de referência na apresentação. **Não se deve criar duas Homes** e **não se deve corrigir IDs por semelhança de texto**. O mapeamento vale quando é fornecido e confirmado pelo material importado; na ausência de evidência, apontar `referencia_nao_resolvida`.

### 3.2 Regra de colisões

Dois nós com o mesmo ID no mesmo escopo não podem ser simplesmente fundidos. Dois IDs diferentes com nomes iguais também não podem ser fundidos. Se o mesmo `screenKey` tiver destinos canônicos divergentes, registrar `conflito_mapeamento` e bloquear homologação funcional.

---

## 4. Arquitetura de conversão: duas camadas, uma origem preservada

A conversão **não deve tentar substituir toda a árvore por uma lista de setas**: a árvore pode conter dados editoriais não recuperáveis de uma lista de conexões. São necessárias duas visões complementares do **mesmo Fluxo**.

```text
FONTE LEGADA / FLOW V3
        │
        ├── 1) snapshot imutável + hash
        │
        ├── 2) inventário e mapeamento por ID
        │
        ▼
MODELO NORMALIZADO DO FLUXO
        ├── estruturaApresentacao: sequência / branch / path / ocorrência
        ├── conexoesDeclaradas: somente relações funcionais demonstradas
        ├── referencias: telaId, screenKey de origem, mapeamentos validados
        ├── estados / condições / eventos: quando explicitamente declarados
        ├── metadadosFonte / extensoes: sem descarte
        └── rastreabilidade: caminhos JSON e IDs originais
        │
        ├── 3) projeção para visualização (não altera o modelo)
        ├── 4) edição explícita sobre objeto identificado
        └── 5) reconversão + diff + relatórios + testes
```

**Camada A — Árvore de apresentação:** preserva **literalmente** a estrutura de `sequence`, `screen`, `branch` e `path`, os títulos, a ordenação dos arrays, os IDs e as propriedades extras. Ela é necessária para reconstruir o Fluxo V3.

**Camada B — Semântica de navegação:** armazena **somente** ligações, eventos, condições, destinos, prioridades e política de navegação respaldados por contratos ou registros funcionais. Não transforma automaticamente `sequence.items` em conexões navegáveis nem rótulos de `path` em condições.

### 4.1 Quando um losango é gerado

No desenho, dois ou mais caminhos condicionais **comprovados** para o mesmo evento podem renderizar um losango automaticamente. Contudo, um objeto `branch` da fonte deve continuar identificável na camada de apresentação, pois seu ID, título, tipo e alternativas devem sobreviver à exportação inversa. **Não persistir outro losango como relação de negócio independente.**

### 4.2 Roteamento de estados e resultados

O estado visual local, o estado de domínio e o estado de navegação não se substituem. Uma alteração de OAB, disponibilidade ou painel aberto **não cria outra tela ou conexão** por si só; uma transição só pertence à navegação se a fonte declarar uma ação/saída com destino.

---

## 5. Contrato de saída do conversor do Fluxo (formato proposto)

Os nomes abaixo são um **contrato candidato do conversor**, não uma ordem para reescrever os contratos de telas.

```json
{
  "schema": "advogadoja.fluxo.conversao",
  "schemaVersion": "1.0.0",
  "origem": {
    "formato": "advogadoja-flow-projection",
    "versao": 2,
    "arquivo": "advogadoja-fluxo-projecao (7).json",
    "sha256": "<hash-calculado>",
    "raizJson": "$.domain.flow.graph.root"
  },
  "apresentacao": {
    "raizRef": "sequence-0429",
    "arvore": "<arvore-preservada-com-ids-ordem-e-metadados>"
  },
  "navegacao": {
    "conexoesDeclaradas": [],
    "condicoesDeclaradas": [],
    "referenciasResolvidas": [],
    "referenciasPendentes": []
  },
  "proveniencia": {
    "mapeamentos": [],
    "camposPreservados": [],
    "camposResiduais": []
  },
  "verificacao": {
    "status": "nao_verificado"
  }
}
```

A árvore acima é abreviada para documentação. **Uma implementação real deve transportar objetos JSON, não a string de exemplo**. O campo `<arvore-preservada...>` não é formato de armazenamento aceito. Se a implementação optar por tabelas de objetos indexadas por ID, deverá garantir reconstrução determinística de toda a hierarquia e posição.

### 5.1 Arquivos mínimos de uma conversão auditável

| Arquivo | Finalidade |
|---|---|
| `fonte_original.json` | Cópia exata e imutável dos bytes de origem. |
| `fluxo_normalizado.json` | Fluxo com estrutura, referências e semântica explicitamente resolvida. |
| `mapa_de_conversao.json` | Para cada campo/objeto: caminho JSON original, caminho novo, ID, transformação e confiança. |
| `extensoes_preservadas.json` | Campos sem mapeamento direto, com localização de origem e valor original. |
| `relatorio_de_validacao.json` | Contagens, hashes, referências, cobertura, divergências e bloqueios. |
| `fluxo_reconstruido.json` | Resultado da inversão a partir do normalizado **mais extensões**, sem copiar o snapshot como atalho. |
| `diff_conversao.json` | Diferenças estruturais e semânticas; vazio para conversão sem edição. |

O arquivo original é a **garantia de recuperação**. A reconversão deve, porém, ser demonstrada **sem simplesmente devolver o original armazenado**; caso contrário, não comprova a qualidade do conversor.

### 5.2 Edição e persistência

O pacote convertido é um **estado de trabalho identificável**. A interface só altera o objeto selecionado por ID e grava um conjunto de operações explícitas. Uma atualização de desenho não deve editar a relação funcional; uma alteração de destino não deve reordenar `sequence.items` sem instrução do usuário.

---

## 6. Mapa de conversão obrigatório, campo por campo

### 6.1 Projeção (7) → modelo normalizado

| Campo original | Destino / tratamento obrigatório |
|---|---|
| `format`, `schemaVersion`, `sourceCatalog`, `updatedAt` | `origem`/`metadadosFonte` ou residual; conservar valores exatos. |
| `core.revision`, `core.screens.*.entityRef`, `fingerprint` | Índice de referência da fonte; não alterar seu `entityRef`. |
| `catalog.schemaVersion`, `generatedAt`, `project`, `source`, `entries[]` | Metadados e índice de consulta; preservar elementos completos e ordem. |
| `domain.flow.format`, `schemaVersion`, `createdAt`, `updatedAt` | Metadados do Fluxo; preservar precisão e timezone textual. |
| `graph.root` | Raiz da apresentação com identidade original. |
| `sequence.id`, `type`, `items[]` | Identidade, tipo e filhos ordenados; cardinalidade 0..N. |
| `screen.id` | ID de **ocorrência**, distinto de `telaId`. |
| `screen.entityRef` | Chave de tela tal como veio; resolver identidade canônica só por evidência explícita. |
| `branch.id`, `type`, `branchType`, `title` | Identidade, tipo, modalidade declarada e rótulo; não inferir condição executável. |
| `branch.paths[]` | Lista ordenada integral de alternativas. |
| `path.id`, `label`, `sequence` | ID, rótulo e subárvore completos. |
| `domain.flow.state.contractVersion` | Metadado de versão, sem reinterpretação. |
| `state.nodes`, `paths`, `transitions`, `segments`, `history` | Copiar integralmente, inclusive arrays/objetos vazios; mapear sem perda quando populados. |
| Qualquer campo não reconhecido | Preservar em extensões com JSON Pointer e nome/valor/tipo exatos. |

### 6.2 Flow V3 → modelo normalizado

| Campo original | Destino / tratamento obrigatório |
|---|---|
| `schema`, `schemaVersion`, `origem`, `titulo`, `politica` | Metadados editoriais e versão de fonte. |
| `root.sequence.id/items[]` | Estrutura ordenada da apresentação. |
| `root.screen.id` | Identificador da ocorrência da tela no Fluxo. |
| `root.screen.screenKey` | Referência da apresentação original. |
| `root.screen.telaRef` | Referência declarada à tela de contrato; preservar separadamente do `screenKey`. |
| `root.screen.variant` | Variante selecionada para aquela ocorrência; não alterar a definição da tela. |
| `root.screen.mapeamento` | Marcador de origem/estado do vínculo. |
| `root.branch.id/title/paths[]` | Ramificações editoriais e alternativas; `branchType` não é obrigatório em V3. |
| `root.path.id/label/isDefault?/sequence` | Identidade, label, `isDefault` explícito **e sua ausência quando não declarado**, subárvore. |
| `aliasMap` | Mapeamentos literais `screenKey → telaRef` declarados na própria fonte; detectar conflito. |
| `legacyScreens` | Metadados completos por chave original; não descartá-los ao consolidar IDs. |
| Quaisquer extensões | Preservar no residual com localização e tipo, inclusive `null` versus ausência. |

**Regra geral:** um campo sem destino semântico ainda pode ser mantido integralmente no residual. O que **não** é permitido é perder o campo, atribuir-lhe significado não provado ou considerar a conversão funcional homologada por ter apenas arquivado dados.

### 6.3 Matriz de responsabilidade

| Domínio | Conversor pode normalizar? | Pode inferir regra de negócio? |
|---|---|---|
| ID de ocorrência e posição na árvore | Sim, preservando ID e posição | Não |
| Identidade da tela | Sim, com equivalência explícita | Não |
| Branch `navigation` / `condition` existente | Sim, preservando classificação da origem | Não; categoria não substitui condição |
| Título/rótulo de caminho | Sim, como apresentação | Não |
| `path.isDefault` | Sim, como dado literal | Não inferir fallback funcional |
| Conexão com origem/evento/destino explícitos | Sim | Não há inferência, há transcrição verificada |
| Condição textual não resolvida | Preservar e marcar pendência | Não |
| Tema/layout/cor do construtor | Somente se existirem e fizerem parte do pacote do Fluxo | Não |
| Dados de componente/tela importados | Preservar referências, sem converter definições de tela | Não |

---

## 7. Procedimento obrigatório de conversão

### Fase 0 — Descoberta e congelamento da entrada

- Identificar formato e versão efetivos; rejeitar JSON inválido com relatório, sem alteração do arquivo.
- Copiar os bytes de origem, calcular SHA-256 e gerar inventário de chaves, tipos, IDs e ocorrências.
- Criar baseline específico: quantidade de `sequence`, `screen`, `branch`, `path`, estados, transições, segmentos, entradas de catálogo e aliases.
- Verificar duplicação de IDs **por categoria/escopo** e referências ausentes; registrar falhas sem “autocorreção”.

### Fase 1 — Leitura da árvore

- Percorrer `sequence.items` na ordem original, incluindo listas vazias.
- Para cada `screen`, preservar ID da ocorrência e referência original de tela.
- Para cada `branch`, preservar ID, tipo declarativo (`branchType`, quando existir), título, `paths[]` e posições.
- Para cada `path`, preservar ID, rótulo, `isDefault` quando existir e sequência descendente.
- Preservar caminhos completos como **rastreabilidade editorial**; não converter índice `[0]` em ID permanente.

### Fase 2 — Identificação e mapeamento

- Resolver referências usando primeiro a identidade efetivamente declarada e o `aliasMap` fornecido pela fonte, quando houver e for válido.
- Separar `telaId` de `occurrenceId`: várias ocorrências podem referir a mesma tela, sem duplicá-la.
- Quando a referência não puder ser confirmada, manter a chave de origem e emitir `referencia_nao_resolvida`.
- Detectar alias circular, ambíguo, conflitante ou apontando para objeto inexistente; não inventar substituição.

### Fase 3 — Formação de relações

- Gerar **continuidade estrutural da apresentação** quando a árvore fornece ordem; manter a natureza **não executável** dessa continuidade.
- Criar **conexão funcional** somente quando existirem origem/saída, destino/entrada e semântica verificável em dados declarados.
- Se uma branch for `condition`, preservar essa indicação, mas não criar predicados a partir de `label`.
- Não converter ações diferentes de menu em condições mutuamente exclusivas.
- Reconhecer múltiplas entradas à mesma tela e retornos sem clonar definições.
- Não persistir um segundo branch artificial apenas para desenhar um losango; a visualização pode derivá-lo quando houver conexões condicionais comprovadas.

### Fase 4 — Preservação integral

- Copiar integralmente metadados globais, de catálogo, sessão de edição e extensões desconhecidas.
- Guardar campos sem correspondência no residual com `jsonPointer`, tipo JSON, valor e vínculo ao ID de origem.
- Preservar a diferença entre **ausente**, `null`, `false`, `0`, `""`, `{}` e `[]`.
- Preservar ordem de arrays e chaves relevantes para reconstrução. A ordem física de chaves de objetos JSON pode ser normalizada para comparação, mas o valor e a presença de cada chave não.

### Fase 5 — Reconstrução e comparação

- Reconstruir a árvore da fonte usando **normalizado + residual**, sem consultar a cópia original.
- Comparar JSON original versus reconstruído de forma recursiva, ignorando apenas espaços em branco e ordem das chaves de objeto; **não** ignorar campos, tipos ou ordem de arrays.
- Calcular diferenças por caminho JSON e associar ao ID do objeto.
- Executar inspeção do grafo: IDs, ramificações, paths, continuidade e aliases.
- Produzir atestado `aprovado` somente quando não houver perda estrutural e nenhuma divergência não autorizada.

### Fase 6 — Conversão inversa após edição

- Aplicar operações identificadas (criar/editar/remover conexão, caminho, ocorrência, rótulo etc.) e registrar seu escopo.
- Informar alterações que não são representáveis no formato legado; **bloquear exportação inversa que as perderia**, ou oferecer pacote estendido sem chamá-lo de formato legado integral.
- Repetir round-trip, recálculo de inventário e testes de impacto para todas as alterações.

---

## 8. Regras de reconstrução da visualização do Fluxo

A visualização pode mudar de tecnologia, mas **não pode alterar o significado ou a composição** do Fluxo importado.

| Entrada ou situação | Representação esperada |
|---|---|
| `sequence` | Filhos exibidos na mesma ordem do array original. |
| `screen` | Um nó por ocorrência, com ID próprio e referência à mesma definição de tela. |
| `branch` | Agrupamento de alternativas com seu ID, título e tipo, se declarado. |
| `path` | Rótulo, ordem, marca `isDefault` se houver, subárvore e ID preservados. |
| Conexão direta **comprovada** | Aresta de navegação com origem, evento/saída e destino identificados. |
| Múltiplas saídas condicionais **comprovadas** | Bifurcação desenhada a partir das relações; sem nova regra persistida. |
| Ações distintas | Alternativas vinculadas aos respectivos eventos, não uma decisão booleana fabricada. |
| Múltiplas entradas | Junção/compartilhamento visual sem duplicar definição da tela. |
| Destino igual à origem / anterior | Retorno/ciclo identificado, respeitando eventual política declarada. |
| Condição ou ID não resolvido | Marcador explícito de pendência; não simular um valor verdadeiro. |
| Nó terminal declarado | Fim válido, sem criação de destino automático. |

O desenho gerado **não é fonte da verdade**. Coordenadas e organização visual, se presentes na origem como dados de edição, devem sobreviver no campo adequado; arrastar um cartão não autoriza mudar a conexão funcional.

---

## 9. Invariantes automáticos de integridade

**I01 — Contagem:** números por tipo no JSON reconstruído iguais à origem, exceto alterações expressamente registradas.  
**I02 — Identidade:** todos os IDs originais presentes, sem colisões novas, e toda ocorrência preservada.  
**I03 — Hierarquia:** mesma relação pai/filho, ordenação e pertencimento de cada path.  
**I04 — Conteúdo:** título, `label`, `branchType`, `variant`, `isDefault`, `screenKey`, `telaRef`, `entityRef` e demais valores preservados.  
**I05 — Referências:** toda referência mapeada tem prova de origem; nenhum alias é aplicado por similaridade.  
**I06 — Cardinalidade:** nenhum caminho, mesmo vazio, é removido por simplificação.  
**I07 — Distinção de tipos:** `null`, ausente, array vazio e objeto vazio não são convertidos uns nos outros.  
**I08 — Metadados:** nenhum campo global, de catálogo, histórico ou de extensão desaparece.  
**I09 — Semântica:** conexões funcionais só podem apontar para relação explicitamente identificada; semânticas desconhecidas continuam desconhecidas.  
**I10 — Reversibilidade:** fonte e reconstruído são estruturalmente iguais quando não houve edição.  
**I11 — Edição localizada:** alterações atingem somente IDs/escopos declarados e o residual correspondente.  
**I12 — Módulos:** nenhum campo do Fluxo migra para a estrutura visual de uma tela só por conveniência.  
**I13 — Determinismo:** o mesmo arquivo e mesmas regras geram o mesmo modelo lógico e mesmos relatórios (ignorando timestamps operacionais de execução).  
**I14 — Repetibilidade:** importar um resultado já normalizado não duplica ocorrências, conexões, aliases ou paths.  
**I15 — Exportação:** os dados que o editor não conhece são preservados mesmo depois de editar uma propriedade conhecida.  
**I16 — Divergência:** diferenças não autorizadas bloqueiam aprovação; divergência de conteúdo não é mascarada por contagem igual.

### 9.1 Algoritmo conceitual de verificação

```text
entrada = ler_bytes(origem)
snapshot_sha256 = SHA256(entrada)
objeto = parse_json(entrada)
baseline = inventariar_todos_os_objetos_campos_ids_e_caminhos(objeto)

normalizado, residual, mapa = converter_sem_inferir_semantica(objeto)
reconstruido = inverter(normalizado, residual, mapa)   // NÃO ler snapshot

diffs = diff_json_estrutural(objeto, reconstruido,
          ignorar_somente=[espacos_entre_tokens, ordem_de_chaves_objeto])

if diffs != []:
    status = REPROVADO_POR_PERDA
elif existem_conflitos_de_ids_ou_refs:
    status = PRESERVADO_COM_BLOQUEIOS_SEMANTICOS
elif existem_condicoes_ou_efeitos_nao_demonstrados:
    status = PRESERVADO_SEM_EQUIVALENCIA_FUNCIONAL_COMPROVADA
else:
    status = APTO_A_HOMOLOGACAO_FUNCIONAL_SUJEITO_A_TESTES
```

**Importante:** `diffs=[]` mede **reversibilidade estrutural**, não prova que eventos e condições ausentes na origem foram obtidos corretamente.

---

## 10. Testes de aceitação obrigatórios

| ID | Teste | Aceite |
|---|---|---|
| FLX-CONV-01 | Importar a projeção (7) e inventariar estrutura | Contagens recalculadas por tipo; todas as chaves preservadas. |
| FLX-CONV-02 | Reconstruir projeção (7) sem edição | Diff estrutural vazio; IDs e ordem preservados. |
| FLX-CONV-03 | Importar apresentação V3 | `screenKey`, `telaRef`, `variant`, `mapeamento`, aliases e legacyScreens preservados. |
| FLX-CONV-04 | Reconstruir apresentação V3 | Diff estrutural vazio, inclusive `isDefault` e ausências opcionais. |
| FLX-CONV-05 | Comparar projeção e V3 | Exibir precisamente diferenças por IDs, não declarar equivalência por igual número de telas. |
| FLX-CONV-06 | Tela repetida em ramos diferentes | Todas as ocorrências distintas; um só `telaId` quando o vínculo for declarado. |
| FLX-CONV-07 | Dois caminhos com mesma tela | IDs de `path` e contexto separados; nenhuma fusão automática. |
| FLX-CONV-08 | Branch `navigation` versus `condition` | Tipo existente preservado; ausente não inventado. |
| FLX-CONV-09 | Paths vazios e branches vazios | Objetos e ordem mantidos sem eliminação por limpeza. |
| FLX-CONV-10 | Retorno ao nó já visitado | Referência/ciclo preservado sem reproduzir outra definição de tela. |
| FLX-CONV-11 | Alias explícito Home | `advogado.home_advogado → advogado.home` preservado como mapeamento documental, sem duplicar Home. |
| FLX-CONV-12 | Alias ausente ou conflitante | Erro explícito; nenhum conserto por similaridade. |
| FLX-CONV-13 | Condição de negócio não declarada | Estado pendente; não atribuir `true`, `false` nem política de prioridade. |
| FLX-CONV-14 | Dois eventos de menu | Duas alternativas de ação; não inventar bifurcação booleana. |
| FLX-CONV-15 | Mesmo evento com duas condições válidas | Losango **derivado** e conexões preservadas, sem branch semântico duplicado. |
| FLX-CONV-16 | Condições sobrepostas e sem prioridade | Sinalizar conflito e impedir resolução arbitrária. |
| FLX-CONV-17 | Adicionar campo desconhecido em qualquer nível | Campo atravessa importação/exportação com mesmo valor/tipo. |
| FLX-CONV-18 | `null` versus ausente; `{}` versus `[]` | Diferenças preservadas e detectadas no diff. |
| FLX-CONV-19 | Editar uma ocorrência | Apenas o nó/ID selecionado é alterado. |
| FLX-CONV-20 | Editar conexão compartilhada | Aviso de impacto e alteração somente nos consumidores explicitamente vinculados. |
| FLX-CONV-21 | Alterar posição visual | Sem alteração da semântica do grafo de navegação. |
| FLX-CONV-22 | Converter, exportar, importar e converter novamente | Sem multiplicação de nós, caminhos ou aliases; mapeamento estável. |
| FLX-CONV-23 | Formato legado incapaz de guardar edição nova | Bloquear conversão inversa com perda ou exportar formato estendido claramente identificado. |
| FLX-CONV-24 | Corrupção, ID duplicado e ref inexistente | Relatório de validação com caminho JSON exato e severidade. |
| FLX-CONV-25 | Repetir em fontes com extensões adicionais | Preservação integral sem reimplementar o conversor para cada campo desconhecido. |
| FLX-CONV-26 | Visualização no Fluxo após round-trip | Hierarquia, labels, títulos, ramo ativo e ordem consistentes; diferenças intencionais registradas. |
| FLX-CONV-27 | Comparar exportação em dois ciclos sem alteração | Mesmo conteúdo semântico e estrutural; dados não editados estáveis. |
| FLX-CONV-28 | Persistência de metadados de revisão | Revisões, timestamps de origem e dados de histórico mantidos, sem sobrescrever a proveniência. |

**Regra de homologação:** todos os testes de preservação, identidade, reconstrução e exportação (01–12, 17–28, conforme o formato e as capacidades presentes) devem passar. Testes condicionais (13–16) devem passar quando sua semântica for declarada no conjunto de entrada; quando não for, exige-se a marcação de ausência, nunca a fabricação do comportamento.

---

## 11. Auditoria de perdas e relatório obrigatório

Toda execução produz um relatório legível por máquina **e** um resumo para revisão humana:

```json
{
  "fonte": "<nome-da-fonte>",
  "sha256Fonte": "<hash>",
  "sha256Reconstrucao": "<hash-dos-bytes-reconstruidos-se-aplicavel>",
  "inventarioFonte": {
    "screenOccurrences": 197,
    "sequences": 118,
    "branches": 36,
    "paths": 117
  },
  "inventarioReconstruido": {
    "screenOccurrences": 197,
    "sequences": 118,
    "branches": 36,
    "paths": 117
  },
  "camposOmitidos": 0,
  "idsPerdidos": 0,
  "conflitosDeReferencia": [],
  "semanticaNaoComprovada": [],
  "diffsEstruturais": [],
  "status": "preservado_sem_homologacao_funcional"
}
```

O inventário exemplifica **somente** a projeção (7) inspecionada. **Não copiar esses números como constantes do conversor.** O hash de bytes do reconstruído pode divergir do original apenas por formatação ou ordem física de chaves; a aprovação estrutural compara o objeto JSON inteiro. Para equivalência *byte a byte*, a cópia original preservada fornece o hash original.

### 11.1 Severidades

- **Bloqueio:** perda de campo/objeto, alteração de ID, corrupção de hierarquia, reconversão impossível, condição/evento inventado, mesclagem ambígua, edição não representável descartada.
- **Pendente de semântica:** campo funcional sem fonte, referência ainda não resolvida, condição sem definição, comportamento não comprovado. Pode haver preservação documental total sem homologação funcional.
- **Aviso:** metadado novo preservado como extensão; alteração de formatação sem alteração do JSON; diferença visual intencional devidamente registrada.

### 11.2 Estados permitidos do atestado

`reprovado_por_perda` · `preservado_com_bloqueios_semanticos` · `preservado_sem_equivalencia_funcional_comprovada` · `apto_a_homologacao_funcional` · `homologado`.

**Proibido:** marcar `homologado` porque o JSON carregou, porque o diagrama apareceu, porque um hash do snapshot bateu ou porque duas contagens globais são iguais.

---

## 12. Como manter compatibilidade sem perpetuar duplicações

1. **Uma tela, um ID canônico:** a chave legada de catálogo é mantida apenas no mapa de referência de origem.
2. **Uma ocorrência, um ID próprio:** o mesmo `telaId` pode aparecer muitas vezes; `occurrenceId` não vira outro `telaId`.
3. **Uma conexão funcional, uma definição:** a árvore editorial pode referenciar as conexões, mas não deve inventar cópias independentes.
4. **Branch derivado versus branch importado:** manter estrutura editorial importada para ida e volta; gerar desenhos condicionais das relações reais sem duplicar semântica.
5. **Estado e navegação separados:** não inserir rotas artificiais para representar OAB, online/offline ou mudança local de visual.
6. **Formato próprio, conversão explícita:** o conversor transforma o que é demonstrado; extensões preservam o resto; mudanças sem inversa geram bloqueio.
7. **Não exigir `participacoes`, `moduloRef`, `escopo` no novo contrato:** esses campos antigos, se presentes em **dados de origem**, devem ser preservados como metadados legados, e não reintroduzidos no modelo operacional.
8. **Sem dependência do editor:** os registros são interpretáveis sem CSS do construtor, coordenadas presumidas ou HTML do painel.

---

## 13. Critérios finais de aprovação do conversor

**Pode receber o selo “conversão integral do Fluxo” somente se:**

- A fonte original está identificada e preservada com checksum.
- O inventário de tipos/IDs/ocorrências/caminhos é reproduzido integralmente.
- O mapeamento campo a campo é completo, com residual explícito para extensões.
- A reconstrução inversa do normalizado + residual produz **diff estrutural vazio** quando não há edições.
- Toda edição possui trilha de mudanças, escopo declarado e validação de impacto.
- Não há conexão, condição, destino, alias ou autorização inventados pelo conversor.
- Divergências entre versões (como as três branches de checkout ausentes na V3) são explicadas por IDs e diferenças demonstradas; não apagadas nem assumidas equivalentes.
- A visualização do Fluxo recompõe hierarquia e informações editoriais necessárias à edição.
- Os testes obrigatórios foram executados e suas evidências estão anexadas.

**Falha em qualquer requisito de preservação ou reversibilidade = conversão NÃO homologada.**  
**Falta de regras de navegação na fonte = preservar integralmente, mas não atestar equivalência funcional até obter as definições.**

---

## 14. Registro de decisões e pontos ainda abertos

| Assunto | Decisão neste documento | Estado |
|---|---|---|
| Escopo | Exclusivamente Fluxo; não converter telas para frameworks. | Definido. |
| Identidade | Preservar tela única, ocorrência e ramo separadamente. | Definido. |
| Preservação | Zero perda; campos desconhecidos no residual, não descartados. | Definido. |
| Fontes | Projeção (7) e pacote Flow V3 são famílias de entrada distinguíveis. | Observado. |
| `branchType` ausente no V3 | Preservar ausência; não inferir categoria funcional. | Definido. |
| Diferença de 3 branches entre fontes | Três agrupamentos de checkout foram achatados na V3; a reconciliação necessita repor metadados da fonte quando a conversão exigir a estrutura completa da projeção. | Diferença identificada; reconciliação ainda pendente. |
| Grafo executável | Apenas relações explicitamente definidas/validadas. | Definido como regra, dados concretos a completar. |
| Nome físico do JSON normalizado | Campos da seção 5 são propostos, ainda não integrados aos motores. | Proposto. |
| Conversor | Implementação, testes reais e prova de round-trip. | Pendente. |
| Homologação | Exigir relatório, diff, testes e aceite explícito. | Definido como critério. |

### Referências usadas

- `CONTRATO_CANONICO_TELAS_COMPONENTES_CONEXOES_FLUXO_V1.md` — decisões conceituais sobre relações, IDs, bifurcações inferidas e fluxo.
- `ADVOGADOJA_DIRECAO_CANONICA_MODELO_TELAS_COMPONENTES_MODULOS_V1.md` — responsabilidades do módulo Fluxo e integridade entre módulos.
- `advogadoja-fluxo-projecao (7).json` — projeção do Fluxo inspecionada para este inventário.
- `ADVOGADOJA_FLOW_V3_BASE_CONTRATO_V02 (1).zip` → `flow_apresentacao_v3.json` e `catalogo/catalogo.json` — apresentação e índices inspecionados.

**Síntese normativa:** **converter integralmente o Fluxo é transportar todos os seus dados e reconstruí-lo sem perda, não redesenhar setas parecidas. Se um dado não puder ser traduzido com segurança, ele é preservado, marcado e impede a alegação de equivalência funcional até ser resolvido.**
