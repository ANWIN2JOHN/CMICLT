import { supabase } from '../lib/supabase';

export interface DepartmentCouncilMember {
  id: string; // assignment id
  member_id: string;
  role: string;
  member: {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    photo_url: string | null;
  };
}

export async function getDepartmentCouncilMembers(departmentPlace: string): Promise<DepartmentCouncilMember[]> {
  const { data, error } = await supabase
    .from('member_assignments')
    .select(`
      id,
      member_id,
      role,
      member:members!inner (
        id,
        name,
        phone,
        email,
        photo_url
      )
    `)
    .is('to_date', null)
    .eq('place', departmentPlace);

  if (error) {
    throw error;
  }

  // Define sort order based on role
  const roleOrder: Record<string, number> = {
    'Provincial': 1,
    'Councillor': 2,
    'Consultor': 3,
    'Co-opted Member': 4
  };

  const members = (data ?? []) as unknown as DepartmentCouncilMember[];
  
  // Sort the members based on role
  members.sort((a, b) => {
    const orderA = roleOrder[a.role] || 99;
    const orderB = roleOrder[b.role] || 99;
    return orderA - orderB;
  });

  return members;
}
