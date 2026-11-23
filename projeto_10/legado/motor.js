(()=>{'use strict';
 const $=id=>document.getElementById(id),esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 let items=[],activeId='';
 function showError(message){const box=$('message');box.hidden=false;box.textContent=message;$('count').textContent='Acervo indisponível';}
 function current(){return items.find(item=>item.id===activeId)||items[0];}
 function render(){const item=current();if(!item){$('tabs').innerHTML='';$('title').textContent='Nenhum HTML registrado';$('description').textContent='Adicione uma entrada em catalogo.json para criar uma nova aba.';$('openFile').hidden=true;$('viewer').removeAttribute('src');return;}
  activeId=item.id;$('tabs').innerHTML=items.map(entry=>`<button class="tab" type="button" role="tab" aria-selected="${entry.id===activeId}" data-id="${esc(entry.id)}" title="${esc(entry.nome)}">${esc(entry.nome)}</button>`).join('');$('title').textContent=item.nome;$('description').textContent=item.descricao||'HTML autocontido preservado no acervo de legado.';$('openFile').hidden=false;$('openFile').href=item.arquivo;$('viewer').src=item.arquivo;}
 async function load(){try{const response=await fetch('./catalogo.json',{cache:'no-store'});if(!response.ok)throw Error('HTTP '+response.status);const data=await response.json();if(!Array.isArray(data.htmls))throw Error('campo htmls ausente');items=data.htmls.filter(item=>item&&item.id&&item.nome&&item.arquivo);$('count').textContent=items.length+' HTML'+(items.length===1?'':'s');render();}catch(error){showError('Não foi possível ler catalogo.json. Abra esta pasta por um servidor HTTP local. Detalhe: '+error.message);}}
 $('tabs').addEventListener('click',event=>{const button=event.target.closest('[data-id]');if(!button)return;activeId=button.dataset.id;render();});
 load();
})();
