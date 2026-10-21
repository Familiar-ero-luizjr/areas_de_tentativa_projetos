import {api} from './http-client';
import type {Professional} from './contracts/professionals';
export const professionalsService={list:()=>api<Professional[]>('/professionals')};
