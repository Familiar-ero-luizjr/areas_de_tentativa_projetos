/* Banco V7: lê o catálogo do disco. Não cria dados fictícios. */
(async () => {
  const status = document.getElementById('viewContent');
  try {
    const response = await fetch('./dados/manifest.json', {cache:'no-store'});
    if (!response.ok) throw new Error('Não foi possível ler dados/manifest.json (' + response.status + ')');
    const manifest = await response.json();
    const indice = manifest.indice;
    if (!indice || !Array.isArray(indice.telas) || !Array.isArray(indice.componentes)) {
      throw new Error('Manifest inválido: esperado indice.telas[] e indice.componentes[].');
    }
    const catalogo = {indice:{telas:[],componentes:[]},telas:{},componentes:{},origem:'dados/manifest.json'};
    const ids = new Set();
    for (const tipo of ['telas','componentes']) {
      for (const item of indice[tipo]) {
        if (!item || typeof item.id !== 'string' || typeof item.arquivo !== 'string')
          throw new Error('Entrada inválida em indice.' + tipo + ': ID e arquivo obrigatórios.');
        if (ids.has(tipo + ':' + item.id)) throw new Error('ID duplicado: ' + item.id);
        ids.add(tipo + ':' + item.id);
        // Restringir à própria pasta de tipo para impedir travessia de caminho.
        const expectedPrefix = tipo + '/';
        if (!item.arquivo.startsWith(expectedPrefix) || item.arquivo.split('/').includes('..') || !item.arquivo.endsWith('.json'))
          throw new Error('Caminho não permitido: ' + item.arquivo);
        const res = await fetch('./' + item.arquivo, {cache:'no-store'});
        if (!res.ok) throw new Error('Erro ao ler ' + item.arquivo + ' (' + res.status + ')');
        const record = await res.json();
        if (record?.identidade?.id !== item.id)
          throw new Error('Identidade divergente: ' + item.arquivo);
        catalogo[tipo][item.id] = record;
        catalogo.indice[tipo].push({id:item.id,arquivo:item.arquivo});
      }
    }
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
