# 🚀 Sprint 5 - Analytics Dashboard - Kickoff Guide

**Sprint**: 5  
**Feature**: Analytics Dashboard  
**Duration**: 2 weeks  
**Points**: 13  
**Start**: October 26, 2025

---

## 🎯 **Sprint Goal**

Build a fast, lightweight analytics dashboard that gives GTM/leadership real insight into activity volume, mix, and velocity—with zero new dependencies.

---

## ✅ **Deliverables**

### **What We're Building**

**Dashboard Page** (`/analytics`):
- ✅ 4 KPI tiles (Total Activities, Active Users, Avg Daily, Median TTF Response)
- ✅ 3 charts (Activity by Day, Activity Mix, Top Contributors)
- ✅ Filters (date range, users, types)
- ✅ URL parameter sync
- ✅ Loading/empty/error states

**Backend**:
- ✅ `GET /api/analytics` endpoint
- ✅ Aggregation queries
- ✅ Caching layer (10-min TTL)
- ✅ Permission scoping

---

## 🏁 **Quick Start** (30 min)

### **1. Environment Setup** (5 min)

```bash
# Navigate to repo
cd /Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516

# Ensure you're on main with latest
git checkout main
git pull origin main

# Install dependencies (if needed)
pnpm install --frozen-lockfile

# Verify everything works
pnpm -w typecheck
pnpm -w lint
```

---

### **2. Create Feature Branch** (2 min)

```bash
# Create and switch to feature branch
git checkout -b feat/s5-analytics-dashboard

# Push to remote
git push -u origin feat/s5-analytics-dashboard
```

---

### **3. Scaffold Project Structure** (10 min)

```bash
# Navigate to frontend
cd apps/frontend

# Create directories
mkdir -p src/pages/analytics
mkdir -p src/components/analytics
mkdir -p src/types
mkdir -p src/services

# Create type file
touch src/types/analytics.ts

# Create service file
touch src/services/analytics.service.ts

# Create page
touch src/pages/analytics/AnalyticsPage.tsx
touch src/pages/analytics/index.ts

# Create components
touch src/components/analytics/KpiStat.tsx
touch src/components/analytics/AnalyticsFilters.tsx
touch src/components/analytics/ActivityByDayChart.tsx
touch src/components/analytics/ActivityMixChart.tsx
touch src/components/analytics/TopContributorsChart.tsx
touch src/components/analytics/index.ts

# Create E2E test
touch e2e/analytics.spec.ts
```

---

### **4. Initial Files** (10 min)

I'll provide the initial code for each file below. Copy-paste to get started quickly!

---

### **5. Start Dev Server** (3 min)

```bash
# Start frontend dev server
pnpm --filter ./apps/frontend run dev

# In another terminal, start backend (if needed)
pnpm --filter ./apps/core-api run start:dev
```

Navigate to: `http://localhost:3000/analytics`

---

## 📁 **Initial Code**

### **Types** (`src/types/analytics.ts`)

```typescript
export type DateISO = string;

export interface AnalyticsFilters {
  readonly from: DateISO;
  readonly to: DateISO;
  readonly users?: readonly string[];
  readonly types?: readonly ("call" | "email" | "meeting" | "note" | "task")[];
}

export interface Kpis {
  readonly totalActivities: number;
  readonly activeUsers: number;
  readonly avgDailyActivities: number;
  readonly medianTimeToFirstResponseMs: number;
}

export interface TimeBucket {
  readonly date: DateISO; // yyyy-mm-dd
  readonly count: number;
}

export interface ActivityMix {
  readonly type: "call" | "email" | "meeting" | "note" | "task";
  readonly count: number;
  readonly percent: number;
}

export interface Contributor {
  readonly userId: string;
  readonly name: string;
  readonly avatarUrl?: string;
  readonly count: number;
}

export interface AnalyticsResponse {
  readonly kpis: Kpis;
  readonly byDay: readonly TimeBucket[];
  readonly mix: readonly ActivityMix[];
  readonly topContributors: readonly Contributor[];
}
```

