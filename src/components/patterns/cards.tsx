import { Cake, CalendarDays, ChevronRight, MapPin, Sparkles, Star, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CmiEvent, EventCategory, Institution, Member, NewsArticle } from '../../data/types';
import { Avatar, Card, StatusChip } from '../ui/primitives';
import { cn } from '../../lib/cn';

export function MemberCard({ member }: { member: Member }) {
  const nav = useNavigate();
  return (
    <Card onClick={() => nav(`/members/${member.id}`)} className="flex items-start gap-3.5 p-3.5">
      <div className="shrink-0">
        <Avatar name={member.name} src={member.photo} size={54} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p className="min-w-0 flex-1 break-words font-medium text-ink">{member.name}</p>
          <ChevronRight size={18} className="mt-0.5 shrink-0 text-ink2" />
        </div>
        <p className="break-words text-[14px] text-ink2">{member.role}</p>
        <p className="mt-0.5 break-words text-[13px] text-ink2/80">{member.house}</p>
        <div className="mt-1.5">
          <StatusChip tone="primary">{member.zone}</StatusChip>
        </div>
      </div>
    </Card>
  );
}

export function MemberRow({ member }: { member: Member }) {
  const nav = useNavigate();
  return (
    <button onClick={() => nav(`/members/${member.id}`)} className="press flex w-full items-center gap-3 py-2.5 text-left">
      <Avatar name={member.name} src={member.photo} size={44} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium text-ink">{member.name}</p>
        <p className="truncate text-[13px] text-ink2">{member.role}</p>
      </div>
      <ChevronRight size={18} className="text-ink2" />
    </button>
  );
}

const catIcon: Record<EventCategory, typeof Cake> = {
  birthday: Cake, feast: Star, province: CalendarDays, anniversary: Sparkles, jubilee: Trophy,
};
const catTone: Record<EventCategory, string> = {
  birthday: 'text-emerald2 bg-emeraldl', feast: 'text-gold bg-goldl',
  province: 'text-emerald bg-emeraldl', anniversary: 'text-emerald2 bg-emeraldl', jubilee: 'text-gold bg-goldl',
};

export function EventCard({ event }: { event: CmiEvent }) {
  const nav = useNavigate();
  const Icon = catIcon[event.category];
  const d = new Date(event.date);
  return (
    <Card onClick={() => nav(`/events/${event.id}`)} className="flex items-stretch gap-3.5 p-3.5">
      <div className={cn('flex w-14 shrink-0 flex-col items-center justify-center rounded-[16px]', catTone[event.category])}>
        <span className="text-[11px] font-semibold uppercase">{d.toLocaleString('en', { month: 'short' })}</span>
        <span className="font-head text-[22px] font-bold leading-none">{d.getDate()}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-ink2">
          <Icon size={13} /> <span className="capitalize">{event.category}</span>
        </div>
        <p className="mt-0.5 line-clamp-2 font-medium text-ink">{event.title}</p>
        {event.location && (
          <p className="mt-1 flex items-center gap-1 truncate text-[13px] text-ink2"><MapPin size={12} /> {event.location}</p>
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
        <img src={article.image} alt="" className="h-[72px] w-[72px] shrink-0 rounded-[14px] object-cover" />
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
      <img src={article.image} alt="" className="h-44 w-full object-cover" />
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
      <Card onClick={() => nav(`/institutions/${inst.id}`)} className="flex items-center gap-3.5 p-3.5">
        <img src={inst.photo || instImg} alt="" className="h-14 w-14 shrink-0 rounded-[14px] object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-ink">{inst.name}</p>
          <p className="mt-0.5 flex items-center gap-1 truncate text-[13px] text-ink2"><MapPin size={12} /> {inst.zone}</p>
        </div>
        <ChevronRight size={18} className="text-ink2" />
      </Card>
    );
  }
  return (
    <Card onClick={() => nav(`/institutions/${inst.id}`)} className="overflow-hidden">
      <img src={inst.photo || instImg} alt="" className="h-32 w-full object-cover" />
      <div className="p-3.5">
        <p className="line-clamp-2 font-medium leading-snug text-ink">{inst.name}</p>
        <p className="mt-1 flex items-center gap-1 truncate text-[13px] text-ink2"><MapPin size={12} /> {inst.zone}</p>
      </div>
    </Card>
  );
}
