/* Conector: lê manifesto e JSONs, valida IDs e compõe o pacote sem alterar dados de tela. */
(async () => {
  'use strict';
  const status = document.getElementById('count');
  const fail = message => { status.textContent = 'Falha no carregamento: ' + message; status.style.color = '#a22d2d'; console.error(message); };
  async function readJson(url) {
    const response = await fetch(url, {cache:'no-cache'});
    if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
    return response.json();
  }
  try {
    status.textContent = 'Carregando os JSONs das telas…';
    const manifest = await readJson('dados/manifest.json');
    if (!Array.isArray(manifest.telas)) throw new Error('Manifesto sem lista de telas');
    const seen = new Set();
    for (const entry of manifest.telas) {
      if (!entry.id || !/^telas\/[a-z0-9_./-]+\.json$/i.test(entry.arquivo) || entry.arquivo.includes('..') || seen.has(entry.id))
        throw new Error('Entrada inválida/duplicada no manifesto: ' + entry.id);
      seen.add(entry.id);
    }
    const telas = await Promise.all(manifest.telas.map(async item => {
      const tela = await readJson(item.arquivo);
      if (tela.identidade?.id !== item.id) throw new Error('ID divergente: ' + item.arquivo);
      return tela;
    }));
    window.__JORNADAS_SOURCE__ = {
      schema: manifest.pacoteSchema,
      origem: manifest.origem,
      fluxoFonte: manifest.fluxoFonte,
      telas
    };
    const script = document.createElement('script');
    script.src = 'visualizador/app.js';
    script.onerror = () => fail('Não foi possível carregar o visualizador.');
    document.body.appendChild(script);
  } catch (error) {
    fail(error.message + (location.protocol === 'file:' ? ' — abra por um servidor HTTP local (veja README.md).' : ''));
  }
})();
