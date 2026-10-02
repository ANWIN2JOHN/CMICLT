import { Cake, CalendarDays, ChevronRight, MapPin, Sparkles, Star, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CmiEvent, EventCategory, Institution, Member, NewsArticle } from '../../data/types';
import { Avatar, Card, StatusChip } from '../ui/primitives';
import { cn } from '../../lib/cn';

// Display-only: all-caps names from the directory read as shouting; render them in
// natural case. Tokens with dots (initials like "K.J.") stay uppercase; mixed-case
// names are left untouched. Stored data is never modified.
export function displayName(name: string) {
  if (name !== name.toUpperCase() || !/[A-Z]{3}/.test(name)) return name;
  return name.split(/(\s+)/).map((w) => {
    if (/^FR\.?$/.test(w)) return w.replace('FR', 'Fr');
    if (w.includes('.') || w.length <= 1) return w;
    return w.charAt(0) + w.slice(1).toLowerCase();
  }).join('');
}

export function MemberCard({ member }: { member: Member }) {
  const nav = useNavigate();
  return (
    <Card onClick={() => nav(`/members/${member.id}`)} className="group relative flex min-h-[88px] items-center gap-4 overflow-hidden rounded-[20px] border-[color-mix(in_srgb,var(--c-primary)_13%,var(--c-border))] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--c-emerald-light)_55%,var(--c-card))_0%,var(--c-card)_38%)] py-3.5 pl-[18px] pr-2 shadow-[0_2px_10px_-6px_rgba(8,72,59,0.18)] outline-none transition-[border-color,box-shadow,transform,background-color] duration-150 hover:border-[color-mix(in_srgb,var(--c-primary)_30%,var(--c-border))] hover:shadow-[0_8px_22px_-12px_rgba(8,72,59,0.32)] active:scale-[0.99] active:bg-card2 focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-[var(--c-ring)] motion-reduce:transition-none motion-reduce:active:scale-100 md:min-h-[92px]">
      <span aria-hidden className="absolute bottom-5 left-0 top-5 w-[3px] rounded-r-full bg-primary/70" />
      <span className="shrink-0 rounded-full bg-card p-[3px] ring-1 ring-[color-mix(in_srgb,var(--c-gold)_45%,var(--c-border))] shadow-[0_0_0_4px_color-mix(in_srgb,var(--c-emerald-light)_70%,transparent)]">
        <Avatar name={member.name} src={member.photo} size={60} />
      </span>
      <p className="min-w-0 flex-1 break-words text-[17px] font-semibold leading-snug tracking-[-0.01em] text-ink">{displayName(member.name)}</p>
      <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emeraldl text-primary/70 transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:text-primary group-active:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
          <ChevronRight size={17} strokeWidth={2} />
        </span>
      </span>
    </Card>
  );
}

export function MemberRow({ member }: { member: Member }) {
  const nav = useNavigate();
  return (
    <button onClick={() => nav(`/members/${member.id}`)} className="press flex min-h-[60px] w-full items-center gap-3 py-2.5 text-left">
      <Avatar name={member.name} src={member.photo} size={44} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-ink">{displayName(member.name)}</p>
        <p className="truncate text-[13px] text-ink2">{member.role}</p>
      </div>
      <ChevronRight size={18} strokeWidth={1.75} className="shrink-0 text-ink2/60" />
    </button>
  );
}

const catIcon: Record<EventCategory, typeof Cake> = {
  birthday: Cake, feast: Star, province: CalendarDays, anniversary: Sparkles, jubilee: Trophy,
};
const catTone: Record<EventCategory, string> = {
  birthday: 'text-emerald2 bg-emeraldl', feast: 'text-goldink bg-goldl',
  province: 'text-emerald bg-emeraldl', anniversary: 'text-emerald2 bg-emeraldl', jubilee: 'text-goldink bg-goldl',
};

