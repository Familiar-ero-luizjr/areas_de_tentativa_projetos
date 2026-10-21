/* Mocks/migration-runs.mock.js — migration_runs/{migrationId} — dados simulados */
window.MOCKS = window.MOCKS || {};

window.MOCKS.migrationRuns = [
  {
    "id": "migration-001",
    "sourceSystem": "legacy-firestore",
    "targetSystem": "firestore",
    "version": "v3",
    "status": "completed",
    "startedAt": "2026-08-15T01:00:00-03:00",
    "finishedAt": "2026-08-15T01:05:00-03:00",
    "totalRecords": 3,
    "migratedRecords": 3,
    "failedRecords": 0,
    "warnings": [
      "Mocks de migração existem apenas para rastreabilidade técnica."
    ],
    "createdAt": "2026-08-15T00:55:00-03:00",
    "updatedAt": "2026-08-15T01:05:00-03:00"
  }
];
