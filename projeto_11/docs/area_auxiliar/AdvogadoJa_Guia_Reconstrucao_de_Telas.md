# Guia de reconstrução de telas no novo contrato JSON

**AdvogadoJá Plus — procedimento de trabalho para desenvolvedores e agentes de IA**  
**Referência:** contrato de aplicação `advogadoja`, versão `1.0.0-draft` do pacote `projeto-11_28-11-2026_03-32.zip`.

## 1. Objetivo

Criar ou reconstruir uma tela do AdvogadoJá Plus a partir de um HTML legado, de um JSON anterior, ou de ambos, preservando o design, o conteúdo e as funcionalidades efetivamente definidas e reorganizando-os de acordo com o novo modelo.

O trabalho não é uma tradução de chaves, uma reprodução de uma imagem ou uma simples conversão automática de arquivos antigos. É uma **extração de informações seguida de reconstrução arquitetural**.

O resultado deve ser um JSON completo, com identidade, classificação, estrutura visual, estados, navegação, interações, dados e mocks. A renderização deve ser feita exclusivamente a partir desse JSON e das definições compartilhadas de Layout Base e componentes.

> **Princípio:** o legado informa o que a tela apresenta e faz. O contrato atual determina como essas informações são organizadas. O motor interpreta o contrato; não se acrescentam campos ao modelo apenas para facilitar sua implementação.

## 2. Fontes e ordem de consulta

Antes de criar uma tela, identificar os arquivos efetivamente relacionados a ela e a versão do contrato utilizada pelo projeto. Não partir de um número fixo de telas nem de uma lista histórica como se fosse uma restrição arquitetural.

### 2.1. Referências verificadas neste projeto

No pacote `projeto-11_28-11-2026_03-32.zip`, a raiz é `projeto_11/`.

| Arquivo ou diretório | Finalidade |
|---|---|
| `AGENTS.md` | Orientações de integração, isolamento, preservação e entrega. |
| `dados/editor_documentacao.json` | Definições conceituais do contrato. Consultar as seções Estrutura Macro, Telas e Componentes. |
| `dados/contrato_aplicacao.json` | Coleção atual em uso pelo módulo Telas e Jornadas; contém 14 páginas, um Layout Base e três componentes no pacote consultado. |
| `dados/documentos_telas.json` | Documentação das telas (`docs`), observações (`notes`) e dados auxiliares de apresentação das jornadas (`journeyPresentation`). |
| `legado/contratos_em_desenvolvimento/documentos/telas/*.html` | Laboratórios HTML anteriores; fonte visual e funcional, não implementação a restaurar. |
| `modulos/contratos_em_desenvolvimento/documentos/telas/<pasta>/documento.json` | Documentos individuais do contrato experimental 0.5; fontes de elementos, estilos, eventos, condições e dados anteriores. |
| `modulos/telas_e_jornadas/telas/motor.js` | Interpretador atual de páginas; referência para saber o que a visualização realmente suporta. |
| `modulos/telas_e_jornadas/jornadas/` | Consumidores da classificação e da navegação. |
| `modulos.json` | Registro dos módulos e fontes carregadas pelo Workspace. |

O arquivo `dados/contrato_aplicacao.json` e a documentação conceitual não são a mesma coisa. O primeiro demonstra uma implementação em evolução. O segundo registra também decisões pendentes de formalização. Em caso de divergência, não declarar um detalhe experimental como regra definitiva.

### 2.2. Escolher a origem da reconstrução

| Material disponível | Procedimento |
|---|---|
| Apenas HTML legado | Examinar DOM, CSS, assets, conteúdo, scripts e estados observáveis. Extrair as informações declarativas. Investigar as ligações com outras telas antes de definir navegação. |
| Apenas JSON legado | Examinar estrutura, composição, estados, regras CSS, interações, dados e rotas. Reconstruir a aparência e o comportamento conforme as informações presentes. Se houver interpretador original, renderizar para estabelecer a referência. |
| HTML e JSON legados | Cruzar as fontes. Usar o HTML renderizado para conferir aparência e comportamento; usar o JSON para identificar elementos, dados, condições e relações que não são evidentes visualmente. |
| Material incompleto | Registrar a lacuna. Definir o que for sustentado pela fonte; propor o que faltar separadamente, sem apresentar inferência como informação original. |

O HTML legado pode ser um laboratório que contém o JSON da tela, controles de simulação, um menu de documentação e um interpretador. Nesse caso, identificar a página real dentro do laboratório. Os controles externos ao aplicativo não devem ser confundidos com elementos da tela.

### 2.3. Conflitos entre fontes

- Identificar qual arquivo, estado e contexto está sendo comparado. Duas imagens diferentes podem representar estados da mesma página.
- Não escolher uma rota, regra de negócio ou condição somente por semelhança de nomes.
- Para aparência, usar a versão visual escolhida como referência, inclusive CSS, fontes e dimensões. Para regras funcionais, cruzar JSON, scripts, documentação e observação.
- Registrar a divergência, o valor escolhido, o motivo e a necessidade de aprovação quando pertinente. Não eliminar silenciosamente uma funcionalidade.
- O contrato atual prevalece para a organização do novo JSON. O legado não prevalece sobre as decisões arquiteturais já consolidadas.

## 3. O que preservar e o que reconstruir

| Aspecto | Diretriz |
|---|---|
| Textos, rótulos, imagens, símbolos e ícones | Extrair e preservar. |
| Cores, tipografia, dimensões, espaçamentos e bordas | Extrair e preservar. |
| Hierarquia visual, responsividade e comportamento de rolagem | Reproduzir com `children[]` e CSS. |
| Campos, tipos, máscaras, obrigatoriedades e valores | Extrair os requisitos observados e reconstruir os vínculos. |
| Identificadores técnicos antigos | Usar para rastreabilidade; reaproveitar apenas quando compatíveis e estáveis. |
| Jornadas, subjornadas e posições | Reconstruir segundo o contexto atual. |
| Rotas, entradas, saídas e bifurcações | Reconstruir e cruzar com as páginas existentes. |
| Estados, condições e efeitos | Preservar os significados válidos; reorganizar no novo contrato. |
| Componentes reutilizáveis | Reaproveitar definições atuais ou extrair componentes realmente compartilhados. |
| Dados e mocks | Recriar apenas os necessários ao conteúdo e ao comportamento. |
| Scripts, shell e motor anteriores | Consultar para compreender o funcionamento; não transportar como implementação da nova página. |

