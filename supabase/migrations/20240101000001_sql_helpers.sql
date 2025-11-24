-- Helper function to check if user has a permission
create or replace function public.has_permission(perm text)
returns boolean
language plpgsql
security definer
stable
as $$
begin
  return exists (
    select 1
    from public.staff_privileges
    where user_id = auth.uid()
    and (
      permissions ilike '%admin%'
      or permissions ilike ('%' || perm || '%')
    )
  );
end;
$$;

-- Helper function to get current user's role
create or replace function public.current_role()
returns text
language plpgsql
security definer
stable
as $$
declare
  user_role text;
begin
  select role into user_role
  from public.profiles
  where id = auth.uid();
  
  return user_role;
end;
$$;

