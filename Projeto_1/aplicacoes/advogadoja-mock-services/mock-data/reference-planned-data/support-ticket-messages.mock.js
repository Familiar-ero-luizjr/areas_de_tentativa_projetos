/* Mocks/support-ticket-messages.mock.js — support_tickets/{ticketId}/messages/{messageId} — dados simulados */
window.MOCKS = window.MOCKS || {};

window.MOCKS.supportTicketMessages = {
  "ticket-001": [
    {
      "id": "message-001",
      "ticketId": "ticket-001",
      "senderUserId": "client-001",
      "senderRole": "cliente",
      "message": "Quero entender quais dados ficam vinculados à minha conta.",
      "attachmentUrls": [],
      "createdAt": "2026-09-09T11:00:00-03:00"
    },
    {
      "id": "message-002",
      "ticketId": "ticket-001",
      "senderUserId": "admin-001",
      "senderRole": "admin",
      "message": "Recebemos a solicitação e estamos verificando as informações.",
      "attachmentUrls": [],
      "createdAt": "2026-09-09T11:30:00-03:00"
    }
  ],
  "ticket-002": [
    {
      "id": "message-003",
      "ticketId": "ticket-002",
      "senderUserId": "lawyer-003",
      "senderRole": "advogado",
      "message": "Meu vínculo com o escritório já está ativo?",
      "attachmentUrls": [],
      "createdAt": "2026-09-08T14:00:00-03:00"
    },
    {
      "id": "message-004",
      "ticketId": "ticket-002",
      "senderUserId": "admin-001",
      "senderRole": "admin",
      "message": "Sim. Seu vínculo está como membro ativo.",
      "attachmentUrls": [],
      "createdAt": "2026-09-08T16:25:00-03:00"
    }
  ]
};
