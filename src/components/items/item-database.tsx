'use client';

import Image from 'next/image';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

type Item = {
  id: string;
  item_name: string;
  item_category: string | null;
  crafting_recipe: string;
  notes: string | null;
  image_url: string | null;
  image_path: string | null;
};

export function ItemDatabase({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const values = Array.from(new Set(items.map((item) => item.item_category?.trim() || 'Uncategorized'))).sort((a, b) => a.localeCompare(b));
    return ['All', ...values];
  }, [items]);

  const filteredItems = useMemo(() => {
    const search = query.trim().toLowerCase();
    return items.filter((item) => {
      const category = item.item_category?.trim() || 'Uncategorized';
      const categoryMatch = activeCategory === 'All' || category === activeCategory;
      if (!categoryMatch) return false;
      if (!search) return true;
      return [item.item_name, item.crafting_recipe, item.notes ?? '', category].join(' ').toLowerCase().includes(search);
    });
  }, [activeCategory, items, query]);

  return (
    <section className="space-y-4">
      <div className="card space-y-4">
        <div>
          <h2 className="text-lg font-semibold thematic-title">🦜 Windrose item database</h2>
          <p className="text-sm thematic-subtitle">Searchable and grouped by type for fast crafting + combat lookups.</p>
        </div>

        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 thematic-subtitle" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search item, recipe, category, buff, icon…"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const selected = category === activeCategory;
            return (
              <button
                key={category}
                className={selected ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setActiveCategory(category)}
                type="button"
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {filteredItems.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredItems.map((item) => (
            <article key={item.id} className="card space-y-2 p-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold leading-tight">{item.item_name}</h3>
                <span className="rounded-full border px-2 py-0.5 text-[11px] thematic-subtitle" style={{ borderColor: 'var(--panel-border)' }}>
                  {item.item_category?.trim() || 'Uncategorized'}
                </span>
              </div>
              {item.image_url ? (
                <Image src={item.image_url} alt={item.item_name} width={320} height={180} unoptimized className="h-20 w-full rounded-md object-cover" />
              ) : (
                <div className="flex h-20 items-center justify-center rounded-md border text-xs thematic-subtitle" style={{ borderColor: 'var(--panel-border)' }}>
                  No image
                </div>
              )}
              <p className="text-xs"><span className="font-semibold">Recipe:</span> {item.crafting_recipe}</p>
              {item.notes && <p className="text-xs thematic-subtitle whitespace-pre-wrap line-clamp-3">{item.notes}</p>}
            </article>
          ))}
        </div>
      )}

      {items.length === 0 && <div className="card text-sm thematic-subtitle">No items added yet. An admin can add them from the Admin page.</div>}
      {items.length > 0 && filteredItems.length === 0 && <div className="card text-sm thematic-subtitle">No results match your search and selected category.</div>}
    </section>
  );
}
