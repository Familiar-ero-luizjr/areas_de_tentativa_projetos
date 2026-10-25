# AGENTS.md — AdvogadoJá Workspace Modular

1. Fonte canônica de telas = `catalogo/telas/**/*.json`, um documento de tela por arquivo. Fonte canônica de componentes = `catalogo/componentes/**/*.json`, um documento por arquivo.
2. Não criar `flow_master`, `screens_master`, grafo persistido, `inbound` duplicado ou pacotes completos dentro das pastas de motor. O motor pode gerar projeções **em memória** e permitir exportação delas, em pasta externa `Projecoes`.
3. Identidade dos objetos = `identidade.id` (estável); path deriva de `classificacao.localizacaoArvore`. Não inferir identidade pela numeração ou pela sequência no Flow.
4. `flow.editor` controla somente a **montagem editorial da árvore**, não a navegação real. `acoes.grupos[].acoes` e componentes instanciados controlam referências operacionais de navegação. `quandoLegado` não é executável.
5. Simulação nunca executa autenticação real, backend, pagamentos ou permissões. `mocks` são apenas cenários.
6. Evoluir contratos por adição compatível e migração documentada. Antes de remover campos, verificar usos em todos os motores e comparar as contagens de regressão: 79 telas, 197 ocorrências, 33 branches, 114 caminhos e 408 ações importadas.
7. Somente os módulos de editor solicitam escrita; componentes, árvore de relações, montagem e simulação são leitores dos objetos de tela. A escrita pertence ao servidor local, não ao browser diretamente.
8. Não inventar componentes visuais, campos de negócio ou prévias: 225 componentes foram importados de jornadas e nove eram nativos, mas isso não implica homologação visual ou lógica. Indicar pendências de forma explícita.
9. Jornadas são descobertas *somente* dos valores `classificacao.jornadas` dos JSONs de tela; não manter arrays estáticos de jornadas nas interfaces, mapas ou simulador. `*` é global; `admin` é alias legado de `administrador` no motor, mas os IDs de tela com `admin.` permanecem estáveis.
10. Alterações de jornada ou subjornada não renomeiam `identidade.id`, não duplicam registros de tela e não recriam `flow.editor`. Uma nova jornada em qualquer tela deve gerar sua aba e raia no Mapa; remover a última participação deve retirar a aba sem apagar arquivos.
11. `migracaoProjeto1`, `proveniencia` importada e rótulos de origem em `identidade.versao` pertencem aos arquivos técnicos de `verificacao/`, não aos contratos funcionais. Preservar históricos, mas nunca usá-los como dados de montagem.

## Módulo Contrato (adicionado após V2)

- `modulo_contrato/data/contrato_workspace.json` é a única fonte do **planejamento** e da homologação dos contratos; `catalogo/` continua sendo fonte exclusiva de telas/componentes.
- Nunca aplicar automaticamente o planejamento na Store. `controle.aplicacaoAutomaticaNoCatalogo` deve continuar `false` enquanto não existir migração homologada.
- O módulo só pode consumir `/api/contrato` e `/api/contrato/sync` para persistência. Exportação/importação usam `schema: advogadoja.modulo_contrato.v1`, nunca o pacote `catalogo`.
- Conservar a distinção entre contrato de campo, contrato do motor, ação operacional e edição editorial. Revisar pendências e critérios antes de marcar área como homologada.
- Validar mudança com `python verificacao/teste_modulo_contrato.py` e executar regressão do catálogo/Flow. Nunca alterar identificadores existentes apenas para melhorar ordenação.
