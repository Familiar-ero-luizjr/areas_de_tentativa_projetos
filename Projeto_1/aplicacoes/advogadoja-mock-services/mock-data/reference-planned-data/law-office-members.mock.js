/* Mocks/law-office-members.mock.js — law_offices/{officeId}/members/{uid} — dados simulados */
window.MOCKS = window.MOCKS || {};

window.MOCKS.lawOfficeMembers = {
  "office-001": [
    {
      "id": "lawyer-002",
      "userId": "lawyer-002",
      "name": "Rafael Mendes Costa",
      "email": "rafael.owner@example.com",
      "oab": "OAB/SE 23456",
      "role": "owner",
      "status": "active",
      "invitedBy": null,
      "joinedAt": "2026-07-20T10:00:00-03:00",
      "createdAt": "2026-07-20T10:00:00-03:00",
      "updatedAt": "2026-09-12T12:00:00-03:00"
    },
    {
      "id": "lawyer-003",
      "userId": "lawyer-003",
      "name": "Camila Rocha Lima",
      "email": "camila.member@example.com",
      "oab": "OAB/SE 34567",
      "role": "member",
      "status": "active",
      "invitedBy": "lawyer-002",
      "joinedAt": "2026-08-05T14:30:00-03:00",
      "createdAt": "2026-08-04T10:00:00-03:00",
      "updatedAt": "2026-09-12T09:20:00-03:00"
    }
  ]
};
