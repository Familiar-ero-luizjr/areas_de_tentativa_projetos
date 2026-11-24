(()=>{'use strict';
const $=id=>document.getElementById(id);
const versionTab=$('browse-tab'), exportTab=$('export-tab'), panel=$('export-panel'), browse=$('library-browse');
let items=[],chosen=new Set(),visible=[],loading=false,loaded=false,busy=false;
const base=new URL('./',location.href);
const v2base=new URL('../versao2/',base);
const url=(folder,path)=>new URL(path,folder);
async function read(u,asJson=false){const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw Error(r.status+' — '+u.pathname);return asJson?r.json():r.text()}
function normalize(s){return String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function record(version,library,key,name,path,origin){return {uid:version+':'+library+':'+path,version,library,key,name,path,origin}}
function switchTab(exporting,focus=false){versionTab.setAttribute('aria-selected',String(!exporting));exportTab.setAttribute('aria-selected',String(exporting));versionTab.tabIndex=exporting?-1:0;exportTab.tabIndex=exporting?0:-1;browse.hidden=exporting;panel.hidden=!exporting;if(focus)(exporting?exportTab:versionTab).focus();if(exporting&&!loaded&&!loading)load()}
function tabClick(flag){if(flag){if(location.hash!=='#exportar')history.replaceState(null,'','#exportar')}else if(location.hash==='#exportar')history.replaceState(null,'',location.pathname+location.search);switchTab(flag)}
versionTab.onclick=()=>tabClick(false);exportTab.onclick=()=>tabClick(true);
for(const t of [versionTab,exportTab])t.onkeydown=e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const exp=e.key==='End'||(e.key!=='Home'&&t===versionTab);tabClick(exp);(exp?exportTab:versionTab).focus()}};
window.addEventListener('hashchange',()=>switchTab(location.hash==='#exportar'));
function error(message){$('exp-error').textContent=message;$('exp-error').hidden=!message}
async function load(){loading=true;error('');$('exp-retry').hidden=true;$('exp-status').textContent='Lendo inventários V1 e V2…';
try{const [a,b,r]=await Promise.all([read(url(base,'01/inventario_telas.json'),true),read(url(base,'02/inventario_telas.json'),true),read(url(v2base,'auditoria_conversao.json'),true)]);
const rows=[],v1paths=new Set();
for(const [library,inv] of [['01',a],['02',b]])for(const x of inv.telas){const p=library+'/'+x.path;v1paths.add(p);rows.push(record('V1',library,x.key,x.name,p,p))}
for(const x of r.telas){if(!v1paths.has(x.origem)){v1paths.add(x.origem);rows.push(record('V1',x.biblioteca,x.tela,x.tela,x.origem,x.origem))}
rows.push(record('V2',x.biblioteca,x.tela,x.tela,x.destino+'/index.html',x.destino))}
items=[...new Map(rows.map(x=>[x.uid,x])).values()].sort((a,b)=>a.key.localeCompare(b.key,'pt-BR')||a.version.localeCompare(b.version)||a.library.localeCompare(b.library)||a.path.localeCompare(b.path));loaded=true;$('exp-status').textContent='Catálogo: '+items.filter(x=>x.version==='V1').length+' telas V1 e '+items.filter(x=>x.version==='V2').length+' telas V2.';draw();
}catch(e){error('Não foi possível carregar o catálogo: '+e.message);$('exp-status').textContent='';$('exp-retry').hidden=false}finally{loading=false}}
function controls(){const v1=items.filter(x=>chosen.has(x.uid)&&x.version==='V1').length;const v2=chosen.size-v1;$('exp-count').textContent=visible.length+' exibidas · '+chosen.size+' selecionadas (V1: '+v1+' / V2: '+v2+')';$('exp-download').disabled=busy||!chosen.size;$('exp-select').disabled=busy||!visible.length;$('exp-clear-visible').disabled=busy||!visible.some(x=>chosen.has(x.uid));$('exp-clear').disabled=busy||!chosen.size;for(const id of ['exp-search','exp-version','exp-library','exp-filter'])$(id).disabled=busy}
function td(row,value){const c=document.createElement('td');if(typeof value==='string')c.textContent=value;else c.append(value);row.append(c);return c}
function draw(){const q=normalize($('exp-search').value).trim(),v=$('exp-version').value,l=$('exp-library').value,selected=$('exp-filter').value;
visible=items.filter(x=>(!v||x.version===v)&&(!l||x.library===l)&&(!selected||chosen.has(x.uid))&&(!q||normalize([x.name,x.key,x.path].join(' ')).includes(q)));
const frag=document.createDocumentFragment();for(const x of visible){const tr=document.createElement('tr'),cb=document.createElement('input');cb.type='checkbox';cb.checked=chosen.has(x.uid);cb.disabled=busy;cb.setAttribute('aria-label','Selecionar '+x.version+' '+x.library+' '+x.path);cb.onchange=()=>{if(cb.checked)chosen.add(x.uid);else chosen.delete(x.uid);if(selected)draw();else controls()};td(tr,cb);td(tr,x.version);td(tr,x.library);const cell=td(tr,x.name||x.key);const small=document.createElement('small');small.textContent=x.key+' · '+x.path;cell.append(small);const a=document.createElement('a');a.href=url(x.version==='V1'?base:v2base,x.path);a.target='_blank';a.rel='noopener';a.textContent='Abrir tela';td(tr,a);frag.append(tr)}
if(!visible.length){const tr=document.createElement('tr'),cell=td(tr,'Nenhuma tela corresponde aos filtros.');cell.colSpan=5;frag.append(tr)}$('exp-rows').replaceChildren(frag);controls()}
for(const id of ['exp-search','exp-version','exp-library','exp-filter'])$(id).addEventListener(id==='exp-search'?'input':'change',draw);
$('exp-select').onclick=()=>{visible.forEach(x=>chosen.add(x.uid));draw()};$('exp-clear-visible').onclick=()=>{visible.forEach(x=>chosen.delete(x.uid));draw()};$('exp-clear').onclick=()=>{chosen.clear();draw()};$('exp-retry').onclick=load;
function inlineV2(html,css,motor,doc){const cssTag=/<link\b[^>]*\bhref=["'](?:\.\/)?style\.css["'][^>]*>/i,scriptTag=/<script\b[^>]*\bsrc=["'](?:\.\/)?motor\.js["'][^>]*>\s*<\/script>/i,fetchExpr=/\bfetch\(\s*(['"])documento\.json\1\s*\)/g;
if(!cssTag.test(html)||!scriptTag.test(html)||[...motor.matchAll(fetchExpr)].length!==1)throw Error('Formato V2 diferente do esperado; exportação interrompida para preservar o motor.');
const json=JSON.stringify(doc).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
const data='<script type="application/json" id="aj-export-documento">'+json+'</script>';
const embedded=motor.replace(fetchExpr,()=> "Promise.resolve({ok:true,json:()=>Promise.resolve(JSON.parse(document.getElementById('aj-export-documento').textContent))})");
return html.replace(cssTag,()=>'<style>'+css.replace(/<\/style/gi,'<\\/style')+'</style>').replace(scriptTag,()=>data+'<script>'+embedded.replace(/<\/script/gi,'<\\/script')+'</script>')}
async function exportFile(x){if(x.version==='V1')return {name:'V1/'+x.path,content:await read(url(base,x.path))};
const dir=url(v2base,x.origin+'/');const [h,c,m,d]=await Promise.all([read(url(dir,'index.html')),read(url(dir,'style.css')),read(url(dir,'motor.js')),read(url(dir,'documento.json'),true)]);
return {name:'V2/'+x.origin+'.html',content:inlineV2(h,c,m,d)}}
// ZIP STORE, UTF-8, CRC-32; sem CDN ou dependência externa.
const crcTable=Uint32Array.from({length:256},(_,i)=>{let c=i;for(let k=0;k<8;k++)c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1);return c>>>0});
function crc32(data){let c=0xffffffff;for(const b of data)c=crcTable[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0}
function zip(files){const enc=new TextEncoder(),parts=[],central=[];let offset=0,centralSize=0;const names=new Set();const now=new Date();const date=((Math.max(1980,now.getFullYear())-1980)<<9)|((now.getMonth()+1)<<5)|now.getDate(),time=(now.getHours()<<11)|(now.getMinutes()<<5)|(now.getSeconds()>>1);
if(files.length>65535)throw Error('Quantidade excede limite ZIP32.');
for(const file of files){if(names.has(file.name))throw Error('Nome duplicado: '+file.name);names.add(file.name);const name=enc.encode(file.name),data=enc.encode(file.content),size=data.length,crc=crc32(data);
if(size>0xffffffff||offset+size+30+name.length>0xffffffff||name.length>65535)throw Error('Limite ZIP32 excedido.');
const l=new Uint8Array(30+name.length),a=new DataView(l.buffer);a.setUint32(0,0x04034b50,true);a.setUint16(4,20,true);a.setUint16(6,0x0800,true);a.setUint16(10,time,true);a.setUint16(12,date,true);a.setUint32(14,crc,true);a.setUint32(18,size,true);a.setUint32(22,size,true);a.setUint16(26,name.length,true);l.set(name,30);parts.push(l,data);
const c=new Uint8Array(46+name.length),b=new DataView(c.buffer);b.setUint32(0,0x02014b50,true);b.setUint16(4,20,true);b.setUint16(6,20,true);b.setUint16(8,0x0800,true);b.setUint16(12,time,true);b.setUint16(14,date,true);b.setUint32(16,crc,true);b.setUint32(20,size,true);b.setUint32(24,size,true);b.setUint16(28,name.length,true);b.setUint32(42,offset,true);c.set(name,46);central.push(c);centralSize+=c.length;offset+=l.length+size}
if(offset+centralSize+22>0xffffffff)throw Error('Limite ZIP32 excedido.');const end=new Uint8Array(22),e=new DataView(end.buffer);e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,centralSize,true);e.setUint32(16,offset,true);return new Blob([...parts,...central,end],{type:'application/zip'})}
$('exp-download').onclick=async()=>{if(busy||!chosen.size)return;busy=true;error('');draw();const selected=items.filter(x=>chosen.has(x.uid)),progress=$('exp-progress');progress.hidden=false;progress.max=selected.length;progress.value=0;const files=[],failures=[];
try{for(const x of selected){$('exp-status').textContent='Preparando '+(progress.value+1)+'/'+selected.length+' — '+x.version+' '+x.key;try{files.push(await exportFile(x))}catch(e){failures.push(x.version+' '+x.path+': '+e.message)}progress.value++}
if(failures.length)throw Error(failures.length+' tela(s) não puderam ser exportadas. Nenhum ZIP parcial foi baixado. Corrija ou desmarque as telas e tente novamente.\n'+failures.join('\n'));
const blob=zip(files),href=URL.createObjectURL(blob),a=document.createElement('a');a.href=href;a.download='AdvogadoJa_telas_'+new Date().toISOString().slice(0,10)+'_'+files.length+'.zip';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(href),60000);$('exp-status').textContent='ZIP gerado com '+files.length+' HTMLs individuais.';
}catch(e){error(e.message);$('exp-status').textContent='Exportação não concluída.'}finally{busy=false;progress.hidden=true;draw()}};
switchTab(location.hash==='#exportar');
})();