'use strict';
/* Projeção visual sem fonte paralela: blocos e setas são sempre recompostos
 * dos JSONs canônicos de tela e de suas ações/componentes. */
const mapaUi={edgeMode:'principal',selectedId:null,query:'',collapsed:new Set(),nodes:new Map(),screenNodes:new Map(),edges:[]};
// Nenhuma jornada cadastrada manualmente: grupos gerados dos JSONs atuais.
const mapaPalette=['#2d65a5','#118563','#8651c5','#bd7040','#a05d9d','#387986','#88632b'];
function mapaGroups(){return journeyCatalog().map((j,i)=>({id:j.id,keys:[j.id],name:j.nome,icon:j.nome.charAt(0),color:mapaPalette[i%mapaPalette.length],description:j.telas+' tela(s) próprias da jornada'}));}
const mapaCommon={id:'comum',name:'Entrada e identidade',icon:'01',color:'#547aab'};
const mapaEsc=value=>escapeHtml(String(value??''));
function mapaTitle(value){return String(value||'sem classificação').replace(/[_-]+/g,' ').replace(/\b\w/g,char=>char.toUpperCase());}
function mapaOrder(screen){return Number(screen.classificacao?.localizacaoArvore?.ordem??9999);}
function mapaSupports(screen,group){const journeys=arr(screen.classificacao?.jornadas);return group.id==='comum'?journeys.includes('*'):explicitJourneys(screen).includes(group.id);}
function mapaBuild(){
 mapaUi.nodes=new Map();mapaUi.screenNodes=new Map();
 for(const group of [mapaCommon,...mapaGroups()]){
  const bySegment=new Map();
  allScreens().filter(screen=>mapaSupports(screen,group)).forEach(screen=>{
   const segment=arr(screen.classificacao?.subjornadas)[0]||'geral';
   if(!bySegment.has(segment))bySegment.set(segment,[]);bySegment.get(segment).push(screen);
  });
  [...bySegment.entries()].sort(([a],[b])=>a.localeCompare(b,'pt-BR')).forEach(([segment,screens])=>{
   screens.sort((a,b)=>mapaOrder(a)-mapaOrder(b)||idOf(a).localeCompare(idOf(b)));
   const id='mapa-'+group.id+'-'+segment.replace(/[^a-z0-9]+/gi,'-').toLowerCase();
   const node={id,group:group.id,color:group.color,title:mapaTitle(segment),subtitle:group.id==='comum'?'Comum a todos':group.name+' · '+screens.length+' tela'+(screens.length===1?'':'s'),screens};
   mapaUi.nodes.set(id,node);screens.forEach(screen=>{const tid=idOf(screen);if(!mapaUi.screenNodes.has(tid)||normalizeJourneyId(screen.classificacao?.escopo)===group.id)mapaUi.screenNodes.set(tid,id);});
  });
 }
 const seen=new Set();mapaUi.edges=[];
 for(const edge of (typeof collectEdges==='function'?collectEdges():[])){
  if(!edge.resolvida)continue;const from=mapaUi.screenNodes.get(edge.origem),to=mapaUi.screenNodes.get(edge.destino);
  if(!from||!to||from===to||seen.has(from+'|'+to))continue;seen.add(from+'|'+to);
  mapaUi.edges.push({from,to,label:edge.tipo==='item_componente'?'Item de componente':edge.tipo==='rota_condicional'?'Rota condicional':'Ação declarada'});
 }
}
function mapaCard(node){
 const rows=node.screens.map(screen=>'<li><button data-map-screen="'+mapaEsc(idOf(screen))+'">'+mapaEsc(screen.identidade?.nome||idOf(screen))+'<small>'+mapaEsc(idOf(screen))+'</small></button></li>').join('');
 return '<article class="macro-card" data-map-node="'+mapaEsc(node.id)+'" style="--node-color:'+node.color+'"><button class="map-card-head" data-map-select="'+mapaEsc(node.id)+'"><span class="card-kicker"><span>'+mapaEsc(node.subtitle)+'</span><span class="detail-num">↗</span></span><strong>'+mapaEsc(node.title)+'</strong></button><ul>'+rows+'</ul></article>';
}
function mapaLane(group){
 const nodes=[...mapaUi.nodes.values()].filter(node=>node.group===group.id),collapsed=mapaUi.collapsed.has(group.id);
 return '<section class="macro-lane '+(collapsed?'collapsed':'')+'" style="--lane-color:'+group.color+'"><header class="lane-head"><div class="lane-name"><span class="lane-dot">'+group.icon+'</span><div><strong>'+mapaEsc(group.name)+'</strong><small>'+mapaEsc(group.description)+' · '+nodes.length+' blocos</small></div></div><div class="map-lane-actions"><button class="map-button" data-map-open-journey="'+group.id+'">Abrir jornadas ↗</button><button class="map-button" data-map-collapse="'+group.id+'">'+(collapsed?'Expandir +':'Recolher −')+'</button></div></header><div class="lane-cards">'+(nodes.length?nodes.map(mapaCard).join(''):'<p class="map-no-cards">Nenhuma tela desta jornada foi declarada no catálogo.</p>')+'</div></section>';
}
function mapaRender(){
 const root=$('mapCanvas');if(!root||!allScreens().length)return;mapaBuild();
 const common=[...mapaUi.nodes.values()].filter(node=>node.group==='comum');
 $('mapStatus').textContent=allScreens().length+' telas · '+mapaUi.edges.length+' conexões declaradas';
 root.innerHTML='<div class="map-tools"><div class="map-toggle"><button class="map-button '+(mapaUi.edgeMode==='principal'?'active':'')+'" data-map-edge="principal">Fluxo principal</button><button class="map-button '+(mapaUi.edgeMode==='todas'?'active':'')+'" data-map-edge="todas">Todas as conexões</button></div><input class="map-search" id="mapSearch" type="search" placeholder="Buscar tela, bloco ou ID…" value="'+mapaEsc(mapaUi.query)+'"></div><div class="map-frame" id="mapFrame" tabindex="0" aria-label="Fluxograma integrado do catálogo"><div class="map-board" id="mapBoard"><svg id="mapSvg" class="map-svg" aria-hidden="true"></svg><div class="map-content"><div class="flow-intro">01 · Entrada e identidade</div><div class="common-cards">'+(common.length?common.map(mapaCard).join(''):'<p class="map-no-cards">Sem telas comuns.</p>')+'</div><div class="flow-intro">02 · Perfis operacionais · blocos derivados das jornadas</div>'+mapaGroups().map(mapaLane).join('')+'</div></div></div><footer class="map-foot"><div class="legend-set"><span class="legend-item"><i style="--dot:#547aab"></i> comum</span>'+mapaGroups().map(j=>'<span class="legend-item"><i style="--dot:'+j.color+'"></i> '+mapaEsc(j.name)+'</span>').join('')+'</div><span>Clique numa tela para abrir sua jornada e sua prévia renderizada.</span></footer><aside class="map-detail" id="mapDetail">Selecione um bloco para destacar suas conexões.</aside>';
 mapaBind();mapaApplyFilter();requestAnimationFrame(mapaDrawEdges);
}
function mapaBind(){
 document.querySelectorAll('[data-map-edge]').forEach(button=>button.onclick=()=>{mapaUi.edgeMode=button.dataset.mapEdge;mapaRender();});
 document.querySelectorAll('[data-map-collapse]').forEach(button=>button.onclick=()=>{const id=button.dataset.mapCollapse;mapaUi.collapsed.has(id)?mapaUi.collapsed.delete(id):mapaUi.collapsed.add(id);mapaRender();});
 document.querySelectorAll('[data-map-select]').forEach(button=>button.onclick=()=>mapaSelect(button.dataset.mapSelect));
 document.querySelectorAll('[data-map-screen]').forEach(button=>button.onclick=()=>mapaOpenScreen(button.dataset.mapScreen));
 document.querySelectorAll('[data-map-open-journey]').forEach(button=>button.onclick=()=>{const group=mapaGroups().find(item=>item.id===button.dataset.mapOpenJourney);if(typeof journeyPanel!=='undefined'&&group){journeyPanel.journey=group.id;journeyPanel.screen='';switchTab('jornadas');jornadasRender();}});
 const search=$('mapSearch');if(search)search.oninput=()=>{mapaUi.query=search.value;mapaApplyFilter();};
}
function mapaOpenScreen(id){const screen=model.screens[id];if(!screen)return;const journey=applicableJourneys(screen)[0];if(typeof journeyPanel!=='undefined'&&journey){journeyPanel.journey=journey;journeyPanel.screen=id;switchTab('jornadas');jornadasRender();}}
function mapaSelect(id){
 mapaUi.selectedId=mapaUi.selectedId===id?null:id;document.querySelectorAll('[data-map-node]').forEach(card=>card.classList.toggle('selected',card.dataset.mapNode===mapaUi.selectedId));
 const node=mapaUi.nodes.get(mapaUi.selectedId),detail=$('mapDetail');if(detail)detail.innerHTML=node?'<strong>'+mapaEsc(node.title)+'</strong><span>'+node.screens.length+' telas · '+mapaUi.edges.filter(edge=>edge.from===node.id||edge.to===node.id).length+' conexões</span>':'Selecione um bloco para destacar suas conexões.';mapaDrawEdges();
}
function mapaApplyFilter(){const query=mapaUi.query.trim().toLocaleLowerCase('pt-BR');document.querySelectorAll('[data-map-node]').forEach(card=>{const hit=!query||card.textContent.toLocaleLowerCase('pt-BR').includes(query);card.classList.toggle('dimmed',!hit);card.classList.toggle('match',!!query&&hit);});}
function mapaAnchor(id){const card=document.querySelector('[data-map-node="'+CSS.escape(id)+'"]'),board=$('mapBoard');if(!card||!board||card.closest('.collapsed'))return null;const rect=card.getBoundingClientRect(),base=board.getBoundingClientRect();return {x:rect.left-base.left+rect.width/2,y:rect.top-base.top+rect.height/2,w:rect.width,h:rect.height};}
function mapaDrawEdges(){
 const board=$('mapBoard'),svg=$('mapSvg');if(!board||!svg)return;const width=board.offsetWidth,height=board.offsetHeight;svg.setAttribute('viewBox','0 0 '+width+' '+height);svg.setAttribute('width',width);svg.setAttribute('height',height);
 const defs='<defs><marker id="map-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#8398b0"/></marker><marker id="map-focus" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#dc902b"/></marker></defs>',out=[];
 for(const edge of mapaUi.edges){const a=mapaAnchor(edge.from),b=mapaAnchor(edge.to);if(!a||!b)continue;const aNode=mapaUi.nodes.get(edge.from),bNode=mapaUi.nodes.get(edge.to),transverse=aNode.group!==bNode.group,focus=edge.from===mapaUi.selectedId||edge.to===mapaUi.selectedId;if(mapaUi.edgeMode==='principal'&&transverse&&!focus)continue;const x1=a.x,y1=a.y+a.h/2,x2=b.x,y2=b.y-b.h/2,mid=(y1+y2)/2;out.push('<path class="edge '+(transverse?'transverse ':'')+(focus?'focus ':'')+(mapaUi.selectedId&&!focus?'fade':'')+'" d="M '+x1+' '+y1+' V '+mid+' H '+x2+' V '+y2+'" marker-end="url(#'+(focus?'map-focus':'map-arrow')+')"><title>'+mapaEsc(edge.label)+'</title></path>');}
 svg.innerHTML=defs+out.join('');
}
window.addEventListener('resize',()=>{if($('view-mapa')?.classList.contains('active'))requestAnimationFrame(mapaDrawEdges);});
