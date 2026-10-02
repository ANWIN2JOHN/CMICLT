import { useEffect, useState } from 'react';
import { PhoneActionSheet, usePhoneAction } from '../../components/patterns/PhoneAction';
import { EmptyState, ErrorState } from '../../components/ui/states';
import {
  AdministrationMemberCard,
  AdministrationSectionHeading,
  AdministrationSkeletons,
  LeadershipScreen,
} from '../../components/patterns/AdministrationUI';
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
      <LeadershipScreen title={title}>
        <ErrorState 
          title="Unable to load members." 
          body="Please check your connection and try again."
        />
      </LeadershipScreen>
    );
  }

  if (loading) {
    return (
      <LeadershipScreen title={title}>
        <div className="pt-3"><AdministrationSkeletons count={3} /></div>
      </LeadershipScreen>
    );
  }

  if (data.length === 0) {
    return (
      <LeadershipScreen title={title}>
        <EmptyState title="No members available." />
      </LeadershipScreen>
    );
  }



  return (
    <LeadershipScreen title={title} description={`Members serving the ${title} department council.`}>
      <div className="pt-3">
        <AdministrationSectionHeading title="Council Members" detail={`${data.length} members`} />
        <div className="grid gap-3 md:grid-cols-2">
        {data.map((m) => {
          // Some members have multiple comma-separated phones/emails.
          // Fallback parsing just in case, though usually it's one string in the DB.
          // Wait, types.ts shows string for phone and email in Member, not array.
          // I will treat it as a string that might contain commas.
          const phones = m.member.phone ? m.member.phone.split(',').map(p => p.trim()).filter(Boolean) : [];
          const emails = m.member.email ? m.member.email.split(',').map(e => e.trim()).filter(Boolean) : [];

          return (
            <AdministrationMemberCard
              key={m.id}
              name={m.member.name}
              role={m.role}
              photo={m.member.photo_url || undefined}
              phones={phones}
              emails={emails}
              onPhone={handlePhoneTap}
            />
          );
        })}
        </div>
      </div>

      <PhoneActionSheet contactPhone={contactPhone} onClose={() => setContactPhone(null)} />
    </LeadershipScreen>
  );
}
