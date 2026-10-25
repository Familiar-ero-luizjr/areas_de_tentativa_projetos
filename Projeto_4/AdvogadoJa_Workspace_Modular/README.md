# AdvogadoJá — Workspace Modular / Store única (proposta V1)

## Objetivo

Ter uma **única fonte editável** para cada tela e para cada componente, com pastas especializadas em **ler, montar, relacionar e simular** essas definições. A antiga página HTML autocontida **não é** a fonte persistente. Nenhuma pasta de motor guarda uma cópia de telas, componentes, conexões ou do grafo geral.

## Começar

1. Extraia o ZIP mantendo a estrutura de pastas.
2. Execute `python iniciar.py` (Python 3.9+; Python 3.9 exige alternativa à função `Path.is_relative_to`, recomenda-se 3.11+).
3. Abra `http://127.0.0.1:8765/` no navegador. O script tenta abrir automaticamente.
4. Edite uma tela pela aba **Árvore do catálogo** ou suas ocorrências na **Árvore do Flow**. O status no cabeçalho informa quando a gravação terminou.
5. Os arquivos alterados ficam diretamente em **`catalogo/telas/.../*.json`** e **`catalogo/componentes/.../*.json`**. Reinicie ou recarregue a página quando fizer edições externas no disco.

Também é possível abrir a interface por um servidor estático, como o Live Server usado no catálogo raiz. Nesse caso a interface lê cada JSON canônico listado em `app/catalogo-arquivos.js`, habilitando as árvores e os motores em **modo leitura**. Para gravar edições em disco, use obrigatoriamente `python iniciar.py`.

**Importante:** abrir `index.html` por duplo clique (`file://`) não permite ao navegador gravar nos arquivos. Por isso há um servidor **local**, sem dependências externas, vinculado apenas a `127.0.0.1`. Não é necessário internet, Firebase nem um servidor remoto. Não abra simultaneamente duas sessões de edição; o servidor usa controle de versão por registro e recusa gravações antigas. Ao adicionar ou remover um JSON canônico, mantenha `app/catalogo-arquivos.js` com a mesma lista de caminhos.

## Árvore física

```text
advogadoja_workspace_modular/
├── index.html                     # interface, não contém JSON das telas
├── iniciar.py                     # servidor local + APIs de leitura/edição
├── app/catalogo-arquivos.js        # caminhos para leitura estática; não replica os dados
├── jornadas/                       # cascas HTML por jornada; leem o catálogo, não copiam telas
│   ├── painel.js                   # subabas dinâmicas a partir de classificacao.jornadas
│   └── painel.css                  # aparência da aba integrada
├── banco/                          # projeção de dados.persistencia das telas
├── mapa/                           # projeção integrada de jornadas, estados e ações
├── catalogo/                      # ÚNICA fonte de verdade persistente
│   ├── telas/
│   │   ├── comum/auth/splash.json
│   │   ├── comum/auth/entrar.json
│   │   ├── advogado/home_advogado.json
│   │   ├── admin/dashboard/dashboard.json
│   │   └── ...                    # 79 definições individuais
│   └── componentes/
│       ├── globais/headers/app-header.v04.json
│       └── ...                    # 9 definições reais
├── arvore_catalogo/               # organização e editor dos registros
├── motor_montagem/                # motor visual de componentes, CSS, slots, estados
├── motor_fluxo/                   # árvore com sequências/ocorrências/bifurcações
├── arvore_relacoes/               # relações operacionais; entradas derivadas
├── motor_simulacao/               # estados, cenários, simulação declarativa
├── arvore_exportacao/             # pacotes, índice e exportação como projeções
├── app/                           # cola UI + persistência, sem dados canônicos
├── contratos/                     # documentação e contrato canônico PROPOSTO
└── verificacao/                   # script de auditoria sem dependências
```

### Por que preservar pastas por domínio em vez de uma lista plana?

