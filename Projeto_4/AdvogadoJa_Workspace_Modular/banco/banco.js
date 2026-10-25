'use strict';
const bancoUi={entity:''};
function bancoAggregate(){
 const entities=new Map(),relations=new Map();
 for(const screen of allScreens()){
  const persistence=screen.dados?.persistencia||{};
  for(const raw of arr(persistence.entidades)){
   const id=typeof raw==='string'?raw:raw?.id;if(!id)continue;
   const entity=entities.get(id)||{id,fields:new Map(),screens:new Set()};entity.screens.add(idOf(screen));
   for(const rawField of arr(raw.campos)){const field=typeof rawField==='string'?{id:rawField}:rawField;if(!field?.id)continue;const current=entity.fields.get(field.id)||{id:field.id,types:new Set(),accesses:new Set()};if(field.tipo)current.types.add(field.tipo);for(const access of [...arr(field.acessos),...(field.acesso?[field.acesso]:[])])current.accesses.add(access);entity.fields.set(field.id,current);}
   entities.set(id,entity);
  }
  for(const relation of arr(persistence.relacoes)){const key=relation.id||JSON.stringify(relation);const current=relations.get(key)||{...relation,screenIds:new Set()};current.screenIds.add(idOf(screen));relations.set(key,current);}
 }
 return {entities:[...entities.values()].sort((a,b)=>a.id.localeCompare(b.id)),relations:[...relations.values()]};
}
function bancoRender(){
 const list=$('bankEntityList');if(!list)return;const data=bancoAggregate();
 $('bankMetrics').innerHTML=[['Entidades',data.entities.length],['Campos',data.entities.reduce((sum,e)=>sum+e.fields.size,0)],['Relações',data.relations.length],['Telas com dados',new Set(data.entities.flatMap(e=>[...e.screens])).size]].map(([label,value])=>'<span class="pill emph">'+label+': <b>'+value+'</b></span>').join('');
 if(!data.entities.length){list.innerHTML='<div class="bank-empty">Ainda não há entidades declaradas nas jornadas. Ao registrar uma necessidade em <code>dados.persistencia</code> de uma tela, esta projeção se atualiza automaticamente.</div>';$('bankDetails').innerHTML='<div class="bank-empty">O Banco não possui dados próprios: ele só reflete os JSONs canônicos das telas.</div>';return;}
 if(!data.entities.some(entity=>entity.id===bancoUi.entity))bancoUi.entity=data.entities[0].id;
 list.innerHTML=data.entities.map(entity=>'<button class="bank-item '+(entity.id===bancoUi.entity?'active':'')+'" data-bank-entity="'+escapeHtml(entity.id)+'"><strong>'+escapeHtml(entity.id)+'</strong><small>'+entity.fields.size+' campos · '+entity.screens.size+' telas</small></button>').join('');
 list.querySelectorAll('[data-bank-entity]').forEach(button=>button.onclick=()=>{bancoUi.entity=button.dataset.bankEntity;bancoRender();});
 const entity=data.entities.find(item=>item.id===bancoUi.entity),links=data.relations.filter(relation=>relation.origem?.entidade===entity.id||relation.destino?.entidade===entity.id);
 $('bankDetails').innerHTML='<div class="pb"><h2 class="sectiontitle">'+escapeHtml(entity.id)+'</h2><p class="hint">Entidade agregada das telas que a declaram. Nenhuma tabela é cadastrada diretamente nesta aba.</p><table class="bank-table"><thead><tr><th>Campo</th><th>Tipo declarado</th><th>Acesso</th></tr></thead><tbody>'+[...entity.fields.values()].map(field=>'<tr><td><code>'+escapeHtml(field.id)+'</code></td><td>'+escapeHtml([...field.types].join(' · ')||'a definir')+'</td><td>'+escapeHtml([...field.accesses].join(' · ')||'a definir')+'</td></tr>').join('')+'</tbody></table><div class="hr"></div><h3 class="sectiontitle">Telas que declaram esta entidade</h3>'+[...entity.screens].map(id=>'<span class="bank-ref">'+escapeHtml(id)+'</span>').join('')+'<div class="hr"></div><h3 class="sectiontitle">Relações declaradas</h3>'+(links.length?links.map(link=>'<p class="hint"><code>'+escapeHtml(link.origem?.entidade||'?')+'.'+escapeHtml(link.origem?.campo||'?')+'</code> → <code>'+escapeHtml(link.destino?.entidade||'?')+'.'+escapeHtml(link.destino?.campo||'?')+'</code> '+escapeHtml(link.cardinalidade||'')+'</p>').join(''):'<p class="hint">Nenhuma relação declarada.</p>')+'</div>';
}
