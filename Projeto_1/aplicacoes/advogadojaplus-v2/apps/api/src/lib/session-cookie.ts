import {env} from '../config/env.js';
/** Cookie HttpOnly usado pelos dois provedores de dados. */
export const SESSION_COOKIE='aj_session';
export const sessionCookieOptions=()=>({
  httpOnly:true, secure:env.NODE_ENV==='production', sameSite:'lax' as const,
  path:'/', maxAge:env.SESSION_TTL_HOURS*3600000
});
export const clearSessionCookieOptions=()=>({path:'/',sameSite:'lax' as const,secure:env.NODE_ENV==='production'});
