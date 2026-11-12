'use strict';
const MODE=document.documentElement.dataset.module;
const clone=x=>JSON.parse(JSON.stringify(x));
const isObj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
let home={}, schema={kind:'object', children:{}}, help={}, glossario={documento:{}, campos:{}}, documentacao={documento:{titulo:'Documentação'},secoes:[]};
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
 if(MODE==='estrutura'){
  document.getElementById('tree-estrutura').replaceChildren(treeSchema('contrato',schema,0,'contrato'));
  document.getElementById('count-estrutura').textContent='Contrato modular completo · '+countFields(schema)+' campos · comentários e detalhes por campo';
 }
 if(MODE==='home'){
  document.getElementById('tree-home').replaceChildren(treeData('contrato',home,0));
  const roots=Object.keys(home),one=home[roots[0]]||{},nav=one.tela?.navegacao||{};
  document.getElementById('count-home').textContent='JSON integral · '+roots.length+' tela(s) · '+Object.keys(one.componentes||{}).length+' componentes · '+(nav.relacoes?.length??0)+' relações';
 }
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
 if(b.tipo==='titulo'){const level=Math.min(6,Math.max(4,Number(b.nivel)||4));const h=E('h'+level,'doc-subtitle');h.append(inline(b.conteudo));return h}
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
function markdownInline(text){
 const tokens=[],pattern=/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^\s)]+\)|\*[^*]+\*)/g;let at=0,m;
 while((m=pattern.exec(text))){if(m.index>at)tokens.push({tipo:'texto',texto:text.slice(at,m.index)});const raw=m[0];
  if(raw.startsWith('**'))tokens.push({tipo:'negrito',conteudo:markdownInline(raw.slice(2,-2))});
  else if(raw.startsWith('`'))tokens.push({tipo:'codigo',texto:raw.slice(1,-1)});
  else if(raw.startsWith('[')){const end=raw.indexOf('](');tokens.push({tipo:'link',url:raw.slice(end+2,-1),conteudo:markdownInline(raw.slice(1,end))});}
  else tokens.push({tipo:'italico',conteudo:markdownInline(raw.slice(1,-1))});at=pattern.lastIndex;
 }if(at<text.length)tokens.push({tipo:'texto',texto:text.slice(at)});return tokens;
}
function markdownBlocks(markdown){
 const lines=String(markdown||'').replace(/\r\n?/g,'\n').split('\n'),blocks=[];let i=0;
 const paragraph=value=>({tipo:'paragrafo',conteudo:markdownInline(value.trim())});
 while(i<lines.length){let line=lines[i];if(!line.trim()){i++;continue}
  const fence=line.match(/^```([^`]*)$/);if(fence){const parts=[];i++;while(i<lines.length&&!/^```/.test(lines[i]))parts.push(lines[i++]);if(i<lines.length)i++;blocks.push({tipo:'codigo',linguagem:fence[1].trim()||'texto',conteudo:parts.join('\n')});continue}
  const heading=line.match(/^(#{1,4})\s+(.+)$/);if(heading){blocks.push({tipo:'titulo',nivel:heading[1].length,conteudo:markdownInline(heading[2])});i++;continue}
  if(/^---+$/.test(line.trim())){blocks.push({tipo:'divisor'});i++;continue}
  if(/^>\s?/.test(line)){const parts=[];while(i<lines.length&&/^>\s?/.test(lines[i]))parts.push(lines[i++].replace(/^>\s?/,''));blocks.push({tipo:'destaque',blocos:[paragraph(parts.join(' '))]});continue}
  const list=line.match(/^(\s*)([-*+] |\d+\. )(.+)$/);if(list){const ordered=/\d+\. /.test(list[2]),items=[];while(i<lines.length){const item=lines[i].match(/^\s*(?:[-*+] |\d+\. )(.+)$/);if(!item)break;items.push([paragraph(item[1])]);i++;}blocks.push({tipo:'lista',ordenada:ordered,itens:items});continue}
  if(/^\|/.test(line)&&i+1<lines.length&&/^\|?\s*:?-{3,}/.test(lines[i+1])){const cells=value=>value.replace(/^\||\|$/g,'').split('|').map(x=>markdownInline(x.trim()));const colunas=cells(line);i+=2;const linhas=[];while(i<lines.length&&/^\|/.test(lines[i]))linhas.push(cells(lines[i++]));blocks.push({tipo:'tabela',colunas,linhas});continue}
  const parts=[line.trim()];i++;while(i<lines.length&&lines[i].trim()&&!/^(#{1,4})\s|^```|^>\s?|^\s*(?:[-*+] |\d+\. )|^\|/.test(lines[i]))parts.push(lines[i++].trim());blocks.push(paragraph(parts.join(' ')));
 }return blocks;
}
function normalizeDoc(d){
 if(validateDoc(d))return clone(d);
 if(!isObj(d)||typeof d.title!=='string'||!Array.isArray(d.sections))throw Error('Documentação inválida: esperado documento estruturado ou { title, introMarkdown, sections }.');
 const byId=new Map(d.sections.filter(isObj).map(s=>[s.id,s]));
 const chapters=Array.isArray(d.chapters)&&d.chapters.length?d.chapters:d.sections.map((s,i)=>({id:s.id,numero:i+1,title:s.title,sectionIds:[s.id]}));
 return {documento:{titulo:d.title,fonteArquivo:d.schema||'documento.json'},apresentacao:markdownBlocks(d.introMarkdown),secoes:chapters.map((chapter,index)=>{
  const ids=Array.isArray(chapter.sectionIds)?chapter.sectionIds:[];const entries=ids.map(id=>byId.get(id)).filter(Boolean);
  const title=String(chapter.title||'Seção '+(index+1)).replace(/^\s*\d+(?:\.\d+)?\.?\s*/,'');
  return {numero:chapter.numero||index+1,titulo:title,subsecoes:entries.map(section=>({titulo:(section.number?section.number+' · ':'')+section.title,blocos:markdownBlocks(section.markdown)}))};
 })};
}
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


