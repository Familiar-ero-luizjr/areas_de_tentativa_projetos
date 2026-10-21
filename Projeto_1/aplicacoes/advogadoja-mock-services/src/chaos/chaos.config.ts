import type { ChaosConfig } from "./chaos.types";
export const defaultChaosConfig:ChaosConfig={enabled:false,latencyMs:0,failureRate:0,timeoutMs:10000,offline:false,failedServices:[]};
