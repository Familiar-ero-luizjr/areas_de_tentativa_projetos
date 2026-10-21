export type QueryOperator = "==" | "!=" | "in" | "array-contains";
export interface QueryClause { field: string; op: QueryOperator; value: unknown; }
