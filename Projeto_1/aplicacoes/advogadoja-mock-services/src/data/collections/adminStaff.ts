export const adminStaffSeed = [
  {
    "id": "admin-001",
    "displayName": "Patrícia Admin",
    "email": "patricia.admin@example.com",
    "role": "admin",
    "permissions": [
      "lawyer-review",
      "support",
      "reports",
      "privacy"
    ],
    "status": "active",
    "department": "Operações",
    "phoneE164": "+5579999999001",
    "notes": "Conta administrativa fictícia para o protótipo.",
    "createdBy": null,
    "createdAt": "2026-06-01T08:00:00-03:00",
    "updatedAt": "2026-09-12T17:00:00-03:00",
    "lastAdminAccessAt": "2026-09-13T08:00:00-03:00"
  }
] as const;
