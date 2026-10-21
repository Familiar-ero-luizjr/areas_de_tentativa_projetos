import {api} from './http-client';
export type Account={id:string;name:string;email:string;role:'cliente'|'advogado';status:'active'|'pending';createdAt:string};
export type Registration={name:string;email:string;password:string;role:'cliente'|'advogado';phone?:string;username?:string;cpf?:string;birthDate?:string;gender?:string;address?:Record<string,string>;consents:{document:string;version:string}[]};
export const authService={
  authenticate:(email:string,password:string)=>api<Account>('/auth/login',{method:'POST',body:JSON.stringify({email,password})}),
  register:(data:Registration)=>api<Account>('/auth/register',{method:'POST',body:JSON.stringify(data)}),
  me:()=>api<Account>('/auth/me'),
  logout:()=>api<void>('/auth/logout',{method:'POST'})
};
