'use strict';
// MONTAGEM · editor independente do motor. JSONs são a fonte inicial e o modelo de campos.
(async function main(){
const $=id=>document.getElementById(id);
const isObj=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const clone=v=>structuredClone(v);
const encode=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s??'').toLocaleLowerCase('pt-BR');
const validId=id=>typeof id==='string'&&id.length>0&&id.length<=180&&/^[a-zA-Z0-9_][a-zA-Z0-9_.:/-]*$/.test(id);
const DEFAULT_KEYS=['identidade','classificacao','navegacao','estados','acoes','dados','componentes','estrutura','variantes','interacoes','mocks'];
const STORAGE='advogadoja.montagem.v4.contratos';
async function loadJson(path){const res=await fetch(path,{cache:'no-store'});if(!res.ok)throw Error(path+': HTTP '+res.status);return res.json()}
let data,modelTela,modelComp,rules,seed;
try{[data,modelTela,modelComp,rules]=await Promise.all([loadJson('documento.json'),loadJson('CONFIGURACAO/modelo_tela.json'),loadJson('CONFIGURACAO/modelo_componente.json'),loadJson('CONFIGURACAO/regras_atualizacao.json')]);}
catch(e){$('load-status').textContent='Não foi possível carregar automaticamente os JSONs. Use um servidor HTTP ou clique em Importar JSON para selecionar documento.json.';data={schema:'advogadoja.montagem.catalogo',schemaVersion:'1.0.0',registros:[],telas:{},componentes:{}}; modelTela={blocos:DEFAULT_KEYS,template:{}};modelComp={blocos:['identidade','classificacao','estrutura','estilos','estados','variantes','interacoes','dados','mocks'],template:{}};rules={};}
function normalizedCatalog(x){if(!isObj(x)||!isObj(x.telas))throw Error('documento.json inválido: propriedade telas não encontrada.');
 const out=clone(x);out.registros=Array.isArray(out.registros)?out.registros:[];out.componentes=isObj(out.componentes)?out.componentes:{};
 const entries=Object.entries(out.telas);
 for(const [id,item] of entries){
  if(!validId(id)||!isObj(item))throw Error('Contrato ou ID inválido em telas: '+id);
  if(!isObj(item.tela)){
   if(isObj(item.identidade)){out.telas[id]={tela:{schema:'advogadoja.tela',schemaVersion:'0.3.0',...item},componentes:{}};}
   else throw Error('Tela sem definição em '+id);
  }
  out.telas[id].componentes=isObj(out.telas[id].componentes)?out.telas[id].componentes:{};
  const c=out.telas[id].tela;c.schema||='advogadoja.tela';c.schemaVersion||='0.3.0';
  for(const key of modelTela.blocos||DEFAULT_KEYS)if(!Object.prototype.hasOwnProperty.call(c,key))c[key]=key==='identidade'?{}:{};
  c.classificacao=isObj(c.classificacao)?c.classificacao:{};
  const existing=out.registros.find(r=>r.id===id);
  if(!existing)out.registros.push({id,name:c.identidade?.nomeExibicao||id,group:id.split('.')[0],index:out.registros.length+1,jornadas:[]});
 }
 out.registros=out.registros.filter(r=>Object.prototype.hasOwnProperty.call(out.telas,r.id));out.totalTelas=Object.keys(out.telas).length;
 return out;
}
data=normalizedCatalog(data);seed=clone(data);
function fingerprint(value){let h=2166136261;const str=JSON.stringify(value);for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return String(h>>>0)}
const SOURCE_HASH=fingerprint(seed);
let cacheSaved=null;try{cacheSaved=JSON.parse(localStorage.getItem(STORAGE)||'null')}catch(e){}
if(cacheSaved && cacheSaved.sourceHash===SOURCE_HASH && isObj(cacheSaved.catalogo?.telas)){try{data=normalizedCatalog(cacheSaved.catalogo);$('load-status').textContent='Rascunho local recuperado. Para gravar em arquivo, exporte documento.json.';}catch(e){$('load-status').textContent='Base inicial carregada; rascunho anterior incompatível.'}}
else if(!$('load-status').textContent.includes('Não foi possível'))$('load-status').textContent='Catálogo carregado. Exportações não modificam os arquivos originais.';
let mode='telas',folder='advogado',query='',selected=null,activeBlock='identidade',fileTarget=null,changed=new Set(),alertTimer=null;
function save(){data.totalTelas=Object.keys(data.telas).length;try{localStorage.setItem(STORAGE,JSON.stringify({sourceHash:SOURCE_HASH,catalogo:data}))}catch(e){toast('Armazenamento local cheio. Exporte documento.json para manter uma cópia.',true)}}
function toast(msg,bad=false){let n=$('alert');n.textContent=msg;n.classList.toggle('error',!!bad);n.classList.add('show');clearTimeout(alertTimer);alertTimer=setTimeout(()=>n.classList.remove('show'),6000)}
function download(name,obj){const blob=new Blob([JSON.stringify(obj,null,2)+'\n'],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500)}
function entries(){return Object.entries(mode==='telas'?data.telas:data.componentes)}
function typeContract(id){return mode==='telas'?data.telas[id].tela:data.componentes[id]}
function getFolder(id,obj,kind=mode){const c=kind==='telas'?(obj?.tela||obj):obj;const value=c?.classificacao?.pastaCatalogo;return typeof value==='string'&&value.trim()?value.trim():'Sem pasta';}
function folders(){return [...new Set(entries().map(([id,obj])=>getFolder(id,obj)))].sort((a,b)=>a==='global'?-1:b==='global'?1:a.localeCompare(b,'pt-BR'));}
function allKeys(){const m=mode==='telas'?modelTela:modelComp;const base=m?.blocos||DEFAULT_KEYS;return ['schema','schemaVersion',...base,...Object.keys(typeContract(selected||entries()[0]?.[0])||{}).filter(k=>!['schema','schemaVersion',...base].includes(k)),...(mode==='telas'?['__root']:[])];}
function renderMode(){let tabs=$('entity-tabs');tabs.innerHTML=[['telas','Telas',Object.keys(data.telas).length],['componentes','Componentes',Object.keys(data.componentes).length]].map(([id,label,count])=>`<button class="tab ${mode===id?'active':''}" data-mode="${id}" aria-selected="${mode===id}">${label} <span class="tab-count">${count}</span></button>`).join('');tabs.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;selected=null;activeBlock='identidade';folder=mode==='telas'?'advogado':'global';render()}));}
function renderFolders(){const list=folders();if(!list.includes(folder))folder=list[0]||'Sem pasta';$('tabs').innerHTML=list.map(v=>`<button type="button" class="tab ${v===folder?'active':''}" data-folder="${encode(v)}">${encode(v)} <span class="tab-count">${entries().filter(([id,obj])=>getFolder(id,obj)===v).length}</span></button>`).join('');$('tabs').querySelectorAll('[data-folder]').forEach(b=>b.addEventListener('click',()=>{folder=b.dataset.folder;selected=null;render()}));}
function shown(){return entries().filter(([id,obj])=>getFolder(id,obj)===folder&&(!query||norm([id,typeContract(id)?.identidade?.nomeExibicao,typeContract(id)?.identidade?.nome,getFolder(id,obj)].join(' ')).includes(query)))}
function render(){renderMode();renderFolders();let list=shown();$('total').textContent=Object.keys(data.telas).length;$('components-total').textContent=Object.keys(data.componentes).length;$('completed').textContent=[...changed].filter(id=>id in data.telas).length;
 $('component-add-holder').hidden=mode!=='componentes';$('group-title').textContent=(mode==='telas'?'Telas':'Componentes')+' / '+folder;$('group-description').textContent=`${list.length} ${mode==='telas'?'telas':'componentes'} na pasta selecionada. Pastas independentes da jornada.`;$('shown-count').textContent=list.length+' resultados';
 $('contracts').innerHTML=list.length?list.map(([id,item],i)=>{const c=typeContract(id),name=c?.identidade?.nomeExibicao||c?.identidade?.nome||id;return `<details class="contract" data-id="${encode(id)}" ${selected===id?'open':''}><summary><span class="number">${String(i+1).padStart(3,'0')}</span><span class="contract-main"><div class="contract-id">${encode(id)}</div><div class="contract-name">${encode(name)}</div></span><span class="contract-status"><span class="progress">${changed.has(id)?'alterado':'contrato JSON'}</span><span class="chevron">›</span></span></summary><div class="detail"></div></details>`}).join(''):`<div class="empty">${mode==='componentes'?'Nenhum componente cadastrado nesta pasta. Use “+ Novo componente” ou importe um JSON.':'Nenhuma tela nesta pasta.'}</div>`;
 for(const e of $('contracts').querySelectorAll('details.contract')){
   e.addEventListener('toggle',()=>{if(e.open){selected=e.dataset.id;for(const other of $('contracts').querySelectorAll('details.contract'))if(other!==e)other.open=false;drawEditor(e)}else if(selected===e.dataset.id)selected=null});if(e.open)drawEditor(e);
 }
 const blockSelect=$('block-export'); const original=blockSelect.value;blockSelect.innerHTML=(modelTela.blocos||DEFAULT_KEYS).map(k=>`<option value="${encode(k)}">${encode(k)}</option>`).join('');if([...blockSelect.options].some(o=>o.value===original))blockSelect.value=original;
}
function redrawSame(){const id=selected;render();if(id){const e=[...$('contracts').querySelectorAll('details.contract')].find(x=>x.dataset.id===id);if(e&&!e.open)e.open=true}}
function makeEditor(id){const c=typeContract(id),btns=allKeys().map(k=>`<button class="block-button ${activeBlock===k?'active':''}" data-block="${encode(k)}">${k==='__root'?'componentes (raiz)':encode(k)}<span class="block-ind">${c[k]&&isObj(c[k])&&Object.keys(c[k]).length?'●':'○'}</span></button>`).join('');
 return `<div class="context-chips"><span class="chip">ID: ${encode(id)}</span><span class="chip">Pasta: ${encode(getFolder(id,mode==='telas'?data.telas[id]:data.componentes[id]))}</span><span class="chip">${mode==='telas'?'Tela':'Componente'}</span></div>
 <div class="detail-tools"><button class="btn" data-act="export">Exportar individual</button><button class="btn" data-act="import">Importar individual</button><button class="btn" data-act="preview">Visualizar JSON completo</button></div>
 <div class="rename-box"><strong>Identificador estável</strong><p>Renomear a chave e suas referências estruturadas nos contratos carregados.</p><div class="rename-controls"><input class="id-input" value="${encode(id)}" aria-label="Novo identificador"><button class="btn primary" data-act="rename">Atualizar ID globalmente</button></div></div>
 <div class="editor-grid"><div class="blocknav">${btns}</div><div class="editor"><div class="editor-top"><strong id="block-title">${encode(activeBlock)}</strong><p id="block-description">Edite o JSON deste bloco.</p></div><div class="edit-body"><textarea class="block-text" spellcheck="false"></textarea><div class="edit-actions"><button class="btn primary" data-act="save">Salvar bloco</button><button class="btn" data-act="format">Formatar JSON</button><button class="btn danger" data-act="reset">Restaurar do modelo</button></div><p class="editor-message"></p><div class="note">A edição altera apenas a sessão atual. Exporte <code>documento.json</code> para atualizar o arquivo físico. Use operações de massa para alterações em vários contratos.</div></div></div></div>
 <details class="preview"><summary>JSON completo · ${encode(id)}</summary><pre>${encode(JSON.stringify(mode==='telas'?{schema:'advogadoja.tela',schemaVersion:c.schemaVersion,[id]:Object.fromEntries(Object.entries(c).filter(([k])=>!['schema','schemaVersion'].includes(k))),componentes:data.telas[id].componentes}:{schema:'advogadoja.componente',schemaVersion:c.schemaVersion,[id]:c},null,2))}</pre></details>`}
