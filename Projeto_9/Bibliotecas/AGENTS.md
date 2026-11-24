# AGENTS.md — AdvogadoJá · Biblioteca V2.1

> **Escopo:** reconstruir e manter as telas de `Bibliotecas/versao2/01` e `Bibliotecas/versao2/02` segundo a estrutura da **`HOME_PROFISSIONAL_ARVORES_CANONICAS_V7_CONSOLIDADA.html`**, com o contrato/motor universal de `Bibliotecas/versao3`. Este arquivo é uma **instrução de execução**, não prova de que a conversão V2.1 já foi realizada ou homologada.

## 1. Autoridade, objetivo e limites

**Objetivo:** consolidar e evoluir, em `versao2_1`, uma biblioteca limpa na mesma hierarquia de pastas da V2, com um JSON canônico por tela e um único motor capaz de gerar os mesmos visuais, variações de estado e ações observáveis dos HTMLs de origem. O **resultado visual e comportamental** deve ser preservado, mas a modelagem antiga não deve ser transportada para o contrato novo.

**Ordem de referência:**

1. **Modelo estrutural e relacional:** `versao3/HOME_PROFISSIONAL_ARVORES_CANONICAS_V7_CONSOLIDADA.html` (JSON da Home, jornadas, rotas, vínculos entre estados, HTML e CSS).
2. **Forma obrigatória dos campos:** `versao3/SCHEMA_TELA_V10.json`, `versao3/CONTRATO_CANONICO_V10.md` e `versao3/RECONCILIACAO_V7_V10.md`.
3. **Execução universal:** `versao3/telas/*/motor.js`, `versao3/componentes/catalogo.json` e `versao3/jornadas.json`.
4. **Evidência visual/funcional por tela:** HTMLs da `versao1` e arquivos da `versao2`. A V2 serve de insumo para auditoria, **não** de esquema normativo.

**Não assumir equivalência por nomes:** por exemplo, `advogado.home_advogado` (V2/01) e `advogado.home` (V2/02 e V3) são IDs distintos até auditoria semântica e aprovação de equivalência. Não criar `aliasMap` no documento canônico.

## 2. Estrutura de pastas obrigatória

Preservar **todas as pastas relativas das bibliotecas `01` e `02`**, inclusive os identificadores `V1_...` e `P9_...`. Cada tela fica isolada em sua pasta atual:

```text
Bibliotecas/
└── versao2_1/
    ├── AGENTS.md
    ├── 01/telas/<mesmas pastas da V2>/<tela>/
    │   ├── index.html
    │   ├── style.css
    │   ├── motor.js
    │   └── documento.json
    ├── 02/telas/<mesmas pastas da V2>/<tela>/
    │   ├── index.html
    │   ├── style.css
    │   ├── motor.js
    │   └── documento.json
    ├── componentes/catalogo.json
    ├── jornadas.json
    ├── SCHEMA_TELA_V10.json
    └── auditoria/
        ├── inventario.json
        ├── relacoes.json
        ├── validacao.json
        └── diferencas_visuais.json
```

- `index.html`: casca de montagem, carregamento do JSON e referência ao motor; não embutir lógica exclusiva da tela.
- `style.css`: estilo técnico mínimo da casca. O CSS visual pertence ao contrato da tela e às definições dos componentes.
- `motor.js`: **mesmo conteúdo e mesmo SHA-256 em todas as pastas**; renderiza por IDs, condições e vínculos, sem `if (idTela === ...)` ou lógica para perfis específicos.
- `documento.json`: **único contrato da tela**, sem HTML/JS funcional duplicado e sem campos antigos excedentes.
- `componentes/catalogo.json`: definições compartilhadas de HTML/CSS, propriedades, estados e eventos dos componentes; cada tela as referencia por `componenteRef`.
- `jornadas.json`: hierarquia de jornadas/subjornadas, usando IDs das rotas e sem cópias de suas regras.
- Os relatórios de auditoria são **externos ao JSON canônico**; podem registrar caminhos antigos, equivalências, dúvidas e justificativas.

