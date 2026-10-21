import type { Scenario } from "../scenario.types"; import closeContactRequest from "../../modules/functions/handlers/closeContactRequest";
const scenario:Scenario={id:"request-closed",title:"Solicitação encerrada",description:"Encerra request-001.",steps:[{name:"Encerrar",run:()=>closeContactRequest({requestId:"request-001",actorId:"client-001",reason:"resolved"})}]};export default scenario;
