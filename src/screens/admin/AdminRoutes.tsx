import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import {
  Activity, AlertTriangle, Archive, ArrowRight, Calendar, Check, ChevronRight, CircleUser,
  ClipboardList, Database, FileText, History, KeyRound, Lock, LockOpen, Save, Search,
  ShieldCheck, Sparkles, UploadCloud, UserCog, UserPlus, Users,
} from 'lucide-react';
import { AdminScreen } from './AdminShell';
import { Button, IconButton } from '../../components/ui/Button';
import { Avatar, Card, FilterChip, SectionHeader, StatusChip } from '../../components/ui/primitives';
import { TextInput, SearchField, SelectField, TextArea } from '../../components/ui/Input';
import { BottomSheet, Dialog, useToast } from '../../components/ui/overlays';
import { EmptyState, SuccessState } from '../../components/ui/states';
import type { AccountStatus, AuditEntry, Member, UserAccount, Zone } from '../../data/types';
import { AdminDataProvider, useAdminData, type ContentItem, type ContentStatus, type ContentType } from '../../contexts/AdminDataContext';
import { useLocale } from '../../contexts/LocaleContext';
import { cn } from '../../lib/cn';
import { supabase } from '../../lib/supabase';
import { getAdminDashboardStats, getAdminAccounts, getAuditEntries, updateUserAccount, createAuditLog } from '../../services/adminService';

export function AdminRoutes() {
  return (
    <AdminDataProvider>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserAccounts />} />
        <Route path="members" element={<MemberManagement />} />
        <Route path="members/new" element={<MemberEdit />} />
        <Route path="members/:id" element={<MemberEdit />} />
        <Route path="content" element={<ContentManagement />} />
        <Route path="content/new" element={<ContentEdit />} />
        <Route path="content/:id" element={<ContentEdit />} />
        <Route path="import" element={<DataImport />} />
        <Route path="audit" element={<AuditLogs />} />
        <Route path="security" element={<Security />} />
        <Route path="backups" element={<Backups />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminDataProvider>
  );
}

/* ============================ Dashboard ============================ */
function statTone(warn?: boolean, alert?: boolean) {
  return alert ? 'error' : warn ? 'warning' : 'primary';
}

function AdminDashboard() {
  const { t } = useLocale();
  const nav = useNavigate();
  const [stats, setStats] = useState<Array<{ label: string; value: number; icon: any; tone?: 'warn' | 'alert' }>>([]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const next = await getAdminDashboardStats();
        if (!active) return;
        setStats([
          { label: t('admin.stat.activeMembers'), value: next.activeMembers, icon: Users },
          { label: t('admin.stat.pending'), value: next.pending, icon: UserPlus, tone: 'warn' },
          { label: t('admin.stat.locked'), value: next.locked, icon: Lock, tone: 'alert' },
          { label: t('admin.stat.failed'), value: next.failed, icon: ShieldCheck, tone: 'warn' },
          { label: t('admin.stat.institutions'), value: next.institutions, icon: Database },
          { label: t('admin.stat.events'), value: next.events, icon: Calendar },
          { label: t('admin.stat.changes'), value: next.changes, icon: Activity },
          { label: t('admin.stat.warnings'), value: next.warnings, icon: AlertTriangle, tone: 'alert' },
        ]);
      } catch {
        if (active) {
          setStats([
            { label: t('admin.stat.activeMembers'), value: 0, icon: Users },
            { label: t('admin.stat.pending'), value: 0, icon: UserPlus, tone: 'warn' },
            { label: t('admin.stat.locked'), value: 0, icon: Lock, tone: 'alert' },
            { label: t('admin.stat.failed'), value: 0, icon: ShieldCheck, tone: 'warn' },
            { label: t('admin.stat.institutions'), value: 0, icon: Database },
            { label: t('admin.stat.events'), value: 0, icon: Calendar },
            { label: t('admin.stat.changes'), value: 0, icon: Activity },
            { label: t('admin.stat.warnings'), value: 0, icon: AlertTriangle, tone: 'alert' },
          ]);
        }
      }
    }

    void load();
    return () => { active = false; };
  }, [t]);

  const links: Array<{ label: string; sub: string; icon: any; to: string }> = [
    { label: t('admin.users'), sub: 'Activate, unlock & reset accounts', icon: CircleUser, to: 'users' },
    { label: t('admin.members'), sub: 'Add, edit & archive member records', icon: UserCog, to: 'members' },
    { label: t('admin.content'), sub: 'News, events, gallery & more', icon: FileText, to: 'content' },
    { label: t('admin.import'), sub: 'Bulk import member records', icon: UploadCloud, to: 'import' },
    { label: t('admin.audit'), sub: 'Track every change', icon: ClipboardList, to: 'audit' },
    { label: t('admin.security'), sub: 'OTP, sessions & password policy', icon: ShieldCheck, to: 'security' },
    { label: t('admin.backups'), sub: 'Restore & annual versions', icon: Database, to: 'backups' },
  ];

  return (
    <AdminScreen title={t('admin.title')} exit>
      <div className="mb-2 flex items-center gap-2 text-[13px] text-ink2">
        <span className="inline-flex h-6 items-center rounded-full bg-emeraldl px-2.5 font-semibold text-emerald">Super Administrator</span>
      </div>
      <SectionHeader title={t('admin.dashboard')} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <span className={cn('flex h-9 w-9 items-center justify-center rounded-full',
                s.tone === 'alert' ? 'bg-[color-mix(in_srgb,var(--c-error)_14%,transparent)] text-error'
                  : s.tone === 'warn' ? 'bg-[color-mix(in_srgb,var(--c-warning)_16%,transparent)] text-warning'
                  : 'bg-emeraldl text-emerald')}>
                <s.icon size={18} />
              </span>
            </div>
            <div className="font-head text-[26px] font-semibold leading-none text-ink">{s.value}</div>
            <div className="mt-1.5 text-[12.5px] leading-tight text-ink2">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="mt-7">
        <SectionHeader title="Manage" />
        <Card className="overflow-hidden p-0">
          {links.map((l, i) => (
            <button key={l.to} onClick={() => nav(l.to)}
              className={cn('press flex w-full items-center gap-3.5 px-4 py-3.5 text-left active:bg-card2', i > 0 && 'border-t border-line')}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emeraldl text-emerald"><l.icon size={20} /></span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-medium text-ink">{l.label}</span>
                <span className="block truncate text-[13px] text-ink2">{l.sub}</span>
              </span>
              <ChevronRight size={18} className="text-ink2" />
            </button>
          ))}
        </Card>
      </div>
    </AdminScreen>
  );
}

