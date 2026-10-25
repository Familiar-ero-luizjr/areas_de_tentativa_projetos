/*
 * ÚNICA fonte persistente: arquivos JSON em catalogo/telas e catalogo/componentes.
 * O modelo em memória é uma projeção editável; nenhuma cópia é gravada em localStorage.
 * A escrita é feita somente pelo servidor local, com conferência de hash por registro.
 */
let diskVersions={};
let diskAck={screens:{},components:{}};
let diskDirty=false;
let diskSaving=false;
let diskConflict=false;
let diskTimer=null;
let diskReadOnly=false;
function setDiskStatus(message,kind=''){
 const el=$('diskStatus');if(!el)return;
 el.textContent=message;el.className='disk-status'+(kind?' '+kind:'');
}
function queueDiskSave(){
 if(diskReadOnly){
  setDiskStatus('Modo leitura: alterações ficam somente nesta sessão. Para gravar, abra pelo iniciar.py.','warn');
  notice('Modo leitura: exporte suas alterações ou abra pelo iniciar.py para gravá-las.','warn');
  return;
 }
 diskDirty=true;
 if(diskConflict){setDiskStatus('Conflito no disco: recarregue após exportar suas alterações','error');return;}
 setDiskStatus('Alterações pendentes de gravação…','saving');
 clearTimeout(diskTimer);diskTimer=setTimeout(flushDiskChanges,250);
}
function pendingDiskChanges(){
 const updates=[];
 for(const [kind,part] of [['screen','screens'],['component','components']]){
  for(const [id,doc] of Object.entries(model[part])){
   if(JSON.stringify(doc)===JSON.stringify(diskAck[part][id]))continue;
   updates.push({kind,doc:deepClone(doc),expected:diskVersions[kind+':'+id]??null});
  }
 }
 return updates;
}
async function flushDiskChanges(){
 if(diskSaving || diskConflict)return;
 const changes=pendingDiskChanges();
 if(!changes.length){diskDirty=false;setDiskStatus('Todos os arquivos estão salvos no catálogo');return;}
 diskSaving=true;setDiskStatus('Gravando '+changes.length+' arquivo(s) na Store…','saving');
 try{
  const res=await fetch('/api/catalogo/sync',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({changes})});
  const result=await res.json();
  if(!res.ok){if(res.status===409)diskConflict=true;throw Error(result.error||'Falha ao salvar no disco');}
  for(const change of changes){
    const id=change.doc.identidade.id, part=change.kind==='screen'?'screens':'components';
    diskAck[part][id]=deepClone(change.doc);diskVersions[change.kind+':'+id]=result.versions[change.kind+':'+id];
  }
  if(pendingDiskChanges().length){diskDirty=true;setDiskStatus('Gravando alterações adicionais…','saving');}
  else{diskDirty=false;setDiskStatus('Arquivos salvos diretamente em catálogo ('+allScreens().length+' telas)');}
 }catch(e){setDiskStatus(e.message,'error');notice('Gravação não concluída: '+e.message,'error');}
 finally{
  diskSaving=false;
  if(!diskConflict && pendingDiskChanges().length){
    clearTimeout(diskTimer);diskTimer=setTimeout(flushDiskChanges,600);
  }
 }
}
window.addEventListener('beforeunload',e=>{
 if(diskDirty || diskSaving){e.preventDefault();e.returnValue='Há alterações aguardando gravação no catálogo.';}
});
