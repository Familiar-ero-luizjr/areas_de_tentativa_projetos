import { db } from "../../../data/database/db"; import { now, uid, required } from "./_helpers";
export default function recordConsent(input: Record<string, any>) {
  const record = { id: uid("consent"), userId: required(input.userId,"userId"), type: required(input.type,"type"), version: input.version ?? "1.0", status: input.status ?? "accepted", context: input.context ?? "app", acceptedAt: input.status === "revoked" ? null : now(), revokedAt: input.status === "revoked" ? now() : null, createdAt: now() };
  db.insert("consentHistory", record); return record;
}
