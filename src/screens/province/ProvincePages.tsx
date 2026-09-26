import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Quote } from 'lucide-react';
import { Screen } from '../../layouts/AppShell';
import { Card, Avatar, SectionHeader, StatusChip } from '../../components/ui/primitives';
import { EventCard, MemberRow, NewsCard } from '../../components/patterns/cards';
import { EmptyState } from '../../components/ui/states';
import { useLocale } from '../../contexts/LocaleContext';
import { supabase } from '../../lib/supabase';
import { getMembers } from '../../services/memberService';
import type { CmiEvent, Leader, Member, NewsArticle } from '../../data/types';

export function ProvinceHome() {
  const { t } = useLocale();
  const nav = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<CmiEvent[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [leadership, setLeadership] = useState<Leader[]>([]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [memberRows, { data: eventRows, error: eventError }, { data: newsRows, error: newsError }, { data: leaderRows, error: leaderError }] = await Promise.all([
          getMembers(),
          supabase.from('events').select('*').order('event_date', { ascending: true }).limit(2),
          supabase.from('news_articles').select('*').eq('status', 'published').order('published_date', { ascending: false }).limit(5),
          supabase.from('leaders').select('*').order('sort_order', { ascending: true }),
        ]);

        if (eventError || newsError || leaderError) {
          throw eventError ?? newsError ?? leaderError;
        }

        if (!active) return;

        setMembers(memberRows);
        setEvents((eventRows ?? []).map((row) => ({
          id: row.id,
          title: row.title,
          category: row.category,
          date: row.event_date,
          time: row.event_time ?? undefined,
          location: row.location ?? undefined,
          description: row.description ?? undefined,
        })));
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
        setLeadership((leaderRows ?? []).map((row) => ({
          id: row.id,
          name: row.name,
          role: row.role,
          note: row.note ?? '',
          photo: row.photo_url ?? undefined,
        })));
      } catch {
        if (!active) return;
        setMembers([]);
        setEvents([]);
        setNews([]);
        setLeadership([]);
      }
    }

    void load();
    return () => { active = false; };
  }, []);

  return (
    <Screen back title={t('more.provinceHome')}>
      {/* Editorial hero */}
      <div className="relative overflow-hidden rounded-[var(--r-card)]" style={{ background: 'linear-gradient(135deg,#0d684f,#064e3b)' }}>
        <img src="https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1000&q=60" alt="" className="h-44 w-full object-cover opacity-35" />
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <h1 className="font-head text-[26px] font-bold leading-tight text-white">{t('tagline')}</h1>
          <p className="mt-1 text-[14px] text-white/80">{t('provinceName')}</p>
        </div>
      </div>

      <p className="mt-5 text-[15px] leading-relaxed text-ink">
        The CMI St. Thomas Province Calicut is a vibrant community of Carmelites of Mary Immaculate, serving the people
        of God through education, healthcare, social service and pastoral ministry across Kerala, Tamil Nadu and overseas missions.
      </p>

      <div className="mt-6 space-y-7">
        {news.length > 0 && (
          <section>
            <SectionHeader title={t('home.latestNews')} action={t('common.viewAll')} onAction={() => nav('/news')} />
            <NewsCard article={news[0]} />
          </section>
        )}
        {events.length > 0 && (
          <section>
            <SectionHeader title={t('home.upcomingEvents')} action={t('common.viewAll')} onAction={() => nav('/events')} />
            <div className="space-y-2.5">{events.slice(0, 2).map((e) => <EventCard key={e.id} event={e} />)}</div>
          </section>
        )}

        {leadership.length > 0 && (
          <Card className="bg-emeraldd p-5 text-white">
            <SectionHeader title={t('province.provincialDesk')} />
            <div className="-mt-1 flex items-center gap-3">
              <Avatar name={leadership[0].name} size={52} />
              <div>
                <p className="font-medium">{leadership[0].name}</p>
                <p className="text-[13px] text-white/70">{leadership[0].role}</p>
              </div>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-white/85">
              “Dear brothers and friends, let us continue to be instruments of God’s love, rooted in prayer and reaching
              out in generous service to all whom we are called to serve.”
            </p>
          </Card>
        )}

        <Card className="border-gold/30 bg-goldl p-5">
          <div className="flex items-center gap-2 text-gold"><Quote size={18} /><span className="text-[13px] font-semibold uppercase tracking-wide">{t('province.spiritualQuote')}</span></div>
          <p className="mt-2 font-head text-[18px] italic leading-relaxed text-ink">“Do not waste even a single moment, for time lost is never regained.”</p>
          <p className="mt-2 text-[13px] text-ink2">— St. Kuriakose Elias Chavara</p>
        </Card>

        {members.length > 0 && (
          <section>
            <SectionHeader title={t('home.birthdays')} />
            <Card className="px-4 py-1">
              {members.slice(0, 4).map((m, i) => (
                <div key={m.id} className={i > 0 ? 'border-t border-line' : ''}><MemberRow member={m} /></div>
              ))}
            </Card>
          </section>
        )}
      </div>
    </Screen>
  );
}

