// AdvogadoJá — Protótipo modular. Um único arquivo JavaScript, dois contextos isolados:
// módulo externo (index.html) e simulador interno (iframe). CSS e HTML originais preservados.
const SCRIPT_SOURCE=document.currentScript?.textContent||'';

// @REGIAO WORKSPACE
function bootWorkspace(){

'use strict';
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const JOURNEYS=[],SPECS=[];
let sourceTemplate=null,sourceBundle=null;
let MODEL=null,view='fields',tab='fields',selectedField='',mode='free',selectedJourney='completa',ready=false,framePromise=null,screen='',pendingSelection=null;
function b64bytes(s){return Uint8Array.from(atob(s.trim()),c=>c.charCodeAt(0))}
async function ungzip(b64){if(!('DecompressionStream' in window))throw Error('Este navegador não oferece descompressão local gzip.');const buf=await new Response(new Blob([b64bytes(b64)]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();return new TextDecoder().decode(buf)}

// @REGIAO DADOS — o HTML final usa payload incorporado; o modular carrega prototipo.json.
async function gzipBase64(text){
 if(!('CompressionStream' in window))throw Error('Este navegador não oferece compressão gzip local.');
 const bytes=new TextEncoder().encode(text);
 const stream=new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'));
 const packed=new Uint8Array(await new Response(stream).arrayBuffer());
 const parts=[];for(let i=0;i<packed.length;i+=8192)parts.push(String.fromCharCode(...packed.subarray(i,i+8192)));
 return btoa(parts.join(''));
}
async function loadResources(){
 if($('originalBundle')&&$('frameTemplate')){
   MODEL=JSON.parse(await ungzip($('originalBundle').textContent));
   JOURNEYS.push(...JSON.parse($('journeyData').textContent));
   SPECS.push(...JSON.parse($('fieldSpecs').textContent));
 }else{
   const [dataResponse,templateResponse]=await Promise.all([fetch('./prototipo.json'),fetch('./simulador.html')]);
   if(!dataResponse.ok||!templateResponse.ok)throw Error('Arquivos do módulo não encontrados. Abra a fonte usando um servidor local ou use o HTML autocontido em saida/.');
   const data=await dataResponse.json();
   if(data.schema!=='advogadoja.prototipo.modular.v1'||!data.model?.screens||!Array.isArray(data.journeys)||!Array.isArray(data.fieldSpecs))throw Error('prototipo.json inválido');
   MODEL=data.model; JOURNEYS.push(...data.journeys); SPECS.push(...data.fieldSpecs);
   sourceTemplate=await templateResponse.text();
   sourceBundle=await gzipBase64(JSON.stringify({...MODEL,journeys:JOURNEYS}));
 }
}
function send(command,value){if(!ready)return;const f=$('protoFrame');f.contentWindow.postMessage({type:'aj:prototype:command',command,value},'*')}
function fieldValues(path){if(!MODEL)return[];const a=[];const push=v=>{if(v!==undefined)a.push(v)};
 if(path.startsWith('screens.*.')){const sub=path.slice(10).split('.');for(const s of Object.values(MODEL.screens)){if(sub[0]==='fields[]'){for(const fld of s.fields||[]){if(sub[1])push(fld[sub[1]]);else push(fld)}}else push(s[sub[0]])}}
 else if(path.startsWith('scenarios.*.')){const key=path.slice(12);for(const s of Object.values(MODEL.scenarios))push(s[key])}
 else if(path.startsWith('journeys[].')){const key=path.slice(11);for(const j of JOURNEYS){if(key.startsWith('steps[].')){const k=key.slice(8);function walk(steps){for(const st of steps||[]){if(typeof st==='string'){if(k==='screen')push(st);continue;}if(k==='screen'||k==='effect'||k==='fork'||k==='choices')push(st[k]);if(st.choices)for(const choice of st.choices)walk(choice.steps)}}walk(j.steps)}else push(j[key])}}
 else if(path==='notifications')push(MODEL.notifications);else if(path==='requests')push(MODEL.requests);return a}
function fieldInfo(spec){const a=fieldValues(spec.path),nonEmpty=a.filter(v=>v!==null&&v!==undefined&&(typeof v!=='string'||v.length>0));return {total:a.length,used:nonEmpty.length,example:nonEmpty[0]}}
function sample(v){if(v===undefined)return 'Campo não preenchido nos dados disponíveis.';let s=JSON.stringify(v,null,2);if(s.length>1700)s=s.slice(0,1700)+'\n… (exemplo truncado para leitura)';return s}
function drawFields(){let q=$('fieldSearch').value.trim().toLowerCase();const filtered=SPECS.filter(s=>(s.path+' '+s.name+' '+s.group+' '+s.why).toLowerCase().includes(q));const grouped=new Map();for(const spec of filtered){if(!grouped.has(spec.group))grouped.set(spec.group,[]);grouped.get(spec.group).push(spec)}
 $('fieldTree').innerHTML=[...grouped].map(([g,items])=>`<div class="fg"><div class="fg-title">⌄ ${esc(g)}</div>${items.map(s=>{const info=fieldInfo(s);return `<button class="field-row ${s.path===selectedField?'active':''}" data-field="${esc(s.path)}"><span>${esc(s.name)}</span><small>${info.used} registros</small></button>`}).join('')}</div>`).join('')||'<p class="panel-pad minitext">Nenhum campo encontrado.</p>';
 $('fieldStatus').textContent=filtered.length+' campos catalogados · '+Object.keys(MODEL.screens).length+' telas no HTML';
 document.querySelectorAll('[data-field]').forEach(b=>b.addEventListener('click',()=>{selectedField=b.dataset.field;drawFields();drawDetails()}));}
function drawDetails(){const spec=SPECS.find(s=>s.path===selectedField)||SPECS[0],info=fieldInfo(spec);
 $('fieldDetails').innerHTML=`<div class="fmini">02 / DETALHES · LEITURA DO MÓDULO</div><div class="detail-name">${esc(spec.name)}</div><p class="detail-desc">${esc(spec.why)}</p><div class="detail-label">CAMINHO DECLARADO NA ESTRUTURA</div><div class="path">${esc(spec.path)}</div><div class="detail-label">VALORES ENCONTRADOS</div><div class="path">${info.used} registro(s) preenchido(s) · ${info.total} ocorrência(s) no modelo</div><div class="detail-label">EXEMPLO DO JSON ORIGINAL</div><pre class="sample">${esc(sample(info.example))}</pre><div class="detail-label">POR QUE O PROTÓTIPO USA ESSE DADO</div><p class="detail-desc">${esc(spec.why)}</p><div class="detail-label">OUTRAS ÁREAS RELACIONADAS</div><div class="pills"><span class="pill">Protótipo</span><span class="pill">Jornadas</span><span class="pill">Telas</span></div>`}
function drawOverview(){const groups=new Map();for(const s of Object.values(MODEL.screens))groups.set(s.group,(groups.get(s.group)||0)+1);const cards=[[Object.keys(MODEL.screens).length,'Telas'],[JOURNEYS.length,'Roteiros de jornada'],[Object.keys(MODEL.scenarios).length,'Cenários'],[groups.size,'Grupos de telas'],[SPECS.length,'Campos documentados'],[MODEL.notifications.length,'Notificações fictícias'],[MODEL.requests.length,'Solicitações fictícias']];$('summaryCards').innerHTML=cards.map(([v,n])=>`<div class="summarycard"><strong>${v}</strong><span>${esc(n)}</span></div>`).join('')}
function drawJourneys(){const groups=new Map();JOURNEYS.forEach(j=>{if(!groups.has(j.group))groups.set(j.group,[]);groups.get(j.group).push(j)});
 $('journeyCards').innerHTML=[...groups].map(([g,js])=>`<div class="r-card"><strong>${esc(g)}</strong>${js.map(j=>`<div style="padding:8px 0;border-top:1px solid #edf1f2"><strong>${esc(j.name)}</strong><p>${esc(j.intro)}</p><p><code>${esc(j.id)}</code></p><button class="btn" data-jump="${esc(j.id)}">Abrir roteiro</button></div>`).join('')}</div>`).join('');
 $('scenarioCards').innerHTML=Object.entries(MODEL.scenarios).map(([id,s])=>`<div class="r-card"><strong>${esc(s.name)}</strong><p>${esc(s.description)}</p><p><code>Início: ${esc(s.start)}</code></p></div>`).join('');
 document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>selectJourney(b.dataset.jump))}
function renderMenu(){const groups=new Map();JOURNEYS.forEach(j=>{if(!groups.has(j.group))groups.set(j.group,[]);groups.get(j.group).push(j)});
 $('journeyMenu').innerHTML=[...groups].map(([g,js],idx)=>`<details class="journey-group" ${idx===0?'open':''}><summary>${esc(g)} · ${js.length}</summary>${js.map(j=>`<button class="journey-button" data-journey="${esc(j.id)}">↳ ${esc(j.name)}</button>`).join('')}</details>`).join('');
 document.querySelectorAll('[data-journey]').forEach(b=>b.onclick=()=>selectJourney(b.dataset.journey));highlight()}
function highlight(){$('journeyMenu').classList.toggle('hide',!(view==='visual'&&mode==='journey'));document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',view==='visual'&&b.dataset.mode===mode));document.querySelectorAll('[data-journey]').forEach(b=>b.classList.toggle('active',view==='visual'&&mode==='journey'&&b.dataset.journey===selectedJourney));}
async function ensureFrame(){if(framePromise)return framePromise;framePromise=(async()=>{
 const template=$('frameTemplate')?await ungzip($('frameTemplate').textContent):sourceTemplate;
 const bundle=$('originalBundle')?.textContent.trim()||sourceBundle;
 if(!template||!bundle)throw Error('Estrutura ou dados do simulador indisponíveis.');
 const scriptText=SCRIPT_SOURCE||await fetch('./script.js').then(r=>{if(!r.ok)throw Error('Não foi possível ler script.js');return r.text()});
 const embed='<scr'+'ipt>'+scriptText.replace(/<\/script/gi,'<\\/script')+'</scr'+'ipt>';
 const raw=template.replace('__PROTOTYPE_MODEL_BUNDLE__',bundle).replace('<!-- __RUNTIME_SCRIPT__ -->',embed);
 const frame=$('protoFrame');frame.srcdoc=raw;await new Promise(resolve=>frame.addEventListener('load',resolve,{once:true}));frame.classList.remove('hide');$('visualLoading').classList.add('hide');
 })().catch(e=>{$('visualLoading').innerHTML='<strong style="color:#a33">Falha ao carregar: '+esc(e.message)+'</strong>';throw e});return framePromise}
function setTab(which){tab=which;document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===which));document.querySelectorAll('.fieldtab-content').forEach(p=>p.classList.toggle('active',p.id==='tab-'+which))}
async function setView(which){view=which;$('fieldsView').classList.toggle('active',which==='fields');$('visualView').classList.toggle('active',which==='visual');$('heading').textContent=which==='fields'?'Protótipo · Campos utilizados':'Protótipo · Interativo';$('subtitle').textContent=which==='fields'?'Campos e finalidades lidos do JSON e do roteiro de apresentação.':'Simulação das telas, cenários e decisões do HTML original.';$('sourceTag').textContent=which==='fields'?'Leitura P7 · Fonte: protótipo':'Simulação original · Protótipo';highlight();$('side').classList.remove('open');if(which==='visual'){await ensureFrame()}try{history.replaceState(null,'',location.pathname+(which==='fields'?'#campos':'#prototipo'))}catch(_){}}
async function setMode(which){mode=which;pendingSelection={command:'mode',value:which};await setView('visual');if(ready&&pendingSelection){send(pendingSelection.command,pendingSelection.value);pendingSelection=null;}$('currentMode').textContent=which==='free'?'NAVEGAÇÃO LIVRE':'APRESENTAÇÃO DE JORNADAS';highlight()}
async function selectJourney(id){if(!JOURNEYS.some(j=>j.id===id))return;mode='journey';selectedJourney=id;pendingSelection={command:'journey',value:id};await setView('visual');if(ready&&pendingSelection){send(pendingSelection.command,pendingSelection.value);pendingSelection=null;}$('currentMode').textContent='JORNADA · '+(JOURNEYS.find(j=>j.id===id)?.name||id).toUpperCase();highlight()}
function fillSelectors(data){$('screenSelect').innerHTML='<option value="">Escolher tela…</option>'+data.screens.map(s=>`<option value="${esc(s.id)}">${esc(s.group)} · ${esc(s.title)}</option>`).join('');$('scenarioSelect').innerHTML=data.scenarios.map(s=>`<option value="${esc(s.id)}">${esc(s.name)}</option>`).join('')}
window.addEventListener('message',event=>{if(event.source!==$('protoFrame').contentWindow)return;const d=event.data||{};
 if(d.type==='aj:prototype:ready'){ready=true;fillSelectors(d);if(pendingSelection){send(pendingSelection.command,pendingSelection.value);pendingSelection=null}else{send('mode',mode);if(mode==='journey')send('journey',selectedJourney)}}
 if(d.type==='aj:prototype:state'){if(!ready||pendingSelection)return;mode=d.mode;selectedJourney=d.journey;screen=d.screen;if($('screenSelect').querySelector('option[value="'+CSS.escape(screen)+'"]'))$('screenSelect').value=screen;$('scenarioSelect').value=d.scenario;$('currentMode').textContent=mode==='free'?'NAVEGAÇÃO LIVRE':'JORNADA · '+(JOURNEYS.find(j=>j.id===selectedJourney)?.name||selectedJourney).toUpperCase();highlight()}});
async function init(){try{await loadResources();selectedField=SPECS[0]?.path||'';selectedJourney=JOURNEYS[0]?.id||'completa';$('fieldCount').textContent='('+SPECS.length+')';drawFields();drawDetails();drawOverview();drawJourneys();renderMenu();const p=new URLSearchParams(location.search);if(location.hash==='#prototipo')setView('visual');}catch(e){$('fieldStatus').textContent='Erro ao ler JSON incorporado: '+e.message;console.error(e)}}
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));$('fieldSearch').addEventListener('input',drawFields);
$('screenSelect').onchange=e=>{if(e.target.value){setMode('free').then(()=>send('screen',e.target.value))}};$('scenarioSelect').onchange=e=>send('scenario',e.target.value);
$('catalogBtn').onclick=()=>send('catalog');$('toolsBtn').onclick=()=>send('tools');$('presentationBtn').onclick=()=>send('present');$('mobileMenu').onclick=()=>$('side').classList.toggle('open');

