import type { PaymentsGateway } from "../../contracts/PaymentsGateway";
import createSubscriptionCheckout from "../functions/handlers/createSubscriptionCheckout";
import paymentWebhook from "../functions/handlers/paymentWebhook";
export class MockStripeGateway implements PaymentsGateway {
  async createCheckout(input: Record<string, unknown>) { return createSubscriptionCheckout(input as Record<string, any>); }
  async handleWebhook(event: Record<string, unknown>) { return paymentWebhook(event as Record<string, any>); }
}
