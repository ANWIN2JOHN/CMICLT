import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building, ChevronRight, Mail, Phone, Globe, MapPin } from 'lucide-react';
import { Screen } from '../../layouts/AppShell';
import { Card, Avatar, Skeleton } from '../../components/ui/primitives';
import { PhoneActionSheet, usePhoneAction } from '../../components/patterns/PhoneAction';
import { Button } from '../../components/ui/Button';
import { EmptyState, ErrorState } from '../../components/ui/states';
import { getProvincialAdministrations } from '../../services/provincialAdministrationService';
import type { ProvincialAdministration } from '../../data/types';

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
      <Screen back title="Provincial Administrations">
        <ErrorState 
          title="Unable to load provincial administrations." 
          body="Please check your connection and try again."
        />
      </Screen>
    );
  }

  if (loading) {
    return (
      <Screen back title="Provincial Administrations">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </Screen>
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
      <Screen back title="Provincial Administrations">
        <EmptyState title="No provincial administrations available." />
      </Screen>
    );
  }

  return (
    <Screen back title="Provincial Administrations">
      <div className="space-y-3">
        {provinces.map((p) => (
          <Card 
            key={p.province_name} 
            onClick={() => nav(`/provincial-administrations/${encodeURIComponent(p.province_name)}`)}
            className="flex flex-col gap-2 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emeraldl text-emerald">
                  <Building size={20} />
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-ink">{p.province_name}</h3>
                  {p.province_address && (
                    <p className="text-[13px] text-ink2 line-clamp-1">{p.province_address}</p>
                  )}
                </div>
              </div>
              <ChevronRight size={18} className="text-ink2 shrink-0" />
            </div>
          </Card>
        ))}
      </div>
    </Screen>
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
      <Screen back title={decodedName}>
        <ErrorState 
          title="Unable to load provincial administration." 
          body="Please check your connection and try again."
        />
      </Screen>
    );
  }

  if (loading) {
    return (
      <Screen back title={decodedName}>
        <div className="space-y-3">
          <Skeleton className="h-24 w-full mb-4" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      </Screen>
    );
  }

  const provinceMembers = data.filter(m => m.province_name === decodedName);

  if (provinceMembers.length === 0) {
    return (
      <Screen back title={decodedName}>
        <EmptyState title="No provincial administration available." />
      </Screen>
    );
  }

  const p = provinceMembers[0];



  return (
    <Screen back title={decodedName}>
      <Card className="p-5 mb-5 space-y-3">
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
            className="flex items-center gap-2.5 text-ink2 active:text-primary press text-left"
          >
            <Phone size={18} className="shrink-0" />
            <span className="text-[14px]">{p.province_phone}</span>
          </button>
        )}
        {p.province_email && (
          <a 
            href={`mailto:${p.province_email}`}
            className="flex items-center gap-2.5 text-ink2 active:text-primary press"
          >
            <Mail size={18} className="shrink-0" />
            <span className="text-[14px] break-all">{p.province_email}</span>
          </a>
        )}
        {p.province_website && (
          <a 
            href={p.province_website.startsWith('http') ? p.province_website : `https://${p.province_website}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-primary press"
          >
            <Globe size={18} className="shrink-0" />
            <span className="text-[14px]">{p.province_website}</span>
          </a>
        )}
      </Card>

      <div className="space-y-3">
        {provinceMembers.map((m) => (
          <Card key={m.id} className="p-4">
            <div className="flex items-start gap-4">
              <Avatar name={m.member_name} src={m.photo_url || undefined} size={64} />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-ink text-[16px]">{m.member_name}</h3>
                <p className="text-primary font-medium text-[13px]">{m.designation}</p>
                
                <div className="mt-3 space-y-2">
                  {m.mobile_numbers && m.mobile_numbers.map((phone, i) => phone ? (
                    <button 
                      key={i} 
                      onClick={() => handlePhoneTap(phone, m.member_name)}
                      className="flex items-center gap-2 text-ink2 active:text-primary press w-full text-left"
                      aria-label={`Call ${m.member_name} at ${phone}`}
                    >
                      <Phone size={15} className="shrink-0" />
                      <span className="text-[14px]">{phone}</span>
                    </button>
                  ) : null)}
                  
                  {m.email_addresses && m.email_addresses.map((email, i) => email ? (
                    <a 
                      key={i} 
                      href={`mailto:${email}`}
                      className="flex items-center gap-2 text-ink2 active:text-primary press w-full"
                      aria-label={`Email ${m.member_name} at ${email}`}
                    >
                      <Mail size={15} className="shrink-0" />
                      <span className="text-[14px] break-all">{email}</span>
                    </a>
                  ) : null)}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <PhoneActionSheet contactPhone={contactPhone} onClose={() => setContactPhone(null)} />
    </Screen>
  );
}
