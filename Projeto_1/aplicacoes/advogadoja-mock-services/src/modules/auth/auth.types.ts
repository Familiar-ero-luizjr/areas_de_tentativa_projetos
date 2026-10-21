export interface MockAuthUser { uid: string; email: string; displayName?: string; roles: string[]; }
export interface MockSession { user: MockAuthUser | null; token: string | null; signedInAt: string | null; }
