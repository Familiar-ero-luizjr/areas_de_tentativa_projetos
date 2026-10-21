/* Mocks/contact-request-events.mock.js — contact_requests/{requestId}/events/{eventId} — dados simulados */
window.MOCKS = window.MOCKS || {};

window.MOCKS.contactRequestEvents = {
  "request-001": [
    {
      "id": "event-001",
      "requestId": "request-001",
      "eventType": "created",
      "statusFrom": null,
      "statusTo": "waiting",
      "actorId": "client-001",
      "actorType": "client",
      "reason": null,
      "message": "Solicitação criada.",
      "data": {},
      "createdAt": "2026-09-01T10:00:00-03:00"
    },
    {
      "id": "event-002",
      "requestId": "request-001",
      "eventType": "accepted",
      "statusFrom": "waiting",
      "statusTo": "accepted",
      "actorId": "lawyer-001",
      "actorType": "lawyer",
      "reason": null,
      "message": "Advogada aceitou a solicitação.",
      "data": {
        "releasedChannels": [
          "whatsapp",
          "email"
        ]
      },
      "createdAt": "2026-09-01T10:20:00-03:00"
    }
  ],
  "request-002": [
    {
      "id": "event-003",
      "requestId": "request-002",
      "eventType": "created",
      "statusFrom": null,
      "statusTo": "waiting",
      "actorId": "client-002",
      "actorType": "client",
      "reason": null,
      "message": "Solicitação enviada ao escritório.",
      "data": {},
      "createdAt": "2026-09-06T15:00:00-03:00"
    },
    {
      "id": "event-004",
      "requestId": "request-002",
      "eventType": "assigned",
      "statusFrom": "waiting",
      "statusTo": "waiting",
      "actorId": "lawyer-002",
      "actorType": "lawyer",
      "reason": null,
      "message": "Owner atribuiu a solicitação à advogada do escritório.",
      "data": {
        "assignedLawyerId": "lawyer-003"
      },
      "createdAt": "2026-09-06T15:10:00-03:00"
    },
    {
      "id": "event-005",
      "requestId": "request-002",
      "eventType": "accepted",
      "statusFrom": "waiting",
      "statusTo": "accepted",
      "actorId": "lawyer-003",
      "actorType": "lawyer",
      "reason": null,
      "message": "Advogada aceitou a solicitação.",
      "data": {},
      "createdAt": "2026-09-06T15:25:00-03:00"
    }
  ],
  "request-004": [
    {
      "id": "event-006",
      "requestId": "request-004",
      "eventType": "declined",
      "statusFrom": "waiting",
      "statusTo": "declined",
      "actorId": "lawyer-004",
      "actorType": "lawyer",
      "reason": "Indisponível no horário solicitado",
      "message": "Solicitação recusada.",
      "data": {},
      "createdAt": "2026-09-11T21:00:00-03:00"
    }
  ]
};
