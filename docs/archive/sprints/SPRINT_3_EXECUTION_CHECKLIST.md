# Sprint 3 Execution Checklist ✅

**Status**: Ready to start coding  
**Date**: October 24, 2025

---

## 🚀 Day 1 Setup (Do This First)

### 1️⃣ Confirm Local Environment

```bash
# Navigate to project
cd /Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516

# Check Node version (requires Node 20)
node -v
# If not Node 20, run: nvm use 20

# Verify pnpm
pnpm -v
# Should be: 10.18.2

# Install dependencies (should be fast, frozen lockfile)
pnpm -r install --frozen-lockfile
```

**Expected Output**: No errors, ~1-2 seconds

---

### 2️⃣ Verify Services Start

```bash
# Terminal 1: Backend
pnpm --filter ./apps/core-api run start:dev
# Should start on: http://localhost:3000
# Look for: "Nest application successfully started"

# Terminal 2: Frontend
pnpm --filter ./apps/frontend run dev
# Should start on: http://localhost:5173
# Look for: "ready in XXX ms"
```

**Test in Browser**:
- Open: <http://localhost:5173>
- Should see: Traffic CRM UI loads
- Check DevTools: No critical errors

**Test Backend**:
```bash
curl http://localhost:3000/api/pipelines
# Should return JSON array (may be empty if DB not seeded)
```

---

### 3️⃣ Create Feature Branches

```bash
# Return to main
git checkout main
git pull origin main

# Create auth branch
git checkout -b feat/auth-login
git push -u origin feat/auth-login

# Create kanban branch
git checkout main
git checkout -b feat/deals-kanban
git push -u origin feat/deals-kanban

# Create company 360 branch
git checkout main
git checkout -b feat/company-360
git push -u origin feat/company-360

# Create E2E branch
git checkout main
git checkout -b chore/e2e-and-docs
git push -u origin chore/e2e-and-docs

# Return to auth branch (start here)
git checkout feat/auth-login
```

**Verify**:
```bash
git branch -a
# Should show all 4 feature branches
```

---

### 4️⃣ Assign Tickets

Update [Sprint 3 Plan](./docs/SPRINT_3_PLAN.md) with owners:

| Ticket | Owner | Branch |
|--------|-------|--------|
| FE-AUTH-01 | [Name] | `feat/auth-login` |
| FE-AUTH-02 | [Name] | `feat/auth-login` |
| FE-AUTH-03 | [Name] | `feat/auth-login` |
| BE-AUTH-01 | [Name] | `feat/auth-login` |
| FE-AUTH-04 | [Name] | `feat/auth-login` |
| FE-KANBAN-01 | [Name] | `feat/deals-kanban` |
| ... | ... | ... |

---

## 📋 Day-by-Day Execution Plan

### Day 1-2: Auth Foundation

**Branch**: `feat/auth-login`

**Tickets**:
1. **FE-AUTH-01**: Login page UI (3 pts)
2. **FE-AUTH-02**: AuthContext token management (2 pts)
3. **BE-AUTH-01**: Verify `/api/auth/login` endpoint (2 pts)
4. **FE-AUTH-03**: Protected route guard (1 pt)

**Verification**:
```bash
# TypeScript check
pnpm --filter ./apps/frontend run typecheck:sprint2

# Test login flow
# 1. Navigate to /login
# 2. Enter credentials
# 3. Should redirect to /contacts
# 4. Token should be in localStorage
```

**DoD**:
- [ ] User can log in with email/password
- [ ] JWT stored in localStorage
- [ ] AuthContext hydrates from token
- [ ] Protected routes redirect to /login if no token
- [ ] Pre-push hook passes

---

### Day 3-5: Kanban Foundation

**Branch**: `feat/deals-kanban`

**Tickets**:
1. **FE-KANBAN-01**: Board UI with columns (3 pts)
2. **FE-KANBAN-02**: DnD implementation (3 pts)
3. **BE-KANBAN-01**: PATCH `/api/deals/:id` endpoint (2 pts)
4. **FE-KANBAN-03**: Filters (owner, tags, search) (2 pts)

**Verification**:
```bash
# Navigate to /deals/board
# Should see columns by stage
# Drag card to different column
# Should see PATCH request in DevTools
# Card should move optimistically
# Toast should show "Deal moved"
```

**DoD**:
- [ ] Board displays deals grouped by stage
- [ ] Can drag cards between columns
- [ ] PATCH request updates `stageId` and `position`
- [ ] Optimistic UI updates immediately
- [ ] Error rollback works if PATCH fails
- [ ] Filters work (owner, tags, search)

---

### Day 6-7: Kanban Polish

**Branch**: `feat/deals-kanban`

**Tickets**:
1. **FE-KANBAN-04**: URL params sync (1 pt)
2. **FE-KANBAN-05**: Empty states + toasts (1 pt)

