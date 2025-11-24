-- Allow null values for role on profiles to avoid trigger insert failures
alter table public.profiles
  alter column role drop not null;