const moduleToggle=$('moduleToggle'),moduleLinks=$('moduleLinks');
if(moduleToggle&&moduleLinks){
  function toggleModule(){
    const open=moduleToggle.getAttribute('aria-expanded')==='true';
    moduleToggle.setAttribute('aria-expanded',String(!open));
    moduleLinks.classList.toggle('hide',open);
    moduleToggle.querySelector('span:last-child').textContent=open?'›':'⌄';
  }
  moduleToggle.addEventListener('click',toggleModule);
  moduleToggle.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggleModule()}});
}

init();

}

// @REGIAO SIMULADOR
function bootSimulator(){

'use strict';
const $=id=>document.getElementById(id), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let MODEL, app, timer=null, toastTimer=null,shadow=null;
const BASE_MOCK={'reg-name':'name','reg-surname':'surname','reg-username':'username','reg-cpf':'cpf','reg-birthday':'birthday','reg-gender':'gender','reg-email':'email','reg-phone':'phone','reg-zip':'zipCode','reg-address':'address','reg-number':'addressNumber','reg-complement':'complement','reg-neighborhood':'neighborhood','reg-district':'district','reg-city':'city','reg-uf':'uf','reg-country':'country','reg-password':'password','reg-password-confirm':'passwordConfirmation','pro-education-institution':'educationInstitution','pro-education-city':'educationInstitutionCity','pro-education-course':'educationCourse','pro-graduation-year':'graduationYear','pro-specialization':'specialization','pro-professional-name':'professionalName','pro-practice-start-year':'practiceStartYear','pro-job-description':'jobDescription','pro-experience':'experience','pro-oab-number':'oabNumber','pro-oab-uf':'oabUf','pro-oab-type':'oabType','pro-bio':'bio','pro-city':'professionalCity','pro-uf':'professionalUf','pro-work-mode':'workMode','pro-radius':'radius','office-name':'officeName','office-cnpj':'officeCnpj','office-email':'officeEmail','office-phone':'officePhone','office-address':'officeAddress','office-address-number':'officeAddressNumber','office-zip':'officeZip','office-neighborhood':'officeNeighborhood','office-district':'officeDistrict','office-city':'officeCity','office-uf':'officeUf','agenda-block-note':'supportMessage', 'agenda-block-date':'birthday', 'email':'email','password':'password','phone':'phone','birthday':'birthday', 'name':'name','surname':'surname','username':'username','cpf':'cpf','zipCode':'zipCode','address':'address','addressNumber':'addressNumber','city':'city','uf':'uf','graduationYear':'graduationYear','professionalName':'professionalName','practiceStartYear':'practiceStartYear','jobDescription':'jobDescription','educationInstitution':'educationInstitution','educationInstitutionCity':'educationInstitutionCity','educationCourse':'educationCourse','bio':'bio','professionalCity':'professionalCity','professionalUf':'professionalUf','officeIntent':'officeIntent'};
const NEXT={
'auth.inicializacao.splash':'auth.inicializacao.boas_vindas','auth.inicializacao.boas_vindas':'auth.sessao.entrar','auth.cadastro.tipo_conta':'auth.cadastro.identificacao','auth.cadastro.identificacao':'auth.cadastro.contato','auth.cadastro.contato':'auth.cadastro.endereco','auth.cadastro.endereco':'auth.cadastro.seguranca','auth.cadastro.seguranca':'auth.cadastro.consentimentos','auth.cadastro.consentimentos':'auth.cadastro.revisao','auth.cadastro.revisao':'auth.cadastro.concluido','auth.cadastro.concluido':'auth.sessao.entrar','auth.sessao.recuperar_senha':'auth.sessao.recuperacao_enviada','auth.sessao.recuperacao_enviada':'auth.sessao.entrar','advogado.onboarding.dados_academicos':'advogado.onboarding.dados_profissionais','advogado.onboarding.dados_profissionais':'advogado.oab.dados','advogado.oab.dados':'advogado.onboarding.areas_atuacao','advogado.onboarding.areas_atuacao':'advogado.onboarding.perfil_profissional','advogado.onboarding.perfil_profissional':'advogado.onboarding.disponibilidade','advogado.onboarding.disponibilidade':'escritorio.onboarding.vinculo_escritorio','escritorio.onboarding.cadastro_escritorio':'advogado.onboarding.revisao_profissional','advogado.onboarding.revisao_profissional':'advogado.onboarding.conclusao_profissional','advogado.onboarding.conclusao_profissional':'advogado.validacao.status','advogado.validacao.envio_confirmado':'advogado.validacao.status','advogado.validacao.status':'advogado.home.inicio','advogado.configuracao.validacao_oab':'advogado.validacao.envio_confirmado','advogado.clientes.solicitacoes_recebidas':'advogado.clientes.detalhe_solicitacao','advogado.clientes.aceitar_contato':'advogado.clientes.contato_liberado','advogado.clientes.recusar_solicitacao':'advogado.clientes.recusa_confirmada','advogado.clientes.recusa_confirmada':'advogado.clientes.solicitacoes_recebidas','advogado.clientes.contato_liberado':'advogado.atendimentos.lista','advogado.atendimentos.lista':'advogado.atendimentos.detalhe','advogado.atendimentos.detalhe':'advogado.atendimentos.encerrar','advogado.atendimentos.encerrar':'advogado.atendimentos.lista','advogado.assinatura.checkout':'advogado.assinatura.resultado_checkout','advogado.assinatura.resultado_checkout':'advogado.assinatura.gestao_assinatura','escritorio.equipe.convidar_advogado':'escritorio.equipe.convite_enviado','escritorio.equipe.convite_enviado':'escritorio.equipe.equipe','advogado.configuracao.falar_suporte':'advogado.configuracao.chamado_detalhe','advogado.configuracao.chamado_detalhe':'advogado.configuracao.meus_chamados','notificacoes.lista.notificacoes':'notificacoes.detalhe.notificacao'};
const PROTECTED=['advogado.clientes.','advogado.atendimentos.'];
function clone(x){return JSON.parse(JSON.stringify(x))}
function step(screen,effect){return {screen,effect:effect||null}}
function fork(id,screen,question,choices){return {fork:id,screen,question,choices}}
let JOURNEYS=[];
const modeFree=$('modeFree'), modeJourney=$('modeJourney');
let JOURNEY_BY_ID={};
function scenarioState(id){const s=MODEL.scenarios[id];return {mode:'free',scenario:id,screen:s.start,forms:{},mock:clone(s.data),status:s.status,registered:s.registered,onboarded:s.onboarded,consents:false,office:s.office,request:s.request,online:s.status==='validated',payment:'none',ticket:false,notifications:clone(MODEL.notifications),requests:clone(MODEL.requests),currentNotification:'n1',events:[],history:[],scenarioId:id,journey:'completa',decisions:{},cursor:0,auto:false,resumeAfterChoice:false,menuOpen:false,present:false,interval:2400,selectedPlan:'Essencial',requestTab:'new'};}
function snapshot(){return {forms:clone(app.forms),status:app.status,registered:app.registered,onboarded:app.onboarded,office:app.office,request:app.request,online:app.online,payment:app.payment,ticket:app.ticket,notifications:clone(app.notifications),requests:clone(app.requests),events:clone(app.events)}}
function stopAuto(){app.auto=false;clearTimeout(timer);timer=null;}
function applyEffect(e){if(!e)return;Object.assign(app,e);if('status' in e)app.online=e.status==='validated';if('request' in e)app.requests[0].status=e.request;app.events.unshift({what:JSON.stringify(e),time:new Date().toLocaleTimeString('pt-BR')});}
function toast(s){clearTimeout(toastTimer);$('toast').textContent=s;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,3600)}
function goto(id,opts={}){if(!MODEL.screens[id]){toast('Tela não cadastrada: '+id);return;}if(app.mode==='journey'&&!opts.scripted){toast('Nesta apresentação, navegue pelo roteiro e pelas bifurcações. Use o Modo Livre para explorar.');return;}
if(!opts.scripted&&PROTECTED.some(p=>id.startsWith(p))&&app.status!=='validated'&&!opts.catalog){toast('OAB não habilitada: operação protegida indisponível neste estado.');return;}
if(app.screen!==id)app.history.push(app.screen);app.screen=id;app.menuOpen=false;app.events.unshift({what:'Tela: '+id,time:new Date().toLocaleTimeString('pt-BR')});render();}
function expandedSteps(){let result=[];function rec(steps){for(const st of steps){if(typeof st==='string'){result.push({screen:st,type:'screen'});continue;}if(st.fork){result.push({...st,type:'fork'});let value=app.decisions[st.fork];if(value!==undefined&&st.choices[value])rec(st.choices[value].steps||[]);continue;}result.push({...st,type:'screen'});}}rec(JOURNEY_BY_ID[app.journey].steps);return result;}
function currentStep(){return expandedSteps()[app.cursor];}
function startJourney(id){stopAuto();if(app.journey!==id){const suggestion=({completa:'primeiro_acesso',onboarding:'primeiro_acesso',acesso:'habilitado',oab:'oab_analise',solicitacoes:'habilitado',escritorio:'escritorio'})[id];if(suggestion){const oldMode=app.mode,wasPresent=app.present;app=scenarioState(suggestion);app.mode=oldMode;app.present=wasPresent;}}app.mode='journey';app.journey=id;app.cursor=0;app.decisions={};app.events.unshift({what:'Início da jornada: '+id,time:new Date().toLocaleTimeString('pt-BR')});playCurrent();}
function playCurrent(){const steps=expandedSteps(),s=steps[app.cursor];if(!s){stopAuto();render();toast('Jornada concluída.');return;}if(s.effect)applyEffect(s.effect);app.screen=s.screen;if(s.type!=='fork'){autoFillAllScreens([s.screen]);}render();if(s.type!=='fork')fillInDom(shadow,s.screen);if(app.auto){if(s.type==='fork'){app.resumeAfterChoice=true;stopAuto();render();}else scheduleNext();}}
function scheduleNext(){clearTimeout(timer);if(app.mode==='journey'&&app.auto)timer=setTimeout(()=>advance(1),app.interval);}
function advance(d){stopPendingTimer();const steps=expandedSteps(),step=steps[app.cursor];if(d>0&&step?.type==='fork'&&app.decisions[step.fork]===undefined){showBranch(step);return;}const idx=app.cursor+d;if(idx<0){toast('Você está no início da jornada.');return;}if(idx>=steps.length){stopAuto();render();toast('Jornada concluída.');return;}const previous=steps[idx];if(d<0&&previous?.type==='fork'){stopAuto();delete app.decisions[previous.fork];app.resumeAfterChoice=false;}app.cursor=idx;playCurrent();}
function stopPendingTimer(){clearTimeout(timer);timer=null;}
function chooseFork(index){const s=currentStep();if(!s||s.type!=='fork')return;app.decisions[s.fork]=index;const choice=s.choices[index];applyEffect(choice.effects);$('branchBackdrop').classList.add('hide');toast('Caminho escolhido: '+choice.label);if(app.resumeAfterChoice){app.resumeAfterChoice=false;app.auto=true;app.cursor++;playCurrent();}else if(app.auto){app.cursor++;playCurrent();}else{render();}}
function freeMode(){stopAuto();app.mode='free';render()}
function journeyMode(){stopAuto();app.mode='journey';app.cursor=0;app.decisions={};const scenario=app.journey==='completa'?'primeiro_acesso':app.scenario;if(scenario!==app.scenario){let present=app.present;app=scenarioState(scenario);app.mode='journey';app.present=present;}playCurrent()}
function setScenario(id){const mode=app.mode,present=app.present,journey=app.journey,interval=app.interval;stopAuto();app=scenarioState(id);app.mode=mode;app.present=present;app.journey=journey;app.interval=interval;if(mode==='journey')playCurrent();else render();toast('Cenário reiniciado: '+MODEL.scenarios[id].name)}
function mockValue(field,screen){const id=field.id||field.name||field.getAttribute('data-pro-field')||field.getAttribute('data-field')||'';let k=BASE_MOCK[id]||BASE_MOCK[field.name]||id;if(app.mock[k]!==undefined)return app.mock[k];if(field.tagName==='SELECT'){
 let vals=Array.from(field.options).map(o=>o.value).filter(Boolean);let guess=['SP','BR','online','hibrido','Definitiva','Sim','São Paulo'].find(g=>vals.some(v=>v.toLowerCase()===g.toLowerCase()));return guess||vals[0]||'';}
 if(field.type==='email')return screen.includes('escritorio')?app.mock.officeEmail:app.mock.email;
 if(field.type==='tel')return app.mock.phone;
 if(field.type==='date')return '2026-11-11';
 if(field.type==='number')return screen.includes('raio')?'30':'2016';
 if(field.tagName==='TEXTAREA')return screen.includes('suporte')?app.mock.supportMessage:app.mock.bio;
 if(id===''){
 if(screen.includes('falar_suporte'))return field.tagName==='TEXTAREA'?app.mock.supportMessage:app.mock.supportSubject;
 if(screen.includes('convidar_advogado'))return field.type==='email'?'convite@example.test':'000000';
 if(screen.includes('validacao_oab'))return field.tagName==='SELECT'?'SP':'000000';}
 return '';}