function drawEditor(e){if(!e||!e.open)return; e.querySelector('.detail').innerHTML=makeEditor(e.dataset.id);for(const b of e.querySelectorAll('[data-block]'))b.addEventListener('click',()=>{activeBlock=b.dataset.block;displayBlock(e)});for(const b of e.querySelectorAll('[data-act]'))b.addEventListener('click',()=>act(b.dataset.act,e));displayBlock(e)}
function displayBlock(e){const id=e.dataset.id,c=typeContract(id),b=activeBlock;const value=b==='__root'?data.telas[id].componentes:c[b];e.querySelector('.block-text').value=JSON.stringify(value===undefined?{}:value,null,2);e.querySelector('#block-title').textContent=b==='__root'?'componentes (raiz)':b;e.querySelector('#block-description').textContent=b==='__root'?'Definições locais de componentes deste contrato.':`Caminho ${mode==='telas'?'tela.':''}${b}. Os atributos internos podem ser ampliados.`;e.querySelectorAll('[data-block]').forEach(x=>x.classList.toggle('active',x.dataset.block===b));const p=e.querySelector('.editor-message');p.textContent='';p.className='editor-message';}
function editorMessage(e,msg,bad=false){const p=e.querySelector('.editor-message');p.textContent=msg;p.className='editor-message '+(bad?'bad':'good');}
function commit(){save();render()}
function escapeRe(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
function changeToken(s,oldId,newId,refField=false,protectedIds=[]){
 if(s===oldId)return newId;
 if(!refField)return s;
 if(protectedIds.some(id=>id!==oldId&&(s===id||s.startsWith(id+'.')||s.includes('.'+id+'.'))))return s;
 if(oldId.length<5||!oldId.includes('.'))return s;
 const r=new RegExp('(^|[^\\p{L}\\p{N}_-])'+escapeRe(oldId)+'(?=$|[^\\p{L}\\p{N}_-])','gu');
 return s.replace(r,(_,prefix)=>prefix+newId);
}
function allDeclaredIds(){const ids=new Set([...Object.keys(data.telas),...Object.keys(data.componentes)]);function collect(obj){if(Array.isArray(obj)){obj.forEach(collect);return;}if(!isObj(obj))return;if(typeof obj.id==='string')ids.add(obj.id);for(const [k,v] of Object.entries(obj))collect(v)}collect(data.telas);collect(data.componentes);return ids;}
function renameId(oldId,newId){
 if(!validId(oldId)||!validId(newId))throw Error('ID inválido. Utilize letras, números, ponto, _ , - , : ou /.');
 if(oldId===newId)throw Error('Novo ID igual ao atual.');
 if(allDeclaredIds().has(newId))throw Error('ID já utilizado: '+newId);
 const protectedIds=Object.keys(data.telas).filter(id=>id!==oldId);
 let count=0;
 function walk(v,key=''){
  if(typeof v==='string'){
    const ref=/^(id|.*Ref|.*Refs|.*Id|.*Ids|.*Chave|.*Key|instanciaRef|componenteRef|origem|destino|caminhoLogico)$/i.test(key);
    const next=changeToken(v,oldId,newId,ref,protectedIds);if(next!==v)count++;return next;
  }
  if(Array.isArray(v))return v.map(x=>walk(x,key));
  if(!isObj(v))return v;
  const result={};for(const [k,item] of Object.entries(v)){
   const nextKey=changeToken(k,oldId,newId,true,protectedIds);if(nextKey!==k)count++;
   if(Object.prototype.hasOwnProperty.call(result,nextKey))throw Error('Colisão ao renomear a chave '+nextKey);
   result[nextKey]=walk(item,k);
  }return result;
 }
 const next=walk(data);if(!count)throw Error('ID não encontrado nas identidades ou referências.');
 data=normalizedCatalog(next);
 if(selected===oldId)selected=newId;
 changed.add(newId);save();render();toast(`ID ${oldId} → ${newId}: ${count} ocorrências modificadas.`);
 return count;
}
function findIdChanges(oldValue,newValue,changes=[]){
 if(Array.isArray(oldValue)&&Array.isArray(newValue)){
  if(oldValue.length===newValue.length)oldValue.forEach((v,i)=>findIdChanges(v,newValue[i],changes));return changes;
 }
 if(!isObj(oldValue)||!isObj(newValue))return changes;
 if(typeof oldValue.id==='string'&&typeof newValue.id==='string'&&oldValue.id!==newValue.id)changes.push([oldValue.id,newValue.id]);
 for(const k of Object.keys(oldValue))if(k in newValue)findIdChanges(oldValue[k],newValue[k],changes);
 return changes;
}
function getScreenItem(id){const c=data.telas[id];return {schema:'advogadoja.tela',schemaVersion:c.tela.schemaVersion||'0.3.0',[id]:Object.fromEntries(Object.entries(c.tela).filter(([k])=>!['schema','schemaVersion'].includes(k))),componentes:c.componentes}}
function getCompItem(id){const c=data.componentes[id];return {schema:'advogadoja.componente',schemaVersion:c.schemaVersion||'1.0.0',[id]:c}}
function act(name,e){const id=e.dataset.id,c=typeContract(id),block=activeBlock;
 try{
  if(name==='export'){download(id+'.json',mode==='telas'?getScreenItem(id):getCompItem(id));return}
  if(name==='import'){fileTarget={id,mode};$('import-input').click();return}
  if(name==='preview'){const p=e.querySelector('details.preview');p.open=!p.open;return}
  if(name==='rename'){renameId(id,e.querySelector('.id-input').value.trim());return}
  const field=e.querySelector('.block-text');
  if(name==='format'||name==='save'){
   let value;try{value=JSON.parse(field.value)}catch(err){throw Error('JSON inválido: '+err.message)}
   if(name==='format'){field.value=JSON.stringify(value,null,2);editorMessage(e,'JSON formatado. Clique em Salvar para aplicar.');return;}
   if((block==='schema'||block==='schemaVersion')&&typeof value!=='string')throw Error('Schema e schemaVersion devem ser textos JSON.');
   if(!['schema','schemaVersion'].includes(block)&&!isObj(value))throw Error('O bloco deve ser um objeto JSON.');
   const old=clone(block==='__root'?data.telas[id].componentes:c[block]);
   if(block==='__root')data.telas[id].componentes=value;else c[block]=value;
   if(block==='identidade'&&mode==='telas'){const rec=data.registros.find(x=>x.id===id);if(rec)rec.name=value.nomeExibicao||value.nome||rec.name;}
   changed.add(id);const differences=findIdChanges(old,value);
   if(differences.length){const pairs=[...new Map(differences).entries()]; for(const [previous,next] of pairs){if(previous!==id)renameId(previous,next);} }
   save();render();toast('Bloco atualizado no contrato da sessão.');return;
  }
  if(name==='reset'){
   const original=(mode==='telas'?seed.telas[id]?.tela:seed.componentes[id]);let baseline=block==='__root'?seed.telas[id]?.componentes:original?.[block];
   if(baseline===undefined)baseline=block==='__root'?{}:(mode==='telas'?modelTela.template?.[block]:modelComp.template?.[block])??{};
   if(!confirm('Restaurar este bloco? As alterações locais dele serão substituídas.'))return;
   if(block==='__root')data.telas[id].componentes=clone(baseline);else c[block]=clone(baseline);
   changed.add(id);commit();toast('Bloco restaurado.');return;
  }
 }catch(err){editorMessage(e,err.message,true);toast(err.message,true)}
}
function merge(base,patch){if(!isObj(base)||!isObj(patch))return clone(patch);const result=clone(base);for(const [k,v] of Object.entries(patch))result[k]=(isObj(v)&&isObj(result[k]))?merge(result[k],v):clone(v);return result;}
function removePatch(target,patch){for(const [k,v] of Object.entries(patch)){if(isObj(v)&&isObj(target?.[k]))removePatch(target[k],v);else if(isObj(target))delete target[k];}}
function importOne(id,obj,partial=false,operation='mesclar',blocked=false){
 if(!validId(id)||!isObj(obj))throw Error('Identidade inválida no pacote: '+id);
 const c=isObj(obj.tela)?obj.tela:obj, defs=isObj(obj.componentes)?obj.componentes:{};
 if(!data.telas[id]){data.telas[id]={tela:{schema:'advogadoja.tela',schemaVersion:'0.3.0',...clone(modelTela.template||{})},componentes:{}};
  data.registros.push({id,name:c.identidade?.nomeExibicao||id,group:id.split('.')[0],index:data.registros.length+1,jornadas:[]});}
 const dest=data.telas[id];if(!partial){dest.tela=clone(c);dest.componentes=clone(defs)}
 else{
  const subset=Object.fromEntries(Object.entries(c).filter(([k])=>!['schema','schemaVersion'].includes(k)));
  if(operation==='mesclar')dest.tela=merge(dest.tela,subset);
  else if(operation==='substituir'){for(const [k,v] of Object.entries(subset))dest.tela[k]=clone(v)}
  else if(operation==='remover')removePatch(dest.tela,subset);
  else throw Error('Operação parcial não suportada: '+operation);
  if(obj.componentes!==undefined){if(operation==='mesclar')dest.componentes=merge(dest.componentes,defs);if(operation==='substituir')dest.componentes=clone(defs);if(operation==='remover')removePatch(dest.componentes,defs)}
 }
 dest.tela.schema||='advogadoja.tela';dest.tela.schemaVersion||='0.3.0';dest.tela.classificacao=isObj(dest.tela.classificacao)?dest.tela.classificacao:{};
 changed.add(id);
 const r=data.registros.find(x=>x.id===id);if(r)r.name=dest.tela.identidade?.nomeExibicao||r.name;
}
function importAny(raw,target=null){
 if(!isObj(raw))throw Error('O arquivo deve conter um objeto JSON.');
 if(raw.schema==='advogadoja.montagem.catalogo'){
   if(target)throw Error('A importação individual não aceita o catálogo inteiro.');
   if(!confirm('Substituir toda a sessão pelo documento.json importado? Exporte uma cópia antes, se necessário.'))return;
   data=normalizedCatalog(raw);changed=new Set();save();render();toast('Catálogo completo importado.');return;
 }
 if(raw.schema==='advogadoja.montagem.atualizacao.estrutura'){
   if(target)throw Error('Operação estrutural não é uma importação individual.');
   if(!confirm('Aplicar atualização estrutural declarada neste JSON a todos os contratos do tipo indicado?'))return;
   applyStructure(raw);return;
 }
 if(raw.schema==='advogadoja.modelo.edicao.tela'||raw.schema==='advogadoja.modelo.edicao.componente'){
   if(target)throw Error('Modelo de edição não é contrato individual.');
   assignModel(raw);return;
 }
 if(isObj(raw.telas)){
   const objects=Object.entries(raw.telas);if(target&&(target.mode!=='telas'||objects.length!==1||objects[0][0]!==target.id))throw Error('A importação individual precisa conter apenas a tela '+target.id);
   const partial=raw.tipoExportacao==='parcial';const op=raw.operacao||'mesclar';
   if(!partial&&!target &&!confirm('Importar '+objects.length+' contratos completos? Os contratos com o mesmo ID serão substituídos.'))return;
   const backup=clone(data);
   try{objects.forEach(([id,item])=>importOne(id,item,partial,op));data=normalizedCatalog(data)}catch(err){data=backup;throw err}
   save();render();toast(`${objects.length} contrato(s) ${partial?'mesclado(s) parcialmente':'importado(s)'}.`);return;
 }
 if(raw.schema==='advogadoja.tela'){
   const ids=Object.keys(raw).filter(k=>!['schema','schemaVersion','componentes'].includes(k));if(ids.length!==1)throw Error('Contrato individual deve conter exatamente uma chave de tela.');
   const id=ids[0];if(target&&(target.mode!=='telas'||target.id!==id))throw Error('ID importado diferente da tela selecionada.');
   const incoming={tela:{schema:raw.schema,schemaVersion:raw.schemaVersion,...raw[id]},componentes:raw.componentes||{}};
   importOne(id,incoming,false);save();render();toast('Tela importada: '+id);return;
 }
 if(raw.schema==='advogadoja.componente'){
   const ids=Object.keys(raw).filter(k=>!['schema','schemaVersion'].includes(k));if(ids.length!==1)throw Error('Componente individual deve conter exatamente uma chave de componente.');
   const id=ids[0];if(target&&(target.mode!=='componentes'||target.id!==id))throw Error('ID importado diferente do componente selecionado.');
   data.componentes[id]=clone(raw[id]);data.componentes[id].schema??=raw.schema;data.componentes[id].schemaVersion??=raw.schemaVersion;changed.add(id);save();render();toast('Componente importado.');return;
 }
 // Pacote legado {id:{tela:{...},componentes:{...}}}.
 const ids=Object.keys(raw);if(ids.length===1&&isObj(raw[ids[0]])&&isObj(raw[ids[0]].tela)){
   if(target&&(target.mode!=='telas'||target.id!==ids[0]))throw Error('ID diferente da tela selecionada.');
   importOne(ids[0],raw[ids[0]],false);save();render();toast('Contrato legado importado.');return;
 }
 if(isObj(raw.componentes)&&!isObj(raw.telas)){
   for(const [id,c] of Object.entries(raw.componentes)){if(!validId(id))throw Error('ID de componente inválido: '+id);data.componentes[id]=clone(c);changed.add(id)}save();render();toast('Componentes importados.');return;
 }
 throw Error('Formato desconhecido. Utilize contrato individual, pacote por tela, catálogo, componente ou atualização estrutural.');
}
function pathArray(path){if(!path||typeof path!=='string'||path.startsWith('.')||path.endsWith('.'))throw Error('Informe um caminho JSON, como classificacao.novoCampo.');const parts=path.split('.');if(parts.some(k=>!k||k==='__proto__'||k==='constructor'||k==='prototype'))throw Error('Caminho inválido.');return parts;}
function readPath(obj,parts){let cur=obj;for(const p of parts){if(!isObj(cur)||!(p in cur))return {exists:false,value:undefined};cur=cur[p]}return {exists:true,value:cur};}
function modifyPath(obj,parts,op,value){let parent=obj;for(const part of parts.slice(0,-1)){
 if(!isObj(parent[part])){if(op==='adicionar')parent[part]={};else return false;}
 parent=parent[part];}
 const k=parts[parts.length-1],exists=Object.prototype.hasOwnProperty.call(parent,k);
 if(op==='adicionar'){if(exists)return false;parent[k]=clone(value);return true;}
 if(op==='transformar'){if(!exists)return false;parent[k]=clone(value);return true;}
 if(op==='remover'){if(!exists)return false;delete parent[k];return true;}
 throw Error('Operação não reconhecida: '+op);
}
function parseStructForm(){const target=$('struct-target').value,op=$('struct-op').value,parts=pathArray($('struct-path').value.trim());
 if(['identidade','schema','schemaVersion'].includes(parts[0])&&parts.length===1&&op==='remover')throw Error('Não é permitido remover o bloco obrigatório '+parts[0]+'.');
 let value=null;if($('struct-value').value.trim()){try{value=JSON.parse($('struct-value').value)}catch(e){throw Error('Valor JSON inválido: '+e.message)}}
 return {schema:'advogadoja.montagem.atualizacao.estrutura',schemaVersion:'1.0.0',alvo:target,operacao:op,caminho:parts.join('.'),valor:value,escopo:'todos'};
}
function targetObjects(def){return def.alvo==='tela'?Object.entries(data.telas).map(([id,x])=>[id,x.tela]):def.alvo==='componente'?Object.entries(data.componentes):(()=>{throw Error('Alvo inválido; use tela ou componente.')})();}
function previewStructure(def){const parts=pathArray(def.caminho),t=targetObjects(def);let count=0;for(const [,obj] of t){const {exists}=readPath(obj,parts);if(def.operacao==='adicionar'?!exists:exists)count++;}return {total:t.length,alteraveis:count};}
function applyStructure(def){const parts=pathArray(def.caminho);if(parts.length===1&&['identidade','schema','schemaVersion'].includes(parts[0])&&def.operacao==='remover')throw Error('Bloco obrigatório não pode ser removido.');
 const targets=targetObjects(def),preview=previewStructure(def);if(!preview.alteraveis){toast('Nenhum contrato precisa dessa atualização.');return}
 const before=clone(data);try{
  for(const [id,obj] of targets)if(modifyPath(obj,parts,def.operacao,def.valor))changed.add(id);
  const m=def.alvo==='tela'?modelTela:modelComp;
  if(!Array.isArray(m.blocos))m.blocos=[];
  if(parts.length===1){if(def.operacao==='adicionar'&&!m.blocos.includes(parts[0]))m.blocos.push(parts[0]);if(def.operacao==='remover')m.blocos=m.blocos.filter(k=>k!==parts[0]);}
  if(!isObj(m.template))m.template={};
  modifyPath(m.template,parts,def.operacao,def.valor);
  if(!isObj(m.atributos))m.atributos={};
  if(def.operacao==='remover')delete m.atributos[def.caminho];else m.atributos[def.caminho]??={tipo:def.valor===null?'null':Array.isArray(def.valor)?'array':typeof def.valor,origem:'atualizacao_estrutural'};
  save();render();$('struct-preview').textContent=`Aplicado em ${preview.alteraveis} de ${preview.total} contratos. Exporte documento.json e o modelo atualizado.`;
  toast(`Estrutura atualizada em ${preview.alteraveis} contratos.`);
 }catch(err){data=before;throw err}
}
function assignModel(raw){if(raw.schema==='advogadoja.modelo.edicao.tela'){modelTela=clone(raw);for(const c of Object.values(data.telas)){for(const key of modelTela.blocos||[])if(!(key in c.tela))c.tela[key]={};}save();render();toast('Modelo de telas carregado. Novos blocos agora aparecem no editor.');}
 else if(raw.schema==='advogadoja.modelo.edicao.componente'){modelComp=clone(raw);for(const c of Object.values(data.componentes))for(const key of modelComp.blocos||[])if(!(key in c))c[key]={};save();render();toast('Modelo de componentes carregado.');}
 else throw Error('Modelo JSON desconhecido.');}
function exportPartial(){const block=$('block-export').value;if(!block)throw Error('Escolha um bloco.');const telas={};for(const [id,obj] of Object.entries(data.telas))telas[id]={tela:{schema:obj.tela.schema,schemaVersion:obj.tela.schemaVersion,[block]:clone(obj.tela[block]??{})}};
 const pack={schema:'advogadoja.pacote.contratos.por.tela',schemaVersion:'1.0.0',tipoExportacao:'parcial',operacao:'mesclar',blocos:[block],totalTelas:Object.keys(telas).length,telas};download('advogadoja_parcial_'+block+'.json',pack);toast('Pacote parcial exportado: '+block);}
function exportAll(){const pack={schema:'advogadoja.pacote.contratos.por.tela',schemaVersion:'1.0.0',totalTelas:Object.keys(data.telas).length,telas:clone(data.telas)};download('advogadoja_telas_completas.json',pack);toast('Pacote completo exportado.');}
function exportIdentities(){download('advogadoja_identidades.json',{schema:'advogadoja.pacote.identidades',schemaVersion:'1.0.0',totalTelas:Object.keys(data.telas).length,telas:Object.fromEntries(Object.entries(data.telas).map(([id,v])=>[id,{identidade:v.tela.identidade,classificacao:{pastaCatalogo:v.tela.classificacao?.pastaCatalogo||null}}]))});}
$('search').addEventListener('input',e=>{query=norm(e.target.value).trim();selected=null;render()});
$('export-all').addEventListener('click',exportAll);$('export-identidades').addEventListener('click',exportIdentities);
$('export-data').addEventListener('click',()=>{download('documento.json',data);toast('Catálogo exportado; substitua manualmente o arquivo de origem.');});
$('export-partial').addEventListener('click',()=>{try{exportPartial()}catch(e){toast(e.message,true)}});
$('import-all').addEventListener('click',()=>{fileTarget=null;$('import-input').click()});
$('import-config').addEventListener('click',()=>$('model-input').click());
$('model-input').addEventListener('change',async e=>{const f=e.target.files?.[0];e.target.value='';if(!f)return;try{assignModel(JSON.parse(await f.text()))}catch(err){toast(err.message,true)}});
$('import-input').addEventListener('change',async e=>{const f=e.target.files?.[0];e.target.value='';if(!f)return;const target=fileTarget;fileTarget=null;try{importAny(JSON.parse(await f.text()),target)}catch(err){toast('Falha de importação: '+err.message,true)}});
$('struct-check').addEventListener('click',()=>{try{const p=previewStructure(parseStructForm());$('struct-preview').textContent=`Prévia: ${p.alteraveis} de ${p.total} contratos afetados. Nenhuma alteração aplicada.`;}catch(e){toast(e.message,true)}});
$('struct-apply').addEventListener('click',()=>{try{const o=parseStructForm(),p=previewStructure(o);if(!p.alteraveis){toast('Nenhum contrato afetado.');return;}if(!confirm(`Aplicar ${o.operacao} em ${p.alteraveis} ${o.alvo}(s)? A atualização altera os contratos carregados.`))return;applyStructure(o);}catch(e){toast(e.message,true)}});
$('export-config').addEventListener('click',()=>download(($('struct-target').value==='tela'?'modelo_tela':'modelo_componente')+'.json',$('struct-target').value==='tela'?modelTela:modelComp));
$('rename-global').addEventListener('click',()=>{try{renameId($('global-old').value.trim(),$('global-new').value.trim())}catch(e){toast(e.message,true)}});
$('add-component').addEventListener('click',()=>{
 let id=prompt('ID único do componente (ex.: menu.drawer.padrao):');if(id===null)return;id=id.trim();if(!validId(id)){toast('ID inválido.',true);return}if(allDeclaredIds().has(id)){toast('ID já utilizado.',true);return}
 const c=clone(modelComp.template||{});c.schema='advogadoja.componente';c.schemaVersion='1.0.0';c.identidade=isObj(c.identidade)?c.identidade:{};c.identidade.id=id;c.identidade.nome=c.identidade.nome||id;c.classificacao=isObj(c.classificacao)?c.classificacao:{};c.classificacao.pastaCatalogo=folder==='Sem pasta'?'global':folder;
 data.componentes[id]=c;changed.add(id);selected=id;save();render();toast('Componente criado. Edite seus blocos e exporte documento.json.');
});
render();
})();
