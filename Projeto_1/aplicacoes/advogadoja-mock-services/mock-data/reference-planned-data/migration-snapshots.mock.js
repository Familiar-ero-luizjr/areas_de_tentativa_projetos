/* Mocks/migration-snapshots.mock.js — migration_snapshots/{snapshotId} — dados simulados */
window.MOCKS = window.MOCKS || {};

window.MOCKS.migrationSnapshots = [
  {
    "id": "snapshot-001",
    "migrationId": "migration-001",
    "sourceSystem": "legacy-firestore",
    "sourcePath": "advogados/legacy-lawyer-001",
    "sourceId": "legacy-lawyer-001",
    "data": {
      "nome": "Ana Souza",
      "cidade": "Aracaju"
    },
    "checksum": "mock-checksum-001",
    "importedAt": "2026-08-15T01:02:00-03:00",
    "retentionStatus": "active",
    "createdAt": "2026-08-15T01:02:00-03:00"
  },
  {
    "id": "snapshot-002",
    "migrationId": "migration-001",
    "sourceSystem": "legacy-firestore",
    "sourcePath": "escritorios/legacy-office-001",
    "sourceId": "legacy-office-001",
    "data": {
      "nome": "Costa & Lima Advocacia"
    },
    "checksum": "mock-checksum-002",
    "importedAt": "2026-08-15T01:03:00-03:00",
    "retentionStatus": "active",
    "createdAt": "2026-08-15T01:03:00-03:00"
  }
];
