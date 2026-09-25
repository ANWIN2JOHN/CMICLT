import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import type { Member } from '../data/types';

/**
 * Production authentication powered by Supabase Auth.
 *
 * The existing AuthContext interface is intentionally preserved so the
 * existing login screens and application routing do not need to change.
 *
 * Role and account status come from public.user_accounts, while identity
 * authentication is handled by Supabase Auth.
 */

export type LookupResult =
  | { path: 'active'; name: string }
  | { path: 'activate'; name: string }
  | { path: 'locked' }
  | { path: 'inactive' }
  | { path: 'notFound' };

export interface CurrentUser {
  id: string;
  name: string;
  role: 'member' | 'superadmin';
  member?: Member;
}

interface AuthCtx {
  user: CurrentUser | null;
  isLoading: boolean;

  lookup: (identifier: string) => Promise<LookupResult>;

  signIn: (
    identifier: string,
    password: string,
  ) => Promise<{
    ok: boolean;
    needsOtp?: boolean;
    error?: string;
  }>;

  completeSignIn: (identifier: string) => void;
  activate: (identifier: string) => void;
  signOut: () => void;
}

interface DbMemberRow {
  id: string;
  name: string;
  role: string;
  house: string | null;
  institution_id: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  birthday: string | null;
  feast_month: number | null;
  feast_day: number | null;
  feast_name: string | null;
  diocese: string | { code?: string | null } | null;
  parish: string | { name?: string | null } | null;
  profession_date: string | null;
  ordination_date: string | null;
  photo_url: string | null;
  address: string | null;
  diocese_id: string | null;
  parish_id: string | null;
  zone_id: string | null;
  zone: string | { name?: string | null } | null;
}

interface DbAssignmentRow {
  role: string;
  place: string | null;
  from_date: string;
  to_date: string | null;
}

interface DbInstitutionRow {
  name: string;
}

interface DbUserAccountRow {
  id: string;
  auth_user_id: string;
  member_id: string | null;
  role: 'member' | 'superadmin';
  status: 'active' | 'pending' | 'inactive' | 'locked';
  member: DbMemberRow | null;
  institution: DbInstitutionRow | null;
  assignments: DbAssignmentRow[];
}

const Ctx = createContext<AuthCtx | null>(null);

function normalize(identifier: string) {
  return identifier.trim().toLowerCase();
}

function monthFromDate(value: string | null) {
  if (!value) return 0;

  const month = Number(value.slice(5, 7));

  return Number.isNaN(month) ? 0 : month;
}

function formatFeastDate(month: number | null | undefined, day: number | null | undefined): string {
  if (!month || !day) {
    return '';
  }

  const next = new Date(2000, month - 1, day);

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(next);
}

function readLookupName(value: string | { name?: string | null } | null | undefined): string {
  if (typeof value === 'string') return value;
  return value?.name ?? '';
}

function readLookupCode(value: string | { code?: string | null } | null | undefined): string {
  if (typeof value === 'string') return value;
  return value?.code ?? '';
}

