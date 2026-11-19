/* Motor da Galeria AdvogadoJá — fonte da coleção: data/documento.json. */

(()=>{'use strict';
const $=id=>document.getElementById(id), esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const deep=v=>JSON.parse(JSON.stringify(v));
const FRAME_RUNTIME = "'use strict';\n(function(){\n  const info=JSON.parse(document.getElementById('view-data').textContent);\n  const mount=document.getElementById('app-root');\n  const warning=document.getElementById('warnings');\n  const notification=document.getElementById('navigation-tip');\n  const composition=info.estrutura?.html?.composicao||{};\n  const definitions=info.definicoes||{};\n  const instances=info.instancias||{};\n  const warnings=[];\n  const perInstance=new Map();\n  const allElements=new Map();\n  const instanceRoots=new Map();\n  const stateByInstance=new Map();\n  const voids=new Set(['input','img','hr','br','meta','link','area','source','wbr']);\n  const deny=new Set(['script','iframe','object','embed','meta','link','base','form','style']);\n  const svgTags=new Set(['svg','g','path','circle','rect','line','ellipse','polyline','polygon','text','tspan','defs','clipPath','mask','linearGradient','radialGradient','stop','use','symbol']);\n  const $=s=>document.querySelector(s);\n  function showMessage(s){notification.hidden=false;notification.textContent=s;clearTimeout(window.__notice);window.__notice=setTimeout(()=>notification.hidden=true,3400)}\n  function createTree(def,inst){\n    const html=def?.estrutura?.html||{}, entries=Object.entries(html.elementos||{});\n    const children=new Map(), byKey=new Map(entries), registry=new Map();\n    for(const [id,data] of entries){const parent=data?.paiRef;if(parent&&byKey.has(parent)&&parent!==id){if(!children.has(parent))children.set(parent,[]);children.get(parent).push([id,data]);}}\n    for(const list of children.values())list.sort((a,b)=>(Number(a[1].ordem)||0)-(Number(b[1].ordem)||0));\n    const recursing=new Set();\n    function build(id,svg=false){\n      if(recursing.has(id))throw Error('Ciclo em elemento '+id+' / '+inst);\n      recursing.add(id);\n      const data=byKey.get(id)||{},tag=String(data.tag||'div');let el;\n      if(tag==='#text')el=document.createTextNode(String(data.texto??''));\n      else if(!/^[a-z][\\w:-]*$/i.test(tag)||deny.has(tag.toLowerCase()))el=document.createTextNode('');\n      else{\n        const isSvg=svg||svgTags.has(tag);el=isSvg?document.createElementNS('http://www.w3.org/2000/svg',tag):document.createElement(tag);\n        const attrs=data.atributos||{};\n        const pairs=Array.isArray(attrs)?attrs.map(a=>[a.nome,a.valor]):Object.entries(attrs);\n        for(const [k,value] of pairs){\n          const key=String(k),v=String(value??'');\n          if(!/^[a-z_:][\\w:.-]*$/i.test(key)||/^on/i.test(key)||['srcdoc','is'].includes(key.toLowerCase()))continue;\n          if(['href','src','xlink:href','action','formaction'].includes(key.toLowerCase())&&/^(javascript|data:text\\/html):/i.test(v.trim()))continue;\n          try{el.setAttribute(key,v)}catch(e){}\n        }\n        if(typeof data.texto==='string'&&data.texto)el.appendChild(document.createTextNode(data.texto));\n        if(!voids.has(tag.toLowerCase()))for(const [child] of children.get(id)||[])el.appendChild(build(child,isSvg));\n      }\n      if(el.nodeType===1)el.__instanceOrder=Number(data.ordem)||0;\n      registry.set(id,el);\n      if(!allElements.has(id))allElements.set(id,el);\n      recursing.delete(id);return el;\n    }\n    const rootRef=html.raizRef;\n    const top=entries.filter(([id,d])=>!d.paiRef||!byKey.has(d.paiRef)||id===d.paiRef);\n    top.sort((a,b)=>(a[0]===rootRef?-1:b[0]===rootRef?1:(Number(a[1].ordem)||0)-(Number(b[1].ordem)||0)));\n    const nodes=top.map(([id])=>build(id));\n    if(!nodes.length)warnings.push('Sem elementos: '+inst+' / '+(def?.identidade?.id||'?'));\n    perInstance.set(inst,registry);\n    instanceRoots.set(inst,nodes);\n    return nodes;\n  }\n  function baseStates(inst){const axes=definitions[instances[inst]]?.estados||{};const selected=composition[inst]?.estados||{};const result={};\n    for(const [axis,details] of Object.entries(axes)){const choice=selected[axis]??details.inicial; if(details.opcoes?.[choice])result[axis]=choice;else warnings.push('Estado desconhecido em '+inst+': '+axis+'/'+choice);}\n    return result;\n  }\n  function applyStates(inst){const def=definitions[instances[inst]];const axes=def?.estados||{};const elements=perInstance.get(inst)||new Map();const options=stateByInstance.get(inst)||{};\n    const affected=new Set();for(const axis of Object.values(axes))for(const option of Object.values(axis.opcoes||{}))for(const ref of Object.keys(option.elementos||{}))affected.add(ref);\n    for(const ref of affected){const el=elements.get(ref);if(!el||el.nodeType!==1)continue;if(!el.__visualBase){el.__visualBase={attrs:Array.from(el.attributes).map(a=>[a.name,a.value]),text:el.textContent}};\n      const base=el.__visualBase;for(const a of Array.from(el.attributes))el.removeAttribute(a.name);for(const [k,v] of base.attrs)el.setAttribute(k,v);if(!el.childElementCount)el.textContent=base.text;\n    }\n    for(const [axis,details] of Object.entries(axes)){\n      const selection=options[axis]??details.inicial;const option=details.opcoes?.[selection];if(!option)continue;\n      for(const [ref,mod] of Object.entries(option.elementos||{})){\n        const el=elements.get(ref);if(!el||el.nodeType!==1){warnings.push('Estado '+axis+' não encontra elemento '+ref);continue;}\n        if(mod.classesAdicionar)for(const n of mod.classesAdicionar)el.classList.add(n);\n        if(mod.classesRemover)for(const n of mod.classesRemover)el.classList.remove(n);\n        for(const [k,v] of Object.entries(mod.atributos||{})){if(/^on/i.test(k))continue;if(v==null)el.removeAttribute(k);else el.setAttribute(k,String(v));}\n        if(mod.texto!==undefined)el.textContent=String(mod.texto);\n        if(mod.visivel!==undefined)el.hidden=!mod.visivel;\n      }\n    }\n  }\n  function setVisualState(inst,axis,value){const config=definitions[instances[inst]]?.estados?.[axis];if(!config?.opcoes?.[value])return false;\n    stateByInstance.set(inst,{...(stateByInstance.get(inst)||{}),[axis]:value});applyStates(inst);return true;}\n  try{\n    const allStyles=[`:root{${Object.entries(info.estrutura?.css?.tokens||{}).map(([k,v])=>k+':'+v+';').join('')}}`,...Object.values(info.estrutura?.css?.regras||{})];\n    const items=Object.entries(instances).map(([inst,ref],i)=>({inst,ref,index:i,order:Number(composition[inst]?.ordem)||0}));\n    for(const item of items){const def=definitions[item.ref];if(!def){warnings.push('Definição ausente: '+item.ref);continue;}\n      allStyles.push(...Object.values(def.estrutura?.css?.regras||{}));createTree(def,item.inst);stateByInstance.set(item.inst,baseStates(item.inst));}\n    const css=document.createElement('style');css.textContent=allStyles.join('\\n').replace(/:host\\b/g,':root');document.head.append(css);\n    const inserted=new Set(),first=info.estrutura?.html?.raizRef||items[0]?.inst;\n    function place(item){if(inserted.has(item.inst))return true;\n      let parent=mount;\n      if(item.inst!==first){const parentRef=composition[item.inst]?.paiRef;\n        if(parentRef){let target=allElements.get(parentRef);if(!target){\n            const parentInst=items.find(x=>x.inst===parentRef);\n            if(parentInst&&!inserted.has(parentInst.inst))place(parentInst);\n            target=allElements.get(parentRef)||instanceRoots.get(parentRef)?.[0];}\n          if(target)parent=target;else warnings.push('Pai não encontrado: '+parentRef+' / '+item.inst);\n        }\n      }\n      for(const el of instanceRoots.get(item.inst)||[]){el.__instanceOrder=item.order;const before=Array.from(parent.childNodes).find(x=>(x.__instanceOrder??-Infinity)>item.order);parent.insertBefore(el,before||null);}\n      inserted.add(item.inst);return true;}\n    items.sort((a,b)=>a.inst===first?-1:b.inst===first?1:a.order-b.order||a.index-b.index);\n    for(const item of items)place(item);\n    for(const item of items)applyStates(item.inst);\n    if(!mount.childNodes.length)throw Error('Nenhum componente renderizável');\n  }catch(err){warnings.push('Falha na montagem: '+err.message);mount.textContent='A estrutura não pôde ser montada. Verifique os contratos JSON.';}\n  const declared=info.navegacao?.destinosDeclarados||[];\n  function currentDrawer(){return Object.keys(instances).find(k=>k.includes('drawer')||definitions[instances[k]]?.classificacao?.categoria==='menu');}\n  function closeDrawer(){const inst=currentDrawer();if(inst&&setVisualState(inst,'painel','fechado'))return;\n    document.querySelectorAll('.prototype-drawer,.drawer,[data-overlay-root]').forEach(el=>{el.classList.remove('open','is-open');el.setAttribute('aria-hidden','true');});}\n  function openDrawer(){const inst=currentDrawer();if(inst&&setVisualState(inst,'painel','aberto'))return;\n    const el=$('.prototype-drawer')||$('[data-overlay-root]')||$('.drawer');if(el){el.classList.add('open');el.setAttribute('aria-hidden','false');}}\n  document.addEventListener('click',ev=>{\n    const el=ev.target.closest?.('button,a,[data-action],[data-goto]');if(!el)return;\n    const action=el.getAttribute('data-action')||'';\n    if(action==='drawer.open'||el.matches('.app-menu-button,[aria-label=\"Abrir menu\"]')){ev.preventDefault();openDrawer();return;}\n    if(action==='drawer.close'||el.matches('.drawer-backdrop,[aria-label=\"Fechar menu\"]')){ev.preventDefault();closeDrawer();return;}\n    if(el.matches('.aj-menu__switch[role=\"switch\"]')){ev.preventDefault();const inst=currentDrawer();if(inst){const v=stateByInstance.get(inst)?.disponibilidade||'online';setVisualState(inst,'disponibilidade',v==='online'?'offline':'online');}return;}\n    let elementId=null,instanceId=null;\n    for(const [inst,reg] of perInstance){for(const [ref,node] of reg){if(node===el){elementId=ref;instanceId=inst;break;}}if(instanceId)break;}\n    const destination=declared.find(d=>d.instanciaRef===instanceId&&d.elementoRef===elementId)?.destinoRef\n      ||declared.find(d=>!d.instanciaRef&&d.elementoRef===elementId)?.destinoRef\n      ||el.getAttribute('data-goto')||el.getAttribute('href');\n    if(destination&&destination!=='#'){ev.preventDefault();showMessage('Destino declarado: '+destination+' · navegação desativada');return;}\n    if(el.hasAttribute('data-demo-action')){ev.preventDefault();showMessage('Ação demonstrativa: '+el.getAttribute('data-demo-action'));return;}\n    if(el.matches('button,a'))ev.preventDefault();\n  });\n  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});\n  window.addEventListener('message',e=>{if(e.source!==window.parent||e.data?.type!=='advogadoja.visualState')return;setVisualState(e.data.instance,e.data.axis,e.data.value)});\n  if(warnings.length){warning.textContent=Array.from(new Set(warnings)).join(' · ');warning.hidden=false;}\n  window.__advogadojaPreview={setVisualState,instances,stateByInstance};\n})();\n\nwindow.addEventListener('message',e=>{if(e.data?.type==='aj.v4.access'){const el=document.querySelector('.app');if(el)el.dataset.professionalAccess=e.data.value}});\n";
const DOCUMENT_PATH = './data/documento.json';
const DEFAULT_TELA_ID = 'advogado.home';
let initialPayload=null, baselineHash='';
let docs=new Map(), sharedComponents={}, journeyOrder=[], selectJourney='advogado',selectSub='',device='mobile',search='',sort='catalogo',visible=20,detailId=null,detailTab='preview',activeComp=null,changes=0,storage='aguardando',storeReady=false;
const names=()=>[...docs.keys()];const getDoc=id=>docs.get(id), tela=id=>getDoc(id)?.tela||{}, display=id=>tela(id).identidade?.nomeExibicao||tela(id).identidade?.nome||id;
const completeMeta=o=>o&&typeof o.id==='string'&&o.id.trim()&&
  (typeof o.numero==='string'||typeof o.numero==='number')&&String(o.numero).trim()&&
  typeof o.nome==='string'&&o.nome.trim();
const compareNum=(a,b)=>String(a??'').localeCompare(String(b??''),'pt-BR',{numeric:true,sensitivity:'base'});
// Não há catálogo de jornadas em memória: somente as classificações das telas atuais.
function journeyIndex(){const out=new Map();for(const d of docs.values()){
 const entries=d?.tela?.classificacao?.jornadas;
 if(!Array.isArray(entries))continue;
 for(const j of entries){if(!completeMeta(j)||!Array.isArray(j.subjornadas))continue;
  if(!out.has(j.id))out.set(j.id,{id:j.id,numero:j.numero,nome:j.nome,subjornadas:new Map()});
  const target=out.get(j.id);
  for(const sub of j.subjornadas)if(completeMeta(sub)&&!target.subjornadas.has(sub.id))target.subjornadas.set(sub.id,{
   id:sub.id,numero:sub.numero,nome:sub.nome
  });
 }
 }return out;}
const journeyMeta=id=>journeyIndex().get(id)||null;
const subMeta=(jid,sid)=>journeyMeta(jid)?.subjornadas.get(sid)||null;
function normalizeJoins(d){const source=d?.tela?.classificacao?.jornadas;const joins=[];
 if(!Array.isArray(source))return joins;
 for(const j of source){if(!completeMeta(j)||!Array.isArray(j.subjornadas))continue;
  const subs=j.subjornadas;
  if(!subs.length)joins.push({j:j.id,s:null,order:j.ordemTela??null});
  else for(const sub of subs)if(completeMeta(sub))joins.push({j:j.id,s:sub.id,order:j.ordemTela??null});
 }return joins;}
function classPending(d){const arr=d?.tela?.classificacao?.jornadas;
 if(!Array.isArray(arr)||!arr.length)return true;
 return arr.some(j=>!completeMeta(j)||!Array.isArray(j.subjornadas)||j.subjornadas.some(x=>!completeMeta(x)));
}
function validateClassificationConsistency(workingDocs){const all=new Map();for(const d of workingDocs.values()){
 const entries=d?.tela?.classificacao?.jornadas;
 if(!Array.isArray(entries))continue;
 for(const j of entries){if(!completeMeta(j)||!Array.isArray(j.subjornadas))continue;
  let known=all.get(j.id);
  if(!known){known={numero:String(j.numero),nome:j.nome,subs:new Map()};all.set(j.id,known);}
  else if(known.numero!==String(j.numero)||known.nome!==j.nome)throw Error('Jornada '+j.id+' com número/nome diferentes entre telas. Corrija a classificação.');
  for(const sub of j.subjornadas){if(!completeMeta(sub))continue;const old=known.subs.get(sub.id);
   if(old&&(old.numero!==String(sub.numero)||old.nome!==sub.nome))throw Error('Subjornada '+j.id+'/'+sub.id+' com número/nome conflitantes.');
   known.subs.set(sub.id,{numero:String(sub.numero),nome:sub.nome});}
 }}return true;}
function allJourneyIds(){return [...journeyIndex().values()].sort((a,b)=>compareNum(a.numero,b.numero)||a.id.localeCompare(b.id)).map(j=>j.id);}
function orderedJourn(){const all=allJourneyIds();if(!journeyOrder.length)return all;journeyOrder=[...journeyOrder.filter(j=>all.includes(j)),...all.filter(j=>!journeyOrder.includes(j))];return journeyOrder;}
function badgeJoin(id){const d=getDoc(id),js=normalizeJoins(d);
 if(!js.length||classPending(d))return 'Classificação pendente';
 const chosen=js.find(x=>x.j===selectJourney&&(!selectSub||x.s===selectSub))||js[0];
 const j=journeyMeta(chosen.j),sub=chosen.s?subMeta(chosen.j,chosen.s):null;
 return sub?`${sub.numero} · ${sub.nome}`:`${j?.numero||'—'} · ${j?.nome||'Sem jornada'} (sem subjornada)`;
}
function filters(){const ids=orderedJourn();
 if(selectJourney&&!ids.includes(selectJourney))selectJourney='';
 $('journeySelect').innerHTML='<option value="">Todas as jornadas</option>'+ids.map(id=>{
 const j=journeyMeta(id);return `<option value="${esc(id)}">${esc(j.numero)} · ${esc(j.nome)}</option>`;
 }).join('');$('journeySelect').value=selectJourney;
 const subs=selectJourney?[...(journeyMeta(selectJourney)?.subjornadas.values()||[])].sort((a,b)=>compareNum(a.numero,b.numero)):[];
 $('subSelect').innerHTML='<option value="">Todas</option>'+subs.map(s=>`<option value="${esc(s.id)}">${esc(s.numero)} · ${esc(s.nome)}</option>`).join('');
 if(!subs.some(s=>s.id===selectSub))selectSub='';$('subSelect').value=selectSub;
 $('subSelect').disabled=!selectJourney;$('deviceSelect').value=device;$('sortSelect').value=sort;$('searchInput').value=search;
 const at=ids.indexOf(selectJourney);$('journeyUp').disabled=!selectJourney||at<=0;$('journeyDown').disabled=!selectJourney||at<0||at>=ids.length-1;
}
function ordering(a,b){if(sort==='nome')return display(a).localeCompare(display(b),'pt-BR');
 if(sort==='id')return a.localeCompare(b);
 const ja=normalizeJoins(getDoc(a)).find(x=>x.j===selectJourney&&(!selectSub||x.s===selectSub))||normalizeJoins(getDoc(a))[0];
 const jb=normalizeJoins(getDoc(b)).find(x=>x.j===selectJourney&&(!selectSub||x.s===selectSub))||normalizeJoins(getDoc(b))[0];
 const ia=orderedJourn().indexOf(ja?.j),ib=orderedJourn().indexOf(jb?.j);
 if(ia!==ib)return (ia<0?999:ia)-(ib<0?999:ib);
 const nsA=ja?.s?subMeta(ja.j,ja.s)?.numero:'',nsB=jb?.s?subMeta(jb.j,jb.s)?.numero:'';
 const comp=compareNum(nsA,nsB);if(comp)return comp;
 const ao=ja?.order,bo=jb?.order;if(ao!=null&&bo!=null&&ao!==bo)return Number(ao)-Number(bo);
 return names().indexOf(a)-names().indexOf(b);
}
function listFiltered(){let ids=names().filter(id=>{const join=normalizeJoins(getDoc(id));if(selectJourney&&!join.some(x=>x.j===selectJourney&&(!selectSub||x.s===selectSub)))return false;const q=search.trim().toLocaleLowerCase('pt-BR');return !q||(display(id)+' '+id+' '+(tela(id).classificacao?.localizacao?.caminho||'')).toLocaleLowerCase('pt-BR').includes(q);});if(sort!=='entrada')ids.sort(ordering);return ids;}
let observer=null;
function lazyFrames(){if(observer)observer.disconnect();observer='IntersectionObserver'in window?new IntersectionObserver((entries)=>{for(const ent of entries){if(ent.isIntersecting){const f=ent.target;f.srcdoc=frameDoc(f.dataset.id);observer.unobserve(f)}}},{rootMargin:'300px 0px'}):null;
 for(const f of document.querySelectorAll('iframe[data-id]')){if(observer)observer.observe(f);else f.srcdoc=frameDoc(f.dataset.id);}}
function render(){filters();const all=listFiltered(),shown=all.slice(0,visible);$('totalCount').textContent=docs.size+' telas';$('resultCount').textContent=all.length+' telas encontradas';$('summary').textContent=all.length+' telas encontradas. Jornadas extraídas somente das classificações declaradas nas telas.';
 $('gallery').innerHTML=shown.length?shown.map(id=>{const missing=missingDefs(getDoc(id));return `<article class="card"><div class="cardhead"><span>${esc(badgeJoin(id))}</span><button class="detail" data-open="${esc(id)}">Detalhes</button></div><div class="framearea"><div class="device ${device}"><iframe title="Prévia ${esc(display(id))}" sandbox="allow-scripts" loading="lazy" data-id="${esc(id)}"></iframe></div><button data-open="${esc(id)}" class="frame-cover" aria-label="Abrir ${esc(display(id))}"></button></div><div class="cardfoot"><strong>${esc(display(id))}</strong><code>${esc(id)}</code>${classPending(getDoc(id))?'<span class="pending">Classificação incompleta: edite em Detalhes</span>':''}${missing.length?`<span class="pending">${missing.length} definições ainda não importadas</span>`:''}</div></article>`}).join(''):`<div class="empty" style="grid-column:1/-1"><h2>Nenhuma tela neste filtro</h2><p>Importe JSON de uma tela ou selecione outra jornada. As telas são adicionadas sem substituir as anteriores.</p><button data-action="import">Importar JSON</button></div>`;
 $('loadMore').hidden=all.length<=shown.length;$('loadMore').textContent=`Mostrar mais ${Math.min(20,all.length-shown.length)} telas (${all.length-shown.length} restantes)`;lazyFrames();if(mainTab==='componentes')renderComponents();}
function refsFor(d){const t=d?.tela||{},map={...t.componentes?.instanciasRefs};for(const [inst,pos] of Object.entries(t.estrutura?.html?.composicao||{}))if(pos?.componenteRef)map[inst]=pos.componenteRef;return map;}
function defsFor(d){return {...sharedComponents,...(d?.componentes||{})};}
function missingDefs(d){const defs=defsFor(d);return [...new Set(Object.values(refsFor(d)))].filter(cid=>!defs[cid]);}
function viewData(d){const t=d.tela;return {identidade:t.identidade,classificacao:t.classificacao,estrutura:t.estrutura,definicoes:defsFor(d),instancias:refsFor(d),navegacao:{destinosDeclarados:t.navegacao?.destinosDeclarados||[]}};}
function frameDoc(id){const d=getDoc(id);if(!d)return '<p>Documento não encontrado</p>';return createFrame(d);}
function createFrame(d){const data=JSON.stringify(viewData(d)).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');const runtime=FRAME_RUNTIME;
 return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob: https:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; font-src data: https:"><style>html,body{margin:0;min-height:100%;}*{box-sizing:border-box}#app-root{min-height:100dvh}#warnings{position:fixed;top:4px;right:4px;max-width:80%;background:#fff1c9;color:#79551f;padding:5px;font:10px Arial;z-index:99999}#navigation-tip{position:fixed;bottom:8px;left:50%;transform:translateX(-50%);background:#10233f;color:white;border-radius:6px;padding:8px;font:11px Arial;z-index:999999}</style></head><body><div id="app-root"></div><div id="warnings" hidden></div><div id="navigation-tip" hidden></div><script type="application/json" id="view-data">${data}<\/script><script>${runtime}<\/script></body></html>`;}
let componentSearch='',componentObserver=null;
function componentCatalog(){const catalog=new Map();const add=(id,definition,source)=>{if(!id||!definition)return;const existing=catalog.get(id);if(!existing){catalog.set(id,{id,definition,sources:[source],conflict:false});return;}if(JSON.stringify(existing.definition)!==JSON.stringify(definition))existing.conflict=true;if(!existing.sources.includes(source))existing.sources.push(source);};
 for(const [id,definition] of Object.entries(sharedComponents))add(id,definition,'coleção compartilhada');
 for(const [screenId,documento] of docs)for(const [id,definition] of Object.entries(documento.componentes||{}))add(id,definition,screenId);
 return [...catalog.values()].sort((a,b)=>a.id.localeCompare(b.id,'pt-BR'));}
function componentName(item){return item.definition?.identidade?.nomeExibicao||item.definition?.identidade?.nome||item.id;}
function componentLocation(item){return item.definition?.classificacao?.localizacao?.caminho||'Sem localização declarada';}
function componentDocument(item){return {tela:{identidade:{id:'preview.'+item.id,tipo:'tela',nome:'Prévia de componente'},estrutura:{html:{raizRef:'component.preview',composicao:{'component.preview':{paiRef:null,slot:'raiz',ordem:10,componenteRef:item.id}}},css:{tokens:{},regras:{}}}},componentes:{[item.id]:item.definition}};}
function lazyComponentFrames(){if(componentObserver)componentObserver.disconnect();componentObserver='IntersectionObserver'in window?new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){const frame=entry.target;const item=componentCatalog().find(x=>x.id===frame.dataset.componentPreview);if(item)frame.srcdoc=createFrame(componentDocument(item));componentObserver.unobserve(frame);}},{rootMargin:'260px 0px'}):null;
 for(const frame of document.querySelectorAll('iframe[data-component-preview]')){if(componentObserver)componentObserver.observe(frame);else{const item=componentCatalog().find(x=>x.id===frame.dataset.componentPreview);if(item)frame.srcdoc=createFrame(componentDocument(item));}}}
