# AdvogadoJá — Direção Canônica do Workspace, Módulos, Telas e Contratos JSON

**Versão da especificação:** 6.1 · **Data:** 12/11/2026 · **Status:** direção funcional e técnica para homologação progressiva.

> **Escopo:** definição do Workspace único, módulos, interfaces, contratos JSON, relações, interoperabilidade e critérios de aceitação. Este documento registra o padrão pretendido. Exemplos e propostas permanecem identificados como tal; não equivalem a comportamento homologado.

**Linha de trabalho:** Workspace único → módulos e subitens → interfaces e funcionalidades → dados e relações explícitas → contrato JSON → motores. **Regra:** requisitos reais orientam os contratos; os motores não determinam, por inferência, os dados ou a experiência do produto.

## Sumário

1. **Direção geral e fundamentos**
2. **Workspace e organização geral**
3. **Módulos — definições e funcionalidades**
4. **Contrato JSON canônico**
5. **Relações, composição e comportamento**
6. **Dados, interoperabilidade e evolução**
7. **Padrões visuais e experiência de uso**
8. **Validação, testes e homologação**
9. **Casos de aplicação e evidências**

> **Leitura dos status:** **[DECIDIDO]** ou **[DIREÇÃO DEFINIDA]** expressa diretriz; **[OBSERVADO]** é evidência de exemplo; **[PROPOSTO]** exige análise; **[PENDENTE]** é lacuna; **[HOMOLOGADO]** depende de comprovação. As descrições de telas de exemplo não são automaticamente regras de produção.

---

## 1. Direção geral e fundamentos

### 1.1. Finalidade e visão do projeto

**[DIREÇÃO DEFINIDA]** O ambiente AdvogadoJá é um **Workspace modular único** para compreender, organizar e definir o produto. A prioridade de agora é **a experiência de trabalho e as funcionalidades de cada módulo**: o que aparece, o que o usuário consegue fazer, quais informações precisa consultar e quais alterações registra. **Motor, adaptadores, migração de arquivos e otimizações técnicas vêm depois.**

#### Decisões de direção

1. **Um index central, um padrão de navegação.** O `index` oferece cabeçalho e menu lateral comuns, uma área de conteúdo ampla e os controles gerais indispensáveis. Não replica menus globais dentro das ferramentas.
2. **Módulos agrupam funções relacionadas.** Banco, Contrato JSON/Catálogo, Fluxo, Jornadas, Protótipos, Mapa de Interações, Documentos Base e Contato são domínios de trabalho. _Campos utilizados_ e _visualização/edição funcional_ são subitens do mesmo módulo quando dizem respeito ao mesmo domínio; não viram aplicativos autônomos por conveniência.
3. **Os módulos podem ter quantos subitens precisarem.** Jornadas e roteiros de apresentação podem ser acrescentados dinamicamente; seu número **não é fixado no HTML nem em uma lista rígida do menu**.
4. **Um shell visual consistente, conteúdo próprio.** Cabeçalho, menu, espaçamentos estruturais e comportamento de navegação são comuns; árvore de dados, galeria, fluxograma, simulador e editor de banco conservam interfaces adequadas às suas funções.
5. **Eliminar duplicidade, não capacidade.** Cabeçalhos e barras de navegação internos que repetem o shell serão integrados, retirados ou realocados, mas **nenhuma ação essencial poderá desaparecer**. Uma tela principal deve receber o máximo possível de espaço útil.
6. **Identidades e relações explícitas.** O sistema lê IDs, participação em jornadas, sequência, referência de telas e relações declaradas. Não deve deduzir vínculos de nomes, posições visuais ou semelhanças.
7. **Padrão orientado a requisitos.** A experiência aprovada determina a organização, o visual e as funções. Caminhos de arquivos, cabeçalhos, CSS, estrutura de motores e decisões de implementação não substituem requisitos de produto.
8. **A especificação fica separada dos dados.** Diretrizes de UX, políticas gerais de organização, decisões, imagens do editor e evidências de homologação pertencem à documentação. O JSON de tela precisa conter apenas definições efetivamente necessárias para montagem e funcionamento, sem redundância ornamental.

**Ordem obrigatória do trabalho:** **(1)** definir funcionalidades de tela e de módulo → **(2)** posicionar ações, controles, estados e visualizações → **(3)** estabelecer os dados/IDs/relacionamentos necessários → **(4)** revisar os JSONs → **(5)** adaptar ou construir os motores.

**[PENDENTE]** Validar o menu final e a composição responsiva com imagens de referência. Capturas e anexos visuais serão incorporados posteriormente, sem bloquear esta direção estrutural.

### 1.2. Objetivos e prioridades

**Prioridade de trabalho:** definir o que cada módulo e tela devem mostrar e permitir fazer; depois definir dados, IDs, vínculos, contratos e, por último, motores. O detalhamento original está em **1.1** e **1.7**.

### 1.3. Princípios canônicos

1. **[DIREÇÃO DEFINIDA] Definir funcionalidades antes do motor.** Uma especificação descreve o resultado esperado, não a forma atual como o código funciona.
2. **[DECIDIDO] Identidades explícitas e estáveis.** Tela, componente, instância, relação, estado, ação, cenário e participação podem precisar de ID próprio quando forem referenciados ou editados.
3. **[DECIDIDO] Sem dedução pelo motor.** Classificação, jornada, ordem, destino, condições e efeitos não devem ser inferidos do título, posição visual ou índice do array.
4. **[DECIDIDO] Contrato de tela suficiente para renderização isolada.** As definições visuais necessárias à tela devem acompanhar seu JSON ou pacote de exportação aprovado; catálogos editoriais podem facilitar reuso sem criar dependências ocultas.
5. **[PROPOSTO] Reutilização por identidade.** Mesmo componente lógico mantém ID; personalizações e estados variam por instância/ocorrência.
6. **[DECIDIDO] Uma visualização por finalidade.** Consultar campos e operar o Fluxo são subitens distintos do mesmo módulo. O mesmo se aplica à consulta e ao trabalho em Jornada ou Protótipo.
7. **[PROPOSTO] Troca explícita de dados.** Exportar/importar ou atualizar o conjunto de contratos carregados deve preservar informações não editadas; nenhuma sincronização oculta é presumida.
8. **[PROPOSTO] Evolução compatível.** Alterar campos e versões exige caso concreto, validação de referências e registro de impacto; não manter redundância sem justificativa funcional.
9. **[DECIDIDO] Separar dados e direção.** Políticas gerais, trilhas de auditoria, estrutura do Workspace, layout do editor e regras de integração são documentados fora do JSON de tela quando não necessários à execução.
10. **[DECIDIDO] Área principal como prioridade visual.** Navegação global única, controles contextuais e painéis recolhíveis substituem cabeçalhos e sidebars concorrentes quando suas funções forem preservadas.

### 1.4. Critérios de decisão e precedência

Esta seção estabelece o modo de tomar decisões sobre telas, JSONs e interfaces de todos os módulos. A documentação deve responder **o que queremos construir e usar**, antes de prescrever código.

**Status de afirmação:**

- **[DIREÇÃO DEFINIDA] / [DECIDIDO]**: objetivo e regra afirmados para o produto.
- **[OBSERVADO]**: comportamento ou estrutura verificados em um caso concreto; não implica homologação como regra geral.
- **[PROPOSTO]**: detalhamento para análise e homologação.
- **[PENDENTE]**: decisão ou verificação em aberto.
- **[HOMOLOGADO]**: revisão aceita, com caso de uso e evidência funcional/visual.

**Critério de precedência:** decisões funcionais e visuais explicitamente aprovadas → requisitos confirmados de telas e módulos → dados e IDs declarados que atendam às necessidades → evidências de testes. Nenhum detalhe de implementação altera a especificação sem decisão registrada.

**Regra:** não migrar ou reestruturar contratos para acomodar uma implementação, enquanto ainda estamos definindo as funcionalidades. Ajustar o documento e registrar pendências primeiro.

### 1.5. Status das definições (decidido, proposto, pendente e homologado)

A terminologia de status deve ser aplicada a toda a especificação: **[DECIDIDO]**, **[OBSERVADO]**, **[PROPOSTO]**, **[PENDENTE]** e **[HOMOLOGADO]**. As definições e a regra de precedência constam em **1.4**.

### 1.6. Padrão de chegada desejado

> **O index define onde cada funcionalidade aparece; o módulo define o que o usuário consegue fazer; o JSON define os dados e vínculos explícitos necessários; o motor apenas executa a leitura e as operações previstas.**
>
> O Workspace usa menu padronizado com módulos e subitens expansíveis. Mapa de Interações, Documentos Base e Contato também pertencem ao registro modular, com suas fichas específicas ainda a detalhar. Fluxo tem **Campos utilizados** e **Visualização do fluxo**. Jornadas tem **Campos utilizados** e **Visualização de jornadas**, com jornadas dinâmicas. Protótipos tem **Campos utilizados** e o laboratório interativo, incluindo modos e roteiros. Banco e Contrato/Catálogo terão subitens definidos por suas finalidades reais. Nenhuma ferramenta mantém cabeçalhos ou menus redundantes que concorram com a navegação global.
>
> A modelagem de telas, classificação, comportamento e bancos deve ser explícita. A estrutura final do JSON e o trabalho dos motores são consequências dessas decisões, não seus determinantes.

### 1.7. Sequência de trabalho — funcionalidades antes dos motores

**Fase 1 — Direção do Workspace.** Aprovar composição do `index`, menu e padrão de inserção de módulos, com a hierarquia módulo → subitem → item dinâmico e ações contextuais.

**Fase 2 — Finalidades por módulo.** Especificar o que Fluxo, Jornadas, Protótipos, Banco, Contrato/Catálogo, Mapa de Interações, Documentos Base e Contato precisam **mostrar e permitir fazer** em cada subitem. Produzir imagens e fichas de UX para homologar sem exigir implementação.

**Fase 3 — Telas e relações.** Revisar jornadas reais; incluir, retirar, combinar e alterar telas. Declarar IDs, componentes, estados, ações, participação, conexões e vínculos com dados, sem os deduzir.

**Fase 4 — Revisão do JSON.** Para cada requisito, confirmar onde a informação mora. Preservar o que é necessário, consolidar redundâncias e separar política de documentação.

**Fase 5 — Contratos de módulos e aceitação.** Definir subitens dinâmicos, importação/exportação, relatórios e funcionamento observável; testar integridade de dados e fidelidade visual.

**Fase 6 — Motores.** Só então implementar ou refatorar carregadores, renderizadores, editores e integrações para entregar o fluxo definido.

**Regra:** não autorizar migração massiva nem fixar campos definitivos antes de um conjunto representativo de telas e módulos ter sido homologado.

---

## 2. Workspace e organização geral

### 2.1. Arquitetura do Workspace único

O Workspace é o ambiente único que concentra a navegação e exibe, em uma área principal compartilhada, as interfaces específicas de cada módulo. O funcionamento do index está detalhado em **2.3**, e as responsabilidades de cada camada em **2.2**.

### 2.2. Os três níveis de interface: Workspace, módulo e produto

| Dimensão                | Onde vive a definição                                                 | Regra                                                                                 |
| ----------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Telas do produto**    | JSON/contrato por tela e componentes nela utilizados                  | Identidades explícitas, visual e comportamento necessários à montagem                 |
| **Interface do módulo** | Ficha funcional/visual própria (Jornadas, Fluxo, Protótipo, Banco...) | Layout e funções específicos do trabalho; preservar o que for homologado              |
| **Workspace/index**     | Seções iniciais desta Direção e ficha do shell global                 | Menu e controles globais, registro de módulos, área de conteúdo e subitens            |
| **Motor/adaptador**     | Implementação técnica substituível                                    | Deve atender aos contratos e interfaces definidos; não decidir produto por inferência |

**[DIREÇÃO DEFINIDA]** Uma atualização no front-end do editor não obriga a alterar os JSONs das telas, e vice-versa. O index não distribui estilos de produto nem impõe a todas as ferramentas um mesmo cabeçalho interno.

#### Como usar imagens sem tratá-las como código obrigatório

- **[REFERÊNCIA VISUAL]** imagem com identificação do módulo, modo, data, viewport e região que mostra.
- **[OBJETIVO DE UX]** ação e comportamento desejados em cada região.
- **[PROPOSTO]** layout ainda sujeito a refinamento.
- **[HOMOLOGADO]** comportamento e estrutura conferidos em caso de aceitação.

**[PENDENTE]** Incorporar capturas ou links de arquivos visuais por módulo e também do menu do Workspace. Não afirmar medidas exatas com base apenas na imagem.

### 2.3. Index principal e suas responsabilidades

#### Estrutura de primeiro nível

```text
INDEX / WORKSPACE
├── Cabeçalho global
│   ├── Marca e identificação do ambiente
│   └── Controles globais realmente comuns
├── Navegação lateral global
│   ├── Pesquisa de módulos/subitens (quando útil)
│   ├── Banco
│   ├── Contrato JSON / Catálogo
│   ├── Fluxo
│   ├── Jornadas
│   ├── Protótipos
│   ├── Mapa de Interações
│   ├── Documentos Base
│   └── Contato
└── Área principal (ocupa todo o espaço disponível)
    ├── Contexto mínimo: módulo e item ativos
    ├── Controles contextuais do item ativo
    └── Conteúdo exclusivo do item ativo
        ├── consulta de campos / árvore de JSON; OU
        ├── visualização do Fluxo; OU
        ├── galeria de Jornadas; OU
        ├── simulador de Protótipo; OU
        ├── visão do Banco / Contrato; OU
        ├── inspeção do Mapa de Interações; OU
        ├── índice e páginas de Documentos Base; OU
        └── interface do módulo Contato
```

**[DIREÇÃO DEFINIDA]** O index é o ponto de entrada único da navegação: registra os módulos e hospeda a área selecionada. Um módulo não recria a sidebar do Workspace nem seus controles de localização. A troca de subitem não deve desmontar dados não salvos sem aviso.

