# Contrato de componente — PROPOSTA V1

Componentes são registros individuais em `catalogo/componentes/**/*.json`, com IDs estáveis. O mesmo componente pode ser instanciado por várias telas.

| Campo | Responsabilidade |
|---|---|
| `identidade.id`, `nome`, `versao`, `tipo` | Identidade estável |
| `classificacao.localizacaoArvore` | Organização na árvore e no disco |
| `classificacao.escopo`, `jornadas` | Global/local e público previsto |
| `estrutura.formato`, `arvore[]` | Estrutura do componente (HTML modelado em árvore) |
| `estilos.css` | CSS de responsabilidade do componente |
| `interface.propriedadesAceitas` | Props que telas podem fornecer |
| `interface.eventosEmitidos` | Eventos que podem ser associados às ações das telas |

`componentes.instancias[].ref` na tela resolve `identidade.id` do componente. `componentes.instancias[].props` carrega referências aos **dados da própria tela**, não um clone do componente.

Os 9 componentes reutilizáveis existentes foram preservados. Para as 78 telas importadas só com esqueleto, não inventamos um componente de prévia. Completar os componentes reais de forma incremental.

**Pendente:** formalizar contratos de emissão de eventos (nome, payload, tipos, origem), composição/repetição e CSS seguro, incluindo componentes locais que poderão virar globais.

## Complemento V2

A relação entre tela e componente pertence à tela (`componentes.instancias[].ref` e `aplicaA`), nunca ao arquivo do motor ou a uma lista duplicada de telas consumidoras no componente. O componente permanece independente da jornada que o usa: `classificacao.jornadas` no componente é metadado descritivo ou restrição de aplicação, não é fonte para gerar abas de jornada. Metadados de **proveniência de importação** foram movidos para `verificacao/historico_componentes_importados.json`.
