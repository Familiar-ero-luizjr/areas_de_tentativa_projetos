export interface PaymentsGateway { createCheckout(input: Record<string, unknown>): Promise<Record<string, unknown>>; handleWebhook(event: Record<string, unknown>): Promise<Record<string, unknown>>; }
