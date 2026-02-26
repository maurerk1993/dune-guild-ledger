create extension if not exists "pgcrypto";

create type public.app_role as enum ('member', 'admin');
create type public.ledger_status as enum ('owed', 'partially_fulfilled', 'fulfilled');
create type public.request_status as enum ('pending', 'approved', 'rejected');
create type public.field_type as enum ('text', 'number', 'date');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role app_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roster_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  display_name text not null,
  handle text,
  rank text,
  join_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roster_fields (
  field_key text primary key,
  label text not null,
  type field_type not null,
  is_required boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roster_member_field_values (
  id uuid primary key default gen_random_uuid(),
  roster_member_id uuid not null references public.roster_members(id) on delete cascade,
  field_key text not null references public.roster_fields(field_key) on delete cascade,
  value_text text,
  value_number numeric,
  value_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (roster_member_id, field_key)
);

create table public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  quantity_owed numeric not null check (quantity_owed >= 0),
  unit text,
  owed_to_member_id uuid references public.roster_members(id) on delete set null,
  status ledger_status not null default 'owed',
  notes text,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.fulfillment_requests (
  id uuid primary key default gen_random_uuid(),
  ledger_entry_id uuid not null references public.ledger_entries(id) on delete cascade,
  requester_user_id uuid not null references public.profiles(id) on delete cascade,
  status request_status not null default 'pending',
  notes text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contribution_actions (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contribution_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  action_id uuid not null references public.contribution_actions(id) on delete cascade,
  notes text,
  created_at timestamptz not null default now()
);

create table public.app_settings (
  id integer primary key default 1 check (id = 1),
  member_ledger_scope text not null default 'all' check (member_ledger_scope in ('all', 'self')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
insert into public.app_settings (id, member_ledger_scope) values (1, 'all') on conflict (id) do nothing;

create index ledger_entries_status_idx on public.ledger_entries(status);
create index ledger_entries_owed_to_member_idx on public.ledger_entries(owed_to_member_id);
create index contribution_logs_user_idx on public.contribution_logs(user_id, created_at desc);
create index contribution_logs_action_idx on public.contribution_logs(action_id, created_at desc);

create function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create function public.is_admin(uid uuid)
returns boolean language sql stable as $$
  select exists(select 1 from public.profiles p where p.id = uid and p.role = 'admin');
$$;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, coalesce(new.email, 'unknown@example.com'))
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create trigger set_profiles_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger set_roster_members_updated_at before update on public.roster_members for each row execute procedure public.set_updated_at();
create trigger set_roster_fields_updated_at before update on public.roster_fields for each row execute procedure public.set_updated_at();
create trigger set_roster_member_field_values_updated_at before update on public.roster_member_field_values for each row execute procedure public.set_updated_at();
create trigger set_ledger_entries_updated_at before update on public.ledger_entries for each row execute procedure public.set_updated_at();
create trigger set_fulfillment_requests_updated_at before update on public.fulfillment_requests for each row execute procedure public.set_updated_at();
create trigger set_contribution_actions_updated_at before update on public.contribution_actions for each row execute procedure public.set_updated_at();
create trigger set_app_settings_updated_at before update on public.app_settings for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.roster_members enable row level security;
alter table public.roster_fields enable row level security;
alter table public.roster_member_field_values enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.fulfillment_requests enable row level security;
alter table public.contribution_actions enable row level security;
alter table public.contribution_logs enable row level security;
alter table public.app_settings enable row level security;

create policy "profiles self read" on public.profiles for select using (auth.uid() = id or public.is_admin(auth.uid()));
create policy "profiles self update" on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select p.role from public.profiles p where p.id = auth.uid())
  );
create policy "profiles admin update" on public.profiles for update using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "roster read all authenticated" on public.roster_members for select using (auth.role() = 'authenticated');
create policy "roster admin write" on public.roster_members for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "roster fields read all" on public.roster_fields for select using (auth.role() = 'authenticated');
create policy "roster fields admin write" on public.roster_fields for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "roster values read all" on public.roster_member_field_values for select using (auth.role() = 'authenticated');
create policy "roster values admin write" on public.roster_member_field_values for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "ledger read by setting" on public.ledger_entries for select using (
  auth.role() = 'authenticated' and (
    (select member_ledger_scope from public.app_settings where id = 1) = 'all'
    or owed_to_member_id in (select id from public.roster_members where user_id = auth.uid())
    or public.is_admin(auth.uid())
  )
);
create policy "ledger admin insert" on public.ledger_entries for insert with check (public.is_admin(auth.uid()) and created_by = auth.uid());
create policy "ledger admin update" on public.ledger_entries for update using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "ledger admin delete" on public.ledger_entries for delete using (public.is_admin(auth.uid()));

create policy "fulfillment read authenticated" on public.fulfillment_requests for select using (auth.role() = 'authenticated');
create policy "fulfillment create own" on public.fulfillment_requests for insert with check (requester_user_id = auth.uid());
create policy "fulfillment admin update" on public.fulfillment_requests for update using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "actions read authenticated" on public.contribution_actions for select using (auth.role() = 'authenticated');
create policy "actions admin write" on public.contribution_actions for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "logs read authenticated" on public.contribution_logs for select using (auth.role() = 'authenticated');
create policy "logs create own" on public.contribution_logs for insert with check (user_id = auth.uid());

create policy "settings read authenticated" on public.app_settings for select using (auth.role() = 'authenticated');
create policy "settings admin write" on public.app_settings for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create or replace function public.promote_user_to_admin(target_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles set role = 'admin' where email = lower(target_email);
  if not found then
    raise exception 'No profile found for email %', target_email;
  end if;
end;
$$;

revoke execute on function public.promote_user_to_admin(text) from public, anon, authenticated;
grant execute on function public.promote_user_to_admin(text) to service_role;
