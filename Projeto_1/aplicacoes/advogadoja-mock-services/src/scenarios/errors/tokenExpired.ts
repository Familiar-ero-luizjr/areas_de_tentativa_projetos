import { chaosEngine } from "../../chaos/chaos.engine";
import { authStore } from "../../modules/auth/auth.store";
import type { Scenario } from "../scenario.types";
export const scenario:Scenario={id:"token-expired",title:"Token expirado",description:"Limpa sessão autenticada.",steps:[{name:"Aplicar cenário",run:()=>{authStore.clear(); return authStore.get();}}]};
export default scenario;
