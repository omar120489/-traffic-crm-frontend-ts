# 🚀 Sprint 5 - Analytics Dashboard

**Status**: 🟡 Planning  
**Duration**: 2 weeks  
**Points**: 13  
**Start Date**: October 26, 2025  
**Target Completion**: November 8, 2025

---

## 🎯 **Goals**

### **Primary Objectives**
1. Give GTM/leadership real insight into activity volume, mix, and velocity
2. Ship a fast, lightweight dashboard with zero new dependencies (reuse Tailwind, date-fns)
3. Land v1 with cached server aggregations + client interactivity

### **Success Metrics**
- ✅ Dashboard loads < 2.5s at p95 (warm cache)
- ✅ All charts accessible (keyboard, aria)
- ✅ Filters work & persist in URL
- ✅ 90%+ code coverage (unit/E2E)
- ✅ Zero new high-severity dependencies
- ✅ Zero TypeScript/lint errors

---

## ✅ **Deliverables**

### **1. Dashboard Page** (`/analytics`)

**Features**:
- ✅ KPIs: Total Activities, Active Users, Avg. Daily Activities, Median Time-to-First-Response
- ✅ Charts: Activity by Day (last 30), Activity Mix (type %), Top Contributors (bar)
- ✅ Filters: date range, user/team, activity type
- ✅ URL parameter synchronization
- ✅ Loading states & error handling
- ✅ Empty states
- ✅ Responsive design

### **2. API Endpoints**

**Backend**:
- ✅ `GET /api/analytics` - Aggregated metrics with filters
- ✅ Caching layer (10-min TTL per filter key)
- ✅ Permission scoping (admin/manager/IC)

### **3. Instrumentation**

**Events**:
- ✅ `analytics_viewed` (from, to, users, types)
- ✅ `analytics_filter_changed` (delta)
- ✅ `analytics_chart_hover` (chart, bucket)

### **4. Documentation**

- ✅ Sprint 5 plan
- ✅ Sprint 5 kickoff guide
- ✅ Sprint 5 execution checklist
- ✅ API contract documentation
- ✅ E2E test coverage

---

## 🧱 **Architecture**

### **Routes**

```typescript
// apps/frontend/src/routes/MainRoutes.tsx
{
  path: '/analytics',
  element: <AnalyticsPage />,
}
```

### **Components**

**Page**:
- `apps/frontend/src/pages/analytics/AnalyticsPage.tsx` - Main dashboard page

**Components**:
- `src/components/analytics/KpiStat.tsx` - KPI tile component
- `src/components/analytics/AnalyticsFilters.tsx` - Filter controls
- `src/components/analytics/ActivityByDayChart.tsx` - Line/area chart (SVG)
- `src/components/analytics/ActivityMixChart.tsx` - Donut chart (SVG)
- `src/components/analytics/TopContributorsChart.tsx` - Bar chart (SVG)

**Charts**: Pure SVG + Tailwind (zero new dependencies)

### **Types**

```typescript
// apps/frontend/src/types/analytics.ts
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

### **Service**

```typescript
// apps/frontend/src/services/analytics.service.ts
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

### **API Contract**

**Request**:
```
GET /api/analytics?from=2025-10-01&to=2025-10-31&users=u1,u2&types=call,email
```

**Response**:
```json
{
  "kpis": {
    "totalActivities": 1423,
    "activeUsers": 27,
    "avgDailyActivities": 47.4,
    "medianTimeToFirstResponseMs": 1860000
  },
  "byDay": [
    { "date": "2025-10-01", "count": 52 },
    { "date": "2025-10-02", "count": 48 }
  ],
  "mix": [
    { "type": "email", "count": 612, "percent": 43.0 },
    { "type": "call", "count": 423, "percent": 29.7 },
    { "type": "meeting", "count": 245, "percent": 17.2 },
    { "type": "note", "count": 98, "percent": 6.9 },
    { "type": "task", "count": 45, "percent": 3.2 }
  ],
  "topContributors": [
    { "userId": "u_123", "name": "A. Rivera", "avatarUrl": "https://...", "count": 188 },
    { "userId": "u_456", "name": "B. Chen", "count": 156 }
  ]
}
```

---

## 📊 **Backend Implementation**

### **Aggregation Queries** (Prisma/SQL)

**Activity by Day**:
```sql
SELECT DATE_TRUNC('day', occurred_at)::date AS day, COUNT(*) AS count
FROM activities
WHERE occurred_at >= $1 AND occurred_at < $2
  AND ($3::text[] IS NULL OR created_by_id = ANY($3))
  AND ($4::text[] IS NULL OR type = ANY($4))
GROUP BY 1 ORDER BY 1;
```

