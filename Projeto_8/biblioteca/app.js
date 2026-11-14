(async function(){
'use strict';
const LAB_BASE_URL=new URL('.',document.currentScript.src);
const LAB_MANIFEST=[{"id":"auth.inicializacao.splash","titulo":"Splash","tipo":"tela","path":"Splash/documento.json","ordem":1,"descricao":"Abertura do aplicativo."},{"id":"auth.inicializacao.boas_vindas","titulo":"Boas-vindas","tipo":"tela","path":"Boas-vindas/documento.json","ordem":2,"descricao":"Tela Boas-vindas na coleção de jornadas."},{"id":"auth.sessao.entrar","titulo":"Entrar","tipo":"tela","path":"Entrar/documento.json","ordem":3,"descricao":"Tela Entrar na coleção de jornadas."},{"id":"advogado.home","titulo":"Home Advogado","tipo":"tela","path":"Home Advogado/documento.json","ordem":4,"descricao":"A Home é sempre a mesma (/professional/home). O estado da OAB não troca a tela: ele recalcula capabilities e, com isso, muda menu, conteúdo principal e ações disponíveis."},{"id":"cliente.home.inicio","titulo":"Home Cliente","tipo":"tela","path":"Home Cliente/documento.json","ordem":5,"descricao":"Hub do Cliente: as funções jurídicas originais continuam disponíveis, e Estudante é item permanente no menu."},{"id":"admin.home.dashboard","titulo":"Home Administrador","tipo":"tela","path":"Home Administrador/documento.json","ordem":6,"descricao":"Ponto central da operação administrativa. Os módulos exibidos devem respeitar as permissões que forem definidas para o Administrador."},{"id":"global.componentes","titulo":"Global","tipo":"biblioteca","path":"Global/Componentes/documento.json","ordem":7,"descricao":"Componentes disponíveis nas telas desta biblioteca."}];
async function LAB_LOAD_DOCS(){
  const fetchDocs=async ()=>Promise.all(LAB_MANIFEST.map(async entry=>{
    const response=await fetch(new URL(entry.path,LAB_BASE_URL),{cache:'no-cache'});
    if(!response.ok)throw new Error('HTTP '+response.status+' · '+entry.path);
    return response.json();
  }));
  try{return await fetchDocs()}
  catch(error){
    const body=document.getElementById('mainArea');
    body.innerHTML='';
    const warn=document.createElement('section');warn.className='section-card';
    const title=document.createElement('h2');title.textContent='Carregar documentos locais';warn.append(title);
    const message=document.createElement('p');message.textContent='Os arquivos JSON separados precisam ser carregados por um servidor HTTP. Se você abriu pelo disco, selecione a pasta BIBLIOTECA para abrir os arquivos localmente.';warn.append(message);
    const input=document.createElement('input');input.type='file';input.multiple=true;input.setAttribute('webkitdirectory','');input.setAttribute('directory','');input.setAttribute('aria-label','Selecionar pasta BIBLIOTECA');warn.append(input);
    const result=document.createElement('p');result.className='smallprint';warn.append(result);body.append(warn);
    return new Promise((resolve,reject)=>{
      input.onchange=async ()=>{
        try{
          const selected=Array.from(input.files||[]);const docs=[];
          for(const entry of LAB_MANIFEST){
            const expected=entry.path.replaceAll('\\','/');
            const matched=selected.find(f=>(f.webkitRelativePath||f.name).replaceAll('\\','/').endsWith('/'+expected));
            if(!matched)throw new Error('Não encontrado: '+expected);
            docs.push(JSON.parse(await matched.text()));
          }
          warn.remove();resolve(docs);
        }catch(e){result.textContent=e.message}
      };
    });
  }
}
const LAB_DOCUMENTS=await LAB_LOAD_DOCS();
const LAB_GLOBAL_DOCUMENT=LAB_DOCUMENTS[6];
const LAB_DATA={itens:LAB_MANIFEST.map((m,i)=>({id:m.id,titulo:m.titulo,tipo:m.tipo,descricao:m.descricao,campos:{ordem:m.ordem,arquivoLocal:m.path,fontes:i===6?[]:[{id:m.id+'.documento',titulo:'Documento local',arquivo:m.path,caminho:m.path,conteudo:LAB_DOCUMENTS[i]}]}}))};
/* @ARQUIVO: comportamentos/01-estado-e-dados.js */
/* @REGIAO DADOS · identidade, índices e estado local */
'use strict';
// Dados carregados dos documento.json de cada tela.
const LAB_ITEMS=LAB_DATA.itens;
const LAB_SCREEN_ITEMS=LAB_ITEMS.filter(item=>item.tipo==='tela');
const LAB_BY_ID=new Map(LAB_ITEMS.map(x=>[x.id,x]));
const LAB_SCREEN_BY_ID=new Map(LAB_SCREEN_ITEMS.map(x=>[x.id,x.campos.fontes[0].conteudo]));
const LAB_STATE={screenId:LAB_SCREEN_ITEMS[0].id,major:'tela',minor:'visuais',sourceIdx:0,compSourceIdx:0,viewport:'mobile',journey:'cliente',visualState:'padrao',compIndex:0,globalCategory:'Todos',globalSelection:0,jsonBlock:'',jsonQuery:'',online:true};
const LAB_SOURCE_NAMES={cliente:'Cliente',advogado:'Advogado',admin:'Administrador'};
const LAB_E=x=>String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const LAB_STRING=x=>x===null?'null':typeof x==='string'?x:JSON.stringify(x);
const LAB_COUNT=x=>Array.isArray(x)?x.length:x&&typeof x==='object'?Object.keys(x).length:0;
const LAB_IS_GLOBAL=()=>LAB_STATE.screenId==='global.componentes';
const LAB_CURRENT_ITEM=()=>LAB_BY_ID.get(LAB_STATE.screenId);
const LAB_CURRENT_SCREEN=()=>LAB_SCREEN_BY_ID.get(LAB_STATE.screenId);
const LAB_CURRENT_SOURCES=()=>LAB_CURRENT_ITEM()?.campos?.fontes||[];
const LAB_CURRENT_SOURCE=()=>LAB_CURRENT_SOURCES()[Math.min(LAB_STATE.sourceIdx,LAB_CURRENT_SOURCES().length-1)]||null;
function LAB_STATE_OPTIONS(){const s=LAB_CURRENT_SCREEN();if(!s)return [];let states=s.tela.estados?.possiveis||[];if(!Array.isArray(states))states=[];return states.filter(s=>!s.jornadasRefs||s.jornadasRefs.includes(LAB_STATE.journey));}
function LAB_COMPONENTS(){const s=LAB_CURRENT_SCREEN();if(!s)return [];const ids=s.tela.componentes?.instanciasRefs||{};const composed=s.tela.estrutura?.html?.composicao||{};return Object.entries(ids).map(([slot,id])=>({id,slot,record:s.componentes[id],order:composed[slot]?.ordem??99,section:composed[slot]?.slot||slot})).filter(x=>x.record).sort((a,b)=>a.order-b.order)}
function LAB_COMP_NAME(x){return x.name||x.record?.identidade?.nomeExibicao||x.record?.identidade?.nome||x.id}
function LAB_COMP_COUNT(x){return Object.keys(x.record?.estrutura?.html?.elementos||{}).length}
function LAB_COMPONENT_CAT(x){let k=x.id.toLowerCase(),n=LAB_COMP_NAME(x).toLowerCase(),slot=(x.section||'').toLowerCase();if(/header|titlebar|cabeçalho|cabecalho|topbar|title|barra de título/.test(k+' '+n+' '+slot))return 'Headers';if(/drawer|menu|navegação lateral/.test(k+' '+n+' '+slot))return 'Menus';if(/modal|dialog|overlay|route-modal/.test(k+' '+n+' '+slot))return 'Modais';if(/popup|toast|mensagem/.test(k+' '+n+' '+slot))return 'Popups';if(/login|formul|input|campo/.test(k+' '+n))return 'Formulários';return 'Outros'}
const LAB_GLOBAL_COMPONENTS=[];
const LAB_GLOBAL_SEEN=new Set();
for(const item of LAB_SCREEN_ITEMS){const screen=LAB_SCREEN_BY_ID.get(item.id);for(const c of Object.values(screen.componentes||{})){
 let id=c.identidade?.id||Object.entries(screen.componentes).find(([,v])=>v===c)?.[0];
 const key=id; if(LAB_GLOBAL_SEEN.has(key))continue;LAB_GLOBAL_SEEN.add(key);
 const resolved={id,slot:'',record:c,section:''};const actual=LAB_COMPONENTS_FOR(item.id).find(x=>x.id===id);if(actual)Object.assign(resolved,{slot:actual.slot,section:actual.section});
 LAB_GLOBAL_COMPONENTS.push({id:'component:'+key,kind:'component',name:c.identidade?.nomeExibicao||c.identidade?.nome||id,sourceScreen:item.id,compId:key,category:LAB_COMPONENT_CAT(resolved),base:resolved});
}}
function LAB_COMPONENTS_FOR(screenId){const r=LAB_SCREEN_BY_ID.get(screenId);const ids=r?.tela?.componentes?.instanciasRefs||{};const compose=r?.tela?.estrutura?.html?.composicao||{};return Object.entries(ids).map(([slot,id])=>({id,slot,record:r.componentes[id],section:compose[slot]?.slot||slot})).filter(x=>x.record)}
/* Elementos atômicos existentes são candidatos a padrões, sem alterar contratos de origem. */
const uniqueAtomic=new Set();
for(const item of LAB_SCREEN_ITEMS){const r=LAB_SCREEN_BY_ID.get(item.id);for(const [compId,c] of Object.entries(r.componentes||{})){
 for(const [elementId,el] of Object.entries(c.estrutura?.html?.elementos||{})){
  if(!['button','input','select'].includes(String(el.tag).toLowerCase()))continue;
  const text=String(el.texto||'').trim().replace(/\s+/g,' ').slice(0,80),atr=el.atributos||{},tag=el.tag.toLowerCase();
  const label=text||atr['aria-label']||atr.placeholder||atr.type||elementId;
  const signature=tag+'|'+label.toLowerCase();if(uniqueAtomic.has(signature))continue;uniqueAtomic.add(signature);
  const cat=tag==='button'?'Botões':'Campos';
  LAB_GLOBAL_COMPONENTS.push({id:'element:'+item.id+':'+compId+':'+elementId,kind:'element',name:label,sourceScreen:item.id,compId,elementId,tag,category:cat,base:el});
 }
}}
function LAB_GLOBAL_LIST(){return LAB_GLOBAL_COMPONENTS.filter(c=>LAB_STATE.globalCategory==='Todos'||c.category===LAB_STATE.globalCategory)}
function LAB_SOURCE_ORIGIN(){return LAB_IS_GLOBAL()?'Global/Componentes/documento.json':LAB_CURRENT_ITEM()?.campos?.arquivoLocal||'documento.json';}
let LAB_TOAST_TIMEOUT=null;
function LAB_TOAST(message){const el=document.getElementById('labToast');el.textContent=message;el.classList.add('show');clearTimeout(LAB_TOAST_TIMEOUT);LAB_TOAST_TIMEOUT=setTimeout(()=>el.classList.remove('show'),3000)}

function LAB_COMPONENTS_ACTIVE(){return LAB_COMPONENTS();}

/* @ARQUIVO: comportamentos/02-visuais.js */
/* @REGIAO VISUAL · renderização das estruturas de tela/componente a partir dos JSONs originais */
const LAB_SVG_NS='http://www.w3.org/2000/svg';
const LAB_SVG_TAGS=new Set(['svg','path','g','circle','rect','line','polyline','polygon','ellipse','text','defs','clipPath','use']);
function LAB_SAFE_NODE(e){const tag=String(e?.tag||'div').toLowerCase();const forbidden=new Set(['script','iframe','object','embed','link','meta','base','style']);const safe=forbidden.has(tag)?'div':tag;const node=LAB_SVG_TAGS.has(safe)?document.createElementNS(LAB_SVG_NS,safe):document.createElement(safe);let attrs=e.atributos||{};
 for(const [key,value] of Object.entries(attrs)){if(!key||/^on/i.test(key)||key==='srcdoc')continue;
  const v=String(value??'');if((key==='src'||key==='poster')&&!v.startsWith('data:image/'))continue;
  if((key==='href'||key==='xlink:href')&&!v.startsWith('#'))continue;
  try{node.setAttribute(key,v)}catch(_){/* atributo ignorado na prévia */}
 }
 if(e.texto)node.textContent=String(e.texto);
 return node;
}
function LAB_BUILD_TREE(component){const elements=component?.estrutura?.html?.elementos||{};const nodes=new Map();let roots=[];
 const sorted=Object.entries(elements).map(([key,value],i)=>({key,entry:value,i}));
 for(const {key,entry} of sorted)nodes.set(key,LAB_SAFE_NODE(entry));
 for(const {key,entry} of sorted){const parent=entry.paiRef;const item=nodes.get(key);
  if(parent&&parent!==key&&nodes.has(parent)){nodes.get(parent).appendChild(item)}else roots.push(item);
 }
 return {roots,nodes};
}
function LAB_SCREEN_CSS(id){const screen=LAB_SCREEN_BY_ID.get(id);if(!screen)return '';const parts=[];const seen=new Set();const lists=[screen.tela.estrutura?.css?.regras||{},...Object.values(screen.componentes||{}).map(c=>c.estrutura?.css?.regras||{})];
 for(const rules of lists)for(const str of Object.values(rules)){if(typeof str!=='string'||seen.has(str))continue;seen.add(str);parts.push(str)}
 const tokenDefaults={'--primary':'#10233f','--primary-soft':'#173c6b','--gold':'#b88932','--page':'#eef2f6','--surface':'#fff','--line':'#dbe3ee','--text':'#172033','--muted':'#667085'};
 const tokens={...tokenDefaults,...(screen.tela.estrutura?.css?.tokens||{})};
 const declarations=Object.entries(tokens).filter(([k,v])=>/^--[a-zA-Z0-9-]+$/.test(k)&&typeof v==='string'&&!/[{};]/.test(v)).map(([k,v])=>k+':'+v+';').join('');
 // CSS :root proveniente da tela não define propriedades do Shadow DOM. Instalar tokens no próprio host.
 return ':host{'+declarations+'font-family:"Plus Jakarta Sans","Segoe UI",Arial,sans-serif;}\n'+parts.join('\n');
}
const LAB_PREVIEW_RULES=`
:host([data-size="mobile"]) .welcome{padding:0!important;background:#fff!important}
:host([data-size="mobile"]) .welcome__layout{display:flex!important;flex-direction:column!important;min-height:100%!important;width:100%!important;border:0!important;border-radius:0!important;box-shadow:none!important}
:host([data-size="mobile"]) .welcome__image{height:38%;min-height:260px!important;flex:0 0 auto!important}
:host([data-size="mobile"]) .welcome__image img{height:100%!important;min-height:260px!important;object-fit:cover!important}
:host([data-size="mobile"]) .welcome__copy{padding:22px!important;min-height:340px!important;flex:1!important}
:host([data-size="mobile"]) .welcome h1{font-size:29px!important}
:host([data-size="mobile"]) .op-grid.two{grid-template-columns:1fr!important}
:host([data-size="mobile"]) .registration__shell{padding-top:24px!important}
.flow-overlay,.prototype-drawer,.route-modal,.aj08-route-modal{position:absolute!important;inset:0!important}
[data-lab-modal]{position:absolute!important;inset:0!important}
:host{display:block;width:100%;height:100%;min-height:100%;background:var(--page,#eef2f6);color:var(--text,#172033);font-family:'Plus Jakarta Sans','Segoe UI',Arial,sans-serif}
.app-header{background:var(--primary,#10233f)!important;color:#fff!important}
*,*::before,*::after{box-sizing:border-box}
[data-lab-viewport]{height:100%;min-height:100%;width:100%;position:relative;background:var(--page,#eef2f6);color:var(--text,#172033)}
.screen-runtime{width:100%;min-height:100%}\n.splash{height:100%;min-height:100%!important}\n:host([data-size="mobile"]) .device-only-desktop{display:none!important}
:host([data-size="mobile"]) .app-main,:host([data-size="mobile"]) .op-shell{max-width:100%!important}
:host([data-size="mobile"]) .bottom-nav{width:100%!important;left:0!important;transform:none!important}
.aj08-static-note{display:none!important}
[data-professional-state="restricted"]{display:none}
[data-professional-access="restricted"] .home-intro{display:none}
[data-professional-access="restricted"] [data-professional-state="restricted"]{display:block}
[data-professional-access="restricted"] .online-card,[data-professional-access="restricted"] .requests-block{display:none}
[data-lab-modal]{position:fixed;inset:0;z-index:950;background:rgba(11,20,36,.65);padding:24px;display:none;align-items:center;justify-content:center}
[data-lab-modal].open{display:flex}
.lab-route-card{width:min(100%,480px);padding:22px;border:1px solid #d8e0e8;border-radius:18px;background:#fff;box-shadow:0 20px 50px #0004;color:#172033}
.lab-route-card small{display:block;color:#b88932;letter-spacing:.08em;text-transform:uppercase;font-weight:850;margin-bottom:7px;font-size:10px}
.lab-route-card h2{margin:0 0 8px;font-size:22px;color:#10233f}
.lab-route-card p{font-size:13px;color:#617187;line-height:1.5}
.lab-route-card code{display:block;margin:12px 0;padding:12px;border-radius:8px;background:#f2f5fa;color:#163b65;font-size:11px;overflow-wrap:anywhere}
.lab-route-card button{width:100%;min-height:42px;border:0;border-radius:8px;background:#10233f;color:#fff;font-weight:800}
[data-lab-view="component"]{min-height:260px;overflow:auto}
`;
const LAB_ROUTE_OVERRIDES={'auth.inicializacao.boas_vindas':'/welcome','auth.sessao.entrar':'/entrar','advogado.home':'/professional/home'};
function LAB_CREATE_PREVIEW(host,screenId,componentRef=null,atomic=null){host.setAttribute('data-size',LAB_STATE.viewport);const shadow=host.shadowRoot||host.attachShadow({mode:'open'});shadow.replaceChildren();
 const sheet=document.createElement('style');sheet.textContent=LAB_SCREEN_CSS(screenId)+'\n'+LAB_PREVIEW_RULES;shadow.appendChild(sheet);
 const viewport=document.createElement('div');viewport.setAttribute('data-lab-viewport','');shadow.appendChild(viewport);
 if(atomic){viewport.setAttribute('data-lab-view','component');const el=LAB_SAFE_NODE(atomic);viewport.appendChild(el)}
 else if(componentRef){viewport.setAttribute('data-lab-view','component');const c=LAB_SCREEN_BY_ID.get(screenId)?.componentes[componentRef];const rendered=LAB_BUILD_TREE(c);viewport.append(...rendered.roots);}
 else {
  const screen=LAB_SCREEN_BY_ID.get(screenId);let compositions=screen.tela.estrutura?.html?.composicao||{},links=screen.tela.componentes?.instanciasRefs||{};
  const rootComponent=screen.componentes[links['screen.root']];const layout=LAB_BUILD_TREE(rootComponent);viewport.append(...layout.roots);
  const entries=Object.entries(compositions).filter(([key])=>key!=='screen.root').sort((a,b)=>(a[1].ordem??99)-(b[1].ordem??99));
  for(const [key,ref] of entries){const comp=screen.componentes[links[key]];if(!comp)continue;
   const section=LAB_BUILD_TREE(comp);const parent=layout.nodes.get(ref.paiRef)||layout.roots[0]||viewport;const mainAnchor=layout.nodes.get('layout.main');if(mainAnchor&&mainAnchor.parentNode===parent&&(ref.slot==='header'||ref.slot==='title'))section.roots.forEach(node=>parent.insertBefore(node,mainAnchor));else parent.append(...section.roots);
  }
  LAB_ADJUST_VISUAL(viewport,screenId);
  if(screenId==='auth.inicializacao.splash'){const brand=viewport.querySelector('.splash h1,.splash .mark');if(brand){brand.setAttribute('role','button');brand.setAttribute('tabindex','0');brand.setAttribute('aria-label','Simular conclusão da abertura');brand.setAttribute('data-goto','auth.inicializacao.boas_vindas')}}
 }
 const overlay=document.createElement('div');overlay.setAttribute('data-lab-modal','');overlay.innerHTML='<div class="lab-route-card" role="dialog" aria-modal="true" aria-label="Ação simulada"><small>Simulação isolada</small><h2 data-r-title>Destino da ação</h2><p>Esta ação não abre outra tela neste laboratório. O destino previsto está indicado abaixo.</p><code data-r-target></code><button type="button" data-lab-close>Fechar</button></div>';
 viewport.appendChild(overlay);
 shadow.addEventListener('click',ev=>LAB_HANDLE_PREVIEW_CLICK(ev,shadow,screenId),{signal:LAB_PREVIEW_ABORT.signal});
 shadow.addEventListener('submit',ev=>LAB_HANDLE_PREVIEW_SUBMIT(ev,shadow,screenId),{signal:LAB_PREVIEW_ABORT.signal});
 shadow.addEventListener('keydown',ev=>{if((ev.key==='Enter'||ev.key===' ')&&ev.target?.getAttribute('role')==='button'){ev.preventDefault();ev.target.click()}},{signal:LAB_PREVIEW_ABORT.signal});
 return shadow;
}
let LAB_PREVIEW_ABORT=new AbortController();
function LAB_RESET_PREVIEW_EVENTS(){LAB_PREVIEW_ABORT.abort();LAB_PREVIEW_ABORT=new AbortController()}
function LAB_ADJUST_VISUAL(v,screenId){
 if(screenId==='admin.home.dashboard'){
  /* Evita a repetição de cabeçalhos na prévia, sem modificar o contrato. */
  v.querySelectorAll('.admin-ui .app-header,.admin-ui .app-titlebar').forEach(x=>x.style.display='none');
 }
 if(screenId==='advogado.home'){
  const restricted=!['padrao','oab_enabled_capabilities'].includes(LAB_STATE.visualState);
  const app=v.querySelector('.app')||v.firstElementChild;app?.setAttribute('data-professional-access',restricted?'restricted':'enabled');
  const hero=v.querySelector('.hero-shell');if(hero){for(const intro of hero.querySelectorAll('.home-intro'))intro.hidden=restricted;for(const card of hero.querySelectorAll('.home-access-card'))card.hidden=!restricted}
  const online=v.querySelector('[data-action="online.toggle"]');if(online&&!LAB_STATE.online)online.classList.add('is-offline');
  const restrictedElems=v.querySelectorAll('[data-capability="canActProfessionally"]');restrictedElems.forEach(x=>x.hidden=restricted);
 }
}
function LAB_MODAL(shadow,target,label){const modal=shadow.querySelector('[data-lab-modal]');if(!modal)return;modal.querySelector('[data-r-title]').textContent=label||'Destino previsto';modal.querySelector('[data-r-target]').textContent=target||'Destino não especificado na fonte';modal.classList.add('open');modal.querySelector('[data-lab-close]').focus()}
function LAB_NORMALIZE(text){return String(text??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function LAB_EXPECTED_DESTINATION(node,screenId){
 const explicit=node.getAttribute('data-goto')||node.getAttribute('data-flow-target');if(explicit)return {target:explicit,label:node.textContent.trim()||node.getAttribute('aria-label')||'Destino documentado'};
 const src=LAB_SCREEN_BY_ID.get(screenId)?.tela||{};
 const label=LAB_NORMALIZE(node.textContent.trim()||node.getAttribute('aria-label')||node.getAttribute('title'));
 if(!label)return null;
 let entries=[];
 for(const link of src.navegacao?.relacoes||[]) if(link.rotulo&&link.destino?.ref)entries.push({name:link.rotulo,target:link.destino.ref});
 for(const act of src.acoes?.itens||[])for(const route of act.rotas||[]) if(route.rotulo&&route.destino?.telaId)entries.push({name:route.rotulo,target:route.destino.telaId});
 // Labels sometimes differ from the source text (e.g. "Validação da OAB" vs "OAB").
 const equivalent={'buscar profissionais':'buscar advogado','nova solicitacao':'buscar advogado','meus contatos':'contatos liberados','usuarios':'perfis e usuarios','perfis':'perfis e usuarios','painel':'dashboard','dashboard':'dashboard','minhas conversas':'contatos liberados','oab':'validacao da oab','administracao':'administradores','trocar conta':'trocar perfil','meu perfil':'meu perfil','minhas solicitacoes':'minhas solicitacoes','sair':'sair'};
 const lookup=equivalent[label]||label;
 let match=entries.find(e=>LAB_NORMALIZE(e.name)===lookup);
 if(!match)match=entries.find(e=>LAB_NORMALIZE(e.name).includes(lookup)&&lookup.length>4);
 if(match)return {target:match.target,label:match.name};
 return null;
}
function LAB_HANDLE_PREVIEW_CLICK(ev,shadow,screenId){
 const node=ev.target.closest('button,a,[role="button"],[data-goto],[data-action],[data-flow-target],[data-aj08-close]');if(!node)return;
 if(node.closest('[data-lab-modal]')&&!node.hasAttribute('data-lab-close'))return;
 if(node.hasAttribute('data-lab-close')){shadow.querySelector('[data-lab-modal]')?.classList.remove('open');return}
 if(node.tagName==='A')ev.preventDefault();
 if(node.hasAttribute('data-aj08-close')||node.hasAttribute('data-flow-close')){
  shadow.querySelectorAll('.flow-overlay,.aj08-route-modal,.route-modal').forEach(x=>{x.classList.remove('open');x.setAttribute('aria-hidden','true')});return;
 }
 const action=node.getAttribute('data-action')||'';
 if(action==='drawer.open'||action==='drawer.close'){
  const drawer=shadow.querySelector('.prototype-drawer');if(drawer){const opening=action==='drawer.open';drawer.classList.toggle('open',opening);drawer.setAttribute('aria-hidden',String(!opening))}else LAB_TOAST('Este estado não contém um menu lateral.');return;
 }
 if(action==='route.close'){shadow.querySelectorAll('.route-modal').forEach(el=>el.classList.remove('open'));return}
 if(action==='online.toggle'){
  if(screenId==='advogado.home'&&!['padrao','oab_enabled_capabilities'].includes(LAB_STATE.visualState)){LAB_TOAST('Disponibilidade bloqueada para o estado OAB selecionado.');return}
  LAB_STATE.online=!LAB_STATE.online;
  shadow.querySelectorAll('.online-card,.drawer-online,[data-component="online-status"]').forEach(el=>el.classList.toggle('is-offline',!LAB_STATE.online));
  shadow.querySelectorAll('.online-copy strong,.drawer-online-copy strong').forEach(el=>el.textContent=LAB_STATE.online?'Online':'Offline');
  shadow.querySelectorAll('.online-copy small,.drawer-online-copy small').forEach(el=>el.textContent=LAB_STATE.online?'Recebendo novas solicitações':'Pausado para novas solicitações');
  LAB_TOAST(LAB_STATE.online?'Online · simulação local':'Offline · simulação local');return;
 }
 if(action==='professionals.type'){node.classList.toggle('active');node.setAttribute('aria-pressed',String(node.classList.contains('active')));return}
 if(action==='professionals.reset'){shadow.querySelectorAll('select').forEach(s=>s.selectedIndex=0);shadow.querySelectorAll('.type-option').forEach(el=>el.classList.remove('active'));LAB_TOAST('Filtros redefinidos na prévia.');return}
 if(action.startsWith('professionals.')){LAB_TOAST('Ação demonstrativa: não há consulta remota.');return}
 if(action==='emergency.mock'){LAB_TOAST('Ação externa não executada nesta simulação.');return}
 const dest=LAB_EXPECTED_DESTINATION(node,screenId);
 if(dest){LAB_MODAL(shadow,dest.target,dest.label);return}
 if(node.type==='submit')return;
 if(node.tagName==='BUTTON'||node.tagName==='A'){
  const label=node.getAttribute('aria-label')||node.textContent.trim()||'Ação sem rótulo';
  const target=action||node.getAttribute('href')||'Destino não documentado no contrato de origem';
  LAB_MODAL(shadow,target,`Ação local · ${label.slice(0,60)}`);
 }
}
function LAB_HANDLE_PREVIEW_SUBMIT(ev,shadow,screenId){ev.preventDefault();if(screenId==='auth.sessao.entrar'){
 const overlay=shadow.querySelector('.flow-overlay');if(overlay){overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');return}
 LAB_MODAL(shadow,'cliente.home.inicio | advogado.home | admin.home.dashboard','Perfil determinado após autenticação (simulação)');return;
 }
 LAB_MODAL(shadow,'Próxima etapa prevista no fluxo','Envio de formulário simulado');
}


/* @ARQUIVO: comportamentos/03-documentacao-json.js */
/* @REGIAO DOCUMENTACAO + JSON · narrativa baseada nos contratos e árvore sob demanda */
function LAB_DOC_FIELD(title,value){const s=document.createElement('section');s.className='section-card';const h=document.createElement('h2');h.textContent=title;s.append(h);if(value===undefined||value===null){s.append(LAB_P('Não especificado no contrato selecionado.'));return s}
 function output(obj,parent,depth){if(depth>3){const pre=document.createElement('code');pre.textContent=JSON.stringify(obj);parent.append(pre);return}
  if(Array.isArray(obj)){if(!obj.length){parent.append(LAB_P('Nenhum registro.'));return}const ul=document.createElement('ul');parent.append(ul);for(const entry of obj){const li=document.createElement('li');ul.append(li);output(entry,li,depth+1)}return}
  if(obj&&typeof obj==='object'){const dl=document.createElement('div');parent.append(dl);for(const [key,val] of Object.entries(obj)){
   const section=document.createElement(depth<2?'h3':'h4');section.textContent=key.replace(/([A-Z])/g,' $1');dl.append(section);
   output(val,dl,depth+1);
  }return}
  const p=LAB_P(String(obj));parent.append(p)
 }
 output(value,s,0);return s;
}
function LAB_P(text){const p=document.createElement('p');p.textContent=text;return p}
const LAB_SECTION_LABELS={identidade:'Identidade da tela',classificacao:'Classificação',navegacao:'Navegação, jornadas e destinos',estados:'Estados e condições',variantes:'Variantes e regras',acoes:'Ações e efeitos',dados:'Dados e operações',componentes:'Composição de componentes',estrutura:'Estrutura e posicionamento',estilos:'Estilos e tokens',interacoes:'Interações',mocks:'Cenários simulados',localizacao:'Localização e implementações',schema:'Esquema',schemaVersion:'Versão do esquema'};
function LAB_DOC_SCREEN(target){target.replaceChildren();const screen=LAB_CURRENT_SCREEN();const s=screen.tela,id=LAB_STATE.screenId;
 const head=document.createElement('header');head.className='docs-intro';head.innerHTML='<span class="eyebrow">Especificação do documento local · Markdown visual</span><h1>'+LAB_E(LAB_CURRENT_ITEM().titulo)+'</h1>';
 head.append(LAB_P(s.identidade?.descricao||'A origem não fornece uma descrição geral para esta tela.'));head.append(LAB_P('Identificador: '+id+' · Documento: '+LAB_SOURCE_ORIGIN()));
 target.append(head);
 const overview=document.createElement('section');overview.className='section-card';overview.innerHTML='<h2>Visão geral</h2>';
 const idents=s.identidade||{},classif=s.classificacao||{};
 [['Nome de exibição',idents.nomeExibicao],['Namespace',idents.namespace],['Público / escopo',classif.escopo],['Schema',s.schema],['Versão do schema',s.schemaVersion]].forEach(([a,b])=>{if(b!==undefined)overview.append(LAB_P(`${a}: ${b}`))});target.append(overview);
 for(const key of ['estados','variantes','navegacao','acoes','dados','componentes','estrutura','interacoes','mocks','classificacao']){const data=s[key];if(data===undefined)continue;target.append(LAB_DOC_FIELD(LAB_SECTION_LABELS[key]||key,data))}
 const limit=document.createElement('section');limit.className='section-card';limit.innerHTML='<h2>Limites desta demonstração</h2><p>Prévia local: as ações simuladas informam destinos, mas não navegam para outras telas, não autenticam e não acessam bancos de dados. Os estados e regras exibidos refletem somente o que consta nos JSONs de origem.</p>';target.append(limit);
}
function LAB_DOC_COMPONENT(target,entry,screenId){target.replaceChildren();const component=entry.kind==='element'?null:entry.record;const meta=component?.identidade||{};
 const hd=document.createElement('header');hd.className='docs-intro';hd.innerHTML='<span class="eyebrow">Documentação do componente · baseado na origem</span><h1>'+LAB_E(entry.kind==='element'?entry.name:LAB_COMP_NAME(entry))+'</h1>';
 hd.append(LAB_P('Origem: '+screenId+(entry.compId?' · '+entry.compId:'')+' · '+(entry.slot||entry.category||'elemento visual')));target.append(hd);
 if(entry.kind==='element'){
  const e=entry.base;target.append(LAB_DOC_FIELD('Elemento HTML',{'tag':e.tag,'texto':e.texto,'atributos':e.atributos,'paiRef':e.paiRef,'ordem':e.ordem}));
  const note=document.createElement('div');note.className='notice';note.textContent='Candidato extraído da estrutura de origem. Ainda não é um componente global homologado.';target.append(note);return;
 }
 for(const [name,data] of [['Identidade',meta],['Classificação',component.classificacao],['Estados',component.estados],['Ações',component.acoes],['Dados',component.dados],['Variantes',component.variantes]])if(data!==undefined)target.append(LAB_DOC_FIELD(name,data));
 const structure=component.estrutura?.html||{};const els=structure.elementos||{};
 target.append(LAB_DOC_FIELD('Estrutura da interface',{'raizRef':structure.raizRef,'totalElementos':Object.keys(els).length,'tags':Array.from(new Set(Object.values(els).map(e=>e.tag)))}));
 const note=document.createElement('div');note.className='notice';note.textContent='Documentação gerada a partir dos campos presentes no JSON. Lacunas e regras de negócio não descritas não foram preenchidas artificialmente.';target.append(note);
}
function LAB_JSON_PAYLOAD(){return LAB_IS_GLOBAL()?LAB_GLOBAL_DOCUMENT:(LAB_CURRENT_SCREEN()||{});}
function LAB_DOWNLOAD_JSON(data,filename){const content=JSON.stringify(data,null,2);const blob=new Blob([content],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500)}
function LAB_JSON_ALL(target){target.innerHTML=`<div class="json-workspace"><div class="json-head"><div><strong>JSON completo</strong><small id="jsonSourceInfo"></small></div><button class="btn primary" id="exportCurrentJSON" type="button">Exportar JSON</button></div><div class="json-toolbar"><input type="search" id="jsonSearch" placeholder="Buscar conteúdo no JSON" aria-label="Buscar no JSON"><button class="btn" id="copyCurrentJSON">Copiar</button><button class="btn" id="jsonNextMatch">Próxima ocorrência</button></div><pre class="json-code" id="jsonFullContent"></pre><div class="json-status" id="jsonStatus"></div></div>`;
 const payload=LAB_JSON_PAYLOAD();const text=JSON.stringify(payload,null,2);let cursor=-1;
 target.querySelector('#jsonSourceInfo').textContent=LAB_SOURCE_ORIGIN();const code=target.querySelector('#jsonFullContent');code.textContent=text;
 target.querySelector('#jsonStatus').textContent=`${text.split('\n').length.toLocaleString('pt-BR')} linhas · ${Object.keys(payload).length} blocos principais · dados integrais`;
 target.querySelector('#exportCurrentJSON').onclick=()=>LAB_DOWNLOAD_JSON(payload,(LAB_STATE.screenId||'global').replaceAll('.','_')+'.json');
 target.querySelector('#copyCurrentJSON').onclick=async()=>{try{await navigator.clipboard.writeText(text);LAB_TOAST('JSON copiado')}catch(_){const field=document.createElement('textarea');document.body.append(field);field.value=text;field.select();document.execCommand('copy');field.remove();LAB_TOAST('JSON copiado')}};
 function find(){const term=target.querySelector('#jsonSearch').value.trim();if(!term)return;const next=text.toLowerCase().indexOf(term.toLowerCase(),cursor+1);cursor=next<0?text.toLowerCase().indexOf(term.toLowerCase()):next;
  if(cursor<0){LAB_TOAST('Nenhuma ocorrência encontrada');return}
  const at=text.slice(0,cursor).split('\n').length;
  code.scrollTop=Math.max(0,at*19-120);
  target.querySelector('#jsonStatus').textContent=`Busca: encontrado na linha aproximada ${at} · termo: ${term}`;
 }
 target.querySelector('#jsonNextMatch').onclick=find;
 target.querySelector('#jsonSearch').onkeydown=e=>{if(e.key==='Enter')find()};
}
function LAB_TREE_NODE(key,val,depth=0){if(val===null||typeof val!=='object'){
 const leaf=document.createElement('div');leaf.className='tree-leaf';const k=document.createElement('span');k.className='tree-key';k.textContent=key+': ';leaf.append(k);
 const v=document.createElement('span');v.className=val===null?'tree-null':'tree-value';v.textContent=JSON.stringify(val);leaf.append(v);return leaf;
 }
 const el=document.createElement('details');el.className='tree-node';const summary=document.createElement('summary');const k=document.createElement('span');k.className='tree-key';k.textContent=key+' ';summary.append(k);
 const count=document.createElement('span');count.className='tree-count';count.textContent=Array.isArray(val)?`[${val.length}]`:`{${Object.keys(val).length}}`;summary.append(count);el.append(summary);
 el.addEventListener('toggle',()=>{if(!el.open||el.dataset.loaded)return;el.dataset.loaded='1';
  for(const [kid,child] of Object.entries(val))el.append(LAB_TREE_NODE(Array.isArray(val)?`[${kid}]`:kid,child,depth+1));
 });return el;
}
function LAB_JSON_TREE(target){const p=LAB_JSON_PAYLOAD();const keys=Object.keys(p);if(!keys.includes(LAB_STATE.jsonBlock))LAB_STATE.jsonBlock=keys[0]||'';
 const wrapper=document.createElement('div');wrapper.className='json-workspace';const head=document.createElement('div');head.className='json-head';head.innerHTML='<div><strong>JSON por blocos</strong><br><small>Árvore independente de cada seção do arquivo selecionado</small></div>';wrapper.append(head);
 const nav=document.createElement('nav');nav.className='block-nav';nav.setAttribute('aria-label','Blocos do JSON');keys.forEach(key=>{
 const b=document.createElement('button');b.textContent=key;b.className=key===LAB_STATE.jsonBlock?'active':'';b.onclick=()=>{LAB_STATE.jsonBlock=key;LAB_JSON_TREE(target)};nav.append(b);
 });wrapper.append(nav);
 const tree=document.createElement('div');tree.className='tree-view';if(LAB_STATE.jsonBlock){const obj=LAB_TREE_NODE(LAB_STATE.jsonBlock,p[LAB_STATE.jsonBlock]);tree.append(obj);if(obj.tagName==='DETAILS')obj.open=true}else tree.textContent='Sem blocos';wrapper.append(tree);
 const foot=document.createElement('div');foot.className='json-status';foot.textContent=`Bloco: ${LAB_STATE.jsonBlock} · Fonte: ${LAB_SOURCE_ORIGIN()} · Os ramos só são criados ao expandir`;wrapper.append(foot);
 target.replaceChildren(wrapper);
}


/* @ARQUIVO: comportamentos/03b-documentacao-aprimorada.js */
/* @REGIAO PADRAO DOCUMENTAL V2 · mesma estrutura descritiva em todas as seis telas */
function LAB_DOC_SECTION(title,description=''){
 const el=document.createElement('section');el.className='section-card';const h=document.createElement('h2');h.textContent=title;el.append(h);
 if(description)el.append(LAB_P(description));return el;
}
function LAB_DOC_SUB(head,text,container){const h=document.createElement('h3');h.textContent=head;container.append(h);if(text!==undefined&&text!==null&&text!=='')container.append(LAB_P(typeof text==='string'?text:String(text)));}
function LAB_DOC_META(container,key,value){const row=document.createElement('div');row.className='doc-row';const k=document.createElement('strong');k.textContent=key;const v=document.createElement('span');v.textContent=Array.isArray(value)?value.join(' · '):value===undefined||value===null?'Não definido':typeof value==='object'?JSON.stringify(value):String(value);row.append(k,v);container.append(row)}
function LAB_DOC_SMALL_LIST(container,rows,empty='Nenhum item definido no contrato'){
 if(!rows.length){container.append(LAB_P(empty));return}
 const list=document.createElement('div');list.className='doc-entry-list';for(const x of rows){const card=document.createElement('article');card.className='doc-entry';const h=document.createElement('strong');h.textContent=x.title;card.append(h);for(const p of x.details||[]){if(!p)continue;const small=document.createElement('p');small.textContent=p;card.append(small)}list.append(card)}container.append(list)
}
function LAB_DOC_SCREEN(target){
 target.replaceChildren();const item=LAB_CURRENT_ITEM();const root=LAB_CURRENT_SCREEN();const screen=root.tela||{}, sources=LAB_CURRENT_SOURCES();
 const intro=document.createElement('header');intro.className='docs-intro';intro.innerHTML='<span class="eyebrow">Documentação técnica da tela · contrato existente</span><h1>'+LAB_E(item.titulo)+'</h1>';
 intro.append(LAB_P(screen.identidade?.descricao||'Descrição geral não especificada na documento local.'));
 intro.append(LAB_P(`ID: ${item.id} · Schema: ${screen.schema||'não informado'} ${screen.schemaVersion||''}`));
 const exportButton=document.createElement('button');exportButton.type='button';exportButton.className='btn';exportButton.textContent='Exportar especificação .md';exportButton.onclick=()=>LAB_EXPORT_MD(item,screen,sources);intro.append(exportButton);target.append(intro);
 const sec1=LAB_DOC_SECTION('01 · Identidade e classificação','Dados registrados na documento local, sem completar informações de negócio inexistentes.');
 for(const [k,v] of Object.entries(screen.identidade||{}))if(typeof v!=='object')LAB_DOC_META(sec1,k,v);
 for(const [k,v] of Object.entries(screen.classificacao||{}))if(k!=='jornadas'&&typeof v!=='object')LAB_DOC_META(sec1,k,v);
 const jornadas=(screen.classificacao?.jornadas||[]).map(j=>({title:(j.jornada?.nome||j.jornadaRef||'Jornada')+' — '+(j.subjornada?.nome||''),details:[`Ocorrência: ${j.id||'não definida'} · ordem: ${j.ordemTela??'não definida'}`,j.contexto?.descricao||'']}));
 if(jornadas.length){LAB_DOC_SUB('Participações nas jornadas',null,sec1);LAB_DOC_SMALL_LIST(sec1,jornadas)}target.append(sec1);
 const sec2=LAB_DOC_SECTION('02 · Estados, condições e variantes','Selecione um estado na subaba Visuais. Se a fonte não define aparência diferente, mantemos a mesma composição e registramos a condição.');
 const states=screen.estados?.possiveis||[];LAB_DOC_SMALL_LIST(sec2,states.map(x=>({title:x.nome||x.id,details:[`ID: ${x.id}`,x.jornadasRefs?.length?'Jornadas: '+x.jornadasRefs.join(', '):'',x.descricao||'']})));
 LAB_DOC_META(sec2,'Fallback',screen.estados?.fallbackSeguro||screen.estados?.estadoFallbackRef);
 const variants=screen.variantes?.regras||[];
 if(variants.length){LAB_DOC_SUB('Regras de variante',null,sec2);LAB_DOC_SMALL_LIST(sec2,variants.map(x=>({title:x.id||x.nome||'Regra',details:[`Gatilho: ${x.gatilho||'não definido'} · estado-alvo: ${x.estadoAlvo||'não definido'}`,x.nota||'']})))}
 if(screen.variantes?.visuaisPorJornada)LAB_DOC_META(sec2,'Visuais por jornada',Object.keys(screen.variantes.visuaisPorJornada));target.append(sec2);
 const sec3=LAB_DOC_SECTION('03 · Navegação e destinos','Ao clicar na prévia, o laboratório informa o destino, sem abrir outra tela.');
 const links=screen.navegacao?.relacoes||[];
 LAB_DOC_SMALL_LIST(sec3,links.map((x,i)=>({title:`${i+1}. ${x.rotulo||x.tipo||'Relação'}`,details:[`Origem: ${x.origem?.ref||'não definida'} → Destino: ${x.destino?.ref||'não definido'}`,`Tipo: ${x.tipo||'não definido'}${x.condicaoRef?' · Condição: '+x.condicaoRef:''}`]})),'Nenhuma relação de navegação declarada');target.append(sec3);
 const sec4=LAB_DOC_SECTION('04 · Ações e interações','Comportamentos lidos do contrato. Integração externa e autenticação real não são executadas.');
 const actions=screen.acoes?.itens||[];
 LAB_DOC_SMALL_LIST(sec4,actions.map(x=>({title:x.nome||x.id||'Ação',details:[`Evento: ${x.evento||x.tipo||'não definido'}`,...(x.rotas||[]).map(r=>(r.rotulo||r.id||'rota')+' → '+(r.destino?.telaId||r.destino?.ref||'destino lógico não definido')), ...(x.efeitos||[]).map(e=>e.tipo+': '+(e.destinoRef||''))]})));
 LAB_DOC_META(sec4,'Interações documentadas',Array.isArray(screen.interacoes?.eventosPrototipo)?screen.interacoes.eventosPrototipo.length:Array.isArray(screen.interacoes?.itens)?screen.interacoes.itens.length:0);target.append(sec4);
 const sec5=LAB_DOC_SECTION('05 · Dados, operações e cenários','As fontes são documentadas sem conectar serviços de produção.');
 const data=screen.dados||{};for(const key of ['fontes','operacoes','persistencia','campos','vinculos'])if(Array.isArray(data[key]))LAB_DOC_META(sec5,key+' (quantidade)',data[key].length);
 LAB_DOC_SMALL_LIST(sec5,(data.operacoes||[]).map(x=>({title:x.id||x.nome||'Operação',details:[`Tipo: ${x.tipo||x.servico||'não definido'}`,`Fonte: ${x.fonteRef||'não especificada'}`,x.aoFalhar?'Falha: '+x.aoFalhar:'']})), 'Nenhuma operação definida');
 const mocks=screen.mocks?.cenarios||[];LAB_DOC_SUB('Cenários de demonstração',null,sec5);LAB_DOC_SMALL_LIST(sec5,mocks.map(x=>({title:x.nome||x.id,details:[x.estadoEsperadoRef?'Estado esperado: '+x.estadoEsperadoRef:'',x.situacao||x.origem||'']})),'Nenhum cenário definido');target.append(sec5);
 const sec6=LAB_DOC_SECTION('06 · Composição, estrutura e CSS','Ordem, slots, tokens e componentes seguem o padrão de referência da Home do Advogado.');
 LAB_DOC_META(sec6,'Raiz visual',screen.estrutura?.html?.raizRef||'não definido');
 const comp=LAB_COMPONENTS(),composition=screen.estrutura?.html?.composicao||{};
 LAB_DOC_SMALL_LIST(sec6,comp.map((x,i)=>({title:`${i+1}. ${LAB_COMP_NAME(x)}`,details:[`ID: ${x.id}`,`Slot: ${x.section} · Ordem: ${x.order}`,`Elementos HTML: ${LAB_COMP_COUNT(x)}`]})));
 const tokens=screen.estrutura?.css?.tokens||{};LAB_DOC_SUB('Tokens originais de CSS',null,sec6);const palette=document.createElement('div');palette.className='token-grid';for(const [key,value] of Object.entries(tokens)){const row=document.createElement('div');row.className='token-entry';const marker=document.createElement('span');marker.className='token-swatch';if(/^#[0-9a-f]{3,8}$/i.test(value))marker.style.background=value;const txt=document.createElement('code');txt.textContent=key+' = '+value;row.append(marker,txt);palette.append(row)}sec6.append(palette);
 const cssCount=Object.keys(screen.estrutura?.css?.regras||{}).length;LAB_DOC_META(sec6,'Regras CSS na documento local',cssCount);target.append(sec6);
 const sec7=LAB_DOC_SECTION('07 · Fontes e rastreabilidade','As ocorrências são independentes: não fazemos substituições silenciosas entre schemas diferentes.');
 LAB_DOC_SMALL_LIST(sec7,sources.map((x,i)=>({title:(i?'Alternativa '+i+': ':'Principal: ')+x.arquivo,details:[`Ocorrência: ${x.ocorrenciaId||'sem código'}`,`Origem: ${x.origemPath||x.caminho}`,`Status: ${x.status||'referência'}`]})));
 target.append(sec7);
 const sec8=LAB_DOC_SECTION('08 · Limitações e pendências de homologação','A renderização é offline; operações externas, permissões reais e validação por backend não são simuladas como resultados reais.');
 const notes=[];if(!links.length)notes.push('Rotas de saída não declaradas.');
 if(!Object.keys(tokens).length)notes.push('Tokens CSS não individualizados na tela; utiliza fallback visual de referência.');

 if(!notes.length)notes.push('Contratos de aparência e fluxo precisam de homologação na aplicação final.');
 for(const note of notes)sec8.append(LAB_P('• '+note));target.append(sec8);
}
function LAB_EXPORT_MD(item,screen,sources){
 const sections=['# '+item.titulo,'','ID: `'+item.id+'`','',screen.identidade?.descricao||'','',
 '## Identidade',...Object.entries(screen.identidade||{}).map(([k,v])=>`- ${k}: ${typeof v==='object'?JSON.stringify(v):v}`),'',
 '## Estados',...(screen.estados?.possiveis||[]).map(s=>`- **${s.nome||s.id}** (${s.id})`),'',
 '## Variantes',...(screen.variantes?.regras||[]).map(x=>`- ${x.id} → ${x.estadoAlvo||'sem estado especificado'}`),'',
 '## Navegação',...(screen.navegacao?.relacoes||[]).map(x=>`- ${x.rotulo||x.tipo}: ${x.origem?.ref||'?'} → ${x.destino?.ref||'?'}`),'',
 '## Ações',...(screen.acoes?.itens||[]).map(x=>`- ${x.nome||x.id}: ${x.evento||x.tipo||''}`),'',
 '## Componentes',...LAB_COMPONENTS().map(c=>`- ${c.id} (${c.section}, ordem ${c.order})`),'',
 '## CSS / tokens',...Object.entries(screen.estrutura?.css?.tokens||{}).map(([k,v])=>`- ${k}: ${v}`),'',
 '## Documento','- '+LAB_SOURCE_ORIGIN(),'',
 '## Observações','Dados completos, inclusive CSS e HTML de origem, disponíveis na aba JSON.'];
 const blob=new Blob([sections.join('\n')],{type:'text/markdown;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=item.id.replace(/[^a-z0-9]+/gi,'_')+'.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500)
}
function LAB_DOC_COMPONENT(target,entry,screenId){
 target.replaceChildren();const atom=entry.kind==='element';const component=atom?null:entry.record;const name=atom?entry.name:LAB_COMP_NAME(entry);
 const intro=document.createElement('header');intro.className='docs-intro';intro.innerHTML='<span class="eyebrow">Ficha de componente · padrão Home do Advogado</span><h1>'+LAB_E(name)+'</h1>';intro.append(LAB_P(`Origem: ${screenId} · ID: ${entry.id} · ${entry.section||entry.category||'elemento'}`));target.append(intro);
 if(atom){const c=LAB_DOC_SECTION('HTML do elemento original');LAB_DOC_META(c,'Tag',entry.base.tag);LAB_DOC_META(c,'Texto',entry.base.texto||'(sem texto)');LAB_DOC_META(c,'Atributos',entry.base.atributos||{});LAB_DOC_META(c,'Pai',entry.base.paiRef);target.append(c);return}
 if(!component){const c=LAB_DOC_SECTION('Contrato não disponível');c.append(LAB_P('A fonte registra uma referência, mas não incorpora um template de componente.'));target.append(c);return}
 const c=LAB_DOC_SECTION('Identidade e estrutura');
 LAB_DOC_META(c,'Referência',entry.id);LAB_DOC_META(c,'Slot',entry.section);LAB_DOC_META(c,'Ordem',entry.order??'não definida');LAB_DOC_META(c,'Raiz',component.estrutura?.html?.raizRef||'não definida');
 const els=component.estrutura?.html?.elementos||{};LAB_DOC_META(c,'Quantidade de elementos',Object.keys(els).length);
 LAB_DOC_META(c,'Tags',Array.from(new Set(Object.values(els).map(x=>x.tag))));target.append(c);
 const behavior=LAB_DOC_SECTION('Estados, ações e dados');for(const [n,x] of [['Estados',component.estados],['Ações',component.acoes],['Dados',component.dados],['Variantes',component.variantes]]){const count=Array.isArray(x)?x.length:x&&typeof x==='object'?Object.keys(x).length:0;LAB_DOC_META(behavior,n,count)}target.append(behavior);
 const css=LAB_DOC_SECTION('CSS e dependências');LAB_DOC_META(css,'Regras CSS próprias',Object.keys(component.estrutura?.css?.regras||{}).length);LAB_DOC_META(css,'Origem visual',screenId);css.append(LAB_P('O CSS de contexto da tela é carregado na prévia isolada. O código integral permanece na aba JSON.'));target.append(css);
}
/* @REGIAO ARVORE · seções independentes, incluindo identidade/estrutura/estilos/componente */
function LAB_JSON_BLOCK_OPTIONS(payload){
 const result=[];
 for(const [key,value] of Object.entries(payload)){
  if((key==='tela'||key==='screen')&&value&&typeof value==='object'&&!Array.isArray(value)){
   for(const [sub,v] of Object.entries(value))result.push({key:key+'.'+sub,label:sub,group:key,value:v});
  }else if((key==='componentes'||key==='components')&&value&&typeof value==='object'&&!Array.isArray(value)){
   for(const [sub,v] of Object.entries(value))result.push({key:key+'.'+sub,label:sub,group:key,value:v});
  }else result.push({key,label:key,group:'raiz',value});
 }
 return result;
}
function LAB_JSON_TREE(target){
 const p=LAB_JSON_PAYLOAD(),blocks=LAB_JSON_BLOCK_OPTIONS(p),keys=blocks.map(x=>x.key);
 if(!keys.includes(LAB_STATE.jsonBlock))LAB_STATE.jsonBlock=keys[0]||'';
 const wrap=document.createElement('div');wrap.className='json-workspace';const head=document.createElement('div');head.className='json-head';const title=document.createElement('div');title.innerHTML='<strong>JSON por seções independentes</strong><br><small>Árvores colapsáveis correspondentes aos blocos reais do arquivo selecionado</small>';head.append(title);wrap.append(head);
 const nav=document.createElement('nav');nav.className='block-nav';nav.setAttribute('aria-label','Blocos da fonte JSON');let last='';
 for(const x of blocks){if(last!==x.group){const heading=document.createElement('span');heading.className='block-group';heading.textContent=x.group;nav.append(heading);last=x.group}const b=document.createElement('button');b.textContent=x.label;b.title=x.key;b.className=x.key===LAB_STATE.jsonBlock?'active':'';b.onclick=()=>{LAB_STATE.jsonBlock=x.key;LAB_JSON_TREE(target)};nav.append(b)}wrap.append(nav);
 const current=blocks.find(x=>x.key===LAB_STATE.jsonBlock);const tree=document.createElement('div');tree.className='tree-view';if(current){const info=document.createElement('p');info.className='tree-path';info.textContent='Caminho: '+current.key;tree.append(info);const el=LAB_TREE_NODE(current.key,current.value);tree.append(el);if(el.tagName==='DETAILS')el.open=true}else tree.textContent='Fonte sem conteúdo';wrap.append(tree);
 const footer=document.createElement('div');footer.className='json-status';footer.textContent=`${blocks.length} blocos · ${current?.key||'sem bloco'} · ${LAB_SOURCE_ORIGIN()} · criação sob demanda`;wrap.append(footer);target.replaceChildren(wrap)
}


/* @ARQUIVO: comportamentos/04-interface-e-acoes.js */
/* @REGIAO APP · abas, controles, catálogo Global e inicialização */
const LAB_DOM={macro:document.getElementById('macroTabs'),major:document.getElementById('majorTabs'),minor:document.getElementById('minorTabs'),tools:document.getElementById('tools'),main:document.getElementById('mainArea'),source:document.getElementById('sourceLabel')};
const LAB_MINOR_FOR={tela:[['visuais','Visuais'],['documentacao','Documentação']],json:[['completo','Completo'],['blocos','Por blocos']],componentes:[['visuais','Visuais'],['documentacao','Documentação']]};
function LAB_RENDER(){LAB_RESET_PREVIEW_EVENTS();LAB_DOM.macro.replaceChildren();LAB_DOM.major.replaceChildren();LAB_DOM.minor.replaceChildren();LAB_DOM.tools.replaceChildren();LAB_DOM.main.replaceChildren();
 LAB_DOM.source.textContent=LAB_SOURCE_ORIGIN();
 for(const item of LAB_ITEMS){const b=document.createElement('button');b.type='button';b.textContent=item.titulo;b.className=(LAB_STATE.screenId===item.id?'active ':'')+(item.tipo==='biblioteca'?'global':'');b.setAttribute('aria-current',LAB_STATE.screenId===item.id?'page':'false');b.onclick=()=>{if(LAB_STATE.screenId===item.id)return;LAB_STATE.screenId=item.id;LAB_STATE.major='tela';LAB_STATE.minor='visuais';LAB_STATE.sourceIdx=0;LAB_STATE.compSourceIdx=0;LAB_STATE.compIndex=0;LAB_STATE.globalSelection=0;LAB_STATE.globalCategory=item.tipo==='biblioteca'?'Headers':'Todos';LAB_STATE.jsonBlock='';LAB_STATE.visualState='padrao';LAB_STATE.journey='cliente';LAB_STATE.online=true;LAB_RENDER()};LAB_DOM.macro.append(b)}
 for(const [id,label] of [['tela',LAB_IS_GLOBAL()?'Padrões':'Tela'],['json','JSON'],['componentes','Componentes']]){const b=document.createElement('button');b.textContent=label;b.className=LAB_STATE.major===id?'active':'';b.onclick=()=>{LAB_STATE.major=id;LAB_STATE.minor=(LAB_MINOR_FOR[id]||[])[0][0];LAB_STATE.compIndex=0;LAB_RENDER()};LAB_DOM.major.append(b)}
 for(const [id,label] of LAB_MINOR_FOR[LAB_STATE.major]){const b=document.createElement('button');b.textContent=label;b.className=LAB_STATE.minor===id?'active':'';b.onclick=()=>{LAB_STATE.minor=id;LAB_RENDER()};LAB_DOM.minor.append(b)}
 LAB_RENDER_TOOLS();LAB_RENDER_CONTENT();
}
function LAB_RENDER_TOOLS(){const t=LAB_DOM.tools;
 if(LAB_STATE.major==='tela'&&LAB_STATE.minor==='visuais'&&!LAB_IS_GLOBAL()){
  const s=LAB_CURRENT_SCREEN();const visual=s.tela.variantes?.visuaisPorJornada||{};if(Object.keys(visual).length){
   const label=document.createElement('label');label.textContent='Jornada';const sel=document.createElement('select');sel.setAttribute('aria-label','Jornada simulada');for(const key of Object.keys(visual)){const o=document.createElement('option');o.value=key;o.textContent=LAB_SOURCE_NAMES[key]||key;sel.append(o)}sel.value=LAB_STATE.journey;sel.onchange=()=>{LAB_STATE.journey=sel.value;LAB_STATE.visualState=LAB_STATE_OPTIONS()[0]?.id||'padrao';LAB_RENDER()};label.append(sel);t.append(label);
  }
  const states=LAB_STATE_OPTIONS();if(states.length>1){const label=document.createElement('label');label.textContent='Estado';const sel=document.createElement('select');sel.setAttribute('aria-label','Estado visual');for(const st of states){let o=document.createElement('option');o.value=st.id;o.textContent=st.nome;sel.append(o)}sel.value=LAB_STATE.visualState;sel.onchange=()=>{LAB_STATE.visualState=sel.value;LAB_RENDER()};label.append(sel);t.append(label)}
  const label=document.createElement('label');label.textContent='Visualização';const sel=document.createElement('select');for(const x of ['mobile','desktop']){const o=document.createElement('option');o.value=x;o.textContent=x==='mobile'?'Mobile':'Desktop';sel.append(o)}sel.value=LAB_STATE.viewport;sel.onchange=()=>{LAB_STATE.viewport=sel.value;LAB_RENDER_CONTENT()};label.append(sel);t.append(label);
  const reset=document.createElement('button');reset.className='btn';reset.textContent='Reiniciar prévia';reset.onclick=()=>{LAB_STATE.online=true;LAB_RENDER_CONTENT()};t.append(reset);
  let small=document.createElement('span');small.className='smallprint';small.textContent='Ações locais: não abrem outras telas nem chamam backend.';t.append(small);return;
 }
 if(LAB_STATE.major==='json'){const x=document.createElement('span');x.className='smallprint';x.textContent='Contrato local desta tela.';t.append(x);return;}
 if(LAB_STATE.major==='componentes'&&!LAB_IS_GLOBAL()){const x=document.createElement('span');x.className='smallprint';x.textContent='Componentes definidos neste contrato.';t.append(x);return;}
 if(LAB_STATE.major==='componentes'||LAB_IS_GLOBAL()){
  const text=document.createElement('span');text.className='smallprint';text.textContent=LAB_IS_GLOBAL()?'Catálogo de componentes desta biblioteca; as prévias não modificam os contratos.':'Peças identificadas na estrutura original da tela selecionada.';t.append(text);return;
 }
 const text=document.createElement('span');text.className='smallprint';text.textContent='Especificação em seções e subseções baseada no JSON principal.';t.append(text);
}
function LAB_RENDER_CONTENT(){LAB_RESET_PREVIEW_EVENTS();const area=LAB_DOM.main;area.replaceChildren();area.classList.toggle('is-preview',LAB_STATE.major==='tela'&&LAB_STATE.minor==='visuais');
 if(LAB_STATE.major==='tela'){
  if(LAB_IS_GLOBAL()){if(LAB_STATE.minor==='documentacao'){LAB_GLOBAL_DOCS(area)}else LAB_GLOBAL_GALLERY(area)}
  else if(LAB_STATE.minor==='documentacao')LAB_DOC_SCREEN(area);else LAB_SCREEN_GALLERY(area);
  return;
 }
 if(LAB_STATE.major==='json'){if(LAB_STATE.minor==='blocos')LAB_JSON_TREE(area);else LAB_JSON_ALL(area);return;}
 LAB_COMPONENT_AREA(area);
}
function LAB_SCREEN_GALLERY(area){const s=LAB_CURRENT_SCREEN(),states=LAB_STATE_OPTIONS();const byJourney=s.tela.variantes?.visuaisPorJornada||{};
 if(Object.keys(byJourney).length>1){const selector=document.createElement('nav');selector.className='visual-tabs';selector.setAttribute('aria-label','Visuais por jornada');for(const id of Object.keys(byJourney)){
 const b=document.createElement('button');b.textContent=LAB_SOURCE_NAMES[id]||id;b.className=LAB_STATE.journey===id?'active':'';b.onclick=()=>{LAB_STATE.journey=id;LAB_STATE.visualState=LAB_STATE_OPTIONS()[0]?.id||'padrao';LAB_RENDER()};selector.append(b)
 }area.append(selector);const info=document.createElement('p');info.className='visual-note';info.textContent='As referências de jornada são preservadas; quando a fonte não define um visual distinto, a mesma composição é exibida.';area.append(info)}
 if(states.length>1){const nav=document.createElement('nav');nav.className='visual-tabs';nav.setAttribute('aria-label','Variações visuais da tela');for(const st of states){const b=document.createElement('button');b.textContent=st.nome;b.className=st.id===LAB_STATE.visualState?'active':'';b.onclick=()=>{LAB_STATE.visualState=st.id;LAB_RENDER()};nav.append(b)}area.append(nav)}
 const stage=document.createElement('div');stage.className='stage';const device=document.createElement('div');device.className='device '+(LAB_STATE.viewport==='desktop'?'desktop':'');const host=document.createElement('div');host.className='device-host';device.append(host);stage.append(device);
 const note=document.createElement('aside');note.className='preview-note';note.innerHTML='<h3>Prévia da tela</h3>';note.append(LAB_P(s.tela.identidade?.descricao||'Visual conforme os componentes da coleção de jornadas.'));
 note.append(LAB_P('Documento: '+LAB_SOURCE_ORIGIN()));
 const st=states.find(x=>x.id===LAB_STATE.visualState)||states[0];if(st){const para=LAB_P('Estado: '+st.nome);note.append(para);if(st.descricao)note.append(LAB_P(st.descricao))}
 const journey=s.tela.variantes?.visuaisPorJornada||{};if(journey[LAB_STATE.journey])note.append(LAB_P('Participação: '+(LAB_SOURCE_NAMES[LAB_STATE.journey]||LAB_STATE.journey)));
 note.append(LAB_P('Todas as saídas de navegação são interceptadas e exibidas como destino simulado.'));
 stage.append(note);area.append(stage);
 try{LAB_CREATE_PREVIEW(host,LAB_STATE.screenId)}catch(e){const div=document.createElement('div');div.className='notice';div.textContent='Falha ao renderizar a estrutura da origem: '+e.message;host.replaceChildren(div)}
}
function LAB_COMPONENT_AREA(area){if(LAB_IS_GLOBAL()){LAB_GLOBAL_GALLERY(area);return}
 const comps=LAB_COMPONENTS_ACTIVE();if(!comps.length){area.innerHTML='<div class="blank">Nenhum componente identificado no contrato.</div>';return}
 LAB_STATE.compIndex=Math.min(LAB_STATE.compIndex,comps.length-1);const selected=comps[LAB_STATE.compIndex];
 const layout=document.createElement('div');layout.className='comp-layout';const list=document.createElement('nav');list.className='comp-list';list.setAttribute('aria-label','Componentes da tela');comps.forEach((c,index)=>{
 const b=document.createElement('button');b.className='comp-item '+(index===LAB_STATE.compIndex?'active':'');b.innerHTML='<strong>'+LAB_E(LAB_COMP_NAME(c))+'</strong><small>'+LAB_E(c.id)+' · '+LAB_E(c.section)+' · '+(c.kind==='reference'?LAB_E(c.originalRef||'referência'):LAB_COMP_COUNT(c)+' elementos')+'</small>';b.onclick=()=>{LAB_STATE.compIndex=index;LAB_RENDER_CONTENT()};list.append(b)
 });layout.append(list);
 if(LAB_STATE.minor==='documentacao'){const doc=document.createElement('div');LAB_DOC_COMPONENT(doc,selected,LAB_STATE.screenId);layout.append(doc)}
 else{const panel=LAB_COMPONENT_PREVIEW(selected,LAB_STATE.screenId);layout.append(panel)}
 area.append(layout);
}
function LAB_COMPONENT_PREVIEW(entry,screenId){const panel=document.createElement('div');panel.className='comp-preview';const meta=document.createElement('div');meta.className='comp-meta';meta.innerHTML='<strong>'+LAB_E(entry.kind==='element'?entry.name:LAB_COMP_NAME(entry))+'</strong>'+LAB_E(entry.id)+' · Fonte: '+LAB_E(screenId);panel.append(meta);
 const stage=document.createElement('div');stage.className='comp-stage';const host=document.createElement('div');host.className='comp-host';stage.append(host);panel.append(stage);
 try{if(entry.kind==='reference'&&!entry.previewRecordId){const note=document.createElement('div');note.className='component-reference';note.innerHTML='<strong>Referência sem template visual independente</strong><span>'+LAB_E(entry.originalRef||entry.id)+'</span><span>'+LAB_E(entry.sourceTitle||'Fonte alternativa')+'</span><span>O HTML/CSS deste componente não foi incorporado no contrato alternativo. A definição completa permanece no JSON original.</span>';host.append(note);return panel}
 const shadow=LAB_CREATE_PREVIEW(host,screenId,entry.kind==='element'?null:(entry.previewRecordId||entry.id),entry.kind==='element'?entry.base:null);const style=document.createElement('style');style.textContent=`:host{min-height:280px;background:#eef2f6} .prototype-drawer{display:block!important;position:relative!important;inset:auto!important;min-height:340px} .drawer-panel{position:relative!important;inset:auto!important;min-height:340px;max-width:320px} .drawer-backdrop{display:none!important} .route-modal,.aj08-route-modal,.flow-overlay{display:flex!important;position:relative!important;inset:auto!important;min-height:230px;background:transparent!important} .status-toast,.op-toast{position:relative!important;opacity:1!important;transform:none!important;left:auto!important;bottom:auto!important;margin:20px} [data-lab-view="component"]>button{max-width:100%}`;shadow.append(style)}catch(e){const p=document.createElement('div');p.className='notice';p.textContent=e.message;host.replaceChildren(p)}
 const note=document.createElement('div');note.className='json-status';note.textContent='Prévia isolada — outros elementos da tela não são carregados aqui.';panel.append(note);return panel;
}
function LAB_GLOBAL_PICK(){const list=LAB_GLOBAL_LIST();LAB_STATE.globalSelection=Math.min(LAB_STATE.globalSelection,Math.max(0,list.length-1));return list[LAB_STATE.globalSelection]||null}
function LAB_GLOBAL_TABS(area){const cats=['Todos',...new Set(LAB_GLOBAL_COMPONENTS.map(c=>c.category))];const bar=document.createElement('nav');bar.className='global-cat';bar.setAttribute('aria-label','Categorias de componentes globais');for(const c of cats){const b=document.createElement('button');b.textContent=c;b.className=LAB_STATE.globalCategory===c?'active':'';b.onclick=()=>{LAB_STATE.globalCategory=c;LAB_STATE.globalSelection=0;LAB_RENDER_CONTENT()};bar.append(b)}area.append(bar)}
function LAB_GLOBAL_GALLERY(area){LAB_GLOBAL_TABS(area);const pre=document.createElement('p');pre.className='global-intro';pre.textContent=`Componentes e elementos encontrados nas seis telas. ${LAB_GLOBAL_LIST().length} referências nesta categoria. Eles são candidatos à padronização, não componentes globais já aprovados.`;area.append(pre);
 const entries=LAB_GLOBAL_LIST(),selected=LAB_GLOBAL_PICK();if(!selected){area.innerHTML+='<div class="blank">Categoria sem registros.</div>';return}
 const wrap=document.createElement('div');wrap.className='comp-layout';const list=document.createElement('nav');list.className='comp-list';list.setAttribute('aria-label','Itens de referência da biblioteca Global');entries.forEach((c,index)=>{
 const b=document.createElement('button');b.className='comp-item '+(index===LAB_STATE.globalSelection?'active':'');b.innerHTML='<strong>'+LAB_E(c.name)+'</strong><small>'+LAB_E(c.category)+' · '+LAB_E(c.sourceScreen)+'</small>';b.onclick=()=>{LAB_STATE.globalSelection=index;LAB_RENDER_CONTENT()};list.append(b)
 });wrap.append(list);
 if(LAB_STATE.major==='tela'&&LAB_STATE.minor==='documentacao'||LAB_STATE.major==='componentes'&&LAB_STATE.minor==='documentacao'){
 const docs=document.createElement('div');const real={...selected.base,id:selected.compId,compId:selected.compId,category:selected.category,name:selected.name,kind:selected.kind};LAB_DOC_COMPONENT(docs,real,selected.sourceScreen);wrap.append(docs);
 }else{const real={...selected.base,id:selected.compId,compId:selected.compId,category:selected.category,name:selected.name,kind:selected.kind};wrap.append(LAB_COMPONENT_PREVIEW(real,selected.sourceScreen))}
 area.append(wrap);
}
function LAB_GLOBAL_DOCS(area){LAB_GLOBAL_GALLERY(area)}
const LAB_INITIAL_SCREEN=document.documentElement.dataset.screenId;
if(LAB_INITIAL_SCREEN&&LAB_BY_ID.has(LAB_INITIAL_SCREEN)){LAB_STATE.screenId=LAB_INITIAL_SCREEN;LAB_STATE.globalCategory=LAB_INITIAL_SCREEN==='global.componentes'?'Headers':'Todos';}
LAB_RENDER();

})();
