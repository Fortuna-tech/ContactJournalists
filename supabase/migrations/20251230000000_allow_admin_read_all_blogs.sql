-- Allow reading all blogs (including drafts) for admin dashboard
-- This policy allows SELECT on all blogs regardless of status
-- Since the admin dashboard uses password auth (not Supabase auth), 
-- we need a policy that works without auth.uid()
create policy "Allow reading all blogs for admin"
  on public.blogs
  for select
  using (true);

