# Módulo Protótipo — V5

O módulo `motor_prototipo/` implementa a aba **Protótipo** da experiência navegável. A antiga aba de simulação técnica foi substituída.

## Interface

- **Escolha de jornada/persona:** as opções são lidas dinamicamente dos JSONs das telas, por `classificacao.jornadas`.
- **Pontos da jornada:** lista filtrável gerada a partir das ocorrências de `flow.editor` e de suas sequências e caminhos.
- **Prévia visual:** monta `estrutura`, `estilos`, `componentes.instancias` e o estado seguro de cada tela com o motor de montagem.
- **Voltar, Avançar, Reiniciar:** controlam somente a sequência demonstrativa em memória.

## Estrutura

```text
motor_prototipo/
├── prototipo.js   # navegação, seleção e renderização derivada da Store
├── prototipo.css  # layout e responsividade
└── README.md
```

O módulo **não** precisa de `data/` próprio: o projeto preserva o princípio de que telas, jornadas, componentes, ocorrências e ações são definidos somente pelo catálogo. O documento exclusivo de **planejamento** dos contratos continua em `modulo_contrato/data/contrato_workspace.json`.

## Contrato e limitações

Contrato ativo (proposto): `../contratos/04_CONTRATO_MOTOR_PROTOTIPO.md`. Histórico da renomeação: `../contratos/08_MIGRACAO_NOMENCLATURA_PROTOTIPO_V5.md`.

A implementação atual **lineariza os caminhos compatíveis da árvore editorial**. Não existe ainda seletor interativo de `paths[]` para decisões condicionais. Botões dentro da prévia são demonstração e **não** autenticam, cobram ou executam ações externas. Se componentes faltarem, a ausência deve ser sinalizada, e não disfarçada com interface inventada.

## Testes

- `python verificacao/teste_prototipo.py`: fluxo visual, busca, navegação e descoberta de novas jornadas.
- `python verificacao/teste_browser.py`: regressão integrada do catálogo, Flow, conexões e navegação.
- `python verificacao/teste_modulo_contrato.py`: contrato separado, importação, exportação e persistência.
