function renderAll(){renderTree();renderStats();renderSelected();renderSelectors();renderFlow();renderJson();renderMount();flowRenderStructure();simRender();if(typeof jornadasRender==='function')jornadasRender();if(typeof bancoRender==='function')bancoRender();if(typeof mapaRender==='function')mapaRender();}
function switchTab(t){ui.tab=t;if(t==='contrato' && typeof contratoRender==='function')contratoRender();if(t==='simulacao')simRender();if(t==='fluxovisual')requestAnimationFrame(()=>{flowCenter();});if(t==='jornadas'&&typeof jornadasRender==='function')jornadasRender();if(t==='banco'&&typeof bancoRender==='function')bancoRender();if(t==='mapa'&&typeof mapaRender==='function')mapaRender();document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===t));document.querySelectorAll('.view').forEach(x=>x.classList.toggle('active',x.id==='view-'+t));}
function downloadText(filename,text,mime='application/json'){const blob=new Blob([text],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
async function copyText(text){try{await navigator.clipboard.writeText(text);notice('Texto copiado.');}catch(e){notice('Cópia não suportada em arquivo local; utilize o botão de exportar.','warn');}}
async function importFiles(files){const stats={addedComponents:0,reusedComponents:0,addedScreens:0,reusedScreens:0,conflicts:0};let imported=0;const errors=[];
 for(const f of [...files])if(f.name.toLowerCase().endsWith('.json'))try{
  const j=JSON.parse(await f.text());const r=importPack(j,f.webkitRelativePath||f.name);Object.keys(stats).forEach(k=>stats[k]+=r[k]);imported++;
 }catch(e){errors.push(f.name+': '+e.message);}
 if(imported)displayCounts(stats,imported+' JSON(s)');if(errors.length)notice(errors.join(' | '),'error');
}
const crcTab=(()=>{let a=[];for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;a.push(c>>>0);}return a;})();
function u16(n){return Uint8Array.from([n&255,n>>>8&255])}function u32(n){return Uint8Array.from([n&255,n>>>8&255,n>>>16&255,n>>>24&255])}
function concat(xs){const a=new Uint8Array(xs.reduce((s,x)=>s+x.length,0));let o=0;for(const x of xs){a.set(x,o);o+=x.length;}return a;}
function crc32(a){let c=0xffffffff;for(const x of a)c=crcTab[(c^x)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
function makeZip(files){const enc=new TextEncoder(),local=[],central=[];let offset=0;const d=new Date(),time=(d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1),date=((d.getFullYear()-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate();
 for(const f of files){const name=enc.encode(f.name),data=enc.encode(f.text),crc=crc32(data),part=concat([u32(0x04034b50),u16(20),u16(0x800),u16(0),u16(time),u16(date),u32(crc),u32(data.length),u32(data.length),u16(name.length),u16(0),name,data]);local.push(part);
  central.push(concat([u32(0x02014b50),u16(20),u16(20),u16(0x800),u16(0),u16(time),u16(date),u32(crc),u32(data.length),u32(data.length),u16(name.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(offset),name]));offset+=part.length;}
 const a=concat(local),b=concat(central),e=concat([u32(0x06054b50),u16(0),u16(0),u16(files.length),u16(files.length),u32(b.length),u32(a.length),u16(0)]);return new Blob([a,b,e],{type:'application/zip'});
}
function exportZip(){const files=[{name:'Projecoes/catalogo_indice_gerado.json',text:JSON.stringify(buildMaster(),null,2)}];for(const c of allComponents())files.push({name:'Catalogo/'+componentPaths(c),text:JSON.stringify(c,null,2)});for(const t of allScreens())files.push({name:'Catalogo/'+screenPaths(t),text:JSON.stringify(t,null,2)});const blob=makeZip(files),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='ADVOGADOJA_STORE_FLOW_V3_ATUALIZADO.zip';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function makeDemo(){const scr=deepClone(emptyTemplate().catalogo.telas[0]);scr.identidade={id:'advogado.perfil_profissional',nome:'Perfil Profissional',tipo:'tela',versao:'0.1.0-demonstracao'};scr.classificacao={escopo:'advogado',jornadas:['advogado'],subjornadas:['area_profissional'],compartilhada:false,localizacaoArvore:{secao:'Telas',segmentos:['advogado'],chave:'perfil_profissional',ordem:20}};
 scr.componentes.instancias=[{id:'cabecalho',ref:'header.app-header.v04',slot:'header',ordem:10,props:{dadosRef:'mocks.grupos.cabecalho.valor'},aplicaA:{jornadas:['advogado'],estados:['*']}}];
 scr.estados={fonte:'contexto.estado',fallbackSeguro:'padrao',grupos:[{id:'padrao',nome:'Padrão'}]};scr.estrutura={base:{id:'base',html:'<div class="prototype-screen"><div data-slot="header"></div><main class="perfil-demo" data-slot="main"><h2>Perfil Profissional</h2><p>Exemplo de segunda tela importada, com vínculo de retorno à Home.</p></main></div>',aplicaA:{jornadas:['advogado'],estados:['*']}},grupos:[{id:'cabecalho',slot:'header',ordem:10,instancias:['cabecalho'],aplicaA:{jornadas:['advogado'],estados:['*']}}]};scr.estilos={tema:{'--primary':'#10233f','--page':'#eef2f6'},grupos:[{id:'css_perfil',css:'.perfil-demo{padding:26px;color:#10233f;font-family:Arial}.perfil-demo h2{font-size:23px}',aplicaA:{estados:['*'],jornadas:['advogado']}}]};scr.acoes={grupos:[{id:'navegacao',aplicaA:{estados:['*'],jornadas:['advogado']},acoes:[{id:'voltar_home',destino:'advogado.home_advogado',evento:'click'}]}]};scr.mocks={grupos:{cabecalho:{id:'cabecalho',valor:{brand:'AdvogadoJá',role:'Advogado',menuLabel:'Menu',unreadCount:0}}},cenarios:{padrao:{id:'padrao'}}};
 return {catalogo:{metadados:{schema:CONTRACT,tipo:'pacote_tela',versao:'1.0'},componentes:[model.components['header.app-header.v04']||allComponents()[0]],telas:[scr]}};
}
function createRecord(kind){
 const id=prompt(kind==='screen'?'ID estável da nova tela (ex.: advogado.nova_tela)':'ID estável do novo componente (ex.: menu.novo.v01)',kind==='screen'?'advogado.nova_tela':'componente.novo.v01');
 if(id===null)return;
 if(!/^[a-z][a-z0-9_.-]+$/.test(id)){notice('ID inválido. Use letras minúsculas, números, pontos, hífen e underscore.','error');return;}
 const store=kind==='screen'?model.screens:model.components;
 if(store[id]){notice('Esse ID já existe. Selecione-o na árvore para editar.','warn');return;}
 const nome=prompt('Nome do novo '+(kind==='screen'?'tela':'componente'),id.split('.').at(-1).replaceAll('_',' '));if(nome===null)return;
 if(kind==='screen'){
  const t=emptyTemplate().catalogo.telas[0];t.identidade.id=id;t.identidade.nome=nome;
  const inferred=normalizeJourneyId(id.split('.')[0]);
  const supplied=prompt('Jornada(s) da tela, separadas por vírgula. Use * para tela comum. Uma jornada nova cria sua aba automaticamente.',inferred==='comum'||inferred==='shared'?'*':inferred);
  if(supplied===null)return;
  const journeys=[...new Set(supplied.split(',').map(normalizeJourneyId).filter(Boolean))];
  if(!journeys.length||journeys.some(x=>x!=='*'&&!/^[a-z][a-z0-9_.-]*$/.test(x))){notice('Informe uma ou mais jornadas válidas; exemplo: cliente, advogado ou nova_jornada.','error');return;}
  t.classificacao.escopo=id.split('.')[0];t.classificacao.jornadas=journeys;t.classificacao.compartilhada=journeys.includes('*');
  t.classificacao.localizacaoArvore.segmentos=[t.classificacao.escopo];t.classificacao.localizacaoArvore.chave=id.split('.').at(-1);
  const c=importPack({catalogo:{metadados:{schema:CONTRACT,tipo:'pacote_tela'},componentes:[],telas:[t]}},'Criado no Workspace');ui.screen=id;chooseItem('screen',id);displayCounts(c,'Nova tela');
 }else{
  const c={schema:'advogadoja.componente.reutilizavel.v2-proposta',identidade:{id,nome,tipo:'componente',versao:'0.1.0'},classificacao:{escopo:'global',jornadas:['*'],localizacaoArvore:{secao:'Componentes',segmentos:['globais','outros'],chave:safePart(id)}},estrutura:{formato:'arvore_elementos',arvore:[{id:'raiz',tag:'div',atributos:{class:'componente-novo'},filhos:['Componente: '+nome]}]},estilos:{css:'.componente-novo{padding:12px}'},interface:{propriedadesAceitas:[],eventosEmitidos:[]}};
  const info=importPack({catalogo:{metadados:{schema:CONTRACT,tipo:'pacote_tela'},componentes:[c],telas:[]}},'Criado no Workspace');chooseItem('component',id);displayCounts(info,'Novo componente');
 }
}
function wire(){
 flowBind();
 document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>switchTab(b.dataset.tab));
 $('importBtn').onclick=()=> $('fileInput').click();$('folderBtn').onclick=()=> $('folderInput').click();
 $('fileInput').onchange=async e=>{await importFiles(e.target.files);e.target.value='';};$('folderInput').onchange=async e=>{await importFiles(e.target.files);e.target.value='';};
 $('downloadTemplate').onclick=$('downloadTemplate2').onclick=()=>downloadText('MODELO_PACOTE_TELA.json',JSON.stringify(emptyTemplate(),null,2));
 $('createScreen').onclick=()=>createRecord('screen');$('createComponent').onclick=()=>createRecord('component');
 $('exportZip').onclick=exportZip;$('filter').oninput=renderTree;
 $('openAll').onclick=()=>document.querySelectorAll('#catalogTree details').forEach(e=>e.open=true);
 $('closeAll').onclick=()=>document.querySelectorAll('#catalogTree details').forEach(e=>e.open=false);
 $('modeTree').onclick=()=>showEditMode('tree');$('modeEdit').onclick=()=>showEditMode('edit');$('applyEdit').onclick=applyEdit;
 $('discardEdit').onclick=renderSelected;$('formatEdit').onclick=()=>{try{$('itemEditor').value=JSON.stringify(JSON.parse($('itemEditor').value),null,2);$('editMsg').textContent='Formatado.';}catch(e){$('editMsg').textContent=e.message;}};
 $('exportSelected').onclick=()=>{const x=currentItem();if(x){const payload=model.selection.type==='screen'?packageFor(idOf(x)):x;downloadText(safePart(idOf(x))+'.json',JSON.stringify(payload,null,2));}};
 $('exportScreenPack').onclick=()=>{const x=currentItem();if(x&&model.selection.type==='screen')downloadText(safePart(idOf(x))+'_pacote.json',JSON.stringify(packageFor(idOf(x)),null,2));};
 $('downloadPackage').onclick=()=>downloadText(safePart($('packageScreenChoice').value)+'_pacote.json',$('packageJson').value);
 $('downloadMaster').onclick=()=>downloadText('catalogo_master.json',$('masterJson').value);
 $('copyMaster').onclick=()=>copyText($('masterJson').value);$('copyResolved').onclick=()=>copyText($('resolvedJson').value);
 $('exportResolved').onclick=()=>downloadText(safePart(ui.screen)+'_'+safePart(ui.state)+'_montagem.json',$('resolvedJson').value);
 $('addRelation').onclick=addRelation;
 $('exportFlow').onclick=()=>downloadText('catalogo_relacoes_flow.json',JSON.stringify({relacoes:collectEdges()},null,2));
 $('packageScreenChoice').onchange=renderJson;$('flowScreenChoice').onchange=()=>{ui.flowScreen=$('flowScreenChoice').value;renderFlow();};
 $('screenChoice').onchange=()=>{ui.screen=$('screenChoice').value;ui.state='';ui.journey='';ui.drawer=false;renderSelectors();renderMount();};
 $('journeyChoice').onchange=()=>{ui.journey=$('journeyChoice').value;ui.drawer=false;renderMount();};
 $('stateChoice').onchange=()=>{ui.state=$('stateChoice').value;ui.drawer=false;renderMount();};
 $('rebuild').onclick=renderMount;$('toggleDrawer').onclick=()=>{ui.drawer=!ui.drawer;renderMount();};
 $('addDemo').onclick=()=>{try{const x=importPack(makeDemo(),'Demonstração: segunda tela');displayCounts(x,'Demo');}catch(e){notice(e.message,'error');}};
 $('resetCatalog').onclick=()=>{if(confirm('Recarregar definições diretamente dos JSONs em catálogo/?'))restoreSeed(true);};
 $('dropZone').onclick=()=> $('fileInput').click();
 for(const name of ['dragenter','dragover'])$('dropZone').addEventListener(name,e=>{e.preventDefault();e.currentTarget.style.background='#edf4ff';});
 for(const name of ['drop','dragleave'])$('dropZone').addEventListener(name,e=>{e.preventDefault();e.currentTarget.style.background='';});
 $('dropZone').addEventListener('drop',e=>importFiles(e.dataTransfer.files));
}
/* MOTOR VISUAL STORE V3: nunca persiste grafo nem workspace. Fonte: telas.flow.editor. */