| Região                    | Responsabilidade                                                             | Limite de conteúdo                                                                      |
| ------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Header global**         | Marca, contexto do ambiente e poucas ações globais comuns                    | Não replicar barras completas específicas do Fluxo, Jornada ou Protótipo                |
| **Menu lateral**          | Módulos e subitens hierárquicos, expansão/recolhimento e seleção atual       | Não hospedar formulários extensos, JSONs completos ou ferramentas específicas           |
| **Identificação da área** | Título breve e caminho de navegação opcional e derivado do estado atual      | Não guardar breadcrumb redundante dentro de cada JSON de tela                           |
| **Barra contextual**      | Ações do subitem selecionado: importar/exportar, visualizar, editar etc.     | O conjunto depende da funcionalidade real; não impor uma toolbar única de três botões   |
| **Conteúdo principal**    | Galeria, fluxograma, tabela/árvore, protótipo ou outra experiência da tarefa | Deve ganhar área útil; não competir com painéis permanentemente abertos sem necessidade |
| **Painéis temporários**   | Filtros avançados, detalhes, cenários, inspeção, propriedades e confirmações | Usar drawer/modal/aba interna quando economizar espaço sem ocultar ações essenciais     |

#### Layout e experiência

- **Desktop:** sidebar persistente e recolhível, conteúdo com largura fluida; rolagem local para listas grandes e galeria quando necessária.
- **Tablet/mobile:** menu recolhível acionado por controle visível; a área de trabalho passa a ocupar a largura disponível, mantendo acesso a ações críticas.
- **Acessibilidade:** foco por teclado, rótulos, seleção ativa, contraste, scroll visível e navegação sem dependência de hover.
- **Visual geral:** manter uma linguagem comum para shell, mas não forçar que Fluxo, Banco e Protótipo tenham o mesmo arranjo interno.
- **Imagens futuras:** anexar uma captura do index, uma do menu expandido/recolhido, uma de módulo com dois subitens e uma de módulo com lista dinâmica; registrar tamanho do viewport e qual estado ilustram.

**[PENDENTE]** Cores, medidas exatas e proporções finais serão fixadas quando houver material visual homologado. Valores não homologados de CSS não são regras desta direção.

### 2.4. Header, sidebar e área principal

O **cabeçalho**, a **navegação lateral** e a **área principal** pertencem ao index. Toolbars e painéis internos devem ser específicos da tarefa, sem criar outro menu global. Ver tabela de regiões em **2.3**.

### 2.5. Menu global — módulos e subitens

**[DIREÇÃO DEFINIDA]** O menu possui **três níveis conceituais**: **módulo → funcionalidade/subitem → item dinâmico**, quando aplicável. O terceiro nível não deve ser acrescentado a todos os módulos artificialmente.

```text
MÓDULOS
├── Banco
│   ├── Campos utilizados
│   └── Estrutura / modelagem do banco [finalidade a detalhar]
├── Contrato JSON / Catálogo
│   ├── Campos utilizados [se fizer sentido]
│   └── Inspeção / organização de contratos [a detalhar]
├── Fluxo
│   ├── Campos utilizados       ← árvore/relatório do contrato
│   └── Visualização do fluxo   ← caminhos, conexões e prévias
├── Jornadas
│   ├── Campos utilizados       ← consulta documental
│   └── Visualização de jornadas
│       ├── Advogado            ← identificada na fonte de jornadas
│       └── [outra jornada]     ← surge quando existir no conjunto carregado
├── Protótipos
│   ├── Campos utilizados
│   └── Protótipo interativo
│       ├── Navegação livre
│       └── Apresentação de jornadas
│           └── [roteiros existentes]  ← exibidos a partir de seus IDs
├── Mapa de Interações
│   └── [subitens a especificar] ← eventos, operações, efeitos e referências
├── Documentos Base
│   ├── Índice
│   └── [documentos/subitens]    ← páginas HTML autocontidas identificadas
└── Contato
    └── [subitens a especificar]
```

_Esquema conceitual, não lista completa de funcionalidades homologadas. Os nomes que dependem de definição futura permanecem indicados como pendentes._

#### Regras do menu

1. **Registro explícito:** cada módulo possui um ID técnico estável, título, ícone opcional, ordem de exibição, subitens e referência para o conteúdo. A presença no menu resulta do registro, não de um HTML duplicado por módulo.
2. **Subitens com propósito:** _Campos utilizados_ exibe os campos e dados do JSON relevantes àquela funcionalidade; _visualização_ oferece a interface real de trabalho (não é outro relatório).
3. **Listas dinâmicas:** Jornadas, subjornadas, roteiros e itens equivalentes são criados a partir de **identidades explícitas do conjunto importado/carregado**, não por regex do nome do arquivo, adivinhação do motor ou botões de menu escritos manualmente.
4. **Seleção independente de apresentação:** abrir ou fechar um grupo não modifica o JSON da tela; inserir/alterar uma participação de jornada modifica seu dado canônico quando essa operação for oferecida.
5. **Estado claro:** módulo e subitem ativos visíveis; contagens opcionais, somente quando derivadas de dados reais. Estados vazio, carregando, erro e item ausente têm tratamento explícito.
6. **Sem duplicação de menus:** navegação interna do módulo só permanece quando for **navegação da própria funcionalidade**. Seletores técnicos, ferramentas e filtros que não são rotas devem ficar na barra contextual ou painel de trabalho.
7. **Escalabilidade:** dezenas de jornadas ou roteiros não podem criar dezenas de módulos; usar árvore recolhível, pesquisa local e, se necessário, paginação/virtualização.
8. **Destino e autorização:** seleção de menu referencia um subitem/rota de Workspace declarado. Permissão real é uma regra própria e não deve ser deduzida da ocultação visual do item.

**Regra específica:** o Fluxo reúne **consulta de campos e editor/visualização conectiva**. Jornadas reúne **consulta de campos e galeria por jornada**. Protótipos reúne **consulta de campos e simulador**, com os modos internos apresentados conforme sua natureza. A padronização é da **navegação externa**, não da aparência de todas essas áreas.

### 2.6. Subitens e listas dinâmicas

Os subitens pertencem ao módulo. Jornadas, subjornadas e roteiros podem formar listas dinâmicas identificadas por IDs explícitos, sem multiplicar módulos ou adivinhar itens pelos nomes dos arquivos. Ver as regras completas em **2.5**.

### 2.7. Cadastro e integração de novos módulos

#### O que precisa ser definido antes de inserir um módulo

1. **Identidade e finalidade:** ID estável, nome visível, descrição curta, problema que resolve e quais informações deve mostrar.
2. **Subitens:** cada subitem com ID, nome, objetivo, operações permitidas, tipo de conteúdo e ordem. Determinar se existe uma lista dinâmica derivada dos dados.
3. **Visão de trabalho:** componentes visuais, filtros, controles, estados vazio/erro/carregamento e modo responsivo; o formato é ditado pela funcionalidade, sem ser condicionado por um motor específico.
4. **Entradas:** contratos JSON lidos, IDs/referências necessários, eventuais anexos e limites de importação.
5. **Saídas:** o que é apenas visualização, o que altera os JSONs, o que deve ser exportado e como diferenças/erros são mostrados.
6. **Integração com o shell:** ações de toolbar que aparecem no conteúdo, painéis temporários, título contextual e comportamento de voltar; não inserir novo cabeçalho global.
7. **Critérios de aceitação:** navegação, atualização de itens dinâmicos, uso independente, importação/exportação e ausência de regressão visual/funcional.

#### Registro conceitual (não é schema de dados de tela)

```json
{
  "id": "modulo.fluxo",
  "titulo": "Fluxo",
  "ordem": 30,
  "subitens": [
    {
      "id": "fluxo.campos",
      "titulo": "Campos utilizados",
      "view": "consulta-campos"
    },
    {
      "id": "fluxo.visualizacao",
      "titulo": "Visualização do fluxo",
      "view": "editor-fluxo"
    }
  ]
}
```

**Esse exemplo é somente a ilustração da declaração de menu/index.** Não cria campos obrigatórios nos contratos JSON de telas e não define um motor. A implementação pode usar outro formato, desde que a identificação e os vínculos permaneçam explícitos.

#### O que acontece ao incluir/atualizar

- Ao registrar um módulo, o index apresenta um único item de primeiro nível e seus subitens, segundo a ordem definida.
- Ao carregar novas jornadas/roteiros, o menu atualiza **apenas os itens dinâmicos relacionados**, sem mexer na definição dos outros módulos.
- Ao selecionar um subitem, a área principal mostra a interface correspondente e sua barra contextual, sem sobreposição de navegação duplicada.
- Ao trocar de módulo, alterações ainda não exportadas exigem tratamento explícito. Os módulos no mesmo Workspace podem consumir o mesmo conjunto carregado, mas **não** se presume persistência fora dele.
- Se um subitem não tiver dados, mostrar estado vazio com orientação útil, não fabricar exemplos como se fossem registros reais.

**[PENDENTE]** Escolher se o cadastro de módulos viverá em manifesto, configuração do front-end ou JSON específico do Workspace. **Não misturar esse cadastro com o contrato de uma tela do produto.**

### 2.8. Organização lógica de pastas e arquivos

**[DIREÇÃO DE ESTRUTURA — CONCEITUAL]** A organização física deverá distinguir: **(a) index/shell**, **(b) interfaces e definições de cada módulo**, **(c) dados canônicos de telas/componentes**, **(d) índices derivados**, **(e) documentação e evidências visuais**. Uma mesma informação não deve ter cópias independentes apenas para servir ao menu.

```text
ambiente/
├── index                  ← entrada do Workspace e área central
├── workspace/             ← header, sidebar, navegação global, registro modular
│   └── registro-modulos   ← declara módulos, subitens e fontes de listas dinâmicas
├── modulos/
│   ├── fluxo/             ← consulta de campos + visualização/edição de conexões
│   ├── jornadas/          ← consulta de campos + galeria/lista dinâmica de jornadas
│   ├── prototipos/        ← consulta de campos + simulação/roteiros
│   ├── banco/             ← consulta de campos + modelagem de dados
│   ├── contrato-catalogo/ ← inspeção/organização dos contratos
│   ├── mapa-interacoes/   ← ações, eventos, operações, estados e efeitos
│   ├── documentos-base/   ← índice e conteúdos/documentos associados
│   └── contato/           ← interface e conteúdo a especificar
├── dados/
│   ├── telas/             ← JSONs de telas, identidade estável
│   ├── componentes/       ← definições editoriais, quando houver
│   └── indices/           ← projeções e listas derivadas (não fonte autoritativa)
├── recursos-visuais/      ← imagens ou recursos realmente compartilhados
└── documentos/            ← direção, fichas, decisões, capturas e homologação
```

_Esta árvore apresenta **papéis e responsabilidades**, não nomes de pastas obrigatórios nem uma proposta de motor. A forma de empacotamento e integração (HTML autocontido, aplicação web, componentes etc.) deve respeitar as funções e a independência dos módulos._

#### Regras de organização

1. **Index não armazena telas:** apenas registra quais módulos/subitens existem, como são selecionados e onde o conteúdo será exibido.
2. **Módulo não redefine o shell:** pode ter componentes e controles internos próprios, mas não copia o header global ou mantém uma segunda sidebar universal.
3. **Dados não são layout do editor:** contratos de telas e componentes não carregam configuração de menu do Workspace, posicionamento de toolbars do editor ou textos de direção.
4. **Índices são derivados:** uma jornada nova aparece no menu pela referência identificada nos dados carregados, não porque alguém acrescentou à mão outro elemento `li` no HTML do index.
5. **Autocontenção quando útil:** cada interface modular pode funcionar isoladamente com o HTML, CSS e JavaScript necessários, inclusive offline quando esse for o requisito. O index integra essas interfaces sem exigir duplicação do shell ou das fontes canônicas.
6. **Se houver `estrutura` e `estilos`:** manter apenas responsabilidades distintas. CSS pode ficar fisicamente no mesmo contrato ou dividido por escopo, conforme a necessidade aprovada; não adicionar dois campos que gravem a mesma regra.
7. **Imagens de direção:** associar futuras capturas às fichas do Workspace/módulo, com legenda e estado observado, **não ao JSON da tela como metadado genérico**.

**[PENDENTE]** Definir nomes reais, extensões e o registro de módulos definitivo quando a experiência de navegação e os requisitos de integração estiverem homologados.

### 2.9. Responsividade e navegação

A experiência deve funcionar em desktop, tablet e mobile, com menu recolhível, foco/teclado, rolagem adequada e acesso aos controles críticos. Os critérios e as decisões pendentes estão em **2.3**, **7.6** e **8.7**.

---

## 3. Módulos — definições e funcionalidades

### 3.1. Padrão de documentação dos módulos

A ficha de módulo **complementa** a ficha do Workspace e não a duplica. Ela precisa ser curta na direção geral e detalhada somente onde há uma capacidade real a preservar.

```text
FICHA DO MÓDULO
- ID, nome, finalidade, estado de decisão
- Registro no index: ordem, ícone, subitens e itens dinâmicos
- Para cada subitem: tarefa do usuário, conteúdo, controles e operações
- Dados: IDs/JSONs lidos, dados editados e relações preservadas
- Contextos: dentro do Workspace e, se necessário, página isolada

FRONT-END
- Área principal e seus componentes: árvores, cartões, galeria, grafo, simulador
- Toolbar contextual e ações; nenhum header/sidebar duplicado
- Filtros, detalhes, propriedades e painéis temporários
- Estados: vazio, carregando, selecionado, erro, confirmação
- Responsividade, acessibilidade, rolagem, comportamento modal

ACEITAÇÃO
- Evidências da visualização (imagem/captura quando disponível)
- Teste de navegação no menu e atualização de listas dinâmicas
- Teste dos controles que alteram dados e exportação/importação
- Registro de pendências, divergências e homologação
```

**Identidades distintas:** `ui.modulo.fluxo` é identificação de interface/editor; o ID da tela na chave raiz `<telaId>` é outro domínio. Não misturar estilos e eventos de um botão do editor com os de um botão renderizado dentro da tela.

### 3.2. Contrato JSON / Catálogo

#### Contrato JSON / Catálogo

**Finalidade:** localizar e inspecionar definições de telas/componentes, identidade, classificação, estrutura, estados e relações do JSON. Os subitens finais devem seguir as tarefas reais: inspeção de campos, organização de contratos, validação e edição, se essas operações forem aprovadas.

#### Workspace / index

**[DIREÇÃO DEFINIDA]** Shell comum com navegação lateral dinâmica por registros de módulo. Os módulos expõem subitens, e os grupos derivados de dados (por exemplo, Jornadas e roteiros de apresentação) ampliam a árvore no nível correto. O conteúdo ativo ocupa a área principal; ferramentas próprias não criam uma nova navegação global.

