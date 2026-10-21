# Registro histórico da versão anterior

Este arquivo descreve decisões da implementação anterior. A nova base Flutter
está limpa; Firebase e Functions não devem ser conectados agora. Veja
`../../AGENTS.md` para as regras atuais.

Esta versão aplica a decisão de reduzir Cloud Functions ao mínimo necessário.

## Removido do runtime

- Firebase App Check e sua flag de ambiente.
- Function `health`.
- Function `updateProfessionalValidation`.
- Function `acceptOfficeInvite`.
- Function `distributeOfficeRequest`.

## Movido para acesso direto protegido por Rules

- validação administrativa de profissional;
- aceite de convite de escritório;
- distribuição de solicitação dentro do escritório;
- aceite de termos já permanecia direto no Firestore.

## Mantido no backend

- `createSubscriptionCheckout` — segredo Stripe;
- `paymentWebhook` — webhook assinado Stripe.

## Segurança

A remoção de Functions não significa remoção de autorização. As invariantes correspondentes foram movidas/reforçadas em `firestore.rules`, e as operações de múltiplos documentos usam transações Firestore.

## Maps

Nenhuma Cloud Function de Maps existe ou deve ser criada apenas para servir o mapa. O consumo deve ser feito diretamente pelo SDK/API oficial quando a funcionalidade de mapa for implementada, com credenciais restritas por plataforma e API.
