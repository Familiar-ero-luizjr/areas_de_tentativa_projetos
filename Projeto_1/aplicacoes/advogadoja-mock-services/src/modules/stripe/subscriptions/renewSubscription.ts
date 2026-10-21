import { db } from "../../../data/database/db"; export const renewSubscription=(id:string)=>db.update("subscriptions",id,{status:"active",renewedAt:new Date().toISOString()});
