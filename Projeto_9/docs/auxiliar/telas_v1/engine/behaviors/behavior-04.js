const ROOT=document.querySelector('#screen-root');
const SCREEN_URL=new URL(window.__SCREEN_CONTEXT__.configUrl,location.href);
const SCREEN_BASE_URL=new URL(window.__SCREEN_CONTEXT__.screenBaseUrl,location.href);
const STANDARD_SLOTS=Object.freeze(['header','main','navigation','menu','modal','popup','alert']);
const PROTOTYPE_MODE=new URL(location.href).searchParams.get('mode')==='prototype';
const runtime={config:null,sections:new Map(),state:{},diagnostics:[],shell:null,toastTimer:null};
boot().catch(showBootError);

async function boot(){
  ROOT.innerHTML='<div class="screen-loading">Montando tela…</div>';
  const config=await fetchJson(SCREEN_URL);const errors=validateScreenConfig(config);if(errors.length)throw new Error('configuração de tela inválida: '+errors.join(' | '));
  runtime.config=config;runtime.data=await loadScreenData(runtime.config);runtime.state=structuredClone(runtime.config.state||{});applyScreenMetadata(runtime.config);buildRuntimeShell();
  for(const entry of flattenComposition(runtime.config.composition||{})){try{await mountSection(entry)}catch(error){handleSectionFailure(entry,error)}}
  wireInteractions();refreshOnlineBindings();refreshSpecialtyBindings();refreshPresentialBindings();
  window.ModularScreen=Object.freeze({getConfig:()=>structuredClone(runtime.config),getData:()=>structuredClone(runtime.data||{}),getState:()=>structuredClone(runtime.state),listSections:()=>[...runtime.sections.keys()],getDiagnostics:()=>structuredClone(runtime.diagnostics),getStructure:()=>[...runtime.sections.values()].map(s=>({id:s.id,kind:s.manifest.kind||null,slot:s.slot,order:s.entry.order??null,source:s.entry.source||s.entry.ref})),emit:dispatchScreenEvent});
  window.dispatchEvent(new CustomEvent('modular-screen:ready',{detail:{screen:runtime.config.screen,feature:runtime.config.screen?.feature||null,slots:STANDARD_SLOTS,sections:window.ModularScreen.getStructure()}}));
}
function buildRuntimeShell(){const runtimeConfig=runtime.config.runtime||{};const tag=/^[a-z][a-z0-9-]*$/i.test(runtimeConfig.rootTag||'')?runtimeConfig.rootTag:'section';const rootClass=escapeHtml(runtimeConfig.rootClass||'');ROOT.innerHTML='<div class="screen-runtime" data-screen-runtime><'+tag+' class="'+rootClass+'" data-screen-root>'+STANDARD_SLOTS.map(slot=>'<div class="screen-slot screen-slot--'+slot+'" data-slot="'+slot+'"></div>').join('')+'</'+tag+'></div>';runtime.shell=ROOT.querySelector('[data-screen-runtime]')}
async function loadScreenData(config){
  if(!config?.dataRef)return {components:{}};
  const dataUrl=new URL(config.dataRef,SCREEN_URL);let data=await fetchJson(dataUrl);
  
  return data&&typeof data==='object'?data:{components:{}};
}
function applyScreenMetadata(config){document.title=runtime.data?.meta?.documentTitle||config.screen?.title||config.screen?.name||'Tela modular';document.body.dataset.screenKey=config.screen?.key||'';if(config.runtime?.bodyClass)document.body.className=config.runtime.bodyClass;for(const[name,value]of Object.entries(config.theme||{}))document.documentElement.style.setProperty(name.startsWith('--')?name:'--'+camelToKebab(name),String(value))}
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
  const slotName=entry.slot;if(!STANDARD_SLOTS.includes(slotName))throw new Error('slot desconhecido: '+slotName);const resolved=await resolveComponentEntry(entry);const baseUrl=resolved.baseUrl;
  const [manifest,template,css]=await Promise.all([fetchJson(new URL('section.json',baseUrl)),fetchText(new URL('template.html',baseUrl)),fetchOptionalText(new URL('style.css',baseUrl))]);
  
  const manifestErrors=validateManifest(manifest,entry,slotName);if(manifestErrors.length)throw new Error(manifestErrors.join(' | '));const slot=ROOT.querySelector('[data-slot="'+cssEscape(slotName)+'"]');const host=document.createElement('screen-section');
  Object.assign(host.dataset,{sectionId:entry.id,sectionKind:manifest.kind||'content',sectionSource:resolved.sourceLabel,sourceType:resolved.sourceType,slot:slotName,order:String(entry.order??'')});host.innerHTML=renderTemplate(template,{...deepMerge(deepMerge(structuredClone(manifest.data||{}),structuredClone(runtime.data?.components?.[entry.id]||{})),entry.overrides||{}),_assetBase:assetBaseUrl().href});
  if(css){const style=document.createElement('style');style.dataset.sectionStyle=entry.id;style.textContent=css;document.head.appendChild(style)}slot.appendChild(host);slot.dataset.active='true';runtime.sections.set(entry.id,{id:entry.id,host,shadow:host,manifest,entry,slot:slotName});
}

