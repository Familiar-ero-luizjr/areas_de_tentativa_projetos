export type LogLevel="info"|"warn"|"error"; export interface LogEntry { id:string; level:LogLevel; event:string; data:unknown; at:string; }
