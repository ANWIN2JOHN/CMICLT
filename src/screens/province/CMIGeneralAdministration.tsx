import { useEffect, useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { Screen } from '../../layouts/AppShell';
import { Card, Avatar, Skeleton } from '../../components/ui/primitives';
import { BottomSheet } from '../../components/ui/overlays';
import { Button } from '../../components/ui/Button';
import { EmptyState, ErrorState } from '../../components/ui/states';
import { getCMIGeneralAdministration } from '../../services/cmiGeneralAdministrationService';
import type { CMIGeneralAdministration } from '../../data/types';

export function CMIGeneralAdministrationScreen() {
  const [data, setData] = useState<CMIGeneralAdministration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [contactPhone, setContactPhone] = useState<{ number: string, name: string } | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const rows = await getCMIGeneralAdministration();
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
      <Screen back title="CMI General Administration">
        <ErrorState 
          title="Unable to load administration data." 
          body="Please check your connection and try again."
        />
      </Screen>
    );
  }

  if (loading) {
    return (
      <Screen back title="CMI General Administration">
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
      <Screen back title="CMI General Administration">
        <EmptyState title="No general administration members available." />
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
      const cleanNumber = contactPhone.number.replace(/\\D/g, '');
      window.location.href = `https://wa.me/${cleanNumber}`;
      setContactPhone(null);
    }
  };

  return (
    <Screen back title="CMI General Administration">
      <div className="mb-4 text-center">
        <h2 className="text-[14px] font-medium tracking-wide text-ink2 uppercase">General Administration 2026</h2>
      </div>

      <div className="space-y-3">
        {data.map((m) => (
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

      <BottomSheet 
        open={contactPhone !== null} 
        onClose={() => setContactPhone(null)}
        title={contactPhone ? contactPhone.name : ''}
      >
        <div className="space-y-3 pt-2">
          <Button fullWidth onClick={handleCall}>
            Call {contactPhone?.number}
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
