-- CMICLT initial PostgreSQL schema
-- This migration prepares the application schema only.
-- It intentionally does not insert mock data or connect the frontend to Supabase.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------------------------
-- 1) Core reference tables
-- -----------------------------------------------------------------------------

CREATE TABLE public.institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('house', 'education', 'social', 'health', 'pastoral', 'mission')),
    zone TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    established_year INTEGER,
    residents INTEGER NOT NULL DEFAULT 0 CHECK (residents >= 0),
    photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT institutions_name_not_blank CHECK (char_length(trim(name)) > 0)
);

CREATE TABLE public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    house TEXT,
    institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
    zone TEXT NOT NULL,
    country TEXT,
    phone TEXT,
    email TEXT,
    birthday DATE,
    feast_day DATE,
    feast_name TEXT,
    diocese TEXT,
    parish TEXT,
    profession_date DATE,
    ordination_date DATE,
    photo_url TEXT,
    archived_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT members_name_not_blank CHECK (char_length(trim(name)) > 0)
);

ALTER TABLE public.institutions
    ADD COLUMN head_member_id UUID NULL;

ALTER TABLE public.institutions
    ADD CONSTRAINT institutions_head_member_fk
    FOREIGN KEY (head_member_id) REFERENCES public.members(id) ON DELETE SET NULL;

CREATE TABLE public.user_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    member_id UUID NULL REFERENCES public.members(id) ON DELETE SET NULL,
    role TEXT NOT NULL CHECK (role IN ('member', 'superadmin')),
    status TEXT NOT NULL CHECK (status IN ('active', 'pending', 'inactive', 'locked')),
    last_login_at TIMESTAMPTZ NULL,
    failed_attempts INTEGER NOT NULL DEFAULT 0 CHECK (failed_attempts >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.member_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    place TEXT,
    from_date DATE NOT NULL,
    to_date DATE NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT member_assignments_date_range CHECK (to_date IS NULL OR to_date >= from_date)
);

CREATE TABLE public.institution_apostolates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    apostolate TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('birthday', 'feast', 'province', 'anniversary', 'jubilee')),
    event_date DATE NOT NULL,
    event_time TIME NULL,
    location TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT events_title_not_blank CHECK (char_length(trim(title)) > 0)
);

CREATE TABLE public.news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    headline TEXT NOT NULL,
    published_date DATE NOT NULL,
    author_member_id UUID NULL REFERENCES public.members(id) ON DELETE SET NULL,
    author_name TEXT NULL,
    summary TEXT,
    body JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(body) = 'array'),
    image_url TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT news_headline_not_blank CHECK (char_length(trim(headline)) > 0)
);

CREATE TABLE public.gallery_albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    cover_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT gallery_album_title_not_blank CHECK (char_length(trim(title)) > 0)
);

CREATE TABLE public.gallery_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID NOT NULL REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT gallery_photo_image_not_blank CHECK (char_length(trim(image_url)) > 0)
);

CREATE TABLE public.reflections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    excerpt TEXT,
    body JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(body) = 'array'),
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT reflections_title_not_blank CHECK (char_length(trim(title)) > 0)
);

CREATE TABLE public.leaders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    note TEXT,
    photo_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT leaders_name_not_blank CHECK (char_length(trim(name)) > 0)
);

CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NULL,
    record_label TEXT NOT NULL,
    device TEXT,
    ip_address INET,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT audit_logs_record_label_not_blank CHECK (char_length(trim(record_label)) > 0)
);

-- -----------------------------------------------------------------------------
-- 2) Reusable updated_at trigger/function
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_institutions_updated_at
BEFORE UPDATE ON public.institutions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_members_updated_at
BEFORE UPDATE ON public.members
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_user_accounts_updated_at
BEFORE UPDATE ON public.user_accounts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_member_assignments_updated_at
BEFORE UPDATE ON public.member_assignments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_news_articles_updated_at
BEFORE UPDATE ON public.news_articles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_gallery_albums_updated_at
BEFORE UPDATE ON public.gallery_albums
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_reflections_updated_at
BEFORE UPDATE ON public.reflections
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_leaders_updated_at
BEFORE UPDATE ON public.leaders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 3) Indexes for common lookups
-- -----------------------------------------------------------------------------