**Activity Mix**:
```sql
SELECT type, COUNT(*) AS count
FROM activities
WHERE occurred_at >= $1 AND occurred_at < $2
  AND ($3::text[] IS NULL OR created_by_id = ANY($3))
  AND ($4::text[] IS NULL OR type = ANY($4))
GROUP BY type;
```

**Top Contributors**:
```sql
SELECT created_by_id, COUNT(*) AS count
FROM activities
WHERE occurred_at >= $1 AND occurred_at < $2
  AND ($3::text[] IS NULL OR created_by_id = ANY($3))
  AND ($4::text[] IS NULL OR type = ANY($4))
GROUP BY created_by_id
ORDER BY count DESC
LIMIT 10;
```

**Median Time-to-First-Response**:
```sql
SELECT
  percentile_disc(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (first_response_at - created_at))*1000)
  AS median_ms
FROM conversations
WHERE created_at >= $1 AND created_at < $2;
```

### **Caching Strategy**

- **TTL**: 10-15 minutes per filter key
- **Key Format**: `analytics:{orgId}:{from}:{to}:{users}:{types}`
- **Storage**: Redis or in-memory cache
- **Invalidation**: On activity create/update/delete

### **Permission Scoping**

**Roles**:
- **Admin/Ops**: All org data
- **Manager**: Team scope only
- **IC**: Self + allowed teams

**Enforcement**: Server-side in aggregation queries

---

## 🗂️ **Backlog** (13 pts)

### **FE-ANALYTICS-01: Analytics Page Scaffold** (2 pts)

**Description**: Create route, page shell, and basic layout

**Tasks**:
- [ ] Add `/analytics` route (lazy, protected)
- [ ] Create `AnalyticsPage.tsx` with header
- [ ] Add filters region
- [ ] Add 3-panel grid layout
- [ ] Implement empty state
- [ ] Implement error state
- [ ] Add loading skeletons

**Acceptance Criteria**:
- Page loads at `/analytics`
- Layout is responsive
- Empty state shows when no data
- Error state shows on API failure

---

### **FE-ANALYTICS-02: KPI Tiles & Loading Skeletons** (2 pts)

**Description**: Display 4 KPI metrics with proper formatting

**Tasks**:
- [ ] Create `KpiStat.tsx` component
- [ ] Use semantic `<dl>` markup
- [ ] Format numbers (commas, decimals)
- [ ] Format time durations (ms → human readable)
- [ ] Add loading skeletons
- [ ] Add tooltips for context

**Acceptance Criteria**:
- All 4 KPIs display correctly
- Numbers are formatted properly
- Loading states are smooth
- Accessible (semantic HTML)

---

### **FE-ANALYTICS-03: Activity by Day Chart** (3 pts)

**Description**: Line/area chart showing activity volume over time

**Tasks**:
- [ ] Create `ActivityByDayChart.tsx`
- [ ] Implement pure SVG chart
- [ ] Add hover tooltip
- [ ] Handle gaps (0 counts)
- [ ] Handle empty data
- [ ] Make responsive
- [ ] Add keyboard navigation
- [ ] Add aria labels

**Acceptance Criteria**:
- Chart renders correctly
- Tooltip shows on hover
- Handles edge cases (empty, gaps)
- Responsive on mobile
- Accessible (keyboard, aria)

---

### **FE-ANALYTICS-04: Activity Mix Chart** (2 pts)

**Description**: Donut chart showing activity type distribution

**Tasks**:
- [ ] Create `ActivityMixChart.tsx`
- [ ] Implement pure SVG donut chart
- [ ] Add legend with percentages
- [ ] Make slices keyboard focusable
- [ ] Add tooltips
- [ ] Handle empty data
- [ ] Add color coding by type

**Acceptance Criteria**:
- Donut chart renders correctly
- Legend shows all types with %
- Slices are focusable
- Tooltips work
- Accessible

---

### **FE-ANALYTICS-05: Top Contributors Chart** (2 pts)

**Description**: Horizontal bar chart showing most active users

**Tasks**:
- [ ] Create `TopContributorsChart.tsx`
- [ ] Implement horizontal bars (SVG)
- [ ] Add avatar + name labels
- [ ] Handle long names (truncation)
- [ ] Add tooltips with full info
- [ ] Handle empty data
- [ ] Make responsive

**Acceptance Criteria**:
- Bar chart renders correctly
- Avatars display (or fallback)
- Names truncate properly
- Tooltips show full info
- Responsive

---

### **FE-ANALYTICS-06: Filters + URL Sync** (1 pt)

**Description**: Filter controls with URL parameter synchronization

