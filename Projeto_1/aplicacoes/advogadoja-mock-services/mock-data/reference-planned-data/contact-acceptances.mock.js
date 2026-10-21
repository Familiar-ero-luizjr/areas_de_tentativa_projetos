/* Mocks/contact-acceptances.mock.js — contact_acceptances/{requestId} — dados simulados */
window.MOCKS = window.MOCKS || {};

window.MOCKS.contactAcceptances = [
  {
    "id": "request-001",
    "requestId": "request-001",
    "clientId": "client-001",
    "lawyerId": "lawyer-001",
    "status": "active",
    "releasedChannels": [
      "whatsapp",
      "email"
    ],
    "clientContactSnapshot": {
      "phoneE164": "+5579999991001",
      "email": "mariana.cliente@example.com"
    },
    "lawyerContactSnapshot": {
      "phoneE164": "+5579999992001",
      "email": "ana.adv@example.com"
    },
    "acceptedAt": "2026-09-01T10:20:00-03:00",
    "releasedAt": "2026-09-01T10:20:00-03:00",
    "revokedAt": null,
    "closedAt": null,
    "createdAt": "2026-09-01T10:20:00-03:00",
    "updatedAt": "2026-09-01T10:20:00-03:00"
  },
  {
    "id": "request-002",
    "requestId": "request-002",
    "clientId": "client-002",
    "lawyerId": "lawyer-003",
    "status": "active",
    "releasedChannels": [
      "whatsapp"
    ],
    "clientContactSnapshot": {
      "phoneE164": "+5579999991002",
      "email": "joao.cliente@example.com"
    },
    "lawyerContactSnapshot": {
      "phoneE164": "+5579999992003",
      "email": "camila.member@example.com"
    },
    "acceptedAt": "2026-09-06T15:25:00-03:00",
    "releasedAt": "2026-09-06T15:25:00-03:00",
    "revokedAt": null,
    "closedAt": null,
    "createdAt": "2026-09-06T15:25:00-03:00",
    "updatedAt": "2026-09-06T15:25:00-03:00"
  }
];