O `index` deve controlar: seleção, histórico/breadcrumb derivado quando útil, estados do menu, responsividade, apresentação e troca de módulo. Não deve reinterpretar dados de telas para descobrir qual funcionalidade existe: isso vem do registro do módulo e dos IDs declarados no conjunto carregado.

**[PENDENTE]** Regras de edição/validação do catálogo, interface final do módulo Banco e formato físico do registro dos módulos.

### 3.3. Jornadas

#### Jornadas — função e limites esperados

**Objetivo funcional [DECIDIDO]:** organizar, selecionar e apresentar as telas de uma jornada/subjornada em uma sequência documental clara, com prévia visual fiel. **Não confundir sequência editorial da Jornada com conexões editáveis do Fluxo.**

**Leitura principal [PROPOSTO]:** `identidade`, `classificacao`, `estrutura`, `componentes`, `estilos`, `estados`/`variantes` pertinentes e as informações de agrupamento/participação necessárias em `navegacao`. O módulo não precisa executar todas as ações de navegação do contrato.

**Interações permitidas na prévia [DECIDIDO]:** mudanças **dentro da mesma tela**, como abrir/fechar menu ou acordeão, alternar aba interna, mostrar itens, revelar informações e mudar estado visual local, quando tais comportamentos estiverem declarados.

**Interações não executadas na prévia [DECIDIDO]:** sair para outra tela, chamar rotas reais, persistir operações de negócio, realizar pagamentos ou mudar o fluxo real. Um item de menu pode aparecer e responder visualmente, mas seu destino não é acionado na Jornada.

**Edição de dados [PROPOSTO]:** se a Jornada permitir editar ordem, participação, classificação ou atributos de tela, deve modificar o contrato e exportar os dados alterados. Uma prévia que muda visualmente sem atualizar o JSON **não conta como edição do contrato**.

**[PENDENTE]** Especificar e testar as interações internas autorizadas, sem dependência de um bloqueio ou comportamento específico de implementação prévia.

#### Ficha funcional + visual — Jornada

**ID ilustrativo da ficha:** `ui.modulo.jornadas`  
**Status:** funcionalidade desejada confirmada; organização no Workspace definida; interação local ainda não homologada.

##### Objetivo e limites

**[OBJETIVO DECLARADO]** Organizar visualmente telas por Jornada/Subjornada, exibi-las em ordem para inspeção, alternar Mobile/Desktop, examinar detalhes do contrato e importar/exportar os contratos. **Interações locais** podem abrir/fechar menus, abas internas ou estados visuais, mas a Jornada **não percorre destinos externos entre telas** nem executa regras reais de negócio.

##### Contrato JSON da Jornada

- **Lê:** `identidade`, `classificacao` (jornada, subjornada e ordem), `estrutura`, `componentes`, `estilos` e estados/variantes/interações locais quando cabíveis.
- **Não precisa executar:** caminhos externos de `navegacao`, operações reais em `dados`, mocks, persistência de produção.
- **Preserva integralmente ao exportar:** blocos não consumidos do contrato, inclusive navegação e mocks.
- **Edits permitidos conforme objetivo:** inserir/retirar/reordenar participações de Jornada; importar/substituir JSONs. Não tomar a ordem da galeria como prova de conexão do Fluxo.

##### Composição da interface de Jornadas

| Região/ID proposto           | Apresentação e ordem                                                            | Ações / cuidados                                                       |
| ---------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `ui.jornadas.contextual`     | Barra de ações do subitem Jornadas (sem segundo header global)                  | Comandos específicos visíveis na área de trabalho                      |
| `ui.jornadas.tabs`           | Navegação entre Jornadas                                                        | Montagem pelos IDs existentes; não hardcode de perfis                  |
| `ui.jornadas.subtabs`        | Subjornadas em abas/chips                                                       | Classificação do contrato controla nome/ordem                          |
| `ui.jornadas.filters`        | Busca por ID/nome, sequência/grade/individual, Mobile/Desktop, anterior/próxima | Controles não alteram identidade da tela                               |
| `ui.jornadas.gallery`        | Galeria horizontal, com cartões de tela e molduras                              | Prévia fiel, overflow horizontal; não substituir por fluxo de conexões |
| `ui.jornadas.screen-details` | Modal de detalhes com conteúdo do contrato e exportação de tela                 | Mostrar JSON original/canônico, sem descartar campos                   |
| `ui.jornadas.import-dialog`  | Importação com análise e confirmação                                            | Avisar divergências de ID e schema antes de substituir em sessão       |

**[OBJETIVO]** O módulo Jornadas precisa de seleção dinâmica de jornada, filtros, galeria, prévias, modal de detalhes e importação/exportação. Somente interações internas declaradas são permitidas na prévia.

##### Requisitos visuais que não podem mudar silenciosamente

- Hierarquia: menu do Workspace → título/resumo → subabas → filtros → galeria → ações/detalhes.
- Prévia Mobile e Desktop ocupam molduras com dimensões e proporções distintas.
- A rolagem da galeria não deve quebrar o shell nem comprimir as molduras indevidamente.
- Componentes de uma tela (menu, header, card) têm CSS isolado dos cartões e ferramentas do editor.
- Cada estado local permitido deve ter evidências: antes/depois de abrir menu, alternar aba etc.
- Toda variação em `padding`, `gap`, proporção de prévia ou posição dos controles exige validação visual em cada viewport e cenário afetados.

##### Testes de aceitação da Jornada

`JRN-01` selecionar Jornada e subjornada; `JRN-02` buscar por nome/ID; `JRN-03` alternar Mobile/Desktop e sequência/grade; `JRN-04` abrir detalhes e ver contrato completo; `JRN-05` exportar/importar sem perda; `JRN-06` abrir/fechar menu **local** sem trocar de tela (capacidade a implementar); `JRN-07` usar via Workspace e standalone; `JRN-08` conferir responsividade e estilos da moldura.

### 3.4. Fluxo

#### Fluxo — função e limites esperados

**Objetivo funcional [DECIDIDO]:** mostrar telas e **conexões editáveis entre elas** (incluindo bifurcações, estados e condições). O Fluxo não é apenas uma apresentação linear parecida com Jornada.

**Leitura principal [PROPOSTO]:** prévia visual via `estrutura` + `componentes` + `estilos`, contexto via `identidade`/`classificacao`, e grafo por `navegacao`, `acoes`, `interacoes`, `estados` e `variantes` quando necessário.

**Operações essenciais [PROPOSTO]:** criar, remover e alterar vínculos, origem/destino, condição, bifurcação e prioridade **somente se representáveis pelo contrato aprovado**; preservar IDs de relações estáveis; mostrar ligações válidas/pendentes; exportar o JSON que reflita as mudanças.

**Separação obrigatória:** posição visual de um cartão de tela no editor não é, por padrão, uma relação de navegação. Mover o cartão no canvas não deve reescrever a semântica do grafo, salvo se uma operação específica definir isso.

**Prévia:** a tela aparece para identificação visual e contextualização; isso não obriga a mostrar todo o JSON ao lado nem a transformar o editor numa Jornada.

**Importação/exportação:** ao reconectar `A → B` para `A → C`, atualizar o(s) vínculo(s) identificado(s) dentro do JSON pertinente à tela/participação. Ao importar depois na Jornada, esta continua sendo uma sequência editorial e pode exibir os novos dados compartilhados **sem se converter em um editor gráfico de fluxo**.

**[PENDENTE]** Precisam de decisão específica as representações de condições compostas, múltiplas ocorrências da mesma tela, transições de estados internos e organização multi-JSON de relações; não fixar a estrutura do contrato por detalhes de implementação do editor.

#### Ficha funcional + visual — Fluxo

**ID ilustrativo da ficha:** `ui.modulo.fluxo`  
**Status:** finalidade e linha visual confirmadas pelas imagens e descrição; composição visual e comportamentos a homologar no Workspace.

##### Objetivo e limites

**[OBJETIVO DECLARADO]** Apresentar **caminhos e conexões editáveis** (inclusive bifurcações, mudanças de estado e notificações) por meio de cartões organizados como um fluxograma/árvore de fluxo. O editor pode mostrar uma **prévia** da tela associada ao nó, sem reproduzir a galeria sequencial de Jornadas. A tela é uma prévia de leitura, com eventual interatividade local segura; **não é navegação real do protótipo**.

##### O que o Fluxo lê, edita e preserva

| Operação                                     | Campos principais                                                                | Resultado esperado                                                |
| -------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Montar cartão/nó visual                      | `identidade`, `classificacao`, `estados` e relações identificadas                | Mostrar nó com rótulos/estados adequados                          |
| Montar prévia da tela                        | `estrutura`, `componentes`, `estilos`, estados locais                            | Renderizar mesma tela da Jornada, independente do layout do Fluxo |
| Adicionar/editar relação                     | `navegacao`, `acoes`, `interacoes`, `estados` conforme o vínculo                 | Alteração aparece no diagrama e no JSON exportado                 |
| Adicionar notificação ou transição de estado | IDs da ação/estado/efeito e seus vínculos já definidos ou criados explicitamente | Registro verificável, sem inferir regra de produção               |
| Importar/exportar                            | Contrato completo, identidade, versão aplicável e campos desconhecidos ao editor | Round-trip sem descartar CSS/mocks                                |

**[DECIDIDO]** Desfazer/reordenar não troca IDs. Alterar o grafo é operação sobre dados do contrato, não reescrita da imagem da tela. Reordenar cartões visualmente deve ser separado de alterar destinos lógicos quando não forem a mesma operação.

##### Composição de front-end do Fluxo (registrar por região)

| Região/ID proposto      | Organização visual a homologar                                   | Funcionalidade                                                                          |
| ----------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `ui.fluxo.toolbar`      | Ações contextuais dentro da área do Fluxo; não é o header global | Importar/exportar, desfazer/refazer e operações do grafo, conforme necessidade aprovada |
| `ui.fluxo.canvas`       | Área central ampla com rolagem e conectores                      | Mostrar grafo/conexões, não galeria de Jornadas                                         |
| `ui.fluxo.heading`      | Título e breve contexto acima dos cartões                        | Contextualizar fluxo e seleção atual                                                    |
| `ui.fluxo.node.screen`  | Cartão de tela no grafo; dimensões finais pendentes              | Abrir prévia, editar relações e ações previstas                                         |
| `ui.fluxo.node.branch`  | Containers de bifurcação/agrupamento com ligações visuais        | Mostrar alternativas e relações, estados e condições                                    |
| `ui.fluxo.insert`       | Ação contextual entre nós                                        | Inserir elemento em posição declarada                                                   |
| `ui.fluxo.notification` | Card ou indicador visual contextualizado; **medidas pendentes**  | Representar efeito de notificação, não confundir com tela                               |
| `ui.fluxo.preview`      | Modal com prévia isolada da tela                                 | Mostrar visual e estado sem executar produção                                           |
| `ui.fluxo.dialog`       | Modal de edição/inspeção                                         | Confirmar criação/edição e exibir erros                                                 |
| `ui.fluxo.feedback`     | Status e mensagens sem encobrir edição                           | Salvo/não salvo/erro, importação e exportação                                           |

**[PROPOSTO]** A lista definitiva de ações do Fluxo decorre de suas funcionalidades; não devem ser preservadas ou removidas apenas por terem aparecido em uma referência.

##### Fluxo — comportamento esperado por controle

| Controle              | Ação na interface                                          | Efeito nos dados                                                           | Não pode fazer                                    |
| --------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------- |
| Importar JSON         | Selecionar arquivo, validar, informar mudanças e confirmar | Carregar/substituir dados em sessão, preservando o contrato                | Gravar automaticamente no repositório             |
| Exportar JSON         | Produzir arquivo legível pelos demais módulos              | Exportar contratos atualizados e completos                                 | Exportar só as relações, perdendo CSS/componentes |
| Adicionar tela        | Inserir nó em ponto explícito                              | Criar/associar identidade da tela e ligação declarada                      | Inventar destino/estado não escolhido             |
| Editar conexão        | Trocar origem, destino, condição ou ordem declarada        | Atualizar relação de mesmo ID ou criar ID novo explícito conforme operação | Alterar identidade da tela sem solicitação        |
| Adicionar notificação | Associar evento/efeito à ocorrência correta                | Incluir ação/estado/efeito identificado no bloco adequado                  | Tratar notificação como navegação automática      |
| Prévia                | Abrir modal com tela renderizada                           | Nenhuma modificação no fluxo ao simplesmente visualizar                    | Executar operações de produção                    |
| Desfazer/refazer      | Reverter/reaplicar operação editável                       | Restaurar versão coerente das referências                                  | Perder dados não consumidos                       |

##### Regras de fidelidade visual do Fluxo

- Não converter o Fluxo em galeria horizontal nem em lista simples de telas. A representação hierárquica/conectiva é parte da identidade do módulo.
- Preservar hierarquias, recuos, conectores, cartões, distinções entre tela/ramificação/notificação/estado e posição dos controles de inserção.
- O modal da prévia usa **o JSON da tela**; seu conteúdo não herda paleta ou regras do canvas.
- A barra contextual do Fluxo faz parte do editor; o cabeçalho global pertence ao Workspace e a prévia pertence à tela do produto.
- Registrar **estado vazio, fluxo preenchido, fluxo com ramificação, edição aberta e prévia aberta** como cenários visuais distintos de homologação.
- Medidas como recuos, larguras, alturas e espaçamentos somente viram regras depois de homologadas com os comportamentos e viewports especificados; não derivá-las de valores de CSS encontrados na implementação.
- A responsividade da área do grafo e dos controles deve ser testada em diferentes viewports.

##### Testes de aceitação do Fluxo

`FLX-01` importar contrato completo; `FLX-02` adicionar tela e identificar conexão; `FLX-03` editar destino/condição sem trocar IDs de tela; `FLX-04` criar ramificação; `FLX-05` representar notificação e estado; `FLX-06` abrir prévia fiel ao CSS de tela; `FLX-07` desfazer/refazer; `FLX-08` exportar/importar em Jornada e validar preservação; `FLX-09` executar em viewport desktop/tablet/mobile; `FLX-10` comparar topbar, recuos, cartões, conectores e modais com capturas homologadas.

### 3.5. Protótipos

#### Protótipo — evolução posterior

