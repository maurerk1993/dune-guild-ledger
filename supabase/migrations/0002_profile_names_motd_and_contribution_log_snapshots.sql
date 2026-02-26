alter table public.profiles
  add column if not exists display_name text;

alter table public.app_settings
  add column if not exists message_of_the_day text not null default 'Welcome to The Black Templars Ledger.';

alter table public.contribution_logs
  add column if not exists actor_name text,
  add column if not exists action_label text;

update public.profiles
set display_name = split_part(email, '@', 1)
where display_name is null;

update public.contribution_logs logs
set
  actor_name = coalesce(p.display_name, split_part(p.email, '@', 1), p.email, 'unknown'),
  action_label = coalesce(a.label, 'Unknown contribution')
from public.profiles p, public.contribution_actions a
where p.id = logs.user_id
  and a.id = logs.action_id
  and (logs.actor_name is null or logs.action_label is null);

create policy "profiles read authenticated" on public.profiles
for select
using (auth.role() = 'authenticated');
