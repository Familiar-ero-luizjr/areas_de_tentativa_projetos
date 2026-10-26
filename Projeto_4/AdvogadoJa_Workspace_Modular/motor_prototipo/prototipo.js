/* Módulo Protótipo - experiência navegável das jornadas.
 * Lê exclusivamente os JSONs de tela e o flow.editor já existente.
 */
const protState={journey:'',route:[],cursor:0,search:''};
const protPersonaMeta={
 cliente:{label:'Cliente · Maria',role:'Cliente',name:'Maria'},
 advogado:{label:'Advogado · João',role:'Advogado',name:'João'},
 estudante:{label:'Estudante · Ana',role:'Estudante',name:'Ana'},
 administrador:{label:'Administrador',role:'Administrador',name:''}
};
function protPersona(id){return protPersonaMeta[id]||{label:journeyName(id),role:journeyName(id),name:''};}
function protJourneyOptions(){return journeyCatalog();}
function protRouteSequenceHasJourney(seqId,journey,build,seen=new Set()){
 if(!seqId||seen.has(seqId))return false;
 seen.add(seqId);
 const items=build.sequenceMap.get(seqId)||[];
 for(const entry of items){
  const node=entry.node;
  if(node.type==='screen'){
   const screen=model.screens[node.screenKey];
   if(screen && screenSupportsJourney(screen,journey))return true;
  }else if(node.type==='branch'){
   for(const path of arr(node.paths))if(protRouteSequenceHasJourney(path.sequenceId,journey,build,new Set(seen)))return true;
  }
 }
 return false;
}
function protBuildRouteForJourney(journey){
 const build=compileFlowStructure();
 if(!build.rootSequenceId)return [];
 const route=[];
 function walk(seqId,trail=[]){
  const items=build.sequenceMap.get(seqId)||[];
  for(const entry of items){
   const node=entry.node;
   if(node.type==='screen'){
    const screen=model.screens[node.screenKey];
    if(screen && screenSupportsJourney(screen,journey)){
      route.push({
       key:node.screenKey,
       occurrenceId:node.id,
       sequenceId:seqId,
       title:screen.identidade?.nome||node.screenKey,
       order:entry.position,
       route:screen.identidade?.rota||'',
       scope:screen.classificacao?.escopo||'',
       stage:arr(screen.classificacao?.subjornadas).join(' · '),
       trail:deepClone(trail)
      });
    }
   }else if(node.type==='branch'){
    for(const path of arr(node.paths)){
      if(protRouteSequenceHasJourney(path.sequenceId,journey,build)){
        walk(path.sequenceId,[...trail,{branchId:node.id,branchTitle:node.title||'Bifurcação',pathId:path.id,pathLabel:path.label||path.id}]);
      }
    }
   }
  }
 }
 walk(build.rootSequenceId,[]);
 return route;
}
function protStatusText(entry){
 if(!entry)return 'Nenhuma tela disponível para a jornada selecionada.';
 const trail=arr(entry.trail).at(-1);
 const extras=[];
 if(entry.stage)extras.push(entry.stage);
 if(trail?.pathLabel)extras.push(trail.pathLabel);
 if(entry.route)extras.push(entry.route);
 return extras.join(' · ')||'Ponto da jornada carregado a partir do catálogo atual.';
}
function protPreviewHtml(entry){
 const screen=model.screens[entry?.key];
 if(!screen)return '';
 const state=screen.estados?.fallbackSeguro||arr(screen.estados?.grupos)[0]?.id||'padrao';
 try{
  const compiled=compile(screen,protState.journey,state);
  if(!compiled.componentes.length && arr(screen.componentes?.instancias).length)throw new Error('Componentes visuais não disponíveis para esta jornada/estado.');
  return previewHTML(compiled,false);
 }catch(e){
  const message=escapeHtml(e.message||'Prévia estrutural indisponível.');
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0;min-height:100dvh;display:grid;place-items:center;background:radial-gradient(circle at center,#163765 0,#081b39 72%,#06142b 100%);color:#fff;font-family:Arial,sans-serif}main{max-width:560px;padding:36px;border-radius:28px;background:rgba(6,20,43,.52);box-shadow:0 28px 80px rgba(0,0,0,.35);text-align:center}h1{margin:0 0 10px;font-size:40px}p{margin:0 0 14px;line-height:1.6;color:#dfe9fb}.chip{display:inline-flex;padding:8px 12px;border-radius:999px;background:rgba(255,255,255,.12);font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#cfe0ff}code{display:block;margin-top:14px;padding:12px;border-radius:12px;background:rgba(255,255,255,.08);font-size:12px;word-break:break-word}</style></head><body><main><span class="chip">Prévia estrutural pendente</span><h1>${escapeHtml(screen.identidade?.nome||entry.title)}</h1><p>Esta tela participa do protótipo, mas seus componentes visuais ainda não estão completos no catálogo. O fluxo continua navegável e a ligação estrutural permanece preservada.</p><code>${escapeHtml(screen.identidade?.id||entry.key)}</code><p style="margin-top:18px">${message}</p></main></body></html>`;
 }
}
function protCurrentRoute(){
 const q=protState.search.trim().toLowerCase();
 if(!q)return protState.route;
 return protState.route.filter(item=>`${item.title} ${item.key} ${item.stage}`.toLowerCase().includes(q));
}
function protClampCursor(list){
 if(!list.length){protState.cursor=0;return;}
 if(protState.cursor<0)protState.cursor=0;
 if(protState.cursor>=list.length)protState.cursor=list.length-1;
}
function protSelectJourney(journey,preferredKey=''){
 protState.journey=journey;
 protState.route=protBuildRouteForJourney(journey);
 const filtered=protCurrentRoute();
 const nextIndex=preferredKey?filtered.findIndex(x=>x.key===preferredKey||x.occurrenceId===preferredKey):-1;
 protState.cursor=nextIndex>=0?nextIndex:0;
 protClampCursor(filtered);
 protRender();
}
function protRender({refreshRoute=false}={}){
 if(!$('protJourneyTabs'))return;
 const journeys=protJourneyOptions();
 if(!journeys.length){$('protJourneyTabs').innerHTML='';$('protPoints').innerHTML='<div class="prot-empty">Nenhuma jornada declarada nas telas atuais.</div>';return;}
 if(!journeys.some(j=>j.id===protState.journey))protState.journey=journeys.find(j=>j.id==='cliente')?.id||journeys[0].id;
 if(refreshRoute||!protState.route.length){
  const oldOccurrence=protState.route[protState.cursor]?.occurrenceId;
  protState.route=protBuildRouteForJourney(protState.journey);
  const preserved=oldOccurrence?protState.route.findIndex(x=>x.occurrenceId===oldOccurrence):-1;
  if(preserved>=0)protState.cursor=preserved;
 }
 const selectedPersona=protPersona(protState.journey);
 $('protJourneyTabs').innerHTML=journeys.map(item=>{
   const meta=protPersona(item.id);
   return `<button class="prot-journey-chip ${item.id===protState.journey?'active':''}" data-prot-journey="${escapeHtml(item.id)}"><span>${escapeHtml(meta.label)}</span></button>`;
 }).join('');
 $('protSearch').value=protState.search;
 const list=protCurrentRoute();
 protClampCursor(list);
 const current=list[protState.cursor];
 $('protPoints').innerHTML=list.length?list.map((item,index)=>`<button class="prot-point ${index===protState.cursor?'active':''}" data-prot-index="${index}"><span class="prot-point-bullet"></span><span class="prot-point-text"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.stage||item.key)}</small></span></button>`).join(''):'<div class="prot-empty">Nenhuma tela desta jornada corresponde ao filtro informado.</div>';
 $('protPersonaKicker').textContent=(selectedPersona.label||journeyName(protState.journey)).toUpperCase('pt-BR');
 $('protScreenTitle').textContent=current?.title||'Sem tela';
 $('protScreenId').textContent=current?`Tela: ${current.key}`:'Nenhuma tela disponível.';
 $('protNote').textContent=protStatusText(current);
 $('protBack').disabled=protState.cursor<=0;
 $('protNext').disabled=protState.cursor>=Math.max(list.length-1,0);
 $('protReset').disabled=!list.length;
 $('protPreview').srcdoc=current?protPreviewHtml(current):'';
 $('protSummary').innerHTML=current
   ? `<span><b>${protState.cursor+1}</b> de <b>${list.length}</b> pontos</span><span>Jornada <b>${escapeHtml(selectedPersona.role)}</b></span><span>${escapeHtml(current.stage||'Fluxo principal')}</span>`
   : `<span>Jornada <b>${escapeHtml(selectedPersona.role)}</b></span><span>0 pontos no filtro atual</span>`;
 }
function protMove(step){
 const list=protCurrentRoute();
 protClampCursor(list);
 const next=protState.cursor+step;
 if(next<0||next>=list.length)return;
 protState.cursor=next;
 protRender();
}
function protWire(){
 $('protSearch').oninput=e=>{protState.search=e.target.value||'';protState.cursor=0;protRender();};
 $('protJourneyTabs').onclick=e=>{const button=e.target.closest('[data-prot-journey]');if(!button)return;protState.search='';protSelectJourney(button.dataset.protJourney);};
 $('protPoints').onclick=e=>{const button=e.target.closest('[data-prot-index]');if(!button)return;protState.cursor=Number(button.dataset.protIndex)||0;protRender();};
 $('protBack').onclick=()=>protMove(-1);
 $('protNext').onclick=()=>protMove(1);
 $('protReset').onclick=()=>{protState.search='';protState.cursor=0;protRender();};
 $('protBackLab').onclick=()=>switchTab('catalogo');
}
