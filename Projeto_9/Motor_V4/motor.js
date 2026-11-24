/* AdvogadoJá Motor V4 — serviços compartilhados. Nenhum documento de tela é embutido neste JS. */
(function(global){'use strict';
 const source=new URL(document.currentScript.src), dados=new URL('../Dados_Motor_V4/',source), docs=new URL('../docs/',source);
 const storageKey='advogadoja.motor_v4.documento.v1', selectionKey='advogadoja.motor_v4.selected_screen';
 const volatileStorage=new Map();
 const store={
  getItem(k){try{return global.localStorage.getItem(k)}catch(_){return volatileStorage.get(k)||null}},
  setItem(k,v){volatileStorage.set(k,v);try{global.localStorage.setItem(k,v)}catch(_){}},
  removeItem(k){volatileStorage.delete(k);try{global.localStorage.removeItem(k)}catch(_){}},
 };

 const clone=(v)=>JSON.parse(JSON.stringify(v));
 const str=(v)=>JSON.stringify(v,null,2)+'\n';
 let bootstrap=null,cache=null,origIndex=[],catalog=null,contratos=[];
 async function request(url,type='json'){
  const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw Error('Falha HTTP '+r.status+' em '+url.pathname);
  return type==='text'?r.text():r.json();
 }
 async function load(){
  if(bootstrap)return bootstrap;
  bootstrap=(async()=>{
   const [seed,ind,c,ct]=await Promise.all([
    request(new URL('documento.json',dados)),request(new URL('biblioteca.jsonl',dados),'text'),
    request(new URL('catalogo_jornadas.json',docs)),request(new URL('contratos_minimos.jsonl',dados),'text')]);
   origIndex=parseJsonl(ind);catalog=c;contratos=parseJsonl(ct);
   try{const saved=store.getItem(storageKey);cache=saved?JSON.parse(saved):seed;
       if(!cache||typeof cache.telas!=='object'||typeof cache.componentes!=='object')throw Error('Dados locais inválidos');
   }catch(e){console.warn('Usando documento inicial:',e);cache=seed;}
   return cache;
  })();return bootstrap;
 }
 function parseJsonl(text){return String(text).split(/\r?\n/).filter(Boolean).map((line,i)=>{try{return JSON.parse(line)}catch(e){throw Error('JSONL inválido, linha '+(i+1)+': '+e.message)}})}
 function get(){if(!cache)throw Error('Dados não carregados');return cache;}
 function save(value){validate(value);cache=clone(value);store.setItem(storageKey,JSON.stringify(cache));global.dispatchEvent(new CustomEvent('aj:data-changed',{detail:{}}));return cache;}
 function restore(){store.removeItem(storageKey);store.removeItem(selectionKey);cache=null;bootstrap=null;return load()}
 function pathOf(item){return item?.classificacao?.localizacao?.caminho||''}
 function typeList(db=get()){
  let list=[];for(const [type,key] of [['tela','telas'],['componente','componentes']])for(const [id,item] of Object.entries(db[key]||{})){
   const c=item.classificacao||{},loc=pathOf(item);
   list.push({id,tipo:type,caminho:loc,perfilRef:c.escopo?.perfilRef||'',jornadas:c.jornadas||[],nome:item.identidade?.nomeExibicao||item.identidade?.nome||id,documentoRef:'Dados_Motor_V4/documento.json'});
  }return list.sort((a,b)=>a.caminho.localeCompare(b.caminho,'pt-BR'));
 }
 function validate(db){
  if(!db||typeof db!=='object'||!db.telas||!db.componentes)throw Error('Documento precisa ter telas e componentes.');
  let paths=new Set();
  for(const row of typeList(db)){
   const path=row.caminho;
   if(!path.startsWith('biblioteca/'+(row.tipo==='tela'?'telas':'componentes')+'/')||path.split('/').some(x=>!x||x==='.'||x==='..'))throw Error('Caminho inválido na classificação: '+row.id+' ('+path+')');
   if(paths.has(path))throw Error('Caminho duplicado na Biblioteca: '+path);paths.add(path);
   const d=row.tipo==='tela'?db.telas[row.id]:db.componentes[row.id];
   if(d?.identidade?.id!==row.id)throw Error('Identidade não coincide com a chave: '+row.id);
   if(!Array.isArray(row.jornadas))throw Error('jornadas deve ser um array: '+row.id);
   for(const j of row.jornadas){const source=(catalog?.jornadas||[]).find(t=>t.id===j.jornadaRef);
    if(catalog&&!source)throw Error('Jornada desconhecida: '+j.jornadaRef);
    if(!Array.isArray(j.subjornadasRefs))throw Error('subjornadasRefs deve ser um array em '+row.id);
    for(const sub of j.subjornadasRefs)if(source&&!source.subjornadas.some(s=>s.id===sub))throw Error('Subjornada desconhecida: '+j.jornadaRef+'/'+sub);
   }
  }return true;
 }
 function usedComponents(id,db=get()){
  const screen=db.telas[id];if(!screen)throw Error('Tela não encontrada: '+id);
  const refs=new Set(Object.values(screen.estrutura?.html?.composicao||{}).map(r=>r?.componenteRef).filter(Boolean));
  const components={};for(const ref of refs)if(db.componentes[ref])components[ref]=clone(db.componentes[ref]);
  return {components,missing:[...refs].filter(ref=>!db.componentes[ref])};
 }
 function fullScreen(id,db=get()){
  const screen=db.telas[id];if(!screen)throw Error('Tela não encontrada: '+id);
  return {tela:clone(screen),componentes:usedComponents(id,db).components};
 }
 function selectScreen(id){store.setItem(selectionKey,id);global.dispatchEvent(new CustomEvent('aj:selected-screen',{detail:{id}}))}
 function selectedScreen(db=get()){const stored=store.getItem(selectionKey);return (stored&&db.telas[stored])?stored:(db.telaSelecionada&&db.telas[db.telaSelecionada]?db.telaSelecionada:Object.keys(db.telas)[0]||null)}
 function project(id,config,db=get()){
  const s=db.telas[id];if(!s)throw Error('Tela não encontrada: '+id);
  const t={};for(const key of config.camposTela||[])t[key]=clone(s[key]===undefined?{}:s[key]);
  if(config.incluirComponentes)return {tela:t,componentes:usedComponents(id,db).components};
  return {tipo:config.tipo,status:config.status,tela:t,nota:config.observacao};
 }
 function asJsonl(rows){return rows.map(r=>JSON.stringify(r)).join('\n')+'\n'}
 function filename(id){return String(id||'item').replace(/[^a-zA-Z0-9._-]/g,'_')}
 function download(name,content,mime='application/json;charset=utf-8'){
  const blob=content instanceof Blob?content:new Blob([content],{type:mime});let u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.style.display='none';document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(u);a.remove()},1000);
 }
 function libraryFiles(db=get()){
  validate(db);const files=[],enc=new TextEncoder();
  const add=(name,value)=>{files.push({name,bytes:enc.encode(typeof value==='string'?value:str(value))})};
  add('biblioteca/README.md','# Biblioteca exportada pelo Motor V4\n\nCada tela possui um documento.json completo. Componentes possuem componente.json.\nO índice lista caminhos gerados pela classificação. Os arquivos deste ZIP não fazem parte do código do Motor V4.\n');
  add('biblioteca/indice.jsonl',asJsonl(typeList(db)));
  add('biblioteca/catalogo_jornadas.json',catalog||{jornadas:[]});
  for(const r of typeList(db)){
   if(r.tipo==='tela')add(r.caminho+'/documento.json',fullScreen(r.id,db));
   else add(r.caminho+'/componente.json',db.componentes[r.id]);
  }return files;
 }
 const CRC_TABLE=new Uint32Array(256);for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;CRC_TABLE[i]=c>>>0}
 function crc32(bytes){let c=0xffffffff;for(const b of bytes)c=CRC_TABLE[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0}
 function makeZIP(files){
  const enc=new TextEncoder,locals=[],central=[];let offset=0;const now=new Date(),dosTime=((now.getHours()&31)<<11)|((now.getMinutes()&63)<<5)|((now.getSeconds()/2)&31),dosDate=(((now.getFullYear()-1980)&127)<<9)|(((now.getMonth()+1)&15)<<5)|(now.getDate()&31);
  for(const f of files){const name=enc.encode(f.name),payload=f.bytes,crc=crc32(payload);if(name.length>65535||payload.length>0xffffffff)throw Error('ZIP excede limite.');
   const local=new Uint8Array(30+name.length),v=new DataView(local.buffer);v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint16(8,0,true);v.setUint16(10,dosTime,true);v.setUint16(12,dosDate,true);v.setUint32(14,crc,true);v.setUint32(18,payload.length,true);v.setUint32(22,payload.length,true);v.setUint16(26,name.length,true);local.set(name,30);locals.push(local,payload);
   const cen=new Uint8Array(46+name.length),cv=new DataView(cen.buffer);cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint16(8,0x800,true);cv.setUint16(10,0,true);cv.setUint16(12,dosTime,true);cv.setUint16(14,dosDate,true);cv.setUint32(16,crc,true);cv.setUint32(20,payload.length,true);cv.setUint32(24,payload.length,true);cv.setUint16(28,name.length,true);cv.setUint32(42,offset,true);if(f.isDir)cv.setUint32(38,16<<16,true);cen.set(name,46);central.push(cen);offset+=local.length+payload.length;
  }
  const cdSize=central.reduce((x,v)=>x+v.length,0);if(files.length>65535||offset>0xffffffff||cdSize>0xffffffff)throw Error('ZIP muito grande.');
  const end=new Uint8Array(22),e=new DataView(end.buffer);e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,cdSize,true);e.setUint32(16,offset,true);return new Blob([...locals,...central,end],{type:'application/zip'});
 }
 async function unzip(arrayBuffer){
  const bytes=new Uint8Array(arrayBuffer),v=new DataView(arrayBuffer),dec=new TextDecoder('utf-8');let end=-1;
  for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--)if(v.getUint32(i,true)===0x06054b50){end=i;break}
  if(end<0)throw Error('ZIP inválido.');const n=v.getUint16(end+10,true),offset=v.getUint32(end+16,true);if(n>10000)throw Error('ZIP contém arquivos demais.');let pos=offset,total=0;const result=[];
  for(let i=0;i<n;i++){
   if(pos+46>bytes.length||v.getUint32(pos,true)!==0x02014b50)throw Error('Central do ZIP inválida.');
   const method=v.getUint16(pos+10,true),compressed=v.getUint32(pos+20,true),raw=v.getUint32(pos+24,true),nameLen=v.getUint16(pos+28,true),extraLen=v.getUint16(pos+30,true),commentLen=v.getUint16(pos+32,true),lo=v.getUint32(pos+42,true);
   const name=dec.decode(bytes.subarray(pos+46,pos+46+nameLen)).replace(/\\/g,'/');pos+=46+nameLen+extraLen+commentLen;
   if(name.startsWith('/')||name.split('/').some(s=>s==='..'||s==='.')||name.includes(':'))throw Error('ZIP com caminho inseguro.');
   if(!name||name.endsWith('/'))continue;
   total+=raw;if(raw>15_000_000||total>45_000_000)throw Error('ZIP muito grande.');
   if(v.getUint32(lo,true)!==0x04034b50)throw Error('Entrada local inválida.');const start=lo+30+v.getUint16(lo+26,true)+v.getUint16(lo+28,true),packed=bytes.subarray(start,start+compressed);let uncompressed;
   if(method===0)uncompressed=packed.slice();else if(method===8){if(!global.DecompressionStream)throw Error('Navegador não oferece descompressão ZIP.');const stream=new Blob([packed]).stream().pipeThrough(new DecompressionStream('deflate-raw'));uncompressed=new Uint8Array(await new Response(stream).arrayBuffer())}else throw Error('Método ZIP não suportado: '+method);
   if(uncompressed.length!==raw)throw Error('Entrada ZIP incompleta.');result.push({name,content:dec.decode(uncompressed)});
  }return result;
 }
 function mergeScreenPayload(db,payload,replaceAll=false){
  if(payload.formato==='advogadoja.motor_v4.documento.v1'&&payload.telas&&payload.componentes){
   if(replaceAll){db.telas=clone(payload.telas);db.componentes=clone(payload.componentes)}
   else{Object.assign(db.telas,clone(payload.telas));Object.assign(db.componentes,clone(payload.componentes))}
   return Object.keys(payload.telas).length+Object.keys(payload.componentes).length;
  }
  if(payload.tela?.identidade?.id){const id=payload.tela.identidade.id;db.telas[id]=clone(payload.tela);for(const [ref,c] of Object.entries(payload.componentes||{})){db.componentes[ref]=clone(c)};return 1+Object.keys(payload.componentes||{}).length;}
  if(payload.identidade?.tipo==='tela'&&payload.identidade?.id){db.telas[payload.identidade.id]=clone(payload);return 1;}
  if(payload.identidade?.tipo==='componente'&&payload.identidade?.id){db.componentes[payload.identidade.id]=clone(payload);return 1;}
  throw Error('Arquivo JSON não contém documento reconhecido.');
 }
 function treeIndex(db=get()){
  const root={name:'biblioteca',kind:'folder',children:[]};
  const insert=(row)=>{let cursor=root;const parts=row.caminho.split('/').slice(1);
   for(const part of parts){let c=cursor.children.find(v=>v.name===part);if(!c){c={name:part,kind:'folder',children:[]};cursor.children.push(c)}cursor=c;}
   cursor.children.push({name:row.tipo==='tela'?'documento.json':'componente.json',kind:row.tipo,id:row.id});
  };
  for(const r of typeList(db))insert(r);return root;
 }
 global.AJ={load,get,save,restore,validate,typeList,pathOf,usedComponents,fullScreen,selectedScreen,selectScreen,project,parseJsonl,asJsonl,filename,download,makeZIP,unzip,libraryFiles,treeIndex,mergeScreenPayload,serialize:str,clone,request,
  get indiceInicial(){return origIndex},get catalogo(){return catalog},get contratos(){return contratos},get dadosURL(){return dados}};
})(window);
