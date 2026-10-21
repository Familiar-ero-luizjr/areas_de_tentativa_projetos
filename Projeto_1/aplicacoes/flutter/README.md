# Advogado Já — Flutter

Esta pasta contém a implementação real do Advogado Já em **Flutter**.

Ela deve representar o mesmo produto funcional de `../advogadojaplus-v2/`. A diferença entre as duas implementações é tecnológica, não de jornada ou regra.

## Papel do Flutter

Telas só entram aqui depois de:

1. definição funcional;
2. fechamento da jornada;
3. validação no protótipo de baixa fidelidade;
4. planejamento técnico do lote.

Não usar o Flutter para resolver decisões de produto ainda abertas.

## Arquitetura desejada

A arquitetura deve ser idiomática para Flutter, sem copiar mecanicamente React.

Ainda assim, deve preservar separações equivalentes, especialmente:

- telas/features;
- navegação;
- tema/tokens;
- componentes reutilizáveis;
- formulários;
- loading;
- erro;
- alerta/feedback;
- modal/dialog;
- empty states;
- contratos de dados;
- serviços/adapters;
- estado da aplicação.

Essas responsabilidades devem ser reutilizáveis e não repetidas em cada tela.

## Dados e integrações

A UI Flutter deve depender de contratos/interfaces próprios da aplicação, evitando dependência direta de Firebase, Mock Services ou outro provedor dentro das telas.

Objetivo:

```text
Tela Flutter → contrato → adapter selecionado
                       ├─ Mock Services
                       └─ Firebase/serviço real
```

Na homologação, o Flutter deve ser capaz de participar dos mesmos cenários compartilhados usados pela aplicação React.

Exemplo: Cliente em uma instância cria uma solicitação; Advogado em outra instância recebe e aceita; ambas observam o mesmo estado.

## Firebase

Firebase é infraestrutura de produção possível para esta implementação, não fonte de verdade da jornada.

Rules, Functions, Auth, Firestore, Storage e demais serviços só devem ser conectados após planejamento específico.

A existência de arquivos antigos de Firebase não autoriza seu uso.

## Equivalência com React

Cada lote deve ser comparado com `../advogadojaplus-v2/` quanto a:

- telas;
- ações;
- destinos;
- estados;
- validações;
- mensagens funcionais;
- dados;
- cenários.

## Processo obrigatório

```text
auditar → planejar → validar plano → executar → validar resultado
```

Consulte [AGENTS.md](AGENTS.md) antes de editar.
