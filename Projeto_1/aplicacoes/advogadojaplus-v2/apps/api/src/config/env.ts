import 'dotenv/config';
import { z } from 'zod';
const schema=z.object({
  PORT:z.coerce.number().int().min(1).max(65535).default(4000),
  NODE_ENV:z.enum(['development','production','test']).default('development'),
  DATA_PROVIDER:z.enum(['mock','mongo']).default('mock'),
  MONGODB_URI:z.string().optional(),
  MOCK_DB_FILE:z.string().default('./.local/mock-db.json'),
  SEED_DEMO:z.enum(['true','false']).default('true'),
  WEB_ORIGIN:z.string().url().default('http://localhost:3000'),
  SESSION_TTL_HOURS:z.coerce.number().positive().max(168).default(24)
});
export const env=schema.parse(process.env);
if(env.DATA_PROVIDER==='mock' && env.NODE_ENV==='production')throw new Error('O mock não pode ser habilitado em produção. Configure DATA_PROVIDER=mongo.');
if(env.DATA_PROVIDER==='mongo' && !env.MONGODB_URI)throw new Error('MONGODB_URI obrigatório para DATA_PROVIDER=mongo');