function wireInteractions(){ROOT.addEventListener('click',event=>{const el=event.target.closest('button,a,[data-action],[data-goto],[data-next],[data-menu-open],[data-menu-close],[data-online-toggle],[data-request-tab],[data-client-toggle],[data-action-message],[data-client-message],[data-legal],[data-client-need-type],[data-professional-home-placeholder],[data-submit-professional],[data-start-onboarding],[data-specialty-select-all],[data-specialty-clear],[data-specialty-remove],[data-save-preferences]');if(!el)return;
  if(el.matches('[data-aj08-close]')||el.dataset.action==='route.close'){event.preventDefault();setOverlayOpen('route-modal',false);return}
  if(el.matches('[data-menu-open]')||el.dataset.action==='drawer.open'){event.preventDefault();setOverlayOpen('drawer',true);return}
  if(el.matches('[data-menu-close]')||el.dataset.action==='drawer.close'){event.preventDefault();setOverlayOpen('drawer',false);return}
  if(el.matches('[data-online-toggle]')||el.dataset.action==='online.toggle'){event.preventDefault();runtime.state.online=!Boolean(runtime.state.online);refreshOnlineBindings();toast(runtime.state.online?'Status alterado para Online.':'Status alterado para Offline.');dispatchScreenEvent('state.change',{key:'online',value:runtime.state.online});return}
  if(el.matches('[data-request-tab]')){event.preventDefault();const value=el.dataset.requestTab;ROOT.querySelectorAll('[data-request-tab]').forEach(node=>node.classList.toggle('active',node===el));ROOT.querySelectorAll('[data-request-state]').forEach(node=>node.hidden=node.dataset.requestState!==value);const empty=ROOT.querySelector('[data-request-empty]');if(empty)empty.hidden=value==='new';return}
  if(el.matches('[data-client-toggle]')){event.preventDefault();el.classList.toggle('active');return}
  if(el.matches('[data-action-message],[data-client-message]')){event.preventDefault();toast(el.dataset.actionMessage||el.dataset.clientMessage||'Ação simulada nesta tela.');if(el.dataset.goto)handleNavigation(el.dataset.goto,undefined,(el.textContent||'').trim());return}
  if(el.matches('[data-legal]')){event.preventDefault();showSimulation('Documento local',(el.dataset.legal||'Documento')+': conteúdo simulado no pacote isolado.');return}
  if(el.matches('[data-client-need-type]')){event.preventDefault();handleNavigation(el.dataset.goto,'Tipo de necessidade selecionado: '+el.dataset.clientNeedType+'.',(el.textContent||'').trim());return}
  if(el.matches('[data-professional-home-placeholder]')){event.preventDefault();handleNavigation('advogado.home_advogado',undefined,(el.textContent||'').trim());return}
  if(el.matches('[data-submit-professional]')){event.preventDefault();handleNavigation('advogado.onboarding.validacao_profissional','O perfil seria enviado para validação.',(el.textContent||'').trim());return}
  if(el.matches('[data-start-onboarding]')){event.preventDefault();showSimulation('Fluxo condicional','O tipo de conta define o onboarding.','Cliente → cliente.onboarding.localizacao · Advogado → advogado.onboarding.dados_academicos');return}
  if(el.dataset.goto){event.preventDefault();setOverlayOpen('drawer',false);handleNavigation(el.dataset.goto,undefined,(el.textContent||'').trim());return}
  if(el.tagName==='BUTTON'&&el.type!=='submit'&&!el.closest('.aj08-route-modal')){const label=(el.textContent||'').trim();if(label&&!['Fechar','×'].includes(label)){event.preventDefault();toast('Ação local simulada: '+label)}}
 });
 ROOT.addEventListener('submit',event=>{event.preventDefault();const submitter=event.submitter;if(submitter?.dataset.next){handleNavigation(submitter.dataset.next,'O formulário seria validado e a jornada seguiria.',(submitter.textContent||'').trim());return}if(event.target.matches('[data-office-decision-form]')){const intent=event.target.querySelector('[name="officeIntent"]:checked')?.value;handleNavigation(intent==='create'?'escritorio.onboarding.cadastro_escritorio':'advogado.onboarding.revisao_profissional','A decisão sobre Escritório define o próximo passo.',intent==='create'?'Criar escritório':'Continuar sem escritório');return}if(event.target.id==='login-form'){handleNavigation('auth.sessao.caminho-login','Após autenticação, o fluxo decide o próximo destino.',(submitter?.textContent||'Entrar').trim());return}toast('Formulário processado apenas como simulação.')});
 ROOT.addEventListener('change',event=>{if(event.target.matches('[data-reg-file],[data-pro-file]')){const file=event.target.files?.[0]?.name||'Nenhum arquivo selecionado';const target=ROOT.querySelector(event.target.matches('[data-pro-file]')?'[data-pro-file-name]':'[data-file-name]');if(target)target.textContent=file}if(event.target.matches('[data-practice-area]')){refreshSpecialtyBindings()}if(event.target.matches('[data-modality]')){refreshPresentialBindings()}});
 ROOT.addEventListener('input',event=>{if(event.target.matches('[data-radius-range]')){const value=ROOT.querySelector('[data-radius-value]');if(value)value.textContent=event.target.value}});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){setOverlayOpen('drawer',false);setOverlayOpen('route-modal',false)}})
}

