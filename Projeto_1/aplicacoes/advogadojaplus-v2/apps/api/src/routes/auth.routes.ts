import {Router} from 'express';
import {AuthService} from '../services/auth.service.js';
import {AuthController} from '../controllers/auth.controller.js';
import {requireClient} from '../middleware/require-client.js';
export function createAuthRoutes(auth:AuthService){
 const router=Router(),ctrl=new AuthController(auth);
 router.post('/register',ctrl.register);
 router.post('/login',ctrl.login);
 router.post('/logout',ctrl.logout);
 router.get('/me',requireClient(auth),ctrl.me);
 return router;
}
