-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.staff_privileges enable row level security;
alter table public.queries enable row level security;
alter table public.pitches enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.has_permission('admin'));

create policy "Staff with read permission can view profiles"
  on public.profiles for select
  using (public.has_permission('staff_read_profiles'));

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Staff privileges policies
create policy "Users can view their own privileges"
  on public.staff_privileges for select
  using (auth.uid() = user_id);

create policy "Admins can view all privileges"
  on public.staff_privileges for select
  using (public.has_permission('admin'));

create policy "Only admins can manage privileges"
  on public.staff_privileges for all
  using (public.has_permission('admin'))
  with check (public.has_permission('admin'));

-- Queries policies
create policy "Authenticated users can view all queries"
  on public.queries for select
  to authenticated
  using (true);

create policy "Journalists can create their own queries"
  on public.queries for insert
  to authenticated
  with check (
    auth.uid() = journalist_id
    and public.current_role() = 'journalist'
  );

create policy "Journalists can update their own queries"
  on public.queries for update
  to authenticated
  using (auth.uid() = journalist_id)
  with check (auth.uid() = journalist_id);

create policy "Journalists can delete their own queries"
  on public.queries for delete
  to authenticated
  using (auth.uid() = journalist_id);

create policy "Staff with moderate permission can manage queries"
  on public.queries for all
  to authenticated
  using (public.has_permission('moderate'))
  with check (public.has_permission('moderate'));

-- Pitches policies
create policy "Users can view their own pitches"
  on public.pitches for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Journalists can view pitches for their queries"
  on public.pitches for select
  to authenticated
  using (
    exists (
      select 1
      from public.queries
      where queries.id = pitches.query_id
      and queries.journalist_id = auth.uid()
    )
  );

create policy "Agency/Founder can create pitches"
  on public.pitches for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and public.current_role() in ('agency', 'founder')
    and not exists (
      select 1
      from public.queries
      where queries.id = pitches.query_id
      and queries.journalist_id = auth.uid()
    )
  );

create policy "Journalists can update pitch status for their queries"
  on public.pitches for update
  to authenticated
  using (
    exists (
      select 1
      from public.queries
      where queries.id = pitches.query_id
      and queries.journalist_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.queries
      where queries.id = pitches.query_id
      and queries.journalist_id = auth.uid()
    )
  );

create policy "Staff with moderate permission can manage pitches"
  on public.pitches for all
  to authenticated
  using (public.has_permission('moderate'))
  with check (public.has_permission('moderate'));