export function About() {
  const { t } = useLocale();
  const sections = [
    { title: t('province.intro'), body: 'Established as a distinct province, CMICLT continues the Carmelite charism of contemplation and apostolic action, founded on the vision of St. Kuriakose Elias Chavara.' },
    { title: t('about.history'), body: 'From the first monastery at Mananchira, the province has grown over seven decades into a network of communities, schools, hospitals and mission stations, faithfully responding to the needs of the times.' },
    { title: t('about.founder'), body: 'St. Kuriakose Elias Chavara (1805–1871) co-founded the first indigenous religious congregation for men in India. A pioneer of education, printing and social reform, he lived a life of profound holiness and service.' },
    { title: t('about.mission'), body: 'To proclaim the Gospel through a life of prayer and community, and to serve the poor, the young and the marginalised through education, healthcare, social action and pastoral care.' },
    { title: t('about.heritage'), body: 'Grounded in the Carmelite tradition of Mary Immaculate, the province cherishes contemplative prayer, devotion to the Eucharist, and wholehearted commitment to the mission of the Church.' },
  ];
  return (
    <Screen back title={t('more.about')}>
      <img src="https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1000&q=60" alt="" className="h-44 w-full rounded-[var(--r-card)] object-cover" />
      <ol className="relative mt-6 ml-1 border-l-2 border-line pl-6">
        {sections.map((s, i) => (
          <li key={i} className="relative pb-7 last:pb-0">
            <span className="absolute -left-[31px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald text-[12px] font-bold text-white">{i + 1}</span>
            <h2 className="font-head text-[19px] font-semibold text-ink">{s.title}</h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink2">{s.body}</p>
          </li>
        ))}
      </ol>
    </Screen>
  );
}

export function Administration() {
  const { t } = useLocale();
  const { id } = useParams();
  const nav = useNavigate();
  const [leadership, setLeadership] = useState<Leader[]>([]);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data, error } = await supabase.from('leaders').select('*').order('sort_order', { ascending: true });
      if (!active) return;
      if (error) {
        setLeadership([]);
        return;
      }

      setLeadership((data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        role: row.role,
        note: row.note ?? '',
        photo: row.photo_url ?? undefined,
      })));
    }

    void load();
    return () => { active = false; };
  }, []);

  if (id) {
    const l = leadership.find((x) => x.id === id);
    if (!l) return <Screen back title={t('more.administration')}><EmptyState title="Not found" /></Screen>;
    return (
      <Screen back title={l.role}>
        <div className="flex flex-col items-center pt-2 text-center">
          <Avatar name={l.name} size={104} />
          <h1 className="mt-4 font-head text-[23px] font-semibold text-ink">{l.name}</h1>
          <StatusChip tone="gold">{l.role}</StatusChip>
        </div>
        <p className="mt-5 text-center text-[15px] leading-relaxed text-ink2">{l.note}</p>
      </Screen>
    );
  }
  return (
    <Screen back title={t('more.administration')}>
      <p className="text-[15px] text-ink2">The leadership team guiding the province.</p>
      <div className="mt-4 grid gap-2.5 md:grid-cols-2">
        {leadership.map((l) => (
          <Card key={l.id} onClick={() => nav(`/administration/${l.id}`)} className="flex items-center gap-3.5 p-3.5">
            <Avatar name={l.name} size={54} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">{l.name}</p>
              <p className="truncate text-[13px] text-primary">{l.role}</p>
              <p className="mt-0.5 truncate text-[12px] text-ink2">{l.note}</p>
            </div>
            <ChevronRight size={18} className="text-ink2" />
          </Card>
        ))}
      </div>
    </Screen>
  );
}
