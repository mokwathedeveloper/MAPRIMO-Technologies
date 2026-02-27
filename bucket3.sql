-- MAPRIMO Technologies - Comprehensive Schema Setup (v3)
-- This script is idempotent: it can be run multiple times safely.

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

-- 3. Create Independent Case Studies table
-- WARNING: This drops the old project-linked table if it exists to allow the new standalone structure
drop table if exists case_studies cascade;

create table case_studies (
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

-- ENABLE RLS
alter table directors enable row level security;
alter table podcasts enable row level security;
alter table case_studies enable row level security;

-- CLEANUP & RE-CREATE POLICIES (Prevents "already exists" errors)

-- Directors Policies
drop policy if exists "Allow public read-only access on directors" on directors;
create policy "Allow public read-only access on directors" on directors for select using (true);

drop policy if exists "Admin full access on directors" on directors;
create policy "Admin full access on directors" on directors for all using (
  exists (select 1 from admins where user_id = auth.uid())
);

-- Podcasts Policies
drop policy if exists "Allow public read-only access on podcasts" on podcasts;
create policy "Allow public read-only access on podcasts" on podcasts for select using (true);

drop policy if exists "Admin full access on podcasts" on podcasts;
create policy "Admin full access on podcasts" on podcasts for all using (
  exists (select 1 from admins where user_id = auth.uid())
);

-- Case Studies Policies
drop policy if exists "Allow public read-only access on case_studies" on case_studies;
create policy "Allow public read-only access on case_studies" on case_studies for select using (true);

drop policy if exists "Admin full access on case_studies" on case_studies;
create policy "Admin full access on case_studies" on case_studies for all using (
  exists (select 1 from admins where user_id = auth.uid())
);

-- Reinforce Project Policies
drop policy if exists "Allow public read-only access on projects" on projects;
create policy "Allow public read-only access on projects" on projects for select using (true);

drop policy if exists "Admin full access on projects" on projects;
create policy "Admin full access on projects" on projects for all using (
  exists (select 1 from admins where user_id = auth.uid())
);
