export interface MockMigration { version: number; name: string; run: () => void; }
export const migrations: MockMigration[] = [
  { version: 1, name: "initial-planned-data", run: () => void 0 },
];
export function migrate() { migrations.forEach((m) => m.run()); return migrations.at(-1)?.version ?? 0; }
