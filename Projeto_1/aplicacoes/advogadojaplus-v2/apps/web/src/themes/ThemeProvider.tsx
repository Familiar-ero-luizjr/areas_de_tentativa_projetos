"use client";
import { ThemeProvider as StyledProvider } from "styled-components";
import { theme } from "./tokens";
export function ThemeProvider({children}:{children:React.ReactNode}){return <StyledProvider theme={theme}>{children}</StyledProvider>}
