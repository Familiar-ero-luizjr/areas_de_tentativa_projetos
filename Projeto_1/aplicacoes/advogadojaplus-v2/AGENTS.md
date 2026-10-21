# AGENTS.md — React + Node + MongoDB

## Escopo

Estas regras valem somente para `aplicacoes/advogadojaplus-v2/`.

Esta é uma implementação real do Advogado Já e deve permanecer funcionalmente equivalente ao Flutter.

## Antes de editar

Para qualquer lote ou mudança relevante:

1. auditar a estrutura e o comportamento existentes;
2. identificar arquivos realmente afetados;
3. verificar componentes e serviços reutilizáveis;
4. definir plano técnico;
5. validar o plano contra a jornada/protótipo aprovados;
6. somente então editar.

## Frontend

Manter separação entre:

- telas de negócio;
- componentes reutilizáveis;
- formulários;
- feedback;
- modais;
- estados comuns;
- layout;
- tema/tokens;
- contexto/providers;
- serviços de API.

Não colocar chamadas HTTP diretamente em componentes de apresentação quando já existir ou couber uma camada de serviço.

Não duplicar loading, alerta, erro ou empty state em cada tela se a responsabilidade puder ser centralizada.

## Backend

Manter responsabilidades separadas:

```text
route → controller → service → repository → provider/persistência
```

- route define entrada HTTP;
- controller traduz HTTP;
- service contém regra de negócio;
- repository define acesso a dados;
- provider implementa mock/Mongo ou outra infraestrutura autorizada.

Não pular camadas sem motivo documentado.

## Regras de produto

Não inventar regra para completar endpoint ou tela.

Se a jornada/protótipo não definir o comportamento necessário, interromper a implementação desse ponto e registrar a pendência.

## Equivalência

Ao finalizar um lote, validar o mesmo comportamento esperado no Flutter.

Diferenças visuais ou técnicas só são aceitáveis quando decorrem do framework e não alteram o produto.

## Mock e produção

Não acoplar a UI a MongoDB ou ao Mock Services.

O frontend consome contratos/API.

A API pode selecionar provedores conforme configuração e plano aprovado.

Nunca expor segredo de servidor em variáveis públicas do frontend.
