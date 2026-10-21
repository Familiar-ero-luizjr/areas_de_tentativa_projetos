/* @REGIAO:COMPONENTES_E_RENDER — elementos da interface, sem dados duplicados */
App.criar = (tag, classe, texto)=>{
  const el=document.createElement(tag);
  if(classe)el.className=classe;
  if(texto!==undefined)el.textContent=String(texto);
  return el;
};
App.selecionar = function(id){
  this.selecionado=id;this.mostrarDetalhes(id);
  document.querySelectorAll('[data-select-id]').forEach(el=>{
    el.classList.toggle('selected',el.dataset.selectId===id);
    el.setAttribute('aria-current',el.dataset.selectId===id?'true':'false');
  });
};
App.mostrarDetalhes = function(id){
  const area=this.elemento('detailsContent');area.replaceChildren();
  const item=this.porId.get(id);
  if(!item){area.append(this.criar('div','details-empty','Selecione um item para ver detalhes e metadados.'));return;}
  area.append(this.criar('div','detail-label',item.tipo||'Item'));
  area.append(this.criar('h2',null,item.titulo));
  area.append(this.criar('p',null,item.descricao||'Nenhuma descrição disponível.'));
  const idTitle=this.criar('div','detail-key','IDENTIFICADOR ESTÁVEL');area.append(idTitle);
  area.append(this.criar('code',null,item.id));
  area.append(this.criar('div','detail-key','CAMINHO COMPLETO'));
  area.append(this.criar('p',null,this.caminhos.get(item.id)||item.titulo));
  for(const [key,value] of Object.entries(item.campos||{})){
    const row=this.criar('div','detail-field');
    row.append(this.criar('span',null,key),this.criar('span',null,typeof value==='string'?value:JSON.stringify(value,null,2)));
    area.append(row);
  }
  if(item.palavrasChave?.length){
    area.append(this.criar('div','detail-key','PALAVRAS-CHAVE'));
    area.append(this.criar('p',null,item.palavrasChave.join(' · ')));
  }
};
App.criarItemArvore = function(item){
  const li=this.criar('li','tree-node');
  const linha=this.criar('div','tree-entry');
  const filhos=this.filhos.get(item.id)||[];
  const toggle=this.criar('button','tree-toggle',filhos.length?'▸':'·');
  toggle.type='button';toggle.disabled=!filhos.length;
  toggle.setAttribute('aria-label',filhos.length?'Expandir '+item.titulo:'Sem filhos');
  toggle.setAttribute('aria-expanded',this.expandido.has(item.id)?'true':'false');
  const button=this.criar('button','node-btn');button.type='button';button.dataset.selectId=item.id;
  button.append(this.criar('span','node-symbol',filhos.length?'▣':'▤'));
  button.append(document.createTextNode(item.titulo));
  if(item.tipo)button.append(this.criar('span','node-secondary',item.tipo));
  linha.append(toggle,button);li.append(linha);
  const sub=this.criar('ul','tree-children');li.append(sub);
  const preencher=()=>{
    sub.replaceChildren();
    const limite=100;let visiveis=limite;
    const acrescentar=(começo,final)=>{
      const fragmento=document.createDocumentFragment();
      for(let i=começo;i<final;i++)fragmento.append(this.criarItemArvore(filhos[i]));
      sub.append(fragmento);
    };
    acrescentar(0,Math.min(visiveis,filhos.length));
    if(filhos.length>visiveis){
      const mais=this.criar('button','btn btn-more',`Mostrar mais (${filhos.length-visiveis})`);
      mais.type='button';sub.append(mais);
      mais.addEventListener('click',()=>{
        const anterior=visiveis;visiveis=Math.min(visiveis+limite,filhos.length);
        sub.removeChild(mais);acrescentar(anterior,visiveis);
        if(visiveis<filhos.length){mais.textContent=`Mostrar mais (${filhos.length-visiveis})`;sub.append(mais);}
      });
    }
  };
  toggle.addEventListener('click',()=>{
    if(this.expandido.has(item.id)){
      this.expandido.delete(item.id);sub.replaceChildren();toggle.textContent='▸';toggle.setAttribute('aria-expanded','false');
    }else{
      this.expandido.add(item.id);preencher();toggle.textContent='▾';toggle.setAttribute('aria-expanded','true');
    }
  });
  if(this.expandido.has(item.id)){preencher();toggle.textContent='▾';toggle.setAttribute('aria-expanded','true');}
  return li;
};
App.renderArvore=function(){
  const content=this.elemento('content');content.replaceChildren();
  const roots=this.filhos.get(null)||[];
  if(!roots.length){content.append(this.criar('div','empty','Não há itens para apresentar.'));return;}
  const ul=this.criar('ul','tree');content.append(ul);
  let exibidos=0;const inserir=(limite)=>{
    const fragmento=document.createDocumentFragment();
    const fim=Math.min(exibidos+limite,roots.length);
    for(let i=exibidos;i<fim;i++)fragmento.append(this.criarItemArvore(roots[i]));
    ul.append(fragmento);exibidos=fim;
  };
  inserir(100);
  if(exibidos<roots.length){const mais=this.elemento('showMore');mais.hidden=false;mais.textContent=`Mais raízes (${roots.length-exibidos})`;mais.onclick=()=>{
    inserir(100);mais.hidden=exibidos>=roots.length;mais.textContent=`Mais raízes (${roots.length-exibidos})`;
  };}
};
App.renderCards = function(){
  const content=this.elemento('content');content.replaceChildren();
  const items=this.modelo.itens;
  if(!items.length){content.append(this.criar('div','empty','Não há itens para apresentar.'));return;}
  const cards=this.criar('div','cards');content.append(cards);
  const desenhar=()=>{
    const fragmento=document.createDocumentFragment();
    for(let i=cards.childElementCount;i<Math.min(this.paginaAtual,items.length);i++){
      const item=items[i];const botao=this.criar('button','card-btn');botao.type='button';botao.dataset.selectId=item.id;
      botao.append(this.criar('span','card-kicker',item.tipo||'Módulo'));
      botao.append(this.criar('span','card-title',item.titulo));
      botao.append(this.criar('span','card-desc',item.descricao||'Selecione para consultar os dados.'));
      fragmento.append(botao);
    }
    cards.append(fragmento);
    const mais=this.elemento('showMore');mais.hidden=this.paginaAtual>=items.length;
    mais.textContent=`Mostrar mais (${Math.max(0,items.length-this.paginaAtual)})`;
  };
  desenhar();
  this.elemento('showMore').onclick=()=>{this.paginaAtual+=this.pagina;desenhar();};
};
App.renderNormal = function(){
  this.elemento('showMore').hidden=true;
  this.elemento('searchInput').value='';
  this.elemento('expandAll').disabled=this.modelo.projeto.modo!=='arvore';
  this.elemento('collapseAll').disabled=this.modelo.projeto.modo!=='arvore';
  this.paginaAtual=this.pagina;
  if(this.modelo.projeto.modo==='arvore')this.renderArvore();else this.renderCards();
  this.anunciar(`${this.modelo.itens.length.toLocaleString('pt-BR')} itens disponíveis · pesquisa por título, caminho e conteúdo`);
};
