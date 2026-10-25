'use strict';
const MIGRATED_PACK={catalogo:{componentes:[]}}; // compatibilidade interna; fonte persistente: /catalogo
const $ = id => document.getElementById(id);
const STORAGE = 'advogadoja_workspace_modular_disk'; // Não utilizado como fonte de verdade
const CONTRACT = 'advogadoja.catalogo.pacote-tela.v1';
const deepClone = v => JSON.parse(JSON.stringify(v));
const escapeHtml = v => String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safePart = v => String(v||'').trim().replace(/[^a-zA-Z0-9_.-]/g,'_') || 'item';
const sortObj = v => Array.isArray(v) ? v.map(sortObj) : (v && typeof v==='object') ? Object.fromEntries(Object.keys(v).sort().map(k=>[k,sortObj(v[k])])):v;
const canonical = v => JSON.stringify(sortObj(v));
const obj = v => v && typeof v==='object' && !Array.isArray(v);
const arr = v => Array.isArray(v) ? v : [];
const idOf = v => v?.identidade?.id || '';
// Jornada é uma classificação do próprio JSON de tela, não uma lista mantida pelo motor.
const normalizeJourneyId = value => String(value||'').trim().toLowerCase()==='admin' ? 'administrador' : String(value||'').trim().toLowerCase();
const explicitJourneys = t => [...new Set(arr(t?.classificacao?.jornadas).filter(x=>x&&x!=='*').map(normalizeJourneyId))];
const compat = (rule,jornada,estado) => !rule || ((rule.jornadas===undefined||arr(rule.jornadas).includes('*')||arr(rule.jornadas).some(x=>normalizeJourneyId(x)===normalizeJourneyId(jornada))) && (rule.estados===undefined||arr(rule.estados).includes('*')||arr(rule.estados).includes(estado)));
const journeyName = id => String(id||'').replace(/[._-]+/g,' ').replace(/\b\p{L}/gu,c=>c.toLocaleUpperCase('pt-BR'));
function journeyCatalog(){
 const journeys=new Map();
 for(const t of allScreens())for(const id of explicitJourneys(t)){
  if(!journeys.has(id))journeys.set(id,{id,nome:journeyName(id),telas:0});
  journeys.get(id).telas++;
 }
 return [...journeys.values()].sort((a,b)=>a.nome.localeCompare(b.nome,'pt-BR'));
}
const applicableJourneys = t => explicitJourneys(t).length ? explicitJourneys(t) : journeyCatalog().map(j=>j.id);
const screenSupportsJourney = (t,id) => arr(t?.classificacao?.jornadas).includes('*') || explicitJourneys(t).includes(normalizeJourneyId(id));
const screenJourneySort = (a,b) =>
  arr(a.classificacao?.subjornadas).join('.').localeCompare(arr(b.classificacao?.subjornadas).join('.'),'pt-BR') ||
  Number(a.classificacao?.localizacaoArvore?.ordem ?? 9999)-Number(b.classificacao?.localizacaoArvore?.ordem ?? 9999) ||
  idOf(a).localeCompare(idOf(b),'pt-BR');