## 3. Oito blocos exatos por `documento.json`

O contrato de cada tela deve possuir **exatamente** as chaves abaixo. Não inventar um nono bloco:

| Bloco             | Conteúdo e obrigação                                                                                                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `identidade`      | `id`, `tipo: "tela"`, `namespace`, `nome`, `nomeExibicao`; `descricao` opcional. IDs semânticos estáveis, sem números gerados apenas pela ordem.                             |
| `classificacao`   | `localizacao.caminho` relativo à biblioteca normalizada V2.1, `perfilRef` se aplicável, `jornadaRefs` e `subjornadaRefs` como **referências**, não árvores copiadas.         |
| `estrutura`       | `html.raizRef`, `html.composicao` e `css.tokens`, `css.regras`/`css.folhasRefs`. Preservar composição, ordem, atributos, texto e regras visuais por referências resolvíveis. |
| `estados`         | Dimensões com `id`, `inicial`, `opcoes`; cada opção com `id` e `alvos`; `origemValor` quando conhecida. Não armazenar cópias de rotas/estruturas em cada estado.             |
| `interacoes`      | Eventos e **efeitos locais**: mudança de estado, classes, textos, atributos e ações locais. Não duplicar navegação aqui.                                                     |
| `navegacao.rotas` | Único registro de deslocamentos entre telas: `id`, `origem.instanciaRef`, `origem.eventoRef`, `destinoRef`, `quando` opcional e `status` opcional.                           |
| `dados`           | `fontes`, `operacoes`; dados reais quando conhecidos. Não inventar serviços, permissões ou APIs.                                                                             |
| `mocks.cenarios`  | Simulações com `id`, `nome` e `valores` associados a IDs de estados. Nunca definem autorização nem destino real.                                                             |

Cada instância de `estrutura.html.composicao` possui `id`, `componenteRef`, `paiRef`, `alvoRef`, `ordem`, `props`, e opcionalmente `estados` e `visivelQuando`. O `id` deve ser igual à chave da instância. **Não transportar `elementos` ou `eventos` dentro da instância**: suas definições pertencem à árvore HTML e às interações do componente no catálogo. As `props` guardam valores específicos daquela ocorrência.

Exemplo de forma mínima (ilustrativo, não substitui dados de uma tela):

```json
{
  "identidade": {
    "id": "advogado.home",
    "tipo": "tela",
    "namespace": "advogado",
    "nome": "Início do advogado",
    "nomeExibicao": "Início do advogado"
  },
  "classificacao": {
    "localizacao": {
      "caminho": "02/telas/advogado/home/P9_045_advogado_home/documento.json"
    },
    "perfilRef": "advogado",
    "jornadaRefs": ["advogado"],
    "subjornadaRefs": ["advogado.operacao.oab_pendente"]
  },
  "estrutura": {
    "html": {
      "raizRef": "screen.root",
      "composicao": {
        "screen.root": {
          "id": "screen.root",
          "componenteRef": "advogado.home.layout",
          "paiRef": null,
          "alvoRef": null,
          "ordem": 0,
          "props": {}
        }
      }
    },
    "css": { "tokens": {}, "regras": [] }
  },
  "estados": {},
  "interacoes": [],
  "navegacao": { "rotas": [] },
  "dados": { "fontes": [], "operacoes": [] },
  "mocks": { "cenarios": [] }
}
```

**Atenção:** o exemplo demonstra apenas a **forma**. Um JSON vazio não é uma conversão completa; toda instância, elemento, estado, CSS e rota observável devem ser representados. Os IDs e caminhos concretos precisam corresponder à tela que está sendo convertida.

## 4. Motor universal e relações por ID

O motor deve cumprir sempre esta sequência:

