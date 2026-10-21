/* Mocks/office-invites.mock.js — office_invites/{inviteId} — dados simulados */
window.MOCKS = window.MOCKS || {};

window.MOCKS.officeInvites = [
  {
    "id": "invite-001",
    "officeId": "office-001",
    "invitedUid": "lawyer-003",
    "invitedEmail": "camila.member@example.com",
    "invitedBy": "lawyer-002",
    "role": "member",
    "status": "accepted",
    "createdAt": "2026-08-04T10:00:00-03:00",
    "expiresAt": "2026-08-11T10:00:00-03:00",
    "respondedAt": "2026-08-05T14:30:00-03:00",
    "invitedOab": "OAB/SE 34567"
  },
  {
    "id": "invite-002",
    "officeId": "office-001",
    "invitedUid": "lawyer-004",
    "invitedEmail": "bruno.invited@example.com",
    "invitedBy": "lawyer-002",
    "role": "member",
    "status": "pending",
    "createdAt": "2026-09-10T09:00:00-03:00",
    "expiresAt": "2026-09-17T09:00:00-03:00",
    "respondedAt": null,
    "invitedOab": "OAB/SE 45678"
  }
];