**Objetivo funcional [DECIDIDO]:** aproveitar **a mesma estrutura visual usada pela Jornada**, acrescentar **as relações e os efeitos de navegação do Fluxo** e incluir **mocks/cenários** para executar interações simuladas.

**Leitura principal [PROPOSTO]:** todos os conjuntos necessários à prévia, navegação e simulação, em especial `estados`, `acoes`, `interacoes`, `dados` e `mocks`.

**Regras [PROPOSTO]:**

- Cenários têm ID estável, dados declarados, seleção de estados e resultados simulados.
- Mock é uma _simulação_ e não deve sobrescrever a definição canônica de produção ou inventar endpoint real.
- O Protótipo respeita as conexões identificadas e as condições expressas; na ausência de definição, expõe uma pendência ou um resultado simulado claramente identificado.
- As variantes visuais e o conjunto de componentes permanecem alinhados com a Jornada; divergências devem ser intencionais e rastreáveis.

**[PENDENTE]** O mecanismo de execução de mocks, transições internas e efeitos colaterais ainda pode ser definido ou revisado; o contrato deve guardar requisitos e relações, **não o código de um motor específico**.

#### Ficha funcional + visual — Protótipo (em definição)

**ID ilustrativo da ficha:** `ui.modulo.prototipo`  
**Status:** objetivos gerais definidos; mecanismo e aparência definitiva **[PENDENTE]**.

**[OBJETIVO DECLARADO]** Mostrar as telas conforme a mesma estrutura usada por Jornada e Fluxo, mas executar a progressão simulada conforme navegação, estados, condições, eventos e mocks identificados. A sessão ativa deve vincular `mockId`, cenário, dados, estados e contexto, com atualização simulada visível.

**Requisitos do front-end a capturar posteriormente:** áreas de seleção de cenário/mock, dispositivo, informações de sessão e estados, prévia da tela atual, trilha de execução, reinício/retorno e erros simulados. **Não fixar por enquanto** a posição, dimensões ou cores finais sem verificar o padrão desejado; o objetivo é priorizar a prévia e reduzir painéis redundantes.

**Testes de aceitação previstos:** selecionar cenário; navegar por relação identificada; aplicar mock correspondente; persistir somente na sessão simulada; exportar JSON completo sem perder campos; comparar tela com prévia da Jornada; impedir chamadas de produção involuntárias.

##### Integração com o index [DIREÇÃO DEFINIDA]

**Campos utilizados** e **Protótipo interativo** ficam sob o mesmo módulo. O protótipo abre modos como **Navegação livre** e **Apresentação de jornadas**, com roteiros derivados de dados reais. A prévia ocupa a maior parte da área central; propriedades e mocks ficam em painel contextual/recolhível, não em três barras permanentes concorrentes.

### 3.6. Banco

#### Banco: projeção progressiva dos dados declarados em múltiplas telas

**[DECIDIDO COMO OBJETIVO FUNCIONAL]** O Banco não é um visualizador isolado de formulário. Ele agrega informações dispersas por várias telas, como Identificação, Contato, Endereço e Segurança de um mesmo cadastro, para revelar **campos lógicos, entidades, possíveis vínculos e operações**.

**[PENDENTE DE MODELAGEM]** A lista concreta de entidades e tabelas só será consolidada depois de identificar os campos, operações e relações reais das telas; o módulo Banco não deve apresentar entidades hipotéticas como definitivas.

**[PROPOSTO] Regras de modelagem:**

- Um input visual tem `id` próprio e pode apontar a um `campoRef` lógico; o campo lógico aponta, se definido, a um `entidadeRef` e a uma definição persistente. **Rótulo de input não determina sozinho coluna SQL.**
- Duas ou mais telas podem apontar para o **mesmo campo lógico** sem duplicá-lo no modelo consolidado.
- Os relacionamentos e a cardinalidade das entidades devem estar declarados ou permanecer marcados **pendentes**; reunir telas não autoriza inferir automaticamente chaves estrangeiras, tabelas de autenticação ou regras de retenção.
- A projeção deve guardar **origem/proveniência**: tela(s), instância(s), campo(s) e status de decisão que fundamentaram cada elemento da representação do Banco.
- Uma mudança de campo/ID deve permitir análise de impacto: quais telas, componentes, operações e relações são afetados.
- A ferramenta Banco pode propor agregações e inconsistências, mas não deve reescrever silenciosamente os JSONs nem criar tabelas de produção sem validação.

**Exemplo conceitual, não schema aprovado:** `auth.cadastro.identificacao` declara o campo lógico de nome; `auth.cadastro.contato` declara o e-mail; `auth.cadastro.endereco` declara o endereço. O Banco agrega esses vínculos para examinar se pertencem à mesma entidade e a quais campos persistentes se relacionam. A associação depende de `campoRef` e `entidadeRef`, **não** da proximidade das telas na Jornada.

#### Ficha funcional + visual — Banco (progressão de modelagem)

**ID ilustrativo da ficha:** `ui.modulo.banco`  
**Status:** objetivo de consolidação declarado; visual de referência técnico observado; regras de modelagem ainda em evolução.

**[OBJETIVO DECLARADO]** Ler declarações de campos, entidades, operações e relacionamentos provenientes de várias telas. Mostrar correspondências por IDs, detectar lacunas, agrupar campos de cadastro dispersos por diferentes telas e apoiar a montagem do modelo de dados, **sem inferir colunas/tabelas apenas por rótulos da UI**.

**Composição a documentar:** shell e navegação do Banco, áreas de lista/diagrama, painel de detalhes da entidade, tabela de campos, indicadores de proveniência (tela/instância/ID), conflitos e operações de importação/exportação. O formato final de painel, diagrama e largura de navegação interna exige homologação no Workspace.

**Testes:** agregar campos de três telas de cadastro; identificar duplicatas por referência canônica; mostrar diferenças de tipo/obrigatoriedade; preservar rastreabilidade até tela/instância; exportar JSON sem contaminar contratos com inferências não aprovadas; conferir responsividade.

##### Integração com o index [PROPOSTO]

O Banco agrupa consulta dos campos utilizados e suas visões de modelagem (campos lógicos, entidades, relações e operações por tela). Seus subitens serão homologados pela finalidade, não pela existência de telas ou componentes em outra versão.

### 3.7. Mapa de Interações — ficha a incorporar

**[MÓDULO A ESPECIFICAR]** O **Mapa de Interações** trata de eventos, operações e efeitos das ações sobre telas e estados, sem se confundir com o desenho de conexões do Fluxo.

**Objeto funcional:** permitir consultar e rastrear a associação entre tela, ação, evento, operação, mudanças de estado, destinos e efeito observado/previsto. As referências devem ser explícitas, preservando IDs estáveis. O módulo não pode criar ações a partir apenas do texto visível de um botão.

**Campos conceituais a validar:** `telaId`, `acaoId`, `evento`, `operacao`, `estados`, `destinos`, `efeito`. Sua nomenclatura e obrigatoriedade dependem de homologação.

**[PENDENTE]** Definir subitens, modos de consulta/edição, filtros, vínculos com `acoes`/`interacoes`, interface, exportação e critérios de aceitação. A edição de efeitos não deve gerar implicitamente novas relações de navegação.

### 3.8. Documentos Base — índice e subitens a documentar

**[DIREÇÃO DEFINIDA]** **Documentos Base** é um módulo do Workspace com **índice** e subitens identificados, incluindo documentos ou páginas HTML autocontidas. Sua árvore pode conter níveis adicionais, sem duplicar o menu global.

**Operações a definir:** localizar itens pelo índice, selecionar conteúdo, abrir a página correspondente na área principal, preservar as funções próprias do documento e manter o contexto de navegação do Workspace. Cada item deve possuir referência explícita de origem/destino.

**[PENDENTE]** Especificar estrutura do índice, níveis de subitens, tipos de documentos aceitos, edição, importação/exportação e contrato de integração com o shell. Não inventar subitens ou funcionalidades sem insumo documental.

### 3.9. Contato — ficha a incorporar

**[MÓDULO A ESPECIFICAR]** **Contato** é uma entrada própria do Workspace, não uma segunda navegação global.

**[PENDENTE]** Definir sua finalidade, conteúdo, subitens, estrutura visual, fontes de dados, ações permitidas e critérios de aceitação. A existência do módulo não autoriza inferir formulários, mensagens ou integrações externas.

### 3.10. Matriz de funcionalidades e consumo de dados por módulo

Legenda: **P** = leitura principal; **C** = leitura contextual; **—** = normalmente não utilizado. É uma **matriz funcional provisória**, sujeita à definição fina dos módulos.

| Informação                                 | Jornadas |   Fluxo    | Protótipo |              Banco               |
| ------------------------------------------ | :------: | :--------: | :-------: | :------------------------------: |
| Identidade / classificação / participação  |    P     |     P      |     P     |                C                 |
| Estrutura visual / componentes / CSS       |    P     | C (prévia) |     P     | C (referência de campos visuais) |
| Navegação / relações / condições           |    C     |     P      |     P     |     C (impacto em operações)     |
| Estados / variantes / interações locais    |    C     |     P      |     P     |                C                 |
| Ações, vínculos e dados lógicos            |    C     |     C      |     P     |                P                 |
| Cenários de mock / simulação               |    —     |     —      |     P     |                —                 |
| Manifesto de navegação / índices derivados |    C     |     C      |     C     |                C                 |

**Campos utilizados** é uma funcionalidade de inspeção dentro de cada módulo, não um módulo externo; exibe **o que aquela funcionalidade realmente consome**. Informações que a ferramenta não edita devem ser preservadas durante uma troca de contrato, se fizerem parte do conjunto canônico aprovado.

### 3.11. Dependências e integração entre módulos

Cada módulo deve ler somente as partes pertinentes do contrato, preservar os campos que não edita e compartilhar referências por ID. A matriz de consumo está em **3.10**; troca de dados e preservação são detalhadas em **6.5–6.7**.

---

## 4. Contrato JSON canônico

### 4.1. Finalidade e responsabilidades do contrato

Este é o **inventário de domínios já considerados**, não um congelamento da quantidade ou obrigatoriedade de campos. `identidade` e `classificacao` são referências iniciais fortes. Os demais precisam ser confirmados contra as funcionalidades de telas e módulos.

| Bloco atualmente considerado | Responsabilidade funcional                                                                                   | Decisão de direção                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `schema` / `schemaVersion`   | Identificar o contrato e a versão de leitura                                                                 | Manter se necessário à interoperabilidade                                                  |
| `identidade`                 | Metadados da tela (tipo, namespace, nome e versão); o **ID canônico fica na chave raiz** do contrato modular | Preservar base de identidade explícita                                                     |
| `classificacao`              | Público, domínio, jornada/subjornada, contexto e participação                                                | Preservar referências explícitas, sem motor deduzir                                        |
| `navegacao`                  | Entradas, saídas, ligações, condições, bifurcações                                                           | Necessário para Fluxo/Protótipo quando houver relações                                     |
| `estados`                    | Estados da tela e de suas instâncias                                                                         | Especificar IDs e condições conforme casos reais                                           |
| `acoes` / `interacoes`       | Eventos, ações, efeitos locais e efeitos de navegação                                                        | Evitar dupla declaração do mesmo efeito                                                    |
| `dados`                      | Campos lógicos, origem, vínculo, persistência e operações                                                    | Fundamentar módulo Banco e desenho de requisições                                          |
| `componentes`                | Definições reutilizáveis, instâncias e propriedades                                                          | Identidade estável; conteúdo para renderizar a tela                                        |
| `estrutura` / `estilos`      | Montagem/HTML e CSS, escopo de apresentação                                                                  | **Revisar se a separação duplica dados**; manter separação apenas quando tiver função real |
| `variantes`                  | Alternativas declaradas de composição/apresentação                                                           | Não confundir com estados de execução                                                      |
| `mocks`                      | Cenários e resultados simulados                                                                              | Pertinente ao Protótipo, não a registros de produção                                       |
| `localizacao`                | Caminho físico ou lógico                                                                                     | **Preferir índice/derivação**, evitando redundância por tela                               |
| `proveniencia`               | Histórico de importações, transformações e revisões                                                          | **Preferir registro de auditoria externo**                                                 |
| `politicas`                  | Regras gerais de construção, resolução e validação                                                           | **Preferir documento de direção e especificações**, não duplicação em cada JSON            |

**[PENDENTE]** Homologar nomes finais, agrupamentos e versão do contrato **depois** de validar telas reais, os subitens de cada módulo e as informações que eles precisam ler ou editar. Se uma informação nunca é consumida nem define comportamento, não deve ser exigida por inércia.

**Regra de identidade:** no contrato canônico aqui especificado, `tela.identidade` **não contém `id`**. O identificador de tela é a chave externa `<telaId>`; `cliente.home` ou `advogado.home` são valores ilustrativos dessa chave, não campos adicionais.

### 4.2. Estrutura principal: `telaId → tela + componentes`

**[MODELO CANÔNICO DE TRABALHO]** O contrato possui **um ID estável como chave do objeto de raiz**, com dois blocos dentro dele: `tela` e `componentes`. A chave de raiz identifica a tela; `tela.identidade` guarda atributos descritivos e versão do objeto, **sem repetir o ID** em `tela.identidade.id`.

```json
{
  "advogado.home": {
    "tela": {
      "schema": "advogadoja.tela",
      "schemaVersion": "<versao-do-schema>",
      "identidade": {},
      "classificacao": {},
      "navegacao": {},
      "componentes": {},
      "estrutura": { "html": {}, "css": {} }
    },
    "componentes": {}
  }
}
```

_Esqueleto parcial para evidenciar a hierarquia; o valor de `schemaVersion` deve ser definido ao homologar a versão do contrato. **Não** omitir campos declarados ao importar/exportar._

| Elemento                    | Papel declarado                                                          | Consequência para os módulos                                                    |
| --------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `<telaId>`                  | Identidade lógica da tela na raiz                                        | Jornada, Fluxo, Protótipo e Banco devem referenciar a mesma tela por essa chave |
| `<telaId>.tela`             | Metadados, classificação, composição, navegação e demais facetas da tela | Cada subitem consome somente o que precisa, preservando o restante              |
| `<telaId>.tela.componentes` | Referências/configuração de **instâncias** empregadas nessa tela         | Não confundir instância com definição de componente                             |
| `<telaId>.componentes`      | **Definições** dos componentes incluídos no contrato autocontido         | Permite reconstruir a tela isoladamente sem adivinhar dependências              |

