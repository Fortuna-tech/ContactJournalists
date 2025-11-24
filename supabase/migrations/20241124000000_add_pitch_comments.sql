-- Create pitch_comments table
create table public.pitch_comments (
  id uuid primary key default gen_random_uuid(),
  pitch_id uuid not null references public.pitches(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_pitch_comments_pitch_id on public.pitch_comments(pitch_id);
create index idx_pitch_comments_user_id on public.pitch_comments(user_id);

-- RLS Policies
alter table public.pitch_comments enable row level security;

-- Policy: Journalists can view comments on pitches for their queries
create policy "Journalists can view comments for their queries"
  on public.pitch_comments for select
  to authenticated
  using (
    exists (
      select 1
      from public.pitches
      join public.queries on queries.id = pitches.query_id
      where pitches.id = pitch_comments.pitch_id
      and queries.journalist_id = auth.uid()
    )
  );

-- Policy: Pitch authors can view comments on their own pitches
create policy "Pitch authors can view comments on their own pitches"
  on public.pitch_comments for select
  to authenticated
  using (
    exists (
      select 1
      from public.pitches
      where pitches.id = pitch_comments.pitch_id
      and pitches.user_id = auth.uid()
    )
  );

-- Policy: Journalists can insert comments on pitches for their queries
create policy "Journalists can insert comments for their queries"
  on public.pitch_comments for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.pitches
      join public.queries on queries.id = pitches.query_id
      where pitches.id = pitch_comments.pitch_id
      and queries.journalist_id = auth.uid()
    )
  );

-- Policy: Pitch authors can respond (insert comments) ONLY if the journalist has already commented
-- Actually, simplify: Pitch authors can insert comments on their own pitches
-- The UI will handle the "Journalist starts" restriction, but we can enforce it here too if needed.
-- Let's stick to "Pitch authors can insert comments on their own pitches" for simplicity in RLS, 
-- and rely on UI to hide the "Reply" button if no comments exist yet.
create policy "Pitch authors can insert comments on their own pitches"
  on public.pitch_comments for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.pitches
      where pitches.id = pitch_comments.pitch_id
      and pitches.user_id = auth.uid()
    )
  );

