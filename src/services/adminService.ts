import { supabase } from '../lib/supabase';
import type { AuditEntry } from '../data/types';

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

export async function getAuditEntries(): Promise<AuditEntry[]> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) throw error;

  return (data ?? []).map((row: any): AuditEntry => {
    const createdAt = row.created_at ? new Date(row.created_at) : null;
    const dateStr = createdAt
      ? createdAt.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
      : '';
    const timeStr = createdAt
      ? createdAt.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
      : '';

    const recordParts = [row.record_label, row.entity_type].filter(Boolean);

    return {
      id: row.id,
      user: row.user_id ?? '—',
      action: row.action ?? '',
      record: recordParts.length > 0 ? recordParts.join(' · ') : '—',
      date: dateStr,
      time: timeStr,
      device: row.device ?? '',
    };
  });
}

export async function updateUserAccount(id: string, patch: { status?: string; failedAttempts?: number }) {
  const dbPatch: Record<string, any> = {};
  if (patch.status !== undefined) dbPatch.status = patch.status;
  if (patch.failedAttempts !== undefined) dbPatch.failed_attempts = patch.failedAttempts;

  const { data, error } = await supabase.from('user_accounts').update(dbPatch).eq('id', id).select('*').single();
  if (error) throw error;
  return data ?? null;
}

// Create an audit log entry. This helper inserts into public.audit_logs.
export async function createAuditLog(entry: {
  action: string;
  entity_type: string;
  entity_id?: string | null;
  record_label?: string | null;
  metadata?: Record<string, any> | null;
}) {
  const session = await supabase.auth.getUser();
  const authUser = session.data.user;

  const row: Record<string, any> = {
    action: entry.action,
    entity_type: entry.entity_type,
    entity_id: entry.entity_id ?? null,
    record_label: entry.record_label ?? null,
    metadata: entry.metadata ? entry.metadata : {},
  };

  if (authUser) {
    row.user_id = authUser.id;
  }

  const { data, error } = await supabase.from('audit_logs').insert(row).select('*').single();
  if (error) {
    // Propagate the error to caller so caller can decide how to handle it.
    throw error;
  }
  return data ?? null;
}
