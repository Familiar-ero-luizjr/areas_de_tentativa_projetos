'use strict';
function resolvePage(model,id){return typeof id==='string'&&Object.prototype.hasOwnProperty.call(model.pages,id)?model.pages[id]:null;}
function showMissingPage(id){
 let dialog=document.getElementById('tj-missing-page');
 if(!dialog){
  dialog=document.createElement('dialog');dialog.id='tj-missing-page';dialog.setAttribute('aria-labelledby','tj-missing-title');
  const style=document.createElement('style');style.textContent='#tj-missing-page{border:1px solid #dce4ee;border-radius:12px;padding:24px;max-width:min(420px,calc(100vw - 32px));width:100%;color:#172b43;background:#fff;box-shadow:0 16px 60px #10233f33;font:14px/1.55 system-ui,sans-serif}#tj-missing-page::backdrop{background:#10233f66}#tj-missing-page h2{font-size:18px;margin:0 0 8px;color:#10233f}#tj-missing-page p{margin:8px 0}#tj-missing-page code{display:block;overflow-wrap:anywhere;padding:10px;background:#eff3f8;border-radius:6px;margin:12px 0}#tj-missing-page button{display:block;margin:16px 0 0 auto;background:#10233f;color:white;border:0;border-radius:6px;padding:9px 18px;cursor:pointer}';document.head.append(style);
  const h=document.createElement('h2');h.id='tj-missing-title';h.textContent='Página ainda não disponível';const p=document.createElement('p');p.textContent='A página referenciada não foi encontrada na coleção pages. Adicione a página com o ID abaixo e recarregue os dados.';const code=document.createElement('code');code.id='tj-missing-id';const b=document.createElement('button');b.type='button';b.textContent='Fechar';b.onclick=()=>dialog.close();dialog.append(h,p,code,b);document.body.append(dialog);
 }
 dialog.querySelector('code').textContent=String(id);if(!dialog.open)dialog.showModal();
}
