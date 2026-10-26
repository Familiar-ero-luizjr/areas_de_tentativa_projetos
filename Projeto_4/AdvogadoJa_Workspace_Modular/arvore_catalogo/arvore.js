function renderTree(){
 const search=$('filter').value.trim().toLowerCase();
 const root={children:{},items:[]};
 for(const [type,items] of [['component',allComponents()],['screen',allScreens()]])for(const item of items){
  const path=pathOf(item,type);if(search&&!([path,idOf(item),item.identidade.nome].join(' ').toLowerCase().includes(search)))continue;
  let n=root;for(const piece of path.split('/').slice(0,-1)){n.children[piece]??={children:{},items:[]};n=n.children[piece];}
  n.items.push({type,id:idOf(item),name:path.split('/').at(-1),path});
 }
 function folder(node,name,level){let body='';for(const [k,v] of Object.entries(node.children).sort(([a],[b])=>a.localeCompare(b,'pt-BR')))body+=folder(v,k,level+1);
  for(const x of node.items.sort((a,b)=>a.name.localeCompare(b.name,'pt-BR')))body+=`<button type="button" class="${model.selection?.id===x.id&&model.selection?.type===x.type?'selected':''}" data-sel-type="${x.type}" data-sel-id="${escapeHtml(x.id)}" title="${escapeHtml(x.id)}"><span class="modular-node-icon">▣</span>${escapeHtml(x.name.replace(/\.json$/,''))}</button>`;
  return `<details ${level<2?'open':''}><summary>${escapeHtml(name.replace(/\.json$/,''))} /</summary><button type="button" data-catalog-folder="${escapeHtml(name)}"><span class="modular-node-icon">◈</span> Ver seção ${escapeHtml(name.replace(/\.json$/,''))}</button>${body}</details>`;
 }
 $('catalogTree').innerHTML='<button type="button" class="'+(!model.selection?'selected':'')+'" data-catalog-root><span class="modular-node-icon">◈</span> Catálogo completo</button>'+folder(root,'Catálogo',0);
 document.querySelectorAll('[data-sel-id]').forEach(el=>el.addEventListener('click',()=>chooseItem(el.dataset.selType,el.dataset.selId)));
 document.querySelectorAll('[data-catalog-root],[data-catalog-folder]').forEach(el=>el.addEventListener('click',()=>{model.selection=null;ui.jsonMode='tree';renderTree();renderSelected();}));
 const count=$('catalogTreeCount');if(count)count.textContent=allComponents().length+' componentes · '+allScreens().length+' telas';
 renderCatalogJump();
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
function renderCatalogJump(){
 const select=$('catalogJump');if(!select)return;
 const old=select.value, screens=allScreens();
 select.innerHTML='<option value="">Ir diretamente para uma tela…</option>'+screens.map(t=>`<option value="${escapeHtml(idOf(t))}">${escapeHtml(t.identidade.nome||idOf(t))} · ${escapeHtml(idOf(t))}</option>`).join('');
 const selected=model.selection?.type==='screen'?model.selection.id:old;
 if(screens.some(t=>idOf(t)===selected))select.value=selected;
}
function renderCatalogPreview(){
 const panel=$('catalogPreviewPanel'),frame=$('catalogPreview'),note=$('catalogPreviewNote'),title=$('selTitle'),toggle=$('catalogPreviewRefresh');
 const item=currentItem(),isScreen=model.selection?.type==='screen';
 if(!isScreen||!item){panel.hidden=true;frame.srcdoc='';toggle.textContent='Mostrar prévia';return;}
 const screenId=idOf(item),journeys=applicableJourneys(item),states=arr(item.estados?.grupos);
 const journeyOptions=(journeys.length?journeys:['*']).map(j=>({value:j,label:journeyName(j)}));
 const stateOptions=(states.length?states:[{id:item.estados?.fallbackSeguro||'padrao',nome:'Padrão'}]).map(s=>({value:s.id,label:s.nome||s.id}));
 if(ui.catalogPreviewScreen!==screenId){ui.catalogPreviewScreen=screenId;ui.catalogPreviewJourney=journeyOptions[0].value;ui.catalogPreviewState=stateOptions[0].value;}
 if(!journeyOptions.some(o=>o.value===ui.catalogPreviewJourney))ui.catalogPreviewJourney=journeyOptions[0].value;
 if(!stateOptions.some(o=>o.value===ui.catalogPreviewState))ui.catalogPreviewState=stateOptions[0].value;
 const journey=$('catalogPreviewJourney'),state=$('catalogPreviewState');
 journey.innerHTML=journeyOptions.map(o=>`<option value="${escapeHtml(o.value)}">${escapeHtml(o.label)}</option>`).join('');state.innerHTML=stateOptions.map(o=>`<option value="${escapeHtml(o.value)}">${escapeHtml(o.label)}</option>`).join('');
 journey.value=ui.catalogPreviewJourney;state.value=ui.catalogPreviewState;
 title.textContent='Prévia de montagem · '+(item.identidade.nome||screenId);
 if(!ui.catalogPreviewShowing){panel.hidden=true;frame.srcdoc='';toggle.textContent='Mostrar prévia';return;}
 const mounted=compile(item,ui.catalogPreviewJourney,ui.catalogPreviewState);
 frame.srcdoc=previewHTML(mounted,false);toggle.textContent='Ocultar prévia';
 note.textContent=`${mounted.componentes.length} componente(s) montado(s) · ${mounted.grupos.length} grupo(s) HTML · ${mounted.acoes.length} ação(ões) · ${mounted.pendencias.length?mounted.pendencias.length+' referência(s) pendente(s)':'nenhuma referência pendente'}.`;
 panel.hidden=false;
}
function catalogIndexView(){return {catalogo:{metadados:{schema:CONTRACT,tipo:'indice_visual_do_catalogo',fonte:'catalogo/telas + catalogo/componentes'},resumo:{componentes:allComponents().length,telas:allScreens().length},componentes:allComponents().map(c=>({id:idOf(c),nome:c.identidade.nome,localizacao:pathOf(c,'component')})),telas:allScreens().map(t=>({id:idOf(t),nome:t.identidade.nome,jornadas:arr(t.classificacao?.jornadas),localizacao:pathOf(t,'screen')}))}};}
function renderSelected(){
 const item=currentItem(),isScreen=model.selection?.type==='screen';
 $('exportSelected').disabled=!item;$('exportScreenPack').disabled=!item||!isScreen;
 if(!item){$('selTitle').textContent='Prévia de montagem';$('selPath').textContent='catalogo_modular.indice.json';$('selectionSummary').textContent=allComponents().length+' componentes · '+allScreens().length+' telas · selecione um nó para inspecionar seu JSON integral.';$('selectedTree').value=JSON.stringify(catalogIndexView(),null,2);$('editSection').style.display='none';renderCatalogPreview();return;}
 $('selTitle').textContent=item.identidade.nome||idOf(item);$('selPath').textContent='Catálogo / '+pathOf(item,isScreen?'screen':'component');
 const refs=isScreen?arr(item.componentes?.instancias).map(i=>i.ref):[];
 $('selectionSummary').textContent=isScreen?`TELA · ${idOf(item)} · ${refs.length} instâncias · ${new Set(refs).size} componentes únicos · ${arr(item.classificacao.jornadas).join(', ')} · ${arr(item.estados?.grupos).length} estados`:`COMPONENTE · ${idOf(item)} · definição reutilizável no documento canônico.`;
 $('selectedTree').value=JSON.stringify(item,null,2);$('selectedTree').scrollTop=0;$('itemEditor').value=JSON.stringify(item,null,2);
 renderCatalogPreview();showEditMode(ui.jsonMode);
}
function showEditMode(mode){ui.jsonMode=mode;$('selectedTree').style.display=mode==='tree'?'block':'none';$('editSection').style.display=mode==='edit'?'block':'none';}
function applyEdit(){const old=currentItem();if(!old)return;try{const item=JSON.parse($('itemEditor').value),kind=model.selection.type==='screen'?'screens':'components';validateRecord(kind,item);if(idOf(item)!==idOf(old))throw Error('Não é permitido trocar o ID pelo editor: exporte e reimporte como novo item.');model[kind][idOf(item)]=item;invalidateCatalogProjections();save();renderAll();showEditMode('edit');$('editMsg').className='msg good';$('editMsg').textContent='JSON validado e aplicado. Todas as projeções foram recalculadas.';}catch(e){$('editMsg').className='msg error';$('editMsg').textContent=e.message;}}
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
