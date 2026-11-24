# Plano inteligente de execução — Bibliotecas 01 e 02

## Prioridade e critério

Primeiro identificar a função da tela; os nomes de arquivos e as rotas da fonte são pistas, não decisões definitivas. A auditoria de origem contém 192 HTMLs, 126 IDs distintos e 225 relações candidatas. Estas não equivalem a 225 rotas homologadas.

## Ordem de execução

### 01_acesso — 27 HTMLs

Verificar visual, eventos, predecessoras e sucessoras, estados e ramificações. As rotas propostas só são homologadas depois da revisão funcional.

### 02_cadastro_onboarding — 23 HTMLs

Verificar visual, eventos, predecessoras e sucessoras, estados e ramificações. As rotas propostas só são homologadas depois da revisão funcional.

### 03_cliente — 37 HTMLs

Verificar visual, eventos, predecessoras e sucessoras, estados e ramificações. As rotas propostas só são homologadas depois da revisão funcional.

### 04_advogado — 61 HTMLs

Verificar visual, eventos, predecessoras e sucessoras, estados e ramificações. As rotas propostas só são homologadas depois da revisão funcional.

### 05_administracao — 21 HTMLs

Verificar visual, eventos, predecessoras e sucessoras, estados e ramificações. As rotas propostas só são homologadas depois da revisão funcional.

### 06_outros — 23 HTMLs

Verificar visual, eventos, predecessoras e sucessoras, estados e ramificações. As rotas propostas só são homologadas depois da revisão funcional.

## Contrato e arquivos por tela

A estrutura de pastas `01/telas/...` e `02/telas/...` é preservada. Cada pasta contém `index.html`, `style.css`, `motor.js`, `documento.json`, `README.md`. O motor é literalmente idêntico em todos os diretórios. O JSON mantém exclusivamente `identidade`, `classificacao`, `estrutura`, `estados`, `interacoes`, `navegacao`, `dados` e `mocks`.

## Regime de montagem — README por tela

Documenta composição, fontes visuais, referências, estados, entradas, saídas, grau de certeza e limites de validação. Nenhum caminho para os HTMLs originais é necessário para executar a nova tela.

## Status e limites

**Executado:** conversão inicial dos 192 contratos e prévias com motor universal; cópia de CSS/elementos no JSON; documentação em 192 arquivos README.

**Pendente para homologação:** teste visual completo em navegador, comportamento específico de cada tela, classificação semântica de rotas conflituosas e decisões reais de onboarding. O motor implementa um núcleo comum, não todos os comportamentos de negócio não declarados.

**Importante:** esta entrega é uma biblioteca funcional de estudo, não equivalência visual/funcional comprovada tela a tela.

## Artefatos de auditoria

- `auditoria_conversao.json`: resumo e potenciais problemas de extração.
- `PLANO_EXECUCAO_POR_TELA.csv`: ordem e detalhes individuais.
- `jornadas_propostas.json`: hipótese de jornadas e ligações candidatas.
