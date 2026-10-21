import { stripeService } from "../stripe.service"; export const declinePayment=(subscriptionId:string)=>stripeService.handleWebhook({type:"invoice.payment_failed",data:{subscriptionId}});
