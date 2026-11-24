# AdvogadoJá — Padrão canônico de construção de Telas e Componentes

**Norma de implementação v1.0.0 · 23/11/2026**  
**Objeto:** transformar HTML, CSS, templates, fragmentos ou referências parciais em uma única estrutura JSON determinística, reutilizável e validável.  
**Status:** **decisão arquitetural para novos contratos**. A aplicação sobre os dados ativos do Projeto 9 exige migração coordenada dos motores; este documento **não afirma** que os consumidores atuais já suportem o novo formato.

> **Regra principal:** o HTML recebido é evidência; o **JSON canônico é o produto**. A forma do JSON nunca depende do tipo, da qualidade ou da tecnologia da referência. A tela apenas **compõe instâncias**; cada componente define seus **nós HTML, seu CSS, seus estados e seus eventos**. Cada informação tem um único dono.

## 1. Decisões definitivas

1. **Uma identidade por definição.** O pacote tem `telas` e `componentes`; as chaves correspondem exatamente a `identidade.id`. Não há aliases nem cópias de componentes dentro das telas.
2. **Mesmos blocos superiores em Tela e Componente:** `identidade`, `classificacao`, `estrutura`, `estados`, `variantes`, `interacoes`, `dados`, `mocks`, nesta ordem. Os blocos sempre existem; valores não aplicáveis ficam vazios com **tipo fixo**, e não com `null` ou placeholders. Preencher o bloco não significa aprovar conteúdo ausente.
3. **`estrutura.html` e `estrutura.css` são obrigatórios nos dois tipos.** Uma Tela tem `html.composicao`; um Componente tem `html.elementos`, `html.vinculos`, `html.colecoes` e `html.condicionais`.
4. **IDs com escopos distintos:** `instanciaRef` identifica uma ocorrência na Tela; `elementoRef` identifica um nó dentro da definição do Componente; `componenteRef` identifica a definição na biblioteca. Esses identificadores nunca são intercambiáveis.
5. **Hierarquia inequívoca:** na Tela, `paiRef` sempre aponta para **outra instância**; `alvoRef` aponta para o **elemento do componente pai** onde será montada a instância filha. No Componente, `paiRef` sempre aponta para **outro elemento do mesmo componente**. A raiz tem `paiRef: null`.
6. **HTML convertido em árvore sem perda de ordem:** cada tag e cada nó de texto significativo recebe ID estável. O pseudo-tag `#text` representa um nó de texto real e permite preservar texto antes, entre e depois de elementos filhos. Não salvar HTML bruto paralelo no contrato.
7. **CSS com uma única representação:** `tokens` é um objeto de propriedades customizadas; `regras` é uma **lista ordenada** de regras CSS completas, cada uma com `id`, `ordem`, `css`. A lista suporta regras normais, `@media`, `@supports`, `@container`, `@keyframes` etc. Não duplicar CSS como objeto, string global e AST simultaneamente.
8. **`estados` é o único nome do bloco**, para Tela e Componente. Suas dimensões têm `inicial` e `opcoes`; as opções declaram o **resultado visual completo** (atributos/classes), em vez de comandos incrementais de adicionar/remover dependentes do histórico.
9. **Uma fonte para cada clique.** O Componente declara o gatilho em `interacoes[]`; a Tela liga a instância desse gatilho ao efeito em seu próprio `interacoes[]`. Uma navegação é `efeito.tipo: "navegar"` com `destinoRef`, uma vez só. **Não criar `navegacao.rotas`, `navegacao.saidas`, `acoes` ou outro segundo cadastro de destinos no contrato-alvo.** O Fluxo deriva as saídas desses eventos.
10. **Props da ocorrência não são duplicadas.** O componente declara `vinculos` para ler `props.*`; a Tela fornece os valores em `composicao[instanciaId].props`. A Tela também pode sobrescrever o **estado inicial** em `composicao[instanciaId].estados`, sem copiar definições das opções do componente.
11. **Código arbitrário não entra no JSON.** Scripts originais são insumos para extração de fatos; expressões de template viram vínculos, coleções ou predicados declarativos tipados. Não aceitar `eval`, funções JavaScript serializadas, `onclick` executável ou fragmentos JS como condições.
12. **Nenhum campo sem fonte é inventado.** A estrutura e o tema visual podem ser completados por regras previsíveis; informação semântica (botão, texto jurídico, destino, permissão, serviço, OAB, pagamento) exige uma fonte autorizada. Lacunas constam **somente no relatório da conversão**, não como IDs falsos no JSON.

