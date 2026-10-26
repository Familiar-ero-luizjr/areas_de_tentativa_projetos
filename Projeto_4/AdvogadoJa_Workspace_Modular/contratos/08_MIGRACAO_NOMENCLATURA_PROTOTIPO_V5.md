# Migração de nomenclatura para Protótipo — V5

## Decisão de produto

A antiga aba **Simulação** foi substituída pela aba **Protótipo**, focada em percorrer jornadas e mostrar a prévia real dos JSONs canônicos. Não se trata de alterar toda referência histórica da palavra “simulação”; a diferença técnica entre navegação demonstrativa e execução de regras permanece importante.

| Antes (V3) | Agora (V4/V5) | Observação |
| --- | --- | --- |
| Aba `Motor da simulação` | Aba **Protótipo** (`data-tab=prototipo`) | Interface de demonstração com seleção da jornada e pontos. |
| `motor_simulacao/simulacao.js` | `motor_prototipo/prototipo.js` | Navegação visual; não oferece executor de ações. |
| `motor_simulacao/simulacao.css` | `motor_prototipo/prototipo.css` | Estilização da nova interface. |
| `simWire`, `simRender` | `protWire`, `protRender` | Contrato de interface do módulo. |
| `contratos/04_CONTRATO_MOTOR_SIMULACAO.md` | `contratos/04_CONTRATO_MOTOR_PROTOTIPO.md` | Contrato ativo; o original fica como referência histórica em `verificacao/legado/`. |
| `areas[id=simulacao]` no Contrato | `areas[id=prototipo]` | ID alterado somente no JSON **exclusivo de planejamento**. Não muda IDs de telas. |
| Objetivo `O05: Simulação segura` | `O05: Protótipo navegável e seguro` | Mantém o ID estável `O05`, atualiza o conteúdo. |

## Limites arquiteturais

- **Protótipo:** apresentação linear navegável dos pontos derivados do Flow, com prévias montadas do catálogo. As opções de caminho permanecem não interativas nesta versão.
- **Flow:** organiza ocorrências e branches (`flow.editor`) e edita a árvore. Não persiste uma cópia no protótipo.
- **Montagem:** resolve slots, instâncias, HTML, CSS, estilos e variantes.
- **Ações operacionais:** são declaradas nas telas; entradas derivadas. Botões internos da prévia não executam transações.
- **Contrato:** `modulo_contrato/data/contrato_workspace.json` é a documentação editável de decisões propostas; nenhuma importação deste JSON altera o catálogo.

## Compatibilidade e escopo

- O esquema do documento de planejamento continua `advogadoja.modulo_contrato.v1`. Sua atualização **não** converte arquivos de tela e não muda `identidade.id`.
- O arquivo histórico do contrato de simulação foi transferido para `verificacao/legado/` e não deve ser usado como contrato operacional vigente.
- Os módulos não devem referenciar seletores `simScreen`, `simRun`, `simLog` nem usar `simRender`.
- `mocks` nos JSONs de tela e termos antigos em artefatos de migração são preservados como dados históricos ou preparação técnica, não renomeados automaticamente.
- Uma atualização externa dos JSONs de catálogo exige recarregar a Store para reconstruir os percursos do protótipo.

## Conferências obrigatórias

Executar `python verificacao/auditar_catalogo.py`, `python verificacao/teste_prototipo.py` e `python verificacao/teste_modulo_contrato.py` no ambiente com Playwright/Chromium. Garantir 79 telas, 234 componentes, 197 ocorrências e 33 bifurcações; validar que uma jornada adicionada dinamicamente aparece na lista de perfis e que os controles de navegação funcionam sem alterar o catálogo.
