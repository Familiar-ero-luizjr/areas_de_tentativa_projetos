import { db } from "../src/data/database/db"; export const exportData=()=>JSON.stringify(db.snapshot(),null,2);
