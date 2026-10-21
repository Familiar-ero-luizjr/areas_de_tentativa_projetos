# Arquitetura da nova aplicação Flutter

## Decisão atual

O Flutter começa sem implementação de interface ou infraestrutura. A limpeza de
`lib/` é intencional e não deve ser revertida por documentação, scripts ou
automação.

## Dependências permitidas

```text
Camada de telas → contratos/interfaces de dados → adaptador mock
```

O contrato não contém dependências de Firebase nem detalhes do mock. A futura
integração Firebase será outro adaptador para os mesmos contratos, preservando a
camada de telas.

## Reserva Firebase

Configurações, Rules, índices e Functions existentes são materiais obsoletos,
guardados apenas como insumo provisório. Eles não são fonte de verdade nem parte
da nova base Flutter: não devem ser inicializados, chamados, copiados ou usados
como requisito até que contratos novos estejam fechados e a fase Firebase seja
explicitamente autorizada.

## Mock independente

`../../advogadoja-mock-services/` continua sendo executável por si só. A cada
feature nova, o contrato vem antes; o mock recebe a implementação e fixtures;
então o Flutter consome o contrato por meio do adaptador mock.

As regras de contribuição estão no `../../AGENTS.md`.
