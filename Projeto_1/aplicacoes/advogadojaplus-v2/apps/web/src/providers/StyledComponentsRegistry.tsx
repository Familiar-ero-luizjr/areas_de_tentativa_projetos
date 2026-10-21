"use client";
import {useState, type ReactNode} from 'react';
import {useServerInsertedHTML} from 'next/navigation';
import {ServerStyleSheet,StyleSheetManager} from 'styled-components';
/** Registro SSR do styled-components v6 no App Router. */
export function StyledComponentsRegistry({children}:{children:ReactNode}){
 const [sheet]=useState(()=>new ServerStyleSheet());
 useServerInsertedHTML(()=>{
  const styles=sheet.getStyleElement();
  sheet.instance.clearTag();
  return <>{styles}</>;
 });
 if(typeof window!=='undefined')return <>{children}</>;
 return <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>;
}
