# Biblioteca única de telas — AdvogadoJá V2

Este pacote contém exclusivamente a **biblioteca canônica unificada de 98 telas**, em `ui_library/conteudo/telas/`, com um JSON por ID (`dominio.modulo.tela`). Cada arquivo mantém o formato `{ "<id>": { "tela": {...}, "componentes": {...} } }`.

## Regras obrigatórias

1. Os IDs de tela são únicos. Uma tela compartilhada não possui cópias em pastas de Cliente, Advogado ou Administrador.
2. `classificacao.jornadas` contém cada participação e sua ocorrência sem fundir contextos.
3. `navegacao.relacoes` guarda as saídas declaradas, com `jornadaRef`; `navegacao.entradas` é uma projeção consistente por `relacaoRef` e nunca define destinos novos.
4. `navegacao.bifurcacoes` mantém todas as alternativas com `relacaoRef` de uma saída existente, e têm `jornadaRef`.
5. `acoes.itens` e `variantes.regras` mantêm diferenças por jornada; o motor não define gatilhos ou condições ausentes.
6. Em telas compartilhadas, **o contexto da jornada é obrigatório para renderizar**: `componentes.instanciasPorJornada[jornada]`, `estrutura.html.composicaoPorJornada[jornada]` e `variantes.visuaisPorJornada[jornada]`. Os componentes concretos estão na coleção `componentes` do mesmo JSON.
7. A UI pode ser idêntica entre contextos, mas o CSS pode ser diferente. Toda variação explícita é conservada; nenhuma versão é sobrescrita por outra.
8. O pacote não mantém metadados de extração, mapas de migração ou aliases. O índice em `docs/indice_telas.json` é **derivado**, usado apenas para localização; não é uma segunda definição de tela.

## Estrutura

```
ui_library/conteudo/telas/
├── admin/
├── advogado/
├── auth/
├── cliente/
├── escritorio/
└── notificacoes/
docs/
├── README.md
├── AUDITORIA.md
└── indice_telas.json
```

**Sem regras inventadas:** informações incompletas (gatilhos, critérios e contextos de processo) permanecem como pendências de especificação.
