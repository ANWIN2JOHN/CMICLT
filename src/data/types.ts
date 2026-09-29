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
	address: string;
	zone: Zone | string;
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
	photo_url?: string | null; // Added photo_url
	entityType?: string;
	parentInstitutionId?: string | null;
}

export interface MemberInstitutionAssignment {
	id: string;
	member_id: string;
	institution_id: string;
	position: string | null;
	institution?: {
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
	} | null;
}

export interface HouseListEntry {
	id: string;
	name: string;
	category: string | null;
	house: string | null;
	institution_id: string | null;
	role: string | null;
	phone: string | null;
	email: string | null;
	address: string | null;
	photo_url: string | null;
	institution?: {
		id: string;
		name: string;
	} | null;
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

export interface ProvincialAdministration {
	id: string;
	province_name: string;
	province_address: string | null;
	province_phone: string | null;
	province_email: string | null;
	province_website: string | null;
	member_name: string;
	designation: string;
	mobile_numbers: string[];
	email_addresses: string[];
	photo_url: string | null;
	display_order: number;
	created_at: string;
	updated_at: string;
}

export interface CMIGeneralAdministration {
  id: string;
  member_name: string;
  designation: string;
  mobile_numbers: string[];
  email_addresses: string[];
  photo_url: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface CmiExternalAdministration {
  id: string;
  category: 'COORDINATOR_ABROAD' | 'REGIONAL' | 'SUBREGIONAL';
  title: string;
  member_name: string | null;
  designation: string | null;
  address: string | null;
  mobile_numbers: string[];
  email_addresses: string[];
  display_order: number;
  created_at?: string;
  updated_at?: string;
}
