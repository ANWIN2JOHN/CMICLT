import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Screen } from '../../layouts/AppShell';
import { Card, Avatar, Skeleton } from '../../components/ui/primitives';
import { PhoneActionSheet, usePhoneAction } from '../../components/patterns/PhoneAction';
import { Button } from '../../components/ui/Button';
import { EmptyState, ErrorState } from '../../components/ui/states';
import { getStThomasAdministrationMembers, type AdminMember } from '../../services/memberService';
import { useLocale } from '../../contexts/LocaleContext';

export function StThomasAdministration() {
  const { t } = useLocale();
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { contactPhone, setContactPhone, handlePhoneTap } = usePhoneAction();

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const rows = await getStThomasAdministrationMembers();
        if (!active) return;
        setMembers(rows);
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
      <Screen back title="Provincial Administration">
        <ErrorState 
          title="Unable to load provincial administration." 
          body="Please check your connection and try again."
        />
      </Screen>
    );
  }



  return (
    <Screen back title="Provincial Administration">
      <div className="mb-5 px-1 text-center">
        <h1 className="font-head text-[20px] font-semibold text-ink leading-tight uppercase">
          St. Thomas Province, Kozhikode
        </h1>
        <p className="mt-1 text-[15px] font-medium text-primary uppercase tracking-wide">
          Provincial Administration 2026
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <EmptyState title="No administration members found." />
      ) : (
        <div className="space-y-3">
          {members.map((m) => {
            const phones = m.phone.split(',').map(p => p.trim()).filter(Boolean);
            const emails = m.email.split(',').map(e => e.trim()).filter(Boolean);

            return (
              <Card key={m.id} className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar name={m.name} src={m.photo_url || undefined} size={64} />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-ink text-[16px]">{m.name}</h3>
                    <p className="text-primary font-medium text-[13px]">{m.position}</p>
                    
                    <div className="mt-3 space-y-2">
                      {phones.map((phone, i) => (
                        <button 
                          key={i} 
                          onClick={() => handlePhoneTap(phone, m.name)}
                          className="flex items-center gap-2 text-ink2 active:text-primary press w-full text-left"
                          aria-label={`Call ${m.name} at ${phone}`}
                        >
                          <Phone size={15} className="shrink-0" />
                          <span className="text-[14px]">{phone}</span>
                        </button>
                      ))}
                      
                      {emails.map((email, i) => (
                        <a 
                          key={i} 
                          href={`mailto:${email}`}
                          className="flex items-center gap-2 text-ink2 active:text-primary press w-full"
                          aria-label={`Email ${m.name} at ${email}`}
                        >
                          <Mail size={15} className="shrink-0" />
                          <span className="text-[14px] break-all">{email}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <PhoneActionSheet contactPhone={contactPhone} onClose={() => setContactPhone(null)} />
    </Screen>
  );
}
