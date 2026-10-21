export type EnvironmentName = "local" | "test" | "homolog" | "prod";
export type ServiceMode = "mock" | "real" | "disabled";
export interface EnvironmentConfig {
  name: EnvironmentName;
  firebase: ServiceMode;
  stripe: ServiceMode;
  maps: ServiceMode;
}
