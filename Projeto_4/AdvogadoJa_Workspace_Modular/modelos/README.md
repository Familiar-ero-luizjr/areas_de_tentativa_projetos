# Modelos — contratos de referência

O módulo **não** tem JSON de dados próprio: lê os schemas em `contratos/`, apresenta uma árvore de campos e oferece modelos genéricos. O catálogo mantém a única fonte canônica de tela e componente.

- Schemas `*.proposto.json` são **propostos**, não homologados.
- “Validar meu JSON” verifica um subconjunto documentado de JSON Schema e as validações atuais da Store; não executa Ajv nem regras de negócio.
- “Importar para validar” não altera catálogo nem módulo Contrato.
- Incorporar arquivos reais continua sendo operação do **Catálogo** ou do módulo **Jornadas**.