As pastas apenas facilitam navegação humana; **o ID estável** em `identidade.id` é o que conecta os sistemas. Por exemplo, `catalogo/telas/comum/auth/entrar.json` tem o ID `auth.sessao.entrar`; não é necessário repetir o caminho nos componentes. A árvore aparece na interface por `classificacao.localizacaoArvore`. As pastas organizadas por área e seção permitem editar pequenos subconjuntos sem mexer nos motores. Nomear arquivos somente por números de passo não é seguro porque uma tela aparece em mais de uma posição do fluxo.

## Como os dados circulam

```text
catalogo/telas/**/*.json ─────────────┬──> arvore_catalogo (edição da tela)
                                     ├──> motor_fluxo (sequências e bifurcações)
                                     ├──> arvore_relacoes (grafo derivado das ações)
                                     ├──> motor_montagem (estrutura e componentes)
                                     ├──> motor_simulacao (cenários e rastros)
                                     └──> arvore_exportacao (índice/pacotes derivados)
catalogo/componentes/**/*.json ───────┤
                                     └──> resolvidos por identidade.id
jornadas/*/index.html ────────────────┘──> mesmo motor de montagem, em modo leitura
```

- Os editores **escrevem somente no documento canônico envolvido**, através de `POST /api/catalogo/sync`; o servidor verifica o hash anterior, valida IDs e grava o JSON de forma atômica.
- Movimentar ocorrências na árvore atualiza `flow.editor.occurrences` ou `.branches` das telas pertinentes; não cria um `flow_master` editável.
- Relações de saída são extraídas de `acoes.grupos[].acoes` e itens de instância; entradas são sempre calculadas, nunca persistidas.
- Cada tela declara, quando a jornada exigir, suas entidades, campos e relações em `dados.persistencia`. A aba **Banco** agrega essas declarações; não mantém uma modelagem paralela nem importa tabelas do Projeto 1 como fonte de verdade.
- A aba **Mapa integrado** projeta `classificacao`, `estados`, `flow.editor` e `acoes` das mesmas telas. O HTML de mapa do Projeto 1 é somente referência visual.
- A visualização do Flow **não significa** que exista uma condição de negócio executável. `quandoLegado` é histórico a migrar.
- `mocks` não concedem permissões reais, não acionam comandos externos e não substituem verificações autoritativas.

## Jornadas renderizadas pelo catálogo

Na aba **Jornadas** do Workspace, as subabas derivadas das telas usam a camada de
apresentação em `jornadas/`. Elas leem os mesmos JSONs canônicos e chamam o
mesmo `motor_montagem/montagem.js` usado pelas demais abas do Workspace.
Não há cópia de HTML de telas, de imagens de componentes ou de CSS de componentes
nessas páginas. A lista lateral vem de `classificacao.jornadas` e das instâncias
compatíveis; a prévia vem de `estrutura.arvore`, `estilos.css` e
`componentes.instancias`; os botões de próximas telas vêm de `acoes.grupos`.

## Pontos de referência e regressão

A migração preserva 79 telas, 197 ocorrências, 33 bifurcações, 114 caminhos e 408 saídas originais do Flow V3. Há 234 componentes: os nove originais da Home Profissional e 225 componentes em árvore importados das jornadas do Projeto 1. As páginas de jornada e o Workspace montam essas definições pelo mesmo contrato. Há ainda uma tela sem posição herdada na árvore (`advogado.disponibilidade.raio_atendimento`) e uma tela (`auth.cadastro.tipo_conta`) referenciada pelas jornadas, porém sem definição visual no material-fonte.

A implementação fornece simulação de navegação declarativa (sem execução de backend), e o contrato de simulação é uma **proposta de evolução**, não um simulador funcional de regras de negócios.

## Próximos passos para fechar os contratos

Ler `contratos/01_CONTRATO_CATALOGO_TELA.md`, `02_CONTRATO_CATALOGO_COMPONENTE.md`, `03_CONTRATO_MOTOR_FLOW.md` e `04_CONTRATO_MOTOR_SIMULACAO.md`. Os arquivos separam **o que já existe** das decisões ainda pendentes. Primeiro aprovar o contrato, depois completar tela a tela os componentes faltantes e migrar condições de navegação textuais para regras executáveis, de forma incremental.

