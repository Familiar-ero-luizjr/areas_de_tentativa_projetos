import paymentWebhook from "../../functions/handlers/paymentWebhook";
export default function subscriptionUpdated(data:any) { return paymentWebhook({type:"customer.subscription.updated",data}); }
