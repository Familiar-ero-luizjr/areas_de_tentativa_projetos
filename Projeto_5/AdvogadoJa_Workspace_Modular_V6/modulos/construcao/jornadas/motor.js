import {compilarRelacoes,ordenarParticipacoes} from './resolvedor.js';
import {montarPacote} from './catalogo.js';
export function projetar(c,jornada){const grafo=compilarRelacoes(c),nos=ordenarParticipacoes(grafo.nos.filter(n=>n.jornada?.id===jornada));const ids=[...new Set(nos.map(n=>n.telaId))];return {jornada,participacoes:nos,relacoes:grafo.arestas.filter(e=>nos.some(n=>n.id===e.origem)),dependencias:montarPacote(c,ids).escopo,diagnosticos:grafo.problemas}}
