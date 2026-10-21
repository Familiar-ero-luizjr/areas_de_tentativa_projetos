import paymentWebhook from "../../functions/handlers/paymentWebhook";
export default function paymentFailed(data:any) { return paymentWebhook({type:"invoice.payment_failed",data}); }
