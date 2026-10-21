import { chaosEngine } from "../../chaos/chaos.engine";
import { authStore } from "../../modules/auth/auth.store";
import type { Scenario } from "../scenario.types";
export const scenario:Scenario={id:"firestore-timeout",title:"Firestore timeout",description:"Aumenta latência acima do timeout.",steps:[{name:"Aplicar cenário",run:()=>{chaosEngine.set({enabled:true,latencyMs:12000,timeoutMs:3000}); return chaosEngine.get();}}]};
export default scenario;
