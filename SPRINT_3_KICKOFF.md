# Sprint 3 Kickoff: Auth-in, Kanban, Company 360 🚀

**Status**: Ready to start  
**Duration**: 2 weeks  
**Story Points**: 33  
**Team Velocity Target**: 15-20 points/week

---

## 🎯 Sprint Goal

Ship a **usable end-to-end flow**: User logs in → Views deals on Kanban board → Drags deals between stages → Views company 360 page

---

## ✅ Pre-Sprint Checklist

### Infrastructure (Already Complete)
- ✅ Sprint 2 quality gates passing
- ✅ Renovate configured for dependency management
- ✅ ADR framework in place
- ✅ Architecture diagrams published
- ✅ CI/CD with docs linting
- ✅ Pre-commit and pre-push hooks active

### Sprint 3 Setup (Do Now)
- [ ] Review [Sprint 3 Plan](./docs/SPRINT_3_PLAN.md)
- [ ] Create feature branches
- [ ] Install any missing dependencies
- [ ] Verify dev servers start
- [ ] Review API contracts

---

## 🚀 Quick Start (5 Minutes)

### 1. Create Feature Branches

```bash
cd /Users/kguermene/Desktop/traffic-crm-frontend-ts_20251018_055516

# Create branches for parallel work
git checkout -b feat/auth-login
git push -u origin feat/auth-login

git checkout main
git checkout -b feat/deals-kanban
git push -u origin feat/deals-kanban

git checkout main
git checkout -b feat/company-360
git push -u origin feat/company-360

# Return to main
git checkout main
```

### 2. Verify Dependencies

```bash
# Install (should be fast, lockfile is frozen)
pnpm -r install --frozen-lockfile

# Verify @dnd-kit is installed (Sprint 2 already added it)
pnpm list @dnd-kit/core
# Should show: @dnd-kit/core 6.3.1
```

### 3. Start Dev Servers

```bash
# Terminal 1: Backend
pnpm --filter ./apps/core-api run start:dev
# Should start on http://localhost:3000

# Terminal 2: Frontend  
pnpm --filter ./apps/frontend run dev
# Should start on http://localhost:5173
```

### 4. Verify Existing Endpoints

