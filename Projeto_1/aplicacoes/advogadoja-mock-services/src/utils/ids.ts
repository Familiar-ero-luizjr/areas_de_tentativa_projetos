export const createId=(prefix="id")=>`${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
