'use strict';
function buildJourneyIndex(P){const M=P.model,groups=new Map();
 function group(j,s){if(!groups.has(j.id))groups.set(j.id,{id:j.id,order:j.order,sub:new Map()});const g=groups.get(j.id);if(!g.sub.has(s.id))g.sub.set(s.id,{id:s.id,order:s.order,rows:[],notes:[]});return g.sub.get(s.id);}
 for(const p of Object.values(M.pages))for(const j of p.classification?.journeys||[])for(const s of j.subjourneys||[]){group(j,s).rows.push({pageRef:p.identity.id,name:p.identity.name,pageOrder:s.pageOrder,occurrenceRef:s.occurrenceId});}
 for(const x of P.journeyPresentation.occurrences||[]){const s=groups.get(x.journeyRef)?.sub.get(x.subjourneyRef);if(!s)continue;if(s.rows.some(r=>r.occurrenceRef===x.occurrenceRef||(r.pageRef===x.pageRef&&r.pageOrder===x.pageOrder)))continue;const p=Object.prototype.hasOwnProperty.call(M.pages,x.pageRef)?M.pages[x.pageRef]:null;s.rows.push({...x,name:p?.identity.name||x.name});}
 for(const x of P.journeyPresentation.notes||[]){groups.get(x.journeyRef)?.sub.get(x.subjourneyRef)?.notes.push(x);}
 return [...groups.values()].sort((a,b)=>a.order-b.order);}
