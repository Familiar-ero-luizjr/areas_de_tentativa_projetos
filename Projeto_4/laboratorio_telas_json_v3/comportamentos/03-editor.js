/* 03 · Editor universal: opera sobre IDs dos nós e blocos declarativos. */
const editorFields=['pos-x','pos-y','style-color','style-background','font-size','style-width','element-text'];
function setMode(next){
 modo=next;
 $('#mode-sim').classList.toggle('is-active',next==='simulador');
 $('#mode-edit').classList.toggle('is-active',next==='editor');
 $('#mode-tree').classList.toggle('is-active',next==='arvore');
 $('#simulator-workspace').hidden=next==='arvore';
 $('#tree-page').hidden=next!=='arvore';
 if(next==='arvore'){renderTreePage();return;}
 $('#interaction-hint').textContent=next==='simulador'?'Simulador: execute eventos definidos no JSON.':'Editor: selecione qualquer elemento e modifique sua definição no JSON.';
 renderCurrent();
}
function refreshElementList(){
 const list=$('#element-list'),term=$('#element-filter').value.trim().toLowerCase();list.replaceChildren();
 const rows=elementosVisiveis.filter(x=>!term||(x.label+' '+x.tag+' '+x.fragment+' '+x.id).toLowerCase().includes(term));
 for(const e of rows){const op=document.createElement('option');op.value=e.id;op.textContent=e.fragment+' · '+e.tag.toLowerCase()+' · '+e.label;op.selected=e.id===elementoAtual;list.append(op)}
 if(!rows.length){const op=document.createElement('option');op.textContent='Nenhum elemento';op.disabled=true;list.append(op)}
}
function highlightElement(){
 const doc=frameDocument();if(!doc)return;
 $$('.lab-selected',doc).forEach(e=>e.classList.remove('lab-selected'));
 const selected=elementosVisiveis.find(e=>e.id===elementoAtual);
 if(selected){selected.el.classList.add('lab-selected');if(modo==='editor')selected.el.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});}
}
function editableLeaf(n){return n&&n.tag!=='input'&&Array.isArray(n.filhos)&&n.filhos.length===1&&
 (typeof n.filhos[0]==='string'||(plain(n.filhos[0])&&'ref' in n.filhos[0]));}
