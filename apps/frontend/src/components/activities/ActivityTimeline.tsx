import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import ActivityItem from "./ActivityItem";
import ActivityFilters from "./ActivityFilters";
import { groupByDay } from "./groupByDay";
import { NewActivityModal } from "./NewActivityModal";
import {
  getActivities,
  getActivityTypeOptions,
  createActivity,
  updateActivity,
  deleteActivity,
} from "@/services/activities.service";
import type { Activity, ActivityFilters as Filters, CreateActivityInput, UpdateActivityInput } from "@/types/activity";

type Row = 
  | { readonly kind: "header"; readonly id: string; readonly label: string }
  | { readonly kind: "item"; readonly id: string; readonly activity: Activity };

type Props = {
  readonly entityType?: Activity["entityType"];
  readonly entityId?: string;
  readonly height?: number; // px height for the scroll container
  readonly pageSize?: number;
};

const DEFAULT_HEIGHT = 560;

export default function ActivityTimeline({
  entityType,
  entityId,
  height = DEFAULT_HEIGHT,
  pageSize = 25,
}: Props) {
  const [filters, setFilters] = React.useState<Filters>(() => ({}));

  const [data, setData] = React.useState<Activity[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [cursor, setCursor] = React.useState<string | undefined>(undefined);
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const [newOpen, setNewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Activity | null>(null);

  // Group activities by day and flatten into rows with headers
  const rows = React.useMemo<Row[]>(() => {
    const groups = groupByDay(data);
    const flat: Row[] = [];
    for (const g of groups) {
      flat.push({ kind: "header", id: `h-${g.key}`, label: g.label });
      for (const a of g.items) {
        flat.push({ kind: "item", id: a.id, activity: a });
      }
    }
    return flat;
  }, [data]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => (rows[i]?.kind === "header" ? 36 : 96),
    overscan: 8,
  });

  const canLoadMore = data.length < total;

  const fetchPage = React.useCallback(
    async (nextCursor?: string, replace = false) => {
      if (!entityType || !entityId) return;
      
      setLoading(true);
      setError(null);
      try {
        const resp = await getActivities(entityType, entityId, filters, nextCursor);

        setTotal(resp.total ?? resp.activities.length);
        setData((prev) => (replace ? [...resp.activities] : [...prev, ...resp.activities]));
        setCursor(resp.cursor);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load activities");
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entityType, entityId, JSON.stringify(filters)]
  );

  // initial & whenever filters change → reset
  React.useEffect(() => {
    fetchPage(undefined, true);
  }, [fetchPage]);

  // infinite loader when near the end
  React.useEffect(() => {
    if (!canLoadMore || loading) return;
    const lastItem = rowVirtualizer.getVirtualItems().at(-1);
    if (!lastItem) return;

    const threshold = data.length - Math.ceil(rowVirtualizer.getOverscan() / 2);
    if (lastItem.index >= threshold) {
      fetchPage(cursor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowVirtualizer.getVirtualItems(), canLoadMore, loading, cursor]);

  // options for filters (type options from service; user options TBD)
  const typeOptions = React.useMemo(() => getActivityTypeOptions(), []);
  const userOptions = React.useMemo(
    () => [{ label: "All users", value: "" }], // plug real users later
    []
  );

  // Handler for opening edit modal
  function openEdit(activity: Activity) {
    setEditing(activity);
    setEditOpen(true);
  }

  // Handler for updating activity with optimistic update
  async function handleUpdate(payload: UpdateActivityInput) {
    // optimistic replace
    const idx = data.findIndex((x) => x.id === payload.id);
    if (idx === -1) return;

    const snapshot = data[idx];
    const provisional: Activity = { ...snapshot, ...payload };

    setData((prev) => {
      const copy = [...prev];
      copy[idx] = provisional;
      return copy;
    });

    try {
      const saved = await updateActivity(payload);
      setData((prev) => {
        const copy = [...prev];
        const j = copy.findIndex((x) => x.id === payload.id);
        if (j !== -1) copy[j] = saved;
        return copy;
      });
    } catch (e) {
      // rollback
      setData((prev) => {
        const copy = [...prev];
        const j = copy.findIndex((x) => x.id === payload.id);
        if (j !== -1) copy[j] = snapshot;
        return copy;
      });
      throw e;
    }
  }

  // Handler for deleting activity with optimistic update
  async function handleDelete(activity: Activity) {
    if (!confirm("Delete this activity? This cannot be undone.")) return;

    // optimistic remove
    const snapshot = data;
    setData((prev) => prev.filter((x) => x.id !== activity.id));
    setTotal((prev) => Math.max(0, prev - 1));

    try {
      await deleteActivity({ id: activity.id });
    } catch (e) {
      // rollback
      setData(snapshot);
      setTotal((prev) => prev + 1);
      throw e;
    }
  }

  // Handler for creating new activity with optimistic update
  async function handleCreate(payload: CreateActivityInput) {
    // Compose payload with the entity from props if not filled by modal
    const composed: CreateActivityInput = {
      ...payload,
      entity: payload.entity ?? entityType,
      entityId: payload.entityId ?? entityId,
      entityType: payload.entityType ?? entityType,
    };

    // optimistic shell
    const temp: Activity = {
      id: `tmp_${Date.now()}`,
      type: composed.type,
      title: composed.title,
      content: composed.content,
      notes: composed.notes,
      dueAt: composed.dueAt,
      createdAt: new Date().toISOString(),
      createdBy: { id: "me", name: "You", avatarUrl: undefined },
      participants: (composed.participants || []).map((p, i) => ({
        id: `${i}_${p}`,
        name: p,
        email: p.includes("@") ? p : undefined,
      })),
      entity: composed.entity,
      entityType: composed.entityType ?? composed.entity ?? 'contact',
      entityId: composed.entityId ?? '',
    };

    // Optimistically add to the top of the list
    setData((prev) => [temp, ...prev]);
    setTotal((prev) => prev + 1);

    // Scroll to top to show new activity
    parentRef.current?.scrollTo({ top: 0, behavior: "smooth" });

    // server (or mock) create
    try {
      const saved = await createActivity(composed);
      // replace temp with saved (match by id)
      setData((prev) => {
        const idx = prev.findIndex((x) => x.id === temp.id);
        if (idx === -1) return [saved, ...prev]; // fallback
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      });
    } catch (e) {
      // revert temp if failed
      setData((prev) => prev.filter((x) => x.id !== temp.id));
      setTotal((prev) => Math.max(0, prev - 1));
      throw e;
    }
  }

  return (
    <section className="flex flex-col gap-4" data-testid="activity-timeline">
      <ActivityFilters
        value={filters}
        onChange={(next) => {
          setFilters(next);
        }}
        typeOptions={[{ label: "All types", value: "" }, ...typeOptions.map(opt => ({ label: opt.label, value: opt.value }))]}
        userOptions={userOptions}
      />

      <div
        ref={parentRef}
        role="feed"
        aria-busy={loading}
        aria-label="Activity timeline"
        className="relative overflow-auto rounded-2xl border border-gray-200 bg-gray-50"
        style={{ height }}
      >
        <div
          style={{ height: rowVirtualizer.getTotalSize() }}
          className="relative"
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <div
                key={row?.id ?? virtualRow.key}
                className="absolute left-0 right-0 px-3 py-2"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row?.kind === "header" ? (
                  <div className="sticky top-0 z-10 mb-1 bg-gray-50/80 px-1 text-xs font-semibold uppercase tracking-wide text-gray-500 backdrop-blur">
                    {row.label}
                  </div>
                ) : row?.kind === "item" && row.activity ? (
                  <ActivityItem 
                    activity={row.activity} 
                    onEdit={openEdit}
                    onDelete={handleDelete}
                  />
                ) : (
                  <SkeletonRow />
                )}
              </div>
            );
          })}
        </div>

        {loading && data.length === 0 && (
          <EmptyState label="Loading activities…" />
        )}
        {!loading && data.length === 0 && !error && (
          <EmptyState label="No activities found." />
        )}
        {error && <ErrorState message={error} />}
      </div>

      {/* Floating Action Button */}
      <button
        aria-label="New activity"
        onClick={() => setNewOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white shadow-lg transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        +
      </button>

      {/* New Activity Modal */}
      <NewActivityModal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        mode="create"
        onCreate={handleCreate}
        entity={entityType ?? "company"}
        entityId={entityId ?? "company-1"}
      />

      {/* Edit Activity Modal */}
      <NewActivityModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        activityId={editing?.id}
        initial={{
          type: editing?.type,
          title: editing?.title,
          notes: editing?.notes,
          dueAt: editing?.dueAt,
          participants: editing?.participants?.map((p) => p.email ?? p.name) ?? [],
        }}
        onUpdate={handleUpdate}
        entity={entityType ?? "company"}
        entityId={entityId ?? "company-1"}
      />
    </section>
  );
}

function SkeletonRow() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4">
      <div className="mb-3 h-4 w-1/3 rounded bg-gray-200" />
      <div className="mb-2 h-3 w-2/3 rounded bg-gray-200" />
      <div className="h-3 w-1/2 rounded bg-gray-200" />
    </div>
  );
}

function EmptyState({ label }: { readonly label: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function ErrorState({ message }: { readonly message: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        {message}
      </div>
    </div>
  );
}

