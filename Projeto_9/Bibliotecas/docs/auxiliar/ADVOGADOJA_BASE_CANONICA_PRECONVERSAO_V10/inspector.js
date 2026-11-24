(()=>{'use strict';
const ids=['global.splash','auth.global.boas_vindas','auth.global.sessao.entrar','auth.global.sessao.esqueceusenha','auth.global.sessao.resetarsenha','advogado.home','cliente.home.inicio','admin.home.dashboard'];
const $=id=>document.getElementById(id);let active=ids[0],tab='base',doc=null,journ=null,audit=null,selected={},route=[];
const path=id=>'telas/'+id.replaceAll('.','/')+'/index.html';
const fetchScreen=id=>fetch('telas/'+id.replaceAll('.','/')+'/documento.json').then(r=>{if(!r.ok)throw Error('Sem JSON '+id);return r.json()});
const descriptions={base:'Identidade, classificação, estrutura HTML/CSS, estados, interações locais e dados. Sem duplicar navegação ou mocks.',flow:'Mesma base + navegacao.rotas. Bifurcações são calculadas pelos eventos e pelas condições das rotas.',prototype:'Mesma base + navegação + mocks. O JSON de origem é único.',journeys:'Catálogo externo de jornadas/subjornadas por rotaRefs, sem duplicar condições.',audit:'Avisos e limitações identificados pela auditoria estrutural e pela vinculação de eventos.',states:'Simulador genérico de estados: altere os valores e observe estrutura, estilos e rotas, sem modificar o JSON.'};
function drawTabs(){document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('selected',b.dataset.tab===tab))}
function view(){if(!doc)return null;if(tab==='base'){const x={...doc};delete x.navegacao;delete x.mocks;return x}if(tab==='flow'){const x={...doc};delete x.mocks;return x}if(tab==='prototype')return doc;if(tab==='journeys')return journ;if(tab==='states')return {estados:doc.estados,componentes:doc.estrutura.html.composicao};if(tab==='audit')return {tela:active,problemas:audit.problemas,avisos:audit.avisos.filter(x=>x[1]?.startsWith('rota.'+active+'.')),mocksSemReferencia:audit.mocks_sem_ref.filter(x=>x[0]===active)};return doc}
function treeNode(key,value,open=true,depth=0){
 if(value!==null&&typeof value==='object'){
  const group=document.createElement('details');group.open=depth<2&&open;
  const sum=document.createElement('summary');sum.textContent=key+' '+(Array.isArray(value)?'['+value.length+']':'{'+Object.keys(value).length+'}');group.append(sum);
  for(const [k,v] of Object.entries(value))group.append(treeNode(k,v,open,depth+1));return group;
 }
 const leaf=document.createElement('div');leaf.className='leaf';const valueStr=typeof value==='string'?JSON.stringify(value):String(value);leaf.textContent=key+': '+valueStr;leaf.title=key;return leaf
}
function drawMocks(){
 const list=document.createElement('div');list.style.cssText='display:flex;flex-wrap:wrap;gap:7px;padding:9px;margin-bottom:10px;background:#f2f7ff;border:1px solid #d0dff1;border-radius:8px;font:11px system-ui';
 for(const m of doc.mocks?.cenarios||[]){if(!Object.keys(m.valores||{}).length)continue;
 const b=document.createElement('button');b.textContent=m.nome;b.style.cssText='border:1px solid #c5d5e9;background:white;padding:6px;border-radius:6px;cursor:pointer';b.title=m.id;
 b.onclick=()=>$('preview').contentWindow?.postMessage({type:'aj-apply-mock',valores:m.valores},'*');list.append(b)
 }
 if(!list.children.length)list.textContent='Nenhum cenário mock com valores de estado nesta tela.';
 $('tree').prepend(list);
}
function drawStates(){
 const panel=document.createElement('div');panel.className='state-tools';panel.style.cssText='display:grid;gap:9px;background:#f2f7ff;padding:12px;border:1px solid #d0dff1;border-radius:9px;margin-bottom:12px;font:11px system-ui';
 for(const [axis,def] of Object.entries(doc.estados||{})){
  const label=document.createElement('label');label.textContent=axis+' · '+def.id;label.style.cssText='display:grid;gap:4px;overflow-wrap:anywhere';
  const select=document.createElement('select');select.style.cssText='border:1px solid #b8c9e0;border-radius:6px;padding:6px';
  for(const opt of Object.keys(def.opcoes||{})){const el=document.createElement('option');el.value=opt;el.textContent=opt;select.append(el)}
  select.value=def.inicial;
  select.onchange=()=>$('preview').contentWindow?.postMessage({type:'aj-set-state',estadoRef:def.id,value:select.value},'*');
  label.append(select);panel.append(label)
 }
 const reset=document.createElement('button');reset.textContent='Restaurar estados';reset.onclick=()=>$('preview').contentWindow?.postMessage({type:'aj-reset'},'*');panel.append(reset);
 $('tree').prepend(panel);
}
function render(){const out=view(),q=$('search').value.toLowerCase().trim();$('description').textContent=descriptions[tab];$('tree').replaceChildren();if(out===null)return;const top=treeNode(tab,out);$('tree').append(top);if(tab==='states')drawStates();if(tab==='prototype')drawMocks();
 if(q){for(const leaf of $('tree').querySelectorAll('.leaf')){const show=leaf.textContent.toLowerCase().includes(q);leaf.classList.toggle('hidden',!show);if(show){let p=leaf.parentElement;while(p){if(p.tagName==='DETAILS')p.open=true;p=p.parentElement}}}}
 drawTabs();}
async function openScreen(id){active=id;const p=path(id);$('preview').src=p;$('separate').href=p;
 try{doc=selected[id]||(selected[id]=await fetchScreen(id));$('name').textContent=doc.identidade.nomeExibicao;$('id').textContent=doc.identidade.id;
 document.querySelectorAll('.screens button').forEach(b=>b.classList.toggle('selected',b.dataset.screen===id));$('status').textContent='Tela: '+id;render();}catch(e){$('status').textContent='Erro: '+e.message}}
function build(){for(const id of ids){const b=document.createElement('button');b.type='button';b.dataset.screen=id;b.textContent=id.split('.').slice(-2).join(' · ');const small=document.createElement('small');small.textContent=id;b.append(small);b.onclick=()=>openScreen(id);$('screens').append(b)}
 for(const b of document.querySelectorAll('[data-tab]'))b.onclick=()=>{tab=b.dataset.tab;render()};$('search').oninput=render;
 $('reset').onclick=()=>$('preview').contentWindow?.postMessage({type:'aj-reset'},'*');
 $('expand').onclick=()=>$('tree').querySelectorAll('details').forEach(el=>el.open=true);
 $('collapse').onclick=()=>$('tree').querySelectorAll('details').forEach(el=>el.open=false);
 $('export').onclick=()=>{const content=JSON.stringify(view(),null,2);const url=URL.createObjectURL(new Blob([content],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=active.replaceAll('.','_')+'_'+tab+'.json';a.click();URL.revokeObjectURL(url)};
 window.addEventListener('message',ev=>{const d=ev.data||{};if(d.type==='aj-status'&&d.screen===active)$('status').textContent=d.message||'';
 if(d.type==='aj-route'&&d.from===active){if(ids.includes(d.to))openScreen(d.to);else $('status').textContent='Destino externo à biblioteca de oito telas: '+d.to;}});
 Promise.all([fetch('jornadas.json').then(r=>r.json()),fetch('auditoria.json').then(r=>r.json())]).then(([j,a])=>{journ=j;audit=a;render()}).catch(e=>$('status').textContent=e.message);
 openScreen(active)
}
build();
})();
