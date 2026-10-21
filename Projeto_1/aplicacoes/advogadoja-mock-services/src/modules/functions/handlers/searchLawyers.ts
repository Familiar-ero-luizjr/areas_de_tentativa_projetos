import { db } from "../../../data/database/db";
export default function searchLawyers(input: Record<string, any>) {
  const q = String(input.query ?? "").toLowerCase(); const specialty = String(input.specialty ?? "").toLowerCase();
  const limit = Math.max(1, Math.min(Number(input.limit ?? 20), 100));
  return db.collection("lawyers").filter((l:any) => {
    const text = JSON.stringify(l).toLowerCase();
    return (!q || text.includes(q)) && (!specialty || text.includes(specialty)) && (l.active ?? true);
  }).slice(0, limit);
}
