# Sprint 4 - GitHub Issues (Ready to Paste)

**Sprint**: Sprint 4  
**Goal**: Activity Timeline & Enhanced Filtering  
**Points**: 21 pts  
**Duration**: 2 weeks

---

## 📋 Issues to Create

### **FE-TIMELINE-01: Activity Timeline Component** (5 pts)

**Title**: `[Frontend] Activity Timeline Component - Core UI`

**Labels**: `frontend`, `sprint-4`, `component`, `priority:high`

**Description**:
```markdown
## 🎯 Objective
Build the core Activity Timeline component that displays chronological activity feed for contacts and deals.

## 📝 Requirements
- [ ] Create `ActivityTimeline.tsx` component
- [ ] Support multiple activity types (note, call, email, meeting, task)
- [ ] Chronological sorting (newest first)
- [ ] Infinite scroll / pagination
- [ ] Loading states & skeletons
- [ ] Empty state handling

## 🎨 UI Specs
- Timeline layout with left-side icons
- Activity cards with timestamp, type, user, and content
- Hover states for interactions
- Responsive design (mobile-friendly)

## 📦 Deliverables
- [ ] `src/components/activities/ActivityTimeline.tsx`
- [ ] `src/components/activities/ActivityItem.tsx`
- [ ] `src/components/activities/ActivityIcon.tsx`
- [ ] Unit tests (>80% coverage)
- [ ] Storybook stories

## 🔗 Dependencies
- Types: `src/types/activity.ts`
- Service: `src/services/activities.service.ts`

## ✅ Acceptance Criteria
- Timeline renders with mocked data
- All activity types display correctly
- Loading states work smoothly
- Empty state shows helpful message
- Responsive on mobile/tablet/desktop

**Story Points**: 5  
**Assignee**: TBD  
**Sprint**: Sprint 4
```

---

### **FE-TIMELINE-02: Activity Timeline Integration** (3 pts)

**Title**: `[Frontend] Integrate Activity Timeline into Contact & Deal Pages`

**Labels**: `frontend`, `sprint-4`, `integration`, `priority:high`

**Description**:
```markdown
## 🎯 Objective
Integrate the Activity Timeline component into Contact Detail and Deal Detail pages.

## 📝 Requirements
- [ ] Add timeline to `ContactDetailPage.tsx`
- [ ] Add timeline to `DealDetailPage.tsx` (new page)
- [ ] Wire up API calls to fetch activities
- [ ] Handle loading/error states
- [ ] Add "Add Activity" button/form

## 🎨 UI Specs
- Timeline in right sidebar or bottom section
- Consistent placement across pages
- "Add Activity" quick form above timeline

## 📦 Deliverables
- [ ] Updated `ContactDetailPage.tsx`
- [ ] New `DealDetailPage.tsx`
- [ ] Activity form component
- [ ] Integration tests

## 🔗 Dependencies
- FE-TIMELINE-01 (Activity Timeline Component)
- API: `GET /api/activities?entityType=contact&entityId={id}`

## ✅ Acceptance Criteria
- Timeline loads activities from API
- Activities display correctly on both pages
- "Add Activity" form works end-to-end
- Error states handled gracefully

**Story Points**: 3  
**Assignee**: TBD  
**Sprint**: Sprint 4
```

---

### **FE-FILTER-01: Advanced Filter Component** (3 pts)

**Title**: `[Frontend] Advanced Filter Component with Multi-Select`

**Labels**: `frontend`, `sprint-4`, `component`, `priority:medium`

