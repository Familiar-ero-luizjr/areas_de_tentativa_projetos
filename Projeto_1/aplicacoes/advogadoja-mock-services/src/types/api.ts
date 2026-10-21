export interface ApiRequest<T = unknown> { id: string; method: string; path: string; body?: T; at: string; }
export interface ApiResponse<T = unknown> { ok: boolean; status: number; data?: T; error?: string; }
