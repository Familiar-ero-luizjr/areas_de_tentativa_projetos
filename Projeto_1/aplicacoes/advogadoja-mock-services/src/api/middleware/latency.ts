import { chaosEngine } from "../../chaos/chaos.engine"; export const applyApiLatency=()=>chaosEngine.before("api");
