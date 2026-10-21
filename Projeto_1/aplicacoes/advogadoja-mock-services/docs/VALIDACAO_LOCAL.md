# Validação local rápida

## 1. Integridade sem instalar dependências

```bash
node scripts/validate-project.mjs
node scripts/validate-imports.mjs
```

## 2. Instalar e validar TypeScript/testes

```bash
npm install
npm run typecheck
npm test
npm run build
```

## 3. Validar integração de verdade

Terminal 1:

```bash
npm run mock:api
```

Terminal 2:

```bash
npm run dev
```

Testes rápidos:

```bash
curl http://localhost:8787/health
curl http://localhost:8787/api/firestore/lawyers
curl -X POST http://localhost:8787/api/functions/adminDashboard \
  -H 'content-type: application/json' \
  -d '{}'
```

## 4. Flutter externo

Em emulador Android, `localhost` aponta para o próprio emulador. Normalmente use `10.0.2.2:8787` para acessar o host. Em dispositivo físico, use o IP local da máquina na mesma rede e libere a porta no firewall se necessário.

Não configure Firebase/Stripe/Maps reais durante este primeiro teste. O objetivo é validar primeiro os contratos e comportamentos.
