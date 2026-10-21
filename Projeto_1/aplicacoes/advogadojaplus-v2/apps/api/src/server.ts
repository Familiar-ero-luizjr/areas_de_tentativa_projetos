import {createRepository} from './config/database.js';import {createApp} from './app.js';import {env} from './config/env.js';
const repo=await createRepository();const server=createApp(repo).listen(env.PORT,()=>console.log(`AdvogadoJá API em http://localhost:${env.PORT} (${env.DATA_PROVIDER})`));
for(const sig of ['SIGINT','SIGTERM'] as const){process.on(sig,()=>server.close(()=>process.exit(0)));}
