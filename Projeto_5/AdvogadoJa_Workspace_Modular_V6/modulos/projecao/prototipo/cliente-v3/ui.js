import {carregarCatalogo,baixar,stringify} from './catalogo.js';
export const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const pre=o=>`<pre class="codebox">${esc(typeof o==='string'?o:JSON.stringify(o,null,2))}</pre>`;
export const tag=(s,cl='')=>`<span class="tag ${cl}">${esc(s)}</span>`;
export const option=(val,label,sel)=>`<option value="${esc(val)}" ${String(val)===String(sel)?'selected':''}>${esc(label)}</option>`;
export const $=id=>document.getElementById(id);
export function aviso(m){const x=$('toast');if(!x)return;x.textContent=m;x.classList.add('visible');setTimeout(()=>x.classList.remove('visible'),3000)}
export async function iniciar(render){const el=$('main');el.innerHTML='<div class="panel">Carregando <code>catalogo/indice.json</code> e registros ativos…</div>';try{const c=await carregarCatalogo();await render(c)}catch(e){el.innerHTML=`<div class="panel"><h2>Não foi possível ler o catálogo</h2><p class="error">${esc(e.message)}</p><p>Abra com <code>python iniciar.py</code> na raiz do ZIP extraído, ou com Live Server. O protocolo <code>file://</code> não permite carregar os JSONs.</p><a href="../../../../index.html">Voltar ao início</a></div>`}}
export function botaoExportar(nome,data){baixar(nome,stringify(data))}
export const dadosFormulario=()=>new FormData();
export function tabela(cab,linhas){return `<div style="overflow:auto"><table style="border-collapse:collapse;width:100%;font-size:12px"><thead><tr>${cab.map(v=>`<th style="text-align:left;padding:9px;border-bottom:1px solid #d7e0ee">${esc(v)}</th>`).join('')}</tr></thead><tbody>${linhas.map(row=>`<tr>${row.map(v=>`<td style="padding:9px;border-bottom:1px solid #edf1f7;vertical-align:top">${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
