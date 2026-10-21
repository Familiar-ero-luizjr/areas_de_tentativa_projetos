import { db } from "./db";
export function seedDatabase() { db.reset(); return db.snapshot(); }
