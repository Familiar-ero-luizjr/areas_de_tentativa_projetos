export type Role = 'cliente' | 'advogado';
export type Account = { id: string; email: string; passwordHash: string; role: Role; name: string; status: 'active' | 'pending'; createdAt: string };
export type Client = { userId: string; name: string; phone?: string; username?: string; cpf?: string; birthDate?: string; gender?: string; address?: Record<string,string>; onboarding: { location?: string; contactPreference?: string; contactTime?: string; completed: boolean }; updatedAt: string };
export type Consent = { id: string; userId: string; document: string; version: string; acceptedAt: string };
export type Session = { tokenHash: string; userId: string; expiresAt: string };
export type Professional = { id: string; name: string; area: string; city: string; rating: number };
export type PublicAccount = Omit<Account,'passwordHash'>;
export function publicAccount(account: Account): PublicAccount { const {passwordHash: _secret, ...safe} = account; return safe; }