### Resultado desejado

```text
HTML/CSS/JS e/ou JSON legado
        │
        ▼
Extração de design + conteúdo + comportamento + relações
        │
        ▼
Documento individual da tela
        │
        ▼
Reconstrução no contrato JSON atual
        │
        ▼
Renderização pelo motor existente
        │
        ▼
Comparação visual + validação funcional + revisão das jornadas
```

Não colocar uma captura de tela em `img`, nem embutir o HTML legado inteiro em um iframe para fingir que o novo JSON representa a página. Fotografias, logotipos e ilustrações que eram recursos da própria interface continuam sendo recursos válidos. A imagem da tela completa, se utilizada, serve somente à comparação de referência.

## 4. Passo a passo

### Passo 1 — Identificar a tela e delimitar seu escopo

Antes da implementação, responder:

- Qual é a finalidade da página? Quem a utiliza? Em que momento da jornada?
- Ela já existe em `pages`? É uma página nova, uma ocorrência adicional de uma página existente ou uma variação de estado?
- Quais são os caminhos de chegada e de saída conhecidos? Há retornos, atalhos, bifurcações ou restrições?
- Quais elementos pertencem à página, ao Layout Base ou a um componente reutilizável?
- Quais comportamentos são reais, simulados, desabilitados ou ainda desconhecidos?

Uma nova apresentação de uma página existente não implica necessariamente uma nova identidade. O estado OAB pendente e o estado OAB validada da Home Advogado, por exemplo, são candidatos a estados da mesma página; isso não autoriza inventar uma estrutura visual que não tenha sido definida. Uma mesma Home pode aparecer ao fim de diversas subjornadas sem ser cadastrada várias vezes.

**Saída:** escopo da página, identificação das fontes e lista de dúvidas ou lacunas.

### Passo 2 — Extrair a referência visual

Quando possível, abrir o HTML ou a visualização do JSON de origem no navegador, sem serviços externos reais. Capturar cada estado disponível, incluindo menu aberto, listas vazias, seleção, avisos e outras variações relevantes. Registrar viewport, zoom, densidade de pixels, fontes disponíveis, estado e dados usados.

Extrair a hierarquia DOM (ou os elementos declarados no JSON), textos, atributos, classes, SVGs, pseudo-elementos, recursos e folhas de estilo. Verificar o CSS computado quando a cascata, herança ou JavaScript alterarem o resultado. Manter as regras originais e seus contextos responsivos; não substituir indiscriminadamente o CSS por estilos computados de uma única resolução.

Conferir, no mínimo:

- Layout: direção, flex/grid, alinhamento, proporções, largura/altura, limites e áreas fixas.
- Aparência: cores, gradientes, sombras, bordas, raios, opacidade, tamanhos de fonte e line-height.
- Comportamento: scroll, elementos sticky/fixed, sobreposição, z-index, modais e áreas de clique.
- Recursos: SVGs, caminhos, fontes, imagens, background-image, object-fit, alt e proporções.
- Responsividade: media queries, orientação, áreas seguras e adaptação a conteúdo longo.

Se o HTML for um contêiner de JSON, extrair o objeto incorporado em vez de copiar o DOM do laboratório. Se houver scripts que criam elementos dinamicamente, investigar o resultado e a regra que os produz. Não incluir esses scripts como parte da nova estrutura.

**Saída:** inventário visual, recursos originais e referência para comparação. Se não for possível executar o legado, registrar que a referência foi obtida por análise estática; não prometer identidade visual testada.

### Passo 3 — Extrair conteúdo, regras e funcionalidades

Inventariar todos os controles e comportamentos, inclusive os que não navegam. Identificar ações do usuário, mudanças de dados, condições de visibilidade, mensagens, validações, transições e efeitos.

Para cada ação, registrar pelo menos:

| Informação | Exemplo de descrição |
|---|---|
| Origem | Botão Enviar instruções |
| Evento | Clique |
| Condição | Conforme validação documentada, se existir |
| Ação ou sequência | Solicitar instruções na simulação; continuar para a redefinição |
| Dados envolvidos | E-mail cadastrado |
| Destino | Página Redefinição de senha, estado inicial |
| Limitação | Nenhum envio real de e-mail comprovado pelo laboratório |

O exemplo corresponde ao comportamento simulado da Recuperação de senha presente no pacote. Não confundir `required`, `minlength` ou outro atributo HTML com garantia de que a lógica de validação está implementada. Não criar autenticação real, cobrança, verificação de OAB, integração externa ou persistência apenas porque a interface menciona essas funcionalidades.

**Saída:** matriz de eventos, ações, condições, dados e destinos, com rastreabilidade às fontes.

### Passo 4 — Escrever o documento individual antes do JSON

Criar uma subseção para a tela em **Design e Conteúdo do Aplicativo → Telas**, ou o Markdown equivalente a ser integrado à documentação. Não substituir outras subseções, não remover documentos anteriores que permanecem válidos e não alterar IDs documentais por acidente.

Modelo de documento:

```markdown
## Nome da tela

### Fontes e finalidade
- Origem visual e funcional, versão e objetivo.

### identity
- ID técnico, tipo e nome legível.

### classification
- Perfil, jornadas, subjornadas e posições.

### structure
- Composição visual, textos, estilos, recursos, componentes e responsividade.

### states
- Estado 0, demais estados, condições e diferenças visuais/funcionais.

### navigation
- Chegadas, saídas, caminhos, condições, retornos e destinos pendentes.

### interactions
- Controles, eventos, ações sequenciais e efeitos.

### data
- Dados consumidos, campos, tipos e referências.

### mocks
- Cenários simulados por estado.

### Pendências e validação
- Divergências, decisões propostas, recursos faltantes e testes previstos.
```

