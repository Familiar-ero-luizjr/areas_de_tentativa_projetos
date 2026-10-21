/* Mocks/plans.mock.js — plans/{planId} — dados simulados */
window.MOCKS = window.MOCKS || {};

window.MOCKS.plans = [
  {
    "id": "plan-essential",
    "code": "essential",
    "name": "Essencial",
    "description": "Perfil profissional e recursos básicos.",
    "benefits": [
      "Perfil profissional",
      "Validação OAB",
      "Disponibilidade manual"
    ],
    "price": 49.9,
    "currency": "BRL",
    "billingInterval": "month",
    "targetType": "professional",
    "provider": "stripe",
    "providerProductId": "prod_mock_essential",
    "providerPriceId": "price_mock_essential",
    "storeProductIds": {
      "android": "essential_monthly",
      "ios": "essential_monthly"
    },
    "active": true,
    "sortOrder": 1,
    "createdAt": "2026-06-01T08:00:00-03:00",
    "updatedAt": "2026-09-01T08:00:00-03:00"
  },
  {
    "id": "plan-professional",
    "code": "professional",
    "name": "Profissional",
    "description": "Recursos operacionais para advogado.",
    "benefits": [
      "Solicitações",
      "Agenda",
      "Notificações",
      "Histórico"
    ],
    "price": 99.9,
    "currency": "BRL",
    "billingInterval": "month",
    "targetType": "professional",
    "provider": "stripe",
    "providerProductId": "prod_mock_professional",
    "providerPriceId": "price_mock_professional",
    "storeProductIds": {
      "android": "professional_monthly",
      "ios": "professional_monthly"
    },
    "active": true,
    "sortOrder": 2,
    "createdAt": "2026-06-01T08:00:00-03:00",
    "updatedAt": "2026-09-01T08:00:00-03:00"
  },
  {
    "id": "plan-office",
    "code": "office",
    "name": "Escritório",
    "description": "Plano para gestão de equipe de advogados.",
    "benefits": [
      "Múltiplos advogados",
      "Distribuição interna",
      "Relatórios"
    ],
    "price": 199.9,
    "currency": "BRL",
    "billingInterval": "month",
    "targetType": "office",
    "provider": "stripe",
    "providerProductId": "prod_mock_office",
    "providerPriceId": "price_mock_office",
    "storeProductIds": {
      "android": "office_monthly",
      "ios": "office_monthly"
    },
    "active": true,
    "sortOrder": 3,
    "createdAt": "2026-06-01T08:00:00-03:00",
    "updatedAt": "2026-09-01T08:00:00-03:00"
  }
];
