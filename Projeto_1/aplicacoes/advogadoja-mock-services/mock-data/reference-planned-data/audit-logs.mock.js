/* Mocks/audit-logs.mock.js — audit_logs/{logId} — dados simulados */
window.MOCKS = window.MOCKS || {};

window.MOCKS.auditLogs = [
  {
    "id": "audit-001",
    "actorId": "lawyer-002",
    "actorType": "lawyer",
    "action": "office.invite.created",
    "subjectType": "office_invite",
    "subjectId": "invite-002",
    "requestId": null,
    "metadata": {
      "officeId": "office-001",
      "invitedUid": "lawyer-004"
    },
    "createdAt": "2026-09-10T09:00:00-03:00"
  },
  {
    "id": "audit-002",
    "actorId": "lawyer-003",
    "actorType": "lawyer",
    "action": "contact_request.accepted",
    "subjectType": "contact_request",
    "subjectId": "request-002",
    "requestId": "request-002",
    "metadata": {
      "officeId": "office-001"
    },
    "createdAt": "2026-09-06T15:25:00-03:00"
  },
  {
    "id": "audit-003",
    "actorId": "admin-001",
    "actorType": "admin",
    "action": "support_ticket.resolved",
    "subjectType": "support_ticket",
    "subjectId": "ticket-002",
    "requestId": null,
    "metadata": {},
    "createdAt": "2026-09-08T16:30:00-03:00"
  },
  {
    "id": "audit-004",
    "actorId": "client-001",
    "actorType": "client",
    "action": "privacy_request.created",
    "subjectType": "privacy_request",
    "subjectId": "privacy-request-001",
    "requestId": null,
    "metadata": {
      "requestType": "access"
    },
    "createdAt": "2026-09-12T11:00:00-03:00"
  }
];
