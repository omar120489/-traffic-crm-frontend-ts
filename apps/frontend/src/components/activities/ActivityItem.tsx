import { format, formatDistanceToNow } from "date-fns";
import * as React from "react";
import type { Activity } from "@/types/activity";

type Props = {
  readonly activity: Activity;
};

const typeEmoji: Record<Activity["type"], string> = {
  call: "📞",
  email: "✉️",
  meeting: "📅",
  note: "📝",
  task: "✅",
};

export default function ActivityItem({ activity }: Props) {
  const createdAt = new Date(activity.createdAt);

  return (
    <article
      className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
      data-testid={`activity-item-${activity.id}`}
    >
      <div className="mt-1 text-xl">{typeEmoji[activity.type] ?? "📝"}</div>

      <div className="min-w-0 flex-1">
        {/* Header: title + relative time */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="truncate text-sm font-semibold text-gray-900">
            {activity.title ?? activity.content?.split('\n')[0] ?? activity.type.toUpperCase()}
          </h3>
          <time
            className="shrink-0 whitespace-nowrap text-xs text-gray-500"
            title={format(createdAt, "PPpp")}
            dateTime={createdAt.toISOString()}
          >
            {formatDistanceToNow(createdAt, { addSuffix: true })}
          </time>
        </div>

        {/* Meta */}
        <p className="mt-1 line-clamp-3 text-sm text-gray-700">
          {activity.notes ?? activity.content ?? "—"}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          {(activity.user || activity.createdBy) && (
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-5 w-5 overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200">
                {(activity.user?.avatar || activity.createdBy?.avatarUrl) ? (
                  <img
                    src={activity.user?.avatar ?? activity.createdBy?.avatarUrl}
                    alt={activity.user?.name ?? activity.createdBy?.name ?? "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center text-[10px]">
                    {(activity.user?.name ?? activity.createdBy?.name)?.[0] ?? "U"}
                  </span>
                )}
              </span>
              <span className="truncate">{activity.user?.name ?? activity.createdBy?.name}</span>
            </span>
          )}
          <span>•</span>
          <span className="uppercase tracking-wide text-gray-600">
            {activity.type}
          </span>
          {activity.entityType && activity.entityId && (
            <>
              <span>•</span>
              <span className="truncate">
                {activity.entityType}: {activity.entityId}
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

