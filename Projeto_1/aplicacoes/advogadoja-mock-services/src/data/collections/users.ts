export const usersSeed = [
  {
    "id": "client-001",
    "name": "Mariana",
    "surname": "Oliveira",
    "username": "mariana.oliveira",
    "currentUsername": "mariana.oliveira",
    "email": "mariana.cliente@example.com",
    "pendingEmail": null,
    "profiles": [
      "cliente"
    ],
    "active": true,
    "accountStatus": "active",
    "legalConsent": {
      "status": "accepted",
      "version": "1.0",
      "acceptedAt": "2026-08-20T14:10:00-03:00",
      "revokedAt": null,
      "context": "signup"
    },
    "locationConsent": {
      "status": "accepted",
      "version": "1.0",
      "acceptedAt": "2026-08-20T14:11:00-03:00",
      "revokedAt": null,
      "context": "nearby-lawyers"
    },
    "communicationPreferences": {
      "push": true,
      "email": true
    },
    "createdAt": "2026-08-20T14:00:00-03:00",
    "updatedAt": "2026-09-10T18:40:00-03:00"
  },
  {
    "id": "client-002",
    "name": "João",
    "surname": "Pedro Santos",
    "username": "joao.santos",
    "currentUsername": "joao.santos",
    "email": "joao.cliente@example.com",
    "pendingEmail": null,
    "profiles": [
      "cliente"
    ],
    "active": true,
    "accountStatus": "active",
    "legalConsent": {
      "status": "accepted",
      "version": "1.0",
      "acceptedAt": "2026-08-28T09:05:00-03:00",
      "revokedAt": null,
      "context": "signup"
    },
    "locationConsent": {
      "status": "pending",
      "version": "1.0",
      "acceptedAt": null,
      "revokedAt": null,
      "context": "nearby-lawyers"
    },
    "communicationPreferences": {
      "push": true,
      "email": false
    },
    "createdAt": "2026-08-28T09:00:00-03:00",
    "updatedAt": "2026-09-11T10:15:00-03:00"
  },
  {
    "id": "lawyer-001",
    "name": "Ana Beatriz",
    "surname": "Souza",
    "username": "ana.souza",
    "currentUsername": "ana.souza",
    "email": "ana.adv@example.com",
    "pendingEmail": null,
    "profiles": [
      "advogado"
    ],
    "active": true,
    "accountStatus": "active",
    "legalConsent": {
      "status": "accepted",
      "version": "1.0",
      "acceptedAt": "2026-07-02T10:01:00-03:00",
      "revokedAt": null,
      "context": "lawyer-onboarding"
    },
    "locationConsent": {
      "status": "accepted",
      "version": "1.0",
      "acceptedAt": "2026-07-02T10:02:00-03:00",
      "revokedAt": null,
      "context": "professional-location"
    },
    "communicationPreferences": {
      "push": true,
      "email": true
    },
    "createdAt": "2026-07-02T10:00:00-03:00",
    "updatedAt": "2026-09-12T08:30:00-03:00"
  },
  {
    "id": "lawyer-002",
    "name": "Rafael",
    "surname": "Mendes Costa",
    "username": "rafael.costa",
    "currentUsername": "rafael.costa",
    "email": "rafael.owner@example.com",
    "pendingEmail": null,
    "profiles": [
      "advogado"
    ],
    "active": true,
    "accountStatus": "active",
    "legalConsent": {
      "status": "accepted",
      "version": "1.0",
      "acceptedAt": "2026-06-15T11:01:00-03:00",
      "revokedAt": null,
      "context": "lawyer-onboarding"
    },
    "locationConsent": {
      "status": "accepted",
      "version": "1.0",
      "acceptedAt": "2026-06-15T11:02:00-03:00",
      "revokedAt": null,
      "context": "professional-location"
    },
    "communicationPreferences": {
      "push": true,
      "email": true
    },
    "createdAt": "2026-06-15T11:00:00-03:00",
    "updatedAt": "2026-09-12T12:00:00-03:00"
  },
  {
    "id": "lawyer-003",
    "name": "Camila",
    "surname": "Rocha Lima",
    "username": "camila.lima",
    "currentUsername": "camila.lima",
    "email": "camila.member@example.com",
    "pendingEmail": null,
    "profiles": [
      "advogado"
    ],
    "active": true,
    "accountStatus": "active",
    "legalConsent": {
      "status": "accepted",
      "version": "1.0",
      "acceptedAt": "2026-07-10T16:01:00-03:00",
      "revokedAt": null,
      "context": "lawyer-onboarding"
    },
    "locationConsent": {
      "status": "accepted",
      "version": "1.0",
      "acceptedAt": "2026-07-10T16:02:00-03:00",
      "revokedAt": null,
      "context": "professional-location"
    },
    "communicationPreferences": {
      "push": true,
      "email": true
    },
    "createdAt": "2026-07-10T16:00:00-03:00",
    "updatedAt": "2026-09-12T09:20:00-03:00"
  },
  {
    "id": "lawyer-004",
    "name": "Bruno",
    "surname": "Tavares Alves",
    "username": "bruno.alves",
    "currentUsername": "bruno.alves",
    "email": "bruno.invited@example.com",
    "pendingEmail": null,
    "profiles": [
      "advogado"
    ],
    "active": true,
    "accountStatus": "active",
    "legalConsent": {
      "status": "accepted",
      "version": "1.0",
      "acceptedAt": "2026-08-01T13:01:00-03:00",
      "revokedAt": null,
      "context": "lawyer-onboarding"
    },
    "locationConsent": {
      "status": "accepted",
      "version": "1.0",
      "acceptedAt": "2026-08-01T13:02:00-03:00",
      "revokedAt": null,
      "context": "professional-location"
    },
    "communicationPreferences": {
      "push": true,
      "email": true
    },
    "createdAt": "2026-08-01T13:00:00-03:00",
    "updatedAt": "2026-09-12T10:00:00-03:00"
  }
] as const;