1. Carregar `documento.json` e `componentes/catalogo.json`, validar identidade, referências e campos.
2. Montar a árvore de `estrutura.html.composicao`, resolvendo `componenteRef`, `paiRef`, `alvoRef`, `ordem` e `props`.
3. Aplicar tokens e CSS das definições referenciadas, respeitando a ordem de regras.
4. Inicializar estados de tela e de componente. Avaliar as condições da estrutura e do CSS.
5. Associar eventos observados a `interacoes` ou `navegacao.rotas` pelo par (`instanciaRef`, `eventoRef`).
6. Ao mudar um estado, recalcular **elementos visíveis, efeitos visuais e rotas habilitadas** sem reconstruir outra tela ou duplicar o contrato.
7. No modo de protótipo, permitir a aplicação de mocks como valores temporários, nunca como verdade de produção.

**Uma única linguagem de condição**, usada nos três lugares:

```json
{ "estadoRef": "estado.advogado.home.acessoProfissional", "igual": "enabled" }
```

Composição lógica: `{"todos":[...]}` e `{"qualquer":[...]}`. Usar esta forma em `estrutura.html.composicao[].visivelQuando`, `estrutura.css.regras[].aplicaQuando` e `navegacao.rotas[].quando`. O índice reverso “estado → elementos/rotas” é **calculado**, não gravado de novo.

Os `estados.opcoes[].alvos` podem modificar, por referência, atributos, classes ou textos de instâncias/elementos. Quando dois estados afetam o mesmo alvo, usar a condição `quando` no efeito, conforme contrato, evitando que uma seção oculta sobrescreva outra ativa.

**Exemplo funcional da referência V7:** `acessoProfissional=restricted` mantém o mesmo ID `advogado.home` e disponibiliza a ação de validação OAB; `enabled` disponibiliza as áreas de atuação profissional pertinentes. A área Escritório e suas seções são estados da **mesma tela**, não cópias da Home. Visibilidade no navegador **não** equivale a autorização no backend.

## 5. Rotas, entradas, jornadas e subjornadas

- **Rota** é a transição real entre telas e possui ID descritivo estável; sua origem é o evento observável de uma instância e seu destino é `destinoRef`. `quando` fica **somente** na própria rota.
- **Entrada de uma tela** é derivada das rotas de saída dos outros documentos; não criar lista `entradas` dentro da tela.
- **Jornada** abrange um percurso do usuário. **Subjornada** identifica cada ramo/percurso navegável; percursos superiores agregam os inferiores, com `paiRef`, `filhosRefs` e `rotaRefs` no catálogo. Quando uma ação muda efetivamente o caminho entre telas, há um percurso/subjornada identificável, inclusive para opções de menu.
- Abrir/fechar menu, mudar aba ou seção interna sem trocar de tela é **interação local**. A opção do menu que conduz a outra tela é **rota**, relacionada à subjornada correspondente.
- Bifurcação é **derivada** de rotas concorrentes do mesmo evento cujas condições são mutuamente exclusivas. Não armazenar `bifurcacoes`, `conexoes` ou `condicoes` como novos blocos paralelos.
- Nunca atribuir um percurso de assinatura à rota Sair. Na referência reconciliada, `rota.advogado.home.sair` pertence a Sessão e aponta a `auth.global.sessao.entrar`.
- Diferenciar onboarding concluído e pendente como percursos distintos quando as sequências de telas diferem. Não duplicar telas para isso.
- Destino, evento ou condição sem evidência deve ser marcado **proposto/pendente em relatório externo**, sem fabricar clique ou tela no produto. Se existir um `status` canônico aplicável à rota, pode indicá-lo ali sem criar bloco extra.

## 6. Procedimento obrigatório por tela (V1, V2, V2.1 e V3 → V2.1 consolidada)