```bash
# Check if auth endpoint exists
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@acme.io","password":"test"}'

# Check if pipelines endpoint exists
curl http://localhost:3000/api/pipelines \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check if companies endpoint exists
curl http://localhost:3000/api/companies \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📦 What's Been Scaffolded

### Frontend Files Created

| File | Purpose | Status |
|------|---------|--------|
| `apps/frontend/src/types/deals.ts` | Deal, Stage, Pipeline types | ✅ Created |
| `apps/frontend/src/services/deals.service.ts` | API client for deals | ✅ Created |
| `apps/frontend/src/pages/deals/DealsKanbanPage.tsx` | Main Kanban board | ⏳ TODO |
| `apps/frontend/src/pages/deals/components/KanbanColumn.tsx` | Droppable column | ⏳ TODO |
| `apps/frontend/src/pages/deals/components/KanbanCard.tsx` | Draggable card | ⏳ TODO |
| `apps/frontend/src/pages/companies/CompanyDetailPage.tsx` | Company 360 view | ⏳ TODO |
| `apps/frontend/src/pages/auth/LoginPage.tsx` | Login form | ⏳ TODO |

### Backend Files to Create

| File | Purpose | Status |
|------|---------|--------|
| `apps/core-api/src/deals/dto/update-deal-stage.dto.ts` | PATCH payload validation | ⏳ TODO |
| `apps/core-api/src/deals/deals.controller.ts` | Add PATCH endpoint | ⏳ TODO |
| `apps/core-api/src/deals/deals.service.ts` | Add move logic | ⏳ TODO |
| `apps/core-api/src/companies/dto/company-summary.dto.ts` | Summary response shape | ⏳ TODO |
| `apps/core-api/src/companies/companies.controller.ts` | Add summary endpoint | ⏳ TODO |
| `apps/core-api/src/companies/companies.service.ts` | Add summary logic | ⏳ TODO |

---

## 🎫 Sprint Backlog (33 Points)

### Week 1 (Days 1-5): Auth + Kanban Foundation

| Day | Tickets | Points | Owner |
|-----|---------|--------|-------|
| 1-2 | FE-AUTH-01, FE-AUTH-02, FE-AUTH-03, BE-AUTH-01 | 7 | TBD |
| 3-4 | FE-KANBAN-01, FE-KANBAN-02 | 6 | TBD |
| 5   | BE-KANBAN-01, FE-KANBAN-03 | 4 | TBD |

**Week 1 Total**: 17 points

### Week 2 (Days 6-10): Kanban Polish + Company 360

| Day | Tickets | Points | Owner |
|-----|---------|--------|-------|
| 6-7 | FE-KANBAN-04, FE-KANBAN-05, FE-COMPANY-01 | 5 | TBD |
| 8-9 | FE-COMPANY-02, FE-COMPANY-03, BE-COMPANY-01 | 4 | TBD |
| 10  | FE-COMPANY-04, CI-01, E2E-01, DOCS-01 | 4 | TBD |

**Week 2 Total**: 13 points  
**Buffer**: 3 points

---

## 🔧 Development Workflow

### For Each Ticket

1. **Checkout feature branch**
   ```bash
   git checkout feat/auth-login  # or feat/deals-kanban, etc.
   ```

2. **Create ticket branch**
   ```bash
   git checkout -b feat/auth-login/FE-AUTH-01
   ```

3. **Implement**
   - Write code
   - Add types (no `any`)
   - Handle loading/error states
   - Add toast notifications

4. **Test locally**
   ```bash
   # TypeScript check
   pnpm --filter ./apps/frontend run typecheck:sprint2
   
   # Lint
   pnpm --filter ./apps/frontend run lint
   
   # Manual test in browser
   ```

5. **Commit**
   ```bash
   git add .
   git commit -m "feat(auth): implement login page UI (FE-AUTH-01)"
   # Pre-commit hook runs automatically
   ```

6. **Push**
   ```bash
   git push origin feat/auth-login/FE-AUTH-01
   # Pre-push hook runs automatically
   ```

7. **Create PR**
   - Base: `feat/auth-login` (feature branch)
   - Title: `feat(auth): implement login page UI (FE-AUTH-01)`
   - Description: Link to ticket, screenshots, testing notes

8. **Merge to feature branch**
   - After review + CI passes
   - Squash merge recommended

9. **At end of sprint: Merge feature branch to main**
   - Create PR from `feat/auth-login` → `main`
   - Full review + demo
   - Merge when all tickets complete

---

## 📊 Daily Standup Template

### What I did yesterday
- Completed: [Ticket IDs]
- Blocked: [Any blockers]

### What I'm doing today
- Working on: [Ticket IDs]
- Pairing with: [Team member]

### Blockers
- [Any impediments]

### Sprint Progress
- Points completed: X / 33
- Days remaining: Y / 10
- On track: Yes/No

---

## 🧪 Testing Strategy

### Unit Tests (Optional but Recommended)

```typescript
// apps/frontend/src/services/deals.service.test.ts
import { describe, it, expect, vi } from 'vitest';
import { moveDeal } from './deals.service';

describe('deals.service', () => {
  it('should call PATCH /api/deals/:id with correct payload', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: '123', stageId: 'new-stage', position: 2 }),
    });

    const result = await moveDeal('123', { stageId: 'new-stage', position: 2 });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/deals/123',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ stageId: 'new-stage', position: 2 }),
      })
    );
    expect(result).toEqual({ id: '123', stageId: 'new-stage', position: 2 });
  });
});
```

### E2E Tests (Required for DoD)

```typescript
// apps/frontend/e2e/sprint3-kanban.spec.ts
import { test, expect } from '@playwright/test';

