import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2, CalendarDays, Cake, ChevronRight, FileText, Mail, MapPin, MessageCircle, Phone, Star } from 'lucide-react';
import { BackButton, Screen } from '../../layouts/AppShell';
import CmiHeaderArt from '../../components/patterns/CmiHeaderArt';
import { HamburgerMenu } from '../../components/navigation/HamburgerMenu';
import { Avatar, Card, Skeleton } from '../../components/ui/primitives';
import { displayName } from '../../components/patterns/cards';
import { EmptyState, ErrorState } from '../../components/ui/states';
import { useLocale } from '../../contexts/LocaleContext';
import { whatsappLink } from '../../lib/contact';
import { getMemberById } from '../../services/memberService';
import type { MemberWithInstitutions } from '../../services/memberService';

export function MemberProfile() {
  const { t } = useLocale();
  const { id } = useParams();
  const [member, setMember] = useState<MemberWithInstitutions | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setMember(null);
      setLoading(false);
      return;
    }

    const memberId = id;
    let active = true;

    async function loadMember() {
      try {
        setLoading(true);
        setError(null);
        const data = await getMemberById(memberId);
        if (!active) return;
        setMember(data);
      } catch (err) {
        if (!active) return;
        setMember(null);
        setError(err instanceof Error ? err.message : 'Unable to load member details.');
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadMember();
    return () => { active = false; };
  }, [id]);

  if (!id) return <ProfileFrame><EmptyState title="Member not found" /></ProfileFrame>;
  if (loading) {
    return (
      <ProfileFrame>
        <div className="space-y-4 pt-2">
          <div className="flex flex-col items-center text-center">
            <Skeleton className="h-[104px] w-[104px] rounded-full" />
            <Skeleton className="mt-4 h-7 w-2/3" />
            <Skeleton className="mt-2 h-4 w-1/3" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-12 w-full rounded-[var(--r-pill)]" />
            <Skeleton className="h-12 w-full rounded-[var(--r-pill)]" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-48 w-full rounded-[var(--r-card)]" />
            <Skeleton className="h-48 w-full rounded-[var(--r-card)]" />
          </div>
        </div>
      </ProfileFrame>
    );
  }
  if (error) return <ProfileFrame><ErrorState title="Unable to load member" body={error} onRetry={() => { if (id) void getMemberById(id).then(setMember).catch(() => setError('Unable to load member details.')); }} /></ProfileFrame>;
  if (!member) return <ProfileFrame><EmptyState title="Member not found" /></ProfileFrame>;

  const phone = member.phone?.trim();
  const email = member.email?.trim();
  const feast = `${member.feastDay} · ${member.feastName ?? ''}`.replace(/\s+·\s+$/, '').trim();

  return (
    <ProfileFrame>
      {/* Hero */}
      <section className="flex flex-col items-center pt-1 text-center">
        <span className="rounded-full bg-card p-[3px] ring-[1.5px] ring-gold/70 shadow-[0_0_0_5px_var(--c-card),0_0_0_7px_color-mix(in_srgb,var(--c-primary)_55%,transparent),0_0_0_16px_color-mix(in_srgb,var(--c-emerald-light)_70%,transparent),0_14px_30px_-10px_rgba(8,72,59,0.35)]">
          <span className="block md:hidden"><Avatar name={member.name} src={member.photo} size={100} /></span>
          <span className="hidden md:block"><Avatar name={member.name} src={member.photo} size={112} /></span>
        </span>
        <h2 className="mt-7 max-w-[30ch] break-words font-head text-[24px] font-semibold leading-tight tracking-[-0.01em] text-ink md:text-[26px]">{displayName(member.name)}</h2>
        <p className="mt-1 text-[15px] font-medium text-primary">{member.role || 'CMI Member'}</p>
        {member.house && <p className="mt-0.5 text-[14px] text-ink2">{member.house}</p>}
        <span aria-hidden className="mt-4 h-[2px] w-8 rounded-full bg-gold" />
      </section>

      <div className="mx-auto mt-5 grid max-w-[520px] grid-cols-2 gap-3">
        <ActionButton strong icon={<Phone size={18} />} label={t('common.call')} onClick={() => (window.location.href = `tel:${member.phone}`)} />
        <ActionButton icon={<MessageCircle size={18} />} label={t('common.whatsapp')} onClick={() => window.open(whatsappLink(member.phone), '_blank')} />
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2 md:items-start">
        <InfoCard title={t('members.contact')}>
          <Row icon={<Phone size={16} />} label={t('members.phone')} value={member.phone} href={phone ? `tel:${phone}` : undefined} />
          <Row icon={<Mail size={16} />} label={t('common.email')} value={member.email} href={email ? `mailto:${email}` : undefined} />
        </InfoCard>

        <InfoCard title={t('members.religious')}>
          <Row icon={<CalendarDays size={16} />} label={t('members.professionDate')} value={formatDate(member.professionDate)} />
          <Row icon={<CalendarDays size={16} />} label={t('members.ordinationDate')} value={formatDate(member.ordinationDate)} />
        </InfoCard>

        <InfoCard title={t('members.personal')} className="md:col-span-2">
          <div className="grid gap-x-6 gap-y-3.5 md:grid-cols-2">
            {member.address && <Row icon={<MapPin size={16} />} label={t('inst.address')} value={member.address} />}
            {member.zone && <Row label={t('members.zone')} value={member.zone as string} />}
            <Row icon={<Cake size={16} />} label={t('members.birthday')} value={member.birthday} />
            <Row icon={<Star size={16} />} label={t('members.feastDay')} value={feast} />
            <Row label={t('members.diocese')} value={member.diocese} />
            <Row label={t('members.parish')} value={member.parish} />
          </div>
        </InfoCard>

        {member.institutions.length > 0 && (
          <InfoCard title="Institutions" className="md:col-span-2">
            <div className="grid gap-2.5 md:grid-cols-2">
              {member.institutions.map((institution) => (
                <div key={institution.id} className="rounded-[16px] border border-[color-mix(in_srgb,var(--c-primary)_14%,var(--c-border))] bg-emeraldl px-3.5 py-3 dark:bg-[color-mix(in_srgb,var(--c-primary)_12%,transparent)]">
                  <div className="flex items-start gap-3">
                    <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-card text-primary"><Building2 size={17} /></span>
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-[16px] font-semibold leading-snug text-ink">{institution.name}</p>
                      <p className="mt-0.5 text-[14px] text-ink2">{institution.position || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </InfoCard>
        )}

        <InfoCard title={t('members.assignmentHistory')} className="md:col-span-2">
          {member.assignments?.length ? (
            <ol className="relative ml-1.5 border-l-2 border-[color-mix(in_srgb,var(--c-primary)_18%,var(--c-border))] pl-5">
              {member.assignments.map((a, i) => (
                <li key={i} className="relative pb-5 last:pb-0">
                  <span className={`absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full border-2 border-card ${a.to === null ? 'bg-primary' : 'bg-gold/70'}`} />
                  <p className="text-[16px] font-semibold text-ink">{a.role}</p>
                  <p className="text-[14px] text-ink2">{a.place}</p>
                  <p className="mt-0.5 text-[13px] text-ink2">{a.from} — {a.to ?? 'Present'}</p>
                </li>
              ))}
            </ol>
          ) : (
            <div className="flex items-center gap-3 rounded-[14px] bg-card2 px-3.5 py-3">
              <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-card text-ink2"><FileText size={17} /></span>
              <p className="text-[14px] text-ink2">No previous assignments available.</p>
            </div>
          )}
        </InfoCard>
      </div>
    </ProfileFrame>
  );
}

function ProfileFrame({ children }: { children: React.ReactNode }) {
  const nav = useNavigate();
  return (
    <div className="relative isolate min-h-full pb-8">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-bg dark:bg-[radial-gradient(120%_60%_at_50%_0%,color-mix(in_srgb,var(--c-primary)_16%,var(--c-bg))_0%,var(--c-bg)_60%)]" />
      <Screen>
        <div className="mx-auto w-full max-w-[880px]">
          <header className="relative -mx-4 -mt-4 overflow-hidden border-b border-[color-mix(in_srgb,var(--c-gold)_30%,transparent)] px-2 pb-6 pt-[calc(8px+var(--safe-top))] md:-mx-6 md:px-4">
            <CmiHeaderArt />
            <div className="relative flex h-12 items-center [&>button]:text-primary [&>button]:hover:bg-emeraldl dark:[&>button]:text-[#cdeee0]"><HamburgerMenu /></div>
            <div className="relative mt-1 flex flex-col items-center">
              <h1 className="font-head text-[21px] font-semibold tracking-[-0.01em] text-ink md:text-[22px]">Member Profile</h1>
              <span aria-hidden className="mt-2 h-[2px] w-7 rounded-full bg-gold" />
            </div>
            <div className="absolute bottom-0 left-4 md:left-6"><BackButton onClick={() => nav(-1)} /></div>
          </header>
          <div className="pt-4">{children}</div>
        </div>
      </Screen>
    </div>
  );
}

function formatDate(value: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value?.trim() ?? '');
  if (!m) return value;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function ActionButton({ icon, label, onClick, strong }: { icon: React.ReactNode; label: string; onClick: () => void; strong?: boolean }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex min-h-[54px] items-center justify-center gap-2 rounded-[17px] border text-[15px] font-semibold ${strong ? 'border-[color-mix(in_srgb,var(--c-primary)_38%,var(--c-border))] bg-[color-mix(in_srgb,var(--c-primary)_14%,var(--c-card))] dark:bg-[color-mix(in_srgb,var(--c-primary)_30%,transparent)]' : 'border-[color-mix(in_srgb,var(--c-primary)_20%,var(--c-border))] bg-emeraldl dark:bg-[color-mix(in_srgb,var(--c-primary)_16%,transparent)]'} text-primary dark:text-[#cdeee0] shadow-[0_2px_10px_-6px_rgba(8,72,59,0.25)] outline-none transition-[transform,border-color,box-shadow] duration-150 hover:border-[color-mix(in_srgb,var(--c-primary)_35%,var(--c-border))] active:scale-[0.98] focus-visible:ring-[3px] focus-visible:ring-[var(--c-ring)] motion-reduce:transition-none motion-reduce:active:scale-100`}>
      {icon}{label}
    </button>
  );
}

function InfoCard({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <Card className={`rounded-[20px] border-[color-mix(in_srgb,var(--c-primary)_12%,var(--c-border))] dark:border-[color-mix(in_srgb,var(--c-primary)_26%,transparent)] dark:bg-[color-mix(in_srgb,var(--c-card)_82%,transparent)] dark:backdrop-blur p-4 shadow-[0_2px_10px_-6px_rgba(8,72,59,0.16)] md:p-5 ${className}`}>
      <h2 className="mb-3.5 flex items-center gap-2 text-[13.5px] font-semibold uppercase tracking-[0.08em] text-primary">
        <span aria-hidden className="h-[3px] w-3.5 rounded-full bg-gold" />{title}
      </h2>
      <div className="space-y-3.5">{children}</div>
    </Card>
  );
}
function Row({ icon, label, value, href }: { icon?: React.ReactNode; label: string; value: string; href?: string }) {
  const body = (
    <>
      {icon && <span aria-hidden className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-emeraldl text-primary">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] text-ink2">{label}</span>
        <span className={`block break-words text-[16px] font-medium leading-snug ${href ? 'text-primary' : 'text-ink'}`}>{value || '—'}</span>
      </span>
      {href && <ChevronRight aria-hidden size={17} className="mt-3 shrink-0 text-ink2/60" />}
    </>
  );
  return href
    ? <a href={href} className="-mx-1.5 flex min-h-[44px] items-start gap-3 rounded-[12px] px-1.5 py-0.5 outline-none transition-colors duration-150 hover:bg-card2 focus-visible:ring-[3px] focus-visible:ring-[var(--c-ring)] motion-reduce:transition-none">{body}</a>
    : <div className="flex items-start gap-3">{body}</div>;
}
