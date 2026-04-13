'use client';

import { useState } from 'react';

type Item = {
  id: string;
  item_name: string;
  crafting_recipe: string;
  notes: string | null;
  image_url: string | null;
};

const blankForm = {
  item_name: '',
  crafting_recipe: '',
  notes: '',
  image_url: ''
};

export function AdminItemManager({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(blankForm);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function saveNew() {
    const response = await fetch('/api/items', { method: 'POST', body: JSON.stringify(form) });
    if (!response.ok) return setStatus('Failed to add item.');
    const payload = (await response.json()) as { item: Item };
    setItems((prev) => [...prev, payload.item].sort((a, b) => a.item_name.localeCompare(b.item_name)));
    setForm(blankForm);
    setStatus('Item added.');
  }

  async function saveEdit(item: Item) {
    const response = await fetch('/api/items', { method: 'PATCH', body: JSON.stringify(item) });
    if (!response.ok) return setStatus('Failed to update item.');
    const payload = (await response.json()) as { item: Item };
    setItems((prev) => prev.map((entry) => (entry.id === item.id ? payload.item : entry)).sort((a, b) => a.item_name.localeCompare(b.item_name)));
    setEditingItemId(null);
    setStatus('Item updated.');
  }

  async function removeItem(id: string) {
    const response = await fetch('/api/items', { method: 'DELETE', body: JSON.stringify({ id }) });
    if (!response.ok) return setStatus('Failed to delete item.');
    setItems((prev) => prev.filter((item) => item.id !== id));
    setStatus('Item deleted.');
  }

  return (
    <div className="card space-y-4">
      <h3 className="text-lg font-semibold thematic-title">Item database admin</h3>
      <div className="grid gap-2 md:grid-cols-2">
        <input placeholder="Item name" value={form.item_name} onChange={(e) => setForm((p) => ({ ...p, item_name: e.target.value }))} />
        <input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))} />
      </div>
      <textarea placeholder="Crafting recipe" rows={3} value={form.crafting_recipe} onChange={(e) => setForm((p) => ({ ...p, crafting_recipe: e.target.value }))} />
      <textarea placeholder="Optional notes" rows={2} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
      <button className="btn-primary w-fit" onClick={saveNew} disabled={!form.item_name.trim() || !form.crafting_recipe.trim()}>
        Add item
      </button>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-lg border p-3" style={{ borderColor: 'var(--panel-border)' }}>
            {editingItemId === item.id ? (
              <EditableItem item={item} onCancel={() => setEditingItemId(null)} onSave={saveEdit} />
            ) : (
              <div className="space-y-2">
                <p className="font-semibold">{item.item_name}</p>
                <p className="text-sm"><span className="font-semibold">Crafting:</span> {item.crafting_recipe}</p>
                {item.image_url && <p className="text-xs thematic-subtitle">Image: {item.image_url}</p>}
                <div className="flex gap-2">
                  <button className="btn-secondary" onClick={() => setEditingItemId(item.id)}>Edit</button>
                  <button className="btn-danger" onClick={() => removeItem(item.id)}>Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {status && <p className="text-xs thematic-subtitle">{status}</p>}
    </div>
  );
}

function EditableItem({ item, onCancel, onSave }: { item: Item; onCancel: () => void; onSave: (item: Item) => void }) {
  const [draft, setDraft] = useState(item);

  return (
    <div className="space-y-2">
      <input value={draft.item_name} onChange={(e) => setDraft((p) => ({ ...p, item_name: e.target.value }))} />
      <input value={draft.image_url ?? ''} onChange={(e) => setDraft((p) => ({ ...p, image_url: e.target.value }))} placeholder="Image URL" />
      <textarea value={draft.crafting_recipe} rows={3} onChange={(e) => setDraft((p) => ({ ...p, crafting_recipe: e.target.value }))} />
      <textarea value={draft.notes ?? ''} rows={2} onChange={(e) => setDraft((p) => ({ ...p, notes: e.target.value }))} />
      <div className="flex gap-2">
        <button className="btn-primary" onClick={() => onSave(draft)} disabled={!draft.item_name.trim() || !draft.crafting_recipe.trim()}>
          Save
        </button>
        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
