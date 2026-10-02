import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building, ChevronRight, Mail, Phone, Globe, MapPin } from 'lucide-react';
import { Card } from '../../components/ui/primitives';
import { PhoneActionSheet, usePhoneAction } from '../../components/patterns/PhoneAction';
import { EmptyState, ErrorState } from '../../components/ui/states';
import { getProvincialAdministrations } from '../../services/provincialAdministrationService';
import type { ProvincialAdministration } from '../../data/types';
import {
  AdministrationMemberCard,
  AdministrationSectionHeading,
  AdministrationSkeletons,
  LeadershipScreen,
} from '../../components/patterns/AdministrationUI';

export function ProvincialAdministrations() {
  const nav = useNavigate();
  const [data, setData] = useState<ProvincialAdministration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const rows = await getProvincialAdministrations();
        if (!active) return;
        setData(rows);
        setLoading(false);
      } catch (err) {
        if (!active) return;
        console.error(err);
        setError(true);
        setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, []);

  if (error) {
    return (
      <LeadershipScreen title="CMI Provincial Administrations">
        <ErrorState 
          title="Unable to load provincial administrations." 
          body="Please check your connection and try again."
        />
      </LeadershipScreen>
    );
  }

  if (loading) {
    return (
      <LeadershipScreen title="CMI Provincial Administrations">
        <div className="pt-3"><AdministrationSkeletons compact /></div>
      </LeadershipScreen>
    );
  }

  // Group by province_name, preserve order based on the first item's display_order
  const provinces = data.reduce((acc, current) => {
    const existing = acc.find(p => p.province_name === current.province_name);
    if (!existing) {
      acc.push({
        province_name: current.province_name,
        province_address: current.province_address,
        display_order: current.display_order
      });
    }
    return acc;
  }, [] as { province_name: string, province_address: string | null, display_order: number }[]);

  if (provinces.length === 0) {
    return (
      <LeadershipScreen title="CMI Provincial Administrations">
        <EmptyState title="No provincial administrations available." />
      </LeadershipScreen>
    );
  }

  return (
    <LeadershipScreen
      title="CMI Provincial Administrations"
      description="Provincial leadership and office contacts across the CMI congregation."
    >
      <div className="pt-1">
        <div className="mb-3 flex items-center gap-3 px-1">
          <span className="h-px w-6 bg-gold" aria-hidden />
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink2">
            {provinces.length} {provinces.length === 1 ? 'Province' : 'Provinces'}
          </p>
          <span className="h-px flex-1 bg-line" aria-hidden />
        </div>
        <ul className="grid gap-2.5 md:grid-cols-2 md:gap-3">
          {provinces.map((province) => {
            const to = `/provincial-administrations/${encodeURIComponent(province.province_name)}`;
            return (
              <li key={to}>
                <button
                  type="button"
                  onClick={() => nav(to)}
                  className="group relative flex min-h-[88px] w-full items-center gap-4 overflow-hidden rounded-[18px] border border-line bg-card p-4 text-left shadow-[0_1px_2px_rgba(15,40,30,0.04)] transition-[border-color,box-shadow,transform] duration-150 ease-out hover:border-emerald/30 hover:shadow-[0_4px_14px_-6px_rgba(15,60,45,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-[0.99] active:bg-card2 md:p-5"
                >
                  <span className="absolute inset-y-4 left-0 w-[3px] rounded-r-full bg-gold opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden />
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-emeraldl text-emerald ring-1 ring-inset ring-emerald/10 dark:text-primary dark:ring-primary/20">
                    <Building size={21} strokeWidth={1.7} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-head text-[16px] font-semibold leading-snug tracking-[-0.005em] text-ink">
                      {province.province_name}
                    </span>
                    <span className="mt-1 block text-[13px] leading-[1.5] text-ink2">
                      {province.province_address || 'View provincial administration'}
                    </span>
                  </span>
                  <span className="flex h-11 w-8 shrink-0 items-center justify-end text-ink2/60 transition-[color,transform] duration-150 group-hover:translate-x-0.5 group-hover:text-primary">
                    <ChevronRight size={18} strokeWidth={1.75} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </LeadershipScreen>
  );
}

export function ProvincialAdministrationDetail() {
  const { provinceName } = useParams();
  const [data, setData] = useState<ProvincialAdministration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { contactPhone, setContactPhone, handlePhoneTap } = usePhoneAction();

  const decodedName = provinceName ? decodeURIComponent(provinceName) : '';

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const rows = await getProvincialAdministrations();
        if (!active) return;
        setData(rows);
        setLoading(false);
      } catch (err) {
        if (!active) return;
        console.error(err);
        setError(true);
        setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, []);

  if (error) {
    return (
      <LeadershipScreen title={decodedName}>
        <ErrorState 
          title="Unable to load provincial administration." 
          body="Please check your connection and try again."
        />
      </LeadershipScreen>
    );
  }

  if (loading) {
    return (
      <LeadershipScreen title={decodedName}>
        <div className="pt-3"><AdministrationSkeletons count={4} /></div>
      </LeadershipScreen>
    );
  }

  const provinceMembers = data.filter(m => m.province_name === decodedName);

  if (provinceMembers.length === 0) {
    return (
      <LeadershipScreen title={decodedName}>
        <EmptyState title="No provincial administration available." />
      </LeadershipScreen>
    );
  }

  const p = provinceMembers[0];



  return (
    <LeadershipScreen title={decodedName} description={`Provincial office and council contacts for ${decodedName}.`}>
      <div className="pt-3">
      <Card className="mb-5 space-y-1 p-5">
        <h2 className="text-[18px] font-semibold text-ink">{p.province_name}</h2>
        {p.province_address && (
          <div className="flex items-start gap-2.5 text-ink2">
            <MapPin size={18} className="shrink-0 mt-0.5" />
            <span className="text-[14px] leading-relaxed">{p.province_address}</span>
          </div>
        )}
        {p.province_phone && (
          <button 
            onClick={() => handlePhoneTap(p.province_phone!, p.province_name)}
            className="flex min-h-[44px] items-center gap-2.5 text-ink2 active:text-primary press text-left"
          >
            <Phone size={18} className="shrink-0" />
            <span className="text-[14px]">{p.province_phone}</span>
          </button>
        )}
        {p.province_email && (
          <a 
            href={`mailto:${p.province_email}`}
            className="flex min-h-[44px] items-center gap-2.5 text-ink2 active:text-primary press"
          >
            <Mail size={18} className="shrink-0" />
            <span className="text-[14px] break-all">{p.province_email}</span>
          </a>
        )}
        {p.province_website && (
          <a 
            href={p.province_website.startsWith('http') ? p.province_website : `https://${p.province_website}`}
            target="_blank" rel="noopener noreferrer"
            className="flex min-h-[44px] items-center gap-2.5 text-primary press"
          >
            <Globe size={18} className="shrink-0" />
            <span className="text-[14px]">{p.province_website}</span>
          </a>
        )}
      </Card>

      <AdministrationSectionHeading title="Provincial Council" detail={`${provinceMembers.length} members`} />
      <div className="grid gap-3 md:grid-cols-2">
        {provinceMembers.map((m) => (
          <AdministrationMemberCard
            key={m.id}
            name={m.member_name}
            role={m.designation}
            photo={m.photo_url || undefined}
            phones={(m.mobile_numbers || []).filter(Boolean)}
            emails={(m.email_addresses || []).filter(Boolean)}
            onPhone={handlePhoneTap}
          />
        ))}
      </div>
      </div>

      <PhoneActionSheet contactPhone={contactPhone} onClose={() => setContactPhone(null)} />
    </LeadershipScreen>
  );
}
