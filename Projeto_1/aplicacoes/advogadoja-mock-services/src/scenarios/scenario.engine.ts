import type { Scenario } from "./scenario.types"; import { scenarioStore } from "../state/scenarioStore";
export async function runScenario(scenario:Scenario){ scenarioStore.set(scenario.id); const results=[]; for(const step of scenario.steps) results.push({step:step.name,result:await step.run()}); return results; }
