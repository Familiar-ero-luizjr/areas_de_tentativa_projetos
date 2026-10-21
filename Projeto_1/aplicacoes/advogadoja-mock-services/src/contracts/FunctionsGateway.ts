export interface FunctionsGateway { call<TInput=unknown,TOutput=unknown>(name: string, input: TInput): Promise<TOutput>; }
