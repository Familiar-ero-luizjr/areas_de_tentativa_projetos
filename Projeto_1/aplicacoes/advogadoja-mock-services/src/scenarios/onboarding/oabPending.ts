import type { Scenario } from "../scenario.types"; import { db } from "../../data/database/db";
const scenario:Scenario={id:"oab-pending",title:"OAB pendente",description:"Aplica status pending à OAB do lawyer-001.",steps:[{name:"Atualizar OAB",run:()=>db.update("lawyerPrivate","lawyer-001",{oabStatus:"pending"})}]};export default scenario;
