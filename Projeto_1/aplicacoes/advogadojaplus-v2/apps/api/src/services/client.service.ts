import type {DataRepository} from '../repositories/contracts.js';
import {HttpError} from '../errors/http-error.js';
import type {Client} from '../types/domain.js';
export class ClientService{constructor(private repo:DataRepository){}
 async get(id:string){const c=await this.repo.getClient(id);if(!c)throw new HttpError(404,'CLIENT_NOT_FOUND','Cliente não encontrado');return c;}
 async update(id:string,patch:Partial<Pick<Client,'name'|'phone'|'address'>>){const c=await this.get(id);const updated={...c,...patch,updatedAt:new Date().toISOString()};await this.repo.saveClient(updated);return updated;}
 async onboarding(id:string,patch:Partial<Client['onboarding']>){const c=await this.get(id);const updated={...c,onboarding:{...c.onboarding,...patch},updatedAt:new Date().toISOString()};await this.repo.saveClient(updated);return updated.onboarding;}
 async complete(id:string){const c=await this.get(id);if(!c.onboarding.contactPreference)throw new HttpError(422,'ONBOARDING_INCOMPLETE','Informe o canal de contato');return this.onboarding(id,{completed:true});}
 async home(id:string){const c=await this.get(id);return {greeting:`Olá, ${c.name.split(' ')[0]}!`,client:{name:c.name,onboardingComplete:c.onboarding.completed},summary:{requests:0,contactsReleased:0,unreadNotifications:0},sections:[{id:'professionals',title:'Encontrar advogado',available:false},{id:'requests',title:'Minhas solicitações',available:false}],environment:'initial'};}
}
