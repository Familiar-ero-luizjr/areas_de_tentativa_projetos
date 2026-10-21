# Aplicações — Advogado Já

Esta pasta contém as **aplicações executáveis reais** do Advogado Já e o ambiente de serviços simulados usado para desenvolvimento e homologação.

Ela não é a área de definição do produto. Jornada, perguntas, banco conceitual e protótipo de baixa fidelidade são fechados antes da implementação aqui.

## O que existe nesta pasta

### `advogadojaplus-v2/`

Implementação real do Advogado Já em **React/Next.js + Node/API + MongoDB**.

Ela representa o mesmo produto, as mesmas jornadas, telas, estados, ações e regras funcionais da implementação Flutter. A diferença é tecnológica, não funcional.

### `flutter/`

Implementação real do mesmo Advogado Já em **Flutter**.

A arquitetura deve usar os padrões próprios do Flutter, sem copiar mecanicamente a estrutura React, mas preservando as mesmas responsabilidades funcionais e bibliotecas transversais equivalentes.

### `advogadoja-mock-services/`

Ambiente externo simulado compartilhado pelas aplicações.

Ele existe para permitir que React e Flutter funcionem de forma real durante desenvolvimento e homologação, sem depender dos serviços externos de produção. Deve expor API/contratos, manter estado compartilhado, disponibilizar dados fictícios e oferecer painel visual de inspeção e controle.

Google Maps pode usar a API real do Google. Os dados de negócio exibidos no mapa, como advogados e coordenadas de cenários de teste, continuam vindo do ambiente simulado.

## Princípio central

**React e Flutter são a mesma aplicação funcional em tecnologias diferentes.**

Portanto:

- mesma jornada;
- mesmas telas aprovadas;
- mesmas ações e destinos;
- mesmos estados observáveis;
- mesmas regras de negócio;
- mesmos contratos funcionais;
- mesma expectativa de comportamento.

Diferenças de framework, navegação, organização de código, renderização e gerenciamento de estado são permitidas quando idiomáticas para a tecnologia.

## Fluxo obrigatório antes de implementar

Nenhuma mudança funcional deve ser implementada diretamente.

O ciclo obrigatório é:

```text
1. Auditar o estado atual
2. Planejar a alteração
3. Validar o plano
4. Executar
5. Validar o resultado
```

A implementação pode ser organizada em lotes de telas, mas cada lote passa pelo ciclo completo antes de qualquer edição estrutural.

## Caminho da tela até as aplicações

```text
Jornada em definição
        ↓
Perguntas, regras e dados fechados
        ↓
Jornada funcional aprovada
        ↓
Protótipo de baixa fidelidade
        ↓
Validação final
        ↓
Planejamento do lote de implementação
        ↓
React + Flutter
        ↓
Integração com Mock Services
        ↓
Homologação funcional
        ↓
Integrações de produção
```

O protótipo de baixa fidelidade é a última etapa de definição. `aplicacoes/` é o início da implementação real.

## Infraestrutura visual transversal

As duas aplicações devem possuir, de forma própria à tecnologia, bibliotecas/componentes reutilizáveis para responsabilidades como:

- loading;
- erro;
- alerta;
- feedback;
- estados vazios;
- formulários;
- modal/dialog;
- layout;
- navegação;
- tema/tokens;
- tratamento de estados comuns.

Essas bibliotecas não definem as telas de negócio. Elas apenas fornecem infraestrutura reutilizável para telas já aprovadas.

## Mock e produção

Durante desenvolvimento, as aplicações podem consumir `advogadoja-mock-services`.

O mock deve permitir cenários compartilhados entre instâncias diferentes da aplicação. Exemplo: Cliente cria uma solicitação em um navegador e Advogado visualiza e aceita em outro.

Por isso, o estado de homologação não pode depender apenas de `localStorage` ou memória isolada de uma aba.

A tecnologia definitiva de persistência e hospedagem do mock ainda será planejada. O requisito já fechado é que o ambiente seja simples de executar/publicar, tenha estado compartilhado, seed/reset e possa simular os serviços externos necessários.

Em produção, a intenção é trocar os adaptadores/integrações simulados pelos serviços reais sem reescrever as telas.

## Documentação operacional

Leia primeiro:

- [AGENTS.md](AGENTS.md)
- [React/Node/Mongo](advogadojaplus-v2/README.md)
- [Flutter](flutter/README.md)
- [Mock Services](advogadoja-mock-services/README.md)
