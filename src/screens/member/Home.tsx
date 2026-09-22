import { useNavigate } from 'react-router-dom';
import { Bell, CalendarDays, Cake, ChevronRight, Landmark, Search, Star, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { members } from '../../data/members';
import { events, news } from '../../data/content';
import { Avatar, Card, SectionHeader, StatusChip } from '../../components/ui/primitives';
import { EventCard, MemberRow, NewsCard } from '../../components/patterns/cards';
import { IconButton } from '../../components/ui/Button';

export function Home() {
  const { t } = useLocale();
  const { user } = useAuth();
  const nav = useNavigate();
  const hour = new Date().getHours();
  const greetKey = hour < 12 ? 'home.goodMorning' : hour < 17 ? 'home.goodAfternoon' : 'home.goodEvening';
  const name = user?.name ?? 'Fr. John';
  const dateStr = new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' });

  const birthdays = [...members].sort((a, b) => a.birthMonth - b.birthMonth).slice(0, 6);
  const feasts = [...members].sort((a, b) => a.feastMonth - b.feastMonth).slice(0, 5);
  const upcoming = events.filter((e) => e.category !== 'birthday').slice(0, 4);
  const recent = members.slice(10, 14);

  const quick = [
    { label: t('home.findMember'), icon: Search, to: '/members' },
    { label: t('nav.events'), icon: CalendarDays, to: '/events' },
    { label: t('nav.institutions'), icon: Landmark, to: '/institutions' },
    { label: t('home.myProfile'), icon: User, to: '/account' },
  ];

  return (
    <div className="anim-fade-up mx-auto w-full max-w-[880px] pb-4">
      {/* Header */}
      <header className="flex items-start gap-3 px-4 pt-[calc(18px+var(--safe-top))] md:px-6">
        <div className="min-w-0 flex-1">
          <p className="text-[14px] text-ink2">{t(greetKey)}</p>
          <p className="mt-0.5 truncate font-head text-[24px] font-semibold leading-tight text-ink">{name}</p>
          <p className="mt-1 text-[13px] text-ink2">{dateStr}</p>
        </div>
        <IconButton label="Notifications" className="relative shrink-0">
          <Bell size={22} className="text-ink" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-gold" />
        </IconButton>
      </header>

      <div className="mt-4 space-y-7 px-4 md:px-6">
        {/* Announcement */}
        <Card onClick={() => nav('/news/n1')} className="overflow-hidden bg-gradient-to-br from-emerald to-emeraldd text-white">
          <div className="p-5">
            <StatusChip tone="gold">{t('home.announcement')}</StatusChip>
            <h2 className="mt-3 font-head text-[21px] font-semibold leading-snug text-white">Province celebrates 70 years of service in Malabar</h2>
            <p className="mt-1.5 text-[14px] text-white/85">A thanksgiving Eucharist marked seven decades of service across the region.</p>
            <span className="mt-3 inline-flex items-center gap-1 text-[14px] font-medium text-gold">Read more <ChevronRight size={16} /></span>
          </div>
        </Card>

        {/* Quick actions */}
        <section>
          <SectionHeader title={t('home.quickActions')} />
          <div className="grid grid-cols-4 gap-2.5">
            {quick.map((q) => (
              <button key={q.label} onClick={() => nav(q.to)}
                className="press flex flex-col items-center gap-2 rounded-[18px] border border-line bg-card p-3 active:bg-card2">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emeraldl text-emerald"><q.icon size={21} /></span>
                <span className="text-center text-[11.5px] font-medium leading-tight text-ink">{q.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Birthdays */}
        <section>
          <SectionHeader title={t('home.birthdays')} action={t('common.viewAll')} onAction={() => nav('/events')} />
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 md:-mx-6 md:px-6">
            {birthdays.map((m) => (
              <button key={m.id} onClick={() => nav(`/members/${m.id}`)}
                className="press flex w-[130px] shrink-0 flex-col items-center gap-2 rounded-[18px] border border-line bg-card p-3.5 text-center active:bg-card2">
                <Avatar name={m.name} size={56} />
                <p className="line-clamp-2 text-[13px] font-medium leading-tight text-ink">{m.name.replace('Fr. ', '')}</p>
                <span className="inline-flex items-center gap-1 text-[12px] text-gold"><Cake size={13} /> {m.birthday}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Feast days */}
        <section>
          <SectionHeader title={t('home.feastDays')} />
          <div className="space-y-2">
            {feasts.slice(0, 3).map((m) => (
              <Card key={m.id} onClick={() => nav(`/members/${m.id}`)} className="flex items-center gap-3 p-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-goldl text-gold"><Star size={19} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-medium text-ink">{m.feastName}</p>
                  <p className="truncate text-[13px] text-ink2">{m.name}</p>
                </div>
                <span className="text-[13px] font-medium text-ink2">{m.feastDay}</span>
              </Card>
            ))}
          </div>
        </section>

        {/* Upcoming events */}
        <section>
          <SectionHeader title={t('home.upcomingEvents')} action={t('common.viewAll')} onAction={() => nav('/events')} />
          <div className="grid gap-2.5 md:grid-cols-2">
            {upcoming.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </section>

        {/* Latest news */}
        <section>
          <SectionHeader title={t('home.latestNews')} action={t('common.viewAll')} onAction={() => nav('/news')} />
          <div className="grid gap-3 md:grid-cols-2">
            <NewsCard article={news[1]} />
            <div className="space-y-2.5">
              {news.slice(2, 5).map((a) => <NewsCard key={a.id} article={a} compact />)}
            </div>
          </div>
        </section>

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
