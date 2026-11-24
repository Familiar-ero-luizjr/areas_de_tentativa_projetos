# Projeto 9 — atualização mínima e análise de impacto (V5)

## Escopo aprovado e limites

- Corrigir a remoção do **modal artificial `modal.route-modal.v02`** nos dados ativos da Home e índices, sem substituir por outro modal.
- Uniformizar **`estados`** como bloco de componente e opção de instância (antigos `estrutura.estadosVisuais` e `estadoVisual`).
- Sincronizar os leitores JavaScript dos módulos ativos e a biblioteca autocontida, para evitar regressão de estados.
- Não renomear a tela `advogado.home`, não alterar rotas candidatas nem condições, e não modificar outros modais ou componentes.
- Preservar a pasta `legado/`, as fontes auxiliares em `docs/auxiliar/` e os documentos canônicos como histórico; o pacote original permanece intacto.

## Inventário dos dados operacionais

| Arquivo | Telas antes → depois | Componentes antes → depois | Instâncias antes → depois | Instâncias do menu com estado padronizado |
|---|---:|---:|---:|---:|
| `Dados_Motor_V4/documento.json` | 1 → 1 | 9 → 8 | 9 → 8 | 1 |
| `modulos/jornadas/data/documento.json` | 110 → 110 | 388 → 387 | 645 → 644 | 46 |
| `modulos/fluxo/visualizacao_fluxo/data/documento.json` | 110 → 110 | 388 → 387 | 645 → 644 | 46 |

## Mapa de dependências ajustadas

| Consumidor | Alteração mínima | Risco evitado |
|---|---|---|
| `Dados_Motor_V4/documento.json` | Remover 1 componente/instância, mover estados para bloco próprio | Contrato e índice inconsistentes |
| `Dados_Motor_V4/biblioteca.jsonl` | Remover 1 registro indexador obsoleto | Componente inexistente continuar listado |
| `modulos/jornadas/data/documento.json` | Remover somente o modal da Home; padronizar 46 instâncias do menu | Home com modal artificial e estados ignorados |
| `modulos/jornadas/js/motor.js` | Ler `componentes[id].estados` e `composicao[inst].estados` | Menu não mudar aberto/fechado, online/offline |
| `modulos/fluxo/visualizacao_fluxo/data/documento.json` | Mesma correção da biblioteca; outras rotas preservadas | Fluxo consumir uma variante diferente da Jornada |
| `modulos/fluxo/visualizacao_fluxo/js/motor.js` | Atualizar leitura de estados e remover o comportamento de abrir modal artificial por clique nos cards | Prévia reintroduzir um fluxo não declarado |
| `Motor_V4/Visualizacao/motor.js` | Atualizar leitura de estados | Visualização perder estado inicial e troca do menu |
| `docs/AdvogadoJa_Motor_V4_Biblioteca_Por_Localizacao_Autocontido.html` | Atualizar árvore virtual de arquivos, bloco `estados`, leitor de componentes e viewer | Exportar JSONs desatualizados pela ferramenta autocontida |

## Itens deliberadamente não modificados

- `modulos/fluxo/campos_utilizados`: suas menções a `estadosVisuais` pertencem à representação de auditoria do editor, não à leitura do contrato de componente. Alterá-las exigiria outra decisão de schema e interface.
- `legado/*`, `Pastas_geradas_arvore_modular/*` e `docs/auxiliar/*`: referências históricas não alimentam os módulos ativos verificados.
- `docs/AdvogadoJa_advogado.home_*_sem_modal_V4.json` e o comparador V4: já contêm a exclusão e a padronização.
- Nenhuma inferência nova de destino; no Fluxo as rotas pendentes não foram promovidas a executáveis.
- CSS `.device-frame` e outras regras globais não relacionadas à remoção do modal não foram reescritas; exigem auditoria visual isolada se necessário.

## Critérios de aceite executados

- Todos os três arquivos de dados ativos passam por `json.loads` e preservam a contagem de telas.
- Só uma definição e uma instância de `modal.route-modal.v02` foram retiradas por arquivo de dados.
- `ui.advogado.menu.principal.estados` preserva integralmente os eixos e valores de origem, incluindo seus efeitos sobre elementos.
- As 46 ocorrências de composição do menu (1 na base Motor V4) possuem agora `estados`, sem `estadoVisual`.
- Os três motores foram inspecionados para não usar os caminhos antigos.
- HTML autocontido conserva árvore virtual válida e sua Home possui `estados` na instância do menu; não resta diretório do modal artificial.
- Arquivos não listados como alterados permanecem byte-a-byte iguais ao ZIP de origem.

## Pendências fora deste patch

- Os botões de solicitações e outras navegações com destino pendente **não passam a navegar** apenas pela exclusão do modal. Validar ligações `interacoes → acoes → navegacao.rotas` e a existência de destinos antes de executar.
- O motor completo de Protótipo HTML/CSS/JS ainda não existe como módulo dedicado no Projeto 9; não foi inventado neste patch.
- Testes no navegador e validação visual das 110 telas dependem de ambiente de execução; a verificação realizada foi de contratos, referências e sintaxe de JavaScript.
