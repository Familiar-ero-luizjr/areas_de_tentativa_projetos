import { db } from "../data/database/db"; export const mockState={snapshot:()=>db.snapshot(),reset:()=>db.reset()};