/* ============================ User Accounts ============================ */
const statusTone: Record<AccountStatus, 'success' | 'warning' | 'error' | 'neutral'> = {
  active: 'success', pending: 'warning', locked: 'error', inactive: 'neutral',
};

function UserAccounts() {
  const { t } = useLocale();
  const { notify } = useToast();
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<AccountStatus>('active');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<UserAccount | null>(null);
  const [confirm, setConfirm] = useState<{ title: string; body: string; run: () => void } | null>(null);

  useEffect(() => {
    let active = true;

    async function loadAccounts() {
      try {
        setLoading(true);
        const rows = await getAdminAccounts();
        if (!active) return;

        setAccounts((rows ?? []).map((row: any) => ({
          id: row.id,
          memberId: row.member?.id ?? row.member_id ?? row.memberId ?? '',
          name: row.member?.name ?? 'Unknown member',
          identifier: row.member?.email ?? '',
          role: row.role ?? 'member',
          status: row.status ?? 'active',
          lastLogin: row.last_login_at ? new Date(row.last_login_at).toLocaleString('en', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
          failedAttempts: row.failed_attempts ?? 0,
        })));
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadAccounts();
    return () => { active = false; };
  }, []);

  const tabs: Array<{ id: AccountStatus; label: string }> = [
    { id: 'active', label: t('admin.tab.active') }, { id: 'pending', label: t('admin.tab.pending') },
    { id: 'inactive', label: t('admin.tab.inactive') }, { id: 'locked', label: t('admin.tab.locked') },
  ];
  const counts = useMemo(() => {
    const c: Record<AccountStatus, number> = { active: 0, pending: 0, inactive: 0, locked: 0 };
    accounts.forEach((a) => { c[a.status]++; });
    return c;
  }, [accounts]);

  const list = accounts.filter((a) => a.status === tab && a.name.toLowerCase().includes(q.toLowerCase()));

  async function update(id: string, patch: Partial<UserAccount>, msg: string) {
    try {
      // Persist to Supabase first
      const updated = await updateUserAccount(id, { status: patch.status, failedAttempts: (patch as any).failedAttempts });
      try {
        await createAuditLog({ action: patch.status === 'active' ? 'activate' : patch.status === 'inactive' ? 'deactivate' : 'update', entity_type: 'user_account', entity_id: id, record_label: (patch as any).identifier ?? null, metadata: { status: patch.status } });
      } catch (err: any) {
        notify('Account updated (audit failed: ' + (err?.message ?? 'unknown') + ')');
      }
      // Update local state only on success
      setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...(patch as any) } : a)));
      setSel(null);
      notify(msg);
    } catch (err: any) {
      notify(err?.message ?? 'Unable to update account');
    }
  }

  return (
    <AdminScreen title={t('admin.users')} back>
      <SearchField value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search accounts…" onClear={() => setQ('')} />
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 md:-mx-6 md:px-6">
        {tabs.map((tb) => (
          <FilterChip key={tb.id} active={tab === tb.id} onClick={() => setTab(tb.id)} count={counts[tb.id]}>{tb.label}</FilterChip>
        ))}
      </div>

      <div className="mt-4 space-y-2.5">
        {loading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-[var(--r-card)] bg-card2" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <EmptyState icon={<Users size={26} />} title="No accounts" body="No accounts in this category." />
        ) : null}
        {!loading && list.map((a) => (
          <Card key={a.id} onClick={() => setSel(a)} className="flex items-center gap-3 p-3.5">
            <Avatar name={a.name} size={44} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-medium text-ink">{a.name}</p>
              <p className="truncate text-[13px] text-ink2">{a.identifier}</p>
            </div>
            <StatusChip tone={statusTone[a.status]}>{t(`admin.tab.${a.status}` as any)}</StatusChip>
          </Card>
        ))}
      </div>

      <BottomSheet open={!!sel} onClose={() => setSel(null)} title={sel?.name}>
        {sel && (
          <div className="pb-2">
            <div className="mb-4 flex items-center gap-3">
              <Avatar name={sel.name} size={52} />
              <div className="min-w-0">
                <p className="truncate text-[14px] text-ink2">{sel.identifier}</p>
                <div className="mt-1 flex items-center gap-2">
                  <StatusChip tone={statusTone[sel.status]}>{t(`admin.tab.${sel.status}` as any)}</StatusChip>
                  {sel.role === 'superadmin' && <StatusChip tone="gold">Admin</StatusChip>}
                </div>
              </div>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-3 text-[13px]">
              <InfoBit label="Last login" value={sel.lastLogin ?? '—'} />
              <InfoBit label="Failed attempts" value={String(sel.failedAttempts)} />
            </div>
            <div className="space-y-2.5">
              {sel.status === 'locked' && (
                <ActionRow icon={LockOpen} label={t('admin.action.unlock')}
                  onClick={() => update(sel.id, { status: 'active', failedAttempts: 0 }, 'Account unlocked')} />
              )}
              {sel.status === 'pending' && (
                <ActionRow icon={UserPlus} label={t('admin.action.resend')} onClick={() => { setSel(null); notify('Activation link resent'); }} />
              )}
              {sel.status === 'inactive' && (
                <ActionRow icon={Check} label={t('admin.action.activate')}
                  onClick={() => update(sel.id, { status: 'active' }, 'Account activated')} />
              )}
              {sel.status === 'active' && (
                <ActionRow icon={Lock} label={t('admin.action.deactivate')} danger
                  onClick={() => setConfirm({ title: t('admin.action.deactivate'), body: `Deactivate ${sel.name}'s account? They will lose access until reactivated.`, run: () => update(sel.id, { status: 'inactive' }, 'Account deactivated') })} />
              )}
              <ActionRow icon={KeyRound} label={t('admin.action.resetPw')} onClick={() => { setSel(null); notify('Password reset link sent'); }} />
              <ActionRow icon={History} label={t('admin.action.history')} onClick={() => { setSel(null); notify('Login history opened'); }} />
            </div>
          </div>
        )}
      </BottomSheet>

      <Dialog open={!!confirm} onClose={() => setConfirm(null)} title={confirm?.title ?? ''} body={confirm?.body}
        danger confirmLabel="Confirm" onConfirm={() => confirm?.run()} />
    </AdminScreen>
  );
}

