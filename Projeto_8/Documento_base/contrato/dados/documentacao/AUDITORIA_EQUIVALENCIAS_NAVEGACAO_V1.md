# Projeto 8 — Auditoria de equivalências da navegação (V1)

**Data:** 07/11/2026  
**Escopo:** comparação semântica entre fontes de Jornada, Fluxo e Protótipo para aprimorar o **modelo de trabalho**, sem homologação automática.  
**Repositório consultado:** `Familiar-ero-luizjr/areas_de_tentativa_projetos`, branch `main`, referência anterior `abef82cbbf6f38128310300a452c4cbecefb5480`.

## Regra de interpretação

Não considerar nomes iguais como prova de funções iguais nem nomes diferentes como prova de funções distintas. Comparar **entrada lida → operação → efeito**. Informações documentais, decisões editoriais e execução devem continuar distinguíveis. Não substituir os motores existentes nesta etapa.

## 1. Evidências e limitações

| Fonte | Evidência verificada | Limitação |
|---|---|---|
| `JORNADAS/visualizador/app.js` | Lê `navegacao.participacoes`, `jornada.id/nome/ordem`, `subjornada.id/nome/ordem`, `ordemTela`; exibe telas em ordem. | O `iframe` gerado usa `pointer-events:none`; o front atual é estático, sem interatividade interna comprovada. |
| `JORNADAS/dados/manifest.json` e `JORNADAS/telas/advogado/advogado.home_advogado.json` | Fonte inclui `fluxoFonte.nos`, `arestas`, `routes`, `branch`, `entradas` e `relacoes`. | A exibição de Jornada não consome todas essas arestas; existência no JSON não prova consumo visual. |
| `htmls_autocontidos/ADVOGADOJA_FLUXO_V2_AUTOCONTIDO.html` | HTML de Fluxo identificado no catálogo do GitHub (aprox. 6,5 MB). | O conteúdo integral não foi recuperável pelas ferramentas disponíveis; **uso efetivo do front do Fluxo não auditado**. |
| `PROTOTIPO/dados/cliente_v3/modelo.json` | `sequencias.passos`, `relacoes[{origem,destino,evento}]`, `mocks`, `ordem`, `configuracao.telaInicial`. | Modelo de dados documental; o JS específico de execução no repositório está vazio. |
| `PROTOTIPO/telas/modular_v2/advogado/advogado.home_advogado.json` | `componentes.instancias`, `aplicaA`, `estados.grupos.quando`, `acoes.grupos`, `flow` e destino/ação no menu. | A execução efetiva dessas regras não pode ser confirmada com o motor vazio. |
| `PROTOTIPO/componentes/modular_v2/menu.drawer.v01.json` | `eventoEmitido`, `interface.eventosEmitidos`, `props.itens[].destino/acaoRef`. | Declara contrato de eventos, mas não prova comportamento executado. |
| `PROTOTIPO/visualizador/app.js` e `conector/montador.js` | Carregam por manifesto e montam `iframe` com modelo, componentes e script. | `cliente_v3.js` e `modular_v2.js` estão com **0 bytes** nesta revisão; a experiência interativa não está comprovada. |
| `CONTRATO/dados/contrato/modelo.json` | Já contém `rotas`, `relacoes` e `bifurcacoes`. | É modelo em avaliação; não é esquema homologado dos três motores. |

## 2. Matriz de equivalência por FUNÇÃO

| Função | Nomes nas fontes | Destino de modelagem | Situação |
|---|---|---|---|
| Identificar tela | `identidade.id`, `id`, `screen` | Identidade da tela; referências por ID | Confirmado nas fontes |
| Jornada/subjornada | `participacoes`, `jornadas`, `subjornadas` | `classificacao.jornadas` | Separação arquitetural já decidida |
| Posicionamento de tela | `ordemTela`, `screenIds`, `sequencias.passos` | Classificação para ordem editorial; sequência do cenário não vira automaticamente navegação | Distinção necessária |
| Aresta de navegação | `origemNo/destinoNo`, `origemTela/destinoTela`, `origem/destino`, `next` | `navegacao.relacoes[]` com extremos identificados | Proposta de normalização |
| Decisão/alternativas | `routes`, `branch`, `opcao`, `relacoes.tipo=decisao` | `navegacao.bifurcacoes[]` apontando para `relacoes[]` | Proposta de normalização |
| Gatilho | `evento`, `eventoEmitido`, `itemSelecionado`, `acaoRef` | `interacoes` e `acoes`; navegação guarda só referências | Responsabilidades estabelecidas; campos propostos |
| Contexto de estado | `state`, `destinoEhEstado`, `aplicaA.estados`, `estados.grupos` | Estado definido em `estados`; navegação referencia nó/estado sem criar tela | Princípio estabelecido |
| Simulação | `mocks`, `sequencias`, `passos`, `configuracao` | Cenários do Protótipo e `mocks`; não duplicar em `navegacao` | Separação recomendada |
| URL/caminho | `identidade.rota`, `/professional/home`, `destino` | `navegacao.rotas[]` para endereços, `relacoes[]` para conexões | Modelo em avaliação |
| Portas de ligação | Referências históricas de portas do Flow disponíveis no acervo de contratos | `origem.portaRef` e `destino.portaRef` opcionais | **Proposta; front atual do Fluxo não verificado** |
| Mesmo componente em várias telas | `componentes.instancias[].id/ref`, `eventoEmitido` | `gatilho.instanciaRef` + `elementoRef` + `eventoRef` | Proposta; exigir teste de instâncias |