const pathOf = (v,type) => {
  const tree=v.classificacao?.localizacaoArvore||{};
  const parts=arr(tree.segmentos).map(safePart);
  return (type==='component'?'Componentes':'Telas')+'/'+[...parts,safePart(tree.chave||idOf(v).split('.').at(-1))+'.json'].join('/');
};
const valueAt=(root,path) => String(path||'').split('.').reduce((v,k)=>v?.[k],root);
let model = {components:{},screens:{},conflicts:[],history:[],selection:null};
let ui={tab:'catalogo',jsonMode:'tree',journey:'',state:'',screen:'',drawer:false,flowScreen:''};
let lastMount=null;
async function loadStaticCatalog(){
 const files=globalThis.ADVOGADOJA_CATALOGO_ARQUIVOS;
 if(!Array.isArray(files)||!files.length)throw Error('Índice estático de arquivos do catálogo não foi encontrado.');
 const docs=await Promise.all(files.map(async path=>{
  const res=await fetch(path,{cache:'no-store'});
  if(!res.ok)throw Error('Não foi possível ler '+path+' ('+res.status+').');
  return res.json();
 }));
 const data={components:{},screens:{},versions:{}};
 for(const doc of docs){
  const bucket=doc?.identidade?.tipo==='componente'?'components':doc?.identidade?.tipo==='tela'?'screens':'';
  if(!bucket)throw Error('Tipo de registro inválido no catálogo estático.');
  validateRecord(bucket,doc);
  const id=idOf(doc);
  if(data[bucket][id])throw Error('ID duplicado no catálogo estático: '+id+'.');
  data[bucket][id]=doc;
 }
 return data;
}
function emptyTemplate(){return {catalogo:{metadados:{schema:CONTRACT,tipo:'pacote_tela',versao:'1.0'},componentes:[],telas:[{
 schema:'advogadoja.tela.modular.v4-proposta',identidade:{id:'exemplo.nova_tela',nome:'Nova tela',tipo:'tela',versao:'0.1.0'},
 classificacao:{escopo:'shared',jornadas:['*'],subjornadas:[],compartilhada:true,localizacaoArvore:{secao:'Telas',segmentos:['shared'],chave:'nova_tela',ordem:10}},
 estados:{fonte:'contexto.estado',fallbackSeguro:'padrao',grupos:[{id:'padrao',nome:'Padrão'}]},
 componentes:{instancias:[]},estrutura:{base:{id:'base',html:'<div class="tela"><main data-slot="main"></main></div>',aplicaA:{jornadas:['*'],estados:['*']}},grupos:[]},
 estilos:{tema:{'--page':'#f4f6fa'},grupos:[{id:'estilo_base',css:'.tela{min-height:100dvh;background:var(--page)}',aplicaA:{jornadas:['*'],estados:['*']}}]},
 acoes:{grupos:[]},dados:{grupos:{},fontes:[],persistencia:{entidades:[],relacoes:[],contrato:'declarações de dados exigidas pela tela; Banco é projeção agregada destas declarações'}},mocks:{grupos:{},cenarios:{padrao:{id:'padrao'}}},flow:{editor:{entrypoint:false,rootSequenceId:null,occurrences:[],branches:[]}}
 }]}};}
