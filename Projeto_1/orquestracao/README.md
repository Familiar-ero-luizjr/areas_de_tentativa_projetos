# Orquestração — Advogado Já

A pasta `orquestracao/` é o centro operacional do laboratório. Ela coordena a ordem em que as áreas especialistas trabalham.

A interface possui três sub-abas alimentadas pelo mesmo `orquestracao.json`:

- **Planejamento** — blocos, fases, auditoria, contexto, escopo, tarefas e critérios.
- **Execução** — a mesma hierarquia, com o pacote executável gerado pelo planejamento.
- **Regras** — regras globais e protocolos reutilizáveis.

## Estrutura canônica

```text
Bloco
└── Fase
    ├── Planejamento
    └── Execução
```

**Bloco** é um objetivo macro. **Fase** é uma etapa ordenada dentro daquele bloco.

A ordem de `blocos[]` e `blocos[].fases[]` é a ordem real de trabalho. `B1`, `B2`, `F1`, `F2` são apenas posições visuais; os IDs técnicos permanecem estáveis.

## Edição

A interface permite criar, reordenar, editar e arquivar blocos e fases; gerar execução; registrar evidências, resultados, bloqueios e handoff; editar regras/protocolos; importar e exportar o JSON.

Mover no Planejamento altera a ordem na Execução, pois as duas abas exibem os mesmos objetos.

## Persistência

A página não grava diretamente no GitHub. Para persistir: editar → exportar `orquestracao.json` → substituir no repositório → revisar diff → commitar.

## Blocos iniciais

1. Governança do repositório
2. Regras de operação
3. Usuários, identidade e acesso
4. Normalização estrutural para três jornadas
5. Jornada Cliente
6. Jornada Advogado
7. Jornada Administrador
8. Consolidação transversal
