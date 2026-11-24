/* Motor isolado deste tipo de contrato: lê configuração da própria pasta e dados da fonte única. */
(async function(){const $=id=>document.getElementById(id);const mode='prototipo';
 try{
  await AJ.load();const cfg=await AJ.request(new URL('contrato.json',location.href));const id=AJ.selectedScreen();if(!id)throw Error('Nenhuma tela cadastrada.');
  const result=AJ.project(id,cfg);$('title').textContent='Contrato mínimo · '+cfg.nome;$('description').textContent=cfg.observacao;
  $('badge').textContent=cfg.status==='em_definicao'?'Em definição':'Projeção disponível';$('meta').textContent='Tela: '+id+' · '+cfg.camposTela.length+' campos selecionados';
  const obj=result.tela||{};for(const [field,value] of Object.entries(obj)){
   const details=document.createElement('details');details.className='contract-section';details.open=['identidade','classificacao','estrutura'].includes(field);
   const s=document.createElement('summary');s.textContent=field;const pre=document.createElement('pre');pre.textContent=JSON.stringify(value,null,2);details.append(s,pre);$('sections').append(details);
  }
  if(cfg.incluirComponentes){const d=document.createElement('details');d.className='contract-section';const s=document.createElement('summary');s.textContent='componentes · '+Object.keys(result.componentes||{}).length;const pre=document.createElement('pre');pre.textContent=JSON.stringify(result.componentes,null,2);d.append(s,pre);$('sections').append(d)}
  $('fullJSON').textContent=JSON.stringify(result,null,2);
  $('export').onclick=()=>AJ.download(AJ.filename(id)+'_contrato_minimo_'+mode+'.json',AJ.serialize(result));
  $('copy').onclick=async()=>{try{await navigator.clipboard.writeText(AJ.serialize(result));$('status').textContent='Copiado.'}catch(e){$('status').textContent='O navegador bloqueou a cópia; selecione o JSON abaixo.'}};
 }catch(e){console.error(e);$('status').classList.add('error');$('status').textContent='Erro no contrato: '+e.message}
})();
