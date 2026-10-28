import {avaliar} from './regras.js';
export function compilarRelacoes(c){
 const nos=[],arestas=[],problemas=[],partes=new Map(),telas=new Map(Object.entries(c.telas));
 for(const [id,t] of telas)for(const p of t.navegacao?.participacoes||[]){if(partes.has(p.id))problemas.push({nivel:'erro',origem:id,mensagem:'ID de participação duplicado: '+p.id}); const n={...p,telaId:id,telaNome:t.identidade.nome};nos.push(n);partes.set(p.id,n)}
 const entrar=(dest,orig,a,condicao)=>{
  if(!dest)return;
  let alvo=dest.participacaoId?partes.get(dest.participacaoId):null;
  if(!alvo&&dest.telaId)alvo=nos.find(n=>n.telaId===dest.telaId)||null;
  if(!alvo)problemas.push({nivel:'erro',origem:orig.id,mensagem:`Destino ausente: ${dest.participacaoId||dest.telaId||dest.ref}`});
  arestas.push({id:orig.id+'::'+a.id+'::'+arestas.length,origem:orig.id,origemTela:orig.telaId,destino:alvo?.id||null,destinoTela:dest.telaId||alvo?.telaId||null,acaoId:a.id,evento:a.evento,quando:condicao||null,tipo:dest.tipo||'tela',resolvida:!!alvo});
 };
 for(const n of nos){const t=telas.get(n.telaId);for(const a of t.acoes?.itens||[]){
  if(a.destino)entrar(a.destino,n,a,null);
  for(const r of a.rotas||[])entrar(r.destino,n,a,r.quando);
 }}
 return {nos,arestas,problemas,entradas:nos.flatMap(n=>(telas.get(n.telaId).navegacao?.entradas||[]).filter(e=>e.participacaoId===n.id).map(e=>({...e,telaId:n.telaId}))),telas,partes};
}
export function resolverTransicao(c,{telaId,participacaoId,acaoId,dados={},estado=''}){
 const tela=c.telas[telaId];if(!tela)return {erro:'Tela ausente: '+telaId};
 const a=(tela.acoes?.itens||[]).find(a=>a.id===acaoId);if(!a)return {erro:'Ação ausente: '+acaoId};
 const base={acaoId:a.id,evento:a.evento,operacaoRef:a.operacaoRef||null};
 if(a.destino)return {...base,destino:a.destino};
 if(a.efeito)return {...base,efeito:a.efeito};
 if(a.rotas?.length){const ctx={...dados,estado:{id:estado},participacao:{id:participacaoId}};const encontradas=a.rotas.filter(r=>avaliar(r.quando,ctx));
  if(encontradas.length===1)return {...base,rota:encontradas[0].id,destino:encontradas[0].destino};
  if(encontradas.length>1)return {...base,erro:'Condições ambíguas: mais de uma rota satisfeita'};
  return {...base,semCorrespondencia:a.semCorrespondencia||null,erro:'Nenhuma rota corresponde aos dados informados'};
 }
 return {...base,erro:'Ação sem consequência declarada'};
}
export function ordenarParticipacoes(nos){return [...nos].sort((a,b)=>(a.jornada?.ordem??99)-(b.jornada?.ordem??99)||(a.subjornada?.ordem??99)-(b.subjornada?.ordem??99)||(a.ordemTela??99)-(b.ordemTela??99)||a.id.localeCompare(b.id))}
