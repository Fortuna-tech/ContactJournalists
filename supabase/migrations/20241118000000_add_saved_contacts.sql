create table public.saved_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  journalist_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, journalist_id)
);

-- Enable RLS
alter table public.saved_contacts enable row level security;

-- Policies
create policy "Users can view their own saved contacts"
  on public.saved_contacts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own saved contacts"
  on public.saved_contacts for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own saved contacts"
  on public.saved_contacts for delete
  using (auth.uid() = user_id);

-- Index for performance
create index idx_saved_contacts_user_id on public.saved_contacts(user_id);
create index idx_saved_contacts_journalist_id on public.saved_contacts(journalist_id);

