"use client";
import {ThemeProvider} from "@/themes/ThemeProvider";
import {SessionProvider} from "@/context/SessionContext";
import {JourneyProvider} from "@/context/JourneyContext";
import {FeedbackProvider} from "@/context/FeedbackContext";
import {ModalProvider} from "@/context/ModalContext";
export function AppProviders({children}:{children:React.ReactNode}){return <ThemeProvider><SessionProvider><JourneyProvider><FeedbackProvider><ModalProvider>{children}</ModalProvider></FeedbackProvider></JourneyProvider></SessionProvider></ThemeProvider>}
