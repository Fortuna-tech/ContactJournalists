-- Allow reading all blogs (including drafts) for admin dashboard
-- This policy allows SELECT on all blogs regardless of status
-- Since the admin dashboard uses password auth (not Supabase auth), 
-- we need a policy that works without auth.uid()

-- Drop existing policy if it exists
drop policy if exists "Allow reading all blogs for admin" on public.blogs;

-- Create the policy
create policy "Allow reading all blogs for admin"
  on public.blogs
  for select
  using (true);
