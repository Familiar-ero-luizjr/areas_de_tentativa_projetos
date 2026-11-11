(()=>{'use strict';
const $=id=>document.getElementById(id);
const app=$('app'),nav=$('nav'),host=$('frameHost'),notice=$('message');
const frames=new Map(),expanded=new Set(['documento_base','jornadas']);
let modules=[],activeKey='',activeModule='',pendingJourney=null,journeySignature='';
const node=(tag,cls,text)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x};
const currentHash=()=>{try{return decodeURIComponent(location.hash.slice(1))}catch{return ''}};
const encodeRoute=key=>'#'+encodeURIComponent(key);
const isMobile=()=>matchMedia('(max-width:860px)').matches;
const closeMobile=()=>{app.classList.remove('mobile-open');$('menuButton').setAttribute('aria-expanded','false')};
function moduleFor(key){return modules.find(m=>key===m.id||key.startsWith(m.id+':'))}
function childFor(key){const i=key.indexOf(':');return i<0?'':key.slice(i+1)}
function showMessage(title,detail){
 notice.replaceChildren(node('strong','',title),node('span','',detail));notice.hidden=false;
}
function updateContext(){
 const m=moduleFor(activeKey);if(!m)return;
 const id=childFor(activeKey),entry=(m.children||[]).find(c=>c.id===id);
 $('crumb').textContent=m.label+(entry?' / '+entry.label:'');
 $('moduleDescription').textContent=m.description||'';
 const separate=new URL(m.entry,location.href);
 if(m.id==='prototipos'&&id)separate.hash=id;
 $('openSeparate').href=separate.href;
 $('openSeparate').setAttribute('aria-label','Abrir '+m.label+' em página independente');
 document.title='AdvogadoJá · '+(entry?.label||m.label);
}
function renderNav(){
 const term=$('menuSearch').value.toLocaleLowerCase('pt-BR').trim();
 nav.replaceChildren();let count=0;
 for(const m of modules){
  const parentMatches=m.label.toLocaleLowerCase('pt-BR').includes(term);
  const children=(m.children||[]).filter(c=>!term||parentMatches||c.label.toLocaleLowerCase('pt-BR').includes(term));
  if(term&&!parentMatches&&!children.length)continue;
  count++;
  const group=node('div','group'+((expanded.has(m.id)||term)?' open':'')),line=node('div','group-line');
  const main=node('button','nav-link'+(activeKey===m.id?' active':''));main.type='button';
  main.setAttribute('aria-label','Abrir '+m.label);
  main.append(node('span','nav-icon',m.icon),node('span','nav-text',m.label));
  const counter=node('span','count',(m.children||[]).length?String(m.children.length):'');
  main.append(counter);
  main.addEventListener('click',()=>navigate(m.id));
  const toggle=node('button','nav-toggle','⌄');toggle.type='button';
  toggle.setAttribute('aria-label','Expandir ou recolher '+m.label);
  toggle.setAttribute('aria-expanded',String(expanded.has(m.id)));
  toggle.onclick=()=>{expanded.has(m.id)?expanded.delete(m.id):expanded.add(m.id);renderNav()};
  line.append(main,toggle);group.append(line);
  const items=node('div','children');
  for(const c of children){
   const key=m.id+':'+c.id,button=node('button','child'+(activeKey===key?' active':''),c.label);
   button.type='button';button.onclick=()=>navigate(key);items.append(button);
  }
  if(m.dynamic&&!m.children.length)items.append(node('div','empty',frames.has(m.id)?'Lendo jornadas do JSON…':'As jornadas surgirão ao abrir este módulo.'));
  group.append(items);nav.append(group);
 }
 if(!count)nav.append(node('div','empty','Nenhum item encontrado.'));
}
function visibleFrame(moduleId){
 for(const [id,frame] of frames)frame.classList.toggle('active',id===moduleId);
 const f=frames.get(moduleId);
 if(!f||!f.classList.contains('ready'))showMessage('Abrindo '+(modules.find(m=>m.id===moduleId)?.label||'módulo')+'…','A interface será carregada sem duplicar os menus.');
 else notice.hidden=true;
}
function selectTab(doc,selector){const el=doc.querySelector(selector);if(el)el.click()}
function applyRoute(moduleId){
 const f=frames.get(moduleId);if(!f||!f.classList.contains('ready'))return;
 let doc;try{doc=f.contentDocument}catch{return}
 if(!doc)return;
 const id=childFor(activeKey);
 if(moduleId==='banco'&&id)selectTab(doc,'.sidebar [data-view="'+CSS.escape(id)+'"]');
 if(moduleId==='contrato'&&id)selectTab(doc,'#tab-'+CSS.escape(id));
 if(moduleId==='prototipos'&&id)selectTab(doc,'#sidebar [data-lab="'+CSS.escape(id)+'"]');
 if(moduleId==='jornadas'){
  if(id){
   const buttons=[...doc.querySelectorAll('#journeyTabs [data-journey]')];
   const b=buttons.find(btn=>btn.dataset.journey===id);
   if(b){pendingJourney=null;if(!b.classList.contains('active'))b.click()}
   else pendingJourney=id;
  }else pendingJourney=null;
 }
}
function readJourneys(frame){
 let doc;try{doc=frame.contentDocument}catch{return}
 const tabs=doc?.getElementById('journeyTabs');if(!tabs)return;
 const buttons=[...tabs.querySelectorAll('[data-journey]')];
 if(!buttons.length)return;
 const current=buttons.find(b=>b.classList.contains('active'));
 const children=buttons.map(b=>({id:b.dataset.journey,label:b.textContent.trim()}));
 const signature=JSON.stringify(children);
 const m=modules.find(x=>x.id==='jornadas');if(!m)return;
 if(signature!==journeySignature){
  journeySignature=signature;m.children=children;
  renderNav();
 }
 if(pendingJourney){
  const button=buttons.find(b=>b.dataset.journey===pendingJourney);
  if(button){pendingJourney=null;if(!button.classList.contains('active')){button.click();return}}
 }
 // Importações e cliques nas abas do próprio visualizador também atualizam o menu.
 if(activeModule==='jornadas'&&current&&!pendingJourney){
  const key='jornadas:'+current.dataset.journey;
  if(key!==activeKey){
   activeKey=key;
   history.replaceState(null,'',encodeRoute(key));
   updateContext();renderNav();
  }
 }
}
function watchJourneys(frame){
 const doc=frame.contentDocument,tabs=doc?.getElementById('journeyTabs');if(!tabs)return;
 const observer=new MutationObserver(()=>readJourneys(frame));
 observer.observe(tabs,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
 frame.__journeyObserver=observer;
 readJourneys(frame);
}
function embedFrame(frame,moduleId){
 let doc;try{doc=frame.contentDocument}catch(e){showMessage('Não foi possível integrar o módulo',String(e));return}
 if(!doc){showMessage('Não foi possível integrar o módulo','Abra o Workspace por HTTP ou HTTPS.');return}
 doc.documentElement.classList.add('in-workspace');
 doc.documentElement.dataset.ajModule=moduleId;
 const stylesheet=doc.createElement('link');stylesheet.rel='stylesheet';
 stylesheet.href=new URL('workspace/embedded.css',location.href).href;
 let done=false;
 const ready=()=>{if(done)return;done=true;frame.classList.add('ready');if(moduleId==='jornadas')watchJourneys(frame);if(moduleId===activeModule){visibleFrame(moduleId);applyRoute(moduleId)}};
 stylesheet.onload=ready;stylesheet.onerror=ready;doc.head.append(stylesheet);
}
function ensureFrame(m){
 if(frames.has(m.id))return frames.get(m.id);
 const f=node('iframe','module-frame');
 f.title='Módulo '+m.label;
 f.setAttribute('aria-label','Conteúdo do módulo '+m.label);
 f.addEventListener('load',()=>embedFrame(f,m.id));
 frames.set(m.id,f);host.append(f);
 const url=new URL(m.entry,location.href);url.searchParams.set('workspace','1');
 if(m.id==='prototipos'){const lab=childFor(activeKey);if(lab)url.hash=lab}
 f.src=url.href;return f;
}
function navigate(key,updateHash=true){
 const m=moduleFor(key)||modules.find(x=>x.id==='documento_base')||modules[0];
 if(!m)return;
 activeKey=key.startsWith(m.id)?key:m.id;activeModule=m.id;
 if(m.id==='jornadas')pendingJourney=childFor(activeKey)||null;
 expanded.add(m.id);renderNav();updateContext();visibleFrame(m.id);
 ensureFrame(m);
 if(frames.get(m.id).classList.contains('ready')){visibleFrame(m.id);applyRoute(m.id)}
 if(updateHash&&currentHash()!==activeKey)history.pushState(null,'',encodeRoute(activeKey));
 closeMobile();
}
$('menuButton').onclick=()=>{
 if(isMobile()){app.classList.toggle('mobile-open');$('menuButton').setAttribute('aria-expanded',String(app.classList.contains('mobile-open')))}
 else {app.classList.toggle('collapsed');$('menuButton').setAttribute('aria-expanded',String(!app.classList.contains('collapsed')))}
};
$('closeButton').onclick=closeMobile;$('overlay').onclick=closeMobile;
$('menuSearch').oninput=renderNav;
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeMobile()});
window.addEventListener('hashchange',()=>{const key=currentHash();if(key&&key!==activeKey)navigate(key,false)});
window.addEventListener('popstate',()=>{const key=currentHash();if(key&&key!==activeKey)navigate(key,false)});
async function start(){
 try{
  const response=await fetch('workspace/menu.json',{cache:'default'});
  if(!response.ok)throw Error('Não foi possível carregar workspace/menu.json: HTTP '+response.status);
  const config=await response.json();
  if(!Array.isArray(config.modules)||!config.modules.length)throw Error('Configuração de menu inválida.');
  modules=config.modules;
  // O índice dos laboratórios já é JSON. Os perfis de Jornadas NÃO são fixados aqui.
  try{
   const response=await fetch('PROTOTIPO/dados/manifest.json',{cache:'default'});
   if(response.ok){
    const p=await response.json();
    const m=modules.find(x=>x.id==='prototipos');
    if(m&&p.laboratorios)m.children=Object.entries(p.laboratorios).map(([id,lab])=>({id,label:lab.titulo||id}));
   }
  }catch(e){console.warn('Menu de laboratórios: usando configuração local.',e)}
  navigate(currentHash()||'documento_base');
 }catch(error){
  console.error(error);
  showMessage('Erro ao carregar o workspace',error.message+' — sirva a pasta por HTTP/HTTPS.');
 }
}
start();
})();
