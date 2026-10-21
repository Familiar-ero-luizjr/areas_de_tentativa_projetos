import { db } from "../../../data/database/db";
export default function getPendingOfficeInvite(input: Record<string, any>) { const uid=input.userId; const email=String(input.email??"").toLowerCase(); return db.collection("officeInvites").find((i:any)=>i.status==="pending"&&((uid&&i.invitedUid===uid)||(email&&String(i.email??"").toLowerCase()===email)))??null; }
