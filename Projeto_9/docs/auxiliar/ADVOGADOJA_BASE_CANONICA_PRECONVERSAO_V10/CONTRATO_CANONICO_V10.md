# AdvogadoJá · Contrato canônico operacional V10 (pré-conversão)

## Fonte normativa
`CONTRATO_CANONICO_OBJETIVO.md` (V7) e `HOME_PROFISSIONAL_INSPETOR_V7.html`, após as decisões sobre retirada de variantes e blocos paralelos. O V8 enviado é referência de componentes visuais e catálogo inicial, não a autoridade para alterar IDs ou criar campos.

## Definição de tela
Cada `documento.json` contém exatamente oito blocos, com uma fonte por responsabilidade:

1. **identidade**: `id`, `tipo`, `namespace`, `nome`, `nomeExibicao`, `descricao` opcional.
2. **classificacao**: `localizacao.caminho`, `perfilRef` opcional, `jornadaRefs`, `subjornadaRefs`.
3. **estrutura**: `html.raizRef` e `html.composicao` de instâncias (`id`, `componenteRef`, `paiRef`, `alvoRef`, `ordem`, `props`, `estados` opcionais, `visivelQuando`); `css.tokens`, `css.regras` e `css.folhasRefs` opcionais.
4. **estados**: dimensões com `id`, `inicial`, `opcoes`; cada opção tem `id` e `alvos`; `origemValor` quando aplicável.
5. **interacoes**: `id`, `origem.instanciaRef`, `origem.eventoRef`, `efeito` para comportamento **local**.
6. **navegacao.rotas**: `id` descritivo, `origem.instanciaRef`, `origem.eventoRef`, `destinoRef`, `quando` opcional. Única fonte de regras e destinos.
7. **dados**: `fontes`, `operacoes`; não presumir integrações.
8. **mocks.cenarios**: `id`, `nome`, `valores` por referência de estado. Não define comportamento do produto.

## Componentes
Em `componentes/catalogo.json`, `identidade.id`, `estrutura.html.elementos` e `vinculos`, `estrutura.css.regras`, `estados`, `interacoes`. O JSON de tela faz referência a componentes, sem duplicar suas definições. Componente local só deve ser criado quando o conteúdo da tela exigir; header/menus podem ser compartilhados.

## Estado e CSS/HTML
Condições têm uma entre: `{ "estadoRef": "estado.x", "igual": "valor" }`, `{ "todos": [...] }`, `{ "qualquer": [...] }`. O motor usa o mesmo avaliador para `visivelQuando`, `aplicaQuando` e `navegacao.rotas[].quando`. Efeitos de opção usam `alvos` com referência de instância/elemento, atributos, classes ou texto. Um alvo pode declarar `quando` para não sobrescrever outro estado que controle o mesmo elemento (ex.: seção Escritório só altera o título se a área Escritório estiver ativa). Sem variantes paralelas.

## Navegação e subjornadas
Cada evento com mudança de tela tem rota própria e ID descritivo. Entrada é derivada das saídas declaradas em outras telas, sem cadastrar `entradas`. Cada trecho navegável distinto pode possuir subjornada; `jornadas.json` guarda `paiRef`, `filhosRefs`, `rotaRefs`, nunca as regras copiadas. Eventos de menu que apenas mudam a seção atual são interações locais.

## Motor universal
`motor.js` é **exatamente o mesmo arquivo** em todas as oito telas. Não verifica `advogado.home`, `cliente.home` ou qualquer nome de perfil; interpreta somente JSON. Sem `eval`, sem URLs remotas e sem dependência de backend. O navegador precisa de servidor HTTP para carregar JSON por `fetch`; `python servidor.py` inicia uma prévia local.

## Progressividade
Tela/Jornada lê identidade + classificação + estrutura + estados + interações + dados. Fluxo adiciona navegação. Protótipo adiciona mocks. Os blocos são parte do **mesmo** documento, e nunca de cópias independentes.

## Limites e aceitação
- Rotas/eventos sem evento de DOM identificado continuam **avisos de auditoria**, não cliques fabricados.
- Visuais complexos do V8 usavam JavaScript específico das três Homes; na V10 o motor **não** copia essas regras, logo alguns textos derivados ou filtros especializados podem exigir efeitos declarativos adicionais no JSON antes da homologação visual completa.
- Nenhuma autenticação, banco, pagamentos ou permissões de backend é executada; o teste é de estrutura e simulação.
- A biblioteca 01/02 ainda não foi migrada nesta entrega; sua migração dependerá de auditoria, classificação e aceitação das diferenças visuais.

## Arquivos de validação
- `SCHEMA_TELA_V10.json`: contrato estrito, sem blocos adicionais fora dos oito aprovados.
- `auditoria.json`: referências de tela, componentes, estados e rotas; evento sem vínculo é aviso, não evento inventado.
- `auditoria_schema.json`: validação JSON Schema das oito telas.
- `INVENTARIO_01_02_ORIGENS.json`: leitura do ZIP de origem, sem executar migração.
- `PLANO_CONVERSAO_01_02.md`: roteiro de auditoria e colisões de pastas.

## Testes adicionais de comportamento
Após a conversão declarativa de estados foram executadas, sem erro de JavaScript, estas simulações: Home profissional (OAB restrita/habilitada, abrir Escritório, trocar seção e retornar), Cliente (área Estudante, plano ativo e catálogo), Administrador (permissão Gestão e seção Logs), clique de validação OAB com destino identificado. Esses testes complementam, mas **não substituem**, comparação visual de todos os estados do material de origem.

## Simulador
O `index.html` na raiz apresenta as três leituras progressivas (`Tela/Jornada`, `Fluxo`, `Protótipo`), controles de estados, subjornadas e auditoria. Cada `telas/.../index.html` reproduz a tela sem a barra do editor. Os controles técnicos de cada tela podem ser abertos com `?debug=1` para diagnóstico. Os cenários mock são aplicados pelo inspetor em tempo de execução e não alteram o JSON.

## Pendências de homologação
16 eventos de navegação estão sem vínculo de evento de componente confirmado na fonte V8 (incluindo eventos de fluxo não disparados por clique). São avisos registrados, e destinos externos continuam não implementados. A validação de integridade não certifica que o efeito final de toda ação local especializada seja idêntico ao HTML V8.
