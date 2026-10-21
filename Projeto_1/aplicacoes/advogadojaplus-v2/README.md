# Advogado Já — React + Node + MongoDB

Esta pasta contém uma implementação real do Advogado Já em **React/Next.js + Node/API + MongoDB**.

Ela não é um protótipo separado. Deve representar o mesmo produto funcional da implementação em `../flutter/`.

## Papel desta implementação

A aplicação deve materializar somente telas e comportamentos já fechados no processo de definição e aprovados no protótipo de baixa fidelidade.

O frontend não deve decidir regras de produto que ainda estejam abertas.

## Arquitetura desejada

A separação existente é intencional e deve continuar clara.

### Web

- `apps/web/src/app`: roteamento Next.js;
- `apps/web/src/views/pages`: telas de negócio;
- `apps/web/src/components`: componentes reutilizáveis;
- `apps/web/src/themes`: tema e tokens;
- `apps/web/src/context`: sessão, jornada, feedback e modais;
- `apps/web/src/providers`: providers globais;
- `apps/web/src/services`: acesso à API;
- `apps/web/src/routes` ou equivalente: contratos de navegação, quando aplicável.

Loading, erro, alerta, feedback, formulários, modais, estados vazios e elementos comuns devem permanecer separados das telas de negócio.

### API

- `apps/api/src/routes`: contratos HTTP;
- `apps/api/src/controllers`: adaptação HTTP;
- `apps/api/src/services`: regras de negócio;
- `apps/api/src/repositories`: fronteira de persistência;
- `apps/api/src/models`: modelos/schema;
- `apps/api/src/schemas`: validação de entrada.

Evitar misturar regras de negócio em controllers ou componentes React.

## Persistência

A implementação React/Node pode usar MongoDB como infraestrutura real.

Durante homologação, também pode consumir o ambiente compartilhado em `../advogadoja-mock-services/` conforme o plano técnico do lote.

A escolha de mock ou serviço real deve acontecer por configuração/adaptador, não por duplicação de telas.

## Equivalência com Flutter

Para cada lote aprovado, comparar explicitamente com `../flutter/`:

- telas;
- ações;
- navegação;
- estados;
- validações;
- mensagens funcionais;
- dados;
- cenários de sucesso e erro.

A equivalência é funcional, não uma exigência de código idêntico.

## Processo obrigatório

Antes de implementar:

```text
auditar → planejar → validar plano → executar → validar resultado
```

Consulte [AGENTS.md](AGENTS.md) antes de editar este projeto.
