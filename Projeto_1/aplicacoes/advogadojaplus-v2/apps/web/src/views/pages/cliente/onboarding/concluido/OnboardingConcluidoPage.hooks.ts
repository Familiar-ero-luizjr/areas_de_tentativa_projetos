import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useFeedback} from '@/context/FeedbackContext';
import {useJourney} from '@/context/JourneyContext';
import {onboardingService} from '@/services/onboarding.service';
/** Completa o onboarding pela API e limpa os dados transitórios da jornada. */
export function useOnboardingConcluidoPage(){
 const router=useRouter(),{notify}=useFeedback(),{clear}=useJourney();
 const [busy,setBusy]=useState(false);
 async function next(){setBusy(true);try{await onboardingService.complete();clear();router.push('/cliente/inicio');}catch(e){notify((e as Error).message);}finally{setBusy(false);}}
 return {busy,next};
}
