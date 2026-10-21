import type { Scenario } from "../scenario.types"; import { db } from "../../data/database/db";
const scenario:Scenario={id:"oab-rejected",title:"OAB rejeitada",description:"Aplica status rejected à OAB do lawyer-001.",steps:[{name:"Atualizar OAB",run:()=>db.update("lawyerPrivate","lawyer-001",{oabStatus:"rejected"})}]};export default scenario;
