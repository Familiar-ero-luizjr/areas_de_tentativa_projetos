import {Router} from 'express';
import type {DataRepository} from '../repositories/contracts.js';
import {AuthService} from '../services/auth.service.js';
import {ClientService} from '../services/client.service.js';
import {requireClient} from '../middleware/require-client.js';
import {createAuthRoutes} from './auth.routes.js';
import {createClientRoutes} from './client.routes.js';
import {createOnboardingRoutes} from './onboarding.routes.js';
import {createCatalogRoutes} from './catalog.routes.js';
/** Composição única dos contratos HTTP v1, sem regras de negócio. */
export function createRoutes(repo:DataRepository){
 const router=Router(),auth=new AuthService(repo),clients=new ClientService(repo);
 router.use('/auth',createAuthRoutes(auth));
 router.use('/clients',requireClient(auth),createClientRoutes(clients));
 router.use('/onboarding',requireClient(auth),createOnboardingRoutes(clients));
 router.use('/consents',requireClient(auth),createCatalogRoutes(repo,'consents'));
 router.use('/professionals',requireClient(auth),createCatalogRoutes(repo,'professionals'));
 return router;
}