Se a documentação já existir, atualizá-la de maneira incremental. Ela descreve as razões e o comportamento; não deve competir com o JSON como fonte de renderização.

**Saída:** documento individual completo e questões explícitas para revisão.

### Passo 5 — Definir `identity`

A identidade é permanente. Não contém classificação, ordem de jornada, namespace tecnológico ou rota. O nome legível pode mudar; o ID não precisa mudar por isso.

Exemplo existente:

```json
{
  "id": "password_recovery",
  "type": "page",
  "name": "Recuperação de senha"
}
```

O ID deve coincidir com a chave em `pages.password_recovery`. Os tipos de entidade são `page`, `component` e `layout`. Usar campos estruturais em inglês; os textos de interface continuam no idioma do aplicativo.

Em reconstruções de entidades que já existem no contrato atual, manter os IDs e atualizar seus relacionamentos, se necessário. Em uma entidade ainda não criada, conferir se há referências a um ID reservado antes de inventar outro. Um destino pendente deve ser resolvido por seu ID correto, não por um nome de página semelhante.

**Saída:** identidade estável e mapeamento entre IDs da origem e IDs atuais.

### Passo 6 — Definir `classification`

A classificação serve à filtragem, à montagem de árvores e à organização das jornadas. Primeiro definir o percurso lógico de cada perfil; depois atribuir posições. Não deduzir a classificação apenas da pasta, do namespace ou da URL do HTML legado.

O contrato documentado possui `profileRef`, `journeys[]`, `subjourneys[]`, `order` e `pageOrder`. A coleção em uso adota ainda a convenção experimental `occurrenceId`, que permite identificar cada participação da mesma página em um caminho.

Exemplo existente, reduzido a uma das jornadas da Recuperação de senha:

```json
{
  "profileRef": "common",
  "journeys": [
    {
      "id": "client",
      "order": 1,
      "subjourneys": [
        {
          "id": "password_recovery",
          "order": 4,
          "pageOrder": 2,
          "occurrenceId": "client.password_recovery.password_recovery"
        }
      ]
    }
  ]
}
```

O registro completo também inclui a jornada `lawyer`. `common` e o vínculo simultâneo às duas jornadas são convenções da implementação atual para páginas compartilhadas, não uma formalização geral de múltiplos perfis.

Regras de organização:

- `order` da jornada e da subjornada deve ser consistente com as demais páginas do mesmo contexto.
- `pageOrder` é a posição naquela subjornada, não a posição global da página.
- A página pode ocorrer várias vezes no mesmo caminho. Login antes e depois da recuperação mantém o mesmo `identity.id`, com ocorrências diferentes.
- Preservar `occurrenceId` ao mudar uma posição; não gerar IDs a partir do número da ordem. Se a ocorrência não existir ainda, criar ID inequívoco de acordo com a convenção em uso.
- As Homes devem poder aparecer em cada caminho pertinente, sem duplicação da definição em `pages`.
- A sequência de classificação é o espelho organizacional da navegação, mas não torna automaticamente válida uma transição. Retornos, condições e bifurcações precisam ser representados explicitamente.

**Saída:** classificação conferida no conjunto completo das páginas, e não apenas no documento isolado.

### Passo 7 — Identificar Layout Base e componentes reutilizáveis

Usar um único `layouts.base`. O layout controla a área externa e o conteúdo deve adaptar-se a ela. Não criar um layout por tela ou por perfil por simples diferença de conteúdo.

O pacote atual possui um contêiner de conteúdo com ID `page_content`. As regiões conceituais header, menu, alerts, main e footer estão documentadas, mas o mecanismo geral de associação a essas regiões ainda não foi formalizado. Usar a composição vigente e não inventar campos obrigatórios de slots ou regiões.

Verificar os componentes disponíveis antes de recriar trechos de interface. Na coleção consultada existem `header`, `title_header` e `menu_drawer`. Se uma página precisar de header com conteúdo distinto, avaliar o uso de propriedades em vez de uma nova definição visual duplicada. Não modificar um componente compartilhado sem conferir todas as páginas que o utilizam.

A estrutura do componente é um objeto único; a página tem `structure[]`. O componente possui `identity`, `classification`, `properties`, `structure`, `states`, `interactions`, `data` e `mocks`. Sua classificação pode representar escopo; `scope: "global"` é uma convenção observada, ainda experimental.

Propriedades declaradas por ID possuem `id`, `name`, `type`, `required` e `defaultValue`. A instância passa seus valores no mapa `properties`. Exemplo existente de instância de título (IDs do nó ilustrativos):

```json
{
  "id": "title_instance",
  "componentRef": "title_header",
  "properties": {
    "texto": "Início"
  }
}
```

Não renomear propriedades em uso sem ajustar os bindings e todas as instâncias. Tipos e defaults devem refletir valores realmente aceitos; não inventar defaults para campos obrigatórios. Nos componentes do pacote atual, campos obrigatórios aparecem com `defaultValue: null`, o que não significa que null seja um valor válido a fornecer em qualquer propriedade.

**Saída:** lista de componentes reutilizados, componentes novos justificados e composição compatível com o Layout Base. Evitar header/menu duplicados ao encaixar uma tela que já os possui.

### Passo 8 — Reconstruir `structure`

A apresentação da página é uma lista de variantes, cada uma com `id`, `html` e `css`. O objeto `html` é a raiz da árvore. Os filhos são objetos em `children[]` e sua sequência determina a ordem visual.

```text
structure[]
├── id
├── html
│   ├── id
│   ├── tag OU componentRef
│   ├── attributes {}
│   ├── properties {}
│   ├── styleRefs []
│   ├── text / value
│   ├── visibleWhen / repeat / payload
│   └── children [] → mesmo modelo de nó
└── css
    ├── tokens {}
    └── rules []
        ├── id
        ├── selector / declarations
        ├── class (quando aplicável)
        └── block (forma alternativa)
```

