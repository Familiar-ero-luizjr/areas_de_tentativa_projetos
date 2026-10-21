import paymentWebhook from "../../functions/handlers/paymentWebhook";
export default function checkoutCompleted(data:any) { return paymentWebhook({type:"checkout.session.completed",data}); }
