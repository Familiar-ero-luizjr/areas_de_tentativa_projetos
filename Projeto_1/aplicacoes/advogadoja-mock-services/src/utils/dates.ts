export const nowIso=()=>new Date().toISOString(); export const formatDate=(v:string)=>new Intl.DateTimeFormat("pt-BR",{dateStyle:"short",timeStyle:"short"}).format(new Date(v));
