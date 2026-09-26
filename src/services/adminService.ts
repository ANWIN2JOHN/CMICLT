import { supabase } from '../lib/supabase';

export interface AdminDashboardStats {
  activeMembers: number;
  pending: number;
  locked: number;
  failed: number;
  institutions: number;
  events: number;
  changes: number;
  warnings: number;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const today = new Date().toISOString().slice(0, 10);

  const [activeMembersRes, pendingRes, lockedRes, institutionsRes, eventsRes, changesRes, failedRes] = await Promise.all([
    supabase.from('user_accounts').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('user_accounts').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('user_accounts').select('id', { count: 'exact', head: true }).eq('status', 'locked'),
    supabase.from('institutions').select('id', { count: 'exact', head: true }),
    supabase.from('events').select('id', { count: 'exact', head: true }).gte('event_date', today),
    supabase.from('audit_logs').select('id', { count: 'exact', head: true }),
    supabase.from('user_accounts').select('failed_attempts').not('failed_attempts', 'is', null),
  ]);

  if (activeMembersRes.error) throw activeMembersRes.error;
  if (pendingRes.error) throw pendingRes.error;
  if (lockedRes.error) throw lockedRes.error;
  if (institutionsRes.error) throw institutionsRes.error;
  if (eventsRes.error) throw eventsRes.error;
  if (changesRes.error) throw changesRes.error;
  if (failedRes.error) throw failedRes.error;

  const failed = (failedRes.data ?? []).reduce((total, row) => total + (Number(row.failed_attempts) || 0), 0);

  const warnings = 0;

  return {
    activeMembers: activeMembersRes.count ?? 0,
    pending: pendingRes.count ?? 0,
    locked: lockedRes.count ?? 0,
    failed,
    institutions: institutionsRes.count ?? 0,
    events: eventsRes.count ?? 0,
    changes: changesRes.count ?? 0,
    warnings,
  };
}

export async function getAdminAccounts() {
  const { data, error } = await supabase
    .from('user_accounts')
    .select(`
      id,
      role,
      status,
      last_login_at,
      failed_attempts,
      member:members (
        id,
        name,
        email,
        phone,
        house,
        role
      )
    `)
    .order('status', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getAuditEntries() {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) throw error;
  return data ?? [];
}
