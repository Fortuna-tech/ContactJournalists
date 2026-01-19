-- Blogs table for managing blog posts
create table public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  status text not null check (status in ('draft', 'scheduled', 'published')) default 'draft',
  publish_date timestamptz,
  last_updated timestamptz not null default now(),
  word_count integer default 0,
  seo_score integer default 0,
  meta_description text,
  content text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

-- Index for fetching blogs by status and publish date
create index idx_blogs_status on public.blogs(status);
create index idx_blogs_publish_date on public.blogs(publish_date);
create index idx_blogs_slug on public.blogs(slug);

-- RLS policies
alter table public.blogs enable row level security;

-- Allow staff to manage blogs
create policy "Staff can manage blogs"
  on public.blogs
  for all
  using (
    exists (
      select 1 from public.staff_privileges
      where user_id = auth.uid()
    )
  );

-- Allow public to view published blogs
create policy "Public can view published blogs"
  on public.blogs
  for select
  using (status = 'published');





