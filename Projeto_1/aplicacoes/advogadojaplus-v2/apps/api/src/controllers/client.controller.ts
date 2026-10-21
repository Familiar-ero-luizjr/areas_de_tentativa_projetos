import {ClientService} from '../services/client.service.js';
import {clientSchema} from '../schemas/inputs.js';
import {asyncHandler} from '../middleware/async-handler.js';
export class ClientController {
 constructor(private readonly clients:ClientService){}
 get=asyncHandler(async(_req,res)=>res.json({data:await this.clients.get(res.locals.account.id)}));
 update=asyncHandler(async(req,res)=>res.json({data:await this.clients.update(res.locals.account.id,clientSchema.parse(req.body))}));
 home=asyncHandler(async(_req,res)=>res.json({data:await this.clients.home(res.locals.account.id)}));
}
