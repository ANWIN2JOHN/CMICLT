import { useNavigate, useParams } from 'react-router-dom';
import {
  BookOpen, Briefcase, Building, Building2, ChevronRight, Church, ClipboardList,
  Cross, Globe, GraduationCap, History, Info, ListOrdered, Map, MapPin, Network,
  UserRound, Users, Users2,
} from 'lucide-react';
import { Screen } from '../../layouts/AppShell';
import { Card } from '../../components/ui/primitives';
import { EmptyState } from '../../components/ui/states';

/**
 * Grouped "CMI Information" categories for the More menu. Each category opens a
 * reusable secondary list page; individual items open a shared content page that
 * shows the existing empty-state until real content is wired in. Some items link
 * to existing screens via an optional `to`.
 */
export interface CategoryItem {
  label: string;
  icon: any;
  to?: string;
}
export interface Category {
  slug: string;
  title: string;
  icon: any;
  items: CategoryItem[];
}

export const MORE_CATEGORIES: Category[] = [
  {
    slug: 'leadership',
    title: 'Leadership & Administration',
    icon: Users2,
    items: [
      { label: 'CMI General Administration', icon: Network },
      { label: 'St. Thomas Province Administration', icon: Building2 },
      { label: 'CMI Provincial Administrations', icon: Building },
      { label: 'Coordinators Abroad, Regional & Sub-regional Superiors', icon: Users },
      { label: 'Department Councils', icon: Users2 },
      { label: 'Zones of St. Thomas Province', icon: Map },
      { label: 'Kristu Raja Sub-Region', icon: MapPin },
    ],
  },
  {
    slug: 'church',
    title: 'Church & Dioceses',
    icon: Church,
    items: [
      { label: 'CMI Dioceses', icon: Church },
      { label: 'CMI Bishops', icon: UserRound },
      { label: 'Dioceses in the Province Territory', icon: Map },
    ],
  },
  {
    slug: 'houses',
    title: 'Houses & Institutions',
    icon: Building2,
    items: [
      { label: 'Common Houses & Institutions', icon: Building2 },
      { label: 'CMI Houses & Institutions Abroad', icon: Globe },
      { label: 'Status of the Houses & Title of the Heads', icon: ClipboardList },
    ],
  },
  {
    slug: 'formation',
    title: 'Members & Formation',
    icon: GraduationCap,
    items: [
      { label: 'Scholastics', icon: GraduationCap },
      { label: 'Members Under Formation', icon: BookOpen },
      { label: 'Members Working/Studying in India', icon: Briefcase },
      { label: 'Members under Prior General', icon: Users },
      { label: 'Members Abroad', icon: Globe },
      { label: 'Seniority List of Members', icon: ListOrdered },
      { label: 'Our Departed Members', icon: Cross },
    ],
  },
  {
    slug: 'province-info',
    title: 'Province Information',
    icon: BookOpen,
    items: [
      { label: 'History of Provincial Administration', icon: History },
      { label: 'About the Province', icon: Info, to: '/about' },
    ],
  },
];

export function categoryBySlug(slug?: string) {
  return MORE_CATEGORIES.find((c) => c.slug === slug);
}

export function MoreCategory() {
  const nav = useNavigate();
  const { section } = useParams();
  const cat = categoryBySlug(section);

  if (!cat) return <Screen back title="Not found"><EmptyState title="Section not available" /></Screen>;

  return (
    <Screen back title={cat.title}>
      <Card className="overflow-hidden p-0">
        {cat.items.map((it, i) => (
          <button key={it.label} onClick={() => nav(it.to ?? `${i}`)}
            className={`press flex w-full items-center gap-3.5 px-4 py-4 text-left active:bg-card2 ${i > 0 ? 'border-t border-line' : ''}`}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emeraldl text-emerald"><it.icon size={20} /></span>
            <span className="flex-1 text-[15px] font-medium leading-snug text-ink">{it.label}</span>
            <ChevronRight size={18} className="shrink-0 text-ink2" />
          </button>
        ))}
      </Card>
    </Screen>
  );
}

export function MoreCategoryItem() {
  const { section, item } = useParams();
  const cat = categoryBySlug(section);
  const entry = cat?.items[Number(item)];

  return (
    <Screen back title={entry?.label ?? cat?.title ?? 'Information'}>
      <EmptyState icon={<BookOpen size={28} />} title="No information available yet"
        body="This section will be updated with content soon." />
    </Screen>
  );
}
