export interface AuthUser { uid: string; email: string; displayName?: string; }
export interface AuthGateway { signIn(email: string, password: string): Promise<AuthUser>; signOut(): Promise<void>; currentUser(): AuthUser | null; }
