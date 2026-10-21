import {api} from './http-client';
export type HomeData={greeting:string;client:{name:string;onboardingComplete:boolean};summary:{requests:number;contactsReleased:number;unreadNotifications:number};sections:{id:string;title:string;available:boolean}[];environment:string};
export const homeService={get:()=>api<HomeData>('/clients/me/home')};
