import type {DataRepository} from '../repositories/contracts.js';
import {asyncHandler} from '../middleware/async-handler.js';
export class CatalogController {
 constructor(private readonly repo:DataRepository){}
 consents=asyncHandler(async(_req,res)=>res.json({data:await this.repo.listConsents(res.locals.account.id)}));
 professionals=asyncHandler(async(_req,res)=>res.json({data:await this.repo.listProfessionals()}));
}
