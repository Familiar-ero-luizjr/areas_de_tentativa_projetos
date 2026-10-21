/* @REGIAO:ACOES_E_INICIALIZACAO — interação, exportação e importação sem alterar o HTML-fonte */
App.exportar = function(){
  const dados={schema:'html.autocontido.dados.v1',versao:this.modelo.versao,itens:this.modelo.itens};
  const blob=new Blob([JSON.stringify(dados,null,2)],{type:'application/json;charset=utf-8'});
  const url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download=(this.modelo.projeto.id||'dados')+'.json';
  document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);
};
App.importar = async function(file){
  try{
    if(!file)return;
    const incoming=JSON.parse(await file.text());
    if(incoming.schema!=='html.autocontido.dados.v1'||!Array.isArray(incoming.itens))throw Error('Schema/itens incompatíveis');
    const current=new Map(this.modelo.itens.map(it=>[it.id,it]));
    for(const it of incoming.itens)current.set(it.id,it);
    const merged=[...current.values()];this.validar(merged);
    if(!window.confirm(`Importar ${incoming.itens.length} item(ns) por ID, atualizando os existentes e preservando os demais? A alteração ficará somente nesta sessão até exportar JSON.`))return;
    this.modelo.itens=merged;
    this.construirIndices();this.buscaAtiva=false;
    this.elemento('searchInput').value='';this.renderNormal();this.mostrarDetalhes(null);
    this.anunciar(`${incoming.itens.length} itens importados/atualizados por ID · exporte JSON para salvar a nova versão.`);
  }catch(err){this.anunciar('Falha na importação: '+err.message);}
};
App.iniciar = function(){
  try{
    this.carregar(JSON.parse(this.elemento('app-data').textContent));
    this.elemento('appTitle').textContent=this.titulo();
    this.elemento('modePill').textContent={'arvore':'Árvore','modulos':'Módulos','aplicacao':'Aplicação'}[this.modelo.projeto.modo]+' · offline';
    this.elemento('appDescription').textContent='Artefato independente · '+this.modelo.itens.length.toLocaleString('pt-BR')+' itens · busca indexada e atualização por ID';
    this.elemento('searchInput').addEventListener('input',()=>this.programarBusca());
    this.elemento('searchMode').addEventListener('change',()=>this.programarBusca());
    this.elemento('clearSearch').addEventListener('click',()=>{this.elemento('searchInput').value='';this.buscar();this.elemento('searchInput').focus();});
    this.elemento('content').addEventListener('click',(e)=>{
      const botao=e.target.closest('[data-select-id]');
      if(botao&&this.elemento('content').contains(botao))this.selecionar(botao.dataset.selectId);
    });
    this.elemento('expandAll').addEventListener('click',()=>{
      if(this.modelo.projeto.modo!=='arvore'||this.buscaAtiva)return;
      for(const it of this.filhos.get(null)||[])this.expandido.add(it.id);
      this.renderArvore();
      this.anunciar('Primeiro nível expandido; outras ramificações continuam sob demanda.');
    });
    this.elemento('collapseAll').addEventListener('click',()=>{this.expandido.clear();this.buscaAtiva?this.desenharResultados():this.renderNormal();});
    this.elemento('exportData').addEventListener('click',()=>this.exportar());
    this.elemento('importData').addEventListener('click',()=>this.elemento('importFile').click());
    this.elemento('importFile').addEventListener('change',async(e)=>{await this.importar(e.target.files?.[0]);e.target.value='';});
    this.renderNormal();
  }catch(e){this.anunciar('Erro ao inicializar: '+e.message);this.elemento('content').textContent='Não foi possível carregar os dados. Verifique o JSON embarcado.';}
};
App.iniciar();
