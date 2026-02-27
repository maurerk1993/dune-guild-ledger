-- Normalize profile emails and make role promotion robust to email casing.

update public.profiles
set email = lower(email)
where email <> lower(email);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, lower(coalesce(new.email, 'unknown@example.com')))
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

create or replace function public.promote_user_to_admin(target_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set role = 'admin'
  where lower(email) = lower(trim(target_email));

  if not found then
    raise exception 'No profile found for email %', target_email;
  end if;
end;
$$;
