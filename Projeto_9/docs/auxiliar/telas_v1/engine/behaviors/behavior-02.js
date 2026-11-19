const ROOT = document.querySelector('#screen-root');
const SCREEN_URL=new URL(window.__SCREEN_CONTEXT__.configUrl,location.href);
const SCREEN_BASE_URL=new URL(window.__SCREEN_CONTEXT__.screenBaseUrl,location.href);
const SECTION_BASE_URL=new URL('../section-base.css',import.meta.url);
const STANDARD_SLOTS = Object.freeze(['header','main','navigation','menu','modal','popup','alert']);
const PROTOTYPE_MODE = new URL(location.href).searchParams.get('mode') === 'prototype';
const runtime = { config:null, sectionBaseCss:'', sections:new Map(), state:{}, diagnostics:[], shell:null, toastTimer:null };
boot().catch(showBootError);

async function boot(){
  ROOT.innerHTML='<div class="screen-loading">Montando tela…</div>';
  const [baseConfig, sectionBaseCss] = await Promise.all([fetchJson(SCREEN_URL), fetchText(SECTION_BASE_URL)]);
  const baseErrors = validateScreenConfig(baseConfig);
  if(baseErrors.length) throw new Error('configuração de tela inválida: '+baseErrors.join(' | '));

  const config=baseConfig;
  

  runtime.config=config;
  runtime.data=await loadScreenData(config);
  runtime.sectionBaseCss=sectionBaseCss;
  runtime.state=structuredClone(config.state||{});
  applyScreenMetadata(config);
  buildRuntimeShell();
  

  for(const entry of flattenComposition(config.composition||{})){
    try{ await mountSection(entry); }
    catch(error){ handleSectionFailure(entry,error); }
  }

  setAppointmentsTab(runtime.state.appointmentsTab||'requested');
  refreshOnlineBindings();
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeAllOverlays(); });
  window.ModularScreen=Object.freeze({
    getConfig:()=>structuredClone(runtime.config),getData:()=>structuredClone(runtime.data||{}),
    getState:()=>structuredClone(runtime.state),
    listSections:()=>[...runtime.sections.keys()],
    getDiagnostics:()=>structuredClone(runtime.diagnostics),
    getStructure:()=>[...runtime.sections.values()].map(s=>({id:s.id,kind:s.manifest.kind||null,slot:s.slot,order:s.entry.order??null,source:s.entry.source||s.entry.ref})),
    emit:dispatchScreenEvent
  });
  window.dispatchEvent(new CustomEvent('modular-screen:ready',{detail:{screen:config.screen,feature:config.screen?.feature||null,slots:STANDARD_SLOTS,sections:window.ModularScreen.getStructure()}}));
}

function validateScreenConfig(config){
  const errors=[];
  if(!isPlainObject(config)) return ['raiz precisa ser objeto'];
  if(!config.screen?.key) errors.push('screen.key é obrigatório');
  if(!isPlainObject(config.composition)) errors.push('composition precisa ser objeto');
  const ids=new Set();
  for(const [group,list] of Object.entries(config.composition||{})){
    if(!STANDARD_SLOTS.includes(group)){errors.push('grupo desconhecido: '+group);continue}
    if(!Array.isArray(list)){errors.push('composition.'+group+' precisa ser array');continue}
    for(const entry of list){
      if(!entry?.id) errors.push(group+': item sem id'); else if(ids.has(entry.id)) errors.push('id duplicado: '+entry.id); else ids.add(entry.id);
      const shared=entry?.sourceType==='shared'||Boolean(entry?.ref);
      if(shared){if(typeof entry.ref!=='string'||!entry.ref.trim()) errors.push((entry?.id||group)+': ref compartilhada inválida');}
      else if(!isSafeLocalSource(entry?.source)) errors.push((entry?.id||group)+': source local inválido');
      if(entry?.slot&&entry.slot!==group) errors.push((entry?.id||group)+': slot explícito deve coincidir com '+group);
    }
  }
  return errors;
}
function isSafeLocalSource(source){if(typeof source!=='string'||!source.trim())return false;const normalized=source.trim().replaceAll('\\','/');if(normalized.startsWith('/')||normalized.startsWith('./')||normalized.includes('://')||normalized.includes('?')||normalized.includes('#'))return false;const parts=normalized.split('/');return!parts.some(part=>!part||part==='.'||part==='..')&&parts.every(part=>/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(part))}