function refreshSpecialtyBindings(){
  const selected=[...ROOT.querySelectorAll('[data-practice-area]:checked')].map(input=>input.value);
  runtime.state.specialties=selected;
  const count=ROOT.querySelector('[data-specialty-count]');
  if(count)count.textContent=selected.length+' selecionada'+(selected.length===1?'':'s');
  const chips=ROOT.querySelector('[data-specialty-chips]');
  const empty=ROOT.querySelector('[data-specialty-empty]');
  if(chips){
    chips.innerHTML='';
    selected.forEach(value=>{
      const chip=document.createElement('span');chip.className='specialty-chip';
      const label=document.createElement('span');label.textContent=value;
      const button=document.createElement('button');button.type='button';button.dataset.specialtyRemove=value;button.textContent='×';button.setAttribute('aria-label','Remover '+value);
      chip.append(label,button);chips.append(chip);
    });
  }
  if(empty)empty.hidden=selected.length>0;
  dispatchScreenEvent('state.change',{key:'specialties',value:selected});
}
function refreshPresentialBindings(){
  const input=ROOT.querySelector('[data-modality="presential"]');
  const active=Boolean(input?.checked);
  const card=ROOT.querySelector('[data-presential-region]');
  const badge=ROOT.querySelector('[data-presential-badge]');
  if(card)card.classList.toggle('disabled',!active);
  if(badge)badge.textContent=active?'Ativa':'Inativa';
  runtime.state.modalities={
    online:Boolean(ROOT.querySelector('[data-modality="online"]')?.checked),
    presential:active
  };
}
function collectPreferences(){
  const radius=Number(ROOT.querySelector('[data-radius-km]')?.value||0);
  return {
    availableForNewRequests:Boolean(runtime.state.online),
    modalities:{
      online:Boolean(ROOT.querySelector('[data-modality="online"]')?.checked),
      presential:Boolean(ROOT.querySelector('[data-modality="presential"]')?.checked)
    },
    city:(ROOT.querySelector('[data-city]')?.value||'').trim(),
    uf:ROOT.querySelector('[data-uf]')?.value||'',
    regionReference:(ROOT.querySelector('[data-region-reference]')?.value||'').trim(),
    serviceRadiusKm:radius,
    specialties:[...ROOT.querySelectorAll('[data-practice-area]:checked')].map(input=>input.value)
  };
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
      const target=node.getAttribute('data-flow-target'); if(target){root.classList.remove('open');root.setAttribute('aria-hidden','true');handleNavigation(target,undefined,(node.textContent||'').trim());}
    });
  }
  root.classList.add('open');root.setAttribute('aria-hidden','false');
  window.dispatchEvent(new CustomEvent('modular-screen:technical-flow',{detail:{from:runtime.config?.screen?.key||null,flowKey:targetId,modalId:id}}));
  return true;
}