1. **Auditar** a pasta V2.1 existente, sua pasta correspondente da V2, a origem visual da V1 e a referência V3 quando houver correspondência comprovada: DOM, textos, imagens, cores, CSS, responsividade, menus, botões, formulários, estados e efeitos.
2. **Identificar** a identidade canônica sem renomear IDs por semelhança. Registrar possíveis equivalências V1/V2/V2.1/V3 em `auditoria/relacoes.json`, não em `aliasMap`.
3. **Inventariar componentes**: compartilhar header, titlebar, drawer e outros elementos quando forem de fato reutilizáveis; manter como definição exclusiva o conteúdo que só pertence à tela. Evitar tanto componentes gigantes quanto a criação artificial de componente para cada `<div>`.
4. **Construir** novo `documento.json` só com os oito blocos aprovados. Transportar conteúdos visuais para elementos/props dos componentes, e não para blocos `elementos`/`eventos` nas instâncias.
5. **Determinar estados** com valores e efeitos rastreáveis; vincular HTML, CSS e navegação aos IDs corretos, preenchendo valores ilustrativos quando necessário e identificando-os como mocks/propostas.
6. **Mapear ações**: clique que navega = rota; efeito dentro da tela = interação. Resolver referências de origem, destino e subjornada; não inventar eventos que o DOM não possui.
7. **Renderizar com o mesmo motor** do modelo V3/V10, incluindo adaptações genéricas já presentes na V2.1 quando comprovadamente corretas. Alterar o motor **uma única vez** caso uma capacidade genérica realmente falte, distribuir a alteração igualmente a todas as telas e documentá-la.
8. **Comparar antes/depois** em tamanhos mobile e desktop e em **cada estado visual relevante**. Corrigir o contrato ou o componente, nunca incluir remendo específico por ID no motor.
9. **Validar e registrar** resultados individuais e agregados; só considerar a tela pronta depois de cumprir os critérios abaixo.
10. **Comparar a versão normalizada com cada fonte** e relatar ganhos, perdas, divergências e evidências; jamais substituir silenciosamente uma tela V2.1 existente por outra menos completa.

## 7. Validações bloqueantes

A V2.1 **não pode ser declarada homologada** sem:

- JSON validado por `SCHEMA_TELA_V10.json`, sem campos extras e com IDs semânticos únicos.
- Todas as instâncias, `paiRef`, `alvoRef`, `componenteRef`, folhas CSS, estados e alvos de efeito resolvidos.
- `jornadaRefs`, `subjornadaRefs`, `paiRef`, `filhosRefs` e `rotaRefs` existentes e coerentes.
- Todas as condições `estadoRef/igual/todos/qualquer` válidas para as opções declaradas.
- **Nenhuma ambiguidade:** para a mesma origem/evento e mesma combinação possível de estados, no máximo uma rota habilitada. Não escolher “a primeira” como solução silenciosa.
- Eventos de navegação com ligação verificável ao componente/DOM, ou pendência explicitamente listada sem simulação enganosa.
- Um `motor.js` único comprovado por hash em **todas** as telas.
- Capturas e diferenças visuais por viewport e estado, com qualquer desvio descrito e aprovado; testar menus, formulários, headers e componentes compartilhados.
- Pastas de V1/V2 e V2.1 preservadas como evidências; mudanças na V2.1 devem ser localizadas e auditáveis, sem sobrescrever V1, V2 ou V3 nem misturar evidência legada no JSON final.

**Classificação do resultado:** `estruturalmente válido`, `renderiza`, `equivalente visualmente`, `equivalente funcionalmente` e `homologado` **não são sinônimos**. Registrar cada aprovação separadamente.

## 8. Proibições de regressão

Não criar `aliasMap`, `variantes` paralelas, `conexoes`, `condicoes`, `bifurcacoes`, `participacoes`, `moduloRef`, `escopo`, `secao`, `conteudo.instancias`, `screen.content.components`, `screenConfig.enginePolicy`, `runtime`, `organization`, `dataRef`, `modal.route-modal` ou `popup.screen-note` como blocos/artefatos de produto. `props.variante` só pode existir se for **propriedade visual real do componente** — nunca um segundo motor de variantes.

