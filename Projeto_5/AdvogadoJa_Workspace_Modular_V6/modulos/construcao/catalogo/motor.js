import {auditar} from './validador.js';
import {selecionarVariantes,contexto} from './regras.js';
export function projetar(c,tipo,id){const reg=tipo==='telas'?c.telas[id]:c.componentes[id];const referencias=tipo==='telas'?(reg.componentes?.instancias||[]).map(i=>({instancia:i.id,componente:i.ref,existe:!!c.componentes[i.ref]})):Object.values(c.telas).flatMap(t=>(t.componentes?.instancias||[]).filter(i=>i.ref===id).map(i=>({tela:t.identidade.id,instancia:i.id})));
return {fonte:`catalogo/${tipo}/${id}.json`,id,referencias,participacoes:reg.navegacao?.participacoes||[],variantes:reg.variantes?.regras||[],auditoriaGeral:auditar(c).contagens};}
