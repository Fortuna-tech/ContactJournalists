create table if not exists public.affiliates (
  id uuid not null default gen_random_uuid(),
  email text not null,
  payout_link text,
  code text,
  cut_percentage numeric default 20,
  status text not null default 'pending' check (status in ('pending', 'active', 'banned')),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint affiliates_pkey primary key (id),
  constraint affiliates_email_key unique (email),
  constraint affiliates_code_key unique (code)
);

-- Enable RLS
alter table public.affiliates enable row level security;

-- Policy: Allow public to insert (apply)
create policy "Allow public insert to affiliates"
  on public.affiliates
  for insert
  with check (true);

-- Policy: Allow admins/service role to do everything (implied by default usually, but good to be explicit if we had admin users)
-- For now, we just need public insert. We might want to restrict select to only the owner or admins, but since there's no auth on this page, we'll just leave select restricted (default deny).
