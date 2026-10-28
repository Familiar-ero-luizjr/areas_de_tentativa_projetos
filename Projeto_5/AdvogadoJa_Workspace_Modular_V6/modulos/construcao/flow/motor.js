import {compilarRelacoes,ordenarParticipacoes} from './resolvedor.js';
export function projetar(c){const g=compilarRelacoes(c);return {...g,nos:ordenarParticipacoes(g.nos),telas:undefined,partes:undefined,fonte:['identidade','navegacao.participacoes','navegacao.entradas','acoes.itens','acoes.itens.rotas'],layout:'derivado em memória; sem x/y persistido'}}