---

### **Service** (`src/services/analytics.service.ts`)

```typescript
import { http } from "@/lib/http";
import type { AnalyticsFilters, AnalyticsResponse } from "@/types/analytics";

const BASE = "/api/analytics";

export async function getAnalytics(f: AnalyticsFilters): Promise<AnalyticsResponse> {
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
```

---

### **KpiStat Component** (`src/components/analytics/KpiStat.tsx`)

```typescript
export interface KpiStatProps {
  readonly label: string;
  readonly value: string | number;
  readonly loading?: boolean;
  readonly tooltip?: string;
}

export function KpiStat({ label, value, loading, tooltip }: KpiStatProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border p-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
          <div className="h-8 bg-slate-200 rounded w-16"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur" title={tooltip}>
      <dl>
        <dt className="text-sm text-slate-500">{label}</dt>
        <dd className="mt-1 text-2xl font-semibold">{value}</dd>
      </dl>
    </div>
  );
}
```

---

### **Analytics Page** (`src/pages/analytics/AnalyticsPage.tsx`)

```typescript
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { format, subDays } from "date-fns";
import { AppPage } from "@traffic-crm/ui-kit";
import { KpiStat } from "@/components/analytics/KpiStat";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { ActivityByDayChart } from "@/components/analytics/ActivityByDayChart";
import { ActivityMixChart } from "@/components/analytics/ActivityMixChart";
import { TopContributorsChart } from "@/components/analytics/TopContributorsChart";
import { getAnalytics } from "@/services/analytics.service";
import type { AnalyticsResponse, AnalyticsFilters as Filters } from "@/types/analytics";

export default function AnalyticsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize filters from URL or defaults
  const filters: Filters = {
    from: searchParams.get("from") || format(subDays(new Date(), 30), "yyyy-MM-dd"),
    to: searchParams.get("to") || format(new Date(), "yyyy-MM-dd"),
    users: searchParams.get("users")?.split(",").filter(Boolean),
    types: searchParams.get("types")?.split(",").filter(Boolean) as any,
  };

  // Load data
  useEffect(() => {
    setLoading(true);
    setError(null);
    getAnalytics(filters)
      .then(setData)
      .catch((err) => setError(err?.message || "Failed to load analytics"))
      .finally(() => setLoading(false));
  }, [searchParams]);

  // Handle filter changes
  const handleFiltersChange = (newFilters: Filters) => {
    const params = new URLSearchParams();
    params.set("from", newFilters.from);
    params.set("to", newFilters.to);
    if (newFilters.users && newFilters.users.length > 0) {
      params.set("users", newFilters.users.join(","));
    }
    if (newFilters.types && newFilters.types.length > 0) {
      params.set("types", newFilters.types.join(","));
    }
    setSearchParams(params);
  };

  // Format KPI values
  const formatNumber = (n: number) => n.toLocaleString();
  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  return (
    <AppPage
      title="Analytics"
      breadcrumbs={[{ label: "Analytics", href: "/analytics" }]}
    >
      <div className="space-y-6">
        {/* Filters */}
        <AnalyticsFilters value={filters} onChange={handleFiltersChange} />

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-rose-300 bg-rose-50 p-4 text-rose-900">
            <p className="font-medium">Error loading analytics</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* KPIs */}
        <section className="grid gap-4 md:grid-cols-4">
          <KpiStat
            label="Total Activities"
            value={loading ? "—" : formatNumber(data?.kpis.totalActivities || 0)}
            loading={loading}
          />
          <KpiStat
            label="Active Users"
            value={loading ? "—" : formatNumber(data?.kpis.activeUsers || 0)}
            loading={loading}
          />
          <KpiStat
            label="Avg Daily"
            value={loading ? "—" : data?.kpis.avgDailyActivities.toFixed(1) || "0"}
            loading={loading}
          />
          <KpiStat
            label="Median TTF Response"
            value={loading ? "—" : formatDuration(data?.kpis.medianTimeToFirstResponseMs || 0)}
            loading={loading}
            tooltip="Median time to first response"
          />
        </section>

        {/* Charts */}
        {!loading && !error && data && (
          <>
            <section className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ActivityByDayChart data={data.byDay} />
              </div>
              <div>
                <ActivityMixChart data={data.mix} />
              </div>
            </section>

            <section>
              <TopContributorsChart data={data.topContributors} />
            </section>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && data && data.kpis.totalActivities === 0 && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-lg font-medium text-slate-900">No data for this period</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </AppPage>
  );
}
```

