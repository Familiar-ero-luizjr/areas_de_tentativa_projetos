/* Biblioteca: catálogo visual, editor de documentos, importação e exportação de biblioteca independente. */
(async function(){'use strict';
 const $=id=>document.getElementById(id),AJ=window.AJ;let db,selected=null,expanded=new Set(['biblioteca','biblioteca/telas','biblioteca/componentes']),modified=false;
 function status(msg,err=false){$('status').textContent=msg;$('status').classList.toggle('error',err)}
 function item(){if(!selected)return null;return selected.tipo==='tela'?db.telas[selected.id]:db.componentes[selected.id]}
 function setSelected(row){if(modified&&!confirm('Há alterações não salvas no editor. Descartá-las?'))return;
  selected=row;modified=false;const parts=row.caminho.split('/');for(let i=1;i<=parts.length;i++)expanded.add(parts.slice(0,i).join('/'));$('editorTitle').textContent=(row.tipo==='tela'?'🟦 Tela · ':'🧩 Componente · ')+row.id;
  $('editorPath').textContent=row.caminho+'/'+(row.tipo==='tela'?'documento.json':'componente.json');
  const payload=row.tipo==='tela'?AJ.fullScreen(row.id,db):item();$('editor').value=AJ.serialize(payload);
  $('btnPreview').disabled=row.tipo!=='tela';status('Documento carregado.');renderTree();
  if(row.tipo==='tela')AJ.selectScreen(row.id);
 }
 function treeData(){return AJ.treeIndex(db)}
 function renderTree(){const target=$('tree'),query=$('search').value.toLowerCase().trim();target.replaceChildren();
  if(query){const results=AJ.typeList(db).filter(r=>(r.caminho+' '+r.id+' '+r.nome).toLowerCase().includes(query));
   for(const r of results){const button=document.createElement('div');button.className='tree-row'+(selected?.id===r.id?' selected':'');button.style.padding='9px 10px';button.textContent=(r.tipo==='tela'?'🟦 ':'🧩 ')+r.id;button.title=r.caminho;button.onclick=()=>setSelected(r);target.append(button)}
   if(!results.length)target.innerHTML='<div class="tree-empty">Nenhum item encontrado.</div>';return;
  }
  const root=treeData();function draw(node,path,depth){const npath=path?path+'/'+node.name:node.name,dir=!!node.children;
    const wrap=document.createElement('div');wrap.className='tree-row'+(!dir&&selected?.id===node.id?' selected':'');wrap.style.paddingLeft=(depth*15+6)+'px';wrap.title=npath;
    const toggle=document.createElement('button');toggle.type='button';toggle.className='tree-toggle';toggle.textContent=dir?(expanded.has(npath)?'▾':'▸'):'·';toggle.tabIndex=dir?0:-1;wrap.append(toggle);
    const label=document.createElement('span');label.textContent=(dir?'📁 ':node.kind==='tela'?'🟦 ':'🧩 ')+node.name;wrap.append(label);
    if(!dir){wrap.onclick=()=>setSelected(AJ.typeList(db).find(r=>r.id===node.id&&r.tipo===node.kind));}
    else{wrap.onclick=()=>{expanded.has(npath)?expanded.delete(npath):expanded.add(npath);renderTree()};}
    target.append(wrap);
    if(dir&&expanded.has(npath))for(const child of node.children.sort((a,b)=>((a.name==='telas'?0:a.name==='componentes'?1:2)-(b.name==='telas'?0:b.name==='componentes'?1:2))||a.name.localeCompare(b.name,'pt-BR')))draw(child,npath,depth+1);
  }draw(root,'',0);
 }
 function renderMetrics(){const rows=AJ.typeList(db),screens=rows.filter(r=>r.tipo==='tela');
  $('metrics').innerHTML=`<div class="metric"><strong>${screens.length}</strong><span>Telas</span></div><div class="metric"><strong>${rows.length-screens.length}</strong><span>Componentes</span></div><div class="metric"><strong>${AJ.catalogo?.jornadas?.length||0}</strong><span>Jornadas catalogadas</span></div>`;
  $('treeInfo').textContent=rows.length+' itens indexados · Fonte compartilhada em Dados_Motor_V4/documento.json';
 }
 function rerender(){renderTree();renderMetrics()}
 function checkpoint(next){AJ.save(next);db=AJ.get();rerender();$('dataStatus').textContent='Dados editados neste navegador';}
 function save(){if(!selected)return status('Selecione um item.',true);try{
   const incoming=JSON.parse($('editor').value),next=AJ.clone(db),previous=selected;
   if(previous.tipo==='tela'){
    if(!incoming.tela||!incoming.componentes)throw Error('A tela precisa conter {tela, componentes}.');
    if(incoming.tela.identidade?.id!==previous.id)throw Error('O ID da tela é estável. Para outro ID, crie uma nova tela.');
    next.telas[previous.id]=incoming.tela;
    for(const [ref,c] of Object.entries(incoming.componentes)){
     if(!c.identidade?.id||c.identidade.id!==ref)throw Error('Identidade de componente divergente: '+ref);
     next.componentes[ref]=c;
    }
   }else{
    if(incoming.identidade?.id!==previous.id)throw Error('O ID do componente é estável.');next.componentes[previous.id]=incoming;
   }
   checkpoint(next);modified=false;const current=AJ.typeList(db).find(r=>r.id===previous.id&&r.tipo===previous.tipo);selected=current;
   $('editorPath').textContent=current.caminho+'/'+(previous.tipo==='tela'?'documento.json':'componente.json');
   status('JSON validado e salvo. A árvore foi reorganizada pela localização.');$('editor').value=AJ.serialize(previous.tipo==='tela'?AJ.fullScreen(previous.id,db):item());
  }catch(e){status('Não foi possível salvar: '+e.message,true)}
 }
 function downloadItem(){if(!selected)return;const name=AJ.filename(selected.id)+(selected.tipo==='tela'?'.documento.json':'.componente.json');AJ.download(name,AJ.serialize(selected.tipo==='tela'?AJ.fullScreen(selected.id,db):item()));status('Documento exportado: '+name)}
 async function importJSONFiles(files){if(!files.length)return;try{const next=AJ.clone(db);let n=0;for(const file of files){const payload=JSON.parse(await file.text());n+=AJ.mergeScreenPayload(next,payload)}checkpoint(next);modified=false;status(n+' documento(s) importado(s) com sucesso.');}catch(e){status('Importação cancelada: '+e.message,true)}}
 async function importZIP(file){if(!file)return;try{
   const entries=await AJ.unzip(await file.arrayBuffer()),next=AJ.clone(db);let n=0;
   // Primeiro telas, depois componentes individuais; componentes explícitos prevalecem no pacote.
   const screened=entries.filter(e=>/\/(documento|componente)\.json$/i.test(e.name));screened.sort((a,b)=>(a.name.endsWith('/componente.json')?1:0)-(b.name.endsWith('/componente.json')?1:0));
   for(const entry of screened){try{n+=AJ.mergeScreenPayload(next,JSON.parse(entry.content))}catch(e){throw Error(entry.name+': '+e.message)}}
   if(!n)throw Error('Não há documento.json ou componente.json reconhecidos no ZIP.');checkpoint(next);modified=false;status(n+' itens importados de ZIP.');
  }catch(e){status('Falha ao importar ZIP: '+e.message,true)}
 }
 function createNew(tipo){if(modified)return status('Salve ou descarte as alterações do documento atual.',true);
  const id=prompt('Informe o ID canônico da '+(tipo==='tela'?'tela':'definição de componente')+':',tipo==='tela'?'advogado.nova_tela':'advogado.novo_componente');if(!id)return;
  const normalized=id.trim();if(!/^[a-zA-Z][a-zA-Z0-9_.-]+$/.test(normalized))return status('ID inválido.',true);
  if(db.telas[normalized]||db.componentes[normalized])return status('Já existe esse ID.',true);
  const perfil=normalized.startsWith('cliente.')?'cliente':normalized.startsWith('admin.')?'admin':'advogado',path=tipo==='tela'?`biblioteca/telas/${perfil}/${normalized.replace(/\./g,'/')}`:`biblioteca/componentes/${perfil}/novo/${normalized.replace(/\./g,'/')}`;
  const identity={id:normalized,tipo,nome:normalized},classification={localizacao:{caminho:path},escopo:{perfilRef:perfil},jornadas:[]};
  const next=AJ.clone(db);
  if(tipo==='tela')next.telas[normalized]={schema:'advogadoja.tela',schemaVersion:'0.3.0',identidade:identity,classificacao:classification,estrutura:{html:{raizRef:'screen.root',composicao:{}},css:{tokens:{},regras:{}}},estados:{},variantes:{},interacoes:{},acoes:{},navegacao:{rotas:[]},dados:{},mocks:{}};
  else next.componentes[normalized]={identidade:identity,classificacao:classification,estrutura:{html:{raizRef:null,elementos:{}},css:{regras:{}}}};
  try{checkpoint(next);setSelected(AJ.typeList(db).find(r=>r.id===normalized));status('Novo item criado: '+normalized+'. Edite sua classificação e estrutura.');}catch(e){status(e.message,true)}
 }
 function remove(){if(!selected)return;if(modified)return status('Salve ou descarte as alterações atuais antes.',true);
  if(!confirm('Excluir '+selected.id+' da Biblioteca?'))return;
  const next=AJ.clone(db),id=selected.id;
  if(selected.tipo==='componente'){
   const uses=Object.entries(next.telas).filter(([_,s])=>Object.values(s.estrutura?.html?.composicao||{}).some(i=>i.componenteRef===id));
   if(uses.length)return status('Componente ainda é referenciado por: '+uses.map(x=>x[0]).join(', '),true);
   delete next.componentes[id];
  }else delete next.telas[id];
  try{checkpoint(next);selected=null;$('editor').value='';$('editorTitle').textContent='Selecione um item';$('editorPath').textContent='—';status('Item excluído: '+id)}catch(e){status(e.message,true)}
 }
 $('btnSave').onclick=save;$('btnFormat').onclick=()=>{try{$('editor').value=AJ.serialize(JSON.parse($('editor').value));status('JSON formatado.')}catch(e){status(e.message,true)}};
 $('editor').addEventListener('input',()=>{modified=true;status('Alterações pendentes: use Salvar JSON.')});
 $('btnDownloadSingle').onclick=downloadItem;$('btnRemove').onclick=remove;
 $('btnPreview').onclick=()=>{if(selected?.tipo==='tela'){AJ.selectScreen(selected.id);if(parent===window)location.href='../Visualizacao/index.html';else parent.postMessage({ajMotor:'navigate',module:'visualizacao'},location.origin)}};
 $('btnNewScreen').onclick=()=>createNew('tela');$('btnNewComponent').onclick=()=>createNew('componente');
 $('btnImportJson').onclick=()=>$('fileJson').click();$('btnImportZip').onclick=()=>$('fileZip').click();
 $('fileJson').onchange=async e=>{await importJSONFiles([...e.target.files]);e.target.value=''};
 $('fileZip').onchange=async e=>{await importZIP(e.target.files?.[0]);e.target.value=''};
 $('btnExportZip').onclick=()=>{try{AJ.download('AdvogadoJa_Biblioteca_Exportada.zip',AJ.makeZIP(AJ.libraryFiles(db)),'application/zip');status('ZIP da Biblioteca exportado fora do Motor V4.')}catch(e){status(e.message,true)}};
 $('btnExportIndex').onclick=()=>{AJ.download('biblioteca.jsonl',AJ.asJsonl(AJ.typeList(db)),'application/x-ndjson;charset=utf-8');status('Índice JSONL exportado.')} ;
 $('btnExportDoc').onclick=()=>{AJ.download('documento.json',AJ.serialize(db));status('Documento compartilhado exportado.')} ;
 $('btnRestore').onclick=async()=>{if(!confirm('Restaurar os documentos iniciais? As edições locais não exportadas serão perdidas.'))return;try{db=await AJ.restore();selected=null;modified=false;rerender();setSelected(AJ.typeList(db).find(r=>r.id==='advogado.home'));$('dataStatus').textContent='Base original restaurada';status('Base inicial restaurada.')}catch(e){status(e.message,true)}};
 $('expandAll').onclick=()=>{(function walk(n,p){const x=p?p+'/'+n.name:n.name;if(n.children){expanded.add(x);n.children.forEach(ch=>walk(ch,x))}})(treeData(),'');renderTree()};
 $('collapseAll').onclick=()=>{expanded=new Set(['biblioteca']);renderTree()};$('search').oninput=renderTree;
 try{db=await AJ.load();rerender();setSelected(AJ.typeList(db).find(r=>r.id==='advogado.home')||AJ.typeList(db)[0]);$('dataStatus').textContent='Documento compartilhado carregado';}
 catch(e){console.error(e);$('dataStatus').textContent='Erro de carregamento';status('Não foi possível abrir Dados_Motor_V4: '+e.message+'. Execute o projeto em servidor HTTP local.',true)}
})();
