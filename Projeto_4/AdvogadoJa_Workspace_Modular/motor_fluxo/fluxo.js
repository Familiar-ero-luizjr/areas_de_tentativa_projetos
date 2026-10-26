let flowUi={selected:null,selectedSeq:null,compact:false,showAll:true,collapsed:new Set(),paths:{},query:''};
let lastFlowBuild=null;
function flowHasRenderablePreview(t){return arr(t?.componentes?.instancias).some(inst=>model.components[inst.ref]);}
function flowPreviewDialog(){
 let dialog=$('flowPreviewDialog');
 if(dialog)return dialog;
 document.body.insertAdjacentHTML('beforeend','<dialog class="f-preview-dialog" id="flowPreviewDialog"><div class="f-preview-dialog-head"><div><span class="f-preview-dialog-kicker">PRÉVIA DA TELA</span><h2 id="flowPreviewDialogTitle"></h2><p id="flowPreviewDialogMeta"></p></div><button class="btn sm" type="button" id="flowPreviewDialogClose">Fechar</button></div><div class="f-preview-dialog-body" id="flowPreviewDialogBody"></div></dialog>');
 dialog=$('flowPreviewDialog');$('flowPreviewDialogClose').onclick=()=>dialog.close();
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
 return dialog;
}
function flowOpenPreview(screenKey){
 const t=model.screens[screenKey];if(!t)return;
 const dialog=flowPreviewDialog(),name=t.identidade?.nome||screenKey;
 const journey=applicableJourneys(t)[0]||'';
 const state=t.estados?.fallbackSeguro||arr(t.estados?.grupos)[0]?.id||'padrao';
 $('flowPreviewDialogTitle').textContent=name;
 $('flowPreviewDialogMeta').textContent=screenKey+' · '+journey+' · '+state;
 if(flowHasRenderablePreview(t)){
  const frame=document.createElement('iframe');frame.className='f-preview-dialog-frame';frame.sandbox='';frame.title='Prévia ampliada de '+name;
  frame.srcdoc=previewHTML(compile(t,journey,state),false);
  $('flowPreviewDialogBody').replaceChildren(frame);
 }else{
  const requested=arr(t.componentes?.instancias).length;
  const panel=document.createElement('section');panel.className='f-preview-unavailable';
  panel.innerHTML='<strong>Prévia visual ainda não disponível</strong><p>Esta tela participa normalmente do Flow, mas seus componentes visuais ainda não foram migrados para o catálogo. Por isso o Workspace não inventa uma interface nesta área.</p><dl><div><dt>Instâncias declaradas</dt><dd>'+requested+'</dd></div><div><dt>Componentes resolvidos</dt><dd>0</dd></div><div><dt>Estrutura do Flow</dt><dd>Disponível</dd></div></dl><p class="f-preview-unavailable-note">Use “Editar” no cartão para inspecionar o JSON canônico da tela.</p>';
  $('flowPreviewDialogBody').replaceChildren(panel);
 }
 if(!dialog.open)dialog.showModal();
}
function compileFlowStructure(){
 const store=allScreens(),sequenceMap=new Map(),branchIds=new Set(),occIds=new Set(),known=new Set(store.map(idOf)),warnings=[];
 let rootSequenceId='',entryId='';
 const put=(sequenceId,position,node)=>{
  if(!sequenceId || !Number.isInteger(position) || position<0){warnings.push('Sequência/posição inválida para '+node.id);return;}
  if(!sequenceMap.has(sequenceId))sequenceMap.set(sequenceId,[]);
  sequenceMap.get(sequenceId).push({position,node});
 };
 for(const t of store){const id=idOf(t),ed=t.flow?.editor;if(!ed)continue;
  if(ed.entrypoint){if(entryId)warnings.push('Múltiplos pontos de entrada: '+entryId+' e '+id);else{entryId=id;rootSequenceId=ed.rootSequenceId;}}
  for(const o of arr(ed.occurrences)){
   if(occIds.has(o.id))warnings.push('Ocorrência repetida: '+o.id);occIds.add(o.id);
   put(o.sequenceId,o.order,{type:'screen',id:o.id,screenKey:id,variant:o.variant||'default',sequenceId:o.sequenceId});
  }
  for(const b of arr(ed.branches)){
   if(branchIds.has(b.id))warnings.push('Bifurcação repetida: '+b.id);branchIds.add(b.id);
   put(b.sequenceId,b.order,{type:'branch',id:b.id,title:b.title||'Bifurcação',paths:arr(b.paths),owner:id,sequenceId:b.sequenceId});
  }
 }
 if(!entryId)warnings.push('Nenhuma tela foi marcada como entrypoint.');
 for(const [key,items] of sequenceMap){items.sort((a,b)=>a.position-b.position||a.node.id.localeCompare(b.node.id));for(let i=1;i<items.length;i++)if(items[i].position===items[i-1].position)warnings.push('Colisão em '+key+' na posição '+items[i].position);}
 const reached=new Set(),cycles=new Set();
 function walk(seq,parents=[]){if(parents.includes(seq)){cycles.add(seq);return;}reached.add(seq);for(const {node} of sequenceMap.get(seq)||[])if(node.type==='branch')for(const p of node.paths){if(p.sequenceId)walk(p.sequenceId,[...parents,seq]);else warnings.push('Caminho sem sequenceId: '+p.id);}}
 if(rootSequenceId)walk(rootSequenceId);
 for(const seq of sequenceMap.keys())if(!reached.has(seq))warnings.push('Sequência fora da árvore: '+seq);
 for(const s of cycles)warnings.push('Ciclo entre sequências: '+s);
 for(const t of store)if(!arr(t.flow?.editor?.occurrences).length)warnings.push('Tela fora da árvore: '+idOf(t));
 return {entryId,rootSequenceId,sequenceMap,warnings,occurrences:occIds.size,branches:branchIds.size,paths:store.flatMap(t=>arr(t.flow?.editor?.branches)).reduce((n,b)=>n+arr(b.paths).length,0),known};
}
function flowNodeId(){return 'f-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6)}
function flowEscapeAttr(s){return escapeHtml(s)}
function flowRenderStructure(){
 lastFlowBuild=compileFlowStructure();const b=lastFlowBuild;const edges=collectEdges();
 $('fMetrics').innerHTML=[['Telas',allScreens().length],['Ocorrências',b.occurrences],['Bifurcações',b.branches],['Caminhos',b.paths],['Relações V3',allScreens().reduce((n,t)=>n+arr(t.acoes?.grupos).filter(g=>g.origem==='flow_v3').reduce((a,g)=>a+arr(g.acoes).length,0),0)],['Ações adicionais',edges.length-allScreens().reduce((n,t)=>n+arr(t.acoes?.grupos).filter(g=>g.origem==='flow_v3').reduce((a,g)=>a+arr(g.acoes).length,0),0)]].map(([label,n])=>`<span class="pill emph">${label}: <b>${n}</b></span>`).join('');
 let cardCount=0,branchCount=0;
 const q=flowUi.query.trim().toLowerCase();
 function sequence(seq,ancestors=[]){
  if(ancestors.includes(seq))return '<div class="f-error">Ciclo detectado: '+flowEscapeAttr(seq)+'</div>';
  const items=b.sequenceMap.get(seq)||[];
  if(!items.length)return '<div class="f-subtree-empty">Caminho vazio · '+flowEscapeAttr(seq)+'</div>';
  return '<div class="f-seq" data-sequence="'+flowEscapeAttr(seq)+'">'+items.map(({node},i)=>{
   let content='';
   if(node.type==='screen'){
    cardCount++;const t=model.screens[node.screenKey];const name=t?.identidade?.nome||node.screenKey;
    const feat=t?.classificacao?.escopo||'outros';const matched=q&&(name+' '+node.screenKey).toLowerCase().includes(q);
    let thumbnail='<div class="f-preview-open f-preview-pending" role="button" tabindex="0" data-flow-preview-open="'+flowEscapeAttr(node.screenKey)+'" aria-label="Ver detalhes da prévia de '+flowEscapeAttr(name)+'"><div class="f-preview-hint"><b>Prévia estrutural pendente</b>Componentes visuais ainda não disponíveis.<span>Ver detalhes</span></div></div>';
    if(flowHasRenderablePreview(t)){
     // Iframes são caros: o cartão informa disponibilidade e a prévia real
     // só é montada ao clicar, no diálogo reutilizável flowOpenPreview().
     thumbnail='<div class="f-preview-open f-preview-ready" role="button" tabindex="0" data-flow-preview-open="'+flowEscapeAttr(node.screenKey)+'" aria-label="Abrir prévia de '+flowEscapeAttr(name)+'"><div class="f-preview-hint"><b>Prévia visual disponível</b>Montada a partir do catálogo quando aberta.<span>Abrir prévia</span></div></div>';
    }
    content=`<article class="f-card ${matched?'found':''} ${flowUi.selected===node.id?'focus':''}" data-feature="${flowEscapeAttr(feat)}" data-occ-id="${flowEscapeAttr(node.id)}"><div class="f-card-top"><div class="f-card-head"><span>▣ Tela</span><span class="f-chip">${flowEscapeAttr(feat)}</span></div><h3>${flowEscapeAttr(name)}</h3><small>${flowEscapeAttr(node.screenKey)} · ${flowEscapeAttr(node.id)}</small></div><div class="f-preview">${thumbnail}</div><div class="f-card-controls"><button data-flow-command="open" data-node-id="${flowEscapeAttr(node.id)}" data-key="${flowEscapeAttr(node.screenKey)}">Editar</button><button title="Subir" data-flow-command="up" data-node-id="${flowEscapeAttr(node.id)}">↑</button><button title="Descer" data-flow-command="down" data-node-id="${flowEscapeAttr(node.id)}">↓</button><button title="Inserir após" data-flow-command="add" data-node-id="${flowEscapeAttr(node.id)}">＋</button><button title="Bifurcação após" data-flow-command="branch" data-node-id="${flowEscapeAttr(node.id)}">⑂</button><button title="Remover esta ocorrência" data-flow-command="delete" data-node-id="${flowEscapeAttr(node.id)}">×</button></div></article>`;
   }else{
    branchCount++;
    const paths=node.paths;
    const active=flowUi.paths[node.id]&&paths.some(x=>x.id===flowUi.paths[node.id])?flowUi.paths[node.id]:(paths.find(x=>x.isDefault)||paths[0])?.id;
    const visible=flowUi.showAll?paths:paths.filter(x=>x.id===active);
    content=`<section class="f-branch" data-branch="${flowEscapeAttr(node.id)}"><header><strong>⑂ ${flowEscapeAttr(node.title)} <button class="f-edit-branch" data-flow-command="editbranch" data-node-id="${flowEscapeAttr(node.id)}">✎</button></strong><small>${paths.length} caminhos · ${flowEscapeAttr(node.id)}</small></header><div class="f-path-pills">${paths.map(path=>`<button class="${visible.some(x=>x.id===path.id)?'active':''}" data-flow-path="${flowEscapeAttr(node.id)}" data-path-id="${flowEscapeAttr(path.id)}">${flowEscapeAttr(path.label||path.id)}</button>`).join('')}<button data-flow-command="togglebranch" data-node-id="${flowEscapeAttr(node.id)}">${flowUi.collapsed.has(node.id)?'Expandir':'Recolher'}</button></div>${!flowUi.collapsed.has(node.id)?'<div class="f-paths">'+visible.map(path=>`<div class="f-path"><div class="f-path-label">${flowEscapeAttr(path.label||'Caminho')}</div>${sequence(path.sequenceId,[...ancestors,seq])}<button class="f-add-path" data-flow-command="addpath" data-sequence-id="${flowEscapeAttr(path.sequenceId)}">＋ Tela neste caminho</button></div>`).join('')+'</div>':''}</section>`;
   }
   return `<div class="f-node-wrap">${i?'<div class="f-connector"></div>':''}${content}</div>`;
  }).join('')+'</div>';
 }
 $('flowBoardContent').classList.toggle('f-small',flowUi.compact);
 $('flowBoardContent').innerHTML=b.rootSequenceId?sequence(b.rootSequenceId):'<div class="f-landing">Nenhum fluxo declarado. Informe flow.editor.entrypoint e rootSequenceId em uma tela.</div>';
 $('fDiagnostics').innerHTML=b.warnings.length?'<b>Diagnósticos da montagem</b> · '+b.warnings.length+'<div>'+b.warnings.slice(0,80).map(x=>'<div class="f-error">⚠ '+flowEscapeAttr(x)+'</div>').join('')+'</div>':'<span style="color:#16805c">✓ Sequências e bifurcações recompostas sem inconsistências estruturais detectadas.</span>';
 $('flowSummary').textContent=`Entrada: ${b.entryId||'não definida'} · raiz ${b.rootSequenceId||'—'} · ${cardCount} cartões e ${branchCount} bifurcações exibidos`;
 $('fToggleCompact').classList.toggle('active',flowUi.compact);$('fTogglePaths').classList.toggle('active',flowUi.showAll);
 // Não há iframes nesta árvore: cada prévia é criada sob demanda no diálogo.
}
function flowFindNode(id){for(const t of allScreens()){const ed=t.flow?.editor;if(!ed)continue;const o=arr(ed.occurrences).find(x=>x.id===id);if(o)return {owner:t,record:o,type:'screen'};const b=arr(ed.branches).find(x=>x.id===id);if(b)return {owner:t,record:b,type:'branch'};}return null;}
function flowSequenceItems(seq){const items=[];for(const t of allScreens()){const ed=t.flow?.editor;if(!ed)continue;for(const o of arr(ed.occurrences))if(o.sequenceId===seq)items.push(o);for(const b of arr(ed.branches))if(b.sequenceId===seq)items.push(b);}return items.sort((a,b)=>a.order-b.order);}
function flowEnsureEntrypoint(){
 const current=allScreens().find(t=>t.flow?.editor?.entrypoint),rootId=current?.flow?.editor?.rootSequenceId;if(!rootId)return;
 const visited=new Set();
 function first(seq){if(visited.has(seq))return null;visited.add(seq);
  for(const n of flowSequenceItems(seq)){const x=flowFindNode(n.id);if(!x)continue;if(x.type==='screen')return x.owner;
   if(x.type==='branch')for(const p of arr(x.record.paths)){const t=first(p.sequenceId);if(t)return t;}
  }return null;
 }
 const next=first(rootId);if(next&&next!==current){current.flow.editor.entrypoint=false;current.flow.editor.rootSequenceId=null;next.flow.editor.entrypoint=true;next.flow.editor.rootSequenceId=rootId;}
}
function flowPersist(){flowEnsureEntrypoint();invalidateCatalogProjections();save();renderAll();}
function flowMove(id,dir){const target=flowFindNode(id);if(!target)return;const items=flowSequenceItems(target.record.sequenceId),i=items.indexOf(target.record),j=i+dir;if(j<0||j>=items.length){$('flowSummary').textContent='O elemento já está no início/fim da sequência.';return;}const v=items[i].order;items[i].order=items[j].order;items[j].order=v;flowUi.selected=id;flowPersist();}
function flowInsert(id,asBranch=false){const current=flowFindNode(id);if(!current)return;const src=current.record,seq=src.sequenceId;
 if(asBranch){const idb=flowNodeId(),pa=flowNodeId(),pb=flowNodeId();const count=prompt('Título da nova bifurcação','Nova bifurcação');if(count===null)return;for(const n of flowSequenceItems(seq))if(n.order>src.order)n.order++;
  current.owner.flow.editor.branches.push({id:idb,sequenceId:seq,order:src.order+1,title:count||'Nova bifurcação',paths:[{id:pa,label:'Caminho 1',isDefault:true,sequenceId:'sequence-'+flowNodeId()},{id:pb,label:'Caminho 2',isDefault:false,sequenceId:'sequence-'+flowNodeId()}]});flowUi.selected=idb;
 }else{const options=allScreens().map(t=>idOf(t));const selected=prompt('ID da tela para inserir após '+idOf(current.owner)+'\nExemplo: '+options.slice(0,3).join(', '),options[0]);if(selected===null)return;const t=model.screens[selected.trim()];if(!t){alert('Tela não encontrada no catálogo. Importe-a primeiro.');return;}for(const n of flowSequenceItems(seq))if(n.order>src.order)n.order++;const nId=flowNodeId();t.flow??={};t.flow.editor??={entrypoint:false,rootSequenceId:null,occurrences:[],branches:[]};t.flow.editor.occurrences.push({id:nId,sequenceId:seq,order:src.order+1,variant:'default'});flowUi.selected=nId;
 }flowPersist();}
function flowAddToSequence(seq){const opts=allScreens().map(idOf);const selected=prompt('ID de tela para adicionar ao caminho '+seq,opts[0]);if(selected===null)return;const t=model.screens[selected.trim()];if(!t){alert('Tela ainda não existe na Store. Importe antes.');return;}t.flow??={};t.flow.editor??={entrypoint:false,rootSequenceId:null,occurrences:[],branches:[]};const nodes=flowSequenceItems(seq);const newId=flowNodeId();t.flow.editor.occurrences.push({id:newId,sequenceId:seq,order:nodes.length?Math.max(...nodes.map(n=>n.order))+1:0,variant:'default'});flowUi.selected=newId;flowPersist();}
function flowDelete(id){const n=flowFindNode(id);if(!n||n.type!=='screen')return;const ed=n.owner.flow?.editor;if(ed.entrypoint&&arr(ed.occurrences).some(o=>o.id===id&&o.sequenceId===ed.rootSequenceId)){alert('O ponto inicial não pode ser removido diretamente. Escolha outra entrada no JSON da tela.');return;}if(!confirm('Remover somente esta ocorrência da árvore? A definição da tela continuará no catálogo.'))return;ed.occurrences=arr(ed.occurrences).filter(o=>o.id!==id);flowUi.selected=null;flowPersist();}
function flowEditBranch(id){const n=flowFindNode(id);if(!n||n.type!=='branch')return;const title=prompt('Título da bifurcação',n.record.title);if(title===null)return;n.record.title=title.trim()||'Bifurcação';flowPersist();}
function flowOpenScreen(id){const result=flowFindNode(id);if(!result)return;model.selection={type:'screen',id:idOf(result.owner)};flowUi.selected=id;ui.jsonMode='tree';renderTree();renderSelected();switchTab('catalogo');}
function flowBind(){
 $('flowSearch').oninput=e=>{flowUi.query=e.target.value;flowRenderStructure();};
 $('fToggleCompact').onclick=()=>{flowUi.compact=!flowUi.compact;flowRenderStructure();};
 $('fTogglePaths').onclick=()=>{flowUi.showAll=!flowUi.showAll;flowRenderStructure();};
 $('fResetFlow').onclick=()=>{flowUi={selected:null,selectedSeq:null,compact:false,showAll:true,collapsed:new Set(),paths:{},query:''};$('flowSearch').value='';flowRenderStructure();};
 $('fExportRuntime').onclick=()=>{const b=compileFlowStructure(),copy={entrypoint:b.entryId,rootSequenceId:b.rootSequenceId,sequencias:Object.fromEntries([...b.sequenceMap].map(([id,items])=>[id,items.map(x=>x.node)])),relacoes:collectEdges(),diagnosticos:b.warnings};downloadText('flow_compilado_transitorio.json',JSON.stringify(copy,null,2));};
 $('flowBoardContent').onclick=e=>{const preview=e.target.closest('[data-flow-preview-open]');if(preview){flowOpenPreview(preview.dataset.flowPreviewOpen);return;}const btn=e.target.closest('button');if(!btn)return;
  if(btn.dataset.flowPath){flowUi.paths[btn.dataset.flowPath]=btn.dataset.pathId;flowUi.showAll=false;flowRenderStructure();return;}
  const id=btn.dataset.nodeId,cmd=btn.dataset.flowCommand;
  if(cmd==='togglebranch'){if(flowUi.collapsed.has(id))flowUi.collapsed.delete(id);else flowUi.collapsed.add(id);flowRenderStructure();return;}
  if(cmd==='addpath')flowAddToSequence(btn.dataset.sequenceId);else if(cmd==='delete')flowDelete(id);else if(cmd==='editbranch')flowEditBranch(id);else if(cmd==='open')flowOpenScreen(id);else if(cmd==='up')flowMove(id,-1);else if(cmd==='down')flowMove(id,1);else if(cmd==='add')flowInsert(id,false);else if(cmd==='branch')flowInsert(id,true);
 };
 $('flowBoardContent').onkeydown=e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-flow-preview-open]')){e.preventDefault();flowOpenPreview(e.target.dataset.flowPreviewOpen);}};
}

function flowCenter(){const board=$('flowBoard');if(!board)return;const root=board.querySelector('[data-occ-id]');if(!root)return;const b=board.getBoundingClientRect(),r=root.getBoundingClientRect();board.scrollLeft+=(r.left+r.width/2)-(b.left+b.width/2);board.scrollTop=0;}

