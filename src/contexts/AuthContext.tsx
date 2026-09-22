import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { userAccounts } from '../data/content';
import { memberById } from '../data/members';
import type { Member } from '../data/types';

/**
 * PROTOTYPE authentication only — simulated with mock data.
 * This is NOT production-secure and makes no such claim.
 * The data layer is structured so a real backend can replace it without UI changes.
 */

export type LookupResult =
  | { path: 'active'; name: string }
  | { path: 'activate'; name: string }
  | { path: 'locked' }
  | { path: 'inactive' }
  | { path: 'notFound' };

// A registered member who has NOT yet activated a CMICLT account (no user row, "pending"):
const PENDING_IDENTIFIERS = ['activate@cmicalicut.org', '+91 9847 000000'];

export interface CurrentUser {
  id: string;
  name: string;
  role: 'member' | 'superadmin';
  member?: Member;
}

interface AuthCtx {
  user: CurrentUser | null;
  lookup: (identifier: string) => Promise<LookupResult>;
  signIn: (identifier: string, password: string) => Promise<{ ok: boolean; needsOtp?: boolean; error?: string }>;
  completeSignIn: (identifier: string) => void;
  activate: (identifier: string) => void;
  signOut: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function normalize(id: string) {
  return id.trim().toLowerCase();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  const lookup = useCallback(async (identifier: string): Promise<LookupResult> => {
    await wait(900);
    const id = normalize(identifier);
    if (PENDING_IDENTIFIERS.some((p) => normalize(p) === id)) {
      return { path: 'activate', name: 'Fr. Emmanuel Cheruvallil CMI' };
    }
    const acct = userAccounts.find((u) => normalize(u.identifier) === id);
    if (!acct) return { path: 'notFound' };
    if (acct.status === 'locked') return { path: 'locked' };
    if (acct.status === 'inactive') return { path: 'inactive' };
    if (acct.status === 'pending') return { path: 'activate', name: acct.name };
    return { path: 'active', name: acct.name };
  }, []);

  const setSession = useCallback((identifier: string) => {
    const id = normalize(identifier);
    const acct = userAccounts.find((u) => normalize(u.identifier) === id) ?? userAccounts[0];
    setUser({ id: acct.id, name: acct.name, role: acct.role, member: memberById(acct.memberId) });
  }, []);

  const signIn = useCallback(
    async (identifier: string, password: string) => {
      await wait(800);
      if (password.length < 4) return { ok: false, error: 'invalid' };
      const acct = userAccounts.find((u) => normalize(u.identifier) === normalize(identifier));
      // Super admins require a second factor (OTP) in this prototype.
      return { ok: true, needsOtp: acct?.role === 'superadmin' };
    },
    [],
  );

  const completeSignIn = useCallback((identifier: string) => setSession(identifier), [setSession]);
  const activate = useCallback((identifier: string) => setSession(identifier), [setSession]);
  const signOut = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({ user, lookup, signIn, completeSignIn, activate, signOut }),
    [user, lookup, signIn, completeSignIn, activate, signOut],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
