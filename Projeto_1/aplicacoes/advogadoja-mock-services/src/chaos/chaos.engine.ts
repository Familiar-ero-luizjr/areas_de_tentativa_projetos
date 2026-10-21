import { defaultChaosConfig } from "./chaos.config";
import type { ChaosConfig } from "./chaos.types";
import { wait } from "./latency";
import { shouldFail } from "./failureRate";

let config: ChaosConfig = { ...defaultChaosConfig, failedServices: [] };

export const chaosEngine = {
  get: () => structuredClone(config),
  set: (patch: Partial<ChaosConfig>) => { config = { ...config, ...patch }; return structuredClone(config); },
  reset: () => { config = { ...defaultChaosConfig, failedServices: [] }; },
  async before(service: string) {
    if (!config.enabled) return;
    if (config.offline) throw new Error("Mock offline");
    if (config.failedServices.includes(service)) throw new Error(`Falha forçada em ${service}`);
    if (config.timeoutMs > 0 && config.latencyMs > config.timeoutMs) {
      await wait(config.timeoutMs);
      throw new Error(`Mock timeout em ${service} após ${config.timeoutMs}ms`);
    }
    if (config.latencyMs > 0) await wait(config.latencyMs);
    if (shouldFail(config.failureRate)) throw new Error(`Falha aleatória em ${service}`);
  },
};
