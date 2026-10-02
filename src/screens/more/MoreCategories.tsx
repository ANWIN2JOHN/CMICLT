import { useNavigate, useParams } from 'react-router-dom';
import {
  BookOpen, Briefcase, Building, Building2, ChevronRight, Church, ClipboardList,
  Cross, Globe, GraduationCap, History, Info, ListOrdered, Map, MapPin, Network,
  UserRound, Users, Users2,
} from 'lucide-react';
import { Screen } from '../../layouts/AppShell';
import { Card } from '../../components/ui/primitives';
import { EmptyState } from '../../components/ui/states';
import { AdministrationMenu, LeadershipScreen } from '../../components/patterns/AdministrationUI';

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
      { label: 'CMI General Administration', icon: Network, to: '/cmi-general-administration' },
      { label: 'St. Thomas Province Administration', icon: Building2, to: '/st-thomas-administration' },
      { label: 'CMI Provincial Administrations', icon: Building, to: '/provincial-administrations' },
      { label: 'Coordinators Abroad, Regionals and Subregionals', icon: Users, to: '/more/leadership/external-administrations' },
      { label: 'Department Councils', icon: Users2, to: '/more/leadership/department-councils' },
      { label: 'Zones of St. Thomas Province', icon: Map, to: '/more/leadership/zones' },
      { label: 'Kristu Raja Sub-Region, Jammu-Kashmir', icon: MapPin, to: '/more/leadership/kristu-raja-sub-region' },
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

  if (!cat) return <Screen back title="Not found"><EmptyState title="Section not available" body="This section may have been removed or is no longer available." /></Screen>;

  if (cat.slug === 'leadership') {
    const descriptions: Record<string, string> = {
      '/cmi-general-administration': 'The Prior General and General Council of the congregation.',
      '/st-thomas-administration': 'Provincial leadership of St. Thomas Province, Kozhikode.',
      '/provincial-administrations': 'Browse CMI provincial leadership across regions.',
      '/more/leadership/external-administrations': 'International coordinators, regional and subregional leadership.',
      '/more/leadership/department-councils': 'Councils supporting the province’s ministries and mission.',
      '/more/leadership/zones': 'Administrative zones, coordinators and member houses.',
      '/more/leadership/kristu-raja-sub-region': 'Mission leadership and centers in Jammu-Kashmir.',
    };

    return (
      <LeadershipScreen
        stacked
        title={cat.title}
        description="Explore the people, councils and regional structures serving the CMI congregation."
      >
        <div className="pt-1">
          <AdministrationMenu
            numbered
            items={cat.items.map((item) => ({
              label: item.label,
              to: item.to!,
              icon: item.icon,
              description: descriptions[item.to!],
            }))}
            onSelect={nav}
          />
        </div>
      </LeadershipScreen>
    );
  }

  return (
    <Screen stacked title={cat.title} sectionLabel="CMI Information" sectionIcon={<cat.icon size={23} />}
      description={`${cat.items.length} sections in ${cat.title}.`}>
      <Card className="mt-1 overflow-hidden rounded-[20px] p-0">
        {cat.items.map((it, i) => (
          <button key={it.label} onClick={() => nav(it.to ?? `${i}`)}
            className={`group press flex min-h-[68px] w-full items-center gap-3.5 py-2.5 pl-3.5 pr-2.5 text-left outline-none hover:bg-card2/60 active:bg-card2 focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--c-ring)] ${i > 0 ? 'border-t border-line' : ''}`}>
            <span aria-hidden className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[14px] bg-emeraldl text-emerald"><it.icon size={21} strokeWidth={1.75} /></span>
            <span className="min-w-0 flex-1 break-words text-[15.5px] font-semibold leading-snug text-ink">{it.label}</span>
            <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-card2 text-ink2/70 transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:text-goldink motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"><ChevronRight size={16} strokeWidth={2} /></span>
            </span>
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
