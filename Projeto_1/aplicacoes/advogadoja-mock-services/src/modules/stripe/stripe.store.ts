import { db } from "../../data/database/db";
export const stripeStore = { plans: () => db.collection("plans"), subscriptions: () => db.collection("subscriptions"), events: () => db.collection("paymentEvents") };
