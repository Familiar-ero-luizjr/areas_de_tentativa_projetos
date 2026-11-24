# ADVOGADOJÁ — DOCUMENTO CANÔNICO CONSOLIDADO V3
## Direção canônica, contratos JSON de Tela e Componente, navegação por rotas declaradas, frontend do Fluxo, saneamento do legado e conversão auditável

**Versão editorial:** 3.1 — **19/11/2026** · Revisão da V3 aprovada pelo usuário  
**Estado:** decisões de arquitetura e saneamento consolidadas; schema formal, conversores e motores ainda **não homologados**.  
**Perfil auditado:** Advogado. **Aplicação conceitual:** padrão reutilizável para outros perfis, após verificação de seus próprios contratos.  
**Natureza:** consolidação evolutiva integral da V2 e dos dois anexos sobre navegação/frontend. Substitui, **para decisões novas de modelagem**, orientações incompatíveis das fontes anteriores; conserva observações, inventários e lacunas sem fingir homologação. **Não altera JSONs, implementações ou fontes originais.**

> **Regra prevalente V3.1:** cada tela é identificada por um único `identidade.id`, compõe componentes por referência e guarda `props` por instância. **A única fonte operacional das transições entre telas é `navegacao.rotas[]` de cada Tela**, com predicados opcionais em `navegacao.rotas[].quando`. Não criar blocos `conexoes`, `condicoes`, `aliasMap` ou `referencias.aliases[]`; não instalar `popup.screen-note` nem `modal.route-modal` no catálogo novo. Fluxo preserva ocorrências, sequências, ramos e caminhos editoriais, mas não guarda uma segunda lista de destinos. O motor deriva o diagrama sem inventar navegação.

### Decisão adicional incorporada após a V3 original

**[APROVADO — 19/11/2026]** O usuário rejeitou explicitamente os nomes de blocos `conexoes` e `condicoes`. Toda documentação anterior que propunha essas coleções fica superada **quanto à estrutura de armazenamento**. Isso não elimina a necessidade de representar navegação e regras reais: ambas são descritas diretamente na Tela por `navegacao.rotas[]` e declarações `quando`. A árvore de Fluxo preserva as ocorrências, sequências, ramos e caminhos editoriais, mas **não replica o registro de destinos**. As fontes anteriores podem conter aqueles nomes **somente como evidência histórica de migração**, nunca como estrutura nova aprovada.

### Escopo e fontes efetivamente examinadas

| Fonte | Papel | Estado da evidência |
|---|---|---|
| `ADVOGADOJA_DIRECAO_CANONICA_MODELO_TELAS_COMPONENTES_MODULOS_V1 (1).md` | Padrão V0.10, responsabilidades de Tela/Jornadas/Fluxo/Protótipo, catálogo de campos e regras visuais | Lido integralmente |
| `MAPA_EQUIVALENCIA_ESTRUTURA_JSON_TELAS_COMPONENTES_ADVOGADO_V1.md` | Equivalência campo a campo e inventários das 33 telas e 99 componentes | Lido integralmente e atualizado |
| `ADVOGADOJA_GARANTIA_CONVERSAO_INTEGRAL_FLUXO_V1.md` | Preservação de estruturas Flow, divergências da V3, testes e requisitos de reconversão | Lido integralmente, requisitos incompatíveis revisados |
| `advogado_catalogo_completo (1).json` | Fonte real de telas, componentes, instâncias e dados auxiliares | Inspecionado programaticamente; SHA-256 `670bbc235e8ced14a93228f48233f26d56bd4d1195b5fec0cc8b5460171fdcca` |
| Modelo demonstrativo `AdvogadoJa_Arvores_Modelo_Telas_Componentes_V010 (1).html` | Estrutura de referência V0.10 | Seus campos foram descritos nas fontes e utilizados como referência estrutural; não homologação do app |
| `ADVOGADOJA_DOCUMENTO_CANONICO_CONSOLIDADO_V2.md` | Base integral desta V3, já incorpora as decisões de exclusão e os inventários | Preservada, atualizada e complementada; **sem migração executada** |
| `CONTRATO_CANONICO_V1.md` | Conexões, eventos, condições, bifurcação inferida, retornos, segmentos e painel de inspeção do Fluxo | Reavaliado: comportamento mantido quando compatível; aliases, escopo legado e duplicação de destinos **não adotados** |
| `MAPEAMENTO_CAMPOS_FRONT.md` | Campo → consumo do frontend do Flow; inferência de bifurcações e controles de edição/exportação | Reavaliado: campos propostos tratados como **candidatos**; legado separado de fontes operacionais; aliases não utilizados |


**Interpretação dos status:** **[APROVADO]** decisão expressa do usuário; **[DEFINIDO]** princípio arquitetural consolidado; **[OBSERVADO]** fato registrado nos arquivos citados (com a fonte/versão indicada); **[PROPOSTO]** formato técnico candidato, ainda não homologado; **[PENDENTE]** definição, prova ou decisão em aberto; **[EXEMPLO]** demonstração que não descreve comportamento de produção. **Uma proposta técnica da V1 não vira aprovação por aparecer nesta V3.**

### Sumário

