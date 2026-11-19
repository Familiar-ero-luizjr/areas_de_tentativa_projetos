const ROOT=document.querySelector('#screen-root');
const params=new URL(location.href).searchParams;
const key=(params.get('screen')||'').trim();
let MASTER=null;
let ORIGINAL_FETCH=window.fetch.bind(window);

if(!key||!key.split('.').every(x=>/^[A-Za-z0-9_-]+$/.test(x))){
  ROOT.innerHTML='<div class="screen-error"><h1>Tela não informada</h1><p>Use <code>?screen=feature.secao.tela</code>.</p><p><a href="./index.html">Voltar ao catálogo</a></p></div>';
}else{
  bootCentral().catch(showError);
}

async function bootCentral(){
  MASTER=await fetchJson('./catalogo/catalogo_master.json');
  const record=MASTER?.entities?.screens?.[key];
  if(!record)throw new Error(`Tela não registrada no Catálogo Mestre: ${key}`);
  const cfg=record?.engineering?.screenConfig;
  if(!cfg?.screen?.key)throw new Error(`Configuração ausente no Catálogo Mestre: ${key}`);
  if(cfg.screen.key!==key)throw new Error(`screen.key divergente no catálogo: esperado ${key}`);
  const professionalContext=prepareProfessionalContext(record,cfg);
  window.__PROFESSIONAL_CONTEXT__=Object.freeze({access:professionalContext.access,capabilities:{...professionalContext.capabilities}});
  if(!professionalContext.allowed){renderProfessionalAccessBlocked(record,professionalContext);return;}
  installCatalogAdapter(record,cfg);
  installProfessionalNavigationGuard(professionalContext);
  const behavior=cfg?.runtime?.behaviorProfile||'behavior-01';
  const shell=cfg?.runtime?.shellProfile||'shell-01';
  injectCss(`./engine/shell/${shell}.css`);
  window.__SCREEN_CONTEXT__={
    key,
    configUrl:`./catalogo/runtime/${encodeURIComponent(key)}/__catalog_screen__.json`,
    screenBaseUrl:`./${record.render.basePath}/`
  };
  const engineVersion=new URL(import.meta.url).searchParams.get('v')||'1';
  await import(`./behaviors/${behavior}.js?v=${encodeURIComponent(engineVersion)}`);
}

