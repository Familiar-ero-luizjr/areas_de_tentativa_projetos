/* AdvogadoJá | Motor universal de tela | V10
   Nenhuma verificação de perfil, namespace ou nome de tela.
   Carrega somente o contrato JSON e o catálogo de componentes.
   Sem eval, HTML dinâmico fornecido pelo JSON ou JavaScript por tela.
*/
(async()=>{
'use strict';
const $=id=>document.getElementById(id);
const page=document.documentElement;
const base=page.dataset.root||'';
const mount=$('screen-root'),message=$('status'),controls=$('controls');
const svgNS='http://www.w3.org/2000/svg';
const svgTags=new Set('svg path g circle rect line polygon polyline ellipse defs lineargradient stop mask clippath use symbol text tspan foreignobject'.split(' '));
const attrNames={viewbox:'viewBox',preserveaspectratio:'preserveAspectRatio',gradientunits:'gradientUnits',strokewidth:'stroke-width',strokelinecap:'stroke-linecap'};
let screen,components,ordered=[],instances={},values={},listeners={},routes=[],stateDefs=new Map();
function notify(txt){message.textContent=txt;window.parent?.postMessage({type:'aj-status',screen:screen?.identidade?.id,message:txt},'*')}
function assert(ok,txt){if(!ok)throw Error(txt)}
function safeAttr(el,k,v){
 if(/^on/i.test(k)||['srcdoc','formaction','innerHTML'].includes(k))return;
 if(['src','href','xlink:href'].includes(k)&&/^\s*(?:https?:|javascript:|data:text\/html)/i.test(String(v)))return;
 const name=attrNames[k]||k;
 if(v===false||v===null||v===undefined){el.removeAttribute(name);return}
 if(v===true){el.setAttribute(name,'');return}
 el.setAttribute(name,String(v));
}
function resolve(id){return instances[id]}
function pathGet(obj,path){let val=obj;for(const p of String(path).split('.'))val=val?.[p];return val}
// Diretivas de template herdadas não fazem parte do contrato V10. Sem uma
// coleção declarada, elas não podem ser avaliadas e jamais devem vazar na UI.
function textValue(value){return String(value??'').replace(/\{\{[#/](?:each|if)\b[^}]*\}\}/g,'')}
function buildInstance(id){
 const inst=screen.estrutura.html.composicao[id],c=components[inst.componenteRef];assert(c,'Componente não localizado: '+inst.componenteRef);
 const h=c.estrutura?.html||{},defs=h.elementos||{},nodes={};
 function make(nodeId,ancestors=[],svg=false){
  assert(!ancestors.includes(nodeId),'Ciclo no componente '+c.identidade.id);
  const info=defs[nodeId];assert(info,'Elemento não localizado: '+nodeId+' em '+c.identidade.id);
  const tag=String(info.tag||'div').toLowerCase(),asSvg=svg||svgTags.has(tag);
  const node=tag==='#text'?document.createTextNode(textValue(info.texto)):asSvg?document.createElementNS(svgNS,tag):document.createElement(tag);
  if(node.nodeType===1){node.dataset.uiNode=nodeId;for(const [k,v] of Object.entries(info.atributos||{}))safeAttr(node,k,v);if(info.texto)node.textContent=textValue(info.texto)}
  nodes[nodeId]=node;
  for(const [child,ref] of Object.entries(defs).filter(([,x])=>x.paiRef===nodeId).sort((a,b)=>(a[1].ordem||0)-(b[1].ordem||0)))node.append(make(child,[...ancestors,nodeId],asSvg));
  return node;
 }
 const root=make(h.raizRef);if(root.nodeType===1){root.dataset.ajInstance=id;}if(inst.props?.variante&&root.nodeType===1)root.setAttribute('data-variante',inst.props.variante);
 for(const link of h.vinculos||[]){let el=nodes[link.elementoRef],value=pathGet({props:inst.props||{}},link.campo);if(!el||value===undefined||value===null)continue;
  if(link.alvo==='texto'){if(el.nodeType===3)el.data=String(value);else el.textContent=String(value)}
  else if(link.alvo==='atributo')safeAttr(el,link.atributo,value)
 }
 for(const event of c.interacoes||[]){const el=nodes[event.elementoRef];if(el?.nodeType===1){el.dataset.eventKey=id+'|'+event.id;el.dataset.uiEvent=event.evento||'click'}}
 instances[id]={root,nodes,component:c,definition:inst};
 return root;
}
function mountChildren(parentId){
 for(const [id,inst] of ordered.filter(([_,v])=>v.paiRef===parentId)){
  const parent=resolve(parentId);assert(parent,'Instância pai ausente: '+parentId);
  const slot=parent.nodes[inst.alvoRef]||parent.root;
  const root=buildInstance(id);
  // A ordem de composição é explícita, e não inferida do ID ou tipo de tela.
  const siblings=ordered.filter(([sibId,x])=>x.paiRef===parentId&&x.alvoRef===inst.alvoRef);
  const following=siblings.filter(([,x])=>(x.ordem||0)>(inst.ordem||0)).map(([sibId])=>instances[sibId]?.root).find(x=>x&&x.parentNode===slot);
  // Intercala instâncias e elementos nativos do pai pela ordem declarada.
  const nativeElements=parent.component.estrutura?.html?.elementos||{};
  const pivot=[...slot.childNodes].find(el=>{
   const childId=el.nodeType===1?el.dataset.uiNode:null;
   const nativeOrder=childId&&nativeElements[childId]?.paiRef===inst.alvoRef?nativeElements[childId]?.ordem:null;
   const instOrder=Object.values(instances).find(x=>x.root===el)?.definition.ordem;
   return (instOrder??nativeOrder??-Infinity)>(inst.ordem||0);
  });
  if(pivot)slot.insertBefore(root,pivot);else if(following)slot.insertBefore(root,following);else slot.append(root);
  mountChildren(id);
 }
}
function stateTarget(t,scope){
 if(t.tipo==='instancia')return resolve(t.ref)?.root;
 if(t.tipo==='elemento')return resolve(t.instanciaRef||scope)?.nodes[t.ref];
}
function condition(c){
 if(!c)return true;
 if(c.estadoRef)return stateDefs.has(c.estadoRef)&&values[c.estadoRef]===c.igual;
 if(Array.isArray(c.todos))return c.todos.every(condition);
 if(Array.isArray(c.qualquer))return c.qualquer.some(condition);
 return false;
}
function applyTarget(t,scope){
 if(t.quando&&!condition(t.quando))return;
 const node=stateTarget(t,scope);if(!node)return;
 if(node.nodeType===1){for(const [cls,on] of Object.entries(t.classes||{}))node.classList.toggle(cls,!!on);
  for(const [attr,val] of Object.entries(t.atributos||{}))safeAttr(node,attr,val)}
 if(Object.hasOwn(t,'texto')){if(node.nodeType===3)node.data=String(t.texto);else node.textContent=String(t.texto)}
}
function setState(ref,value,silent=false){
 const def=stateDefs.get(ref);if(!def||!Object.hasOwn(def.dimension.opcoes,value))return false;
 values[ref]=value;
 for(const t of def.dimension.opcoes[value].alvos||[])applyTarget(t,def.scope);
 if(!silent){refresh();notify(ref+' = '+value)}
 return true;
}
function refresh(){
 for(const [id,inst] of Object.entries(screen.estrutura.html.composicao))if(resolve(id))resolve(id).root.hidden=!condition(inst.visivelQuando);
 for(const sheet of document.querySelectorAll('[data-css-rule]'))sheet.disabled=!condition(JSON.parse(sheet.dataset.condition));
 for(const item of controls.querySelectorAll('[data-state-ref]')){const ref=item.dataset.stateRef;if(item.value!==values[ref])item.value=values[ref]}
}
function injectCSS(){
 const tokens=screen.estrutura.css.tokens||{};document.documentElement.style.cssText=Object.entries(tokens).map(([k,v])=>`${k}:${v}`).join(';');
 const add=(rule)=>{const tag=document.createElement('style');tag.dataset.cssRule=rule.id;tag.dataset.condition=JSON.stringify(rule.aplicaQuando||null);tag.textContent=rule.css||'';document.head.append(tag)};
 const sheets=screen.estrutura.css.folhasRefs||[];for(const ref of sheets){assert(components[ref],'Folha CSS ausente: '+ref);for(const r of [...(components[ref].estrutura?.css?.regras||[])].sort((a,b)=>(a.ordem||0)-(b.ordem||0)))add(r)}
 for(const r of [...(screen.estrutura.css.regras||[])].sort((a,b)=>(a.ordem||0)-(b.ordem||0)))add(r);
 const seen=new Set();for(const [_,inst] of ordered)if(!seen.has(inst.componenteRef)){
  seen.add(inst.componenteRef);for(const r of [...(components[inst.componenteRef]?.estrutura?.css?.regras||[])].sort((a,b)=>(a.ordem||0)-(b.ordem||0)))add(r)
 }
}
function availableRoute(r){return condition(r.quando)&&!resolve(r.origem?.instanciaRef)?.root.hidden}
function requestNavigation(r){
 if(!r){notify('Nenhuma rota ativa para a ação');return}
 const evt={type:'aj-route',from:screen.identidade.id,to:r.destinoRef,route:r.id};
 window.parent?.postMessage(evt,'*');window.dispatchEvent(new CustomEvent('advogadoja:navegar',{detail:evt}));
 notify('Destino solicitado: '+r.destinoRef);
}
function effect(x){
 if(!x)return;
 if(x.tipo==='multiplos'){for(const e of x.efeitos||[])effect(e);return}
 if(x.tipo==='definir_estado'||x.tipo==='alternar_estado'){
  const scope=x.instanciaRef||'screen',ref=scope==='screen'?screen.estados?.[x.dimensao]?.id:resolve(scope)?.component.estados?.[x.dimensao]?.id;
  if(!ref)return;
  let value=x.valor;
  if(x.tipo==='alternar_estado')value=(x.valores||[]).find(v=>v!==values[ref])||(x.valores||[])[0];
  setState(ref,value);return
 }
 if(x.tipo==='acao_local'){notify('Ação local simulada: '+String(x.acao||'ação'));return}
 notify('Operação simulada: '+String(x.tipo||'ação'));
}
function readEvent(el,kind="click"){
 const origin=el.closest('[data-event-key]');if(origin&&origin.dataset.uiEvent===kind){
  const [instance,event]=origin.dataset.eventKey.split('|');
  const action=listeners[origin.dataset.eventKey];if(action){effect(action.efeito);return true}
  const route=routes.find(r=>r.origem?.instanciaRef===instance&&r.origem?.eventoRef===event&&availableRoute(r));if(route){requestNavigation(route);return true}
 }
 const dst=el.closest('[data-goto]')?.dataset.goto;
 if(dst){const found=routes.filter(x=>x.destinoRef===dst&&availableRoute(x));if(found.length===1){requestNavigation(found[0]);return true}if(found.length>1){notify('Destino ambíguo: '+dst);return true}}
 return false;
}
function reset(){
 for(const [ref,def] of stateDefs)setState(ref,def.initial,true);
 refresh();notify('Tela pronta: '+screen.identidade.id);
}
function buildControls(){
 controls.replaceChildren();let group=document.createElement('details');group.open=false;const title=document.createElement('summary');title.textContent='Simular estados';group.append(title);
 for(const [ref,def] of stateDefs){const line=document.createElement('label');line.className='state-row';const name=document.createElement('span');name.textContent=ref;const select=document.createElement('select');select.dataset.stateRef=ref;
  for(const val of Object.keys(def.dimension.opcoes||{})){const option=document.createElement('option');option.value=val;option.textContent=val;select.append(option)}
  select.onchange=()=>setState(ref,select.value);line.append(name,select);group.append(line)
 }
 controls.append(group);const btn=document.createElement('button');btn.textContent='Restaurar';btn.onclick=reset;controls.append(btn)
}
function genericClick(event){
 const el=event.target.closest('button,a,[data-event-key],[data-goto]');if(!el)return;
 if(readEvent(el)){event.preventDefault();return}
 // Botões sem vínculo: mantêm efeito de demonstração, nunca navegam por um atributo solto.
 if(el.matches('button[data-action],button[data-ui-action]')){event.preventDefault();notify('Ação sem vínculo de contrato: '+(el.dataset.action||el.dataset.uiAction))}
}
function handleForm(event){event.preventDefault();const form=event.target;if(!form.reportValidity())return;
 const valid=routes.filter(r=>r.origem?.instanciaRef===form.closest('[data-aj-instance]')?.dataset.ajInstance && ['submit','form.submit'].includes(r.origem.eventoRef)&&availableRoute(r));
 if(valid.length===1)requestNavigation(valid[0]);else if(valid.length>1)notify('Defina os estados da simulação para selecionar uma rota de saída.');else notify('Formulário simulado, nenhuma chamada externa executada.');
}
try{
 const [response,catalog]=await Promise.all([fetch('./documento.json'),fetch(base+'componentes/catalogo.json')]);
 assert(response.ok&&catalog.ok,'Não foi possível carregar os JSONs. Use servidor HTTP local.');
 screen=await response.json();components=await catalog.json();
 assert(screen.identidade?.id,'Contrato sem identidade');routes=screen.navegacao?.rotas||[];
 ordered=Object.entries(screen.estrutura.html.composicao).sort((a,b)=>(a[1].ordem||0)-(b[1].ordem||0));
 for(const [axis,dim] of Object.entries(screen.estados||{}))stateDefs.set(dim.id,{scope:'screen',axis,dimension:dim,initial:dim.inicial});
 for(const [id,inst] of ordered){const comp=components[inst.componenteRef];assert(comp,'Componente ausente: '+inst.componenteRef);for(const [axis,dim] of Object.entries(comp.estados||{}))stateDefs.set(dim.id,{scope:id,axis,dimension:dim,initial:inst.estados?.[axis]||dim.inicial})}
 injectCSS();const rootId=screen.estrutura.html.raizRef;assert(screen.estrutura.html.composicao[rootId],'Instância raiz ausente');mount.append(buildInstance(rootId));mountChildren(rootId);
 for(const entry of screen.interacoes||[])listeners[entry.origem?.instanciaRef+'|'+entry.origem?.eventoRef]=entry;
 buildControls();if(new URLSearchParams(window.location.search).has('debug'))controls.hidden=false;reset();document.addEventListener('click',genericClick);document.addEventListener('change',ev=>readEvent(ev.target,'change'));document.addEventListener('submit',handleForm);
 window.addEventListener('message',ev=>{const d=ev.data||{};if(d.type==='aj-set-state'){const ref=d.estadoRef||(d.scope==='screen'?screen.estados?.[d.axis]?.id:resolve(d.scope)?.component.estados?.[d.axis]?.id);setState(ref,d.value)}else if(d.type==='aj-apply-mock'){reset();for(const [ref,value] of Object.entries(d.valores||{}))if(stateDefs.has(ref))setState(ref,value,true);refresh();notify('Cenário simulado aplicado')}else if(d.type==='aj-reset')reset()});
 window.parent?.postMessage({type:'aj-ready',screen:screen.identidade.id,instances:ordered.length},'*');
}catch(err){console.error(err);notify('ERRO: '+err.message)}
})();
