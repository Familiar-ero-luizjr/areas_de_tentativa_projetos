export type FunctionInput = Record<string, any>;
export type FunctionResult = unknown;
export type FunctionHandler = (input: FunctionInput) => Promise<FunctionResult> | FunctionResult;
