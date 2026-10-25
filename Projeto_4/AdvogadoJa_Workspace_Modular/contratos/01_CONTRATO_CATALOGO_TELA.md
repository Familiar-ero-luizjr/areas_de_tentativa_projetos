# Contrato de tela — PROPOSTA V1

## Campos presentes nos JSONs

| Seção | Objetivo | Origem canônica |
|---|---|---|
| `schema` | Identificação do contrato de tela | Tela |
| `identidade.id` | ID único e estável (`auth.sessao.entrar`) | Tela |
| `identidade.nome`, `rota`, `versao`, `status` | Nome, rota e ciclo de vida | Tela |
| `classificacao.localizacaoArvore` | Hierarquia amigável do catálogo (segmentos, chave, ordem) | Tela |
| `classificacao.jornadas`, `subjornadas` | Contexto de exibição/organização | Tela |
| `estados.fonte`, `grupos`, `fallbackSeguro` | Estados selecionáveis da tela | Tela |
| `componentes.instancias[]` | Referências `ref` a componentes, slots, ordem e props | Tela; conteúdo visual no componente |
| `estrutura.base` e `estrutura.grupos[]` | Layout e colocação de instâncias | Tela |
| `estilos.tema` e `estilos.grupos[]` | Tokens e CSS próprios da tela | Tela |
| `acoes.grupos[].acoes[]` | Destinos, eventos, comandos e comportamento declarados | Tela |
| `dados.grupos`, `dados.fontes` | Texto, dados locais e indicação de fonte autoritativa | Tela |
| `mocks.grupos`, `mocks.cenarios` | Massa de teste e cenários | Tela |
| `flow.editor` | Posicionamento da tela e seus branches na árvore Flow | Tela |

## Regra de não duplicação

**O arquivo individual da tela é o único dono desses dados.** Pacotes de exportação por tela, índices da Store e grafo são **projeções**. A raiz de um pacote importável continua `{ "catalogo": { "metadados":{}, "componentes":[], "telas":[] } }`, mas nunca é gravada como fonte paralela na pasta `catalogo/`.

## Exemplo existente

`catalogo/telas/comum/auth/entrar.json` contém a definição da tela Entrar. `catalogo/telas/advogado/home_advogado.json` exemplifica as instâncias visuais de componente.

## Pontos pendentes

- Validar contrato formal de estado em dependência de dados backend.
- Especificar evento, condição, destino e efeito executáveis (a maioria dos links ainda é `ligacao_flow_migrada`).
- Revisar nomes dos tipos e versões após fechar a modelagem.
- Confirmar dados obrigatórios por perfil, incluindo administrador, advogado e cliente.

## Alterações sem regressão

Adicionar novo campo opcional é permitido. Remover/renomear campo requer migração dos consumidores e teste de todo o catálogo. O ID nunca é alterado implicitamente pela movimentação no Flow.

## Complemento V2: jornadas inferidas diretamente dos JSONs

`classificacao.jornadas[]` é o único campo necessário para declarar a participação da tela; o motor descobre novos IDs e cria suas abas dinamicamente. `"*"` significa tela comum e não gera aba própria. É válido usar várias jornadas na mesma tela. `classificacao.subjornadas[]` e `localizacaoArvore.ordem` permitem agrupamento e ordenação sem mudar `identidade.id`; a ordem do Flow continua definida separadamente em `flow.editor`.

A proveniência de importação não pertence ao contrato de tela; veja `06_JORNADAS_DINAMICAS_E_PROVENIENCIA_V2.md`. Não gravar listas de entradas na tela de destino nem transições no motor: essas projeções são derivadas das ações da origem.