function renderComponents(){if(!$('componentPanel'))return;const all=componentCatalog(),query=componentSearch.trim().toLocaleLowerCase('pt-BR');const filtered=all.filter(item=>!query||(item.id+' '+componentName(item)+' '+componentLocation(item)).toLocaleLowerCase('pt-BR').includes(query));
 $('componentTotalCount').textContent=all.length+' componente'+(all.length===1?'':'s');$('componentResultCount').textContent=filtered.length+' encontrado'+(filtered.length===1?'':'s');$('componentSummary').textContent=filtered.length+' componente(s) declarados no documento atual; os IDs são únicos em toda a coleção.';
 $('componentGallery').innerHTML=filtered.length?filtered.map(item=>`<article class="component-card"><div class="component-card__head"><div><strong>${esc(componentName(item))}</strong><code>${esc(item.id)}</code></div><button type="button" data-component-open="${esc(item.id)}">Detalhes</button></div><div class="component-stage"><iframe title="Prévia do componente ${esc(componentName(item))}" sandbox="allow-scripts" loading="lazy" data-component-preview="${esc(item.id)}"></iframe></div><div class="component-card__foot"><p>${esc(componentLocation(item))}</p><div class="component-card__meta"><span>${esc(item.sources.length===1?item.sources[0]:item.sources.length+' fontes')}</span>${item.conflict?'<span class="component-card__warning">Definições divergentes</span>':''}</div></div></article>`).join(''):`<div class="empty" style="grid-column:1/-1"><h2>Nenhum componente encontrado</h2><p>Altere a busca ou importe um documento com definições de componentes.</p></div>`;lazyComponentFrames();}