#### 8.1. Converter a hierarquia

No HTML original, respeitar a ordem dos filhos do DOM. No JSON anterior, partir da raiz (`raizRef`, ou equivalente) e resolver os pais e a ordem dos elementos e das instâncias de componentes. Unir os irmãos na ordem original, preservando o ponto de inserção de cada componente.

Exemplo de HTML ilustrativo:

```html
<main class="page">
  <h1>Recuperação de senha</h1>
  <button class="button" type="button">Enviar instruções</button>
</main>
```

Exemplo de representação recursiva (didático; não é a tela original completa):

```json
{
  "html": {
    "id": "main",
    "tag": "main",
    "attributes": {"class": "page"},
    "children": [
      {"id": "title", "tag": "h1", "text": "Recuperação de senha"},
      {
        "id": "send_button",
        "tag": "button",
        "attributes": {"class": "button", "type": "button"},
        "styleRefs": [0],
        "text": "Enviar instruções"
      }
    ]
  },
  "css": {
    "tokens": {},
    "rules": [
      {
        "id": 0,
        "selector": ".button",
        "class": "button",
        "declarations": "background: #10233f; color: #fff;"
      }
    ]
  }
}
```

Usar `tag` para elementos nativos e `componentRef` para instâncias. Não transportar `rootRef`, `parentRef`, `order`, `elements[]` ou `composition[]` para a árvore visual atual. Esses campos podem continuar tendo outros significados legítimos em dados de domínio, como a hierarquia de itens do menu; não aplicar uma renomeação global indiscriminada.

Os IDs internos precisam ser únicos e estáveis no escopo da estrutura, incluindo os IDs das instâncias de componentes. Se os IDs de elemento e composição colidirem na fonte, criar mapeamento explícito (por exemplo, `n12` e `c12`, como na coleção atual) e atualizar referências de interação, campo e propriedade. O ID técnico do nó não é automaticamente o atributo HTML `id`; manter o atributo quando usado por seletores, rótulos ou acessibilidade.

Validar que nenhum nó ficou órfão, duplicado ou fora de ordem. Textos intercalados com elementos, SVGs complexos e outras estruturas que o motor não represente fielmente devem ser documentados e resolvidos sem inventar um formato paralelo.

#### 8.2. Preservar CSS e assets

Manter a cascata, a especificidade e a ordem das regras. Preservar seletores, variáveis CSS, fontes, classes, media queries, pseudo-classes, pseudo-elementos e animações pertinentes. Usar `selector` + `declarations` ou `block` quando apropriado; `class` é opcional e `styleRefs` referencia IDs de regras locais.

Não substituir todo o CSS por um conjunto de cores aproximadas. Não misturar os estilos do Workspace, do laboratório e da tela. Conferir efeitos de isolamento do renderizador e a interação entre CSS de página, layout e componentes.

Para uma entrega autocontida, os recursos visuais reais devem estar disponíveis no próprio JSON, por exemplo como `data:` URI em `attributes.src`, em valores de propriedade ou no CSS. Preservar bytes, proporções, transparência, alt e posição. Um SVG nativo pode ser representado pela sua árvore de elementos e atributos. Se um recurso não puder ser recuperado ou uma fonte não estiver disponível, registrar a lacuna; não substituir silenciosamente por uma imagem genérica. Não incorporar recursos sem autorização de uso.

Nunca usar como recurso a captura da tela inteira para substituir os elementos. A estrutura deve continuar editável, acessível, responsiva e interativa.

**Saída:** variantes visuais completas, com todos os recursos necessários e referências de estilo verificadas.

### Passo 9 — Definir `states`

Inventariar os estados que mudam a apresentação ou o comportamento da página. Um botão selecionado, menu aberto ou dado atualizado pode ser uma condição local dentro da mesma estrutura, sem exigir uma nova variante inteira. Criar outra estrutura somente quando a diferença justificar isso.

O estado `id: 0` é padrão, sem campo `default`. Quando nenhum estado específico for aplicável, o estado padrão é a referência. Outros estados possuem condições declarativas. Cada estado da página aponta para uma estrutura e uma configuração de navegação existentes. Estados distintos podem compartilhar essas referências.

Exemplo da Home Cliente (dois dos quatro estados existentes):

```json
[
  {
    "id": 0,
    "name": "Sem plano",
    "conditions": [],
    "structureRef": 0,
    "navigationRef": 0
  },
  {
    "id": 2,
    "name": "Plano ativo",
    "conditions": [
      {"op": "eq", "args": [{"ref": "data.plano"}, 2]}
    ],
    "structureRef": 2,
    "navigationRef": 0
  }
]
```

A fonte também contém os estados Pagamento pendente e Plano vencido. O exemplo não define novas regras comerciais. Evitar condições sobrepostas ou indefinidas. A documentação ainda não encerrou a prioridade entre condições simultaneamente verdadeiras; o interpretador atual usa a primeira correspondência em certos percursos e permite selecionar o estado manualmente. Não tomar isso como garantia de reavaliação automática de qualquer mudança de dado.

Se o componente tiver estados próprios, preservar sua estrutura única e utilizar propriedades ou condições. Não adicionar `navigationRef` ao componente como se ele fosse uma página.

**Saída:** lista de estados, condições, variantes e referência de navegação para cada estado.

### Passo 10 — Definir `data`

Definir somente o que a página ou o componente efetivamente consome. Dados fixos, campos de formulário, dados temporários, registros exibidos e resultados derivados precisam ter origem explícita. Não incluir definição de backend, API, tabelas de banco, credenciais, lógica de autenticação ou persistência externa no contrato.

O escopo de `data` está definido conceitualmente, mas sua forma interna permanece em formalização. Para compatibilidade com o interpretador do pacote atual, utiliza-se a convenção abaixo:

| Campo | Uso observado |
|---|---|
| `values {}` | Dados iniciais acessíveis por referências `data.*`. |
| `local {}` | Valores temporários da página, por referências `local.*`. |
| `fields []` | Vínculos de formulário, por ID, nó visual e `binding`. |
| `sources []` | Coleções locais consumidas, com registros. |
| `operations []` | Operações declarativas sobre os dados; o filtro é o caso implementado no pacote consultado. |

Outros contextos observados são `props.*` para propriedades, `item` para repetição, `registro.*` para operações sobre registros, `derivados.*` para resultados e `evento.*` para payload de evento. Não são permissões para escrever expressões arbitrárias ou JavaScript dentro do JSON.

Exemplo existente de campo consumido na Recuperação de senha:

```json
{
  "values": {"email": ""},
  "local": {},
  "fields": [
    {
      "id": "field_email_n11",
      "nodeRef": "n11",
      "type": "email",
      "required": true,
      "retainDuringPreview": false,
      "binding": "data.email"
    }
  ],
  "sources": [],
  "operations": []
}
```

`retainDuringPreview` corresponde à retenção na sessão do protótipo, não à persistência de produção. Nunca reter senha, token, chave ou dado pessoal real como mock. Nos formulários compartilhados, conferir o caminho dos dados em todas as telas que os leem (por exemplo, `data.cadastro.email`). Definir tipos e valores iniciais coerentes. Não preencher uma lacuna com string vazia se isso alterar o significado da condição.

**Saída:** dados, campos, fontes e operações estritamente necessários, com referências resolvíveis.

### Passo 11 — Reconstruir `navigation`

A navegação espelha os caminhos de `classification`, considerando estados e condições. Definir todas as entradas, saídas, retornos e destinos antes de ligar os controles da tela. Não criar uma segunda coleção independente de rotas na raiz.

Para cada contexto, identificar o ID da ocorrência de origem, evento, estado, condição, destino, rota e efeito necessário. Se houver mais de uma alternativa, manter as condições que distinguem as alternativas. Uma página compartilhada pode usar a mesma configuração de navegação para diferentes contextos.

A implementação `1.0.0-draft` utiliza:

- `navigation[].id`: identificação local da configuração selecionada por `states[].navigationRef`.
- `contexts[]`: `journeyRef`, `subjourneyRef` e `occurrenceRef`, relacionados a `classification`.
- `routes[]`: `id` e `path`, locais à configuração de navegação.
- `entries[]`: página e estado de origem, evento, condições e referência à rota de entrada.
- `exits[]`: ID da saída, evento de origem, página e estado de destino, referência de rota, condições e efeitos; `journeyRefs` pode restringir a saída ao contexto aplicável.

As saídas são alternativas identificadas pelo mesmo `eventRef`. O formato de agrupamento de alternativas do contrato anterior não deve ser copiado automaticamente.

Exemplo de saída existente da Recuperação de senha:

```json
{
  "id": "send_instructions.0",
  "eventRef": "send_instructions",
  "pageRef": "password_reset",
  "stateRef": 0,
  "routeRef": "route_password_reset",
  "conditions": [],
  "effects": [],
  "status": "available"
}
```

A rota correspondente na configuração local é `{"id":"route_password_reset","path":"/redefinir-senha"}`. O `pageRef` aponta para a identidade da página de destino, e não para o nome da pasta.

**Destinos ainda não criados:** manter a referência ao ID conhecido, sem fabricar uma página vazia. No pacote consultado, `available` e `pending` aparecem no JSON, mas o motor de Telas e Jornadas resolve a existência do destino pelo ID no momento da navegação. Se não encontrar, exibe o modal de página não disponível. `status: "disabled"` exclui a alternativa da navegação; não usar esse status como sinônimo de página pendente. Quando a nova página for criada, conferir as entradas e saídas que já a referenciam, preservando seu ID reservado.

**Estados de destino:** um número aponta para o estado declarado da página de destino. `stateRef: null` é uma convenção experimental para seleção por condições; o motor observado utiliza o contexto de dados da origem ao buscar a correspondência, portanto essa transição precisa de teste específico. Não presumir que o estado selecionado será sempre coerente com os dados carregados no destino.

**Coerência entre páginas:** toda saída ativa para página existente precisa ser conferida com as entradas do destino, seus estados e a rota de chegada. Não assumir que o próximo item da classificação seja sempre o destino. Quando a mesma página ocorre duas vezes no caminho, verificar se o contexto de retorno é resolvido corretamente. O vínculo explícito de origem e destino por ocorrência ainda precisa de formalização completa.

**Saída:** navegação coerente com todas as ocorrências e estados; destinos não resolvidos listados como pendências, sem falsas conexões executáveis.

### Passo 12 — Reconstruir `interactions`

Cada interação relaciona a origem visual a um evento e a uma sequência declarativa de ações. O `origin.nodeRef` aponta para um nó nativo ou uma instância de componente. `origin.event` identifica o evento. As condições determinam quando a interação se aplica.

Exemplo existente:

```json
{
  "id": "send_instructions",
  "origin": {"nodeRef": "n12", "event": "click"},
  "conditions": [],
  "actions": [
    {"id": 0, "type": "navigate", "targetRef": "send_instructions"}
  ]
}
```

Na implementação atual, o `targetRef` de `navigate` corresponde ao `eventRef` das saídas da navegação. Portanto, a ação não contém uma URL copiada e não escolhe o destino por conta própria. O caminho e suas alternativas ficam em `navigation`.

| Tipo de ação | Responsabilidade |
|---|---|
| `set` | Alterar um dado declarado. |
| `toggle` | Alternar um valor; o motor atual também trata presença em lista. |
| `navigate` | Acionar a navegação, que resolve as alternativas e o destino. |
| `execute` | Tipo conceitual discutido para acionar operação; não presumir execução genérica implementada. |
| `emit`, `addToList`, `removeFromList` | Extensões observadas no pacote atual para emissão de componentes e manipulação de coleções; ainda dependem da formalização geral. |