### 1.1 Local de armazenamento

A origem única dos contratos fica sob `biblioteca/ui_library/conteudo/`:

```text
biblioteca/ui_library/conteudo/
├── telas/<perfil>/<tela>/documento.json
└── componentes/<perfil-ou-global>/<grupo>/<componente>/documento.json
```

`classificacao.localizacao.caminho` é relativo a `biblioteca/ui_library/conteudo/`. Os módulos Jornada, Fluxo e Protótipo usam os contratos publicados; seus próprios arquivos `data` armazenam apenas conteúdo editorial ou de execução **que lhes pertence**, sem replicar as definições de UI.

### 1.2 Envelope de exportação (não é bloco da Tela)

```json
{
  "schema": "advogadoja.ui.bundle",
  "schemaVersion": "1.0.0",
  "telas": { "advogado.home": { "identidade": { "id": "advogado.home", "tipo": "tela", "nome": "Home" } } },
  "componentes": {}
}
```

Esse fragmento demonstra apenas o envelope, **não** é um contrato de Tela completo. A unidade publicada em `documento.json` é o objeto interno de Tela ou de Componente. O exportador pode agrupá-los em um pacote sem criar uma segunda fonte de verdade.

## 2. Formato obrigatório — Tela

| Caminho | Tipo | Regra |
|---|---|---|
| `identidade` | objeto | `id`, `tipo: "tela"`, `nome`; `namespace` opcional |
| `classificacao` | objeto | `localizacao.caminho`, `escopo: {}`, `jornadas: []` (preencher somente fatos conhecidos) |
| `estrutura.html.raizRef` | string | Chave da **instância raiz** em `composicao` |
| `estrutura.html.composicao` | objeto | Mapa `instanciaId -> {componenteRef,paiRef,alvoRef,ordem,props,estados}` |
| `estrutura.css.tokens` | objeto | Variáveis do contexto de tela; fonte dos valores visuais globais da tela |
| `estrutura.css.regras` | lista | CSS pertencente à tela e não à definição dos componentes |
| `estados` | objeto | Dimensões de estado que pertencem à **tela inteira** |
| `variantes` | lista | Comportamentos visuais condicionais da tela |
| `interacoes` | lista | Liga eventos emitidos pelas instâncias aos efeitos |
| `dados` | objeto | `fontes: []`, `operacoes: []`; somente fontes e operações documentadas |
| `mocks` | objeto | `cenarios: []`; não é estado de produção |

**Uma instância:**

```json
"screen.header": {
  "componenteRef": "ui.header.principal",
  "paiRef": "screen.layout",
  "alvoRef": "layout.header",
  "ordem": 10,
  "props": { "titulo": "AdvogadoJá" },
  "estados": {}
}
```

`alvoRef` deve existir em `componentes[componenteRef da instância pai].estrutura.html.elementos`. A raiz usa `paiRef: null` e `alvoRef: null`. Uma instância filha não aponta diretamente para um elemento de outra instância em `paiRef`. **O campo `slot` não é necessário:** a região é determinada pelo alvo explícito; isso elimina duas fontes que poderiam divergir.

## 3. Formato obrigatório — Componente

