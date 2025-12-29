-- Allow admin to manage all blogs (for dashboard functionality)
-- This policy allows INSERT, UPDATE, DELETE on all blogs for admin dashboard
-- Since the admin dashboard uses password auth (not Supabase auth),
-- we need policies that work without auth.uid()

-- Drop existing policies if they exist
drop policy if exists "Allow admin manage blogs" on public.blogs;

-- Create the policy that allows all operations for admin
create policy "Allow admin manage blogs"
  on public.blogs
  for all
  using (true)
  with check (true);
