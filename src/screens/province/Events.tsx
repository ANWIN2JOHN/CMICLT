import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarDays, Clock, List, MapPin } from 'lucide-react';
import { Screen } from '../../layouts/AppShell';
import { EventCard } from '../../components/patterns/cards';
import { FilterChip, Card } from '../../components/ui/primitives';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/states';
import { useToast } from '../../components/ui/overlays';
import { events } from '../../data/content';
import { useLocale } from '../../contexts/LocaleContext';
import type { EventCategory } from '../../data/types';
import { cn } from '../../lib/cn';

const catList: Array<{ id: EventCategory; key: any }> = [
  { id: 'birthday', key: 'events.cat.birthday' }, { id: 'feast', key: 'events.cat.feast' },
  { id: 'province', key: 'events.cat.province' }, { id: 'anniversary', key: 'events.cat.anniversary' },
  { id: 'jubilee', key: 'events.cat.jubilee' },
];

export function Events() {
  const { t } = useLocale();
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [cat, setCat] = useState<EventCategory | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);

  const filtered = useMemo(() => {
    const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
    return cat ? sorted.filter((e) => e.category === cat) : sorted;
  }, [cat]);

  return (
    <Screen title={t('events.title')} right={
      <div className="mr-1 flex rounded-[var(--r-pill)] bg-card2 p-1">
        {(['calendar', 'list'] as const).map((v) => (
          <button key={v} onClick={() => setView(v)}
            className={cn('press flex h-11 items-center gap-1.5 rounded-[var(--r-pill)] px-3.5 text-[13px] font-medium',
              view === v ? 'bg-card text-ink shadow-[var(--shadow-sm)]' : 'text-ink2')}>
            {v === 'calendar' ? <CalendarDays size={16} /> : <List size={16} />}
            {t(v === 'calendar' ? 'events.calendar' : 'events.list')}
          </button>
        ))}
      </div>
    }>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:-mx-6 md:px-6">
        {catList.map((c) => <FilterChip key={c.id} active={cat === c.id} onClick={() => setCat(cat === c.id ? null : c.id)}>{t(c.key)}</FilterChip>)}
      </div>

      {view === 'calendar' ? (
        <CalendarView monthOffset={monthOffset} setMonthOffset={setMonthOffset} events={filtered} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<CalendarDays size={26} />} title={t('events.empty')} />
      ) : (
        <div className="mt-4 grid gap-2.5 md:grid-cols-2">{filtered.map((e) => <EventCard key={e.id} event={e} />)}</div>
      )}
    </Screen>
  );
}

function CalendarView({ monthOffset, setMonthOffset, events: evts }: any) {
  const { t } = useLocale();
  const base = new Date();
  base.setMonth(base.getMonth() + monthOffset);
  const year = base.getFullYear(), month = base.getMonth();
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const eventDays = new Set(evts.filter((e: any) => { const d = new Date(e.date); return d.getMonth() === month && d.getFullYear() === year; }).map((e: any) => new Date(e.date).getDate()));
  const monthEvents = evts.filter((e: any) => { const d = new Date(e.date); return d.getMonth() === month && d.getFullYear() === year; });

  return (
    <div className="mt-4">
      <div className="mb-3 flex items-center justify-between">
        <button className="press h-11 w-11 rounded-full text-ink active:bg-card2" onClick={() => setMonthOffset((m: number) => m - 1)}>‹</button>
        <p className="font-head text-[17px] font-semibold text-ink">{base.toLocaleString('en', { month: 'long', year: 'numeric' })}</p>
        <button className="press h-11 w-11 rounded-full text-ink active:bg-card2" onClick={() => setMonthOffset((m: number) => m + 1)}>›</button>
      </div>
      <Card className="p-3">
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-ink2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i}>{d}</span>)}
        </div>
        <div className="mt-1.5 grid grid-cols-7 gap-1">
          {Array.from({ length: first }).map((_, i) => <span key={`e${i}`} />)}
          {Array.from({ length: days }).map((_, i) => {
            const day = i + 1;
            const has = eventDays.has(day);
            return (
              <div key={day} className={cn('relative flex aspect-square items-center justify-center rounded-[12px] text-[14px]',
                has ? 'bg-emeraldl font-semibold text-emerald dark:text-ink' : 'text-ink')}>
                {day}
                {has && <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-gold" />}
              </div>
            );
          })}
        </div>
      </Card>
      <div className="mt-4 space-y-2.5">
        {monthEvents.length ? monthEvents.map((e: any) => <EventCard key={e.id} event={e} />) : <EmptyState title={t('events.empty')} />}
      </div>
    </div>
  );
}

export function EventDetail() {
  const { t } = useLocale();
  const { id } = useParams();
  const { notify } = useToast();
  const e = events.find((x) => x.id === id);
  if (!e) return <Screen title={t('events.title')} back><EmptyState title="Not found" /></Screen>;
  const d = new Date(e.date);
  return (
    <div className="relative min-h-full pb-[calc(88px+var(--safe-bottom))]">
      <Screen back title={t('events.title')}>
        <div className="flex items-start gap-4">
          <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-[18px] bg-emeraldl py-2 text-emerald dark:text-ink">
            <span className="text-[12px] font-semibold uppercase">{d.toLocaleString('en', { month: 'short' })}</span>
            <span className="font-head text-[28px] font-bold leading-none">{d.getDate()}</span>
          </div>
          <div>
            <span className="text-[13px] font-medium capitalize text-primary">{e.category}</span>
            <h1 className="mt-0.5 font-head text-[23px] font-semibold leading-snug text-ink">{e.title}</h1>
          </div>
        </div>
        <Card className="mt-5 space-y-3 p-4">
          <p className="flex items-center gap-2.5 text-[15px] text-ink"><CalendarDays size={18} className="text-ink2" /> {d.toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          {e.time && <p className="flex items-center gap-2.5 text-[15px] text-ink"><Clock size={18} className="text-ink2" /> {e.time}</p>}
          {e.location && <p className="flex items-center gap-2.5 text-[15px] text-ink"><MapPin size={18} className="text-ink2" /> {e.location}</p>}
        </Card>
        {e.description && (
          <div className="mt-5">
            <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-ink2">{t('events.description')}</h2>
            <p className="text-[15px] leading-relaxed text-ink">{e.description}</p>
          </div>
        )}
      </Screen>
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-[520px] gap-3 border-t border-line bg-card/95 px-4 py-3 pb-[calc(12px+var(--safe-bottom))] backdrop-blur md:static md:mt-6 md:max-w-none md:border-0 md:bg-transparent md:px-6">
        <Button variant="outline" fullWidth onClick={() => notify('Reminder set')}>{t('common.reminder')}</Button>
        <Button fullWidth onClick={() => notify('Added to calendar')}>{t('common.addToCalendar')}</Button>
      </div>
    </div>
  );
}
