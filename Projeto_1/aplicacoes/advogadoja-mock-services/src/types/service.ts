export type ServiceName = "auth" | "firestore" | "functions" | "storage" | "messaging" | "remote-config" | "stripe" | "maps";
export interface ServiceStatus { name: ServiceName; enabled: boolean; healthy: boolean; latencyMs: number; }
