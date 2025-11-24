create table public.media_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.media_list_members (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.media_lists(id) on delete cascade,
  journalist_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(list_id, journalist_id)
);

alter table public.media_lists enable row level security;
alter table public.media_list_members enable row level security;

create policy "Users can view their own media lists"
  on public.media_lists for select
  using (auth.uid() = user_id);

create policy "Users can insert their own media lists"
  on public.media_lists for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own media lists"
  on public.media_lists for update
  using (auth.uid() = user_id);

create policy "Users can delete their own media lists"
  on public.media_lists for delete
  using (auth.uid() = user_id);

create policy "Users can view their own media list members"
  on public.media_list_members for select
  using (
    exists (
      select 1 from public.media_lists
      where id = media_list_members.list_id
      and user_id = auth.uid()
    )
  );

create policy "Users can insert their own media list members"
  on public.media_list_members for insert
  with check (
    exists (
      select 1 from public.media_lists
      where id = media_list_members.list_id
      and user_id = auth.uid()
    )
  );

create policy "Users can delete their own media list members"
  on public.media_list_members for delete
  using (
    exists (
      select 1 from public.media_lists
      where id = media_list_members.list_id
      and user_id = auth.uid()
    )
  );

