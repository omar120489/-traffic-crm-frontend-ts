import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import ActivityItem from "./ActivityItem";
import ActivityFilters from "./ActivityFilters";
import { groupByDay } from "./groupByDay";
import {
  getActivities,
  getActivityTypeOptions,
} from "@/services/activities.service";
import type { Activity, ActivityFilters as Filters } from "@/types/activity";

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
                  <ActivityItem activity={row.activity} />
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

