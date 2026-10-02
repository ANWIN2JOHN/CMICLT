import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CalendarDays, Cake, ChevronRight, Landmark, Search, Star, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { Avatar, Card, SectionHeader, StatusChip, Skeleton } from '../../components/ui/primitives';
import { EventCard, MemberRow, NewsCard } from '../../components/patterns/cards';
import { IconButton } from '../../components/ui/Button';
import { ErrorState } from '../../components/ui/states';
import { HamburgerMenu } from '../../components/navigation/HamburgerMenu';
import CmiHeaderArt from '../../components/patterns/CmiHeaderArt';
import { supabase } from '../../lib/supabase';
import { getMembers } from '../../services/memberService';
import type { CmiEvent, Member, NewsArticle } from '../../data/types';

function getDayValue(value: string | number | null | undefined): number {
  if (value == null) return 0;
  const stringValue = String(value).trim();
  if (!stringValue) return 0;
  const match = stringValue.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function getUpcomingDateLabel(month: number, day: number): string {
  const monthLabel = new Date(2000, month - 1, 1).toLocaleString('en-US', { month: 'short' });
  return `${monthLabel} ${day}`;
}

export function Home() {
  const { t } = useLocale();
  const { user } = useAuth();
  const nav = useNavigate();
  const hour = new Date().getHours();
  const greetKey = hour < 12 ? 'home.goodMorning' : hour < 17 ? 'home.goodAfternoon' : 'home.goodEvening';
  const name = user?.name ?? 'Fr. John';
  const dateStr = new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' });
  const [members, setMembers] = useState<Member[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CmiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [nextMembers, { data: eventRows, error: eventError }, { data: newsRows, error: newsError }] = await Promise.all([
          getMembers(),
          supabase
            .from('events')
            .select('*')
            .gte('event_date', new Date().toISOString().slice(0, 10))
            .order('event_date', { ascending: true })
            .limit(4),
          supabase
            .from('news_articles')
            .select('*')
            .eq('status', 'published')
            .order('published_date', { ascending: false })
            .limit(5),
        ]);

        if (eventError) {
          throw eventError;
        }
        if (newsError) {
          throw newsError;
        }

        if (!active) return;

        setMembers(nextMembers);
        setNews((newsRows ?? []).map((row: any) => ({
          id: row.id,
          category: row.category ?? 'Province',
          headline: row.headline,
          date: row.published_date,
          author: row.author_name ?? undefined,
          summary: row.summary ?? '',
          image: row.image_url ?? 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1200&q=70',
          featured: !!row.featured,
          body: Array.isArray(row.body) ? row.body.map((entry: unknown) => String(entry)) : [row.summary ?? ''],
        })));
        setUpcomingEvents((eventRows ?? []).map((row) => ({
          id: row.id,
          title: row.title,
          category: row.category,
          date: row.event_date,
          time: row.event_time ?? undefined,
          location: row.location ?? undefined,
          description: row.description ?? undefined,
        })));
      } catch (err) {
        if (!active) return;
        setMembers([]);
        setNews([]);
        setUpcomingEvents([]);
        setError(err instanceof Error ? err.message : 'Unable to load member data.');
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadData();
    return () => { active = false; };
  }, []);

  const birthdays = useMemo(() => {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    return [...members]
      .filter((member) => member.birthMonth > 0 && member.birthday)
      .map((member) => {
        const day = getDayValue(member.birthday);
        const month = member.birthMonth;
        const upcomingDate = new Date(today.getFullYear(), month - 1, day);
        const sortMonth = upcomingDate.getMonth() + 1;
        const sortDay = upcomingDate.getDate();

        const isPast = sortMonth < todayMonth || (sortMonth === todayMonth && sortDay < todayDay);
        const normalizedDate = isPast ? new Date(today.getFullYear() + 1, month - 1, day) : upcomingDate;

        return {
          member,
          sortDate: normalizedDate,
          label: getUpcomingDateLabel(month, day),
        };
      })
      .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime())
      .slice(0, 6)
      .map(({ member, label }) => ({ ...member, birthday: label }));
  }, [members]);

  const feasts = useMemo(() => {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    return [...members]
      .filter((member) => Number(member.feastMonth ?? 0) > 0 && getDayValue(member.feastDay) > 0)
      .map((member) => {
        const month = Number(member.feastMonth ?? 0);
        const day = getDayValue(member.feastDay);
        const upcomingDate = new Date(today.getFullYear(), month - 1, day);
        const isPast = upcomingDate.getMonth() + 1 < todayMonth || (upcomingDate.getMonth() + 1 === todayMonth && upcomingDate.getDate() < todayDay);
        const normalizedDate = isPast ? new Date(today.getFullYear() + 1, month - 1, day) : upcomingDate;

        return {
          member,
          sortDate: normalizedDate,
          label: getUpcomingDateLabel(month, day),
        };
      })
      .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime())
      .slice(0, 5)
      .map(({ member, label }) => ({
        ...member,
        feastName: member.feastName || 'Feast day',
        feastDay: label,
      }));
  }, [members]);

  const upcoming = upcomingEvents.filter((e) => e.category !== 'birthday').slice(0, 4);
  const recent = members.slice(0, 4);


  return (
    <div className="anim-fade-up mx-auto w-full max-w-[880px] pb-4">
      {/* Header */}
      <header className="relative flex items-start gap-3 overflow-hidden border-b border-[color-mix(in_srgb,var(--c-gold)_30%,transparent)] px-4 pb-6 pt-[calc(18px+var(--safe-top))] md:px-6 [&>button:first-of-type]:-ml-2 [&>button:first-of-type]:-mt-2 [&>button:first-child]:text-primary dark:[&>button:first-child]:text-[#cdeee0]">
        <CmiHeaderArt />
        <HamburgerMenu />
        <div className="relative min-w-0 flex-1">
          <p className="text-[14px] font-medium text-primary">{t(greetKey)}</p>
          <p className="mt-0.5 break-words font-head text-[24px] font-semibold leading-tight text-ink">{name}</p>
          <p className="mt-1 text-[13px] text-ink2">{dateStr}</p>
          <span aria-hidden className="mt-3 block h-[2px] w-7 rounded-full bg-gold" />
        </div>
        <IconButton label="Notifications" className="relative shrink-0 rounded-full border border-[color-mix(in_srgb,var(--c-primary)_14%,var(--c-border))] bg-card shadow-[var(--shadow-sm)]">
          <Bell size={21} className="text-primary dark:text-[#cdeee0]" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-gold" />
        </IconButton>
      </header>

      <div className="mt-5 space-y-7 px-4 md:px-6">
        {/* Announcement */}
        <Card onClick={() => nav('/news/n1')} className="relative overflow-hidden border-emeraldd bg-gradient-to-br from-emerald to-emeraldd text-white">
          <span aria-hidden className="pointer-events-none absolute -right-12 -top-14 h-44 w-44 rounded-full border border-white/10" />
          <span aria-hidden className="pointer-events-none absolute -right-4 -top-6 h-24 w-24 rounded-full border border-gold/35" />
          <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-gold" />
          <div className="relative p-5 pl-6">
            <StatusChip tone="gold">{t('home.announcement')}</StatusChip>
            <h2 className="mt-3 font-head text-[21px] font-semibold leading-snug text-white">Saturday, 10 October 2026 – Jubilee Celebration at the Provincial House</h2>
            <span className="mt-4 inline-flex min-h-9 items-center gap-1 rounded-full bg-white/10 px-3.5 text-[13.5px] font-semibold text-gold">Read more <ChevronRight size={16} aria-hidden /></span>
          </div>
        </Card>



        {/* Birthdays */}
        <section>
          <SectionHeader title={t('home.birthdays')} action={t('common.viewAll')} onAction={() => nav('/events')} />
          {loading ? (
            <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 md:-mx-6 md:px-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="w-[130px] shrink-0 rounded-[18px] border border-line bg-card p-3.5">
                  <Skeleton className="mx-auto h-[56px] w-[56px] rounded-full" />
                  <Skeleton className="mx-auto mt-2 h-3.5 w-20" />
                  <Skeleton className="mx-auto mt-2 h-3 w-16" />
                </div>
              ))}
            </div>
          ) : error ? (
            <ErrorState title="Unable to load birthdays" body={error} />
          ) : (
            <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 md:-mx-6 md:px-6">
              {birthdays.map((m) => (
                <button key={m.id} onClick={() => nav(`/members/${m.id}`)}
                  className="press flex w-[130px] shrink-0 flex-col items-center gap-2 rounded-[18px] border border-line bg-card p-3.5 text-center shadow-[var(--shadow-sm)] hover:border-[color-mix(in_srgb,var(--c-primary)_28%,var(--c-border))] active:bg-card2">
                  <span className="rounded-full p-[2px] ring-1 ring-[color-mix(in_srgb,var(--c-gold)_45%,var(--c-border))]"><Avatar name={m.name} src={m.photo} size={56} /></span>
                  <p className="min-w-0 w-full overflow-hidden text-[13px] font-medium leading-tight text-ink [display:-webkit-box] [overflow-wrap:anywhere] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">{m.name.replace('Fr. ', '')}</p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-goldl px-2 py-0.5 text-[12px] font-semibold text-goldink"><Cake size={12} aria-hidden /> {m.birthday}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Feast days */}
        <section>
          <SectionHeader title={t('home.feastDays')} />
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 rounded-[var(--r-card)] border border-line bg-card p-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-10" />
                </div>
              ))}
            </div>
          ) : error ? (
            <ErrorState title="Unable to load feast days" body={error} />
          ) : (
            <div className="space-y-2">
              {feasts.slice(0, 3).map((m) => (
                <Card key={m.id} onClick={() => nav(`/members/${m.id}`)} className="flex min-h-[64px] items-center gap-3 p-3">
                  <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-goldl text-goldink"><Star size={19} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-medium text-ink">{m.feastName}</p>
                    <p className="truncate text-[13px] text-ink2">{m.name}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-[color-mix(in_srgb,var(--c-gold)_40%,var(--c-border))] px-2.5 py-1 text-[12px] font-semibold text-goldink">{m.feastDay}</span>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Upcoming events */}
        <section>
          <SectionHeader title={t('home.upcomingEvents')} action={t('common.viewAll')} onAction={() => nav('/events')} />
          <div className="grid gap-2.5 md:grid-cols-2">
            {upcoming.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </section>

        {/* Latest news */}
        {news.length > 0 && (
          <section>
            <SectionHeader title={t('home.latestNews')} action={t('common.viewAll')} onAction={() => nav('/news')} />
            <div className="grid gap-3 md:grid-cols-2">
              <NewsCard article={news[0]} />
              <div className="space-y-2.5">
                {news.slice(1, 4).map((a) => <NewsCard key={a.id} article={a} compact />)}
              </div>
            </div>
          </section>
        )}

        {/* Recently viewed */}
        <section>
          <SectionHeader title={t('home.recentlyViewed')} />
          <Card className="px-4 py-1">
            {recent.map((m, i) => (
              <div key={m.id} className={i > 0 ? 'border-t border-line' : ''}><MemberRow member={m} /></div>
            ))}
          </Card>
        </section>
      </div>
    </div>
  );
}