**Description**:
```markdown
## 🎯 Objective
Build a reusable Advanced Filter component with multi-select, date ranges, and custom fields.

## 📝 Requirements
- [ ] Multi-select dropdowns (owners, tags, status)
- [ ] Date range picker (created, updated, activity)
- [ ] Custom field filters (text, number, boolean)
- [ ] "Apply Filters" and "Clear All" buttons
- [ ] URL sync (query params)
- [ ] Filter persistence (localStorage)

## 🎨 UI Specs
- Collapsible filter panel
- Chip display for active filters
- Filter count badge
- Mobile-friendly drawer

## 📦 Deliverables
- [ ] `src/components/filters/AdvancedFilter.tsx`
- [ ] `src/components/filters/FilterChips.tsx`
- [ ] `src/hooks/useFilters.ts`
- [ ] Unit tests (>80% coverage)

## 🔗 Dependencies
- Types: `src/types/filters.ts`

## ✅ Acceptance Criteria
- All filter types work correctly
- URL syncs with filter state
- Filters persist across page reloads
- Clear all removes all filters
- Mobile drawer works smoothly

**Story Points**: 3  
**Assignee**: TBD  
**Sprint**: Sprint 4
```

---

### **FE-FILTER-02: Apply Filters to Contacts & Deals** (2 pts)

**Title**: `[Frontend] Apply Advanced Filters to Contacts & Deals Lists`

**Labels**: `frontend`, `sprint-4`, `integration`, `priority:medium`

**Description**:
```markdown
## 🎯 Objective
Integrate Advanced Filter component into Contacts and Deals list pages.

## 📝 Requirements
- [ ] Add filter panel to `ContactsListPage.tsx`
- [ ] Add filter panel to `DealsKanbanPage.tsx`
- [ ] Wire up API calls with filter params
- [ ] Show active filter count
- [ ] Handle filter state in URL

## 📦 Deliverables
- [ ] Updated `ContactsListPage.tsx`
- [ ] Updated `DealsKanbanPage.tsx`
- [ ] Integration tests

## 🔗 Dependencies
- FE-FILTER-01 (Advanced Filter Component)
- API: Filter params support

## ✅ Acceptance Criteria
- Filters apply to list/kanban results
- URL updates with filter params
- Filter count badge shows active filters
- Clear all resets to default view

**Story Points**: 2  
**Assignee**: TBD  
**Sprint**: Sprint 4
```

---

### **FE-BULK-01: Bulk Actions Component** (3 pts)

**Title**: `[Frontend] Bulk Actions Component for Contacts & Deals`

**Labels**: `frontend`, `sprint-4`, `component`, `priority:medium`

**Description**:
```markdown
## 🎯 Objective
Build a Bulk Actions component for selecting and performing actions on multiple items.

## 📝 Requirements
- [ ] Multi-select checkboxes
- [ ] "Select All" / "Deselect All"
- [ ] Bulk action menu (tag, assign, delete, export)
- [ ] Confirmation dialogs
- [ ] Progress indicators
- [ ] Undo functionality (optional)

## 🎨 UI Specs
- Sticky action bar when items selected
- Action count display
- Disabled state for invalid actions
- Success/error toasts

## 📦 Deliverables
- [ ] `src/components/bulk/BulkActions.tsx`
- [ ] `src/components/bulk/BulkActionBar.tsx`
- [ ] `src/hooks/useBulkSelection.ts`
- [ ] Unit tests (>80% coverage)

## 🔗 Dependencies
- Types: `src/types/bulk-actions.ts`

## ✅ Acceptance Criteria
- Multi-select works across pages
- Bulk actions execute correctly
- Confirmation dialogs prevent accidents
- Progress shows for long operations
- Success/error feedback clear

**Story Points**: 3  
**Assignee**: TBD  
**Sprint**: Sprint 4
```

---

### **BE-ACTIVITY-01: Activity Timeline API** (3 pts)

**Title**: `[Backend] Activity Timeline API Endpoints`

**Labels**: `backend`, `sprint-4`, `api`, `priority:high`

