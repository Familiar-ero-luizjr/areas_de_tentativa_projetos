import { stripeService } from "../stripe.service"; export const approvePayment=(subscriptionId:string)=>stripeService.handleWebhook({type:"invoice.payment_succeeded",data:{subscriptionId}});