Não armazenar uma árvore de jornadas dentro de `classificacao`. Não criar `rota.001` por mera ordem, nem mudar o ID de uma tela porque seu título mudou. Não copiar lógica Flutter/React para `motor.js` ou guardar JavaScript executável no JSON. Não confundir dados simulados, políticas de autorização e visibilidade visual.

**Critério final da V2.1:** o mesmo motor consome todos os JSONs canônicos e reproduz o efeito visual e os estados das fontes, com roteamento e subjornadas coerentes por ID, sem carregar os esquemas antigos nos contratos novos. Toda pendência remanescente fica em auditoria, nunca escondida por um fallback.

---

## 9. Consolidação entre TODAS as versões — regra ampliada

Este `AGENTS.md` **não se limita mais à conversão V2 → V2.1**. Ele é o procedimento para **normalizar, reconciliar e manter** todas as representações encontradas em `Bibliotecas.zip`, com entrega final concentrada em `Bibliotecas/versao2_1`. As versões de origem não são apagadas nem reescritas.

### 9.1. Papéis reais encontrados no acervo

| Fonte                    | Função                                         | O que deve ser aproveitado                                                                                            | O que NÃO se presume                                                                        |
| ------------------------ | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `Bibliotecas/versao1/`   | Evidência de interface original                | HTML, CSS, scripts incorporados, estados observáveis, títulos, menu, formulários e responsividade                     | Não representa obrigatoriamente rotas homologadas nem JSON canônico                         |
| `Bibliotecas/versao2/`   | Conversão intermediária de telas               | Pastas `01/02`, HTML/CSS extraídos, `motor.js`, `documento.json`, anotações de conversão                              | Seus campos de `elementos`/`eventos` embutidos e suas rotas sugeridas não são norma         |
| `Bibliotecas/versao2_1/` | **Alvo existente, NÃO pasta a criar do zero**  | Os 192 conjuntos de tela e seus contratos/componentes já normalizados parcialmente; catálogo, inventário e pendências | Não se considera homologado apenas por existir ou passar no schema                          |
| `Bibliotecas/versao3/`   | Molde e execução canônicos de referência       | Schema V10, contrato V10, motor universal, oito telas, catálogo de componentes e jornadas; Home V7 consolidada        | As oito telas da V3 não substituem automaticamente telas com nomes ou IDs parecidos na V2.1 |
| `Bibliotecas/docs/`      | Documentação e evidência histórica/comparativa | Planos, matrizes, inventários e protótipos anteriores como evidências de auditoria                                    | Documentação histórica não prevalece sobre contratos posteriores confirmados                |

**Caminho efetivo de saída:** `Bibliotecas/versao2_1/`. O nome `versao2.1/` usado em documentos antigos é apenas uma grafia desatualizada, **não deve gerar outra pasta**.

O ZIP analisado contém, segundo os próprios arquivos de auditoria, **192 origens** (`01`: 81 e `02`: 111), **126 IDs de tela distintos**, **1181 definições de componentes** no acervo V2.1, **25215 elementos** e **431 rotas**, das quais **58 são marcadas pendentes**. Essas são contagens do pacote inspecionado, não metas universais nem prova de equivalência/homologação. Recalcular sempre após nova importação.

### 9.2. Ordem de precedência POR RESPONSABILIDADE (não “versão maior sempre ganha”)

