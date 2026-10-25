function resolvedProps(inst,t,jornada,estado){const props={};for(const [key,val] of Object.entries(inst.props||{})){
  if(key.endsWith('Ref')&&typeof val==='string'){
   const mapped={dadosRef:'dados',textosRef:'textos',rotulosRef:'rotulos',perfilRef:'perfil',rodapeRef:'rodape',disponibilidadeRef:'disponibilidade'}[key]||key.slice(0,-3);
   props[mapped]=deepClone(valueAt(t,val)??{});
  }else if(key==='itens')props.itens=arr(val).filter(x=>compat(x.aplicaA,jornada,estado)).map(deepClone);
  else if(key==='mostrarDisponibilidade'&&obj(val))props.mostrarDisponibilidade=compat(val.quando,jornada,estado);
  else props[key]=deepClone(val);
 }
 return props;
}
function compile(t,jornada,estado){
 const sid=idOf(t),groups=arr(t.estrutura?.grupos).filter(g=>compat(g.aplicaA,jornada,estado));
 const instMap=new Map(arr(t.componentes?.instancias).map(x=>[x.id,x]));
 const resolvedGroups=[],resolvedInstances=[],cache=new Set(),missing=[];
 for(const g of groups.sort((a,b)=>(a.ordem||0)-(b.ordem||0))){const ids=[];
  for(const iid of arr(g.instancias)){const inst=instMap.get(iid);if(!inst) {missing.push('Instância ausente: '+iid);continue;}
   if(!compat(inst.aplicaA,jornada,estado))continue;
   const cmp=model.components[inst.ref];if(!cmp){missing.push('Componente ausente: '+inst.ref);continue;}
   ids.push(iid);
   if(!cache.has(iid)){cache.add(iid);resolvedInstances.push({id:inst.id,componenteRef:inst.ref,slot:inst.slot,ordem:inst.ordem||0,props:resolvedProps(inst,t,jornada,estado),html:deepClone(cmp.estrutura?.arvore||[]),css:cmp.estilos?.css||''});}
  }
  resolvedGroups.push({id:g.id,slot:g.slot,ordem:g.ordem,instancias:ids});
 }
 const styles=arr(t.estilos?.grupos).filter(x=>compat(x.aplicaA,jornada,estado));
 const actions=arr(t.acoes?.grupos).filter(x=>compat(x.aplicaA,jornada,estado)).flatMap(g=>arr(g.acoes).filter(a=>compat(a.aplicaA,jornada,estado)).map(a=>({...a,grupoRef:g.id})));
 const data=Object.fromEntries(Object.entries(t.dados?.grupos||{}).filter(([,g])=>compat(g.aplicaA,jornada,estado)));
 const mocks=Object.fromEntries(Object.entries(t.mocks?.grupos||{}).filter(([,g])=>compat(g.aplicaA,jornada,estado)));
 const edges=collectEdges().filter(e=>e.origem===sid&&compat(e.aplicaA,jornada,estado));
 return {telaId:sid,jornada,estado,htmlBase:t.estrutura?.base?.html||'',tema:t.estilos?.tema||{},grupos:resolvedGroups,componentes:resolvedInstances,estilos:styles,dados:data,mocks,cenario:t.mocks?.cenarios?.[estado]||{},acoes:actions,saidasFlow:edges,entradasFlow:collectEdges().filter(e=>e.destino===sid),pendencias:missing};
}
// Todo componente é renderizado a partir do mesmo contrato `estrutura.arvore`.
// A lista cobre os controles e SVGs das jornadas, além dos componentes já nativos.
const allowedTags=new Set('a article aside b blockquote br button canvas caption circle code dd details div dl dt ellipse em fieldset figcaption figure footer form g h1 h2 h3 h4 h5 h6 header hr i img input label legend li line main nav ol option p path picture polygon polyline pre rect section select small source span strong summary svg table tbody td textarea tfoot th thead time tr u ul video'.split(' '));
const voidTags=new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
function safeStyle(value){return String(value||'').replace(/(?:expression\s*\(|@import|url\s*\()/gi,'').replace(/[<>]/g,'');}
function getFromCtx(ctx,path){return valueAt(ctx,path);}
function renderV(v,ctx){if(v==null)return '';if(typeof v==='string'||typeof v==='number'||typeof v==='boolean')return escapeHtml(v);if(Array.isArray(v))return v.map(x=>renderV(x,ctx)).join('');if(obj(v)){
 if(v.ref){const val=getFromCtx(ctx,v.ref);return renderV(val===undefined?'':val,ctx);}
 if(v.partes)return arr(v.partes).map(x=>renderV(x,ctx)).join('');
 if(!v.tag)return '';
 const tag=String(v.tag).toLowerCase();if(!allowedTags.has(tag))return '';
 if(v.aplicaA?.propsVerdadeiras?.some(p=>!getFromCtx(ctx,'props.'+p)))return '';
 let attrs='';for(const [k,val] of Object.entries(v.atributos||{})){
  const key=k.toLowerCase();if(key.startsWith('on')||!(/^(class|id|type|name|value|placeholder|for|href|src|alt|role|title|tabindex|style|checked|selected|disabled|readonly|required|multiple|autocomplete|min|max|step|minlength|maxlength|rows|cols|colspan|rowspan|scope|target|rel|action|method|enctype|poster|controls|loop|muted|autoplay|aria-[a-z\-]+|data-[a-z\-]+|viewbox|fill|stroke|stroke-width|stroke-linecap|stroke-linejoin|d|cx|cy|r|x|y|x1|x2|y1|y2|points|preserveaspectratio|xmlns|width|height)$/.test(key)))continue;
  let vv=obj(val)&&val.ref?getFromCtx(ctx,val.ref):val;
  if(vv==null||typeof vv==='object')continue;
  vv=String(vv);if(key==='style')vv=safeStyle(vv);if((key==='src'||key==='href')&&!(/^(data:image\/(svg\+xml|png|jpeg|webp);base64,|#|\/|https:\/\/)/i.test(vv)))continue;
  attrs+=' '+key+'="'+escapeHtml(vv)+'"';
 }
 let content=arr(v.filhos).map(x=>renderV(x,ctx)).join('');
 if(v.repetir){let list=getFromCtx(ctx,v.repetir.colecaoRef);content+=arr(list).map(item=>renderV(v.repetir.elemento,{...ctx,item})).join('');}
 return '<'+tag+attrs+'>'+(voidTags.has(tag)?'':content+'</'+tag+'>');
 }return '';
}
function previewRuntime(){return `<script>(function(){const close=(d)=>d&&d.remove();document.addEventListener('click',function(e){const el=e.target.closest('[data-goto],[data-action],[data-destino]');if(!el)return;e.preventDefault();const destino=el.getAttribute('data-goto')||el.getAttribute('data-action')||el.getAttribute('data-destino')||'ação';close(document.querySelector('[data-preview-route]'));const box=document.createElement('div');box.setAttribute('data-preview-route','');box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.style.cssText='position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:24px;background:#10233fa8';box.innerHTML='<div style="width:min(100%,420px);padding:22px;border-radius:16px;background:#fff;color:#172033;box-shadow:0 18px 46px #0005"><strong style="display:block;margin-bottom:8px">Navegação simulada</strong><span style="display:block;margin-bottom:16px">Esta interação aponta para: <code></code></span><button type="button">Fechar</button></div>';box.querySelector('code').textContent=destino;box.querySelector('button').onclick=()=>close(box);box.onclick=(event)=>{if(event.target===box)close(box)};document.body.appendChild(box);});}())<\/script>`;}
function previewHTML(m,drawer){let html=m.htmlBase||'<main data-slot="main"></main>';if(!html.includes('data-slot'))html='<main data-slot="main">'+html+'</main>';
 // A origem é a própria definição de tela; os componentes são renderizados de árvores de elementos.
 const temp=document.createElement('div');temp.innerHTML=html;
 for(const g of m.grupos){const area=temp.querySelector('[data-slot="'+CSS.escape(g.slot)+'"]');if(!area)continue;
  for(const id of g.instancias){const c=m.componentes.find(x=>x.id===id);if(!c)continue;const markup=renderV(c.html,{props:c.props});area.insertAdjacentHTML('beforeend',markup);}
 }
 const vars=Object.entries(m.tema||{}).filter(([k])=>/^--[a-z0-9-]+$/i.test(k)).map(([k,v])=>`${k}:${String(v).replace(/[{};]/g,'')};`).join('');
 const css=`:root{${vars}}`+m.estilos.map(s=>s.css||'').join('\n')+'\n'+m.componentes.map(c=>c.css||'').join('\n')+`\n${drawer?'.prototype-drawer{display:block!important}.prototype-drawer[aria-hidden]{visibility:visible!important}':''}\nbody{margin:0;min-height:100dvh}`;
 const markup=temp.innerHTML;
 const cleaned=markup.replace(/<script\b[\s\S]*?<\/script>/gi,'');
 return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>'+css.replace(/<\/style/gi,'<\\/style')+'</style></head><body>'+cleaned+previewRuntime()+'</body></html>';
}
function renderMount(){const t=model.screens[ui.screen];if(!t){$('resolvedJson').value='{}';$('mountStats').innerHTML='';$('preview').srcdoc='';return;}
 lastMount=compile(t,ui.journey,ui.state);$('resolvedJson').value=JSON.stringify(lastMount,null,2);
 $('preview').srcdoc=previewHTML(lastMount,ui.drawer);
 $('mountStats').innerHTML=`<span class="pill emph">${lastMount.componentes.length} componentes montados</span><span class="pill">${lastMount.grupos.length} grupos HTML</span><span class="pill">${lastMount.acoes.length} ações</span><span class="pill">${lastMount.saidasFlow.length} saídas Flow</span><span class="pill ${lastMount.pendencias.length?'warn':'ok'}">${lastMount.pendencias.length} referências ausentes</span>`;
}
