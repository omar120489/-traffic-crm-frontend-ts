# 🚀 Sprint 4 Plan – Traffic CRM

**Sprint Goal**: Deepen CRM insights with timeline, contact detail, and analytics  
**Duration**: 7 days (1 week)  
**Velocity Target**: 21 story points  
**Status**: 🟢 Ready to Start  
**Start Date**: TBD  
**End Date**: TBD

> 📋 **Quick Reference**: For a one-page overview, see [SPRINT_4_QUICK_REFERENCE.md](./SPRINT_4_QUICK_REFERENCE.md)

---

## 🎯 Sprint Objectives

1. **Activity Timeline** - Add chronological event feed to Company 360
2. **Deal Detail Page** - Full CRUD view for individual deals
3. **Contact 360 View** - Standalone view mirroring Company 360 layout
4. **Advanced Filters** - Date range and custom field filters across tables
5. **Bulk Actions** - Multi-select for archiving, stage change, assignment
6. **Code Quality** - Refactor and improve developer documentation

---

## 📊 Sprint Backlog

| Epic | Story | Points | Priority | Status |
|------|-------|--------|----------|--------|
| **Activity Timeline** | FE-ACTIVITY-01: Timeline Component | 3 | 🔴 High | 🔜 Todo |
| **Deal Detail** | FE-DEAL-01: Deal Detail Page | 5 | 🔴 High | 🔜 Todo |
| **Contact 360** | FE-CONTACT-01: Contact 360 Page | 5 | 🔴 High | 🔜 Todo |
| **Advanced Filters** | FE-FILTER-01: Advanced Filter Bar | 3 | 🟠 Medium | 🔜 Todo |
| **Bulk Actions** | FE-BULK-01: Bulk Actions Toolbar | 2 | 🟠 Medium | 🔜 Todo |
| **Code Quality** | FE-REFACTOR-01: Code Cleanup & Docs | 3 | 🟡 Low | 🔜 Todo |
| **TOTAL** | | **21** | | |

---

## 🧩 Detailed Stories

### **FE-ACTIVITY-01: Activity Timeline Component** (3 pts)

**Description**: Add chronological event feed to Company 360 page displaying all activities (notes, calls, emails, meetings) in reverse chronological order.

**Acceptance Criteria**:
- [ ] Timeline component displays activities in reverse chronological order
- [ ] Each activity shows: type icon, subject, body, timestamp, user
- [ ] Filter by activity type (note, call, email, meeting)
- [ ] Infinite scroll or pagination for large datasets
- [ ] Add new activity inline (quick note)
- [ ] Click activity to view full details
- [ ] Responsive design (mobile-friendly)
- [ ] Loading skeleton while fetching
- [ ] Empty state when no activities

**Technical Requirements**:
- Component: `apps/frontend/src/components/activities/ActivityTimeline.tsx`
- Types: `apps/frontend/src/types/activity.ts`
- Service: `apps/frontend/src/services/activities.service.ts`
- API: `GET /api/activities?entityType=:type&entityId=:id`

**Dependencies**: None

---

### **FE-DEAL-01: Deal Detail Page** (5 pts)

**Description**: Full CRUD view for individual deals with all details, activities, and related entities.

**Acceptance Criteria**:
- [ ] Display deal header (name, amount, stage, owner)
- [ ] Edit deal fields inline or via dialog
- [ ] Display associated company and contacts
- [ ] Show activity timeline
- [ ] Add notes and comments
- [ ] Change deal stage with confirmation
- [ ] Update deal amount and owner
- [ ] Delete deal with confirmation
- [ ] View deal history/audit log
- [ ] Link to company and contacts
- [ ] Breadcrumbs navigation
- [ ] Loading and error states

**Technical Requirements**:
- Page: `apps/frontend/src/pages/deals/DealDetailPage.tsx`
- Components:
  - `DealHeader.tsx` - Deal summary card
  - `DealFields.tsx` - Editable fields
  - `DealActivities.tsx` - Activity timeline
  - `DealRelations.tsx` - Related entities
- Types: `apps/frontend/src/types/deal-detail.ts`
- Service: `apps/frontend/src/services/deal-detail.service.ts`
- API:
  - `GET /api/deals/:id`
  - `PATCH /api/deals/:id`
  - `DELETE /api/deals/:id`
  - `GET /api/deals/:id/activities`

**Dependencies**: FE-ACTIVITY-01 (for timeline component)

---

### **FE-CONTACT-01: Contact 360 Page** (5 pts)

**Description**: Standalone view mirroring Company 360 layout for individual contacts.

**Acceptance Criteria**:
- [ ] Contact info card (name, title, email, phone, company)
- [ ] Contact stats (deals, activities, last contact)
- [ ] Associated companies table
- [ ] Associated deals table
- [ ] Activity timeline
- [ ] Edit contact inline
- [ ] Add new activity
- [ ] Link to company and deals
- [ ] Responsive layout
- [ ] Loading and error states

**Technical Requirements**:
- Page: `apps/frontend/src/pages/contacts/Contact360Page.tsx`
- Components:
  - `ContactInfoCard.tsx` - Contact details
  - `ContactStats.tsx` - Summary stats
  - `ContactCompanies.tsx` - Companies table
  - `ContactDeals.tsx` - Deals table
