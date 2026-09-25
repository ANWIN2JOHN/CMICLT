import { supabase } from '../lib/supabase';
import type { Institution, Member } from '../data/types';

export interface MemberInstitutionRecord {
  id: string;
  member_id: string;
  institution_id: string;
  position: string | null;
  institution?: {
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
      diocese:dioceses ( code ),
      parish:parishes ( name ),
      zone:zones ( name )
    `)
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
      diocese:dioceses ( code ),
      parish:parishes ( name ),
      zone:zones ( name )
    `)
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
  const institutions = await getMemberInstitutions(id);

  return {
    ...member,
    institutions,
  };
}

export async function getMemberInstitutions(memberId: string): Promise<MemberWithInstitutions['institutions']> {
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
    institution: {
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
    } | null;
  }>;

  return records
    .map((record) => mapInstitutionLink(record))
    .sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      return aName.localeCompare(bName);
    });
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
    .in('id', memberIds);

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
