const base = new URL('../', import.meta.url);
async function carregarJSON(caminho){
 const url = new URL(caminho,base);
 const resposta=await fetch(url,{cache:'default'});
 if(!resposta.ok) throw Error(`Não foi possível ler ${caminho} (HTTP ${resposta.status})`);
 return resposta.json();
}
export async function carregarManifest(){return carregarJSON('dados/manifest.json')}
const cacheLaboratorios=new Map();
export async function montarLaboratorio(chave, manifest, force=false){
 if(force)cacheLaboratorios.delete(chave);
 if(cacheLaboratorios.has(chave))return cacheLaboratorios.get(chave);
 const task=montarInterno(chave,manifest);
 cacheLaboratorios.set(chave,task);
 try{return await task}catch(e){cacheLaboratorios.delete(chave);throw e}
}
async function montarInterno(chave, manifest){
 const cfg=manifest.laboratorios[chave];if(!cfg)throw Error('Laboratório não encontrado: '+chave);
 const [modelo,interfaceDados]=await Promise.all([carregarJSON(cfg.arquivoModelo),carregarJSON(cfg.interface)]);
 const telas={};const componentes={};
 const jobs=[...Object.entries(cfg.telas).map(([id,path])=>({tipo:'tela',id,path})),...Object.entries(cfg.componentes).map(([id,path])=>({tipo:'componente',id,path}))];
 let next=0;
 await Promise.all(Array.from({length:Math.min(6,jobs.length)},async()=>{while(next<jobs.length){
  const job=jobs[next++],data=await carregarJSON(job.path);
  if(job.tipo==='tela')telas[job.id]=data;else componentes[job.id]=data;
 }}));
 modelo.telas=telas;if(Object.keys(componentes).length)modelo.componentes=componentes;
 return {config:cfg,modelo,interfaceDados};
}
export function criarDocumento({config,modelo,interfaceDados},token){
 // Manter motores originais isolados e informar o resultado da inicializacao ao contêiner.
 const escJSON=x=>JSON.stringify(x).replace(/</g,'\\u003c').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
 const escHTML=x=>String(x??'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
 const modelId=config.id==='cliente_v3'?'embeddedModel':'initialModel';
 const cssURL=new URL(config.estilo,base).href;
 const jsURL=new URL(config.motor,base).href;
 const baseURL=base.href;
 const signal=JSON.stringify({type:'advogadoja-lab-status',token});
 const boot='<script>window.__ajLabFailure=null;window.addEventListener("error",function(e){window.__ajLabFailure=String(e.message||"Falha de script");});<\\/script>'.replace('<\\/script>','</script>');
 const finish='<script>(function(){const m='+signal+';m.ok=!window.__ajLabFailure;m.error=window.__ajLabFailure;parent.postMessage(m,location.origin);})();<\\/script>'.replace('<\\/script>','</script>');
 const cssSource=modelId==='embeddedModel'?'<script type="text/plain" id="sourceCss">'+String(interfaceDados.sourceCss||'').replace(/<\\/script/gi,'&lt;/script')+'</script>':'';
 return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><base href="'+escHTML(baseURL)+'"><title>'+escHTML(interfaceDados.title)+'</title><link rel="stylesheet" href="'+escHTML(cssURL)+'"></head><body>'+interfaceDados.body+'<script type="application/json" id="'+modelId+'">'+escJSON(modelo)+'</script>'+cssSource+boot+'<script src="'+escHTML(jsURL)+'"></script>'+finish+'</body></html>';
}