function openComponentDetail(id){const item=componentCatalog().find(entry=>entry.id===id);if(!item)return;detailId=null;$('overlay').classList.add('open');$('overlay').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';$('modalTitle').textContent=componentName(item);$('modalId').textContent=item.id+' · '+componentLocation(item);$('modalTabs').innerHTML='';$('modalBody').innerHTML=`<div class="infobox"><h3>Componente declarado</h3><p><b>Fontes:</b> ${esc(item.sources.join(' · '))}</p>${item.conflict?'<p style="color:#a46e21"><b>Atenção:</b> há definições diferentes para este mesmo ID. Revise antes de consolidar.</p>':''}<pre>${esc(JSON.stringify(item.definition,null,2))}</pre></div>`;}
function notify(text,type='good'){const box=$('notice');box.textContent=text;box.className='notice '+type;box.hidden=false;clearTimeout(window._noticeTimeout);window._noticeTimeout=setTimeout(()=>{box.hidden=true},8500);}
function setStatus(text){$('saveStatus').textContent=text;}
function touch(){changes++;setStatus('Alterações locais · '+changes);scheduleSave();}
let saveTimer=null;function scheduleSave(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>saveDB().catch(()=>{}),650);}
function openDB(){return new Promise((resolve,reject)=>{if(!window.indexedDB){reject(Error('IndexedDB indisponível'));return}let req=indexedDB.open('advogadoja_galeria_modular_documento_v1',1);req.onupgradeneeded=()=>{const db=req.result;db.createObjectStore('workspace')};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
let database=null;
async function saveDB(){if(!database)return;return new Promise((resolve,reject)=>{let tx=database.transaction('workspace','readwrite');tx.objectStore('workspace').put({documents:[...docs],components:sharedComponents,journeyOrder,initialPayload,baselineHash},'current');tx.oncomplete=()=>{storage='local';resolve()};tx.onerror=()=>reject(tx.error);});}
async function restoreDB(){
 try{
  database=await openDB();
  const saved=await new Promise((resolve,reject)=>{let req=database.transaction('workspace','readonly').objectStore('workspace').get('current');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)});
  if(saved?.documents?.length){
   // Quando o documento.json é atualizado externamente, não restaurar uma cópia antiga por cima.
   if(baselineHash && saved.baselineHash && saved.baselineHash!==baselineHash){
    setStatus('Documento externo atualizado · coleção renovada');
   }else if(baselineHash && !saved.baselineHash){
    setStatus('Documento externo carregado');
   }else{
    docs=new Map(saved.documents);sharedComponents=saved.components||{};journeyOrder=saved.journeyOrder||[];
    if(!initialPayload&&saved.initialPayload){initialPayload=saved.initialPayload;baselineHash=saved.baselineHash||hashJson(initialPayload);}
    setStatus('Coleção local restaurada');storeReady=true;return true;
   }
  }
  storeReady=true;return false;
 }catch(e){storage='memória';storeReady=true;setStatus('Memória desta página — exporte o JSON');return false;}
}

function hashJson(value){const str=JSON.stringify(value);let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}return String(h>>>0);}
function setBase(value){
 const batch=recognize(value);
 if(!batch.docs.length)throw Error('O documento.json não possui telas válidas.');
 const fresh=new Map();
 for(const d of batch.docs){const id=d?.tela?.identidade?.id;
  if(!id||!d?.tela?.estrutura?.html)throw Error('Tela sem identidade ou estrutura: '+(id||'sem ID'));
  if(fresh.has(id))throw Error('Tela duplicada: '+id);
  fresh.set(id,deep(d));
 }
 validateClassificationConsistency(fresh);
 for(const [id,d] of fresh){const defs={...batch.components,...(d.componentes||{})};
  const absent=[...new Set(Object.values(refsFor(d)))].filter(ref=>!defs[ref]);
  if(absent.length)throw Error('Componentes ausentes na tela '+id+': '+absent.join(', '));
 }
 docs=fresh;sharedComponents=deep(batch.components);initialPayload=deep(value);baselineHash=hashJson(value);
 journeyOrder=[];selectJourney=docs.has(DEFAULT_TELA_ID)?'advogado':'';selectSub='';visible=20;
 modelSingle=docs.has(DEFAULT_TELA_ID)?DEFAULT_TELA_ID:([ ...docs.keys()][0]||'');modelSelected=new Set(modelSingle?[modelSingle]:[]);
}
async function initialize(){
 let loaded=false, loadError='';
 try{
  if(location.protocol==='file:')throw Error('O navegador não permite carregar JSON por fetch no protocolo file://.');
  const response=await fetch(DOCUMENT_PATH,{cache:'no-store'});
  if(!response.ok)throw Error('HTTP '+response.status+' ao ler '+DOCUMENT_PATH);
  setBase(await response.json());loaded=true;setStatus('Documento inicial carregado');
 }catch(e){loadError=e.message;}
 const restored=await restoreDB();
 if(loaded&&!restored&&!$('saveStatus').textContent.includes('atualizado'))setStatus('documento.json carregado');
 if(!docs.size){setStatus('Selecione data/documento.json');
  notify('Para abrir diretamente pelo arquivo index.html, clique em “Importar JSON” e selecione data/documento.json. Para carregamento automático, abra a pasta por um servidor HTTP local. '+(loadError&&!location.protocol.startsWith('file')?'Detalhe: '+loadError:''),'warn');
 }else if(!loaded&&restored){notify('Coleção local restaurada. Para atualizar a origem, importe o documento.json.');}
 render();
}

function parseFile(file){return file.text().then(txt=>{if(file.name.toLowerCase().endsWith('.jsonl'))return txt.split(/\r?\n/).filter(Boolean).map((x,i)=>{try{return JSON.parse(x)}catch(e){throw Error('Linha '+(i+1)+': '+e.message)}});return JSON.parse(txt)});}
function findFolder(n,name){return (n?.children||[]).find(x=>x.name===name&&x.kind==='folder');}
function fileAt(n,name){const c=(n?.children||[]).find(x=>x.kind==='file'&&x.name===name);if(!c)return null;try{return JSON.parse(c.content)}catch(e){return null}}
function subsection(n,k){return fileAt(findFolder(n,k),k+'.json')}
function componentsFrom(n){const components={};const base=findFolder(n,'componentes');const defs=findFolder(base,'definicoes');if(defs)for(const folder of defs.children||[]){const doc=fileAt(folder,'componente.json')||((subsection(folder,'estrutura')?.html?.elementos)?{identidade:subsection(folder,'identidade')||{},classificacao:subsection(folder,'classificacao')||{},estrutura:subsection(folder,'estrutura')}:null);if(doc){const id=folder.name;components[id]=doc;}}
 return components;}
function globalFromTree(n,p=[]){if(!n)return {};let out={};if(n.kind==='folder'){let identity=subsection(n,'identidade'),structure=subsection(n,'estrutura');if(identity?.id&&structure?.html?.elementos){out[identity.id]={identidade:identity,classificacao:subsection(n,'classificacao')||{},estrutura:structure};}}
 for(const ch of n.children||[])Object.assign(out,globalFromTree(ch,p.concat(n.name)));return out;}
function extractTree(j){const root=j.root;const bucket={docs:[],components:{}};const collect=(n,path=[])=>{if(n.kind==='screen'){
 const idfile=subsection(n,'identidade');const screenId=idfile?.id;if(!screenId)return;
 const meta=fileAt(n,'meta.json')||{};const t={...meta};for(const k of ['identidade','classificacao','estrutura','estados','variantes','interacoes','acoes','navegacao','dados','mocks']){const block=subsection(n,k);if(block!=null)t[k]=block;}
 const compNode=findFolder(n,'componentes');const instances=fileAt(compNode,'instancias.json');if(instances)t.componentes=instances;
 const defs=componentsFrom(n);bucket.docs.push({tela:t,componentes:defs});return;}
 if(n.kind==='folder'&&n.name==='componentes'&&path.includes('biblioteca')){
 Object.assign(bucket.components,globalFromTree(n));return;}
 for(const c of n.children||[])collect(c,[...path,n.name]);};collect(root,[]);return bucket;}
function isObj(x){return !!x&&typeof x==='object'&&!Array.isArray(x)};
function recognize(value){const result={docs:[],components:{}};const add=v=>{
 if(Array.isArray(v)){v.forEach(add);return;}
 if(!isObj(v))throw Error('Tipo de JSON não reconhecido');
 if(v.root&&isObj(v.root)&&v.format?.includes('arvore')){const r=extractTree(v);result.docs.push(...r.docs);Object.assign(result.components,r.components);return;}
 if(Array.isArray(v.jornadas)&&!v.tela&&!v.telas)throw Error('Catálogo avulso não é importado. As jornadas devem estar nas classificações das telas.');
 if(v.tipo==='advogadoja.galeria.jornadas.v4'||v.formato==='advogadoja.galeria.jornadas.v4'){
 if(isObj(v.componentes))Object.assign(result.components,v.componentes);
 if(isObj(v.telas)){
  for(const [id,t] of Object.entries(v.telas)){
   if(t?.tela?.identidade?.id)result.docs.push(t);
   else if(t?.identidade?.id)result.docs.push({tela:t,componentes:{}});
   else throw Error('Tela sem identidade no índice: '+id);
  }
 }else add(v.documentos||[]);
 return;}
 if(v.tela?.identidade?.id){result.docs.push(v);return;}
 if(v.identidade?.id&&v.estrutura?.html&&v.identidade?.tipo==='componente'){result.components[v.identidade.id]=v;return;}
 if(v.identidade?.id&&v.estrutura?.html){result.docs.push({tela:v,componentes:{}});return;}
 if(isObj(v.telas)){for(const [id,doc] of Object.entries(v.telas)){if(doc?.tela?.identidade?.id)result.docs.push(doc);else if(doc?.identidade?.id)result.docs.push({tela:doc,componentes:v.componentes||{}});}if(v.componentes)Object.assign(result.components,v.componentes);return;}
 if(Array.isArray(v.documentos)){add(v.documentos);return;}
 if(Array.isArray(v.telas)){add(v.telas);return;}
 if(v.componentes&&Object.keys(v).length===1){Object.assign(result.components,v.componentes);return;}
 throw Error('Esperado documento {tela,componentes}, árvore modular ou coleção de telas');};add(value);return result;}
function importData(value){const batch=recognize(value);let added=0,updated=0,components=0;
 const candidateDocs=new Map(docs),candidateShared={...sharedComponents};
 for(const [id,c] of Object.entries(batch.components)){
  if(!candidateShared[id]||JSON.stringify(candidateShared[id])!==JSON.stringify(c)){
   candidateShared[id]=c;components++;
  }
 }
 for(const d of batch.docs){const id=d?.tela?.identidade?.id;const structure=d?.tela?.estrutura?.html;
  if(!id||!structure)throw Error('Tela sem identidade.id ou estrutura.html: '+(id||'sem ID'));
  if(candidateDocs.has(id))updated++;else added++;
  candidateDocs.set(id,d);
 }
 if(!batch.docs.length&&!components)throw Error('Nenhuma tela ou componente encontrado');
 validateClassificationConsistency(candidateDocs);
 docs=candidateDocs;sharedComponents=candidateShared;
 visible=20;changes+=added+updated+components;setStatus('Coleção atualizada');scheduleSave();
 render();const pending=batch.docs.filter(d=>classPending(d)).length;
 const msg=`Importação: ${added} tela(s) adicionada(s), ${updated} atualizada(s), ${components} componente(s) compartilhado(s).`+
  (pending?` ${pending} tela(s) com classificação incompleta — preencha id, numero e nome no JSON.`:'');
 if($('modelImportStatus'))$('modelImportStatus').textContent=msg;
 renderModel();notify(msg,pending?'warn':'good');
}
async function filesSelected(files){
 if(!files?.length)return;let results=[],errors=[];
 for(const f of files){try{results.push({name:f.name,value:await parseFile(f)})}catch(e){errors.push(f.name+': '+e.message)}}
 for(const r of results){try{
  if(!docs.size && !initialPayload){setBase(r.value);changes++;setStatus('Documento inicial selecionado');scheduleSave();render();renderModel();notify('documento.json carregado: '+docs.size+' tela(s) e '+Object.keys(sharedComponents).length+' componente(s).');}
  else importData(r.value);
 }catch(e){errors.push(r.name+': '+e.message)}}
 if(errors.length)notify(errors.join(' | '),'warn');
}
function download(obj,name){const content=JSON.stringify(obj,null,2)+'\n',b=new Blob([content],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(b),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);}
const EXPORT_TYPE='advogadoja.galeria.jornadas.v4';
function makeBundle(ids,{all=false}={}){
 const unique=[...new Set(ids)],telas={},componentes={};
 for(const id of unique){
  const documento=docs.get(id);if(!documento)throw Error('Tela não encontrada: '+id);
  telas[id]=deep(documento.tela);
  const refIds=[...new Set(Object.values(refsFor(documento)))];
  const defs=defsFor(documento);
  for(const cid of refIds){
   const definicao=defs[cid];
   if(!definicao)throw Error('A tela '+id+' utiliza '+cid+', mas a definição não foi importada.');
   if(Object.prototype.hasOwnProperty.call(componentes,cid)&&JSON.stringify(componentes[cid])!==JSON.stringify(definicao))
    throw Error('Conflito no componente '+cid+': definições diferentes entre telas. Revise antes de consolidar.');
   componentes[cid]=deep(definicao);
  }
 }
 // Na coleção completa, preserva também componentes compartilhados que ainda não foram utilizados.
 if(all){for(const [cid,definicao] of Object.entries(sharedComponents)){
  if(Object.prototype.hasOwnProperty.call(componentes,cid)&&JSON.stringify(componentes[cid])!==JSON.stringify(definicao))
   throw Error('Conflito entre definição compartilhada e definição local: '+cid);
  componentes[cid]=deep(definicao);
 }}
 return {tipo:EXPORT_TYPE,versao:1,telas,componentes};
}
function exportSelection(ids,all=false){
 try{if(!ids.length)throw Error('Selecione pelo menos uma tela.');
  const bundle=makeBundle(ids,{all});
  const suffix=all?'colecao_completa':ids.length===1?ids[0].replace(/[^a-zA-Z0-9._-]/g,'_'):ids.length+'_telas';
  download(bundle,all?'documento.json':'AdvogadoJa_'+suffix+'.json');setStatus('Exportação concluída · '+ids.length+' tela(s) e '+Object.keys(bundle.componentes).length+' componente(s)');
  notify('JSON exportado: '+ids.length+' tela(s) e '+Object.keys(bundle.componentes).length+' componente(s), sem alterar seus documentos.');
  return true;
 }catch(e){notify('Exportação impedida: '+e.message,'warn');return false;}
}
function exportAll(){return exportSelection([...docs.keys()],true);}
// A área de modelo usa os MESMOS métodos de exportação da Galeria.
let mainTab='galeria',modelScope='single',modelSingle='';
let modelSelected=new Set(),modelFull=false,modelJson='';
function modelIds(){return modelScope==='all'?names():modelScope==='single'?[modelSingle]:names().filter(id=>modelSelected.has(id));}
function renderModel(){
 if(!$('modelPanel')||mainTab!=='modelo')return;
 const all=names();modelSingle=all.includes(modelSingle)?modelSingle:all[0]||'';
 $('modelScreen').innerHTML=all.map(id=>`<option value="${esc(id)}">${esc(display(id))} · ${esc(id)}</option>`).join('');
 $('modelScreen').value=modelSingle;
 $('singleChooser').classList.toggle('hidden',modelScope!=='single');
 $('selectedChooser').classList.toggle('hidden',modelScope!=='selected');
 for(const input of document.querySelectorAll('input[name="modelScope"]'))input.checked=input.value===modelScope;
 $('modelScreenChecks').innerHTML=all.map(id=>`<label><input type="checkbox" data-select-screen="${esc(id)}" ${modelSelected.has(id)?'checked':''}><span>${esc(display(id))} <code>${esc(id)}</code></span></label>`).join('');
 try{const ids=modelIds();if(!ids.length)throw Error('Nenhuma tela selecionada.');
  const payload=makeBundle(ids,{all:modelScope==='all'});modelJson=JSON.stringify(payload,null,2)+'\n';
  $('modelBundleSummary').textContent=`${ids.length} tela(s) · ${Object.keys(payload.componentes).length} componente(s) · formato único de 4 campos`;
  $('modelJsonPreview').classList.remove('error');
  const limit=4500;
  $('modelJsonPreview').textContent=modelFull?modelJson:modelJson.slice(0,limit)+(modelJson.length>limit?'\n\n[Prévia parcial: clique em “Mostrar JSON completo” para conferir tudo.]':'');
  $('modelPreviewNote').textContent=(modelFull?'Exibindo o JSON integral. ':'Exibindo prévia parcial quando necessário. ')+`O arquivo gerado contém todos os ${modelJson.length.toLocaleString('pt-BR')} caracteres, sem cortes.`;
  $('exportModelBtn').disabled=false;$('copyModelBtn').disabled=false;
 }catch(e){modelJson='';$('modelBundleSummary').textContent='Exportação não disponível: '+e.message;
  $('modelJsonPreview').classList.add('error');$('modelJsonPreview').textContent='Erro: '+e.message;
  $('modelPreviewNote').textContent='Importe as definições ausentes ou ajuste a seleção.';$('exportModelBtn').disabled=true;$('copyModelBtn').disabled=true;
 }
 $('toggleModelPreview').textContent=modelFull?'Resumir prévia':'Mostrar JSON completo';
}
function setMainTab(tab){mainTab=tab;$('galleryPanel').classList.toggle('hidden',tab!=='galeria');$('componentPanel').classList.toggle('hidden',tab!=='componentes');$('modelPanel').classList.toggle('hidden',tab!=='modelo');
 $('tabGaleria').classList.toggle('selected',tab==='galeria');$('tabComponentes').classList.toggle('selected',tab==='componentes');$('tabModelo').classList.toggle('selected',tab==='modelo');
 $('tabGaleria').setAttribute('aria-selected',String(tab==='galeria'));$('tabComponentes').setAttribute('aria-selected',String(tab==='componentes'));$('tabModelo').setAttribute('aria-selected',String(tab==='modelo'));
 if(tab==='modelo')renderModel();if(tab==='componentes')renderComponents();
}
function copyModel(){if(!modelJson)return;const content=modelJson;const copied=()=>notify('JSON completo copiado, incluindo as telas e todos os seus componentes.');
 if(navigator.clipboard?.writeText)navigator.clipboard.writeText(content).then(copied,()=>copyFallback(content));else copyFallback(content);
}
function copyFallback(content){const t=document.createElement('textarea');t.value=content;t.style.cssText='position:fixed;opacity:0;left:-9999px';document.body.append(t);t.select();
 const ok=document.execCommand('copy');t.remove();if(ok)notify('JSON completo copiado.');else notify('Cópia indisponível neste navegador. Use Exportar JSON.','warn');}
function moveJourney(dir){let a=orderedJourn(),idx=a.indexOf(selectJourney);if(idx<0||idx+dir<0||idx+dir>=a.length)return;[a[idx],a[idx+dir]]=[a[idx+dir],a[idx]];journeyOrder=a.slice();touch();render();notify('Ordem de exibição das jornadas alterada. IDs e números declarados nos documentos preservados.');}
function openDetails(id){if(!docs.has(id))return;detailId=id;detailTab='preview';activeComp=null;$('overlay').classList.add('open');$('overlay').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';renderDetail();}
function closeDetails(){$('overlay').classList.remove('open');$('overlay').setAttribute('aria-hidden','true');$('modalBody').innerHTML='';document.body.style.overflow='';}
function renderDetail(){if(!detailId||!docs.has(detailId))return;const doc=getDoc(detailId),t=doc.tela;$('modalTitle').textContent=display(detailId);$('modalId').textContent=detailId+' · '+(t.classificacao?.localizacao?.caminho||'sem caminho');
 $('modalTabs').innerHTML=['preview','identidade','classificacao','estrutura','componentes'].map(k=>`<button data-tab="${k}" class="${detailTab===k?'active':''}">${({preview:'Prévia',identidade:'Identidade',classificacao:'Classificação',estrutura:'Estrutura',componentes:'Componentes'})[k]}</button>`).join('');
 if(detailTab==='preview'){$('modalBody').innerHTML=`<div class="modal-preview"><div class="large-device-wrap"><div class="large-device ${device}"><iframe id="largeFrame" sandbox="allow-scripts" title="Prévia ampliada"></iframe></div></div><div class="infobox"><h3>Documento da tela</h3><p><b>ID:</b> <code>${esc(detailId)}</code></p><p><b>Classificação:</b> ${esc(normalizeJoins(doc).map(x=>x.j+'/'+(x.s||'—')).join(' · ')||'Não informada')}</p><p><b>Componentes:</b> ${Object.keys(refsFor(doc)).length} instâncias · ${Object.keys(doc.componentes||{}).length} definições locais</p><p><b>Posições:</b> por <code>estrutura.html.composicao</code>, <code>paiRef</code>, <code>slot</code> e <code>ordem</code>.</p>${missingDefs(doc).length?`<p style="color:#a46e21">Faltam: ${esc(missingDefs(doc).join(', '))}</p>`:''}<button data-action="exportScreen">Exportar tela + componentes</button><p class="muted">A prévia não cria HTML a partir de Fluxo ou contratos mínimos; usa somente a estrutura e as definições dos componentes.</p></div></div>`;$('largeFrame').srcdoc=createFrame(doc);return;}
 if(detailTab==='componentes'){const options=Object.keys(defsFor(doc));activeComp=activeComp&&options.includes(activeComp)?activeComp:options[0];$('modalBody').innerHTML=`<div class="modal-preview"><div class="infobox"><h3>Componentes presentes</h3><div class="component-list">${options.map(id=>`<button class="${id===activeComp?'active':''}" data-component="${esc(id)}">${esc(id)}</button>`).join('')}</div></div><div class="codeedit"><h3>${esc(activeComp||'')}</h3><textarea id="editBlock" spellcheck="false"></textarea><div class="actions"><button class="primary" data-action="applyBlock">Aplicar componente</button><span class="statusMsg" id="editMsg"></span></div></div></div>`;$('editBlock').value=JSON.stringify(defsFor(doc)[activeComp]||{},null,2);return;}
 const record=t[detailTab]||{};let assignment='';if(detailTab==='classificacao')assignment=`<div class="assign">
 <div class="assign-info">Adicionar uma classificação declarada. Informe os dados; o motor não cria nomes ou números automaticamente. Para alterar associações existentes, edite o JSON abaixo.</div>
 <div class="assign-group"><strong>Jornada</strong>
 <label>ID <input id="assignJId" placeholder="ex.: advogado"></label>
 <label>Número <input id="assignJNum" placeholder="ex.: 2"></label>
 <label>Nome <input id="assignJName" placeholder="Nome da jornada"></label></div>
 <div class="assign-group"><strong>Subjornada (opcional; preencha os três campos juntos)</strong>
 <label>ID <input id="assignSId" placeholder="ex.: home"></label>
 <label>Número <input id="assignSNum" placeholder="ex.: 2.4"></label>
 <label>Nome <input id="assignSName" placeholder="Nome da subjornada"></label></div>
 <button data-action="assign" type="button">Adicionar à classificação</button></div>`;
 $('modalBody').innerHTML=`${assignment}<div class="codeedit"><p class="sub-info">Edite o bloco original <code>tela.${esc(detailTab)}</code>. O formato JSON canônico será preservado.</p><textarea id="editBlock" spellcheck="false"></textarea><div class="actions"><button class="primary" data-action="applyBlock">Aplicar alterações</button><span class="statusMsg" id="editMsg"></span></div></div>`;$('editBlock').value=JSON.stringify(record,null,2);}
function applyBlock(){const doc=getDoc(detailId);const before=deep(doc);try{const data=JSON.parse($('editBlock').value);if(!isObj(data))throw Error('O bloco deve ser um objeto JSON.');if(detailTab==='componentes'){doc.componentes ||= {};doc.componentes[activeComp]=data;}else{if(detailTab==='identidade'&&data.id!==detailId)throw Error('O ID canônico deve permanecer '+detailId);doc.tela[detailTab]=data;}
 if(missingDefs(doc).length)throw Error('Referências de componentes ausentes: '+missingDefs(doc).slice(0,5).join(', '));
 if(detailTab==='classificacao'&&classPending(doc))throw Error('Classificação: cada jornada/subjornada precisa de id, numero e nome.');
 validateClassificationConsistency(docs);
 touch();render();renderDetail();if($('editMsg'))$('editMsg').textContent='Aplicado.';notify('Documento atualizado com sucesso.');}catch(e){docs.set(detailId,before);if($('editMsg'))$('editMsg').textContent=e.message;}}
function assign(){if(!detailId)return;
 const get=k=>$(k).value.trim();
 const jid=get('assignJId'),jnum=get('assignJNum'),jname=get('assignJName');
 const sid=get('assignSId'),snum=get('assignSNum'),sname=get('assignSName');
 if(!jid||!jnum||!jname)return notify('Informe ID, número e nome da jornada.','warn');
 if([sid,snum,sname].some(Boolean)&&(!sid||!snum||!sname))return notify('Informe ID, número e nome da subjornada, ou deixe os três vazios.','warn');
 const d=getDoc(detailId),before=deep(d);
 try{
  const cls=d.tela.classificacao ||= {};const joins=Array.isArray(cls.jornadas)?cls.jornadas:[];
  let j=joins.find(x=>x.id===jid);
  if(!j){j={id:jid,numero:/^\d+$/.test(jnum)?Number(jnum):jnum,nome:jname,subjornadas:[]};joins.push(j);}
  else if(String(j.numero)!==jnum||j.nome!==jname)throw Error('A jornada já existe com número ou nome diferente. Edite o JSON para corrigir.');
  if(sid){if(!Array.isArray(j.subjornadas))throw Error('A jornada existente não possui o array subjornadas. Corrija o JSON.');
   const sub=j.subjornadas.find(x=>x.id===sid);
   if(sub&&(String(sub.numero)!==snum||sub.nome!==sname))throw Error('Subjornada já existe com número/nome diferente.');
   if(!sub)j.subjornadas.push({id:sid,numero:snum,nome:sname});
  }
  cls.jornadas=joins;
  if(classPending(d))throw Error('Existem classificações antigas/incompletas. Edite o JSON para migrá-las antes de salvar.');
  validateClassificationConsistency(docs);
  touch();render();renderDetail();notify('Classificação declarada e filtros atualizados.');
 }catch(e){docs.set(detailId,before);notify(e.message,'warn');}
}
$('importBtn').onclick=()=>$('filePicker').click();$('exportBtn').onclick=exportAll;
$('tabGaleria').onclick=()=>setMainTab('galeria');$('tabComponentes').onclick=()=>setMainTab('componentes');$('tabModelo').onclick=()=>setMainTab('modelo');
$('modelImportBtn').onclick=()=>$('filePicker').click();
$('exportModelBtn').onclick=()=>exportSelection(modelIds(),modelScope==='all');
$('copyModelBtn').onclick=copyModel;
$('toggleModelPreview').onclick=()=>{modelFull=!modelFull;renderModel()};
$('modelScreen').onchange=e=>{modelSingle=e.target.value;renderModel()};
for(const input of document.querySelectorAll('input[name="modelScope"]'))input.onchange=e=>{modelScope=e.target.value;renderModel()};
$('modelScreenChecks').onchange=e=>{const id=e.target?.dataset?.selectScreen;if(!id)return;if(e.target.checked)modelSelected.add(id);else modelSelected.delete(id);renderModel()};
$('selectAllScreens').onclick=()=>{modelSelected=new Set(names());renderModel()};
$('deselectAllScreens').onclick=()=>{modelSelected.clear();renderModel()};
$('clearBtn').onclick=()=>{if(!initialPayload)return notify('Para reiniciar, carregue primeiro o documento.json original.','warn');if(confirm('Remover alterações locais e restaurar o documento.json inicial?')){setBase(initialPayload);touch();render();renderModel();notify('Coleção reiniciada a partir do documento.json inicial.')}};
$('filePicker').addEventListener('change',async e=>{const fs=[...e.target.files];e.target.value='';await filesSelected(fs)});
$('journeySelect').onchange=e=>{selectJourney=e.target.value;selectSub='';visible=20;render()};$('subSelect').onchange=e=>{selectSub=e.target.value;visible=20;render()};$('deviceSelect').onchange=e=>{device=e.target.value;render()};$('sortSelect').onchange=e=>{sort=e.target.value;render()};$('searchInput').oninput=e=>{search=e.target.value;visible=20;render()};$('journeyUp').onclick=()=>moveJourney(-1);$('journeyDown').onclick=()=>moveJourney(1);$('loadMore').onclick=()=>{visible+=20;render()};
$('componentSearchInput').oninput=e=>{componentSearch=e.target.value;renderComponents()};$('componentGallery').addEventListener('click',e=>{const button=e.target.closest('[data-component-open]');if(button)openComponentDetail(button.dataset.componentOpen)});
$('gallery').addEventListener('click',e=>{const b=e.target.closest('[data-open]');if(b)openDetails(b.dataset.open);else if(e.target.closest('[data-action="import"]'))$('filePicker').click()});
$('modalClose').onclick=closeDetails;$('overlay').addEventListener('click',e=>{if(e.target.id==='overlay')closeDetails()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDetails()});
$('modalTabs').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b){detailTab=b.dataset.tab;renderDetail()}});
$('modalBody').addEventListener('click',e=>{const component=e.target.closest('[data-component]');if(component){activeComp=component.dataset.component;renderDetail();return;}const b=e.target.closest('[data-action]');if(!b)return;switch(b.dataset.action){case 'applyBlock':applyBlock();break;case 'assign':assign();break;case 'exportScreen':exportSelection([detailId],false);break;}});

let dragCounter=0;document.addEventListener('dragenter',e=>{if(e.dataTransfer?.types?.includes('Files')){dragCounter++;document.body.classList.add('dropzone')}});document.addEventListener('dragleave',e=>{dragCounter--;if(dragCounter<=0){document.body.classList.remove('dropzone');dragCounter=0}});document.addEventListener('dragover',e=>{if(e.dataTransfer?.types?.includes('Files'))e.preventDefault()});document.addEventListener('drop',async e=>{if(e.dataTransfer?.files?.length){e.preventDefault();dragCounter=0;document.body.classList.remove('dropzone');await filesSelected([...e.dataTransfer.files])}});
render();initialize();
window.AdvogadoJaGaleria={importar:importData,getTelas:()=>[...docs.keys()],renderizar:render,exportar:(ids)=>makeBundle(ids||names(),{all:!ids})};
})();

