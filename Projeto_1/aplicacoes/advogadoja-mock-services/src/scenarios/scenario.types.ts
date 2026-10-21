export interface ScenarioStep { name:string; run:()=>unknown|Promise<unknown>; } export interface Scenario { id:string; title:string; description:string; steps:ScenarioStep[]; }
