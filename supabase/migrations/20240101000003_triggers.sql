-- Function to update pitch_count on queries table
create or replace function public.update_query_pitch_count()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    update public.queries
    set pitch_count = pitch_count + 1
    where id = new.query_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.queries
    set pitch_count = pitch_count - 1
    where id = old.query_id;
    return old;
  end if;
  return null;
end;
$$;

-- Trigger to maintain pitch_count
create trigger update_pitch_count_on_insert
  after insert on public.pitches
  for each row
  execute function public.update_query_pitch_count();

create trigger update_pitch_count_on_delete
  after delete on public.pitches
  for each row
  execute function public.update_query_pitch_count();

-- Function to create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

