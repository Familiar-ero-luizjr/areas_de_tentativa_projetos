import {Router} from 'express';
import {ClientService} from '../services/client.service.js';
import {OnboardingController} from '../controllers/onboarding.controller.js';
export function createOnboardingRoutes(clients:ClientService){
 const router=Router(),ctrl=new OnboardingController(clients);
 router.get('/me',ctrl.get);
 router.patch('/me',ctrl.update);
 router.post('/complete',ctrl.complete);
 return router;
}
