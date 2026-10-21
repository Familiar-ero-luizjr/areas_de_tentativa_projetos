import { db } from "../../../data/database/db"; import { now, required } from "./_helpers";
export default function submitLawyerProfileForReview(input: Record<string, any>) { const lawyerId=required(input.lawyerId,"lawyerId"); const item=db.update("lawyers",lawyerId,{profileStatus:"pending_review",profileSubmittedAt:now()}); if(!item) throw new Error("Advogado não encontrado"); return item; }
