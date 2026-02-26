-- Hotfix for environments where migration 0002 created an overly permissive
-- profiles SELECT policy or where rerunning SQL hit duplicate-policy errors.

-- Remove the broad policy if it exists.
drop policy if exists "profiles read authenticated" on public.profiles;

-- Ensure least-privilege profile reads exist (self + admin).
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles self read'
  ) then
    execute 'create policy "profiles self read" on public.profiles for select using (auth.uid() = id or public.is_admin(auth.uid()))';
  end if;
end
$$;
