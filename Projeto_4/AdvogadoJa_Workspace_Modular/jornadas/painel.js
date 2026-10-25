'use strict';
/* Jornadas são descobertas de classificacao.jornadas dos registros de tela.
 * ' * ' representa tela comum: visível em TODAS as jornadas atuais e futuras.
 * Sem cópia de componentes ou estruturas e sem aba cadastrada manualmente. */
const journeyPanel={journey:'',screen:''};
function journeyPanelState(t){return t.estados?.fallbackSeguro||arr(t.estados?.grupos)[0]?.id||'padrao';}
function journeyPanelActions(t,journey,state){
 // As entradas são derivadas, e as saídas usam o MESMO indexador do Flow.
 const dests=new Set(),out=[];
 for(const link of collectEdges()){
  if(link.origem!==idOf(t)||!model.screens[link.destino]||!compat(link.aplicaA,journey,state))continue;
  if(dests.has(link.destino))continue;
  dests.add(link.destino);out.push({destino:link.destino,rotulo:model.screens[link.destino].identidade.nome});
 }
 return out;
}
function journeyPanelRenderScreen(id){
 const screen=model.screens[id];if(!screen)return;
 const journey=journeyPanel.journey,state=journeyPanelState(screen),mounted=compile(screen,journey,state);
 journeyPanel.screen=id;
 $('journeyScreenTitle').textContent=screen.identidade.nome;
 $('journeyPreview').srcdoc=previewHTML(mounted,false);
 $('journeyMetadata').innerHTML=[['Tela',id],['Jornada',journeyName(journey)],['Subjornada',arr(screen.classificacao?.subjornadas).join(' / ')||'Geral'],['Estado',state],['Componentes',mounted.componentes.length],['Ações',mounted.acoes.length]].map(([k,v])=>'<span class="pill emph"><b>'+escapeHtml(k)+':</b> '+escapeHtml(v)+'</span>').join('')+(mounted.pendencias.length?'<span class="pill warn">'+mounted.pendencias.length+' pendência(s)</span>':'');
 const actions=journeyPanelActions(screen,journey,state);
 $('journeyRoutes').innerHTML=actions.length?'<span class="journey-routes-label">Destinos declarados nas ações e componentes da tela</span>'+actions.map(action=>'<button class="journey-route" type="button" data-journey-route="'+escapeHtml(action.destino)+'">'+escapeHtml(action.rotulo)+'</button>').join(''):'<span class="journey-routes-label">Sem saída para outra tela declarada neste estado.</span>';
 $('journeyRoutes').querySelectorAll('[data-journey-route]').forEach(button=>button.onclick=()=>{
  const target=model.screens[button.dataset.journeyRoute];
  if(target&&!screenSupportsJourney(target,journeyPanel.journey)){
   // A transição pode atravessar jornadas; ex.: seleção de perfil.
   journeyPanel.journey=applicableJourneys(target)[0]||journeyPanel.journey;
   journeyPanel.screen=button.dataset.journeyRoute;jornadasRender();
  }else journeyPanelRenderScreen(button.dataset.journeyRoute);
 });
 document.querySelectorAll('[data-journey-screen]').forEach(button=>button.classList.toggle('active',button.dataset.journeyScreen===id));
}
function jornadasRender(){
 const tabs=$('journeySubtabs'),list=$('journeyScreenList');if(!tabs||!list)return;
 const declarations=journeyCatalog();
 if(!declarations.length){tabs.innerHTML='';list.innerHTML='<div class="journey-no-screens">Cadastre uma jornada em classificacao.jornadas de qualquer tela para criar automaticamente sua aba.</div>';return;}
 if(!declarations.some(j=>j.id===journeyPanel.journey)){journeyPanel.journey=declarations[0].id;journeyPanel.screen='';}
 const journey=journeyPanel.journey;
 tabs.innerHTML=declarations.map(j=>'<button class="journey-subtab '+(j.id===journey?'active':'')+'" type="button" data-journey-tab="'+escapeHtml(j.id)+'">'+escapeHtml(j.nome)+' <small>('+allScreens().filter(s=>screenSupportsJourney(s,j.id)).length+')</small></button>').join('');
 tabs.querySelectorAll('[data-journey-tab]').forEach(button=>button.onclick=()=>{journeyPanel.journey=button.dataset.journeyTab;journeyPanel.screen='';jornadasRender();});
 const screens=allScreens().filter(screen=>screenSupportsJourney(screen,journey)).sort(screenJourneySort);
 $('journeyCatalogStatus').textContent=screens.length+' telas · '+allComponents().length+' componentes';
 if(!screens.length){list.innerHTML='<div class="journey-no-screens">Nenhuma tela desta jornada foi encontrada no catálogo.</div>';return;}
 let last='';list.innerHTML=screens.map(screen=>{
  const sub=arr(screen.classificacao?.subjornadas).join(' / ')||'geral';
  const header=sub!==last?'<div class="journey-group-label">'+escapeHtml(journeyName(sub))+'</div>':'';last=sub;
  return header+'<button class="journey-screen-option" type="button" data-journey-screen="'+escapeHtml(idOf(screen))+'"><strong>'+escapeHtml(screen.identidade.nome)+'</strong><small>'+escapeHtml(idOf(screen))+'</small></button>';
 }).join('');
 list.querySelectorAll('[data-journey-screen]').forEach(button=>button.onclick=()=>journeyPanelRenderScreen(button.dataset.journeyScreen));
 const selected=model.screens[journeyPanel.screen]&&screens.some(screen=>idOf(screen)===journeyPanel.screen)?journeyPanel.screen:idOf(screens.find(screen=>screen.flow?.editor?.entrypoint)||screens[0]);
 journeyPanelRenderScreen(selected);
}
