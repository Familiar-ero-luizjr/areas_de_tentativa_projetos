/* Mocks/migration-records.mock.js — migration_records/{recordId} — dados simulados */
window.MOCKS = window.MOCKS || {};

window.MOCKS.migrationRecords = [
  {
    "id": "migration-record-001",
    "migrationId": "migration-001",
    "sourceSystem": "legacy-firestore",
    "sourceCollection": "users",
    "sourceId": "legacy-user-001",
    "targetPath": "users/client-001",
    "targetId": "client-001",
    "status": "migrated",
    "warnings": [],
    "error": null,
    "migratedAt": "2026-08-15T01:01:00-03:00",
    "createdAt": "2026-08-15T01:01:00-03:00"
  },
  {
    "id": "migration-record-002",
    "migrationId": "migration-001",
    "sourceSystem": "legacy-firestore",
    "sourceCollection": "advogados",
    "sourceId": "legacy-lawyer-001",
    "targetPath": "lawyers/lawyer-001",
    "targetId": "lawyer-001",
    "status": "migrated",
    "warnings": [],
    "error": null,
    "migratedAt": "2026-08-15T01:02:00-03:00",
    "createdAt": "2026-08-15T01:02:00-03:00"
  },
  {
    "id": "migration-record-003",
    "migrationId": "migration-001",
    "sourceSystem": "legacy-firestore",
    "sourceCollection": "escritorios",
    "sourceId": "legacy-office-001",
    "targetPath": "law_offices/office-001",
    "targetId": "office-001",
    "status": "migrated",
    "warnings": [
      "Nome da coleção de origem mantido apenas como referência técnica."
    ],
    "error": null,
    "migratedAt": "2026-08-15T01:03:00-03:00",
    "createdAt": "2026-08-15T01:03:00-03:00"
  }
];
