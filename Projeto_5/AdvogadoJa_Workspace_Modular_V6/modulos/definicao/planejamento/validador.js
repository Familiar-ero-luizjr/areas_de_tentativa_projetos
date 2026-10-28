import {compilarRelacoes} from './resolvedor.js';
export function auditar(c){const problemas=[],ids=new Set(),ordens=new Map();let actions=0;
 for(const [id,t] of Object.entries(c.telas)){
  if(t.identidade?.id!==id)problemas.push({nivel:'erro',origem:id,mensagem:'ID do registro divergente'});
  if('flow' in t)problemas.push({nivel:'erro',origem:id,mensagem:'Seção flow não permitida no novo contrato'});
  for(const p of t.navegacao?.participacoes||[]){if(ids.has(p.id))problemas.push({nivel:'erro',origem:id,mensagem:'Participação repetida: '+p.id});ids.add(p.id);for(const [qual,meta] of [['jornada',p.jornada],['subjornada',p.subjornada]]){if(!meta?.id||!meta.nome||typeof meta.ordem!=='number')problemas.push({nivel:'aviso',origem:id,mensagem:qual+' sem ID, nome ou ordem explícita'});else {const chave=qual+':'+meta.id;const antes=ordens.get(chave);if(antes&&(antes.nome!==meta.nome||antes.ordem!==meta.ordem))problemas.push({nivel:'erro',origem:id,mensagem:'Inconsistência de metadados para '+meta.id});ordens.set(chave,meta)}}}
  for(const inst of t.componentes?.instancias||[])if(!c.componentes[inst.ref])problemas.push({nivel:'erro',origem:id,mensagem:'Componente não encontrado: '+inst.ref});
  for(const a of t.acoes?.itens||[]){actions++;if(!a.id||!a.evento)problemas.push({nivel:'aviso',origem:id,mensagem:'Ação sem ID ou evento'});if(a.operacaoRef&&!((t.dados?.operacoes||[]).some(o=>o.id===a.operacaoRef)))problemas.push({nivel:'aviso',origem:id,mensagem:'Operação referenciada não detalhada: '+a.operacaoRef});}
 }
 for(const [id,k] of Object.entries(c.componentes))if(k.identidade?.id!==id)problemas.push({nivel:'erro',origem:id,mensagem:'ID de componente divergente'});
 const g=compilarRelacoes(c);problemas.push(...g.problemas);
 return {contagens:{telas:Object.keys(c.telas).length,componentes:Object.keys(c.componentes).length,participacoes:g.nos.length,acoes:actions,arestas:g.arestas.length,problemas:problemas.length},problemas};
}
