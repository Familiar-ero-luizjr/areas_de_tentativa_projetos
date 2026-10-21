/* Mocks/reports.mock.js — reports/{reportId} — dados simulados */
window.MOCKS = window.MOCKS || {};

window.MOCKS.reports = [
  {
    "id": "report-001",
    "reporterUserId": "client-002",
    "reporterRole": "cliente",
    "targetType": "lawyer",
    "targetId": "lawyer-004",
    "requestId": "request-004",
    "subject": "Contato não concluído",
    "category": "Uso irregular",
    "body": "Registro fictício para testar a fila de moderação.",
    "evidenceUrls": [],
    "status": "open",
    "priority": "normal",
    "assignedAdminId": "admin-001",
    "decision": null,
    "resolutionNote": null,
    "resolvedBy": null,
    "resolvedAt": null,
    "createdAt": "2026-09-12T08:00:00-03:00",
    "updatedAt": "2026-09-12T08:00:00-03:00"
  },
  {
    "id": "report-002",
    "reporterUserId": "lawyer-001",
    "reporterRole": "advogado",
    "targetType": "request",
    "targetId": "request-003",
    "requestId": "request-003",
    "subject": "Informações insuficientes",
    "category": "Solicitação",
    "body": "Registro fictício para testar análise administrativa.",
    "evidenceUrls": [],
    "status": "resolved",
    "priority": "low",
    "assignedAdminId": "admin-001",
    "decision": "no_action",
    "resolutionNote": "Sem violação identificada no cenário simulado.",
    "resolvedBy": "admin-001",
    "resolvedAt": "2026-09-12T14:00:00-03:00",
    "createdAt": "2026-09-12T10:00:00-03:00",
    "updatedAt": "2026-09-12T14:00:00-03:00"
  }
];
