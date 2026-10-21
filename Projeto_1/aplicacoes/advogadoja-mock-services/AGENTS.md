# AGENTS.md — Mock Services

## Escopo

Estas regras valem somente para `aplicacoes/advogadoja-mock-services/`.

Este projeto simula a infraestrutura externa usada pelas aplicações reais.

## Não é fonte de verdade do produto

Não criar telas, jornadas ou regras de negócio novas a partir do mock.

O mock implementa contratos e cenários já definidos.

Quando uma necessidade não estiver fechada, registrar pendência em vez de inventar comportamento.

## Estado compartilhado

O ambiente deve suportar múltiplas instâncias/navegadores observando o mesmo estado.

Não usar `localStorage` como fonte de verdade do ambiente.

A persistência definitiva ainda será escolhida por planejamento específico.

## Painel

O painel administrativo do mock deve servir para:

- inspecionar estado;
- editar dados fictícios quando autorizado;
- executar cenários;
- resetar/seedar ambiente;
- simular falhas;
- consultar logs.

Não replicar a UI do Advogado Já dentro do painel.

## Contratos

Os endpoints e eventos devem representar contratos claros e estáveis para React e Flutter.

Ao alterar contrato:

1. auditar consumidores;
2. planejar compatibilidade;
3. atualizar mock;
4. atualizar testes;
5. validar React e Flutter.

Não quebrar contrato silenciosamente.

## Integrações externas

Google Maps pode ser real quando necessário.

Demais integrações externas devem permanecer simuladas até autorização explícita de migração.

Nunca adicionar credenciais reais ao repositório.

## Processo obrigatório

Toda mudança estrutural passa por:

```text
auditoria → plano → validação do plano → execução → validação
```

Para mudanças de persistência/deploy, não executar antes de existir decisão arquitetural explícita.