function InfoBit({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] bg-card2 px-3 py-2.5">
      <div className="text-[12px] text-ink2">{label}</div>
      <div className="mt-0.5 truncate text-[14px] font-medium text-ink">{value}</div>
    </div>
  );
}

function ActionRow({ icon: Icon, label, onClick, danger }: { icon: any; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick}
      className={cn('press flex min-h-[52px] w-full items-center gap-3 rounded-[var(--r-input)] border border-line px-4 text-left text-[15px] font-medium active:bg-card2',
        danger ? 'text-error' : 'text-ink')}>
      <Icon size={19} className={danger ? 'text-error' : 'text-emerald'} /> {label}
    </button>
  );
}

/* ============================ Member Management ============================ */
function MemberManagement() {
  const { t } = useLocale();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const { members, isArchived, archiveMember, restoreMember } = useAdminData();
  const { notify } = useToast();

  const list = members.filter((m) => m.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <AdminScreen title={t('admin.members')} back
      right={<IconButton label={t('admin.addMember')} onClick={() => nav('new')}><UserPlus size={22} className="text-emerald" /></IconButton>}>
      <SearchField value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search members…" onClear={() => setQ('')} />
      <p className="mb-3 mt-3 text-[13px] text-ink2">{list.length} members</p>
      <div className="space-y-2.5">
        {list.map((m) => {
          const isArch = isArchived(m.id);
          return (
            <Card key={m.id} className="flex items-center gap-3 p-3.5">
              <Avatar name={m.name} src={m.photo} size={44} />
              <button onClick={() => nav(m.id)} className="min-w-0 flex-1 text-left">
                <p className={cn('truncate text-[15px] font-medium', isArch ? 'text-ink2 line-through' : 'text-ink')}>{m.name}</p>
                <p className="truncate text-[13px] text-ink2">{m.role} · {m.house}</p>
              </button>
              {isArch
                ? <Button variant="text" size="md" onClick={async () => { try { await restoreMember(m.id); notify('Member restored'); try { await createAuditLog({ action: 'restore', entity_type: 'member', entity_id: m.id, record_label: m.name, metadata: { name: m.name } }); } catch (err: any) { notify('Member restored (audit failed: ' + (err?.message ?? 'unknown') + ')'); } } catch (err: any) { notify(err?.message ?? 'Unable to restore member'); } }}>{t('admin.restore')}</Button>
                : <IconButton label={t('admin.archive')} onClick={async () => { try { await archiveMember(m.id); notify('Member archived'); try { await createAuditLog({ action: 'archive', entity_type: 'member', entity_id: m.id, record_label: m.name, metadata: { name: m.name } }); } catch (err: any) { notify('Member archived (audit failed: ' + (err?.message ?? 'unknown') + ')'); } } catch (err: any) { notify(err?.message ?? 'Unable to archive member'); } }}><Archive size={19} className="text-ink2" /></IconButton>}
            </Card>
          );
        })}
      </div>
    </AdminScreen>
  );
}

/* ============================ Member Editor (create + edit) ============================ */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ZONES: Zone[] = ['Calicut', 'Wayanad', 'Malabar', 'Nilgiris', 'Mission'];
function monthNo(display: string): number {
  const abbr = display.trim().slice(0, 3).toLowerCase();
  const i = MONTHS.findIndex((m) => m.toLowerCase() === abbr);
  return i >= 0 ? i + 1 : 1;
}

type MemberForm = {
  name: string; role: string; house: string; institution: string; zone: Zone; country: string;
  phone: string; email: string; birthday: string; feastDay: string; feastName: string;
  diocese: string; parish: string; professionDate: string; ordinationDate: string;
  assignRole: string; assignPlace: string;
};