**Importante:** `sequencias.passos` representa um roteiro de demonstração. Não equivale automaticamente a uma transição executável entre telas.

## 3. Mudanças feitas no modelo (TODAS EM AVALIAÇÃO)

1. Referências antes descritas como tipo exclusivamente `null` passam a ser `string` com `nullable:true` quando possuem semântica de ID: `condicaoRef`, `criterioRef`, `fallbackRelacaoRef` e referências do gatilho.
2. Extremos de relações ganham `portaRef` opcional, sem duplicar `noRef`, `ref` nem `telaContextoRef`.
3. A relação ganha `participacaoRef` contextual e `prioridade` opcionais; `ordem` não é sinônimo de prioridade.
4. O gatilho ganha `instanciaRef` opcional para desambiguar componentes reutilizados.
5. Alternativas de bifurcação admitem `condicaoRef` e `prioridade` opcionais, mantendo `relacaoRef` como ligação única.
6. Os arrays reservados `rotas[].parametros/query/redirecionamentos` recebem objetos candidatos descritivos. São exemplos para análise, não políticas executáveis.
7. `classificacao.jornadas[].condicaoRef` e `submoduloRef` passam a aceitar referência textual ou `null`.
8. A Home preserva **21 relações**, **2 bifurcações**, **1 rota** e os destinos originais. Os novos campos permanecem `null`, sem inventar resoluções.

## 4. Regras de compatibilidade e não regressão

- Não alterar os visualizadores nem os contratos históricos de Jornada/Protótipo/Fluxo nesta rodada.
- Não promover IDs, condições, permissões ou endpoints do exemplo da Home a definição de produção.
- Preservar `classificacao.jornadas` como fonte da participação; não duplicá-la em `navegacao`.
- Manter diferenças entre aresta editorial, ação executável e transição interna.
- Referência ausente ou não resolvida deve ser detectável; não produzir destino fictício.
- Não marcar auditoria do Fluxo/Protótipo como completa sem ler os motores executáveis.
- Não inserir achados propostos em `decisoes_consolidadas.json` como se fossem aprovados.

## 5. Validações executadas nesta atualização

- JSONs do modelo, glossário e Home analisados como objetos.
- Cobertura de entradas do modelo de navegação no glossário: **77 caminhos documentados**, nenhum ausente.
- IDs das relações: **21 distintos**, referências de alternativas e fallback verificadas.
- Extremos de relação: presença de `tipo` e `ref` verificada.
- Integridade preservada: **1 rota, 21 relações, 2 bifurcações**.
- Sem alteração de CSS, HTML, JavaScript de motor, ações reais ou permissões.

## 6. Próximas validações para homologação

1. Recuperar/inspecionar integralmente o HTML do **Fluxo V2** e mapear entradas realmente lidas pelas operações da interface (nós, portas, conexões, movimento, condições).
2. Restaurar ou localizar os **scripts executáveis** dos dois laboratórios de Protótipo; rastrear consumo de `evento`, `acaoRef`, `destino`, `aplicaA` e mocks.
3. Comparar a Jornada existente com o requisito futuro de interatividade interna; hoje o visualizador desabilita cliques na prévia.
4. Testar o mesmo cenário canônico via adaptadores com os três motores e medir divergências.
5. Decidir obrigatoriedade/cardinalidade, tipos permitidos, portabilidade dos parâmetros, prioridade/desempate e fallback.
6. Após aprovação explícita, registrar apenas as decisões aprovadas em `decisoes_consolidadas.json` e versionar o contrato homologado.