1. **Formato do JSON, nomes de blocos e semântica dos IDs:** `versao3/SCHEMA_TELA_V10.json`, `CONTRATO_CANONICO_V10.md`, a Home V7 consolidada e as decisões mais recentes aprovadas.
2. **Motor e mecanismo declarativo:** comportamento genérico validado na V3/V10 e aperfeiçoamentos genéricos testados na V2.1. Não regressar recursos que já funcionam na V2.1; adaptá-los ao contrato, documentando o desvio.
3. **Visual real de cada tela:** a versão visual mais completa **com equivalência demonstrada à intenção original**, comparando V1, V2 e V2.1. A V3 tem autoridade visual somente para suas próprias telas comprovadamente correspondentes.
4. **Estados, cliques e formulários:** prevalece o comportamento demonstrável na fonte real ou decisão expressa. Se houver divergência entre versões sem evidência conclusiva, **não escolher por preferência do agente**: registrar pendência.
5. **Rotas e jornadas:** preservar relações observadas, resolver pelo ID e evento, aproveitar a hierarquia consolidada da Home V7 **apenas onde aplicável**. Todo destino inferido de nomenclatura permanece proposto.
6. **Dados e integração:** não promover um mock, uma URL, um comentário ou uma seta editorial a contrato de API, permissão ou lógica de produção.

Uma versão pode ser superior em **apresentação** e inferior em **comportamento**. Confrontar por atributo e por estado; nunca copiar o documento inteiro de uma versão para outra sem rastrear as perdas.

### 9.3. Matriz de comparação obrigatória para cada tela

Para cada pasta de tela da V2.1, localizar e registrar, quando existirem:

- caminho relativo e hash das origens V1, V2, V2.1 e V3;
- identidade real, IDs duplicados, nome, perfil e localização;
- estrutura DOM, texto, acessibilidade, mídia, imagens, ícones, CSS e breakpoint;
- componentes compartilhados, slots, instâncias, propriedades e elementos de origem;
- dimensões de estado, opções, estado inicial, dependências e efeitos;
- eventos efetivamente observados: clique, change, submit, retorno, loading, validação e mensagens;
- ações locais, rotas de saída, entradas derivadas, destinos externos e status de confirmação;
- jornadas, subjornadas, ramos, retornos e relação com outras telas;
- diferenças de tela e comportamento entre cada versão: `igual`, `completo`, `parcial`, `divergente`, `ausente` ou `pendente`;
- decisão documentada por campo/componente/estado/rota: fonte escolhida, justificativa e efeito da alteração.

Colocar essa matriz e a proveniência em arquivos de **auditoria**, preferencialmente `auditoria/matriz_fontes.json`, `auditoria/decisoes.json` e `auditoria/pendencias.json`. Esses arquivos são índices técnicos externos, **não** novos blocos de `documento.json`. A ausência de fonte não deve ser disfarçada como origem validada.

### 9.4. Duplicidade de IDs e representações

O inventário da V2.1 já aponta vários IDs repetidos em `01` e `02`. Isso não autoriza renomear, excluir ou mesclar por nome. Uma mesma identidade pode ter implementações alternativas, snapshots ou diferenças reais.

**Procedimento para cada grupo duplicado:**

1. Localizar todas as ocorrências, pastas, versões e pontos do fluxo que as referenciam.
2. Comparar conteúdo, estados, eventos, visuais e semântica. Verificar se representam a mesma tela, estados diferentes da mesma tela ou telas realmente distintas.
3. Se forem equivalentes, escolher **uma única definição canônica** de identidade, documentar o critério e manter as outras ocorrências como fontes de auditoria ou instâncias/referências conforme o caso.
4. Se não forem equivalentes, **não forçar um ID único**. Sinalizar conflito para decisão; preservar as duas fontes e não publicar catálogo ambíguo.
5. Atualizar as referências explicitamente, em lote transacional validado; nunca resolver duplicidades em tempo de execução com `aliasMap`, correspondência textual ou seleção da “primeira ocorrência”.

Exemplos existentes no inventário: `advogado.assinatura.checkout`, `auth.sessao.entrar` e `cliente.home_cliente`. **Esses exemplos não estão previamente reconciliados.**

### 9.5. Modelo V7/V10: uma fonte e três projeções