**Tasks**:
- [ ] Create `AnalyticsFilters.tsx`
- [ ] Add date range picker (from/to)
- [ ] Add user multi-select
- [ ] Add type multi-select
- [ ] Sync filters to URL params
- [ ] Debounce filter changes (300ms)
- [ ] Add "Clear filters" button

**Acceptance Criteria**:
- All filters work
- URL params update on change
- Filters load from URL on mount
- Debounced (no thrashing)
- Clear button works

---

### **BE-ANALYTICS-01: API Aggregations + Caching** (1 pt)

**Description**: Backend endpoint with aggregations and caching

**Tasks**:
- [ ] Create `GET /api/analytics` endpoint
- [ ] Implement 4 aggregation queries
- [ ] Add caching layer (10-min TTL)
- [ ] Add permission scoping
- [ ] Handle filter parameters
- [ ] Add error handling
- [ ] Add logging

**Acceptance Criteria**:
- Endpoint returns correct data
- Caching works (fast responses)
- Permissions enforced
- All filters work
- Errors handled gracefully

---

## 🧪 **Testing**

### **Unit Tests**

**Utilities**:
- [ ] Date bucketing logic
- [ ] Percentage calculations
- [ ] Number formatting
- [ ] Duration formatting

**Components**:
- [ ] KpiStat renders correctly
- [ ] Charts handle empty data
- [ ] Filters update correctly

### **E2E Tests**

**Smoke Tests**:
- [ ] `/analytics` loads successfully
- [ ] KPIs display
- [ ] Charts render
- [ ] Filters update data
- [ ] Tooltips appear on hover
- [ ] Empty state shows when no data
- [ ] Error state shows on API failure

**Performance**:
- [ ] TTI < 2.5s on mid-range laptop
- [ ] API response < 500ms (warm cache)
- [ ] Charts render < 100ms

---

## 🔐 **Permissions**

### **Access Control**

**Authenticated Users Only**:
- Must be logged in to access `/analytics`

**Role-Based Scoping**:
- **Admin/Ops**: See all org data
- **Manager**: See team data only
- **IC**: See self + allowed teams

**Enforcement**:
- Server-side in aggregation queries
- Filter by `orgId` and user scope

---

## 📈 **Instrumentation**

### **Events**

**analytics_viewed**:
```typescript
{
  event: "analytics_viewed",
  properties: {
    from: "2025-10-01",
    to: "2025-10-31",
    users: ["u1", "u2"],
    types: ["call", "email"]
  }
}
```

**analytics_filter_changed**:
```typescript
{
  event: "analytics_filter_changed",
  properties: {
    changed: "dateRange",
    from: "2025-10-01",
    to: "2025-10-31"
  }
}
```

**analytics_chart_hover**:
```typescript
{
  event: "analytics_chart_hover",
  properties: {
    chart: "activityByDay",
    bucket: "2025-10-15",
    count: 52
  }
}
```

---

## ⏱️ **Timeline** (Suggested)

### **Day 1** (Monday)
- [ ] Route, shell, filters
- [ ] Service wire-up
- [ ] Types defined
- [ ] Empty/error states

### **Day 2** (Tuesday)
- [ ] KPIs implementation
- [ ] Activity by Day chart
- [ ] Loading states

### **Day 3** (Wednesday)
- [ ] Activity Mix chart
- [ ] Top Contributors chart
- [ ] Responsive design

### **Day 4** (Thursday)
- [ ] Backend API aggregations
- [ ] Caching layer
- [ ] Permission scoping

### **Day 5** (Friday)
- [ ] E2E tests
- [ ] Performance pass
- [ ] Documentation
- [ ] PR & merge

---

## 📌 **Definition of Done**

### **Functional**
- ✅ `/analytics` loads < 2.5s at p95 (warm)
- ✅ All filters work & persist in URL
- ✅ All charts render correctly
- ✅ Empty states work
- ✅ Error states work

### **Quality**
- ✅ Charts accessible (keyboard, aria)
- ✅ 90%+ code paths covered by tests
- ✅ Zero TypeScript errors
- ✅ Zero linting errors
- ✅ No new high-severity dependencies

### **Documentation**
- ✅ `SPRINT_5_PLAN.md` complete
- ✅ `SPRINT_5_KICKOFF.md` complete
- ✅ `SPRINT_5_EXECUTION_CHECKLIST.md` complete
- ✅ API contract documented
- ✅ E2E tests documented

---

## 🚀 **Ready to Build!**

**Status**: ✅ Planning Complete  
**Next Step**: Kickoff & Scaffold

See `SPRINT_5_KICKOFF.md` for quick start guide!