| Caminho | Tipo | Regra |
|---|---|---|
| `identidade` | objeto | `id`, `tipo: "componente"`, `nome` |
| `classificacao` | objeto | Mesmo formato usado pela Tela |
| `estrutura.html.raizRef` | string | Chave do elemento raiz em `elementos` |
| `estrutura.html.elementos` | objeto | Mapa `elementoId -> {tag,paiRef,ordem,atributos,texto}` |
| `estrutura.html.vinculos` | lista | Lê `props.*` e preenche texto/atributo de elementos existentes |
| `estrutura.html.colecoes` | lista | Modelos repetíveis associados a listas e chave estável |
| `estrutura.html.condicionais` | lista | Expressões declarativas sem JavaScript |
| `estrutura.css.tokens` | objeto | Apenas tokens de escopo local; não regravar valores globais |
| `estrutura.css.regras` | lista | Regras CSS próprias e escopadas ao componente |
| `estados` | objeto | Dimensões independentes, opções e projeções visuais |
| `variantes` | lista | Variantes próprias (sem clonar a definição) |
| `interacoes` | lista | Elemento que dispara o evento; **sem destino de tela** |
| `dados` | objeto | `fontes: []`, `operacoes: []`, se realmente houver |
| `mocks` | objeto | `cenarios: []` |

**Uma árvore real de DOM, incluindo texto misto:**

```json
"elementos": {
  "intro.p": { "tag": "p", "paiRef": null, "ordem": 10, "atributos": {}, "texto": "" },
  "intro.t1": { "tag": "#text", "paiRef": "intro.p", "ordem": 10, "atributos": {}, "texto": "Olá " },
  "intro.strong": { "tag": "strong", "paiRef": "intro.p", "ordem": 20, "atributos": {}, "texto": "" },
  "intro.t2": { "tag": "#text", "paiRef": "intro.strong", "ordem": 10, "atributos": {}, "texto": "pessoa" },
  "intro.t3": { "tag": "#text", "paiRef": "intro.p", "ordem": 30, "atributos": {}, "texto": "!" }
}
```

Corresponde a `<p>Olá <strong>pessoa</strong>!</p>`. `#text` é **tipo interno do renderizador**, nunca uma tag enviada ao `document.createElement()`. Não concatenar os três textos no pai. Atributos `aria-*`, `data-*`, SVG (inclusive namespace), foco, formulários e relações de acessibilidade são mantidos. Nós de texto só com espaços podem ser ignorados **apenas** se essa perda for comprovadamente neutra; nunca eliminar espaços significativos em `pre`, `code`, `textarea`, SVG `<text>` ou conteúdo misto.

**IDs:** semânticos e estáveis onde houver fonte (`menu.btn_abrir`, `menu.raiz`). Se não houver ID no HTML, o conversor atribui um ID uma única vez e o persiste em seu mapa de importação; não refaz IDs por posição, ordem ou índice. O mapa de importação fica fora dos contratos de UI.

## 4. CSS — formato e propriedade de cada regra

```json
"css": {
  "tokens": { "--aj-cor-primaria": "#10233f" },
  "regras": [
    { "id": "tela.r001", "ordem": 10, "css": ".screen-home{background:var(--aj-cor-primaria)}" },
    { "id": "tela.r002", "ordem": 20, "css": "@media (min-width: 768px){.screen-home{max-width:720px}}" }
  ]
}
```

**Normas CSS:**

1. `regras` é lista, não objeto: seletores podem se repetir deliberadamente; a **cascata depende da ordem**. `ordem` é número estável e crescente dentro do proprietário. O renderizador concatena `css` por `ordem`, em ordem de proprietário: tema compartilhado → layout → componentes → contexto de Tela → ajustes de estado/variante. As prioridades de especificidade e `!important` continuam valendo.
2. Uma entrada de `regras` contém **exatamente uma regra CSS de nível superior**. Regras condicionais como `@media` podem conter as suas regras internas como texto completo na mesma entrada. `@keyframes` também. Parser CSS é obrigatório para extrair e validar; não dividir por `}` ou por regex.
3. CSS de componente deve ser **escopado à sua raiz** (classe estável, atributo `data-ui-component` aplicado pelo renderizador ou `:host` quando o renderizador usar Shadow DOM). Nunca deixar `body`, `html`, `:root`, `button` ou `*` globais soltos num componente.
4. **Tokens globais** vivem no tema/raiz da Tela uma única vez. O componente usa `var(--...)` para consumi-los. Tokens locais podem existir em componente se forem deliberadamente específicos e não redefinirem o tema por acidente.
5. Quando uma declaração `--variavel` for promovida a `tokens`, ela deixa de existir na regra CSS equivalente **naquele mesmo escopo**. Declarações contextuais (`:hover`, `@media`, estados) permanecem nas regras; não forçar extração que mude a cascata.
6. CSS de editor, moldura de celular, modal de inspeção e outras ferramentas fica **fora** do contrato visual do produto. Fontes, imagens, animações e ícones precisam ter dependências resolvidas no manifest de construção, não URLs silenciosamente quebradas.
7. **CSS ausente não vira estilo arbitrário.** Para uma interface renderizável, aplicar o tema padrão da biblioteca e, se comprovadamente necessário, regras mínimas de layout/acessibilidade. Toda regra gerada tem proveniência no relatório externo; o resultado fica `visual_pendente` até confronto com a referência.
8. O renderizador nunca interpreta a propriedade `css` como JavaScript. Validar sintaxe, regras perigosas/externas, at-rules, ordem, responsividade e conflitos de escopo antes da publicação.

