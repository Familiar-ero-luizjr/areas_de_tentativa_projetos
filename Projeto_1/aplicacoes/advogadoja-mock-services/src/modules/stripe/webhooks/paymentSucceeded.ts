import paymentWebhook from "../../functions/handlers/paymentWebhook";
export default function paymentSucceeded(data:any) { return paymentWebhook({type:"invoice.payment_succeeded",data}); }
