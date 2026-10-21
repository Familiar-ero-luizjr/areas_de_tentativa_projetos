/* Motor universal V2: dados, validação e estado. Nenhuma definição de tela no JavaScript. */
'use strict';
const LAB_ORIGINAL=JSON.parse(document.getElementById('embedded-data').textContent);
let projeto=structuredClone(LAB_ORIGINAL);
let telaAtual=projeto.inicial,modo='simulador',elementoAtual=null,elementosVisiveis=[],alterado=false;
let runtime={form:{},logs:[],selectedFilter:null};
const $=(sel,root=document)=>root.querySelector(sel);
const $$=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const deepcopy=v=>structuredClone(v);
const textValue=v=>v==null?'':String(v);
const escapeHTML=s=>textValue(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const present=id=>projeto.telas?.[id]&&projeto.telas[id].ativa;
const knownScreen=id=>!!projeto.telas?.[id];
const current=()=>projeto.telas[telaAtual];
function parsePath(obj,path){return String(path).split('.').reduce((o,k)=>o==null?undefined:o[k],obj)}
function putPath(obj,path,val){const parts=path.split('.');let cur=obj;for(const p of parts.slice(0,-1)){if(!plain(cur[p]))cur[p]={};cur=cur[p]}cur[parts.at(-1)]=val}
function evaluate(value,s){
 if(plain(value)){
  if(typeof value.ref==='string')return parsePath(s,value.ref);
  if(Array.isArray(value.partes))return value.partes.map(x=>textValue(evaluate(x,s))).join('');
 }
 return value;
}
function validate(data){
 if(!plain(data)||data.schema!=='advogadoja-laboratorio-telas-v2')throw Error('Contrato V2 necessário. Não importe arquivos do formato V1.');
 if(!plain(data.telas)||!Object.keys(data.telas).length||!plain(data.mocks))throw Error('Projeto deve ter telas e mocks');
 if(!data.telas[data.inicial])throw Error('Tela inicial inexistente');
 let total=0;
 for(const [sid,s] of Object.entries(data.telas)){
  if(!plain(s)||s.id!==sid)throw Error(sid+': ID inconsistente');
  for(const key of ['estrutura','estilos','acoes','interacoes','dados','estados'])if(!plain(s[key]))throw Error(sid+': falta bloco '+key);
  if(!Array.isArray(s.estrutura.fragmentos))throw Error(sid+': fragmentos inválidos');
  const ids=new Set(),frags=new Set();
  function checkNode(node,depth){
   if(depth>40)throw Error(sid+': profundidade máxima de 40');
   if(typeof node==='string'||(plain(node)&&('ref' in node||'partes' in node)))return;
   if(!plain(node)||!node.id||typeof node.tag!=='string'||!/^[a-z][a-z0-9-]*$/i.test(node.tag))throw Error(sid+': nó inválido');
   if(['script','iframe','style','object','embed','link'].includes(node.tag.toLowerCase()))throw Error(sid+': tag não permitida '+node.tag);
   if(ids.has(node.id))throw Error(sid+': ID de elemento repetido '+node.id);
   ids.add(node.id);total++;if(total>25000)throw Error('Limite de elementos excedido');
   if(node.filhos!==undefined&&!Array.isArray(node.filhos))throw Error(sid+': filhos inválidos em '+node.id);
   for(const child of node.filhos||[])checkNode(child,depth+1);
  }
  for(const f of s.estrutura.fragmentos){
   if(!plain(f)||typeof f.id!=='string'||frags.has(f.id)||!Array.isArray(f.arvore)||('template' in f))throw Error(sid+': fragmento inválido ou contém HTML de template');
   frags.add(f.id);for(const n of f.arvore)checkNode(n,0);
  }
  for(const [eid,it] of Object.entries(s.interacoes)){
   if(!ids.has(eid))throw Error(sid+': interação sem elemento '+eid);
   if(!plain(it)||!['click','submit','input','change'].includes(it.evento))throw Error(sid+': evento inválido em '+eid);
   if(it.acaoRef && !(it.acaoRef in s.acoes))throw Error(sid+': ação inexistente '+it.acaoRef);
  }
 }
 return true;
}
function findNode(id){for(const f of current().estrutura.fragmentos){const stack=[...f.arvore];while(stack.length){const n=stack.pop();if(plain(n)&&'tag' in n){if(n.id===id)return n;stack.push(...(n.filhos||[]));}}}return null}
function resolveAction(id,event){let it=current().interacoes[id];if(!it||it.evento!==event)return null;return it.acaoRef?current().acoes[it.acaoRef]:it.acao;}
function note(msg){$('#last-event').textContent=msg;runtime.logs.unshift({momento:new Date().toISOString(),mensagem:msg});runtime.logs.length=Math.min(runtime.logs.length,60);toast(msg)}
let toastTimer=0;function toast(msg){const el=$('#lab-toast');el.textContent=msg;el.classList.add('is-visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('is-visible'),2900)}
function dirty(){alterado=true;$('#save-status').textContent='Alterações não exportadas';$('#save-status').style.color='#986719'}
function downloadText(name,content,mime='application/json'){const blob=new Blob([content],{type:mime+';charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000)}
