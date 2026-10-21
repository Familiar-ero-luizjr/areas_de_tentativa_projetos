import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import {useSession} from '@/context/SessionContext';
import {useFeedback} from '@/context/FeedbackContext';
import {ApiError} from '@/services/http-client';
import {homeService,type HomeData} from '@/services/home.service';
import {professionalsService} from '@/services/professionals.service';
import type {Professional} from '@/services/contracts/professionals';
/** Estado, busca de profissionais e reações de navegação exclusivos da Home. */
export function useHomeClientePage(){
 const router=useRouter();const{session,ready,logout}=useSession();const{notify}=useFeedback();
 const[items,setItems]=useState<Professional[]>([]);const[home,setHome]=useState<HomeData|null>(null);
 const[error,setError]=useState('');const[area,setArea]=useState('Todas as áreas');const[menu,setMenu]=useState(false);
 useEffect(()=>{if(!ready)return;if(!session.isAuthenticated){router.replace('/login');return;}let active=true;
  Promise.all([homeService.get(),professionalsService.list()]).then(([h,list])=>{if(active){setHome(h);setItems(list);setError('');}}).catch(e=>{if(!active)return;if(e instanceof ApiError&&e.status===401){router.replace('/login');return;}setError((e as Error).message);notify((e as Error).message);});return()=>{active=false;};
 },[ready,session.isAuthenticated,router,notify]);
 const visible=area==='Todas as áreas'?items:items.filter(x=>x.area===area);
 return {router,session,ready,logout,notify,items,home,error,area,setArea,menu,setMenu,visible};
}
