export const experienceReviewsSeed = [
  {
    "id": "request-001",
    "requestId": "request-001",
    "clientId": "client-001",
    "lawyerId": "lawyer-001",
    "stars": 5,
    "criteria": {
      "clarity": 5,
      "responseTime": 5,
      "respectfulCommunication": 5
    },
    "comment": "Contato claro e rápido.",
    "status": "published",
    "published": true,
    "moderationNote": null,
    "moderatedBy": null,
    "moderatedAt": null,
    "createdAt": "2026-09-08T18:00:00-03:00",
    "updatedAt": "2026-09-08T18:00:00-03:00"
  },
  {
    "id": "request-002",
    "requestId": "request-002",
    "clientId": "client-002",
    "lawyerId": "lawyer-003",
    "stars": 4,
    "criteria": {
      "clarity": 4,
      "responseTime": 4,
      "respectfulCommunication": 5
    },
    "comment": "Atendimento objetivo.",
    "status": "published",
    "published": true,
    "moderationNote": null,
    "moderatedBy": null,
    "moderatedAt": null,
    "createdAt": "2026-09-10T12:30:00-03:00",
    "updatedAt": "2026-09-10T12:30:00-03:00"
  }
] as const;