- Types: `apps/frontend/src/types/contact-detail.ts`
- Service: `apps/frontend/src/services/contact-detail.service.ts`
- API:
  - `GET /api/contacts/:id/summary`
  - `GET /api/contacts/:id/companies`
  - `GET /api/contacts/:id/deals`
  - `GET /api/contacts/:id/activities`

**Dependencies**: FE-ACTIVITY-01 (for timeline component)

---

### **FE-FILTER-01: Advanced Filter Bar** (3 pts)

**Description**: Reusable date range and custom field filter component for tables.

**Acceptance Criteria**:
- [ ] Date range picker (start/end dates)
- [ ] Preset date ranges (Today, This Week, This Month, Last 30 Days, Custom)
- [ ] Custom field filters (dynamic based on entity type)
- [ ] Multi-select for dropdown fields
- [ ] Text search for text fields
- [ ] Number range for numeric fields
- [ ] Clear all filters button
- [ ] Save filter presets (local storage)
- [ ] URL synchronization
- [ ] Responsive design

**Technical Requirements**:
- Component: `apps/frontend/src/components/filters/AdvancedFilterBar.tsx`
- Components:
  - `DateRangePicker.tsx` - Date range selector
  - `CustomFieldFilter.tsx` - Dynamic field filter
  - `FilterPresets.tsx` - Saved filters
- Types: `apps/frontend/src/types/filters.ts`
- Hook: `apps/frontend/src/hooks/useAdvancedFilters.ts`

**Dependencies**: None

---

### **FE-BULK-01: Bulk Actions Toolbar** (2 pts)

**Description**: Multi-select for archiving, stage change, and assignment across tables.

**Acceptance Criteria**:
- [ ] Multi-select checkbox in tables
- [ ] Select all / deselect all
- [ ] Bulk actions toolbar appears when items selected
- [ ] Bulk update stage
- [ ] Bulk update owner
- [ ] Bulk add/remove tags
- [ ] Bulk archive/delete with confirmation
- [ ] Show count of selected items
- [ ] Optimistic updates with rollback
- [ ] Toast notifications for success/error
- [ ] Disable actions when inappropriate

**Technical Requirements**:
- Component: `apps/frontend/src/components/bulk/BulkActionsToolbar.tsx`
- Hook: `apps/frontend/src/hooks/useBulkSelection.ts`
- Types: `apps/frontend/src/types/bulk-actions.ts`
- API:
  - `PATCH /api/deals/bulk`
  - `PATCH /api/contacts/bulk`
  - `DELETE /api/deals/bulk`

**Dependencies**: None

---

### **FE-REFACTOR-01: Code Cleanup & Documentation** (3 pts)

**Description**: Refactor code for consistency, remove technical debt, and improve developer documentation.

**Acceptance Criteria**:
- [ ] Unify HTTP client (standardize on Axios or Fetch)
- [ ] Remove unused imports and variables
- [ ] Standardize error handling patterns
- [ ] Improve type exports from UI Kit
- [ ] Add JSDoc comments to public APIs
- [ ] Update CONTRIBUTING.md with new patterns
- [ ] Create component examples in docs
- [ ] Add Storybook stories for UI Kit components
- [ ] Document common patterns and anti-patterns
- [ ] Update architecture diagrams

**Technical Requirements**:
- Files to refactor:
  - `apps/frontend/src/lib/http.ts` - Unify client
  - `packages/ui-kit/src/index.ts` - Improve exports
  - Various components - Clean up
- Documentation:
  - `docs/FRONTEND_PATTERNS.md` - New guide
  - `docs/COMPONENT_EXAMPLES.md` - New guide
  - `CONTRIBUTING.md` - Update
  - `docs/ARCHITECTURE_DIAGRAMS.md` - Update

**Dependencies**: None (can be done in parallel)

---

## 🧪 Quality Gates

### **Code Quality**
- ✅ Zero TypeScript errors (`pnpm typecheck:sprint2`)
- ✅ 100% lint pass (`pnpm lint`)
- ✅ 100% format pass (`pnpm format:check`)
- ✅ No console errors or warnings
- ✅ All props `readonly`
- ✅ All components SSR-safe

### **Testing**
- ✅ > 90% component test coverage
- ✅ All E2E tests pass
- ✅ Manual QA checklist complete
- ✅ Accessibility audit pass (WCAG 2.1 AA)
- ✅ Performance budget met (< 3s load)

### **Documentation**
- ✅ All components documented
- ✅ API contracts documented
- ✅ README updated
- ✅ SPRINT_4_COMPLETE.md created
- ✅ Release notes prepared

---

## 📅 Sprint Schedule

### **Day 1: Sprint Planning & Setup**
- Sprint planning meeting (2 hours)
- Create feature branches
- Scaffold components
- Define API contracts

### **Day 2-3: Activity Timeline & Deal Detail**
- Implement ActivityTimeline component
- Implement DealDetailPage
- Wire backend APIs
- Add tests

