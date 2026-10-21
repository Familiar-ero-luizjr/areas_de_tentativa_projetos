/* 05 · Explorer universal de JSON e importação/exportação seletiva.
 * A árvore lê projeto.telas diretamente; não guarda cópias de telas, nem conhece seus IDs.
 */
const EXPORT_SCHEMA='advogadoja-laboratorio-telas-v2-export';
let treeSelected=new Set(Object.keys(projeto.telas));
let treeOpened=new Set(Object.keys(projeto.telas));
let treeNodeSelection=null;
let pendingImport=null;
let treeSearchTimer=null;
const TREE_BLOCKS=['estrutura','estilos','acoes','interacoes','dados','estados'];
const treeKeys=v=>Array.isArray(v)?v.map((_,i)=>i):plain(v)?Object.keys(v):[];
const treeContainer=v=>v!==null&&typeof v==='object';
const treeValueSummary=v=>{
 if(Array.isArray(v))return '['+v.length+' itens]';
 if(plain(v))return '{'+Object.keys(v).length+' propriedades}';
 if(typeof v==='string')return JSON.stringify(v.length>95?v.slice(0,92)+'…':v);
 if(v===null)return 'null';
 return String(v);
};
function treePath(root,keys){return root+keys.map(k=>typeof k==='number'?'['+k+']':/^[a-zA-Z_$][\w$]*$/.test(k)?'.'+k:'['+JSON.stringify(k)+']').join('')}
function treeElement(tag,cls,content){const n=document.createElement(tag);if(cls)n.className=cls;if(content!==undefined)n.textContent=content;return n}
function treeSetStatus(){const n=treeSelected.size;$('#tree-counter').textContent=n+' de '+Object.keys(projeto.telas).length+' telas selecionadas';$('#tree-export-selected').disabled=n===0}
function treeSaveAll(type,ids){
 ids=[...new Set(ids)].filter(id=>Object.prototype.hasOwnProperty.call(projeto.telas,id));
 if(!ids.length){toast('Marque ao menos uma tela');return;}
 const item={schema:EXPORT_SCHEMA,versao:'3.0.0',tipo:type,geradoEm:new Date().toISOString(),origem:{projeto:projeto.projeto,contrato:projeto.schema},dependencias:{mocks:deepcopy(projeto.mocks||{}),assets:deepcopy(projeto.assets||{})}};
 if(type==='tela'){item.tela=deepcopy(projeto.telas[ids[0]]);}else item.telas=ids.map(id=>deepcopy(projeto.telas[id]));
 const safe=id=>id.replace(/[^a-z0-9._-]/gi,'_');
 const filename=type==='tela'?safe(ids[0])+'.json':ids.length===Object.keys(projeto.telas).length?'advogadoja_todas_telas.json':'advogadoja_telas_selecionadas_'+ids.length+'.json';
 downloadText(filename,JSON.stringify(item,null,2));toast('Exportação realizada: '+ids.length+' tela(s)');
}
function treeSelectDetail(screen,keys,val,row){
 treeNodeSelection={screen,keys:[...keys]};
 $$('.tree-node.is-picked').forEach(el=>el.classList.remove('is-picked'));
 row?.classList.add('is-picked');
 $('#tree-detail-path').value=treePath('telas['+JSON.stringify(screen)+']',keys);
 $('#tree-detail-json').value=JSON.stringify(val,null,2)??String(val);
 $('#tree-detail-type').textContent=Array.isArray(val)?'Array · '+val.length:plain(val)?'Objeto · '+Object.keys(val).length:val===null?'null':typeof val;
 $('#tree-detail-tip').textContent='Tela: '+projeto.telas[screen].nome+'. Edite no bloco apropriado da aba Editar.';
}
function treeNode(label,value,screen,keys,depth=0){
 const isObject=treeContainer(value),details=treeElement('div','tree-node-block');
 const row=treeElement('div','tree-node');row.setAttribute('role','treeitem');row.tabIndex=0;
 const disclosure=treeElement('span','tree-twist',isObject?'▸':'·');
 const typeIcon=treeElement('span','tree-glyph',Array.isArray(value)?'▦':plain(value)?'{}':'•');
 const nm=treeElement('span','tree-prop',String(label));
 const summary=treeElement('span','tree-prop-value',treeValueSummary(value));
 row.append(disclosure,typeIcon,nm,summary);details.append(row);
 if(treeNodeSelection?.screen===screen&&JSON.stringify(treeNodeSelection.keys)===JSON.stringify(keys))row.classList.add('is-picked');
 const children=treeElement('div','tree-nested');children.hidden=true;details.append(children);
 let loaded=false,expanded=false;
 function expand(next){if(!isObject)return;expanded=next;children.hidden=!next;disclosure.textContent=next?'▾':'▸';row.setAttribute('aria-expanded',String(next));
  if(next&&!loaded){loaded=true;let idx=0;for(const k of treeKeys(value)){children.append(treeNode(k,value[k],screen,[...keys,k],depth+1));idx++;}
   if(idx===0)children.append(treeElement('div','tree-emptynode','(vazio)'));
  }
 }
 function activate(){treeSelectDetail(screen,keys,value,row);if(isObject)expand(!expanded)}
 row.addEventListener('click',activate);
 row.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();activate()}else if(e.key==='ArrowRight'&&isObject){e.preventDefault();expand(true)}else if(e.key==='ArrowLeft'&&isObject){e.preventDefault();expand(false)}});
 return details;
}
function treeSearchNodes(val,screen,needle,keys=[],found=[],max=75){
 if(found.length>=max)return found;
 if(keys.length>40)return found;
 if(keys.length>0){const tail=keys[keys.length-1];const path=treePath(screen,keys);
  const matched=String(tail).toLocaleLowerCase('pt-BR').includes(needle)||path.toLocaleLowerCase('pt-BR').includes(needle)||(typeof val==='string'&&val.toLocaleLowerCase('pt-BR').includes(needle))||((typeof val==='number'||typeof val==='boolean')&&String(val).toLowerCase().includes(needle));
  if(matched)found.push({keys:[...keys],value:val});
 }
 if(treeContainer(val))for(const k of treeKeys(val)){if(found.length>=max)break;treeSearchNodes(val[k],screen,needle,[...keys,k],found,max)}
 return found;
}
function treeBuildSearch(section,screen,q){
 const results=treeSearchNodes(projeto.telas[screen],screen,q);const list=treeElement('div','tree-search-results');
 if(!results.length)list.append(treeElement('div','tree-noresults','Nenhuma correspondência nesta tela.'));
 for(const r of results){
  const row=treeElement('button','tree-search-result');row.type='button';
  const title=treeElement('strong','',treePath('',r.keys).replace(/^\./,''));
  const snippet=treeElement('small','',treeValueSummary(r.value));
  row.append(title,snippet);row.onclick=()=>treeSelectDetail(screen,r.keys,r.value,row);list.append(row);
 }
 if(results.length>=75)list.append(treeElement('div','tree-search-limit','Exibindo as primeiras 75 correspondências nesta tela. Especifique mais a busca.'));
 section.append(list);
}
function renderTreePage(){
 treeSelected=new Set([...treeSelected].filter(id=>Object.prototype.hasOwnProperty.call(projeto.telas,id)));
 const container=$('#tree-sections'),query=$('#tree-search').value.trim().toLocaleLowerCase('pt-BR');container.replaceChildren();
 for(const [id,screen] of Object.entries(projeto.telas)){
  const section=treeElement('section','tree-screen-section');
  const head=treeElement('div','tree-screen-head');
  const toggle=treeElement('button','tree-screen-toggle');toggle.type='button';toggle.setAttribute('aria-expanded',String(treeOpened.has(id)));toggle.textContent=treeOpened.has(id)?'▾':'▸';toggle.title='Recolher / expandir a seção da tela';
  const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.className='tree-screen-check';checkbox.checked=treeSelected.has(id);checkbox.setAttribute('aria-label','Selecionar '+screen.nome+' para exportação');checkbox.onchange=()=>{checkbox.checked?treeSelected.add(id):treeSelected.delete(id);treeSetStatus()};
  const title=treeElement('div','tree-screen-title');title.append(treeElement('strong','',screen.nome),treeElement('small','',id));
  const label=treeElement('span','tree-active-state',screen.ativa?'Ativa':'Opcional');
  const exp=treeElement('button','lab-btn lab-btn-compact','↓ Exportar esta tela');exp.type='button';exp.onclick=()=>treeSaveAll('tela',[id]);
  head.append(toggle,checkbox,title,label,exp);section.append(head);
  const body=treeElement('div','tree-screen-body');body.hidden=!treeOpened.has(id);
  toggle.onclick=()=>{let isOpen=treeOpened.has(id);isOpen?treeOpened.delete(id):treeOpened.add(id);toggle.textContent=isOpen?'▸':'▾';toggle.setAttribute('aria-expanded',String(!isOpen));body.hidden=isOpen};
  if(query)treeBuildSearch(body,id,query);
  else {
   const meta=treeElement('div','tree-screen-meta','Metadados e seis blocos declarativos. Expanda somente os ramos necessários.');body.append(meta);
   for(const key of Object.keys(screen))body.append(treeNode(key,screen[key],id,[key]));
  }
  section.append(body);container.append(section);
 }
 treeSetStatus();
}
async function treeCopy(s){
 if(!s){toast('Selecione um nó primeiro');return;}
 try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(s);toast('Copiado');return;}}catch{}
 const ta=document.createElement('textarea');ta.value=s;ta.style.position='fixed';ta.style.left='-9999px';document.body.appendChild(ta);ta.select();let ok=false;try{ok=document.execCommand('copy')}catch{}ta.remove();toast(ok?'Copiado':'Selecione e copie manualmente');
}
function treeEditSelection(){
 if(!treeNodeSelection){toast('Selecione primeiro um nó');return}
 const {screen,keys}=treeNodeSelection;if(!projeto.telas[screen])return;
 telaAtual=screen;elementoAtual=null;setMode('editor');switchTab('json');
 const key=keys[0];const selected=TREE_BLOCKS.includes(key)?key:'tela';$('#json-section').value=selected;loadJSONEditor();
 toast('Editor aberto: '+projeto.telas[screen].nome+' · '+selected);
}
function setupTreeControls(){
 $('#tree-select-all').onclick=()=>{treeSelected=new Set(Object.keys(projeto.telas));renderTreePage()};
 $('#tree-select-none').onclick=()=>{treeSelected.clear();renderTreePage()};
 $('#tree-export-selected').onclick=()=>treeSaveAll('colecao',Object.keys(projeto.telas).filter(id=>treeSelected.has(id)));
 $('#tree-export-all').onclick=()=>treeSaveAll('colecao',Object.keys(projeto.telas));
 $('#tree-search').addEventListener('input',()=>{clearTimeout(treeSearchTimer);treeSearchTimer=setTimeout(renderTreePage,180)});
 $('#tree-copy-path').onclick=()=>treeCopy($('#tree-detail-path').value);
 $('#tree-copy-json').onclick=()=>treeCopy($('#tree-detail-json').value);
 $('#tree-edit-block').onclick=treeEditSelection;
 $('#tree-import-file').onchange=handleImportFile;
 $('#tree-import-cancel').onclick=closeImportPreview;
 $('#tree-import-confirm').onclick=commitImport;
 $('#tree-import-overlay').addEventListener('click',e=>{if(e.target===$('#tree-import-overlay'))closeImportPreview()});
 treeSetStatus();
}
function safeRecord(map){return plain(map)&&Object.keys(map).every(k=>!['__proto__','prototype','constructor'].includes(k));}
function parseImport(data){
 let screens=[],resources={mocks:{},assets:{}};
 if(plain(data)&&data.schema===EXPORT_SCHEMA){
  if(data.tipo==='tela'){if(!plain(data.tela))throw Error('Exportação individual sem tela válida');screens=[data.tela];}
  else if(data.tipo==='colecao'){if(!Array.isArray(data.telas))throw Error('Coleção deve conter array telas');screens=data.telas;}
  else throw Error('Tipo de exportação desconhecido');
  resources=data.dependencias||resources;
 }else if(plain(data)&&data.schema==='advogadoja-laboratorio-telas-v2'){
  if(!safeRecord(data.telas))throw Error('IDs reservados não permitidos');
  screens=Object.values(data.telas||{});resources={mocks:data.mocks||{},assets:data.assets||{}};
 }else if(plain(data)&&plain(data.estrutura)&&typeof data.id==='string'){
  screens=[data];
 }else throw Error('Formato não reconhecido. Importe tela, coleção ou projeto V2.');
 if(!screens.length||screens.length>500)throw Error('Importação deve ter de 1 a 500 telas');
 if(!safeRecord(resources)||!safeRecord(resources.mocks||{})||!safeRecord(resources.assets||{}))throw Error('Dependências globais inválidas');
 const ids=new Set();
 for(const s of screens){
  if(!plain(s)||typeof s.id!=='string'||!s.id.trim()||s.id.length>200||['__proto__','constructor','prototype'].includes(s.id)||ids.has(s.id))throw Error('ID de tela inválido ou duplicado');
  ids.add(s.id);
 }
 const proposed=deepcopy(projeto);
 Object.assign(proposed.mocks,deepcopy(resources.mocks||{}));Object.assign(proposed.assets,deepcopy(resources.assets||{}));
 for(const s of screens)proposed.telas[s.id]=deepcopy(s);
 validate(proposed);
 return {screens,resources};
}
async function handleImportFile(e){
 const file=e.target.files?.[0];e.target.value='';if(!file)return;
 try{const text=await file.text();if(text.length>15_000_000)throw Error('JSON de importação acima de 15 MB');const data=JSON.parse(text);
  pendingImport=parseImport(data);displayImportPreview(file.name);
 }catch(err){pendingImport=null;toast('Falha na importação: '+err.message)}
}
function displayImportPreview(filename){
 if(!pendingImport)return;
 const incoming=pendingImport.screens,existing=incoming.filter(s=>knownScreen(s.id)).length;
 $('#tree-import-title').textContent='Revisar importação de JSON';
 $('#tree-import-summary').textContent=filename+' · '+incoming.length+' tela(s): '+(incoming.length-existing)+' nova(s) e '+existing+' ID(s) já existente(s).';
 $('#tree-import-policy').value='skip';
 const list=$('#tree-import-list');list.replaceChildren();
 for(const s of incoming){const row=treeElement('div','tree-import-row');row.append(treeElement('strong','',s.nome||s.id),treeElement('small','',s.id),treeElement('span','',knownScreen(s.id)?'Já existe · política abaixo':'Nova tela'));list.append(row)}
 $('#tree-import-overlay').hidden=false;
}
function closeImportPreview(){$('#tree-import-overlay').hidden=true;pendingImport=null}
function commitImport(){
 if(!pendingImport)return;
 const replace=$('#tree-import-policy').value==='replace',draft=deepcopy(projeto),{screens,resources}=pendingImport;
 let added=0,updated=0,skipped=0,mergedResources=0;
 try{
  for(const s of screens){if(Object.prototype.hasOwnProperty.call(draft.telas,s.id)){if(!replace){skipped++;continue}updated++}else added++;draft.telas[s.id]=deepcopy(s)}
  for(const key of ['mocks','assets'])for(const [id,val] of Object.entries(resources[key]||{})){
   if(replace||!Object.prototype.hasOwnProperty.call(draft[key],id)){draft[key][id]=deepcopy(val);mergedResources++;}
  }
  validate(draft);
  projeto=draft;if(!knownScreen(telaAtual))telaAtual=projeto.inicial;
  elementoAtual=null;runtime.form={};if(added||updated||mergedResources){dirty()}closeImportPreview();renderCurrent();loadJSONEditor();renderTreePage();
  toast('Importação: '+added+' nova(s), '+updated+' atualizada(s), '+skipped+' preservada(s).');
 }catch(err){toast('Importação não aplicada: '+err.message)}
}
