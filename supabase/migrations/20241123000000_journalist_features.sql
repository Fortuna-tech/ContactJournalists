-- Alter queries table
alter table public.queries
  add column if not exists deadline timestamptz,
  add column if not exists preferred_contact_method text,
  add column if not exists attachment_url text;

-- Create saved_sources table (Journalists saving Founders/Sources)
create table if not exists public.saved_sources (
  id uuid primary key default gen_random_uuid(),
  journalist_id uuid not null references public.profiles(id) on delete cascade,
  source_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(journalist_id, source_id)
);

-- Enable RLS on saved_sources
alter table public.saved_sources enable row level security;

-- Policies for saved_sources
create policy "Journalists can view their own saved sources"
  on public.saved_sources for select
  using (auth.uid() = journalist_id);

create policy "Journalists can insert their own saved sources"
  on public.saved_sources for insert
  with check (auth.uid() = journalist_id);

create policy "Journalists can delete their own saved sources"
  on public.saved_sources for delete
  using (auth.uid() = journalist_id);

-- Indexes
create index if not exists idx_saved_sources_journalist_id on public.saved_sources(journalist_id);
create index if not exists idx_saved_sources_source_id on public.saved_sources(source_id);

