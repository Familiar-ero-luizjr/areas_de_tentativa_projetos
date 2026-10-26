# Módulo Contrato — V1

O módulo `modulo_contrato/` é independente de `catalogo/`. Sua única fonte persistente é `data/contrato_workspace.json`.

O documento tem `schema: advogadoja.modulo_contrato.v1` e serve **para planejamento e homologação**, não para mudar automaticamente o contrato real da Store. Abrir a aba **Contrato** para ler, revisar objetivos, áreas, campos, regras, pendências e decisões; importar, salvar e exportar o JSON exclusivo.

- API local: `GET /api/contrato`, `POST /api/contrato/sync` com `{doc,expected}`. Verifica hash do conteúdo antes de gravar e usa substituição atômica.
- Importação: exige o schema, metadados, objetivos, áreas, decisões e controle; valida IDs únicos. Não aceita pacote `catalogo`. Solicita confirmação antes de substituir o rascunho.
- Exportação: `ADVOGADOJA_CONTRATO_WORKSPACE.json` exporta somente o módulo, não inclui nenhuma tela/componente.
- Edição: formulário por área (incluindo adicionar nova área, descrição, campos, regras, pendências, critérios) e modo JSON integral. Alterações ficam como rascunho na memória até **Salvar no disco**.
- Sem servidor Python (abrindo `index.html` diretamente), permite visualizar o JSON inicial e exportar, mas não salvar; usar `python iniciar.py` para persistência.
- Proteção: verificações de schema, unicidade, paths imutáveis e conflito de versão.

Base de referência: `contratos/00..08_*.md` e o catálogo atual. **Propostas pendentes não são regras homologadas**.

## Área Protótipo (V5)

O documento possui agora a área `prototipo` (substitui `simulacao` no planejamento). **O esquema raiz continua V1**; o servidor continua aceitando `advogadoja.modulo_contrato.v1`. Esta é uma mudança de conteúdo do contrato autônomo, não uma migração dos 79 JSONs de tela. Veja `contratos/04_CONTRATO_MOTOR_PROTOTIPO.md`.
