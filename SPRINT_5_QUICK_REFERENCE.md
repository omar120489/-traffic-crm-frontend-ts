# 📋 Sprint 5 - Analytics Dashboard - Quick Reference

**One-page overview for fast lookups**

---

## 🎯 **Goal**

Build a fast, lightweight analytics dashboard (zero new deps) showing activity volume, mix, and velocity.

---

## ✅ **Deliverables** (13 pts)

| **Ticket** | **Description** | **Pts** |
|------------|-----------------|---------|
| FE-ANALYTICS-01 | Page scaffold + route | 2 |
| FE-ANALYTICS-02 | KPI tiles + skeletons | 2 |
| FE-ANALYTICS-03 | Activity by Day chart | 3 |
| FE-ANALYTICS-04 | Activity Mix chart | 2 |
| FE-ANALYTICS-05 | Top Contributors chart | 2 |
| FE-ANALYTICS-06 | Filters + URL sync | 1 |
| BE-ANALYTICS-01 | API + caching | 1 |

---

## ⏱️ **Timeline**

| **Day** | **Focus** | **Pts** |
|---------|-----------|---------|
| 1 | Foundation (route, page, filters, KPIs) | 2 |
| 2 | Activity by Day chart | 3 |
| 3 | Mix + Contributors charts | 4 |
| 4 | Backend API + caching | 1 |
| 5 | Integration + E2E tests | 3 |
| 6-10 | Polish, review, merge | - |

---

## 📊 **API Reference**

### **Endpoint**

```
GET /api/analytics?from=2025-10-01&to=2025-10-31&users=u1,u2&types=call,email
```

### **Response**

```json
{
  "kpis": {
    "totalActivities": 1423,
    "activeUsers": 27,
    "avgDailyActivities": 47.4,
    "medianTimeToFirstResponseMs": 1860000
  },
  "byDay": [
    { "date": "2025-10-01", "count": 52 }
  ],
  "mix": [
    { "type": "email", "count": 612, "percent": 43.0 }
  ],
  "topContributors": [
    { "userId": "u_123", "name": "A. Rivera", "count": 188 }
  ]
}
```

---

## 🏗️ **Architecture**

### **Files to Create**

**Types**:
- `src/types/analytics.ts`

**Services**:
- `src/services/analytics.service.ts`

**Components**:
- `src/components/analytics/KpiStat.tsx`
- `src/components/analytics/AnalyticsFilters.tsx`
- `src/components/analytics/ActivityByDayChart.tsx`
- `src/components/analytics/ActivityMixChart.tsx`
- `src/components/analytics/TopContributorsChart.tsx`
- `src/components/analytics/index.ts`

**Pages**:
- `src/pages/analytics/AnalyticsPage.tsx`
- `src/pages/analytics/index.ts`

**Tests**:
- `e2e/analytics.spec.ts`

**Backend**:
- `apps/core-api/src/modules/analytics/analytics.controller.ts`
- `apps/core-api/src/modules/analytics/analytics.service.ts`
- `apps/core-api/src/modules/analytics/analytics.module.ts`

---

## 🚀 **Quick Commands**

### **Setup**

```bash
# Create branch
git checkout -b feat/s5-analytics-dashboard

# Scaffold structure
cd apps/frontend
mkdir -p src/pages/analytics src/components/analytics
touch src/types/analytics.ts
touch src/services/analytics.service.ts
```

### **Development**

```bash
# Start dev server
pnpm --filter ./apps/frontend run dev

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

### **Git**

```bash
# Commit
git add -A
git commit -m "feat(sprint5): [description]"
git push origin feat/s5-analytics-dashboard

