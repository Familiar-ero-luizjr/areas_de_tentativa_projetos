(()=>{'use strict';
const $=id=>document.getElementById(id);
let catalog=[],active=null,tab='base',doc=null;
const cache=new Map();
const descriptions={base:'Identidade, classificação, estrutura HTML/CSS, estados, interações e dados do contrato selecionado.',flow:'Rotas declaradas pela tela. O visualizador não deduz destinos nem altera o contrato.',prototype:'Contrato integral da tela, incluindo estados, interações, navegação, dados e cenários existentes.',states:'Estados declarados no contrato. Os controles atualizam somente a prévia aberta.',components:'Composição declarada para a tela: instâncias, referências e ordem.',data:'Fontes e operações declaradas pela própria tela.'};
function screenUrl(item){return item.path+'/index.html'}
function documentUrl(item){return item.path+'/documento.json'}
function renderPreview(){
 if(!active)return;
 const source=screenUrl(active);
 $('preview').src=source;$('separate').href=source;
}
function view(){
 if(!doc)return null;
 if(tab==='base'){const x={...doc};delete x.navegacao;delete x.mocks;return x}
 if(tab==='flow')return {identidade:doc.identidade,navegacao:doc.navegacao||{rotas:[]}};
 if(tab==='prototype')return doc;
 if(tab==='states')return {estados:doc.estados||{},mocks:doc.mocks||{cenarios:[]}};
 if(tab==='components')return {raizRef:doc.estrutura?.html?.raizRef,composicao:doc.estrutura?.html?.composicao||{}};
 return doc.dados||{fontes:[],operacoes:[]};
}
function treeNode(key,value,depth=0){
 if(value!==null&&typeof value==='object'){
  const group=document.createElement('details');group.open=depth<2;
  const sum=document.createElement('summary');sum.textContent=key+' '+(Array.isArray(value)?'['+value.length+']':'{'+Object.keys(value).length+'}');group.append(sum);
  for(const [k,v] of Object.entries(value))group.append(treeNode(k,v,depth+1));return group;
 }
 const leaf=document.createElement('div');leaf.className='leaf';leaf.textContent=key+': '+(typeof value==='string'?JSON.stringify(value):String(value));leaf.title=key;return leaf;
}
function renderInspector(){
 const out=view(),q=$('search').value.toLowerCase().trim();$('description').textContent=descriptions[tab];$('tree').replaceChildren();
 if(out===null)return;$('tree').append(treeNode(tab,out));
 if(q)for(const leaf of $('tree').querySelectorAll('.leaf')){const match=leaf.textContent.toLowerCase().includes(q);leaf.classList.toggle('hidden',!match);if(match){let parent=leaf.parentElement;while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement}}}
 document.querySelectorAll('[data-tab]').forEach(button=>button.classList.toggle('selected',button.dataset.tab===tab));
}
function phaseOf(item){const id=item.id;if(id.startsWith('auth.'))return '01_acesso';if(id.includes('.onboarding.')||id.startsWith('escritorio.onboarding'))return '02_cadastro_onboarding';if(id.startsWith('cliente.'))return '03_cliente';if(id.startsWith('advogado.'))return '04_advogado';if(id.startsWith('admin.'))return '05_administracao';return '06_outros'}
const phaseLabels={all:'Todas', '01_acesso':'01 · Acesso', '02_cadastro_onboarding':'02 · Cadastro e onboarding', '03_cliente':'03 · Cliente', '04_advogado':'04 · Profissional', '05_administracao':'05 · Administração', '06_outros':'06 · Escritório, estudante e notificações'};
function filtered(){const term=$('screenSearch').value.toLowerCase().trim(),group=$('group').value,phase=$('phaseNav').dataset.phase||'';return catalog.filter(item=>(!group||item.grupo===group)&&(!phase||phaseOf(item)===phase)&&(!term||[item.nome,item.id,item.path].join(' ').toLowerCase().includes(term)))}
function buildPhases(){const root=$('phaseNav');root.replaceChildren();for(const [phase,label] of [['',phaseLabels.all],...Object.entries(phaseLabels).filter(([key])=>key!=='all')]){const count=phase?catalog.filter(item=>phaseOf(item)===phase).length:catalog.length;const button=document.createElement('button');button.type='button';button.dataset.phase=phase;button.classList.toggle('selected',(root.dataset.phase||'')===phase);button.textContent=label;const small=document.createElement('small');small.textContent=count;button.append(small);button.onclick=()=>{root.dataset.phase=phase;buildPhases();renderScreens()};root.append(button)}}
function renderScreens(){
 const list=filtered(),root=$('screens');root.replaceChildren();
 if(!list.length){const empty=document.createElement('p');empty.className='empty';empty.textContent='Nenhuma tela encontrada.';root.append(empty);return}
 for(const item of list){const button=document.createElement('button');button.type='button';button.dataset.id=item.id;button.classList.toggle('selected',item.path===active?.path);button.textContent=item.nome;
  const small=document.createElement('small');small.textContent=item.id+' · '+item.grupo;button.append(small);button.onclick=()=>openScreen(item);root.append(button)}
}
async function openScreen(item){
 active=item;$('name').textContent=item.nome;$('id').textContent=item.id;$('status').textContent='Carregando contrato: '+item.id;renderPreview();renderScreens();
 try{doc=cache.get(item.path)||await fetch(documentUrl(item),{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Contrato não encontrado');return r.json()});cache.set(item.path,doc);$('name').textContent=doc.identidade?.nomeExibicao||item.nome;$('id').textContent=doc.identidade?.id||item.id;$('status').textContent='Contrato V2.1 pronto: '+($('id').textContent);renderInspector()}
 catch(error){doc=null;$('status').textContent='Erro ao carregar o contrato: '+error.message;renderInspector()}
}
function buildGroups(){const select=$('group');select.replaceChildren();for(const [value,label] of [['','Todos os acervos'],...Array.from(new Set(catalog.map(item=>item.grupo))).sort().map(value=>[value,'Acervo '+value])]){const option=document.createElement('option');option.value=value;option.textContent=label;select.append(option)}}
async function start(){
 try{const response=await fetch('CATALOGO_TELAS_V21.json',{cache:'no-store'});if(!response.ok)throw Error('Catálogo não encontrado');catalog=await response.json();if(!Array.isArray(catalog)||!catalog.length)throw Error('Catálogo sem telas');
  $('stats').replaceChildren();for(const label of [catalog.length+' telas',new Set(catalog.map(item=>item.grupo)).size+' acervos','1 motor']){const stat=document.createElement('strong');stat.textContent=label;$('stats').append(stat)}
  buildGroups();buildPhases();$('screenSearch').oninput=renderScreens;$('group').onchange=renderScreens;for(const button of document.querySelectorAll('[data-tab]'))button.onclick=()=>{tab=button.dataset.tab;renderInspector()};$('search').oninput=renderInspector;
  $('reset').onclick=()=>$('preview').contentWindow?.postMessage({type:'aj-reset'},'*');$('expand').onclick=()=>$('tree').querySelectorAll('details').forEach(node=>node.open=true);$('collapse').onclick=()=>$('tree').querySelectorAll('details').forEach(node=>node.open=false);
  $('export').onclick=()=>{if(!doc)return;const content=JSON.stringify(view(),null,2),url=URL.createObjectURL(new Blob([content],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download=(doc.identidade?.id||'tela').replaceAll('.','_')+'_'+tab+'.json';link.click();URL.revokeObjectURL(url)};
  window.addEventListener('message',event=>{const data=event.data||{};if(data.type==='aj-status'&&data.screen===doc?.identidade?.id)$('status').textContent=data.message||$('status').textContent;if(data.type==='aj-route'&&data.from===doc?.identidade?.id){const next=catalog.find(item=>item.id===data.to);if(next)openScreen(next);else $('status').textContent='Destino fora deste acervo: '+data.to}});
  renderScreens();openScreen(catalog[0]);
 }catch(error){$('status').textContent='Erro ao iniciar o visualizador: '+error.message}
}
start();
})();
