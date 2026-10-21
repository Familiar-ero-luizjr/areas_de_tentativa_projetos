import recordConsent from "./handlers/recordConsent";
import searchLawyers from "./handlers/searchLawyers";
import createContactRequest from "./handlers/createContactRequest";
import acceptContactRequest from "./handlers/acceptContactRequest";
import declineContactRequest from "./handlers/declineContactRequest";
import closeContactRequest from "./handlers/closeContactRequest";
import getReleasedContact from "./handlers/getReleasedContact";
import submitLawyerOab from "./handlers/submitLawyerOab";
import submitLawyerProfileForReview from "./handlers/submitLawyerProfileForReview";
import submitExperienceReview from "./handlers/submitExperienceReview";
import createSupportTicket from "./handlers/createSupportTicket";
import createReport from "./handlers/createReport";
import saveOffice from "./handlers/saveOffice";
import inviteOfficeLawyer from "./handlers/inviteOfficeLawyer";
import acceptOfficeInvite from "./handlers/acceptOfficeInvite";
import getPendingOfficeInvite from "./handlers/getPendingOfficeInvite";
import createSubscriptionCheckout from "./handlers/createSubscriptionCheckout";
import paymentWebhook from "./handlers/paymentWebhook";
import adminDashboard from "./handlers/adminDashboard";
import adminQueue from "./handlers/adminQueue";
import validateOab from "./handlers/validateOab";
import moderateLawyerProfile from "./handlers/moderateLawyerProfile";
import resolveReport from "./handlers/resolveReport";
import type { FunctionHandler } from "./functions.types";
export const functionRegistry: Record<string, FunctionHandler> = {
  recordConsent,
  searchLawyers,
  createContactRequest,
  acceptContactRequest,
  declineContactRequest,
  closeContactRequest,
  getReleasedContact,
  submitLawyerOab,
  submitLawyerProfileForReview,
  submitExperienceReview,
  createSupportTicket,
  createReport,
  saveOffice,
  inviteOfficeLawyer,
  acceptOfficeInvite,
  getPendingOfficeInvite,
  createSubscriptionCheckout,
  paymentWebhook,
  adminDashboard,
  adminQueue,
  validateOab,
  moderateLawyerProfile,
  resolveReport,
};
export const functionNames = Object.keys(functionRegistry).sort();
