import { createServerSupabaseClient } from '@/lib/supabase-server';
import { ItemDatabase } from '@/components/items/item-database';

export default async function ItemsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: items } = await supabase
    .from('item_recipes')
    .select('id,item_name,crafting_recipe,notes,image_url,image_path')
    .order('item_name', { ascending: true });

  return <ItemDatabase items={items ?? []} />;
}
