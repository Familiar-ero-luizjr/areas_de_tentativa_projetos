/* Banco V7: lê o catálogo do disco. Não cria dados fictícios. */
(async () => {
  const status = document.getElementById('viewContent');
  try {
    const response = await fetch('./dados/manifest.json', {cache:'default'});
    if (!response.ok) throw new Error('Não foi possível ler dados/manifest.json (' + response.status + ')');
    const manifest = await response.json();
    const indice = manifest.indice;
    if (!indice || !Array.isArray(indice.telas) || !Array.isArray(indice.componentes)) {
      throw new Error('Manifest inválido: esperado indice.telas[] e indice.componentes[].');
    }
    const catalogo = {indice:{telas:[],componentes:[]},telas:{},componentes:{},origem:'dados/manifest.json'};
    const ids = new Set();
    const tasks=[];
    for (const tipo of ['telas','componentes']) {
      for (const item of indice[tipo]) {
        if (!item || typeof item.id !== 'string' || typeof item.arquivo !== 'string')
          throw new Error('Entrada inválida em indice.' + tipo + ': ID e arquivo obrigatórios.');
        if (ids.has(tipo + ':' + item.id)) throw new Error('ID duplicado: ' + item.id);
        ids.add(tipo + ':' + item.id);
        if (!item.arquivo.startsWith(tipo + '/') || item.arquivo.split('/').includes('..') || !item.arquivo.endsWith('.json'))
          throw new Error('Caminho não permitido: ' + item.arquivo);
        tasks.push({tipo,item});
      }
    }
    let next=0;
    await Promise.all(Array.from({length:Math.min(6,tasks.length)},async()=>{
      while(next<tasks.length){
        const {tipo,item}=tasks[next++];
        const res=await fetch('./'+item.arquivo,{cache:'default'});
        if(!res.ok)throw new Error('Erro ao ler '+item.arquivo+' ('+res.status+')');
        const record=await res.json();
        if(record?.identidade?.id!==item.id)throw new Error('Identidade divergente: '+item.arquivo);
        catalogo[tipo][item.id]=record;
      }
    }));
    for(const tipo of ['telas','componentes'])
      catalogo.indice[tipo]=indice[tipo].map(({id,arquivo})=>({id,arquivo}));
    window.__BANCO_CATALOGO__ = catalogo;
    const script = document.createElement('script');
    script.src = './visualizador/app.js';
    script.onerror = () => { if(status) status.textContent='Erro ao carregar visualizador/app.js'; };
    document.body.appendChild(script);
  } catch (error) {
    console.error('Falha ao montar Banco V7',error);
    if(status) status.textContent='Erro ao carregar catálogo: ' + error.message + '. Execute em servidor HTTP local.';
  }
})();
