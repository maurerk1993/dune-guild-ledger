alter table public.profiles
  add column if not exists display_name text;

alter table public.app_settings
  add column if not exists message_of_the_day text not null default 'Welcome aboard, captain. Set sail with today''s priorities.';

create table if not exists public.todo_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  details text,
  created_by uuid not null references public.profiles(id) on delete cascade,
  updated_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.item_recipes (
  id uuid primary key default gen_random_uuid(),
  item_name text not null,
  crafting_recipe text not null,
  notes text,
  image_url text,
  created_by uuid not null references public.profiles(id) on delete cascade,
  updated_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists item_recipes_item_name_lower_idx
  on public.item_recipes (lower(item_name));

create index if not exists todo_tasks_updated_at_idx
  on public.todo_tasks (updated_at desc);

create index if not exists item_recipes_updated_at_idx
  on public.item_recipes (updated_at desc);

alter table public.todo_tasks enable row level security;
alter table public.item_recipes enable row level security;

drop policy if exists "tasks read authenticated" on public.todo_tasks;
create policy "tasks read authenticated"
  on public.todo_tasks for select
  using (auth.role() = 'authenticated');

drop policy if exists "tasks write authenticated" on public.todo_tasks;
create policy "tasks write authenticated"
  on public.todo_tasks for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "items read authenticated" on public.item_recipes;
create policy "items read authenticated"
  on public.item_recipes for select
  using (auth.role() = 'authenticated');

drop policy if exists "items admin write" on public.item_recipes;
create policy "items admin write"
  on public.item_recipes for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

drop trigger if exists set_todo_tasks_updated_at on public.todo_tasks;
create trigger set_todo_tasks_updated_at
before update on public.todo_tasks
for each row execute procedure public.set_updated_at();

drop trigger if exists set_item_recipes_updated_at on public.item_recipes;
create trigger set_item_recipes_updated_at
before update on public.item_recipes
for each row execute procedure public.set_updated_at();

update public.profiles
set role = 'admin'
where lower(email) = 'kpmaurer@outlook.com';
