import { stripeService } from "../stripe.service";
export const createCheckout = (userId:string, planId:string) => stripeService.createCheckout({userId,planId});
