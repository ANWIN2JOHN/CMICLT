import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Cake, Mail, MapPin, MessageCircle, Phone, Star } from 'lucide-react';
import { Screen } from '../../layouts/AppShell';
import { Avatar, Card, Skeleton } from '../../components/ui/primitives';
import { Button } from '../../components/ui/Button';
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

  if (!id) return <Screen title={t('members.title')} back><EmptyState title="Member not found" /></Screen>;
  if (loading) {
    return (
      <Screen back title="Member">
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
      </Screen>
    );
  }
  if (error) return <Screen title={t('members.title')} back><ErrorState title="Unable to load member" body={error} onRetry={() => { if (id) void getMemberById(id).then(setMember).catch(() => setError('Unable to load member details.')); }} /></Screen>;
  if (!member) return <Screen title={t('members.title')} back><EmptyState title="Member not found" /></Screen>;

  return (
    <Screen back title={member.name.replace('Fr. ', '')}>
      {/* Header */}
      <div className="flex flex-col items-center pt-2 text-center">
        <Avatar name={member.name} src={member.photo} size={104} />
        <h1 className="mt-4 font-head text-[24px] font-semibold text-ink">{member.name}</h1>
        <p className="mt-1 text-[15px] text-primary">{member.role}</p>
        <p className="mt-0.5 text-[14px] text-ink2">{member.house}</p>
        {member.address ? (
          <span className="mt-2 inline-flex items-center gap-1 rounded-[var(--r-pill)] bg-emeraldl px-3 py-1 text-[13px] font-medium text-emerald dark:text-ink">
            <MapPin size={13} /> {member.address}
          </span>
        ) : null}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variant="secondary" leftIcon={<Phone size={18} />} onClick={() => (window.location.href = `tel:${member.phone}`)}>{t('common.call')}</Button>
        <Button variant="secondary" leftIcon={<MessageCircle size={18} />} onClick={() => window.open(whatsappLink(member.phone), '_blank')}>{t('common.whatsapp')}</Button>
      </div>

      <div className="mt-6 space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
        <InfoCard title={t('members.contact')}>
          <Row icon={<Phone size={16} />} label={t('members.phone')} value={member.phone} />
          <Row icon={<Mail size={16} />} label={t('common.email')} value={member.email} />
        </InfoCard>

        <InfoCard title={t('members.personal')}>
          <Row icon={<Cake size={16} />} label={t('members.birthday')} value={member.birthday} />
          <Row icon={<Star size={16} />} label={t('members.feastDay')} value={`${member.feastDay} · ${member.feastName ?? ''}`.replace(/\s+·\s+$/, '').trim()} />
          <Row label={t('members.diocese')} value={member.diocese} />
          <Row label={t('members.parish')} value={member.parish} />
        </InfoCard>

        <InfoCard title={t('members.religious')}>
          <Row label={t('members.professionDate')} value={member.professionDate} />
          <Row label={t('members.ordinationDate')} value={member.ordinationDate} />
        </InfoCard>

        {member.institutions.length > 0 && (
          <InfoCard title="Institutions">
            <div className="space-y-3">
              {member.institutions.map((institution) => (
                <div key={institution.id} className="rounded-[var(--r-card)] border border-line bg-card2 p-3">
                  <p className="text-[15px] font-medium text-ink">{institution.name}</p>
                  <p className="mt-1 text-[13px] text-ink2">
                    <span className="font-medium text-ink">Position:</span> {institution.position || 'Not specified'}
                  </p>
                </div>
              ))}
            </div>
          </InfoCard>
        )}

        <InfoCard title={t('members.assignmentHistory')}>
          <ol className="relative ml-1 border-l-2 border-line pl-5">
            {member.assignments?.map((a, i) => (
              <li key={i} className="relative pb-5 last:pb-0">
                <span className={`absolute -left-[27px] top-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${a.to === null ? 'bg-primary' : 'bg-line'}`} />
                <p className="text-[15px] font-medium text-ink">{a.role}</p>
                <p className="text-[13px] text-ink2">{a.place}</p>
                <p className="mt-0.5 text-[12px] text-ink2">{a.from} — {a.to ?? 'Present'}</p>
              </li>
            ))}
          </ol>
        </InfoCard>
      </div>
    </Screen>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="p-4 md:self-start">
      <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-ink2">{title}</h2>
      <div className="space-y-2.5">{children}</div>
    </Card>
  );
}
function Row({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      {icon && <span className="mt-0.5 text-ink2">{icon}</span>}
      <div className="min-w-0 flex-1">
        <p className="text-[12px] text-ink2">{label}</p>
        <p className="break-words text-[15px] text-ink">{value}</p>
      </div>
    </div>
  );
}