### **Day 4-5: Contact 360 & Advanced Filters**
- Implement Contact360Page
- Implement AdvancedFilterBar
- Wire backend APIs
- Add tests

### **Day 6: Bulk Actions & Refactoring**
- Implement BulkActionsToolbar
- Code cleanup and refactoring
- Documentation updates
- Final testing

### **Day 7: Review & Retrospective**
- Sprint review meeting (1 hour)
- Sprint retrospective (1 hour)
- Prepare release notes
- Deploy to staging

---

## 🔌 Backend API Requirements

### **Activity Timeline**
```typescript
GET /api/activities?entityType=:type&entityId=:id&limit=:n&offset=:n
Response: {
  activities: Activity[],
  total: number,
  hasMore: boolean
}

POST /api/activities
Body: {
  entityType: 'company' | 'contact' | 'deal',
  entityId: string,
  type: 'note' | 'call' | 'email' | 'meeting',
  subject: string,
  body: string,
  dueAt?: string
}
Response: Activity
```

### **Deal Detail**
```typescript
GET /api/deals/:id
Response: {
  deal: Deal,
  company?: Company,
  contacts: Contact[],
  activities: Activity[],
  history: DealHistoryEntry[]
}

PATCH /api/deals/:id
Body: Partial<Deal>
Response: Deal

DELETE /api/deals/:id
Response: { success: boolean }

GET /api/deals/:id/activities
Response: Activity[]
```

### **Contact 360**
```typescript
GET /api/contacts/:id/summary
Response: {
  contact: Contact,
  stats: {
    companies: number,
    deals: number,
    activities: number,
    lastContactAt: string
  },
  companies: Company[],
  deals: Deal[],
  activities: Activity[]
}

PATCH /api/contacts/:id
Body: Partial<Contact>
Response: Contact
```

### **Bulk Actions**
```typescript
PATCH /api/deals/bulk
Body: {
  ids: string[],
  updates: Partial<Deal>
}
Response: { updated: number, failed: string[] }

DELETE /api/deals/bulk
Body: { ids: string[] }
Response: { deleted: number, failed: string[] }
```

---

## 🔮 Stretch Goals (If Time Permits)

### **Real-time Updates** (5 pts)
- WebSocket integration for live updates
- Show when other users are viewing/editing
- Real-time activity feed updates
- Presence indicators

### **Mobile Responsive** (3 pts)
- Touch-friendly drag & drop
- Mobile-optimized layouts
- Swipe gestures
- Native-like experience

### **Analytics Dashboards** (8 pts)
- Revenue trends over time
- Pipeline velocity metrics
- Win/loss analysis
- Activity heatmaps
- Custom reports

### **User Permissions** (5 pts)
- Role-based access control (RBAC)
- Field-level permissions
- Record-level permissions
- Audit logging

---

## 📊 Success Metrics

### **Velocity**
- Target: 21 story points
- Stretch: 25+ story points (with stretch goals)

### **Quality**
- TypeScript errors: 0
- Test coverage: > 90%
- Accessibility score: 100
- Performance score: > 90

### **User Experience**
- Page load time: < 3s
- Time to interactive: < 2s
- Error rate: < 1%
- User satisfaction: > 4.5/5

---

## 🚀 Getting Started

### **1. Create Feature Branch**
```bash
git checkout main
git pull origin main
git checkout -b feat/sprint4-activity-timeline
```

### **2. Scaffold Components**
```bash
cd apps/frontend

# Create component directories
mkdir -p src/components/activities
mkdir -p src/pages/deals
mkdir -p src/pages/contacts
mkdir -p src/components/filters
mkdir -p src/components/bulk

# Create type files
touch src/types/activity.ts
touch src/types/deal-detail.ts
touch src/types/contact-detail.ts
touch src/types/filters.ts
touch src/types/bulk-actions.ts

# Create service files
touch src/services/activities.service.ts
touch src/services/deal-detail.service.ts
touch src/services/contact-detail.service.ts
```

### **3. Run Development Server**
```bash
pnpm --filter ./apps/frontend run dev
```

### **4. Start Building!**
Follow the execution checklist in `SPRINT_4_EXECUTION_CHECKLIST.md`

---

## 📚 Related Documentation

- [Sprint 3 Complete](./SPRINT_3_COMPLETE.md) - Previous sprint outcomes
- [Post-Sprint 3 Action Plan](./POST_SPRINT_3_ACTION_PLAN.md) - Transition guide
- [Sprint 4 Kickoff](./SPRINT_4_KICKOFF.md) - Getting started guide
- [Sprint 4 Execution Checklist](./SPRINT_4_EXECUTION_CHECKLIST.md) - Daily tracker

---

## 🎯 Sprint Goal Statement

**"By the end of Sprint 4, we will have a comprehensive CRM platform with activity tracking, detailed deal management, contact 360 views, advanced filtering, and bulk operations, enabling users to efficiently manage their entire sales pipeline."**

---

**Status**: 🟢 Ready to Start  
**Next Action**: Create feature branch and start with Activity Timeline  
**Questions?** Contact Tech Lead or Product Manager

---

**Let's build something amazing! 🚀**

