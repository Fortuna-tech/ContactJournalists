create table public.categories (
  id text primary key,
  title text not null,
  created_at timestamptz not null default now(),
  constraint categories_id_format check (id ~ '^[a-z0-9_]+$'),
  constraint categories_title_unique unique (title)
);

create index if not exists idx_categories_title on public.categories(title);

insert into public.categories (id, title) values
  ('technology', 'Technology'),
  ('business', 'Business'),
  ('healthcare', 'Healthcare'),
  ('finance', 'Finance'),
  ('marketing', 'Marketing'),
  ('lifestyle', 'Lifestyle'),
  ('entertainment', 'Entertainment'),
  ('sports', 'Sports'),
  ('politics', 'Politics'),
  ('science', 'Science')
on conflict (id) do nothing;

insert into public.categories (id, title)
select distinct
  regexp_replace(lower(trim(category)), '[^a-z0-9]+', '_', 'g') as id,
  category as title
from public.queries
where category is not null
  and length(trim(category)) > 0
on conflict (id) do nothing;

insert into public.categories (id, title)
values ('uncategorized', 'Uncategorized')
on conflict (id) do nothing;

alter table public.queries add column category_id text;

update public.queries
set category_id = regexp_replace(lower(trim(category)), '[^a-z0-9]+', '_', 'g')
where category is not null and (category_id is null or category_id = '');

update public.queries
set category_id = 'uncategorized'
where category_id is null or category_id = '';

alter table public.queries
  alter column category_id set not null;

alter table public.queries
  add constraint queries_category_id_fkey
  foreign key (category_id) references public.categories(id);

create index if not exists idx_queries_category_id on public.queries(category_id);

alter table public.queries drop column category;

alter table public.categories enable row level security;

create policy "Authenticated users can read categories"
  on public.categories for select
  to authenticated
  using (true);

create policy "Authenticated users can insert categories"
  on public.categories for insert
  to authenticated
  with check (auth.uid() is not null);

