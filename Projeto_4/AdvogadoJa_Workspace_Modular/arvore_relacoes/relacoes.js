function collectEdges(){const edges=[],seen=new Set();
 function add(origin,destination,kind,sourceId,rule){if(typeof destination!=='string'||!destination.trim())return;const key=JSON.stringify([origin,destination,kind,sourceId,rule]);if(seen.has(key))return;seen.add(key);edges.push({origem:origin,destino:destination,tipo:kind,origemAcao:sourceId,aplicaA:rule||{jornadas:['*'],estados:['*']},resolvida:!!model.screens[destination]});}
 for(const t of allScreens()){
  const origin=idOf(t);
  for(const g of arr(t.acoes?.grupos))for(const a of arr(g.acoes)){
   const rule=a.aplicaA||g.aplicaA;
   add(origin,a.destino,'acao',a.id||'',rule);
   add(origin,a.seSucesso?.destino,'apos_sucesso',a.id||'',rule);
   add(origin,a.seErro?.destino,'apos_erro',a.id||'',rule);
   for(const r of arr(a.rotas))add(origin,r.destino||r.next,'rota_condicional',a.id||'',r.aplicaA||rule);
  }
  for(const inst of arr(t.componentes?.instancias)){
   const items=arr(inst.props?.itens);
   for(const menuItem of items)add(origin,menuItem.destino,'item_componente',inst.id+':'+menuItem.id,menuItem.aplicaA||inst.aplicaA);
  }
 }
 return edges;
}
function renderFlow(){const edges=collectEdges();$('flowStats').innerHTML=[['Conexões',edges.length],['Destinos localizados',edges.filter(e=>e.resolvida).length],['Destinos ainda ausentes',edges.filter(e=>!e.resolvida).length]].map(([n,v])=>`<span class="pill ${n.includes('ausentes')&&v?'warn':'emph'}">${n}: <b>${v}</b></span>`).join('');
 $('flowList').innerHTML=edges.length?edges.map(e=>`<div class="relItem"><code>${escapeHtml(e.origem)}</code><span class="arrow">→</span><code>${escapeHtml(e.destino)}</code><span class="pill ${e.resolvida?'ok':'warn'}">${e.resolvida?'no catálogo':'aguarda tela'}</span><span class="tag">${escapeHtml(e.origemAcao)}</span></div>`).join(''):'<div class="empty">Nenhuma ação com destino declarada.</div>';
 const id=$('flowScreenChoice').value,outs=edges.filter(e=>e.origem===id),ins=edges.filter(e=>e.destino===id);
 $('outgoing').innerHTML=outs.map(e=>`<div class="relItem">→ <code>${escapeHtml(e.destino)}</code> <span class="pill ${e.resolvida?'ok':'warn'}">${e.resolvida?'resolvida':'pendente'}</span> <button class="btn sm danger" data-remove-ref="${escapeHtml(e.origemAcao)}" data-remove-kind="${escapeHtml(e.tipo)}" title="Remover esta saída na tela de origem">Desconectar</button></div>`).join('')||'<div class="muted">Sem saídas.</div>';
 $('outgoing').querySelectorAll('[data-remove-ref]').forEach(b=>b.onclick=()=>removeRelation(id,b.dataset.removeRef,b.dataset.removeKind));
 $('incoming').innerHTML=ins.map(e=>`<div class="relItem">← <code>${escapeHtml(e.origem)}</code> <span class="tag">${escapeHtml(e.origemAcao)}</span></div>`).join('')||'<div class="muted">Sem entradas conhecidas.</div>';
}

function addRelation(){
 const origin=$('flowScreenChoice').value,t=model.screens[origin];if(!t)return;
 const target=prompt('ID da tela de destino (deve existir na Store)', 'auth.sessao.entrar');if(target===null)return;
 const to=target.trim();if(!model.screens[to]){alert('Destino ainda não existe no catálogo: '+to+'\nCrie ou importe a tela primeiro.');return;}
 const label=prompt('Identificação desta conexão', 'Navegar para '+model.screens[to].identidade.nome);if(label===null)return;
 const groupId='navegacao_editor_relacoes';let group=arr(t.acoes?.grupos).find(g=>g.id===groupId);
 if(!group){t.acoes??={grupos:[]};t.acoes.grupos??=[];group={id:groupId,aplicaA:{jornadas:['*'],estados:['*']},acoes:[]};t.acoes.grupos.push(group);}
 group.acoes.push({id:'rel-manual-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),tipo:'ligacao_flow_manual',evento:'referencia_manual',rotulo:label||('Navegar: '+to),destino:to});
 save();renderAll();notice('Conexão declarada no JSON de '+origin+'.');
}
function removeRelation(origin,sourceId,kind){
 const t=model.screens[origin];if(!t)return;
 if(kind==='item_componente'){
  alert('Essa conexão pertence a um item de componente configurado na tela. Abra o JSON da tela e edite o item em componentes.instancias[].props.itens. Não removemos o menu inteiro automaticamente.');
  model.selection={type:'screen',id:origin};renderTree();renderSelected();switchTab('catalogo');return;
 }
 const groups=arr(t.acoes?.grupos),group=groups.find(g=>arr(g.acoes).some(a=>a.id===sourceId));
 if(!group)return;
 const action=group.acoes.find(a=>a.id===sourceId);
 if(!confirm('Desconectar '+origin+' → '+(action.destino||'rota')+'? A ação no JSON da origem será modificada.'))return;
 if(kind==='acao'){
  if(action.seSucesso?.destino||action.seErro?.destino||arr(action.rotas).length){delete action.destino;}
  else group.acoes=group.acoes.filter(a=>a!==action);
 }else if(kind==='apos_sucesso'&&action.seSucesso){delete action.seSucesso.destino;}
 else if(kind==='apos_erro'&&action.seErro){delete action.seErro.destino;}
 else if(kind==='rota_condicional'){
  alert('A conexão é rota condicional; edite a ação diretamente no JSON para escolher qual alternativa remover sem ambiguidade.');return;
 }else return;
 save();renderAll();notice('Conexão removida da tela de origem; as entradas foram recalculadas.');
}
