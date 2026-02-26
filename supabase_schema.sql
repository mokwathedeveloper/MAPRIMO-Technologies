-- 1. Projects Table
create table projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  description text,
  image_url text,
  tags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table projects enable row level security;
create policy "Allow public read-only access" on projects for select using (true);

-- 2. Case Studies Table
create table case_studies (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  client text not null,
  industry text not null,
  description text,
  challenge text,
  solution text,
  results text[] default '{}',
  image_url text,
  tags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table case_studies enable row level security;
create policy "Allow public read-only access" on case_studies for select using (true);

-- 3. Testimonials Table
create table testimonials (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text,
  company text,
  content text not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table testimonials enable row level security;
create policy "Allow public read-only access" on testimonials for select using (true);

-- 4. Leads Table (Contact Form)
create table leads (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  company text,
  message text not null,
  requested_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table leads enable row level security;
-- Allow anonymous inserts (for the contact form)
create policy "Allow public insert access" on leads for insert with check (true);

-- 5. Blog Posts Table
create table posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null, -- Markdown supported
  image_url text,
  author text default 'MAPRIMO Team',
  tags text[] default '{}',
  published_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table posts enable row level security;
create policy "Allow public read-only access" on posts for select using (true);
