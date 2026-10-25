/* Motor de simulação - projetor independente somente-leitura da Store.
 * Não executa backend, lógica de negócios, condições legadas ou autenticação.
 */
const simState={screen:'',journey:'',state:'',scenario:'',actions:[],trace:[],tick:0};
function simOptions(id,options,preferred){
 const x=$(id);if(!x)return;
 x.innerHTML=options.map(y=>`<option value="${escapeHtml(y.id)}">${escapeHtml(y.title)}</option>`).join('');
 if(options.some(y=>y.id===preferred))x.value=preferred;
}
function simAvailableActions(t,journey,state){
 const list=[];
 for(const g of arr(t.acoes?.grupos))if(compat(g.aplicaA,journey,state))for(const a of arr(g.acoes)){
  if(compat(a.aplicaA,journey,state))list.push({id:a.id,title:((a.rotulo||a.evento||a.id)||'ação')+(a.destino?' → '+a.destino:''),data:a,kind:'action',group:g.id});
 }
 for(const i of arr(t.componentes?.instancias))if(compat(i.aplicaA,journey,state))for(const item of arr(i.props?.itens)){
  if(compat(item.aplicaA,journey,state))list.push({id:i.id+':'+item.id,title:'Menu: '+(item.nome||item.id)+(item.destino?' → '+item.destino:''),data:item,kind:'item',group:i.id});
 }
 return list;
}
function simScenarioScreen(t,scenario){
 const copy=deepClone(t);
 // Aplica apenas substituições declarativas a grupos de mocks existentes.
 for(const [path,val] of Object.entries(scenario?.sobrescrever||{})){
  const parts=path.split('.'),group=copy.mocks?.grupos?.[parts.shift()];
  if(!group || !parts.length || !obj(group.valor))continue;
  let cur=group.valor;
  while(parts.length>1){const name=parts.shift();if(!obj(cur[name]))cur[name]={};cur=cur[name];}
  cur[parts[0]]=deepClone(val);
 }
 return copy;
}
function simRender({retainAction=false}={}){
 if(!$('simScreen'))return;
 const current=simState.screen;
 const screens=allScreens();
 if(!screens.length){$('simStatus').textContent='Sem arquivos de tela na Store.';return;}
 simOptions('simScreen',screens.map(t=>({id:idOf(t),title:(t.identidade.nome||idOf(t))+' — '+idOf(t)})),current||'auth.inicializacao.splash');
 simState.screen=$('simScreen').value;
 const t=model.screens[simState.screen];if(!t)return;
 const journeys=applicableJourneys(t);
 simOptions('simJourney',journeys.map(x=>({id:x,title:journeyName(x)})),simState.journey||journeys[0]);
 simState.journey=$('simJourney').value;
 const states=arr(t.estados?.grupos);const opts=states.length?states.map(x=>({id:x.id,title:x.nome||x.id})):[{id:'padrao',title:'Padrão'}];
 simOptions('simState',opts,simState.state||t.estados?.fallbackSeguro);
 simState.state=$('simState').value;
 const scenarios=Object.entries(t.mocks?.cenarios||{}).map(([id,x])=>({id,title:id}));
 simOptions('simScenario',scenarios.length?scenarios:[{id:'sem_cenario',title:'Sem cenário configurado'}],simState.scenario);
 simState.scenario=$('simScenario').value;
 const actions=simAvailableActions(t,simState.journey,simState.state);simState.actions=actions;
 const prior=retainAction?$('simAction').value:'';
 simOptions('simAction',actions.length?actions.map(x=>({id:x.id,title:x.title})):[{id:'',title:'Não há ações para este estado'}],prior);
 $('simRun').disabled=!actions.length;
 try{
  const scenario=t.mocks?.cenarios?.[simState.scenario];
  const compiled=compile(simScenarioScreen(t,scenario),simState.journey,simState.state);
  compiled.cenario=deepClone(scenario||{});
  $('simPreview').srcdoc=previewHTML(compiled,false);
  $('simStatus').innerHTML='<b>Tela:</b> <code>'+escapeHtml(idOf(t))+'</code><br><b>Estado:</b> '+escapeHtml(simState.state)+' · <b>Jornada:</b> '+escapeHtml(simState.journey)+'<br><b>Mock:</b> '+escapeHtml(simState.scenario)+'<br><b>Ações listadas:</b> '+actions.length+'<br><b>Dados de cenário:</b> '+(scenario?'disponíveis':'não configurados')+'<br><b>Visuais:</b> '+arr(t.componentes?.instancias).length+' instâncias registradas.';
 }catch(e){$('simPreview').srcdoc='';$('simStatus').textContent='A tela não pôde ser montada: '+e.message;}
 simRenderLog();
}
function simRenderLog(){
 const box=$('simLog');
 box.innerHTML=simState.trace.length?simState.trace.slice(-35).reverse().map(t=>`<div class="sim-activity"><b>${escapeHtml(t.name)}</b><br><code>${escapeHtml(t.from)}</code> → <code>${escapeHtml(t.to||'(sem destino executável)')}</code><br><span class="muted">${escapeHtml(t.note)}</span></div>`).join(''):'<div class="empty">Nenhuma ação simulada. Escolha uma ação e veja o resultado aqui.</div>';
}
function simExecute(){
 const choice=simState.actions.find(x=>x.id===$('simAction').value);if(!choice)return;
 const a=choice.data;
 const dest=a.destino||a.seSucesso?.destino||arr(a.rotas).find(x=>x.destino)?.destino||'';
 let note='Projeção de caminho declarativo; nenhuma ação real foi executada.';
 if(a.quandoLegado!==undefined)note='Condição legada não avaliada. Destino apenas indicado.';
 if(a.comandoRef||a.tipo==='comando')note='Comando/backend NÃO executado; resultado não confirmado.';
 if(dest&&!model.screens[dest])note='Destino referenciado, mas ausente do catálogo: '+dest;
 const follow=!!dest&&!!model.screens[dest]&&!a.comandoRef&&a.quandoLegado===undefined;
 simState.trace.push({name:choice.title,from:simState.screen,to:dest,note});
 if(follow){simState.screen=dest;simState.state='';simState.journey='';simState.scenario='';}
 simRender();
}
function simWire(){
 $('simReset').onclick=()=>{simState.screen='auth.inicializacao.splash';simState.state='';simState.journey='';simState.scenario='';simState.trace=[];simRender();};
 $('simRun').onclick=simExecute;
 $('simScreen').onchange=()=>{simState.screen=$('simScreen').value;simState.state='';simState.journey='';simState.scenario='';simRender();};
 $('simJourney').onchange=()=>{simState.journey=$('simJourney').value;simState.state='';simState.scenario='';simRender();};
 $('simState').onchange=()=>{simState.state=$('simState').value;simRender();};
 $('simScenario').onchange=()=>{simState.scenario=$('simScenario').value;const scenario=model.screens[simState.screen]?.mocks?.cenarios?.[simState.scenario];if(scenario?.estadoRef)simState.state=scenario.estadoRef;simRender();};
}