Em ações sobre dados, o interpretador atual usa caminhos como `local.menuAberto` em `targetRef`. Esta é uma convenção operacional do draft; a arquitetura geral pretende referências inequívocas às entidades e não exige que se dupliquem os dados para obter um ID. Não adotar uma nova convenção de alvo sem verificar o contrato e o motor.

A ordem das ações importa. Preservar a sequência de validação, alteração de valores, emissão e navegação comprovada. Testar quando a ação seguinte depende do resultado da anterior; o simples fato de existir `actions[]` não prova suporte a operações assíncronas, espera, rollback ou encerramento de sequências complexas. Evitar colocar ações indispensáveis depois de uma navegação que pode finalizar o processamento da sequência.

Componentes podem emitir eventos; a página captura o evento na instância correspondente. O header compartilhado da coleção atual emite `abrir`, por exemplo, e a Home Cliente recebe esse evento para atualizar o dado local do menu. A página determina a navegação, não o componente visual reutilizável.

**Saída:** interações com IDs estáveis, origens resolvidas na variante em que aparecem e ações compatíveis com o modelo vigente.

### Passo 13 — Definir `mocks`

Criar dados simulados que reproduzam estados e cenários necessários. Cada mock possui `id`, `name`, `stateRef` e `data`. Não duplicar a estrutura visual no mock; o estado já referencia a estrutura e a navegação. Cenários distintos podem utilizar o mesmo estado.

Exemplo existente de Login:

```json
[
  {
    "id": 0,
    "name": "Cliente com onboarding concluído",
    "stateRef": 0,
    "data": {"onboardingConcluido": true}
  },
  {
    "id": 1,
    "name": "Cliente com onboarding pendente",
    "stateRef": 0,
    "data": {"onboardingConcluido": false}
  }
]
```

Esses dois cenários exercitam bifurcações, não duas identidades nem necessariamente duas estruturas visuais. Um cenário da Home Cliente com `plano: 2` deve ser coerente com o estado de Plano ativo. Para páginas estáticas sem cenário necessário, `mocks: []` é válido como ausência de itens declarados.

Testar casos vazios, preenchidos, limites, erros e restrições quando essas situações realmente existirem no requisito ou forem propostas explicitamente para cobertura. Nunca usar dados pessoais reais, credenciais ou respostas de serviço copiadas sem tratamento.

**Saída:** cenários de dados coerentes com os estados e caminhos a testar.

### Passo 14 — Montar o JSON completo e verificar integridade

A página deve ser registrada com todos os oito blocos, mesmo quando uma coleção aplicável está vazia. Não entregar apenas o fragmento `structure.html` como se fosse uma tela completa.

```text
schema
schemaVersion
layouts {}
└── base
    ├── identity
    └── structure {}
pages {}
└── <page_id>
    ├── identity
    ├── classification
    ├── structure []
    ├── states []
    ├── navigation []
    ├── interactions []
    ├── data {}
    └── mocks []
components {}
└── <component_id>
    ├── identity
    ├── classification
    ├── properties []
    ├── structure {}
    ├── states []
    ├── interactions []
    ├── data {}
    └── mocks []
```

Na coleção atual, `schema` é `advogadoja` e `schemaVersion` é `1.0.0-draft`. Não inventar uma versão definitiva. Não confundir esse envelope com o schema `advogadoja.documentacao` do editor.

Ao exportar uma página individual, incluir o mesmo Layout Base e os componentes usados direta e transitivamente por suas variantes; o visualizador deve conseguir reconstruir a página sem buscar um HTML legado. O arquivo individual pode referenciar outras páginas que não estão nele; a validação global de navegação exige a coleção completa. Não apagar referências externas para forçar um arquivo individual a ser fechado.

Conferir o JSON com um parser real. Um comentário JSONC, placeholder ou exemplo truncado do Markdown não é um documento de execução. A sintaxe válida é apenas o primeiro requisito; verificar também os IDs, referências e semântica.

**Saída:** JSON de página completo, com dependências e referências verificadas, pronto para a fase de validação (não automaticamente homologado).

### Passo 15 — Integrar ao módulo Telas e Jornadas

Quando a solicitação incluir integração ao projeto, utilizar a arquitetura existente. Não criar um motor ou Workspace paralelo só para uma página.

No pacote consultado, o módulo `telas_e_jornadas` carrega as fontes registradas `contrato_aplicacao` e `documentos_telas`. O menu Telas é gerado a partir das páginas do modelo. O submódulo de Telas interpreta o JSON e oferece as abas Visualização, JSON e Documento da tela.

1. Acrescentar ou atualizar a entidade em `dados/contrato_aplicacao.json`, mantendo as outras páginas, o Layout Base e os componentes válidos. Se a tarefa for exportar somente uma página, não sobrescrever a coleção completa com esse arquivo.
2. Acrescentar ou atualizar `docs[pageId]` e `notes[pageId]` em `dados/documentos_telas.json`, conforme a representação atualmente consumida (texto HTML documental e observações). Manter o Markdown como fonte de revisão, sem introduzir HTML de tela pronta na aba Visualização.
3. Conferir `journeyPresentation` para nomes de apresentação e ocorrências reservadas. Quando uma página pendente passar a existir, verificar se o item reservado não aparece duplicado. A classificação e a navegação da página são a fonte das relações; não transformar os dados auxiliares em uma segunda arquitetura.
4. Atualizar entradas, saídas e referências de outras páginas afetadas, somente quando necessário e com registro da alteração.
5. Recarregar o Workspace pelo servidor HTTP, conforme o procedimento do projeto. Verificar que não há uma versão armazenada em sessão ou navegador ocultando os arquivos atualizados. O modo `file://` não é o procedimento suportado para o Workspace modular.
6. Conferir a página no menu, nos contextos das jornadas, na apresentação e na galeria. Testar o modal de destino ausente quando houver referência pendente.