**Inventário técnico em avaliação:** há **16 chaves possíveis dentro de `tela`**: `schema`, `schemaVersion`, `identidade`, `classificacao`, `navegacao`, `estados`, `acoes`, `dados`, `componentes`, `estrutura`, `estilos`, `variantes`, `interacoes`, `mocks`, `localizacao`, `proveniencia`. Esse inventário não define que as 16 chaves sejam sempre obrigatórias. O bloco `politicas` não integra o contrato de tela: diretrizes gerais pertencem à documentação.

**[DIREÇÃO DEFINIDA]** Preservar a _hierarquia e o significado_ dos dados necessários não impede avaliar campos que possam ser redundantes, como `estilos`, `localizacao` e `proveniencia`. Qualquer consolidação precisa de validação funcional, migração explícita quando cabível e preservação de dados úteis.

### 4.3. Identidade

**[MODELO DE TRABALHO]** O bloco `identidade` utiliza os campos descritos abaixo. A Home Advogado serve apenas como exemplo de preenchimento:

```json
"identidade": {
  "tipo": "tela",
  "namespace": "advogado",
  "nome": "Home Advogado",
  "nomeExibicao": "Início Profissional",
  "descricao": "Tela inicial da área profissional do AdvogadoJá.",
  "versao": "1.0.0"
}
```

| Campo          | Finalidade                                        |
| -------------- | ------------------------------------------------- |
| `tipo`         | Diferenciar tela, componente e outras naturezas   |
| `namespace`    | Agrupamento lógico e busca                        |
| `nome`         | Nome de referência editorial                      |
| `nomeExibicao` | Nome visível ao usuário                           |
| `descricao`    | Finalidade da tela/componente                     |
| `versao`       | Versão do **objeto**, distinta de `schemaVersion` |

**Regra de referências:** o ID de tela está na **chave raiz** e o de componente na **chave do mapa externo `componentes`**. Eventuais formatos de entrada diferentes exigem tratamento de importação declarado; não multiplicar identidades redundantes no contrato canônico.

### 4.4. Classificação

**[CONSOLIDADO]** `classificacao` distingue domínio, posição funcional, escopo e público. O modelo prevê `dominio`, `moduloRef`, `submoduloRef`, `secao`, `categoria`, `escopo`, `reutilizavel`, `publicoAlvo[]`, `tags[]` e `jornadas[]`.

- `escopo: "comum"` **não cria uma jornada chamada Comum**; representa possível reutilização por diferentes jornadas.
- `publicoAlvo` pode conter **vários perfis**.
- `tags` ajudam em busca e filtro, não devem substituir IDs nem criar hierarquia artificial.
- `moduloRef` nesta classificação pertence ao **domínio de produto da tela**, e não é automaticamente o registro de módulos do `index` do Workspace.

**Relações de participação:** `classificacao.jornadas[]` permite associar uma mesma identidade de tela a várias participações de jornada/subjornada, cada uma com sua referência e ordenação. A descrição do vínculo e seus campos está em **5.2**.

### 4.5. Navegação e participações

Os campos de participação e navegação estão documentados em **5.2** e **5.3**. As coleções `rotas`, `relacoes` e `bifurcacoes` são uma proposta estrutural em avaliação, **não um schema fino definitivamente homologado**.

### 4.6. Componentes e instâncias

**[CONSOLIDADO]** Cada definição de componente tem identidade e classificação próprias, `estrutura.html`, `estrutura.css`, e reserva `dados`, `estados`, `acoes`, `variantes`. **A definição lógica** possui ID estável e pode ser usada em várias telas. **A instância** identifica onde e como aquele componente participa de cada tela.

**Exemplo estrutural de uma tela com menu:**

```json
{
  "tela": {
    "componentes": {
      "instanciasRefs": { "screen.drawer": "menu.drawer.padrao" }
    },
    "estrutura": {
      "html": {
        "composicao": {
          "screen.drawer": {
            "componenteRef": "menu.drawer.padrao",
            "paiRef": "layout.root",
            "slot": "menu",
            "ordem": 40
          }
        }
      }
    }
  },
  "componentes": {
    "menu.drawer.padrao": {
      "identidade": {
        "tipo": "componente",
        "namespace": "menu",
        "nome": "Menu lateral compartilhado",
        "versao": "0.1.0"
      },
      "estrutura": { "html": {}, "css": {} }
    }
  }
}
```

_Fragmento propositalmente parcial para explicar referências e composição. Uma definição integral deve incluir todas as propriedades pertinentes ao caso real._

**[DIREÇÃO FUNCIONAL]** O editor deve distinguir claramente **editar esta instância**, **editar a definição compartilhada** e **editar token visual compartilhado**. Modificações na definição são propagadas de forma **explícita** às telas/contratos incluídos no conjunto de trabalho, preservando personalizações. Não pressupor que arquivos independentes mudam sozinhos.

**Exemplo de composição:** uma Home pode reunir definições/instâncias de layout, cabeçalho, barra de título, introdução, status online, resumo de solicitações e menu lateral. Os itens são ilustrativos: cada tela declara apenas seus componentes efetivos, sem obrigatoriedade dessa lista.

### 4.7. Estrutura HTML

**[PRINCÍPIO CONSOLIDADO]** `estrutura.html` + `estrutura.css`, com as definições de `componentes` do contrato, **devem bastar para montar a tela estática completa** (seções, hierarquia, ordem, textos, imagens e aparência). A estrutura básica não depende de preencher `dados`, `estados`, `acoes` ou `mocks` para surgir visualmente.

**[MODELO DE TRABALHO]** A composição utiliza:

- `componentes[componenteId].estrutura.html.raizRef` e `elementos[elementoId]` para descrever os elementos da definição;
- `tag`, `paiRef`, `ordem`, `atributos`, `texto` como propriedades dos elementos;
- `componentes[componenteId].estrutura.css.regras` para CSS da definição;
- `tela.estrutura.html.composicao` para encaixar as instâncias nos nós/slots da tela;
- `tela.estrutura.css.tokens` e `regras` para propriedades visuais do conjunto.

**[DECISÃO SOBRE RESPONSABILIDADES]** Manter separados: **árvore dos elementos**, **regras CSS**, **referências de instâncias**, **dados e comportamento**. Não impor artificialmente a toda definição uma hierarquia `header → itens → rodapé`. A árvore se define por IDs, pais e ordem; CSS não deve duplicar a árvore inteira.

**[PENDENTE]** A grafia final das chaves internas (`elementos`, `paiRef`, `regras`) e a escolha entre CSS textual e declarativo **não foram homologadas**. `estilos` está vazio no modelo e na Home; sua redundância com `estrutura.css` deve ser decidida a partir de necessidade real, sem assumir duas fontes da mesma regra. O mesmo vale para tokens globais vs tokens por tela e isolamento de CSS do editor/Workspace.

### 4.8. Estilos CSS

`estrutura.css` reúne a apresentação estática. A necessidade de um bloco adicional `estilos` requer justificativa funcional: sem responsabilidade própria, ele não deve duplicar CSS. Ver **4.7** e isolamento de estilos em **7.2–7.3**.

### 4.9. Estados e variantes

O inventário de domínios de **4.1** inclui `estados` e `variantes`; sua semântica deve ser separada da de dados e mocks (**5.6**). A sintaxe fina por instância segue pendente.

### 4.10. Ações e interações

`acoes` e `interacoes` representam eventos/efeitos; não duplicar o mesmo efeito em duas definições concorrentes. A utilização no Fluxo e no Protótipo está em **3.4–3.5** e as relações explícitas em **5.3**.

### 4.11. Dados e operações

`dados` deve descrever informações, vínculos e operações efetivamente necessárias, sem inventar entidades ou endpoints a partir de rótulos. A projeção funcional para o Banco é detalhada em **3.6** e **6.4**.

### 4.12. Mocks e cenários

`mocks` são cenários simulados de teste/protótipo, distintos de dados de produção. Ver **3.5** e **5.6**; a definição mínima de cenário permanece sujeita à homologação.

### 4.13. Campos auxiliares e redundâncias a revisar

Os campos `localizacao`, `proveniencia`, `estilos` e `politicas` são discutidos criticamente no inventário de **4.1**. O documento recomenda não perpetuar redundâncias sem necessidade funcional comprovada.

---

## 5. Relações, composição e comportamento

### 5.1. Identidades e referências explícitas

#### Padrão de identidade, referência e composição

##### Identidade lógica x ocorrência

| Entidade                | Exemplo ilustrativo                       | Regra                                                             |
| ----------------------- | ----------------------------------------- | ----------------------------------------------------------------- |
| Tela                    | `cliente.home`                            | ID canônico único do contrato                                     |
| Componente              | `menu.drawer.padrao`                      | Mesmo ID lógico entre telas quando for o mesmo componente         |
| Instância do componente | `cliente.home.inst.menu.drawer.principal` | ID único no contexto da tela; aponta para `componenteRef`         |
| Estado da tela          | `cliente.home.estado.padrao`              | ID persistente; selecionado explicitamente                        |
| Estado do componente    | `menu.drawer.padrao.estado.aberto`        | Não muda o ID do componente                                       |
| Variante                | `menu.drawer.padrao.variante.reduzido`    | Alternativa declarada de apresentação/conteúdo                    |
| Interação               | `cliente.home.interacao.abrir_menu`       | Vincula evento, origem e efeito local                             |
| Relação de navegação    | `cliente.home.relacao.abrir_solicitacoes` | IDs estáveis para editar conexões sem depender da posição da tela |
| Cenário de mock         | `cliente.home.mock.com_solicitacoes`      | Referência a cenário de simulação                                 |

_Todos os IDs acima são **ilustrativos**. Não renomear os IDs existentes para coincidir com estes exemplos._

##### Componentes reutilizados

**[DEFINIÇÃO DE TRABALHO]** O contrato `<telaId> → { tela, componentes }` separa referências de instância em `tela.componentes` e definições em `componentes` externo. A Home de trabalho usa `tela.componentes.instanciasRefs` e `tela.estrutura.html.composicao`; o contrato fino de estados/props por instância continua pendente.

**[PROPOSTO]** Um componente repetido em várias telas mantém: **seu ID de chave no mapa `componentes`**, contrato de propriedades, nomes de estados/variantes e comportamento básico. Podem variar: `props`, conjunto de itens contextuais, estado inicial, visibilidade, slot e ações habilitadas. Se duas definições com mesmo ID divergem materialmente, a auditoria classifica: **equivalente**, **variante legítima**, **versão diferente** ou **conflito a corrigir**.

**[PROPOSTO]** Não usar o índice de um array (`0`, `1`, `2`) como identidade. A ordem é atributo editável, mas o vínculo entre objetos depende de IDs estáveis.

##### Estado, variante e dados não são sinônimos

- **Estado:** condição atual, como `aberto`, `fechado`, `carregando`, `vazio`, `erro`.
- **Variante:** configuração alternativa aprovada, como `padrao`, `compacto` ou `reduzido`.
- **Dados/props:** conteúdo recebido pela instância: itens do menu, rótulos, contagens, textos e permissões visuais declaradas.
- **Cenário de mock:** valores simulados que selecionam dados e estados para pré-visualização/teste.

**[PROPOSTO]** O conjunto visível de itens pode depender do estado, perfil, variante ou dados; a relação deve ser explícita em condição/configuração declarada. A regra de autorização de fato não é estabelecida pelo menu visual.

#### Regra de identidade e referências como base comum

**[DECIDIDO COMO OBJETIVO]** Todo elemento que possa ser referenciado, reutilizado, conectado, variado, auditado ou alterado em conjunto deve possuir um **ID estável**. O ID identifica o objeto lógico; o nome visível, a posição e a numeração editorial podem mudar sem alterar o ID.

| Entidade                                        | Exigência de identidade                             | Observação                                                                        |
| ----------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------- |
| Tela                                            | Chave raiz `<telaId>` (por exemplo `advogado.home`) | Independente da ocorrência em uma jornada, sem duplicar o ID em `tela.identidade` |
| Participação da tela na jornada                 | ID de participação                                  | Referencia tela, jornada, subjornada e ordem                                      |
| Componente reutilizável                         | ID lógico do componente                             | A mesma definição funcional pode aparecer em várias telas                         |
| Instância do componente                         | ID de instância                                     | Identifica a ocorrência em uma tela, com suas props/estado                        |
| Estado / variante                               | IDs distintos                                       | Variantes não substituem a identidade do componente                               |
| Evento / interação / ação                       | IDs identificáveis                                  | Relacionam controle, gatilho e efeito                                             |
| Nó de fluxo / conexão / decisão / notificação   | IDs próprios                                        | Evitam depender do desenho ou da posição na árvore                                |
| Cenário, conjunto de dados e referência de mock | IDs próprios                                        | Relacionam sessão, variações e resultados simulados                               |
| Campo lógico e alvo persistente                 | IDs próprios                                        | Permitem a projeção do Banco a partir de várias telas                             |

**[PROPOSTO]** Separar as referências por escopo: `telaRef`, `componenteRef`, `instanciaRef`, `estadoRef`, `varianteRef`, `acaoRef`, `relacaoRef`, `mockRef`, `campoRef`, `entidadeRef`, sempre que o tipo do objeto puder ser confundido. A grafia exata precisa ser conciliada com os nomes existentes nos blocos em revisão; exemplos aqui **não** homologam novas chaves.

**[PROPOSTO]** Referências internas e entre telas devem ser validadas no pacote. IDs duplicados dentro do mesmo escopo, IDs ausentes, aliases ambíguos e IDs que apontam para definições incompatíveis devem gerar avisos explícitos; nunca consertar por adivinhação.

### 5.2. Participação de telas em múltiplas jornadas

**[DEFINIÇÃO DE TRABALHO]** `tela.classificacao.jornadas[]` permite que **uma única tela tenha várias participações** em jornadas/subjornadas, cada uma com ID próprio. A tela não recebe outra identidade só porque reaparece em outro contexto.

```json
"jornadas": [{
  "id": "part.advogado.home",
  "jornada": {"id": "advogado", "nome": "Advogado", "ordem": 2},
  "subjornada": {"id": "home", "nome": "Home única e capabilities", "ordem": 4},
  "ordemTela": 1,
  "ocorrenciaNo": "home",
  "condicaoRef": null
}]
```

**Campos e interpretações:**

