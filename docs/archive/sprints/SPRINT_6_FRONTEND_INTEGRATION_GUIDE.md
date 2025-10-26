# 🎯 Sprint 6 Frontend Integration Guide

**Status**: 🟢 **COMPONENTS READY**  
**Next**: Wire into `AnalyticsPage.tsx`

---

## ✅ **WHAT'S BEEN CREATED**

### **1. Types** ✅
- `apps/frontend/src/types/saved-view.ts`
  - `AnalyticsFilters` type
  - `SavedView` interface

### **2. Service** ✅
- `apps/frontend/src/services/savedViews.service.ts`
  - `SavedViewsService.list()` - Get all views
  - `SavedViewsService.get(id)` - Get single view
  - `SavedViewsService.create(payload)` - Create view
  - `SavedViewsService.update(id, payload)` - Update view
  - `SavedViewsService.remove(id)` - Delete view

### **3. Components** ✅
- `apps/frontend/src/components/analytics/SaveViewModal.tsx`
  - Create/edit modal for saved views
  - Supports default and shared flags
  
- `apps/frontend/src/components/analytics/SavedViewsDropdown.tsx`
  - Dropdown to apply/edit/delete saved views
  - Shows personal + default views
  
- `apps/frontend/src/components/analytics/DrillDownPanel.tsx`
  - Side panel for drill-down details
  - Shows filtered activities
  - Deep link to Activities page

---

## 🔌 **INTEGRATION STEPS**

### **Step 1: Update AnalyticsPage.tsx**

Add these imports at the top:

```typescript
import { useCallback, useState } from 'react';
import SavedViewsDropdown from '../../components/analytics/SavedViewsDropdown';
import SaveViewModal from '../../components/analytics/SaveViewModal';
import DrillDownPanel from '../../components/analytics/DrillDownPanel';
import { SavedViewsService } from '../../services/savedViews.service';
import { SavedView, AnalyticsFilters } from '../../types/saved-view';
```

Add state for saved views UI:

```typescript
// Inside AnalyticsPage component
const [saveOpen, setSaveOpen] = useState(false);
const [editView, setEditView] = useState<SavedView | null>(null);
```

Add state for drill-down UI:

```typescript
const [drillOpen, setDrillOpen] = useState(false);
const [drillTitle, setDrillTitle] = useState('Details');
const [drillFilters, setDrillFilters] = useState<{day?: string; type?: any; userId?: string}>({});
```

Add handlers for saved views:

```typescript
const onApplySaved = useCallback((f: AnalyticsFilters, viewId?: string) => {
  setFilters(f);
  // Optional: Show toast notification
  console.log('Applied saved view:', viewId);
}, []);

const onCreateView = useCallback(() => setSaveOpen(true), []);

const onEditView = useCallback((v: SavedView) => {
  setEditView(v);
  setSaveOpen(true);
}, []);

const onDeleteView = useCallback(async (v: SavedView) => {
  if (!confirm(`Delete view "${v.name}"?`)) return;
  await SavedViewsService.remove(v.id);
  // Optional: Show toast notification
  console.log('Deleted view:', v.id);
}, []);

const handleSubmitSave = useCallback(async (payload: {
  name: string;
  filters: AnalyticsFilters;
  isDefault: boolean;
  isShared: boolean;
}) => {
  if (editView) {
    await SavedViewsService.update(editView.id, payload);
    console.log('Updated view:', editView.id);
  } else {
    await SavedViewsService.create(payload);
    console.log('Created view');
  }
  setSaveOpen(false);
  setEditView(null);
}, [editView]);
```

Add handlers for drill-downs:

```typescript
const onDayClick = useCallback((dayISO: string) => {
  setDrillTitle(`Activities on ${dayISO}`);
  setDrillFilters({ day: dayISO });
  setDrillOpen(true);
}, []);

const onTypeClick = useCallback((type: 'call'|'email'|'meeting'|'note'|'task') => {
  setDrillTitle(`Activities: ${type}`);
  setDrillFilters({ type });
  setDrillOpen(true);
}, []);

const onUserClick = useCallback((userId: string) => {
  setDrillTitle(`Activities by user`);
  setDrillFilters({ userId });
  setDrillOpen(true);
}, []);
```

Add components to JSX (in the top bar):

```typescript
<div className="flex flex-wrap items-center justify-between gap-2">
  {/* Existing filters component */}
  <div className="flex items-center gap-2">
    {/* Your existing AnalyticsFilters component */}
  </div>
  
  {/* NEW: Saved Views Dropdown */}
  <SavedViewsDropdown
    currentFilters={filters}
    onApply={onApplySaved}
    onCreate={onCreateView}
    onEdit={onEditView}
    onDelete={onDeleteView}
  />
</div>
```

Add modals at the end of the component:

```typescript
{/* At the end of the return statement, before closing </div> */}

<SaveViewModal
  open={saveOpen}
  mode={editView ? 'edit' : 'create'}
  initial={editView ?? undefined}
  currentFilters={filters}
  onCancel={() => {
    setSaveOpen(false);
    setEditView(null);
  }}
  onSubmit={handleSubmitSave}
/>

<DrillDownPanel
  open={drillOpen}
  onClose={() => setDrillOpen(false)}
  title={drillTitle}
  derivedFilters={drillFilters}
/>
```

---

### **Step 2: Add Click Handlers to Charts**

#### **ActivityByDayChart.tsx**

Add prop:
```typescript
type Props = {
  data: Array<{ date: string; count: number }>;
  onPointClick?: (dayISO: string) => void;
  // ...existing props
};
```

