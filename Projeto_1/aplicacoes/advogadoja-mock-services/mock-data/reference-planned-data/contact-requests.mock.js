/* Mocks/contact-requests.mock.js — contact_requests/{requestId} — dados simulados */
window.MOCKS = window.MOCKS || {};

window.MOCKS.contactRequests = [
  {
    "id": "request-001",
    "clientId": "client-001",
    "lawyerId": "lawyer-001",
    "officeId": null,
    "assignedLawyerId": "lawyer-001",
    "assignedBy": null,
    "assignedAt": "2026-09-01T10:05:00-03:00",
    "needType": "priority-contact",
    "specialtyId": "family",
    "specialtyIds": [
      "family"
    ],
    "area": "Família",
    "areas": [
      "Família"
    ],
    "title": "Orientação sobre guarda",
    "description": "Cliente busca orientação inicial sobre guarda e convivência.",
    "modality": "online",
    "city": "Aracaju",
    "cityNormalized": "aracaju",
    "uf": "SE",
    "location": {
      "latitude": -10.9472,
      "longitude": -37.0731,
      "source": "gps",
      "capturedAt": "2026-09-01T10:00:00-03:00"
    },
    "status": "accepted",
    "eligibleLawyerIds": [
      "lawyer-001",
      "lawyer-002"
    ],
    "declinedBy": [],
    "declineReason": null,
    "cancellationReason": null,
    "closureReason": null,
    "closureNote": null,
    "acceptedAt": "2026-09-01T10:20:00-03:00",
    "declinedAt": null,
    "cancelledAt": null,
    "expiredAt": null,
    "closedAt": null,
    "createdAt": "2026-09-01T10:00:00-03:00",
    "updatedAt": "2026-09-01T10:20:00-03:00",
    "attachmentUrls": []
  },
  {
    "id": "request-002",
    "clientId": "client-002",
    "lawyerId": null,
    "officeId": "office-001",
    "assignedLawyerId": "lawyer-003",
    "assignedBy": "lawyer-002",
    "assignedAt": "2026-09-06T15:10:00-03:00",
    "needType": "consultation",
    "specialtyId": "labor",
    "specialtyIds": [
      "labor"
    ],
    "area": "Trabalhista",
    "areas": [
      "Trabalhista"
    ],
    "title": "Dúvida sobre rescisão",
    "description": "Cliente quer entender documentos e próximos passos após rescisão.",
    "modality": "ambos",
    "city": "Aracaju",
    "cityNormalized": "aracaju",
    "uf": "SE",
    "location": {
      "latitude": null,
      "longitude": null,
      "source": "manual",
      "capturedAt": null
    },
    "status": "accepted",
    "eligibleLawyerIds": [
      "lawyer-003"
    ],
    "declinedBy": [],
    "declineReason": null,
    "cancellationReason": null,
    "closureReason": null,
    "closureNote": null,
    "acceptedAt": "2026-09-06T15:25:00-03:00",
    "declinedAt": null,
    "cancelledAt": null,
    "expiredAt": null,
    "closedAt": null,
    "createdAt": "2026-09-06T15:00:00-03:00",
    "updatedAt": "2026-09-06T15:25:00-03:00",
    "attachmentUrls": []
  },
  {
    "id": "request-003",
    "clientId": "client-001",
    "lawyerId": null,
    "officeId": null,
    "assignedLawyerId": null,
    "assignedBy": null,
    "assignedAt": null,
    "needType": "consultation",
    "specialtyId": "consumer",
    "specialtyIds": [
      "consumer"
    ],
    "area": "Consumidor",
    "areas": [
      "Consumidor"
    ],
    "title": "Cobrança que não reconheço",
    "description": "Cliente relata cobrança e busca orientação inicial.",
    "modality": "online",
    "city": "Aracaju",
    "cityNormalized": "aracaju",
    "uf": "SE",
    "location": {
      "latitude": -10.9472,
      "longitude": -37.0731,
      "source": "gps",
      "capturedAt": "2026-09-12T19:10:00-03:00"
    },
    "status": "waiting",
    "eligibleLawyerIds": [
      "lawyer-002",
      "lawyer-003"
    ],
    "declinedBy": [],
    "declineReason": null,
    "cancellationReason": null,
    "closureReason": null,
    "closureNote": null,
    "acceptedAt": null,
    "declinedAt": null,
    "cancelledAt": null,
    "expiredAt": null,
    "closedAt": null,
    "createdAt": "2026-09-12T19:10:00-03:00",
    "updatedAt": "2026-09-12T19:10:00-03:00",
    "attachmentUrls": []
  },
  {
    "id": "request-004",
    "clientId": "client-002",
    "lawyerId": "lawyer-004",
    "officeId": null,
    "assignedLawyerId": null,
    "assignedBy": null,
    "assignedAt": null,
    "needType": "priority-contact",
    "specialtyId": "criminal",
    "specialtyIds": [
      "criminal"
    ],
    "area": "Criminal",
    "areas": [
      "Criminal"
    ],
    "title": "Contato com criminalista",
    "description": "Cliente solicitou contato prioritário com profissional da área criminal.",
    "modality": "online",
    "city": "Aracaju",
    "cityNormalized": "aracaju",
    "uf": "SE",
    "location": {
      "latitude": null,
      "longitude": null,
      "source": "manual",
      "capturedAt": null
    },
    "status": "declined",
    "eligibleLawyerIds": [
      "lawyer-004"
    ],
    "declinedBy": [
      "lawyer-004"
    ],
    "declineReason": "Indisponível no horário solicitado",
    "cancellationReason": null,
    "closureReason": null,
    "closureNote": null,
    "acceptedAt": null,
    "declinedAt": "2026-09-11T21:00:00-03:00",
    "cancelledAt": null,
    "expiredAt": null,
    "closedAt": null,
    "createdAt": "2026-09-11T20:30:00-03:00",
    "updatedAt": "2026-09-11T21:00:00-03:00",
    "attachmentUrls": []
  }
];