**O que pertence a cada nível:** tema compartilhado = cores, tipografia, espaçamento e reset; Layout = estrutura geral, barras e regiões; Componente = aparência e responsividade internas; Tela = ajustes específicos daquela composição. Se a mesma regra visual for usada por várias telas, promover a componente/tema compartilhado em vez de copiá-la.

## 5. Estados e variantes — o mesmo contrato para os dois tipos

Formato único: dimensões nomeadas; em cada dimensão `inicial` e `opcoes`; em cada opção `alvos[]` contém o resultado visual **completo daquele alvo**.

```json
"estados": {
  "painel": {
    "inicial": "fechado",
    "opcoes": {
      "fechado": { "alvos": [{ "tipo": "elemento", "ref": "menu.raiz", "classes": { "aberto": false }, "atributos": { "aria-hidden": "true" } }] },
      "aberto": { "alvos": [{ "tipo": "elemento", "ref": "menu.raiz", "classes": { "aberto": true }, "atributos": { "aria-hidden": "false" } }] }
    }
  }
}
```

A **mesma estrutura** vale para estados da Tela: um alvo pode ser `tipo: "instancia"` com `ref` apontando a uma chave de `composicao`. Para alterar um elemento da instância a partir da Tela, o alvo usa `tipo: "elemento"`, `instanciaRef` e `ref` do elemento. Em componentes, `tipo: "elemento"` referencia seus próprios elementos. `classes` é um mapa booleano; `atributos` informa os valores finais. Isso elimina a ambiguidade das antigas instruções `classesAdicionar`/`classesRemover` e torna o estado independente da transição anterior.

`composicao[instanciaId].estados` contém somente escolhas iniciais que **diferem do padrão** do componente. As opções permanecem em um único lugar, na definição. Ausência de dimensão = usar inicial do Componente. Um estado visual não concede acesso no backend.

**Variante não é um estado duplicado:** `variantes[]` descreve apresentação derivada de um fato/condição tipada (`fonte`, `operador`, `valor`) e tem `alvos[]` no mesmo formato acima; `estados` descreve dimensões mutáveis da interface. Condições admissíveis: `igual`, `diferente`, `existe`, `nao_existe`, `maior`, `menor`, `em`; tipos de valor devem ser conferidos. Combinações complexas e efeitos simultâneos exigem ordenação/regras de precedência aprovadas; sem `eval`.

## 6. Templates, props e coleções

**Vínculo:**

```json
"vinculos": [
  { "id": "cabecalho.v_titulo", "elementoRef": "cabecalho.texto_titulo", "alvo": "texto", "campo": "props.titulo" }
]
```

`props.titulo` existe no objeto `props` da instância, não no componente. O elemento alvo deve existir e, para `alvo: "texto"`, deve ser um `#text`. Vínculos para atributos usam `alvo: "atributo"` e `atributo: "aria-label"` (ou outro atributo validado). Nunca misturar `{{titulo}}` literal com `vinculos` para o mesmo alvo: isso duplicaria a fonte.