function selectElement(id){
 const x=elementosVisiveis.find(e=>e.id===id);if(!x)return;
 elementoAtual=id;highlightElement();refreshElementList();
 $('#element-meta').textContent=x.tag.toLowerCase()+' · '+x.fragment+'\n'+id;
 const rule=current().estilos.elementos[id]||{},css=rule.css||{};
 $('#pos-x').value=rule.x??0;$('#pos-y').value=rule.y??0;
 $('#style-color').value=css.color||'';$('#style-background').value=css.backgroundColor||'';
 $('#font-size').value=css.fontSize?parseFloat(css.fontSize)||'':'';$('#style-width').value=css.width||'';
 const node=findNode(id),simple=editableLeaf(node);
 $('#element-text').disabled=!simple;
 $('#element-text').value=simple?textValue(evaluate(node.filhos[0],current())):'';
 const action=resolveAction(id,'click');$('#action-type').value=action?.tipo||'padrao';
 if(!Array.from($('#action-type').options).some(o=>o.value===$('#action-type').value))$('#action-type').value='padrao';
 renderActionDetail(action);
 switchTab('properties');
}
function writeStyles(){
 if(!elementoAtual)return;
 const css={};function assign(prop,val){if(val.trim())css[prop]=val.trim()}
 assign('color',$('#style-color').value);assign('backgroundColor',$('#style-background').value);assign('width',$('#style-width').value);
 const font=$('#font-size').value;if(font&&Number(font)>0&&Number(font)<=180)css.fontSize=String(font)+'px';
 const x=Number($('#pos-x').value)||0,y=Number($('#pos-y').value)||0;
 if(Math.abs(x)>1000||Math.abs(y)>1000){toast('Deslocamento máximo de 1000px');return;}
 current().estilos.elementos[elementoAtual]={x,y,css};
 const node=findNode(elementoAtual);
 if(editableLeaf(node)){
  const next=$('#element-text').value,existing=node.filhos[0];
  if(plain(existing)&&typeof existing.ref==='string')putPath(current(),existing.ref,next);
  else node.filhos[0]=next;
 }
 dirty();renderCurrent();
}
function renderActionDetail(action={}){
 const kind=$('#action-type').value,box=$('#action-detail');box.replaceChildren();
 if(kind==='padrao'||kind==='nenhuma'||kind==='menu'||kind==='alternarEstado')return;
 const title=document.createElement('label');title.className='field-label';
 const input=kind==='navegar'||kind==='mock'?document.createElement('select'):document.createElement('input');
 input.id='action-value';input.className='input';
 if(kind==='navegar'){
  title.textContent='Tela de destino';
  for(const [id,s] of Object.entries(projeto.telas)){const op=document.createElement('option');op.value=id;op.textContent=s.nome+' · '+id;input.append(op)}
  input.value=action?.destino||'advogado.home_advogado';
 }else if(kind==='mock'){
  title.textContent='Mock';
  for(const [id,m] of Object.entries(projeto.mocks)){const op=document.createElement('option');op.value=id;op.textContent=id+' — '+m.descricao;input.append(op)}
  input.value=action?.mockId||'advogado-teste';
 }else if(kind==='popup'){title.textContent='Título do pop-up';input.placeholder='Título';input.value=action?.titulo||'Meu pop-up'}
 box.append(title,input);
 if(kind==='popup'){
  const label=document.createElement('label');label.className='field-label';label.textContent='Mensagem';
  const msg=document.createElement('textarea');msg.className='input';msg.id='action-message';msg.style.minHeight='84px';msg.value=action?.mensagem||'Ação personalizada configurada pelo editor.';
  box.append(label,msg);
 }
}
function saveAction(){
 if(!elementoAtual){toast('Selecione um elemento');return;}
 const tipo=$('#action-type').value;
 if(tipo==='padrao'){
  const original=LAB_ORIGINAL.telas?.[telaAtual]?.interacoes?.[elementoAtual];
  if(original)current().interacoes[elementoAtual]=deepcopy(original);
  else delete current().interacoes[elementoAtual];
  dirty();toast('Interação original restaurada');return;
 }
 const acao={tipo};
 if(tipo==='navegar')acao.destino=$('#action-value').value;
 if(tipo==='mock')acao.mockId=$('#action-value').value;
 if(tipo==='popup'){acao.titulo=$('#action-value').value||'Pop-up';acao.mensagem=$('#action-message').value||'';}
 if(tipo==='alternarEstado')acao.campo='online';
 if(tipo==='menu')acao.modo='abrir';
 const ref='editor_'+elementoAtual.replace(/[^\w-]/g,'_');
 current().acoes[ref]=acao;
 current().interacoes[elementoAtual]={evento:'click',acaoRef:ref};
 dirty();toast('Ação atualizada no JSON. Volte ao Simulador para testar.');
}
function loadJSONEditor(){
 const section=$('#json-section').value,s=current();
 const data=section==='projeto'?projeto:section==='tela'?s:s[section];
 $('#json-editor').value=JSON.stringify(data,null,2);
 $('#json-validation').textContent='';$('#json-validation').classList.remove('error');
}
function applyJSON(){
 const section=$('#json-section').value;let value;
 try{
  value=JSON.parse($('#json-editor').value);
  if(section==='projeto'){
   validate(value);projeto=value;if(!projeto.telas[telaAtual])telaAtual=projeto.inicial;
  }else if(section==='tela'){
   if(!plain(value)||value.id!==telaAtual)throw Error('Não altere tela.id neste bloco');
   const check=deepcopy(projeto);check.telas[telaAtual]=value;validate(check);projeto=check;
  }else{
   if(!plain(value))throw Error('Este bloco deve ser um objeto JSON');
   const check=deepcopy(projeto);check.telas[telaAtual][section]=value;validate(check);projeto=check;
  }
  elementoAtual=null;dirty();renderCurrent();
  $('#json-validation').textContent='Contrato válido; conteúdo aplicado e renderizado.';
  $('#json-validation').classList.remove('error');toast('JSON aplicado');
 }catch(err){$('#json-validation').textContent='Erro: '+err.message;$('#json-validation').classList.add('error');}
}
function formatJSON(){try{$('#json-editor').value=JSON.stringify(JSON.parse($('#json-editor').value),null,2)}catch(e){toast('JSON inválido: '+e.message)}}
function switchTab(name){
 $$('.inspector-tab').forEach(e=>e.classList.toggle('is-active',e.dataset.tab===name));
 $$('.inspector-view').forEach(e=>e.classList.toggle('is-active',e.id==='view-'+name));
 if(name==='json')loadJSONEditor();
}
