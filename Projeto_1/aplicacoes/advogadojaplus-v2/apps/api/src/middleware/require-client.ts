import type {RequestHandler} from 'express';
import { AuthService } from '../services/auth.service.js';
import { HttpError } from '../errors/http-error.js';
import { asyncHandler } from './async-handler.js';
import { SESSION_COOKIE } from '../lib/session-cookie.js';
/** Autenticação e autorização reais na API, independente da tela Next.js. */
export const requireClient = (auth:AuthService):RequestHandler => asyncHandler(async(req,res,next)=>{
 const account=await auth.me(req.cookies?.[SESSION_COOKIE]);
 if(account.role!=='cliente') throw new HttpError(403,'FORBIDDEN','Acesso reservado a clientes');
 res.locals.account=account;
 next();
});
