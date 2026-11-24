# Projeto_9 — Motor V4 modularizado

## Resultado

O HTML autocontido `AdvogadoJa_Motor_V4_Biblioteca_Por_Localizacao_Autocontido.html` foi reorganizado em módulos executáveis, cada um com sua própria interface e seu próprio motor JS. **Nenhuma tela ou definição de componente está gravada nas pastas de código do `Motor_V4`.**

### Estrutura principal

```text
Projeto_9/
├── Motor_V4/
│   ├── index.html
│   ├── motor.css
│   ├── motor.js                         # Serviços comuns, leitura, persistência e ZIP
│   ├── Biblioteca/
│   │   ├── index.html                   # Árvore por classificação e editor
│   │   ├── biblioteca.css
│   │   └── motor.js                     # Importação, edição e exportação
│   ├── Contratos_minimos/
│   │   ├── index.html
│   │   ├── contratos.css
│   │   ├── motor.js                     # Seleção dos contratos via JSONL
│   │   ├── Tela/
│   │   │   ├── index.html
│   │   │   ├── motor.js
│   │   │   └── contrato.json
│   │   ├── Fluxo/
│   │   │   ├── index.html
│   │   │   ├── motor.js
│   │   │   └── contrato.json
│   │   └── Prototipo/
│   │       ├── index.html
│   │       ├── motor.js
│   │       └── contrato.json
│   └── Visualizacao/
│       ├── index.html
│       ├── visualizacao.css
│       └── motor.js                     # Renderizador declarativo em iframe isolado
├── Dados_Motor_V4/
│   ├── biblioteca.jsonl                # Índice de telas/componentes: 1 registro por item
│   ├── documento.json                  # Fonte única de dados, compartilhada com Visualização
│   └── contratos_minimos.jsonl         # Índice independente dos três tipos de contrato
└── docs/
    └── catalogo_jornadas.json          # 3 jornadas / 33 subjornadas
```

## Executar

1. Extraia o ZIP preservando **toda** a pasta `Projeto_9`.
2. Abra um terminal **dentro da pasta `Projeto_9`**.
3. Execute `python -m http.server 8765` (ou `python3 -m http.server 8765`).
4. No navegador, abra **http://localhost:8765/Motor_V4/index.html**.

Os módulos também podem ser abertos diretamente, por exemplo em `http://localhost:8765/Motor_V4/Biblioteca/index.html`.