**Coleção:**

```json
"colecoes": [
  { "id": "solicitacoes.lista", "containerRef": "lista.raiz", "modeloRef": "lista.item_modelo", "fonte": "props.solicitacoes", "chave": "id" }
]
```

`modeloRef` identifica uma subárvore do mesmo componente que só será instanciada pelos registros da coleção. `chave` é propriedade estável de cada item. Sem chave estável, a coleção fica bloqueada para ações por item; **não usar índice como identidade**. Os novos IDs de instância visual são derivados deterministamente da chave e do `modeloRef`, sem alterar a definição base.

**Condicional:**

```json
"condicionais": [
  { "id": "perfil.mostrar_aviso", "alvoRef": "perfil.aviso", "quando": { "fonte": "props.exibirAviso", "operador": "igual", "valor": true }, "acao": "exibir" }
]
```

`{{#if}}`, `v-if`, `ngIf`, JSX condicional ou JavaScript de template só são convertidos quando sua semântica está comprovada. Se faltar o critério, o conversor mantém a evidência externa e registra impedimento; não apaga silenciosamente o trecho. Campos de template desconhecidos recebem pendência, nunca texto fictício.

## 7. Cliques e efeitos, sem cadastro duplicado de rotas

O Componente conhece **que elemento dispara**. A Tela conhece **o que esse evento faz naquela ocorrência**. Isso mantém os componentes reutilizáveis e deixa o Fluxo/Protótipo capazes de operar.

**Declaração no Componente:**

```json
"interacoes": [
  { "id": "header.abrir_menu", "elementoRef": "header.btn_menu", "evento": "click" }
]
```

**Ligação na Tela:**

```json
"interacoes": [
  {
    "id": "home.abrir_menu",
    "origem": { "instanciaRef": "screen.header", "eventoRef": "header.abrir_menu" },
    "efeito": { "tipo": "definir_estado", "instanciaRef": "screen.menu", "dimensao": "painel", "valor": "aberto" }
  },
  {
    "id": "home.abrir_notificacoes",
    "origem": { "instanciaRef": "screen.header", "eventoRef": "header.notificacoes" },
    "efeito": { "tipo": "navegar", "destinoRef": "advogado.notificacoes" }
  }
]
```

O segundo vínculo acima é **um exemplo didático**, não a declaração de que esse destino existe no catálogo ativo. Só é publicável se `advogado.notificacoes` existir com esse ID e o evento `header.notificacoes` estiver definido no Componente. O modelo também admite `efeito.tipo: "operacao"` com `operacaoRef` resolvendo `dados.operacoes[]`, mas não inventa integração.

**Regras:** não registrar `href` interno como segunda rota divergente; o renderizador gera o atributo acessível quando aplicável a partir do efeito. O Fluxo obtém as saídas percorrendo `tela.interacoes` com `efeito.tipo == "navegar"`; o Protótipo executa **essas mesmas declarações**, sem inferir pelo título do botão. Interações sem efeito comprovado permanecem sem ligação de Tela e constam no relatório; não executam uma rota adivinhada.

## 8. O que fazer quando o HTML/CSS está incompleto

Aplicar a seguinte ordem **sem exceções**:

| Prioridade | Fonte | Pode completar | Não pode completar |
|---|---|---|---|
| 1 | HTML/CSS/template/JS de referência | DOM, texto, regras, eventos observáveis, estrutura | Semântica não declarada |
| 2 | Definição canônica de componente ou tela já aprovada | Header, menu, layout, estilos, estados, IDs existentes | Criar uma nova cópia do componente |
| 3 | Design system canônico | Tipografia, espaçamento, contrastes, tokens, foco, responsividade básica | Botões, novas funcionalidades, rotas, permissões |
| 4 | Decisão explícita da especificação da Tela | Qualquer detalhe coberto pela decisão e registrado na auditoria | Estender a decisão a telas não incluídas |
| 5 | Sem evidência | Apenas estruturas vazias tipadas, relatório de pendência | Placeholder operacional, URL, texto ou API inventados |

