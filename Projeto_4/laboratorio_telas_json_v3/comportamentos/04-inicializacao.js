/* 04 · Eventos de interface, importação, exportação e inicialização */
function setup(){
 validate(projeto);
 $('#mode-sim').onclick=()=>setMode('simulador');$('#mode-edit').onclick=()=>setMode('editor');$('#mode-tree').onclick=()=>setMode('arvore');
 $('#restart-button').onclick=()=>{runtime.form={};elementoAtual=null;telaAtual=projeto.inicial;renderCurrent();toast('Simulação reiniciada')};
 $('#go-login').onclick=()=>{telaAtual=projeto.inicial;elementoAtual=null;runtime.form={};renderCurrent()};
 $('#mock-button').onclick=()=>{if(telaAtual!=='auth.sessao.entrar'){telaAtual='auth.sessao.entrar';elementoAtual=null;renderCurrent();frame.addEventListener('load',()=>applyMock('advogado-teste'),{once:true})}else applyMock('advogado-teste')};
 $('#add-client').onclick=()=>{const s=projeto.telas['cliente.home_cliente'];if(s){s.ativa=true;dirty();renderScreenList();toast('Home Cliente adicionada às telas de teste.')}};
 $('#viewport-mobile').onclick=()=>$('#device-shell').classList.remove('wide');
 $('#viewport-desktop').onclick=()=>$('#device-shell').classList.add('wide');
 $('#element-filter').oninput=refreshElementList;
 $('#element-list').onchange=e=>selectElement(e.target.value);
 for(const id of editorFields){const el=$('#'+id);if(!el)continue;el.addEventListener('change',writeStyles)}
 $('#clear-styles').onclick=()=>{if(!elementoAtual)return;delete current().estilos.elementos[elementoAtual];dirty();renderCurrent();toast('Estilos do elemento restaurados')};
 $('#action-type').onchange=()=>renderActionDetail();$('#save-action').onclick=saveAction;
 for(const e of $$('.inspector-tab'))e.onclick=()=>switchTab(e.dataset.tab);
 $('#json-section').onchange=loadJSONEditor;$('#json-apply').onclick=applyJSON;$('#json-format').onclick=formatJSON;
 $('#json-copy').onclick=()=>navigator.clipboard?.writeText($('#json-editor').value).then(()=>toast('JSON copiado')).catch(()=>toast('Selecione e copie o texto manualmente'));
 $('#export-button').onclick=()=>{downloadText('advogadoja_laboratorio_projeto_completo_v3.json',JSON.stringify(projeto,null,2));alterado=false;$('#save-status').textContent='Projeto exportado';$('#save-status').style.color='#21805d';};
 $('#import-file').onchange=handleImportFile;
 $('#reset-button').onclick=()=>{if(alterado&&!confirm('Restaurar a base original e descartar alterações não exportadas?'))return;projeto=deepcopy(LAB_ORIGINAL);telaAtual=projeto.inicial;runtime.form={};elementoAtual=null;alterado=false;$('#save-status').textContent='Base original';$('#save-status').style.color='';renderCurrent();loadJSONEditor();toast('Configurações originais restauradas')};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){closePopup()}});
 window.addEventListener('beforeunload',e=>{if(alterado){e.preventDefault();e.returnValue=''}});
 setupTreeControls();
 renderCurrent();
}
setup();
