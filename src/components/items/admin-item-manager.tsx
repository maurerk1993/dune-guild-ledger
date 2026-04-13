'use client';

import Image from 'next/image';
import { Loader2, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';

type Item = {
  id: string;
  item_name: string;
  item_category: string | null;
  crafting_recipe: string;
  notes: string | null;
  image_url: string | null;
  image_path: string | null;
};

const blankForm = {
  item_name: '',
  item_category: 'Resources',
  crafting_recipe: '',
  notes: '',
  image_url: '',
  image_path: ''
};

export function AdminItemManager({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(blankForm);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function uploadImage(file: File): Promise<{ image_url: string; image_path: string } | null> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/items/images', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      setStatus('Failed to upload image.');
      return null;
    }

    return (await response.json()) as { image_url: string; image_path: string };
  }

  async function removeUploadedImage(imagePath: string) {
    const response = await fetch('/api/items/images', {
      method: 'DELETE',
      body: JSON.stringify({ image_path: imagePath })
    });

    if (!response.ok) {
      setStatus('Failed to delete image.');
      return false;
    }

    return true;
  }

  async function onCreateImagePicked(file: File | undefined) {
    if (!file) return;
    setIsUploading(true);
    const image = await uploadImage(file);
    if (image) {
      setForm((prev) => ({ ...prev, image_url: image.image_url, image_path: image.image_path }));
      setStatus('Image uploaded.');
    }
    setIsUploading(false);
  }

  async function clearCreateImage() {
    if (form.image_path) {
      const removed = await removeUploadedImage(form.image_path);
      if (!removed) return;
    }
    setForm((prev) => ({ ...prev, image_url: '', image_path: '' }));
    setStatus('Image removed.');
  }

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
    const target = items.find((item) => item.id === id);
    if (target?.image_path) await removeUploadedImage(target.image_path);

    const response = await fetch('/api/items', { method: 'DELETE', body: JSON.stringify({ id }) });
    if (!response.ok) return setStatus('Failed to delete item.');
    setItems((prev) => prev.filter((item) => item.id !== id));
    setStatus('Item deleted.');
  }

  return (
    <div className="card space-y-4">
      <h3 className="text-lg font-semibold thematic-title">🏴‍☠️ Item database admin</h3>
      <div className="grid gap-2 md:grid-cols-3">
        <input placeholder="Item name" value={form.item_name} onChange={(e) => setForm((p) => ({ ...p, item_name: e.target.value }))} />
        <input placeholder="Category (e.g. Weapons)" value={form.item_category ?? ''} onChange={(e) => setForm((p) => ({ ...p, item_category: e.target.value }))} />
        <textarea placeholder="Optional notes" rows={2} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
      </div>
      <textarea placeholder="Crafting recipe" rows={3} value={form.crafting_recipe} onChange={(e) => setForm((p) => ({ ...p, crafting_recipe: e.target.value }))} />

      <div className="space-y-2 rounded-lg border p-3" style={{ borderColor: 'var(--panel-border)' }}>
        <p className="text-sm font-semibold">Item photo</p>
        <label className="btn-secondary inline-flex w-fit cursor-pointer items-center gap-2">
          <Upload size={16} aria-hidden="true" />
          {isUploading ? 'Uploading...' : 'Upload image'}
          <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={(e) => void onCreateImagePicked(e.target.files?.[0])} />
        </label>
        {form.image_url && (
          <div className="space-y-2">
            <Image src={form.image_url} alt="Pending upload" width={480} height={240} unoptimized className="h-32 w-full max-w-sm rounded-md object-cover" />
            <button className="btn-danger inline-flex w-fit items-center gap-2" onClick={clearCreateImage}>
              <Trash2 size={15} aria-hidden="true" />
              Remove image
            </button>
          </div>
        )}
      </div>

      <button className="btn-primary w-fit" onClick={saveNew} disabled={!form.item_name.trim() || !form.crafting_recipe.trim() || isUploading}>
        {isUploading ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : null}
        Add item
      </button>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="task-row">
            {editingItemId === item.id ? (
              <EditableItem item={item} onCancel={() => setEditingItemId(null)} onSave={saveEdit} />
            ) : (
              <div className="grid gap-3 md:grid-cols-[1fr,auto] md:items-start">
                <div className="space-y-2">
                  <p className="font-semibold">{item.item_name}</p>
                  <p className="text-xs thematic-subtitle">{item.item_category ?? 'Uncategorized'}</p>
                  <p className="text-sm"><span className="font-semibold">Crafting:</span> {item.crafting_recipe}</p>
                  {item.notes && <p className="text-sm thematic-subtitle whitespace-pre-wrap">{item.notes}</p>}
                  {item.image_url && (
                    <Image src={item.image_url} alt={item.item_name} width={480} height={240} unoptimized className="h-28 w-full max-w-sm rounded-md object-cover" />
                  )}
                </div>
                <div className="flex flex-wrap justify-end gap-2">
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
  const [isUploading, setIsUploading] = useState(false);

  async function upload(file: File | undefined) {
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/items/images', { method: 'POST', body: formData });
    if (response.ok) {
      const payload = (await response.json()) as { image_url: string; image_path: string };
      if (draft.image_path) {
        await fetch('/api/items/images', {
          method: 'DELETE',
          body: JSON.stringify({ image_path: draft.image_path })
        });
      }
      setDraft((prev) => ({ ...prev, image_url: payload.image_url, image_path: payload.image_path }));
    }
    setIsUploading(false);
  }

  async function clearImage() {
    if (!draft.image_path) return;
    const response = await fetch('/api/items/images', {
      method: 'DELETE',
      body: JSON.stringify({ image_path: draft.image_path })
    });
    if (!response.ok) return;
    setDraft((prev) => ({ ...prev, image_url: null, image_path: null }));
  }

  return (
    <div className="space-y-2">
      <input value={draft.item_name} onChange={(e) => setDraft((p) => ({ ...p, item_name: e.target.value }))} />
      <input value={draft.item_category ?? ''} placeholder="Category" onChange={(e) => setDraft((p) => ({ ...p, item_category: e.target.value }))} />
      <textarea value={draft.crafting_recipe} rows={3} onChange={(e) => setDraft((p) => ({ ...p, crafting_recipe: e.target.value }))} />
      <textarea value={draft.notes ?? ''} rows={2} onChange={(e) => setDraft((p) => ({ ...p, notes: e.target.value }))} />
      <div className="flex flex-wrap items-center gap-2">
        <label className="btn-secondary inline-flex cursor-pointer items-center gap-2">
          <Upload size={16} aria-hidden="true" />
          {isUploading ? 'Uploading...' : 'Upload image'}
          <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={(e) => void upload(e.target.files?.[0])} />
        </label>
        {draft.image_url && (
          <button className="btn-danger inline-flex items-center gap-2" onClick={clearImage}>
            <Trash2 size={15} aria-hidden="true" /> Remove image
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="btn-primary" onClick={() => onSave(draft)} disabled={!draft.item_name.trim() || !draft.crafting_recipe.trim() || isUploading}>
          Save
        </button>
        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
