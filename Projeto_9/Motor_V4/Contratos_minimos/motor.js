/* Controlador do índice JSONL próprio dos Contratos Mínimos. */
(async function(){'use strict';const $=id=>document.getElementById(id);const pages={tela:'Tela/index.html',fluxo:'Fluxo/index.html',prototipo:'Prototipo/index.html'};let mode='tela';
 function select(modeId){if(!pages[modeId])return;mode=modeId;document.querySelectorAll('[data-type]').forEach(b=>b.classList.toggle('active',b.dataset.type===modeId));$('contractFrame').src=pages[modeId];}
 try{await AJ.load();const configs=AJ.contratos;
  const ss=$('screenSelect');for(const [id,d] of Object.entries(AJ.get().telas)){let o=document.createElement('option');o.value=id;o.textContent=(d.identidade?.nomeExibicao||id)+' · '+id;ss.append(o)}ss.value=AJ.selectedScreen();
  ss.onchange=()=>{AJ.selectScreen(ss.value);$('contractFrame').contentWindow.location.reload()};
  for(const config of configs){const b=document.createElement('button');b.className='tab';b.dataset.type=config.id;b.textContent=String(config.numero).padStart(2,'0')+' · '+config.nome;b.onclick=()=>select(config.id);$('contractTabs').append(b)}
  $('sourceStatus').textContent=configs.length+' modelos · contratos_minimos.jsonl';select(mode);$('contractStatus').textContent='Cada pasta de contrato possui seu próprio index.html, motor.js e contrato.json.';
 }catch(e){console.error(e);$('sourceStatus').textContent='Erro';$('contractStatus').textContent=e.message}
})();
