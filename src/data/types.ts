export type Zone = 'Calicut' | 'Wayanad' | 'Malabar' | 'Nilgiris' | 'Mission';

export interface Assignment {
  role: string;
  place: string;
  from: string; // year
  to: string | null; // null = current
}

export interface Member {
  id: string;
  name: string;
  role: string;
  house: string;
  institution?: string;
  zone: Zone;
  country: string;
  phone: string;
  email: string;
  birthday: string; // ISO MM-DD friendly display
  birthMonth: number; // 1-12
  feastDay: string;
  feastMonth: number;
  feastName?: string;
  diocese: string;
  parish: string;
  professionDate: string;
  ordinationDate: string;
  photo?: string;
  assignments: Assignment[];
}

export type InstitutionCategory =
  | 'house'
  | 'education'
  | 'social'
  | 'health'
  | 'pastoral'
  | 'mission';

export interface Institution {
  id: string;
  name: string;
  category: InstitutionCategory;
  zone: Zone;
  address: string;
  phone: string;
  email: string;
  year: number;
  apostolates: string[];
  head: string;
  residents: number;
  photo?: string;
}

export type EventCategory = 'birthday' | 'feast' | 'province' | 'anniversary' | 'jubilee';

export interface CmiEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string; // ISO yyyy-mm-dd
  time?: string;
  location?: string;
  description?: string;
}

export interface NewsArticle {
  id: string;
  category: string;
  headline: string;
  date: string;
  author?: string;
  summary: string;
  body: string[];
  image: string;
  featured?: boolean;
}

export interface Album {
  id: string;
  title: string;
  cover: string;
  count: number;
  photos: string[];
}

export interface Reflection {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  body: string[];
}

export interface Leader {
  id: string;
  name: string;
  role: string;
  note: string;
  photo?: string;
}

export type AccountStatus = 'active' | 'pending' | 'inactive' | 'locked';

export interface UserAccount {
  id: string;
  memberId: string;
  name: string;
  identifier: string; // email
  role: 'member' | 'superadmin';
  status: AccountStatus;
  lastLogin?: string;
  failedAttempts: number;
}

export interface AuditEntry {
  id: string;
  user: string;
  action: string;
  record: string;
  date: string;
  time: string;
  device: string;
}
