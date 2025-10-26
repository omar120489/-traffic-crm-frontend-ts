# 🎯 Sprint 6 Plan: Saved Views + Drill-Downs

**Status**: 📋 **READY TO START**  
**Story Points**: 12/12  
**Duration**: 1 week  
**Dependencies**: Sprint 5 (Analytics Dashboard) ✅

---

## 🎯 **Sprint Goal**

Enhance Analytics Dashboard with saved filter views and interactive drill-down capabilities, enabling users to save custom views and explore detailed activity data directly from charts.

---

## 📊 **Deliverables**

### **1. Saved Views (6 pts)**

**User Story**: As a user, I want to save my filter configurations so I can quickly access my most-used analytics views.

**Features**:
- ✅ Save current filters as named view
- ✅ Apply saved views from dropdown
- ✅ Default team views (admin-created, read-only)
- ✅ Personal views (user-created, editable)
- ✅ Share views via URL (`/analytics?view=sales-weekly`)
- ✅ Edit/delete personal views
- ✅ View metadata (created by, created at, last used)

**Technical**:
- Backend: `SavedView` model + CRUD endpoints
- Frontend: `SavedViewsService`, modal, dropdown
- URL routing: `/analytics?view={viewId}`
- Permissions: Owner can edit/delete, others read-only

---

### **2. Drill-Downs (4 pts)**

**User Story**: As a user, I want to click on chart elements to see detailed activity data, so I can investigate trends and outliers.

**Features**:
- ✅ Click chart slice/bar/point → open side panel
- ✅ Side panel shows filtered Activity Timeline
- ✅ Deep link to `/activities?...` with filters applied
- ✅ Preserve chart selection in URL
- ✅ Close panel returns to Analytics Dashboard

**Technical**:
- Chart click handlers (Activity by Day, Mix, Top Contributors)
- Side panel component with Activity Timeline
- URL parameter mapping (chart selection → activity filters)
- State management for panel open/close

---

### **3. Polish & QA (2 pts)**

**Features**:
- ✅ Loading states for save/load views
- ✅ Toast notifications (view saved, applied, deleted)
- ✅ Cache hit rate surfacing (optional badge)
- ✅ E2E tests for saved views
- ✅ E2E tests for drill-downs
- ✅ Mobile responsive (panel as full-screen on mobile)

---

## 🏗️ **Architecture**

### **Backend (NestJS + Prisma)**

#### **Database Schema**
```prisma
model SavedView {
  id        String   @id @default(cuid())
  orgId     String
  userId    String
  name      String
  filters   Json     // { from, to, users, types }
  isDefault Boolean  @default(false)
  isShared  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([orgId, userId, name])
  @@index([orgId, userId])
  @@index([orgId, isDefault])
}
```

#### **API Endpoints**
```
GET    /api/saved-views              # List user's views + default views
GET    /api/saved-views/:id          # Get single view
POST   /api/saved-views              # Create view
PATCH  /api/saved-views/:id          # Update view
DELETE /api/saved-views/:id          # Delete view
GET    /api/saved-views/default      # List default/shared views
```

#### **Request/Response Types**
```typescript
// Request
interface CreateSavedViewDto {
  name: string;
  filters: AnalyticsFilters;
  isDefault?: boolean; // Admin only
  isShared?: boolean;
}

// Response
interface SavedView {
  id: string;
  name: string;
  filters: AnalyticsFilters;
  isDefault: boolean;
  isShared: boolean;
  createdBy: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}
```

---

### **Frontend (React + TypeScript)**

#### **Components**
```
apps/frontend/src/components/analytics/
├── SavedViewsDropdown.tsx       # Apply saved view
├── SaveViewModal.tsx            # Create/edit view
├── DrillDownPanel.tsx           # Side panel with Activity Timeline
└── index.ts                     # Barrel export
```

#### **Services**
```typescript
// apps/frontend/src/services/saved-views.service.ts
export async function listSavedViews(): Promise<SavedView[]>
export async function getSavedView(id: string): Promise<SavedView>
export async function createSavedView(data: CreateSavedViewDto): Promise<SavedView>
export async function updateSavedView(id: string, data: UpdateSavedViewDto): Promise<SavedView>
export async function deleteSavedView(id: string): Promise<void>
```

