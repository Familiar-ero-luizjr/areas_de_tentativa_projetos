import { db } from "../../../data/database/db"; export const cancelSubscription=(id:string)=>db.update("subscriptions",id,{status:"cancelled",cancelledAt:new Date().toISOString()});
