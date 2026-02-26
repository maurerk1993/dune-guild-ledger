alter table public.contribution_actions
  add column if not exists points integer not null default 1 check (points >= 0);

alter table public.contribution_logs
  add column if not exists points_awarded integer;

update public.contribution_logs logs
set points_awarded = greatest(coalesce(actions.points, 0), 0)
from public.contribution_actions actions
where logs.action_id = actions.id
  and logs.points_awarded is null;

alter table public.contribution_logs
  alter column points_awarded set default 0,
  alter column points_awarded set not null;

alter table public.profiles
  add column if not exists contribution_points integer not null default 0 check (contribution_points >= 0);

update public.profiles profile
set contribution_points = coalesce(points.total_points, 0)
from (
  select user_id, sum(points_awarded)::integer as total_points
  from public.contribution_logs
  group by user_id
) points
where profile.id = points.user_id;

create or replace function public.apply_contribution_log_points()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    update public.profiles
    set contribution_points = contribution_points + new.points_awarded
    where id = new.user_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.profiles
    set contribution_points = greatest(contribution_points - old.points_awarded, 0)
    where id = old.user_id;
    return old;
  elsif tg_op = 'UPDATE' then
    if new.user_id <> old.user_id then
      update public.profiles
      set contribution_points = greatest(contribution_points - old.points_awarded, 0)
      where id = old.user_id;

      update public.profiles
      set contribution_points = contribution_points + new.points_awarded
      where id = new.user_id;
    elsif new.points_awarded <> old.points_awarded then
      update public.profiles
      set contribution_points = greatest(contribution_points + new.points_awarded - old.points_awarded, 0)
      where id = new.user_id;
    end if;

    return new;
  end if;

  return null;
end;
$$;

drop trigger if exists contribution_logs_points_sync on public.contribution_logs;
create trigger contribution_logs_points_sync
after insert or update or delete on public.contribution_logs
for each row execute procedure public.apply_contribution_log_points();

drop policy if exists "logs admin delete" on public.contribution_logs;
create policy "logs admin delete" on public.contribution_logs for delete using (public.is_admin(auth.uid()));