function flattenComposition(composition){
  const entries=[]; let idx=0;
  for(const slotName of STANDARD_SLOTS){
    const list=composition?.[slotName]; if(!Array.isArray(list)) continue;
    for(const entry of list){
      if(!entry||entry.enabled===false) continue;
      entries.push({...entry,slot:slotName,__configIndex:idx++});
    }
  }
  return entries.sort((a,b)=>STANDARD_SLOTS.indexOf(a.slot)-STANDARD_SLOTS.indexOf(b.slot)||normalizeOrder(a.order)-normalizeOrder(b.order)||a.__configIndex-b.__configIndex);
}

function buildRuntimeShell(){
  const preset=runtime.config.layout?.preset||'mobile-first-adaptive';
  ROOT.innerHTML=`<div class="screen-runtime" data-screen-runtime data-layout-preset="${escapeHtml(preset)}">
    <div class="screen-slot screen-slot--header" data-slot="header"></div>
    <div class="screen-layout" data-screen-layout>
      <nav class="screen-slot screen-slot--navigation" data-slot="navigation" aria-label="Navegação da tela"></nav>
      <main class="screen-slot screen-slot--main" data-slot="main"></main>
    </div>
    <div class="screen-slot screen-slot--menu" data-slot="menu"></div>
    <div class="screen-slot screen-slot--modal" data-slot="modal"></div>
    <div class="screen-slot screen-slot--popup" data-slot="popup"></div>
    <div class="screen-slot screen-slot--alert" data-slot="alert"></div>
  </div>`;
  runtime.shell=ROOT.querySelector('[data-screen-runtime]');
}

async function loadScreenData(config){
  if(!config?.dataRef)return {components:{}};
  const dataUrl=new URL(config.dataRef,SCREEN_URL);let data=await fetchJson(dataUrl);
  
  return data&&typeof data==='object'?data:{components:{}};
}
function applyScreenMetadata(config){
  document.title=runtime.data?.meta?.documentTitle||config.screen?.title||config.screen?.name||'Tela modular';
  
  document.body.dataset.screenKey=config.screen?.key||'';
  for(const [name,value] of Object.entries(config.theme||{})){
    document.documentElement.style.setProperty(name.startsWith('--')?name:`--${camelToKebab(name)}`,String(value));
  }
  const layout=config.layout||{};
  const vars={'--main-max':layout.mainMaxWidth,'--main-padding-x':layout.mainPaddingX,'--main-padding-top':layout.mainPaddingTop,'--main-padding-bottom':layout.mainPaddingBottom,'--section-gap':layout.sectionGap,'--nav-desktop-width':layout.desktopNavigationWidth};
  for(const [key,value] of Object.entries(vars)) if(value!=null) document.documentElement.style.setProperty(key,String(value));
}

