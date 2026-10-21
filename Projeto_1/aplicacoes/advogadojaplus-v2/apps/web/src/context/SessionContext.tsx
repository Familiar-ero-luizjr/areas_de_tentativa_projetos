'use client';
import React,{createContext,useCallback,useContext,useEffect,useState} from 'react';
import {authService,type Account} from '@/services/auth.service';
import {ApiError} from '@/services/http-client';
export type Session={isAuthenticated:boolean;profile:'cliente'|'advogado'|null;email:string;name:string};
const empty:Session={isAuthenticated:false,profile:null,email:'',name:''};
const fromAccount=(a:Account):Session=>({isAuthenticated:true,profile:a.role,email:a.email,name:a.name});
type Value={session:Session;ready:boolean;login:(email:string,password:string)=>Promise<void>;register:(payload:Parameters<typeof authService.register>[0])=>Promise<void>;logout:()=>Promise<void>;refresh:()=>Promise<void>};
const C=createContext<Value|undefined>(undefined);
export function SessionProvider({children}:{children:React.ReactNode}){
  const[session,setSession]=useState<Session>(empty);
  const[ready,setReady]=useState(false);
  const refresh=useCallback(async()=>{try{setSession(fromAccount(await authService.me()));}catch(e){if(!(e instanceof ApiError)||e.status!==401)console.warn('Sessão indisponível:',e);setSession(empty);}finally{setReady(true);}},[]);
  useEffect(()=>{void refresh();},[refresh]);
  const login=useCallback(async(email:string,password:string)=>{const a=await authService.authenticate(email,password);setSession(fromAccount(a));setReady(true);},[]);
  const register=useCallback(async(data:Parameters<typeof authService.register>[0])=>{await authService.register(data);const a=await authService.authenticate(data.email,data.password);setSession(fromAccount(a));setReady(true);},[]);
  const logout=useCallback(async()=>{await authService.logout();setSession(empty);setReady(true);},[]);
  return <C.Provider value={{session,ready,login,register,logout,refresh}}>{children}</C.Provider>;
}
export function useSession(){const value=useContext(C);if(!value)throw new Error('SessionProvider ausente');return value;}
