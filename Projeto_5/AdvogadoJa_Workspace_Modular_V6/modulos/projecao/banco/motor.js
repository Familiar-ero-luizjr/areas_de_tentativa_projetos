/** Motor privado do Banco. Sem fetch e sem catálogo atual. */
export function criarMotorBanco(modelo){
  const D=modelo,tabelas=D.tables||{},todasTabelas=Object.keys(tabelas),degree={};
  for(const [a,b] of D.relations||[]){degree[a]=(degree[a]||0)+1;degree[b]=(degree[b]||0)+1;}
  const nomes={core:'Cadastros base',client:'Organização',lawyer:'Itens e categorias',student:'Pedidos',billing:'Financeiro',admin:'Registros'};
  function groupOf(id){return tabelas[id]?.group||'core';}
  function groupLabel(id){return nomes[groupOf(id)]||groupOf(id);}
  function getRelations(id){return (D.relations||[]).filter(r=>r[0]===id||r[1]===id);}
  function relatedScreenKeys(id){return Object.entries(D.screenMap||{}).filter(([,ts])=>ts.includes(id)).map(([key])=>key);}
  function domIds(g){return todasTabelas.filter(id=>groupOf(id)===g);}
  return {groupOf,groupLabel,getRelations,relatedScreenKeys,domIds,degree};
}
