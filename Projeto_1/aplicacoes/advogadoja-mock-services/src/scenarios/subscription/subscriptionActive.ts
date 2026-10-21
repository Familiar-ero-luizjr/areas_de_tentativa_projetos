import type { Scenario } from "../scenario.types"; import { db } from "../../data/database/db";
const scenario:Scenario={id:"subscription-active",title:"Assinatura ativa",description:"Força subscription-001 para active.",steps:[{name:"Ativar",run:()=>db.update("subscriptions","subscription-001",{status:"active"})}]};export default scenario;