function keyOf(f,i){return f.id||f.name||f.getAttribute('data-pro-field')||f.getAttribute('data-field')||('field_'+i)}
function setFieldValue(f,v){if(f.type==='checkbox'){f.checked=String(v)==='true'||v===true;return;}if(f.type==='radio'){f.checked=String(f.value)===String(v);return;}if(f.tagName==='SELECT'){
 const opts=Array.from(f.options);let match=opts.find(o=>o.value===String(v))||opts.find(o=>o.value.toLowerCase()===String(v).toLowerCase())||opts.find(o=>o.textContent.trim().toLowerCase()===String(v).toLowerCase());if(match)f.value=match.value;else if(opts.length>1)f.selectedIndex=1;return;}
 f.value=String(v??'');}
function fillInDom(root,screen){const fs=Array.from(root.querySelectorAll('input,select,textarea'));let n=0;fs.forEach((f,i)=>{if(f.type==='file'||f.type==='hidden'||f.type==='checkbox'||f.type==='radio')return;const id=keyOf(f,i);const v=app.forms[screen]?.[id]??f.value;
 if(String(v??'').trim()!=='')return;let mock=mockValue(f,screen);if(!mock)return;setFieldValue(f,mock);app.forms[screen]??={};app.forms[screen][id]=f.value;n++;});return n;}
