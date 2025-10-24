# Sprint 3: "Auth-in, Kanban, Company 360"

**Duration**: 2 weeks  
**Goal**: Ship a usable slice: login → deals board (drag & drop) → company 360 view

---

## 🎯 Objectives (Definition of Done)

### 1. Auth Login Flow (Real)
- ✅ Users can log in via `/login`, receive JWT, app state hydrates
- ✅ Token refresh/expiry handled; 401 → redirect to `/login`
- ✅ **DoD**: E2E smoke runs headless: login → contacts → logout

### 2. Deals Kanban (MVP)
- ✅ Board grouped by pipeline stages, DnD to update `stageId` and ordering
- ✅ Stage WIP label + basic filters (owner, tags)
- ✅ **DoD**: Drag card → PATCH deal → optimistic update + toast

### 3. Company 360
- ✅ `/companies/:id`: company info, contacts, active deals, revenue summary, timeline
- ✅ Deep links work from lists and Kanban
- ✅ **DoD**: Loading/empty states + error toasts

### 4. Quality Gates Continue to Pass
- ✅ Sprint 2 typecheck pre-push passes
- ✅ New code 100% in sprint2 tsconfig scope (or add to scope)

---

## 📋 Backlog → Tickets

### A. Auth (9 points)

| Ticket | Description | Points |
|--------|-------------|--------|
| **FE-AUTH-01** | `/login` page (finalize UI, wire) | 3 |
| **FE-AUTH-02** | AuthContext - handle token write/read, expiry redirect | 2 |
| **FE-AUTH-03** | Protected routes guard | 1 |
| **BE-AUTH-01** | `/api/auth/login` endpoint (returns `{access_token, exp, orgId, roles}`) | 2 |
| **FE-AUTH-04** | Error states (invalid creds), remember me | 1 |

**Notes**:
- If `/api/auth/login` already exists: align payload + CORS
- Use existing `AuthContext` from Sprint 2 as base

---

### B. Deals Kanban (12 points)

| Ticket | Description | Points |
|--------|-------------|--------|
| **FE-KANBAN-01** | Board UI (columns by stages), skeletons | 3 |
| **FE-KANBAN-02** | DnD (dnd-kit), optimistic updates | 3 |
| **FE-KANBAN-03** | Filters: owner (multi), tags (multi), search | 2 |
| **BE-KANBAN-01** | `PATCH /api/deals/:id` accepts `{ stageId, position }` | 2 |
| **FE-KANBAN-04** | Board URL params sync (`?pipelineId=...&owner=...&tag=...`) | 1 |
| **FE-KANBAN-05** | Empty states + toasts | 1 |

**Notes**:
- Stage reorder already exists; confirm "position" semantics
- Use `@dnd-kit/core` and `@dnd-kit/sortable` (already installed)

---

### C. Company 360 (8 points)

| Ticket | Description | Points |
|--------|-------------|--------|
| **FE-COMPANY-01** | Info card (industry, size, site), contacts table, deals table | 3 |
| **FE-COMPANY-02** | Revenue summary (sum won) | 1 |
| **FE-COMPANY-03** | Timeline embed (reuse EntityTimeline) | 1 |
| **BE-COMPANY-01** | `/api/companies/:id/summary` aggregate endpoint | 2 |
| **FE-COMPANY-04** | Link integration: from contacts & board | 1 |

---

### D. DX/QA (4 points)

| Ticket | Description | Points |
|--------|-------------|--------|
| **CI-01** | Add `apps/frontend` lint to PR (sprint2 scope) | 1 |
| **E2E-01** | Playwright smoke: login → board DnD → company view | 2 |
| **DOCS-01** | USER_FLOWS.md (animated gifs / steps) | 1 |

---

## 📡 API Contracts

### PATCH /api/deals/:id

**Request Body**:
```json
{
  "stageId": "uuid",
  "position": 3
}
```

**Response**: `200 OK` → updated deal

**Notes**:
- `position` is 0-based within stage
- Server handles reordering other deals in the stage

---

### GET /api/companies/:id/summary

**Response**:
```json
{
  "company": {
    "id": "uuid",
    "name": "Acme Inc.",
    "industry": "Technology",
    "size": "50-100",
    "website": "https://acme.io"
  },
  "stats": {
    "contacts": 12,
    "activeDeals": 3,
    "wonRevenue": 125000
  },
  "recentDeals": [
    {
      "id": "uuid",
      "name": "Q4 Enterprise Deal",
      "amount": 50000,
      "stage": "Proposal"
    }
  ],
  "contacts": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@acme.io"
    }
  ]
}
```

---

## 📅 Milestones

| Days | Focus |
|------|-------|
| **Day 1-2** | Finalize auth FE/BE, protect routes |
| **Day 3-5** | Kanban columns + DnD + PATCH endpoint + optimistic UX |
| **Day 6-7** | Filters + URL sync + empty states |
| **Day 8-9** | Company 360 FE + summary endpoint |
| **Day 10** | E2E smoke, polish, docs, demo |

---

## ⚠️ Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| **DnD complexity** | Start with simplest lib, defer virtualized lists |
| **API aggregation perf** | Precompute via SELECTs; defer caching |
| **Auth edge-cases** | Force-expire token in E2E to verify redirect |

---

## ✅ Definition of Done (Per Ticket)

- [ ] Types strict, no `any` escapes
- [ ] Pre-push sprint2 typecheck passes
- [ ] Unit/integration where meaningful (service, hook, util)
- [ ] Screens: skeleton, empty, error handled
- [ ] Docs updated (README links or USER_FLOWS)

