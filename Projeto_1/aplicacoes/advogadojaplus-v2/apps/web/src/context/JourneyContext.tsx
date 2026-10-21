'use client';
import React,{createContext,useContext,useEffect,useState} from 'react';
type Values=Record<string,string>;
type JourneyContextValue={values:Values;setValue:(key:string,value:string)=>void;clear:()=>void};
const C=createContext<JourneyContextValue|undefined>(undefined);
const sensitive=new Set(['senha','confirmarSenha','cpf','nascimento']);
export function JourneyProvider({children}:{children:React.ReactNode}){
  const[values,setValues]=useState<Values>({});
  useEffect(()=>{try{const saved=JSON.parse(sessionStorage.getItem('aj-form')||'{}') as Values;setValues(prev=>({...saved,...prev}));}catch{}},[]);
  const setValue=(key:string,value:string)=>setValues(previous=>{
    const next={...previous,[key]:value};
    try{sessionStorage.setItem('aj-form',JSON.stringify(Object.fromEntries(Object.entries(next).filter(([k])=>!sensitive.has(k)))));}catch{}
    return next;
  });
  const clear=()=>{setValues({});try{sessionStorage.removeItem('aj-form');}catch{}};
  return <C.Provider value={{values,setValue,clear}}>{children}</C.Provider>;
}
export function useJourney(){const value=useContext(C);if(!value)throw new Error('JourneyProvider ausente');return value;}