let __componentRegistryPromise=null;
function componentRegistryUrl(){const value=document.querySelector('meta[name="component-registry"]')?.content;return value?new URL(value,location.href):null}
function assetBaseUrl(){const value=document.querySelector('meta[name="asset-base"]')?.content;return value?new URL(value,location.href):new URL('assets/',location.href)}
async function getComponentRegistry(){if(!__componentRegistryPromise){const url=componentRegistryUrl();__componentRegistryPromise=url?fetchJson(url):Promise.resolve({components:{}})}return __componentRegistryPromise}
async function resolveComponentEntry(entry){
  if(entry.sourceType==='shared'||entry.ref){
    const registry=await getComponentRegistry();const record=registry?.components?.[entry.ref];if(!record)throw new Error('componente compartilhado não registrado: '+entry.ref);
    const root=new URL('./',componentRegistryUrl());return{baseUrl:new URL(normalizeDir(record.path),root),sourceLabel:entry.ref,sourceType:'shared'};
  }
  if(!isSafeLocalSource(entry.source))throw new Error('source inseguro: '+entry.source);
  return{baseUrl:new URL(normalizeDir(entry.source),SCREEN_BASE_URL),sourceLabel:entry.source,sourceType:'local'};
}
async function mountSection(entry){
  const slotName=entry.slot;if(!STANDARD_SLOTS.includes(slotName))throw new Error(`slot desconhecido: ${slotName}`);
  const resolved=await resolveComponentEntry(entry);const baseUrl=resolved.baseUrl;const [manifest,template,css]=await Promise.all([fetchJson(new URL('section.json',baseUrl)),fetchText(new URL('template.html',baseUrl)),fetchOptionalText(new URL('style.css',baseUrl))]);
  
  const manifestErrors=validateManifest(manifest,entry,slotName);if(manifestErrors.length)throw new Error(manifestErrors.join(' | '));
  const id=entry.id||manifest.id;if(runtime.sections.has(id))throw new Error(`id duplicado em runtime: ${id}`);const slot=ROOT.querySelector(`[data-slot="${cssEscape(slotName)}"]`);if(!slot)throw new Error(`slot ausente no shell: ${slotName}`);
  const host=document.createElement('screen-section');Object.assign(host.dataset,{sectionId:id,sectionKind:manifest.kind||'content',sectionSource:resolved.sourceLabel,sourceType:resolved.sourceType,slot:slotName,order:String(entry.order??'')});
  const shadowRoot=host.attachShadow({mode:'open'});const mergedData=deepMerge(deepMerge(structuredClone(manifest.data||{}),structuredClone(runtime.data?.components?.[entry.id]||{})),entry.overrides||{});shadowRoot.innerHTML=`<style>${runtime.sectionBaseCss}\n${css}</style>${renderTemplate(template,{...mergedData,_screen:runtime.config.screen||{},_state:runtime.state,_assetBase:assetBaseUrl().href})}`;
  slot.appendChild(host);slot.dataset.active='true';runtime.shell.dataset[`has${toDatasetKey(slotName)}`]='true';runtime.sections.set(id,{id,host,shadow:shadowRoot,manifest,entry,data:mergedData,slot:slotName});wireSectionEvents(runtime.sections.get(id));
}

function validateManifest(manifest,entry,slotName){
  const errors=[];
  if(!isPlainObject(manifest)) return ['manifesto de seção precisa ser objeto'];
  if(!manifest.id) errors.push('manifest sem id');
  if(manifest.defaultSlot&&!STANDARD_SLOTS.includes(manifest.defaultSlot)) errors.push(`defaultSlot inválido: ${manifest.defaultSlot}`);
  if(manifest.defaultSlot&&manifest.defaultSlot!==slotName) errors.push(`defaultSlot ${manifest.defaultSlot} difere do grupo ${slotName}`);
  if(entry.id&&manifest.id&&entry.id!==manifest.id) errors.push(`id da composição (${entry.id}) difere do manifest (${manifest.id})`);
  return errors;
}

function handleSectionFailure(entry,error){
  const diagnostic={type:'section-load-error',sectionId:entry.id||null,source:entry.source||entry.ref||null,slot:entry.slot||null,required:entry.required===true,message:error?.message||String(error)};
  runtime.diagnostics.push(diagnostic);
  if(entry.required===true){ console.error('[Tela modular] Seção obrigatória indisponível:',diagnostic); renderRequiredSectionError(entry,error); }
  else console.warn('[Tela modular] Seção ignorada:',diagnostic);
}
function renderRequiredSectionError(entry,error){
  const slotName=STANDARD_SLOTS.includes(entry.slot)?entry.slot:'main'; const slot=ROOT.querySelector(`[data-slot="${cssEscape(slotName)}"]`)||ROOT.querySelector('[data-slot="main"]'); if(!slot)return;
  const host=document.createElement('div'); host.className='section-runtime-warning'; host.innerHTML=`<strong>Seção obrigatória indisponível</strong><span>${escapeHtml(entry.id||entry.source||'Seção')}</span><small>${escapeHtml(error?.message||String(error))}</small>`; slot.appendChild(host); slot.dataset.active='true';
}

function wireSectionEvents(section){
  section.shadow.addEventListener('click',event=>{
    const actionable=event.composedPath().find(node=>node instanceof Element&&(node.hasAttribute?.('data-action')||node.hasAttribute?.('data-goto'))); if(!actionable)return;
    const action=actionable.getAttribute('data-action'),goto=actionable.getAttribute('data-goto'); if(action)handleAction(action,actionable,section); if(goto)handleNavigation(goto,actionable,section);
  });
}
function handleAction(action,element,section){
  switch(action){
    case 'drawer.open': setOverlayOpen('drawer',true); break;
    case 'drawer.close': setOverlayOpen('drawer',false); break;
    case 'route.close': setOverlayOpen('route-modal',false); break;
    case 'online.toggle':
      runtime.state.online=!Boolean(runtime.state.online); refreshOnlineBindings(); showStatusToast(runtime.state.online?'Você está Online':'Você está Offline'); dispatchScreenEvent('state.change',{key:'online',value:runtime.state.online}); break;
    case 'appointments.tab':
      setAppointmentsTab(element?.dataset?.tab||'requested');
      break;
    default: dispatchScreenEvent(action,{sectionId:section.id,dataset:{...element.dataset}});
  }
}

