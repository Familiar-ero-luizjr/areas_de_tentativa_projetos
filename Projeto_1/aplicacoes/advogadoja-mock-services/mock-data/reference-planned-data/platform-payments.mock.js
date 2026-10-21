/* Mocks/platform-payments.mock.js — platform_payments/{paymentId} — dados simulados */
window.MOCKS = window.MOCKS || {};

window.MOCKS.platformPayments = [
  {
    "id": "payment-001",
    "subscriptionId": "subscription-001",
    "subjectType": "lawyer",
    "subjectId": "lawyer-001",
    "planId": "plan-professional",
    "provider": "stripe",
    "providerPaymentId": "pi_mock_001",
    "providerInvoiceId": "in_mock_001",
    "amount": 99.9,
    "currency": "BRL",
    "status": "paid",
    "paidAt": "2026-09-01T00:01:00-03:00",
    "failedAt": null,
    "refundedAt": null,
    "failureReason": null,
    "createdAt": "2026-09-01T00:00:00-03:00",
    "updatedAt": "2026-09-01T00:01:00-03:00"
  },
  {
    "id": "payment-002",
    "subscriptionId": "subscription-002",
    "subjectType": "office",
    "subjectId": "office-001",
    "planId": "plan-office",
    "provider": "stripe",
    "providerPaymentId": "pi_mock_002",
    "providerInvoiceId": "in_mock_002",
    "amount": 199.9,
    "currency": "BRL",
    "status": "paid",
    "paidAt": "2026-09-05T00:01:00-03:00",
    "failedAt": null,
    "refundedAt": null,
    "failureReason": null,
    "createdAt": "2026-09-05T00:00:00-03:00",
    "updatedAt": "2026-09-05T00:01:00-03:00"
  }
];
