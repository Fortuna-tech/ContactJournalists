-- Allow authenticated users to view profiles that have completed onboarding
create policy "Authenticated users can view active profiles"
  on public.profiles for select
  to authenticated
  using (onboarding_complete = true);

