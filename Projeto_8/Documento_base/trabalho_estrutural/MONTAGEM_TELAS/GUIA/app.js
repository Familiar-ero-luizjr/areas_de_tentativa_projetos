'use strict';
(async function(){
const $=id=>document.getElementById(id),escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;',"'":'&#39;'}[c]));
let doc,active=0;
try{const r=await fetch('documento.json',{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);doc=await r.json();}catch(e){$('article').innerHTML='<h2>Não foi possível carregar documento.json</h2><p>Use um servidor HTTP ou importe manualmente o documento pelo botão Importar JSON.</p>';doc={schema:'advogadoja.guia.documento',schemaVersion:'1.0.0',titulo:'Guia',secoes:[]};}
function inline(t){return escape(t).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,(all,label,url)=>`<a href="${url.replace(/&amp;/g,'&')}" target="_blank" rel="noopener">${label}</a>`)}
function renderMarkdown(md){const lines=md.split(/\r?\n/),out=[];let inCode=false,code=[],list=null,table=[];
 function finishList(){if(list){out.push('</'+list+'>');list=null}}function finishTable(){if(table.length){let rows=table.filter(x=>!/^\s*\|?\s*:?-{3,}/.test(x));if(rows.length){out.push('<table>');rows.forEach((row,i)=>{out.push('<tr>');row.split('|').slice(1,-1).forEach(c=>out.push(`<${i===0?'th':'td'}>${inline(c.trim())}</${i===0?'th':'td'}>`));out.push('</tr>')});out.push('</table>')}table=[]}}
 for(const line of lines){if(line.startsWith('```')){finishList();finishTable();if(inCode){out.push(`<pre><code>${escape(code.join('\n'))}</code></pre>`);code=[];inCode=false}else inCode=true;continue;}if(inCode){code.push(line);continue;}
 if(/^\s*\|.*\|\s*$/.test(line)){finishList();table.push(line);continue;}finishTable();
 const heading=line.match(/^(#{1,5})\s+(.+)/);if(heading){finishList();out.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`);continue;}
 if(/^>\s?/.test(line)){finishList();out.push(`<blockquote>${inline(line.replace(/^>\s?/,''))}</blockquote>`);continue;}
 const m=line.match(/^\s*(?:[-*]|\d+\.)\s+(.+)/);if(m){const kind=/^\s*\d+\./.test(line)?'ol':'ul';if(list!==kind){finishList();out.push('<'+kind+'>');list=kind;}out.push('<li>'+inline(m[1])+'</li>');continue;}
 finishList();if(!line.trim())continue;if(/^---+$/.test(line.trim())){out.push('<hr>');continue}out.push('<p>'+inline(line)+'</p>')}
 finishTable();finishList();if(inCode)out.push(`<pre><code>${escape(code.join('\n'))}</code></pre>`);return out.join('\n')}
function render(){if(!Array.isArray(doc.secoes))doc.secoes=[];$('toc').innerHTML=doc.secoes.map((s,i)=>`<button data-index="${i}" class="${i===active?'active':''}">${escape(String(s.ordem||i+1).padStart(2,'0'))}. ${escape(s.titulo||'Seção sem título')}</button>`).join('');$('toc').querySelectorAll('button').forEach(x=>x.addEventListener('click',()=>{active=Number(x.dataset.index);render();window.scrollTo({top:0,behavior:'smooth'})}));const s=doc.secoes[active];$('article').innerHTML=s?renderMarkdown(s.markdown||''):'<h2>Nenhuma seção</h2><p>Importe um documento JSON para iniciar.</p>'}
function download(){const blob=new Blob([JSON.stringify(doc,null,2)+'\n'],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='documento.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500)}
$('export').addEventListener('click',download);$('import').addEventListener('click',()=>$('file').click());$('toggle').addEventListener('click',()=>$('side').open=!$('side').open);
$('file').addEventListener('change',async e=>{const f=e.target.files?.[0];e.target.value='';if(!f)return;try{let x=JSON.parse(await f.text());if(x.schema!=='advogadoja.guia.documento'||!Array.isArray(x.secoes))throw Error('Formato do Guia inválido.');doc=x;active=0;render();}catch(err){alert(err.message)}});
render();
})();
