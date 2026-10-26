# Contrato do módulo Protótipo — proposta V2 (revisão V5)

> **Status:** em revisão. Descreve exatamente as capacidades disponíveis no workspace atual e separa propostas ainda não implementadas.

## Responsabilidade

A aba **Protótipo** apresenta jornadas navegáveis, no padrão de laboratório visual: seleção de jornada/persona, lista pesquisável de pontos, área de prévia grande, controles **Voltar**, **Avançar** e **Reiniciar**. Não valida operações reais, não executa backend e não é um motor de simulação técnica.

### Fonte canônica

- `catalogo/telas/**/*.json`: tela, identidade, associação à jornada, `flow.editor`, estrutura, referências de componentes, estados, estilos e ações declaradas.
- `catalogo/componentes/**/*.json`: HTML em árvore, CSS e interface de componentes referenciados pela tela.
- O motor lê a Store em memória carregada desses arquivos e **não persiste** uma lista própria de telas, jornadas, rotas ou estados do protótipo.
- `modulo_contrato/data/contrato_workspace.json` define **planejamento** de contratos; não fornece telas, rotas nem condições para execução.

## Entradas existentes

| Entrada | Origem | Interpretação |
| --- | --- | --- |
| Jornada escolhida | `classificacao.jornadas[]` de cada tela | Descoberta dinâmica; valor `*` participa de todas as jornadas descobertas. `admin` é alias histórico de `administrador`. |
| Tela | `identidade.id` e `identidade.nome` | Referência estável e rótulo visual; nunca usar ordinal para identidade. |
| Ocorrências e caminhos | `flow.editor.occurrences[]`, `flow.editor.branches[].paths[]` | Reconstroem a ordem editorial e preservam a reutilização de telas em múltiplos pontos. |
| Estrutura visual | `estrutura`, `componentes.instancias`, `estilos` | Compilados pelo motor de montagem existente, sem copiar componentes para o protótipo. |
| Estado de prévia | `estados.fallbackSeguro` ou primeiro estado declarado | Estado usado na prévia estática; não é sessão real. |
| Relações operacionais | `acoes.grupos[].acoes` e itens de componente | Mantidas no catálogo/Flow; não confundidas com a simples ordem editorial. |

## Comportamento disponível na V4/V5

1. As opções de jornada são derivadas de `journeyCatalog()` e atualizadas ao mudar os JSONs de tela, sem arquivo ou array-mestre de jornadas.
2. Os pontos do protótipo são derivados da árvore `flow.editor`, aplicando filtro por jornada. Ocorrências repetidas preservam identificação própria.
3. A lista permite buscar pelo nome/ID/etapa. `Voltar`, `Avançar` e `Reiniciar` operam sobre a sequência atualmente exibida.
4. A prévia é produzida por `compile()` + `previewHTML()` do motor de montagem; botões internos são demonstrativos e **não** executam efeitos externos.
5. Múltiplos caminhos de bifurcação compatíveis com a jornada aparecem linearizados, um após o outro. **Não há ainda escolha interativa de ramo na aba Protótipo.** Isso será uma extensão do contrato, não uma funcionalidade já homologada.
6. Quando não houver dados visuais suficientes, a interface não deve inventar componentes: a tela continua representada como ponto do percurso, com sinalização da pendência de prévia.

## Deliberadamente fora do escopo

- Login real, autorização, contratos legais reais, pagamentos, API externas, banco, OAB ou qualquer mutação de dados.
- Avaliar `quandoLegado` como condição executável; expressões textuais herdadas não são regras autorizadas.
- Salvar rascunhos de navegação ou estado transitório dentro dos documentos das telas.
- Usar a aba Protótipo como segunda fonte das ligações operacionais (`acoes.grupos`) ou dos posicionamentos do Flow (`flow.editor`).

## Pendências do contrato

- **Bifurcações navegáveis:** escolhas explícitas de `paths[]`, com gatilhos/condições tipadas e critérios de percurso aprovados.
- **Cenários visuais:** escolher um estado/cenário pré-visualizável por ponto quando houver suporte formal, sem permitir execução de comandos.
- **Eventos de componente:** mapear controles demonstrativos para destinos declarados, com comportamento apenas no preview e sem efeitos reais.
- **Validação visual:** conferir fidelidade ao design de referência por tela; a existência de um componente JSON não equivale à homologação da interface.

## Critérios de aceite

- Nova jornada criada por `classificacao.jornadas` surge na aba Protótipo após atualização da Store; nenhuma jornada precisa ser registrada no código.
- A sequência exibida usa ocorrências do `flow.editor` e mantém IDs e árvores originais.
- Mudar de jornada, pesquisar e navegar não altera arquivos de catálogo.
- A prévia usa o motor de montagem e não executa backend.
- As limitações de escolha de ramo e regras não executadas são documentadas, nunca apresentadas como resultado de condição verdadeira.

Veja `contratos/08_MIGRACAO_NOMENCLATURA_PROTOTIPO_V5.md` para o mapeamento a partir do legado de simulação.
