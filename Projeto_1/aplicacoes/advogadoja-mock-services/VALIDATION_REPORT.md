# Relatório de revisão e validação

## Correções aplicadas

- corrigida a estrutura do componente `TreeNode`, que estava fora da pasta esperada pelo import;
- corrigida a modelagem interna do banco para aceitar datasets planejados que vieram como arrays e também como objetos agrupados;
- normalizados esses objetos agrupados para coleções mutáveis em memória, mantendo os arquivos de referência originais intactos em `mock-data/reference-planned-data`;
- corrigidos tipos dos handlers heterogêneos;
- removido o `package-lock.json` artificial: `npm install` deve gerar um lock real na máquina de validação;
- adicionados tipos/configuração para Node e `tsx`;
- adicionado servidor HTTP mock real (`src/api/node-server.ts`) para que painel React e aplicativo Flutter externo possam usar o mesmo estado;
- adicionado cliente HTTP do painel React (`src/api/client.ts`);
- páginas principais deixaram de ser apenas demonstrativas e passaram a consultar/controlar a Mock API;
- modo caos passou a afetar Firestore, Auth, Stripe, Maps e Functions, incluindo timeout;
- cenários de onboarding, OAB, solicitações e assinatura agora alteram efetivamente o estado;
- adicionados smoke tests rápidos e validador de imports relativos.

## Validações executadas neste ambiente

- `node scripts/validate-project.mjs`: **OK**;
- `node scripts/validate-imports.mjs`: **OK**;
- todos os JSONs do pacote foram parseados: **OK**;
- TypeScript da aplicação React foi verificado estaticamente com declarações temporárias equivalentes às dependências: **OK**;
- TypeScript do servidor Node foi verificado estaticamente com declarações temporárias mínimas de Node: **OK**;
- núcleo de dados + registry de handlers foi transpilado com `tsc`: **OK**;
- os **23 handlers** mapeados foram executados com entradas de smoke: **OK**;
- os **18 cenários** registrados foram executados: **OK**.

## O que não foi executado aqui

A instalação de pacotes via `npm install` não terminou neste ambiente por indisponibilidade/timeout de rede para o registry. Por isso, o build Vite real e o Vitest devem ser executados na máquina externa após a instalação. O pacote foi preparado justamente para essa validação ser curta.

## Sequência curta recomendada

```bash
npm install
npm run validate
npm run validate:imports
npm run typecheck
npm run smoke
npm test
npm run build
```

Depois, para integração:

Terminal 1:

```bash
npm run mock:api
```

Terminal 2:

```bash
npm run dev
```

Terminal 3 (opcional):

```bash
npm run smoke:api
```
