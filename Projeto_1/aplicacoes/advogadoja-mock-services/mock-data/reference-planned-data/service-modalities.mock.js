/* Mocks/service-modalities.mock.js — service_modalities/{modalityId} — dados simulados */
window.MOCKS = window.MOCKS || {};

window.MOCKS.serviceModalities = [
  {
    "id": "online",
    "code": "online",
    "label": "Online",
    "description": "Atendimento remoto.",
    "active": true,
    "sortOrder": 1,
    "createdAt": "2026-06-01T08:00:00-03:00",
    "updatedAt": "2026-09-01T08:00:00-03:00"
  },
  {
    "id": "presencial",
    "code": "presencial",
    "label": "Presencial",
    "description": "Atendimento presencial.",
    "active": true,
    "sortOrder": 2,
    "createdAt": "2026-06-01T08:00:00-03:00",
    "updatedAt": "2026-09-01T08:00:00-03:00"
  },
  {
    "id": "ambos",
    "code": "ambos",
    "label": "Online ou presencial",
    "description": "Permite as duas modalidades.",
    "active": true,
    "sortOrder": 3,
    "createdAt": "2026-06-01T08:00:00-03:00",
    "updatedAt": "2026-09-01T08:00:00-03:00"
  }
];