function installCatalogAdapter(screenRecord,cfg){
  const componentRegistry={schemaVersion:2,source:'catalogo/catalogo_master.json',components:{}};
  for(const [ref,component] of Object.entries(MASTER?.entities?.components||{})){
    const base=String(component?.render?.basePath||'').replace(/^components\//,'');
    componentRegistry.components[ref]={
      path:base,
      slot:component?.identity?.slot||component?.render?.manifest?.defaultSlot||null,
      id:component?.render?.manifest?.id||null,
      name:component?.identity?.name||component?.render?.manifest?.name||ref
    };
  }
  const manifestByPath=new Map();
  for(const component of Object.values(MASTER?.entities?.components||{})){
    if(component?.render?.basePath&&component?.render?.manifest)manifestByPath.set(trimPath(component.render.basePath),component.render.manifest);
  }
  for(const local of Object.values(screenRecord?.render?.localComponents||{})){
    if(local?.render?.basePath&&local?.render?.manifest)manifestByPath.set(trimPath(local.render.basePath),local.render.manifest);
  }
  window.__CATALOG_FETCH__=async function(input,init){
    const source=input instanceof URL?input.href:typeof input==='string'?input:input.url;
    const url=new URL(source,location.href);
    const pathname=decodeURIComponent(url.pathname);
    if(pathname.endsWith('/__catalog_screen__.json'))return jsonResponse(cfg);
    if(pathname.endsWith('/__catalog_data__.json'))return jsonResponse(screenRecord.content||{components:{}});
    if(pathname.endsWith('/components/__registry__.json'))return jsonResponse(componentRegistry);
    if(pathname.endsWith('/section.json')){
      const base=trimPath(pathname.slice(0,-'/section.json'.length));
      let hit=null;
      for(const [rel,manifest] of manifestByPath){if(base.endsWith('/'+rel)||base===rel){hit=manifest;break}}
      if(hit)return jsonResponse(hit);
      return new Response(JSON.stringify({error:'Manifesto não encontrado no Catálogo Mestre'}),{status:404,headers:{'Content-Type':'application/json'}});
    }
    return ORIGINAL_FETCH(input,init);
  };
  // Alguns módulos capturam `fetch` no escopo próprio. O adaptador explícito
  // acima é a fonte canônica para toda leitura virtual do Catálogo.
  window.fetch=window.__CATALOG_FETCH__;
}
function professionalCapabilities(access){const enabled=access==='enabled';return{canActProfessionally:enabled,canReceiveRequests:enabled,canToggleOnline:enabled,canValidateOab:!enabled}}
function resolveProfessionalAccess(cfg){const query=params.get('professionalAccess');if(query==='restricted'||query==='enabled')return query;const configured=cfg?.state?.professionalAccess;return configured==='restricted'||configured==='enabled'?configured:'enabled'}
function capabilityAllowed(capabilities,capability){return !capability||capabilities?.[capability]===true}
function prepareProfessionalContext(record,cfg){
  const access=resolveProfessionalAccess(cfg),capabilities=professionalCapabilities(access),requiredCapability=record?.contract?.requiredCapability||null;
  cfg.state={...(cfg.state||{}),professionalAccess:access};
  const drawer=record?.content?.components?.drawer;
  if(drawer){
    drawer.canActProfessionally=capabilities.canActProfessionally;
    drawer.canReceiveRequests=capabilities.canReceiveRequests;
    drawer.canToggleOnline=capabilities.canToggleOnline;
    drawer.canValidateOab=capabilities.canValidateOab;
    if(Array.isArray(drawer.items)&&cfg?.runtime?.behaviorProfile!=='behavior-06')drawer.items=drawer.items.filter(item=>capabilityAllowed(capabilities,item?.capability));
    if(!capabilities.canToggleOnline)drawer.showOnline=false;
  }
  return{access,capabilities,requiredCapability,allowed:capabilityAllowed(capabilities,requiredCapability)};
}
function installProfessionalNavigationGuard(context){
  document.addEventListener('click',event=>{
    const node=event.composedPath?.().find(value=>value instanceof Element&&value.hasAttribute?.('data-goto'));if(!node)return;
    const target=node.getAttribute('data-goto');if(!target)return;
    const required=MASTER?.entities?.screens?.[target]?.contract?.requiredCapability||node.getAttribute('data-professional-capability')||null;
    if(capabilityAllowed(context.capabilities,required))return;
    event.preventDefault();event.stopImmediatePropagation();
    notifyProfessionalBlocked(target,required);
  },true);
}
function notifyProfessionalBlocked(target,capability){
  const targetName=MASTER?.entities?.screens?.[target]?.identity?.name||target;
  const message=`Acesso indisponível enquanto o perfil profissional não estiver habilitado: ${targetName}.`;
  window.dispatchEvent(new CustomEvent('professional-access:blocked',{detail:{target,capability,message}}));
  if(window.parent&&window.parent!==window)window.parent.postMessage({source:'modular-screen',type:'capability-blocked',target,capability,message},location.origin);
}
function renderProfessionalAccessBlocked(record,context){
  const name=record?.identity?.name||key;
  ROOT.innerHTML=`<div class="screen-error"><h1>Recurso indisponível</h1><p>${escapeHtml(name)} depende de uma capacidade profissional que ainda não está habilitada.</p><p>Use a Home profissional ou a validação da OAB para continuar a simulação.</p></div>`;
  if(window.parent&&window.parent!==window)window.parent.postMessage({source:'modular-screen',type:'capability-blocked',target:key,capability:context.requiredCapability,message:`Acesso indisponível enquanto o perfil profissional não estiver habilitado: ${name}.`},location.origin);
}
function jsonResponse(value){return new Response(JSON.stringify(value),{status:200,headers:{'Content-Type':'application/json;charset=utf-8','Cache-Control':'no-store'}})}
function trimPath(value){return String(value||'').replaceAll('\\','/').replace(/^\/+|\/+$/g,'')}
function injectCss(href){const link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.appendChild(link)}
async function fetchJson(url){const r=await ORIGINAL_FETCH(url,{cache:'no-store'});if(!r.ok)throw new Error(`${r.status} ao carregar ${url}`);return r.json()}
function showError(error){console.error(error);ROOT.innerHTML=`<div class="screen-error"><h1>Não foi possível montar a tela</h1><p>${escapeHtml(String(error?.message||error))}</p><p><a href="./index.html">Voltar ao catálogo</a></p></div>`}
function escapeHtml(value){return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;')}
