# AdvogadoJá — Direção Canônica, Padrão Universal de Telas e Componentes e Contratos JSON

**Documento consolidado de referência · Versão editorial 1.0 · 19/11/2026**  
**Estado:** especificação de trabalho, com regras definidas, exemplos demonstrativos e pontos abertos explicitados; **não** é homologação de produção.  
**Abrangência dos módulos nesta revisão:** **Tela, Jornadas, Fluxo e Protótipo**.

> **Nota essencial.** A `advogado.home` é **somente um modelo preenchido** para verificar se a estrutura do contrato cobre composição, propriedades, estados, variantes, navegação, interações e exemplos de dados. A sua inclusão **não** aprova rotas de produção, OAB, permissões, serviços, banco ou comportamento final da Home.

## Sumário

1. [Direção geral e fundamentos](#1-direção-geral-e-fundamentos)
2. [Projeto e organização geral](#2-projeto-e-organização-geral)
3. [Módulos — definições, padrões e funcionalidades](#3-módulos--definições-padrões-e-funcionalidades)
4. [Contrato JSON canônico](#4-contrato-json-canônico)
5. [Relações, composição e comportamento](#5-relações-composição-e-comportamento)
6. [Dados, interoperabilidade e evolução](#6-dados-interoperabilidade-e-evolução)
7. [Padrões visuais e experiência de uso](#7-padrões-visuais-e-experiência-de-uso)
8. [Validação, testes e homologação](#8-validação-testes-e-homologação)
9. [Casos de aplicação e evidências](#9-casos-de-aplicação-e-evidências)

### Como ler as decisões

| Marcador         | Significado e alcance                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| **[DEFINIDO]**   | Direção expressa e preservada na presente consolidação.                                                            |
| **[OBSERVADO]**  | Informação comprovável nos materiais inspecionados; não equivale a regra geral.                                    |
| **[EXEMPLO]**    | Valor demonstrativo usado para validar forma, não regra de produção.                                               |
| **[PROPOSTO]**   | Alternativa de modelagem ou comportamento que ainda precisa de aceite.                                             |
| **[ABERTO]**     | Lacuna ou escolha sem decisão expressa; não deve ser preenchida por suposição.                                     |
| **[HOMOLOGADO]** | Reservado a evidência de aceitação funcional/visual; esta versão não atribui esse status a motores ou telas reais. |

**Regra de precedência:** a decisão explícita posterior do usuário vale sobre redações antigas. Em particular, a revisão V0.10 do modelo de referência supera as estruturas antigas do README V6.1 e dos documentos V2 **onde existir contradição**, sem apagar o registro histórico dessas diferenças. Uma mudança do exemplo de Home não é uma mudança automática de todas as telas.

## 1. Direção geral e fundamentos

### 1.1. Finalidade

**[DEFINIDO]** Documentar um **único padrão de modelagem** de telas e componentes que possa alimentar as interfaces de **Tela, Jornadas, Fluxo e Protótipo** sem reescrever a mesma informação para cada módulo.

A sequência de projeto é: **necessidade funcional e visual → definição de telas/componentes → IDs e campos necessários → vínculos e contrato JSON → interfaces consumidoras → motores**. Não se deve adaptar o contrato a um motor antigo antes de definir o que a tela precisa representar.

Este documento reúne: diretrizes do Projeto de trabalho, funções dos quatro módulos, organização dos contratos, dicionário de campos, relações, estados e variantes, consumo dos dados e critérios de teste. Não pretende criar o aplicativo, desenhar um backend, homologar uma Home, produzir os motores nem fixar API/serviços.

### 1.2. Princípios canônicos

1. **Fonte única para cada informação.** A mesma informação não deve existir em dois campos independentes. Índices e visualizações podem ser derivados dos contratos, mas não se tornam outra autoridade.
2. **Identificação estável.** Telas, componentes, instâncias e objetos referenciáveis possuem IDs próprios nos escopos que realmente os exigirem. Alterar nome visível ou ordem não cria um segundo ID para a mesma tela.
3. **Sem campos por inércia.** Todo bloco precisa ter responsabilidade demonstrável. `participacoes`, `moduloRef`, `escopo`, `secao` e `conteudo.instancias` **não** retornam ao padrão apenas por constarem de documentos anteriores.
4. **Separação entre estrutura e comportamento.** A composição visual declara o que existe; estados/variantes declaram diferenças; navegação declara deslocamentos reais; eventos e ações representam o que o usuário faz.
5. **Mesmo objeto, múltiplas apresentações.** Alterar estado, variante, viewport ou cenário **não** cria outra tela nem uma cópia integral do componente.
6. **Composição por instância.** Cada instância referencia uma definição de componente e recebe propriedades em `props`. Não é necessário um segundo bloco global de `conteudo` para repetir os mesmos valores.
7. **Compartilhamento explícito e verificável.** Módulos consultam um conjunto de contratos com IDs compatíveis. Não há sincronização silenciosa entre arquivos separados.
8. **Dado é diferente de mock.** Valor ilustrativo, estado escolhido para prévia e autenticação/autorização de produção pertencem a responsabilidades distintas.
9. **Preservação integral.** Um módulo que só edita fluxo não pode excluir os CSS, as props ou os mocks que não consome.
10. **Modelos de exemplo não homologam produto.** Um contrato usado para conferir o schema pode conter textos, estados e destinos hipotéticos explicitamente rotulados.

### 1.3. Identidade única e decisões de precedência

**[DEFINIDO para o modelo V0.10]** O objeto de tela declara `tela.identidade.id`; o de componente declara `componente.identidade.id`. Quando existir um mapa/indexador externo como `telas["advogado.home"]`, a chave **deve coincidir** com o ID interno. Esse índice **não cria uma nova identidade**, mas facilita o acesso. Não criar aliases para supostamente reconciliar outra Home sem prova de equivalência.

**[HISTÓRICO]** O README V6.1 e o glossário antigo em `documento (31).json` descrevem `<telaId> → {tela, componentes}` com ID apenas na chave externa. O texto complementar em `documento (33).json` registra a alternativa de `identidade.id`. Neste documento, a forma da **V0.10** é a referência de trabalho, pois foi a revisão posterior adotada como modelo. Migrações de formatos anteriores requerem mapeamento explícito; não alterar identificadores em massa.

### 1.4. Ordem de trabalho

1. Descrever a finalidade de cada tela e seu resultado visual e funcional.
2. Mapear os componentes que aparecem, incluindo suas instâncias e variações necessárias.
3. Conferir o conjunto mínimo de IDs, propriedades, estados, dados, interações e navegação.
4. Consolidar campos no JSON sem duplicar informação e sem inventar vínculos ausentes.
5. Testar **Tela**, **Jornadas**, **Fluxo** e **Protótipo** com um mesmo conjunto de contratos, antes de refazer motores.

### 1.5. Fronteiras do contrato

**Cabe ao JSON:** identidades, composição, HTML/CSS declarativos, props, vínculos, relações e condições referenciadas, estados e variantes, descrição das operações e mocks quando existirem.

**Cabe à documentação externa:** intenção de produto, política geral de UX, estrutura dos editores, manual de nomenclatura, histórico de homologações e critérios de aceitação.

**Cabe ao motor e integração técnica:** renderização, acesso a dispositivos, autenticação, execução de chamadas, transações e política real de autorização, obedecendo à especificação. O contrato **não** contém funções JavaScript arbitrárias a executar.

---

## 2. Projeto e organização geral

### 2.1. Projeto único e três níveis de interface

A organização de trabalho distingue três camadas, sem misturá-las:

| Camada                         | O que define                                                                                           | O que não pode assumir                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| **Projeto/index**              | Entrada única, shell, menu lateral, área principal e seleção de módulo.                                | Não é fonte de dados das telas e não decide a regra de negócio do produto. |
| **Módulo de trabalho**         | Ferramentas próprias para editar uma Tela, organizar Jornadas, construir Fluxos ou simular Protótipos. | Não deve repetir header/sidebar global nem contaminar o CSS do produto.    |
| **Tela/componente do produto** | Contrato com estrutura, propriedades, estados e conexões necessários ao app.                           | Não deve conter organização do menu do editor ou ferramentas do workspace. |

O motor/adaptador interpreta essas três camadas, mas **não é uma quarta fonte de requisitos**.

### 2.2. Navegação principal do Projeto

Nesta consolidação, o menu funcional documentado tem **quatro módulos**; isso **não** significa que outros domínios citados no README antigo estejam abolidos do projeto maior, apenas que **não entram no escopo da seção 3 neste momento**.

```text
PROJETO / INDEX
├── Cabeçalho global
├── Menu lateral
│   ├── Tela
│   │   ├── Campos utilizados / contrato
│   │   └── Definição e composição da tela
│   ├── Jornadas
│   │   ├── Campos utilizados
│   │   └── Visualização de jornadas
│   ├── Fluxo
│   │   ├── Campos utilizados
│   │   └── Visualização / edição do fluxo
│   └── Protótipo
│       ├── Campos utilizados
│       └── Simulação / apresentação
└── Área principal compartilhada
    ├── Contexto do módulo selecionado
    ├── Barra contextual (se necessária)
    └── Interface de trabalho do módulo
```

**[PROPOSTO]** Os nomes exatos dos subitens do módulo Tela ainda precisam refletir a interface aprovada. O restante do desenho é diretriz funcional, **não** manifesto de menu definitivo nem regra de schema da tela.

### 2.3. Responsabilidades do shell

- **Header global**: marca e poucas ações comuns; não duplicar cabeçalhos específicos dos editores.
- **Sidebar única**: lista os módulos e seus subitens; usa IDs declarados, sem presumir pastas ou rótulos como identidade.
- **Área principal**: ocupa o espaço disponível, preserva a interface própria de cada módulo.
- **Ações contextuais**: importar, exportar, editar, selecionar dispositivo ou cenário, conforme o módulo.
- **Painéis temporários**: propriedades, detalhes, condições, mocks e mensagens podem ser recolhíveis ou modais.
- **Responsividade e acessibilidade**: navegação por teclado, foco, feedback, contraste, rolagem, mobile e desktop.

### 2.4. Organização lógica de dados e arquivos

```text
projeto/
├── index / workspace                 # shell e registro de módulos
├── modulos/
│   ├── tela/                         # inspeção, composição e edição da tela
│   ├── jornadas/                     # consulta e sequência editorial
│   ├── fluxo/                        # grafo e conexões editáveis
│   └── prototipo/                     # simulação e cenários
├── biblioteca/
│   └── ui_library/conteudo/
│       ├── telas/                    # contratos/definições de telas
│       └── componentes/              # definições reutilizáveis
├── data/                             # configuração de cada módulo, se pertinente
└── documentos/                       # direção, decisões e evidências
```

**[EXEMPLO CONCEITUAL]** A árvore acima atribui responsabilidades; não impõe mudança física imediata no repositório. Para um módulo específico, o uso de `data` e a estrutura existente do construtor devem obedecer às regras já estabelecidas para esse ambiente. Não substituir caminhos reais apenas porque a árvore documental é mais bonita.

### 2.5. Dinamismo, importação e edição

Jornadas, subjornadas, roteiros e telas são listados por **IDs e dados efetivamente carregados**, e não por regex do nome de arquivo ou arrays fixos no HTML. Mudar a seleção do módulo altera a interface ativa; **não altera** o contrato de tela. Editar uma propriedade do JSON é uma operação distinta, com confirmação ou exportação apropriada.

Ao incluir uma tela válida no conjunto de trabalho, os módulos podem passar a conhecê-la por seu ID. Isso não cria, por si só, posição em Jornada, conexão no Fluxo nem cenário no Protótipo. A presença no catálogo e o vínculo editorial/conectivo são conceitos distintos.

---

## 3. Módulos — definições, padrões e funcionalidades

Esta seção documenta **somente quatro módulos: Tela, Jornadas, Fluxo e Protótipo**. Para cada um são especificados finalidade, padrão de apresentação, leitura e edição de dados, interações permitidas, saída e critérios mínimos de aceitação. Outros módulos históricos não são renomeados nem excluídos do projeto maior; simplesmente **não recebem definição funcional nesta seção**.

### 3.1. Padrão comum das fichas dos módulos

| Item da ficha           | Pergunta que deve responder                                              |
| ----------------------- | ------------------------------------------------------------------------ |
| Identidade e finalidade | Qual o ID do módulo de trabalho, e para que serve?                       |
| Subitens                | O que o usuário abre e executa, sem duplicar o index?                    |
| Padrão visual           | Há árvore, galeria, fluxograma, simulação ou editor específico?          |
| Dados lidos             | Quais blocos do contrato consome para sua finalidade?                    |
| Dados editáveis         | Quais campos pode alterar e exportar explicitamente?                     |
| Interações              | Quais controles mudam a interface; quais efeitos são apenas simulados?   |
| Erros e ausência        | Como representa ID ausente, incompatibilidade, dados vazios ou conflito? |
| Entrada/saída           | Como importa, exporta e preserva campos não consumidos?                  |
| Aceitação               | Quais comportamentos e vistas devem ser verificados?                     |

**Regra comum:** cada módulo conserva sua UI de trabalho e consome a mesma identidade de tela/componente; **não** possui um JSON concorrente para redefinir o conteúdo do produto.

### 3.2. Tela — contrato, composição e inspeção

**Finalidade [DIREÇÃO ADOTADA]:** trabalhar com **uma tela identificada** para examinar e definir estrutura, componentes, propriedades, estados, variantes, interações, ações e referências de navegação, sem exigir que o construtor, a Jornada ou o Fluxo criem esses dados por dedução.

**O que mostra:** identificação da tela; árvore do contrato; composição hierárquica das instâncias; árvore da definição de cada componente; valores de `props`; vínculos entre elementos e propriedades; estados/variantes; referências de dados e navegação, quando existentes; prévia visual do mesmo JSON.

**O que pode permitir:** importar e selecionar tela, inspecionar e comparar campos, editar valores declarados, adicionar/remover/reordenar instâncias, configurar props, criar ou ajustar referências coerentes, verificar integridade e exportar o contrato **completo**. Edição e prévia são operações diferentes; visualizar um estado não altera permanentemente a definição.

**Limites:** não presume que editar um texto cria nova tabela, rota, estado ou serviço. Não cria funcionalidades específicas de uma Home por parecerem plausíveis. A Tela não substitui a autoria conectiva do Fluxo ou a montagem da sequência da Jornada.

**Padrão mínimo de apresentação:** árvore da tela primeiro; a seguir as árvores dos componentes, por ID; pesquisa e expansão/recolhimento; indicação de referências resolvidas/não resolvidas; prévia separada do editor; exportação em JSON sem descartar campos.

**Critérios TELA:** `TEL-01` carregar tela e seus componentes por ID; `TEL-02` localizar instâncias e props; `TEL-03` editar uma props sem alterar outra instância; `TEL-04` verificar refs quebradas; `TEL-05` preservar CSS, estados, rotas e mocks ao exportar; `TEL-06` distinguir modelo de exemplo de contrato de produção; `TEL-07` visualizar mesma composição em Jornadas e Fluxo.

### 3.3. Jornadas — organização e apresentação editorial

**Finalidade [DEFINIDA no README de origem]:** selecionar, agrupar, ordenar e apresentar telas por jornada/subjornada com prévia fiel. **Jornada não é Fluxo.** Sua ordem editorial não equivale a destino navegável, e uma tela pode reaparecer sem ganhar outro ID.

**Dados principais de leitura:** `identidade`, `classificacao.jornadas`, `estrutura`, componentes e suas props, CSS, estados/variantes relevantes à prévia. A Jornada preserva navegação, dados de operações e mocks não utilizados.

**Interface esperada:** seleção dinâmica de jornada, subjornada e tela; filtros por nome/ID; modo sequencial/grade/individual quando aprovado; alternância Mobile/Desktop; galeria ou molduras de tela; modal de detalhes; importação e exportação. Não instalar a sidebar global de novo dentro desse módulo.

**Interação permitida na prévia:** abrir/fechar menu, acordeão, modal local, aba interna, seleção visual de estado e outros efeitos **na mesma tela**, se estiverem declarados. **Não** seguir rotas para outras telas nem executar pagamentos, persistência real, consultas de produção ou autenticação.

**Edição:** pode inserir/retirar/reordenar vínculos editoriais declarados, quando previsto pelo contrato; não transformar a posição da galeria em conexão. O mecanismo de vínculo editorial mínimo é `classificacao.jornadas[]` no modelo V0.10; ordem de ocorrências e múltiplas jornadas exigem especificação quando o caso efetivamente aparecer.

**Critérios JRN:** `JRN-01` selecionar jornada/subjornada por ID; `JRN-02` manter uma única identidade para a mesma tela; `JRN-03` alternar dispositivos preservando CSS; `JRN-04` abrir detalhes com contrato integral; `JRN-05` executar apenas interação local segura; `JRN-06` preservar alterações editoriais exportadas e todos os campos não editados; `JRN-07` validar galeria vazia e novas jornadas dinâmicas.

### 3.4. Fluxo — relações e conexões editáveis

**Finalidade [DEFINIDA no README de origem]:** representar e editar **conexões** entre telas, escolhas, condições, transições declaradas, notificações e estados relevantes no grafo. Fluxo **não** é galeria editorial nem executa a jornada do usuário em produção.

**Dados principais:** `identidade`, prévia de `estrutura`/componentes/CSS, `navegacao`, `interacoes`, `estados`, `variantes` e, quando houver, `acoes`. A ordenação/posição do nó no editor é um metadado de visualização do Fluxo, não destino de navegação.

**O que mostra:** tela ou ocorrência como nó; conectores explícitos; origem/destino e seus IDs; pontos conectivos; alternativas, condições e consequências declaradas; indicadores de vínculos inexistentes; modal de prévia com a **mesma tela** vista na Jornada.

**O que edita:** criar, remover, reconectar ou ajustar relações, condições e pontos conectivos **quando o contrato representar essas operações**; manter os IDs de objetos não alterados; atualizar e exportar as referências correspondentes. Não deduzir conexão do rótulo de botão, do nome do arquivo ou da ordem na galeria.

**Distinção importante:** o estado `OAB pendente` ilustrado pela Home **não significa** estar pendente de entrar nela. A resolução de um estado interno pode alterar a mesma tela sem virar uma rota falsa, uma tela adicional ou um botão de menu inexistente. Quando uma transição local também interessar ao diagrama, isso deve ser expresso de forma semanticamente distinta de navegação entre telas.

**Critérios FLX:** `FLX-01` montar grafo por IDs/relações reais; `FLX-02` conectar A→B e trocar B por C sem alterar ID da tela; `FLX-03` documentar conexão condicional e fallback, quando definidos; `FLX-04` representar notificação sem tratá-la como tela; `FLX-05` preservar estrutura/CSS/mocks no round-trip; `FLX-06` comparar prévia com a Jornada; `FLX-07` mostrar conexão ausente sem inventá-la.

### 3.5. Protótipo — execução simulada de telas e fluxos

**Finalidade [DEFINIDA]:** reutilizar o visual das telas já definido para Jornada/Fluxo e adicionar navegação simulada por relações explícitas, dados de cenários e transições locais, sem executar integração de produção.

**O que mostra:** dispositivo e tela atual; estado e variante em uso; cenário selecionado; ações disponíveis; histórico ou trilha de navegação; feedback de condições não resolvidas. A imagem da tela não deve ser recriada com um HTML concorrente ao contrato canônico.

**Dados principais:** `identidade`, `estrutura`, `componentes`, `navegacao`, `interacoes`, eventuais `acoes`, `estados`, `variantes`, `dados` demonstrativos e `mocks` por cenário. O estado **ativo** da simulação pertence à sessão, não é persistido automaticamente no JSON de definição.

**Comportamentos:** clicar em botão pode mudar um estado local, abrir modal, percorrer uma rota **de simulação** identificada ou registrar um efeito simulado. Se o contrato não possuir destino ou condição, o protótipo exibe a falta de definição ou sinaliza um resultado explicitamente hipotético; não escolhe por conta própria.

**Critérios PRT:** `PRT-01` alternar cenários mantendo o mesmo ID de tela; `PRT-02` consumir exatamente o conteúdo de `props`; `PRT-03` percorrer apenas relações explícitas; `PRT-04` não chamar serviços reais; `PRT-05` preservar dados canônicos; `PRT-06` manter equivalência visual com Jornada e Fluxo; `PRT-07` permitir reiniciar sessão sem reescrever o arquivo.

### 3.6. Matriz comum de leitura e edição

| Bloco do contrato          | Tela             | Jornadas                     | Fluxo                           | Protótipo         |
| -------------------------- | ---------------- | ---------------------------- | ------------------------------- | ----------------- |
| Identidade                 | Inspeciona/edita | Lê                           | Lê                              | Lê                |
| Classificação/Jornadas     | Inspeciona/edita | Lê/edita vínculo editorial\* | Contexto                        | Contexto          |
| Estrutura/instâncias/props | Inspeciona/edita | Renderiza                    | Prévia                          | Renderiza         |
| Componentes/CSS            | Inspeciona/edita | Renderiza                    | Prévia                          | Renderiza         |
| Navegação                  | Inspeciona       | Consulta                     | Lê/edita relações\*             | Executa simulação |
| Estados/variantes          | Inspeciona/edita | Seleção visual local         | Referência/edição declarativa\* | Resolve na sessão |
| Interações/ações           | Inspeciona/edita | Só efeito local seguro       | Referência/edição declarativa\* | Executa simulação |
| Dados/fontes/coleções      | Inspeciona/edita | Apresenta props              | Só contexto                     | Simula valores    |
| Mocks                      | Inspeciona       | Preserva                     | Preserva                        | Seleciona/aplica  |

\*Somente quando a operação de edição correspondente estiver definida e aprovada. **Regra obrigatória:** preservar integralmente os campos não editados.

### 3.7. Integração e limites entre os quatro módulos

**Tela** define o objeto; **Jornadas** organiza sua apresentação; **Fluxo** descreve suas conexões; **Protótipo** simula a experiência. Todos reutilizam os **mesmos IDs e contratos**, com interfaces distintas. A posição do nó de Fluxo, a ordem na galeria, o estado de sessão do Protótipo e a seleção do editor **não** são substitutos de campos operacionais.

Outros módulos mencionados no README antigo, como Banco, Mapa de Interações, Documentos Base e Contato, **permanecem referências históricas de integração futura**. Não os detalhar aqui e não importar suas propostas de campos sem necessidade demonstrada.

---

## 4. Contrato JSON canônico

### 4.1. Responsabilidade e forma do modelo

**[DEFINIDO para o modelo de referência V0.10]** Existem dois tipos de definição: **tela** e **componente**. A tela configura instâncias; o componente descreve uma estrutura reutilizável. Um pacote de trabalho pode indexar ambos em mapas, como `telas` e `componentes`, mas as definições mantêm `identidade.id`.

```text
CONJUNTO / PACOTE V0.10 (exemplo)
├── schema, schemaVersion
├── telas
│   └── <id-da-tela>
│       ├── schema, schemaVersion
│       ├── identidade
│       ├── classificacao
│       ├── estrutura
│       │   ├── html
│       │   │   ├── raizRef
│       │   │   └── composicao
│       │   │       └── <instanciaId>
│       │   │           ├── componenteRef
│       │   │           ├── paiRef, slot, ordem
│       │   │           └── props
│       │   └── css
│       ├── navegacao
│       ├── estados
│       ├── variantes
│       ├── interacoes
│       ├── dados
│       └── mocks
└── componentes
    └── <id-do-componente>
        ├── identidade
        ├── classificacao
        └── estrutura
            ├── html (raizRef, elementos, vinculos, colecoes)
            └── css
```

**O formato de transporte pode variar** (tela unitária, pacote, registro indexado). A autoridade do objeto continua em `identidade.id`; o índice externo, quando existir, deve coincidir. O documento (31) mantém um **formato antigo** que não deve ser imposto como segunda representação obrigatória.

### 4.2. Identidade

- `identidade.id`: identificador estável do objeto (tela ou componente), único no seu escopo.
- `identidade.tipo`: diferencia tela e componente.
- `identidade.namespace`: agrupamento textual quando útil; não justifica `moduloRef` redundante.
- `identidade.nome`, `nomeExibicao`, `descricao`: atributos documentais; não identificam outra tela nem determinam destino.
- `schema` e `schemaVersion`: contrato de leitura e versão do formato, separados da identificação e de eventual versão do objeto.

Não duplicar o ID como outro campo canônico independente; não criar alias para corrigir uma identificação não comprovada. IDs de **elementos**, **instâncias**, **estados** e **relações** também são diferentes da identidade da tela.

### 4.3. Classificação

**[DEFINIDO na referência V0.10]** A classificação de uma tela deve conter apenas informações de organização e localização efetivamente necessárias. Exemplo:

```json
{
  "classificacao": {
    "localizacao": { "caminho": "biblioteca/telas/advogado/home" },
    "jornadas": [
      {
        "jornadaRef": "advogado",
        "subjornadasRefs": ["home", "advogado.pos_home"]
      }
    ]
  }
}
```

**[EXEMPLO]** `advogado`, `home` e o caminho são valores do caso de teste. A inclusão de duas subjornadas ilustra associação editorial e **não prova** duas telas ou dois fluxos reais. Se o caminho físico já puder ser obtido com segurança do índice, não é necessário duplicar o mesmo caminho em outro campo.

**[REMOVIDOS COMO CAMPOS PADRÃO]** `participacoes`, `moduloRef`, `submoduloRef`, `escopo`, `secao` e `participacaoRef`. Os documentos anteriores os descrevem historicamente; não retomá-los sem justificativa funcional clara e nova decisão. Jornada/subjornada **não** é rota. Uma ocorrência da mesma tela em mais de um percurso deverá preservar a identidade e representar o contexto onde ele realmente for necessário.

### 4.4. Estrutura visual da tela

`estrutura.html.raizRef` identifica a instância raiz; `estrutura.html.composicao` lista as instâncias por seus **IDs locais**. Cada instância declara `componenteRef`, `paiRef`, `slot`, `ordem` e, quando necessário, `props`.

```json
{
  "estrutura": {
    "html": {
      "raizRef": "screen.root",
      "composicao": {
        "screen.root": {
          "componenteRef": "advogado.home.layout",
          "paiRef": null,
          "slot": "raiz",
          "ordem": 10
        },
        "screen.titlebar": {
          "componenteRef": "header.titlebar.v01",
          "paiRef": "layout.app",
          "slot": "header",
          "ordem": 20,
          "props": { "titulo": "Início" }
        }
      }
    },
    "css": { "tokens": {}, "regras": {} }
  }
}
```

**[EXEMPLO PARCIAL]** O `paiRef` pode apontar para um elemento/slot exposto pela definição do componente raiz. A resolução deve considerar a árvore de componentes e não apenas as chaves diretas da composição. A identificação concreta do layout é exemplo, não componente obrigatório do schema.

**Não acrescentar** `tela.componentes.instanciasRefs` quando `composicao[instanciaId].componenteRef` já cumpre a mesma função. Não guardar textos de `props` também em `conteudo.instancias`.

### 4.5. Definições de componentes

Cada componente possui `identidade.id`, classificação opcional de localização e `estrutura.html`/`estrutura.css`. Os elementos são identificados, com `tag`, `paiRef`, `ordem`, `atributos` e, quando fizer sentido, `texto`. A definição pode informar `vinculos` entre uma propriedade recebida e um elemento da árvore, além de `colecoes` repetíveis.

```json
{
  "identidade": {
    "id": "header.titlebar.v01",
    "tipo": "componente",
    "nome": "Barra de título"
  },
  "estrutura": {
    "html": {
      "raizRef": "titlebar.raiz",
      "elementos": {
        "titlebar.raiz": {
          "tag": "div",
          "ordem": 10,
          "atributos": { "class": "titlebar" }
        },
        "titlebar.titulo": {
          "tag": "h1",
          "paiRef": "titlebar.raiz",
          "ordem": 20
        }
      },
      "vinculos": [
        {
          "elementoRef": "titlebar.titulo",
          "propriedade": "texto",
          "campo": "titulo"
        }
      ]
    },
    "css": { "regras": {} }
  }
}
```

**[EXEMPLO DE SINTAXE]** O exemplo de `vinculos` usa o campo `campo` para apontar a propriedade da instância, seguindo a estrutura observada na V0.10. No dicionário a seguir, campos exemplificados como `vinculos[]` e `colecoes[]` são descritos por responsabilidade, não por obrigatoriedade universal.

### 4.6. Props e coleções

As `props` são dados e configurações da **instância**, não uma nova definição de componente. Permitem que uma mesma definição renderize textos, contadores, menus e cards diferentes conforme o contexto da tela. Exemplos de listas repetíveis:

```json
{
  "props": {
    "titulo": "Itens de exemplo",
    "itens": [
      { "id": "item.a", "rotulo": "Opção A", "rotaRef": "rota.exemplo.a" },
      { "id": "item.b", "rotulo": "Opção B", "rotaRef": "rota.exemplo.b" }
    ]
  }
}
```

A **estrutura do item-modelo** pertence ao componente; a lista de itens/contexto pertence à instância; o evento ou rota apontado por `rotaRef` deve existir quando se pretender interação real/simulada. Itens estáveis são referidos pelo `id`, nunca apenas pelo índice do array.

### 4.7. CSS, tokens e limites visuais

`estrutura.css.tokens` declara valores de apresentação do contexto; `estrutura.css.regras` declara estilos da tela. A definição de cada componente pode ter suas próprias `estrutura.css.regras`. **Não adicionar** um bloco `estilos` paralelo sem responsabilidade única demonstrada. A semântica de token compartilhado é distinta de ID de componente.

A prévia deve isolar CSS da tela e CSS do editor: `.menu`, `.header` e outros seletores de uma tela do produto não podem alterar o shell. CSS declarado não é uma regra para decidir rotas ou autorizar operações.

### 4.8. Navegação

Na V0.10, `navegacao.rotas[]` representa destinos de navegação **efetivamente declarados** ou comportamento local do tipo `permanecer` que evita deslocamento. Uma entrada aponta para a instância e o elemento de origem, opcionalmente para um item de coleção; o destino aponta para um ID de tela, quando houver.

A criação de um **grafo completo de Fluxo** exige condições, ramificações, pontos conectivos e conexões entre telas quando os casos reais demandarem. O modelo não obriga, por inércia, o reaproveitamento do conjunto antigo de `relacoes[]`, `bifurcacoes[]` e `participacaoRef`, mas o módulo Fluxo **precisa conseguir representar esses conceitos por IDs explícitos**, em uma estrutura a ser refinada sem duplicar destinos.

### 4.9. Estados, variantes e condições

`estados` descreve **quais situações são possíveis e como são resolvidas**; `variantes` descreve **o que muda na apresentação de instâncias/elementos** em uma condição; `interacoes` pode atualizar um estado local. Um estado de negócio de exemplo pode alterar a mesma tela sem produzir rota de navegação.

A referência V0.10 usa `estados.itens`, `estados.dimensoes`, `estados.fallbackSeguro` e `variantes.itens`. Casos de condição podem usar objeto declarativo (`campo`, `operador`, `valor`) ou referência de capacidade (`capacidadeRef`); **o catálogo de operadores permitido e a precedência de regras continuam abertos**, não sendo autorizada avaliação de JavaScript textual.

### 4.10. Interações e ações

`interacoes.eventos` identifica de onde parte a interação, qual tipo de evento/efeito é declarado e quais condições a limitam. Ações reutilizáveis mais complexas podem receber IDs em uma coleção `acoes` **se houver caso real e definição de responsabilidade**. Não criar `acoes` apenas para espelhar uma interação simples já definida nem repetir o mesmo destino em `acoes` e `navegacao`.

### 4.11. Dados e operações

`dados.fontes`, `dados.operacoes` e `dados.persistencia` fazem sentido **quando houver fonte e operação conhecida**. Dados de perfil, capacidades, disponibilidade, solicitações etc. não podem ganhar endpoints, entidade de banco ou autorização por adivinhação. As props de demonstração podem ser estáticas; o contrato deve poder evoluir para fontes dinâmicas com referências explícitas.

### 4.12. Mocks e cenários

`mocks.cenarios` contém conjuntos de **simulação**, identificados e associados a estados/dados de ensaio quando necessário. Não misturar mock com fonte de produção. A existência de cenário não produz outra tela. Mudar cenário no Protótipo não reescreve o JSON canônico sem operação de edição expressa.

### 4.13. Regras de nomenclatura

| Objeto          | Convenção de exemplo            | Critério                                                      |
| --------------- | ------------------------------- | ------------------------------------------------------------- |
| Tela            | `advogado.home`                 | Um ID por tela lógica.                                        |
| Componente      | `ui.advogado.menu.principal`    | Mesmo ID para a mesma definição reutilizada.                  |
| Instância       | `screen.drawer`                 | Única no contexto da tela; referencia um componente.          |
| Elemento        | `menu.item.modelo`              | Único dentro da definição; pode ser item-modelo para lista.   |
| Rota            | `rota.menu.meu_perfil`          | Identifica vínculo navegável ou comportamento local definido. |
| Estado          | `estado.oab.habilitado`         | Situação nomeada; não é destino de tela por si só.            |
| Variante        | `variante.acesso.habilitado`    | Alterações visuais vinculadas a condições.                    |
| Interação       | `evento.menu.abrir`             | Evento declarado com origem e efeito.                         |
| Item de coleção | `menu.inicio`                   | Identidade de item repetível independente da posição.         |
| Mock            | `mock.habilitado.advogado.home` | Cenário de simulação, não regra real de negócio.              |

IDs de exemplo não precisam forçar mudança de IDs já existentes e validados. Nunca criar uma segunda Home por mudança de estado; nunca corrigir um destino incerto por semelhança de nome.

### 4.14. Dicionário de campos da referência V0.10

**Como ler:** os tipos e caminhos abaixo foram extraídos do JSON V0.10; a finalidade foi consolidada das fontes. `Exemplo V0.10` **não significa campo obrigatório**. A obrigatoriedade fina deverá ser definida pelo schema formal em caso de produção. Em especial, `props.*` é específico de cada componente e não deve virar uma lista rígida universal.

| Campo da **tela**                                       | Tipo observado/esperado | Finalidade                                                           | Necessidade                           |
| ------------------------------------------------------- | ----------------------- | -------------------------------------------------------------------- | ------------------------------------- | ------------------- |
| `schema`                                                | `string`                | Identificador do formato do objeto de tela.                          | Formato, quando necessário            |
| `schemaVersion`                                         | `string`                | Versão do schema de leitura, não da tela.                            | Formato, quando necessário            |
| `identidade.id`                                         | `string`                | Identidade única e estável da tela.                                  | Essencial                             |
| `identidade.tipo`                                       | `string`                | Natureza da definição (tela).                                        | Essencial                             |
| `identidade.namespace`                                  | `string`                | Agrupamento lógico opcional.                                         | Contextual                            |
| `identidade.nome`                                       | `string`                | Nome editorial de referência.                                        | Usado no exemplo                      |
| `identidade.nomeExibicao`                               | `string`                | Nome apresentado na interface.                                       | Contextual                            |
| `identidade.descricao`                                  | `string`                | Propósito e contexto da tela.                                        | Contextual                            |
| `classificacao.localizacao.caminho`                     | `string`                | Caminho informativo/organizacional quando não derivável.             | Opcional                              |
| `classificacao.jornadas[]`                              | `object`                | Associação editorial à jornada/subjornada.                           | Se necessário                         |
| `classificacao.jornadas[].jornadaRef`                   | `string`                | ID de jornada, não rota.                                             | Se houver jornada                     |
| `classificacao.jornadas[].subjornadasRefs[]`            | `string`                | IDs das subjornadas associadas.                                      | Se houver                             |
| `estrutura.html.raizRef`                                | `string`                | ID da instância raiz da tela.                                        | Essencial para composição             |
| `estrutura.html.composicao`                             | `object`                | Mapa de instâncias por ID.                                           | Essencial para composição             |
| `estrutura.html.composicao.<instanciaId>.componenteRef` | `string`                | ID da definição de componente utilizada.                             | Essencial por instância               |
| `estrutura.html.composicao.<instanciaId>.paiRef`        | `string                 | null`                                                                | Elemento/instância pai para montagem. | Conforme hierarquia |
| `estrutura.html.composicao.<instanciaId>.slot`          | `string`                | Posição lógica de encaixe.                                           | Conforme layout                       |
| `estrutura.html.composicao.<instanciaId>.ordem`         | `number`                | Ordenação local sem mudar identidade.                                | Conforme layout                       |
| `estrutura.html.composicao.<instanciaId>.props`         | `object`                | Valores e configurações da ocorrência.                               | Quando necessário                     |
| `estrutura.css.tokens`                                  | `object`                | Variáveis de apresentação aplicadas à tela.                          | Opcional                              |
| `estrutura.css.regras`                                  | `object`                | Conjunto de regras CSS da tela.                                      | Quando necessário                     |
| `navegacao.rotas[]`                                     | `object`                | Rotas/ações navegáveis declaradas.                                   | Quando houver navegação               |
| `navegacao.rotas[].id`                                  | `string`                | Identidade única da rota no contexto.                                | Por rota                              |
| `navegacao.rotas[].tipo`                                | `string`                | Tipo de transição, ex.: direta ou permanecer.                        | Por rota                              |
| `navegacao.rotas[].origem.instanciaRef`                 | `string`                | Instância que contém o disparador.                                   | Por disparador visual                 |
| `navegacao.rotas[].origem.elementoRef`                  | `string`                | Elemento visual que dispara a rota.                                  | Por disparador visual                 |
| `navegacao.rotas[].origem.itemRef`                      | `string`                | ID de item específico de uma coleção.                                | Quando repetível                      |
| `navegacao.rotas[].destino.tipo`                        | `string`                | Natureza do destino, como tela.                                      | Se houver destino                     |
| `navegacao.rotas[].destino.ref`                         | `string`                | ID canônico do objeto de destino.                                    | Se houver destino                     |
| `navegacao.rotas[].quando`                              | `object`                | Condição declarativa que limita a rota.                              | Opcional                              |
| `navegacao.rotas[].evento`                              | `string`                | Identificação de evento vinculado.                                   | Opcional                              |
| `estados.fallbackSeguro`                                | `string`                | Estado visual seguro para ausência de resolução.                     | Se houver resolução                   |
| `estados.itens[]`                                       | `object`                | Estados possíveis identificados.                                     | Quando houver estados                 |
| `estados.itens[].id`                                    | `string`                | ID próprio do estado.                                                | Por estado                            |
| `estados.itens[].nome`                                  | `string`                | Nome legível do estado.                                              | Contextual                            |
| `estados.itens[].descricao`                             | `string`                | Finalidade/efeito documental do estado.                              | Opcional                              |
| `estados.itens[].quando`                                | `object`                | Expressão declarativa de seleção.                                    | Se resolvido por condição             |
| `estados.itens[].prioridade`                            | `number`                | Precedência declarada da seleção.                                    | Se aplicável                          |
| `estados.dimensoes`                                     | `object`                | Agrupa dimensões independentes de estado.                            | Se houver múltiplas dimensões         |
| `estados.dimensoes.<dimensao>.estadoRefs[]`             | `string`                | IDs dos estados aceitos pela dimensão.                               | Por dimensão                          |
| `estados.dimensoes.<dimensao>.fallbackRef`              | `string`                | Estado de fallback da dimensão.                                      | Se definido                           |
| `estados.capacidadesPorAcesso`                          | `object`                | Permissões visuais de exemplo; não substitui autorização de backend. | Específico do caso                    |
| `variantes.itens[]`                                     | `object`                | Variação identificada aplicada à estrutura.                          | Quando houver variação                |
| `variantes.itens[].id`                                  | `string`                | ID da variante.                                                      | Por variante                          |
| `variantes.itens[].quando`                              | `object`                | Condição que ativa a variação.                                       | Se condicional                        |
| `variantes.itens[].alteracoes[]`                        | `object`                | Alteração declarada sobre alvo estável.                              | Por variante                          |
| `variantes.itens[].alteracoes[].alvo.instanciaRef`      | `string`                | Instância afetada.                                                   | Por alteração                         |
| `variantes.itens[].alteracoes[].alvo.elementoRef`       | `string`                | Elemento afetado, se aplicável.                                      | Opcional                              |
| `variantes.itens[].alteracoes[].propriedade`            | `string`                | Campo/atributo visual modificado.                                    | Por alteração                         |
| `variantes.itens[].alteracoes[].operacao`               | `string`                | Efeito declarativo, ex.: definir.                                    | Por alteração                         |
| `variantes.itens[].alteracoes[].valor`                  | `any`                   | Valor a atribuir, sem código executável.                             | Conforme efeito                       |
| `interacoes.eventos[]`                                  | `object`                | Eventos locais/ações simples declarados.                             | Quando houver interação               |
| `interacoes.eventos[].id`                               | `string`                | ID do evento no escopo da tela.                                      | Por evento                            |
| `interacoes.eventos[].origem.instanciaRef`              | `string`                | Instância que emite o evento.                                        | Por evento visual                     |
| `interacoes.eventos[].origem.elementoRef`               | `string`                | Elemento disparador.                                                 | Por evento visual                     |
| `interacoes.eventos[].tipo`                             | `string`                | Tipo de efeito local.                                                | Por evento                            |
| `interacoes.eventos[].campo`                            | `string`                | Caminho de estado alterado.                                          | Quando aplicável                      |
| `interacoes.eventos[].operacao`                         | `string`                | Operação declarativa (definir, alternar etc.).                       | Quando aplicável                      |
| `interacoes.eventos[].valor`                            | `any`                   | Valor de efeito, se houver.                                          | Quando aplicável                      |
| `interacoes.eventos[].quando`                           | `object`                | Condição de disparo.                                                 | Opcional                              |
| `dados.fontes[]`                                        | `object`                | Fontes externas identificadas, quando conhecidas.                    | Quando houver fonte real              |
| `dados.operacoes[]`                                     | `object`                | Operações identificadas sobre fontes reais.                          | Quando houver operação                |
| `dados.persistencia[]`                                  | `object`                | Vínculos declarados de persistência.                                 | Quando houver escrita                 |
| `dados.observacao`                                      | `string`                | Nota documental do exemplo, nunca fonte de execução.                 | Exemplo V0.10                         |
| `mocks.cenarios[]`                                      | `object`                | Cenários de simulação identificados.                                 | Quando usado no Protótipo             |
| `mocks.cenarios[].id`                                   | `string`                | ID do cenário.                                                       | Por cenário                           |
| `mocks.cenarios[].cenarioRef`                           | `string`                | Referência a cenário externo, se definido.                           | Opcional                              |
| `mocks.cenarios[].nome`                                 | `string`                | Nome legível do cenário.                                             | Contextual                            |
| `mocks.cenarios[].uso`                                  | `string`                | Tipo de uso declarado.                                               | Contextual                            |
| `mocks.cenarios[].situacao`                             | `string`                | Status editorial ou de simulação.                                    | Contextual                            |

| Campo do **componente**                           | Tipo observado/esperado | Finalidade                                      | Necessidade                     |
| ------------------------------------------------- | ----------------------- | ----------------------------------------------- | ------------------------------- | ------------------ |
| `identidade.id`                                   | `string`                | Identificador único da definição do componente. | Essencial                       |
| `identidade.tipo`                                 | `string`                | Natureza do objeto (componente).                | Essencial                       |
| `identidade.nome`                                 | `string`                | Nome editorial do componente.                   | Contextual                      |
| `classificacao.localizacao.caminho`               | `string`                | Localização documentada da definição.           | Opcional                        |
| `estrutura.html.raizRef`                          | `string`                | Elemento raiz do componente.                    | Essencial para montagem         |
| `estrutura.html.elementos`                        | `object`                | Mapa dos elementos por IDs internos.            | Essencial para montagem         |
| `estrutura.html.elementos.<elementoId>.tag`       | `string`                | Tag do nó de UI.                                | Por elemento                    |
| `estrutura.html.elementos.<elementoId>.paiRef`    | `string                 | null`                                           | Elemento pai, quando aplicável. | Por elemento filho |
| `estrutura.html.elementos.<elementoId>.ordem`     | `number`                | Ordem local.                                    | Conforme montagem               |
| `estrutura.html.elementos.<elementoId>.atributos` | `object`                | Atributos HTML/semânticos do elemento.          | Contextual                      |
| `estrutura.html.elementos.<elementoId>.texto`     | `string`                | Texto padrão da definição, se houver.           | Opcional                        |
| `estrutura.html.vinculos[]`                       | `object`                | Ligação entre props/valores e alvos da árvore.  | Quando configurável             |
| `estrutura.html.colecoes[]`                       | `object`                | Descrição de repetição de itens-modelo.         | Quando repetível                |
| `estrutura.css.regras`                            | `object`                | Regras CSS próprias da definição.               | Quando necessário               |

### 4.15. Propriedades específicas e histórico do glossário V2

Os valores de `props` **não formam um conjunto universal fechado**. `props.titulo`, `props.itens[]`, `props.notificacoes.quantidadeNaoLidas`, `props.estados.online.rotulo` e `props.padrao.titulo` são exemplos concretos de como instâncias diferentes fornecem textos e dados distintos. É responsabilidade de **cada componente** declarar/usar sua interface de propriedades e validar seu tipo no renderizador.

O glossário histórico de `documento (31).json` possuía 278 caminhos, muitos derivados da forma antiga (`<telaId> → tela + componentes`, `instanciasRefs`, `participacaoRef`, `bifurcacoes` etc.). A presente tabela especifica o **modelo de referência atual**; o glossário antigo continua como **fonte histórica**, não como uma lista de campos obrigatórios a transportar indiscriminadamente.

#### Campos antigos e decisão atual

| Campo ou família anterior                                    | Decisão desta consolidação                                                    | Razão                                                                             |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `<telaId>` externo obrigatório como único ID                 | **Não é identidade independente**; índice deve coincidir com `identidade.id`. | Evitar duas convenções canônicas concorrentes.                                    |
| `classificacao.participacoes` / `participacaoRef`            | **Não adotar por padrão.**                                                    | Jornadas e navegação já devem representar seus próprios vínculos sem redundância. |
| `classificacao.moduloRef`, `submoduloRef`, `escopo`, `secao` | **Remover da referência simplificada.**                                       | Sem responsabilidade própria comprovada.                                          |
| `tela.componentes.instanciasRefs`                            | **Não duplicar** `estrutura.html.composicao[...].componenteRef`.              | Mapeamento de instância único.                                                    |
| `conteudo.instancias`                                        | **Não criar.**                                                                | Conteúdo específico em `props` da instância.                                      |
| `estilos` separado de `estrutura.css`                        | **Não exigir.**                                                               | Só criar outra camada se existir função distinta aprovada.                        |
| `navegacao.bifurcacoes` para cada estado da mesma tela       | **Não criar por inércia.**                                                    | Mudança de estado não é sempre navegação.                                         |
| `navegacao.relacoes` para grafo de Fluxo                     | **Conceito necessário; forma fina aberta.**                                   | Requer conexões reais e pontos conectivos explícitos.                             |
| `dados.colecoes` com cópia de itens em `props.itens`         | **Evitar duplicação.**                                                        | Modelo repetível no componente; dados do caso na instância.                       |
| `identidade.descricao.maps[]`                                | **Referência documental opcional, não operacional.**                          | Um mapa explicativo não é fonte do motor.                                         |
| `implementacao`, `testes`, `notas` dentro de toda tela       | **Não obrigar.**                                                              | Preferir documentação/relatório externo, se não afetarem execução.                |
| IDs antigos ou destinos por semelhança                       | **Não corrigir automaticamente.**                                             | A identidade deve ser confirmada na origem.                                       |

### 4.16. Campos fora do modelo atual — critérios para extensão

A inclusão de novos campos passa por quatro perguntas: **que informação falta?**; **quem a produz/edita?**; **quem a consome?**; **qual campo existente não consegue representá-la?** Se a resposta for apenas “o antigo JSON possuía esse nome”, **não** é justificativa para adicioná-lo. Extensões ficam [PROPOSTAS] até decisão e exemplo verificável.

---

## 5. Relações, composição e comportamento

### 5.1. Identidade lógica, instância e elemento

**Tela** é uma unidade funcional identificada; **componente** é uma definição visual reutilizável; **instância** é a ocorrência desse componente em uma tela; **elemento** é um nó interno da definição. A mesma tela pode ter vários estados, o mesmo componente pode aparecer em várias telas e o mesmo elemento-modelo pode renderizar vários itens. Nenhuma dessas multiplicidades exige mudar os IDs de tela/componente.

Exemplo de encadeamento válido: `identidade.id=advogado.home` → `screen.drawer` → `componenteRef=ui.advogado.menu.principal` → elemento `menu.item.modelo` → item `menu.meu_perfil` → `rota.menu.meu_perfil`. Cada referência deve ser resolvida no escopo adequado.

### 5.2. Composição e props

**A definição** guarda HTML, CSS, elementos e vínculos; **a instância** guarda `componenteRef`, local de montagem, ordem e `props`. Não criar duas cópias concorrentes dos mesmos textos, itens ou destinos. Uma propriedade não definida deve seguir um valor padrão **declarado** no contrato do componente ou aparecer como ausência, não ser inventada pelo editor.

Para listas: o componente declara um **item-modelo**, e `props.itens[]` declara cada item com ID, rótulo e eventuais referências. O renderizador repete a estrutura e resolve `itemRef` de modo estável. Filtrar itens por uma condição visual é diferente de remover os itens do contrato.

### 5.3. Estados não são rotas

Exemplos: `menu.aberto/fechado` é estado local; `disponibilidade.online/offline` é situação operacional; `oab.pendente/habilitado` é um exemplo de estado de negócio; `interface.carregando/erro` é estado de apresentação. Eles podem coexistir como **dimensões**, de modo que um estado não redefina indevidamente todos os demais.

**Regra de segurança de modelagem:** a Home permanece acessível enquanto muda sua apresentação. Um estado `oab.pendente` **não** cria “pendência de acesso à Home”, “rota de Pendências” ou outra Home. A capacidade visual de um botão não equivale à autorização real da operação.

### 5.4. Resolução de condições

As condições devem ser **declarativas, tipadas e verificáveis**, usando valor de campo conhecido ou `capacidadeRef` quando uma regra efetiva estiver definida. Não avaliar expressões JavaScript arbitrárias recebidas do JSON. Condições compostas, prioridade, simultaneidade e resolução de conflitos devem ser explicitadas pelo modelo quando o primeiro caso real exigir.

Um `fallbackSeguro` pode definir apresentação prudente de estados não resolvidos; não concede, revoga ou simula uma autorização de backend. Falha técnica de leitura e situação profissional não validada são semanticamente distintas, mesmo que ambas ocultem uma operação protegida no exemplo.

### 5.5. Variantes e alterações condicionais

Variantes **alteram alvos específicos por ID**, em vez de copiar tela ou componente inteiro. O efeito pode ser `visivel`, `classes.is-offline`, um atributo ou outra propriedade explicitamente admitida. Cada alteração aponta para `instanciaRef` e, se necessário, `elementoRef`; listas e menus podem ser filtrados por dados/estados em semântica declarada.

**[OBSERVADO V0.10]** Para Online/Offline, o CSS foi alinhado à mesma classe `is-offline` usada na alteração visual. O objetivo do padrão é evitar que a variante escreva em `data-online` enquanto as regras CSS procurem `.is-offline` sem relação entre ambos.

### 5.6. Interações, ações e efeitos

Um evento (por exemplo, clique no botão do menu) identifica a **origem visual** e declara um efeito como `alterar_estado`. Uma operação mais complexa pode usar uma definição de **ação** por ID, mas ação não deve duplicar o destino se a referência navegável já existe em `navegacao`.

Distinções obrigatórias:

| Acontecimento              | Domínio primário                   | Efeito                                                         |
| -------------------------- | ---------------------------------- | -------------------------------------------------------------- |
| Abrir menu                 | Interação / estado local           | Muda visibilidade no mesmo componente.                         |
| Alterar Online/Offline     | Interação + estado + eventual dado | Muda apresentação; persistência real exige contrato adicional. |
| Mostrar menu restrito      | Estado + variante                  | Filtra/oculta itens, sem criar outra tela.                     |
| Abrir perfil em outra tela | Navegação                          | Usa destino identificado.                                      |
| Confirmar atendimento      | Ação + dados/persistência          | Precisa de operação real explicitada e autorização externa.    |
| Escolher cenário de mock   | Sessão do Protótipo                | Simula dados/estados sem persistir definição.                  |

### 5.7. Navegação e grafo de fluxo

Navegação declara **o que leva a outra tela** e, quando necessário, o comportamento de permanecer. O Fluxo pode representar **origem, destino, conexões, condições, decisões e pontos conectivos**. Uma conexão gráfica não pode ser criada apenas porque um nó está próximo de outro; uma lista de rotas também não contém automaticamente todas as possibilidades de um grafo complexo.

A solução fina de relações entre **múltiplas ocorrências da mesma tela**, retorno, conexão composta, notificação e transição visual segue [ABERTA] até existir caso concreto. Enquanto não existir, preferir `rotas[]` e referências reais a importar esquemas inteiros do modelo antigo.

### 5.8. Reuso e propagação de componentes

Três mudanças diferentes precisam ser distinguidas:

1. **Instância:** alterar `screen.drawer.props` só naquela tela.
2. **Definição compartilhada:** alterar CSS/estrutura de `ui.advogado.menu.principal`, alcançando explicitamente todas as telas do conjunto carregado que usam o mesmo componente, com verificação de versão e conflitos.
3. **Token visual comum:** alterar um token e seus consumidores identificados, sem transformar o token em ID de componente.

Arquivos exportados e independentes **não se atualizam sozinhos**; propagar alterações é uma operação explícita sobre o conjunto disponível, seguida de exportação/importação quando necessário. Não confundir reutilização com sincronização mágica.

### 5.9. Renderização estática e camadas de execução

A composição estática deve ser possível usando **estrutura + componentes + props + CSS**, sem chamadas de produção e sem depender de mocks. Estados e variantes adicionais refinam a visualização; o Protótipo acrescenta sessão e simulação; o Fluxo acrescenta visão conectiva; Jornadas acrescenta sequência editorial.

---

## 6. Dados, interoperabilidade e evolução

### 6.1. Fonte canônica e índices derivados

As definições de tela/componente são a fonte do conteúdo funcional e visual compartilhável; o índice de um catálogo ou do conjunto carregado serve para **localizar e consultar** os objetos. Um índice não cria, por si só, identidade alternativa, variante, fluxo nem dado de produção.

**Regras:**

- `identidade.id` identifica a tela ou componente; o índice, quando existir, deve concordar com o ID.
- O módulo pode manter estado temporário de trabalho, seleção, zoom ou visualização sem gravá-lo no JSON da tela.
- O mesmo contrato pode ser lido por Tela/Jornadas/Fluxo/Protótipo; cada módulo altera apenas os campos sob uma edição explícita.
- Um campo que o módulo **não entende** deve ser preservado, e não descartado silenciosamente.
- Se a origem do arquivo, o índice e o ID discordarem, registrar o conflito. Não deduzir que duas telas com nomes próximos são idênticas.

### 6.2. Dados estáticos, dinâmicos e coleções

**Estáticos:** textos, rótulos, contagens e itens demonstrativos de `props` podem renderizar a prévia sem API.  
**Dinâmicos:** referências para dados reais e operações precisam ser identificadas quando existirem; não converter automaticamente rótulos de formulário em colunas.  
**Coleções:** a definição do componente declara o padrão de repetição; a instância fornece a lista de objetos e seus IDs.  
**Mocks:** valores de ensaio do Protótipo têm cenários separados, sem sobrescrever as fontes reais.

O módulo externo que futuramente consolidar campos lógicos ou banco pode consumir referências declaradas, mas **não** é um dos quatro módulos detalhados nesta revisão. A presença de um nome visível não basta para deduzir entidade persistente, cardinalidade ou endpoint.

### 6.3. Importação e exportação

| Operação           | Comportamento exigido                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| Importar uma tela  | Validar identidade, schema, componentes necessários, relações e conflitos com objetos já carregados. |
| Importar um pacote | Indexar por ID declarado e relatar duplicidades, incompatibilidades e referências não resolvidas.    |
| Editar em Tela     | Mudar somente campos/instâncias explicitamente selecionados, preservando o restante.                 |
| Editar em Jornadas | Alterar vínculo/ordem editorial, quando esse mecanismo estiver aprovado, sem criar rota.             |
| Editar em Fluxo    | Alterar conexão/condição real, sem modificar CSS, props ou IDs de tela.                              |
| Usar Protótipo     | Executar sessão simulada; não gravar estados efêmeros no contrato automaticamente.                   |
| Exportar           | Entregar contratos com os campos não editados, inclusive extensões, CSS e mocks, e com IDs intactos. |

**Round-trip** significa importar, inspecionar/editar o campo previsto, exportar e importar novamente obtendo o mesmo conteúdo não alterado. Não significa apenas conseguir executar `JSON.parse` sem erro.

### 6.4. Transporte unitário e pacote de trabalho

É aceitável transportar **um contrato de tela** ou **um conjunto indexado** para trabalho entre módulos, desde que a conversão seja declarada. A V0.10 ilustra o pacote `{schema, schemaVersion, telas, componentes}`; a árvore histórica de `documento (32).json` usava uma chave raiz externa e componentes embutidos.

**[ABERTO]** O empacotamento físico oficial e o formato de persistência externa. O que já se define é a **equivalência semântica e preservação dos IDs** após conversão e importação/exportação. A autocontenção necessária à renderização pode ser atendida por um pacote de exportação que inclua as definições dependentes, sem exigir um arquivo de cópia por componente em cada tela.

### 6.5. Reutilização de componentes e atualização compartilhada

Para reutilizar o mesmo componente lógico entre telas, o sistema precisa localizar ocorrências por `componenteRef` e `identidade.id`, verificar versões e decidir escopo da edição (**esta instância** versus **definição compartilhada**). Se duas definições com o mesmo ID divergirem, relatar conflito ou versão diferente; não mesclar CSS arbitrariamente.

Uma atualização compartilhada em arquivos diferentes precisa ser **executada sobre o conjunto de contratos carregado** e depois exportada. Não prometer que edições em um HTML/JSON se propagam automaticamente para outro arquivo desconectado.

### 6.6. Conversão e interoperabilidade HTML, React e Flutter

A estrutura declarativa não deve ficar dependente do framework que a lê. Conversores/adaptadores podem montar HTML/CSS, componentes React ou widgets Flutter a partir dos dados **na medida das capacidades implementadas**. Não incluir funções executáveis do motor dentro do JSON.

Quando uma plataforma não suportar atributo, estado, evento, estilo ou comportamento:

1. identificar o campo não suportado e seu ID de origem;
2. informar se a diferença é visual, comportamental ou de dados;
3. preservar a declaração original no round-trip;
4. não substituir silenciosamente o comportamento por uma adivinhação;
5. registrar a extensão ou adaptação pendente.

### 6.7. Versionamento e migração

`schemaVersion` identifica a versão do **formato**, não um segundo ID de tela. Alterar apenas título/props pode não exigir mudança de schema; alterar estrutura de IDs, campo ou semântica pode exigir migração formal.

Procedimento mínimo para evoluir:

1. apresentar caso de uso que o contrato atual não representa;
2. identificar bloco e campo responsável;
3. conferir se haverá duplicação de dados;
4. definir tipos, cardinalidade, valor padrão e referências;
5. mapear formatos antigos para o novo sem perda;
6. validar exemplo pequeno antes de transformação em massa;
7. documentar impacto em Tela, Jornadas, Fluxo e Protótipo.

**[HISTÓRICO RELEVANTE]** O README V6.1 e os documentos (31)/(32) usavam convenções distintas para identidade, classificação e composição. A V0.10 organiza `identidade.id`, `estrutura.html.composicao[instanciaId].props` e definições separadas de componentes. A conversão entre esses formatos **não deve ser assumida automática** nem tratada como já testada.

### 6.8. Preservação e rastreabilidade

Não introduzir `proveniencia` e `localizacao` redundantes em todas as telas sem necessidade. Auditoria, origem de importação, histórico de edição e evidências podem permanecer em manifesto/documentação externa. Quando uma ferramenta fizer inferência para orientar o usuário, o resultado tem status **proposto**, não vira automaticamente campo persistente.

---

## 7. Padrões visuais e experiência de uso

### 7.1. Princípio visual

**Padronizar o conteúdo contratual compartilhado; não forçar a mesma interface nos quatro módulos.** Tela usa árvore/composição/inspeção; Jornadas usa sequência e galeria; Fluxo usa grafo e conectores; Protótipo usa prévia interativa e simulação. Todos exibem a **mesma tela de produto**, com sua própria aparência e seus estados correspondentes.

### 7.2. UI do Projeto versus UI do produto

```text
SHELL DO PROJETO (header, menu, área de trabalho)
    ├── UI do módulo Tela          → árvore, editor, inspetor, prévia
    ├── UI do módulo Jornadas      → filtros, galeria, molduras
    ├── UI do módulo Fluxo         → canvas, nós, conectores, diálogos
    └── UI do módulo Protótipo     → dispositivo, sessão, cenários

DENTRO DA PRÉVIA DOS QUATRO
    └── TELA DO PRODUTO
         ├── estrutura.html + composição
         ├── componentes e props
         ├── estrutura.css + regras do componente
         └── estados/variantes pertinentes
```

As classes e tokens da tela não devem alterar os cartões do editor. O editor não acrescenta um header universal dentro da tela de produto. Abrir uma prévia não deve executar navegação externa a menos que o modo Protótipo esteja efetivamente simulando uma relação permitida.

### 7.3. Responsividade

- **Mobile-first no produto:** composição e CSS devem respeitar o comportamento da tela definida para dispositivos móveis.
- **Desktop/tablet no workspace:** a área principal é fluida; menus/painéis podem recolher; a navegação global continua acessível.
- **Jornadas:** molduras Mobile/Desktop são opções de apresentação; não produzem outra identidade de tela.
- **Fluxo:** grafo, conectores e modais continuam utilizáveis em várias larguras, sem converter por simplificação em uma Jornada.
- **Protótipo:** dispositivo e controles de simulação não devem reduzir a prévia a ponto de impedir sua inspeção.
- **Acessibilidade:** foco visível, sem dependência exclusiva de hover, botões acessíveis, rolagem e mensagens de estado inteligíveis.

### 7.4. Componentes visuais de trabalho por módulo

| Módulo    | Componentes de UI do editor                                                                            | Cuidados                                                             |
| --------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Tela      | Árvore da tela; árvore dos componentes; busca; inspetor de props; prévia; diff; importação/exportação. | Não duplicar dados nem deixar composição de componentes inacessível. |
| Jornadas  | Seleção dinâmica; subabas; filtros; galeria; modos de dispositivo; detalhes.                           | Não inferir conexão a partir da ordem de telas.                      |
| Fluxo     | Toolbar contextual; canvas; nó de tela; ramificação; conectores; modal de prévia; edição.              | Não converter conexões em meras linhas decorativas.                  |
| Protótipo | Moldura/dispositivo; cenário; estado de sessão; ação simulada; histórico e reset.                      | Não executar produção nem copiar visual em outra fonte.              |

### 7.5. Estados visuais a representar

Para cada módulo, o editor deve distinguir: **sem dados**, **carregando**, **erro**, **selecionado**, **modificado e não exportado**, **conflito de referência**, **prévia aberta** e **operação confirmada** quando essas situações fizerem sentido. Esses são estados da UI de trabalho, **não** estados de OAB ou outros dados de negócio do produto.

### 7.6. Fidelidade e alteração de design

A mesma composição de uma tela deve conservar HTML/elementos, props, CSS, visibilidade por variante e responsividade quando mostrada em Tela/Jornadas/Fluxo/Protótipo. Cada módulo pode ter uma moldura diferente, mas não uma reimplementação não declarada da tela.

Mudanças visuais em interfaces homologadas devem guardar **referência, antes/depois, viewport, elementos afetados, impacto funcional, resultado de teste e estado de aprovação**. Um screenshot não basta para concluir que uma regra geral de CSS é canônica.

### 7.7. Limites de conversão visual

HTML/CSS, React e Flutter podem exigir adaptadores distintos. Diferenças de layout devem ser reportadas por campo/componente, não escondidas. Não trocar `gap`, moldura, ordem de cards ou comportamento do menu sem revisar a consequência visual e funcional quando os critérios já estiverem aprovados.

---

## 8. Validação, testes e homologação

### 8.1. Validação estrutural do contrato

A aprovação estrutural exige, no mínimo:

1. JSON sintaticamente válido, com tipos compatíveis com o formato aceito.
2. `identidade.id` presente, estável e consistente com índice externo quando houver.
3. `raizRef` e `composicao` resolvíveis; instâncias com `componenteRef` válido.
4. Componentes com árvore de `elementos` sem pais inexistentes ou ciclos.
5. `props` consumíveis por elementos e coleções definidos; cada item repetível identificado quando referenciado.
6. `navegacao` sem destinos fictícios e sem rotas para mudanças que são apenas estados locais.
7. `estados` com referências consistentes; variantes com alvo de elemento/instância válido.
8. `interacoes` sem origem inexistente e sem efeitos duplicados em blocos concorrentes.
9. `mocks` separados de dados reais e sem uso involuntário como fonte de produção.
10. Nenhum campo descartado em exportação/importação, inclusive extensões ainda não consumidas.

**Verificação estrutural não equivale a homologação visual, funcional ou de serviços reais.**

### 8.2. Testes mínimos dos quatro módulos

| Teste    | Módulo      | Evidência esperada                                                         |
| -------- | ----------- | -------------------------------------------------------------------------- |
| `TEL-01` | Tela        | Abrir JSON e suas árvores sem componente faltante.                         |
| `TEL-02` | Tela        | Editar `props` de instância sem criar bloco `conteudo` paralelo.           |
| `TEL-03` | Tela        | Importar/exportar preservando CSS, rotas, estados, mocks e extensões.      |
| `JRN-01` | Jornadas    | Listar telas por jornada/subjornada declaradas e manter IDs.               |
| `JRN-02` | Jornadas    | Prévia local com menu aberto/fechado sem navegar.                          |
| `JRN-03` | Jornadas    | Dispositivo Mobile/Desktop com fidelidade de composição.                   |
| `FLX-01` | Fluxo       | Exibir apenas conexões explícitas com origem/destino por ID.               |
| `FLX-02` | Fluxo       | Editar A→B para A→C e preservar objeto/ID de tela.                         |
| `FLX-03` | Fluxo       | Mostrar condição/estado e referências não resolvidas sem inventar caminho. |
| `PRT-01` | Protótipo   | Trocar cenário e estado sem nova tela.                                     |
| `PRT-02` | Protótipo   | Percorrer a rota de simulação declarada.                                   |
| `PRT-03` | Protótipo   | Não chamar serviços de produção.                                           |
| `EXP-01` | Transversal | Round-trip preserva o contrato inteiro.                                    |
| `CMP-01` | Transversal | Detectar mesmo componente com ID igual e definições divergentes.           |
| `VIS-01` | Transversal | Prévia da mesma tela tem visual compatível nos quatro módulos.             |
| `CNV-01` | Transversal | Conversão HTML/React/Flutter informa atributos não suportados.             |

**[NÃO HOMOLOGADO]** Esses testes são critérios propostos ou consolidados da documentação; não há, nesses anexos, execução comprovada dos quatro módulos contra a V0.10.

### 8.3. Casos de exemplo suficientes para avaliar o schema

Uma Home e um menu são úteis, mas **insuficientes isoladamente**. Para aprovar a generalidade do padrão, os próximos casos representativos devem incluir:

- uma tela estática simples;
- uma tela com formulário e campos lógicos;
- a mesma definição de componente em duas telas;
- a mesma tela com múltiplos estados e variantes;
- uma lista repetível com itens identificados;
- uma conexão entre telas e uma interação local sem navegação;
- um caso de erro/fallback e um cenário de mock.

O objetivo desses testes é verificar **o modelo**, não concluir requisitos de negócio dessas telas antes de especificá-las.

### 8.4. Controle de regressões

A mudança da V0.7 para V0.8 mostrou o risco de melhorar a estrutura e perder comportamento: uma rota de exemplo sumiu, comportamentos foram generalizados e conteúdos migraram de lugar. A revisão V0.9 corrigiu parte da estrutura; a V0.10 focou a **semântica de modelo**, removendo pseudo-rotas e campos artificiais. Daqui em diante, alterações exigem uma matriz **preservado / renomeado / fundido / removido**, com motivo e referência.

**Nunca** declarar uma versão “tudo certo” só porque o JSON possui zero referências locais quebradas. Há níveis distintos: sintaxe, referências, semântica, renderização, funcionamento e homologação.

### 8.5. Registro de homologação

Cada aceite deve informar: **ID do artefato**, versão, cenário testado, tela/componente, viewport, passos, resultado observado, diferença encontrada, decisão e evidência. O estado [HOMOLOGADO] só deve ser atribuído depois de revisão comprovada.

### 8.6. Pendências específicas da documentação/modelo

| Tema                                | Estado                   | Decisão ou evidência ainda necessária                                                                 |
| ----------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------- |
| Obrigatoriedade fina de campos      | **[ABERTO]**             | Definir a partir de casos representativos e leitores reais; não obrigar todos os blocos em toda tela. |
| Relações complexas do Fluxo         | **[ABERTO]**             | Forma canônica para múltiplas ocorrências, portas, bifurcações, prioridades e condições compostas.    |
| Interface de `props` por componente | **[ABERTO]**             | Como cada componente declara tipos, defaults, validação e versionamento das props.                    |
| Condições                           | **[ABERTO]**             | Operadores, composição, avaliação e resolução de conflitos sem código executável.                     |
| Empacotamento autocontido           | **[ABERTO]**             | Tela individual, pacote, manifestos e estratégia de atualização de componentes por ID.                |
| Conversores                         | **[ABERTO]**             | Cobertura e equivalência visual/funcional HTML, React e Flutter.                                      |
| UX do módulo Tela                   | **[PROPOSTO]**           | Subitens e interface final de edição/inspeção.                                                        |
| Condições reais da Home de exemplo  | **Fora do escopo atual** | Não são requisito para aprovar o modelo de dados.                                                     |
| Integração real do backend/OAB      | **Fora do escopo atual** | Não se deve inventar serviço, autorização ou regra de produto.                                        |

A lista contém **pendências do padrão**. Ela não transforma o exemplo `advogado.home` em uma entrega de produção.

---

## 9. Casos de aplicação e evidências

### 9.1. Home Advogado como exemplo, não produto homologado

A Home é usada por ser um caso rico: combina composição, menu, status, lista de cards, estados e variantes. **Nada nessa demonstração obriga** que a Home final mantenha esses itens, essas rotas ou essa regra de OAB.

**[OBSERVADO V0.10]** O arquivo de referência contém:

| Critério observado | Quantidade no exemplo V0.10 |
| ------------------ | --------------------------: |
| Instancias         |                           9 |
| Componentes        |                           9 |
| Rotas              |                          11 |
| Estados            |                           8 |
| Variantes          |                           7 |
| Interacoes         |                           5 |
| Mocks              |                           3 |

Esses números são **inventário do exemplo**, não requisito de cardinalidade do modelo. Um contrato válido pode possuir menos componentes, nenhuma variante ou nenhuma rota, desde que as responsabilidades de seus campos sejam satisfeitas.

### 9.2. Como a mesma Home demonstra os conceitos

| Conceito   | Exemplo verificável             | O que demonstra                                  | O que **não** demonstra                                         |
| ---------- | ------------------------------- | ------------------------------------------------ | --------------------------------------------------------------- |
| ID         | `advogado.home`                 | Identidade da mesma tela, com múltiplos estados. | Identidade de todas as Homes existentes em outros catálogos.    |
| Instância  | `screen.drawer`                 | O menu participa de uma tela por referência.     | Que todo aplicativo precisa de drawer.                          |
| Componente | `ui.advogado.menu.principal`    | Definição reutilizável com elementos e CSS.      | Que outro menu semelhante é automaticamente o mesmo componente. |
| Props      | `screen.drawer.props.itens`     | Lista contextual de itens identificados.         | Que essa lista é o menu final de produção.                      |
| Estado     | `estado.oab.pendente`           | Situação contextual pode mudar a apresentação.   | Que o usuário está pendente de entrar na Home.                  |
| Variante   | `variante.acesso.restrito`      | Altera visibilidade por referências.             | Que ocultação na UI autoriza/bloqueia operação real.            |
| Rota       | `rota.menu.meu_perfil`          | Destino de outra tela pode ser explícito.        | Que a tela de destino está homologada.                          |
| Evento     | `evento.menu.abrir`             | Interação local sem navegação.                   | Que a aplicação de produção já implementou o controle.          |
| Mock       | `mock.habilitado.advogado.home` | Cenário de prévia/simulação.                     | Que o status de OAB real está resolvido no banco.               |

### 9.3. Exemplo curto de uma tela independente da Home

O objetivo do padrão é aceitar **qualquer tela**, não exigir sempre um menu profissional. Exemplo mínimo **ilustrativo**, com **um componente** e uma propriedade:

```json
{
  "tela": {
    "schema": "advogadoja.tela",
    "schemaVersion": "0.10.0",
    "identidade": {
      "id": "exemplo.tela.informativa",
      "tipo": "tela",
      "nome": "Tela informativa"
    },
    "classificacao": {
      "jornadas": []
    },
    "estrutura": {
      "html": {
        "raizRef": "screen.root",
        "composicao": {
          "screen.root": {
            "componenteRef": "exemplo.componente.informativo",
            "paiRef": null,
            "slot": "raiz",
            "ordem": 10,
            "props": {
              "mensagem": "Mensagem de exemplo"
            }
          }
        }
      },
      "css": {
        "tokens": {},
        "regras": {}
      }
    },
    "navegacao": {
      "rotas": []
    },
    "estados": {
      "itens": []
    },
    "variantes": {
      "itens": []
    },
    "interacoes": {
      "eventos": []
    },
    "dados": {
      "fontes": [],
      "operacoes": [],
      "persistencia": []
    },
    "mocks": {
      "cenarios": []
    }
  },
  "componente": {
    "identidade": {
      "id": "exemplo.componente.informativo",
      "tipo": "componente",
      "nome": "Conteúdo informativo"
    },
    "estrutura": {
      "html": {
        "raizRef": "info.root",
        "elementos": {
          "info.root": {
            "tag": "p",
            "paiRef": null,
            "ordem": 10
          }
        },
        "vinculos": [
          {
            "elementoRef": "info.root",
            "propriedade": "texto",
            "campo": "mensagem"
          }
        ]
      },
      "css": {
        "regras": {}
      }
    }
  }
}
```

**[EXEMPLO DE CONTRATO UNITÁRIO]** O objeto acima é intencionalmente reduzido para ensinar as responsabilidades; `vinculos[]` exemplifica a ligação declarativa entre o campo `mensagem` e o texto do componente. Ele **não** substitui a estrutura de pacote V0.10 nem aprova um novo formato de exportação. Só comprova que o modelo não exige conteúdo específico da Home.

### 9.4. Exemplos adicionais para fechamento futuro

1. **Tela com formulário:** campo visual ligado a um campo lógico identificado; exige modelagem dos vínculos de dados antes de falar em tabela física.
2. **Componente compartilhado:** mesmo componente em duas telas com props diferentes; editar apenas uma instância e depois simular alteração explícita da definição.
3. **Menu condicional:** os mesmos IDs de itens com visibilidade alterada por variantes; quantidade de itens é resultado de estado/dados, não outra definição de menu.
4. **Fluxo com condição:** vínculo de tela A para B sob condição real declarada; falta de condição deve ser apontada, não preenchida.
5. **Protótipo com erro:** cenário de mock em erro técnico e fallback visível, sem chamadas reais.
6. **Interoperabilidade:** abrir o mesmo contrato com o mesmo CSS em Tela/Jornadas/Fluxo/Protótipo e fazer round-trip sem perda.

### 9.5. Rastreabilidade das três fontes anteriores e do README

| Origem                  | Conteúdo relevante incorporado                                                          | Tratamento aplicado                                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `README.md`, seções 1–2 | Direção geral, shell, separação de UI, sequência de trabalho e importação.              | Conservados e limitados aos quatro módulos da revisão.                                                                |
| `README.md`, seção 3    | Fichas de módulo; Jornadas, Fluxo e Protótipo.                                          | Reorganizado em Tela, Jornadas, Fluxo e Protótipo; outros domínios deixados fora do escopo.                           |
| `README.md`, seções 4–6 | Contratos, composição, IDs, trocas entre módulos.                                       | Atualizado para `identidade.id` e `props` na composição V0.10; antigas duplicações registradas.                       |
| `README.md`, seções 7–9 | Visual, isolamento CSS, testes e casos de evidência.                                    | Preservada a lógica de validação, sem homologação fictícia.                                                           |
| `documento (31).json`   | Esquema e glossário de campos legados (278 entradas).                                   | Usado para inventário histórico e revisão de redundâncias; não importado como schema obrigatório.                     |
| `documento (32).json`   | Exemplo autocontido de Home, dados, relações e estados.                                 | Usado como caso de comparação; identidade, participação, ações e destinos não foram tomados como verdade de produção. |
| `documento (33).json`   | Complementos sobre estados, variantes, coleções, conversão, responsabilidades e testes. | Integrados por responsabilidade, separando o [PROPOSTO] daquilo já adotado na V0.10.                                  |
| Modelo V0.10            | Instâncias com props, nove componentes de exemplo e referências verificáveis.           | Base atual de ilustração, **não** homologação do aplicativo.                                                          |

### 9.6. Registro de decisões prevalentes

| Assunto                             | Decisão registrada                                                                              | Natureza                     |
| ----------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------- |
| Organização da documentação         | **Nove seções** aprovadas, com capítulo 3 concentrado em **Tela, Jornadas, Fluxo e Protótipo**. | [DEFINIDO]                   |
| Papel da Home                       | Caso preenchido de referência para testar o modelo.                                             | [DEFINIDO]                   |
| ID da Home no exemplo               | `advogado.home`; não inventar outra tela.                                                       | [DEFINIDO para o exemplo]    |
| Identidade do contrato              | `identidade.id` no padrão de referência V0.10; índice deve coincidir quando existir.            | [DEFINIDO para a referência] |
| Classificação                       | Sem `participacoes`, `moduloRef`, `escopo` e `secao` redundantes.                               | [DEFINIDO]                   |
| Conteúdo contextual                 | `props` por instância, sem `conteudo.instancias`.                                               | [DEFINIDO]                   |
| Composição                          | Uma relação `componenteRef` por instância no bloco de composição.                               | [DEFINIDO]                   |
| Estado da OAB                       | Exemplo de estado que modifica apresentação na **mesma** tela.                                  | [EXEMPLO]                    |
| Pseudo-rota Pendências              | Não pertence ao menu do exemplo V0.10.                                                          | [CORRIGIDO NO EXEMPLO]       |
| `Online/Offline`                    | Alinhamento da variante com classe de CSS da definição.                                         | [CORRIGIDO NO EXEMPLO]       |
| Condições reais, APIs e autorização | Não inferir a partir de mock ou de estado visual.                                               | [ABERTO / FORA DO ESCOPO]    |
| Motores                             | Devem seguir o contrato e as funções definidas, não guiá-las.                                   | [DIREÇÃO DEFINIDA]           |

### 9.7. Encerramento e limite de aprovação

**Este Markdown é a referência integrada para discutir, ampliar e validar a modelagem**, conservando a distinção entre fato observado, decisão e proposta. Ele **não** substitui um schema formal validado, não afirma que as telas ou motores foram homologados e não autoriza refatoração ou migração automática do ambiente.

**Critério para a próxima evolução:** um exemplo de tela realmente diferente da Home deve ser representável sem criar campos redundantes; qualquer nova capacidade deve vir acompanhada de estrutura de dados concreta e impacto documentado em Tela, Jornadas, Fluxo e Protótipo.
