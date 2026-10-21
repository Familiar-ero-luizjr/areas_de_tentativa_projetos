import { db } from "../../../data/database/db"; import { now, uid, required } from "./_helpers";
export default function createContactRequest(input: Record<string, any>) {
  const item = { id: uid("request"), clientId: required(input.clientId,"clientId"), lawyerId: required(input.lawyerId,"lawyerId"), status: "pending", subject: input.subject ?? "Contato jurídico", message: input.message ?? "", createdAt: now(), updatedAt: now() };
  db.insert("contactRequests", item); db.insert("contactRequestEvents",{ id:uid("request-event"), requestId:item.id, eventType:"created", actorId:item.clientId, createdAt:now() }); return item;
}
