import type { Scenario } from "../scenario.types"; import acceptContactRequest from "../../modules/functions/handlers/acceptContactRequest";
const scenario:Scenario={id:"request-accepted",title:"Solicitação aceita",description:"Aceita request-003.",steps:[{name:"Aceitar",run:()=>acceptContactRequest({requestId:"request-003",actorId:"lawyer-002"})}]};export default scenario;
