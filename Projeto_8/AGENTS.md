# Projeto 8 — Instruções de trabalho

## Escopo
Este diretório reúne módulos independentes de laboratório: `BANCO`, `CONTRATO`, `JORNADAS`, `PROTOTIPO` e referências `htmls_autocontidos`.

## Antes de modificar
1. Leia o `AGENTS.md` da raiz do repositório e o `README.md` do módulo afetado.
2. Confirme exatamente qual módulo e quais arquivos serão alterados.
3. Preserve os módulos restantes e o funcionamento atual sem alterações não solicitadas.

## Contratos
- `CONTRATO/dados/contrato/modelo.json`: estrutura de tipos do modelo em avaliação.
- `CONTRATO/dados/contrato/glossario.json`: finalidade e situação dos campos.
- `CONTRATO/telas/advogado/advogado.home.json`: mock demonstrativo, não fonte de verdade para permissões ou rotas.
- `CONTRATO/dados/documentacao/decisoes_consolidadas.json`: apenas decisões efetivamente aprovadas.
- Uma proposta, evidência parcial ou ausência de motor executável não autoriza homologação.
- Ao mudar o modelo, preserve ou atualize o glossário e valide referências, tipos e identidade das entradas.

## Regras gerais
- Não importar nomenclaturas legadas sem justificar função e uso.
- Não repetir informação canônica que pode ser derivada por ID estável.
- Não incluir segredos, credenciais ou dados pessoais reais.
- Aplicar mudanças restritas aos caminhos explicitamente afetados pela tarefa.
