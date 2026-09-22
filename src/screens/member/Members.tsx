import { useMemo, useState } from 'react';
import { SlidersHorizontal, Users } from 'lucide-react';
import { Screen } from '../../layouts/AppShell';
import { SearchField } from '../../components/ui/Input';
import { MemberCard } from '../../components/patterns/cards';
import { FilterChip } from '../../components/ui/primitives';
import { BottomSheet } from '../../components/ui/overlays';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/states';
import { members } from '../../data/members';
import { zones } from '../../data/content';
import { useLocale } from '../../contexts/LocaleContext';
import type { Zone } from '../../data/types';

const roleOptions = ['Provincial', 'Superior', 'Principal', 'Parish Priest', 'Professor', 'Formator', 'Missionary'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface Filters { zone: Zone[]; role: string[]; birthMonth: number[] }
const emptyFilters: Filters = { zone: [], role: [], birthMonth: [] };

export function Members() {
  const { t } = useLocale();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [draft, setDraft] = useState<Filters>(emptyFilters);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>(['Wayanad', 'Principal', 'Fr. Thomas']);

  const activeCount = filters.zone.length + filters.role.length + filters.birthMonth.length;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (q && !`${m.name} ${m.role} ${m.house} ${m.institution ?? ''} ${m.zone} ${m.country}`.toLowerCase().includes(q)) return false;
      if (filters.zone.length && !filters.zone.includes(m.zone)) return false;
      if (filters.role.length && !filters.role.some((r) => m.role.includes(r))) return false;
      if (filters.birthMonth.length && !filters.birthMonth.includes(m.birthMonth)) return false;
      return true;
    });
  }, [query, filters]);

  const openSheet = () => { setDraft(filters); setSheetOpen(true); };
  const toggle = <K extends keyof Filters>(key: K, val: Filters[K][number]) =>
    setDraft((d) => {
      const arr = d[key] as Array<typeof val>;
      return { ...d, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
    });

  return (
    <Screen title={t('members.title')} right={
      <button onClick={openSheet} aria-label={t('common.filters')}
        className="press relative mr-1 flex h-11 min-w-[44px] items-center gap-1.5 rounded-full px-3 text-[14px] font-medium text-ink active:bg-card2">
        <SlidersHorizontal size={19} /> {t('common.filters')}
        {activeCount > 0 && <span className="rounded-full bg-primary px-1.5 text-[12px] text-onprimary">{activeCount}</span>}
      </button>
    }>
      <SearchField value={query} placeholder={t('members.searchPlaceholder')} onChange={(e) => setQuery(e.target.value)} />

      {!query && !activeCount && recent.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[13px] font-medium text-ink2">{t('members.recentSearches')}</p>
          <div className="flex flex-wrap gap-2">
            {recent.map((r) => <FilterChip key={r} onClick={() => setQuery(r)}>{r}</FilterChip>)}
          </div>
        </div>
      )}

      <p className="mt-4 text-[13px] text-ink2">{results.length} {t('common.results')}</p>

      <div className="mt-2 grid gap-2.5 md:grid-cols-2">
        {results.map((m) => <MemberCard key={m.id} member={m} />)}
      </div>

      {results.length === 0 && (
        <EmptyState icon={<Users size={26} />} title={t('members.empty')} body={t('members.emptyHelp')}
          actionLabel={t('common.clearAll')} onAction={() => { setQuery(''); setFilters(emptyFilters); }} />
      )}

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={t('common.filters')}
        footer={
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setDraft(emptyFilters)}>{t('common.clearAll')}</Button>
            <Button fullWidth onClick={() => { setFilters(draft); setSheetOpen(false); }}>{t('common.apply')}</Button>
          </div>
        }>
        <FilterGroup label={t('members.zone')}>
          {zones.map((z) => <FilterChip key={z} active={draft.zone.includes(z)} onClick={() => toggle('zone', z)}>{z}</FilterChip>)}
        </FilterGroup>
        <FilterGroup label={t('members.role')}>
          {roleOptions.map((r) => <FilterChip key={r} active={draft.role.includes(r)} onClick={() => toggle('role', r)}>{r}</FilterChip>)}
        </FilterGroup>
        <FilterGroup label={t('members.birthdayMonth')}>
          {monthNames.map((mn, i) => <FilterChip key={mn} active={draft.birthMonth.includes(i + 1)} onClick={() => toggle('birthMonth', i + 1)}>{mn}</FilterChip>)}
        </FilterGroup>
      </BottomSheet>
    </Screen>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="mb-2.5 text-[14px] font-medium text-ink">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
