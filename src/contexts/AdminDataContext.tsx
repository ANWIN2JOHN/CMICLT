import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Member } from '../data/types';
import { getMembers } from '../services/memberService';
import { supabase } from '../lib/supabase';

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

const Ctx = createContext<AdminData | null>(null);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set());
  const [content, setContent] = useState<ContentItem[]>([]);

  useMemo(() => {
    let active = true;

    void getMembers().then((next) => {
      if (active) setMembers(next);
    }).catch(() => {
      if (active) setMembers([]);
    });

    void supabase
      .from('news_articles')
      .select('*')
      .limit(20)
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setContent([]);
          return;
        }

        setContent((data ?? []).map((row) => ({
          id: row.id,
          type: 'News',
          title: row.headline,
          status: row.status ?? 'published',
          date: row.published_date,
          category: row.category,
          author: row.author_name ?? undefined,
          image: row.image_url ?? undefined,
          body: Array.isArray(row.body) ? row.body.join('\n\n') : '',
        })));
      });

    return () => { active = false; };
  }, []);

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
