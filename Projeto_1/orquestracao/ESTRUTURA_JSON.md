# Estrutura do `orquestracao.json` — V2

```text
schema
versao
meta
contexto_atual
  bloco_id
  fase_id
  modo

jornadas
modelo_acesso
registros[]

blocos[]
  id
  titulo
  status
  arquivado
  objetivo
  criterios_entrada[]
  criterios_conclusao[]
  observacoes
  fases[]
    id
    titulo
    status
    arquivada
    protocolo_id
    planejamento
      revisao
      objetivo
      estrategia
      auditoria
        resumo
        fontes[]
        achados[]
        decisoes[]
        riscos[]
      escopo
        incluir[]
        excluir[]
      contexto
        ler_obrigatorio[]
        nao_ler[]
      validacoes[]
      criterios_saida[]
      tarefas_execucao[]
        id
        tipo
        titulo
        alvos[]
        precondicoes[]
        referencias[]
        instrucoes[]
        resultado_esperado
        validacoes[]
    execucao
      status
      revisao_plano
      gerada_em
      itens[]
      bloqueios[]
      resultado
      handoff

regras
  globais[]
  protocolos[]

historico[]
legado_planejamento
```

A ordem de `blocos[]` define a sequência dos blocos. A ordem de `blocos[n].fases[]` define a sequência de fases. Planejamento e Execução mostram a mesma hierarquia.

Nunca usar posição como ID. A interface pode mostrar `B1 · F1`, mas esses números mudam com reordenação.

Ao gerar execução, `planejamento.tarefas_execucao[]` é copiado para `execucao.itens[]`, acrescentando estado, evidência, resultado e impedimento. Se o plano mudar, a execução deve ser regenerada e a revisão anterior preservada.
