# Motor de simulação — PROPOSTA V1

## Entradas

- `telaId` (`identidade.id`)
- `jornada` (perfil ou contexto do usuário)
- `estado` (`estados.grupos[].id`)
- `cenarioId` (`mocks.cenarios`)
- `eventoId`/`acaoId` opcional (`acoes.grupos[].acoes[].id` ou `componentes.instancias[].props.itens[].id`)

O motor usa **os mesmos registros** da Store (telas e componentes); não tem uma cópia das telas, dos componentes ou do grafo.

## Projeção de saída

- Estado/jornada selecionados e cenário de teste (massa de dados declarada)
- Montagem resolvida do motor de montagem (`compile()`), sem backend
- Lista de ações declaradas compatíveis com o estado/jornada
- Destino indicado (`destino` ou `seSucesso.destino`), se houver
- Rastros de eventos simulados, sem gravá-los no catálogo
- Pendências: componente ausente, destino não localizado, condição não executável, comando/backend não executado

## Níveis de simulação

1. **Disponível agora:** seleção de tela/estado/jornada, prévia estrutural dos componentes existentes, lista de ações, indicação de destino e rastros, navegação declarativa segura dentro do catálogo.
2. **Não disponível:** execução de regras de negócio, callbacks reais, interpretação de `quandoLegado`, transações, acesso Firebase, pagamentos, OAB, permissões e sessão real. Todos permanecem simulados.
3. **Contrato futuro:** regras tipadas e versionadas, máquina de estados, condições determinísticas, asserts por cenário, mocks de fonte externa, rastreabilidade por ocorrência, testes de percurso com resultados esperados.

## Regra de segurança e fidelidade

Nunca interpretar uma condição textual ou uma ação legada como autorização para efetuar navegação real ou mutação de banco. A simulação deve exibir que a condição não foi avaliada, ao invés de fingir que uma regra de negócio passou.