- `id` identifica a **participação**, não a tela. Assim é possível editar uma participação sem alterar as demais.
- `jornada.id`/`subjornada.id` representam o agrupamento; `nome` é sua apresentação; `ordem` é a ordenação do agrupamento.
- `ordemTela` ordena a tela **dentro da participação** e não cria relação de navegação.
- `ocorrenciaNo` identifica a ocorrência contextual e `condicaoRef` reserva a referência a uma condição, sem embutir a condição nela.

**Aplicação no Workspace:** o módulo **Jornadas → Visualização de jornadas** deriva seus subitens dos `jornada.id` presentes nas telas carregadas e seus agrupamentos de `subjornada.id`, preservando nomes e ordens declarados. **Não deve inferir a jornada pelo nome do arquivo nem confundir sequência editorial com conexões do Fluxo.**

**Limite do exemplo:** `advogado`, `home`, a ordenação e as condições apresentados ilustram como registrar uma participação. Os IDs reais e suas condições dependem do conjunto de telas aprovado.

### 5.3. Entradas, saídas e conexões

**[CAPACIDADE REQUERIDA]** A navegação precisa representar **entradas, saídas, conexões, decisões, bifurcações e transições entre telas ou estados da mesma tela**, inclusive múltiplos caminhos e contextos. Cada vínculo utiliza IDs de objetos apropriados — nunca nomes de botões, ordem de uma galeria ou coordenadas de um cartão.

**[ESTRUTURA EM AVALIAÇÃO]** A representação de `tela.navegacao` usa `rotas[]`, `relacoes[]` e `bifurcacoes[]`. `relacoes[]` discrimina `origem` e `destino` com `tipo`, `ref`, `noRef`, opcional `telaContextoRef`/`portaRef`, além de `gatilho`, `condicaoRef`, `participacaoRef`, `ordem` e `prioridade`. `bifurcacoes[]` declara `alternativas[]` por referência de relação.

**Exemplo de capacidade:** estados de OAB como pendente, em validação, habilitada, restrita e desconhecida podem determinar **estados distintos da mesma Home**; nem toda alternativa cria outra tela. Caminhos para solicitações, atendimentos, disponibilidade ou configurações precisam de IDs e condições declarados antes de serem tratados como navegação ativa.

**[PENDENTE]** A sintaxe exata de condições, callbacks, efeitos, fallback, transições, prioridades e a fronteira entre `navegacao`/`estados`/`acoes`/`interacoes` ainda exigem definição funcional. Não converter exemplos de caminhos e estados em regras de negócio sem condição e referência validadas.

**Aplicação aos módulos:** Jornada consulta as participações; Fluxo consulta/edita relações declaradas; Protótipo executa apenas a simulação explicitada; Banco examina operações e dados sem inferir tabelas/consultas de uma seta visual.

### 5.4. Bifurcações, condições e prioridades

As bifurcações devem ter identidades e alternativas explícitas. Uma mudança de estado pode ser destino de uma relação, sem exigir outra tela. A estrutura proposta e as lacunas de homologação aparecem em **5.3**.

### 5.5. Transições entre estados

Transições entre estados da mesma tela, ações locais e rotas de navegação são capacidades distintas. A semântica e os IDs necessários devem ser definidos antes de sua execução em motor; ver **5.3** e **5.6**.

### 5.6. Diferenças entre estado, variante e mock

**[DECIDIDO COMO OBJETIVO]** Uma mesma Home pode mudar opções do menu, visibilidade de ações e composição conforme condição de usuário/OAB/sessão, **mantendo a mesma identidade da tela e do menu**.

**[PROPOSTO]** Cada estado, variante e cenário deve carregar um ID, referência à entidade à qual se aplica, seleção/restrições e os efeitos que altera (por exemplo, visibilidade dos itens, modo aberto/fechado, item ativo, conteúdo do card, opções disponíveis). Preferir _diferenças declaradas_ e dados por instância à duplicação integral do HTML/CSS do componente por estado.

| Dimensão                   | Exemplo                                      | Regra                                                   |
| -------------------------- | -------------------------------------------- | ------------------------------------------------------- |
| Estado local               | menu fechado/aberto                          | Pode ser exercitado na Jornada sem navegar              |
| Estado de negócio simulado | OAB pendente/aprovada                        | Precisa de referência e regra; não é uma permissão real |
| Variante visual            | menu reduzido/completo                       | Mesma identidade do componente, variação declarada      |
| Dados de instância         | itens do menu, contadores                    | Podem variar por tela e contexto                        |
| Cenário de mock            | usuário com OAB pendente                     | Seleciona dados/estados para simulação posterior        |
| Efeito do Fluxo            | clicar em botão leva a tela X sob condição Y | Relação identificada, editável no editor de Fluxo       |

**[PENDENTE]** Os detalhes finais do contrato de sessão, transições temporais, precedência entre variantes/estados e sintaxe de condições compostas precisam ser homologados com casos reais, especialmente antes do novo Protótipo.

### 5.7. Reutilização e atualização de componentes por ID

#### Há três operações diferentes

1. **Alteração da instância:** mudar apenas o menu de uma tela (por exemplo, estado aberto, item ativo ou itens contextuais). Preserva `componenteRef` e não modifica outras telas.
2. **Alteração da definição compartilhada:** mudar a estrutura, o CSS ou uma propriedade-padrão do **mesmo componente lógico**. Deve propagar a nova definição às telas que utilizam esse ID **no conjunto de contratos que o editor tem carregado**, preservando as personalizações de instância.
3. **Alteração de token/tema:** mudar uma cor ou espaçamento compartilhado com referência explícita, afetando **todos os componentes que usam o mesmo token**. Não confundir token visual com ID de componente. A posição canônica exata dos tokens é pendente de homologação.

#### Compatibilizar autocontenção com atualização em lote

**[DIREÇÃO DEFINIDA]** Cada arquivo de tela permanece **autocontido para renderização**: sua definição visual necessária viaja junto do JSON da tela. **[REQUISITO FUNCIONAL]** Ainda assim, o ambiente de edição precisa reconhecer os vários registros que compartilham `componentes[componenteId]` (chave da definição).

**[PROPOSTO] Procedimento de atualização compartilhada:**

1. Selecionar definição por **ID lógico e versão** (não por nome de arquivo ou texto CSS).
2. Distinguir **alterar só esta instância**, **alterar definição em todas as telas carregadas** e **alterar token visual comum**.
3. Localizar todas as definições/instâncias referenciadas no pacote; identificar cópias divergentes e versões incompatíveis.
4. Aplicar a alteração apenas ao escopo confirmado; atualizar os JSONs afetados **ou** produzir pacote de alterações identificadas, mantendo os JSONs autocontidos.
5. Exportar contratos alterados e um relatório/índice de alterações; outros módulos passam a refletir a mudança **após importar os contratos atualizados**.

**Limite técnico obrigatório:** duas cópias de um componente guardadas em arquivos independentes **não mudam por si só** quando apenas uma é editada. O efeito global por ID é uma **operação explícita do editor sobre o catálogo carregado ou uma aplicação de atualização na importação**, e não sincronização automática da raiz. Essa distinção precisa aparecer na interface para evitar falsas expectativas.

**[ALERTA]** Nome de arquivo, caminho e rótulo visual não são identificadores canônicos. Propagação compartilhada exige conferir os IDs internos antes de qualquer atualização em lote.

### 5.8. Composição estática e renderização isolada

Para renderização estática, utilizar **HTML/CSS da estrutura + definições dos componentes**, sem exigir a execução de dados e ações. A montagem está em **4.7** e o isolamento do editor em **7.2–7.3**.

---

## 6. Dados, interoperabilidade e evolução

### 6.1. Separação entre JSON e documentação

#### Separação de responsabilidades

| Informação                                                                       | Destino recomendado                                              | Estado                                                        |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------- |
| ID da tela, identidade de componente/instância, classificação e participação     | Contrato canônico da tela ou objeto de participação identificado | **Base a preservar e avaliar**                                |
| Componentes, composição, estado, variante, ação, interação, referência de dado   | Contrato funcional/visual pertinente                             | **Necessário conforme cada caso real**                        |
| Relações entre telas, bifurcações, condições, efeitos e destinos                 | Relações explícitas no contrato/objeto relacionado               | **Não inferir**                                               |
| Cenários de simulação e mocks                                                    | Dados de prototipação identificados, separados dos de produção   | **A detalhar**                                                |
| Política geral de construção, convenção de ID, regras de UX, orientação do index | Este documento e fichas de módulo/Workspace                      | **Não duplicar em cada tela**                                 |
| Trilha de auditoria de importações, revisões e homologações                      | Documentos/manifestos de auditoria, quando necessários           | **Não obrigar cada tela a carregar isso**                     |
| Localização física de arquivo e breadcrumb de interface                          | Índice/manifesto derivável e estado de navegação                 | **Evitar redundância no JSON da tela**                        |
| HTML de composição e CSS de apresentação                                         | Blocos funcionais da estrutura visual, com escopo distinto       | **Avaliar consolidação de `estrutura` e `estilos` sem perda** |

**[DIREÇÃO DEFINIDA]** Não definir agora um conjunto definitivo de 17 campos obrigatório para sempre. A estrutura de `identidade` e `classificacao` já é uma boa base e deve ser respeitada, mas os outros campos serão **avaliados a partir das funcionalidades reais**. Se dois blocos repetem a mesma informação, a equipe pode consolidá-los de maneira explícita e controlada.

**[DECIDIDO]** Os módulos não devem adivinhar informações ausentes: uma tela sem referência de jornada, fluxo ou dado necessário fica como **pendência de especificação**. A troca de dados entre módulos acontece por IDs e contratos explícitos; mecanismos de atualização automática ou importação/exportação serão definidos de acordo com o fluxo de trabalho aprovado.

**Exemplo de trabalho real:** ao definir uma tela de cadastro, registrar o conteúdo visual, a identidade da tela, seu papel na jornada, ações e estados, relações de entrada/saída e campos lógicos usados. O Banco pode depois apresentar quais telas consomem/produzem esses campos e quais operações precisam ser especificadas. A ferramenta não inventa tabela, endpoint ou função apenas a partir do rótulo do botão.

#### Disponibilidade de telas entre módulos

**[DIREÇÃO FUNCIONAL]** Quando uma tela for inserida e identificada no **conjunto de trabalho carregado**, sua referência deve ficar disponível aos módulos que a utilizem: a Jornada a apresenta no agrupamento declarado; o Fluxo pode mostrá-la como tela disponível para conexão; o Protótipo pode localizá-la para prévia/simulação. **Disponibilização não equivale a inventar conexões ou simular comportamento indefinido.** A persistência e a propagação para arquivos/sessões externos continuam dependentes de um mecanismo que ainda será escolhido.

**Regra de organização do contrato:** o invólucro externo é `<telaId> → { tela, componentes }`. O bloco interno `tela.componentes` trata de instâncias/referências; o externo `componentes` reúne definições. A necessidade de cada campo adicional continua subordinada ao caso funcional real (ver **4.1–4.13**).

### 6.2. Fonte canônica e índices derivados

**[DIREÇÃO DEFINIDA]** Os módulos devem reconhecer identidades e vínculos comuns em uma família de contratos de tela; nenhum módulo se torna autoridade sobre os campos que não edita.

**[PROPOSTO]** Dois níveis de transporte quando necessários: **tela individual** e **pacote de trabalho** com índice derivado. Não existe obrigação de conservar determinado número de campos de primeiro nível: o conjunto final depende da revisão funcional documentada.

**[PROPOSTO]** Uma importação segura valida IDs, versões e referências, exibe diferenças e permite confirmar adição, substituição ou mesclagem por ID. Não elimina, por exemplo, condições do Fluxo após edição visual de uma Jornada ou cenários do Protótipo após inspeção do Banco.

**[PENDENTE]** A experiência do usuário para atualização entre módulos (conjunto compartilhado carregado no Workspace, importação/exportação ou ambas) precisa de definição. A **visibilidade da tela recém-inserida no conjunto atual** é requisito de UX; a persistência/sincronização entre arquivos ou sessões ainda é pendente.

### 6.3. Disponibilidade de telas entre módulos

Inserir uma tela no conjunto carregado a torna disponível aos módulos que usam seu ID; **não** cria automaticamente conexões, participações ou persistência externa. A regra integral está em **6.1**.

### 6.4. Projeção dos dados para o Banco

O Banco deve projetar os campos e operações declarados nos contratos e mostrar rastreabilidade até telas/instâncias, apontando divergências como pendências. Ver **3.6**.

### 6.5. Compartilhamento de contratos

**Direção:** os módulos trabalham com objetos e identidades comuns. A forma de compartilhar alterações deve ser **explícita e verificável**, sem exigir que o motor preencha lacunas.

1. **Entrada reconhecida:** importar contratos de tela ou pacote válido, com identidade e versão quando aplicável.
2. **Edição localizada:** cada módulo altera somente as informações sobre as quais o usuário realmente atuou.
3. **Preservação:** dados não editados continuam íntegros, inclusive CSS e dados de simulação.
4. **Referências:** duplicidade de ID, destino não resolvido e versão incompatível geram pendências, não correção silenciosa.
5. **Múltiplas telas:** mudanças relacionadas podem exigir um pacote de contratos; o manifesto ordena/localiza sem tornar-se uma segunda fonte concorrente.
6. **Sem sincronização externa presumida:** o mesmo conjunto de trabalho no Workspace pode ser consumido por módulos distintos, mas alterações em arquivos ou sessões independentes precisam de transferência/recarga explícita até que se aprove outro mecanismo.
7. **Padrão de direção antes do protocolo:** definir quais operações precisam atravessar módulos antes de fixar a forma técnica do transporte.

**[PENDENTE]** Escolher se o index gerencia um pacote de trabalho único ou se cada módulo importa/exporta sua parte. Isso deve ser decidido como fluxo funcional de usuário, não em função de uma implementação prévia.

### 6.6. Importação e exportação

A importação/exportação deve transportar contratos com IDs e versões válidos, aplicar somente edições explícitas e informar referências ausentes ou conflitos. A diretriz de troca está em **6.5** e os testes em **8.5**.

### 6.7. Preservação de conteúdo não editado

Os módulos não podem remover campos que não exibem, incluindo estrutura visual, estados e mocks. Esta regra é definida em **6.5** e verificada em **8.5**.

### 6.8. Versionamento e compatibilidade

**[PROPOSTO] Procedimento para ampliar um campo:**

