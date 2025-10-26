# 🚀 Sprint 6 Kickoff: Saved Views + Drill-Downs

**Sprint Goal**: Enhance Analytics Dashboard with saved filter views and interactive drill-downs  
**Story Points**: 12  
**Duration**: 5 days  
**Start**: Ready to go!

---

## ⚡ **30-Minute Quick Start**

### **1. Create Feature Branch** (1 min)
```bash
cd /Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516
git checkout main
git pull origin main
git checkout -b feat/s6-saved-views-drilldowns
```

### **2. Add Prisma Schema** (2 min)
```bash
# Add to apps/core-api/prisma/schema.prisma
```

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

### **3. Run Migration** (1 min)
```bash
cd apps/core-api
pnpm prisma migrate dev --name add_saved_views
pnpm prisma generate
```

### **4. Scaffold Backend Module** (5 min)
```bash
mkdir -p apps/core-api/src/modules/saved-views
touch apps/core-api/src/modules/saved-views/{saved-views.module,saved-views.controller,saved-views.service,saved-views.dto}.ts
```

### **5. Scaffold Frontend Components** (5 min)
```bash
mkdir -p apps/frontend/src/components/analytics
touch apps/frontend/src/components/analytics/{SavedViewsDropdown,SaveViewModal,DrillDownPanel}.tsx
touch apps/frontend/src/services/saved-views.service.ts
touch apps/frontend/src/types/saved-view.ts
```

### **6. Scaffold E2E Tests** (2 min)
```bash
touch apps/frontend/e2e/{saved-views,drill-downs}.spec.ts
```

### **7. Start Dev Servers** (2 min)
```bash
# Terminal 1: Backend
cd apps/core-api
pnpm run start:dev

# Terminal 2: Frontend
cd apps/frontend
pnpm run dev
```

---

## 📋 **Daily Workflow**

### **Day 1: Backend Foundation** (Monday)
**Goal**: CRUD endpoints for saved views

**Morning** (2-3 hours):
- [ ] Implement `SavedViewsModule`
- [ ] Implement `SavedViewsController` (5 endpoints)
- [ ] Implement `SavedViewsService` (CRUD logic)
- [ ] Add DTOs with validation

**Afternoon** (2-3 hours):
- [ ] Wire module into `AppModule`
- [ ] Test endpoints with curl/Postman
- [ ] Add role-based permissions
- [ ] Commit: `feat(sprint6): add SavedViews backend module`

**Test Commands**:
```bash
# List views
curl http://localhost:3000/api/saved-views

# Create view
curl -X POST http://localhost:3000/api/saved-views \
  -H "Content-Type: application/json" \
  -d '{"name":"Q4 Sales","filters":{"from":"2025-10-01","to":"2025-12-31"}}'

# Get view
curl http://localhost:3000/api/saved-views/{id}

# Update view
curl -X PATCH http://localhost:3000/api/saved-views/{id} \
  -H "Content-Type: application/json" \
  -d '{"name":"Q4 Sales Updated"}'

# Delete view
curl -X DELETE http://localhost:3000/api/saved-views/{id}
```

---

### **Day 2: Frontend Saved Views** (Tuesday)
**Goal**: Save and apply views in UI

**Morning** (2-3 hours):
- [ ] Implement `SavedViewsService`
- [ ] Create `SaveViewModal` component
- [ ] Add "Save View" button to Analytics page
- [ ] Wire modal to service

**Afternoon** (2-3 hours):
- [ ] Create `SavedViewsDropdown` component
- [ ] Load saved views on page mount
- [ ] Apply view on selection
- [ ] Add URL routing (`/analytics?view={id}`)
- [ ] Commit: `feat(sprint6): add saved views UI`

**Test Manually**:
1. Go to `/analytics`
2. Set filters (date range, users, types)
3. Click "Save View"
4. Enter name "Test View"
5. Click "Save"
6. Refresh page
7. Open "Saved Views" dropdown
8. Click "Test View"
9. Verify filters applied
10. Check URL: `/analytics?view=xxx`

---

### **Day 3: Drill-Down Infrastructure** (Wednesday)
**Goal**: Click charts to see detailed activities

**Morning** (2-3 hours):
- [ ] Create `DrillDownPanel` component
- [ ] Add Activity Timeline to panel
- [ ] Add click handlers to Activity Mix chart
- [ ] Test: click slice → panel opens

**Afternoon** (2-3 hours):
- [ ] Add click handlers to Activity by Day chart
- [ ] Add click handlers to Top Contributors chart
- [ ] Implement URL parameter mapping
- [ ] Add "View all in Activities" deep link
- [ ] Commit: `feat(sprint6): add drill-down functionality`

**Test Manually**:
1. Go to `/analytics`
2. Click "email" slice in Activity Mix
3. Verify panel opens
4. Verify Activity Timeline shows only email activities
5. Click "View all in Activities"
6. Verify navigation to `/activities?type=email`
7. Close panel
8. Verify URL returns to `/analytics`

---

### **Day 4: E2E Tests** (Thursday)
**Goal**: Automated test coverage

**Morning** (2-3 hours):
- [ ] Write saved views tests (5 tests)
  - Create and apply saved view
  - Edit saved view
  - Delete saved view
  - Share saved view via URL
  - Default views visible to all

**Afternoon** (2-3 hours):
- [ ] Write drill-down tests (5 tests)
  - Drill down from Activity Mix
  - Drill down from Activity by Day
  - Drill down from Top Contributors
  - Deep link to Activities
  - Close drill-down panel