**Verification**:
```bash
# URL should reflect filters: ?owner=123&tag=hot
# Refresh should maintain filters
# Empty board should show helpful message
# All actions should show toasts
```

**DoD**:
- [ ] URL params sync with filters
- [ ] Browser back/forward works
- [ ] Empty states render correctly
- [ ] Toasts for all actions (move, filter, error)

---

### Day 8-9: Company 360

**Branch**: `feat/company-360`

**Tickets**:
1. **FE-COMPANY-01**: Info card + tables (3 pts)
2. **FE-COMPANY-02**: Revenue summary (1 pt)
3. **FE-COMPANY-03**: Timeline embed (1 pt)
4. **BE-COMPANY-01**: `/api/companies/:id/summary` endpoint (2 pts)
5. **FE-COMPANY-04**: Link integration (1 pt)

**Verification**:
```bash
# Navigate to /companies/:id
# Should see:
# - Company info card
# - Stats (contacts count, active deals, won revenue)
# - Recent deals table
# - Contacts list
# - Timeline (if implemented)
```

**DoD**:
- [ ] Company page loads with all data
- [ ] Stats aggregate correctly
- [ ] Links work from contacts and Kanban
- [ ] Loading states render
- [ ] Error states handled
- [ ] Timeline shows activities (if implemented)

---

### Day 10: Polish & Demo

**Branch**: `chore/e2e-and-docs`

**Tickets**:
1. **CI-01**: Add lint to PR checks (1 pt)
2. **E2E-01**: Playwright smoke test (2 pts)
3. **DOCS-01**: USER_FLOWS.md (1 pt)

**Verification**:
```bash
# Run E2E test
pnpm --filter ./apps/frontend run test:e2e

# Test should:
# 1. Login
# 2. Navigate to Kanban
# 3. Drag card
# 4. Navigate to company
# All steps should pass
```

**DoD**:
- [ ] E2E smoke test passes
- [ ] USER_FLOWS.md documents flows
- [ ] All feature branches merged to main
- [ ] Demo prepared
- [ ] Sprint retrospective scheduled

---

## 🔍 Pre-Push Verification (Every Commit)

```bash
# 1. TypeScript check (Sprint 2 only, fast)
pnpm --filter ./apps/frontend run typecheck:sprint2
# Expected: No errors

# 2. Lint (auto-fixes on commit)
pnpm --filter ./apps/frontend run lint
# Expected: No errors

# 3. Backend build (if you touched backend)
pnpm --filter ./apps/core-api build
# Expected: Successful compilation

# 4. Manual test in browser
# - Does the feature work?
# - Are loading states correct?
# - Do error states render?
# - Do toasts show?
```

---

## 📊 Progress Tracking

### Daily Standup Template

```markdown
## What I completed yesterday
- [X] FE-AUTH-01: Login page UI
- [X] FE-AUTH-02: AuthContext

## What I'm working on today
- [ ] FE-AUTH-03: Protected routes
- [ ] BE-AUTH-01: Verify login endpoint

## Blockers
- None / [Describe blocker]

## Sprint Progress
- Completed: 5 / 33 points
- Days elapsed: 1 / 10
- On track: Yes
```

---

## ✅ Branch Merge Checklist

Before merging feature branch to `main`:

### Code Quality
- [ ] All tickets in branch complete
- [ ] TypeScript check passes (`typecheck:sprint2`)
- [ ] Lint passes
- [ ] No Sonar critical issues introduced
- [ ] No `any` types in new code

### Testing
- [ ] Manual testing complete
- [ ] Loading states work
- [ ] Error states work
- [ ] Toasts show for all actions
- [ ] E2E test passes (if applicable)

### Documentation
- [ ] README updated (if needed)
- [ ] API contracts documented
- [ ] USER_FLOWS.md updated (if applicable)
- [ ] ADR created (if architectural decision)

### Review
- [ ] PR created with description
- [ ] Screenshots/GIF attached
- [ ] At least 1 reviewer approved
- [ ] CI checks pass
- [ ] Branch up-to-date with main

---

## 🚨 Common Issues & Solutions

### Issue: Pre-push hook fails on Node version

**Error**: `Node 24.7.0 detected; Node 20 required`

**Solution**:
```bash
# Use nvm to switch to Node 20
nvm use 20

# Or update .nvmrc if Node 24 is intentional
echo "24" > .nvmrc
```

---

### Issue: TypeScript errors in legacy code

**Error**: Errors in `src/pages/legacy/` or other old files

**Solution**: These files should be excluded by `tsconfig.sprint2.json`
```bash
# Only check Sprint 2 code
pnpm --filter ./apps/frontend run typecheck:sprint2

# Should not check legacy files
```

---

### Issue: DnD not working

**Error**: Cards don't drag or drop doesn't register

