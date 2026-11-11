# Jornadas — estrutura do Projeto 7

**Estado:** módulo estrutural; visualizador específico ainda não implementado. Não se copiou o código do visualizador do Projeto 8 nem os seus 50 arquivos de tela.

## Responsabilidade

Ler as participações `navegacao.participacoes[]` dos contratos canônicos do catálogo para formar **jornada → subjornada → sequência/ocorrência → tela**. Uma tela pode aparecer em várias jornadas/subjornadas e várias vezes em uma mesma sequência, sem duplicação do JSON de tela.

- Jornada e subjornada: `jornadaRef`, `subjornadaRef`, `jornada`, `subjornada`.
- Ordem e posição: `ordem`, `ocorrencias[].ordem`, `sequenciaRef`, `noOrigemRef`.
- Fluxo associado: `navegacao.saidas[]`, `bifurcacoes[]`, `caminhosLineares[]`.
- Estado/decisão sem tela: usar `estados` ou, quando estritamente necessário, `navegacao.nosContextuais[]`.

Não existe manifesto duplicando cada tela e não foram criadas participações fictícias. A estrutura se apoia no mesmo contrato lido por Master e Flow.

Consulte [estrutura complementar](../biblioteca_telas/ESTRUTURA_FLOW_JORNADAS_V1.md).

**Atenção:** o cadastro de uma estrutura de dados não implica que os motores visuais existentes já estejam adaptados para interpretá-la.