> Importante: com leitura de JSONs e JSONL separados, **o duplo clique em `index.html` (file://) não é o modo de execução suportado**. Navegadores restringem requisições entre arquivos locais. O servidor HTTP serve somente os arquivos locais; não precisa de backend, npm ou dependências externas.

## Separação dos dados

- **`Dados_Motor_V4/documento.json`**: única fonte canônica para telas e componentes do Motor. Contém a `advogado.home` e as 9 definições já existentes.
- **`Dados_Motor_V4/biblioteca.jsonl`**: índice inicial, 10 linhas JSON. Cada registro tem ID, tipo, caminho classificado e referência ao documento compartilhado. Não contém HTML/CSS duplicado.
- **`Dados_Motor_V4/contratos_minimos.jsonl`**: 3 registros independentes para Tela, Fluxo e Protótipo, com indicação do `contrato.json` configurador de cada um.
- **`Motor_V4/Contratos_minimos/{Tela,Fluxo,Prototipo}/contrato.json`**: configurações de projeção, **não** os dados duplicados das telas.
- **`docs/catalogo_jornadas.json`**: catálogo central de jornadas, com IDs e numerações preservados, inclusive a lacuna `3.2`.

A Biblioteca reorganiza a árvore **somente** pelo valor `classificacao.localizacao.caminho`. Esse caminho não cria navegação nem permissões. Ao salvar um documento, o índice da interface é reconstruído a partir das classificações.

## Edição e exportação

- Na aba **Biblioteca**, a tela é editada como `{"tela": {...}, "componentes": {...}}` completo; o componente como JSON completo da sua definição.
- Os documentos alterados são validados (ID, caminho, conflitos de localização e referências de jornadas) e persistidos no `localStorage` **do mesmo navegador e origem**.
- O navegador não sobrescreve automaticamente os arquivos físicos em `Dados_Motor_V4`. Para persistir externamente, use **Documento compartilhado** e substitua `Dados_Motor_V4/documento.json`. Exporte também o **Índice JSONL** para substituir `Dados_Motor_V4/biblioteca.jsonl`.
- O botão **Exportar Biblioteca ZIP** gera um download independente do Motor: `AdvogadoJa_Biblioteca_Exportada.zip`, contendo `biblioteca/telas/.../documento.json` e `biblioteca/componentes/.../componente.json` organizados pela classificação, mais o índice e o catálogo.
- Há importação de documentos JSON completos e de ZIPs no formato exportado. O formato ZIP gerado não depende de bibliotecas externas.
- O botão de restauração limpa as edições locais e relê o documento de origem do servidor.

## Contratos mínimos

Cada subpasta (**Tela**, **Fluxo** e **Prototipo**) possui `index.html`, `motor.js` e `contrato.json`, e pode renderizar sua projeção independente. A aba principal lê `contratos_minimos.jsonl` para mostrar as modalidades disponíveis.

O contrato de **Tela** projeta os campos visuais e os 9 componentes utilizados, sem alterar a origem. Os de **Fluxo** e **Protótipo** continuam **projeções documentais em definição**, sem presumir conexões/condições, nem executar serviços de backend ou permissões reais.

## Visualização

A Visualização utiliza o mesmo `Dados_Motor_V4/documento.json` — não tem cópia local de `advogado.home`. O renderizador constrói o HTML/CSS declarativo e o exibe em iframe isolado. É possível alternar celular/desktop, simular acesso visual habilitado/restrito e exportar a prévia HTML. Ações externas permanecem apenas informativas.

## Verificações realizadas

- Base inicial: **1 tela** (`advogado.home`) e **9 componentes**.
- **10 classificações** com `localizacao`, `escopo` e `jornadas` preservadas.
- Validação de **3 jornadas e 33 subjornadas**.
- A Biblioteca exportou um ZIP contendo 1 documento completo, 9 documentos de componentes, índice, catálogo e README (**13 entradas**).
- Alterar a localização da Home e salvar atualizou a árvore e o caminho de exportação.
- Os três motores de contrato abriram suas projeções a partir da mesma fonte.
- A Home foi renderizada em prévia isolada, incluindo a alteração visual para acesso restrito.

## Guia de campos e responsabilidades por seção

As seções seguintes documentam os blocos encontrados no documento compartilhado e os módulos que os consomem. O objetivo é evitar regras implícitas: cada tipo de dado possui origem, finalidade e limites claros.

### 1. Identidade (`identidade`)

- **Onde fica:** `Dados_Motor_V4/documento.json`, em cada tela ou componente.
- **Campos observados:** `id`, `tipo`, `namespace`, `nome`, `nomeExibicao`, `descricao` (a presença varia conforme o item).
- **Responsabilidade:** identificar um item de maneira estável, independente da localização da pasta e da forma como ele é exibido.
- **Regra:** mudar o nome exibido não deve implicar mudar o ID; referências entre itens utilizam IDs.

### 2. Classificação (`classificacao`)

- **Onde fica:** em cada tela/componente do documento compartilhado; `docs/catalogo_jornadas.json` guarda o catálogo central de jornadas.
- **Subblocos:** `localizacao.caminho`, `escopo.perfilRef`, `jornadas`.
- **Comportamento documentado:** a árvore é agrupada pelo caminho de localização; o caminho não representa rota de navegação nem autorização.
- **Estado dos dados recebidos:** uma entrada de jornada pode conter simultaneamente `jornadaRef`, `subjornadasRefs`, `id`, `numero`, `nome` e `subjornadas`. Isso expressa vínculo e metadados repetidos, não duas jornadas diferentes.
- **Evolução recomendada (ainda não implementada):** uma representação canônica de vínculo por IDs, resolvendo `nome` e `numero` pelo catálogo. Por exemplo, `{"jornadas":[{"id":"advogado","subjornadas":[{"id":"home"}]}]}`. A migração depende de atualizar os leitores, editores e validadores do motor e os índices relacionados; não basta alterar o README.

### 3. Estrutura (`estrutura`)

- **Onde fica:** documento compartilhado, na definição de tela ou componente.
- **HTML declarativo:** `raizRef`, `composicao` (instâncias da tela) e/ou `elementos` (árvore de elementos dos componentes), com `paiRef`, `slot`, `ordem`, `componenteRef`, `tag`, `atributos` e `texto` conforme o caso.
- **CSS declarativo:** `tokens` e `regras` com identificadores estáveis.
- **Responsabilidade:** descrever composição e aparência sem embutir definições específicas das telas no código do Motor.
- **Limite:** uma referência de componente não deve ser confundida com cópia da definição desse componente.

### 4. Estados (`estados`) e variantes (`variantes`)

- **Estados observados:** `possiveis` e `fallbackSeguro`; cada estado pode incluir `id`, `nome`, `descricao`, `origemNo` e `pendente`.
- **Variantes observadas:** `regras` com `gatilho`, `opcao`, `estadoAlvo`, `origem`, `jornadaRef` e notas.
- **Responsabilidade:** documentar apresentações alternativas da **mesma tela**. No exemplo `advogado.home`, o estado de OAB modifica capacidades e conteúdo, sem criar uma segunda Home.
- **Limite:** simular um estado visual não constitui autorização real de uso de funções protegidas.

### 5. Interações (`interacoes`) e ações (`acoes`)

- **Interações:** eventos observáveis no protótipo, como `eventosPrototipo` e atributos HTML (`data-action`).
- **Ações:** decisões funcionais e rotas alternativas descritas em `itens`, `evento`, `rotas`, `destino` e `relacaoDireta`.
- **Regra:** diferenciar clique simulado, decisão de fluxo e execução real. A documentação não deve transformar um evento demonstrativo em operação de backend.

### 6. Navegação (`navegacao`)

- **Campos observados:** `rotas` e `destinosDeclarados`; referências podem relacionar `instanciaRef`, `componenteRef`, `elementoRef` e `destinoRef`.
- **Responsabilidade:** registrar destinos associados a elementos, mantendo a navegação independente da posição das pastas na biblioteca.
- **Limite:** destinos declarados não significam, por si, que a navegação está implementada ou que a tela de destino já existe.

### 7. Dados (`dados`) e mocks (`mocks`)

- **Dados:** `fontes`, `operacoes` e `persistencia` descrevem integrações e armazenamento previstos; coleções vazias não comprovam implementação.
- **Mocks:** `cenarios` identifica dados fictícios e seu uso de visualização/simulação.
- **Regra:** separar cenários documentais de dados reais e de serviços homologados.

### 8. Biblioteca (`Motor_V4/Biblioteca/`)

- **Entrada:** documento compartilhado e índice `biblioteca.jsonl`.
- **Responsabilidade:** navegar pela árvore de localização, editar definições, validar alterações, importar e exportar.
- **Persistência atual:** alterações locais no `localStorage`, não gravação automática dos arquivos do projeto.
- **Saída:** documento compartilhado, índice atualizado e ZIP da biblioteca, conforme comandos disponíveis.

### 9. Contratos mínimos (`Motor_V4/Contratos_minimos/`)

- **Catálogo dos contratos:** `Dados_Motor_V4/contratos_minimos.jsonl`.
- **Contrato Tela:** `Contratos_minimos/Tela/contrato.json`, configura os campos projetados e a inclusão dos componentes referenciados. O arquivo de configuração enviado contempla `schema`, `schemaVersion`, `identidade`, `classificacao`, `estrutura` e `navegacao`.
- **Contrato Fluxo:** projeção documental em definição; não assumir decisões/condições que não tenham sido fornecidas.
- **Contrato Protótipo:** projeção documental em definição; não tratar a prévia como aplicação operacional.
- **Regra:** contratos mínimos são configurações de seleção de campos, **não** cópias independentes dos dados da tela.

### 10. Visualização (`Motor_V4/Visualizacao/`)

- **Entrada:** documento compartilhado, a mesma fonte usada pela Biblioteca.
- **Responsabilidade:** renderizar a estrutura declarativa em iframe isolado, alternar dispositivos e simular estados visuais.
- **Limite:** os botões e destinos externos não executam serviços reais; a prévia exportada é uma representação visual.

### 11. Validação, importação e exportação

- **Validações documentadas:** identidade, localização, conflitos de caminho e referências de jornada.
- **Importações:** documento JSON completo e ZIP no formato da biblioteca exportada.
- **Exportações:** documento compartilhado, índice JSONL, ZIP da biblioteca e prévia HTML.
- **Integridade:** depois de editar ou migrar campos, verificar se documentos, índice, catálogo e contratos continuam coerentes.

### 12. Fonte única e prevenção de duplicação

- **Definição de telas/componentes:** `Dados_Motor_V4/documento.json`.
- **Índice de localização e busca:** `Dados_Motor_V4/biblioteca.jsonl`.
- **Nomes, números e hierarquia de jornadas:** `docs/catalogo_jornadas.json`.
- **Configuração das projeções:** os arquivos `contrato.json` e seu índice `contratos_minimos.jsonl`.

**Nota de compatibilidade:** os documentos atualmente recebidos ainda armazenam metadados expandidos junto das referências de jornada. A remoção dessa duplicação é uma **proposta arquitetural**, não uma mudança já aplicada ao Motor V4. Qualquer migração deve ocorrer de forma coordenada entre dados, editor, validadores e exportadores.

## Escopo

Este ZIP contém a nova organização do **Motor V4**, seus dados de partida e o catálogo de jornadas. Não substitui nem apaga as outras ferramentas já existentes no seu `Projeto_9` original. Ao integrar, mantenha outras pastas do projeto e acrescente/atualize estas pastas.
