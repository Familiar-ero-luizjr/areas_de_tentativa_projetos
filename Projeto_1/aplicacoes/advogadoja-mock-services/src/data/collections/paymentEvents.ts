export const paymentEventsSeed = [
  {
    "id": "payment-event-001",
    "provider": "stripe",
    "providerEventId": "evt_mock_001",
    "eventType": "invoice.paid",
    "subscriptionId": "subscription-001",
    "paymentId": "payment-001",
    "subjectId": "lawyer-001",
    "status": "processed",
    "payloadHash": "mockhash001",
    "error": null,
    "receivedAt": "2026-09-01T00:01:01-03:00",
    "processedAt": "2026-09-01T00:01:02-03:00",
    "createdAt": "2026-09-01T00:01:01-03:00"
  },
  {
    "id": "payment-event-002",
    "provider": "stripe",
    "providerEventId": "evt_mock_002",
    "eventType": "invoice.paid",
    "subscriptionId": "subscription-002",
    "paymentId": "payment-002",
    "subjectId": "office-001",
    "status": "processed",
    "payloadHash": "mockhash002",
    "error": null,
    "receivedAt": "2026-09-05T00:01:01-03:00",
    "processedAt": "2026-09-05T00:01:02-03:00",
    "createdAt": "2026-09-05T00:01:01-03:00"
  }
] as const;