Os documentos experimentais de `contratos_em_desenvolvimento` e os arquivos arquivados em `legado/` não devem ser modificados, restaurados como fonte ativa ou misturados ao novo formato por padrão. Quando houver necessidade de integração de um módulo novo, consultar o registro, os serviços e o ciclo de vida definidos no projeto; não é parte obrigatória da criação de uma tela.

**Saída:** integração incremental, sem perda de conteúdo das outras telas ou alteração indevida dos motores.

## 5. Correspondência do legado com o modelo novo

Esta tabela ajuda a localizar informações, não define uma transformação mecânica.

| Conceito / campo anterior | Destino no contrato atual |
|---|---|
| `telas` / `identidade` | `pages` / `identity`, com identidade revisada |
| `classificacao` / `jornadas` / `subjornadas` | `classification` / `journeys` / `subjourneys`, reconstruídas e ordenadas |
| `estrutura` | `structure[]` |
| `raizRef`, `elementos`, `composicao`, `paiRef`, `ordem` | Árvore `html` recursiva com `children[]` |
| `componenteRef` / `propriedades` | `componentRef` / `properties`, verificando definições compartilhadas |
| `atributos`, `texto`, `valor` | `attributes`, `text`, `value` |
| `estiloRefs`, `regras`, `seletor`, `declaracoes`, `classe`, `bloco` | `styleRefs`, `rules`, `selector`, `declarations`, `class`, `block` |
| `visivelQuando`, `repetir`, `payload` | `visibleWhen`, `repeat`, `payload` |
| `estados` / `condicoes` | `states` / `conditions`; ID 0 padrão |
| `estruturaRef`, `navegacaoRef` | `structureRef`, `navigationRef` |
| `navegacao`, `rotas`, `entradas`, `saidas` | `navigation`, `routes`, `entries`, `exits`; revisar contextos e alternativas |
| `origem.elementoRef` ou `origem.composicaoRef` | `origin.nodeRef`, sem colisão entre os dois tipos |
| `evento`, `acoes` | `event`, `actions` |
| `definir`, `navegar`, alternância de listas | `set`, `navigate` e ações de coleção conforme suporte vigente |
| `dados`, campos, fontes, operações | `data`, com escopo restrito e referências atualizadas |
| `mocks.cenarios` | `mocks[]`, relacionados por `stateRef` |

Não traduzir automaticamente nomes de classes CSS, textos, caminhos de dados de domínio, atributos HTML, IDs referenciados ou nomes de eventos emitidos por componentes. Alterá-los somente com mapeamento explícito e atualização integral dos consumidores.

## 6. Validação e critérios de aceitação

A reconstrução só deve ser considerada concluída depois de separar a verificação estática, a execução no navegador e a aceitação funcional/visual.

### 6.1. Integridade estrutural

- [ ] O JSON é válido e tem a versão de contrato pretendida.
- [ ] A chave da página coincide com `identity.id`; IDs são únicos no seu escopo.
- [ ] A classificação possui jornadas, subjornadas e posições coerentes com as demais páginas; ocorrências repetidas são distinguíveis.
- [ ] Cada `occurrenceRef` resolve a ocorrência declarada, e os contextos são compatíveis com os estados e configurações de navegação.
- [ ] A árvore é recursiva, sem nós órfãos, ciclos, raízes conflitantes ou elementos duplicados.
- [ ] Os componentes usados existem, suas propriedades são válidas e o Layout Base não duplica áreas da página.
- [ ] Cada regra CSS referenciada existe no escopo correto. Nenhum recurso essencial está faltando.
- [ ] Existe estado 0. Todos os `structureRef` e `navigationRef` resolvem. Condições não dependem de dados inexistentes.
- [ ] Cada `nodeRef`, `eventRef`, `routeRef`, alvo de ação e referência de dado é verificável no contexto correspondente.
- [ ] As saídas para páginas existentes têm estados de destino válidos; entradas e saídas foram cruzadas na coleção completa. Destinos ausentes foram registrados como pendentes.
- [ ] Os mocks referenciam estados existentes e os dados são coerentes com os cenários.
- [ ] Não há HTML de tela pronto, scripts legados, credenciais, APIs, backend ou esquema de banco embutido como substituto do contrato.

### 6.2. Fidelidade visual

Renderizar o novo JSON no motor atual. Comparar a referência e o resultado com o mesmo viewport, zoom, densidade de pixels, estado, dados e fontes. Sugestão de cobertura para revisão: larguras de 360, 390, 768 e 1280 pixels, além dos tamanhos de referência da fonte; essas medidas são recomendações de teste, não dimensões fixas aprovadas para o aplicativo.

- [ ] Textos, imagens e ícones correspondem à referência escolhida.
- [ ] Hierarquia, proporções, posições, cores, fonte, bordas, margens e paddings correspondem.
- [ ] Não há recortes indevidos, fontes substituídas sem aviso, rolagem incorreta ou sobreposição.
- [ ] Estados alternativos, menus, modais, listas e avisos foram comparados, não apenas a tela inicial.
- [ ] A renderização utiliza somente o contrato atual e seus recursos, sem buscar o HTML legado.
- [ ] Diferenças de imagem foram investigadas. Se for possível, comparar screenshots e medidas de caixas DOM; registrar diferenças explicáveis por antialiasing, fontes ou ambiente.

Não declarar equivalência pixel a pixel com base em uma única captura ou em sintaxe JSON válida. Nenhuma tolerância numérica de diferença visual foi estabelecida no projeto consultado; acordar a tolerância antes de tratar esse critério como automático.

### 6.3. Comportamento e jornadas

