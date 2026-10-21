# AdvogadoJá API — Node.js, Express, TypeScript e Mongoose

## Contrato arquitetural

`Next.js → HTTP /api/v1 → Express routes → services → DataRepository → MockRepository | MongoRepository`.
**O navegador nunca importa seeds, adaptadores mock nem drivers MongoDB.** Todas as requisições passam pela mesma API, com o mesmo envelope `{data}` / `{error}` e autenticação por cookie HttpOnly.

## Modo mock (padrão)

1. Copie `.env.example` para `.env` dentro de `apps/api`.
2. Rode `npm install` na raiz do monorepo e `npm run dev:api`.
3. A API criará `apps/api/.local/mock-db.json` (não versionado), com contas, clientes, consentimentos, sessões e profissionais fictícios. Os dados persistem após reiniciar o processo; para resetar, pare a API e apague apenas esse arquivo.
4. Persona fictícia de teste: **maria@exemplo.com** / **MariaTeste!2026**. O seed é aplicado apenas ao mock no ambiente de desenvolvimento; o arquivo persistido armazena somente o hash da senha.

O mock é **um banco local de simulação**, não o próprio MongoDB nem um Atlas emulado. Ele executa as mesmas operações de domínio do repositório Mongo. É adequado a uma instância local de desenvolvimento, não a múltiplos processos ou produção.

## MongoDB Atlas

Configure `DATA_PROVIDER=mongo` e uma `MONGODB_URI` real, apenas no `.env` da API (não em `NEXT_PUBLIC_*`). O `MongoRepository` conecta via Mongoose, utiliza os mesmos métodos de interface, e o cadastro grava usuário/cliente/consentimentos na mesma transação. Atlas replica set é necessário para essa transação.

O modo Mongo **não aplica seeds mock**, não faz fallback silencioso para o mock e não expõe credenciais ao navegador. Ao usar um banco vazio, a listagem de profissionais começará vazia até que existam registros reais. Nunca importar clientes reais para o mock.

## Endpoints incluídos

- `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/me`
- `GET/PATCH /api/v1/clients/me`, `GET/PATCH /api/v1/onboarding/me`, `POST /api/v1/onboarding/complete`
- `GET /api/v1/clients/me/home`, `GET /api/v1/consents/me`, `GET /api/v1/professionals`
- `GET /api/health`

Cadastro e login de advogado, perfil detalhado, solicitações e serviços posteriores à Home continuam indisponíveis. Recuperação de senha social/email também não está implementada; sua tela continua em construção.

## Segurança e limites

Hash bcrypt, token aleatório com hash em persistência, cookie HttpOnly; origem restrita e rate limiting básico. Sessões locais e proteção de cookies usam configuração para **localhost** (`WEB_ORIGIN=http://localhost:3000`). Antes de produção, revisar configuração de domínios, SameSite, CSRF, TLS, rate-limit compartilhado e proteção de dados. Mock nunca em NODE_ENV=production.

## Comandos

```bash
npm install
npm run dev:api
npm run test:api
npm run typecheck:api
```
