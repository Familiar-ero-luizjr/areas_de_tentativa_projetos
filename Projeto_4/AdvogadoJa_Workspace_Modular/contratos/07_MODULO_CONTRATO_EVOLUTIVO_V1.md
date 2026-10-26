# Novo módulo `modulo_contrato/` — contrato evolutivo V1

## Objetivo

Este módulo serve para **definir e homologar as regras** que o Catálogo, a Tela, o
Componente, a Montagem, o Flow e o Protótipo deverão seguir. É o lugar certo
para discutir, comparar e aprovar mudanças **antes** de implementá-las nos
motores. Não introduz outro cadastro de telas, outras relações, nem regras
executáveis.

## Arquivos e interface

```text
modulo_contrato/
  README.md
  contrato.css
  contrato.js
  data/
    contrato_workspace.json   # única fonte persistente do módulo
```

A interface fica na aba `Contrato` do Workspace e suporta edição de objetivos,
metadados de cada área, campos, regras, pendências, critérios de aceite e
decisões. Inclui também editor integral, validação, importação e exportação do
JSON exclusivo desse módulo.

### Estrutura lógica do JSON

- `schema`: fixo como `advogadoja.modulo_contrato.v1`.
- `metadados`: identidade, versão, título, situação e escopo do documento.
- `objetivos[]`: princípios orientadores de produto/arquitetura.
- `areas[]`: cada área tem `id`, `titulo`, `situacao`, `objetivo`, `fonte`,
  `campos[]`, `regras[]`, `pendencias[]`, `criteriosAceite[]`.
- `campos[]`: cada registro tem `campo`, `finalidade`, `exigencia` (`obrigatorio`,
  `condicional`, `opcional`), `situacao` (`existente`, `proposto`, `em_revisao`,
  `pendente`) e `regra`.
- `decisoes[]`: cada decisão tem `id`, `assunto`, `decisao`, `situacao` e
  `impacto`.
- `controle.aplicacaoAutomaticaNoCatalogo`: **false**, sempre na fase de
  planejamento. A eventual implementação futura requer processo separado.

### Persistência, separação e segurança

- `GET /api/contrato` lê somente `modulo_contrato/data/contrato_workspace.json`.
- `POST /api/contrato/sync` recebe `{doc,expected}`; exige schema exclusivo,
  valida formato básico, impede IDs duplicados, recusa versão desatualizada,
  escreve atomicamente no caminho fixo.
- A importação de JSON de tela/pacote do catálogo é rejeitada. Importação do
  contrato afeta apenas o rascunho; salvar requer comando explícito.
- Exportação baixa somente `ADVOGADOJA_CONTRATO_WORKSPACE.json`.
- Nenhuma operação do módulo chama `/api/catalogo/sync`. Não há migração
  automática dos contratos em `catalogo/`.

## Política de continuidade

Até cada contrato ser aprovado, os documentos em `contratos/00..06_*.md` e os
arquivos canônicos atuais descrevem o comportamento implementado. O novo módulo
registra o comportamento desejado e as pendências. Diferenças entre o estado
atual e o proposto são apresentadas para decisão, não conciliadas silenciosamente.

## Aceites verificados

Testes automáticos em `verificacao/teste_modulo_contrato.py`: abertura, edição,
gravar/reler, exportar JSON, rejeitar catálogo, bloquear conflito de hash e
preservar catálogo e Flow.
