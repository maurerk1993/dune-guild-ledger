alter table public.item_recipes
  add column if not exists image_path text;

insert into storage.buckets (id, name, public)
values ('item-images', 'item-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "item images read authenticated" on storage.objects;
create policy "item images read authenticated"
  on storage.objects for select
  using (bucket_id = 'item-images' and auth.role() = 'authenticated');

drop policy if exists "item images admin write" on storage.objects;
create policy "item images admin write"
  on storage.objects for all
  using (bucket_id = 'item-images' and public.is_admin(auth.uid()))
  with check (bucket_id = 'item-images' and public.is_admin(auth.uid()));