1. Registrar **qual caso real** exige a ampliação (por exemplo: o menu tem configurações diversas por estado).
2. Localizar o bloco correto entre os blocos funcionais definidos, sem criar novo domínio por conveniência.
3. Identificar se o valor atual deve se tornar **array de objetos com ID** ou outro objeto estruturado.
4. Distinguir **zero, um ou vários** elementos, ordenação, referências, condições e valores de fallback.
5. Definir a transformação entre formatos aceitos e a política de consumidores com versões de schema diferentes.
6. Atualizar `schemaVersion` conforme ruptura/compatibilidade; registrar migração, origem e impacto no glossário.
7. Validar os cenários reais em Jornada, Fluxo e Protótipo por exportação/importação, sem exigir motores refatorados simultaneamente.

**Exemplo semântico:** em vez de uma propriedade `estado: "aberto"` incapaz de representar alternativas, evoluir para uma coleção `estados.itens` com `id`, `nome`, `quando` e referências de composição; a seleção fica em `estadoInicialRef` ou referência contextual. **Não duplicar** uma definição completa do menu para cada estado quando a diferença for somente conteúdo ou visibilidade.

**Regra de compatibilidade:** nunca apagar o campo antigo ou reinterpretá-lo sem uma regra de migração registrada. Não declarar compatibilidade apenas porque o JSON continua sintaticamente válido.

### 6.9. Evolução progressiva do schema

A revisão do schema parte de casos reais, documenta impacto, preserva IDs e exige transformação explícita quando houver ruptura. O procedimento proposto está em **6.8**.

### 6.10. Integração posterior dos motores

Motores, adaptadores e carregadores são posteriores à homologação da experiência e dos contratos. Essa ordem consta em **1.7**; o motor não deve preencher lacunas por inferência.

---

## 7. Padrões visuais e experiência de uso

### 7.1. Linguagem visual do Workspace

**[DIREÇÃO DEFINIDA]** As interfaces são _formas de trabalho diferentes sobre o mesmo conteúdo contratual_. Não padronizar o layout dos módulos; padronizar os dados que os alimentam. As capturas devem demonstrar a organização visual pretendida e os estados de uso, sem homologar automaticamente detalhes de implementação.

#### Jornada: vitrine organizada das telas

- Apresenta uma **sequência de prévias de telas**, horizontal ou em outra disposição definida pelo usuário, agrupadas por **jornada, subjornada e ordem**.
- Permite **alternar Mobile / Desktop** sem criar outra identidade de tela. Dimensões e responsividade pertencem à composição/estilo/variante, não à identidade.
- Oferece seleção, filtros e **detalhes**; no painel de detalhes, o usuário pode consultar o JSON integral da tela.
- Permite **incluir ou reorganizar telas e jornadas**, com IDs e participações explícitas no JSON. A mesma tela pode participar em mais de um contexto sem exigir cópias com novas identidades.
- A prévia admite **interação interna declarada**: abrir/fechar menu, mostrar itens, alternar aba local, expandir seção, mostrar modal local e selecionar estado visual. **Não navega** para outra tela, não executa produção e não altera o grafo apenas por clicar em um link.
- Se o usuário editar composição, classificação, ordem ou outra informação do contrato, a exportação contém a alteração; uma mera interação de prévia pode ser temporária e **não** precisar editar o arquivo.

#### Fluxo: mapa de caminhos, não carrossel de telas

- A interface principal mostra **nós e conexões editáveis**: telas, estados, decisões, bifurcações, notificações e outros elementos formalmente definidos. Um nó de notificação **não deve ser confundido com uma tela**.
- Suporta adicionar/retirar/reordenar visualmente nós, criar e modificar ligações, saídas condicionais e referências de estado. **A semântica da conexão é gravada no JSON**, enquanto a posição do nó no desenho é uma preocupação de apresentação.
- Clicar no nó de tela abre **uma prévia visual daquela mesma tela** (como na captura da Splash). Interatividade interna opcional, desde que não execute navegação real; mostrar todo o JSON junto da prévia **não é requisito**.
- A prévia reutiliza **identidade + composição + componentes + CSS/estilos + estado/variante**, como na Jornada. O Fluxo acrescenta **relações e condições**, não cria uma versão visual independente da tela.
- As notificações e mudanças de estado vistas no fluxo precisam de **identificadores próprios** e referências explícitas para que o motor futuro não as deduza da posição, do texto de um botão ou do nome do nó.

#### Protótipo: simulação posterior

- Reutiliza a renderização visual da Jornada e as relações do Fluxo, acrescentando **cenários de mock, dados simulados, sessão simulada, estados derivados e resultados simulados**.
- O mesmo componente/tela pode ser exercitado sob **múltiplos estados e cenários** com IDs próprios. Não transformar cada cenário numa tela distinta.
- O comportamento do motor ainda está em avaliação: este documento descreve capacidades, estados, condições e vínculos que deverão ser suportados. Nenhum mecanismo de execução específico é obrigatório sem a homologação dos requisitos.

### 7.2. Composição visual dos módulos

A ficha de cada módulo é lida de **fora para dentro**:

1. **Workspace global:** cabeçalho, menu lateral, item selecionado e área disponível.
2. **Subitem do módulo:** finalidade, título e ações contextuais. Não repetir cabeçalho nem sidebar universais.
3. **Área de trabalho:** filtros e componentes específicos, como árvore, grafo, galeria, formulário, simulador ou editor.
4. **Prévia de tela:** ambiente isolado para HTML/CSS do produto, sem herdar regras do Workspace/editor.
5. **Painéis temporários:** detalhes, configurações, propriedades, cenários, avisos e confirmações.

#### Separação de CSS e estrutura

- O shell global tem escopo visual próprio; cada módulo tem classes/componentes próprios; as telas simuladas têm CSS isolado.
- CSS repetido entre `estrutura` e `estilos` deve ser auditado e consolidado **se forem realmente a mesma informação**; não apagar responsabilidades distintas por parecerem semelhantes.
- Evitar seletores genéricos de editor que alterem menus, headers e cards da tela simulada.
- Painel interno pode ser recolhido quando não está em uso; controles indispensáveis devem continuar acessíveis.
- Preservar responsividade, foco, contraste, rolagem, atalhos e estados de erro.

#### Quando a funcionalidade abre fora do Workspace

Uma página independente pode precisar de identificação mínima, mas a versão incorporada respeita o shell único. Não manter dois menus globais ativos ao mesmo tempo. Todo controle transferido precisa ter destino equivalente e testado.

### 7.3. Isolamento de HTML e CSS

CSS do Workspace, CSS de cada módulo/editor e CSS das telas do produto precisam de escopos distintos. A separação está detalhada em **7.2** e deve ser testada conforme **8.5**.

### 7.4. Componentes da interface do editor

O inventário deve apontar componentes **do editor**, não confundi-los com os componentes de tela carregados por JSON.

| Campo do cadastro | Exemplo do Fluxo                                       | Observação                             |
| ----------------- | ------------------------------------------------------ | -------------------------------------- |
| `id`              | `ui.fluxo.node.tela`                                   | ID estável de elemento do editor       |
| `regiaoRef`       | `ui.fluxo.canvas`                                      | Composição/posição lógica              |
| `funcao`          | Representar uma tela no fluxo                          | O que o usuário faz com ele            |
| `estrutura`       | ícone + metadados + ações                              | Slots observáveis, sem código de motor |
| `styles`          | cor, borda e raio de canto a homologar                 | Valores extraídos / homologados        |
| `states`          | padrão, hover, selecionado, edição, desabilitado, erro | Capturas separadas                     |
| `events`          | abrir prévia, inserir conexão, editar                  | Efeitos precisos e testáveis           |
| `responsive`      | colunas e botões reorganizados em viewport menor       | Testar                                 |
| `reference`       | captura/versionamento homologado                       | Caminho de rastreio                    |
| `approval`        | pendente                                               | Proposta não é decisão final           |

### 7.5. Controles contextuais, modais e painéis

Toolbar contextual, filtros, drawers, modais e painéis temporários são definidos pela necessidade do subitem, sem competir com a área principal. Ver **2.3** e **7.2**.

### 7.6. Matriz visual das interfaces

Esta tabela é um **inventário de decisões visuais a homologar**, cujos valores concretos devem ser definidos por caso de uso, viewport e evidência de aceitação.

| Atributo                        | Workspace/index                            | Fluxo               | Jornadas                 | Protótipo             | Banco / Contrato          |
| ------------------------------- | ------------------------------------------ | ------------------- | ------------------------ | --------------------- | ------------------------- |
| Cabeçalho global                | **Único**, altura/estilos a homologar      | Não duplicar        | Não duplicar             | Não duplicar          | Não duplicar              |
| Sidebar global                  | **Única**, recolhível, com módulo/subitens | Reutiliza           | Reutiliza                | Reutiliza             | Reutiliza                 |
| Toolbar contextual              | Define região e comportamento              | Ações do grafo      | Filtros/ações da galeria | Cenário/controles     | Ações de inspeção/edição  |
| Área principal                  | Fluida e ampla                             | Fluxograma e prévia | Galeria e detalhes       | Dispositivo/simulação | Árvores/tabelas/diagramas |
| Painéis laterais do módulo      | Não obrigatórios                           | Conforme tarefa     | Conforme tarefa          | Preferir recolhíveis  | Conforme tarefa           |
| Tipografia, paleta, espaçamento | **Definir tokens de shell**                | Escopo do editor    | Escopo do editor         | Escopo do editor      | Escopo do editor          |
| Responsividade                  | Desktop, tablet, mobile                    | Testar grafo        | Testar galeria           | Priorizar prévia      | Testar árvores e tabelas  |
| Captura homologada              | **Pendente**                               | Pendente            | Pendente                 | Pendente              | Pendente                  |

**[DIREÇÃO DEFINIDA]** Não copiar paletas, tamanhos de cartões ou cabeçalhos de uma ferramenta para outra só por conveniência. **[PENDENTE]** Registrar imagens e medidas exatas após validação visual de cada módulo no mesmo Workspace.

### 7.7. Fidelidade visual e funcional

Fidelidade visual significa que o produto renderizado mantém composição e estados próprios, ainda que cada módulo use uma moldura de trabalho diferente. As verificações estão em **8.5** e **8.7**.

### 7.8. Política de alterações de design

**[PROPOSTO]** Cada mudança do front-end de um módulo terá registro:

```text
MUDANÇA UI-<módulo>-NNN
- Tipo: correção de regressão | nova funcionalidade | ajuste visual | responsividade
- Referência homologada: caminho/hash/captura
- Área(s) e ID(s) de componente afetado(s)
- Antes → Depois (CSS/DOM/comportamento)
- Impacto em desktop/tablet/mobile e standalone/Workspace
- Impacto no JSON de tela: nenhum | campos editados explícitos
- Testes e capturas anexadas
- Status: proposto | aprovado | implementado | testado | homologado
```

**Não confundir o estado de uma ficha de UI com `schemaVersion` do contrato JSON (se mantido após revisão)**. Uma mudança de padding do Fluxo não muda a versão do contrato das telas. Uma alteração de estrutura dos IDs de navegação pode exigir migração de JSON, mesmo que o visual do Fluxo continue idêntico.

---

## 8. Validação, testes e homologação

### 8.1. Critérios gerais de aceitação

1. **Troca da prévia:** a mesma tela renderiza em Mobile/Desktop na Jornada e na prévia do Fluxo, com o mesmo ID e sem perdas de composição.
2. **Interação local:** abrir o menu na Jornada altera somente o estado de prévia; não segue a rota para outra tela.
3. **Edição do Fluxo:** alterar a conexão de um botão para outro destino modifica a relação identificada e sobrevive à exportação e importação na Jornada.
4. **Atualização compartilhada:** mudar o CSS da definição de menu por ID, escolhendo _todas as telas carregadas_, modifica os contratos pertinentes; ao importá-los no Fluxo/Protótipo a alteração visual é reconhecida. Instâncias excepcionais permanecem identificadas.
5. **Sem sincronização oculta:** uma tela em outro navegador ou arquivo fora do pacote não muda até receber os JSONs atualizados.
6. **Múltiplos estados:** duas condições de Home mudam itens/ações sem criar nova tela ou um novo componente lógico.
7. **Banco consolidado:** ao reunir várias telas de cadastro, campos lógicos com mesmo `campoRef` são deduplicados e a origem fica rastreável; campos sem referência aparecem como pendências.
8. **Ciclo sem perdas:** importar/exportar por qualquer módulo preserva o conjunto canônico aprovado e as extensões válidas, mesmo quando o motor não as utiliza.

**Próxima decisão de homologação:** testar primeiro uma Home e um menu compartilhado em duas telas, uma conexão de Fluxo, uma notificação e um cadastro em etapas. Esses quatro casos exercitam quase todas as relações novas sem exigir a construção prévia dos motores.

---

### 8.2. Validação funcional por módulo

#### Jornada

- Organiza telas por classificação e ordem declaradas, sem inferir sequência de conexões.
- Renderiza tela fielmente de HTML/estrutura + CSS + componentes do JSON.
- Permite abrir/fechar menu ou outra interação **interna** declarada.
- Bloqueia navegação **externa** à prévia e operações reais de negócio.
- Exporta alterações reais feitas no contrato e preserva todos os demais blocos.

#### Fluxo

- Mostra cartões de tela e um grafo de relações distintas da sequência da Jornada.
- Permite mudar conexões sem alterar identidade de tela/componente.
- Edição de uma relação atualiza o JSON exportado, com IDs e referências coerentes.
- Não gera automaticamente um destino ou condição faltante.
- Importar o contrato modificado em outro módulo mantém a edição, sem requerer sincronização em tempo real.

#### Protótipo

- Reutiliza a mesma base visual, configurações de estado e variantes.
- Executa navegação simulada de acordo com as relações explícitas.
- Aplica mocks por cenário identificado, sem acessar produção por engano.
- Preserva o contrato ao exportar; não transforma dados simulados em dados reais.

#### Verificações transversais

- Mesmo componente lógico em duas telas possui ID coerente; instâncias possuem IDs distintos.
- Estados e variantes preservam seus IDs e condições.
- Ciclo importar/exportar não perde campos desconhecidos do módulo.
- Diferenças de HTML/CSS sob o mesmo ID são detectadas, não mescladas silenciosamente.
- Campos migrados têm versão e documentação; JSON antigo recebe tratamento explícito.