---

## 🚀 "Start Coding" Checklist

### 1. Create Feature Branches

```bash
git checkout -b feat/auth-login
git checkout -b feat/deals-kanban
git checkout -b feat/company-360
```

### 2. Install Dependencies

```bash
# Already installed in Sprint 2:
# - @dnd-kit/core
# - @dnd-kit/sortable
# - @dnd-kit/utilities

# Verify:
pnpm -r install --frozen-lockfile
```

### 3. Start Dev Servers

```bash
# Terminal 1: Backend
pnpm --filter ./apps/core-api run start:dev

# Terminal 2: Frontend
pnpm --filter ./apps/frontend run dev
```

### 4. Verify Existing Auth Endpoint

```bash
# If /api/auth/login doesn't exist, implement:
# - Controller → Service → return {access_token, exp, orgId, roles}
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@acme.io","password":"test"}'
```

---

## 📁 File Structure (New Files)

### Frontend

```
apps/frontend/src/
├── types/
│   └── deals.ts                    # Deal, Stage, Pipeline types
├── services/
│   └── deals.service.ts            # API client for deals
├── pages/
│   ├── auth/
│   │   └── LoginPage.tsx           # Login form
│   ├── deals/
│   │   ├── DealsKanbanPage.tsx    # Main Kanban board
│   │   └── components/
│   │       ├── KanbanColumn.tsx    # Droppable column
│   │       └── KanbanCard.tsx      # Draggable card
│   └── companies/
│       └── CompanyDetailPage.tsx   # Company 360 view
└── contexts/
    └── AuthContext.tsx             # (Already exists, enhance)
```

### Backend

```
apps/core-api/src/
├── auth/
│   ├── auth.controller.ts          # /api/auth/login endpoint
│   └── auth.service.ts             # JWT generation
├── deals/
│   ├── dto/
│   │   └── update-deal-stage.dto.ts  # PATCH payload validation
│   ├── deals.controller.ts         # PATCH /api/deals/:id
│   └── deals.service.ts            # Move logic with transaction
└── companies/
    ├── dto/
    │   └── company-summary.dto.ts  # Summary response shape
    ├── companies.controller.ts     # GET /api/companies/:id/summary
    └── companies.service.ts        # Aggregate queries
```

---

## 🧪 Testing Strategy

### Unit Tests
- `deals.service.ts` - move logic with position reordering
- `companies.service.ts` - summary aggregation
- `AuthContext` - token expiry detection

### Integration Tests
- `PATCH /api/deals/:id` - verify position updates
- `GET /api/companies/:id/summary` - verify aggregates

### E2E Tests (Playwright)
```typescript
test('Kanban DnD flow', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'admin@acme.io');
  await page.fill('[name="password"]', 'test');
  await page.click('button[type="submit"]');
  
  await page.goto('/deals/board');
  await page.waitForSelector('[data-testid="kanban-board"]');
  
  // Drag first card to second column
  const card = page.locator('[data-testid="deal-card"]').first();
  const column = page.locator('[data-testid="kanban-column"]').nth(1);
  await card.dragTo(column);
  
  // Verify PATCH request
  const request = await page.waitForRequest(req => 
    req.url().includes('/api/deals/') && req.method() === 'PATCH'
  );
  const payload = request.postDataJSON();
  expect(payload).toHaveProperty('stageId');
  expect(payload).toHaveProperty('position');
  
  // Verify toast
  await expect(page.locator('.MuiAlert-root')).toContainText('Deal moved');
});
```

---

## 📊 Progress Tracking

### Sprint Burndown

| Day | Planned | Actual | Remaining |
|-----|---------|--------|-----------|
| 1   | 33      | -      | 33        |
| 2   | 30      | -      | -         |
| 3   | 27      | -      | -         |
| 4   | 24      | -      | -         |
| 5   | 21      | -      | -         |
| 6   | 18      | -      | -         |
| 7   | 15      | -      | -         |
| 8   | 12      | -      | -         |
| 9   | 9       | -      | -         |
| 10  | 0       | -      | -         |

**Total Story Points**: 33

---

## 🔗 Related Documentation

- [Sprint 2 Infrastructure](./INFRASTRUCTURE_COMPLETE.md)
- [Architecture Diagrams](./ARCHITECTURE_DIAGRAMS.md)
- [Quality Improvements](../QUALITY_IMPROVEMENTS_APPLIED.md)
- [Smoke Test Results](../SMOKE_TEST_RESULTS.md)
- [Contributing Guide](../CONTRIBUTING.md)

---

## 📝 Notes

### Database Schema Requirements

Ensure Prisma schema has:

```prisma
model Deal {
  id        String   @id @default(uuid())
  name      String
  amount    Int
  stageId   String
  position  Int      @default(0)
  status    DealStatus @default(OPEN)
  companyId String?
  ownerId   String?
  
  stage     Stage    @relation(fields: [stageId], references: [id])
  company   Company? @relation(fields: [companyId], references: [id])
  owner     User?    @relation(fields: [ownerId], references: [id])
  
  @@index([stageId, position])
}

enum DealStatus {
  OPEN
  WON
  LOST
}
```

### Auth Token Structure

JWT payload should include:
```json
{
  "sub": "user-uuid",
  "orgId": "org-uuid",
  "roles": ["admin"],
  "exp": 1234567890,
  "iat": 1234567890
}
```

---

**Last Updated**: October 24, 2025  
**Sprint Start**: TBD  
**Sprint End**: TBD  
**Team Velocity**: TBD (estimate 15-20 points/week)