A conversão sempre produz `estrutura.html` e `estrutura.css` com **os mesmos campos e tipos**. Se faltou CSS, o objeto `regras: []` é correto estruturalmente; se a Tela precisa de estilos para ser utilizável, aplica-se o **tema compartilhado**, sem copiar os mesmos estilos para cada tela. Se faltou DOM semântico indispensável para reconstruir a Tela, **não criar elementos de negócio**: emitir pendência bloqueante de fidelidade e manter o contrato em rascunho.

Uma imagem/print pode orientar a reconstrução manual do DOM, mas não prova IDs, eventos, dados ou rotas. A reconstrução precisa ter revisão visual e semântica antes de ser homologada.

## 9. Processo oficial: entrada → JSON normalizado → publicação

**Etapa 0 — Congelar as fontes.** Guardar HTML, CSS, scripts, templates, assets, arquivo existente, hashes e origem num registro externo `relatorio_normalizacao.json`. Nunca alterar a referência para fingir que era completa.

**Etapa 1 — Inventariar e classificar.** Identificar Telas lógicas, definições de componentes reutilizáveis, instâncias, templates, estados, CSS de editor versus produto, recursos externos e dependências. Um menu compartilhado é uma definição com várias instâncias, não várias cópias.

**Etapa 2 — Escolher as definições.** Reutilizar primeiro os `componentes` canônicos existentes. Extrair um novo componente quando possuir responsabilidade visual própria ou reutilização verificável; evitar componente para cada `span` ou para toda a tela de uma vez. Nomear os IDs de definição e instância de forma estável.

**Etapa 3 — Montar cada Componente.** Fazer parse HTML real; criar `elementos` e `raizRef` a partir da árvore; gerar nós `#text` para todo texto significativo. Resolver SVG/ARIA/atributos. Converter `{{...}}`, `each`, `if` em `vinculos`, `colecoes`, `condicionais`. Se não houver template, listas vazias são obrigatórias.

**Etapa 4 — Montar CSS por proprietário.** Usar um parser de CSS, separar regras globais/tema, layout, componente e tela. Armazenar cada regra de nível superior com `id`, `ordem`, `css`; mapear tokens somente se isso preservar o resultado da cascata; resolver assets. Completar apenas os estilos necessários pelo design system, com proveniência externa.

**Etapa 5 — Montar a Tela.** Criar instância raiz do Layout e montar componentes filhos por `componenteRef`, `paiRef` **de instância** e `alvoRef` **de elemento do pai**. Guardar `props` na instância, nunca na definição. Escolhas iniciais de estado na instância somente quando divergirem do default.

**Etapa 6 — Declarar estados.** Para cada dimensão, registrar `inicial`, opções e alvos com valores finais de classes/atributos. Testar entrar e sair de cada opção em qualquer ordem. Variantes condicionais são outro bloco, não clones de tela.

**Etapa 7 — Declarar eventos e efeitos.** Cada evento visível pertence a um elemento do Componente; os efeitos contextuais pertencem à Tela. Navegação, alteração de estado e operações têm uma única ligação. Eventos sem efeito comprovado ficam pendentes, não recebem modal artificial.

**Etapa 8 — Validar.** Executar validador de formato/IDs, resolução de referências, ciclos, tipos, ordem do CSS, vínculos/coleções, estados, duplicidades e destinos. Depois renderizar HTML/CSS a partir do JSON e testar largura móvel, desktop, foco, conteúdo e estados. Testes visuais são obrigatórios, não substituídos pelo JSON válido.

**Etapa 9 — Publicar com diff e rollback.** Gerar unidades `documento.json` na biblioteca, pacote de transporte e relatório de evidências, lacunas e hashes. Antes de substituir contratos ativos, **migrar e testar os consumidores** de Jornada, Fluxo e Protótipo; fazer mudança atômica ou por adaptador versionado. Proteger os IDs públicos e preparar reversão.

**Etapa 10 — Reprocessar.** Executar a mesma conversão com os mesmos insumos; o resultado deve ser semanticamente idêntico, inclusive IDs e ordem das regras (idempotência). Diferenças não justificadas impedem publicação.

