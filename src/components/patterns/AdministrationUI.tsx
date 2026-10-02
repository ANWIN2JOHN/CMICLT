import type { ComponentType, ReactNode } from "react";
import { ChevronRight, Landmark, Mail, MapPin, Phone } from "lucide-react";
import { Screen } from "../../layouts/AppShell";
import { Avatar, Card, Skeleton } from "../ui/primitives";
import { cn } from "../../lib/cn";

type Icon = ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;

export function LeadershipScreen({
  title,
  description = "Leadership, governance and administrative offices of the CMI congregation.",
  children,
  stacked = true,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  stacked?: boolean;
}) {
  return (
    <Screen
      back={!stacked}
      stacked={stacked}
      title={title}
      sectionLabel="Leadership & Administration"
      description={description}
      sectionIcon={<Landmark size={23} />}
    >
      {children}
    </Screen>
  );
}

export interface AdministrationMenuItem {
  label: string;
  to: string;
  icon: Icon;
  description?: string;
  meta?: string;
}

export function AdministrationMenu({
  items,
  onSelect,
  numbered = false,
}: {
  items: AdministrationMenuItem[];
  onSelect: (to: string) => void;
  numbered?: boolean;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item, index) => (
        <Card
          key={item.to}
          onClick={() => onSelect(item.to)}
          className="group relative min-h-[76px] overflow-hidden px-4 py-3 transition-[border-color,box-shadow] active:border-primary md:min-h-[88px] md:px-5 md:py-4"
        >
          <div className="flex h-full items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-emeraldl text-emerald dark:text-primary">
              <item.icon size={22} strokeWidth={1.9} />
              {numbered && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-card bg-gold px-1 text-[10px] font-bold text-emeraldd">
                  {index + 1}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-head text-[16px] font-semibold leading-tight text-ink">{item.label}</p>
              {item.description && <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-snug text-ink2">{item.description}</p>}
              {item.meta && <p className="mt-1 text-[12px] font-semibold uppercase tracking-wide text-primary">{item.meta}</p>}
            </div>
            <span className="-mr-2 flex h-11 w-9 shrink-0 items-center justify-center rounded-full text-ink2/60 transition-colors group-hover:text-primary group-active:text-primary">
              <ChevronRight size={18} strokeWidth={1.75} />
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function AdministrationSectionHeading({
  title,
  detail,
  badge = true,
}: {
  title: string;
  detail?: string;
  badge?: boolean;
}) {
  if (badge) {
    return (
      <div className="mb-4 px-1 pt-2">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
          <span aria-hidden className="h-px w-4 bg-gold" />Administration
        </p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <h2 className="min-w-0 font-head text-[20px] font-semibold leading-tight text-ink">{title}</h2>
          {detail && <span className="shrink-0 rounded-full border border-[color-mix(in_srgb,var(--c-gold)_45%,var(--c-border))] bg-goldl px-3 py-1 text-[12px] font-semibold tabular-nums text-goldink">{detail}</span>}
        </div>
      </div>
    );
  }
  return (
    <div className="mb-3 flex items-end justify-between gap-3 px-1 pt-1">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Administration</p>
        <h2 className="mt-0.5 font-head text-[19px] font-semibold text-ink">{title}</h2>
      </div>
      {detail && <p className="pb-0.5 text-[12px] text-ink2">{detail}</p>}
    </div>
  );
}

export function AdministrationMemberCard({
  name,
  role,
  photo,
  phones = [],
  emails = [],
  address,
  onPhone,
}: {
  name: string;
  role?: string | null;
  photo?: string;
  phones?: string[];
  emails?: string[];
  address?: string | null;
  onPhone: (phone: string, name: string) => void;
}) {
  return (
    <Card className="@container overflow-hidden p-0">
      <div className="h-1 bg-gradient-to-r from-emerald via-primary to-gold" />
      <div className="p-4 md:p-5">
        <div className="flex items-start gap-4">
          <Avatar name={name} src={photo} size={64} />
          <div className="min-w-0 flex-1 pt-0.5">
            <h3 className="font-head text-[17px] font-semibold leading-snug text-ink">{name}</h3>
            {role && <p className="mt-0.5 text-[13px] font-semibold leading-snug text-primary">{role}</p>}
            {address && (
              <p className="mt-2 flex items-start gap-2 whitespace-pre-line text-[13px] leading-relaxed text-ink2">
                <MapPin size={15} className="mt-0.5 shrink-0" />
                {address}
              </p>
            )}
          </div>
        </div>
        {(phones.length > 0 || emails.length > 0) && (
          <div className="mt-4 grid gap-2 border-t border-line pt-3 @[30rem]:grid-cols-2">
            {phones.map((phone, index) => (
              <button
                key={`${phone}-${index}`}
                onClick={() => onPhone(phone, name)}
                className="press flex min-h-11 w-full items-center gap-2.5 rounded-[12px] bg-card2 px-3 text-left text-[13px] font-medium text-ink active:text-primary"
                aria-label={`Call ${name} at ${phone}`}
              >
                <Phone size={16} className="shrink-0 text-primary" />
                <span className="truncate">{phone}</span>
              </button>
            ))}
            {emails.map((email, index) => (
              <a
                key={`${email}-${index}`}
                href={`mailto:${email}`}
                className="press flex min-h-11 items-center gap-2.5 rounded-[12px] bg-card2 px-3 text-[13px] font-medium text-ink active:text-primary"
                aria-label={`Email ${name} at ${email}`}
              >
                <Mail size={16} className="shrink-0 text-primary" />
                <span className="truncate">{email}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

export function AdministrationSkeletons({ count = 4, compact = false }: { count?: number; compact?: boolean }) {
  return (
    <div className={cn("grid gap-3", compact && "md:grid-cols-2")}>
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className={compact ? "h-24 w-full" : "h-36 w-full"} />
      ))}
    </div>
  );
}
