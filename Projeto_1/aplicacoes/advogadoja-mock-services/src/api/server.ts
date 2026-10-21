import { route } from "./router"; import { requestLogger } from "../logs/requestLogger";
export async function mockFetch(path:string,init:{method?:string;body?:any}={}){ const method=init.method??"GET"; requestLogger.request(method,path,init.body); const result=await route(method,path,init.body); requestLogger.response(result.status,path,result); return result; }