- [ ] Cada controle visível possui o comportamento esperado, inclusive retorno, campos, botões desabilitados e ações locais.
- [ ] As condições e a ordem das ações foram testadas com os mocks adequados.
- [ ] O mesmo evento seleciona a alternativa correta em diferentes dados, estados e perfis.
- [ ] Entradas e saídas preservam o contexto correto; as páginas que se repetem não convergem indevidamente para uma ocorrência diferente.
- [ ] Estado de destino, dados compartilhados e retenção temporária funcionam conforme o cenário.
- [ ] Destinos pendentes exibem o aviso previsto, sem abrir uma página de outro ID nem simular um serviço real.
- [ ] As três abas apresentam a mesma entidade: Visualização pelo JSON, JSON completo e Documento da tela.
- [ ] O JSON exportado contém a página, o Layout Base e componentes necessários, sem depender de HTML legado.
- [ ] A página aparece corretamente nas jornadas e não provoca regressão em outras páginas que compartilham layout, componentes ou dados.

### 6.4. Registro de conclusão

Registrar separadamente:

| Nível | Evidência esperada |
|---|---|
| Verificação estática | Parser, análise de referências, inventário de nós e recursos. |
| Teste de navegador | Ambiente, tamanhos, estados, interações e erros observados. |
| Aceitação visual | Referências comparadas, diferenças encontradas e aprovação. |
| Aceitação funcional | Percursos, resultados e limitações das simulações. |

Se algum nível não puder ser executado, marcar como não testado. Uma página com estrutura válida, mas com divergência visual ou funcional, ainda não está homologada.

## 7. Exemplo de aplicação do procedimento — Recuperação de senha

Este exemplo utiliza a página `password_recovery` realmente presente na coleção `1.0.0-draft`. Os arquivos de origem são `legado/contratos_em_desenvolvimento/documentos/telas/12_recuperacao.html` e `modulos/contratos_em_desenvolvimento/documentos/telas/12_recuperacao/documento.json`. A reconstrução existente está em `dados/contrato_aplicacao.json`.

| Etapa | Resultado observado no contrato atual |
|---|---|
| Identidade | `password_recovery`, tipo `page`, nome Recuperação de senha |
| Classificação | Perfil comum; Cliente e Advogado; subjornada `password_recovery`, posição 2 em ambas |
| Estrutura | Variante 0, raiz `n0`, header de marca, formulário, ação e link de retorno |
| Estado | `0` Inicial, `structureRef: 0`, `navigationRef: 0` |
| Entrada | `login` pelo evento `recover_password` |
| Campo | `n11`, tipo email, binding `data.email` |
| Ação principal | `n12`, texto Enviar instruções, clique associado a `send_instructions` |
| Saída principal | `password_reset`, estado 0, rota `/redefinir-senha` |
| Retorno | `n13`, link Voltar ao login, evento `back_to_login`, destino `login` |
| Dados | E-mail inicial vazio; não retido durante a simulação |
| Mocks | Array vazio na coleção consultada |

A sequência funcional é:

```text
Login
  └─ recover_password → Recuperação de senha (estado 0)
                            ├─ send_instructions → Redefinição de senha
                            └─ back_to_login → Login
```

O requisito visual é preservar a interface de recuperação, não inventar uma tela de confirmação intermediária. O avanço para redefinição é uma simulação de link; a presença de um campo obrigatório não demonstra envio real de e-mail nem validação real de conta.

Ao reconstruir uma tela semelhante, aplicar o mesmo procedimento, mas não copiar os IDs, estilos, dados e destinos desse exemplo para uma página que desempenhe outro papel.

## 8. Entregáveis

Para cada página criada ou reconstruída, entregar conforme a solicitação:

| Entregável | Conteúdo |
|---|---|
| Documento Markdown individual | Finalidade, fontes, design, conteúdo, classificação, estados, navegação, interações, dados, mocks e pendências. |
| JSON completo da página | Envelope, Layout Base, página com todos os blocos e componentes utilizados; recursos necessários à renderização. |
| Integração incremental, se solicitada | Atualizações das fontes vigentes do Workspace e vínculos afetados. |
| Registro de validação | Testes executados, diferenças, limitações e decisões assumidas. |

Caso o usuário peça apenas o Markdown, entregar somente o Markdown. Caso peça apenas a página, não reexportar o projeto inteiro sem necessidade. Manter rastreabilidade de arquivos alterados, IDs novos ou reaproveitados, pendências e decisões que dependam de revisão.

## 9. Convenções experimentais e limites deste guia

As regras conceituais de identidade, hierarquia recursiva, Layout Base único, classificação contextual, estado padrão 0, propriedades, ações declarativas, dados consumidos e mocks por estado são a base consolidada das discussões. Os campos internos e mecanismos abaixo são convenções da implementação `1.0.0-draft`, observadas no pacote consultado; não são uma nova aprovação definitiva produzida por este guia:

- Identificação de ocorrências com `occurrenceId` e vínculo `navigation[].contexts` / `occurrenceRef`.
- Perfil `common`, classificação de componentes com `scope` e associação a múltiplos perfis.
- Montagem do conteúdo em `page_content` no Layout Base, enquanto a associação completa às regiões conceituais permanece em definição.
- Forma interna de `data`, retenção temporária de campos e execução de operações declarativas.
- Formato de emissão de eventos, ações de coleção, resolução de `targetRef`, representação dos efeitos e alternativas de navegação.
- Seleção de estado de destino com `stateRef: null`, contexto de ocorrências repetidas e prioridade de condições simultâneas.
- Metadados auxiliares de apresentação de jornadas e distinção de saída desabilitada de destino ainda ausente.

Se o material legado exigir algo que o contrato atual ainda não representa, descrever a necessidade, propor a solução e testar sua compatibilidade antes de tratá-la como regra consolidada. Não introduzir lógica de motor ou campos de conveniência sem registrar a decisão. Não resolver ausência de uma página inventando seu visual ou sua funcionalidade.

Este guia foi produzido por inspeção dos arquivos de documentação, do JSON de aplicação, do registro de módulos e do interpretador do pacote de referência. Ele não modifica o projeto, não migra páginas e não representa um novo teste de navegador ou homologação visual.

---

**Regra central:** extrair o que existe, preservar o que é válido, reconstruir os relacionamentos no modelo atual, renderizar pelo JSON e comprovar o resultado. IDs identificam; referências relacionam; hierarquia organiza; arrays ordenam.
