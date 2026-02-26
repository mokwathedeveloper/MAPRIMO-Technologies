-- Professional CMS Schema Migration
-- DANGER: This script will drop existing tables to ensure a clean slate.

-- 0. Cleanup
drop table if exists admins cascade;
drop table if exists case_studies cascade;
drop table if exists projects cascade;
drop table if exists testimonials cascade;
drop table if exists leads cascade;
drop table if exists posts cascade;

-- 1. Create Admins table
create table admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Projects table
create table projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  summary text,
  stack text[] default '{}',
  cover_url text,
  repo_url text,
  live_url text,
  highlights jsonb default '[]',
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Case Studies table
create table case_studies (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade unique,
  problem text,
  solution text,
  results jsonb default '[]',
  screenshots text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Testimonials table
create table testimonials (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text,
  company text,
  quote text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Leads table
create table leads (
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

-- 6. Blog Posts Table
create table posts (
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

-- ENABLE RLS
alter table projects enable row level security;
alter table case_studies enable row level security;
alter table testimonials enable row level security;
alter table leads enable row level security;
alter table admins enable row level security;
alter table posts enable row level security;

-- POLICIES

-- Public Read-Only Access
create policy "Allow public read-only access" on projects for select using (true);
create policy "Allow public read-only access" on case_studies for select using (true);
create policy "Allow public read-only access" on testimonials for select using (true);
create policy "Allow public read-only access" on posts for select using (true);

-- Admin CRUD Access (requires entry in admins table)
create policy "Admin full access" on projects for all using (
  exists (select 1 from admins where user_id = auth.uid())
);
create policy "Admin full access" on case_studies for all using (
  exists (select 1 from admins where user_id = auth.uid())
);
create policy "Admin full access" on testimonials for all using (
  exists (select 1 from admins where user_id = auth.uid())
);
create policy "Admin full access" on leads for all using (
  exists (select 1 from admins where user_id = auth.uid())
);
create policy "Admin full access" on posts for all using (
  exists (select 1 from admins where user_id = auth.uid())
);

-- Lead Insert (Public)
create policy "Allow public insert" on leads for insert with check (true);

-- Admin table read-only for authenticated (to check role)
create policy "Allow authenticated read admins" on admins for select using (auth.uid() = user_id);
