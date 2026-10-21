import { functionRegistry } from "./functions.registry";
import { chaosEngine } from "../../chaos/chaos.engine";
import { eventLogger } from "../../logs/eventLogger";

export async function runFunction(name: string, input: Record<string, any> = {}) {
  const handler = functionRegistry[name];
  if (!handler) throw new Error(`Function mock não registrada: ${name}`);
  await chaosEngine.before("functions");
  const startedAt = performance.now();
  try {
    const output = await handler(input);
    eventLogger.info("function.success", { name, elapsedMs: Math.round(performance.now()-startedAt) });
    return output;
  } catch (error) {
    eventLogger.error("function.error", { name, message: error instanceof Error ? error.message : String(error) });
    throw error;
  }
}
