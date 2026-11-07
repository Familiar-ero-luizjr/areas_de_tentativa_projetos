// Carrega os arquivos modulares e entrega um pacote ao visualizador.
// Dados de tela, glossário, esquema e documentação são independentes.
(async function montarContrato() {
  const msg = document.getElementById('carregamento');
  try {
    async function carregar(path) {
      const resposta = await fetch(new URL(path, document.baseURI), {cache:'no-store'});
      if (!resposta.ok) throw new Error(`Falha em ${path} (HTTP ${resposta.status})`);
      return resposta.json();
    }
    const manifest = await carregar('dados/manifest.json');
    if (!Array.isArray(manifest.telas) || !manifest.telas.length) throw new Error('Manifesto sem telas');
    const [telas, schema, glossary, doc] = await Promise.all([
      Promise.all(manifest.telas.map(t => carregar(t.arquivo))),
      carregar(manifest.modelo), carregar(manifest.glossario), carregar(manifest.documentacao)
    ]);
    const pacoteTelas = {};
    for (const tela of telas) {
      for (const [id, conteudo] of Object.entries(tela)) {
        if (Object.hasOwn(pacoteTelas,id)) throw new Error('ID duplicado: '+id);
        if (!conteudo?.tela || !conteudo?.componentes) throw new Error('Contrato de tela inválido: '+id);
        pacoteTelas[id] = conteudo;
      }
    }
    if (!schema || schema.kind !== 'object') throw new Error('Modelo de contrato inválido');
    if (!glossary || !glossary.campos) throw new Error('Glossário inválido');
    if (!doc?.documento || !Array.isArray(doc.secoes)) throw new Error('Documentação inválida');
    window.__CONTRACT_DATA={DEFAULT_HOME:pacoteTelas,DEFAULT_SCHEMA:schema,DEFAULT_GLOSSARY:glossary,DEFAULT_DOCUMENT:doc};
    const script=document.createElement('script');script.src='visualizador/app.js';
    script.onload=()=>{msg.hidden=true};
    script.onerror=()=>{msg.textContent='Falha ao carregar o aplicativo de apresentação.'};
    document.body.append(script);
  } catch(err) {
    msg.hidden=false;
    msg.textContent='Não foi possível montar o contrato: '+err.message+' — Execute por servidor local (ex.: python -m http.server 8000).';
    msg.className='status err';
    console.error(err);
  }
})();