function openTechnicalFlowModal(targetId){
  const map={
    'auth.sessao.caminho-login':'flow-login-choice',
    'advogado.assinatura.retorno-checkout':'flow-checkout-return'
  };
  const id=map[targetId]; if(!id)return false;
  const section=runtime.sections?.get?.(id)||[...(runtime.sections?.values?.()||[])].find(s=>s.id===id); if(!section)return false;
  const root=section.shadow.querySelector('[data-overlay-root]')||section.shadow.firstElementChild; if(!root)return false;
  if(!section.__technicalFlowWired){
    section.__technicalFlowWired=true;
    section.shadow.addEventListener('click',event=>{
      const node=event.composedPath().find(el=>el instanceof Element&&(el.hasAttribute?.('data-flow-close')||el.hasAttribute?.('data-flow-target'))); if(!node)return;
      if(node.hasAttribute('data-flow-close')){root.classList.remove('open');root.setAttribute('aria-hidden','true');return;}
      const target=node.getAttribute('data-flow-target'); if(target){root.classList.remove('open');root.setAttribute('aria-hidden','true');handleNavigation(target,node,section);}
    });
  }
  root.classList.add('open');root.setAttribute('aria-hidden','false');
  window.dispatchEvent(new CustomEvent('modular-screen:technical-flow',{detail:{from:runtime.config?.screen?.key||null,flowKey:targetId,modalId:id}}));
  return true;
}

function handleNavigation(targetId,element,section){
  if(openTechnicalFlowModal(targetId))return;
  const route=runtime.config.routes?.[targetId]||{};
  const detail={type:'navigate',from:runtime.config.screen?.key||null,target:targetId,action:(element?.dataset?.prototypeAction||element?.textContent||targetId).trim(),route,sectionId:section?.id||null,sourceDataset:{...(element?.dataset||{})}};
  window.dispatchEvent(new CustomEvent('modular-screen:navigate',{detail}));
  if(PROTOTYPE_MODE&&window.parent&&window.parent!==window){window.parent.postMessage({source:'modular-screen',...detail},location.origin);return}
  const modalSection=findSectionByKind('route-modal');
  if(modalSection){
    const title=modalSection.shadow.querySelector('[data-route-title]'),text=modalSection.shadow.querySelector('[data-route-text]'),code=modalSection.shadow.querySelector('[data-route-code]');
    if(title)title.textContent=route.name||`Ir para ${targetId}`; if(text)text.textContent=route.description||'Navegação simulada nesta tela isolada.'; if(code)code.textContent=route.flutterRoute||targetId; setOverlayOpen('route-modal',true);
  }
  if(window.parent&&window.parent!==window)window.parent.postMessage({source:'modular-screen',...detail},'*');
}
function setOverlayOpen(kind,open){ const section=findSectionByKind(kind); if(!section)return; const root=section.shadow.querySelector('[data-overlay-root]')||section.shadow.firstElementChild; if(!root)return; root.classList.toggle('open',Boolean(open)); root.setAttribute('aria-hidden',open?'false':'true'); }
function closeAllOverlays(){ setOverlayOpen('drawer',false); setOverlayOpen('route-modal',false); }
function findSectionByKind(kind){ return [...runtime.sections.values()].find(s=>s.manifest.kind===kind)||null; }
function refreshOnlineBindings(){
  const online=Boolean(runtime.state.online); const copy=(runtime.data?.runtime?.stateLabels||runtime.config.stateLabels)?.online||{on:{status:'Online',copy:'Recebendo novas solicitações'},off:{status:'Offline',copy:'Pausado para novas solicitações'}}; const current=online?copy.on:copy.off;
  for(const section of runtime.sections.values()){ section.shadow.querySelectorAll('[data-online-root]').forEach(el=>el.classList.toggle('is-offline',!online)); section.shadow.querySelectorAll('[data-online-status]').forEach(el=>el.textContent=current.status); section.shadow.querySelectorAll('[data-online-copy]').forEach(el=>el.textContent=current.copy); }
}
function setAppointmentsTab(tab){
  const allowed=['requested','ongoing','closed'];
  const selected=allowed.includes(tab)?tab:'requested';
  runtime.state.appointmentsTab=selected;
  for(const section of runtime.sections.values()){
    section.shadow.querySelectorAll('[data-action="appointments.tab"]').forEach(btn=>{
      const active=btn.dataset.tab===selected;
      btn.classList.toggle('is-active',active);
      btn.setAttribute('aria-selected',active?'true':'false');
      btn.tabIndex=active?0:-1;
    });
    section.shadow.querySelectorAll('[data-appointments-panel]').forEach(panel=>{
      panel.hidden=panel.dataset.appointmentsPanel!==selected;
    });
  }
  dispatchScreenEvent('state.change',{key:'appointmentsTab',value:selected});
}

