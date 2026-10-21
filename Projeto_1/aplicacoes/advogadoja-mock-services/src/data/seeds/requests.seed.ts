import { db } from "../database/db";
export const seedCollections = [
  "contactRequests",
  "contactRequestEvents",
  "contactAcceptances"
] as const;
export function getSeedSlice() {
  return Object.fromEntries(seedCollections.map((name) => [name, structuredClone(db.collection(name))]));
}
