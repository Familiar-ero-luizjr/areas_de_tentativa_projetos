import {Router} from 'express';
import {ClientService} from '../services/client.service.js';
import {ClientController} from '../controllers/client.controller.js';
export function createClientRoutes(clients:ClientService){
 const router=Router(),ctrl=new ClientController(clients);
 router.get('/me',ctrl.get);
 router.patch('/me',ctrl.update);
 router.get('/me/home',ctrl.home);
 return router;
}