test('Sprint 3: Login → Kanban DnD → Company 360', async ({ page }) => {
  // 1. Login
  await page.goto('/login');
  await page.fill('[name="email"]', 'admin@acme.io');
  await page.fill('[name="password"]', 'test');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/contacts');

  // 2. Navigate to Kanban
  await page.goto('/deals/board');
  await page.waitForSelector('[data-testid="kanban-board"]');

  // 3. Drag deal to new stage
  const card = page.locator('[data-testid="deal-card"]').first();
  const targetColumn = page.locator('[data-testid="kanban-column"]').nth(1);
  await card.dragTo(targetColumn);

  // 4. Verify PATCH request
  const patchRequest = await page.waitForRequest(req =>
    req.url().includes('/api/deals/') && req.method() === 'PATCH'
  );
  const payload = patchRequest.postDataJSON();
  expect(payload).toHaveProperty('stageId');
  expect(payload).toHaveProperty('position');

  // 5. Verify toast
  await expect(page.locator('.MuiAlert-root')).toContainText('Deal moved');

  // 6. Navigate to company
  await page.click('[data-testid="company-link"]');
  await expect(page).toHaveURL(/\/companies\/.+/);
  await expect(page.locator('h5')).toContainText('Acme Inc');
});
```

---

## 📚 Reference Documentation

### Sprint 3 Specific
- [Sprint 3 Plan](./docs/SPRINT_3_PLAN.md) - Detailed tickets and API contracts
- [Deals Types](./apps/frontend/src/types/deals.ts) - TypeScript interfaces
- [Deals Service](./apps/frontend/src/services/deals.service.ts) - API client

### Infrastructure (Sprint 2)
- [Architecture Diagrams](./docs/ARCHITECTURE_DIAGRAMS.md) - System visualization
- [Quality Improvements](./QUALITY_IMPROVEMENTS_APPLIED.md) - Code quality standards
- [Smoke Test Results](./SMOKE_TEST_RESULTS.md) - Verification checklist
- [Contributing Guide](./CONTRIBUTING.md) - Development workflow

### External Resources
- [dnd-kit Documentation](https://docs.dndkit.com/) - Drag and drop library
- [MUI Components](https://mui.com/material-ui/getting-started/) - UI library
- [Playwright Docs](https://playwright.dev/) - E2E testing

---

## 🎯 Success Criteria

### Functional
- [ ] User can log in and see authenticated state
- [ ] User can view deals on Kanban board grouped by stage
- [ ] User can drag deals between stages
- [ ] Deal position updates optimistically with toast feedback
- [ ] User can view company 360 page with all data
- [ ] Deep links work from contacts and Kanban

### Technical
- [ ] All Sprint 2 typecheck gates pass
- [ ] No `any` types in new code
- [ ] All API endpoints have proper DTOs
- [ ] Loading/empty/error states handled
- [ ] E2E smoke test passes

### Quality
- [ ] Code reviewed by at least 1 person
- [ ] No Sonar critical issues introduced
- [ ] Documentation updated
- [ ] Demo-ready by end of sprint

---

## 🚨 Common Pitfalls & Solutions

### Pitfall 1: DnD Library Complexity
**Solution**: Start with basic column-to-column drag. Defer:
- Virtualized lists
- Touch support
- Accessibility enhancements

### Pitfall 2: Position Reordering Logic
**Solution**: Use transaction in backend:
1. Remove deal from old position
2. Compact old stage positions
3. Insert deal at new position
4. Update all affected positions

### Pitfall 3: Optimistic Updates Rollback
**Solution**: Keep previous state:
```typescript
const prevState = itemsByStage;
try {
  setItemsByStage(newState); // Optimistic
  await moveDeal(id, payload);
} catch (err) {
  setItemsByStage(prevState); // Rollback
  showToast('Failed to move deal', 'error');
}
```

### Pitfall 4: Auth Token Expiry
**Solution**: Add axios interceptor:
```typescript
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);
```

---

## 📞 Getting Help

### Blocked on Backend?
- Check if endpoint exists: `curl http://localhost:3000/api/...`
- Review Prisma schema: `apps/core-api/prisma/schema.prisma`
- Check existing controllers for patterns

### Blocked on Frontend?
- Review existing pages for patterns (ContactsListPage, PipelinesPage)
- Check UI Kit components: `packages/ui-kit/src/components/`
- Test in isolation with mock data first

### Blocked on Types?
- Check existing types: `apps/frontend/src/types/`
- Review SDK types: `packages/sdk-js/src/types.gen.ts`
- Use `unknown` temporarily, refine later

---

## 🎉 Sprint Kickoff Checklist

Before starting development:

- [ ] Read [Sprint 3 Plan](./docs/SPRINT_3_PLAN.md)
- [ ] Create all feature branches
- [ ] Verify dev servers start
- [ ] Review API contracts
- [ ] Assign tickets to team members
- [ ] Set up daily standup time
- [ ] Schedule mid-sprint review (Day 5)
- [ ] Schedule sprint demo (Day 10)
- [ ] Update project board with tickets

---

**Ready to start?** Run:

```bash
git checkout feat/auth-login
# Start with FE-AUTH-01: Login page UI
```

**Questions?** Check [Sprint 3 Plan](./docs/SPRINT_3_PLAN.md) or ask in team chat.

---

**Last Updated**: October 24, 2025  
**Sprint Start**: TBD  
**Sprint End**: TBD  
**Status**: 🟢 Ready to kick off

