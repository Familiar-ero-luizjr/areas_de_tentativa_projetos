export interface MessagingGateway { send(input: { token?: string; topic?: string; title: string; body: string }): Promise<{ id:string; queued:boolean }>; }
