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
  zone: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  birthday: string | null;
  feast_month: number | null;
  feast_day: number | null;
  feast_name: string | null;
  diocese: string | null;
  parish: string | null;
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
  const feastDay = row.feast_day ?? 0;
  const feastMonth = row.feast_month ?? 0;

  return {
    id: row.id,
    name: row.name,
    role: row.role,
    house: row.house ?? '',
    institution: undefined,
    zone: (row.zone ?? 'Calicut') as Member['zone'],
    country: row.country ?? '',
    phone: row.phone ?? '',
    email: row.email ?? '',
    birthday: formatDateDisplay(birthday),
    birthMonth: monthFromDate(birthday),
    feastDay: feastDay === 0 ? '' : String(feastDay),
    feastMonth,
    feastName: undefined,
    diocese: row.diocese ?? '',
    parish: row.parish ?? '',
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
    .select('*')
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
    .select('*')
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
    .select('*')
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
  const { data, error } = await supabase
    .from('member_institutions')
    .select(`
      id,
      member_id,
      position,
      members:members (
        id,
        name,
        role
      )
    `)
    .eq('institution_id', institutionId)
    .order('position', { ascending: true, nullsFirst: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => {
    const member = Array.isArray((row as { members?: unknown[] }).members)
      ? ((row as { members?: Array<{ id?: string; name?: string }> })?.members?.[0] ?? null)
      : null;

    return {
      memberId: member?.id ?? '',
      name: member?.name ?? 'Unknown member',
      position: (row as { position?: string | null }).position ?? null,
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
