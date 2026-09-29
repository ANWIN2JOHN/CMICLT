import { useEffect, useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { Screen } from '../../layouts/AppShell';
import { Card, Skeleton } from '../../components/ui/primitives';
import { BottomSheet } from '../../components/ui/overlays';
import { Button } from '../../components/ui/Button';
import { EmptyState, ErrorState } from '../../components/ui/states';
import { getCmiExternalAdministrations } from '../../services/cmiExternalAdministrationService';
import type { CmiExternalAdministration } from '../../data/types';

interface CmiExternalAdministrationListProps {
  category: 'COORDINATOR_ABROAD' | 'REGIONAL' | 'SUBREGIONAL';
  title: string;
}

export function CmiExternalAdministrationList({ category, title }: CmiExternalAdministrationListProps) {
  const [data, setData] = useState<CmiExternalAdministration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [contactPhone, setContactPhone] = useState<{ number: string, name: string } | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError(false);
        const rows = await getCmiExternalAdministrations(category);
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
  }, [category]);

  if (error) {
    return (
      <Screen back title={title}>
        <ErrorState 
          title="Unable to load data." 
          body="Please check your connection and try again."
        />
      </Screen>
    );
  }

  if (loading) {
    return (
      <Screen back title={title}>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      </Screen>
    );
  }

  if (data.length === 0) {
    return (
      <Screen back title={title}>
        <EmptyState title="No records available." />
      </Screen>
    );
  }

  const handlePhoneTap = (number: string, name: string) => {
    setContactPhone({ number, name });
  };

  const handleCall = () => {
    if (contactPhone) {
      window.location.href = `tel:${contactPhone.number.replace(/\\s+/g, '')}`;
      setContactPhone(null);
    }
  };

  const handleWhatsApp = () => {
    if (contactPhone) {
      const cleanNumber = contactPhone.number.replace(/[\\s()\\-]/g, '');
      window.location.href = `https://wa.me/${cleanNumber}`;
      setContactPhone(null);
    }
  };

  return (
    <Screen back title={title}>
      <div className="space-y-3">
        {data.map((m) => {
          const primaryName = m.member_name || m.title;
          const showTitle = m.member_name && m.title && m.title !== m.designation;

          return (
            <Card key={m.id} className="p-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-ink text-[16px]">{primaryName}</h3>
                {m.designation && (
                  <p className="text-primary font-medium text-[14px] mt-0.5">{m.designation}</p>
                )}
                {showTitle && (
                  <p className="text-ink2 font-medium text-[13px] mt-1">{m.title}</p>
                )}
                {m.address && (
                  <p className="text-ink2 text-[13px] mt-1.5 whitespace-pre-line">{m.address}</p>
                )}
                
                <div className="mt-3 space-y-2">
                  {m.mobile_numbers && m.mobile_numbers.map((phone, i) => phone ? (
                    <button 
                      key={`phone-${i}`} 
                      onClick={() => handlePhoneTap(phone, primaryName)}
                      className="flex items-center gap-2 text-ink2 active:text-primary press w-full text-left"
                      aria-label={`Call ${primaryName} at ${phone}`}
                    >
                      <Phone size={15} className="shrink-0" />
                      <span className="text-[14px]">{phone}</span>
                    </button>
                  ) : null)}
                  
                  {m.email_addresses && m.email_addresses.map((email, i) => email ? (
                    <a 
                      key={`email-${i}`} 
                      href={`mailto:${email}`}
                      className="flex items-center gap-2 text-ink2 active:text-primary press w-full"
                      aria-label={`Email ${primaryName} at ${email}`}
                    >
                      <Mail size={15} className="shrink-0" />
                      <span className="text-[14px] break-all">{email}</span>
                    </a>
                  ) : null)}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <BottomSheet 
        open={contactPhone !== null} 
        onClose={() => setContactPhone(null)}
        title={contactPhone ? contactPhone.name : ''}
      >
        <div className="space-y-3 pt-2">
          <Button fullWidth onClick={handleCall}>
            Call
          </Button>
          <Button fullWidth variant="outline" onClick={handleWhatsApp}>
            WhatsApp
          </Button>
          <Button fullWidth variant="outline" onClick={() => setContactPhone(null)}>
            Cancel
          </Button>
        </div>
      </BottomSheet>
    </Screen>
  );
}