## Auditoria e testes

- `python verificacao/auditar_catalogo.py`: valida IDs, referências de fluxo e contagens de regressão sem bibliotecas externas.
- `node verificacao/preencher_persistencia_projeto1.js --inspect`: confere a correspondência com o material do Projeto 1 sem modificar o catálogo. Com `--apply`, preenche uma única vez `dados.persistencia` das telas correspondentes; Banco e Mapa nunca leem o Projeto 1 em execução.
- `python verificacao/teste_browser.py`: teste opcional com Playwright + Chromium que exercita a edição, o salvamento em disco, as relações e a montagem do Flow. O teste usa **cópia temporária** do projeto e não modifica o catálogo entregue. Em máquinas com Chromium fora de `/usr/bin/chromium`, ajuste a localização no teste.
- `contratos/tela.schema.proposto.json` e `contratos/componente.schema.proposto.json`: esquemas JSON Schema evolutivos, não versões finais homologadas. Foram validados contra os registros entregues.

## Evolução V2 — jornadas de verdade dinâmicas (25/10/2026)

A base original recebida foi preservada, com os ajustes aditivos descritos em `contratos/06_JORNADAS_DINAMICAS_E_PROVENIENCIA_V2.md`. A aba **Jornadas** e o **Mapa integrado** não possuem mais quatro perfis cadastrados no JavaScript; descobrem `classificacao.jornadas[]` das telas e mostram os grupos existentes. A lista de telas da jornada usa `subjornadas` e `localizacaoArvore.ordem`. Telas `*` entram em todas as jornadas declaradas. Ao criar uma tela pelo botão **+ Tela**, é possível informar uma jornada inédita; ela aparece automaticamente nas abas e no mapa ao salvar.

A conciliação com variantes de componentes *já existentes no JSON de cada tela* completou 50 participações de jornada, sem gerar telas, componentes ou conexões. As quatro jornadas existentes agora são descobertas pelos dados (Cliente, Advogado, Estudante, Administrador). A fonte continua sendo o arquivo individual. As ações, o motor do Flow e as prévias continuam independentes da ordem ou do nome físico da pasta.

A limpeza dos metadados históricos (`migracaoProjeto1`, `proveniencia`, versões com sufixos) é auditável em `verificacao/`. Nenhum histórico foi usado como fonte da interface. **Contratos ainda são propostas; esta alteração não autoriza políticas nem condições de negócio.**

## Módulo Contrato evolutivo (V3 · adicional)

A aba **Contrato** agora é um módulo funcional próprio em `modulo_contrato/`, com
`data/contrato_workspace.json` como **única fonte de persistência** dos objetivos,
campos, regras, pendências e decisões de contrato. Seus itens editáveis são
agrupados em seis áreas: **Catálogo/jornadas, tela, componente, montagem, Flow
editorial e simulação**. Esse documento é de **planejamento**: não migra nem
altera automaticamente `catalogo/telas` e `catalogo/componentes`.

Ao executar `python iniciar.py`, usar **Contrato → Objetivos / Contratos por área /
Decisões / JSON integral**. O botão **Importar JSON do contrato** aceita apenas
`advogadoja.modulo_contrato.v1` e substitui o rascunho após confirmação. O botão
**Exportar JSON do contrato** gera `ADVOGADOJA_CONTRATO_WORKSPACE.json` **sem** telas,
componentes ou índices. O botão **Salvar no disco** atualiza exclusivamente
`modulo_contrato/data/contrato_workspace.json`, com detecção de conflito de versão.

As rotas HTTP são `GET /api/contrato` e `POST /api/contrato/sync`; a API do
catálogo e os JSONs existentes não foram substituídos. As decisões são propostas
até homologação explícita. Veja `modulo_contrato/README.md` e
`contratos/07_MODULO_CONTRATO_EVOLUTIVO_V1.md`.
