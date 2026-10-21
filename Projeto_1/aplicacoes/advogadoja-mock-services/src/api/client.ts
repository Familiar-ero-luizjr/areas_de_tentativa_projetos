import { appConfig } from "../app/config";

type RequestOptions = { method?: string; body?: unknown };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${appConfig.mockApiUrl}${path}`, {
    method: options.method ?? "GET",
    headers: { "content-type": "application/json" },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.ok === false) throw new Error(payload?.error ?? `HTTP ${response.status}`);
  return (payload?.data ?? payload) as T;
}

export const apiClient = {
  health: () => request<Record<string, unknown>>("/health"),
  collections: () => request<Record<string, number>>("/api/firestore"),
  collection: <T=Record<string,unknown>>(name: string) => request<T[]>(`/api/firestore/${encodeURIComponent(name)}`),
  functions: () => request<string[]>("/api/functions"),
  callFunction: <T=unknown>(name: string, input: unknown = {}) => request<T>(`/api/functions/${encodeURIComponent(name)}`, { method: "POST", body: input }),
  scenarios: () => request<Array<{id:string;title:string;description:string}>>("/api/scenarios"),
  runScenario: (id: string) => request(`/api/scenarios/${encodeURIComponent(id)}/run`, { method: "POST", body: {} }),
  chaos: (patch?: unknown) => patch === undefined ? request<Record<string,unknown>>("/api/chaos") : request<Record<string,unknown>>("/api/chaos", { method: "POST", body: patch }),
  reset: () => request("/api/admin/reset", { method: "POST", body: {} }),
  logs: () => request<unknown[]>("/api/logs"),
  checkout: (input: unknown) => request("/api/stripe/checkout", { method: "POST", body: input }),
  currentLocation: () => request<{lat:number;lng:number}>("/api/maps/location"),
  geocode: (address: string) => request("/api/maps/geocode", { method: "POST", body: { address } }),
};