function MemberEdit() {
  const { t } = useLocale();
  const { id } = useParams();
  const nav = useNavigate();
  const { notify } = useToast();
  const { getMember, addMember, updateMember } = useAdminData();

  const isNew = !id || id === 'new';
  const existing = isNew ? undefined : getMember(id!);

  const [form, setForm] = useState<MemberForm>(() => ({
    name: existing?.name ?? '',
    role: existing?.role ?? '',
    house: existing?.house ?? '',
    institution: existing?.institution ?? '',
    zone: (existing?.zone ?? 'Calicut') as Zone,
    country: existing?.country ?? 'India',
    phone: existing?.phone ?? '',
    email: existing?.email ?? '',
    birthday: existing?.birthday ?? '',
    feastDay: existing?.feastDay ?? '',
    feastName: existing?.feastName ?? '',
    diocese: existing?.diocese ?? '',
    parish: existing?.parish ?? '',
    professionDate: existing?.professionDate ?? '',
    ordinationDate: existing?.ordinationDate ?? '',
    assignRole: existing?.assignments?.[0]?.role ?? existing?.role ?? '',
    assignPlace: existing?.assignments?.[0]?.place ?? '',
  }));
  const [errors, setErrors] = useState<Partial<Record<keyof MemberForm, string>>>({});
  const [open, setOpen] = useState<string | null>('personal');

  if (!isNew && !existing) {
    return <AdminScreen title={t('admin.editMember')} back><EmptyState title="Member not found" /></AdminScreen>;
  }

  const set = (k: keyof MemberForm) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  function validate(): boolean {
    const errs: Partial<Record<keyof MemberForm, string>> = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.role.trim()) errs.role = 'Role is required';
    if (!form.house.trim()) errs.house = 'House is required';
    if (!form.phone.trim() && !form.email.trim()) {
      errs.phone = 'Provide a phone or email';
      errs.email = 'Provide a phone or email';
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Enter a valid email address';
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // Reveal the section holding the first error.
      if (errs.name || errs.birthday) setOpen('personal');
      else if (errs.role || errs.house) setOpen('religious');
      else if (errs.phone || errs.email) setOpen('contact');
      return false;
    }
    return true;
  }

  function buildMember(): Member {
    const base = existing;
    return {
      id: base?.id ?? `m${Date.now()}`,
      name: form.name.trim(),
      role: form.role.trim(),
      house: form.house.trim(),
      institution: form.institution.trim() || undefined,
      address: form.house.trim(),
      zone: form.zone,
      country: form.country.trim() || 'India',
      phone: form.phone.trim(),
      email: form.email.trim(),
      birthday: form.birthday.trim(),
      birthMonth: form.birthday.trim() ? monthNo(form.birthday) : base?.birthMonth ?? 1,
      feastDay: form.feastDay.trim(),
      feastMonth: form.feastDay.trim() ? monthNo(form.feastDay) : base?.feastMonth ?? 1,
      feastName: form.feastName.trim() || undefined,
      diocese: form.diocese.trim(),
      parish: form.parish.trim(),
      professionDate: form.professionDate.trim(),
      ordinationDate: form.ordinationDate.trim(),
      photo: base?.photo,
      assignments: (() => {
        const current = { role: form.assignRole.trim() || form.role.trim(), place: form.assignPlace.trim() || form.institution.trim() || form.house.trim(), from: `${new Date().getFullYear()}`, to: null as string | null };
        if (base?.assignments?.length) return [{ ...base.assignments[0], role: current.role, place: current.place }, ...base.assignments.slice(1)];
        return [current];
      })(),
    };
  }

  async function save(action: 'draft' | 'publish') {
    if (!validate()) return;
    const member = buildMember();

    try {
      if (isNew) {
        const { data, error } = await supabase.from('members').insert({
          name: member.name,
          role: member.role,
          house: member.house,
          zone: member.zone,
          country: member.country,
          phone: member.phone,
          email: member.email,
          birthday: member.birthday ? new Date(member.birthday).toISOString().slice(0, 10) : null,
          feast_name: member.feastName || null,
          feast_day: member.feastDay ? new Date(`2000 ${member.feastDay}`).toISOString().slice(0, 10) : null,
          diocese: member.diocese || null,
          parish: member.parish || null,
          profession_date: member.professionDate ? new Date(member.professionDate).toISOString().slice(0, 10) : null,
          ordination_date: member.ordinationDate ? new Date(member.ordinationDate).toISOString().slice(0, 10) : null,
        }).select('*');

        if (error) throw error;

        // Use the database-returned row (with real UUID) when adding to local state.
        const returned = Array.isArray(data) ? data[0] : (data as any);
        if (!returned) throw new Error('Failed to retrieve created member from database');

        // Map Supabase row shape to application Member type using existing mapper from services
        // Importing mapper locally would be ideal, but to avoid cross-file edits we map minimally here.
        const createdMember: Member = {
          id: returned.id,
          name: returned.name,
          role: returned.role,
          house: returned.house ?? '',
          institution: undefined,
          address: returned.address ?? '',
          zone: typeof returned.zone === 'string' ? (returned.zone as any) : (returned.zone?.name ?? '') as any,
          country: returned.country ?? '',
          phone: returned.phone ?? '',
          email: returned.email ?? '',
          birthday: returned.birthday ?? '',
          birthMonth: returned.birthday ? (Number.isNaN(Number(returned.birthday.slice(5, 7))) ? 1 : Number(returned.birthday.slice(5, 7))) : 1,
          feastDay: returned.feast_day ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(2000, (returned.feast_month ?? 1) - 1, returned.feast_day ?? 1)) : '',
          feastMonth: returned.feast_month ?? 0,
          feastName: returned.feast_name ?? undefined,
          diocese: typeof returned.diocese === 'string' ? returned.diocese : (returned.diocese?.code ?? ''),
          parish: typeof returned.parish === 'string' ? returned.parish : (returned.parish?.name ?? ''),
          professionDate: returned.profession_date ?? '',
          ordinationDate: returned.ordination_date ?? '',
          photo: returned.photo_url ?? undefined,
          assignments: [],
        };

        addMember(createdMember);
        try {
          await createAuditLog({ action: 'create', entity_type: 'member', entity_id: createdMember.id, record_label: createdMember.name, metadata: { name: createdMember.name } });
        } catch (err: any) {
          notify('Member created (audit failed: ' + (err?.message ?? 'unknown') + ')');
        }
      } else {
        const { error } = await supabase
          .from('members')
          .update({
            name: member.name,
            role: member.role,
            house: member.house,
            zone: member.zone,
            country: member.country,
            phone: member.phone,
            email: member.email,
            birthday: member.birthday ? new Date(member.birthday).toISOString().slice(0, 10) : null,
            feast_name: member.feastName || null,
            feast_day: member.feastDay ? new Date(`2000 ${member.feastDay}`).toISOString().slice(0, 10) : null,
            diocese: member.diocese || null,
            parish: member.parish || null,
            profession_date: member.professionDate ? new Date(member.professionDate).toISOString().slice(0, 10) : null,
            ordination_date: member.ordinationDate ? new Date(member.ordinationDate).toISOString().slice(0, 10) : null,
          })
          .eq('id', member.id);

        if (error) throw error;
        updateMember(member.id, member);
        try {
          await createAuditLog({ action: 'update', entity_type: 'member', entity_id: member.id, record_label: member.name, metadata: { name: member.name } });
        } catch (err: any) {
          notify('Member updated (audit failed: ' + (err?.message ?? 'unknown') + ')');
        }
      }

      notify(isNew
        ? (action === 'draft' ? 'Member draft saved' : 'Member published')
        : (action === 'draft' ? 'Draft saved' : 'Changes published'));
      nav('/admin/members');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Unable to save member.');
    }
  }

  const displayName = form.name.trim() || 'New member';

  return (
    <AdminScreen title={isNew ? t('admin.addMember') : t('admin.editMember')} back>
      {/* Photograph */}
      <div className="mb-5 flex items-center gap-3">
        <Avatar name={displayName} src={existing?.photo} size={60} />
        <div className="min-w-0">
          <p className="truncate font-head text-[19px] font-semibold text-ink">{displayName}</p>
          <button onClick={() => notify('Photo upload opened')} className="press text-[14px] font-medium text-primary">
            {existing?.photo ? 'Change photo' : 'Upload photo'}
          </button>
        </div>
      </div>

      <div className="space-y-3 pb-28">
        <Section id="personal" label="Personal details" open={open} setOpen={setOpen}>
          <TextInput label="Full name" value={form.name} onChange={set('name')} error={errors.name} placeholder="Fr. …" />
          <TextInput label="Birthday" value={form.birthday} onChange={set('birthday')} placeholder="e.g. Sep 5" />
          <TextInput label="Diocese" value={form.diocese} onChange={set('diocese')} />
          <TextInput label="Home parish" value={form.parish} onChange={set('parish')} />
          <TextInput label="Country" value={form.country} onChange={set('country')} />
        </Section>

        <Section id="religious" label="Religious details" open={open} setOpen={setOpen}>
          <TextInput label="Role" value={form.role} onChange={set('role')} error={errors.role} />
          <TextInput label="Feast name" value={form.feastName} onChange={set('feastName')} placeholder="e.g. St. Thomas" />
          <TextInput label="Feast day" value={form.feastDay} onChange={set('feastDay')} placeholder="e.g. Jul 3" />
          <TextInput label="Profession date" value={form.professionDate} onChange={set('professionDate')} placeholder="e.g. 16 May 1998" />
          <TextInput label="Ordination date" value={form.ordinationDate} onChange={set('ordinationDate')} placeholder="e.g. 28 Dec 2004" />
        </Section>

        <Section id="contact" label="Contact information" open={open} setOpen={setOpen}>
          <TextInput label="Phone" value={form.phone} onChange={set('phone')} error={errors.phone} inputMode="tel" placeholder="+91 …" />
          <TextInput label="Email" value={form.email} onChange={set('email')} error={errors.email} inputMode="email" />
        </Section>

        <Section id="assignment" label="Assignment, house & zone" open={open} setOpen={setOpen}>
          <TextInput label="House" value={form.house} onChange={set('house')} error={errors.house} />
          <TextInput label="Institution" value={form.institution} onChange={set('institution')} placeholder="Optional" />
          <SelectField label="Zone" value={form.zone} onChange={set('zone')} options={ZONES.map((z) => ({ value: z, label: z }))} />
          <TextInput label="Current assignment role" value={form.assignRole} onChange={set('assignRole')} placeholder="Defaults to role" />
          <TextInput label="Current assignment place" value={form.assignPlace} onChange={set('assignPlace')} placeholder="Defaults to institution / house" />
        </Section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-[880px] gap-3 border-t border-line bg-bg/95 px-4 py-3 pb-[calc(12px+var(--safe-bottom))] backdrop-blur md:px-6">
        <Button variant="outline" fullWidth onClick={() => save('draft')}>Save Draft</Button>
        <Button fullWidth leftIcon={<Save size={18} />} onClick={() => save('publish')}>Publish Changes</Button>
      </div>
    </AdminScreen>
  );
}

