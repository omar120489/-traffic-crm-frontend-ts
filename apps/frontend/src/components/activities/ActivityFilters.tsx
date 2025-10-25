import * as React from "react";
import type { ActivityFilters, ActivityType } from "@/types/activity";

export type ActivityFiltersProps = {
  readonly value: ActivityFilters;
  readonly onChange: (next: ActivityFilters) => void;
  readonly typeOptions?: ReadonlyArray<{ readonly label: string; readonly value: string }>;
  readonly userOptions?: ReadonlyArray<{ readonly label: string; readonly value: string }>;
};

export default function ActivityFilters({
  value,
  onChange,
  typeOptions = [
    { label: "All types", value: "" },
    { label: "Call", value: "call" },
    { label: "Email", value: "email" },
    { label: "Meeting", value: "meeting" },
    { label: "Note", value: "note" },
    { label: "Task", value: "task" },
  ],
  userOptions = [{ label: "All users", value: "" }],
}: ActivityFiltersProps) {
  const update = <K extends keyof ActivityFilters>(key: K, v: ActivityFilters[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="grid grid-cols-1 gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-gray-600">Type</span>
        <select
          className="rounded-xl border border-gray-300 px-3 py-2 text-gray-900 outline-none ring-0 focus:border-gray-400"
          value={value.types?.[0] ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            update("types", val ? [val as ActivityType] : undefined);
          }}
        >
          {typeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-gray-600">Assigned To</span>
        <select
          className="rounded-xl border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-400"
          value={value.userId ?? ""}
          onChange={(e) =>
            update("userId", e.target.value || undefined)
          }
        >
          {userOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-gray-600">From</span>
        <input
          type="date"
          className="rounded-xl border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-400"
          value={value.dateFrom ? value.dateFrom.slice(0, 10) : ""}
          onChange={(e) =>
            update("dateFrom", e.target.value ? new Date(e.target.value).toISOString() : undefined)
          }
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-gray-600">To</span>
        <input
          type="date"
          className="rounded-xl border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-400"
          value={value.dateTo ? value.dateTo.slice(0, 10) : ""}
          onChange={(e) =>
            update("dateTo", e.target.value ? new Date(e.target.value).toISOString() : undefined)
          }
        />
      </label>

      <div className="col-span-full">
        <input
          type="search"
          placeholder="Search notes, titles, participants…"
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-400"
          value={value.search ?? ""}
          onChange={(e) => update("search", e.target.value || undefined)}
        />
      </div>
    </div>
  );
}

