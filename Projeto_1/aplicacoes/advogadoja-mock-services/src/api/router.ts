import { runFunction } from "../modules/functions/functions.runner"; import { db } from "../data/database/db"; import { authService } from "../modules/auth/auth.service"; import { stripeService } from "../modules/stripe/stripe.service";
export async function route(method:string,path:string,body:any={}){
  if(path.startsWith("/functions/")) return {ok:true,status:200,data:await runFunction(path.split("/")[2],body)};
  if(path.startsWith("/firestore/")) return {ok:true,status:200,data:db.collection(path.split("/")[2])};
  if(path==="/auth/signout"){await authService.signOut();return{ok:true,status:200,data:true};}
  if(path==="/stripe/checkout") return {ok:true,status:200,data:await stripeService.createCheckout(body)};
  return {ok:false,status:404,error:`Rota mock não encontrada: ${method} ${path}`};
}