function handleNavigation(targetId,reason='Esta ação sairia da tela atual no aplicativo.',actionLabel=''){
  if(openTechnicalFlowModal(targetId))return;const route=runtime.config.routes?.[targetId]||{};const detail={type:'navigate',from:runtime.config.screen?.key||null,target:targetId,action:actionLabel,route};window.dispatchEvent(new CustomEvent('modular-screen:navigate',{detail}));if(PROTOTYPE_MODE&&window.parent&&window.parent!==window){window.parent.postMessage({source:'modular-screen',...detail},location.origin);return}showSimulation('Navegação simulada',reason,targetLabel(targetId,route));if(window.parent&&window.parent!==window)window.parent.postMessage({source:'modular-screen',...detail},'*')}
function targetLabel(id,route){const suffix=route.flutterRoute?' · Flutter: '+route.flutterRoute:'';return route.name?id+' — '+route.name+suffix:id||'ação local'}
function showSimulation(title,text,code=''){const section=findSectionByKind('route-modal');const scope=section?.host||ROOT;const modal=scope.querySelector('.aj08-route-modal,[data-overlay-root]');if(!modal)return toast(text);const titleNode=modal.querySelector('[data-route-title]'),textNode=modal.querySelector('[data-route-text]'),codeNode=modal.querySelector('[data-route-code]');if(titleNode)titleNode.textContent=title;if(textNode)textNode.textContent=text;if(codeNode){codeNode.textContent=code;codeNode.hidden=!code}modal.classList.add('open');modal.setAttribute('aria-hidden','false')}
function setOverlayOpen(kind,open){const section=findSectionByKind(kind);if(!section)return;const root=kind==='drawer'?section.host.querySelector('.prototype-drawer,[data-overlay-root]'):section.host.querySelector('.aj08-route-modal,[data-overlay-root]');if(!root)return;root.classList.toggle('open',Boolean(open));root.setAttribute('aria-hidden',open?'false':'true')}
function findSectionByKind(kind){return[...runtime.sections.values()].find(section=>section.manifest.kind===kind)||null}
function toast(message){const target=ROOT.querySelector('.op-toast,.form-status,.status,[data-toast-text]');if(!target){showSimulationFallback(message);return}target.textContent=message;target.classList.add('show');clearTimeout(runtime.toastTimer);runtime.toastTimer=setTimeout(()=>target.classList.remove('show'),2200)}
function showSimulationFallback(message){console.info('[Tela modular]',message)}
function refreshOnlineBindings(){const online=Boolean(runtime.state.online);ROOT.querySelectorAll('[data-online-toggle],[data-home-online-card],[data-online-root]').forEach(node=>node.classList.toggle('is-offline',!online));ROOT.querySelectorAll('[data-online-status]').forEach(node=>node.textContent=online?'Online':'Offline');ROOT.querySelectorAll('[data-online-copy]').forEach(node=>node.textContent=online?'Recebendo novas solicitações':'Novas solicitações pausadas');const availability=ROOT.querySelector('.availability-row');if(availability)availability.classList.toggle('is-offline',!runtime.state.online);}
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