O alvo mantém exatamente os oito blocos de tela descritos na seção 3. O editor pode exibir **três leituras calculadas** do MESMO `documento.json`:

```text
Tela / Jornada = identidade + classificacao + estrutura + estados + interacoes + dados
Fluxo          = Tela/Jornada + navegacao.rotas (e jornada/subjornadas por referencias)
Prototipo      = Fluxo + mocks.cenarios
```

Não gerar três arquivos JSON independentes, nem manter versões derivadas como fontes alternativas. **O motor é intérprete genérico do JSON**, e o editor deve suportar leitura e edição sem perder os blocos que uma projeção não utiliza.

A hierarquia de jornadas é mantida **fora das telas** e ligada por `jornadaRefs`, `subjornadaRefs` e `rotaRefs`; entradas são derivadas das rotas de saída de outras telas. Não copiar regras para árvores de subjornada. `navegacao.rotas[].quando`, `estrutura.html.composicao[].visivelQuando` e `estrutura.css.regras[].aplicaQuando` usam a mesma linguagem de condições.

**Não reproduzir uma Home para cada cenário.** A Home profissional com OAB pendente e habilitada, a área Escritório e as subseções é uma tela com estados; o login e o onboarding têm contratos próprios e geram entradas derivadas para a Home quando seus destinos são conhecidos.

### 9.6. Normalização de componentes sem perda

A V2.1 existente informa que moveu elementos e eventos dos JSONs de tela para `componentes/catalogo.json` e criou componentes específicos por instância para evitar misturar visual de telas distintas. **Não deduplicar automaticamente os 1149 novos componentes** por semelhança de nome ou estrutura superficial.

Deduplicar um componente somente quando a equivalência de estrutura, estilos, eventos, atributos, slots, estados e parâmetros foi demonstrada, e quando alterar um compartilhado para todos os consumidores é desejável. Caso contrário, manter definição específica bem identificada. Um `componenteRef` sempre resolve no catálogo e o par `paiRef`/`alvoRef` sempre aponta um local real de montagem. A aparência responsiva deve sobreviver à extração do HTML para definições JSON.

**Separação de responsabilidade:**

- `documento.json` escolhe e ordena instâncias, props, estados e condições da tela;
- `componentes/catalogo.json` define elementos, vínculos de props, estilos, estados e eventos dos componentes;
- `motor.js` interpreta genericamente; não guarda comportamento de negócio por perfil;
- `style.css` de tela serve de casca técnica; os estilos visuais canônicos são resolvidos do contrato;
- relatórios externos guardam original, diferenças e decisões; nada disso retorna como campo legado da tela.

### 9.7. Verificação de rotas: não confundir “tem destino” com “tem clique”

A V2.1 registra 431 rotas e 58 pendentes no pacote inspecionado. É obrigatório verificar **se o evento existe e pode ser disparado**, não apenas se o destino está no catálogo. Em especial, `eventoRef: null` ou status `pendente_vinculo_evento` não são eventos executáveis. Verificar também `data-*`, elementos interativos, origem da instância, comportamento do menu e formulário.

Verificar conflitos por (`tela`, `instanciaRef`, `eventoRef`) **para todas as combinações possíveis dos estados citados nas condições**. Para cada combinação, no máximo uma rota habilitada. Quando duas saídas representam escolhas independentes do usuário, precisam ter **eventos distintos**, não condições inventadas para tornar a colisão invisível.

O exemplo da Home V7/V10 reconciliada: a ação **Sair** deve ser classificada em **Sessão**, não em **Assinaturas**, e o destino `auth.global.sessao.entrar` precisa ser conferido com a definição correspondente antes da consolidação. Não presumir que isso redefine todas as rotas de logout da biblioteca.

### 9.8. Auditoria automatizada e validação visual/funcional

O agente deverá implantar ou executar verificações em camadas, diferenciando resultado por evidência:

| Camada        | Verificação mínima                                                                            | Status permitido                            |
| ------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Arquivos      | Cada tela tem HTML/CSS/motor/JSON; não perde diretórios da V2.1                               | `completo`/`pendente`                       |
| Esquema       | `SCHEMA_TELA_V10.json` valida os oito blocos, sem propriedades excedentes                     | `válido`/`inválido`                         |
| Referências   | Identidades, instâncias, elementos, componentes, estados, folhas, rotas e jornadas resolvidos | `válido`/`pendente`/`inválido`              |
| Motor         | Mesmo hash de `motor.js` em todas as telas; sem ramificação por ID de tela                    | `conforme`/`não conforme`                   |
| Renderização  | Abrir a página em servidor HTTP; JS sem exceções; DOM esperado                                | `renderiza`/`falha`                         |
| Visual        | Capturas por largura e estado, comparadas com a fonte original                                | `equivalente`/`divergente`/`não verificado` |
| Comportamento | Click, change, submit, menus, overlays, estados, back e rotas condicionais testados           | `equivalente`/`divergente`/`não verificado` |
| Jornadas      | Grafo derivado das rotas sem destino ambíguo; refs e hierarquia corretas                      | `conforme`/`pendente`                       |
| Integrações   | Auth/banco/APIs reais só são aceitos por evidência de integração e testes                     | `confirmado`/`mock`/`pendente`              |

Gerar relatórios agregados e **por tela**. Um JSON que valida e renderiza **não** comprova equivalência pixel a pixel ou funcional. Ausência de erro JavaScript não significa que cliques, eventos ou fluxos estejam corretos.

### 9.9. Controle de alterações e regressão

Antes de alterar qualquer tela:

1. Registrar hash dos quatro arquivos atuais e das fontes da tela.
2. Criar o inventário das dependências afetadas (`componenteRef`, estado, rota, jornada e consumidores compartilhados).
3. Identificar se a mudança é **global** (motor/schema/componente compartilhado) ou **local** (contrato/props/estilo da tela). Não usar uma modificação global para corrigir caso particular.
4. Aplicar somente transformações com semântica comprovada. Preservar fonte original em sua versão e registrar diffs do alvo.
5. Validar schema, refs e rotas; executar regressão das telas consumidoras de componente/motor alterado.
6. Comparar estado e visual em pelo menos mobile e largura expandida, além dos estados relevantes; registrar divergência e decidir conscientemente.
7. Atualizar `inventario`, `decisoes`, `pendencias`, `validacao` e relatório de diff. Não alterar status para homologado sem evidência real.

Se a normalização produzir perda de botão, texto, acessibilidade, estilo ou estado, **reverter a transformação específica**, corrigir o mapeamento e repetir os testes. Nunca descartar dados de origem silenciosamente porque não cabem no schema novo: documentar no inventário/auditoria externa e marcar pendência até decisão de modelagem.

### 9.10. Entrega e definição de pronto

A versão final deve conter **uma biblioteca V2.1 normalizada e auditável**, com a árvore `01/02` mantida e a convenção de quatro arquivos por tela; um catálogo de componentes coerente; esquema e jornadas compartilhados; motor único; e documentos externos de migração/pendências.

Antes de informar ao usuário que “todas as versões foram normalizadas”, apresentar um quadro verificável com:

- telas de origem catalogadas por versão e número de telas únicas após resolução de duplicidades;
- telas convertidas e não convertidas, sem omitir arquivos ou entradas por conflito;
- rotas confirmadas, propostas, pendentes e conflitantes;
- estados e interações validados e ainda não testados;
- componentes compartilhados e específicos, com suas dependências;
- quantidade de arquivos com esquema válido, motor idêntico e renderização testada;
- diferenças visuais/funcionais aprovadas e não aprovadas;
- exceções pendentes e decisões que exigem aprovação humana.

**Um agente seguindo este documento sabe como fazer e como provar a normalização. O documento isolado não prova que a normalização foi executada.**
