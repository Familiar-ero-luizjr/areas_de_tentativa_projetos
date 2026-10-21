import paymentWebhook from "../../functions/handlers/paymentWebhook";
export default function subscriptionDeleted(data:any) { return paymentWebhook({type:"customer.subscription.deleted",data}); }
