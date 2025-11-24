-- Add full_name column to profiles
alter table public.profiles add column if not exists full_name text;

-- Backfill full_name from auth.users metadata
update public.profiles
set full_name = (
  select raw_user_meta_data->>'full_name'
  from auth.users
  where auth.users.id = public.profiles.id
);

-- Update handle_new_user function to include full_name
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;