function Section({ id, label, open, setOpen, children }: {
  id: string; label: string; open: string | null; setOpen: (v: string | null) => void; children: React.ReactNode;
}) {
  const isOpen = open === id;
  return (
    <Card className="overflow-hidden p-0">
      <button onClick={() => setOpen(isOpen ? null : id)}
        className="press flex min-h-[52px] w-full items-center justify-between px-4 py-3.5 text-left">
        <span className="text-[15px] font-semibold text-ink">{label}</span>
        <ChevronRight size={18} className={cn('text-ink2 transition-transform', isOpen && 'rotate-90')} />
      </button>
      {isOpen && <div className="space-y-3 border-t border-line px-4 py-4">{children}</div>}
    </Card>
  );
}

/* ============================ Content Management ============================ */
const CONTENT_STATUS_TONE: Record<ContentStatus, 'success' | 'warning' | 'neutral'> = {
  published: 'success', scheduled: 'warning', draft: 'neutral',
};
function contentIcon(type: ContentType) {
  return type === 'Event' ? Calendar : FileText;
}

function ContentManagement() {
  const { t } = useLocale();
  const nav = useNavigate();
  const { content } = useAdminData();
  const [tab, setTab] = useState<ContentStatus>('published');

  const list = content.filter((it) => it.status === tab);
  const tabs: Array<{ id: ContentStatus; label: string }> = [
    { id: 'published', label: 'Published' }, { id: 'scheduled', label: 'Scheduled' }, { id: 'draft', label: 'Draft' },
  ];

  return (
    <AdminScreen title={t('admin.content')} back
      right={<IconButton label="New content" onClick={() => nav('new')}><FileText size={21} className="text-emerald" /></IconButton>}>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:-mx-6 md:px-6">
        {tabs.map((tb) => (
          <FilterChip key={tb.id} active={tab === tb.id} onClick={() => setTab(tb.id)} count={content.filter((i) => i.status === tb.id).length}>{tb.label}</FilterChip>
        ))}
      </div>
      <div className="mt-4 space-y-2.5">
        {list.length === 0 && <EmptyState icon={<FileText size={26} />} title="Nothing here yet" body="Create content with the button above." />}
        {list.map((it) => {
          const Icon = contentIcon(it.type);
          return (
            <Card key={it.id} onClick={() => nav(it.id)} className="flex items-center gap-3 p-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emeraldl text-emerald"><Icon size={18} /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium text-ink">{it.title}</p>
                <p className="text-[12.5px] text-ink2">{it.type} · {it.date}</p>
              </div>
              <StatusChip tone={CONTENT_STATUS_TONE[it.status]}>{it.status}</StatusChip>
            </Card>
          );
        })}
      </div>
    </AdminScreen>
  );
}

