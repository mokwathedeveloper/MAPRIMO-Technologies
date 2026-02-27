-- 1. Create Directors table
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

-- 2. Create Podcasts table
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

-- ENABLE RLS
alter table directors enable row level security;
alter table podcasts enable row level security;

-- POLICIES

-- Public Read-Only Access
create policy "Allow public read-only access on directors" 
on directors for select using (true);

create policy "Allow public read-only access on podcasts" 
on podcasts for select using (true);

-- Admin CRUD Access (requires entry in admins table)
create policy "Admin full access on directors" on directors for all using (
  exists (select 1 from admins where user_id = auth.uid())
);

create policy "Admin full access on podcasts" on podcasts for all using (
  exists (select 1 from admins where user_id = auth.uid())
);

-- RE-INFORCE Public Read Access for existing tables (to fix visibility issue)
-- Using 'if not exists' or unique names to avoid conflicts if they already exist
drop policy if exists "Allow public read-only access" on case_studies;
create policy "Allow public read-only access on case_studies" on case_studies for select using (true);

drop policy if exists "Allow public read-only access" on projects;
create policy "Allow public read-only access on projects" on projects for select using (true);

-- Storage bucket policies for directors and podcasts folders in 'projects' bucket
-- (The bucket itself should already exist from bucket.sql)

-- Note: The policies in bucket.sql already cover the 'projects' bucket for admins.
-- We just need to ensure the bucket is public for these new folders.
