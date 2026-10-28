// Contrato de projeção local. Não infere PK, FK, tabelas nem cardinalidades ausentes.
const arr = v => Array.isArray(v) ? v : [];
const objects = v => v && typeof v==='object' && !Array.isArray(v) ? v : {};
export function projetar(catalogo){
 const entidades=new Map(),relacoes=new Map(),operacoes=[],fontes=[],telas={},avisos=[];
 for(const [telaId,tela] of Object.entries(catalogo.telas||{})){
  const dados=objects(tela.dados), persist=dados.persistencia;
  const declaration=Array.isArray(persist)?{entidades:persist}:objects(persist);
  const names=[];
  for(const raw of arr(declaration.entidades)){
    if(!raw||typeof raw!=='object')continue;
    const id=String(raw.id||raw.entidadeId||'').trim();
    if(!id){avisos.push({tela:telaId,tipo:'entidade-sem-id'});continue}
    names.push(id);
    const campos=arr(raw.campos).map(f=>typeof f==='string'?{id:f}:objects(f)).filter(f=>f.id);
    if(!entidades.has(id))entidades.set(id,{id,nome:raw.nome||id,dominio:raw.dominio||'nao_declarado',campos:[],telas:[],origens:[]});
    const ent=entidades.get(id);
    if(!ent.telas.includes(telaId))ent.telas.push(telaId);
    ent.origens.push(telaId);
    for(const field of campos){
      const prev=ent.campos.find(x=>x.id===field.id);
      if(!prev)ent.campos.push({...field});
      else if(JSON.stringify(prev)!==JSON.stringify(field))avisos.push({tela:telaId,tipo:'campo-divergente',entidade:id,campo:field.id});
    }
    if(ent.dominio!==(raw.dominio||'nao_declarado'))avisos.push({tela:telaId,tipo:'dominio-divergente',entidade:id});
  }
  for(const raw of arr(declaration.relacoes)){
    if(!raw||typeof raw!=='object')continue;
    const origem=raw.origem||raw.de||raw.entidadeOrigem;
    const destino=raw.destino||raw.para||raw.entidadeDestino;
    const id=raw.id||[origem,destino,raw.campo||raw.chave||''].join('::');
    if(origem&&destino)relacoes.set(id,{id,origem,destino,cardinalidade:raw.cardinalidade||null,campo:raw.campo||raw.chave||null,tela:telaId});
    else avisos.push({tela:telaId,tipo:'relacao-incompleta',id});
  }
  for(const o of arr(dados.operacoes))operacoes.push({...objects(o),tela:telaId});
  for(const f of arr(dados.fontes))fontes.push({...objects(f),tela:telaId});
  telas[telaId]={nome:tela.identidade?.nome||telaId,entidades:names};
 }
 const tabelaList=[...entidades.values()],relList=[...relacoes.values()];
 for(const r of relList)if(!entidades.has(r.origem)||!entidades.has(r.destino))avisos.push({tipo:'referencia-ausente',relacao:r.id});
 if(!tabelaList.length)avisos.push({tipo:'sem-modelagem',mensagem:'As telas ativas não declaram entidades detalhadas. Nenhuma tabela foi criada por inferência.'});
 return {origem:'catalogo/indice.json',modo:'canonico',telas,entidades:tabelaList,relacoes:relList,operacoes,fontes,avisos,sql:null};
}
export const agrupadas = proj => Object.groupBy ? Object.groupBy(proj.entidades,e=>e.dominio) : proj.entidades.reduce((a,e)=>((a[e.dominio]??=[]).push(e),a),{});
