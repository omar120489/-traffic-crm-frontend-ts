import { useEffect, useMemo, useState } from 'react';
import { SavedView, AnalyticsFilters } from '../../types/saved-view';
import { SavedViewsService, SavedViewList } from '../../services/savedViews.service';

type Props = {
  currentFilters: AnalyticsFilters;
  onApply(filters: AnalyticsFilters, viewId?: string): void;
  onCreate(): void;
  onEdit(view: SavedView): void;
  onDelete(view: SavedView): Promise<void> | void;
};

export default function SavedViewsDropdown({ currentFilters: _currentFilters, onApply, onCreate, onEdit, onDelete }: Props) {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<SavedViewList>({ personal: [], default: [] });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    SavedViewsService.list().then((res) => { if (mounted) { setList(res); setLoading(false); }});
    return () => { mounted = false; };
  }, []);

  const all = useMemo(() => [
    ...(list.default ?? []),
    ...(list.personal ?? []),
  ], [list]);

  return (
    <div className="relative">
      <button onClick={() => setOpen((v)=>!v)}
              className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700"
              aria-haspopup="menu" aria-expanded={open}>
        Saved Views
      </button>

      {open && (
        <div role="menu" className="absolute z-40 mt-2 w-72 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg p-2">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-sm font-medium">Apply a view</span>
            <button onClick={() => { setOpen(false); onCreate(); }}
                    className="text-indigo-600 text-sm hover:underline">+ New</button>
          </div>

          {loading && <div className="px-2 py-3 text-sm opacity-70">Loading…</div>}

          {!loading && all.length === 0 && (
            <div className="px-2 py-3 text-sm opacity-70">No saved views yet.</div>
          )}

          {!loading && all.map((v) => (
            <div key={v.id} className="group flex items-center justify-between gap-2 px-2 py-1 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <button
                data-testid="apply-saved-view"
                className="text-left truncate flex-1"
                onClick={() => { setOpen(false); onApply(v.filters, v.id); }}>
                <div className="text-sm font-medium truncate">{v.name}</div>
                <div className="text-xs opacity-70 truncate">
                  {[
                    v.filters.from && `from ${v.filters.from}`,
                    v.filters.to && `to ${v.filters.to}`,
                    v.filters.users?.length && `${v.filters.users.length} users`,
                    v.filters.types?.length && `${v.filters.types.length} types`,
                  ].filter(Boolean).join(' • ')}
                </div>
              </button>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                <button
                  title="Edit"
                  className="text-xs px-2 py-1 rounded border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  onClick={() => { setOpen(false); onEdit(v); }}>
                  Edit
                </button>
                <button
                  title="Delete"
                  className="text-xs px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={async () => { setOpen(false); await onDelete(v); }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

