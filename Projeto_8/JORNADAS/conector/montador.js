/* Adaptador: o front de Jornadas apresenta os contratos modulares sem reintroduzir os arquivos antigos. */
(async()=>{
 'use strict';
 const status=document.getElementById('count');
 const fail=e=>{status.textContent='Falha no carregamento: '+e;status.style.color='#a22d2d';console.error(e)};
 const voids=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
 async function readJson(path){const r=await fetch(path,{cache:'no-cache'});if(!r.ok)throw Error(path+': HTTP '+r.status);return r.json()}
 function renderMarkup(tree){
   const children=new Map();
   for(const [id,node] of Object.entries(tree?.elementos||{})){
     const parent=node.paiRef||'ROOT';if(!children.has(parent))children.set(parent,[]);
     children.get(parent).push({id,...node});
   }
   for(const list of children.values())list.sort((a,b)=>a.ordem-b.ordem);
   function visit(n){
     if(n.tag==='#text')return n.texto||'';
     if(n.tag==='#comment')return '<!--'+(n.texto||'')+'-->';
     if(n.tag==='#declaration')return '<'+(n.texto||'')+'>';
     if(n.tag==='#literal')return n.texto||'';
     const attrs=Object.entries(n.atributos||{}).map(([k,v])=>' '+k+'="'+String(v).replace(/"/g,'&quot;')+'"').join('');
     const open='<'+n.tag+attrs+'>';
     return voids.has(n.tag.toLowerCase())?open:open+(children.get(n.id)||[]).map(visit).join('')+'</'+n.tag+'>';
   }
   return (children.get('ROOT')||[]).map(visit).join('');
 }
 function adaptarTela(raw,expectedId){
   if(raw?.identidade?.id)return raw; /* compatibilidade de importação antiga */
   if(!raw||typeof raw!=='object')throw Error('Tela inválida');
   const pairs=Object.entries(raw).filter(([id,obj])=>obj&&obj.tela&&obj.componentes);
   if(pairs.length!==1)throw Error('O arquivo deve conter uma única tela modular');
   const [id,doc]=pairs[0];if(expectedId&&id!==expectedId)throw Error('ID divergente: '+id);
   const t=doc.tela,components=doc.componentes;
   if(!t.estrutura?.html?.composicao)throw Error('Composição inexistente: '+id);
   const instances=Object.entries(t.estrutura.html.composicao).sort((a,b)=>(a[1].ordem||0)-(b[1].ordem||0));
   const markup=[],css=[];
   for(const [inst,place] of instances){
     const component=components[place.componenteRef];if(!component)throw Error('Componente não encontrado: '+id+' / '+place.componenteRef);
     markup.push(renderMarkup(component.estrutura?.html));
     css.push(...Object.values(component.estrutura?.css?.regras||{}));
   }
   css.push(...Object.values(t.estrutura?.css?.regras||{}));
   const view={
     schema:t.schema,identidade:{id,nome:t.identidade?.nomeExibicao||t.identidade?.nome||id},
     classificacao:t.classificacao,navegacao:{participacoes:t.classificacao?.jornadas||[],relacoes:t.navegacao?.relacoes||[]},
     estrutura:{base:{html:markup.join('')}},estilos:{base:{css:css.join('\n')}},
     componentes:t.componentes,acoes:t.acoes,estados:t.estados,dados:t.dados,variantes:t.variantes,
     mocks:t.mocks,origemExtracao:t.proveniencia?.origemExtracao||{}
   };
   Object.defineProperty(view,'__canonical',{value:raw,enumerable:false});
   return view;
 }
 window.__JORNADAS_ADAPTAR_TELA__=adaptarTela;
 try{
   const manifest=await readJson('dados/manifest.json');
   if(!Array.isArray(manifest.telas))throw Error('Manifesto sem telas');
   const seen=new Set();
   for(const t of manifest.telas){
     if(!t.id||!/^telas\/[a-z0-9_./-]+\.json$/i.test(t.arquivo)||t.arquivo.includes('..')||seen.has(t.id))throw Error('Referência de tela inválida: '+t.id);
     seen.add(t.id);
   }
   const telas=await Promise.all(manifest.telas.map(async t=>adaptarTela(await readJson(t.arquivo),t.id)));
   window.__JORNADAS_SOURCE__={schema:manifest.pacoteSchema,origem:manifest.origem,fluxoFonte:manifest.fluxoFonte,telas};
   const script=document.createElement('script');script.src='visualizador/app.js';script.onerror=()=>fail('Não foi possível carregar o visualizador.');
   document.body.appendChild(script);
 }catch(e){fail(e.message+(location.protocol==='file:'?' — abra por servidor HTTP local.':''));}
})();
