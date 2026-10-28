/* Intercâmbio de jornadas. Nenhum arquivo-mestre: exporta uma projeção e importa
 * por IDs estáveis para catalogo/telas e catalogo/componentes, com confirmação.
 */
'use strict';
const JIO_SCHEMA='advogadoja.jornada.intercambio.v1';
const jioState={doc:null,review:null};
function jornadaExportar(modo='referencias',journey=journeyPanel.journey){
 if(!journey)throw Error('Selecione uma jornada antes de exportar.');
 const screens=allScreens().filter(s=>screenSupportsJourney(s,journey));
 if(!screens.length)throw Error('Jornada sem telas cadastradas.');
 const requiredIds=[...new Set(screens.flatMap(s=>arr(s.componentes?.instancias).map(i=>i.ref).filter(Boolean)))].sort();
 const common={schema:JIO_SCHEMA,versao:'1.0.0',jornada:journey,modo};
 if(modo==='referencias')return {...common,telas:screens.map(s=>({id:idOf(s)})),componentes:requiredIds.map(id=>({id}))};
 if(modo!=='completo')throw Error('Modo de exportação inválido.');
 const missing=requiredIds.filter(id=>!model.components[id]);
 if(missing.length)throw Error('Componentes ainda não encontrados: '+missing.join(', '));
 return {...common,catalogo:{metadados:{schema:CONTRACT,tipo:'pacote_tela',versao:'1.0'},telas:screens.map(deepClone),componentes:requiredIds.map(id=>deepClone(model.components[id]))}};
}
function jornadaValidarPacote(doc){
 if(!obj(doc)||doc.schema!==JIO_SCHEMA||doc.versao!=='1.0.0')throw Error('Schema ou versão incompatível com advogadaja.jornada.intercambio.v1 (versão 1.0.0).');
 if(!/^[a-z][a-z0-9_.-]*$/.test(doc.jornada||'')||doc.jornada==='*')throw Error('jornada: ID estável inválido.');
 if(!['referencias','completo'].includes(doc.modo))throw Error('modo deve ser referencias ou completo.');
 if(doc.modo==='referencias'){
  if(!Array.isArray(doc.telas)||!Array.isArray(doc.componentes))throw Error('Referências exigem telas[] e componentes[].');
  for(const bucket of ['telas','componentes']){
   const ids=new Set();for(const e of doc[bucket]){
    if(!obj(e)||typeof e.id!=='string'||!/^[a-z][a-z0-9_.-]+$/.test(e.id))throw Error('Referência com ID inválido em '+bucket);
    if(ids.has(e.id))throw Error('ID repetido em '+bucket+': '+e.id);ids.add(e.id);
   }
  }
  return {screens:[],components:[],missing:[]};
 }
 if(!obj(doc.catalogo))throw Error('Modo completo exige catalogo com telas e componentes.');
 const norm=normalizeInput({catalogo:doc.catalogo});
 for(const t of norm.telas)validateRecord('screens',t);
 for(const c of norm.componentes)validateRecord('components',c);
 for(const [label,list] of [['tela',norm.telas],['componente',norm.componentes]]){
  const ids=new Set();for(const record of list){const id=idOf(record);if(ids.has(id))throw Error('ID repetido no pacote ('+label+'): '+id);ids.add(id);}
 }
 if(!norm.telas.length)throw Error('Jornada completa exige pelo menos uma tela.');
 for(const t of norm.telas)if(!screenSupportsJourney(t,doc.jornada))throw Error('Tela '+idOf(t)+' não declara jornada '+doc.jornada+'.');
 const incoming=new Set(norm.componentes.map(idOf)),missing=[];
 for(const t of norm.telas)for(const i of arr(t.componentes?.instancias))if(i.ref&&!incoming.has(i.ref)&&!model.components[i.ref])missing.push(i.ref);
 return {screens:norm.telas,components:norm.componentes,missing:[...new Set(missing)]};
}
function jornadaAnalisarImportacao(doc){
 const normalized=jornadaValidarPacote(doc);
 const review={doc,blocks:normalized.missing,records:[],refs:[],warnings:[],isReference:doc.modo==='referencias'};
 if(review.isReference){
  for(const x of doc.telas)review.refs.push({id:x.id,type:'tela',exists:!!model.screens[x.id]});
  for(const x of doc.componentes)review.refs.push({id:x.id,type:'componente',exists:!!model.components[x.id]});
 }else{
  const importedIds=new Set(normalized.screens.map(idOf));
  for(const t of normalized.screens)for(const group of arr(t.acoes?.grupos))for(const action of arr(group.acoes)){
   const id=action.destino;if(id&&!importedIds.has(id)&&!model.screens[id])review.warnings.push(idOf(t)+' → '+id);
  }
  for(const [kind,part,documents] of [['screen','screens',normalized.screens],['component','components',normalized.components]])for(const data of documents){
   const previous=model[part][idOf(data)];const status=!previous?'novo':canonical(previous)===canonical(data)?'igual':'divergente';
   review.records.push({id:idOf(data),kind,part,data,status,replace:false});
  }
 }
 return review;
}
function jioRenderReview(){
 const root=$('jioReview');if(!root)return;
 const rev=jioState.review;
 if(!rev){root.hidden=true;return;}
 root.hidden=false;
 if(rev.isReference){
  const missing=rev.refs.filter(x=>!x.exists);
  root.innerHTML='<h3>Pacote de referências · somente conferência</h3><p>'+rev.refs.length+' identificadores; '+missing.length+' não encontrados localmente. Não há documentos para incorporar à Store.</p>'+missing.slice(0,30).map(x=>'<div class="jio-row jio-warning">Pendente · '+escapeHtml(x.type)+' · '+escapeHtml(x.id)+'</div>').join('')+'<p>Use o modo completo para transferir os JSONs canônicos.</p><div class="jio-actions"><button class="btn sm" type="button" id="jioDismiss">Fechar</button></div>';
  $('jioDismiss').onclick=()=>{jioState.review=null;jioRenderReview();};return;
 }
 const newItems=rev.records.filter(r=>r.status==='novo'),same=rev.records.filter(r=>r.status==='igual'),changed=rev.records.filter(r=>r.status==='divergente');
 root.innerHTML=`<h3>Conferência antes de importar · ${escapeHtml(journeyName(rev.doc.jornada))}</h3><p><b>${newItems.length} novos</b> · <b>${same.length} idênticos</b> · <b>${changed.length} divergentes</b>. As divergências não serão substituídas sem marcação individual.</p>`+
 (rev.blocks.length?'<div class="jio-error"><b>Importação bloqueada: componentes ausentes.</b> '+rev.blocks.map(escapeHtml).join(', ')+'</div>':'')+
 (rev.warnings.length?'<div class="jio-warning"><b>Destinos ainda ausentes (não serão inventados):</b> '+rev.warnings.slice(0,10).map(escapeHtml).join('; ')+'</div>':'')+
 changed.map((r,i)=>`<label class="jio-row"><input type="checkbox" data-jio-replace="${escapeHtml(r.kind+':'+r.id)}" ${r.replace?'checked':''}><span><b>Substituir</b> ${escapeHtml(r.kind)}: ${escapeHtml(r.id)}</span><small>versão existente divergente</small></label>`).join('')+
 '<div class="jio-actions"><button type="button" class="btn primary sm" id="jioApply" '+(rev.blocks.length?'disabled':'')+'>Confirmar importação</button><button class="btn sm" type="button" id="jioDismiss">Cancelar</button></div>';
 root.querySelectorAll('[data-jio-replace]').forEach(check=>check.onchange=()=>{const rec=changed.find(r=>r.kind+':'+r.id===check.dataset.jioReplace);if(rec)rec.replace=check.checked;});
 $('jioDismiss').onclick=()=>{jioState.review=null;jioRenderReview();};
 $('jioApply').onclick=jioApply;
}
function jioApply(){
 const rev=jioState.review;if(!rev||rev.isReference||rev.blocks.length)return;
 if(diskConflict||diskSaving){alert('Conclua ou resolva a gravação pendente antes de importar.');return;}
 const records=rev.records.filter(r=>r.status==='novo'||(r.status==='divergente'&&r.replace));
 if(records.length&&diskReadOnly){alert('Em modo leitura não é possível persistir o pacote. Abra pelo iniciar.py.');return;}
 // Todos os registros foram pré-validados; não escreve campos derivados (inbound/mapa).
 for(const r of records)model[r.part][r.id]=deepClone(r.data);
 if(records.length){if(typeof invalidateCatalogProjections==='function')invalidateCatalogProjections();save();}
 model.history.unshift({origin:'Jornada: '+rev.doc.jornada,em:new Date().toISOString(),novos:records.filter(r=>r.status==='novo').length,substituidos:records.filter(r=>r.status==='divergente').length});
 journeyPanel.journey=rev.doc.jornada;jioState.review=null;
 renderAll();jioRenderReview();
 $('jioStatus').textContent=`Incorporação solicitada: ${records.length} arquivos canônicos. Aguarde confirmação de gravação no indicador do catálogo.`;
}
function jioWire(){
 if(!$('jioImport'))return;
 $('jioImport').onclick=()=>$('jioFile').click();
 $('jioFile').onchange=async e=>{const file=e.target.files?.[0];e.target.value='';if(!file)return;try{
  const doc=JSON.parse(await file.text());jioState.review=jornadaAnalisarImportacao(doc);jioRenderReview();$('jioStatus').textContent='Pacote analisado sem modificar o catálogo.';
 }catch(err){jioState.review=null;jioRenderReview();$('jioStatus').textContent='Importação rejeitada: '+err.message;}};
 $('jioExport').onclick=()=>{try{const mode=$('jioMode').value,doc=jornadaExportar(mode);downloadText('advogadoja_jornada_'+doc.jornada+'_'+mode+'.json',JSON.stringify(doc,null,2));$('jioStatus').textContent='Jornada exportada a partir da Store; nenhum arquivo mestre foi criado.';}catch(e){$('jioStatus').textContent=e.message;}};
}
