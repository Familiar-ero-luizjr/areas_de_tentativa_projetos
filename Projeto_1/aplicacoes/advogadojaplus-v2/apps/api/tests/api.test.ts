import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createApp} from '../src/app.js';
import {MockRepository} from '../src/repositories/mock.repository.js';

async function withApp(repo:MockRepository,run:(base:string)=>Promise<void>){
  const server=createApp(repo).listen(0);
  try{const addr=server.address();if(!addr||typeof addr==='string')throw Error('Endereço de teste indisponível');await run(`http://127.0.0.1:${addr.port}/api/v1`);}
  finally{await new Promise<void>((resolve,reject)=>server.close(e=>e?reject(e):resolve()));}
}
const json=(method:string,body:unknown,cookie?:string)=>({method,headers:{'content-type':'application/json',...(cookie?{cookie}:{})},body:JSON.stringify(body)});

test('API completa: cadastro, autenticação, consentimentos, onboarding, home, profissionais e logout',async()=>{
 const repo=new MockRepository();
 await withApp(repo,async(base)=>{
  const registration={name:'Maria Teste',email:'maria.teste@example.test',password:'SenhaSegura!123',role:'cliente',consents:[{document:'termos',version:'1'}]};
  const reg=await fetch(base+'/auth/register',json('POST',registration));assert.equal(reg.status,201);assert.equal((await reg.json()).data.email,registration.email);
  const bad=await fetch(base+'/auth/register',json('POST',registration));assert.equal(bad.status,409);
  const login=await fetch(base+'/auth/login',json('POST',{email:registration.email,password:registration.password}));assert.equal(login.status,200);
  const cookie=login.headers.get('set-cookie')?.split(';')[0];assert.ok(cookie);
  const homeBefore=await fetch(base+'/clients/me/home',{headers:{cookie}});assert.equal(homeBefore.status,200);
  assert.match((await homeBefore.json()).data.greeting,/Maria/);
  const professionals=await fetch(base+'/professionals',{headers:{cookie}});assert.equal(professionals.status,200);
  assert.equal((await professionals.json()).data.length,3);
  const onboarding=await fetch(base+'/onboarding/me',json('PATCH',{location:'Recife',contactPreference:'WhatsApp'},cookie));assert.equal(onboarding.status,200);
  const complete=await fetch(base+'/onboarding/complete',json('POST',{},cookie));assert.equal(complete.status,200);assert.equal((await complete.json()).data.completed,true);
  const consent=await fetch(base+'/consents/me',{headers:{cookie}});assert.equal((await consent.json()).data.length,1);
  const anon=await fetch(base+'/auth/me');assert.equal(anon.status,401);
  const logout=await fetch(base+'/auth/logout',json('POST',{},cookie));assert.equal(logout.status,204);
  assert.equal((await fetch(base+'/auth/me',{headers:{cookie}})).status,401);
  const lawyer=await fetch(base+'/auth/register',json('POST',{...registration,email:'advogado@example.test',role:'advogado'}));assert.equal(lawyer.status,409);
 });
});

test('Mock API persiste coleções em arquivo sem reutilizar dados na camada web',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'advogadoja-mock-test-'));const path=join(dir,'database.json');
 try{
  const repo=new MockRepository(path);
  await withApp(repo,async(base)=>{
   const result=await fetch(base+'/auth/register',json('POST',{name:'Cliente Persistente',email:'persistente@example.test',password:'SenhaSegura!123',role:'cliente',consents:[{document:'termos',version:'1'}]}));
   assert.equal(result.status,201);
  });
  const persisted=JSON.parse(readFileSync(path,'utf8'));
  assert.equal(persisted.schemaVersion,1);
  assert.equal(persisted.accounts.length,1);
  assert.ok(persisted.accounts[0].passwordHash.startsWith('$2'));
  assert.equal(persisted.accounts[0].password,undefined);
  const restart=new MockRepository(path);
  assert.ok(await restart.findAccount('persistente@example.test'));
  assert.equal((await restart.listProfessionals()).length,3);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
