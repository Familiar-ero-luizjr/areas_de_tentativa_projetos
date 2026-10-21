import {Router} from 'express';
import type {DataRepository} from '../repositories/contracts.js';
import {CatalogController} from '../controllers/catalog.controller.js';
import {HttpError} from '../errors/http-error.js';
export function createCatalogRoutes(repo:DataRepository,domain:'consents'|'professionals'){
 const router=Router(),ctrl=new CatalogController(repo);
 if(domain==='consents') router.get('/me',ctrl.consents);
 else{
  router.get('/',ctrl.professionals);
  router.all('/*',(_req,_res,next)=>next(new HttpError(501,'NOT_IMPLEMENTED','Funcionalidade em construção')));
 }
 return router;
}
