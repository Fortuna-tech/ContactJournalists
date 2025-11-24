alter table public.queries
  add column if not exists archived_at timestamptz default null;

create index if not exists idx_queries_archived_at
  on public.queries(archived_at);

alter table public.queries
  drop column if exists pitch_count;

