import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const required = [
  'apps/web/src/app',
  'apps/web/src/views/pages',
  'apps/web/src/components',
  'apps/web/src/services/http-client.ts',
  'apps/api/src/routes/index.ts',
  'apps/api/src/repositories/contracts.ts',
];
const forbidden = [
  'apps/web/src/pages',
  'apps/web/src/screens',
];

const missing = required.filter((path) => !existsSync(join(root, path)));
const unexpected = forbidden.filter((path) => existsSync(join(root, path)));
if (missing.length || unexpected.length) {
  if (missing.length) console.error(`Estrutura ausente: ${missing.join(', ')}`);
  if (unexpected.length) console.error(`Estrutura duplicada: ${unexpected.join(', ')}`);
  process.exitCode = 1;
} else {
  console.log('Estrutura do monorepo validada.');
}