function showStatusToast(message){
  const section=findSectionByKind('status-toast'); if(!section)return; const root=section.shadow.querySelector('[data-toast-root]'); const text=section.shadow.querySelector('[data-toast-text]'); if(!root)return; if(text)text.textContent=message; root.classList.add('show'); clearTimeout(runtime.toastTimer); runtime.toastTimer=setTimeout(()=>root.classList.remove('show'),1800);
}
function dispatchScreenEvent(type,detail={}){ window.dispatchEvent(new CustomEvent(`modular-screen:${type}`,{detail})); }

function renderTemplate(template,data){
  let output=template; const eachRe=/{{#each\s+([\w.$-]+)}}([\s\S]*?){{\/each}}/g; let guard=0;
  while(eachRe.test(output)&&guard++<50){ eachRe.lastIndex=0; output=output.replace(eachRe,(_,path,block)=>{ const items=getPath(data,path); if(!Array.isArray(items))return''; return items.map((item,index)=>renderTemplate(block,{...data,...(isPlainObject(item)?item:{value:item}),$index:index,$value:item})).join(''); }); }
  output=output.replace(/{{#if\s+([\w.$-]+)}}([\s\S]*?){{\/if}}/g,(_,path,block)=>getPath(data,path)?renderTemplate(block,data):'');
  return output.replace(/{{\s*([\w.$-]+)\s*}}/g,(_,path)=>escapeHtml(getPath(data,path)??''));
}
function getPath(obj,path){ if(path==='$value')return obj.$value; if(path==='$index')return obj.$index; return String(path).split('.').reduce((acc,key)=>acc==null?undefined:acc[key],obj); }
function deepMerge(base,patch){ if(!isPlainObject(base)||!isPlainObject(patch))return structuredClone(patch); for(const[key,value]of Object.entries(patch)){ if(isPlainObject(value)&&isPlainObject(base[key]))base[key]=deepMerge(base[key],value); else base[key]=structuredClone(value); } return base; }
function isPlainObject(v){return v!=null&&typeof v==='object'&&!Array.isArray(v)}
function normalizeOrder(v){const n=Number(v);return Number.isFinite(n)?n:1000}
function escapeHtml(v){return String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;')}
async function fetchJson(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`${r.status} ao carregar ${url.pathname}`);return r.json()}
async function fetchText(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`${r.status} ao carregar ${url.pathname}`);return r.text()}
async function fetchOptionalText(url){const r=await fetch(url,{cache:'no-store'});if(r.status===404)return'';if(!r.ok)throw new Error(`${r.status} ao carregar ${url.pathname}`);return r.text()}
function normalizeDir(p){return p.endsWith('/')?p:`${p}/`}
function camelToKebab(v){return v.replace(/[A-Z]/g,c=>`-${c.toLowerCase()}`)}
function cssEscape(v){return window.CSS?.escape?CSS.escape(v):String(v).replace(/["\\]/g,'\\$&')}
function toDatasetKey(v){return v.replace(/-([a-z])/g,(_,c)=>c.toUpperCase()).replace(/^./,c=>c.toUpperCase())}

function showBootError(error){ console.error(error); const fileMode=location.protocol==='file:'; ROOT.innerHTML=`<div class="screen-error"><h1>Não foi possível montar a tela</h1><p>${escapeHtml(error.message||String(error))}</p>${fileMode?'<p>Abra esta pasta por um servidor local. Ex.: <code>python -m http.server 8000</code></p>':''}</div>`; }