function autoFillAllScreens(ids){for(const id of ids){const sc=MODEL.screens[id];if(!sc||!sc.fields)continue;app.forms[id]??={};for(const f of sc.fields){if(f.type==='checkbox'||f.type==='radio')continue;if(String(app.forms[id][f.key]??'').trim())continue;const mv=app.mock[BASE_MOCK[f.key]||f.key];if(mv!==undefined)app.forms[id][f.key]=String(mv);}}
}
function fillMock(scope){if(scope==='screen'){let n=fillInDom(shadow,app.screen);renderToolPanels();toast(n+' campo(s) vazio(s) complementado(s) com o mock.');return;}if(scope==='all'){autoFillAllScreens(Object.keys(MODEL.screens));fillInDom(shadow,app.screen);renderToolPanels();toast('Dados disponíveis preparados para as telas. Nenhum cadastro/termo foi concluído automaticamente.');return;}
 const grp=MODEL.screens[app.screen]?.group;autoFillAllScreens(Object.keys(MODEL.screens).filter(s=>MODEL.screens[s].group===grp));let n=fillInDom(shadow,app.screen);renderToolPanels();toast('Dados vazios do processo preparados; '+n+' campo(s) da tela atual preenchido(s).');}
function restoreForms(){const fs=Array.from(shadow.querySelectorAll('input,select,textarea'));fs.forEach((f,i)=>{const val=app.forms[app.screen]?.[keyOf(f,i)];if(val!==undefined)setFieldValue(f,val);});}
function recordForms(){const fs=Array.from(shadow.querySelectorAll('input,select,textarea'));app.forms[app.screen]??={};fs.forEach((f,i)=>{if(f.type==='file')return;app.forms[app.screen][keyOf(f,i)]=f.type==='checkbox'||f.type==='radio'?f.checked?f.value||true:false:f.value;});}
function statusLabel(){return ({pending:'OAB pendente',review:'OAB em análise',validated:'OAB habilitada',rejected:'Correção necessária',unknown:'Estado desconhecido',expired:'OAB expirada',suspended:'OAB suspensa'})[app.status]||app.status}
function clsStatus(){return app.status==='validated'?'green':app.status==='pending'||app.status==='review'?'amber':'red'}
function customPage(title,subtitle,body){return `<div class="custom-app"><div class="aj-appbar"><div class="aj-brand"><span>AJ</span><b>ADVOGADO JÁ</b></div><span class="aj-role">Advogado</span></div><div class="aj-page"><div class="aj-head"><div class="aj-eyebrow">AMBIENTE DE SIMULAÇÃO</div><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div>${body}</div></div>`}
const CBTN=(label,to,kind='')=>`<button class="aj-btn ${kind}" data-route="${esc(to)}">${esc(label)} <span>›</span></button>`;
const DO=(label,doit,kind='')=>`<button class="aj-btn ${kind}" data-do="${esc(doit)}">${esc(label)} <span>›</span></button>`;
function card(t,d,actions=''){return `<div class="aj-card"><h3>${esc(t)}</h3><p>${esc(d)}</p>${actions}</div>`}
function renderCustom(id){let s=MODEL.screens[id],title=s.title,p=app.mock,b='';
switch(id){
case 'auth.cadastro.tipo_conta':b=card('Perfil de cadastro','A jornada selecionada é Advogado. O cadastro comum é compartilhado por outros perfis.',CBTN('Continuar como advogado',NEXT[id],'primary'));break;
case 'auth.cadastro.consentimentos':case 'auth.cadastro.consentimentos':b=`<div class="aj-card"><h3>Autorizações do cadastro</h3><p>O uso de um mock não confirma consentimentos em seu nome.</p><label class="aj-check"><input type="checkbox" id="termAccept" ${app.consents?'checked':''} required> Li e concordo com os Termos de Uso.</label><label class="aj-check"><input type="checkbox" id="privacyAccept" ${app.consents?'checked':''} required> Li a Política de Privacidade.</label><label class="aj-check"><input type="checkbox" id="newsAccept"> Desejo receber comunicações opcionais.</label>${CBTN('Revisar cadastro','auth.cadastro.revisao','primary')}</div>`;break;
case 'auth.sessao.recuperar_senha':b=`<div class="aj-card"><h3>Recuperar acesso</h3><label class="aj-label">E-mail do cadastro</label><input class="aj-input" id="recoveryEmail" type="email" placeholder="seu-email@exemplo.test" required>${DO('Simular envio de recuperação','recover','primary')}${CBTN('Voltar ao login','auth.sessao.entrar')}</div>`;break;
case 'auth.sessao.recuperacao_enviada':b=card('Solicitação registrada','Nesta simulação, o link de recuperação não é realmente enviado.',CBTN('Retornar ao login','auth.sessao.entrar','primary'));break;
case 'advogado.onboarding.conclusao_profissional':b=card('Perfil profissional enviado','Os dados foram registrados apenas neste cenário. A validação da OAB continua separadamente.',CBTN('Acompanhar validação','advogado.validacao.status','primary'));break;
case 'advogado.validacao.envio_confirmado':b=card('Solicitação de validação enviada','Protocolo fictício OAB-DEMO-2026. Nenhum documento é transmitido.',CBTN('Acompanhar status','advogado.validacao.status','primary'));break;
case 'advogado.validacao.status':b=card(statusLabel(),({pending:'Ainda não há envio confirmado para validação.',review:'Seus dados fictícios estão na fila de análise.',validated:'O perfil está habilitado para as operações simuladas.',rejected:'Revisão necessária: confira os dados e reenvie.',unknown:'Não foi possível determinar o resultado da validação.'})[app.status]||'Estado da OAB não habilitado.',CBTN('Revisar OAB','advogado.configuracao.validacao_oab')+CBTN('Voltar à mesma Home','advogado.home.inicio','primary'));break;
case 'advogado.clientes.solicitacoes_recebidas':b=`<div class="aj-tabs">${[['new','Novas'],['accepted','Aceitas'],['declined','Recusadas'],['closed','Encerradas']].map(([v,l])=>`<button data-do="tab:${v}" class="${app.requestTab===v?'selected':''}">${l}</button>`).join('')}</div>`+app.requests.filter(x=>x.status===app.requestTab).map(x=>card(x.area,x.client+' · '+x.description,CBTN('Ver solicitação','advogado.clientes.detalhe_solicitacao','primary'))).join('')+`<p class="aj-muted">${app.requests.filter(x=>x.status===app.requestTab).length} solicitações neste estado.</p>`;break;
case 'advogado.clientes.recusa_confirmada':b=card('Solicitação recusada','A solicitação fictícia foi classificada como recusada. O cliente não recebe comunicação real.',CBTN('Voltar às solicitações','advogado.clientes.solicitacoes_recebidas','primary'));break;
case 'advogado.atendimentos.lista':b=card('Atendimento · '+p.clientName,'Status: '+(app.request==='closed'?'encerrado':'em acompanhamento')+' · '+p.requestArea,CBTN('Abrir atendimento','advogado.atendimentos.detalhe','primary'));break;
case 'advogado.atendimentos.detalhe':b=card('Contato liberado','Cliente: '+p.clientName+' · '+p.clientEmail+' · '+p.requestDescription,DO('Encerrar atendimento','closeRequest','primary')+CBTN('Voltar à lista','advogado.atendimentos.lista'));break;
case 'advogado.atendimentos.encerrar':b=card('Atendimento encerrado','O encerramento foi registrado no cenário; não envia mensagens nem fecha casos reais.',CBTN('Voltar aos atendimentos','advogado.atendimentos.lista','primary'));break;
case 'advogado.assinatura.checkout':b=card('Checkout · '+app.selectedPlan,'Demonstração de contratação sem cobrança e sem integração externa. Selecione o resultado que deseja simular.',DO('Simular pagamento aprovado','payment:approved','primary')+DO('Simular pagamento não concluído','payment:failed')+CBTN('Voltar aos planos','advogado.assinatura.planos'));break;
case 'advogado.assinatura.resultado_checkout':b=card(app.payment==='approved'?'Plano ativado (simulado)':'Pagamento não concluído',app.payment==='approved'?'A assinatura fictícia foi ativada nesta sessão, sem cobrança.':'Nenhuma assinatura foi ativada, e nenhuma cobrança ocorreu.',CBTN('Gerenciar assinatura','advogado.assinatura.gestao_assinatura','primary'));break;
case 'escritorio.equipe.convite_enviado':b=card('Convite registrado','Foi criado um convite de demonstração para advogado@exemplo.test. Nenhum e-mail foi enviado.',CBTN('Voltar à equipe','escritorio.equipe.equipe','primary'));break;
case 'advogado.configuracao.meus_chamados':b=card('Chamado #SUP-DEMO-01',app.ticket?'Aberto · retorno simulado do suporte.':'Exemplo de solicitação já existente.',CBTN('Ver acompanhamento','advogado.configuracao.chamado_detalhe','primary'))+CBTN('Novo chamado','advogado.configuracao.falar_suporte');break;
case 'advogado.configuracao.chamado_detalhe':b=card('Acompanhamento do chamado','Abertura simulada · Em análise · Mensagem recebida: “Nossa equipe está verificando sua solicitação.”',CBTN('Meus chamados','advogado.configuracao.meus_chamados','primary'));break;
case 'notificacoes.lista.notificacoes':b=app.notifications.map(n=>`<div class="aj-card ${n.read?'read':''}"><div class="aj-kicker">${esc(n.category)} ${!n.read?'· Nova':''}</div><h3>${esc(n.title)}</h3><p>${esc(n.body)}</p><button class="aj-btn" data-do="notif:${esc(n.id)}">Abrir notificação <span>›</span></button></div>`).join('')+DO('Marcar todas como lidas','readAll');break;
case 'notificacoes.detalhe.notificacao':{const n=app.notifications.find(x=>x.id===app.currentNotification)||app.notifications[0];b=card(n.title,n.body,CBTN('Ir para o conteúdo',n.to,'primary')+CBTN('Voltar às notificações','notificacoes.lista.notificacoes'));break;}
 default:b=card(title,'Esta tela usa os componentes de conclusão do laboratório.',CBTN('Continuar',NEXT[id]||'advogado.home.inicio','primary'));
}
return customPage(title,s.description,b)}
const CUSTOM_CSS=`:host{--primary:#10233f;--blue:#2563eb;display:block;background:#f1f5fa;color:#193650;font-family:Inter,"Segoe UI",sans-serif;min-height:625px}*{box-sizing:border-box}.custom-app{min-height:625px;background:#f3f6fb}.aj-appbar{display:flex;align-items:center;justify-content:space-between;gap:8px;background:#10233f;color:#fff;padding:17px 18px}.aj-brand{display:flex;align-items:center;gap:8px;font-size:11px;letter-spacing:.08em}.aj-brand span{display:grid;place-items:center;background:#397ee8;border-radius:8px;width:29px;height:29px;font-weight:800}.aj-role{font-size:10px;color:#bbd0e5}.aj-page{padding:22px 17px 42px}.aj-head{margin:0 0 20px}.aj-eyebrow,.aj-kicker{font-size:10px;color:#5b7fa2;letter-spacing:.08em;font-weight:800;text-transform:uppercase}.aj-head h1{font-size:25px;line-height:1.23;margin:8px 0;color:#102c4e}.aj-head p{font-size:12px;color:#647d94;line-height:1.55;margin:0}.aj-card{border-radius:13px;background:white;padding:17px;margin:10px 0;border:1px solid #dce7f1;box-shadow:0 4px 14px #153a6a0a}.aj-card.read{opacity:.83}.aj-card h3{font-size:15px;line-height:1.4;margin:0 0 8px;color:#173556}.aj-card p{font-size:12px;color:#657f95;line-height:1.6;margin:0 0 10px}.aj-btn{border:1px solid #dae5f2;border-radius:9px;display:flex;justify-content:space-between;align-items:center;gap:8px;padding:12px;width:100%;color:#244d76;background:#f8fbff;margin:8px 0;font-weight:750;font-size:12px;text-align:left;cursor:pointer}.aj-btn.primary{color:white;background:#2563eb;border-color:#2563eb}.aj-check{display:flex;align-items:flex-start;gap:7px;color:#3e5872;font-size:12px;padding:9px 0}.aj-check input{margin-top:2px}.aj-input{width:100%;border:1px solid #ccdceb;border-radius:9px;padding:11px;margin:8px 0 12px;font-size:13px}.aj-label{color:#526a82;font-size:12px;font-weight:700}.aj-tabs{display:flex;gap:5px;overflow:auto;padding-bottom:6px}.aj-tabs button{border:1px solid #d5e2f1;border-radius:7px;padding:9px;font-size:11px;background:white;white-space:nowrap;color:#526d8a}.aj-tabs button.selected{color:white;background:#2563eb;border-color:#2563eb}.aj-muted{font-size:11px;color:#8497aa}`;
function renderScreen(){const sc=MODEL.screens[app.screen];if(!sc)return;const h=$('shadowHost');if(!shadow)shadow=h.attachShadow({mode:'open'});let custom=sc.origin==='complementada'||['auth.cadastro.consentimentos','advogado.validacao.status','advogado.clientes.solicitacoes_recebidas','advogado.atendimentos.lista','advogado.configuracao.meus_chamados','advogado.assinatura.checkout','notificacoes.lista.notificacoes'].includes(app.screen);let css=custom?CUSTOM_CSS:sc.css;
 const contextStyle=`:host{--primary:#10233f;--primary-soft:#173c6b;--blue:#2563eb;--page:#f1f5fb;--text:#19324b;display:block;min-height:625px;font-family:Inter,"Segoe UI",Arial,sans-serif;color:#19324b;background:white;overflow:auto}*,*::before,*::after{box-sizing:border-box}button,input,select,textarea{font-family:inherit}button{cursor:pointer}button:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid #8db8fc;outline-offset:2px}a{cursor:pointer}.screen-runtime{display:block;width:100%;min-height:625px}.simulation-state-ribbon{background:#f1f7ff;color:#244d75;padding:8px 14px;text-align:center;font:700 11px/1.4 Inter,"Segoe UI",sans-serif;border-bottom:1px solid #dae8f7}.simulation-state-ribbon.warn{background:#fff7e8;color:#8c611a}.simulation-state-ribbon.ok{background:#e9f9f1;color:#177a54}.sim-restricted{font:12px Inter,Arial,sans-serif;display:grid;gap:5px;padding:14px;background:#fff6e7;color:#725014;border-bottom:1px solid #edddb9}.sim-restricted button{padding:9px;background:#fff;border:1px solid #e4d1a9;color:#724710;text-align:left;border-radius:9px;font-weight:760}.aj-global-nav{position:sticky;top:0;z-index:10000;display:flex;justify-content:flex-end;align-items:center;height:42px;padding:5px 10px;background:#edf4ff;border-bottom:1px solid #ceddf2;font:700 11px Inter,Arial,sans-serif}.aj-global-nav button{font:inherit;border:1px solid #c4d9f3;border-radius:9px;background:white;color:#21558b;padding:7px 10px;cursor:pointer}.aj-global-nav .nav-txt{flex:1;color:#506c88;font-weight:600}.aj-menu-overlay{position:sticky;top:42px;z-index:10001;background:#ffffff;box-shadow:0 15px 25px #11294426;padding:15px 12px;border-bottom:1px solid #d9e4f0}.aj-menu-overlay b{font-size:14px;display:block;margin-bottom:8px;color:#173653}.aj-menu-overlay button{font:700 12px Inter,Arial,sans-serif;display:block;border:1px solid #e0e8f2;border-radius:8px;text-align:left;padding:11px;width:100%;background:#f8faff;color:#284968;margin:5px 0;cursor:pointer}`;
 const html=custom?renderCustom(app.screen):sc.html;
 const restriction=app.screen==='advogado.home.inicio'&&app.status!=='validated'?`<div class="sim-restricted" role="status"><strong>OAB: ${esc(statusLabel())}</strong><span>Operações profissionais exigem habilitação.</span><button data-route="advogado.configuracao.validacao_oab">Acompanhar validação ›</button></div>`:'';
 // Keep source-specific CSS scoped inside the Shadow DOM; global laboratory controls cannot leak into original visual.
 const operational=app.mode==='free'&&(/^(advogado|escritorio|notificacoes)\./.test(app.screen))&&!app.screen.startsWith('advogado.onboarding.');
 const nav=operational?`<div class="aj-global-nav"><span class="nav-txt">☰ Navegação do aplicativo</span><button data-do="openMenu">${app.menuOpen?'✕ Fechar':'Abrir menu'}</button></div>${app.menuOpen?`<div class="aj-menu-overlay"><b>Menu do advogado</b>${[['Início','advogado.home.inicio'],['Solicitações','advogado.clientes.solicitacoes_recebidas'],['Atendimentos','advogado.atendimentos.lista'],['Disponibilidade','advogado.disponibilidade.painel'],['Assinatura','advogado.assinatura.gestao_assinatura'],['Escritório','escritorio.gestao.escritorio'],['Perfil','advogado.perfil.visualizacao'],['Notificações','notificacoes.lista.notificacoes'],['Configurações','advogado.configuracao.configuracao'],['Suporte','advogado.configuracao.suporte']].map(([name,to])=>`<button data-route="${to}">${name}</button>`).join('')}</div>`:''}`:'';
 shadow.innerHTML=`<style>${contextStyle}\n${css}</style>${nav}${app.screen==='advogado.home.inicio'?`<div class="simulation-state-ribbon ${app.status==='validated'?'ok':'warn'}">${esc(statusLabel())} · ${app.status==='validated'?'Operação habilitada':'Recursos profissionais protegidos (simulação)'}</div>`:''}${restriction}${html}`;
 restoreForms();
 if(app.mode==='journey')shadow.querySelectorAll('[data-demo-state]').forEach(e=>{e.style.display='none';});
 if(app.status!=='validated')shadow.querySelectorAll('[data-online-root],[data-online-toggle]').forEach(e=>{e.setAttribute('aria-disabled','true');e.setAttribute('title','Bloqueado até validação de OAB');});
 // Resource-free fallback for programmatic native links that source markup references.
 if(app.screen==='auth.inicializacao.splash')shadow.querySelector('.screen-runtime')?.setAttribute('role','img');
}
function renderToolPanels(){const sc=MODEL.screens[app.screen]||{};
 $('leftTitle').textContent=app.mode==='free'?'Explorar telas':'Apresentar jornadas';$('rightTitle').textContent=app.mode==='free'?'Dados e estados':'Percurso';
 if(app.mode==='free'){
 const groups={};for(const s of Object.values(MODEL.screens)){(groups[s.group]??=[]).push(s)}
 const groupHTML=Object.entries(groups).map(([g,ss])=>`<details class="group" ${g===sc.group?'open':''}><summary style="font-size:12px;font-weight:780;cursor:pointer">${esc(g)} <small>(${ss.length})</small></summary><div class="screen-set">${ss.map(s=>`<button class="screen-link ${s.id===app.screen?'active':''}" data-screen="${esc(s.id)}">${esc(s.title)}</button>`).join('')}</div></details>`).join('');
 $('leftContent').innerHTML=`<div class="group soft"><h3>Comece por uma tela</h3><div class="field"><label>Buscar tela</label><input id="searchScreen" placeholder="Título ou ID" autocomplete="off"></div><div id="searchMatches" class="hide screen-set"></div><p>Todas as telas da jornada, inclusive resultados completados.</p></div><div id="screenGroups">${groupHTML}</div>`;
 $('rightContent').innerHTML=`<div class="group soft"><h3>Dados de simulação</h3><div class="field"><label>Mock do advogado</label><select id="scenarioPanel">${Object.entries(MODEL.scenarios).map(([id,s])=>`<option value="${esc(id)}" ${app.scenario===id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></div><p>Preenche somente campos vazios. O que foi digitado manualmente é preservado.</p><div class="stack"><button class="btn primary" data-fill="screen">✦ Completar tela atual</button><button class="btn" data-fill="group">Preparar processo atual</button><button class="btn" data-fill="all">Preparar todas as telas</button></div></div><div class="group"><h3>Condições da conta</h3><div class="field"><label>Status da OAB</label><select id="statusSelect">${Object.entries({pending:'Pendente',review:'Em análise',validated:'Validada',rejected:'Correção necessária',unknown:'Desconhecido',suspended:'Suspensa',expired:'Expirada'}).map(([v,l])=>`<option ${v===app.status?'selected':''} value="${v}">${l}</option>`).join('')}</select></div><label style="font-size:11px;display:block"><input id="registeredToggle" type="checkbox" ${app.registered?'checked':''}> Cadastro concluído</label><label style="font-size:11px;display:block;margin-top:8px"><input id="onboardedToggle" type="checkbox" ${app.onboarded?'checked':''}> Onboarding concluído</label><label style="font-size:11px;display:block;margin-top:8px"><input id="officeToggle" type="checkbox" ${app.office?'checked':''}> Escritório cadastrado</label><div class="field"><label>Estado da solicitação</label><select id="requestSelect">${Object.entries({new:'Nova',accepted:'Aceita',declined:'Recusada',closed:'Encerrada'}).map(([v,l])=>`<option ${v===app.request?'selected':''} value="${v}">${l}</option>`).join('')}</select></div></div><div class="group"><h3>Eventos externos (mock)</h3><div class="stack"><button class="btn" data-event="receive">Receber solicitação</button><button class="btn" data-event="validate">Validar OAB</button><button class="btn" data-event="notification">Nova notificação</button></div></div><div class="group"><h3>Tela em execução</h3><div class="hint">${esc(sc.id)}<div class="mini-tags"><span class="tag ${sc.origin==='fonte'?'orig':'new'}">${sc.origin==='fonte'?'Fonte congelada':'Tela complementada'}</span><span class="tag">${esc(sc.group)}</span></div></div><button class="btn small" id="backHistory">← Voltar à tela anterior</button></div>`;
 }else{
 const gs={};for(const j of JOURNEYS)(gs[j.group]??=[]).push(j);
 $('leftContent').innerHTML=`<div class="group soft"><h3>Selecione uma jornada</h3><p>Jornadas e subjornadas completas, com os resultados simulados necessários.</p></div>${Object.entries(gs).map(([g,js])=>`<div class="group"><h3>${esc(g)}</h3>${js.map(j=>`<button class="journey-item ${j.id===app.journey?'active':''}" data-journey="${j.id}">${esc(j.name)}<span style="display:block;font-size:10px;color:#849bb0;margin-top:2px">${esc(j.intro)}</span></button>`).join('')}</div>`).join('')}`;
 const steps=expandedSteps(),current=currentStep(),percentage=steps.length?Math.floor((app.cursor+1)/steps.length*100):0;
 $('rightContent').innerHTML=`<div class="group soft"><h3>${esc(JOURNEY_BY_ID[app.journey].name)}</h3><p>${esc(JOURNEY_BY_ID[app.journey].intro)}</p><div class="progress"><i style="width:${percentage}%"></i></div><p>${app.cursor+1} de ${steps.length} etapas · ${percentage}%</p><div class="field"><label>Velocidade automática</label><select id="intervalSelect">${[[1200,'1,2 s'],[2400,'2,4 s'],[4000,'4 s'],[6500,'6,5 s']].map(([v,l])=>`<option value="${v}" ${app.interval===v?'selected':''}>${l}</option>`).join('')}</select></div><div class="inline-row"><button class="btn small ${app.auto?'primary':''}" id="autoToggle">${app.auto?'❚❚ Pausar':'▶ Automático'}</button><button class="btn small" id="manualToggle">Manual</button></div></div><div class="group"><h3>Etapas</h3><div class="step-list">${steps.map((st,i)=>`<div class="step ${i===app.cursor?'now':i<app.cursor?'done':''}"><div class="num">${i<app.cursor?'✓':i+1}</div><div class="txt">${esc(MODEL.screens[st.screen]?.title||st.screen)}${st.type==='fork'?' <b>◇ escolha</b>':''}</div></div>`).join('')}</div></div><div class="group"><h3>Dados de apresentação</h3><p>Mock: ${esc(MODEL.scenarios[app.scenario].name)}</p><div class="mini-tags"><span class="tag">${esc(statusLabel())}</span><span class="tag">${app.auto?'Automático':'Manual'}</span></div><button class="btn small" id="resetJourney">↺ Reiniciar jornada</button></div>`;
 }
}
function renderFooter(){const sc=MODEL.screens[app.screen];if(app.mode==='free'){$('footerTitle').textContent='Modo livre';$('footerSub').textContent='Navegação livre · mocks sem sobrescrever dados';$('footActions').innerHTML=`<button class="btn small" data-do="back">← Voltar</button><button class="btn small" data-fill="screen">✦ Mock</button><button class="btn primary small" data-do="continue">Seguir →</button>`;return;}
 const steps=expandedSteps(),curr=currentStep(),percentage=steps.length?Math.floor((app.cursor+1)/steps.length*100):0;
 $('footerTitle').textContent=JOURNEY_BY_ID[app.journey].name;$('footerSub').textContent=`Etapa ${app.cursor+1}/${steps.length} · ${percentage}% · ${app.auto?'Automático':'Manual'}`;
 $('footActions').innerHTML=`<button class="btn small" data-do="prev">← Voltar</button><button class="btn small" data-do="auto">${app.auto?'❚❚ Pausar':'▶ Auto'}</button><button class="btn primary small" data-do="next" ${curr?.type==='fork'&&app.decisions[curr.fork]===undefined?'':' '}>${curr?.type==='fork'?'Escolher caminho':'Avançar →'}</button>`;}
function showBranch(step){if(!step||step.type!=='fork'){$('branchBackdrop').classList.add('hide');return;}
 const old=app.decisions[step.fork];$('branchTitle').textContent=step.question;$('branchDescription').textContent='O simulador não escolhe este caminho por você. Selecione uma alternativa para continuar.';
 $('branchChoices').innerHTML=step.choices.map((c,i)=>`<button class="choice" data-choice="${i}"><span><strong>${esc(c.label)} ${old===i?'✓':''}</strong>${c.detail?`<small>${esc(c.detail)}</small>`:''}</span><span>›</span></button>`).join('')+`<button class="btn small" id="dismissBranch" style="margin-top:8px">Voltar à etapa anterior</button>`;$('branchBackdrop').classList.remove('hide');}
function render(){modeFree.classList.toggle('active',app.mode==='free');modeJourney.classList.toggle('active',app.mode==='journey');$('shell').classList.toggle('present',app.present);$('scenarioSelect').value=app.scenario;const sc=MODEL.screens[app.screen];$('screenTitle').textContent=sc.title;$('screenMeta').textContent=app.mode==='free'?'Exploração interativa · '+sc.group:'Jornada: '+JOURNEY_BY_ID[app.journey].name;$('statusChip').textContent=statusLabel();$('statusChip').className='status '+clsStatus();$('presTitle').textContent=app.mode==='journey'?JOURNEY_BY_ID[app.journey].name:sc.title;$('presSubtitle').textContent=app.mode==='journey'?`${app.cursor+1} / ${expandedSteps().length} etapas · ${app.auto?'automático':'manual'} · ${statusLabel()}`:`Simulação livre · ${statusLabel()}`;$('togglePresent').textContent=app.present?'Sair da apresentação':'⛶ Apresentar';renderScreen();renderToolPanels();renderFooter();$('viewport').scrollTop=0;
 let st=app.mode==='journey'?currentStep():null;if(st?.type==='fork'&&app.decisions[st.fork]===undefined)showBranch(st);else $('branchBackdrop').classList.add('hide');}
function handleAction(action){switch(action){
case 'openMenu':app.menuOpen=!app.menuOpen;renderScreen();return;
case 'back':if(app.history.length)goto(app.history.pop(),{catalog:true});else toast('Não há tela anterior.');break;
case 'continue':if(app.screen==='auth.sessao.entrar'){login();break;}if(app.screen==='auth.cadastro.consentimentos'&&!checkConsents())return;finishScreen(app.screen);goto(NEXT[app.screen]||'advogado.home.inicio');break;
case 'next':advance(1);break;case 'prev':stopAuto();app.resumeAfterChoice=false;advance(-1);break;
case 'auto':if(app.auto){stopAuto();render();}else{app.auto=true;let s=currentStep();if(s?.type==='fork'&&app.decisions[s.fork]===undefined){app.resumeAfterChoice=true;stopAuto();render();showBranch(s);}else{render();scheduleNext();}}break;
case 'recover':goto('auth.sessao.recuperacao_enviada');break;
case 'payment:approved':app.payment='approved';goto('advogado.assinatura.resultado_checkout');break;
case 'payment:failed':app.payment='failed';goto('advogado.assinatura.resultado_checkout');break;
case 'closeRequest':app.request='closed';app.requests[0].status='closed';goto('advogado.atendimentos.encerrar');break;
case 'readAll':app.notifications.forEach(n=>n.read=true);render();toast('Notificações marcadas como lidas.');break;
default:
 if(action.startsWith('tab:')){app.requestTab=action.split(':')[1];render();return;}
 if(action.startsWith('notif:')){app.currentNotification=action.split(':')[1];app.notifications.find(n=>n.id===app.currentNotification).read=true;goto('notificacoes.detalhe.notificacao');return;}
}}
function checkConsents(){const a=shadow.querySelector('#termAccept'),b=shadow.querySelector('#privacyAccept');if(a&&!a.checked||b&&!b.checked){toast('Para concluir o cadastro, marque os consentimentos obrigatórios.');return false;}return true}
function finishScreen(id){if(id==='auth.cadastro.consentimentos')app.consents=true;if(id==='auth.cadastro.revisao'||id==='auth.cadastro.concluido')app.registered=true;if(id==='advogado.onboarding.revisao_profissional'||id==='advogado.onboarding.conclusao_profissional'){app.onboarded=true;app.status='review';}if(id==='advogado.clientes.aceitar_contato'||id==='advogado.clientes.contato_liberado'){app.request='accepted';app.requests[0].status='accepted';}if(id==='advogado.clientes.recusar_solicitacao'){app.request='declined';app.requests[0].status='declined';}if(id==='escritorio.onboarding.cadastro_escritorio')app.office=true;if(id==='advogado.configuracao.falar_suporte')app.ticket=true;if(id==='escritorio.equipe.convidar_advogado')app.events.unshift({what:'Convite de escritório registrado (mock)',time:new Date().toLocaleTimeString('pt-BR')});if(id==='advogado.assinatura.checkout')app.payment='approved';if(id==='advogado.oab.dados')app.status='pending';}
function login(){if(!app.registered){goto('auth.cadastro.tipo_conta');return;}if(!app.onboarded){goto('advogado.onboarding.dados_academicos');return;}goto('advogado.home.inicio');}
function resolveAction(el){if(el.hasAttribute('data-route'))return el.getAttribute('data-route');if(el.hasAttribute('data-goto'))return el.getAttribute('data-goto');if(el.hasAttribute('data-next'))return el.getAttribute('data-next');const a=el.getAttribute('data-action')||'';if(a.startsWith('navegar.'))return a.slice(8);if(a==='online.toggle'){if(app.status!=='validated'){toast('Somente advogado com OAB habilitada pode ficar online na simulação.');return null;}app.online=!app.online;render();toast('Disponibilidade '+(app.online?'ativada':'desativada'));return null;}
if(el.hasAttribute('data-onboarding-placeholder'))return 'auth.sessao.entrar';if(el.hasAttribute('data-create-account'))return 'auth.cadastro.concluido';if(el.hasAttribute('data-submit-professional'))return 'advogado.onboarding.conclusao_profissional';if(el.hasAttribute('data-submit-oab-validation'))return 'advogado.validacao.envio_confirmado';
if(el.hasAttribute('data-demo-state')){const m={pending:'pending',review:'review',validated:'validated',rejected:'rejected'};app.status=m[el.dataset.demoState]||'pending';render();toast('Estado de validação alterado: '+statusLabel());return null;}
if(el.hasAttribute('data-online-toggle')){if(app.status!=='validated'){toast('Disponibilidade online bloqueada enquanto a OAB não estiver validada.');return null;}app.online=!app.online;render();toast('Online '+(app.online?'ligado':'desligado'));return null;}
if(el.hasAttribute('data-request-tab')){app.requestTab=el.dataset.requestTab;render();return null;}
if(el.hasAttribute('data-schedule-toggle')){const row=el.closest('[data-day],.agenda-day,.agenda-day-row,.agenda-row')||el.parentElement;const active=el.getAttribute('aria-pressed')!=='true';el.setAttribute('aria-pressed',String(active));el.textContent=active?'Disponível':'Indisponível';row.classList.toggle('is-active',active);toast('Dia '+(active?'ativado':'desativado')+' na agenda simulada.');return null;}
if(el.hasAttribute('data-copy-weekdays')){const times=Array.from(shadow.querySelectorAll('input[type=time]'));if(times.length>=4){for(let i=2;i<Math.min(10,times.length);i++)times[i].value=times[i%2].value;recordForms();}toast('Horários de segunda-feira copiados para os dias úteis.');return null;}
if(el.hasAttribute('data-specialty-select-all')||el.hasAttribute('data-specialty-clear')){const check=el.hasAttribute('data-specialty-select-all');shadow.querySelectorAll('input[type=checkbox]').forEach(x=>x.checked=check);recordForms();toast(check?'Especialidades marcadas.':'Especialidades desmarcadas.');return null;}
if(el.hasAttribute('data-add-unavailability')){const date=shadow.querySelector('#agenda-block-date')?.value||'data a definir';const note=shadow.querySelector('#agenda-block-note')?.value||'Indisponibilidade registrada';app.unavailability??=[];app.unavailability.push({date,note});const elBox=document.createElement('div');elBox.className='simulation-state-ribbon';elBox.textContent='Indisponibilidade simulada: '+date+' · '+note;shadow.appendChild(elBox);toast('Indisponibilidade adicionada à agenda do cenário.');return null;}
if(el.hasAttribute('data-remove-unavailability')){el.closest('.agenda-block,.unavailability-item,li')?.remove();toast('Indisponibilidade removida da agenda simulada.');return null;}
if(el.hasAttribute('data-save-preferences')||el.hasAttribute('data-save-schedule')){recordForms();toast('Configuração salva neste cenário simulado.');return null;}
if(el.hasAttribute('data-pick-file')){shadow.querySelector('input[type=file]')?.click();return null;}
if(app.screen==='escritorio.gestao.escritorio'&&/criar escrit/i.test(el.textContent||''))return 'escritorio.onboarding.cadastro_escritorio';
if(el.hasAttribute('data-action-message')){recordForms();toast(el.dataset.actionMessage);return null;}
if(el.type==='submit')return NEXT[app.screen]||'advogado.home.inicio';
const text=(el.textContent||'').trim().toLowerCase();if(app.screen==='auth.sessao.entrar'){if(/esqueci/.test(text))return 'auth.sessao.recuperar_senha';if(/entrar|google|apple/.test(text)){login();return null;}if(/criar/.test(text))return 'auth.cadastro.tipo_conta';}
if(app.screen==='escritorio.gestao.escritorio'&&/criar escrit/.test(text))return 'escritorio.onboarding.cadastro_escritorio';
if(app.screen==='advogado.assinatura.checkout')return 'advogado.assinatura.resultado_checkout';
return null;}
function guardedClick(e){const t=e.target.closest('button,a');if(!t)return;e.preventDefault();if(t.closest('form')&&t.type==='submit'){
 const form=t.closest('form');if(!form.checkValidity()){form.reportValidity();return;}}
 if(app.mode==='journey'){
 const st=currentStep();if(st?.type==='fork'){
  const dest=t.getAttribute('data-goto')||t.getAttribute('data-route')||t.getAttribute('data-next');const idx=st.choices.findIndex(c=>(c.steps||[]).some(x=>(typeof x==='string'?x:x.screen)===dest)||c.label.toLowerCase()===t.textContent.trim().toLowerCase());if(idx>=0){chooseFork(idx);return;}}
 toast('Apresentação roteirizada: use Avançar, Voltar ou escolha uma bifurcação.');return;}
 const job=t.getAttribute('data-do');if(job){handleAction(job);return;}
 const dest=resolveAction(t);if(!dest)return;
 if(dest==='auth.cadastro.revisao'&&app.screen.includes('consentimentos')&&!checkConsents())return;
 if(app.screen==='advogado.assinatura.planos'&&dest==='advogado.assinatura.checkout'){app.selectedPlan=(t.textContent||'Essencial').replace(/escolher/ig,'').trim()||'Essencial';}
if(dest==='advogado.assinatura.resultado_checkout')app.payment='approved';
 finishScreen(app.screen);recordForms();goto(dest);}
function onSubmit(e){e.preventDefault();if(app.mode==='journey')return;const form=e.target;
 if(!form.checkValidity()){form.reportValidity();return;}recordForms();const button=Array.from(form.querySelectorAll('button[type=submit],input[type=submit]'))[0];let dest=button?resolveAction(button):NEXT[app.screen];if(app.screen==='auth.sessao.entrar'){login();return;}
 if(app.screen==='auth.cadastro.consentimentos'&&!checkConsents())return;
 finishScreen(app.screen);goto(dest||NEXT[app.screen]||'advogado.home.inicio');}
function onChange(e){const f=e.target;if(!f.matches('input,select,textarea'))return;const arr=Array.from(shadow.querySelectorAll('input,select,textarea'));app.forms[app.screen]??={};app.forms[app.screen][keyOf(f,arr.indexOf(f))]=f.type==='checkbox'||f.type==='radio'?(f.checked?f.value||true:false):f.value;}
function handleExternalClick(e){const t=e.target.closest('button');if(!t)return;
 if(t.dataset.choice!==undefined){chooseFork(Number(t.dataset.choice));return;}if(t.id==='dismissBranch'){$('branchBackdrop').classList.add('hide');stopAuto();if(app.cursor>0)advance(-1);else toast('Selecione uma alternativa para continuar.');return;}
 if(t.dataset.screen){goto(t.dataset.screen,{catalog:true});$('leftPane').classList.remove('open');return;}
 if(t.dataset.journey){startJourney(t.dataset.journey);$('leftPane').classList.remove('open');return;}
 if(t.dataset.fill){fillMock(t.dataset.fill);return;}if(t.dataset.do){handleAction(t.dataset.do);return;}
 if(t.dataset.event){switch(t.dataset.event){case 'receive':app.request='new';app.requests[0].status='new';toast('Nova solicitação simulada.');break;case 'validate':app.status='validated';toast('OAB validada no mock.');break;case 'notification':app.notifications.unshift({id:'nx'+Date.now(),title:'Nova notificação de teste',body:'Evento simulado de atualização.',category:'Sistema',to:'advogado.home.inicio',read:false});toast('Notificação simulada.');break;}render();return;}
 if(t.id==='autoToggle'||t.id==='manualToggle'){if(t.id==='manualToggle'){stopAuto();render();}else handleAction('auto');return;}
 if(t.id==='resetJourney'){startJourney(app.journey);return;}if(t.id==='backHistory'){handleAction('back');return;}
}
function onExternalChange(e){if(e.target.id==='scenarioSelect'||e.target.id==='scenarioPanel'){setScenario(e.target.value);return;}if(e.target.id==='statusSelect'){app.status=e.target.value;app.online=app.status==='validated';render();return;}
 if(e.target.id==='requestSelect'){app.request=e.target.value;app.requests[0].status=app.request;render();return;}
 if(e.target.id==='registeredToggle'){app.registered=e.target.checked;render();return;}if(e.target.id==='onboardedToggle'){app.onboarded=e.target.checked;render();return;}if(e.target.id==='officeToggle'){app.office=e.target.checked;render();return;}
 if(e.target.id==='intervalSelect'){app.interval=Number(e.target.value);render();return;}}
function onExternalInput(e){if(e.target.id!=='searchScreen')return;const q=e.target.value.toLocaleLowerCase('pt-BR').trim(),res=$('searchMatches'),group=$('screenGroups');if(!q){res.classList.add('hide');group.classList.remove('hide');return;}
 const found=Object.values(MODEL.screens).filter(x=>x.id.toLowerCase().includes(q)||x.title.toLowerCase().includes(q)).slice(0,40);res.classList.remove('hide');group.classList.add('hide');res.innerHTML=found.length?found.map(s=>`<button class="screen-link" data-screen="${esc(s.id)}">${esc(s.title)} <small style="display:block">${esc(s.id)}</small></button>`).join(''):'<div class="empty">Nenhuma tela encontrada.</div>';}
async function load(){try{
 const b64=$('bundle').textContent.trim(),raw=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));const stream=new Blob([raw]).stream().pipeThrough(new DecompressionStream('gzip'));const buf=await new Response(stream).arrayBuffer();MODEL=JSON.parse(new TextDecoder().decode(buf));
 JOURNEYS=Array.isArray(MODEL.journeys)?MODEL.journeys:[];
 JOURNEY_BY_ID=Object.fromEntries(JOURNEYS.map(j=>[j.id,j]));
 app=scenarioState('habilitado');
 for(const [k,v] of Object.entries(MODEL.scenarios))$('scenarioSelect').add(new Option(v.name,k));
 const host=$('shadowHost');shadow=host.attachShadow({mode:'open'});shadow.addEventListener('click',guardedClick);shadow.addEventListener('submit',onSubmit);shadow.addEventListener('change',onChange);shadow.addEventListener('input',onChange);
 $('modeFree').onclick=freeMode;$('modeJourney').onclick=journeyMode;$('togglePanel').onclick=()=>$('leftPane').classList.toggle('open');$('togglePresent').onclick=()=>{app.present=!app.present;render();};$('exitPresent').onclick=()=>{app.present=false;render();};$('resetBtn').onclick=()=>setScenario(app.scenario);document.addEventListener('click',handleExternalClick);document.addEventListener('change',onExternalChange);document.addEventListener('input',onExternalInput);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&app.present){app.present=false;render();}if(e.target.matches('input,textarea,select'))return;if(app.mode==='journey'&&e.key==='ArrowRight')advance(1);if(app.mode==='journey'&&e.key==='ArrowLeft'){stopAuto();advance(-1);}});
 render();
window.parent.postMessage({type:'aj:prototype:ready',screens:Object.values(MODEL.screens).map(s=>({id:s.id,title:s.title,group:s.group})),journeys:JOURNEYS.map(j=>({id:j.id,name:j.name,group:j.group})),scenarios:Object.entries(MODEL.scenarios).map(([id,s])=>({id,name:s.name}))},'*');
}catch(err){console.error(err);document.body.innerHTML='<main style="max-width:700px;margin:15vh auto;padding:20px;font-family:system-ui"><h1>Não foi possível abrir o laboratório</h1><p>É necessário um navegador moderno com suporte a descompressão local (Chrome, Edge ou Firefox recente). Este HTML não utiliza rede.</p><pre>'+esc(err)+'</pre></main>';}}
function reportHostState(){
 if(!app)return;
 window.parent.postMessage({type:'aj:prototype:state',mode:app.mode,journey:app.journey,screen:app.screen,scenario:app.scenario,present:app.present},'*');
}
function closeDrawers(){
 $('leftPane').classList.remove('catalog-open');
 $('toolsPane').classList.remove('tools-open');
}
function toggleDrawer(which){
 const target=which==='catalog'?'leftPane':'toolsPane', cls=which==='catalog'?'catalog-open':'tools-open';
 const opening=!$(target).classList.contains(cls);
 closeDrawers();
 if(opening)$(target).classList.add(cls);
}
$('closeCatalog').addEventListener('click',closeDrawers);
$('closeTools').addEventListener('click',closeDrawers);
window.addEventListener('message',event=>{
 const d=event.data;
 if(!d||d.type!=='aj:prototype:command'||!app||!MODEL)return;
 const value=String(d.value||'');
 switch(d.command){
  case 'mode':closeDrawers();if(value==='journey')journeyMode();else freeMode();break;
  case 'journey':if(JOURNEY_BY_ID[value]){closeDrawers();startJourney(value)}break;
  case 'screen':if(MODEL.screens[value]){closeDrawers();if(app.mode!=='free')freeMode();goto(value,{catalog:true})}break;
  case 'scenario':if(MODEL.scenarios[value]){setScenario(value)}break;
  case 'catalog':toggleDrawer('catalog');break;
  case 'tools':toggleDrawer('tools');break;
  case 'present':app.present=!app.present;closeDrawers();render();break;
  case 'reset':setScenario(app.scenario);break;
 }
 reportHostState();
});
const renderOriginal=render;
render=function(){renderOriginal();reportHostState();};

load();

}

if(document.getElementById('protoFrame'))bootWorkspace();
else if(document.getElementById('shadowHost'))bootSimulator();