**Solution**: Check these:
1. Ensure `@dnd-kit/core` is installed: `pnpm list @dnd-kit/core`
2. Verify sensor setup: `useSensor(PointerSensor, { activationConstraint: { distance: 5 } })`
3. Check IDs are unique: `${stageId}:${dealId}`
4. Verify `setNodeRef` is called: `ref={setNodeRef}`

---

### Issue: Auth token not persisting

**Error**: User logged out on refresh

**Solution**: Check localStorage:
```typescript
// In AuthContext, ensure token is read on mount
useEffect(() => {
  const token = localStorage.getItem('access_token');
  if (token) {
    // Decode and validate
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 > Date.now()) {
      setUser(decoded);
    }
  }
}, []);
```

---

### Issue: CORS errors from backend

**Error**: `Access-Control-Allow-Origin` error

**Solution**: Check NestJS CORS config:
```typescript
// apps/core-api/src/main.ts
app.enableCors({
  origin: 'http://localhost:5173',
  credentials: true,
});
```

---

### Issue: Company summary returns empty data

**Error**: Stats show 0 for everything

**Solution**: Check Prisma relations:
```typescript
// Ensure relations are defined in schema
model Company {
  contacts Contact[]
  deals    Deal[]
}

// Use `include` in query
await prisma.company.findUnique({
  where: { id },
  include: {
    contacts: true,
    deals: { where: { status: 'OPEN' } },
  },
});
```

---

## 📚 Quick Reference

### File Paths (Sprint 3)

```
Frontend:
- Types: apps/frontend/src/types/deals.ts
- Services: apps/frontend/src/services/deals.service.ts
- Login: apps/frontend/src/pages/auth/LoginPage.tsx
- Kanban: apps/frontend/src/pages/deals/DealsKanbanPage.tsx
- Company 360: apps/frontend/src/pages/companies/CompanyDetailPage.tsx
- AuthContext: apps/frontend/src/contexts/AuthContext.tsx

Backend:
- Auth: apps/core-api/src/auth/
- Deals: apps/core-api/src/deals/
- Companies: apps/core-api/src/companies/
- Prisma: apps/core-api/prisma/schema.prisma
```

### Key Commands

```bash
# Development
pnpm --filter ./apps/core-api run start:dev
pnpm --filter ./apps/frontend run dev

# Type checking
pnpm --filter ./apps/frontend run typecheck:sprint2

# Testing
pnpm --filter ./apps/frontend run test:e2e

# Database
pnpm --filter ./apps/core-api run db:generate
pnpm --filter ./apps/core-api run db:seed
pnpm --filter ./apps/core-api run db:migrate

# Build
pnpm --filter ./apps/core-api build
pnpm --filter ./apps/frontend build
```

---

## 🎯 Success Criteria Reminder

### Functional
- ✅ User can log in → see authenticated state
- ✅ User can view Kanban board → drag deals
- ✅ Deal updates persist → toast shows confirmation
- ✅ User can view company 360 → see all data
- ✅ Deep links work from all pages

### Technical
- ✅ Sprint 2 typecheck passes
- ✅ No `any` types in new code
- ✅ All API endpoints have DTOs
- ✅ Loading/error states handled
- ✅ E2E smoke test passes

### Quality
- ✅ Code reviewed
- ✅ No Sonar critical issues
- ✅ Documentation updated
- ✅ Demo-ready

---

## 📞 Getting Help

### Stuck on Implementation?
1. Check [Sprint 3 Plan](./docs/SPRINT_3_PLAN.md) for API contracts
2. Review existing code for patterns (ContactsListPage, PipelinesPage)
3. Check [Architecture Diagrams](./docs/ARCHITECTURE_DIAGRAMS.md)

### Stuck on Types?
1. Check [deals.ts](./apps/frontend/src/types/deals.ts)
2. Review SDK types: `packages/sdk-js/src/types.gen.ts`
3. Use `unknown` temporarily, refine later

### Stuck on Backend?
1. Check Prisma schema: `apps/core-api/prisma/schema.prisma`
2. Review existing controllers for patterns
3. Test with `curl` or Postman

---

## 🏁 Final Pre-Sprint Checklist

Before starting development:

- [ ] All dependencies installed
- [ ] Backend starts successfully
- [ ] Frontend starts successfully
- [ ] Feature branches created and pushed
- [ ] Tickets assigned to owners
- [ ] Daily standup time scheduled
- [ ] Mid-sprint review scheduled (Day 5)
- [ ] Sprint demo scheduled (Day 10)
- [ ] Team has read Sprint 3 Plan

---

**Ready to code?** Start with:

```bash
git checkout feat/auth-login
# Begin FE-AUTH-01: Login page UI
```

---

**Last Updated**: October 24, 2025  
**Sprint Start**: TBD  
**Sprint End**: TBD  
**Status**: 🟢 **Ready to execute**