export function EventCard({ event }: { event: CmiEvent }) {
  const nav = useNavigate();
  const Icon = catIcon[event.category];
  const d = new Date(event.date);
  return (
    <Card onClick={() => nav(`/events/${event.id}`)} className="flex min-w-0 items-stretch gap-3.5 overflow-hidden p-3.5 pr-4">
      <div className={cn('flex w-14 shrink-0 flex-col items-center justify-center rounded-[16px]', catTone[event.category])}>
        <span className="text-[11px] font-semibold uppercase tracking-wide">{d.toLocaleString('en', { month: 'short' })}</span>
        <span className="font-head text-[22px] font-bold leading-none">{d.getDate()}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-ink2">
          <Icon size={13} /> <span className="capitalize">{event.category}</span>
        </div>
        <p className="mt-0.5 line-clamp-2 font-semibold leading-snug text-ink">{event.title}</p>
        {event.location && (
          <p className="mt-1 flex min-w-0 items-start gap-1 text-[13px] leading-snug text-ink2"><MapPin size={12} className="mt-[3px] shrink-0" /><span className="min-w-0 line-clamp-2 [overflow-wrap:anywhere]">{event.location}</span></p>
        )}
      </div>
    </Card>
  );
}

export function NewsCard({ article, compact }: { article: NewsArticle; compact?: boolean }) {
  const nav = useNavigate();
  if (compact) {
    return (
      <Card onClick={() => nav(`/news/${article.id}`)} className="flex gap-3 overflow-hidden p-3">
        <img src={article.image} alt="" className="h-[72px] w-[72px] shrink-0 rounded-[12px] bg-card2 object-cover" />
        <div className="min-w-0 flex-1">
          <span className="text-[12px] font-semibold text-primary">{article.category}</span>
          <p className="mt-0.5 line-clamp-2 text-[15px] font-medium leading-snug text-ink">{article.headline}</p>
          <p className="mt-1 text-[12px] text-ink2">{new Date(article.date).toLocaleDateString('en', { day: 'numeric', month: 'short' })}</p>
        </div>
      </Card>
    );
  }
  return (
    <Card onClick={() => nav(`/news/${article.id}`)} className="overflow-hidden">
      <img src={article.image} alt="" className="h-44 w-full bg-card2 object-cover md:h-52" />
      <div className="p-4">
        <span className="text-[12px] font-semibold text-primary">{article.category}</span>
        <h3 className="mt-1 font-head text-[19px] font-semibold leading-snug text-ink">{article.headline}</h3>
        <p className="mt-1.5 line-clamp-2 text-[14px] text-ink2">{article.summary}</p>
        <p className="mt-2.5 text-[12px] text-ink2">{new Date(article.date).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
    </Card>
  );
}

const instImg = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=60';
export function InstitutionCard({ inst, list }: { inst: Institution; list?: boolean }) {
  const nav = useNavigate();
  if (list) {
    return (
      <Card onClick={() => nav(`/institutions/${inst.id}`)} className="flex min-h-[84px] items-center gap-3.5 rounded-[18px] py-3 pl-3 pr-1.5">
        <img src={inst.photo_url ?? inst.photo ?? instImg} alt="" className="h-16 w-16 shrink-0 rounded-[14px] bg-card2 object-cover" />
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 font-semibold leading-snug text-ink">{inst.name}</p>
          {inst.zone && <p className="mt-1 flex items-center gap-1 text-[12.5px] text-ink2"><MapPin size={12} aria-hidden className="shrink-0 text-primary" /><span className="truncate">{inst.zone}</span></p>}
        </div>
        <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center text-ink2/50"><ChevronRight size={18} strokeWidth={1.75} /></span>
      </Card>
    );
  }
  return (
    <Card onClick={() => nav(`/institutions/${inst.id}`)} className="group flex flex-col overflow-hidden rounded-[18px]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-card2">
        <img src={inst.photo_url ?? inst.photo ?? instImg} alt="" className="h-full w-full object-cover transition-transform duration-150 group-hover:scale-[1.02] motion-reduce:transition-none" />
        {inst.category && <span className="absolute left-2 top-2 max-w-[calc(100%-16px)] truncate rounded-full bg-emeraldd/85 px-2.5 py-1 text-[11px] font-semibold capitalize text-white">{inst.category}</span>}
      </div>
      <div className="flex flex-1 flex-col p-3.5">
        <p className="line-clamp-2 text-[15px] font-semibold leading-snug text-ink">{inst.name}</p>
        {inst.zone && <p className="mt-auto flex items-center gap-1 pt-1.5 text-[12.5px] text-ink2"><MapPin size={12} aria-hidden className="shrink-0 text-goldink" /><span className="truncate">{inst.zone}</span></p>}
      </div>
    </Card>
  );
}
