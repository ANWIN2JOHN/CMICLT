import { useParams } from 'react-router-dom';
import { Cake, Mail, MapPin, MessageCircle, Phone, Star } from 'lucide-react';
import { Screen } from '../../layouts/AppShell';
import { memberById } from '../../data/members';
import { Avatar, Card } from '../../components/ui/primitives';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/states';
import { useLocale } from '../../contexts/LocaleContext';
import { whatsappLink } from '../../lib/contact';

export function MemberProfile() {
  const { t } = useLocale();
  const { id } = useParams();
  const m = id ? memberById(id) : undefined;
  if (!m) return <Screen title={t('members.title')} back><EmptyState title="Member not found" /></Screen>;

  return (
    <Screen back title={m.name.replace('Fr. ', '')}>
      {/* Header */}
      <div className="flex flex-col items-center pt-2 text-center">
        <Avatar name={m.name} src={m.photo} size={104} />
        <h1 className="mt-4 font-head text-[24px] font-semibold text-ink">{m.name}</h1>
        <p className="mt-1 text-[15px] text-primary">{m.role}</p>
        <p className="mt-0.5 text-[14px] text-ink2">{m.house}</p>
        <span className="mt-2 inline-flex items-center gap-1 rounded-[var(--r-pill)] bg-emeraldl px-3 py-1 text-[13px] font-medium text-emerald dark:text-ink">
          <MapPin size={13} /> {m.zone} · {m.country}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variant="secondary" leftIcon={<Phone size={18} />} onClick={() => (window.location.href = `tel:${m.phone}`)}>{t('common.call')}</Button>
        <Button variant="secondary" leftIcon={<MessageCircle size={18} />} onClick={() => window.open(whatsappLink(m.phone), '_blank')}>{t('common.whatsapp')}</Button>
      </div>

      <div className="mt-6 space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
        <InfoCard title={t('members.contact')}>
          <Row icon={<Phone size={16} />} label={t('members.phone')} value={m.phone} />
          <Row icon={<Mail size={16} />} label={t('common.email')} value={m.email} />
        </InfoCard>

        <InfoCard title={t('members.personal')}>
          <Row icon={<Cake size={16} />} label={t('members.birthday')} value={m.birthday} />
          <Row icon={<Star size={16} />} label={t('members.feastDay')} value={`${m.feastDay} · ${m.feastName}`} />
          <Row label={t('members.diocese')} value={m.diocese} />
          <Row label={t('members.parish')} value={m.parish} />
        </InfoCard>

        <InfoCard title={t('members.religious')}>
          <Row label={t('members.professionDate')} value={m.professionDate} />
          <Row label={t('members.ordinationDate')} value={m.ordinationDate} />
        </InfoCard>

        <InfoCard title={t('members.assignmentHistory')}>
          <ol className="relative ml-1 border-l-2 border-line pl-5">
            {m.assignments.map((a, i) => (
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