### 9.1 Estados de saída (só no relatório, nunca na Tela)

- `estrutura_valida`: formato e referências íntegros; ainda não implica fidelidade.
- `visual_pendente`: a aplicação usa tema/fallback ou ainda não foi confrontada com a referência.
- `comportamento_pendente`: um ou mais eventos não têm efeito aprovado.
- `bloqueado`: falta semântica indispensável, há referência quebrada ou a conversão perdeu informação.
- `homologado`: integridade + comportamento exigido + revisão visual aprovados.

## 10. Checklist que bloqueia publicação

- [ ] Todas as Telas e Componentes têm os mesmos oito blocos superiores, nos tipos corretos.
- [ ] Não existe `navegacao.rotas`, `navegacao.saidas`, `estadosVisuais`, `estadoVisual`, `slot` ambíguo ou CSS textual duplicado **no contrato novo**.
- [ ] `identidade.id` corresponde à chave no catálogo; nomes antigos não são aliases tácitos.
- [ ] Cada Tela tem **uma única** instância raiz; todas as instâncias filhas resolvem `paiRef` e `alvoRef`, sem ciclos.
- [ ] Cada Componente tem **uma única** raiz; `#text`, SVG, nós significativos, textos e atributos foram preservados.
- [ ] Cada vínculo/coleção/condicional referencia elemento e campo reais, sem JS executável.
- [ ] CSS tem `tokens: {}` e `regras: []`/lista de regras completas ordenadas; não há conflito de escopo nem perda silenciosa de @rules.
- [ ] Cada dimensão de `estados` tem inicial válido, opções e alvos existentes; toda configuração de instância é admitida pelo componente.
- [ ] Cada `interacoes` de Tela aponta para evento declarado na instância/Componente e tem efeito tipado; cada navegação tem **um** destino válido.
- [ ] Nenhum componente da biblioteca foi clonado dentro de uma Tela; nenhum CSS compartilhado foi copiado por conveniência.
- [ ] HTML/CSS renderizados em mobile/desktop e sob estados alternativos; eventos e retorno foram testados.
- [ ] Fontes faltantes, decisões de fallback e eventuais perdas estão no relatório; dados e permissões não foram inventados.
- [ ] Consumidores de Jornada/Fluxo/Protótipo estão compatíveis com `schemaVersion` antes de ativar o JSON novo.
- [ ] A segunda normalização produz o mesmo JSON sem alterações semânticas.

## 11. Implantação no Projeto 9 — sem quebra silenciosa

**O Projeto 9 V6 atual não implementa integralmente esta norma.** Ela introduz, de propósito, um contrato melhor e único: `paiRef` de instância + `alvoRef`, nós `#text`, CSS `regras[]`, estados declarativos e destinos em `interacoes`. Não publicar parcialmente essas alterações nos `data/documento.json` atuais porque os motores ainda leem campos do formato anterior.

Sequência obrigatória para adoção: (1) adicionar leitor/normalizador v1 isolado; (2) validar contratos de exemplo; (3) adaptar renderização de HTML/CSS/estados; (4) adaptar Fluxo para derivar navegação de `interacoes`; (5) adaptar Protótipo para os mesmos efeitos; (6) converter uma Tela piloto com todas as dependências; (7) executar regressão dos demais consumidores; (8) publicar os contratos versionados e migrar atomica­mente. A identidade de Home **não pode mudar** sem decisão explícita.

**Precedência a partir desta decisão:** esta norma é autoridade para a **estrutura visual dos novos contratos JSON** e para o **armazenamento único de eventos e destinos**. Documentos anteriores continuam úteis como evidência, mas campos incompatíveis não são copiados por obrigação histórica.

---

**Arquivos de apoio da norma:** `EXEMPLO_CONTRATO_UI_CANONICO_V1.json` demonstra uma Home mínima com Layout, Header, Menu e estado local; `VALIDADOR_CONTRATO_UI_V1.py` verifica o conjunto de invariantes estruturais principais. O validador não substitui testes de CSS visual nem autoriza publicação automática.
