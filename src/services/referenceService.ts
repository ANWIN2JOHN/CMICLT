import { supabase } from '../lib/supabase';

export interface ReferenceOption {
  id: string;
  name: string;
  code?: string | null;
}

async function selectOptions(table: string, fields: string): Promise<ReferenceOption[]> {
  const { data, error } = await supabase
    .from(table)
    .select(fields)
    .order('name', { ascending: true, nullsFirst: false });

  if (error) throw error;

  const rows = (data ?? []) as unknown as Array<Record<string, unknown>>;

  return rows.map((row) => {
    const name = typeof row.name === 'string' ? row.name : '';
    const id = typeof row.id === 'string' ? row.id : `${table}-${name}`;
    const code = typeof row.code === 'string' ? row.code : null;

    return { id, name, code };
  }).filter((row) => row.name);
}

export async function getMemberCategories(): Promise<ReferenceOption[]> {
  return selectOptions('member_categories', 'id, name');
}

export async function getZones(): Promise<ReferenceOption[]> {
  return selectOptions('zones', 'id, name');
}

export async function getDioceses(): Promise<ReferenceOption[]> {
  return selectOptions('dioceses', 'id, code, name');
}

export async function getParishes(): Promise<ReferenceOption[]> {
  return selectOptions('parishes', 'id, name');
}

export async function getInstitutions(): Promise<ReferenceOption[]> {
  return selectOptions('institutions', 'id, name');
}

export async function getReferenceData() {
  const [memberCategories, zones, dioceses, parishes, institutions] = await Promise.all([
    getMemberCategories(),
    getZones(),
    getDioceses(),
    getParishes(),
    getInstitutions(),
  ]);

  return { memberCategories, zones, dioceses, parishes, institutions };
}
