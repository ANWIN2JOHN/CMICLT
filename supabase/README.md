# CMICLT Supabase database design

This folder contains the initial PostgreSQL schema for the CMICLT application. The design intentionally preserves the existing application structure and avoids UI or auth changes.

## Architecture overview

The database is built around a small set of application tables tied to Supabase Auth and the current CMICLT domain model.

- `auth.users` is the source of credential and identity information.
- `public.user_accounts` stores application-level account metadata for each authenticated user.
- `public.members` stores the member directory/profile records.
- `public.member_assignments` stores member service history.
- `public.institutions` and `public.institution_apostolates` store community and apostolate data.
- `public.events`, `public.news_articles`, `public.gallery_albums`, `public.gallery_photos`, `public.reflections`, `public.leaders` store content.
- `public.audit_logs` stores administrative activity metadata.

## Entity relationship summary

```text
auth.users
    ↓
user_accounts
    ↓
members
    ├── member_assignments
    ├── news_articles.author_member_id
    └── institutions.institution_id

institutions
    └── institution_apostolates

gallery_albums
    └── gallery_photos

auth.users
    └── audit_logs.user_id
```

Key design points:

- `members` is the core person record.
- `user_accounts.member_id` links an app account to a member when available.
- `members.institution_id` stores the member's primary institution relationship.
- `institutions.head_member_id` tracks a leader relationship without forcing a hard delete dependency.
- `member_assignments` preserves historical service records for each person.
- `news_articles.author_member_id` links content to the member author when relevant.
- `audit_logs` keeps admin actions tied to the auth user who performed them.

## Authentication relationship

The application currently expects a single authentication flow with `member` and `superadmin` roles.

The planned relationship is:

```text
Supabase Auth
    ↓
auth.users
    ↓
public.user_accounts
    ↓
public.members
```

Important rules:

- Supabase Auth handles passwords and credential verification.
- `public.user_accounts` stores only metadata like role, last login, status, and failed attempts.
- Passwords are never stored in PostgreSQL application tables.
- `user_accounts.auth_user_id` is unique and references `auth.users(id)`.
- `user_accounts.role` is restricted to `member` or `superadmin`.
- `user_accounts.status` is restricted to `active`, `pending`, `inactive`, or `locked`.

## Soft archiving

Members are not removed physically during normal admin usage.

- `members.archived_at` is nullable.
- `NULL` means active.
- A timestamp means archived.

This preserves historical records while letting the UI continue to work with active members without deleting data.

## Data types and integrity

The schema uses PostgreSQL-native date types for actual dates instead of storing derived month fields.

Examples:

- `members.birthday` uses `DATE`
- `members.feast_day` uses `DATE`
- `members.profession_date` uses `DATE`
- `members.ordination_date` uses `DATE`
- `events.event_date` uses `DATE`
- `news_articles.published_date` uses `DATE`

This avoids storing duplicate derived values like `birth_month` and `feast_month` while keeping the data queryable and safe.

The migration also includes these safety checks:

- role and status constraints
- valid institution categories
- valid event categories
- valid news/reflection lifecycle states
- date range checks for assignment history
- not-blank checks for essential text fields

## RLS strategy

Row Level Security is enabled on all protected tables.

Principles:

- no anonymous access
- only authenticated users with an app record may access data
- superadmins retain administrative rights
- audit logs remain mostly immutable and are protected from broad read access

The migration uses `auth.uid()` and `public.user_accounts` for role checks. The app uses a single account table instead of separate admin users, so the RLS logic keeps permissions simple and aligned with the current architecture.

Protected tables are not left with permissive policies such as `USING (true)`.

## Storage strategy

Images and files are stored in Supabase Storage, not in PostgreSQL.

Recommended buckets and path patterns:

- `member-photos` → `member-photos/{member_id}/{filename}`
- `institution-photos` → `institution-photos/{institution_id}/{filename}`
- `news-images` → `news-images/{article_id}/{filename}`
- `gallery` → `gallery/{album_id}/{filename}`
- `reflection-images` → `reflection-images/{reflection_id}/{filename}`
- `leader-photos` → `leader-photos/{leader_id}/{filename}`

Database rows should store the resulting public URL or storage path, never raw binary content.

## Migration order

1. Apply `0001_initial_schema.sql` to the Supabase project.
2. Review the schema and confirm role/status/category values match current app usage.
3. Create Supabase Auth users.
4. Insert matching rows into `public.user_accounts`.
5. Import/support `members`, `institutions`, and their related child tables.
6. Add content records (`events`, `news_articles`, `gallery_*`, `reflections`, `leaders`).
7. Use soft delete via `archived_at` rather than physical deletion.
8. Only after the schema review, begin app integration with Supabase client usage.

## Security notes

- Never store passwords in PostgreSQL application tables.
- Keep audit logs as historical records; do not permit broad update/delete access.
- Use `ON DELETE SET NULL` for historical references where a deleted record should not erase the audit trail.
- Prefer `ON DELETE CASCADE` for child tables that belong to a parent record and are not expected to survive independent deletion.
- Keep all content and member writes restricted to superadmins unless a future, explicit business rule says otherwise.
- For any production deployment, review RLS policies, storage bucket policies, and auth trigger integration before enabling user-facing writes.

## Important modeling assumptions

This schema intentionally assumes that the existing prototype data will be reviewed before production migration. Several mock values currently use display-format strings such as `Sep 12`, but the database stores actual date values in `DATE` columns so they can be queried and formatted cleanly by the UI.

This is the schema support layer only; it does not migrate current mock data, connect contexts, or alter the frontend design.
