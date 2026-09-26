import { supabase } from '../lib/supabase';
import type { Assignment, HouseListEntry, Institution, Member, MemberInstitutionAssignment } from '../data/types';

export interface MemberInstitutionRecord {
  id: string;
  member_id: string;
  institution_id: string;
  position: string | null;
  institution?: {
    id: string;
    name: string;
    entity_type?: string | null;
    parent_institution_id?: string | null;
    category: string | null;
    zone: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    established_year: number | null;
    residents: number | null;
    photo_url: string | null;
  } | null;
}

export interface MemberWithInstitutions extends Member {
  recordical_name?: string | null;
  institutions: Array<{
    id: string;
    name: string;
    category: string | null;
    zone: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    established_year: number | null;
    residents: number | null;
    photo?: string;
    position: string | null;
  }>;
}

interface MemberRow {
  id: string;
  name: string;
  role: string;
  house: string | null;
  institution_id: string | null;
  zone: string | { name?: string | null } | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  birthday: string | null;
  feast_month: number | null;
  feast_day: number | null;
  feast_name: string | null;
  diocese: string | { code?: string | null } | null;
  parish: string | { name?: string | null } | null;
  profession_date: string | null;
  ordination_date: string | null;
  photo_url: string | null;
  member_category_id: string | null;
  recordical_name: string | null;
  diocese_id: string | null;
  parish_id: string | null;
  address: string | null;
  zone_id: string | null;
  archived_at?: string | null;
}

interface InstitutionRow {
  id: string;
  name: string;
  category: string | null;
  zone: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  established_year: number | null;
  residents: number | null;
  photo_url: string | null;
  head_member_id: string | null;
  entity_type?: string | null;
  parent_institution_id?: string | null;
}

function formatDateDisplay(value: string | null | undefined): string {
  if (!value) return '';

  const next = new Date(`${value}T00:00:00`);
  if (Number.isNaN(next.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(next);
}

function monthFromDate(value: string | null | undefined): number {
  if (!value) return 0;

  const month = Number(value.slice(5, 7));
  return Number.isNaN(month) ? 0 : month;
}

function formatFeastDate(month: number | null | undefined, day: number | null | undefined): string {
  if (!month || !day) {
    return '';
  }

  const next = new Date(2000, month - 1, day);

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(next);
}

function readLookupName(value: string | { name?: string | null } | null | undefined): string {
  if (typeof value === 'string') return value;
  return value?.name ?? '';
}

function readLookupCode(value: string | { code?: string | null } | null | undefined): string {
  if (typeof value === 'string') return value;
  return value?.code ?? '';
}

function mapInstitutionRow(row: InstitutionRow): Institution {
  return {
    id: row.id,
    name: row.name,
    category: (row.category ?? 'house') as Institution['category'],
    zone: (row.zone ?? 'Calicut') as Institution['zone'],
    address: row.address ?? '',
    phone: row.phone ?? '',
    email: row.email ?? '',
    year: row.established_year ?? 0,
    apostolates: [],
    head: '',
    residents: row.residents ?? 0,
    photo: row.photo_url ?? undefined,
    entityType: row.entity_type ?? undefined,
    parentInstitutionId: row.parent_institution_id ?? null,
  };
}

function mapMemberRow(row: MemberRow): Member {
  const birthday = row.birthday ?? '';
  const feastMonth = row.feast_month ?? 0;
  const feastDay = row.feast_day ?? 0;

  return {
    id: row.id,
    name: row.name,
    role: row.role,
    house: row.house ?? '',
    institution: undefined,
    address: row.address ?? '',
    zone: readLookupName(row.zone) as Member['zone'],
    country: row.country ?? '',
    phone: row.phone ?? '',
    email: row.email ?? '',
    birthday: formatDateDisplay(birthday),
    birthMonth: monthFromDate(birthday),
    feastDay: formatFeastDate(feastMonth, feastDay),
    feastMonth,
    feastName: row.feast_name ?? undefined,
    diocese: readLookupCode(row.diocese),
    parish: readLookupName(row.parish),
    professionDate: row.profession_date ?? '',
    ordinationDate: row.ordination_date ?? '',
    photo: row.photo_url ?? undefined,
    assignments: [],
  };
}

function mapInstitutionLink(record: MemberInstitutionRecord): {
  id: string;
  name: string;
  category: string | null;
  zone: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  established_year: number | null;
  residents: number | null;
  photo?: string;
  position: string | null;
} {
  const institution = record.institution;

  return {
    id: institution?.id ?? record.institution_id,
    name: institution?.name ?? '',
    category: institution?.category ?? null,
    zone: institution?.zone ?? null,
    address: institution?.address ?? null,
    phone: institution?.phone ?? null,
    email: institution?.email ?? null,
    established_year: institution?.established_year ?? null,
    residents: institution?.residents ?? null,
    photo: institution?.photo_url ?? undefined,
    position: record.position ?? null,
  };
}

export async function getMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select(`
      id,
      name,
      role,
      house,
      institution_id,
      country,
      phone,
      email,
      birthday,
      feast_month,
      feast_day,
      feast_name,
      diocese_id,
      parish_id,
      address,
      zone_id,
      photo_url,
      member_category_id,
      recordical_name,
      profession_date,
      ordination_date,
      archived_at,
      diocese:dioceses ( code ),
      parish:parishes ( name ),
      zone:zones ( name )
    `)
    .is('archived_at', null)
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapMemberRow(row as MemberRow));
}