1. [Direção, precedência e decisões definitivas](#1-direção-precedência-e-decisões-definitivas)
2. [Arquitetura do projeto e responsabilidades dos quatro módulos](#2-arquitetura-do-projeto-e-responsabilidades-dos-quatro-módulos)
3. [Estrutura canônica de cada JSON de Tela](#3-estrutura-canônica-de-cada-json-de-tela)
4. [Estrutura canônica de cada JSON de Componente](#4-estrutura-canônica-de-cada-json-de-componente)
5. [Mapa completo de equivalência estrutural e conversão](#5-mapa-completo-de-equivalência-estrutural-e-conversão)
6. [Saneamento dos componentes e campos obsoletos](#6-saneamento-dos-componentes-e-campos-obsoletos)
7. [Fluxo: identidade única, preservação e conversão integral](#7-fluxo-identidade-única-preservação-e-conversão-integral)
8. [Contrato de navegação da Tela e interpretação pelo Fluxo](#8-contrato-de-navegação-da-tela-e-interpretação-pelo-fluxo)
9. [Mapeamento dos campos para o frontend do Fluxo](#9-mapeamento-dos-campos-para-o-frontend-do-fluxo)
10. [Validação, testes, interoperabilidade e homologação](#10-validação-testes-interoperabilidade-e-homologação)
11. [Pendências, ordem de implementação e critérios de aceite](#11-pendências-ordem-de-implementação-e-critérios-de-aceite)
12. [Anexo A — Inventário das 33 telas](#anexo-a--inventário-das-33-telas)
13. [Anexo B — Inventário das 64 definições referenciadas](#anexo-b--inventário-das-64-definições-referenciadas)
14. [Anexo C — Inventário das 35 definições locais](#anexo-c--inventário-das-35-definições-locais)
15. [Anexo D — Dicionário de campos V0.10](#anexo-d--dicionário-de-campos-v010)
16. [Anexo E — Rastreabilidade e histórico das mudanças](#anexo-e--rastreabilidade-e-histórico-das-mudanças)
17. [Anexo F — Correspondência integral dos dois novos documentos](#anexo-f--correspondência-integral-dos-dois-novos-documentos)
18. [Anexo G — Critérios de cobertura e checklist documental V3](#anexo-g--critérios-de-cobertura-e-checklist-documental-v3)

---

## 1. Direção, precedência e decisões definitivas

### 1.1 Finalidade, unidade lógica e ordem de elaboração

**[DEFINIDO]** Definir um único contrato de cada Tela e de cada Componente, capaz de abastecer Tela, Jornadas, Fluxo e Protótipo sem multiplicar a mesma definição. A sequência editorial é: **necessidade de produto → telas e componentes → IDs e campos → contrato JSON e suas relações → visualizações dos módulos → motores/adaptadores**. Nenhum motor legado determina o schema por conveniência.

**Unidades distintas:** uma *tela* representa um objeto lógico; um *componente* é uma definição de UI; uma *instância* posiciona esse componente numa tela e recebe `props`; um *elemento* integra o DOM da definição; uma *ocorrência de Fluxo* é um nó contextual que aponta para a tela sem se tornar outra tela; um *item repetível* tem ID próprio quando é objeto referenciável.

### 1.2 Decisões aprovadas e regras prevalentes nesta revisão

| Assunto | Regra prevalente na V3 | Consequência operacional |
|---|---|---|
| Identidade única | **Proibido `aliasMap`** nos contratos, catálogos, módulos, arquivos operacionais e conversores da arquitetura nova. | Referências apontam diretamente a um único `identidade.id`; divergências são erros de referência, não resolvidas por tabela intermediária. |
| Campos antigos | `participacoes`, `moduloRef`, `submoduloRef`, `escopo`, `secao` não são campos do padrão canônico. | Não gerar os campos; valores originais, se existirem, ficam na fonte histórica imutável ou relatório de migração. |
| Conteúdo duplicado | Não gerar `conteudo.instancias` ou `componentes.instanciasRefs`. | Usar apenas `estrutura.html.composicao[instanciaId]`, `componenteRef` e `props`. |
| Etiquetas artificiais | **Excluir as 30 definições** `popup.screen-note` do catálogo-alvo, com suas instâncias. | Nenhuma identificação de tela isolada aparece como componente do app. |
| Modal de navegação artificial | **Excluir as duas definições** `modal.route-modal.v01` e `.v02` e suas 33 instâncias. | Não substituir por outro modal; Protótipo usa navegação simulada a partir de conexões legítimas. |
| Barras de título | **Auditar 23 definições** `header.titlebar` antes de consolidar. | Comparar estrutura HTML normalizada, CSS, vínculo de props e dependências. Nenhuma fusão automática. |
| Metadados do motor | `screenConfig.enginePolicy`, `runtime`, `organization`, `dataRef` não vão por inércia no JSON unitário. | Colocar apenas dados efetivamente necessários no manifesto/adaptador, preservando origem. |
| Dados por instância | Migrar `screen.content.components` para `composicao[instanciaId].props`. | A mesma definição de componente pode aparecer com textos e listas diferentes. |
| Fluxo e Mapa | Preservar os vínculos contextuais separadamente da definição visual. | Nenhuma ocorrência cria outro contrato de tela. |
| Frontend do Fluxo | Consultar/editar diretamente `tela.navegacao.rotas[]` e `rota.quando`, preservando a árvore editorial do Fluxo. | **[APROVADO]** Não existe cadastro próprio `conexoes` ou `condicoes` nem uma segunda fonte de destinos. |
| Bifurcações | Distinguir branches **importados** (evidência editorial) dos losangos **calculados** (visualização de rotas comprovadas). | Nenhum losango visual gera outra rota ou regra persistida. |


**Identidade única sem renomeação silenciosa:** no catálogo auditado existe `advogado.home_advogado`. O exemplo V0.10 usa `advogado.home`, mas isso **não** homologa uma troca. O ID do catálogo permanece até decisão explícita de renomear e atualizar atomicamente todas as referências. **Não criar uma segunda Home para contornar o problema.**

### 1.3 Precedência e legado

1. Decisões explícitas mais recentes do usuário prevalecem sobre redações anteriores em conflito.
2. Os campos V0.10 são a referência de trabalho, não um schema formal de produção já aprovado.
3. A declaração “preservar 100%” aplica-se à **captura e ao arquivo histórico da fonte** e aos dados funcionais não excluídos; os elementos cuja remoção foi aprovada **não precisam continuar no contrato operacional**.
4. Mudanças intencionais do catálogo-alvo devem aparecer em um *diff de migração autorizado*, nunca ser ocultadas sob o rótulo “conversão sem diferenças”.
5. Nenhuma rota, condição, autorização, API, regra de OAB ou associação editorial pode ser criada por similaridade de nome, ordem visual ou suposição.

### 1.4 Princípios invariantes

- Fonte única para cada dado sem duplicação operacional.
- Identidade estável e verificável, sem aliases.
- Composição por instância com propriedades contextuais e definição de componente referenciada.
- Uma tela pode ter estados, variantes, múltiplas ocorrências e apresentações sem cópia integral.
- Mocks nunca são fonte de produção nem autorizam operações.
- Importação e exportação não descartam campos **não excluídos** que o módulo não entende.
- Arquivos físicos desconectados não se atualizam magicamente; a propagação compartilhada é uma operação explícita.
- Não declarar homologação estrutural, visual, funcional ou de backend sem testes e evidência.

---

## 2. Arquitetura do projeto e responsabilidades dos quatro módulos

### 2.1 Três níveis de interface

| Nível | Função | Restrição |
|---|---|---|
| Projeto / Index | Cabeçalho global, navegação principal, área de trabalho e escolha do módulo | Não é fonte de negócio nem decide o visual da tela do produto. |
| Módulo de trabalho | Interface especializada de edição/visualização de Tela, Jornadas, Fluxo ou Protótipo | Não duplica shell nem reinventa componentes do produto. |
| Tela e Componente do produto | HTML/CSS declarativos, `props`, eventos, estados, variantes e dados | Não contém menus do editor, etiquetas de teste ou modais de rota artificial. |

**Organização conceitual, não mudança automática de diretórios:**

```text
projeto/
├── index / workspace
├── modulos/
│   ├── tela/
│   ├── jornadas/
│   ├── fluxo/
│   └── prototipo/
├── biblioteca/ui_library/conteudo/
│   ├── telas/
│   └── componentes/
├── data/                   # configuração específica dos módulos, quando houver
└── documentos/             # especificações, manifestos, validações e histórico
```

As regras físicas existentes do construtor para leitura de `data` e da biblioteca permanecem válidas; a árvore é demonstrativa.

### 2.2 Papéis e fronteiras

| Módulo | O que apresenta | O que edita/usa | O que não pode fazer |
|---|---|---|---|
| **Tela** | Árvore da definição e dos componentes, props, estados e prévia | Contrato de tela e componentes por IDs | Inferir banco, fluxos ou regras reais apenas pelo texto visível. |
| **Jornadas** | Ordem editorial, agrupamento, galeria e prévia fiel | Vínculos editoriais declarados e seleção de dispositivos | Transformar ordem editorial em rota operacional. |
| **Fluxo** | Nós por ocorrência, conectores e alternativas | Lê/edita `navegacao.rotas[]` da Tela de origem, além da própria apresentação editorial | Deduzir destinos de posição, sequência, rótulo ou nome de botão. |
| **Protótipo** | Simulação de estados, variações e percursos válidos | Sessão local + relações efetivas do contrato | Chamar serviços reais ou abrir `modal.route-modal` para fingir navegação. |

### 2.3 Regras de UX e interoperabilidade

As interfaces dos quatro módulos **não precisam ser visualmente iguais**; precisam representar a **mesma tela do produto** usando o mesmo contrato. A galeria de Jornada não é grafo; o grafo de Fluxo não é simulador; o Protótipo simula somente destinos/condições explícitos. CSS de `.header`, `.menu` e demais seletores do produto deve ser isolado do CSS do editor. Produto mobile-first; ambiente de edição funcional em desktop e tablet; foco/teclado, contraste, estados vazios e erros visíveis.

O Protótipo deve distinguir ação local (abrir menu, alternar estado, fechar modal real) de navegação entre telas; não reintroduzir um modal de simulação por conveniência. Uma rota com destino não resolvido é exibida como **pendência**, não como aviso genérico de “tela isolada”.

### 2.4 Matriz de leitura/edição

| Bloco | Tela | Jornadas | Fluxo | Protótipo |
|---|---|---|---|---|
| `identidade` | Inspeciona/edita | Lê | Lê | Lê |
| `classificacao.jornadas` | Inspeciona | Lê/edita vínculo, se aprovado | Contexto | Contexto |
| `estrutura` + `props` | Edita e pré-visualiza | Renderiza | Prévia | Renderiza |
| Definições de componente e CSS | Inspeciona/edita | Renderiza | Prévia | Renderiza |
| `navegacao.rotas[]` + `.quando` | Inspeciona/edita | Consulta | Lê/edita a rota da Tela de origem | Executa simulação |
| `estados` + `variantes` | Edita | Prévia local | Contexto/condições | Resolve na sessão |
| `interacoes` + eventuais `acoes` | Edita | Só efeito local seguro | Contexto/evento | Simula efeitos |
| `dados` | Declara/inspeciona | Apresenta | Contexto | Simula valores |
| `mocks` | Inspeciona | Preserva | Preserva | Seleciona cenário |

---

## 3. Estrutura canônica de cada JSON de Tela

### 3.1 Forma unitária e pacote de transporte

No modelo V0.10, um pacote de trabalho pode conter `schema`, `schemaVersion`, `telas` e `componentes`. A unidade de Tela mantém `identidade.id`, independentemente do índice externo. A chave `telas[id]`, quando usada, precisa coincidir **exatamente** com o ID declarado, sem catálogo paralelo de equivalências.

```text
Tela
├── schema / schemaVersion
├── identidade { id, tipo, namespace?, nome?, nomeExibicao?, descricao? }
├── classificacao { localizacao?, jornadas? }
├── estrutura
│   ├── html
│   │   ├── raizRef
│   │   └── composicao[instanciaId] { componenteRef, paiRef?, slot?, ordem?, props? }
│   └── css { tokens?, regras? }
├── navegacao { rotas[] }
├── estados { itens[]?, dimensoes?, fallbackSeguro? }
├── variantes { itens[] }
├── interacoes { eventos[] }
├── dados { fontes[]?, operacoes[]?, persistencia[]? }
└── mocks { cenarios[] }
```

**Obrigatoriedade fina ainda [PENDENTE]:** o fato de V0.10 demonstrar um bloco não obriga que todas as telas o tenham preenchido; a validação formal deverá determinar mínimos por tipo de caso real.

### 3.2 Exemplo ilustrativo de Tela (não apto a produção)

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
  "estrutura": {
    "html": {
      "raizRef": "<PENDENTE_LAYOUT_REAL>",
      "composicao": {
        "screen.content": {
          "componenteRef": "cmp_advogado_assinatura_checkout_main_content",
          "paiRef": "<PENDENTE_PAI_REAL>",
          "slot": "main",
          "ordem": 30,
          "props": {
            "content": { "stripe_checkout": "Stripe Checkout" }
          }
        }
      }
    },
    "css": { "tokens": {}, "regras": {} }
  },
  "navegacao": { "rotas": [] },
  "estados": {},
  "variantes": { "itens": [] },
  "interacoes": { "eventos": [] },
  "dados": {},
  "mocks": { "cenarios": [] }
}
```

`screen.content` é **uma convenção candidata de ID de instância**, não um ID já oficial; os textos `<PENDENTE_...>` marcam lacunas reais. O fragmento demonstra o destino de `props` e **não** inventaria final da tela: não copiar vazios como prova de inexistência de ações/estados.

### 3.3 Regras estruturais obrigatórias

1. A tela não embute cópias integrais de todas as definições; usa `componenteRef` estável.
2. `estrutura.html.raizRef` aponta a raiz real e resolúvel da composição; `paiRef` pode apontar para slot ou elemento exposto, desde que o renderizador saiba resolver o escopo.
3. As instâncias possuem IDs locais à tela, sem colisões, e a ordem é preservada independentemente do ID.
4. `props` contém os valores contextualizados que antes estavam em `screen.content.components[id]`; preservar tipos, listas, strings, booleanos e objetos integralmente.
5. Os itens de lista referenciáveis recebem IDs estáveis **apenas quando comprovados ou definidos conscientemente**, nunca automaticamente pelo índice do array.
6. `estrutura.css` guarda tokens e regras da tela; CSS da definição permanece no Componente. Não criar um bloco `estilos` paralelo.
7. `navegacao.rotas[]` representa o acionamento de destino real ou comportamento local declarado; o antigo catálogo geral `screenConfig.routes` não vira automaticamente ligações.
8. `estados` representa estados de UI/domínio definidos; snapshot `state` de apresentação não é prova suficiente para criar regras permanentes.
9. `variantes` afeta alvos por IDs de instância/elemento e condições tipadas; condição de OAB exemplificativa não homologa autorização.
10. `interacoes.eventos[]` identifica origem e efeito, sem duplicar destino em `acoes` e `navegacao`.
11. `dados.fontes/operacoes/persistencia` exige origem real; não criar Firestore, API ou endpoint por adivinhação.
12. `mocks.cenarios` é somente para dados de ensaio explícitos; não mistura sessão do Protótipo com o contrato persistente.
13. Nenhum campo do módulo Fluxo é copiado para cada tela apenas para facilitar desenho de setas.

### 3.4 Navegação, estados, condições e ações

- **Navegação:** distingue a rota usada para entrar na tela (`screen.contract.route`, legado) de uma saída declarada (`navegacao.rotas[]`). A origem do evento visual deve trazer `instanciaRef`, `elementoRef` e `itemRef` quando for coleção.
- **Estados:** podem coexistir em dimensões independentes (menu aberto/fechado, disponibilidade online/offline, carregamento/erro). A mesma tela continua tendo o mesmo ID.
- **Condições:** expressões declarativas tipadas (`campo`, `operador`, `valor` etc.), sem avaliação de JavaScript arbitrário. Operadores compostos e prioridades ainda exigem especificação.
- **Variantes:** modificam visibilidade/classe/atributo ou valor de um alvo estável; não exigem clones de tela. O exemplo V0.10 de `.is-offline` exige correspondência exata entre classe aplicada e seletor CSS.
- **Ações:** operações reais complexas podem usar IDs e referências compartilháveis, mas não se deve criar um segundo destino redundante.
- **Permissões:** ocultar um botão não substitui autenticação/autorização no backend.

---

## 4. Estrutura canônica de cada JSON de Componente

### 4.1 Forma da definição

```text
Componente
├── identidade { id, tipo = "componente", nome?, descricao? }
├── classificacao { localizacao? }
└── estrutura
    ├── html
    │   ├── raizRef
    │   ├── elementos[elementoId] { tag, paiRef?, ordem?, atributos?, texto? }
    │   ├── vinculos[] { elementoRef, propriedade, campo }
    │   └── colecoes[] { modelo e repetição declarativa, quando necessário }
    └── css { regras }
```

**Sem valores contextualizados na definição:** o componente declara onde usar os dados; a instância da tela fornece cada valor em `props`. O mesmo componente pode aparecer em várias telas ou várias vezes na mesma tela, sem receber novo ID para cada ocorrência.

### 4.2 Exemplo real de vínculo, simplificado

```json
{
  "identidade": {
    "id": "header.app-header.v01",
    "tipo": "componente",
    "nome": "Cabeçalho"
  },
  "estrutura": {
    "html": {
      "raizRef": "header.raiz",
      "elementos": {
        "header.raiz": { "tag": "header", "paiRef": null, "ordem": 10 },
        "header.marca": { "tag": "strong", "paiRef": "header.raiz", "ordem": 20 }
      },
      "vinculos": [
        { "elementoRef": "header.marca", "propriedade": "texto", "campo": "content.advogadoja" }
      ]
    },
    "css": { "regras": {} }
  }
}
```

**[EXEMPLO PARCIAL]** O template real contém `{{content.advogadoja}}`. A árvore ilustrada é incompleta e não substitui a conversão integral das tags, SVGs, atributos, estrutura, seletores e media queries presentes nos arquivos.

### 4.3 Identidade, componentes locais e reuso

- As **64 definições** em `components[ref]` já possuem `component.identity.id` global no catálogo. Mesmo `engineering.sharing.mode=local` **não autoriza renomear** uma definição válida.
- As **35 definições embutidas** em `localComponents[owner::local::key]` usam nomes locais repetidos (`content`, `hero` etc.) e têm um `component.engineering.componentId` único `cmp_*`. Esse ID comprovado deve se tornar `identidade.id` global, em vez de reutilizar a palavra genérica.
- `usedBy`, `usage`, listas de telas consumidoras e quantidade de ocorrências devem ser índices **derivados** do grafo de instâncias, não cópias atualizadas manualmente dentro dos componentes.
- Mudanças em componente compartilhado alcançam os consumidores apenas por atualização explícita do conjunto e nova exportação; não há sincronização automática de arquivos desconectados.

### 4.4 Conversão do template e fidelidade

1. Percorrer HTML como árvore real, produzindo IDs de elementos únicos no escopo do componente.
2. Preservar tags, texto, atributos, `aria-*`, `data-*`, SVG e hierarquia sem achatar elementos.
3. Resolver `{{campo}}` como vínculo declarativo com `props`; `{{#each}}` como coleção e modelo repetível; `{{#if}}` como condição declarativa **somente se houver semântica definida**.
4. Se `{{#if}}` ou expressão de template não tiver equivalente aprovado, marcar pendência e conservar o template histórico fora do contrato, até implementação segura.
5. Preservar CSS efetivo (seletores, cascata, media queries, escopo e ordem); comentários de “sem estilos exclusivos” não provam que o componente dispensa estilo herdado.
6. Verificar HTML/CSS em mobile/desktop e diferentes estados antes de declarar equivalência.
7. A interface de `props` por componente (tipos, defaults, validação, compatibilidade) segue [PENDENTE] de schema formal.

### 4.5 Casos que não devem ser fundidos por conveniência

- Um `modal.flow-checkout-return.v01` não é `modal.route-modal`: só o segundo grupo teve a remoção aprovada. O modal de retorno do checkout **permanece sob avaliação funcional**.
- `popup.status-toast.v01` pode representar feedback visual real e não foi descartado.
- `header.titlebar` recebe auditoria de semelhança, não exclusão automática, pois CSS próprio ou herdado pode alterar a renderização.

---

## 5. Mapa completo de equivalência estrutural e conversão

### 5.1 Tela — campos originais para V0.10

A tabela conserva toda a cobertura do mapa V1, mas decisões posteriores da seção 6 prevalecem: componentes artificiais de identificação/navegação não são instanciados no destino; metadados do motor seguem externos e a identidade não aceita aliases.

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

### 5.2 Procedimento de migração por Tela

1. Ler `screens[ID].screen.identity.id` e exigir igualdade com a chave do índice. Guardar snapshot imutável do objeto-fonte e SHA-256.
2. Para cada `screen.engineering.screenConfig.composition[slot][]`, separar entradas de **componentes aprovados** das entradas cuja exclusão foi autorizada (`popup.screen-note` e `modal.route-modal`).
3. Criar uma tabela **temporária de migração** `(idTela, slot, idInstanciaOriginal, componenteOriginal) → instanciaId` com IDs estáveis, sem tabela de aliases operacionais de tela; detectar colisões locais.
4. Resolver `sourceType=shared` por `item.ref` existente em `components`; `sourceType=local` por `item.componentId` existente em `localComponents` ou referência válida em `components`.
5. Copiar `screen.content.components[item.id]` para `props` da mesma instância, conservando o valor e tipo JSON. Propriedades de componentes removidos não migram ao contrato operacional e são auditadas no diff aprovado.
6. Preservar `slot`, `order` e propriedades operacionais relevantes (`enabled`, `required`, `initiallyHidden`) pela semântica aprovada. Resolver `raizRef` e `paiRef` usando layout real — não inventar uma raiz só para satisfazer a demonstração V0.10.
7. Converter HTML/CSS dos componentes referenciados sem alterar estrutura, dados e interações legítimas.
8. Distinguir destino de `screenConfig.routes` de navegação acionável por elemento, `data-goto` e eventos comprovados.
9. Exportar cada contrato unitário e suas dependências; gerar relatório de elementos preservados, excluídos e pendentes.
10. Comparar renderizações e verificar integridade de IDs, props e interações. Não homologar apenas porque o JSON passou em parser.

**Observação conferida diretamente:** existe uma instância que referencia `modal.flow-checkout-return.v01` em `advogado.assinatura.checkout` sem entrada de `props` por `item.id`; isto **não é necessariamente erro** (props podem ser opcionais). A coluna do mapa V1 “Props sem instância” trata da situação oposta e não autoriza preenchimento artificial.

### 5.3 Componente — campos originais para V0.10

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

### 5.4 Exemplos de valor e referência que devem permanecer íntegros

```text
Tela: advogado.assinatura.checkout
  composition.main[0].id                = content
  composition.main[0].componentId       = cmp_advogado_assinatura_checkout_main_content
  screen.content.components.content.content.stripe_checkout = "Stripe Checkout"
  localComponents[advogado.assinatura.checkout::local::content]
    → template.html usa {{content.stripe_checkout}}

Destino previsto (forma, não contrato completo):
  tela.estrutura.html.composicao[instanciaId].componenteRef
    = cmp_advogado_assinatura_checkout_main_content
  tela.estrutura.html.composicao[instanciaId].props.content.stripe_checkout
    = "Stripe Checkout"
  componente.identidade.id
    = cmp_advogado_assinatura_checkout_main_content
  componente.estrutura.html.vinculos[]
    → elementoRef do texto, campo "content.stripe_checkout"
```

### 5.5 Matriz de dados disponíveis e lacunas reais

| Campo canônico | Evidência na fonte | Tratamento |
|---|---|---|
| `identidade` | `screen.identity` e `component.identity` | Conversão direta de ID e atributos aplicáveis. |
| `classificacao.localizacao` | Caminhos físicos e `basePath` | Converter apenas quando localização lógica foi confirmada. |
| `classificacao.jornadas` | Não declarado por tela nesse recorte | Não deduzir de fluxo ou diretório. |
| `estrutura.html.composicao` | 186 instâncias originais | 63 removidas por decisão; 123 candidatas a migrar, sem contagem como homologação final. |
| `estrutura.html.elementos` | Fontes `template.html` nas 99 definições | Converter 67 definições candidatas; título/HTML exigem auditoria. |
| `vinculos` e `colecoes` | `{{campo}}`, `#each`, `#if` | Exigir parse/semântica; preservar sem perda. |
| `estrutura.css` | `style.css` e tokens da tela | Garantir cascata, responsividade e CSS herdado. |
| `navegacao.rotas` | `screenConfig.routes`, `data-goto` e eventos | Só saída com gatilho/destino comprovados. |
| `estados/variantes` | Snapshots, rótulos de runtime, presentationStates | Resolver dimensões e condições antes de persistir como estados. |
| `interacoes.eventos` | `data-action` e outras referências do template | Declarar origem e efeito, sem inventar backend. |
| `dados` | Estáticos e `dataSource=screen-data` | Não criar fonte real a partir de texto ou mock. |
| `mocks` | Dados demonstrativos em parte das telas | Só cenários comprovados; nunca fonte operacional. |
| `flowOccurrences` e `mapDefinition` | 93 ocorrências de Fluxo e definições de Mapa em 2 telas | Preservar como domínio específico externo, com refs diretas. |

---

## 6. Saneamento dos componentes e campos obsoletos

### 6.1 Inventário do impacto aprovado — perfil Advogado

**[OBSERVADO]** Inspeção do arquivo `advogado_catalogo_completo (1).json`:

| Medida | Antes | Exclusões aprovadas | Restantes candidatos |
|---|---:|---:|---:|
| Definições de Tela | 33 | 0 | **33** |
| Definições de Componente referenciado (`components`) | 64 | 30 `popup.screen-note` + 2 `modal.route-modal` | **32** |
| Definições embutidas (`localComponents`) | 35 | 0 | **35** |
| Definições totais de componente | **99** | **32** | **67** |
| Instâncias em `composition` | **186** | 30 `screen-note` + 33 `route-modal` | **123** |
| Definições `header.titlebar` (incluídas nos restantes) | 23 | 0 nesta etapa | **23 sob auditoria** |

**Importante:** são números-alvo após exclusões **ainda não executadas**; não confundir com uma migração implementada. A retirada de duas definições de `route-modal` elimina **33 ocorrências**, pois eram compartilhadas em todas as telas do recorte. O agrupamento de `screen-note` possui uma definição local em cada uma das 30 telas afetadas.

### 6.2 Exclusão completa dos artificiais de apresentação

**`popup.screen-note`** — excluir sua definição do pacote canônico, cada instância correspondente, `props` dedicadas e recursos visualmente exclusivos **se não usados por mais nada**. Não apagar título ou informações legítimas da tela: metadados de identidade permanecem no contrato próprio, e conteúdo ainda necessário deve ter destino justificado.

**`modal.route-modal.v01` e `.v02`** — excluir as duas definições, todas as 33 instâncias correspondentes, gatilhos/rotinas exclusivos do modal e textos de aviso de navegação simulada. **Não criar outro modal de substituição.** A navegação entre telas no Protótipo deverá ocorrer por rotas/conexões reais e declaradas; interações sem destino serão marcadas como pendentes. Revisar `data-action`, `data-goto` e JS legado para não deixar event handlers mortos.

**Exclusão controlada:** retirar a UI obsoleta não autoriza apagar o vínculo real de navegação que antes acionava a simulação, quando esse vínculo for verificável. Se não há destino explícito, nenhuma rota é fabricada.

### 6.3 Estudo das 23 definições `header.titlebar`

A comparação dos `template.html` da fonte mostrou **23 estruturas equivalentes depois de normalizar apenas os tokens `{{...}}`**: todas têm a forma `<div class="app-titlebar"><strong>{{PROP}}</strong></div>`. Porém, o CSS as divide em **três grupos**:

| Agrupamento constatado | Quantidade | Evidência | Ação |
|---|---:|---|---|
| Mesmo template normalizado + comentário de estilo sem regra exclusiva | **21** | Estilo local remete ao CSS principal/hospedeiro. | Candidatos a consolidar **após** comprovar CSS herdado, bindings e diferenças de contexto. |
| `header.titlebar.v01` | **1** | CSS próprio em `.app-titlebar` com padding/borda/cor/tamanho. | Comparar equivalência visual e papel de CSS compartilhado. |
| `screen.advogado.configuracao.agenda_semanal.header.titlebar` | **1** | CSS próprio com min-height/flex/alinhamento. | Preservar variação se afetar layout; não fundir por similaridade de HTML. |

**O exemplo V0.10 também precisa de saneamento:** o `seed` do HTML de referência inclui `screen.modal` usando `modal.route-modal.v02` e sua definição visual. Esses itens ilustrativos deixam de ser modelo operacional após a decisão incorporada nesta V3; demais campos do V0.10 continuam referência estrutural.

**Esse agrupamento não é homologação de duplicidade.** Se a consolidação for aprovada depois, reusar uma definição existente e migrar as diferenças para `props`/variantes **somente quando representáveis e visualmente equivalentes**. Não escolher um componente vencedor por contagem de uso.

### 6.4 Campos sem função no novo contrato

| Família de campo | Direção V2 | Onde fica o dado de origem |
|---|---|---|
| `participacoes`, `moduloRef`, `submoduloRef`, `escopo`, `secao`, `participacaoRef` | Não gerar. | Snapshot histórico de entrada; registro de mudança, se havia valor. |
| `conteudo.instancias` | Não gerar. | Valores úteis migrados para `props`. |
| `componentes.instanciasRefs` | Não gerar. | Referência única em `composicao[instanciaId].componenteRef`. |
| `estilos` paralelo | Não gerar por padrão. | CSS em `estrutura.css` do objeto responsável. |
| `screenConfig.enginePolicy/runtime/organization/dataRef` | Fora do contrato unitário por padrão. | Manifesto/adaptador somente quando houver consumidor demonstrado. |
| `screen.lifecycle`, `component.lifecycle`, `usedBy`, `usage`, `previousComponentId` | Não tornar campos obrigatórios. | Relatório de migração ou índices gerados a partir de IDs. |
| `screen.contract.route` (rota de entrada) | Não confundir com `navegacao.rotas` de saída. | Índice de rota do app ou contrato de roteamento externo, se necessário. |
| Blocos `flowOccurrences`, `mapDefinition` | Fora dos contratos unitários de UI. | Domínios próprios com refs canônicas diretas. |
| `aliasMap` | **Não utilizar nem gerar.** | Uma fonte antiga que o possuía pode ser arquivada como evidência histórica; nenhum leitor do sistema novo deverá consultá-lo. |

### 6.5 Itens **não** aprovados para exclusão automática

`modal.flow-checkout-return.v01`, `popup.status-toast.v01`, `screen.advogado.disponibilidade.component.raio-atendimento` e demais componentes restantes precisam ser analisados pela função real, pela origem e pelo contrato. Não classificá-los como obsoletos apenas por serem `modal`, `popup`, `local` ou `screen-component`.

---

## 7. Fluxo: identidade única, preservação e conversão integral

### 7.1 Escopo separado dos contratos de UI

O módulo Fluxo representa **ocorrências, sequências, ramos, caminhos, condições e conexões**. O JSON de Tela define componentes e interações; não armazena todos os nós de edição de Fluxo. A presença de múltiplos nós em contextos distintos usa o **mesmo `telaId`**, cada nó com seu próprio `occurrenceId`. Um componente de UI não vira um nó de Fluxo só porque participa de navegação.

**Nenhum mecanismo operacional de equivalências alternativas entre IDs.** A resolução de cada nó usa o ID canônico que existe no catálogo carregado. Referências divergentes são `referencia_nao_resolvida` até que uma decisão explícita de migração substitua todas as referências correlatas. A Home `advogado.home_advogado` é a entrada real do recorte de 33 telas; `advogado.home` permanece caso de referência V0.10 até uma unificação aprovada e executada.

### 7.2 Fontes do Fluxo descritas e diferenças constatadas no documento V1

Os números abaixo são evidência **reportada pela auditoria V1 do Fluxo** para arquivos concretos, não nova contagem feita neste trabalho sobre os JSONs da projeção V3 (que não são anexos autônomos nesta entrega).

| Fonte | Local | Conteúdo observado |
|---|---|---|
| Projeção do Fluxo | `advogadoja-fluxo-projecao (7).json` → `domain.flow.graph.root` | `118` sequências, `197` ocorrências de tela, `36` branches (`32 navigation`, `4 condition`) e `117` paths. |
| Projeção do Fluxo — demais blocos | Mesmo JSON | `core.screens` com `78` chaves; `catalog.entries` com `78` entradas; `domain.flow.state` com `nodes`, `paths`, `transitions`, `segments` vazios na fonte inspecionada, além de `history`; metadados, timestamps e revisões. |
| Apresentação Flow V3 | `ADVOGADOJA_FLOW_V3_BASE_CONTRATO_V02 (1).zip` → `flow_apresentacao_v3.json` | `115` sequências, `197` ocorrências de tela, `33` branches e `114` paths; `aliasMap` com 11 entradas, `legacyScreens`, `politica` e metadados de origem. |
| Catálogo referenciado no pacote V3 | ZIP → `catalogo/catalogo.json` | Índice de telas e componentes associado à apresentação; é uma **referência** do Fluxo, não autorização para alterar o modelo visual das telas. |
| Documento de direção das conexões | `CONTRATO_CANONICO_V1.md` (anexo disponibilizado nesta revisão) | Regras conceituais de IDs, conexões, bifurcação inferida, entradas, retornos, estados e não inferência de negócio; **formas físicas ainda propostas**. |

**[PRESERVAR]** As duas representações possuem 197 ocorrências no escopo daquela auditoria, mas diferem em três sequências, três ramos e três caminhos. **Isso é distinto** das 93 referências a ocorrências do Fluxo encontradas no catálogo de 33 telas; os conjuntos/fontes têm escopos diferentes e os números não devem ser somados ou declarados iguais.

### 7.3 Divergências de checkout que não podem ser apagadas

| Pai | Branch presente na projeção (7) | Path e sequência presentes na projeção (7) | Substituição observada na apresentação V3 |
|---|---|---|---|
| `sequence-0168` | `branch-checkout-0142` (`condition`, “Resultado do checkout”) | `path-checkout-0142`, `sequence-checkout-0142` | `screen-0143` aparece diretamente como item da sequência. |
| `sequence-0236` | `branch-checkout-0210` (`condition`, “Resultado do checkout”) | `path-checkout-0210`, `sequence-checkout-0210` | `screen-0211` aparece diretamente como item da sequência. |
| `sequence-0408` | `branch-checkout-0382` (`condition`, “Resultado do checkout”) | `path-checkout-0382`, `sequence-checkout-0382` | `screen-0383` aparece diretamente como item da sequência. |

**Regra de migração:** a apresentação V3 achatou três agrupamentos condicionais. Eles não são “campos obsoletos” nem “nós duplicados”. Quando uma conversão exigir equivalência com a projeção (7), será necessário transportar os IDs/estruturas que faltam por fonte comprovada; não reinferir branch pela palavra “checkout”.

### 7.4 Identidades e conceitos do Fluxo

| Conceito | Identificação | Restrição |
|---|---|---|
| Tela | `telaId` | Existe uma definição de tela; referência direta e única. |
| Ocorrência | `occurrenceId` | Uma presença contextual em sequência ou ramo; não é outra tela. |
| Sequência | `sequenceId` | Ordem e agrupamento, inclusive arrays vazios. |
| Ramo | `branchId` | Título, tipo e opções de origem; não assumir condição executável. |
| Caminho | `pathId` | Alternativa, ordem e `isDefault` explícito quando houver. |
| Rota funcional | `navegacao.rotas[].id` | Identifica a transição no JSON da Tela de origem; seu contexto define a origem. |
| Predicado da rota | `navegacao.rotas[].quando` | Regra declarativa inline; não há coleção separada de predicados. |
| Evento | ID de ação/interação | Ações de menu são opções, não uma bifurcação booleana automática. |
| Estado / variante | IDs correspondentes | Mudança local não cria rota ou tela nova. |
| Referência antiga | Campo original no snapshot | Não funciona como segundo identificador nem alias operacional. |

### 7.5 Duas camadas, uma única fonte de navegação

```text
BIBLIOTECA DE TELAS E COMPONENTES
   ├── Tela.identidade.id
   ├── Tela.navegacao.rotas[]          ← DESTINOS OPERACIONAIS
   │        └── rota.quando?            ← REGRA INLINE, OPCIONAL
   ├── Tela.interacoes.eventos[]       ← EFEITOS LOCAIS
   └── Tela.estados / variantes         ← APRESENTAÇÃO
                │ (consulta por ID)
                ▼
FLUXO (APRESENTAÇÃO EDITORIAL)
   ├── sequence / screen / branch / path
   ├── occurrenceId + telaRef
   ├── layout e contexto do editor
   ├── referências pendentes detectadas
   └── extensões da árvore legada preservadas para conversão
                │
                ▼
VISUALIZAÇÃO DERIVADA: linhas / alternativas / losangos / retornos
```

**[APROVADO]** O Fluxo não possui registro operacional independente de transições nem catálogo separado de predicados. A árvore editorial preserva `sequence`, `branch`, `path`, IDs, rótulos, opções e ordem original; uma sequência no desenho **não autoriza automaticamente** uma rota funcional. A visualização calcula arestas consultando `navegacao.rotas[]` de cada tela de origem. Predicados `quando` pertencem ao objeto que eles restringem e não recebem referências para uma lista global.

### 7.6 Envelope do conversor de apresentação (exemplo não homologado)

O envelope representa **somente os dados próprios do Fluxo**. Não copia para si a lista de rotas das telas. Para renderizar ou simular, recebe uma coleção de Telas/Componentes por IDs diretos.

```json
{
  "schema": "advogadoja.fluxo.apresentacao",
  "schemaVersion": "3.1.0-exemplo",
  "origem": {
    "formato": "advogadoja-flow-projection",
    "arquivo": "ARQUIVO_REAL_A_IDENTIFICAR",
    "sha256": "HASH_A_CALCULAR"
  },
  "apresentacao": {
    "raizRef": "ID_REAL_A_IDENTIFICAR",
    "arvore": {}
  },
  "referenciasPendentes": [],
  "proveniencia": {
    "mapeamentosPorId": [],
    "exclusoesAprovadas": [],
    "camposResiduais": []
  },
  "verificacao": {"status": "nao_verificado"}
}
```

**[EXEMPLO]** `arvore: {}` e textos de identificação são abreviações didáticas: na conversão real, a árvore deve ser completa, inclusive ramos vazios e propriedades desconhecidas. `proveniencia` pertence ao **pacote de auditoria/conversão**, não ao contrato unitário da Tela; não é índice operacional de equivalência de IDs. Uma fonte legada pode conter estruturas rejeitadas: preservar os bytes da origem para rastreabilidade sem transformar essas chaves em dependências do novo sistema.

---

### 7.7 Mapeamento por campo da projeção original

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

### 7.8 Mapeamento da apresentação Flow V3

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
| Campo legado de correspondências alternativas entre IDs | **Não importar para o contrato canônico**, não usar para resolver referências. Conservado exclusivamente na fonte histórica imutável; referências divergentes são pendências. |
| `legacyScreens` | Metadados completos por chave original; não descartá-los ao consolidar IDs. |
| Quaisquer extensões | Preservar no residual com localização e tipo, inclusive `null` versus ausência. |

**Política prevalente:** qualquer menção do formato V3 a um campo histórico de correspondência não obriga sua importação ao sistema novo. Não é permitido manter um segundo mecanismo de identificação de telas. A cópia original do V3 fica intacta para auditoria; a exportação do contrato novo é deliberadamente diferente se remover estruturas reprovadas. Essa diferença **precisa aparecer** no relatório de migração.

### 7.9 Matriz de inferência permitida

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

### 7.10 Processo obrigatório do conversor

**Fase 0 — entrada:** validar JSON, salvar bytes originais e SHA-256, inventariar IDs, contagens e fontes.  
**Fase 1 — árvore:** percorrer `sequence.items` em ordem, reter inclusive paths/branches/sequências vazios, `branchType` e `isDefault` **somente quando declarados**.  
**Fase 2 — identidade:** validar refs diretamente contra o catálogo canônico; colisão ou divergência sem regra explícita vira pendência. **Proibido procurar equivalência por `aliasMap`, texto parecido ou nome visível.**  
**Fase 3 — relações:** separar continuidade editorial de conexão executável. Exigir origem, evento, condição quando necessária e destino válido.  
**Fase 4 — preservação:** manter campos operacionais não excluídos e valores desconhecidos com tipo/JSON Pointer; diferenças `null`/ausente/`[]`/`{}`/zero/falso continuam relevantes.  
**Fase 5 — reconstrução:** reconstruir as estruturas preservadas a partir de normalizado + residual; comparar hierarquia, IDs e valores. Reportar **separadamente** as exclusões intencionais aprovadas.  
**Fase 6 — edição:** registrar operações por ID; não permitir alteração de disposição gráfica editar navegação sem comando; impedir exportação inversa silenciosamente destrutiva.

### 7.11 Reconstrução do desenho

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

O desenho não é autoridade de navegação. Coordenadas, quando fornecidas pela origem como dados editoriais, podem ser preservadas sem transformar posição em destino.

### 7.12 Invariantes de integridade adaptados para V3

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
**I14 — Repetibilidade:** importar um resultado já normalizado não duplica ocorrências, conexões, paths.  
**I15 — Exportação:** os dados que o editor não conhece são preservados mesmo depois de editar uma propriedade conhecida.  
**I16 — Divergência:** diferenças não autorizadas bloqueiam aprovação; divergência de conteúdo não é mascarada por contagem igual.

**Complemento V2 obrigatório:** nenhum item I01–I16 legitima repor um campo conscientemente excluído no contrato novo. A validação roda em dois níveis: (a) **snapshot histórico** íntegro; (b) **artefato V2** sem elementos excluídos e com diff das exclusões permitidas. Preservação histórica não é a promessa de que dois contratos de formatos diferentes tenham diff literal vazio.

### 7.13 Matriz completa de testes de conversão (V3)

| ID | Teste | Aceite |
|---|---|---|
| FLX-CONV-01 | Importar a projeção (7) e inventariar estrutura | Contagens recalculadas por tipo; todas as chaves preservadas. |
| FLX-CONV-02 | Reconstruir projeção (7) sem edição | Diff estrutural vazio; IDs e ordem preservados. |
| FLX-CONV-03 | Importar apresentação V3 | `screenKey`, `telaRef`, `variant`, `mapeamento` e dados legados históricos íntegros; **nenhum alias operacional** no contrato normalizado. |
| FLX-CONV-04 | Reconstruir apresentação V3 | Diff vazio para campos preservados; exclusões aprovadas, se aplicáveis, segregadas em relatório e fonte arquivada. |
| FLX-CONV-05 | Comparar projeção e V3 | Exibir precisamente diferenças por IDs, não declarar equivalência por igual número de telas. |
| FLX-CONV-06 | Tela repetida em ramos diferentes | Todas as ocorrências distintas; um só `telaId` quando o vínculo for declarado. |
| FLX-CONV-07 | Dois caminhos com mesma tela | IDs de `path` e contexto separados; nenhuma fusão automática. |
| FLX-CONV-08 | Branch `navigation` versus `condition` | Tipo existente preservado; ausente não inventado. |
| FLX-CONV-09 | Paths vazios e branches vazios | Objetos e ordem mantidos sem eliminação por limpeza. |
| FLX-CONV-10 | Retorno ao nó já visitado | Referência/ciclo preservado sem reproduzir outra definição de tela. |
| FLX-CONV-11 | Identidade única da Home | A identidade final da Home é única; referências legadas divergentes são resolvidas somente por uma migração explícita aprovada. |
| FLX-CONV-12 | Referência divergente ou conflitante | Erro explícito; nenhuma equivalência por similaridade ou via tabela de aliases. |
| FLX-CONV-13 | Condição de negócio não declarada | Estado pendente; não atribuir `true`, `false` nem política de prioridade. |
| FLX-CONV-14 | Dois eventos de menu | Duas alternativas de ação; não inventar bifurcação booleana. |
| FLX-CONV-15 | Mesmo evento com duas condições válidas | Losango **derivado** e conexões preservadas, sem branch semântico duplicado. |
| FLX-CONV-16 | Condições sobrepostas e sem prioridade | Sinalizar conflito e impedir resolução arbitrária. |
| FLX-CONV-17 | Adicionar campo desconhecido em qualquer nível | Campo atravessa importação/exportação com mesmo valor/tipo. |
| FLX-CONV-18 | `null` versus ausente; `{}` versus `[]` | Diferenças preservadas e detectadas no diff. |
| FLX-CONV-19 | Editar uma ocorrência | Apenas o nó/ID selecionado é alterado. |
| FLX-CONV-20 | Editar conexão compartilhada | Aviso de impacto e alteração somente nos consumidores explicitamente vinculados. |
| FLX-CONV-21 | Alterar posição visual | Sem alteração da semântica do grafo de navegação. |
| FLX-CONV-22 | Converter, exportar, importar e converter novamente | sem multiplicação de nós ou caminhos; referências canônicas estáveis. |
| FLX-CONV-23 | Formato legado incapaz de guardar edição nova | Bloquear conversão inversa com perda ou exportar formato estendido claramente identificado. |
| FLX-CONV-24 | Corrupção, ID duplicado e ref inexistente | Relatório de validação com caminho JSON exato e severidade. |
| FLX-CONV-25 | Repetir em fontes com extensões adicionais | Preservação integral sem reimplementar o conversor para cada campo desconhecido. |
| FLX-CONV-26 | Visualização no Fluxo após round-trip | Hierarquia, labels, títulos, ramo ativo e ordem consistentes; diferenças intencionais registradas. |
| FLX-CONV-27 | Comparar exportação em dois ciclos sem alteração | Mesmo conteúdo semântico e estrutural; dados não editados estáveis. |
| FLX-CONV-28 | Persistência de metadados de revisão | Revisões, timestamps de origem e dados de histórico mantidos, sem sobrescrever a proveniência. |

**Adaptação dos testes históricos:** os antigos testes que exigiam transportar aliases operacionais foram substituídos pela prova de identidade única e pelo registro explícito de referências divergentes. Os testes que exigiam diff zero com a fonte só podem ser aplicados ao **modo de preservação sem exclusões**. Em migração para V3, exigir *diff zero em tudo que deve permanecer*, mais exatamente o conjunto de exclusões aprovadas.

### 7.14 Atestado e pacotes de entrega

Para cada conversão de Fluxo produzir:

1. `fonte_original.json` — snapshot de bytes imutável para auditoria, sem ser lido como contrato operacional.
2. `fluxo_normalizado_v3.json` — objetos e refs canônicas diretas, sem aliases operacionais.
3. `mapa_migracao_ids_e_campos.json` — **registro transitório de transformação**, por `jsonPointer`, objeto, ID de origem, ID final se aprovado, justificativa e decisão; não é `aliasMap` de execução.
4. `extensoes_preservadas.json` — dados não excluídos sem representação canônica direta, tipos e origem; **não** instalar ali uma segunda autoridade para ID de tela.
5. `exclusoes_aprovadas.json` — itens retirados do contrato V2, motivação e impacto; o conteúdo histórico completo continua recuperável no snapshot.
6. `fluxo_reconstruido_v3.json` — versão de saída com a árvore inteira preservável e refs normalizadas.
7. `diff_migracao.json` e `relatorio_validacao.json` — contagens, diffs de migração permitidos, referências pendentes, perdas não autorizadas, testes.

Status possíveis: `reprovado_por_perda`, `preservado_com_pendencias_semanticas`, `convertido_com_exclusoes_aprovadas`, `apto_a_homologacao_funcional` e `homologado`. **Não homologar** por JSON válido, mesmo número de screens, presença de diagrama, hash do snapshot ou aparência semelhante.

---

## 8. Contrato de navegação da Tela e interpretação pelo Fluxo

**[APROVADO na revisão V3.1]** Não criar coleções operacionais `conexoes` ou `condicoes`. A navegação e as regras necessárias já têm lugar no contrato de cada Tela: `navegacao.rotas[]`, `navegacao.rotas[].quando`, `estados.itens[].quando` e `variantes.itens[].quando`. Esses campos são os pontos de extensão do padrão V0.10; o funcionamento real continua sujeito a teste e à especificação de operadores. O Fluxo é um leitor/editor dessas declarações e mantém **apenas** sua estrutura editorial própria.

### 8.1 Responsabilidades e autoridade

| Objeto | Onde vive | Responsabilidade | Não deve conter |
|---|---|---|---|
| **Tela** | `telas[identidade.id]` | Composição, props, eventos, estados e rotas de saída | Cópias das ocorrências do Fluxo, elementos do canvas |
| **Componente** | `componentes[identidade.id]` | HTML/CSS, elementos, vínculo de props e eventos locais observáveis | Destinos presumidos, autorização de produção |
| **Rota da tela** | `tela.navegacao.rotas[]` | Um disparador e seu destino/efeito declarado, com `quando` opcional | Segunda cópia no arquivo do Fluxo |
| **Predicado contextual** | `rota.quando`, `estado.quando` ou `variante.quando` | Limitar a declaração específica, por campos/operadores tipados | Registro global de predicados com IDs alternativos |
| **Ocorrência editorial** | Árvore do Fluxo | ID de ocorrência, posição, ramo, caminho e contexto de apresentação | Definição independente da tela e de suas rotas |
| **Motor / frontend** | Código do módulo | Consulta refs, valida, calcula entradas reversas e desenha | Persistir um segundo catálogo de navegação |

**Regra de edição:** editar uma ligação no canvas altera **a rota correspondente na Tela de origem**, identificada por `identidade.id` da Tela + `navegacao.rotas[].id`. Se o usuário alterar apenas o desenho editorial, só o contexto do Fluxo muda. Editar uma ocorrência jamais reescreve outra ocorrência nem clona a Tela.

### 8.2 Dicionário mínimo da rota na V0.10

| Campo | Significado | Verificação |
|---|---|---|
| `navegacao.rotas[]` | Lista de rotas da **própria Tela** | A única fonte operacional de destinos |
| `navegacao.rotas[].id` | ID estável da rota **no escopo da Tela** | Não reutilizar para outra rota da mesma Tela |
| `navegacao.rotas[].tipo` | Tipo de transição declarada (ex.: `direta`, `permanecer`) | Valores admitidos sujeitos ao schema formal |
| `navegacao.rotas[].origem.instanciaRef` | Instância do componente disparador | Referência resolvida na composição da Tela |
| `navegacao.rotas[].origem.elementoRef` | Elemento que dispara a rota | Referência resolvida no componente |
| `navegacao.rotas[].origem.itemRef` | Item de coleção disparador, se houver | ID estável, nunca posição do array |
| `navegacao.rotas[].destino.tipo` | Natureza do destino, quando existe | Não criar destino para efeito apenas local |
| `navegacao.rotas[].destino.ref` | ID canônico da Tela de destino | Existe na biblioteca ou pendência explícita |
| `navegacao.rotas[].evento` | Evento/gatilho identificado | Deve corresponder ao contrato visual quando aplicável |
| `navegacao.rotas[].quando` | Predicado inline opcional | Campos, operadores e tipos reconhecidos; sem execução de JS arbitrário |

A **Tela de origem** é o próprio objeto que contém a rota, portanto **não existe necessidade de gravar `origem.telaRef` dentro da rota**. Para montar o grafo completo, o frontend calcula `(tela.identidade.id, rota.id)` e suas referências; entradas de destino e contagem de consumidores são **índices derivados em memória**.

### 8.3 Exemplo didático de Tela com navegação e regra inline

O exemplo usa IDs e variáveis demonstrativos. **Não afirma** que os componentes/elementos/eventos abaixo existem na fonte nem que `conta.onboardingConcluido` está disponível no banco. Não implementar antes de resolver os IDs reais.

```json
{
  "schema": "advogadoja.tela",
  "schemaVersion": "0.10.0",
  "identidade": {
    "id": "exemplo.pos_login",
    "tipo": "tela",
    "nome": "Destino pós-login (exemplo)"
  },
  "navegacao": {
    "rotas": [
      {
        "id": "rota.pos_login.home",
        "tipo": "direta",
        "origem": {
          "instanciaRef": "screen.botao",
          "elementoRef": "botao.confirmar"
        },
        "evento": "login.sucesso",
        "destino": {
          "tipo": "tela",
          "ref": "advogado.home_advogado"
        },
        "quando": {
          "campo": "conta.onboardingConcluido",
          "operador": "igual",
          "valor": true
        }
      },
      {
        "id": "rota.pos_login.onboarding",
        "tipo": "direta",
        "origem": {
          "instanciaRef": "screen.botao",
          "elementoRef": "botao.confirmar"
        },
        "evento": "login.sucesso",
        "destino": {
          "tipo": "tela",
          "ref": "exemplo.tela_onboarding"
        },
        "quando": {
          "campo": "conta.onboardingConcluido",
          "operador": "igual",
          "valor": false
        }
      }
    ]
  }
}
```

**Exemplo parcial do bloco de navegação:** um contrato **completo** de Tela continua exigindo `estrutura` e referências de componentes, conforme a seção 3. O ID `advogado.home_advogado` existe no recorte auditado; o restante é ilustração, não rota de produção. A mesma Tela com duas rotas não cria dois JSONs nem exige bloco global adicional.

### 8.4 Regras declarativas sem coleção separada

Uma regra contextual fica **dentro da declaração a que se aplica**:

- **Transição:** `navegacao.rotas[i].quando` delimita a rota; sua ausência indica ausência de filtro **declarado**, não autorização de negócio irrestrita.
- **Seleção de estado:** `estados.itens[i].quando` pode expressar a situação resolvida por dados conhecidos.
- **Aplicação visual:** `variantes.itens[i].quando` governa a variante, sem produzir uma rota.
- **Interação local:** `interacoes.eventos[i].quando`, quando necessário, limita um efeito dentro da tela.

| Situação | Apresentação e comportamento seguro |
|---|---|
| Uma rota válida sem `quando` | Saída direta conforme evento declarado, sem criar regra fictícia |
| Duas rotas do mesmo evento com `igual true` e `igual false` para um campo tipado | Losango **derivado no diagrama** e avaliação apenas quando houver contexto suficiente |
| Duas rotas do mesmo evento com predicados sobrepostos | Marcar conflito; não escolher a primeira apenas por ordem |
| Nenhuma rota habilitada e nenhum fallback declarado | Marcar ausência de cobertura; não criar destino |
| Predicado com variável desconhecida | Preservar texto, sinalizar pendência, não executar heurística |
| Eventos distintos no menu | Mostrar alternativas por evento, sem falsa bifurcação booleana |

**[PENDENTE]** Definir operadores aceitos, combinações (`e`/`ou`), precedência, fallback e fontes de dados. Nenhuma dessas pendências autoriza criar um registro global de regras. A autorização de backend permanece externa à apresentação.

### 8.5 Ações locais e operações de domínio

Um `data-action` visto no HTML é **evidência de gatilho**, não prova de integração. Abrir menu é `interacoes.eventos[]`/estado local; alternar disponibilidade pode exigir dado/serviço real, que permanece sem validação; navegar a outra tela usa `navegacao.rotas[]`. Ações complexas poderiam exigir uma definição específica **somente mediante novo caso e decisão**, mas não é criada nenhuma coleção adicional por este documento.

### 8.6 Desenho derivado e apresentação importada

O Fluxo consulta as rotas existentes em `telas[*].navegacao.rotas[]` e utiliza sua própria árvore `sequence/screen/branch/path` apenas para **posição e agrupamento**. Duas rotas de um mesmo evento com regras complementares podem gerar losango; eventos distintos geram saídas alternativas; várias origens chegando à mesma Tela geram junção; retorno à Tela existente produz laço sem novo ID. Um branch **importado** continua identificável e rastreável mesmo quando falta uma regra funcional.

Uma sequência ou um rótulo de branch **não comprova** evento, predicado ou destino. Não reconstituir a semântica real de checkout apenas porque um ramo foi rotulado “resultado”. Os três agrupamentos omitidos na apresentação Flow V3 exigem recuperação por fonte de origem, não adivinhação.

### 8.7 Compartilhamento sem cópias de rotas

A mesma definição de Tela pode aparecer em muitas posições editoriais; suas rotas ficam na definição única da Tela. Para casos de fluxo em que o **contexto da ocorrência** precise mudar a saída, o modelo fino de contexto permanece [PENDENTE], mas **não** será resolvido duplicando a rota em um cadastro externo. Um segmento editorial compartilhado, se adotado futuramente, referencia ocorrências/IDs já existentes e não se torna outro repositório de destinos.

### 8.8 Índices calculados pelo frontend

A partir de `identidade.id` e `navegacao.rotas[]`, o frontend calcula: rotas de saída por Tela, entradas por `destino.ref`, rotas por evento, dependências por `componenteRef` e ocorrências por `telaRef`. Esses índices são **visões transitórias**, não arquivos canônicos concorrentes; devem ser atualizados após edição ou importação.

### 8.9 Critérios de aceite da navegação (NAV-01 a NAV-16)

| ID | Ensaio | Critério de aceite |
|---|---|---|
| `NAV-01` | Uma rota explícita | Aresta direta resolvida pelo ID da Tela e da rota |
| `NAV-02` | Duas regras complementares `quando` | Losango derivado, sem segundo registro |
| `NAV-03` | Dois itens de menu | Alternativas por evento, não por booleano inventado |
| `NAV-04` | Regras simultaneamente verdadeiras | Conflito visível, sem navegação arbitrária |
| `NAV-05` | Nenhuma regra verdadeira | Pendência/fallback somente se declarado |
| `NAV-06` | Várias entradas à mesma Tela | Uma definição e várias arestas/ocorrências |
| `NAV-07` | Retorno à Tela já visitada | Ciclo por referência, sem clone de tela |
| `NAV-08` | Alteração aprovada de ID | Atualização atômica das referências diretas |
| `NAV-09` | Rota sem elemento/evento/destino necessário | Mostrar pendência sem inventar ligação |
| `NAV-10` | Branch importado sem regra funcional | Manter branch editorial, sem fabricar navegação |
| `NAV-11` | Reuso editorial de segmento | Não copiar destinos para a apresentação |
| `NAV-12` | Teste de autoridade única | Destinos somente em `tela.navegacao.rotas[]` |
| `NAV-13` | Exclusão de modal artificial | Rota legítima não se perde com `modal.route-modal` |
| `NAV-14` | Divergência de checkout | Recuperar branches ausentes apenas por fonte explícita |
| `NAV-15` | UI restrita por capacidade | Variante/CSS não equivale a autorização real |
| `NAV-16` | Round-trip sem alterações | Rotas e `quando` preservados; sem registros duplicados |

---

## 9. Mapeamento dos campos para o frontend do Fluxo

A fonte histórica `MAPEAMENTO_CAMPOS_FRONT.md` descreve listas experimentais e controles de edição. **Nesta revisão** o comportamento útil é transferido para os campos já existentes do JSON de Tela, sem importar seus cadastros experimentais. O frontend preserva integralmente a árvore editorial recebida, mas a navegação operacional deriva **exclusivamente das Telas carregadas**.

### 9.1 Mapa de campos → responsabilidades do frontend

| Origem consultada | Status | Comportamento do frontend | Restrição |
|---|---|---|---|
| `telas[id].identidade.id` | [APROVADO] | Identificar tela única e abrir sua definição | Chave externa igual ao ID interno |
| `telas[id].estrutura.html.composicao` | [DEFINIDO] | Resolver instâncias, slots e `props` | Sem copiar definições de componentes |
| `componentes[id].estrutura.html` | [DEFINIDO] | Inspecionar elemento disparador, evento e item | Um `data-action` isolado não é destino validado |
| `telas[id].navegacao.rotas[]` | [APROVADO] | Listar, selecionar, criar, editar e excluir rotas da **Tela de origem** | Fonte única das transições |
| `navegacao.rotas[].id` | [DEFINIDO] | Identificar rota e localizar edição por ID | Único no escopo de sua Tela |
| `navegacao.rotas[].origem.*` | [DEFINIDO] | Associar evento a instância/elemento/item de origem | Referências devem existir |
| `navegacao.rotas[].evento` | [DEFINIDO quando declarado] | Agrupar rotas do mesmo gatilho | Nunca deduzir de rótulo |
| `navegacao.rotas[].destino.ref` | [DEFINIDO quando declarado] | Exibir destino e identificar referências pendentes | ID de Tela direto, sem aliases |
| `navegacao.rotas[].quando` | [APROVADO] | Mostrar/editar regra inline do vínculo selecionado | Sem coleção global de predicados |
| `estados.itens[].quando` | [DEFINIDO quando usado] | Mostrar resolução declarativa de estado | Não transformar estado em navegação |
| `variantes.itens[].quando` | [DEFINIDO quando usado] | Mostrar condição visual na mesma Tela | Não conceder autorização |
| `interacoes.eventos[]` | [DEFINIDO] | Inspecionar efeitos locais e seus disparadores | Abrir menu não é rota |
| Árvore editorial `sequence/screen/branch/path` | [PRESERVAR] | Desenhar ocorrências, ordem, ramificações e caminhos | Não converter ordem editorial em navegação |
| Índices reversos calculados | [DERIVADO] | Buscar entradas/saídas e consumidores por ID | Não persistir espelhos independentes |
| `sourceFiles`/manifesto legado | [AUDITORIA] | Exibir divergências e dados preservados na importação | Sem dependência em runtime |

Campos legados como `navegacao.participacoes[]`, `navegacao.entradas[]`, `navegacao.saidas[]` e `navegacao.bifurcacoes[]` podem ser **lidos durante a conversão auditável**, mas não viram estruturas operacionais novas. Os dois cadastros experimentais de navegação e de predicados presentes nos anexos foram expressamente rejeitados pelo usuário. O frontend não os carrega como fonte de execução.

### 9.2 Pipeline de leitura

```text
Telas e Componentes da biblioteca
   ├── identidade.id
   ├── estrutura.html / props
   ├── navegacao.rotas[] + rota.quando?
   └── interacoes / estados / variantes
               │
Fluxo: árvore editorial (ocorrências / sequências / ramos / caminhos)
               │
               ▼
Frontend Flow: valida IDs e refs → gera índices reversos →
desenha linhas / losangos / junções / ciclos / avisos →
abre inspetor → edita a rota NA TELA DE ORIGEM →
revalida → exporta as alterações de Tela e o Fluxo editorial
```

**Isolamento de arquivos:** a interface Flow pode consultar a biblioteca declarada e seu próprio JSON de dados segundo as regras do construtor; ela **não** grava cópias de `navegacao.rotas[]` no arquivo editorial. Se o módulo não tiver permissão/capacidade de modificar a biblioteca diretamente, deve gerar **patch/exportação do contrato de Tela com a mudança**, para aplicação explícita no local canônico, e informar o estado ainda não aplicado. Não afirmar que a alteração visual foi persistida até que isso ocorra.

### 9.3 Controles do frontend

| Comando | Fonte editada | Efeito | Validação |
|---|---|---|---|
| Selecionar Tela | Índice `telas[id]` + índices calculados | Exibir dados, ocorrências, saídas/entradas e prévia | Apenas ID direto |
| Selecionar rota | `telas[id].navegacao.rotas[]` | Exibir origem, evento, destino e `quando` | ID da rota no escopo da Tela |
| **＋ Rota** | `tela.navegacao.rotas[]` | Criar rota com ID, origem e destino declarados | Referências reais, não inventadas |
| **Editar rota** | Rota identificada | Alterar somente os campos selecionados | Diff localizado e revalidação |
| **Editar quando** | `rota.quando` | Alterar regra tipada daquela rota | Sem execução de JavaScript textual |
| **Ver campos** | Contrato da Tela e JSON Pointer real | Abrir caminho do objeto selecionado | Não copiar para outro modelo mestre |
| **Editar ocorrência** | Árvore editorial do Fluxo | Alterar posição/contexto da ocorrência | Não alterar rotas da Tela automaticamente |
| **Exportar alterações** | JSON/patch de Tela + apresentação do Fluxo | Preservar campos desconhecidos e IDs | Sem sobrescrita silenciosa de fontes |
| Mover/zoom | Estado temporário do editor | Ajustar apresentação | Sem mudar rotas |
| Salvar rascunho | Sessão local, quando suportada | Guardar edição não aplicada | Não substituir a fonte da biblioteca |

### 9.4 Painéis e inspeção

**Tela selecionada:** ID canônico, título, composição/props, lista de rotas e eventos, estados/variantes, ocorrências, entradas reversas calculadas, componentes consumidores, dependências e pendências de referências. **Rota selecionada:** ID, instância/elemento/item, evento, tipo, destino e `quando` inline. **Componente selecionado:** ID, elementos HTML/CSS, props vinculadas, eventos e telas que o usam. Uma relação editorial importada pode ser exibida como **não operacional** quando faltarem dados de rota.

### 9.5 Símbolos do diagrama

| Evidência | Símbolo | Restrições |
|---|---|---|
| Uma rota válida para evento conhecido | Linha | IDs resolvidos |
| Duas rotas do mesmo evento com `quando` complementar | Losango derivado | Não persistir outro ramo funcional |
| Rotas com eventos diferentes | Saídas rotuladas | Não inferir booleano |
| Várias rotas chegando à mesma Tela | Junção | Não duplicar Tela |
| Destino igual a Tela já visitada | Retorno/laço | Política de histórico a validar |
| Caminho editorial sem navegação comprovada | Ramo/agrupamento | Manter IDs/labels/ordem originais |
| Referência ou regra não resolvida | Aviso | Nenhuma execução forçada |
| Fim de percurso declarado | Marcador terminal | Não inventar próximo passo |

### 9.6 Inventários de origem com escopos distintos

| Fonte | Contagem observada | Leitura permitida |
|---|---|---|
| Catálogo Advogado | 33 Telas, 99 componentes antes de saneamento, 186 instâncias, 93 referências a ocorrências | Acervo de estrutura visual, não grafo completo |
| Projeção (7) reportada pela Garantia V1 | 197 ocorrências, 118 sequências, 36 branches, 117 paths | Preservar ramo e ordem da árvore original |
| Apresentação Flow V3 | 197 ocorrências, 115 sequências, 33 branches, 114 paths | Divergência de três agrupamentos de checkout |
| Jornadas em `Projeto_9.zip` citado na V1 | 110 telas, 388 componentes | Outro acervo, sem fusão por nome |
| `advogadoja-fluxo-projecao.json` do mapeamento frontend | Recorte parcial da Home | Não extrapolar como inventário de todo o Fluxo |

Contagens exibidas devem ser recalculadas do arquivo carregado e identificadas pela fonte/versão; não podem ser tratadas como constantes universais.

### 9.7 Erros e tratamento de dados desconhecidos

IDs de tela, componente, instância, elemento, item, evento, destino ou campo de regra não resolvidos devem ser sinalizados com caminho JSON exato e gravidade; o editor não cria dados por semelhança. Os campos desconhecidos são preservados no round-trip. Mocks são distinguidos das fontes reais; CSS de produto não contamina CSS do editor; ações simuladas não usam serviços de produção. Não mostrar etiquetas `popup.screen-note` ou modais `modal.route-modal` como substitutos de comportamento.

### 9.8 Testes do frontend (FRT-01 a FRT-24)

| ID | Verificação | Critério de aceite |
|---|---|---|
| `FRT-01` | Tela com várias ocorrências | Uma definição e todos os IDs de ocorrência |
| `FRT-02` | Composição da Tela | Instâncias, componentes e props por refs diretas |
| `FRT-03` | Selecionar rota | Abrir rota certa por Tela + ID de rota |
| `FRT-04` | Criar rota | Escrever em `Tela.navegacao.rotas[]` |
| `FRT-05` | Editar rota | Alterar somente objeto selecionado |
| `FRT-06` | Editar `quando` | Alterar regra inline, sem catálogo paralelo |
| `FRT-07` | Uma rota válida | Linha direta, sem losango desnecessário |
| `FRT-08` | `igual true` e `igual false` | Losango derivado, somente quando variáveis tipadas |
| `FRT-09` | Regras sobrepostas | Aviso de conflito, sem resolver arbitrariamente |
| `FRT-10` | Dois eventos de menu | Alternativas sem falsa condição booleana |
| `FRT-11` | Ramo importado sem regra | Preservar apresentação; não inventar navegação |
| `FRT-12` | Várias entradas à mesma Tela | Índice reverso, sem cópia de definição |
| `FRT-13` | ID de Home divergente | Manter ID do catálogo até decisão explícita |
| `FRT-14` | Arquivo com referências antigas | Não ativar resolução por alias |
| `FRT-15` | Arrastar nó/editor | Nenhuma rota alterada por geometria |
| `FRT-16` | Ver campos | Mostrar JSON Pointer original correto |
| `FRT-17` | Exportar após edição | Contrato de Tela alterado, demais dados preservados |
| `FRT-18` | Armazenamento local indisponível | Exportação ainda possível |
| `FRT-19` | Componente/destino ausente | Pendência com ID e localização |
| `FRT-20` | Navegação sem destino | Aviso, sem `modal.route-modal` |
| `FRT-21` | Catálogo parcialmente carregado | Distinguir destino fora do recorte de destino inexistente |
| `FRT-22` | Documento Flow contém destinos concorrentes | Rejeitar como autoridade; importar apenas apresentação editorial |
| `FRT-23` | Campos legados | Preservar no histórico, não recriar no contrato novo |
| `FRT-24` | Round-trip sem edição | IDs/valores/arrays preservados, excluídas alterações autorizadas |

### 9.9 Pendências de implementação

**[PENDENTE]** Gramática formal de `quando`, catálogo de variáveis e operadores, fallback, portas/eventos e política de histórico, aplicação e persistência de patches de Tela quando o módulo Flow não puder gravar a biblioteca, integração React/Flutter, fidelidade visual e reconciliação dos três ramos de checkout. **Não está pendente** a autoridade dos destinos: já foi escolhida `tela.navegacao.rotas[]`.

Os critérios acima são **testes documentados**, não evidências de execução ou homologação.

---

## 10. Validação, testes, interoperabilidade e homologação

### 10.1 Níveis de aceite, sem atalhos

| Nível | Aceite mínimo | Não comprova |
|---|---|---|
| Sintaxe | JSON válido e campos tipados | Funcionamento, rota ou visual. |
| Referências | IDs de tela/componentes/instâncias/elementos/estados/rotas resolvíveis ou pendências explícitas | Que a navegação semântica esteja correta. |
| Migração | Todos os dados **não excluídos** mantidos; removidos exatamente os aprovados | Que HTML/CSS/UX sejam visualmente equivalentes. |
| Visual | Render comparativo real por tela, dispositivo e variante | Autorização, persistência ou API. |
| Comportamento | Gatilhos, condições, destinos e resultados simulados corretos | Execução de produção. |
| Integração | Serviços/autorizações reais validados separadamente | Aprovação do schema por si só. |
| Homologação | Evidências, responsável, versão, testes, diferenças e aceite | Não é um status a atribuir antes da execução. |

### 10.2 Checagens estruturais obrigatórias

1. `identidade.id` único e consistente com índice externo quando existir.
2. **Zero `aliasMap` no artefato novo** e nenhuma referência de tela dependente de tabela de aliases.
3. **Zero `popup.screen-note` e `modal.route-modal`** entre as definições e instâncias operacionais.
4. Nenhum `participacoes`, `moduloRef`, `submoduloRef`, `escopo`, `secao` recriado por conveniência.
5. `raizRef`, `paiRef` e `componenteRef` válidos; nenhuma árvore cíclica de elementos.
6. `props` da instância com tipos exatos, compatíveis com `vinculos` e `colecoes` declarados.
7. Componentes compartilhados sem cópias independentes do mesmo conteúdo.
8. `navegacao` com origem/destino/evento comprovados; estados internos não são falsas rotas.
9. `variantes` e `interacoes` com alvos existentes; condições não executam código arbitrário.
10. CSS integral e isolado do workspace, com comportamento responsivo e media queries.
11. Remoções aprovadas no diff; **qualquer outra perda bloqueia**.
12. O snapshot original e o relatório de conversão identificam todas as alterações; o app não depende de arquivos históricos em runtime.

### 10.3 Ensaios reais de Tela/Jornadas/Fluxo/Protótipo

| ID | Ensaio | Evidência esperada |
|---|---|---|
| `TEL-01` | Carregar Tela com árvore | Todas as instâncias, props, CSS e definições restantes acessíveis. |
| `TEL-02` | Editar prop de uma instância | Não alterar outras instâncias nem recriar `conteudo.instancias`. |
| `TEL-03` | Round-trip e saneamento | Preservar conteúdo útil e registrar apenas exclusões aprovadas. |
| `TEL-04` | Inspecionar navegação | Mostrar destinos reais; nenhum modal de rota artificial. |
| `JRN-01` | Selecionar jornada/subjornada | IDs reais, tela reaparece sem clonagem. |
| `JRN-02` | Prévia local | Interação local segura; sem navegação operacional inadvertida. |
| `JRN-03` | Mobile/Desktop | Mesmo visual contratual com CSS próprio. |
| `FLX-01` | Montar grafo | Nós por ocorrência e referências a IDs de tela reais. |
| `FLX-02` | Trocar destino A→B por A→C | Editar vínculo sem mudar identidade de tela. |
| `FLX-03` | Branch condicional | Conservar ramificação de checkout e sinalizar semântica ausente. |
| `PRT-01` | Alternar cenário | Sessão muda sem reescrever a tela ou usar modal artificial. |
| `PRT-02` | Navegar em simulação | `navegacao.rotas[]` da Tela, sem `modal.route-modal`. |
| `PRT-03` | Serviços reais | Nenhuma chamada de produção durante simulação. |
| `EXP-01` | Exportar/reimportar | Dados não editados preservados e saneamento documentado. |
| `CMP-01` | Reuso de componente | Prop isolada por instância; definição compartilhada atualizada conscientemente. |
| `CMP-02` | Auditar titlebars | Comparação das 23 definições (21/1/1) com dependência CSS e props. |
| `VIS-01` | Paridade | Visual equivalente nos quatro módulos, no mesmo estado e viewport. |
| `CNV-01` | React/Flutter/HTML | Diferenças por atributo/componente reportadas; nenhuma adaptação silenciosa. |
| `NAV-*` | Rotas e inferência visual (seção 8) | Executar NAV-01 a NAV-16; destinos somente na Tela. |
| `FRT-*` | UI e edição do Fluxo (seção 9) | Executar FRT-01 a FRT-24; edição das rotas da Tela, IDs diretos e sem aliases. |

### 10.4 Tratamento de CSS, JS e frameworks

- O JSON contém **declarações**, não funções JS arbitrárias executadas na importação.
- HTML/CSS, React e Flutter precisam de adaptadores capazes de reconhecer elementos, slots, tokens, estado, eventos e limitações específicas; conversão V0.10 **não garante automaticamente** equivalência em Flutter.
- CSS do editor e da tela do produto devem ser isolados.
- JS legado que apenas exibia `modal.route-modal` deve ser excluído ou desativado no app, mas **um gatilho com rota legítima deve ser redirecionado para a navegação canônica**, após validação, não eliminado às cegas.
- Em migração visual, registrar referência original, antes/depois, viewport, diferença e aceitação; não usar similaridade de código como prova de UX igual.

### 10.5 Prova de integridade depois de exclusões aprovadas

```text
fonte = parse_json(snapshot)
relatorio = inventariar(fonte)
novo, exclusoes, pendencias = migrar_com_regras_aprovadas(fonte)

assert novo.nao_contem_alias_operacional
assert novo.nao_contem_componentes_artificiais
assert exclusoes == conjunto_de_exclusoes_autorizadas
assert todos_os_campos_nao_excluidos_forem_transportados_ou_preservados
assert todos_os_ids_referenciados_sao_validos_ou_pendencias_explicitas

# testar reconstrução do conteúdo que DEVE permanecer
# não declarar diff literal zero entre a origem legada e o novo modelo
# quando existiram mudanças intencionais de estrutura
```

**Restrições:** a contagem 67/123 é objetivo após somente as exclusões já aprovadas. Fusões futuras de `header.titlebar` ou correções de navegação exigirão novos diffs com decisão e teste, antes de alterar os números.

---

## 11. Pendências, ordem de implementação e critérios de aceite

### 11.1 Pendências objetivas do modelo

| Tema | Status | O que resolver sem inventar |
|---|---|---|
| Hierarquia das telas | **[PENDENTE]** | Definir `raizRef`, `paiRef` e slots reais para as composições herdadas. |
| IDs de instância | **[PENDENTE]** | Convenção local estável, tratamento de colisões e relação com DOM. |
| HTML declarativo | **[PENDENTE]** | Cobertura de SVG, atributos, diretivas, condicionais e repetição sem perda. |
| Interface de `props` | **[PENDENTE]** | Tipos, defaults, validação, versionamento e contrato por componente. |
| `header.titlebar` | **[PENDENTE]** | Confirmar 21/1/1 e equivalência visual com herança de CSS antes de fundir. |
| Navegação real | **[PENDENTE]** | Ligar gatilhos aos destinos e tratar a ausência de rota; nenhuma simulação por modal substituto. |
| Identidade da Home | **[PENDENTE]** | Manter `advogado.home_advogado` do catálogo até eventual renomeação aprovada; atualizar refs diretamente sem aliases. |
| Jornadas | **[PENDENTE]** | Vínculo editorial por ID e ordem, sem inferir a partir de ocorrências de Fluxo. |
| Estados/condições | **[PENDENTE]** | Resolver concorrência, operadores, prioridades, fallback e fontes de estado. |
| Conteúdo do Fluxo V3 | **[PENDENTE]** | Corrigir três ramos de checkout achatados apenas por evidência de origem. |
| Empacotamento | **[PENDENTE]** | Definir transporte unitário/pacote, manifestos e controle de versões. |
| Navegação por rotas da Tela | **[APROVADO; detalhes pendentes]** | Autoridade única já definida: `navegacao.rotas[]`. Falta validar gatilhos, gramática de `quando`, política de histórico e casos reais. |
| Frontend do Fluxo | **[PENDENTE de implementação]** | Ler/editar rotas da Tela, preservar a apresentação e exportar patches/contratos sem perda; executar `FRT-*`. |
| Ações complexas e segmentos editoriais | **[PENDENTE]** | Só acrescentar modelo específico com caso real aprovado; nunca repetir rotas ou regras em novo registro. |
| Conversores e motores | **[PENDENTE]** | Implementar, testar e homologar V0.10/V3 com os quatro módulos. |
| Regras reais de OAB/backend | **[FORA DO ESCOPO]** | Exemplos de estado não provam autorização, serviço ou schema físico. |

### 11.2 Ordem de execução recomendada e critérios de saída

**Etapa A — congelar entradas:** snapshot do catálogo e do Fluxo, checksums, IDs, inventário e relatório de divergências.  
**Etapa B — saneamento:** retirar 30 `screen-note` e 2 `route-modal` (63 instâncias), remover dependências da simulação e campos redundantes **somente na nova representação**; não tocar na fonte histórica.  
**Etapa C — validação dos componentes:** auditar 23 titlebars; converter primeiro um componente simples, um com SVG/lista e um com condição; provar CSS e props.  
**Etapa D — Tela piloto:** migrar uma tela real integral com `raizRef`, hierarquia, props, navegação e CSS, exportar e comparar com original em dispositivos/estados.  
**Etapa E — conjunto:** migrar as 33 telas e os 67 componentes ainda candidatos; registrar colisões, dados incompatíveis e elementos pendentes, nunca inventar dados.  
**Etapa F — Fluxo:** normalizar sequências/ocorrências/branches/paths, garantir referências diretas ao catálogo, preservar divergências checkout e consultar exclusivamente as rotas já declaradas nas Telas. A autoridade da navegação está **definida**, não depende de aprovação de outro registro.  
**Etapa G — frontend e módulos:** implementar inspeção e edição da rota por Tela+ID, predicado inline tipado, índices reversos derivados e exportação auditável; executar os testes `NAV-*`/`FRT-*` e Tela/Jornadas/Fluxo/Protótipo sem destinos concorrentes ou modais artificiais.  
**Etapa H — homologação:** executar testes, registrar diff, aceitar ou corrigir todos os bloqueios e documentar compatibilidade de React/Flutter.

### 11.3 Critérios finais de aceite desta especificação

- [x] Decisões sobre `aliasMap`, `screen-note`, `route-modal`, campos obsoletos e `props` incorporadas **documentadas**.
- [x] Inventários originais de 33 telas, 64 + 35 definições, 186 instâncias e 93 referências a ocorrências do catálogo **conferidos**.
- [x] Impacto aritmético controlado: 32 definições e 63 instâncias excluídas; **67 definições e 123 instâncias candidatas**.
- [x] Equivalência de campos de Tela e Componente preservada e atualizada.
- [x] Conversão de Fluxo separada da renderização, sem tabela de aliases operacional.
- [x] Conceitos de origem, evento, destino, filtro e visualização dos anexos V1 integrados no modelo existente de `navegacao.rotas[]` e `.quando`, **sem cadastros adicionais**.
- [x] Mapeamento completo do frontend incorporado: campos canônicos de Tela, apresentação editorial e índices reversos calculados, sem registros paralelos.
- [x] Matriz `NAV-*` e `FRT-*` de validações prevista; **testes ainda não executados**.
- [x] Três ramificações checkout ausentes na V3 preservadas como divergência a corrigir.
- [ ] Definir o schema formal e as pendências de identidade/slots/props/condições.
- [ ] Executar exclusões no JSON-alvo e confirmar diffs autorizados.
- [ ] Converter/validar visualmente 67 definições e 33 telas (quantidades antes de qualquer consolidação futura de titlebars).
- [x] Decidido: `tela.navegacao.rotas[]` é a fonte única; não duplicar destinos no Fluxo.
- [ ] Implementar frontend para ler/editar rotas e `quando` da Tela, índices derivados, seleção e exportação.
- [ ] Executar testes `NAV-*`, `FRT-*` e conversor de apresentação do Fluxo, provando regressões estruturais/semânticas.
- [ ] Testar os quatro módulos, aprovar evidências e homologar produção.

**Resultado documental:** revisão V3.1 única, com decisões aprovadas, navegação por rotas da Tela e mapa técnico completo. **Resultado de software:** nenhuma migração efetivamente realizada por este documento. O catálogo original, o Fluxo original e os contratos ainda precisam passar pelas etapas de implementação e validação.

---

## Anexo A — Inventário das 33 telas

**Fonte:** inventário de `advogado_catalogo_completo (1).json`. “Instâncias” é contagem **original**, antes das remoções. “No Fluxo” é a contagem de referências localizadas em `flowOccurrences` neste recorte, não o total de ocorrências da projeção ampla.

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

**Cautela com props:** “Props sem instância” indica valores não associados a uma instância — não a ausência de props numa instância. Foi observada a instância real `flow-checkout-return` sem props dedicadas, situação opcional a validar.

---

## Anexo B — Inventário das 64 definições referenciadas

A tabela documenta a **origem histórica integral**; registros `popup.screen-note` e `modal.route-modal` abaixo têm decisão **EXCLUIR do destino**, não são componentes do padrão novo. Os 23 `header.titlebar` ficam marcados **AUDITAR** antes de qualquer fusão.

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

### B.1 Destinos aprovados de saneamento

| ID/família histórica | Definições | Instâncias | Situação destino |
|---|---:|---:|---|
| `*.popup.screen-note` | 30 | 30 | **EXCLUIR** |
| `modal.route-modal.v01`, `modal.route-modal.v02` | 2 | 33 | **EXCLUIR** |
| IDs com `header.titlebar` | 23 | Conforme fonte por tela | **AUDITAR; não consolidar ainda** |
| Demais definições referenciadas | 9 | Conforme fonte | **MANTER/VALIDAR por função** |

**Nota:** as 23 titlebars fazem parte das 32 definições referenciadas ainda candidatas. Restam também as 35 definições de `localComponents` do Anexo C.

---

## Anexo C — Inventário das 35 definições locais

Essas definições **não são descartadas** na decisão de retirar os modais artificiais e etiquetas. IDs `cmp_*` existentes tornam-se canônicos; a chave local composta não vira segunda identidade.

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

---

## Anexo D — Dicionário de campos V0.10

Este é o dicionário **de estrutura observado na referência**, inclusive atributos opcionais. A tabela não é uma lista de todos os campos obrigatórios. `props.*` é especificado por componente. **Campos declarados obsoletos na seção 6 não retornam ao contrato por aparecerem no glossário antigo.**

**Como ler:** os tipos e caminhos abaixo foram extraídos do JSON V0.10; a finalidade foi consolidada das fontes. `Exemplo V0.10` **não significa campo obrigatório**. A obrigatoriedade fina deverá ser definida pelo schema formal em caso de produção. Em especial, `props.*` é específico de cada componente e não deve virar uma lista rígida universal.

| Campo da **tela** | Tipo observado/esperado | Finalidade | Necessidade |
|---|---|---|---|
| `schema` | `string` | Identificador do formato do objeto de tela. | Formato, quando necessário |
| `schemaVersion` | `string` | Versão do schema de leitura, não da tela. | Formato, quando necessário |
| `identidade.id` | `string` | Identidade única e estável da tela. | Essencial |
| `identidade.tipo` | `string` | Natureza da definição (tela). | Essencial |
| `identidade.namespace` | `string` | Agrupamento lógico opcional. | Contextual |
| `identidade.nome` | `string` | Nome editorial de referência. | Usado no exemplo |
| `identidade.nomeExibicao` | `string` | Nome apresentado na interface. | Contextual |
| `identidade.descricao` | `string` | Propósito e contexto da tela. | Contextual |
| `classificacao.localizacao.caminho` | `string` | Caminho informativo/organizacional quando não derivável. | Opcional |
| `classificacao.jornadas[]` | `object` | Associação editorial à jornada/subjornada. | Se necessário |
| `classificacao.jornadas[].jornadaRef` | `string` | ID de jornada, não rota. | Se houver jornada |
| `classificacao.jornadas[].subjornadasRefs[]` | `string` | IDs das subjornadas associadas. | Se houver |
| `estrutura.html.raizRef` | `string` | ID da instância raiz da tela. | Essencial para composição |
| `estrutura.html.composicao` | `object` | Mapa de instâncias por ID. | Essencial para composição |
| `estrutura.html.composicao.<instanciaId>.componenteRef` | `string` | ID da definição de componente utilizada. | Essencial por instância |
| `estrutura.html.composicao.<instanciaId>.paiRef` | `string|null` | Elemento/instância pai para montagem. | Conforme hierarquia |
| `estrutura.html.composicao.<instanciaId>.slot` | `string` | Posição lógica de encaixe. | Conforme layout |
| `estrutura.html.composicao.<instanciaId>.ordem` | `number` | Ordenação local sem mudar identidade. | Conforme layout |
| `estrutura.html.composicao.<instanciaId>.props` | `object` | Valores e configurações da ocorrência. | Quando necessário |
| `estrutura.css.tokens` | `object` | Variáveis de apresentação aplicadas à tela. | Opcional |
| `estrutura.css.regras` | `object` | Conjunto de regras CSS da tela. | Quando necessário |
| `navegacao.rotas[]` | `object` | Rotas/ações navegáveis declaradas. | Quando houver navegação |
| `navegacao.rotas[].id` | `string` | Identidade única da rota no contexto. | Por rota |
| `navegacao.rotas[].tipo` | `string` | Tipo de transição, ex.: direta ou permanecer. | Por rota |
| `navegacao.rotas[].origem.instanciaRef` | `string` | Instância que contém o disparador. | Por disparador visual |
| `navegacao.rotas[].origem.elementoRef` | `string` | Elemento visual que dispara a rota. | Por disparador visual |
| `navegacao.rotas[].origem.itemRef` | `string` | ID de item específico de uma coleção. | Quando repetível |
| `navegacao.rotas[].destino.tipo` | `string` | Natureza do destino, como tela. | Se houver destino |
| `navegacao.rotas[].destino.ref` | `string` | ID canônico do objeto de destino. | Se houver destino |
| `navegacao.rotas[].quando` | `object` | Condição declarativa que limita a rota. | Opcional |
| `navegacao.rotas[].evento` | `string` | Identificação de evento vinculado. | Opcional |
| `estados.fallbackSeguro` | `string` | Estado visual seguro para ausência de resolução. | Se houver resolução |
| `estados.itens[]` | `object` | Estados possíveis identificados. | Quando houver estados |
| `estados.itens[].id` | `string` | ID próprio do estado. | Por estado |
| `estados.itens[].nome` | `string` | Nome legível do estado. | Contextual |
| `estados.itens[].descricao` | `string` | Finalidade/efeito documental do estado. | Opcional |
| `estados.itens[].quando` | `object` | Expressão declarativa de seleção. | Se resolvido por condição |
| `estados.itens[].prioridade` | `number` | Precedência declarada da seleção. | Se aplicável |
| `estados.dimensoes` | `object` | Agrupa dimensões independentes de estado. | Se houver múltiplas dimensões |
| `estados.dimensoes.<dimensao>.estadoRefs[]` | `string` | IDs dos estados aceitos pela dimensão. | Por dimensão |
| `estados.dimensoes.<dimensao>.fallbackRef` | `string` | Estado de fallback da dimensão. | Se definido |
| `estados.capacidadesPorAcesso` | `object` | Permissões visuais de exemplo; não substitui autorização de backend. | Específico do caso |
| `variantes.itens[]` | `object` | Variação identificada aplicada à estrutura. | Quando houver variação |
| `variantes.itens[].id` | `string` | ID da variante. | Por variante |
| `variantes.itens[].quando` | `object` | Condição que ativa a variação. | Se condicional |
| `variantes.itens[].alteracoes[]` | `object` | Alteração declarada sobre alvo estável. | Por variante |
| `variantes.itens[].alteracoes[].alvo.instanciaRef` | `string` | Instância afetada. | Por alteração |
| `variantes.itens[].alteracoes[].alvo.elementoRef` | `string` | Elemento afetado, se aplicável. | Opcional |
| `variantes.itens[].alteracoes[].propriedade` | `string` | Campo/atributo visual modificado. | Por alteração |
| `variantes.itens[].alteracoes[].operacao` | `string` | Efeito declarativo, ex.: definir. | Por alteração |
| `variantes.itens[].alteracoes[].valor` | `any` | Valor a atribuir, sem código executável. | Conforme efeito |
| `interacoes.eventos[]` | `object` | Eventos locais/ações simples declarados. | Quando houver interação |
| `interacoes.eventos[].id` | `string` | ID do evento no escopo da tela. | Por evento |
| `interacoes.eventos[].origem.instanciaRef` | `string` | Instância que emite o evento. | Por evento visual |
| `interacoes.eventos[].origem.elementoRef` | `string` | Elemento disparador. | Por evento visual |
| `interacoes.eventos[].tipo` | `string` | Tipo de efeito local. | Por evento |
| `interacoes.eventos[].campo` | `string` | Caminho de estado alterado. | Quando aplicável |
| `interacoes.eventos[].operacao` | `string` | Operação declarativa (definir, alternar etc.). | Quando aplicável |
| `interacoes.eventos[].valor` | `any` | Valor de efeito, se houver. | Quando aplicável |
| `interacoes.eventos[].quando` | `object` | Condição de disparo. | Opcional |
| `dados.fontes[]` | `object` | Fontes externas identificadas, quando conhecidas. | Quando houver fonte real |
| `dados.operacoes[]` | `object` | Operações identificadas sobre fontes reais. | Quando houver operação |
| `dados.persistencia[]` | `object` | Vínculos declarados de persistência. | Quando houver escrita |
| `dados.observacao` | `string` | Nota documental do exemplo, nunca fonte de execução. | Exemplo V0.10 |
| `mocks.cenarios[]` | `object` | Cenários de simulação identificados. | Quando usado no Protótipo |
| `mocks.cenarios[].id` | `string` | ID do cenário. | Por cenário |
| `mocks.cenarios[].cenarioRef` | `string` | Referência a cenário externo, se definido. | Opcional |
| `mocks.cenarios[].nome` | `string` | Nome legível do cenário. | Contextual |
| `mocks.cenarios[].uso` | `string` | Tipo de uso declarado. | Contextual |
| `mocks.cenarios[].situacao` | `string` | Status editorial ou de simulação. | Contextual |

| Campo do **componente** | Tipo observado/esperado | Finalidade | Necessidade |
|---|---|---|---|
| `identidade.id` | `string` | Identificador único da definição do componente. | Essencial |
| `identidade.tipo` | `string` | Natureza do objeto (componente). | Essencial |
| `identidade.nome` | `string` | Nome editorial do componente. | Contextual |
| `classificacao.localizacao.caminho` | `string` | Localização documentada da definição. | Opcional |
| `estrutura.html.raizRef` | `string` | Elemento raiz do componente. | Essencial para montagem |
| `estrutura.html.elementos` | `object` | Mapa dos elementos por IDs internos. | Essencial para montagem |
| `estrutura.html.elementos.<elementoId>.tag` | `string` | Tag do nó de UI. | Por elemento |
| `estrutura.html.elementos.<elementoId>.paiRef` | `string|null` | Elemento pai, quando aplicável. | Por elemento filho |
| `estrutura.html.elementos.<elementoId>.ordem` | `number` | Ordem local. | Conforme montagem |
| `estrutura.html.elementos.<elementoId>.atributos` | `object` | Atributos HTML/semânticos do elemento. | Contextual |
| `estrutura.html.elementos.<elementoId>.texto` | `string` | Texto padrão da definição, se houver. | Opcional |
| `estrutura.html.vinculos[]` | `object` | Ligação entre props/valores e alvos da árvore. | Quando configurável |
| `estrutura.html.colecoes[]` | `object` | Descrição de repetição de itens-modelo. | Quando repetível |
| `estrutura.css.regras` | `object` | Regras CSS próprias da definição. | Quando necessário |

---

## Anexo E — Rastreabilidade e histórico das mudanças

### E.1 Histórico das mudanças incorporadas na V2 (V1 → V2)

| Origem anterior | Decisão histórica na V2, mantida na V3 | Alteração principal |
|---|---|---|
| Direção Canônica V1 | **Mantida e atualizada** | Contratos V0.10 e separação dos quatro módulos permanecem; nenhuma fonte de identidade alternativa. |
| Mapa de Equivalência V1 | **Atualizado** | Antes: 99 definições candidatas. Agora: **67 após exclusões aprovadas**; 23 titlebars sob auditoria. |
| Garantia de Conversão do Fluxo V1 | **Revista em identidade e aceite** | Não utilizar `aliasMap`; preservação histórica apartada e diff V2 com exclusões explícitas. |
| Catálogo Advogado (fonte imutável) | **Não modificado** | 33 telas, 99 definições e 186 instâncias originais permanecem para auditoria. |
| Fonte Flow V3 analisada no documento antigo | **Divergência mantida** | Três ramos de checkout achatados continuam pendentes; não eliminá-los por simplificação. |

### E.2 Tensão técnica resolvida: exclusão vs. preservação integral

A direção antiga de garantir *diff estrutural vazio* em todo e qualquer cenário pressupõe que o formato de destino tenha a mesma estrutura e todos os campos da fonte. Isso **não pode ser prometido** quando o usuário aprovou excluir componentes, campos e mecanismos de alias. A regra prevalente na V3 é separada:

- **Fonte histórica:** bytes originais, com todo o conteúdo que existia, guardados integralmente para auditoria/recuperação; não consumidos pelo sistema operacional novo.
- **Contrato V3:** sem aliases e sem elementos obsoletos; tudo que permanece deve sobreviver sem perda.
- **Relatório de migração:** identifica **cada remoção autorizada** com caminho JSON e ID e prova que nenhuma outra diferença ocorreu.
- **Compatibilidade legada:** reconstruir um arquivo V3 idêntico com **campos expressamente proibidos no destino** não é objetivo de homologação do novo contrato; se uma ferramenta externa exigir isso, será uma tarefa separada de restauração histórica, nunca exigência para o novo motor.

### E.3 Aprovação, registro e não extrapolação

Decididos pelo usuário nesta conversa: retirar `aliasMap`, excluir `modal.route-modal` inclusive no protótipo/editor, retirar `popup.screen-note` do produto, consolidar `props` e remover famílias redundantes; auditar titlebars antes de fundir; manter metadados de motor fora do contrato de UI por padrão.

Não decididos ainda: renomear a Home, quais titlebars devem ser fundidos, as estruturas completas `raizRef/paiRef`, a gramática de condições, as rotas reais e a homologação visual/funcional. Todos continuam rotulados **[PENDENTE]**.

### E.4 Atualizações da V3 e da revisão V3.1 (V2 → V3 → V3.1)

| Documento incorporado | Acréscimo/conciliação | Status |
|---|---|---|
| `CONTRATO_CANONICO_V1.md` | Seção 8: origem, evento, destino, predicado inline, bifurcação derivada, retornos, estados e inspeção | Conceitos compatíveis mantidos; os dois registros globais propostos foram **rejeitados**. |
| `MAPEAMENTO_CAMPOS_FRONT.md` | Seção 9: mapa de 17 famílias de campos, controles de edição, índices derivados, mensagens de pendência e exportação | Legado separado da representação nova; **nenhum resolver por alias**. |
| V2, seção 7.6 | Envelope do Fluxo limitado à árvore editorial, aos metadados e à auditoria | Não expõe coleção de destinos nem de predicados. |
| Matriz de testes | `NAV-01` a `NAV-16`, `FRT-01` a `FRT-24`, com rastreio de escopos | Critérios definidos no papel; execução [PENDENTE]. |
| Anexos F e G | Mapa de incorporação por seção/campo, precedência e checklist V3.1 | Verificabilidade documental. |

**Decisão central aprovada na V3.1:** a **única autoridade de destinos** está em `tela.navegacao.rotas[]`; regras pertencem a `rota.quando`, `estado.quando` ou `variante.quando`. O Fluxo não possui coleções paralelas de transições ou predicados.


---

## Anexo F — Correspondência integral dos dois novos documentos

### F.1 `CONTRATO_CANONICO_V1.md` — reconciliação por tema

| Seção/tópico de origem | Conteúdo aproveitado nesta V3 | Alteração ou ressalva necessária |
|---|---|---|
| §1 Fontes inspecionadas | Projeto_9: 110 telas/388 componentes; projeção (6): 78 telas/197 ocorrências | Números por fonte, não inventário global nem substitutos dos 33 JSONs auditados. |
| §2 Decisões D01–D14 | Uma tela/um componente; refs estáveis; conexões declaradas; inferência do desenho; retorno e segurança | Preservar princípios sem declarar aprovados os **nomes físicos** das novas chaves. |
| §3 Modelo de quatro peças e motor | Separação Tela, Componente, Conexão, Contexto e Motor | Excluir necessidade de vínculo alternativo entre dois IDs da Home. |
| §4 Árvore de Jornadas | `identidade`, `composicao`, `estrutura.css`, estados visuais | `classificacao.escopo` é obsoleto; `estrutura.estadosVisuais` é evidência de fonte, não campo V0.10 obrigatório. |
| §5 Árvore-alvo | Separação de Tela, ações/eventos e apresentação editorial | **Não adotar** os dois registros experimentais de transições/predicados nem aliases; destinos ficam na Tela. |
| §6 Ligação funcional | Origem, gatilho, destino e predicado opcional | Mapear para `navegacao.rotas[]` da Tela, com `.quando` inline; nomes da V1 não são contrato novo. |
| §7 Bifurcação inferida | Losango da mesma saída sob condições; ações distintas não são condição booleana | Branch editorial da fonte continua preservável por ID; não confundir. |
| §8 Compartilhamento | Tela/componentes/segmentos por referência; edição local x compartilhada | Segmentos não implementados por simples semelhança; ID único por objeto. |
| §9 Estados e retorno | Estados visuais, de domínio, de etapa e de navegação; retorno a Home | OAB e onboarding não implicam rotas/banco reais; nenhum clone da Home. |
| §10 Pipeline | Ler, validar, normalizar, derivar grafo e renderizar | Retirar etapa “indexar aliases explícitos”; substituir por validação direta de `identidade.id`. |
| §11 Indicadores/painel | Linha, losango, junção, retorno, pendência; relações ao clicar | Retirar o campo “Alias para documento Jornadas”. |
| §12 Exemplos de ação e navegação | `data-action=online.toggle`, eventos e origem visual | Destino somente em rota de Tela; nomes de domínio exemplificativos não são contratos reais. |
| §13 Migração | Inventário, conectividade, segmentos, inferência, runtime | Substituir “normalização por aliases” por referências diretas e renomeação atômica aprovada, se houver. |
| §14 Critérios de aceite | Reuso, erro em destino, sobreposição de regras, terminal e retorno | Incorporados às matrizes `NAV-*`/`FRT-*`; nenhum teste executado. |
| §15 Pendências | Schema físico, variáveis, histórico, segmentos, Splash, armazenamento | Mantidas e explicitadas nas seções 8, 9 e 11. |
| §16 Regra final | Definições únicas + motor gera visual por relações, não por posição | Integralmente compatível com V3, sem aliases. |

### F.2 `MAPEAMENTO_CAMPOS_FRONT.md` — correspondência exaustiva

O arquivo possui tabela com **17 famílias de campos** (cinco blocos `navegacao`/`identidade`, oito blocos de conectividade/condições/segmentos incluindo as referências, mais os derivados) e três partes adicionais: *Bifurcação inferida*, comandos da interface e *Diferenças entre fontes*. A V3 os tratou individualmente em §9.1 a §9.9, preservando explicitamente o estatuto de proposta quando não homologado.

| Área no documento front | Tratamento em V3 | Motivo |
|---|---|---|
| `identidade.id` | Mantido | Autoridade da definição da tela. |
| `navegacao.participacoes/bifurcacoes` | Histórico apenas | Campos obsoletos no contrato V0.10/novo Fluxo. |
| `navegacao.saidas/entradas` | Leitura legada, conversão verificada | Evitar duas fontes de transições. |
| Registro experimental de ligações da V1 | **Rejeitado**: editar `tela.navegacao.rotas[]` diretamente | Não importar coleção operacional paralela. |
| Registro experimental de predicados da V1 | **Rejeitado**: usar `rota.quando`, `estado.quando`, `variante.quando` | Sem lista global de regras. |
| `segmentos.itens[]` | Candidato de compartilhamento | Vazio no recorte referido; sem deduplicação automática. |
| `referencias.aliases[]` | **Não transportar** | Rejeição explícita de aliases operacionais. |
| `referencias.composicaoBiblioteca[]` | Consulta derivada | Reusar composição da Tela, sem duplicar JSON. |
| `referencias.eventosObservados[]` | Inspeção derivada do componente | Não confundir `data-action` com backend homologado. |
| `referencias.indicesReversos` | Índice calculado/reconstruível | Não constitui outra autoridade. |
| Bifurcação inferida | Preservar como algoritmo de visualização proposto | Sem criar condições/ramificações sem prova. |
| Editar rota / ＋ Rota / Editar `quando` / Ver campos / Exportar | Incorporado a §9.3 e testes `FRT-*` | Modifica o contrato da Tela, não um modelo funcional duplicado. |
| Armazenamento local no navegador | Capacidade opcional do frontend | Não substitui fonte canônica, nem requisito de ambiente não verificado. |
| Catálogo parcial da Home versus fluxo amplo | Inventários apresentados separadamente | Não somar nem igualar contagens de acervos diferentes. |

### F.3 Matriz de precedência da V3 contra o que ficou legado

| Matéria | Antes (V1/anexos) | Agora (V3) | Natureza |
|---|---|---|---|
| Identidade | Duas chaves de Home e resolução por alias sugerida | Uma `identidade.id` por tela; `advogado.home_advogado` mantido neste recorte até mudança aprovada | [APROVADO]. |
| Campo `classificacao.escopo` | Aparece em árvore histórica de Jornadas | Não transportar para contrato novo | [APROVADO]. |
| `navegacao.participacoes` | Uma das fontes editoriais antigas | Rejeitado como campo do novo contrato; dados históricos preservados no snapshot | [APROVADO]. |
| Bifurcação | Branch importado + losango inferido | Duas camadas semanticamente separadas, uma não substitui a outra | [DEFINIDO]. |
| Navegação funcional | Cadastros propostos nos anexos V1 e de frontend | Rejeitados; usar exclusivamente `tela.navegacao.rotas[]` + `.quando` | [APROVADO]. |
| `tela.navegacao.rotas[]` | Campo V0.10 da tela | Única autoridade de transições e destinos; o Fluxo apenas consulta e edita a Tela | [APROVADO]. |
| Modais e etiquetas artificiais | `modal.route-modal`, `popup.screen-note` presentes na origem | Retirados no destino conforme decisão, com diff autorizado | [APROVADO]. |
| HTML/CSS de componentes | Fontes de template e regras próprias | Devem ser convertidos sem simplificação visual; `props` na instância | [DEFINIDO]. |
| Backend/OAB/checkout | Exemplos no contrato de conexões | Exigem prova/definição de fonte real; exemplos não homologam produção | [PENDENTE]. |

---

## Anexo G — Critérios de cobertura e checklist documental V3.1

### G.1 Escopos e números que a V3.1 conserva

| Escopo/fonte | Referência documental | Inventário |
|---|---|---|
| Catálogo Advogado original | `advogado_catalogo_completo (1).json`, inventário do mapa V1/V2 | 33 telas; 64 componentes referenciados + 35 incorporados = **99 definições**; 186 instâncias visuais; 93 referências a ocorrências. |
| Catálogo Advogado **após saneamento aprovado, ainda não executado** | Seção 6 deste documento | 33 telas; **67 componentes candidatos**; **123 instâncias**; 23 `header.titlebar` ainda sob auditoria. |
| Projeção (7) reportada em Garantia V1 | Outro acervo de Fluxo | 197 ocorrências, 118 sequências, 36 branches e 117 paths. |
| Apresentação V3 reportada em Garantia V1 | Outra representação do mesmo Fluxo inspecionado | 197 ocorrências, 115 sequências, 33 branches e 114 paths; 3 ramos checkout não representados. |
| `Projeto_9.zip` citado no Contrato V1 | Módulo Jornadas, outra versão | 110 telas; 388 componentes. |
| Recorte Home do Mapeamento Front | `advogadoja-fluxo-projecao.json` mencionado no anexo | Não extrapolar contagem do recorte para todo o Fluxo. |

### G.2 Checklist de especificação consolidada

- [x] Manter integralmente contrato V0.10 de Tela/Componente e os mapas de origem → destino da V2.
- [x] Manter os inventários de 33 Telas, 64 componentes referenciados, 35 locais e os dicionários de campos.
- [x] Incorporar decisões aprovadas: zero aliases operacionais, zero coleções operacionais separadas de navegação/regras, zero `popup.screen-note` e `modal.route-modal` no destino; retirar famílias redundantes; `props` nas instâncias.
- [x] Separar branches editoriais da fonte e losangos de condições inferidos; preservar os três casos checkout achatados para reconciliação.
- [x] Redirecionar o contrato de ligação mínima para `tela.navegacao.rotas[]`, com `quando` inline e sem registros separados.
- [x] Incorporar o mapeamento do frontend com edição de rotas da Tela, regras inline, índices derivados e exportação auditável.
- [x] Adicionar critérios `NAV-01` a `NAV-16` e `FRT-01` a `FRT-24`.
- [x] Preservar distinção entre 33/99, 78/197 e 110/388, pois vêm de fontes/versões diferentes.
- [x] Definir autoridade única dos destinos em `tela.navegacao.rotas[]` e rejeitar cadastros paralelos.
- [ ] Resolver `raizRef`, `paiRef`, instância, repetição, estados, variantes e tipos de `props` dos contratos reais.
- [ ] Executar saneamento e migração dos JSONs com diffs e relatório por campo.
- [ ] Provar continuidade visual/funcional nos quatro módulos e integridade de exportação/importação.
- [ ] Resolver os três agrupamentos de checkout ausentes da apresentação Flow V3, conforme fontes de origem.
- [ ] Homologar regras/variáveis de backend e a política de navegação real, quando estiverem no escopo de produto.

### G.3 Critério final de entrega desta V3.1

**Este arquivo é uma especificação consolidada**, não JSON migrado nem implementação do Motor V4. Somente pode ser chamada de “homologada” depois de: schema aprovado, conversor executado, ausência de perdas não autorizadas, testes estruturais/visuais/funcionais demonstrados, referências diretas consistentes e aceite documentado. Antes disso, o estado correto é **norma de trabalho V3, com decisões aprovadas e propostas pendentes explicitadas**.

**Fim — Documento Canônico Consolidado V3.1, 19/11/2026.**
