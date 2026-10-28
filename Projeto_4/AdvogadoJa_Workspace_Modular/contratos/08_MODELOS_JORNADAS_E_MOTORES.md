# Contrato proposto — Modelos, intercâmbio de Jornadas e motores

Status: **proposta de implementação**, sem homologação automática de regras de negócio. Base: `PLANO_UNICO_WORKSPACE_ADVOGADOJA_MODELOS_JORNADAS_MOTORES_V1.md`.

## Responsabilidades

- `modelos/`: explica estruturas e campos; depende dos schemas de `contratos/`; não possui Store paralela.
- `jornadas/intercambio.js`: exporta uma projeção da jornada da Store. Dois modos: `referencias` (somente IDs, para conferência) e `completo` (documentos canônicos de telas e componentes dependentes).
- Ao importar um pacote completo: verifica schema, versão, ID da jornada, identidades de telas/componentes, duplicações, participação de cada tela na jornada e componentes referenciados. Mostra registros novos, iguais e divergentes. Divergências só são substituídas quando o usuário assinala cada uma; componentes ausentes bloqueiam incorporação.
- A confirmação atualiza os registros individuais em memória e solicita persistência pelo serviço existente; conflito de versão no disco continua protegido pela API. O resultado é conferido pelo indicador de gravação. Não se cria arquivo `jornada_master.json`.
- `flow.editor` pertence aos JSONs de telas e não é reconstruído com IDs fictícios; saídas pertencem às telas de origem, entradas derivadas.
- Cada motor só interpreta os campos que consome. Modelos e Jornada não alteram os motores de negócio.

## Limites

- Modo referências não escreve na Store.
- A validação de Modelos é parcial (subset de JSON Schema), não equivale a homologação.
- Não há escolha condicional interativa de branches do Protótipo nem recarregamento contínuo de mudanças externas.
- Mudanças no disco requerem recarga; servidor local deve estar disponível para persistência.
