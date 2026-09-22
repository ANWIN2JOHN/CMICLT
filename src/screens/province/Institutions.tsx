import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Building2, LayoutGrid, List, MapPin, MessageCircle, Phone, Users } from 'lucide-react';
import { Screen } from '../../layouts/AppShell';
import { SearchField } from '../../components/ui/Input';
import { FilterChip, Card } from '../../components/ui/primitives';
import { InstitutionCard } from '../../components/patterns/cards';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/states';
import { institutions, zones } from '../../data/content';
import { useLocale } from '../../contexts/LocaleContext';
import { whatsappLink } from '../../lib/contact';
import type { InstitutionCategory } from '../../data/types';

const cats: Array<{ id: InstitutionCategory; key: any }> = [
  { id: 'house', key: 'inst.cat.house' }, { id: 'education', key: 'inst.cat.education' },
  { id: 'social', key: 'inst.cat.social' }, { id: 'health', key: 'inst.cat.health' },
  { id: 'pastoral', key: 'inst.cat.pastoral' }, { id: 'mission', key: 'inst.cat.mission' },
];

export function Institutions() {
  const { t } = useLocale();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<InstitutionCategory | null>(null);
  const [zone, setZone] = useState<string | null>(null);
  const [list, setList] = useState(false);

  const results = useMemo(() => institutions.filter((i) => {
    if (query && !`${i.name} ${i.address} ${i.zone}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (cat && i.category !== cat) return false;
    if (zone && i.zone !== zone) return false;
    return true;
  }), [query, cat, zone]);

  return (
    <Screen title={t('inst.title')} right={
      <button aria-label="Toggle view" onClick={() => setList((l) => !l)} className="press mr-1 flex h-11 w-11 items-center justify-center rounded-full text-ink active:bg-card2">
        {list ? <LayoutGrid size={20} /> : <List size={20} />}
      </button>
    }>
      <SearchField value={query} placeholder={t('inst.searchPlaceholder')} onChange={(e) => setQuery(e.target.value)} />
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 md:-mx-6 md:px-6">
        {cats.map((c) => <FilterChip key={c.id} active={cat === c.id} onClick={() => setCat(cat === c.id ? null : c.id)}>{t(c.key)}</FilterChip>)}
      </div>
      <div className="no-scrollbar -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 md:-mx-6 md:px-6">
        {zones.map((z) => <FilterChip key={z} active={zone === z} onClick={() => setZone(zone === z ? null : z)}>{z}</FilterChip>)}
      </div>

      <p className="mt-4 text-[13px] text-ink2">{results.length} {t('common.results')}</p>
      {results.length === 0 ? (
        <EmptyState icon={<Building2 size={26} />} title="No institutions found" body={t('members.emptyHelp')} />
      ) : list ? (
        <div className="mt-2 space-y-2.5">{results.map((i) => <InstitutionCard key={i.id} inst={i} list />)}</div>
      ) : (
        <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-3">{results.map((i) => <InstitutionCard key={i.id} inst={i} />)}</div>
      )}
    </Screen>
  );
}

const instImg = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=70';

export function InstitutionProfile() {
  const { t } = useLocale();
  const { id } = useParams();
  const inst = institutions.find((i) => i.id === id);
  if (!inst) return <Screen title={t('inst.title')} back><EmptyState title="Not found" /></Screen>;
  return (
    <Screen back title={inst.name}>
      <img src={inst.photo || instImg} alt="" className="h-48 w-full rounded-[var(--r-card)] object-cover" />
      <h1 className="mt-4 font-head text-[23px] font-semibold text-ink">{inst.name}</h1>
      <p className="mt-1 flex items-center gap-1.5 text-[14px] text-ink2"><MapPin size={15} /> {inst.address}</p>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Button variant="secondary" onClick={() => (window.location.href = `tel:${inst.phone}`)} leftIcon={<Phone size={17} />}>{t('common.call')}</Button>
        <Button variant="secondary" onClick={() => window.open(whatsappLink(inst.phone), '_blank')} leftIcon={<MessageCircle size={17} />}>{t('common.whatsapp')}</Button>
        <Button variant="secondary" onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(inst.address)}`)} leftIcon={<MapPin size={17} />}>{t('common.openMap')}</Button>
      </div>

      <Card className="mt-5 divide-y divide-line p-0">
        <Detail label={t('inst.type')} value={t(cats.find((c) => c.id === inst.category)!.key)} />
        <Detail label={t('members.zone')} value={inst.zone} />
        <Detail label={t('inst.year')} value={String(inst.year)} />
        <Detail label={t('inst.head')} value={inst.head} />
        <Detail label={t('inst.residents')} value={`${inst.residents}`} icon={<Users size={15} />} />
      </Card>

      <h2 className="mb-2 mt-5 text-[13px] font-semibold uppercase tracking-wide text-ink2">{t('inst.apostolates')}</h2>
      <div className="flex flex-wrap gap-2">
        {inst.apostolates.map((a) => <span key={a} className="rounded-[var(--r-pill)] bg-emeraldl px-3 py-1.5 text-[13px] font-medium text-emerald dark:text-ink">{a}</span>)}
      </div>
    </Screen>
  );
}
function Detail({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <span className="text-[14px] text-ink2">{label}</span>
      <span className="flex items-center gap-1.5 text-right text-[15px] font-medium text-ink">{icon}{value}</span>
    </div>
  );
}
