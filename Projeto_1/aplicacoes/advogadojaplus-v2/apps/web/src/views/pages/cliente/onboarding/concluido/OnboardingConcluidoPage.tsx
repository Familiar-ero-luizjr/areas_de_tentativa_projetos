'use client';
import{AppShell}from'@/components/layout/AppShell';import{PageSection}from'./OnboardingConcluidoPage.styles';
import {useOnboardingConcluidoPage} from './OnboardingConcluidoPage.hooks';
export default function OnboardingConcluidoPage(){
 const {busy,next}=useOnboardingConcluidoPage();
 return <AppShell title="Preferências concluídas"><PageSection><p className="lead">Sua jornada está pronta. Agora você pode explorar a Home.</p><div className="actions"><button className="primaryBtn" disabled={busy} onClick={()=>void next()}>{busy?'Finalizando…':'Continuar →'}</button></div></PageSection></AppShell>;
}
