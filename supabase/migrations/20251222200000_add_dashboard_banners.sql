-- Dashboard Banners table
create table public.dashboard_banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cta_text text,
  cta_link text,
  audience text not null check (audience in ('journalist', 'founder_agency', 'all')),
  expiry_date timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

-- Index for fetching active banners by audience
create index idx_dashboard_banners_audience on public.dashboard_banners(audience) where is_active = true;
create index idx_dashboard_banners_expiry on public.dashboard_banners(expiry_date) where is_active = true;

-- RLS policies
alter table public.dashboard_banners enable row level security;

-- Allow staff to manage banners
create policy "Staff can manage banners"
  on public.dashboard_banners
  for all
  using (
    exists (
      select 1 from public.staff_privileges
      where user_id = auth.uid()
    )
  );

-- Allow authenticated users to view active banners for their role
create policy "Users can view active banners"
  on public.dashboard_banners
  for select
  using (
    is_active = true
    and (expiry_date is null or expiry_date > now())
    and (
      audience = 'all'
      or (
        audience = 'journalist' 
        and exists (
          select 1 from public.profiles 
          where id = auth.uid() and role = 'journalist'
        )
      )
      or (
        audience = 'founder_agency'
        and exists (
          select 1 from public.profiles 
          where id = auth.uid() and role in ('founder', 'agency')
        )
      )
    )
  );
