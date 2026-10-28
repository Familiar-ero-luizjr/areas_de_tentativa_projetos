function obter(obj,ref){if(!ref)return undefined;if(Object.prototype.hasOwnProperty.call(obj,ref))return obj[ref];return String(ref).split('.').reduce((a,k)=>a?.[k],obj)}
export function avaliar(cond,ctx){
 if(!cond)return true;
 if(Array.isArray(cond.e))return cond.e.every(x=>avaliar(x,ctx));
 if(Array.isArray(cond.ou))return cond.ou.some(x=>avaliar(x,ctx));
 if(cond.nao)return !avaliar(cond.nao,ctx);
 const v=obter(ctx,cond.campo),w=cond.valor;
 if(v===undefined)return false;
 switch(cond.operador){case 'igual':return v===w;case 'diferente':return v!==w;case 'maior':return v>w;case 'menor':return v<w;case 'inclui':return Array.isArray(v)?v.includes(w):String(v).includes(String(w));case 'existe':return v!==null&&v!==undefined;default:return false}
}
export function selecionarVariantes(tela,ctx){return (tela?.variantes?.regras||[]).filter(v=>avaliar(v.quando,ctx)).sort((a,b)=>(a.prioridade??0)-(b.prioridade??0)||a.id.localeCompare(b.id))}
export function contexto(participacao,estado,dados={},adicional={}){return {...dados,...adicional,participacao:{id:participacao?.id,jornada:participacao?.jornada?.id,subjornada:participacao?.subjornada?.id,...participacao?.contexto},estado:{id:estado}}}
