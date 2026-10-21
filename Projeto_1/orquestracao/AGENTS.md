# AGENTS.md — Orquestração

## Missão

Coordenar o projeto Advogado Já por **blocos e fases**, mantendo contexto mínimo, decisões rastreáveis e execução mecânica.

`orquestracao.json` é a fonte única desta pasta. HTML, CSS e JavaScript são interface/motor.

## Hierarquia obrigatória

```text
bloco → fase → planejamento → execução
```

- **Bloco**: objetivo macro.
- **Fase**: etapa ordenada do bloco.
- **Planejamento**: auditoria, diagnóstico, escopo, contexto, tarefas e validações.
- **Execução**: pacote gerado; registra evidência, resultado, bloqueio e handoff.

`B1`, `F1` etc. são somente posição. IDs internos são estáveis.

## Regra máxima

```text
auditar → planejar → validar plano → gerar execução → executar → validar → handoff
```

Não editar produto durante auditoria. Não executar antes de existir plano específico. Não improvisar quando o estado real divergir do plano.

## Blocos

Cada bloco deve declarar objetivo, critérios de entrada, critérios de conclusão, fases, estado e observações.

Blocos podem ser criados, reordenados e arquivados. Bloco com histórico não deve ser apagado.

## Fases

Cada fase deve registrar objetivo, protocolo, contexto obrigatório e proibido, achados, decisões, escopo, validações, critérios de saída e tarefas concretas quando houver escrita.

Uma fase só está pronta para gerar Execução quando uma IA com baixa capacidade de raciocínio consegue seguir as tarefas sem escolher arquitetura, escopo ou regra de produto.

## Tarefas executáveis

Toda tarefa deve informar: alvo exato, tipo de ação, precondições, referências, instruções em ordem, resultado esperado e validações.

Evitar instruções vagas como “melhorar”, “organizar”, “corrigir” ou “refatorar” sem especificação.

## Contexto e economia de tokens

Antes de uma fase:

1. ler o `AGENTS.md` raiz;
2. ler este arquivo;
3. localizar `contexto_atual`;
4. ler bloco e fase ativos;
5. carregar apenas `planejamento.contexto.ler_obrigatorio`;
6. respeitar `planejamento.contexto.nao_ler`;
7. preferir busca/trechos a leitura integral de artefatos grandes;
8. usar o handoff anterior.

Não carregar o repositório inteiro por padrão.

## Áreas especialistas

A Orquestração decide **quando e com qual objetivo** uma área atua; não substitui o `AGENTS.md` local.

Ao trabalhar numa pasta, obedecer também ao AGENTS local, que deve definir o que a área pode ler, alterar, decidir e entregar.

## Execução

A Execução não redefine o plano. Arquivo diferente, requisito ausente, conflito de arquitetura, dependência não prevista, instrução ambígua ou risco novo relevante devem bloquear a tarefa e devolvê-la ao Planejamento.

## Revisões e histórico

IDs não mudam com reordenação. Execução corresponde a uma revisão do plano. Se o plano mudar, a execução deve ser regenerada e a anterior preservada no histórico. Decisões alteradas preservam evolução. Bloco/fase com histórico deve ser arquivado, não apagado.

## Persistência

A interface edita em memória. Para persistir: exportar `orquestracao.json`, substituir no repositório, validar schema, revisar diff e commitar.

## Schema

Esperado: `advogadoja.orquestracao.v2`.

Não reintroduzir `fases[]` na raiz; usar `blocos[].fases[]`.
