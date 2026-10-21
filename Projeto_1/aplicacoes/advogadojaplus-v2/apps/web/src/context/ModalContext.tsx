"use client";
import React,{createContext,useContext,useState} from 'react';
const C=createContext<{open:(title:string,content:string)=>void;close:()=>void}>({open:()=>{},close:()=>{}});
export function ModalProvider({children}:{children:React.ReactNode}){const [modal,setModal]=useState<{title:string;content:string}|null>(null);return <C.Provider value={{open:(title,content)=>setModal({title,content}),close:()=>setModal(null)}}>{children}{modal&&<div role="presentation" className="modalBackdrop" onMouseDown={()=>setModal(null)}><section role="dialog" aria-modal="true" aria-label={modal.title} className="modalCard" onMouseDown={e=>e.stopPropagation()}><h2>{modal.title}</h2><p>{modal.content}</p><button className="primaryBtn" onClick={()=>setModal(null)}>Fechar</button></section></div>}</C.Provider>}
export const useModal=()=>useContext(C);