- [ ] Run full E2E suite
- [ ] Fix any failures
- [ ] Commit: `test(sprint6): add E2E tests for saved views and drill-downs`

**Test Commands**:
```bash
cd apps/frontend

# Run saved views tests
pnpm test:e2e saved-views.spec.ts

# Run drill-down tests
pnpm test:e2e drill-downs.spec.ts

# Run all Sprint 6 tests
pnpm test:e2e saved-views.spec.ts drill-downs.spec.ts

# Run all tests (including Sprint 5)
pnpm test:e2e
```

---

### **Day 5: Polish & Ship** (Friday)
**Goal**: Production-ready release

**Morning** (2-3 hours):
- [ ] Add loading states (spinners, skeletons)
- [ ] Add toast notifications (save, update, delete)
- [ ] Mobile responsive testing
- [ ] Accessibility audit (keyboard nav, screen readers)
- [ ] Fix any linter/TypeScript errors

**Afternoon** (2-3 hours):
- [ ] Create PR
- [ ] Wait for CI to pass
- [ ] Request review (if needed)
- [ ] Merge to main
- [ ] Tag v6.0.0
- [ ] Create GitHub Release
- [ ] Announce in Slack
- [ ] Commit: `docs(sprint6): add completion summary`

**Ship Commands**:
```bash
# Create PR
gh pr create \
  --title "feat: Saved Views + Drill-Downs (Sprint 6)" \
  --body-file SPRINT_6_PR_BODY.md \
  --base main \
  --head feat/s6-saved-views-drilldowns

# Merge (after CI passes)
gh pr merge --squash --delete-branch

# Tag release
git checkout main
git pull origin main
git tag -a v6.0.0 -m "Sprint 6: Saved Views + Drill-Downs Complete"
git push origin v6.0.0 --no-verify

# Create GitHub Release
gh release create v6.0.0 \
  --title "v6.0.0 – Sprint 6: Saved Views + Drill-Downs" \
  --notes-file SPRINT_6_COMPLETE.md \
  --latest
```

---

## 🧪 **Testing Commands**

### **Backend**
```bash
# Typecheck
pnpm --filter @apps/core-api typecheck

# Lint
pnpm --filter @apps/core-api lint

# Test (if you have unit tests)
pnpm --filter @apps/core-api test
```

### **Frontend**
```bash
# Typecheck
pnpm --filter ./apps/frontend typecheck

# Lint
pnpm --filter ./apps/frontend lint

# E2E
pnpm --filter ./apps/frontend test:e2e

# E2E UI mode (for debugging)
pnpm --filter ./apps/frontend test:e2e:ui
```

### **Full Workspace**
```bash
# Typecheck all
pnpm -w typecheck

# Lint all
pnpm -w lint

# E2E all
pnpm --filter ./apps/frontend test:e2e
```

---

## 📊 **Progress Tracking**

### **Story Points Breakdown**
- [ ] Backend SavedViews module (2 pts)
- [ ] Frontend SavedViews UI (2 pts)
- [ ] URL routing for saved views (1 pt)
- [ ] Drill-down panel component (1 pt)
- [ ] Chart click handlers (1 pt)
- [ ] Activity Timeline integration (1 pt)
- [ ] E2E tests (2 pts)
- [ ] Polish & accessibility (1 pt)
- [ ] Documentation (1 pt)

**Total**: 12 pts

### **Daily Velocity**
- Day 1: 2 pts (Backend)
- Day 2: 3 pts (Frontend saved views)
- Day 3: 3 pts (Drill-downs)
- Day 4: 2 pts (E2E tests)
- Day 5: 2 pts (Polish & ship)

---

## 🚨 **Blockers & Risks**

| Risk | Mitigation | Owner |
|------|------------|-------|
| Saved views conflict with URL filters | URL filters take precedence | — |
| Drill-down panel performance | Lazy-load Activity Timeline | — |
| Mobile UX for drill-downs | Full-screen panel on mobile | — |
| Permission complexity | Start simple: owner can edit | — |

---

## 🎯 **Success Criteria**

- [ ] All 12 story points complete
- [ ] 10/10 E2E tests passing
- [ ] Zero linter errors
- [ ] Zero TypeScript errors
- [ ] Mobile responsive
- [ ] Accessibility compliant
- [ ] Documentation complete
- [ ] PR merged
- [ ] v6.0.0 tagged and released

---

## 📚 **Quick Reference**

### **Key Files**
- Backend: `apps/core-api/src/modules/saved-views/`
- Frontend: `apps/frontend/src/components/analytics/`
- Services: `apps/frontend/src/services/saved-views.service.ts`
- Types: `apps/frontend/src/types/saved-view.ts`
- E2E: `apps/frontend/e2e/{saved-views,drill-downs}.spec.ts`

### **Key Commands**
```bash
# Start dev
pnpm --filter @apps/core-api run start:dev
pnpm --filter ./apps/frontend run dev

# Test
pnpm -w typecheck
pnpm -w lint
pnpm --filter ./apps/frontend test:e2e

# Ship
gh pr create --title "feat: Saved Views + Drill-Downs (Sprint 6)"
gh pr merge --squash --delete-branch
git tag -a v6.0.0 -m "Sprint 6 Complete"
git push origin v6.0.0 --no-verify
gh release create v6.0.0 --latest
```

---

## 🎉 **Let's Build It!**

**Status**: ✅ **READY TO START**  
**Confidence**: 🟢 **HIGH**  
**Risk**: 🟢 **LOW**

Start with Day 1 tasks and work through the daily workflow!

🚀 **Happy coding!**

