/* Mocks/support-tickets.mock.js — support_tickets/{ticketId} — dados simulados */
window.MOCKS = window.MOCKS || {};

window.MOCKS.supportTickets = [
  {
    "id": "ticket-001",
    "userId": "client-001",
    "userRole": "cliente",
    "subject": "Privacidade da conta",
    "category": "Privacidade",
    "body": "Quero entender quais dados ficam vinculados à minha conta.",
    "status": "open",
    "priority": "normal",
    "attachmentUrls": [],
    "assignedAdminId": "admin-001",
    "resolution": null,
    "resolvedAt": null,
    "closedAt": null,
    "createdAt": "2026-09-09T11:00:00-03:00",
    "updatedAt": "2026-09-09T11:30:00-03:00"
  },
  {
    "id": "ticket-002",
    "userId": "lawyer-003",
    "userRole": "advogado",
    "subject": "Dúvida sobre vínculo com escritório",
    "category": "Perfil",
    "body": "Preciso confirmar como aparece meu vínculo com o escritório.",
    "status": "resolved",
    "priority": "normal",
    "attachmentUrls": [],
    "assignedAdminId": "admin-001",
    "resolution": "Vínculo confirmado como membro ativo.",
    "resolvedAt": "2026-09-08T16:30:00-03:00",
    "closedAt": "2026-09-08T16:35:00-03:00",
    "createdAt": "2026-09-08T14:00:00-03:00",
    "updatedAt": "2026-09-08T16:35:00-03:00"
  }
];
