# Projeto 7 — Regras do contrato vivo

1. Preservar os módulos `audit/`, `catalog/`, `database/`, `flow/`, `generator/`, `map/`, `master/`, `prototype/` e o novo módulo estrutural `jornadas/`.
2. Fonte canônica: contratos JSON por tela em `catalog/catalogo/`; a identidade lógica é `identidade.id`, nunca o nome de arquivo.
3. Modelo Mestre, Flow, Jornadas e demais motores são consumidores independentes dos dados e não devem replicar código nem criar outro catálogo autoritativo.
4. Flow complementa os 17 campos já existentes: preferir `navegacao.participacoes/entradas/saidas/bifurcacoes/caminhosLineares`, `estados`, `acoes`, `mocks`.
5. Só adicionar `navegacao.nosContextuais` se existir nó declarado sem tela própria nem representação suficiente em `estados`.
6. Não criar transições, estados, condições, permissões, destinos ou participações não documentados; preservar nulos.
7. O Projeto 8 serve como referência estrutural; não copiar seus códigos ou seus JSONs de tela para o Projeto 7.
8. Mudanças de modelo ≠ migração de contratos reais ≠ implementação/homologação de motores. Registrar cada uma separadamente.

Ver `biblioteca_telas/ESTRUTURA_FLOW_JORNADAS_V1.md`, `PROJETO_7_CHECKLIST_EXECUCAO.md` e `PROJETO_7_CONTROLE_CONTEXTO_REGRESSAO.md`.
