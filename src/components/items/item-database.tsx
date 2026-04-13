'use client';

import Image from 'next/image';

type Item = {
  id: string;
  item_name: string;
  crafting_recipe: string;
  notes: string | null;
  image_url: string | null;
};

export function ItemDatabase({ items }: { items: Item[] }) {
  return (
    <section className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold thematic-title">Windrose item database</h2>
        <p className="text-sm thematic-subtitle">Recipes and crafting notes for your co-op crew.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="card space-y-2">
            <h3 className="font-semibold">{item.item_name}</h3>
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.item_name}
                width={640}
                height={360}
                unoptimized
                className="h-44 w-full rounded-md object-cover"
              />
            ) : (
              <div className="flex h-44 items-center justify-center rounded-md border text-sm thematic-subtitle" style={{ borderColor: 'var(--panel-border)' }}>
                No image uploaded
              </div>
            )}
            <p className="text-sm"><span className="font-semibold">Crafting:</span> {item.crafting_recipe}</p>
            {item.notes && <p className="text-sm thematic-subtitle whitespace-pre-wrap">{item.notes}</p>}
          </article>
        ))}
      </div>

      {items.length === 0 && <div className="card text-sm thematic-subtitle">No items added yet. An admin can add them from the Admin page.</div>}
    </section>
  );
}
