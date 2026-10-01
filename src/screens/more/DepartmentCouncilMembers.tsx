import { useEffect, useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { Screen } from '../../layouts/AppShell';
import { Card, Avatar, Skeleton } from '../../components/ui/primitives';
import { Button } from '../../components/ui/Button';
import { PhoneActionSheet, usePhoneAction } from '../../components/patterns/PhoneAction';
import { EmptyState, ErrorState } from '../../components/ui/states';
import { getDepartmentCouncilMembers, DepartmentCouncilMember } from '../../services/cmiDepartmentCouncilService';

interface DepartmentCouncilMembersProps {
  departmentPlace: string;
  title: string;
}

export function DepartmentCouncilMembers({ departmentPlace, title }: DepartmentCouncilMembersProps) {
  const [data, setData] = useState<DepartmentCouncilMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { contactPhone, setContactPhone, handlePhoneTap } = usePhoneAction();

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError(false);
        const rows = await getDepartmentCouncilMembers(departmentPlace);
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
  }, [departmentPlace]);

  if (error) {
    return (
      <Screen back title={title}>
        <ErrorState 
          title="Unable to load members." 
          body="Please check your connection and try again."
        />
      </Screen>
    );
  }

  if (loading) {
    return (
      <Screen back title={title}>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      </Screen>
    );
  }

  if (data.length === 0) {
    return (
      <Screen back title={title}>
        <EmptyState title="No members available." />
      </Screen>
    );
  }



  return (
    <Screen back title={title}>
      <div className="space-y-3">
        {data.map((m) => {
          // Some members have multiple comma-separated phones/emails.
          // Fallback parsing just in case, though usually it's one string in the DB.
          // Wait, types.ts shows string for phone and email in Member, not array.
          // I will treat it as a string that might contain commas.
          const phones = m.member.phone ? m.member.phone.split(',').map(p => p.trim()).filter(Boolean) : [];
          const emails = m.member.email ? m.member.email.split(',').map(e => e.trim()).filter(Boolean) : [];

          return (
            <Card key={m.id} className="p-4">
              <div className="flex items-start gap-4">
                <Avatar name={m.member.name} src={m.member.photo_url || undefined} size={64} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-ink text-[16px]">{m.member.name}</h3>
                  <p className="text-primary font-medium text-[13px]">{m.role}</p>
                  
                  <div className="mt-3 space-y-2">
                    {phones.map((phone, i) => (
                      <button 
                        key={`phone-${i}`} 
                        onClick={() => handlePhoneTap(phone, m.member.name)}
                        className="flex items-center gap-2 text-ink2 active:text-primary press w-full text-left"
                        aria-label={`Call ${m.member.name} at ${phone}`}
                      >
                        <Phone size={15} className="shrink-0" />
                        <span className="text-[14px]">{phone}</span>
                      </button>
                    ))}
                    
                    {emails.map((email, i) => (
                      <a 
                        key={`email-${i}`} 
                        href={`mailto:${email}`}
                        className="flex items-center gap-2 text-ink2 active:text-primary press w-full"
                        aria-label={`Email ${m.member.name} at ${email}`}
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

      <PhoneActionSheet contactPhone={contactPhone} onClose={() => setContactPhone(null)} />
    </Screen>
  );
}
