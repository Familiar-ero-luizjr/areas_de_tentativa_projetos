import type { LogEntry,LogLevel } from "./log.types"; const entries:LogEntry[]=[];
export const logger={ entries, write(level:LogLevel,event:string,data:unknown={}){const e={id:`log-${Date.now()}-${entries.length}`,level,event,data,at:new Date().toISOString()};entries.push(e);return e;}, clear(){entries.splice(0);} };