**Description**:
```markdown
## 🎯 Objective
Create API endpoints for fetching and creating activities with filtering and pagination.

## 📝 Requirements
- [ ] `GET /api/activities` - List activities with filters
- [ ] `POST /api/activities` - Create new activity
- [ ] `PATCH /api/activities/:id` - Update activity
- [ ] `DELETE /api/activities/:id` - Delete activity
- [ ] Support filtering by entityType, entityId, type, dateRange
- [ ] Pagination (cursor-based)
- [ ] Include user/entity metadata

## 📦 Deliverables
- [ ] `src/modules/activities/activities.controller.ts`
- [ ] `src/modules/activities/activities.service.ts`
- [ ] `src/modules/activities/dto/activity.dto.ts`
- [ ] Unit tests (>80% coverage)
- [ ] Integration tests

## 🔗 Dependencies
- Prisma schema: Activity model

## ✅ Acceptance Criteria
- All endpoints return correct data
- Filtering works as expected
- Pagination handles large datasets
- Validation prevents invalid data
- Tests cover edge cases

**Story Points**: 3  
**Assignee**: TBD  
**Sprint**: Sprint 4
```

---

### **E2E-TIMELINE-01: Activity Timeline E2E Tests** (2 pts)

**Title**: `[E2E] Activity Timeline Smoke Tests`

**Labels**: `e2e`, `sprint-4`, `testing`, `priority:high`

**Description**:
```markdown
## 🎯 Objective
Create E2E smoke tests for Activity Timeline functionality.

## 📝 Requirements
- [ ] Test: Load contact page → see timeline
- [ ] Test: Add activity → appears in timeline
- [ ] Test: Filter activities by type
- [ ] Test: Pagination works correctly
- [ ] Test: Timeline on deal page

## 📦 Deliverables
- [ ] `e2e/activity-timeline.spec.ts`
- [ ] Test fixtures for activities
- [ ] Page objects for timeline

## ✅ Acceptance Criteria
- All tests pass on CI
- Tests cover happy path + edge cases
- Tests run in <2 minutes
- No flaky tests

**Story Points**: 2  
**Assignee**: TBD  
**Sprint**: Sprint 4
```

---

## 📊 Summary

| **Issue** | **Title** | **Points** | **Labels** |
|-----------|-----------|------------|------------|
| FE-TIMELINE-01 | Activity Timeline Component | 5 | frontend, component |
| FE-TIMELINE-02 | Timeline Integration | 3 | frontend, integration |
| FE-FILTER-01 | Advanced Filter Component | 3 | frontend, component |
| FE-FILTER-02 | Apply Filters | 2 | frontend, integration |
| FE-BULK-01 | Bulk Actions Component | 3 | frontend, component |
| BE-ACTIVITY-01 | Activity Timeline API | 3 | backend, api |
| E2E-TIMELINE-01 | Timeline E2E Tests | 2 | e2e, testing |

**Total**: 21 story points

---

## 🚀 How to Create Issues

### **Via GitHub CLI**
```bash
# Create all issues at once
gh issue create --title "[Frontend] Activity Timeline Component - Core UI" \
  --body-file <(cat <<'EOF'
[Paste issue description here]
EOF
) \
  --label "frontend,sprint-4,component,priority:high"

# Repeat for each issue...
```

### **Via GitHub UI**
1. Go to **Issues** → **New Issue**
2. Copy-paste title and description
3. Add labels
4. Assign to sprint milestone
5. Click **Create Issue**

---

## 📋 Milestones to Create

```bash
# Create Sprint 4 milestones
gh api repos/:owner/:repo/milestones --method POST \
  --field title="Sprint 4 - Build" \
  --field due_on="2025-11-08T00:00:00Z" \
  --field description="Sprint 4 development phase"

gh api repos/:owner/:repo/milestones --method POST \
  --field title="Sprint 4 - QA" \
  --field due_on="2025-11-12T00:00:00Z" \
  --field description="Sprint 4 QA and testing phase"

gh api repos/:owner/:repo/milestones --method POST \
  --field title="Sprint 4 - Release" \
  --field due_on="2025-11-15T00:00:00Z" \
  --field description="Sprint 4 release phase"
```

---

**Ready to paste into GitHub!** 🚀