# Create PR
gh pr create --title "feat: Analytics Dashboard (Sprint 5)" --body-file SPRINT_5_PLAN.md
```

---

## 📋 **Definition of Done**

### **Functional**
- ✅ `/analytics` loads < 2.5s at p95 (warm)
- ✅ All filters work & persist in URL
- ✅ All charts render correctly
- ✅ Empty states work
- ✅ Error states work

### **Quality**
- ✅ Charts accessible (keyboard, aria)
- ✅ 90%+ code coverage
- ✅ 0 TypeScript errors
- ✅ 0 linting errors
- ✅ No new high-severity dependencies

### **Documentation**
- ✅ Sprint plan complete
- ✅ API contract documented
- ✅ E2E tests documented

---

## 🎨 **Component Snippets**

### **KpiStat**

```typescript
<KpiStat
  label="Total Activities"
  value={formatNumber(data?.kpis.totalActivities || 0)}
  loading={loading}
  tooltip="Total number of activities in this period"
/>
```

### **AnalyticsFilters**

```typescript
<AnalyticsFilters
  value={filters}
  onChange={handleFiltersChange}
/>
```

### **Charts**

```typescript
<ActivityByDayChart data={data.byDay} />
<ActivityMixChart data={data.mix} />
<TopContributorsChart data={data.topContributors} />
```

---

## 🔐 **Permissions**

| **Role** | **Access** |
|----------|------------|
| Admin/Ops | All org data |
| Manager | Team scope only |
| IC | Self + allowed teams |

**Enforcement**: Server-side in aggregation queries

---

## 📈 **Performance Targets**

| **Metric** | **Target** |
|------------|------------|
| TTI | < 2.5s (p95) |
| API Response | < 500ms (warm cache) |
| Chart Render | < 100ms |
| Cache TTL | 10-15 min |

---

## 🧪 **Testing Checklist**

### **E2E Tests**
- [ ] Page loads successfully
- [ ] KPIs display
- [ ] Charts render
- [ ] Filters update data
- [ ] Tooltips appear
- [ ] Empty state shows
- [ ] Error state shows

### **Manual QA**
- [ ] Test on mobile
- [ ] Test on tablet
- [ ] Test on desktop
- [ ] Test with large datasets
- [ ] Test with empty data
- [ ] Test with API errors
- [ ] Test keyboard navigation
- [ ] Test screen reader

---

## 🚨 **Common Issues**

### **Charts not rendering**
- Check data format matches types
- Check SVG viewBox dimensions
- Check for NaN values

### **Filters not working**
- Check URL params are updating
- Check debounce is working
- Check API is receiving params

### **Performance issues**
- Check caching is enabled
- Check query optimization
- Check data size

---

## 📞 **Team Roles**

| **Role** | **Owner** | **Responsibilities** |
|----------|-----------|----------------------|
| Frontend | You | Page, components, charts |
| Backend | TBD | API, aggregations, caching |
| QA | TBD | E2E tests, manual testing |
| PM | TBD | Requirements, acceptance |

---

## 📄 **Documentation Links**

- **Detailed Plan**: `SPRINT_5_PLAN.md`
- **Kickoff Guide**: `SPRINT_5_KICKOFF.md`
- **Execution Checklist**: `SPRINT_5_EXECUTION_CHECKLIST.md`
- **Sprint 4 Summary**: `SPRINT_4_FINAL_SUMMARY.md`

---

## 🎯 **Success Metrics**

| **Metric** | **Target** | **Actual** |
|------------|------------|------------|
| Story Points | 13 | ___ |
| Velocity | 100% | ___% |
| TypeScript Errors | 0 | ___ |
| Linting Errors | 0 | ___ |
| E2E Tests | 100% pass | ___% |
| Performance (TTI) | < 2.5s | ___s |

---

## 🚀 **Quick Start**

```bash
# 1. Create branch
git checkout -b feat/s5-analytics-dashboard

# 2. Scaffold structure
cd apps/frontend
mkdir -p src/pages/analytics src/components/analytics

# 3. Copy initial code from SPRINT_5_KICKOFF.md

# 4. Add route to MainRoutes.tsx

# 5. Start dev server
pnpm --filter ./apps/frontend run dev

# 6. Navigate to http://localhost:3000/analytics

# 7. Start building! 💪
```

---

## 🎉 **Ready to Build!**

**Status**: ✅ Ready to Start  
**Next Step**: Follow `SPRINT_5_KICKOFF.md`

**Let's ship this!** 🚢

