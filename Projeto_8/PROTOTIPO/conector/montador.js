const base = new URL('../', import.meta.url);
async function carregarJSON(caminho){
 const url = new URL(caminho,base);
 const resposta=await fetch(url,{cache:'no-store'});
 if(!resposta.ok) throw Error(`Não foi possível ler ${caminho} (HTTP ${resposta.status})`);
 return resposta.json();
}
export async function carregarManifest(){return carregarJSON('dados/manifest.json')}
export async function montarLaboratorio(chave, manifest){
 const cfg=manifest.laboratorios[chave];if(!cfg)throw Error('Laboratório não encontrado: '+chave);
 const [modelo,interfaceDados]=await Promise.all([carregarJSON(cfg.arquivoModelo),carregarJSON(cfg.interface)]);
 const telas={};const componentes={};
 await Promise.all(Object.entries(cfg.telas).map(async ([id,path])=>{telas[id]=await carregarJSON(path)}));
 await Promise.all(Object.entries(cfg.componentes).map(async ([id,path])=>{componentes[id]=await carregarJSON(path)}));
 modelo.telas=telas;if(Object.keys(componentes).length)modelo.componentes=componentes;
 return {config:cfg,modelo,interfaceDados};
}
export function criarDocumento({config,modelo,interfaceDados}){
 // O isolamento do iframe mantém IDs, CSS e listeners originais independentes.
 const escJSON=x=>JSON.stringify(x).replace(/</g,'\\u003c').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028');
 const modelId=config.id==='cliente_v3'?'embeddedModel':'initialModel';
 const cssURL=new URL(config.estilo,base).href;
 const jsURL=new URL(config.motor,base).href;
 const baseURL=base.href;
 return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><base href="${baseURL}"><title>${interfaceDados.title}</title><link rel="stylesheet" href="${cssURL}"></head><body>${interfaceDados.body}<script type="application/json" id="${modelId}">${escJSON(modelo)}</script>${modelId==='embeddedModel'?`<script type="text/plain" id="sourceCss">${interfaceDados.sourceCss.replace(/<\/script/gi,'<\\/script')}</script>`:''}<script src="${jsURL}"><\/script></body></html>`.replace('<\\/script>','</script>');
}