export async function searchMembers(query: string): Promise<Member[]> {
  const trimmed = query.trim();

  if (!trimmed) {
    return getMembers();
  }

  const searchTerm = `%${trimmed}%`;

  const { data, error } = await supabase
    .from('members')
    .select(`
      id,
      name,
      role,
      house,
      institution_id,
      country,
      phone,
      email,
      birthday,
      feast_month,
      feast_day,
      feast_name,
      diocese_id,
      parish_id,
      address,
      zone_id,
      photo_url,
      member_category_id,
      recordical_name,
      profession_date,
      ordination_date,
      archived_at,
      diocese:dioceses ( code ),
      parish:parishes ( name ),
      zone:zones ( name )
    `)
    .is('archived_at', null)
    .or(
      `name.ilike.${searchTerm},recordical_name.ilike.${searchTerm},phone.ilike.${searchTerm},email.ilike.${searchTerm},address.ilike.${searchTerm}`,
    )
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapMemberRow(row as MemberRow));
}

export async function getMemberById(id: string): Promise<MemberWithInstitutions | null> {
  const { data, error } = await supabase
    .from('members')
    .select(`
      id,
      name,
      role,
      house,
      institution_id,
      country,
      phone,
      email,
      birthday,
      feast_month,
      feast_day,
      feast_name,
      diocese_id,
      parish_id,
      address,
      zone_id,
      photo_url,
      member_category_id,
      recordical_name,
      profession_date,
      ordination_date,
      archived_at,
      diocese:dioceses ( code ),
      parish:parishes ( name ),
      zone:zones ( name )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const member = mapMemberRow(data as MemberRow);
  const [institutions, assignments] = await Promise.all([
    getMemberAssignments(id),
    getMemberAssignmentHistory(id),
  ]);

  return {
    ...member,
    institutions: institutions.map((assignment) => ({
      id: assignment.institution?.id ?? assignment.institution_id,
      name: assignment.institution?.name ?? '',
      category: assignment.institution?.category ?? null,
      zone: assignment.institution?.zone ?? null,
      address: assignment.institution?.address ?? null,
      phone: assignment.institution?.phone ?? null,
      email: assignment.institution?.email ?? null,
      established_year: assignment.institution?.established_year ?? null,
      residents: assignment.institution?.residents ?? null,
      photo: assignment.institution?.photo_url ?? undefined,
      position: assignment.position ?? null,
    })),
    assignments,
  };
}

export async function getMemberAssignmentHistory(memberId: string): Promise<Assignment[]> {
  const { data, error } = await supabase
    .from('member_assignments')
    .select(`
      role,
      place,
      from_date,
      to_date
    `)
    .eq('member_id', memberId)
    .order('from_date', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => ({
    role: row.role ?? '',
    place: row.place ?? '',
    from: row.from_date ? row.from_date.slice(0, 4) : '',
    to: row.to_date ? row.to_date.slice(0, 4) : null,
  }));
}

export async function getMemberAssignments(memberId: string): Promise<MemberInstitutionAssignment[]> {
  const { data, error } = await supabase
    .from('member_institutions')
    .select(`
      id,
      member_id,
      institution_id,
      position,
      institution:institutions (
        id,
        name,
        entity_type,
        parent_institution_id,
        category,
        zone,
        address,
        phone,
        email,
        established_year,
        residents,
        photo_url
      )
    `)
    .eq('member_id', memberId)
    .order('position', { ascending: true, nullsFirst: false });

  if (error) {
    throw error;
  }

  const records = (data ?? []) as unknown as Array<{
    id: string;
    member_id: string;
    institution_id: string;
    position: string | null;
    institution?: Array<{
      id: string;
      name: string;
      entity_type?: string | null;
      parent_institution_id?: string | null;
      category?: string | null;
      zone?: string | null;
      address?: string | null;
      phone?: string | null;
      email?: string | null;
      established_year?: number | null;
      residents?: number | null;
      photo_url?: string | null;
    }> | null;
  }>;

  return records
    .map((record) => {
      const institution = Array.isArray(record.institution) ? record.institution[0] ?? null : record.institution ?? null;

      return {
        id: record.id,
        member_id: record.member_id,
        institution_id: record.institution_id,
        position: record.position ?? null,
        institution: institution
          ? {
              id: institution.id,
              name: institution.name,
              entity_type: institution.entity_type ?? null,
              parent_institution_id: institution.parent_institution_id ?? null,
              category: institution.category ?? null,
              zone: institution.zone ?? null,
              address: institution.address ?? null,
              phone: institution.phone ?? null,
              email: institution.email ?? null,
              established_year: institution.established_year ?? null,
              residents: institution.residents ?? null,
              photo_url: institution.photo_url ?? null,
            }
          : null,
      } satisfies MemberInstitutionAssignment;
    })
    .sort((a, b) => {
      const aName = (a.institution?.name ?? '').toLowerCase();
      const bName = (b.institution?.name ?? '').toLowerCase();
      return aName.localeCompare(bName);
    });
}

export async function getMemberInstitutions(memberId: string): Promise<MemberWithInstitutions['institutions']> {
  const assignments = await getMemberAssignments(memberId);

  return assignments.map((assignment) => ({
    id: assignment.institution?.id ?? assignment.institution_id,
    name: assignment.institution?.name ?? '',
    category: assignment.institution?.category ?? null,
    zone: assignment.institution?.zone ?? null,
    address: assignment.institution?.address ?? null,
    phone: assignment.institution?.phone ?? null,
    email: assignment.institution?.email ?? null,
    established_year: assignment.institution?.established_year ?? null,
    residents: assignment.institution?.residents ?? null,
    photo: assignment.institution?.photo_url ?? undefined,
    position: assignment.position ?? null,
  }));
}

export async function getMembersByInstitution(institutionId: string): Promise<Array<{ memberId: string; name: string; position: string | null }>> {
  const { data: relationships, error: relationshipsError } = await supabase
    .from('member_institutions')
    .select(`
      id,
      member_id,
      institution_id,
      position
    `)
    .eq('institution_id', institutionId)
    .order('position', { ascending: true, nullsFirst: false });

  if (relationshipsError) {
    throw relationshipsError;
  }

  const rows = (relationships ?? []) as Array<{ id: string; member_id: string; institution_id: string; position: string | null }>;

  if (!rows.length) {
    return [];
  }

  const memberIds = rows
    .map((relationship) => relationship.member_id)
    .filter((memberId): memberId is string => Boolean(memberId));

  if (!memberIds.length) {
    return [];
  }

  const { data: members, error: membersError } = await supabase
    .from('members')
    .select(`
      id,
      name,
      recordical_name,
      role,
      house,
      photo_url
    `)
    .in('id', memberIds)
    .is('archived_at', null);

  if (membersError) {
    throw membersError;
  }

  const memberById = new Map(
    (members ?? []).map((member) => [member.id, member]),
  );

  return rows.map((relationship) => {
    const member = memberById.get(relationship.member_id);

    return {
      memberId: relationship.member_id,
      name: member?.name ?? 'Unknown member',
      position: relationship.position ?? null,
    };
  });
}

export async function getInstitutions(): Promise<Institution[]> {
  const { data, error } = await supabase
    .from('institutions')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapInstitutionRow(row as InstitutionRow));
}

export async function getInstitutionById(id: string): Promise<Institution | null> {
  const { data, error } = await supabase
    .from('institutions')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapInstitutionRow(data as InstitutionRow);
}

export async function getChildInstitutions(parentInstitutionId: string): Promise<Institution[]> {
  const { data, error } = await supabase
    .from('institutions')
    .select('*')
    .eq('parent_institution_id', parentInstitutionId)
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapInstitutionRow(row as InstitutionRow));
}

export async function getInstitutionMembers(institutionId: string): Promise<Array<{ memberId: string; name: string; position: string | null }>> {
  return getMembersByInstitution(institutionId);
}

export async function getHouseList(): Promise<HouseListEntry[]> {
  const { data, error } = await supabase
    .from('house_list')
    .select(`
      id,
      name,
      category,
      house,
      institution_id,
      role,
      phone,
      email,
      address,
      photo_url,
      institution:institutions ( id, name )
    `)
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as unknown as Array<{
    id: string;
    name: string | null;
    category: string | null;
    house: string | null;
    institution_id: string | null;
    role: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    photo_url: string | null;
    institution?: Array<{ id: string; name: string }> | null;
  }>;

  return rows.map((row) => {
    const institution = Array.isArray(row.institution) ? row.institution[0] ?? null : row.institution ?? null;

    return {
      id: row.id,
      name: row.name ?? '',
      category: row.category ?? null,
      house: row.house ?? null,
      institution_id: row.institution_id ?? null,
      role: row.role ?? null,
      phone: row.phone ?? null,
      email: row.email ?? null,
      address: row.address ?? null,
      photo_url: row.photo_url ?? null,
      institution: institution ? { id: institution.id, name: institution.name } : null,
    } satisfies HouseListEntry;
  });
}

