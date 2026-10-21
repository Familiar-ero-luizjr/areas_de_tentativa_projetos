/* @REGIAO:ESTADO_E_INDICES — sem acesso ao DOM para dados arbitrários */
'use strict';
const App = {
  modelo: null,
  porId: new Map(), filhos: new Map(), caminhos: new Map(), indice: [],
  selecionado: null, buscaAtiva: false, resultados: [], pagina: 80,
  paginaAtual: 80, tokenBusca: 0, expandido: new Set(),
  elemento(id){return document.getElementById(id)},
  normalizar(v){return String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR')},
  camposComoTexto(it){return [it.descricao||'',JSON.stringify(it.campos||{}),...(it.palavrasChave||[])].join(' ')},
  validar(itens){
    if(!Array.isArray(itens))throw Error('O JSON deve conter uma lista de itens');
    const mapa = new Map();
    for(const it of itens){
      if(!it || typeof it.id!=='string' || !it.id.trim() || typeof it.titulo!=='string' || !it.titulo.trim())throw Error('Um item está sem ID ou título válido');
      if(mapa.has(it.id))throw Error('ID duplicado: '+it.id);
      if(it.parentId!=null && typeof it.parentId!=='string')throw Error('parentId inválido: '+it.id);
      if(it.campos!==undefined && (!it.campos || Array.isArray(it.campos) || typeof it.campos!=='object'))throw Error('Campos inválidos: '+it.id);
      if(it.palavrasChave!==undefined && (!Array.isArray(it.palavrasChave)||it.palavrasChave.some(x=>typeof x!=='string')))throw Error('Palavras-chave inválidas: '+it.id);
      mapa.set(it.id,it);
    }
    const verificados=new Set();
    for(const it of itens){
      if(it.parentId!=null && !mapa.has(it.parentId))throw Error('Pai ausente: '+it.id+' → '+it.parentId);
      const passando = new Set();let p=it.id;
      while(p!=null && !verificados.has(p)){
        if(passando.has(p))throw Error('Ciclo hierárquico: '+p);
        passando.add(p); p=mapa.get(p)?.parentId??null;
      }
      for(const id of passando)verificados.add(id);
    }
  },
  construirIndices(){
    const itens = this.modelo.itens;
    this.validar(itens);
    this.porId=new Map(itens.map(x=>[x.id,x]));
    this.filhos=new Map(); this.caminhos=new Map(); this.indice=[];
    for(const item of itens){
      const pai=item.parentId??null;
      if(!this.filhos.has(pai))this.filhos.set(pai,[]);
      this.filhos.get(pai).push(item);
    }
    const caminho=(id)=>{
      if(this.caminhos.has(id))return this.caminhos.get(id);
      const it=this.porId.get(id);
      const valor = (it.parentId?caminho(it.parentId)+'/':'')+it.titulo;
      this.caminhos.set(id,valor);return valor;
    };
    for(const it of itens){
      const nome=this.normalizar(caminho(it.id));
      const conteudo=this.normalizar(this.camposComoTexto(it));
      this.indice.push({id:it.id,nome,conteudo});
    }
  },
  carregar(payload){
    if(payload?.schema!=='html.autocontido.dados.v1')throw Error('Schema de dados não reconhecido');
    this.modelo=payload; this.construirIndices();this.expandido.clear();
    this.buscaAtiva=false;this.resultados=[];this.paginaAtual=this.pagina;
    this.selecionado=null;
  },
  anunciar(m){this.elemento('status').textContent=m},
  titulo(){return this.modelo.projeto?.titulo||'HTML independente'}
};
