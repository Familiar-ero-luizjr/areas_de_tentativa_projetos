export interface RemoteConfigGateway { get<T=unknown>(key:string): T | undefined; set(key:string,value:unknown): void; fetchAndActivate(): Promise<boolean>; }
