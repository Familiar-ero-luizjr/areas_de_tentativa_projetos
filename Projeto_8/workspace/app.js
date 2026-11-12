/* AdvogadoJá · Navegação única do Projeto 8. Motor de conteúdo permanece em cada módulo. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const app=$('app'),nav=$('nav'),host=$('frameHost'),notice=$('message');
const frames=new Map(),pendingModes=new Map(),expanded=new Set(['documento_base','documento_base:indice']);
let modules=[],activeKey='',activeModule='';
const make=(tag,cls='',txt)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined)x.textContent=txt;return x};
const getHash=()=>{try{return decodeURIComponent(location.hash.slice(1))}catch{return ''}};
const hashFor=key=>'#'+encodeURIComponent(key);
const isMobile=()=>window.matchMedia('(max-width:860px)').matches;
const closeMobile=()=>{app.classList.remove('mobile-open');$('menuButton').setAttribute('aria-expanded','false')};
const moduleFor=key=>modules.find(m=>key===m.id||key.startsWith(m.id+':'));
const itemId=(m,key)=>key===m.id?'':key.slice(m.id.length+1);
const childKey=(m,item)=>m.id+':'+item.id;
const groupLabel={direcao:'Direção geral',contrato_recuperado:'Contrato recuperado',parte1:'Parte I — Contrato JSON',parte2:'Parte II — Front-end dos módulos'};
function findNode(nodes,id,path=[]){
 for(const n of nodes||[]){const next=[...path,n];if(n.id===id)return {item:n,path:next};const nested=findNode(n.children,id,next);if(nested)return nested}
 return null;
}
function activeNode(m,key=activeKey){return findNode(m.children||[],itemId(m,key))}
function showMessage(title,detail){notice.replaceChildren(make('strong','',title),make('span','',detail));notice.hidden=false}
function updateContext(){
 const m=moduleFor(activeKey);if(!m)return;
 const n=activeNode(m)?.item;
 $('crumb').textContent=n?n.label:m.label;
 $('moduleDescription').textContent=m.label+(n?' · '+n.label:'');
 const target=new URL(n?.entry||m.entry,location.href);
 if(!n?.entry&&m.code&&n?.id)target.hash=n.id;
 if(m.id==='documento_base'&&n?.kind==='section')target.hash=n.id;
 $('openSeparate').href=target.href;
 $('openSeparate').setAttribute('aria-label','Abrir '+(n?.label||m.label)+' isoladamente');
 document.title='AdvogadoJá · '+(n?.label||m.label);
}
function filterNode(n,term,all=false){
 if(!term)return n;
 const own=all||n.label.toLocaleLowerCase('pt-BR').includes(term);
 const children=(n.children||[]).map(x=>filterNode(x,term,own)).filter(Boolean);
 return own||children.length?{...n,...(n.children?{children}:{} )}:null;
}
function renderNav(){
 const term=$('menuSearch').value.toLocaleLowerCase('pt-BR').trim();nav.replaceChildren();let shown=0;
 for(const m of modules){
  const match=m.label.toLocaleLowerCase('pt-BR').includes(term);
  const children=(m.children||[]).map(n=>filterNode(n,term,match)).filter(Boolean);
  if(term&&!match&&!children.length)continue;shown++;
  const open=expanded.has(m.id)||!!term;
  const group=make('div','group'+(open?' open':''));
  const line=make('div','group-line');
  const main=make('button','nav-link'+(activeKey===m.id?' active':''));main.type='button';main.setAttribute('aria-label','Abrir '+m.label);
  main.append(make('span','nav-icon',m.icon||'▦'),make('span','nav-text',m.label));
  main.onclick=()=>{expanded.add(m.id);navigate(m.id)};
  const toggle=make('button','nav-toggle','⌄');toggle.type='button';toggle.setAttribute('aria-label','Expandir ou recolher '+m.label);
  toggle.setAttribute('aria-expanded',String(open));
  toggle.onclick=()=>{expanded.has(m.id)?expanded.delete(m.id):expanded.add(m.id);renderNav()};
  line.append(main,toggle);group.append(line);
  const childrenHost=make('div','children');children.forEach(item=>drawNode(childrenHost,m,item,1,!!term));
  group.append(childrenHost);nav.append(group);
 }
 if(!shown)nav.append(make('div','empty','Nenhum item encontrado.'));
}
function drawNode(container,m,n,depth,forceOpen){
 const key=childKey(m,n),hasChildren=Array.isArray(n.children)&&n.children.length>0;
 const open=expanded.has(key)||forceOpen;
 const wrapper=make('div','tree-item'+(hasChildren?' has-children':'')+(open?' expanded':''));
 const row=make('div','tree-line');row.style.paddingLeft=((depth-1)*10)+'px';
 const button=make('button','tree-button'+(activeKey===key?' active':''),n.label);button.type='button';
 button.setAttribute('title',n.label);
 button.setAttribute('aria-current',activeKey===key?'page':'false');
 button.onclick=()=>{
  if(hasChildren)expanded.add(key);
  if(n.kind==='group'){expanded.has(key)&&open?expanded.delete(key):expanded.add(key);renderNav();return}
  navigate(key);
 };
 row.append(button);
 if(hasChildren){
  const toggle=make('button','tree-toggle','⌄');toggle.type='button';toggle.setAttribute('aria-label','Expandir ou recolher '+n.label);
  toggle.setAttribute('aria-expanded',String(open));
  toggle.onclick=()=>{expanded.has(key)?expanded.delete(key):expanded.add(key);renderNav()};
  row.append(toggle);
 }
 wrapper.append(row);
 if(hasChildren){const sub=make('div','tree-children');n.children.forEach(c=>drawNode(sub,m,c,depth+1,forceOpen));wrapper.append(sub)}
 container.append(wrapper);
}
function currentFrame(){const m=moduleFor(activeKey);if(!m)return null;const entry=activeNode(m)?.item?.entry||m.entry;return frames.get(entry)||null}
function showFrame(entry,m){
 for(const [name,f] of frames)f.classList.toggle('active',name===entry);
 const f=frames.get(entry);
 if(!f||!f.classList.contains('ready'))showMessage('Abrindo '+m.label+'…','Carregando o conteúdo selecionado.');
 else notice.hidden=true;
}
function ensureFrame(entry,m){
 if(frames.has(entry))return frames.get(entry);
 const f=make('iframe','module-frame');f.title='Conteúdo: '+m.label;
 f.setAttribute('aria-label','Conteúdo do módulo '+m.label);
 const path=entry;
 f.addEventListener('load',()=>embedFrame(f,m,path));
 frames.set(entry,f);host.append(f);
 const url=new URL(entry,location.href);url.searchParams.set('workspace','1');f.src=url.href;
 return f;
}
function embedFrame(f,m,entry){
 let doc;try{doc=f.contentDocument}catch(error){showMessage('Acesso ao módulo indisponível',String(error));return}
 if(!doc){showMessage('Não foi possível exibir o módulo','Execute o projeto pelo servidor local incluído no ZIP.');return}
 doc.documentElement.classList.add('in-workspace');
 doc.documentElement.dataset.ajModule=m.id;
 doc.documentElement.dataset.ajPage=entry.includes('trabalho_estrutural/index.html')?'work-index':entry.includes('trabalho_estrutural/')?'work-html':'main';
 const style=doc.createElement('link');style.rel='stylesheet';style.href=new URL('workspace/embedded.css',location.href).href;
 let applied=false;
 const ready=()=>{if(applied)return;applied=true;f.classList.add('ready');if(currentFrame()===f){showFrame(entry,m);applyRoute()}};
 style.onload=ready;style.onerror=ready;
 doc.head.append(style);
}
function applyRoute(){
 const m=moduleFor(activeKey);if(!m)return;
 const found=activeNode(m),n=found?.item,entry=n?.entry||m.entry;
 const f=frames.get(entry);if(!f||!f.classList.contains('ready'))return;
 const doc=f.contentDocument;if(!doc)return;
 if(m.id==='documento_base'&&!n?.entry){
  if(n?.kind==='section'){
   const target=doc.getElementById(n.id);
   if(target)target.scrollIntoView({behavior:'instant',block:'start'});
  }else if(n?.kind==='index')doc.getElementById('introducao')?.scrollIntoView({behavior:'instant',block:'start'});
  return;
 }
 if(m.code){
  if(n?.kind!=='mode')return;
  const win=f.contentWindow;
  if(win?.AJWorkspace?.getMode?.()===n.id){pendingModes.delete(m.id);return}
  if(win?.AJWorkspace?.navigate?.(n.id)){pendingModes.delete(m.id);return}
  // O iframe abriu antes da leitura do seu modulo.json: tentar quando o motor avisar que está pronto.
  pendingModes.set(m.id,n.id);
  const button=[...doc.querySelectorAll('#sidebar [data-nav]')].find(el=>el.dataset.nav===n.id);
  if(button){button.click();pendingModes.delete(m.id)}
  return;
 }
 if(m.id==='contrato'&&n){
  const tab=doc.getElementById('tab-'+n.id);
  if(tab&&tab.getAttribute('aria-selected')!=='true')tab.click();
 }
}
function reveal(m,key){expanded.add(m.id);const found=activeNode(m,key);if(found)for(const x of found.path)if(x.children?.length)expanded.add(childKey(m,x))}
function navigate(key,writeHash=true){
 let m=moduleFor(key),resolved=key;
 if(!m){m=modules[0];if(!m)return;resolved=m.id}
 const nested=activeNode(m,resolved);
 if(resolved!==m.id&&!nested){resolved=m.id}
 activeKey=resolved;activeModule=m.id;
 reveal(m,resolved);renderNav();updateContext();
 const entry=activeNode(m)?.item?.entry||m.entry;
 showFrame(entry,m);const f=ensureFrame(entry,m);
 if(f.classList.contains('ready')){showFrame(entry,m);applyRoute()}
 if(writeHash&&getHash()!==activeKey)history.pushState(null,'',hashFor(activeKey));
 closeMobile();
}
function updateDynamicMenu(message){
 const m=modules.find(x=>x.code===message.module);if(!m||!Array.isArray(message.menu))return;
 if(!frames.get(m.entry)||!message.menu.length)return;
 const prev=JSON.stringify(m.children),next=JSON.stringify(message.menu);
 if(prev!==next){m.children=message.menu;renderNav();updateContext()}
 // Quando o JSON do módulo ainda estava carregando, a rota selecionada pode ser aplicada agora.
 if(activeModule===m.id&&currentFrame()?.classList.contains('ready')){
  if(activeKey===m.id){
   const key=childKey(m,{id:message.mode});
   if(activeNode(m,key)){activeKey=key;reveal(m,key);renderNav();updateContext();history.replaceState(null,'',hashFor(key))}
  }
  if(pendingModes.get(m.id)===activeNode(m)?.item?.id){
   pendingModes.delete(m.id);applyRoute();
  }
 }
}
function updateDocumentMenu(message){
 const m=modules.find(x=>x.id==='documento_base');if(!m||!Array.isArray(message.sections))return;
 const index=m.children.find(x=>x.id==='indice');if(!index)return;
 const known=new Map(message.sections.map(s=>[s.id,s]));
 const byGroup=new Map();for(const s of message.sections){if(!byGroup.has(s.group))byGroup.set(s.group,[]);byGroup.get(s.group).push({id:s.id,label:s.title,kind:'section'})}
 index.children=[{id:'introducao',label:'Apresentação',kind:'section'}, ...[...byGroup].map(([group,items])=>({id:'grupo-'+group,label:groupLabel[group]||group,kind:'group',children:items}))];
 renderNav();updateContext();
 if(activeModule==='documento_base'&&activeNode(m)?.item?.kind==='section')applyRoute();
}
window.addEventListener('message',event=>{
 if(event.origin!==location.origin||!event.data||typeof event.data!=='object')return;
 const d=event.data;
 if(d.type==='aj.workspace.module-state'){
  const m=modules.find(x=>x.code===d.module);
  if(m&&frames.get(m.entry)?.contentWindow===event.source)updateDynamicMenu(d);
 }else if(d.type==='aj.workspace.document-state'){
  const m=modules.find(x=>x.id==='documento_base');
  if(m&&frames.get(m.entry)?.contentWindow===event.source)updateDocumentMenu(d);
 }
});
$('menuButton').onclick=()=>{
 if(isMobile()){app.classList.toggle('mobile-open');$('menuButton').setAttribute('aria-expanded',String(app.classList.contains('mobile-open')))}
 else{app.classList.toggle('collapsed');$('menuButton').setAttribute('aria-expanded',String(!app.classList.contains('collapsed')))}
};
$('closeButton').onclick=closeMobile;$('overlay').onclick=closeMobile;
$('menuSearch').oninput=renderNav;
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeMobile()});
window.addEventListener('hashchange',()=>{const key=getHash();if(key!==activeKey)navigate(key||modules[0]?.id,false)});
window.addEventListener('popstate',()=>{const key=getHash();if(key!==activeKey)navigate(key||modules[0]?.id,false)});
async function start(){
 try{
  const response=await fetch('workspace/menu.json');if(!response.ok)throw Error('HTTP '+response.status);
  const config=await response.json();
  if(!Array.isArray(config.modules)||!config.modules.length)throw Error('Configuração de navegação inválida.');
  modules=config.modules;
  navigate(getHash()||'documento_base');
 }catch(error){console.error(error);showMessage('Erro ao carregar o Workspace',error.message+' — abra pelo servidor local.');}
}
start();
})();
