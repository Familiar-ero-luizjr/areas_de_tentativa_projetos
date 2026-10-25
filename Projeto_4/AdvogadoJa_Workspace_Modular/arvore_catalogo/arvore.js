function renderTree(){
 const search=$('filter').value.trim().toLowerCase();
 const root={children:{},items:[]};
 for(const [type,items] of [['component',allComponents()],['screen',allScreens()]])for(const item of items){
  const path=pathOf(item,type);if(search&&!([path,idOf(item),item.identidade.nome].join(' ').toLowerCase().includes(search)))continue;
  let n=root;for(const piece of path.split('/').slice(0,-1)){n.children[piece]??={children:{},items:[]};n=n.children[piece];}
  n.items.push({type,id:idOf(item),name:path.split('/').at(-1),path});
 }
 function folder(node,name,level){let body='';for(const [k,v] of Object.entries(node.children).sort(([a],[b])=>a.localeCompare(b)))body+=folder(v,k,level+1);
  for(const x of node.items.sort((a,b)=>a.name.localeCompare(b.name)))body+=`<li class="leaf ${model.selection?.id===x.id&&model.selection?.type===x.type?'selected':''}" data-sel-type="${x.type}" data-sel-id="${escapeHtml(x.id)}" title="${escapeHtml(x.path)}"><span class="json">◆</span><span class="label-file">${escapeHtml(x.name)}</span><small>${x.type==='screen'?'tela':'comp.'}</small></li>`;
  return `<li><details ${level<2?'open':''}><summary><span class="fold">📁</span>${escapeHtml(name)}</summary><ul>${body}</ul></details></li>`;
 }
 $('catalogTree').innerHTML='<ul>'+folder(root,'Catálogo/',0)+'</ul>';
 document.querySelectorAll('[data-sel-id]').forEach(el=>el.addEventListener('click',()=>chooseItem(el.dataset.selType,el.dataset.selId)));
}
function treeJson(v,depth=0){
 if(depth>25)return '<span class="muted">Profundidade máxima</span>';
 if(v===null)return '<span class="bool">null</span>';
 if(typeof v==='string'){const s=v.length>130?v.slice(0,130)+'… ('+v.length+' caracteres)':v;return '<span class="str">'+escapeHtml(JSON.stringify(s))+'</span>';}
 if(typeof v!=='object')return '<span class="num">'+escapeHtml(String(v))+'</span>';
 const entries=Object.entries(v),label=(Array.isArray(v)?'Array':'Objeto')+' · '+entries.length;
 if(depth>=3&&entries.length>30)return `<details><summary>${label}</summary><div class="muted">Conteúdo grande: abra no editor para ver integralmente.</div></details>`;
 return `<details ${depth<2?'open':''}><summary>${label}</summary>${entries.map(([k,val])=>`<div style="margin-left:13px"><span class="key">${escapeHtml(k)}</span>: ${treeJson(val,depth+1)}</div>`).join('')}</details>`;
}
function chooseItem(type,id){model.selection={type,id};ui.jsonMode='tree';renderTree();renderSelected();}
function currentItem(){const {type,id}=model.selection||{};return model[type==='screen'?'screens':'components']?.[id]||null;}
function renderSelected(){
 const item=currentItem(),isScreen=model.selection?.type==='screen';
 $('exportSelected').disabled=!item;$('exportScreenPack').disabled=!item||!isScreen;
 if(!item){$('selTitle').textContent='Inspecionar JSON';$('selPath').textContent='Selecione um item na árvore.';$('selectionSummary').textContent='Nenhum item selecionado.';$('selectedTree').innerHTML='<div class="empty">Escolha uma tela ou componente.</div>';$('editSection').style.display='none';return;}
 $('selTitle').textContent=item.identidade.nome||idOf(item);$('selPath').textContent=pathOf(item,isScreen?'screen':'component');
 const refs=isScreen?arr(item.componentes?.instancias).map(i=>i.ref):[];
 $('selectionSummary').innerHTML=`<div class="rowline"><span class="tag">${isScreen?'TELA':'COMPONENTE'}</span><code>${escapeHtml(idOf(item))}</code></div>${isScreen?`<div class="muted">${refs.length} instâncias · ${new Set(refs).size} componentes únicos · ${arr(item.classificacao.jornadas).join(', ')} · ${arr(item.estados?.grupos).length} estados</div>`:'<div class="muted">Definição reutilizável: árvore HTML e CSS mantidos neste arquivo.</div>'}`;
 $('selectedTree').innerHTML=treeJson(item);$('itemEditor').value=JSON.stringify(item,null,2);
 showEditMode(ui.jsonMode);
}
function showEditMode(mode){ui.jsonMode=mode;$('selectedTree').style.display=mode==='tree'?'block':'none';$('editSection').style.display=mode==='edit'?'block':'none';}
function applyEdit(){const old=currentItem();if(!old)return;try{const item=JSON.parse($('itemEditor').value),kind=model.selection.type==='screen'?'screens':'components';validateRecord(kind,item);if(idOf(item)!==idOf(old))throw Error('Não é permitido trocar o ID pelo editor: exporte e reimporte como novo item.');model[kind][idOf(item)]=item;save();renderAll();showEditMode('edit');$('editMsg').className='msg good';$('editMsg').textContent='JSON validado e aplicado. Todas as projeções foram recalculadas.';}catch(e){$('editMsg').className='msg error';$('editMsg').textContent=e.message;}}
function renderConflicts(){
 $('conflicts').innerHTML=model.conflicts.length?'<h3 class="sectiontitle">Conflitos pendentes ('+model.conflicts.length+')</h3>'+model.conflicts.map((c,i)=>`<div class="conflict"><h3>${escapeHtml(c.id)} · ${c.kind==='components'?'Componente':'Tela'}</h3><p>O ID já existe, mas o conteúdo é diferente. Origem: ${escapeHtml(c.origin)}. Nenhuma substituição automática foi feita.</p><div class="controls"><button class="btn sm" data-conflict="${i}" data-conflict-action="keep">Manter atual</button><button class="btn sm primary" data-conflict="${i}" data-conflict-action="replace">Substituir pela importada</button></div></div>`).join(''):'';
 document.querySelectorAll('[data-conflict]').forEach(b=>b.onclick=()=>resolveConflict(+b.dataset.conflict,b.dataset.conflictAction==='replace'));
}
function renderStats(){const edges=collectEdges();$('stats').innerHTML=[['Componentes',allComponents().length],['Telas',allScreens().length],['Conexões descobertas',edges.length],['Destinos pendentes',edges.filter(e=>!e.resolvida).length],['Conflitos',model.conflicts.length]].map(([k,v],i)=>`<span class="pill ${i===4&&v?'warn':i===1?'emph':i===3&&v?'warn':''}">${escapeHtml(k)}: <b>${v}</b></span>`).join('');renderConflicts();}
function options(select,values,preferred){select.innerHTML=values.map(x=>`<option value="${escapeHtml(x.value)}">${escapeHtml(x.label)}</option>`).join('');if(values.some(v=>v.value===preferred))select.value=preferred;}
function renderSelectors(){const screens=allScreens(),screenOpts=screens.map(s=>({value:idOf(s),label:s.identidade.nome+' — '+idOf(s)}));
 for(const sid of ['screenChoice','flowScreenChoice','packageScreenChoice']){let pref=sid==='screenChoice'?ui.screen:sid==='flowScreenChoice'?ui.flowScreen:$(sid).value;options($(sid),screenOpts,pref);}
 ui.screen=$('screenChoice').value;ui.flowScreen=$('flowScreenChoice').value;
 const t=model.screens[ui.screen];
 const journeys=applicableJourneys(t);
 options($('journeyChoice'),journeys.map(j=>({value:j,label:journeyName(j)})),ui.journey||journeys[0]);ui.journey=$('journeyChoice').value;
 const states=arr(t?.estados?.grupos).map(g=>({value:g.id,label:g.nome||g.id}));if(!states.length)states.push({value:'padrao',label:'Padrão'});
 options($('stateChoice'),states,ui.state||t?.estados?.fallbackSeguro||states[0].value);ui.state=$('stateChoice').value;
}
