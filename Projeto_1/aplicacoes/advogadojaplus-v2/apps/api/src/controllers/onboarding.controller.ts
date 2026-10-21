import {ClientService} from '../services/client.service.js';
import {onboardingSchema} from '../schemas/inputs.js';
import {asyncHandler} from '../middleware/async-handler.js';
export class OnboardingController {
 constructor(private readonly clients:ClientService){}
 get=asyncHandler(async(_req,res)=>res.json({data:(await this.clients.get(res.locals.account.id)).onboarding}));
 update=asyncHandler(async(req,res)=>res.json({data:await this.clients.onboarding(res.locals.account.id,onboardingSchema.parse(req.body))}));
 complete=asyncHandler(async(_req,res)=>res.json({data:await this.clients.complete(res.locals.account.id)}));
}
