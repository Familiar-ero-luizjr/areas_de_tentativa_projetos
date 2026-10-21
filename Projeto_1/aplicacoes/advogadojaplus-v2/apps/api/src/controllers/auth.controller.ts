import {AuthService} from '../services/auth.service.js';
import {registerSchema,loginSchema} from '../schemas/inputs.js';
import {asyncHandler} from '../middleware/async-handler.js';
import {SESSION_COOKIE,sessionCookieOptions,clearSessionCookieOptions} from '../lib/session-cookie.js';
import {publicAccount} from '../types/domain.js';
/** Handlers HTTP. Toda regra de negócio permanece no AuthService. */
export class AuthController {
 constructor(private readonly auth:AuthService){}
 register=asyncHandler(async(req,res)=>{
  const account=await this.auth.register(registerSchema.parse(req.body));
  res.status(201).json({data:account});
 });
 login=asyncHandler(async(req,res)=>{
  const {email,password}=loginSchema.parse(req.body);
  const {account,token}=await this.auth.login(email,password);
  res.cookie(SESSION_COOKIE,token,sessionCookieOptions()).json({data:account});
 });
 logout=asyncHandler(async(req,res)=>{
  await this.auth.logout(req.cookies?.[SESSION_COOKIE]);
  res.clearCookie(SESSION_COOKIE,clearSessionCookieOptions()).status(204).end();
 });
 me=asyncHandler(async(_req,res)=>res.json({data:publicAccount(res.locals.account)}));
}