#### **Types**
```typescript
// apps/frontend/src/types/saved-view.ts
export interface SavedView {
  id: string;
  name: string;
  filters: AnalyticsFilters;
  isDefault: boolean;
  isShared: boolean;
  createdBy: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavedViewDto {
  name: string;
  filters: AnalyticsFilters;
}
```

#### **URL Routing**
```
/analytics                        # Default view
/analytics?view={viewId}          # Saved view
/analytics?view={viewId}&drill={chartType}:{value}  # Drill-down
```

**Examples**:
- `/analytics?view=sales-weekly`
- `/analytics?drill=mix:email` (Activity Mix → email activities)
- `/analytics?drill=day:2025-10-25` (Activity by Day → Oct 25)
- `/analytics?drill=contributor:u_123` (Top Contributors → user u_123)

---

## 📁 **File Structure**

### **Backend**
```
apps/core-api/src/modules/saved-views/
├── saved-views.module.ts
├── saved-views.controller.ts
├── saved-views.service.ts
├── saved-views.dto.ts
└── saved-view.entity.ts (Prisma model)
```

### **Frontend**
```
apps/frontend/src/
├── components/analytics/
│   ├── SavedViewsDropdown.tsx
│   ├── SaveViewModal.tsx
│   ├── DrillDownPanel.tsx
│   └── index.ts
├── services/
│   └── saved-views.service.ts
├── types/
│   └── saved-view.ts
└── pages/analytics/
    └── AnalyticsPage.tsx (updated)
```

### **E2E Tests**
```
apps/frontend/e2e/
├── saved-views.spec.ts
└── drill-downs.spec.ts
```

---

## 🧪 **Testing Strategy**

### **E2E Tests (Playwright)**

#### **Saved Views** (`saved-views.spec.ts`)
```typescript
test('create and apply saved view', async ({ page }) => {
  // Navigate to Analytics
  // Set filters (date range, users, types)
  // Click "Save View" button
  // Enter view name "Q4 Sales"
  // Click "Save"
  // Verify toast: "View saved"
  // Refresh page
  // Open "Saved Views" dropdown
  // Click "Q4 Sales"
  // Verify filters applied
  // Verify URL: /analytics?view=xxx
});

test('edit saved view', async ({ page }) => {
  // Apply saved view
  // Change filters
  // Click "Update View"
  // Verify toast: "View updated"
  // Refresh page
  // Verify new filters applied
});

test('delete saved view', async ({ page }) => {
  // Open "Saved Views" dropdown
  // Hover over view
  // Click delete icon
  // Confirm dialog
  // Verify toast: "View deleted"
  // Verify view removed from dropdown
});

test('share saved view via URL', async ({ page }) => {
  // Create saved view
  // Copy URL
  // Open URL in new tab
  // Verify filters applied
});
```

#### **Drill-Downs** (`drill-downs.spec.ts`)
```typescript
test('drill down from Activity Mix chart', async ({ page }) => {
  // Navigate to Analytics
  // Click "email" slice in Activity Mix donut
  // Verify side panel opens
  // Verify panel title: "Email Activities"
  // Verify Activity Timeline shows only email activities
  // Verify URL: /analytics?drill=mix:email
});

test('drill down from Activity by Day chart', async ({ page }) => {
  // Click a point on line chart
  // Verify side panel opens
  // Verify panel title: "Activities on Oct 25, 2025"
  // Verify Activity Timeline filtered to that day
});

test('drill down from Top Contributors chart', async ({ page }) => {
  // Click a bar in Top Contributors
  // Verify side panel opens
  // Verify panel title: "Activities by Ada"
  // Verify Activity Timeline filtered to that user
});

test('deep link to activities from drill-down', async ({ page }) => {
  // Open drill-down panel
  // Click "View all in Activities"
  // Verify navigation to /activities?...
  // Verify filters applied
});

test('close drill-down panel', async ({ page }) => {
  // Open drill-down panel
  // Click close button
  // Verify panel closes
  // Verify URL returns to /analytics
});
```

---

