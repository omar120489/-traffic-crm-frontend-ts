import { useEffect, useRef, useState } from 'react';
import { AnalyticsFilters, SavedView } from '../../types/saved-view';

type Props = {
  open: boolean;
  mode?: 'create'|'edit';
  initial?: Partial<SavedView>;
  currentFilters: AnalyticsFilters;
  onCancel(): void;
  onSubmit(payload: { name: string; filters: AnalyticsFilters; isDefault: boolean; isShared: boolean }): Promise<void> | void;
};

export default function SaveViewModal({ open, mode='create', initial, currentFilters, onCancel, onSubmit }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [isDefault, setIsDefault] = useState<boolean>(Boolean(initial?.isDefault));
  const [isShared, setIsShared] = useState<boolean>(Boolean(initial?.isShared));
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 30); }, [open]);
  useEffect(() => {
    setName(initial?.name ?? '');
    setIsDefault(Boolean(initial?.isDefault));
    setIsShared(Boolean(initial?.isShared));
  }, [initial, open]);

  if (!open) return null;

  const title = mode === 'edit' ? 'Edit Saved View' : 'Save Current Filters';
  const cta   = mode === 'edit' ? 'Save Changes' : 'Save View';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setSaving(true);
      await onSubmit({ name: name.trim(), filters: initial?.filters ?? currentFilters, isDefault, isShared });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="save-view-title"
         className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <form onSubmit={handleSubmit}
            className="relative w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-xl">
        <h2 id="save-view-title" className="text-lg font-semibold mb-4">{title}</h2>

        <label className="block text-sm mb-1">View name</label>
        <input ref={inputRef} value={name} onChange={(e)=>setName(e.target.value)}
               className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
               placeholder="e.g. Q4 Sales" required />

        <div className="mt-4 flex items-center gap-4">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={isDefault} onChange={(e)=>setIsDefault(e.target.checked)} />
            <span className="text-sm">Default for me</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={isShared} onChange={(e)=>setIsShared(e.target.checked)} />
            <span className="text-sm">Share with team</span>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel}
                  className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800">
            Cancel
          </button>
          <button disabled={saving} className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60">
            {saving ? 'Saving…' : cta}
          </button>
        </div>
      </form>
    </div>
  );
}

