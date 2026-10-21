import type { AuthGateway, AuthUser } from "../../contracts/AuthGateway";
import { authStore } from "./auth.store";
import { authFixtures } from "./auth.fixtures";

export class MockAuthGateway implements AuthGateway {
  async signIn(email: string, _password: string): Promise<AuthUser> {
    const candidate = Object.values(authFixtures).find((u) => u.email === email) ?? authFixtures.client;
    const user = { uid: candidate.uid, email: candidate.email, displayName: candidate.displayName };
    authStore.set({ user: { ...candidate, roles: [...candidate.roles] }, token: `mock.${candidate.uid}.${Date.now()}`, signedInAt: new Date().toISOString() });
    return user;
  }
  async signOut() { authStore.clear(); }
  currentUser() { const u = authStore.get().user; return u ? { uid: u.uid, email: u.email, displayName: u.displayName } : null; }
}