/* ============================ Content Editor (create + edit) ============================ */
const CONTENT_TYPES: ContentType[] = ['News', 'Event', 'Gallery', 'Vocation', 'Chavarul', 'Contact'];
const NEWS_CATEGORIES = ['Announcement', 'Events', 'Formation', 'Mission', 'Obituary'];
const EVENT_CATEGORIES = ['province', 'feast', 'anniversary', 'jubilee', 'birthday'];

function ContentEdit() {
  const { t } = useLocale();
  const { id } = useParams();
  const nav = useNavigate();
  const { notify } = useToast();
  const { getContent, addContent, updateContent } = useAdminData();

  const isNew = !id || id === 'new';
  const existing = isNew ? undefined : getContent(id!);

  const [item, setItem] = useState<ContentItem>(() => existing ?? {
    id: `c${Date.now()}`,
    type: 'News',
    title: '',
    status: 'draft',
    date: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState<string | undefined>();

  if (!isNew && !existing) {
    return <AdminScreen title="Content" back><EmptyState title="Content not found" /></AdminScreen>;
  }

  const set = <K extends keyof ContentItem>(k: K) => (e: { target: { value: string } }) =>
    setItem((it) => ({ ...it, [k]: e.target.value }));

  async function save(status: ContentStatus) {
    if (!item.title.trim()) { setError('Title is required'); return; }
    const next: ContentItem = { ...item, title: item.title.trim(), status };

    try {
      if (isNew) {
        if (next.type === 'News') {
          const { data, error } = await supabase.from('news_articles').insert({
            category: next.category ?? NEWS_CATEGORIES[0],
            headline: next.title,
            published_date: next.date,
            author_name: next.author ?? null,
            image_url: next.image ?? null,
            body: next.body ? next.body.split('\n\n') : [],
            status: next.status,
          }).select('*').single();

          if (error) throw error;

          const created: ContentItem = {
            id: data.id,
            type: 'News',
            title: data.headline,
            status: data.status ?? 'draft',
            date: data.published_date,
            category: data.category,
            author: data.author_name ?? undefined,
            image: data.image_url ?? undefined,
            body: Array.isArray(data.body) ? data.body.join('\n\n') : '',
          };

          addContent(created);
          try {
            await createAuditLog({ action: 'create', entity_type: 'news_article', entity_id: created.id, record_label: created.title, metadata: { category: created.category } });
          } catch (err: any) {
            notify('Content created (audit failed: ' + (err?.message ?? 'unknown') + ')');
          }
        } else {
          // For non-News types, fall back to local-only behavior (not persisted)
          addContent(next);
        }
      } else {
        if (next.type === 'News') {
          const { data, error } = await supabase.from('news_articles').update({
            category: next.category ?? NEWS_CATEGORIES[0],
            headline: next.title,
            published_date: next.date,
            author_name: next.author ?? null,
            image_url: next.image ?? null,
            body: next.body ? next.body.split('\n\n') : [],
            status: next.status,
          }).eq('id', next.id).select('*').single();

          if (error) throw error;

          const updated: ContentItem = {
            id: data.id,
            type: 'News',
            title: data.headline,
            status: data.status ?? 'draft',
            date: data.published_date,
            category: data.category,
            author: data.author_name ?? undefined,
            image: data.image_url ?? undefined,
            body: Array.isArray(data.body) ? data.body.join('\n\n') : '',
          };

          updateContent(updated.id, updated);
          try {
            await createAuditLog({ action: 'update', entity_type: 'news_article', entity_id: updated.id, record_label: updated.title, metadata: { category: updated.category } });
          } catch (err: any) {
            notify('Content updated (audit failed: ' + (err?.message ?? 'unknown') + ')');
          }
        } else {
          // For non-News types, fall back to local-only behavior (not persisted)
          updateContent(next.id, next);
        }
      }

      notify(status === 'draft' ? 'Draft saved' : status === 'scheduled' ? 'Content scheduled' : 'Content published');
      nav('/admin/content');
    } catch (err: any) {
      notify(err?.message ?? 'Unable to save content');
    }
  }

  return (
    <AdminScreen title={isNew ? 'New content' : `Edit ${item.type.toLowerCase()}`} back>
      <div className="space-y-3 pb-28">
        <SelectField label="Content type" value={item.type} disabled={!isNew}
          onChange={(e) => setItem((it) => ({ ...it, type: e.target.value as ContentType }))}
          options={CONTENT_TYPES.map((c) => ({ value: c, label: c }))}
          hint={isNew ? undefined : 'Type cannot be changed after creation.'} />

        <TextInput label="Title" value={item.title} onChange={set('title')} error={error} placeholder="Enter a title" />

        {item.type === 'News' && (
          <>
            <SelectField label="Category" value={item.category ?? NEWS_CATEGORIES[0]} onChange={set('category')}
              options={NEWS_CATEGORIES.map((c) => ({ value: c, label: c }))} />
            <TextInput label="Author" value={item.author ?? ''} onChange={set('author')} placeholder="e.g. Provincial Office" />
            <TextInput label="Featured image URL" value={item.image ?? ''} onChange={set('image')} placeholder="https://…" />
            <TextInput label="Date" value={item.date} onChange={set('date')} placeholder="YYYY-MM-DD" />
            <TextArea label="Article content" value={item.body ?? ''} onChange={set('body')} rows={6} placeholder="Write the article…" />
            <TextInput label="Related content" value={item.related ?? ''} onChange={set('related')} placeholder="Optional — related item titles" />
          </>
        )}

        {item.type === 'Event' && (
          <>
            <TextInput label="Date" value={item.date} onChange={set('date')} placeholder="YYYY-MM-DD" />
            <TextInput label="Time" value={item.time ?? ''} onChange={set('time')} placeholder="e.g. 10:00 AM" />
            <TextInput label="Location" value={item.location ?? ''} onChange={set('location')} placeholder="Venue" />
            <SelectField label="Event category" value={item.category ?? EVENT_CATEGORIES[0]} onChange={set('category')}
              options={EVENT_CATEGORIES.map((c) => ({ value: c, label: c[0].toUpperCase() + c.slice(1) }))} />
            <TextArea label="Description" value={item.description ?? ''} onChange={set('description')} rows={5} placeholder="Event details…" />
          </>
        )}

        {(item.type === 'Gallery' || item.type === 'Vocation' || item.type === 'Chavarul' || item.type === 'Contact') && (
          <>
            <TextInput label="Date" value={item.date} onChange={set('date')} placeholder="YYYY-MM-DD" />
            <TextArea label="Description" value={item.description ?? ''} onChange={set('description')} rows={5} placeholder="Details…" />
          </>
        )}

        <div className="rounded-[var(--r-input)] border border-line bg-card2 px-4 py-3 text-[13px] text-ink2">
          Current status: <span className="font-medium text-ink">{item.status}</span>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto grid max-w-[880px] grid-cols-3 gap-2.5 border-t border-line bg-bg/95 px-4 py-3 pb-[calc(12px+var(--safe-bottom))] backdrop-blur md:px-6">
        <Button variant="outline" onClick={() => save('draft')}>Save Draft</Button>
        <Button variant="secondary" onClick={() => save('scheduled')}>Schedule</Button>
        <Button leftIcon={<Save size={17} />} onClick={() => save('published')}>Publish</Button>
      </div>
    </AdminScreen>
  );
}

/* ============================ Data Import Wizard ============================ */
const IMPORT_STEPS = ['Upload', 'Map fields', 'Validate', 'De-duplicate', 'Errors', 'Review', 'Confirm'];
function DataImport() {
  const { t } = useLocale();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <AdminScreen title={t('admin.import')} back>
        <SuccessState title="Import complete" body="24 member records were imported successfully. 2 duplicates were merged and 1 row was skipped."
          actionLabel="Back to dashboard" onAction={() => nav('/admin')} />
      </AdminScreen>
    );
  }

  const bodies = [
    'Upload a CSV or Excel file exported from your records. Maximum 5,000 rows per import.',
    'Match each column in your file to a CMICLT member field. Unmapped columns will be ignored.',
    'We check every row for required fields, valid dates and correctly formatted phone numbers.',
    'Rows matching an existing member by email or phone are flagged so you can merge or skip them.',
    'Review rows that could not be validated. Fix them in your file or choose to skip.',
    'A final summary before anything is written: 24 to add, 2 to merge, 1 to skip.',
    'Confirm to apply the import. This action is recorded in the audit log.',
  ];

  return (
    <AdminScreen title={t('admin.import')} back>
      <div className="mb-1 flex items-center justify-between text-[13px] text-ink2">
        <span>Step {step + 1} of {IMPORT_STEPS.length}</span>
        <span className="font-medium text-emerald">{IMPORT_STEPS[step]}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-card2">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((step + 1) / IMPORT_STEPS.length) * 100}%` }} />
      </div>

      <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 md:-mx-6 md:px-6">
        {IMPORT_STEPS.map((s, i) => (
          <div key={s} className={cn('flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium',
            i === step ? 'bg-emeraldl text-emerald' : i < step ? 'text-emerald' : 'text-ink2')}>
            <span className={cn('flex h-5 w-5 items-center justify-center rounded-full text-[11px]',
              i < step ? 'bg-primary text-onprimary' : i === step ? 'border border-emerald' : 'border border-line')}>
              {i < step ? <Check size={12} /> : i + 1}
            </span>
            {s}
          </div>
        ))}
      </div>

      <Card className="mt-5 p-5">
        {step === 0 && (
          <button className="press flex w-full flex-col items-center justify-center gap-3 rounded-[var(--r-input)] border-2 border-dashed border-line py-10 text-center">
            <UploadCloud size={34} className="text-emerald" />
            <span className="text-[15px] font-medium text-ink">Tap to select a file</span>
            <span className="text-[13px] text-ink2">CSV or XLSX · up to 5,000 rows</span>
          </button>
        )}
        {step > 0 && (
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emeraldl text-emerald"><Database size={20} /></span>
            <div>
              <h3 className="font-head text-[18px] font-semibold text-ink">{IMPORT_STEPS[step]}</h3>
              <p className="mt-1 text-[14px] leading-relaxed text-ink2">{bodies[step]}</p>
            </div>
          </div>
        )}
      </Card>

      <div className="mt-6 flex gap-3">
        {step > 0 && <Button variant="outline" fullWidth onClick={() => setStep((s) => s - 1)}>Back</Button>}
        {step < IMPORT_STEPS.length - 1
          ? <Button fullWidth rightIcon={<ArrowRight size={18} />} onClick={() => setStep((s) => s + 1)}>Continue</Button>
          : <Button fullWidth leftIcon={<Check size={18} />} onClick={() => setDone(true)}>Confirm import</Button>}
      </div>
    </AdminScreen>
  );
}

