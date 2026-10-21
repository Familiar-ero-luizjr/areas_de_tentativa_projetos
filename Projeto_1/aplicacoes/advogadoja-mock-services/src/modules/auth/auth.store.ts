import type { MockSession } from "./auth.types";
let session: MockSession = { user: null, token: null, signedInAt: null };
export const authStore = {
  get: () => session,
  set: (next: MockSession) => { session = next; },
  clear: () => { session = { user: null, token: null, signedInAt: null }; },
};
