import { chaosEngine } from "../../chaos/chaos.engine";
import { authStore } from "../../modules/auth/auth.store";
import type { Scenario } from "../scenario.types";
export const scenario:Scenario={id:"stripe-failure",title:"Stripe indisponível",description:"Força falha no serviço Stripe.",steps:[{name:"Aplicar cenário",run:()=>{chaosEngine.set({enabled:true,failedServices:["stripe"]}); return chaosEngine.get();}}]};
export default scenario;
