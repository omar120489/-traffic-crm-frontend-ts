import { http } from "@/lib/http";
import type { AnalyticsFilters, AnalyticsResponse } from "@/types/analytics";

const BASE = "/api/analytics";

// Mock data for development
const MOCK_DATA: AnalyticsResponse = {
  kpis: {
    totalActivities: 1423,
    activeUsers: 27,
    avgDailyActivities: 47.4,
    medianTimeToFirstResponseMs: 1860000, // 31 minutes
  },
  byDay: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    count: Math.floor(Math.random() * 40) + 30,
  })),
  mix: [
    { type: "email", count: 612, percent: 43.0 },
    { type: "call", count: 423, percent: 29.7 },
    { type: "meeting", count: 245, percent: 17.2 },
    { type: "note", count: 98, percent: 6.9 },
    { type: "task", count: 45, percent: 3.2 },
  ],
  topContributors: [
    { userId: "u_123", name: "A. Rivera", avatarUrl: undefined, count: 188 },
    { userId: "u_456", name: "B. Chen", avatarUrl: undefined, count: 156 },
    { userId: "u_789", name: "C. Johnson", avatarUrl: undefined, count: 134 },
    { userId: "u_012", name: "D. Smith", avatarUrl: undefined, count: 112 },
    { userId: "u_345", name: "E. Williams", avatarUrl: undefined, count: 98 },
  ],
};

// Toggle this to switch between mock and real API
const USE_MOCK_DATA = true;

export async function getAnalytics(f: AnalyticsFilters): Promise<AnalyticsResponse> {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_DATA;
  }

  const params = new URLSearchParams({
    from: f.from,
    to: f.to,
  });
  
  if (f.users && f.users.length > 0) {
    params.set("users", f.users.join(","));
  }
  
  if (f.types && f.types.length > 0) {
    params.set("types", f.types.join(","));
  }

  const { data } = await http.get<AnalyticsResponse>(`${BASE}?${params.toString()}`);
  return data;
}