function mapMember(
  row: DbMemberRow,
  institution: DbInstitutionRow | null,
  assignments: DbAssignmentRow[],
): Member {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    house: row.house ?? '',
    institution: institution?.name,
    address: row.address ?? '',
    zone: readLookupName(row.zone) as Member['zone'],
    country: row.country ?? '',
    phone: row.phone ?? '',
    email: row.email ?? '',
    birthday: row.birthday ?? '',
    birthMonth: monthFromDate(row.birthday),
    feastDay: formatFeastDate(row.feast_month ?? 0, row.feast_day ?? 0),
    feastMonth: row.feast_month ?? 0,
    feastName: row.feast_name ?? undefined,
    diocese: readLookupCode(row.diocese),
    parish: readLookupName(row.parish),
    professionDate: row.profession_date ?? '',
    ordinationDate: row.ordination_date ?? '',
    photo: row.photo_url ?? undefined,

    assignments: assignments.map((assignment) => ({
      role: assignment.role,
      place: assignment.place ?? '',
      from: assignment.from_date.slice(0, 4),
      to: assignment.to_date
        ? assignment.to_date.slice(0, 4)
        : null,
    })),
  };
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  // Important:
  // Prevent RequireAuth / RequireAdmin from redirecting to Login
  // while Supabase is restoring the existing browser session.
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Loads the application account belonging to the currently
   * authenticated Supabase user.
   *
   * RLS ensures an ordinary authenticated user can only read
   * their own user_accounts row.
   */
  const loadCurrentUser = useCallback(
    async (): Promise<CurrentUser | null> => {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        setUser(null);
        return null;
      }

      const { data, error } = await supabase
        .from('user_accounts')
        .select(`
          id,
          auth_user_id,
          member_id,
          role,
          status,
          member:members (
            id,
            name,
            role,
            house,
            institution_id,
            country,
            phone,
            email,
            birthday,
            feast_month,
            feast_day,
            feast_name,
            address,
            diocese_id,
            parish_id,
            zone_id,
            diocese:dioceses ( code ),
            parish:parishes ( name ),
            zone:zones ( name ),
            profession_date,
            ordination_date,
            photo_url
          )
        `)
        .eq('auth_user_id', authUser.id)
        .maybeSingle();

      if (error || !data) {
        setUser(null);
        return null;
      }

      const account = data as unknown as DbUserAccountRow;

      if (account.status !== 'active') {
        setUser(null);
        return null;
      }

      let member: Member | undefined;

      if (account.member) {
        const { data: assignments } = await supabase
          .from('member_assignments')
          .select(`
            role,
            place,
            from_date,
            to_date
          `)
          .eq('member_id', account.member.id)
          .order('from_date', {
            ascending: true,
          });

        const { data: institution } =
          account.member.institution_id
            ? await supabase
                .from('institutions')
                .select('name')
                .eq(
                  'id',
                  account.member.institution_id,
                )
                .maybeSingle()
            : { data: null };

        member = mapMember(
          account.member,
          institution as DbInstitutionRow | null,
          (assignments ?? []) as DbAssignmentRow[],
        );
      }

      const name =
        member?.name ??
        authUser.user_metadata?.full_name ??
        authUser.user_metadata?.name ??
        authUser.email ??
        'CMI Member';

      const currentUser: CurrentUser = {
        id: account.id,
        name,
        role: account.role,
        member,
      };

      setUser(currentUser);

      return currentUser;
    },
    [],
  );

  /**
   * Identifier lookup is intentionally non-enumerating.
   *
   * We do not query user_accounts before authentication because
   * anonymous users are not allowed to read that protected table.
   */
  const lookup = useCallback(
    async (
      identifier: string,
    ): Promise<LookupResult> => {
      const id = normalize(identifier);

      if (!id) {
        return { path: 'notFound' };
      }

      if (!id.includes('@')) {
        return { path: 'notFound' };
      }

      return {
        path: 'active',
        name: id,
      };
    },
    [],
  );

  /**
   * Authenticate through Supabase Auth and then load the
   * corresponding application account.
   */
  const signIn = useCallback(
    async (
      identifier: string,
      password: string,
    ) => {
      const email = normalize(identifier);

      if (!email || !password) {
        return {
          ok: false,
          error: 'invalid',
        };
      }

      const {
        data,
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        return {
          ok: false,
          error: 'invalid',
        };
      }

      const accountResult = await supabase
        .from('user_accounts')
        .select(`
          id,
          auth_user_id,
          member_id,
          role,
          status,
          member:members (
            id,
            name,
            role,
            house,
            institution_id,
            country,
            phone,
            email,
            birthday,
            feast_month,
            feast_day,
            feast_name,
            address,
            diocese_id,
            parish_id,
            zone_id,
            diocese:dioceses ( code ),
            parish:parishes ( name ),
            zone:zones ( name ),
            profession_date,
            ordination_date,
            photo_url
          )
        `)
        .eq('auth_user_id', data.user.id)
        .maybeSingle();

      if (
        accountResult.error ||
        !accountResult.data
      ) {
        await supabase.auth.signOut();

        return {
          ok: false,
          error: 'notProvisioned',
        };
      }

      const account =
        accountResult.data as unknown as DbUserAccountRow;

      if (account.status === 'locked') {
        await supabase.auth.signOut();

        return {
          ok: false,
          error: 'locked',
        };
      }

      if (account.status === 'inactive') {
        await supabase.auth.signOut();

        return {
          ok: false,
          error: 'inactive',
        };
      }

      if (account.status !== 'active') {
        await supabase.auth.signOut();

        return {
          ok: false,
          error: 'inactive',
        };
      }

      await loadCurrentUser();

      return {
        ok: true,
        needsOtp: false,
      };
    },
    [loadCurrentUser],
  );

  /**
   * Existing interface preserved for the current login screens.
   */
  const completeSignIn = useCallback(
    (_identifier: string) => {
      void loadCurrentUser();
    },
    [loadCurrentUser],
  );

  /**
   * Real member activation/onboarding will be implemented
   * when member account provisioning is added.
   */
  const activate = useCallback(
    (_identifier: string) => {
      void loadCurrentUser();
    },
    [loadCurrentUser],
  );

  const signOut = useCallback(() => {
    void supabase.auth.signOut();
    setUser(null);
  }, []);

  /**
   * Restore the Supabase session when the application starts.
   *
   * IMPORTANT:
   * isLoading remains true while this process is happening.
   * This prevents RequireAuth from redirecting to /signin before
   * Supabase has finished restoring the browser session.
   */
  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (!session) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        await loadCurrentUser();

        if (mounted) {
          setIsLoading(false);
        }
      } catch {
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    void restoreSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsLoading(false);
          return;
        }

        if (
          session &&
          (
            event === 'SIGNED_IN' ||
            event === 'INITIAL_SESSION' ||
            event === 'TOKEN_REFRESHED' ||
            event === 'USER_UPDATED'
          )
        ) {
          // Defer the database lookup so Supabase can
          // finish updating its internal session state first.
          setTimeout(() => {
            if (mounted) {
              void loadCurrentUser().finally(() => {
                if (mounted) {
                  setIsLoading(false);
                }
              });
            }
          }, 0);
        }
      },
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadCurrentUser]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      lookup,
      signIn,
      completeSignIn,
      activate,
      signOut,
    }),
    [
      user,
      isLoading,
      lookup,
      signIn,
      completeSignIn,
      activate,
      signOut,
    ],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);

  if (!ctx) {
    throw new Error(
      'useAuth must be used within AuthProvider',
    );
  }

  return ctx;
}