---

### **Page Index** (`src/pages/analytics/index.ts`)

```typescript
export { default } from "./AnalyticsPage";
```

---

## 📋 **Daily Workflow**

### **Day 1: Foundation** (Monday)
- [ ] Scaffold structure ✅
- [ ] Add route to `MainRoutes.tsx`
- [ ] Implement `AnalyticsPage.tsx` shell
- [ ] Implement `AnalyticsFilters.tsx`
- [ ] Implement `KpiStat.tsx`
- [ ] Wire up service
- [ ] Test page loads

### **Day 2: Charts Part 1** (Tuesday)
- [ ] Implement `ActivityByDayChart.tsx`
- [ ] Add hover tooltips
- [ ] Handle empty data
- [ ] Make responsive
- [ ] Add accessibility

### **Day 3: Charts Part 2** (Wednesday)
- [ ] Implement `ActivityMixChart.tsx`
- [ ] Implement `TopContributorsChart.tsx`
- [ ] Add legends
- [ ] Add tooltips
- [ ] Make responsive

### **Day 4: Backend** (Thursday)
- [ ] Implement `GET /api/analytics`
- [ ] Add aggregation queries
- [ ] Add caching layer
- [ ] Add permission scoping
- [ ] Test with real data

### **Day 5: Polish & Ship** (Friday)
- [ ] E2E tests
- [ ] Performance optimization
- [ ] Documentation
- [ ] PR review
- [ ] Merge & deploy

---

## 🧪 **Testing Commands**

```bash
# Type check
pnpm -w typecheck

# Lint
pnpm -w lint

# E2E tests
pnpm --filter ./apps/frontend test:e2e

# E2E tests (UI mode)
pnpm --filter ./apps/frontend test:e2e --ui

# Build
pnpm --filter ./apps/frontend run build
```

---

## 📊 **Success Criteria**

**Before merging**:
- ✅ All filters work
- ✅ All charts render
- ✅ Loading states work
- ✅ Empty states work
- ✅ Error states work
- ✅ URL sync works
- ✅ Responsive design
- ✅ Accessible (keyboard, aria)
- ✅ 0 TypeScript errors
- ✅ 0 linting errors
- ✅ E2E tests pass
- ✅ Performance < 2.5s TTI

---

## 📞 **Quick Reference**

### **Key Files**
- `SPRINT_5_PLAN.md` - Detailed plan
- `SPRINT_5_EXECUTION_CHECKLIST.md` - Day-by-day tasks
- `SPRINT_5_QUICK_REFERENCE.md` - One-page overview

### **Key Commands**
```bash
# Start dev
pnpm --filter ./apps/frontend run dev

# Type check
pnpm -w typecheck

# Lint
pnpm -w lint

# Test
pnpm --filter ./apps/frontend test:e2e
```

### **Key URLs**
- Dev: `http://localhost:3000/analytics`
- Docs: `/SPRINT_5_PLAN.md`

---

## 🚀 **Ready to Build!**

**Status**: ✅ Kickoff Complete  
**Next Step**: Start coding!

Follow the daily workflow above and refer to `SPRINT_5_EXECUTION_CHECKLIST.md` for detailed tasks!

**Let's ship this!** 💪

