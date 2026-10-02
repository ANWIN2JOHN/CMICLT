import { useEffect, useState } from 'react';
import { PhoneActionSheet, usePhoneAction } from '../../components/patterns/PhoneAction';
import { EmptyState, ErrorState } from '../../components/ui/states';
import {
  AdministrationMemberCard,
  AdministrationSectionHeading,
  AdministrationSkeletons,
  LeadershipScreen,
} from '../../components/patterns/AdministrationUI';
import { getStThomasAdministrationMembers, type AdminMember } from '../../services/memberService';

export function StThomasAdministration() {
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
      <LeadershipScreen title="St. Thomas Province Administration">
        <ErrorState 
          title="Unable to load provincial administration." 
          body="Please check your connection and try again."
        />
      </LeadershipScreen>
    );
  }



  return (
    <LeadershipScreen
      title="St. Thomas Province Administration"
      description="Provincial leadership serving St. Thomas Province, Kozhikode."
    >
      <div className="pt-3">
        <AdministrationSectionHeading title="Provincial Council" detail="2026" />
      {loading ? (
        <AdministrationSkeletons />
      ) : members.length === 0 ? (
        <EmptyState title="No administration members found." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {members.map((m) => {
            const phones = m.phone.split(',').map(p => p.trim()).filter(Boolean);
            const emails = m.email.split(',').map(e => e.trim()).filter(Boolean);

            return (
              <AdministrationMemberCard
                key={m.id}
                name={m.name}
                role={m.position}
                photo={m.photo_url || undefined}
                phones={phones}
                emails={emails}
                onPhone={handlePhoneTap}
              />
            );
          })}
        </div>
      )}
      </div>

      <PhoneActionSheet contactPhone={contactPhone} onClose={() => setContactPhone(null)} />
    </LeadershipScreen>
  );
}
