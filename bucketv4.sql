-- MAPRIMO Technologies - Master System Schema (v4)
-- This script safely initializes or updates all tables and policies.
-- It is idempotent and includes a schema cache refresh.

-- 0. INITIALIZE EXTENSIONS
create extension if not exists "uuid-ossp";

-- 1. ADMINS TABLE
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PROJECTS TABLE
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  summary text,
  stack text[] default '{}',
  cover_url text,
  live_url text,
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. CASE STUDIES TABLE (Standalone)
-- Ensure old linked table is removed if structure is outdated
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='case_studies' AND column_name='project_id') THEN
    DROP TABLE case_studies CASCADE;
  END IF;
END $$;

create table if not exists case_studies (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  client text not null,
  summary text not null,
  problem text not null,
  solution text not null,
  cover_url text,
  results jsonb default '[]',
  screenshots text[] default '{}',
  tags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. TESTIMONIALS TABLE
create table if not exists testimonials (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text,
  company text,
  quote text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. LEADS TABLE
create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  company text,
  message text not null,
  budget text,
  source text,
  requested_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. POSTS (BLOG) TABLE
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  image_url text,
  author text default 'MAPRIMO Team',
  tags text[] default '{}',
  published_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. DIRECTORS TABLE
create table if not exists directors (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text not null,
  bio text not null,
  image_url text,
  linkedin_url text,
  twitter_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. PODCASTS TABLE
create table if not exists podcasts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  description text,
  audio_url text,
  cover_url text,
  duration text,
  author text default 'MAPRIMO Team',
  published_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ADD MISSING COLUMNS TO PODCASTS (FOR UPDATING EXISTING TABLES)
ALTER TABLE podcasts ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE podcasts ADD COLUMN IF NOT EXISTS youtube_url text;

-- ==========================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================
alter table admins enable row level security;
alter table projects enable row level security;
alter table case_studies enable row level security;
alter table testimonials enable row level security;
alter table leads enable row level security;
alter table posts enable row level security;
alter table directors enable row level security;
alter table podcasts enable row level security;

-- ==========================================
-- POLICIES (DROP & RE-CREATE FOR IDEMPOTENCY)
-- ==========================================

-- PUBLIC READ-ONLY ACCESS
drop policy if exists "Allow public read-only access" on projects;
create policy "Allow public read-only access" on projects for select using (true);

drop policy if exists "Allow public read-only access" on case_studies;
create policy "Allow public read-only access" on case_studies for select using (true);

drop policy if exists "Allow public read-only access" on testimonials;
create policy "Allow public read-only access" on testimonials for select using (true);

drop policy if exists "Allow public read-only access" on posts;
create policy "Allow public read-only access" on posts for select using (true);

drop policy if exists "Allow public read-only access" on directors;
create policy "Allow public read-only access" on directors for select using (true);

drop policy if exists "Allow public read-only access" on podcasts;
create policy "Allow public read-only access" on podcasts for select using (true);

-- ADMIN FULL ACCESS
drop policy if exists "Admin full access" on projects;
create policy "Admin full access" on projects for all using (exists (select 1 from admins where user_id = auth.uid()));

drop policy if exists "Admin full access" on case_studies;
create policy "Admin full access" on case_studies for all using (exists (select 1 from admins where user_id = auth.uid()));

drop policy if exists "Admin full access" on testimonials;
create policy "Admin full access" on testimonials for all using (exists (select 1 from admins where user_id = auth.uid()));

drop policy if exists "Admin full access" on leads;
create policy "Admin full access" on leads for all using (exists (select 1 from admins where user_id = auth.uid()));

drop policy if exists "Admin full access" on posts;
create policy "Admin full access" on posts for all using (exists (select 1 from admins where user_id = auth.uid()));

drop policy if exists "Admin full access" on directors;
create policy "Admin full access" on directors for all using (exists (select 1 from admins where user_id = auth.uid()));

drop policy if exists "Admin full access" on podcasts;
create policy "Admin full access" on podcasts for all using (exists (select 1 from admins where user_id = auth.uid()));

-- SPECIAL PERMISSIONS
drop policy if exists "Allow public insert" on leads;
create policy "Allow public insert" on leads for insert with check (true);

drop policy if exists "Allow authenticated read admins" on admins;
create policy "Allow authenticated read admins" on admins for select using (auth.uid() = user_id);

-- ==========================================
-- REFRESH SCHEMA CACHE
-- ==========================================
-- This forces Supabase to see the new columns immediately
NOTIFY pgrst, 'reload schema';