function normalizeInput(data){
 if(obj(data?.catalogo)){
  const c=data.catalogo;if(c.metadados?.tipo==='indice_gerado') throw Error('Índice mestre gerado não é pacote de importação. Importe pacotes ou arquivos individuais.');
  const cs=arr(c.componentes), ts=arr(c.telas).length?c.telas:(obj(c.tela)?[c.tela]:[]);
  if(!Array.isArray(c.componentes)||!Array.isArray(ts)) throw Error('Exige catalogo.componentes[] e catalogo.telas[].');
  if(!cs.length&&!ts.length)throw Error('Pacote vazio: sem componentes ou telas.');
  return {componentes:cs,telas:ts,meta:c.metadados||{}};
 }
 if(idOf(data)&&data.identidade.tipo==='componente')return {componentes:[data],telas:[],meta:{tipo:'componente_individual'}};
 if(idOf(data)&&data.identidade.tipo==='tela')return {componentes:[],telas:[data],meta:{tipo:'tela_individual'}};
 throw Error('Formato não reconhecido. Esperado: raiz catalogo com componentes[] e telas[], ou arquivo modular individual V6.');
}
function validateRecord(kind,v){
 if(!obj(v)||!obj(v.identidade)||!idOf(v)||v.identidade.tipo!==(kind==='components'?'componente':'tela'))throw Error('Identidade inválida em '+kind+': exige identidade.id e identidade.tipo correto.');
 if(kind==='screens'){
  if(!obj(v.classificacao?.localizacaoArvore)||!Array.isArray(v.classificacao?.jornadas))throw Error('Tela '+idOf(v)+': classificação, jornadas e localização na árvore obrigatórios.');
  if(!obj(v.estrutura)||!obj(v.componentes)||!Array.isArray(v.componentes.instancias))throw Error('Tela '+idOf(v)+': exige estrutura e componentes.instancias[].');
  if(!obj(v.dados?.persistencia)||!Array.isArray(v.dados.persistencia.entidades)||!Array.isArray(v.dados.persistencia.relacoes))throw Error('Tela '+idOf(v)+': exige dados.persistencia.entidades[] e dados.persistencia.relacoes[].');
   if(v.flow!==undefined&&(!obj(v.flow)||!obj(v.flow.editor)||!Array.isArray(v.flow.editor.occurrences)||!Array.isArray(v.flow.editor.branches)))throw Error('Tela '+idOf(v)+': flow.editor requer occurrences[] e branches[].');
 }else{
  if(!obj(v.estrutura)||!obj(v.estilos))throw Error('Componente '+idOf(v)+': exige estrutura HTML e estilos.');
 }
}
function snapshot(){return {components:model.components,screens:model.screens,conflicts:model.conflicts,history:model.history.slice(-20)}}
function save(){queueDiskSave();}
function load(){return false;}
function notice(msg,mode='good'){$('lastImport').innerHTML=`<span class="pill ${mode==='error'?'bad':mode==='warn'?'warn':'ok'}">${escapeHtml(msg)}</span>`;}
function importPack(pack,origin='importação'){
 const {componentes,telas}=normalizeInput(pack);
 // Pré-validação integral antes de alterar o catálogo.
 for(const c of componentes)validateRecord('components',c);
 for(const t of telas)validateRecord('screens',t);
 const counts={addedComponents:0,reusedComponents:0,addedScreens:0,reusedScreens:0,conflicts:0};
 for(const [kind,items] of [['components',componentes],['screens',telas]])for(const item of items){
  const id=idOf(item), current=model[kind][id];
  if(!current){model[kind][id]=deepClone(item);counts[kind==='components'?'addedComponents':'addedScreens']++;continue;}
  if(canonical(current)===canonical(item)){counts[kind==='components'?'reusedComponents':'reusedScreens']++;continue;}
  const already=model.conflicts.some(c=>c.kind===kind&&c.id===id&&canonical(c.incoming)===canonical(item));
  if(!already)model.conflicts.push({id,kind,incoming:deepClone(item),origin});
  counts.conflicts++;
 }
 model.history.unshift({origin,em:new Date().toISOString(),...counts});
 save();renderAll();return counts;
}
function displayCounts(counts,label){notice(`${label}: +${counts.addedComponents} componentes, ${counts.reusedComponents} reutilizados; +${counts.addedScreens} telas, ${counts.reusedScreens} reutilizadas; ${counts.conflicts} conflitos`,counts.conflicts?'warn':'good');}
async function restoreSeed(force=false){
 if(force && diskDirty){notice('Aguarde a conclusão da gravação antes de recarregar.','warn');return;}
 try{
   setDiskStatus('Carregando JSONs do disco…','saving');
   let data,staticMode=false;
   try{
    const res=await fetch('/api/catalogo',{cache:'no-store'});
    const contentType=res.headers.get('content-type')||'';
    if(!contentType.includes('application/json'))throw Error('API local indisponível');
    data=await res.json();if(!res.ok)throw Error(data.error||'Falha de leitura');
   }catch(apiError){
    data=await loadStaticCatalog();staticMode=true;
   }
   model={components:data.components,screens:data.screens,conflicts:[],history:[],selection:null};
   diskVersions=data.versions;diskAck={screens:deepClone(data.screens),components:deepClone(data.components)};
   diskReadOnly=staticMode;diskDirty=false;renderAll();setDiskStatus(staticMode
    ?'Catálogo carregado em modo leitura: '+allScreens().length+' telas · '+allComponents().length+' componentes. Para editar, use iniciar.py.'
    :'Store carregada: '+allScreens().length+' telas · '+allComponents().length+' componentes');
 }catch(e){setDiskStatus('Erro ao carregar catálogo: '+e.message,'error');notice(e.message,'error');}
}
function resolveConflict(index,replace){const c=model.conflicts[index];if(!c)return;if(replace)model[c.kind][c.id]=deepClone(c.incoming);model.conflicts.splice(index,1);model.history.unshift({origin:replace?'Conflito substituído: '+c.id:'Conflito mantido: '+c.id,em:new Date().toISOString()});save();renderAll();notice(replace?'Definição substituída; relações recalculadas.':'Definição existente mantida.');}
function allScreens(){return Object.values(model.screens).sort((a,b)=>idOf(a).localeCompare(idOf(b)));}
function allComponents(){return Object.values(model.components).sort((a,b)=>idOf(a).localeCompare(idOf(b)));}
function screenPaths(t){return pathOf(t,'screen');}
function componentPaths(c){return pathOf(c,'component');}