CREATE INDEX idx_members_email ON public.members(email);
CREATE INDEX idx_members_zone ON public.members(zone);
CREATE INDEX idx_members_institution_id ON public.members(institution_id);
CREATE INDEX idx_members_archived_at ON public.members(archived_at);
CREATE INDEX idx_members_name ON public.members(name);

CREATE INDEX idx_user_accounts_auth_user_id ON public.user_accounts(auth_user_id);
CREATE INDEX idx_user_accounts_member_id ON public.user_accounts(member_id);
CREATE INDEX idx_user_accounts_role ON public.user_accounts(role);
CREATE INDEX idx_user_accounts_status ON public.user_accounts(status);

CREATE INDEX idx_member_assignments_member_id ON public.member_assignments(member_id);
CREATE INDEX idx_member_assignments_from_date ON public.member_assignments(from_date);

CREATE INDEX idx_institutions_category ON public.institutions(category);
CREATE INDEX idx_institutions_zone ON public.institutions(zone);
CREATE INDEX idx_institutions_head_member_id ON public.institutions(head_member_id);

CREATE INDEX idx_institution_apostolates_institution_id ON public.institution_apostolates(institution_id);

CREATE INDEX idx_events_event_date ON public.events(event_date);
CREATE INDEX idx_events_category ON public.events(category);

CREATE INDEX idx_news_articles_published_date ON public.news_articles(published_date);
CREATE INDEX idx_news_articles_status ON public.news_articles(status);
CREATE INDEX idx_news_articles_featured ON public.news_articles(featured);
CREATE INDEX idx_news_articles_author_member_id ON public.news_articles(author_member_id);

CREATE INDEX idx_gallery_albums_title ON public.gallery_albums(title);
CREATE INDEX idx_gallery_photos_album_id ON public.gallery_photos(album_id);
CREATE INDEX idx_gallery_photos_sort_order ON public.gallery_photos(album_id, sort_order);

CREATE INDEX idx_reflections_category ON public.reflections(category);
CREATE INDEX idx_reflections_status ON public.reflections(status);

CREATE INDEX idx_leaders_sort_order ON public.leaders(sort_order);

CREATE INDEX idx_audit_logs_user_id_created_at ON public.audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_entity_type_entity_id ON public.audit_logs(entity_type, entity_id);

-- -----------------------------------------------------------------------------
-- 4) Row Level Security
-- -----------------------------------------------------------------------------

ALTER TABLE public.user_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_apostolates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper predicates: executed with definer rights to avoid recursive RLS checks
-- on public.user_accounts while still returning only a boolean result.
CREATE OR REPLACE FUNCTION public.is_authenticated_user()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
    SELECT auth.uid() IS NOT NULL
      AND EXISTS (
          SELECT 1
          FROM public.user_accounts ua
          WHERE ua.auth_user_id = auth.uid()
      );
$$;

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
    SELECT auth.uid() IS NOT NULL
      AND EXISTS (
          SELECT 1
          FROM public.user_accounts ua
          WHERE ua.auth_user_id = auth.uid()
            AND ua.role = 'superadmin'
      );
$$;

-- user_accounts
CREATE POLICY "user_accounts_select_own_and_superadmins"
ON public.user_accounts
FOR SELECT
USING (
    auth_user_id = auth.uid()
    OR public.is_superadmin()
);

CREATE POLICY "user_accounts_superadmin_manage"
ON public.user_accounts
FOR ALL
USING (public.is_superadmin())
WITH CHECK (public.is_superadmin());

-- No generic self-insert policy. Account creation is controlled by the auth/admin workflow.

-- members
CREATE POLICY "authenticated_users_select_members"
ON public.members
FOR SELECT
USING (public.is_authenticated_user());

CREATE POLICY "superadmins_manage_members"
ON public.members
FOR ALL
USING (public.is_superadmin())
WITH CHECK (public.is_superadmin());

-- member_assignments
CREATE POLICY "authenticated_users_select_assignments"
ON public.member_assignments
FOR SELECT
USING (public.is_authenticated_user());

CREATE POLICY "superadmins_manage_assignments"
ON public.member_assignments
FOR ALL
USING (public.is_superadmin())
WITH CHECK (public.is_superadmin());

-- institutions
CREATE POLICY "authenticated_users_select_institutions"
ON public.institutions
FOR SELECT
USING (public.is_authenticated_user());

