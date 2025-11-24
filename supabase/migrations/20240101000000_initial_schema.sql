-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (single table for all user types)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null check (role in ('journalist', 'agency', 'founder')),
  onboarding_complete boolean not null default false,
  press text,
  company text,
  website text,
  linkedin text,
  x_handle text,
  categories text[] not null default '{}',
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Staff privileges table
create table public.staff_privileges (
  user_id uuid primary key references auth.users(id) on delete cascade,
  permissions text not null -- comma-separated list, e.g. 'admin,moderate,payments'
);

-- Queries table
create table public.queries (
  id uuid primary key default gen_random_uuid(),
  journalist_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  pitch_count int not null default 0,
  created_at timestamptz not null default now()
);

-- Pitches table
create table public.pitches (
  id uuid primary key default gen_random_uuid(),
  query_id uuid not null references public.queries(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  status text not null default 'pending' check (status in ('pending', 'responded', 'archived')),
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index idx_queries_journalist_id on public.queries(journalist_id);
create index idx_queries_category on public.queries(category);
create index idx_pitches_query_id on public.pitches(query_id);
create index idx_pitches_user_id on public.pitches(user_id);
create index idx_profiles_role on public.profiles(role);

