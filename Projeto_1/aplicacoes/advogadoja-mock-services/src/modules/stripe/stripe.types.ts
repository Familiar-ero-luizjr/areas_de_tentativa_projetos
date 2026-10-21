export interface CheckoutInput { userId:string; planId:string; }
export interface StripeEvent { id:string; type:string; data:Record<string,any>; }
