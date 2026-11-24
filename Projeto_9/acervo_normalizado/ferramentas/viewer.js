(()=>{'use strict';
const B=JSON.parse(document.getElementById('embedded-json').textContent);
const S=Object.values(B.telas)[0];const C=B.componentes;const copies={};const values={};
const sh=document.querySelector('#viewport').attachShadow({mode:'open'});
const q=id=>document.getElementById(id);const status=q('status');
const initial={...{'--primary':'#10233f','--primary-soft':'#173c6b','--gold':'#b88932','--page':'#eef2f6','--surface':'#fff','--line':'#dbe3ee','--text':'#172033','--muted':'#667085'},...S.estrutura.css.tokens};
let style=':host{display:block;min-height:100%;background:var(--page,#eef2f6);color:var(--text,#172033);'+Object.entries(initial).map(([k,v])=>`${k}:${v};`).join('')+'}\n*,*::before,*::after{box-sizing:border-box}button,input,select,textarea{font:inherit}button{cursor:pointer}[hidden]{display:none!important}\n';
// Screen CSS before components, same ownership boundaries as the bundle.
for(const r of S.estrutura.css.regras||[])style+='\n'+r.css;
const comp= S.estrutura.html.composicao;
const refOrder=Object.entries(comp).sort((a,b)=>a[1].ordem-b[1].ordem);
const unique=[...new Set(refOrder.map(([k,v])=>v.componenteRef))];
for(const id of unique){const c=C[id];if(!c)continue;
 for(const r of c.estrutura.css.regras||[])style+='\n'+r.css;
}
const styles=document.createElement('style');styles.textContent=style;sh.append(styles);
const mount=document.createElement('div');mount.id='render-root';sh.append(mount);
const svgNS='http://www.w3.org/2000/svg';
const svgTags=new Set(['svg','path','g','circle','rect','line','polygon','polyline','ellipse','defs','lineargradient','stop','mask','clippath','use','symbol','text']);
function build(ik){
 const ins=comp[ik],c=C[ins.componenteRef];if(!c)throw Error('Componente ausente: '+ins.componenteRef);
 const els=c.estrutura.html.elementos,map={},memo=new Set();
 function create(id,guard=0){
  if(map[id])return map[id];if(guard>30)throw Error('Ciclo de DOM em '+id);
  const e=els[id];if(!e)throw Error('Elemento ausente: '+id);
  let node;
  if(e.tag==='#text'){node=document.createTextNode(e.texto||'');}
  else{
   const t=(e.tag||'div').toLowerCase();const inSVG=svgTags.has(t)||svgTags.has((els[e.paiRef]?.tag||'').toLowerCase());
   node=inSVG?document.createElementNS(svgNS,t):document.createElement(t);
   node.dataset.uiNode=id;
   for(const [attr,val] of Object.entries(e.atributos||{})){
    if(attr==='hidden'&&String(val)==='false')continue;
    if(attr.startsWith('on')||attr==='srcdoc'||attr==='formaction')continue;
    if((attr==='href'||attr==='src')&&/^\s*(javascript:|https?:\/\/)/i.test(String(val)))continue;
    try{node.setAttribute(attr,String(val));}catch(_){/* malformed legacy attribute */}
   }
  }
  map[id]=node;
  const kids=Object.keys(els).filter(k=>els[k].paiRef===id).sort((a,b)=>els[a].ordem-els[b].ordem);
  for(const child of kids)node.append(create(child,guard+1));
  return node;
 }
 const root=create(c.estrutura.html.raizRef);
 // Resolve unbound static props without duplicating the header component for each role.
 for(const binding of c.estrutura.html.vinculos||[]){
  let v=ins.props;const parts=binding.campo.split('.').slice(1);
  for(const part of parts)v=v?.[part];
  if(v===undefined||v===null)continue;
  const el=map[binding.elementoRef];if(!el)continue;
  if(binding.alvo==='texto'&&el.nodeType===Node.TEXT_NODE)el.data=String(v);
  else if(binding.alvo==='atributo')el.setAttribute(binding.atributo,String(v));
 }
 // attach declarative event IDs to actual elements
 for(const event of c.interacoes||[]){const el=map[event.elementoRef];if(el?.nodeType===1)el.setAttribute('data-ui-eventkey',ik+'|'+event.id);}
 copies[ik]={root,map,component:c};values[ik]={};
 return root;
}
function attachChildren(pid){
 const children=Object.entries(comp).filter(([k,v])=>v.paiRef===pid).sort((a,b)=>a[1].ordem-b[1].ordem);
 for(const [ik,ins] of children){
  const parent=copies[pid];const target=parent.map[ins.alvoRef]||parent.root;
  const instance=build(ik);
  if(ins.componenteRef==='ui.aj.header.v1')target.prepend(instance);else target.append(instance);
  attachChildren(ik);
 }
}
const rt=S.estrutura.html.raizRef;
try{mount.append(build(rt));attachChildren(rt)}catch(err){status.textContent='Falha na montagem: '+err.message;status.className='bad';console.error(err);}
function setState(ik,dim,option,silent=false){
 const inst=copies[ik];if(!inst)return;
 const def=inst.component.estados?.[dim];if(!def||!def.opcoes?.[option])return;
 values[ik][dim]=option;
 for(const target of def.opcoes[option].alvos||[]){
  const node=target.tipo==='instancia'?inst.root:inst.map[target.ref];if(!node)continue;
  if(node.nodeType===1){
   for(const [name,flag] of Object.entries(target.classes||{}))node.classList.toggle(name,!!flag);
   for(const [name,v] of Object.entries(target.atributos||{})){
    if(v===null||v===false)node.removeAttribute(name);
    else node.setAttribute(name,v===true?'':String(v));
   }
  }
  if(Object.prototype.hasOwnProperty.call(target,'texto')){
   if(node.nodeType===Node.TEXT_NODE)node.data=target.texto;
   else {const child=[...node.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);if(child)child.data=target.texto;else node.prepend(document.createTextNode(target.texto));}
  }
 }
 if(!silent){show('Estado alterado: '+ik+' / '+dim+' → '+option);syncStateInputs(ik,dim,option);}
}
for(const [ik,obj] of Object.entries(copies)){
 const d=obj.component.estados||{};
 for(const [dim,def] of Object.entries(d))setState(ik,dim,comp[ik].estados?.[dim]||def.inicial,true);
}
function show(message){status.textContent=message;status.className='';}
function syncStateInputs(ik,dim,v){const s=document.querySelector(`[data-state-ik="${CSS.escape(ik)}"][data-state-dim="${CSS.escape(dim)}"]`);if(s)s.value=v;}
function makeStates(){
 const container=q('state-controls');container.replaceChildren();let n=0;
 for(const [ik,obj] of Object.entries(copies))for(const [dim,def] of Object.entries(obj.component.estados||{})){
  n++;const row=document.createElement('label');row.className='state-row';
  const top=document.createElement('span');top.textContent=ik+'  ·  '+dim;row.append(top);
  const sel=document.createElement('select');sel.dataset.stateIk=ik;sel.dataset.stateDim=dim;
  for(const val of Object.keys(def.opcoes||{})){const op=document.createElement('option');op.value=val;op.textContent=val;sel.append(op);}
  sel.value=values[ik][dim];sel.addEventListener('change',()=>setState(ik,dim,sel.value));row.append(sel);container.append(row);
 }
 if(!n){const p=document.createElement('p');p.textContent='Esta tela não possui estados alternativos declarados na fonte.';container.append(p);}
}
makeStates();
const bound=new Map(S.interacoes.map(e=>[e.origem.instanciaRef+'|'+e.origem.eventoRef,e]));
sh.addEventListener('click',e=>{
 const element=e.target.closest?.('[data-ui-eventkey],a,button');if(!element)return;
 e.preventDefault();const key=element.getAttribute('data-ui-eventkey');const link=bound.get(key);
 if(link){const ef=link.efeito;
  if(ef.tipo==='definir_estado'){
   let target=ef.valor;
   if(element.getAttribute('data-action')==='online.toggle'){
    const old=values[ef.instanciaRef]?.[ef.dimensao];const choices=Object.keys(copies[ef.instanciaRef].component.estados[ef.dimensao].opcoes);
    target=choices.find(x=>x!==old)||target;
   }
   setState(ef.instanciaRef,ef.dimensao,target);
  }else if(ef.tipo==='navegar'){show('Relação registrada: '+S.identidade.id+' → '+ef.destinoRef+' (navegação desativada neste estudo).');if(values)closeDrawer();}
  else show('Efeito declarado: '+ef.tipo);
 }else{show('Controle identificado, mas sem efeito validado nesta tela.');}
});
function closeDrawer(){for(const [ik,obj] of Object.entries(copies))if(obj.component.estados?.painel?.opcoes?.fechado)setState(ik,'painel','fechado',true);syncAll();}
function syncAll(){for(const [ik,dims] of Object.entries(values))for(const [d,v] of Object.entries(dims))syncStateInputs(ik,d,v);}
sh.addEventListener('submit',e=>{e.preventDefault();show('Formulário simulado: nenhum dado foi enviado.');});
const routes=q('routes');routes.replaceChildren();
for(const l of S.interacoes){const p=document.createElement('div');p.className='route-row';
 p.textContent=l.origem.instanciaRef+' · '+l.efeito.tipo+(l.id.endsWith('.candidata')?' (sequência inferida)':'')+(l.efeito.destinoRef?' → '+l.efeito.destinoRef:' · '+l.efeito.dimensao+'='+l.efeito.valor);routes.append(p);}
if(!routes.childElementCount)routes.textContent='Não foram encontradas ligações funcionais explícitas nesta tela.';
const contextTag=document.getElementById('context-json');
if(contextTag){const context=JSON.parse(contextTag.textContent);if(context.length){const h=document.createElement('h3');h.textContent='Sequência entre telas (proposta de estudo)';routes.append(h);for(const r of context){const div=document.createElement('div');div.className='route-row';div.textContent=(r.origem===S.identidade.id?'Próxima: '+r.destino:'Anterior: '+r.origem)+' · '+r.evidencia+' · não executa navegação';routes.append(div);}}}
q('json-view').textContent=JSON.stringify(B,null,2);
q('id-title').textContent=S.identidade.nome||S.identidade.id;
q('id-key').textContent=S.identidade.id;
q('state-count').textContent=String(Object.values(copies).reduce((n,c)=>n+Object.keys(c.component.estados||{}).length,0));
q('link-count').textContent=String(S.interacoes.length);
q('reset-states').addEventListener('click',()=>{for(const [ik,o] of Object.entries(copies))for(const [dim,def] of Object.entries(o.component.estados||{}))setState(ik,dim,comp[ik].estados?.[dim]||def.inicial,true);syncAll();show('Estados restaurados para os valores iniciais.');});
for(const t of document.querySelectorAll('[data-panel]'))t.addEventListener('click',()=>{
 const name=t.dataset.panel;for(const x of document.querySelectorAll('[data-panel]'))x.classList.toggle('active',x.dataset.panel===name);
 for(const x of document.querySelectorAll('[data-content]'))x.hidden=x.dataset.content!==name;
});
for(const t of document.querySelectorAll('[data-width]'))t.addEventListener('click',()=>{
 q('viewport').style.maxWidth=t.dataset.width==='mobile'?'390px':'100%';for(const x of document.querySelectorAll('[data-width]'))x.classList.toggle('active',x===t);
});
q('export-json').addEventListener('click',()=>{
 const a=document.createElement('a');const b=new Blob([JSON.stringify(S,null,2)+'\n'],{type:'application/json'});a.href=URL.createObjectURL(b);a.download=S.identidade.id+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
});
for(const s of S.mocks?.cenarios||[]){const b=document.createElement('button');b.className='scenario';b.textContent=s.nome;b.onclick=()=>{for(const [key,value] of Object.entries(s.valores||{})){const bits=key.split('.');const d=bits.pop();const ik=bits.join('.');setState(ik,d,value);} };q('scenario-controls').append(b);}
})();