### 8.3. Validação da estrutura JSON

Validar a integridade de identidades, contratos, referências, estrutura visual, campos preservados e ausência de migração silenciosa. Casos de teste estão em **8.1**, **8.2** e **8.5**.

### 8.4. Testes de identidade e referências

Testar IDs canônicos de tela, componente, instância e relação; referências ausentes e IDs duplicados devem produzir pendências explícitas. As regras aparecem em **5.1** e **8.1**.

### 8.5. Testes de importação/exportação

1. **Teste de dados:** os campos canônicos acordados, IDs, referências, HTML/CSS da tela, estados e mocks sobrevivem à importação/exportação mesmo que um módulo não os exiba.
2. **Teste funcional do módulo:** ações de importar/exportar continuam disponíveis na barra/painel contextual definido e continuam trabalhando após mudança de motor.
3. **Teste visual do módulo:** shell global, canvas, cartões, modais e componentes respeitam o layout homologado.
4. **Teste visual da tela renderizada:** abrir a mesma tela em Jornada, Fluxo e Protótipo preserva aparência e estados aplicáveis; a moldura/editor pode ser diferente.
5. **Teste de isolamento:** alterar estilos de um componente do editor **não** altera o CSS do produto, e editar a definição `menu.drawer.padrao` **não** muda os menus dos editores.
6. **Teste de edição multi-tela:** alterações em um componente de produto propagadas explicitamente por ID devem modificar o conjunto pretendido de JSONs, com diff, aviso de variantes e possibilidade de desfazer/rollback; não dependem de sincronização automática.

### 8.6. Testes de fidelidade visual

Conferir o shell e cada módulo em diferentes viewports, e a mesma tela do produto em Jornada/Fluxo/Protótipo sem vazamento de CSS. Procedimentos em **8.5** e **8.7**.

### 8.7. Checklist de homologação

**[PROPOSTO COMO PROCEDIMENTO DE VALIDAÇÃO]**

1. Aprovar primeiro o **menu padrão do index** e a finalidade de cada subitem; capturar estado expandido, recolhido e seleção ativa.
2. Para cada módulo, documentar a tela principal, painéis temporários, ações, modos e suas necessidades de espaço.
3. Comparar o desenho proposto com a funcionalidade desejada: remover controles redundantes, não ações essenciais.
4. Registrar evidências visuais e funcionais ao alterar interfaces homologadas. Qualquer mudança deve demonstrar a preservação das capacidades aprovadas e identificar diferenças intencionais.
5. Testar visualização em desktop/tablet/mobile, foco/teclado, rolagem e prévia de telas isolada do CSS do editor.
6. Testar os subitens e os itens dinâmicos do menu com dados reais e com lista vazia.
7. Testar operações de edição/exportação com identificação explícita de objetos e registros de conflito.
8. Somente após aceitação funcional e visual definir organização final de CSS e refatoração de motor.

#### Evidências de design a inserir depois

| Cena                         | O que a imagem deve comprovar                                              |
| ---------------------------- | -------------------------------------------------------------------------- |
| Index inicial                | Header, menu global e área principal                                       |
| Fluxo — Campos utilizados    | Consulta do JSON dentro do mesmo módulo                                    |
| Fluxo — Visualização         | Nós, conexões e prévia em área ampla                                       |
| Jornadas — Campos utilizados | Árvore/inspeção do contrato                                                |
| Jornadas — Visualização      | Galeria por jornada e lista dinâmica                                       |
| Protótipo — Interativo       | Dispositivo com controles contextuais sem painéis permanentes concorrentes |
| Banco — Modelagem            | Campos, entidades, operações e rastreabilidade às telas                    |

**[PENDENTE]** Anexar imagens com data, estado, viewport e indicação de quais elementos estão homologados. A ausência de imagem não libera invenção de medidas.

### 8.8. Pendências e sequência de aprovação

#### Pendências a homologar antes de consolidar o schema

1. **Estrutura fina de estados e variantes de componentes:** onde morarão seleção inicial, estados por instância, condições e variações de listas. Respeitar primeiro o que já existe em `estados`, `componentes` e `variantes`.
2. **Modelo de interação local:** distinção concreta entre `alterar_estado_local`, `exibir_overlay`, `substituir_itens` e `navegar`, sem atrelar o formato ao motor de Jornada.
3. **Pacotes intermodulares:** exportação/importação de uma tela versus conjunto de telas e manifesto derivado.
4. **Grafo de Fluxo:** transições envolvendo múltiplas ocorrências da mesma tela, estados internos, condições e bifurcações.
5. **Identidade compartilhada:** estratégia para detectar divergência entre cópias embutidas do mesmo componente, sem exigir dependência de arquivo externo.
6. **Mocks:** contrato mínimo do cenário, referências a dados, seleção de estados e efeitos simulados.
7. **Possíveis divergências entre nome físico e identidade interna:** resolver mapeamento `arquivo → chave raiz <telaId>` antes de migrar/renomear.
8. **Tratamento de contratos externos:** se um importador aceitar estrutura de ID diferente de `<telaId> → { tela, componentes }`, exigir mapeamento explícito, validação e transformação sem perda. Esse formato de entrada não altera o padrão canônico.

Até essas decisões serem aprovadas, **não** tornar os exemplos deste documento campos obrigatórios de produção.

#### Pendências de direção e sequência de homologação

1. **Homologar a direção do index:** sidebar, registro de módulos, nomenclatura e hierarquia dos subitens, seleção e responsividade.
2. **Homologar o Fluxo como módulo único:** Campos utilizados + Visualização do fluxo; assegurar que árvore de campos e operações do grafo não se confundam.
3. **Homologar Jornadas:** Campos utilizados + Visualização de jornadas; cada jornada real vira subitem dinâmico, sem duplicação de menu.
4. **Homologar Protótipos:** Campos utilizados + Protótipo interativo; controles de modo, roteiros e cenários visíveis somente quando úteis.
5. **Definir Banco e Contrato/Catálogo por tarefa de usuário**, sem inventar editor ou tabelas antes de saber o que deve ser mostrado e editado.
6. **Analisar telas e relações reais:** classificação, composição, ramificações, dados e operações necessárias para o Banco.
7. **Revisar contratos JSON:** eliminar redundâncias documentais e adotar somente campos que representem informações necessárias; registrar migração se houver quebra.
8. **Somente depois adaptar motores** com testes de navegação, fidelidade visual e troca de contratos.

> **Síntese:** um shell/index, módulos registrados, subitens por funcionalidade, itens dinâmicos por ID e interfaces internas orientadas às tarefas. A documentação define a estrutura de chegada; código e JSON final devem segui-la, não o contrário.

---

## 9. Casos de aplicação e evidências

Esta seção reúne exemplos técnicos e casos de verificação do **padrão definido neste documento**, sem criar uma fonte paralela de regras. Quando um exemplo e uma decisão homologada divergirem, prevalece a decisão; a divergência deve ser registrada como pendência, sem correção silenciosa de contratos.

### 9.1. Home Advogado — caso de aplicação do contrato

A Home Advogado é um caso representativo para verificar o encaixe entre identidade, composição, componentes, estados, participações, relações e prévia. **O caso não substitui a validação em telas de natureza diferente.**

| Aspecto a validar          | Representação esperada                                | Critério de aceitação                                      |
| -------------------------- | ----------------------------------------------------- | ---------------------------------------------------------- |
| Identidade lógica          | Chave raiz `advogado.home`                            | A mesma tela conserva seu ID em todos os módulos           |
| Macroestrutura             | `tela` e `componentes` dentro da chave raiz           | Instâncias/referências não se confundem com definições     |
| Classificação              | Domínio, público, escopo e participações              | Não criar jornadas a partir do nome do arquivo             |
| Composição                 | Componentes nos slots, pais e ordem declarados        | A prévia preserva hierarquia visual e responsividade       |
| Componentes compartilhados | Definições com ID próprio e instâncias por tela       | Alterações por escopo não se propagam silenciosamente      |
| Estados e variantes        | Alternativas e condições explícitas                   | Diferentes estados não exigem contratos de tela duplicados |
| Relações de navegação      | IDs de origem, destino, gatilho e condição            | Fluxo representa apenas relações declaradas                |
| Simulação                  | Cenários de mock com dados e resultados identificados | Protótipo não executa operações reais por engano           |
| Interoperabilidade         | Importação/exportação preserva os blocos não editados | Mesmo contrato mantém suas referências entre módulos       |

**Exemplo funcional:** a tela pode apresentar opções diferentes do menu conforme condição de OAB ou sessão. A condição, o estado e a variante precisam ser declarados; a autorização de negócio não nasce da ocultação de itens na UI. A Jornada pode demonstrar abertura/fechamento do menu; o Fluxo pode representar transições declaradas; o Protótipo pode executar cenários simulados. Cada módulo tem finalidade própria.

**Cobertura adicional obrigatória:** testar também cadastro em etapas, tela reutilizada em duas jornadas, decisão com múltiplos caminhos, componente compartilhado entre telas, cenário de erro e vínculos de dados de Banco. Uma única Home não comprova todas as capacidades do contrato.

### 9.2. Exemplo de referência entre tela, instância e componente

**[EXEMPLO ESTRUTURAL]** O ID da tela é a chave raiz. `tela.componentes` identifica referências/instâncias e `componentes` externo contém as definições necessárias à montagem autocontida.

```json
{
  "advogado.home": {
    "tela": {
      "identidade": {
        "tipo": "tela",
        "namespace": "advogado",
        "nome": "Home Advogado",
        "versao": "1.0.0"
      },
      "componentes": {
        "instanciasRefs": {
          "screen.drawer": "menu.drawer.padrao"
        }
      },
      "estrutura": {
        "html": {
          "composicao": {
            "screen.drawer": {
              "componenteRef": "menu.drawer.padrao",
              "paiRef": "layout.root",
              "slot": "menu",
              "ordem": 40
            }
          }
        }
      }
    },
    "componentes": {
      "menu.drawer.padrao": {
        "identidade": {
          "tipo": "componente",
          "namespace": "menu",
          "nome": "Menu lateral compartilhado",
          "versao": "0.1.0"
        },
        "estrutura": { "html": {}, "css": {} }
      }
    }
  }
}
```

**Limites do exemplo:** este fragmento não é o JSON integral. As chaves internas `instanciasRefs`, `composicao`, `paiRef` e `slot` continuam em avaliação. Um componente reutilizado conserva o ID lógico da definição, enquanto a instância de cada tela mantém identificação própria, dados e estados contextuais. O contrato exportado deve conter todas as definições visuais necessárias para montar aquela tela isoladamente.

### 9.3. Casos de validação funcional e de interoperabilidade

Os casos seguintes devem produzir evidência visual e contratual; não basta que o JSON seja sintaticamente válido.

1. **Nova tela no conjunto:** carregar contrato identificado; mostrar sua referência na disponibilidade dos módulos pertinentes sem fabricar participação ou conexão. Confirmar estado vazio quando faltarem relações.
2. **Jornada dinâmica:** adicionar, retirar e reordenar participações com IDs próprios; verificar submenus derivados de `jornada.id` e `subjornada.id`, mantendo uma única identidade de tela.
3. **Composição de tela:** renderizar HTML/CSS com componentes e instâncias, inclusive estados de viewport, sem depender de ações ou mocks para exibir a estrutura básica.
4. **Interação interna:** abrir menu, alternar aba ou exibir modal na prévia da Jornada sem executar saída para outra tela ou operação real de negócio.
5. **Edição de Fluxo:** modificar relação declarada de `A → B` para `A → C`, preservando IDs e condições pertinentes, exportar e reimportar; verificar que a Jornada não reordena suas participações por causa dessa alteração.
6. **Decisão e estado:** representar bifurcação e transição de estado na mesma tela com vínculos explícitos; sinalizar condição indefinida sem supor destino.
7. **Protótipo por cenário:** escolher mock identificado e simular estados e resultados, sem alterar dados canônicos nem chamar produção.
8. **Banco rastreável:** relacionar campos lógicos, entidades e operações declaradas às telas consumidoras/produtoras; marcar lacunas sem inventar tabelas ou endpoints.
9. **Componentes compartilhados:** editar apenas uma instância e depois a definição comum; verificar escopos distintos, conflitos de versão, preservação de customizações e exportação explícita das telas impactadas.
10. **Idempotência de importação/exportação:** preservar campos não tocados, referências, CSS, estados e mocks; identificar IDs duplicados, destinos faltantes e versões incompatíveis.
11. **Navegação do Workspace:** confirmar menu global único, subitens selecionáveis, painéis específicos e ausência de cabeçalhos globais duplicados em cada módulo.
12. **Documentos Base:** validar índice, seleção de subitens e abertura de documentos autocontidos na área principal sem criar sidebar global própria.
13. **Mapa de Interações:** identificar origem por `telaId`/`acaoId`, evento, operação, efeito, estados e destinos; não confundir rastreamento de evento com conexão desenhada no Fluxo.
14. **Contato:** concluir sua ficha funcional antes de testar fluxos concretos; não atribuir por padrão formulários ou integrações não especificadas.

**Registro de falhas:** qualquer divergência deve apontar o módulo, o item, a referência de dado, o comportamento esperado, o resultado encontrado e o status de homologação. Não corrigir automaticamente valores de contratos como efeito colateral de uma visualização.

### 9.4. Evidências visuais e rastreabilidade de aprovação

**[PENDENTE]** Anexar evidências do index, menu expandido/recolhido, Fluxo, Jornadas, Protótipos, Banco e dos demais módulos conforme suas fichas sejam definidas.

Cada evidência deve registrar:

- **Contexto:** módulo, subitem, item dinâmico quando houver, ID da tela/instância e cenário relevante.
- **Viewport e interação:** tamanho de tela, modo Mobile/Desktop, estados e passos executados.
- **Resultado visual:** composição do shell, posicionamento de controles, área principal e isolamento do CSS da tela simulada.
- **Resultado contratual:** campos, referências, versões e alterações efetivamente exportadas ou preservadas.
- **Status da aprovação:** decidido, proposto, pendente ou homologado, com critérios de aceite e lacunas remanescentes.

**Princípio:** o documento descreve requisitos e decisões de produto; as evidências demonstram se a implementação os atende. Uma captura visual não torna automaticamente obrigatórias medidas, classes CSS, nomes de arquivo ou comportamento que não tenham sido definidos.
