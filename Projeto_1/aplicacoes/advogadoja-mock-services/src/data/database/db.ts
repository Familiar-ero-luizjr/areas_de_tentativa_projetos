import { usersSeed } from "../collections/users";
import { clientsSeed } from "../collections/clients";
import { lawyersSeed } from "../collections/lawyers";
import { lawyerPrivateSeed } from "../collections/lawyerPrivate";
import { lawOfficesSeed } from "../collections/lawOffices";
import { lawOfficeMembersSeed } from "../collections/lawOfficeMembers";
import { officeInvitesSeed } from "../collections/officeInvites";
import { contactRequestsSeed } from "../collections/contactRequests";
import { contactRequestEventsSeed } from "../collections/contactRequestEvents";
import { contactAcceptancesSeed } from "../collections/contactAcceptances";
import { notificationsSeed } from "../collections/notifications";
import { plansSeed } from "../collections/plans";
import { subscriptionsSeed } from "../collections/subscriptions";
import { paymentEventsSeed } from "../collections/paymentEvents";
import { experienceReviewsSeed } from "../collections/experienceReviews";
import { legalDocumentsSeed } from "../collections/legalDocuments";
import { consentHistorySeed } from "../collections/consentHistory";
import { auditLogsSeed } from "../collections/auditLogs";
import { adminStaffSeed } from "../collections/adminStaff";
import { supportTicketsSeed } from "../collections/supportTickets";
import { supportTicketMessagesSeed } from "../collections/supportTicketMessages";
import { reportsSeed } from "../collections/reports";
import { privacyRequestsSeed } from "../collections/privacyRequests";
import { platformPaymentsSeed } from "../collections/platformPayments";
import { specialtiesSeed } from "../collections/specialties";
import { serviceTypesSeed } from "../collections/serviceTypes";
import { serviceModalitiesSeed } from "../collections/serviceModalities";
import { structuresSeed } from "../collections/structures";
import { userDevicesSeed } from "../collections/userDevices";
import { userSessionsSeed } from "../collections/userSessions";
import { firebaseAuthSeed } from "../collections/firebaseAuth";

export type AnyRecord = Record<string, any>;
export type MockDatabase = Record<string, AnyRecord[]>;

function toCollection(seed: unknown): AnyRecord[] {
  const value = structuredClone(seed) as any;
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.every(([, child]) => Array.isArray(child))) {
      return entries.flatMap(([groupKey, child]) => (child as AnyRecord[]).map((item) => ({ _groupKey: groupKey, ...item })));
    }
    return entries.map(([id, child]) => child && typeof child === "object" ? ({ id, ...(child as AnyRecord) }) : ({ id, value: child }));
  }
  return [{ id: "value", value }];
}

function buildSeed(): MockDatabase {
  return {
  users: toCollection(usersSeed),
  clients: toCollection(clientsSeed),
  lawyers: toCollection(lawyersSeed),
  lawyerPrivate: toCollection(lawyerPrivateSeed),
  lawOffices: toCollection(lawOfficesSeed),
  lawOfficeMembers: toCollection(lawOfficeMembersSeed),
  officeInvites: toCollection(officeInvitesSeed),
  contactRequests: toCollection(contactRequestsSeed),
  contactRequestEvents: toCollection(contactRequestEventsSeed),
  contactAcceptances: toCollection(contactAcceptancesSeed),
  notifications: toCollection(notificationsSeed),
  plans: toCollection(plansSeed),
  subscriptions: toCollection(subscriptionsSeed),
  paymentEvents: toCollection(paymentEventsSeed),
  experienceReviews: toCollection(experienceReviewsSeed),
  legalDocuments: toCollection(legalDocumentsSeed),
  consentHistory: toCollection(consentHistorySeed),
  auditLogs: toCollection(auditLogsSeed),
  adminStaff: toCollection(adminStaffSeed),
  supportTickets: toCollection(supportTicketsSeed),
  supportTicketMessages: toCollection(supportTicketMessagesSeed),
  reports: toCollection(reportsSeed),
  privacyRequests: toCollection(privacyRequestsSeed),
  platformPayments: toCollection(platformPaymentsSeed),
  specialties: toCollection(specialtiesSeed),
  serviceTypes: toCollection(serviceTypesSeed),
  serviceModalities: toCollection(serviceModalitiesSeed),
  structures: toCollection(structuresSeed),
  userDevices: toCollection(userDevicesSeed),
  userSessions: toCollection(userSessionsSeed),
  firebaseAuth: toCollection(firebaseAuthSeed),
  };
}

let state: MockDatabase = buildSeed();

export const db = {
  collection(name: string): AnyRecord[] {
    if (!state[name]) state[name] = [];
    return state[name];
  },
  find(name: string, id: string): AnyRecord | undefined {
    return this.collection(name).find((item) => item.id === id);
  },
  insert(name: string, value: AnyRecord): AnyRecord {
    this.collection(name).push(value);
    return value;
  },
  update(name: string, id: string, patch: AnyRecord): AnyRecord | undefined {
    const item = this.find(name, id);
    if (!item) return undefined;
    Object.assign(item, patch, { updatedAt: new Date().toISOString() });
    return item;
  },
  remove(name: string, id: string): boolean {
    const items = this.collection(name);
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return false;
    items.splice(index, 1);
    return true;
  },
  snapshot(): MockDatabase {
    return structuredClone(state);
  },
  replace(next: MockDatabase) {
    state = structuredClone(next);
  },
  reset() {
    state = buildSeed();
  },
};
