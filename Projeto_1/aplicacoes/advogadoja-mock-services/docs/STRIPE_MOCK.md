# Stripe mock

Checkout retorna URL fictícia `https://mock.stripe.local/...`.
Webhooks são processados localmente e atualizam `paymentEvents` / `subscriptions`.
Nenhum segredo ou chamada real da Stripe é usado.
