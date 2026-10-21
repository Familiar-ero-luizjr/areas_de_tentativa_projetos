import { chaosEngine } from "../../chaos/chaos.engine";
import { authStore } from "../../modules/auth/auth.store";
import type { Scenario } from "../scenario.types";
export const scenario:Scenario={id:"maps-failure",title:"Maps indisponível",description:"Força falha no Maps.",steps:[{name:"Aplicar cenário",run:()=>{chaosEngine.set({enabled:true,failedServices:["maps"]}); return chaosEngine.get();}}]};
export default scenario;
