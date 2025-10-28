import { useEffect, useState } from 'react';

interface Activity {
  readonly id: string;
  readonly type: string;
  readonly subject: string;
  readonly createdAt: string;
}

type Props = {
  open: boolean;
  onClose(): void;
  title: string;
  entityType?: 'company' | 'contact' | 'deal';
  entityId?: string;
  derivedFilters?: {
    day?: string; // YYYY-MM-DD
    type?: 'call' | 'email' | 'meeting' | 'note' | 'task';
    userId?: string;
  };
};

export default function DrillDownPanel({ open, onClose, title, derivedFilters }: Props) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    // TODO: Fetch activities based on derivedFilters
    // For now, mock data
    setTimeout(() => {
      setActivities([
        { id: '1', type: 'email', subject: 'Follow-up email', createdAt: '2025-10-25T10:00:00Z' },
        { id: '2', type: 'call', subject: 'Discovery call', createdAt: '2025-10-25T11:00:00Z' },
        { id: '3', type: 'meeting', subject: 'Demo meeting', createdAt: '2025-10-25T14:00:00Z' }
      ]);
      setLoading(false);
    }, 500);
  }, [open, derivedFilters]);

  return (
    <div aria-hidden={!open} className={`fixed inset-0 z-40 ${open ? '' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      {/* Panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white dark:bg-zinc-900 shadow-xl
                        transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            Close
          </button>
        </header>
        <div className="h-[calc(100%-3rem)] overflow-y-auto p-4">
          {loading && (
            <div className="flex items-center justify-center h-32">
              <div className="text-sm opacity-70">Loading activities...</div>
            </div>
          )}
          {!loading && activities.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <div className="text-sm opacity-70">No activities found</div>
            </div>
          )}
          {!loading &&
            activities.map((activity) => (
              <div
                key={activity.id}
                className="mb-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                    {activity.type}
                  </span>
                  <span className="text-xs opacity-70">
                    {new Date(activity.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm font-medium">{activity.subject}</div>
              </div>
            ))}
          {!loading && activities.length > 0 && (
            <div className="mt-4 text-center">
              <a
                href={`/activities?${new URLSearchParams(derivedFilters as Record<string, string>).toString()}`}
                className="text-sm text-indigo-600 hover:underline"
              >
                View all in Activities →
              </a>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
