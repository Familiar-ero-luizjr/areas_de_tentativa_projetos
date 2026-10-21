import type { DatabaseGateway } from "../../contracts/DatabaseGateway";
import { db } from "../../data/database/db";
export class MockFirestoreGateway implements DatabaseGateway {
  async list<T=unknown>(collection: string): Promise<T[]> { return structuredClone(db.collection(collection)) as T[]; }
  async get<T=unknown>(collection: string, id: string): Promise<T | null> { return structuredClone(db.find(collection, id) ?? null) as T | null; }
  async set<T=unknown>(collection: string, id: string, value: T): Promise<T> {
    const current = db.find(collection, id);
    if (current) db.update(collection, id, value as Record<string, unknown>);
    else db.insert(collection, { ...(value as object), id });
    return structuredClone(value);
  }
  async remove(collection: string, id: string) { return db.remove(collection, id); }
}
