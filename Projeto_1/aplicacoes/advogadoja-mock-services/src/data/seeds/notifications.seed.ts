import { db } from "../database/db";
export const seedCollections = [
  "notifications"
] as const;
export function getSeedSlice() {
  return Object.fromEntries(seedCollections.map((name) => [name, structuredClone(db.collection(name))]));
}