CREATE POLICY "superadmins_manage_institutions"
ON public.institutions
FOR ALL
USING (public.is_superadmin())
WITH CHECK (public.is_superadmin());

-- institution_apostolates
CREATE POLICY "authenticated_users_select_institution_apostolates"
ON public.institution_apostolates
FOR SELECT
USING (public.is_authenticated_user());

CREATE POLICY "superadmins_manage_institution_apostolates"
ON public.institution_apostolates
FOR ALL
USING (public.is_superadmin())
WITH CHECK (public.is_superadmin());

-- events
CREATE POLICY "authenticated_users_select_events"
ON public.events
FOR SELECT
USING (public.is_authenticated_user());

CREATE POLICY "superadmins_manage_events"
ON public.events
FOR ALL
USING (public.is_superadmin())
WITH CHECK (public.is_superadmin());

-- news_articles
CREATE POLICY "authenticated_users_select_news"
ON public.news_articles
FOR SELECT
USING (public.is_authenticated_user());

CREATE POLICY "superadmins_manage_news"
ON public.news_articles
FOR ALL
USING (public.is_superadmin())
WITH CHECK (public.is_superadmin());

-- gallery_albums
CREATE POLICY "authenticated_users_select_gallery_albums"
ON public.gallery_albums
FOR SELECT
USING (public.is_authenticated_user());

CREATE POLICY "superadmins_manage_gallery_albums"
ON public.gallery_albums
FOR ALL
USING (public.is_superadmin())
WITH CHECK (public.is_superadmin());

-- gallery_photos
CREATE POLICY "authenticated_users_select_gallery_photos"
ON public.gallery_photos
FOR SELECT
USING (public.is_authenticated_user());

CREATE POLICY "superadmins_manage_gallery_photos"
ON public.gallery_photos
FOR ALL
USING (public.is_superadmin())
WITH CHECK (public.is_superadmin());

-- reflections
CREATE POLICY "authenticated_users_select_reflections"
ON public.reflections
FOR SELECT
USING (public.is_authenticated_user());

CREATE POLICY "superadmins_manage_reflections"
ON public.reflections
FOR ALL
USING (public.is_superadmin())
WITH CHECK (public.is_superadmin());

-- leaders
CREATE POLICY "authenticated_users_select_leaders"
ON public.leaders
FOR SELECT
USING (public.is_authenticated_user());

CREATE POLICY "superadmins_manage_leaders"
ON public.leaders
FOR ALL
USING (public.is_superadmin())
WITH CHECK (public.is_superadmin());

-- audit_logs
CREATE POLICY "superadmins_select_audit_logs"
ON public.audit_logs
FOR SELECT
USING (public.is_superadmin());

CREATE POLICY "authenticated_users_insert_own_audit_logs"
ON public.audit_logs
FOR INSERT
WITH CHECK (
    user_id = auth.uid()
);

CREATE POLICY "superadmins_insert_audit_logs"
ON public.audit_logs
FOR INSERT
WITH CHECK (public.is_superadmin());

-- No UPDATE or DELETE policy for audit_logs; historical records remain immutable.

-- -----------------------------------------------------------------------------
-- 5) Storage bucket/path design
-- -----------------------------------------------------------------------------
-- Provision these storage buckets in Supabase Storage before app integration:
--
-- member-photos
--   path: member-photos/{member_id}/{filename}
--
-- institution-photos
--   path: institution-photos/{institution_id}/{filename}
--
-- news-images
--   path: news-images/{article_id}/{filename}
--
-- gallery
--   path: gallery/{album_id}/{filename}
--
-- reflection-images
--   path: reflection-images/{reflection_id}/{filename}
--
-- leader-photos
--   path: leader-photos/{leader_id}/{filename}
--
-- These paths keep media organized by entity and prevent mixing unrelated assets.
-- The database stores the resulting public URL or storage path, not raw binary data.

-- -----------------------------------------------------------------------------
-- 6) Notes for future migration steps
-- -----------------------------------------------------------------------------
-- 1. Create auth users in Supabase Auth.
-- 2. Create matching public.user_accounts rows for each auth user.
-- 3. Import members and institutions, with archived_at used for soft deletes.
-- 4. Assign member_assignments, institution_apostolates, events, news_articles,
--    gallery_albums, gallery_photos, reflections, and leaders.
-- 5. Review all content against the approved mock data before moving the prototype
--    data to production.