/* ============================ Audit Logs ============================ */
function AuditLogs() {
  const { t } = useLocale();
  const { notify } = useToast();
  const [q, setQ] = useState('');
  const [entries, setEntries] = useState<AuditEntry[]>([]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const next = await getAuditEntries();
        if (!active) return;
        setEntries(next);
      } catch {
        if (active) setEntries([]);
      }
    }

    void load();
    return () => { active = false; };
  }, []);

  const list = entries.filter((a) => (a.action + a.record + a.user).toLowerCase().includes(q.toLowerCase()));

  return (
    <AdminScreen title={t('admin.audit')} back
      right={<IconButton label="Export" onClick={() => notify('Audit log exported (CSV)')}><UploadCloud size={20} className="text-emerald" /></IconButton>}>
      <SearchField value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search audit log…" onClear={() => setQ('')} />
      <div className="mt-4 space-y-2.5">
        {list.length === 0 && <EmptyState icon={<Search size={26} />} title="No matching entries" />}
        {list.map((a) => (
          <Card key={a.id} className="p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[15px] font-medium text-ink">{a.action}</p>
                <p className="truncate text-[13px] text-ink2">{a.record}</p>
              </div>
              <span className="shrink-0 text-right text-[12px] text-ink2">{a.date}<br />{a.time}</span>
            </div>
            <div className="mt-2.5 flex items-center gap-2 border-t border-line pt-2.5 text-[12.5px] text-ink2">
              <Avatar name={a.user} size={22} /> <span className="truncate">{a.user}</span>
              <span className="ml-auto shrink-0">{a.device}</span>
            </div>
          </Card>
        ))}
      </div>
    </AdminScreen>
  );
}

