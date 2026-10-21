import type { Scenario } from "../scenario.types"; import { db } from "../../data/database/db";
const scenario:Scenario={id:"oab-approved",title:"OAB aprovada",description:"Aplica status approved à OAB do lawyer-001.",steps:[{name:"Atualizar OAB",run:()=>db.update("lawyerPrivate","lawyer-001",{oabStatus:"approved"})}]};export default scenario;