function flattenComposition(composition){const entries=[];let index=0;for(const slot of STANDARD_SLOTS)for(const entry of composition?.[slot]||[])if(entry&&entry.enabled!==false)entries.push({...entry,slot,__index:index++});return entries.sort((a,b)=>STANDARD_SLOTS.indexOf(a.slot)-STANDARD_SLOTS.indexOf(b.slot)||normalizeOrder(a.order)-normalizeOrder(b.order)||a.__index-b.__index)}
function validateManifest(manifest,entry,slotName){
  const errors=[];
  if(!isPlainObject(manifest)) return ['manifesto de seção precisa ser objeto'];
  if(!manifest.id) errors.push('manifest sem id');
  if(manifest.defaultSlot&&!STANDARD_SLOTS.includes(manifest.defaultSlot)) errors.push('defaultSlot inválido: '+manifest.defaultSlot);
  if(manifest.defaultSlot&&manifest.defaultSlot!==slotName) errors.push('defaultSlot '+manifest.defaultSlot+' difere do grupo '+slotName);
  if(entry.id&&manifest.id&&entry.id!==manifest.id) errors.push('id da composição ('+entry.id+') difere do manifest ('+manifest.id+')');
  return errors;
}
function handleSectionFailure(entry,error){const diagnostic={type:'section-load-error',sectionId:entry.id||null,source:entry.source||entry.ref||null,slot:entry.slot||null,required:entry.required===true,message:error?.message||String(error)};runtime.diagnostics.push(diagnostic);console.error('[Tela modular] '+diagnostic.message);if(entry.required===true){const slot=ROOT.querySelector('[data-slot="'+cssEscape(entry.slot||'main')+'"]');if(slot){const warning=document.createElement('div');warning.className='section-runtime-warning';warning.textContent='Seção obrigatória indisponível: '+diagnostic.message;slot.appendChild(warning)}}}
function dispatchScreenEvent(type,detail={}){window.dispatchEvent(new CustomEvent('modular-screen:'+type,{detail}))}
function renderTemplate(template,data){return template.replace(/{{\s*([\w.$-]+)\s*}}/g,(_,key)=>escapeHtml(getPath(data,key)??''))}
function getPath(object,key){return String(key).split('.').reduce((value,part)=>value==null?undefined:value[part],object)}
function deepMerge(base,patch){if(!isPlainObject(base)||!isPlainObject(patch))return structuredClone(patch);for(const[key,value]of Object.entries(patch)){if(isPlainObject(value)&&isPlainObject(base[key]))base[key]=deepMerge(base[key],value);else base[key]=structuredClone(value)}return base}
function isPlainObject(value){return value!=null&&typeof value==='object'&&!Array.isArray(value)}function normalizeOrder(value){const number=Number(value);return Number.isFinite(number)?number:1000}function escapeHtml(value){return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;')}async function fetchJson(url){const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw new Error(response.status+' ao carregar '+url.pathname);return response.json()}async function fetchText(url){const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw new Error(response.status+' ao carregar '+url.pathname);return response.text()}async function fetchOptionalText(url){const response=await fetch(url,{cache:'no-store'});if(response.status===404)return'';if(!response.ok)throw new Error(response.status+' ao carregar '+url.pathname);return response.text()}function normalizeDir(value){return value.endsWith('/')?value:value+'/'}function camelToKebab(value){return value.replace(/[A-Z]/g,char=>'-'+char.toLowerCase())}function cssEscape(value){return window.CSS?.escape?CSS.escape(value):String(value).replace(/["\\]/g,'\\$&')}

function showBootError(error){console.error(error);ROOT.innerHTML='<div class="screen-error"><h1>Não foi possível montar a tela</h1><p>'+escapeHtml(error.message||String(error))+'</p></div>'}
