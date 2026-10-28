// Código próprio deste módulo. Compartilha somente os JSONs do Catálogo ativo.
// Se mover esta pasta para outra profundidade, ajuste apenas a constante ROOT abaixo.
// Única porta de leitura/escrita do catálogo ativo. Acervo pendente nunca é consultado aqui.
const ROOT=new URL('../../../../',import.meta.url);
const KEY='advogadoja.v6.prototipo.rascunho.';
const fetchJSON=async path=>{const r=await fetch(new URL(path,ROOT),{cache:'no-store'});if(!r.ok)throw Error(`${r.status} · ${path}`);return r.json()};
export const urlRaiz=ROOT;
export const arquivoRaiz=p=>new URL(p,ROOT).href;
export async function carregarCatalogo(){
 const indice=await fetchJSON('catalogo/indice.json');const telas={};const componentes={};
 for(const tipo of ['telas','componentes'])for(const ref of indice[tipo]){
  const raw=await fetchJSON('catalogo/'+ref.arquivo);
  const overlay=localStorage.getItem(KEY+ref.id);
  const obj=overlay?JSON.parse(overlay):raw;
  if(obj.identidade?.id!==ref.id)throw Error('Identidade divergente de índice: '+ref.id);
  (tipo==='telas'?telas:componentes)[ref.id]=obj;
 }
 return {indice,telas,componentes,origem:'catalogo/indice.json'};
}
export async function salvarRegistro(tipo,id,registro){
 if(!['telas','componentes'].includes(tipo))throw Error('Tipo inválido');
 if(registro?.identidade?.id!==id)throw Error('O ID do registro não pode ser alterado ao salvar.');
 const dados=await carregarCatalogo();
 if(!dados.indice[tipo].some(x=>x.id===id))throw Error('Registro fora do índice ativo.');
 const r=await fetch(new URL('api/catalogo/salvar',ROOT),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tipo,id,registro})}).catch(()=>null);
 if(r?.ok){localStorage.removeItem(KEY+id);return {modo:'arquivo',mensagem:'Salvo no arquivo JSON do catálogo ativo pelo servidor local.'}}
 if(r && ![404,405,501].includes(r.status)){let message='O servidor rejeitou a alteração ('+r.status+')';try{message=(await r.json()).erro||message}catch{}throw Error(message)}
 localStorage.setItem(KEY+id,JSON.stringify(registro));return {modo:'navegador',mensagem:'Salvo apenas neste navegador. Exporte o registro para atualizar o arquivo físico; ou use python iniciar.py.'};
}
export function limparRascunho(id){localStorage.removeItem(KEY+id)}
export function baixar(nome,conteudo,mime='application/json'){const b=new Blob([conteudo],{type:mime+';charset=utf-8'});baixarBlob(nome,b)}
export function baixarBlob(nome,blob){const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=nome;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1200)}
export const stringify=obj=>JSON.stringify(obj,null,2)+'\n';
export function montarPacote(catalogo,ids){
 const telas={}; const componentes={}; const idsComps=new Set();
 for(const id of ids){const t=catalogo.telas[id];if(!t)continue;telas[id]=t;for(const inst of t.componentes?.instancias||[])idsComps.add(inst.ref)}
 for(const id of idsComps){const c=catalogo.componentes[id];if(c)componentes[id]=c}
 return {schema:'advogadoja.intercambio.v6-provisorio',fonte:'catalogo-ativo-v6',escopo:{telas:Object.keys(telas),componentes:Object.keys(componentes)},telas,componentes,observacao:'Pacote editável, não fonte mestre; revisão por ID antes de aplicar.'};
}
