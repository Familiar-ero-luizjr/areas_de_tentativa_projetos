// Motor independente do Laboratório Modular V2; utiliza apenas contratos canônicos.
import {resolverTransicao} from './resolvedor.js';
import {selecionarVariantes,contexto} from './regras.js';
export function projetar(c,telaId,participacaoId,estado,mock,dadosExtras={}){const t=c.telas[telaId];const p=t?.navegacao?.participacoes?.find(x=>x.id===participacaoId);const m=t?.mocks?.cenarios?.find(x=>x.id===mock);const ctx=contexto(p,estado,{...(m?.dados||{}),...dadosExtras});return {telaId,participacaoId,estado,mock,contexto:ctx,variantes:selecionarVariantes(t,ctx),acoes:(t?.acoes?.itens||[]).map(a=>({id:a.id,evento:a.evento,operacao:a.operacaoRef||null,possiveisDestinos:[a.destino,...(a.rotas||[]).map(r=>r.destino)].filter(Boolean)})),fonte:['navegacao','estados','estrutura','estilos','componentes','acoes','mocks']}}
export {resolverTransicao};
