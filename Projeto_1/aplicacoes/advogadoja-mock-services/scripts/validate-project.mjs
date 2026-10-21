import fs from "node:fs";
import path from "node:path";
const root=process.cwd();
const required=[
  "package.json","vite.config.ts","tsconfig.json","index.html","src/main.tsx","src/App.tsx",
  "src/data/database/db.ts","src/modules/functions/functions.registry.ts","src/scenarios/registry.ts",
  "src/api/node-server.ts","src/api/client.ts","src/chaos/chaos.engine.ts",
  "mock-data/firebase/firestore.json","docs/ARQUITETURA.md","docs/VALIDACAO_LOCAL.md"
];
const missing=required.filter(p=>!fs.existsSync(path.join(root,p)));
if(missing.length){console.error("Arquivos obrigatórios ausentes:",missing);process.exit(1);}
const jsonFiles=[];
const walk=(dir)=>{for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name); if(e.isDirectory()&&e.name!=="node_modules")walk(p); else if(e.isFile()&&p.endsWith(".json"))jsonFiles.push(p);}};
walk(root);
for(const f of jsonFiles){try{JSON.parse(fs.readFileSync(f,"utf8"));}catch(err){console.error("JSON inválido:",path.relative(root,f),err.message);process.exit(1);}}
const registry=fs.readFileSync(path.join(root,"src/modules/functions/functions.registry.ts"),"utf8");
const expected=[
  "acceptContactRequest",
  "acceptOfficeInvite",
  "adminDashboard",
  "adminQueue",
  "closeContactRequest",
  "createContactRequest",
  "createReport",
  "createSubscriptionCheckout",
  "createSupportTicket",
  "declineContactRequest",
  "getPendingOfficeInvite",
  "getReleasedContact",
  "inviteOfficeLawyer",
  "moderateLawyerProfile",
  "paymentWebhook",
  "recordConsent",
  "resolveReport",
  "saveOffice",
  "searchLawyers",
  "submitExperienceReview",
  "submitLawyerOab",
  "submitLawyerProfileForReview",
  "validateOab"
];
const absent=expected.filter(name=>!registry.includes(`  ${name},`));
if(absent.length){console.error("Handlers do inventário não registrados:",absent);process.exit(1);}
console.log(`OK: ${jsonFiles.length} JSONs válidos; ${required.length} arquivos essenciais; ${expected.length} Functions legadas representadas.`);