## 🎯 **Acceptance Criteria**

### **Saved Views**
- [ ] User can save current filters as named view
- [ ] User can apply saved view from dropdown
- [ ] User can edit/delete own views
- [ ] Admin can create default views (visible to all)
- [ ] Saved views are URL-routable (`/analytics?view={id}`)
- [ ] View metadata displayed (created by, created at)
- [ ] Toast notifications for save/update/delete
- [ ] E2E tests pass (5 tests)

### **Drill-Downs**
- [ ] Click chart element opens side panel
- [ ] Side panel shows filtered Activity Timeline
- [ ] Panel has "View all in Activities" deep link
- [ ] URL reflects drill-down state (`/analytics?drill=...`)
- [ ] Close panel returns to Analytics Dashboard
- [ ] Mobile: panel opens as full-screen
- [ ] E2E tests pass (5 tests)

### **Polish & QA**
- [ ] Loading states for all async operations
- [ ] Toast notifications for all user actions
- [ ] No linter errors
- [ ] No TypeScript errors
- [ ] Mobile responsive
- [ ] Accessibility (keyboard nav, screen readers)

---

## 📈 **Success Metrics**

**Week 1 Goals**:
- [ ] 50%+ of users create at least 1 saved view
- [ ] 30%+ of users use drill-downs
- [ ] Saved views reduce filter setup time by 80%
- [ ] Drill-downs increase Activity page visits by 40%

**Performance**:
- [ ] Saved view load time < 100ms
- [ ] Drill-down panel opens < 200ms
- [ ] No performance regression on Analytics page

---

## 🚀 **Implementation Plan**

### **Day 1: Backend Foundation**
- [ ] Add `SavedView` model to Prisma schema
- [ ] Run migration: `pnpm prisma migrate dev`
- [ ] Create `SavedViewsModule` (controller, service, DTOs)
- [ ] Implement CRUD endpoints
- [ ] Test with curl/Postman

### **Day 2: Frontend Saved Views**
- [ ] Create `SavedViewsService`
- [ ] Create `SaveViewModal` component
- [ ] Create `SavedViewsDropdown` component
- [ ] Wire into `AnalyticsPage`
- [ ] Add URL routing (`/analytics?view={id}`)

### **Day 3: Drill-Down Infrastructure**
- [ ] Create `DrillDownPanel` component
- [ ] Add click handlers to charts
- [ ] Implement URL parameter mapping
- [ ] Wire Activity Timeline into panel

### **Day 4: E2E Tests**
- [ ] Write saved views tests (5 tests)
- [ ] Write drill-down tests (5 tests)
- [ ] Run full E2E suite
- [ ] Fix any failures

### **Day 5: Polish & Ship**
- [ ] Add loading states
- [ ] Add toast notifications
- [ ] Mobile responsive testing
- [ ] Accessibility audit
- [ ] Create PR
- [ ] Merge & tag v6.0.0

---

## 🐛 **Known Risks**

| Risk | Mitigation |
|------|------------|
| Saved views conflict with URL filters | URL filters take precedence; show "Modified" badge |
| Drill-down panel performance | Lazy-load Activity Timeline; limit to 50 items |
| Mobile UX for drill-downs | Full-screen panel on mobile; swipe to close |
| Permission complexity | Start simple: owner can edit, others read-only |

---

## 📚 **References**

- **Sprint 5 Complete**: `SPRINT_5_COMPLETE.md`
- **Analytics Dashboard**: `/analytics`
- **Activity Timeline**: Sprint 4 implementation
- **Similar Features**: Saved filters in Gmail, Jira, GitHub

---

## 🎉 **Definition of Done**

- [ ] All acceptance criteria met
- [ ] E2E tests pass (10/10)
- [ ] No linter errors
- [ ] No TypeScript errors
- [ ] Mobile responsive
- [ ] Accessibility compliant
- [ ] Documentation updated
- [ ] PR reviewed and merged
- [ ] Tagged as v6.0.0
- [ ] Release notes published

---

**Status**: 📋 **READY TO START**  
**Confidence**: 🟢 **HIGH**  
**Risk**: 🟢 **LOW**

🚀 **Let's build it!**