/* ============================ Security ============================ */
function Security() {
  const { t } = useLocale();
  const { notify } = useToast();
  const [otp, setOtp] = useState(true);
  const [newDevice, setNewDevice] = useState(true);
  const [admin2fa, setAdmin2fa] = useState(true);
  const [failLimit, setFailLimit] = useState('5');
  const [session, setSession] = useState('30');

  return (
    <AdminScreen title={t('admin.security')} back>
      <p className="mb-4 text-[13px] text-ink2">Policies apply to every member and administrator account.</p>

      <Card className="mb-4 divide-y divide-line p-0">
        <ToggleRow icon={ShieldCheck} label="Require OTP on sign in" on={otp} onToggle={() => { setOtp((v) => !v); notify('Policy updated'); }} />
        <ToggleRow icon={Sparkles} label="Verify new devices" on={newDevice} onToggle={() => { setNewDevice((v) => !v); notify('Policy updated'); }} />
        <ToggleRow icon={Lock} label="Two-factor for administrators" on={admin2fa} onToggle={() => { setAdmin2fa((v) => !v); notify('Policy updated'); }} />
      </Card>

      <div className="space-y-3">
        <TextInput label="Failed-login lockout threshold" type="number" value={failLimit} onChange={(e) => setFailLimit(e.target.value)} hint="Account locks after this many failed attempts." />
        <TextInput label="Session duration (minutes)" type="number" value={session} onChange={(e) => setSession(e.target.value)} hint="Members are signed out after this period of inactivity." />
      </div>

      <h2 className="mb-2 mt-6 text-[13px] font-semibold uppercase tracking-wide text-ink2">Password policy</h2>
      <Card className="p-4 text-[14px] text-ink2">
        <ul className="space-y-1.5">
          {['Minimum 8 characters', 'At least one uppercase letter', 'At least one number', 'Reset required every 180 days'].map((r) => (
            <li key={r} className="flex items-center gap-2"><Check size={15} className="text-emerald" /> {r}</li>
          ))}
        </ul>
      </Card>

      <Button fullWidth className="mt-6" leftIcon={<Save size={18} />} onClick={() => notify('Security settings saved')}>Save changes</Button>
    </AdminScreen>
  );
}

function ToggleRow({ icon: Icon, label, on, onToggle }: { icon: any; label: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emeraldl text-emerald"><Icon size={18} /></span>
      <span className="flex-1 text-[15px] text-ink">{label}</span>
      <button role="switch" aria-checked={on} aria-label={label} onClick={onToggle}
        className="flex h-11 w-12 shrink-0 items-center">
        <span className={cn('relative h-7 w-12 rounded-full transition-colors', on ? 'bg-primary' : 'bg-line')}>
          <span className={cn('absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform', on ? 'translate-x-5' : 'translate-x-0')} />
        </span>
      </button>
    </div>
  );
}

/* ============================ Backups & Annual Versions ============================ */
function Backups() {
  const { t } = useLocale();
  const { notify } = useToast();
  const [confirm, setConfirm] = useState<{ title: string; body: string; run: () => void } | null>(null);
  const years = [2026, 2025, 2024, 2023];

  return (
    <AdminScreen title={t('admin.backups')} back>
      <Card className="mb-5 p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emeraldl text-emerald"><Database size={22} /></span>
          <div>
            <p className="text-[15px] font-medium text-ink">Last backup</p>
            <p className="text-[13px] text-ink2">Today, 03:00 · 3,412 records</p>
          </div>
          <StatusChip tone="success"><Check size={13} /> Healthy</StatusChip>
        </div>
        <Button fullWidth className="mt-4" leftIcon={<Database size={18} />}
          onClick={() => setConfirm({ title: 'Create backup', body: 'Create a full backup of all member, content and account data now?', run: () => notify('Backup created') })}>
          Create backup now
        </Button>
      </Card>

      <SectionHeader title="Annual versions" />
      <Card className="overflow-hidden p-0">
        {years.map((y, i) => (
          <div key={y} className={cn('flex items-center gap-3 px-4 py-3.5', i > 0 && 'border-t border-line')}>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-card2 text-ink2"><Archive size={18} /></span>
            <div className="flex-1">
              <p className="text-[15px] font-medium text-ink">Directory {y}</p>
              <p className="text-[13px] text-ink2">{i === 0 ? 'Current working version' : `Published · ${y}`}</p>
            </div>
            {i === 0
              ? <StatusChip tone="primary">Live</StatusChip>
              : <Button variant="text" size="md" onClick={() => setConfirm({ title: `Restore ${y}`, body: `Restore the ${y} annual version? Current unsaved changes will be archived first.`, run: () => notify(`Restored ${y} version`) })}>Restore</Button>}
          </div>
        ))}
      </Card>

      <Button variant="outline" fullWidth className="mt-5" onClick={() => notify('Comparison view opened')}>Compare years</Button>
      <Button fullWidth className="mt-3" onClick={() => setConfirm({ title: 'Publish annual version', body: 'Publish the current directory as the 2026 annual version? This becomes the official record for the year.', run: () => notify('2026 version published') })}>
        Publish 2026 version
      </Button>

      <Dialog open={!!confirm} onClose={() => setConfirm(null)} title={confirm?.title ?? ''} body={confirm?.body}
        confirmLabel="Confirm" onConfirm={() => confirm?.run()} />
    </AdminScreen>
  );
}
