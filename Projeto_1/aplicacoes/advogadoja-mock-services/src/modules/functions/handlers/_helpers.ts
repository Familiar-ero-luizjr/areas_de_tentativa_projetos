import { db } from "../../../data/database/db";
export const now = () => new Date().toISOString();
export const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
export const required = <T>(value: T | null | undefined, name: string): T => {
  if (value === undefined || value === null || value === "") throw new Error(`Campo obrigatório: ${name}`);
  return value;
};
export const collection = (name: string) => db.collection(name);
export const find = (name: string, id: string) => db.find(name, id);
