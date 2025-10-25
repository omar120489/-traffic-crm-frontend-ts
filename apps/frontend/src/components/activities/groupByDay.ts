import { isToday, isYesterday, startOfDay, format } from "date-fns";
import type { Activity } from "@/types/activity";

export type DayGroup = {
  readonly key: string;
  readonly label: string;
  readonly items: readonly Activity[];
};

export function groupByDay(items: readonly Activity[]): readonly DayGroup[] {
  const bucket = new Map<string, Activity[]>();
  
  for (const a of items) {
    const d = startOfDay(new Date(a.createdAt));
    const k = d.toISOString();
    const arr = bucket.get(k) ?? [];
    arr.push(a);
    bucket.set(k, arr);
  }
  
  const groups = [...bucket.entries()]
    .sort((a, b) => (a[0] > b[0] ? -1 : 1)) // newest first
    .map(([iso, list]) => {
      const d = new Date(iso);
      const label = isToday(d) ? "Today" : isYesterday(d) ? "Yesterday" : format(d, "PPP");
      return { key: iso, label, items: list };
    });
  
  return groups;
}

