import type { Scenario } from "../scenario.types"; import paymentWebhook from "../../modules/functions/handlers/paymentWebhook";
const scenario:Scenario={id:"checkout-failed",title:"Checkout falhou",description:"Registra falha de pagamento.",steps:[{name:"Webhook de falha",run:()=>paymentWebhook({type:"invoice.payment_failed",data:{subscriptionId:"subscription-001"}})}]};export default scenario;
