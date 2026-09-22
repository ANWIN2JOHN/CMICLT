import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { members as seedMembers } from '../data/members';
import { news, events } from '../data/content';
import type { Member } from '../data/types';

/**
 * Admin-scoped mutable store. Seeds from the existing mock data modules and
 * keeps member + content edits in memory for the session so that create /
 * update / archive operations are reflected when returning to the admin
 * management lists. Prototype only — no backend.
 */

export type ContentType = 'News' | 'Event' | 'Gallery' | 'Vocation' | 'Chavarul' | 'Contact';
export type ContentStatus = 'published' | 'scheduled' | 'draft';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  status: ContentStatus;
  date: string;
  category?: string;
  author?: string;
  image?: string;
  body?: string;
  time?: string;
  location?: string;
  description?: string;
  related?: string;
}

interface AdminData {
  members: Member[];
  getMember: (id: string) => Member | undefined;
  addMember: (m: Member) => void;
  updateMember: (id: string, patch: Partial<Member>) => void;
  archivedIds: Set<string>;
  isArchived: (id: string) => boolean;
  archiveMember: (id: string) => void;
  restoreMember: (id: string) => void;
  content: ContentItem[];
  getContent: (id: string) => ContentItem | undefined;
  addContent: (c: ContentItem) => void;
  updateContent: (id: string, patch: Partial<ContentItem>) => void;
}

const seedContent: ContentItem[] = [
  ...news.map((n, i) => ({
    id: n.id,
    type: 'News' as ContentType,
    title: n.headline,
    status: (i % 5 === 0 ? 'draft' : i % 4 === 0 ? 'scheduled' : 'published') as ContentStatus,
    date: n.date,
    category: n.category,
    author: n.author,
    image: n.image,
    body: n.summary,
  })),
  ...events.slice(0, 6).map((e, i) => ({
    id: e.id,
    type: 'Event' as ContentType,
    title: e.title,
    status: (i % 3 === 0 ? 'scheduled' : 'published') as ContentStatus,
    date: e.date,
    category: e.category,
    time: e.time,
    location: e.location,
    description: e.description,
  })),
];

const Ctx = createContext<AdminData | null>(null);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>(() => seedMembers.map((m) => ({ ...m })));
  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set());
  const [content, setContent] = useState<ContentItem[]>(() => seedContent.map((c) => ({ ...c })));

  const value = useMemo<AdminData>(() => ({
    members,
    getMember: (id) => members.find((m) => m.id === id),
    addMember: (m) => setMembers((prev) => [m, ...prev]),
    updateMember: (id, patch) => setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m))),
    archivedIds,
    isArchived: (id) => archivedIds.has(id),
    archiveMember: (id) => setArchivedIds((prev) => new Set(prev).add(id)),
    restoreMember: (id) => setArchivedIds((prev) => { const n = new Set(prev); n.delete(id); return n; }),
    content,
    getContent: (id) => content.find((c) => c.id === id),
    addContent: (c) => setContent((prev) => [c, ...prev]),
    updateContent: (id, patch) => setContent((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c))),
  }), [members, archivedIds, content]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdminData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider');
  return ctx;
}
