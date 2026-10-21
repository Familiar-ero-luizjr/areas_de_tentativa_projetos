import {api} from './http-client';
export type Onboarding={location?:string;contactPreference?:string;contactTime?:string;completed:boolean};
export const onboardingService={
  get:()=>api<Onboarding>('/onboarding/me'),
  update:(input:{location?:string;contactPreference?:string;contactTime?:string})=>api<Onboarding>('/onboarding/me',{method:'PATCH',body:JSON.stringify(input)}),
  complete:()=>api<Onboarding>('/onboarding/complete',{method:'POST'})
};