Add click handler to point elements:
```typescript
<button
  data-testid="chart-day-point"
  aria-label={`Open details for ${d.date}`}
  onClick={() => onPointClick?.(d.date)}
  className="absolute -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-indigo-500 hover:bg-indigo-600 cursor-pointer"
/>
```

Pass handler from AnalyticsPage:
```typescript
<ActivityByDayChart
  data={activityByDayData}
  onPointClick={onDayClick}
/>
```

---

#### **ActivityMixChart.tsx**

Add prop:
```typescript
type Props = {
  data: Array<{ type: 'call'|'email'|'meeting'|'note'|'task'; count: number; percent: number }>;
  onSliceClick?: (type: Props['data'][number]['type']) => void;
  // ...existing props
};
```

Add click handler to slice elements:
```typescript
<button
  data-testid="chart-mix-slice"
  onClick={() => onSliceClick?.(slice.type)}
  aria-label={`Open ${slice.type} details`}
  className="cursor-pointer hover:opacity-80"
>
  {/* slice path */}
</button>
```

Pass handler from AnalyticsPage:
```typescript
<ActivityMixChart
  data={activityMixData}
  onSliceClick={onTypeClick}
/>
```

---

#### **TopContributorsChart.tsx**

Add prop:
```typescript
type Props = {
  data: Array<{ userId: string; name: string; count: number; avatarUrl?: string }>;
  onBarClick?: (userId: string) => void;
  // ...existing props
};
```

Add click handler to bar elements:
```typescript
<button
  data-testid="chart-user-bar"
  onClick={() => onBarClick?.(row.userId)}
  aria-label={`Open ${row.name} details`}
  className="cursor-pointer hover:opacity-80"
>
  {/* bar rect */}
</button>
```

Pass handler from AnalyticsPage:
```typescript
<TopContributorsChart
  data={topContributorsData}
  onBarClick={onUserClick}
/>
```

---

## 🧪 **TESTING**

### **Manual Testing**

1. **Saved Views**:
   - Click "Saved Views" button
   - Click "+ New" to create a view
   - Enter name "Test View"
   - Click "Save View"
   - Verify view appears in dropdown
   - Click view to apply filters
   - Hover over view and click "Edit"
   - Change name and save
   - Hover over view and click "Delete"

2. **Drill-Downs**:
   - Click a point on Activity by Day chart
   - Verify side panel opens with title "Activities on YYYY-MM-DD"
   - Verify activities are shown
   - Click "Close" to close panel
   - Click a slice on Activity Mix chart
   - Verify panel opens with title "Activities: {type}"
   - Click a bar on Top Contributors chart
   - Verify panel opens with title "Activities by user"

### **E2E Tests**

Create these test files:

1. `apps/frontend/e2e/saved-views.spec.ts`
2. `apps/frontend/e2e/drill-downs.spec.ts`

See `SPRINT_6_E2E_TESTS.md` for test implementations.

---

## 🚨 **TROUBLESHOOTING**

### **401 Unauthorized**
```bash
# Make sure JWT token is set in cookies or headers
# Check browser DevTools > Application > Cookies
```

### **404 /api/saved-views**
```bash
# Backend not running or module not wired
cd apps/core-api
pnpm run start:dev
```

### **TypeScript Errors**
```bash
# Run typecheck
cd apps/frontend
pnpm run typecheck
```

### **Import Path Issues**
If you see import errors, adjust paths:
- Change `../../types/saved-view` to `@/types/saved-view` (if using alias)
- Change `../../services/savedViews.service` to `@/services/savedViews.service`

---

## 📊 **PROGRESS TRACKING**

### **Sprint 6: Saved Views + Drill-Downs (12 pts)**

**Day 1: Backend** (2 pts) ✅
- [x] Prisma model
- [x] Migration
- [x] NestJS module
- [x] Test endpoints

**Day 2: Frontend Saved Views** (3 pts)
- [x] Types
- [x] Service
- [x] SaveViewModal component
- [x] SavedViewsDropdown component
- [ ] Wire into AnalyticsPage
- [ ] Manual testing

**Day 3: Drill-Downs** (3 pts)
- [x] DrillDownPanel component
- [ ] Add click handlers to charts
- [ ] Wire into AnalyticsPage
- [ ] Manual testing

**Day 4: E2E Tests** (2 pts)
- [ ] saved-views.spec.ts
- [ ] drill-downs.spec.ts
- [ ] Run full suite

**Day 5: Polish & Ship** (2 pts)
- [ ] Loading states
- [ ] Toast notifications
- [ ] Mobile responsive
- [ ] Accessibility audit
- [ ] Create PR
- [ ] Merge & tag v6.0.0

---

## 🎯 **NEXT STEPS**

1. **Wire components into AnalyticsPage** (follow Step 1 above)
2. **Add chart click handlers** (follow Step 2 above)
3. **Test manually** (follow Testing section)
4. **Report results** (see below)

---

## 📋 **REPORT TEMPLATE**

After integration, report:

```
✅ Saved Views
- Dropdown renders: Yes/No
- Create view works: Yes/No
- Apply view works: Yes/No
- Edit view works: Yes/No
- Delete view works: Yes/No
- Any errors: Yes/No

✅ Drill-Downs
- Day click works: Yes/No
- Type click works: Yes/No
- User click works: Yes/No
- Panel opens/closes: Yes/No
- Deep link works: Yes/No
- Any errors: Yes/No
```

---

**Status**: ✅ **COMPONENTS READY**  
**Next**: Wire into AnalyticsPage and test!

