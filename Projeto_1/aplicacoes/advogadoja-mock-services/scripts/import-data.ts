import { db, type MockDatabase } from "../src/data/database/db"; export const importData=(text:string)=>{const next=JSON.parse(text) as MockDatabase;db.replace(next);return db.snapshot();};
