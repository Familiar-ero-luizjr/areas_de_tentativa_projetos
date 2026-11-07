'use strict';
const DEFAULT_HOME=window.__CONTRACT_DATA.DEFAULT_HOME;;
const DEFAULT_SCHEMA=window.__CONTRACT_DATA.DEFAULT_SCHEMA;;
const DEFAULT_GLOSSARY=window.__CONTRACT_DATA.DEFAULT_GLOSSARY;;
const DEFAULT_DOCUMENT=window.__CONTRACT_DATA.DEFAULT_DOCUMENT;;
const clone=x=>JSON.parse(JSON.stringify(x));
const isObj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
let home=clone(DEFAULT_HOME),schema=clone(DEFAULT_SCHEMA),help=clone(DEFAULT_GLOSSARY.campos),documentacao=clone(DEFAULT_DOCUMENT),active=0,importMode='estrutura';
const names={object:'objeto',array:'lista',string:'texto',number:'número',boolean:'booleano',null:'não especificado',mixed:'múltiplos tipos'};
const E=(tag,cl,txt)=>{const x=document.createElement(tag);if(cl)x.className=cl;if(txt!==undefined)x.textContent=txt;return x};
function merge(a,b){
 if(!a)return clone(b);if(!b)return clone(a);
 if(a.kind==='null'&&b.kind!=='null')return{...clone(b),nullable:true};
 if(b.kind==='null'&&a.kind!=='null')return{...clone(a),nullable:true};
 if(a.kind!==b.kind)return{kind:'mixed',types:[...new Set([...(a.types||[a.kind]),...(b.types||[b.kind])])]};
 if(a.kind==='object'){const out=clone(a);for(const[k,v]of Object.entries(b.children||{}))out.children[k]=merge(out.children[k],v);return out}
 if(a.kind==='array')return{kind:'array',item:merge(a.item,b.item)};
 return{...clone(a),nullable:!!(a.nullable||b.nullable)};
}
function shape(x){
 if(Array.isArray(x)){let item=null;for(const v of x)item=merge(item,shape(v));return{kind:'array',item}}
 if(isObj(x))return{kind:'object',children:Object.fromEntries(Object.entries(x).map(([k,v])=>[k,shape(v)]))};
 if(x===null)return{kind:'null'};
 return{kind:typeof x==='number'?'number':typeof x==='boolean'?'boolean':'string'};
}
function strip(s){if(s.kind==='object')return Object.fromEntries(Object.entries(s.children).map(([k,v])=>[k,strip(v)]));if(s.kind==='array')return s.item?[strip(s.item)]:[];return null}
function note(path){return help[path]||{resumo:'Campo encontrado no JSON importado; explicação ainda não cadastrada.',detalhes:'Esta chave foi incorporada pela importação. Seu significado, tipo e obrigatoriedade precisam de análise antes de integrar um contrato homologado.',situacao:'novo_campo_importado'}}
const dlg=document.getElementById('help-dialog');
function showHelp(path){const d=note(path);document.getElementById('field-title').textContent=path.split('.').at(-1)||path;document.getElementById('field-path').textContent=path;document.getElementById('field-description').textContent=d.detalhes;document.getElementById('field-note').textContent='Situação: '+(d.situacao==='modelo_em_avaliacao'?'modelo de trabalho, não homologado':'campo a detalhar');dlg.showModal()}
document.getElementById('close-help').addEventListener('click',()=>dlg.close());dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
function explain(parent,path){const x=note(path);parent.append(E('span','field-comment','— '+x.resumo));const b=E('button','help-btn','i');b.type='button';b.title='Ver explicação: '+path;b.setAttribute('aria-label','Explicação do campo '+path);b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();showHelp(path)});b.addEventListener('keydown',e=>e.stopPropagation());parent.append(b)}
function branch(key,desc,depth,model,path){
 const d=E('details',depth===0?'root':'branch');d.open=depth<=1;
 const sm=E('summary');sm.append(E('span',key.startsWith('[')?'index':'key',key));sm.append(E('span','count',desc));
 if(model)explain(sm,path);d.append(sm);const ch=E('div','children');d.append(ch);return{d,ch};
}
function treeSchema(key,node,depth,path){
 if(node.kind==='object'){
  const arr=Object.keys(node.children);const {d,ch}=branch(key,'{ '+arr.length+' campos }',depth,true,path);
  if(!arr.length)ch.append(E('div','undefined','Sem estrutura interna definida no contrato atual.'));
  else for(const n of arr)ch.append(treeSchema(n,node.children[n],depth+1,path+'.'+n));
  return d;
 }
 if(node.kind==='array'){
  const {d,ch}=branch(key,node.item?'[ item ]':'[ formato pendente ]',depth,true,path);
  if(node.item)ch.append(treeSchema('[item]',node.item,depth+1,path+'[]'));
  else ch.append(E('div','undefined','Formato interno dos itens ainda não definido.'));
  return d;
 }
 const row=E('div','leaf');row.append(E('span',key.startsWith('[')?'index':'key',key));row.append(E('span','type',(names[node.kind]||node.kind)+(node.nullable?' · permite nulo':'')));explain(row,path);return row;
}
function treeData(key,val,depth){
 if(Array.isArray(val)){
  const {d,ch}=branch(key,val.length+' '+(val.length===1?'item':'itens'),depth,false);
  val.forEach((it,i)=>ch.append(treeData('['+i+']',it,depth+1)));if(!val.length)ch.append(E('div','undefined','[ ]'));return d;
 }
 if(isObj(val)){
  const keys=Object.keys(val);const {d,ch}=branch(key,key.startsWith('[')&&val.id?String(val.id):'{ '+keys.length+' campos }',depth,false);
  if(!keys.length)ch.append(E('div','undefined','{ }'));else for(const k of keys)ch.append(treeData(k,val[k],depth+1));return d;
 }
 const typ=val===null?'null':typeof val==='boolean'?'boolean':typeof val==='number'?'number':'string';
 const row=E('div','leaf');row.append(E('span',key.startsWith('[')?'index':'key',key));row.append(E('span','value '+typ,typ==='string'?JSON.stringify(val):String(val)));return row;
}
function countFields(s){if(!s)return 0;if(s.kind==='object')return Object.values(s.children).reduce((n,v)=>n+1+countFields(v),0);if(s.kind==='array')return countFields(s.item);return 0}
function refreshTrees(){
 document.getElementById('tree-estrutura').replaceChildren(treeSchema('contrato',schema,0,'contrato'));
 document.getElementById('tree-home').replaceChildren(treeData('contrato',home,0));
 document.getElementById('count-estrutura').textContent='Contrato modular completo · '+countFields(schema)+' campos · comentários e detalhes por campo';
 const roots=Object.keys(home),one=home[roots[0]]||{},nav=one.tela?.navegacao||{};
 document.getElementById('count-home').textContent='JSON integral · '+roots.length+' tela(s) · '+Object.keys(one.componentes||{}).length+' componentes · '+(nav.relacoes?.length??0)+' relações';
}
function inline(tokens){const frag=document.createDocumentFragment();for(const t of tokens||[]){
 if(t.tipo==='texto'){frag.append(document.createTextNode(t.texto||''));continue}
 if(t.tipo==='quebra'){frag.append(document.createElement('br'));continue}
 const tag={codigo:'code',negrito:'strong',italico:'em',riscado:'s',link:'a'}[t.tipo];if(!tag){frag.append(document.createTextNode(t.texto||''));continue}
 const el=E(tag);if(t.tipo==='codigo')el.textContent=t.texto||'';else el.append(inline(t.conteudo||[]));
 if(t.tipo==='link'&&/^https?:\/\//i.test(t.url||'')){el.href=t.url;el.target='_blank';el.rel='noopener noreferrer'}
 frag.append(el);
 }return frag}
function renderBlock(b){
 if(b.tipo==='paragrafo'){const p=E('p','doc-p');p.append(inline(b.conteudo));return p}
 if(b.tipo==='codigo'){const shell=E('div','code-shell'),head=E('div','code-head',(b.linguagem||'texto').toUpperCase());const pre=E('pre','doc-pre',b.conteudo||'');shell.append(head,pre);return shell}
 if(b.tipo==='tabela'){
  const w=E('div','doc-table-wrap'),tab=E('table','doc-table'),thead=E('thead'),tr=E('tr');
  (b.colunas||[]).forEach(c=>{const th=E('th');th.append(inline(c));tr.append(th)});thead.append(tr);tab.append(thead);const body=E('tbody');
  (b.linhas||[]).forEach(r=>{const tr=E('tr');r.forEach(c=>{const td=E('td');td.append(inline(c));tr.append(td)});body.append(tr)});tab.append(body);w.append(tab);return w;
 }
 if(b.tipo==='lista'){const li=E(b.ordenada?'ol':'ul','doc-list');for(const item of b.itens||[]){const row=E('li');for(const ch of item)row.append(renderBlock(ch));li.append(row)}return li}
 if(b.tipo==='destaque'){const c=E('aside','doc-note');for(const ch of b.blocos||[])c.append(renderBlock(ch));return c}
 if(b.tipo==='divisor')return E('hr','doc-rule');
 const el=E('p','doc-p','Tipo de bloco não reconhecido');return el;
}
function validateDoc(d){return isObj(d)&&isObj(d.documento)&&typeof d.documento.titulo==='string'&&Array.isArray(d.secoes)&&d.secoes.every(s=>typeof s.titulo==='string'&&Array.isArray(s.subsecoes)&&s.subsecoes.every(g=>typeof g.titulo==='string'&&Array.isArray(g.blocos)))}
function renderDocument(){
 const slot=document.getElementById('documentacao');slot.replaceChildren();
 const shell=E('div','doc'),aside=E('nav','doc-index'),heading=E('h3',null,'Índice das seções'),links=E('div','index-links');
 aside.setAttribute('aria-label','Índice da documentação');aside.append(heading,links);
 const article=E('article','doc-main'),cover=E('header','doc-cover');cover.append(E('h2',null,documentacao.documento.titulo));cover.append(E('p',null,'Fonte: '+(documentacao.documento.fonteArquivo||'JSON importado')+' · Contrato em construção'));
 for(const p of documentacao.apresentacao||[])cover.append(renderBlock(p));article.append(cover);
 (documentacao.secoes||[]).forEach((s,i)=>{
  const id='documento-secao-'+String(i+1).padStart(2,'0'),a=E('a',null,(s.numero||i+1)+'. '+s.titulo);a.href='#'+id;
  a.addEventListener('click',e=>{e.preventDefault();document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})});links.append(a);
  const sec=E('section','doc-part');sec.id=id;const h=E('header');h.append(E('h3',null,(s.numero||i+1)+'. '+s.titulo));sec.append(h);
  for(const g of s.subsecoes||[]){const sub=E('section','subsection');sub.append(E('h4',null,g.titulo));for(const b of g.blocos||[])sub.append(renderBlock(b));sec.append(sub)}article.append(sec);
 });shell.append(aside,article);slot.append(shell);
 document.getElementById('count-doc').textContent='Documentação estruturada · '+documentacao.secoes.length+' seções · '+documentacao.secoes.reduce((n,s)=>n+s.subsecoes.length,0)+' subseções · sem Markdown em tempo de execução';
}
const tabs=[...document.querySelectorAll('[role="tab"]')];
function activate(i,focus=false){active=i;tabs.forEach((t,j)=>{t.setAttribute('aria-selected',i===j?'true':'false');t.tabIndex=i===j?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=i!==j});if(focus)tabs[i].focus()}
tabs.forEach((t,i)=>{t.addEventListener('click',()=>activate(i));t.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();activate((i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length,true)}})});
function notify(mode,msg,bad=false){const e=document.getElementById('msg-'+mode);e.textContent=msg;e.className='status '+(bad?'err':'ok');e.hidden=false}
function getContrato(obj){
 if(!isObj(obj))throw Error('JSON inválido: esperado objeto.');
 if(isObj(obj.tela)&&isObj(obj.componentes))return {'advogado.home':obj};
 const ent=Object.entries(obj);
 if(!ent.length||!ent.some(([k,v])=>isObj(v)&&isObj(v.tela)&&isObj(v.componentes)))
   throw Error('Esperado JSON completo: { "id.da.tela": { "tela": {}, "componentes": {} } }.');
 return obj;
}
// Preserva o conceito de chaves dinâmicas também para estruturas importadas.
function normalizeModelo(obj){
 const ent=Object.entries(obj||{}).filter(([k,v])=>isObj(v)&&isObj(v.tela)&&isObj(v.componentes));
 if(!ent.length) return obj;
 let output={};
 for(const [screenId,v] of ent)output['<telaId>']=mergeExemplo(output['<telaId>'],normalizeParte(v,['<telaId>']));
 return output;
}
function mergeExemplo(a,b){
 if(a===undefined)return b;
 if(!isObj(a)||!isObj(b))return a;
 const o={...a};for(const [k,v] of Object.entries(b))o[k]=mergeExemplo(o[k],v);return o;
}
const mapaChaves={
 '<telaId>.componentes':'<componenteId>',
 '<telaId>.tela.componentes.instanciasRefs':'<instanciaId>',
 '<telaId>.tela.estrutura.html.composicao':'<instanciaId>',
 '<telaId>.tela.estrutura.css.tokens':'<tokenCSS>',
 '<telaId>.tela.estrutura.css.regras':'<regraId>',
 '<telaId>.componentes.<componenteId>.estrutura.html.elementos':'<elementoId>',
 '<telaId>.componentes.<componenteId>.estrutura.css.regras':'<regraId>',
 '<telaId>.componentes.<componenteId>.estrutura.html.elementos.<elementoId>.atributos':'<atributoHTML>'
};
function normalizeParte(obj,path){
 if(Array.isArray(obj))return obj.map(v=>normalizeParte(v,[...path,'[]']));
 if(!isObj(obj))return obj;
 const dynamic=mapaChaves[path.join('.')];
 if(dynamic){let combined;for(const val of Object.values(obj))combined=mergeExemplo(combined,normalizeParte(val,[...path,dynamic]));
  return combined===undefined?{}:{[dynamic]:combined};}
 return Object.fromEntries(Object.entries(obj).map(([k,v])=>[k,normalizeParte(v,[...path,k])]));
}
function download(name,obj){const blob=new Blob([JSON.stringify(obj,null,2)+'\n'],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200)}
function exportTab(mode){
 if(mode==='doc') download('advogadoja_documentacao_estruturada.json',documentacao);
 else download(mode==='estrutura'?'advogadoja_contrato_completo_modelo_sem_dados.json':'advogadoja_home_advogado_completa.json',
       mode==='estrutura'?strip(schema):home);
 notify(mode,'JSON exportado com sucesso.');
}
const input=document.getElementById('json-file');
async function importTab(file,mode){try{
 const parsed=JSON.parse((await file.text()).replace(/^\uFEFF/,''));
 if(mode==='doc'){
  if(!validateDoc(parsed))throw Error('Documento inválido. Esperado: documento e secoes[].subsecoes[].blocos[].');
  documentacao=clone(parsed);renderDocument();notify(mode,'Documentação importada. Seções atualizadas.');
 } else if(mode==='estrutura'){
  if(parsed.kind==='object'&&parsed.children) schema=merge(schema,parsed);
  else {const s=shape(normalizeModelo(getContrato(parsed)));schema=merge(schema,s);}
  refreshTrees();notify(mode,'Modelo completo importado, sem copiar valores. Comentários preservados.');
 } else {
  home=clone(getContrato(parsed));schema=merge(schema,shape(normalizeModelo(home)));
  refreshTrees();notify(mode,'Home completa importada. Modelo atualizado com eventuais campos novos.');
 }
}catch(e){notify(mode,'Falha na importação: '+e.message,true)}}
input.addEventListener('change',async()=>{const f=input.files?.[0];if(f)await importTab(f,importMode);input.value=''});
document.querySelectorAll('.panel').forEach(p=>{const mode=p.id==='p-estrutura'?'estrutura':p.id==='p-home'?'home':'doc';p.querySelectorAll('[data-op]').forEach(b=>b.addEventListener('click',()=>{
 const op=b.dataset.op;if(op==='import'){importMode=mode;input.click();return}if(op==='export'){exportTab(mode);return}
 const expand=op==='expand';p.querySelectorAll('.tree details').forEach(d=>d.open=expand);
 if(!expand){const root=p.querySelector('.tree>details');if(root)root.open=true}
}))});
refreshTrees();renderDocument();
