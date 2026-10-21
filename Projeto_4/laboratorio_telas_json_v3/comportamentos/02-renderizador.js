/* 02 · Motor de elementos JSON -> DOM nativo (não interpreta templates HTML). */
const frame=$('#preview-frame');
const NS_SVG='http://www.w3.org/2000/svg';
const SELECTABLE=new Set(['div','section','button','input','label','a','img','svg','span','strong','small','h1','h2','h3','p','header','form','select','nav','aside','article','i','b','path','option','code']);
function cssText(s){
 const vars=Object.entries(s.estilos.tema||{}).filter(([k])=>/^--[\w-]+$/.test(k)).map(([k,v])=>`${k}:${textValue(v)};`).join('');
 const fragmentStyles=s.estrutura.fragmentos.filter(f=>f.habilitado!==false).map(f=>s.estilos.componentes?.[f.id]||'').join('\n');
 const layout=s.estrutura.layout?.larguraConteudo?`.lab-original-main{width:min(100%,${s.estrutura.layout.larguraConteudo});margin:0 auto;padding:22px 16px 35px;display:grid;gap:12px}.lab-original-header{position:sticky;top:0;z-index:30}.lab-original-main>.lab-fragment{min-width:0}`:'';
 const editorCss=`[data-lab-eid]{cursor:pointer}body.lab-select [data-lab-eid]:hover{outline:2px dotted #2a82ff!important;outline-offset:1px}body.lab-select [data-lab-eid].lab-selected{outline:3px solid #ef9e33!important;outline-offset:2px}body.lab-select a,body.lab-select button{cursor:crosshair}.lab-fragment{min-width:0}#lab-custom-modal{position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;background:#0f243c91;padding:20px}#lab-custom-modal .lab-custom-card{width:min(100%,420px);padding:22px;border-radius:18px;background:#fff;color:#1b3858;box-shadow:0 24px 70px #0b183680;font-family:inherit}#lab-custom-modal h2{font-size:20px;margin:0 0 10px}#lab-custom-modal p{font-size:13px;line-height:1.6}#lab-custom-modal button{background:#122f51;color:#fff;border:0;border-radius:10px;min-height:43px;width:100%;margin-top:9px;font-weight:750;cursor:pointer}`;
 return (s.estilos.baseCss||'')+'\n:root{'+vars+'}\n'+fragmentStyles+'\n'+layout+'\n'+(s.estilos.cssAdicional||'')+'\n'+editorCss;
}
function buildFrameShell(s){
 const style=cssText(s).replace(/<\/style\s*>/ig,'');
 return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+style+'</style></head><body class="'+(modo==='editor'?'lab-select':'')+'"><div id="lab-root"></div></body></html>';
}
function setAttr(el,key,val){
 const low=key.toLowerCase();
 if(low.startsWith('on')||low==='srcdoc'||low==='formaction')return;
 const v=textValue(val);
 if(['href','src','xlink:href'].includes(low)&&/^\s*(javascript:|data:text\/html)/i.test(v))return;
 if(key==='selected'){el.selected=true;return}
 if(key==='checked'){el.checked=true;return}
 if(key==='hidden'){el.hidden=true;return}
 el.setAttribute(key,v);
}
function makeNode(src,doc,s,svgMode=false){
 if(typeof src==='string'||(plain(src)&&!src.tag))return doc.createTextNode(textValue(evaluate(src,s)));
 if(!plain(src)||!src.tag)return doc.createTextNode('');
 const svg=svgMode||src.tag==='svg';
 const el=svg?doc.createElementNS(NS_SVG,src.tag):doc.createElement(src.tag);
 for(const [key,v] of Object.entries(src.atributos||{}))setAttr(el,key,evaluate(v,s));
 el.dataset.labEid=src.id;
 if(src.vinculos?.valor){const key=src.atributos?.id;el.value=Object.prototype.hasOwnProperty.call(runtime.form,key)?runtime.form[key]:textValue(evaluate(src.vinculos.valor,s));}
 if(src.vinculos?.textoPorEstado){const rule=src.vinculos.textoPorEstado;el.textContent=s.estados[rule.estado]?rule.verdadeiro:rule.falso;}
 else for(const child of src.filhos||[])el.appendChild(makeNode(child,doc,s,svg));
 if(src.vinculos?.classePorEstado){const rule=src.vinculos.classePorEstado;el.classList.toggle(rule.quandoFalso,!s.estados[rule.estado]);}
 return el;
}
function mountScreen(doc,s){
 const root=doc.getElementById('lab-root');root.replaceChildren();
 const screen=doc.createElement('section');screen.className='screen active '+(s.estrutura.raiz||'');screen.setAttribute('data-screen-key',s.id);
 const header=doc.createElement('div');header.className='lab-original-header';
 const main=doc.createElement('main');main.className='lab-original-main';
 screen.append(header,main);root.append(screen);
 const slots={header,main};
 for(const slot of s.estrutura.layout?.slots||['header','main','navigation','menu','modal','popup','alert']){
  let dest=slots[slot]||screen;
  for(const f of s.estrutura.fragmentos.filter(f=>f.slot===slot&&f.habilitado!==false).sort((a,b)=>(a.ordem||0)-(b.ordem||0))){
   const wrapper=doc.createElement('div');wrapper.className='lab-fragment';wrapper.setAttribute('data-fragment',f.id);wrapper.setAttribute('data-slot',slot);
   for(const item of f.arvore)wrapper.append(makeNode(item,doc,s));dest.append(wrapper);
  }
 }
}
function registerNodes(doc){
 elementosVisiveis=[];
 for(const node of $$('[data-lab-eid]',doc)){
  const fid=node.closest('[data-fragment]')?.dataset.fragment||'raiz',tag=node.tagName.toLowerCase();
  if(!SELECTABLE.has(tag))continue;
  const id=node.dataset.labEid,label=(node.getAttribute('aria-label')||node.getAttribute('title')||node.getAttribute('placeholder')||((node.children.length===0||tag==='button')?node.textContent.trim():'')||node.getAttribute('id')||tag).replace(/\s+/g,' ').slice(0,57);
  elementosVisiveis.push({id,label,tag:node.tagName,fragment:fid,el:node});
 }
 applyVisualAdjustments(doc);refreshElementList();if(elementoAtual)highlightElement();
}
function applyVisualAdjustments(doc){
 for(const [id,rule] of Object.entries(current().estilos.elementos||{})){
  const el=$$('[data-lab-eid]',doc).find(x=>x.dataset.labEid===id);if(!el)continue;
  for(const [prop,val] of Object.entries(rule.css||{}))if(/^--[a-z-]+$/.test(prop)||/^(color|background|backgroundColor|fontSize|width|height|marginLeft|marginTop|borderRadius|opacity|display|textAlign|padding|position|left|top|right|bottom|flexDirection|justifyContent|alignItems)$/.test(prop)){if(val)el.style[prop]=val;}
  const dx=Number(rule.x)||0,dy=Number(rule.y)||0;
  if(dx||dy)el.style.transform=`translate(${dx}px,${dy}px)`;
 }
}
function frameDocument(){try{return frame.contentDocument}catch{return null}}
function renderCurrent(){
 const s=current();if(!s)return;
 $('#canvas-title').textContent=s.nome;$('#canvas-path').textContent=s.id;renderScreenList();
 frame.onload=()=>{
  const doc=frameDocument();if(!doc)return;
  try{mountScreen(doc,s);registerNodes(doc)}catch(e){console.error(e);toast('Erro na renderização: '+e.message);return}
  for(const evt of ['click','submit','input','change'])doc.addEventListener(evt,handleFrameEvent,true);
 };
 frame.srcdoc=buildFrameShell(s);
}
function handleFrameEvent(e){
 const doc=frameDocument();if(!doc)return;
 if(e.target.closest('#lab-custom-modal'))return;
 const el=e.target.closest('[data-lab-eid]');
 if(modo==='editor'){
  if(e.type!=='click')return;
  e.preventDefault();e.stopPropagation();
  const actionable=e.target.closest('button,a,input,select,textarea,[data-action],[data-goto]');
  const choice=(!e.altKey&&actionable?.dataset.labEid)?actionable:el;
  if(choice)selectElement(choice.dataset.labEid);return;
 }
 if(e.type==='submit')e.preventDefault();
 // Submission and click may refer to different elements; the first configured event wins.
 let target=el;
 while(target){
  const id=target.dataset?.labEid;
  if(id){const action=resolveAction(id,e.type);if(action){
   if(e.type==='click')e.preventDefault();
   e.stopPropagation();executeAction(action,target);return;
  }}
  target=target.parentElement;
 }
 if(e.type==='click'&&el?.closest('a,button'))e.preventDefault();
}
function executeAction(action,target){
 if(!plain(action))return;
 switch(action.tipo){
 case 'navegar':{
  const id=textValue(evaluate(action.destino,current()));
  if(!knownScreen(id)){showPopup('Tela ainda não incorporada','Destino previsto: '+id+'\nImporte a definição JSON para habilitar a navegação.');return;}
  if(!present(id))projeto.telas[id].ativa=true;
  telaAtual=id;elementoAtual=null;runtime.form={};renderCurrent();note('Navegação → '+id);break;
 }
 case 'popup':showPopup(action.titulo||'Pop-up de teste',action.mensagem||'Defina esta ação no Editor.');break;
 case 'mock':applyMock(action.mockId);break;
 case 'alternarEstado':{
  const field=action.campo||'online';putPath(current().estados,field,!parsePath(current().estados,field));updateBindings();note(field+' = '+parsePath(current().estados,field));break;
 }
 case 'menu':{
  const doc=frameDocument();let drawer=$('.prototype-drawer',doc);
  if(drawer){const open=action.modo!=='fechar';drawer.classList.toggle('open',open);drawer.setAttribute('aria-hidden',String(!open));}
  else showPopup('Menu','Não há componente de menu nesta tela.');break;
 }
 case 'selecionarFiltro':{
  const doc=frameDocument(),value=evaluate(action.valor,current());
  $$('[data-filter-type]',doc).forEach(el=>{const v=el.getAttribute('data-filter-type')===value;el.classList.toggle('is-active',v);el.setAttribute('aria-pressed',String(v))});
  runtime.selectedFilter=value;note('Filtro selecionado: '+value);break;
 }
 case 'fecharPopup':closePopup();break;
 case 'vincular':{if(target){runtime.form[action.campo]=target.value;}break;}
 case 'nenhuma':note('Ação desativada');break;
 default:showPopup('Ação não registrada',textValue(action.tipo));
 }
}
function updateBindings(){
 const doc=frameDocument();if(!doc)return;
 for(const f of current().estrutura.fragmentos){const stack=[...f.arvore];while(stack.length){const n=stack.pop();if(!plain(n)||!n.tag)continue;
  const dom=$$('[data-lab-eid]',doc).find(x=>x.dataset.labEid===n.id);
  if(dom&&n.vinculos?.textoPorEstado){const r=n.vinculos.textoPorEstado;dom.textContent=current().estados[r.estado]?r.verdadeiro:r.falso}
  if(dom&&n.vinculos?.classePorEstado){const r=n.vinculos.classePorEstado;dom.classList.toggle(r.quandoFalso,!current().estados[r.estado])}
  stack.push(...(n.filhos||[]));
 }}
}
function applyMock(id='advogado-teste'){
 const m=projeto.mocks[id];if(!m){note('Mock inexistente: '+id);return}
 const doc=frameDocument();for(const [key,val] of Object.entries(m.campos||{})){
  runtime.form[key]=val;
  const field=doc?.getElementById(key);if(field)field.value=val;
 }
 note('Mock aplicado: '+id);
}
function showPopup(title,message){
 const doc=frameDocument();if(!doc)return;
 $('#lab-custom-modal',doc)?.remove();
 const modal=doc.createElement('div');modal.id='lab-custom-modal';
 const card=doc.createElement('div');card.className='lab-custom-card';
 const h=doc.createElement('h2');h.textContent=title;
 const p=doc.createElement('p');p.textContent=message;p.style.whiteSpace='pre-line';
 const close=doc.createElement('button');close.id='lab-modal-close';close.textContent='Fechar';close.onclick=()=>modal.remove();
 card.append(h,p,close);modal.append(card);doc.body.append(modal);note('Pop-up: '+title);
}
function closePopup(){const doc=frameDocument();$('#lab-custom-modal',doc)?.remove();$$('.route-modal',doc).forEach(el=>el.classList.remove('open'))}
function renderScreenList(){
 const nav=$('#screens-nav');nav.replaceChildren();let idx=0;
 for(const [key,s] of Object.entries(projeto.telas)){
  if(!s.ativa)continue;idx++;
  const btn=document.createElement('button');btn.className='screen-choice'+(key===telaAtual?' is-active':'');btn.type='button';
  const ico=document.createElement('span');ico.textContent=String(idx).padStart(2,'0');
  const lbl=document.createElement('div');const t=document.createElement('strong');t.textContent=s.nome;
  const sm=document.createElement('small');sm.textContent=s.id;lbl.append(t,sm);btn.append(ico,lbl);
  btn.onclick=()=>{telaAtual=key;elementoAtual=null;runtime.form={};renderCurrent();loadJSONEditor()};nav.append(btn);
 }
 $('#add-client').hidden=!!projeto.telas['cliente.home_cliente']?.ativa;
}
