/** Single browser -> API boundary, for both mock and MongoDB modes. */
const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/,'');
type Payload<T>={data:T};
type ErrorPayload={error?:{code?:string;message?:string;issues?:{path:string;message:string}[]}};
export class ApiError extends Error{constructor(public readonly status:number,public readonly code:string,message:string){super(message);this.name='ApiError';}}
export async function api<T>(path:string,init:RequestInit={}):Promise<T>{
  let response:Response;
  try{
    response=await fetch(`${baseUrl}/api/v1${path}`,{
      ...init,credentials:'include',cache:'no-store',headers:{'Content-Type':'application/json',...init.headers}
    });
  }catch{throw new ApiError(0,'NETWORK_ERROR','Não foi possível conectar à API. Verifique se o servidor está iniciado.');}
  if(response.status===204)return undefined as T;
  let json: Payload<T>&ErrorPayload;
  try{json=await response.json();}catch{throw new ApiError(response.status,'INVALID_RESPONSE','A API devolveu uma resposta inesperada.');}
  if(!response.ok)throw new ApiError(response.status,json.error?.code||'API_ERROR',json.error?.message||`Erro HTTP ${response.status}`);
  return json.data;
}
