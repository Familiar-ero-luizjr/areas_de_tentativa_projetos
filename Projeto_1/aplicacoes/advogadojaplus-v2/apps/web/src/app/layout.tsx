import type {Metadata} from "next";import "@/themes/tokens.css";import "@/styles/globals.css";import {AppProviders} from "@/providers/AppProviders";import {StyledComponentsRegistry} from "@/providers/StyledComponentsRegistry";
export const metadata:Metadata={title:"AdvogadoJá · Cliente",description:"Jornada cliente AdvogadoJá em React"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body><StyledComponentsRegistry><AppProviders>{children}</AppProviders></StyledComponentsRegistry></body></html>}
