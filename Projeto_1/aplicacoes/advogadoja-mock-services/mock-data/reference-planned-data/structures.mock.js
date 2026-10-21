/* Mocks/structures.mock.js — address + location (estruturas reutilizáveis) — dados simulados */
window.MOCKS = window.MOCKS || {};
// Não representam coleções Firestore; são exemplos reutilizáveis do índice.

window.MOCKS.structures = {
  "address": {
    "address": "Rua Exemplo",
    "addressNumber": "100",
    "complement": "Sala 2",
    "district": "Centro",
    "neighborhood": "Centro",
    "city": "Aracaju",
    "cityNormalized": "aracaju",
    "uf": "SE",
    "zipCode": "49000-000",
    "country": "BR"
  },
  "location": {
    "latitude": -10.9472,
    "longitude": -37.0731,
    "coordinates": {
      "latitude": -10.9472,
      "longitude": -37.0731
    },
    "source": "manual",
    "capturedAt": "2026-09-10T10:00:00-03:00"
  }
};
