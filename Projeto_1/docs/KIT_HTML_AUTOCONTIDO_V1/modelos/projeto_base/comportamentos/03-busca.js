/* @REGIAO:BUSCA — índice em memória + lotes progressivos + cancelamento */
App.programarBusca = function(){
  clearTimeout(this.timerBusca);
  this.timerBusca=setTimeout(()=>this.buscar(),190);
};
App.buscar = function(){
  const termo=this.normalizar(this.elemento('searchInput').value.trim());
  this.tokenBusca++;
  if(!termo){this.buscaAtiva=false;this.resultados=[];this.renderNormal();return;}
  const modo=this.elemento('searchMode').value;
  this.buscaAtiva=true;this.resultados=[];this.paginaAtual=this.pagina;
  const token=this.tokenBusca;
  const indice=this.indice;
  let offset=0;
  this.elemento('showMore').hidden=true;
  this.elemento('content').replaceChildren();
  this.anunciar('Pesquisando no índice…');
  const passo=()=>{
    if(token!==this.tokenBusca)return;
    const fim=Math.min(offset+500,indice.length);
    for(let i=offset;i<fim;i++){
      const r=indice[i];
      if((modo==='all'&&(r.nome.includes(termo)||r.conteudo.includes(termo)))||
         (modo==='name'&&r.nome.includes(termo))||
         (modo==='content'&&r.conteudo.includes(termo)))this.resultados.push(r.id);
    }
    offset=fim;
    if(offset<indice.length){setTimeout(passo,0);return;}
    this.desenharResultados();
  };
  passo();
};
App.desenharResultados = function(){
  const content=this.elemento('content');content.replaceChildren();
  const n=this.resultados.length;
  this.anunciar(`${n.toLocaleString('pt-BR')} resultado(s) · ${this.modelo.itens.length.toLocaleString('pt-BR')} itens indexados`);
  if(!n){content.append(this.criar('div','empty','Nenhum resultado. Experimente outro termo ou filtro.'));this.elemento('showMore').hidden=true;return;}
  content.append(this.criar('div','results-count',`Exibindo até ${Math.min(n,this.paginaAtual)} de ${n} resultados`));
  const results=this.criar('div');content.append(results);
  const inserir=()=>{
    const start=results.childElementCount, end=Math.min(n,this.paginaAtual);
    const fragmento=document.createDocumentFragment();
    for(let i=start;i<end;i++){
      const id=this.resultados[i],it=this.porId.get(id);
      const botao=this.criar('button','search-row');botao.type='button';botao.dataset.selectId=id;
      botao.append(this.criar('strong',null,it.titulo));
      botao.append(this.criar('span',null,this.caminhos.get(id)));
      fragmento.append(botao);
    }
    results.append(fragmento);
    content.firstChild.textContent=`Exibindo ${Math.min(n,this.paginaAtual)} de ${n} resultados`;
    const mais=this.elemento('showMore');mais.hidden=this.paginaAtual>=n;
    mais.textContent=`Mostrar mais (${Math.max(n-this.paginaAtual,0)})`;
  };
  inserir();
  this.elemento('showMore').onclick=()=>{this.paginaAtual+=this.pagina;inserir();};
};