const input=document.getElementById('json-file');
const loading=document.getElementById('carregamento');
function notify(msg,bad=false){
 const el=document.getElementById('msg-'+MODE);
 if(el){el.textContent=msg;el.className='status '+(bad?'err':'ok');el.hidden=false;}
}
function setLoading(message,bad=false){
 loading.textContent=message;loading.className='status '+(bad?'err':'ok');loading.hidden=false;
}
function validateBundle(payload){
 if(MODE==='estrutura'){
  if(!isObj(payload)||!isObj(payload.modelo)||!isObj(payload.glossario)||!isObj(payload.glossario.campos))
   throw Error('Documento do Modelo explicado precisa conter "modelo" e "glossario.campos".');
  if(payload.modelo.kind!=='object'||!isObj(payload.modelo.children))throw Error('Modelo inválido: esperado esquema {kind:"object",children:{...}}.');
  schema=clone(payload.modelo);glossario=clone(payload.glossario);help=clone(glossario.campos);
 }else if(MODE==='home'){
  home=clone(getContrato(payload));
 }else if(MODE==='doc'){
  documentacao=normalizeDoc(payload);
 }
}
function render(){if(MODE==='doc')renderDocument();else refreshTrees()}
async function loadInitial(){
 try{
  const response=await fetch('./documento.json',{cache:'no-store'});
  if(!response.ok)throw Error('HTTP '+response.status);
  const payload=JSON.parse((await response.text()).replace(/^\uFEFF/,''));
  validateBundle(payload);render();loading.hidden=true;
 }catch(err){setLoading('Não foi possível abrir documento.json automaticamente. Use servidor HTTP (GitHub Pages) ou clique em Importar JSON para selecionar o arquivo. Detalhe: '+err.message,true)}
}
async function importData(file){
 try{
  const parsed=JSON.parse((await file.text()).replace(/^\uFEFF/,''));
  if(MODE==='estrutura'){
   if(isObj(parsed.modelo)&&isObj(parsed.glossario))validateBundle(parsed);
   else if(parsed.kind==='object'&&isObj(parsed.children))schema=merge(schema,parsed);
   else schema=merge(schema,shape(normalizeModelo(getContrato(parsed))));
   help=clone(glossario.campos);
  }else validateBundle(parsed);
  render();loading.hidden=true;
  notify('JSON importado e aplicado nesta visualização. Exporte documento.json para guardar o resultado.');
 }catch(err){notify('Falha na importação: '+err.message,true)}
}
function exportData(){
 const payload=MODE==='estrutura'?{modelo:schema,glossario}:MODE==='home'?home:documentacao;
 download('documento.json',payload);
 notify('documento.json exportado. Para persistir, substitua o arquivo da pasta do módulo.');
}
input.addEventListener('change',async()=>{
 const file=input.files?.[0];if(file)await importData(file);input.value='';
});
document.querySelectorAll('[data-op]').forEach(btn=>btn.addEventListener('click',()=>{
 const op=btn.dataset.op;
 if(op==='import'){input.click();return}
 if(op==='export'){exportData();return}
 const expand=op==='expand';document.querySelectorAll('.tree details').forEach(d=>d.open=expand);
 if(!expand){const root=document.querySelector('.tree>details');if(root)root.open=true}
}));
if(new URLSearchParams(location.search).has('embed'))document.documentElement.classList.add('embedded');
loadInitial();
