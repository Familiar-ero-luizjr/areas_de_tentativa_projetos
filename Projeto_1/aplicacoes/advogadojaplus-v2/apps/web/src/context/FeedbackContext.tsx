"use client";
import React,{createContext,useContext,useState} from 'react';
const C=createContext<{notify:(message:string)=>void}>({notify:()=>{}});
export function FeedbackProvider({children}:{children:React.ReactNode}){const [message,setMessage]=useState('');return <C.Provider value={{notify:setMessage}}>{children}{message&&<div role="alert" className="toast"><span>{message}</span><button aria-label="Fechar aviso" onClick={()=>setMessage('')}>×</button></div>}</C.Provider>}
export const useFeedback=()=>useContext(C);
