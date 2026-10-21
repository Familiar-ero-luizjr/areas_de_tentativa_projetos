import { chaosEngine } from "../../chaos/chaos.engine";
import { authStore } from "../../modules/auth/auth.store";
import type { Scenario } from "../scenario.types";
export const scenario:Scenario={id:"firebase-offline",title:"Firebase offline",description:"Ativa modo offline.",steps:[{name:"Aplicar cenário",run:()=>{chaosEngine.set({enabled:true,offline:true}); return chaosEngine.get();}}]};
export default scenario;
