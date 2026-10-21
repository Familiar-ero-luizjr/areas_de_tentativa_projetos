# Advogado Já — Mock Services

`advogadoja-mock-services` é o **ambiente externo simulado compartilhado** usado pelas implementações React e Flutter durante desenvolvimento e homologação.

Ele não é a aplicação do usuário e não é um protótipo de tela.

## Objetivo

Permitir que o Advogado Já funcione de forma real sem depender, durante homologação, de toda a infraestrutura externa de produção.

Exemplo de cenário:

1. Cliente abre a aplicação em uma instância;
2. cria uma solicitação;
3. Advogado abre outra instância;
4. a solicitação aparece para ele;
5. ele aceita;
6. Cliente observa a mudança.

Para isso, o mock precisa manter **estado compartilhado** entre instâncias. Não pode depender apenas de `localStorage` ou memória isolada de uma aba.

## Responsabilidades

O ambiente deve evoluir para oferecer:

- API compartilhada;
- persistência própria de homologação;
- contas e usuários fictícios;
- advogados fictícios;
- solicitações e eventos;
- OAB e estados de validação;
- assinaturas e pagamentos simulados;
- notificações;
- dados de localização;
- cenários de sucesso/erro;
- seed/reset;
- logs;
- painel visual para inspeção e controle.

## Painel visual

O painel existe para administrar e observar o ambiente simulado.

Ele pode permitir, por exemplo:

- trocar estado de OAB;
- inspecionar usuários;
- criar/resetar seed;
- mudar estado de pagamento;
- executar cenário de falha;
- visualizar solicitações;
- acompanhar logs.

O painel não substitui a aplicação Cliente/Advogado/Admin.

O ciclo normal do negócio deve ser exercitado pelas aplicações reais sempre que possível.

## Google Maps

Google Maps é uma exceção autorizada de serviço externo durante homologação.

A renderização/API do mapa pode ser real, enquanto os dados de negócio exibidos — por exemplo advogados e coordenadas de teste — continuam vindo do mock.

## Persistência e deploy

O requisito de produto é manter o ambiente simples de executar e, se viável, simples de publicar em infraestrutura como Netlify.

A tecnologia definitiva de persistência ainda **não está decidida**.

Antes de escolhê-la, deve ser feito planejamento considerando:

- estado compartilhado;
- múltiplos navegadores;
- persistência entre reinícios;
- concorrência;
- seed/reset;
- painel;
- logs;
- segurança do ambiente;
- custo e facilidade de deploy.

Não assumir que cache/localStorage resolve estado compartilhado.

## Relação com produção

O mock deve seguir contratos funcionais que possam depois ser atendidos por integrações reais.

Ele não decide como Firebase, Stripe, MongoDB ou Functions serão configurados em produção.

Consulte [AGENTS.md](AGENTS.md) antes de alterar a arquitetura.
