import type { Scenario } from "../scenario.types"; import { db } from "../../data/database/db";
const scenario:Scenario={id:"subscription-cancelled",title:"Assinatura cancelada",description:"Força subscription-001 para cancelled.",steps:[{name:"Cancelar",run:()=>db.update("subscriptions","subscription-001",{status:"cancelled",cancelledAt:new Date().toISOString()})}]};export default scenario;
