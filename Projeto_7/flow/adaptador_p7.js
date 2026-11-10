/* Adaptador do Fluxo V2 (Projeto 8) para contratos canônicos do Projeto 7.
   Não duplica o catálogo, não modifica telas e não resolve nomes físicos por suposição. */
(function(){
'use strict';
var BASE_PATH='../catalog/catalogo/';
var manifestPath='catalogo_caminhos.json';
var baseModels={},sources={},statusEl=null,busy=false;
function notice(msg,bad){
 if(!statusEl){statusEl=document.createElement('div');statusEl.id='p7-load-status';statusEl.setAttribute('role','status');statusEl.style.cssText='position:fixed;bottom:12px;left:12px;z-index:9999;max-width:min(600px,94vw);padding:10px 14px;border-radius:10px;background:#10233f;color:#fff;box-shadow:0 4px 18px #0003;font:12px system-ui';document.body.append(statusEl);}
 statusEl.style.background=bad?'#7f1d1d':'#10233f';
 statusEl.textContent=msg;
}
function errLabel(e){return e&&e.message?e.message:String(e);}
async function getJson(path){var r=await fetch(path,{cache:'no-store'});if(!r.ok)throw Error(path+': HTTP '+r.status);return r.json();}
function copy(x){return JSON.parse(JSON.stringify(x));}
function usableScreen(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
 if(raw.identidade&&raw.identidade.tipo==='tela'&&raw.identidade.id)return raw;
 var entries=Object.entries(raw);
 if(entries.length===1&&entries[0][1]&&entries[0][1].tela&&entries[0][1].tela.identidade){var t=copy(entries[0][1].tela);t.identidade.id=t.identidade.id||entries[0][0];return t;}
 return null;
}
function project(documents){
 var ids=Object.keys(documents).sort(),graph={},nodeByScreen={},seen=new Set(),counts={participacoes:0,relacoes:0,bifurcacoes:0,semNoOriginal:0};
 function keyFor(id,no){var refs=nodeByScreen[id]||[];var hits=refs.filter(x=>x.original===no);return hits.length===1?hits[0].key:null;}
 function routeEndpoint(owner,otherId,no,tipo){
  var resolved=no&&keyFor(otherId,no);
  return {tipo:tipo||'tela',ref:otherId||null,noRef:resolved||no||null,telaContextoRef:tipo==='estado_fluxo'?owner:null,portaRef:null};
 }
 ids.forEach(function(id){
  var t=documents[id],nav=t.navegacao||{},participacoes=nav.participacoes||[];
  nodeByScreen[id]=[];
  var arr=[];
  participacoes.forEach(function(p){
    var ocorrencias=Array.isArray(p.ocorrencias)&&p.ocorrencias.length?p.ocorrencias:[{noOrigemRef:p.ocorrenciaNoRef,ordem:p.ordem}];
    ocorrencias.forEach(function(o,i){
      var original=o.noOrigemRef||p.ocorrenciaNoRef||null;
      var key=original&&!seen.has(original)?original:'oc.'+id+'.'+String(p.id||'participacao')+'.'+(i+1);
      while(seen.has(key))key+='x';
      seen.add(key);
      if(!original)counts.semNoOriginal++;
      nodeByScreen[id].push({original:original,key:key,part:p.id||null});
      var j=p.jornada||{id:p.jornadaRef||'sem_jornada',nome:p.jornadaRef||'Sem jornada',ordem:99};
      var sj=p.subjornada||{id:p.subjornadaRef||'sem_subjornada',nome:p.subjornadaRef||'Sem subjornada',ordem:99};
      arr.push({id:String(p.id||'part.'+id)+'.'+(i+1),jornada:{id:j.id,nome:j.nome||j.id,ordem:j.ordem??99},subjornada:{id:String(j.id)+':'+String(sj.id),nome:(j.nome||j.id)+' · '+(sj.nome||sj.id),ordem:Number(j.ordem??99)*100+Number(sj.ordem??99)},ordemTela:Number(o.ordem??p.ordem??999),ocorrenciaNo:key,condicaoRef:p.condicaoRef||null,contexto:copy(p.contexto||{})});
      counts.participacoes++;
    });
  });
  graph[id]={identidade:{id:id,tipo:'tela',nome:t.identidade?.nome||id,nomeExibicao:t.identidade?.nomeExibicao||t.identidade?.nome||id,descricao:t.identidade?.descricao||null},classificacao:{escopo:t.classificacao?.escopo||null,jornadas:arr},navegacao:{relacoes:[],bifurcacoes:[],nosLogicos:[],entradas:[]},estados:{possiveis:Array.isArray(t.estados?.possiveis)?copy(t.estados.possiveis):[]},acoes:{},mocks:{}};
 });
 ids.forEach(function(id){
  var t=documents[id],nav=t.navegacao||{},target=graph[id].navegacao;
  (nav.nosContextuais||[]).forEach(function(n){
    if(n?.id)target.nosLogicos.push({id:n.id,tipo:n.tipo||'estado_fluxo',nome:n.rotulo||n.nome||n.id,telaContextoRef:n.telaContextoRef||id,estadoRef:n.estadoRef||null});
  });
  (nav.saidas||[]).forEach(function(r){
    if(!r||!r.id)return;
    var sourceId=r.origemTelaRef||id,destId=r.destinoRef||null;
    if(r.destinoTipo!=='tela'&&r.destinoTipo!=='estado_fluxo'&&r.destinoTipo!=='estado'&&r.destinoTipo!=='no')return;
    var originRef=r.origemNoRef||null,destNo=r.destinoNoRef||null;
    var origem=routeEndpoint(sourceId,sourceId,originRef,'tela');
    var destino=routeEndpoint(sourceId,destId,destNo,r.destinoTipo==='tela'?'tela':'estado_fluxo');
    target.relacoes.push({id:r.id,tipo:r.tipo||'continuar',origem:origem,destino:destino,opcao:r.rotaAliasLegada||null,rotulo:r.rotulo||null,descricao:r.descricao||null,gatilho:{instanciaRef:null,elementoRef:null,eventoRef:null,acaoRef:r.acaoRef||null},condicaoRef:r.quando||null,parametros:{},comportamento:{},ordem:Number(r.prioridade??counts.relacoes),participacaoRef:r.origemParticipacaoRef||null,prioridade:r.prioridade??null});
    counts.relacoes++;
  });
  (nav.entradas||[]).forEach(function(e){
    if(e?.relacaoRef)target.entradas.push({relacaoRef:e.relacaoRef,origem:{ref:e.origemTelaRef||null,noRef:e.origemNoRef||null},destino:{ref:id,noRef:e.destinoNoRef||null}});
  });
  (nav.bifurcacoes||[]).forEach(function(b){
    if(!b||!b.id)return;
    var origin=b.origemNoRef||null;
    var key=origin&&keyFor(id,origin);
    var alternativas=(b.caminhos||[]).filter(function(c){return c.relacaoRef;}).map(function(c,i){return {id:c.id||b.id+'.'+i,rotulo:c.rotulo||null,relacaoRef:c.relacaoRef,ordem:c.ordem??i};});
    target.bifurcacoes.push({id:b.id,titulo:b.titulo||b.id,tipo:b.tipo||'decisao',origemNoRef:key||origin,criterioRef:b.criterioRef||null,alternativas:alternativas});
    counts.bifurcacoes++;
  });
 });
 return {projection:graph,counts:counts};
}
async function load(){
 if(busy)return;
 busy=true;
 try{
  notice('Lendo a lista de contratos do Projeto 7…');
  var manifest=await getJson(manifestPath);
  if(!Array.isArray(manifest.arquivos)||!manifest.arquivos.length)throw Error('Índice de arquivos do catálogo vazio.');
  var filenames=manifest.arquivos,documents={},errors=[],next=0,done=0;
  async function worker(){
   while(next<filenames.length){
    var path=filenames[next++];
    try{
     if(!/^[a-zA-Z0-9_.-]+\.json$/.test(path))throw Error('Nome físico inválido');
     var json=await getJson(BASE_PATH+encodeURIComponent(path));
     var screen=usableScreen(json);
     if(screen){
       var id=screen.identidade.id;
       if(documents[id]){errors.push(path+': ID duplicado '+id);continue;}
       documents[id]=screen;sources[id]=path;
     }
    }catch(e){errors.push(path+': '+errLabel(e));}
    done++;
    if(done%12===0)notice('Lendo contratos do Projeto 7: '+done+'/'+filenames.length);
   }
  }
  await Promise.all(Array.from({length:Math.min(8,filenames.length)},worker));
  if(!Object.keys(documents).length)throw Error('Nenhum contrato de tela foi encontrado no catálogo.');
  var result=project(documents),payload={};
  for(var id of Object.keys(result.projection))payload[id]={tela:result.projection[id]};
  window.importContracts(payload);
  baseModels=result.projection;
  notice('Projeto 7: '+Object.keys(documents).length+' telas lidas · '+result.counts.participacoes+' ocorrências · '+result.counts.relacoes+' relações. '+(errors.length?errors.length+' aviso(s) de leitura.':'Catálogo preservado.'));
  if(errors.length)console.warn('Projeto 7 · arquivos pendentes',errors);
 }catch(e){
  notice('Falha ao carregar os dados do Projeto 7: '+errLabel(e),true);
  console.error(e);
 }finally{busy=false;}
}
window.__P7_FLOW_RELOAD__=load;
window.__P7_FLOW_PROJECT_SCHEMA__='advogadoja.projeto7.flow.projecao.v1';
load();
})();