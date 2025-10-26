# Sprint 2 Quick Start Guide 🚀

**Get Sprint 2 running in 5 minutes**

## Prerequisites

- Node.js 20.x (recommended: `nvm use 20`)
- pnpm 9.x
- PostgreSQL running (or use `pnpm db:up`)

## 🎯 One-Command Verification

```bash
# Terminal 1: Start the API
pnpm --filter @apps/core-api start:dev

# Terminal 2: Run greenlight check
pnpm greenlight
```

The greenlight script will:
- ✅ Build the Core API
- ✅ Check API health
- ✅ Emit OpenAPI spec
- ✅ Generate SDK types
- ✅ Build SDK
- ✅ Typecheck frontend
- ✅ Check for SDK drift

## 🚀 Full Dev Loop (3 terminals)

### Terminal 1: Core API
```bash
cd /path/to/traffic-crm-frontend-ts_20251018_055516

# Ensure DB is ready
pnpm db:up        # Start PostgreSQL (if using Docker)
pnpm db:migrate   # Push schema (fast, no migrations)
pnpm db:seed      # Load demo data

# Start API
pnpm --filter @apps/core-api start:dev
# → http://localhost:3000
# → http://localhost:3000/api/docs (Swagger)
```

### Terminal 2: SDK Sync (run once, or after API changes)
```bash
pnpm dev:sdk
# This runs:
#   1. openapi:emit  → apps/core-api/openapi.json
#   2. codegen       → packages/sdk-js/src/types.gen.ts
#   3. build         → packages/sdk-js/dist/
```

### Terminal 3: Frontend
```bash
pnpm --filter ./apps/frontend dev
# → http://localhost:5173
```

## 🧪 Smoke Test Checklist

### 1. Pipelines & Stages
- Open: http://localhost:5173/settings/pipelines
- Create "Sales" pipeline
- Add 3 stages (Prospecting, Proposal, Negotiation)
- Drag to reorder
- Set probabilities (25%, 50%, 75%)
- Delete one stage
- Set pipeline as default

### 2. Contacts List
- Open: http://localhost:5173/contacts
- Search by name (URL updates: `?q=john`)
- Verify pagination works
- Click "Add Contact" (if button exists)

### 3. Contact Detail & Activity Timeline
- Open any contact: http://localhost:5173/contacts/:id
- Click "Add Activity"
- Select type: "Note"
- Subject: "Follow up"
- Body: "Discussed project requirements"
- Submit → verify optimistic update
- Refresh → verify persistence

### 4. Tags
- On contacts list or detail page
- Add a tag (e.g., "VIP")
- Assign tag to contact
- Verify tag chip appears
- Filter by tag (if TagFilter is wired)
- Remove tag
- Verify removal persists

## 🔍 Troubleshooting

### Node Version Warnings
```bash
# Use Node 20 to match repo
nvm use 20
```

### API Not Running
```bash
# Check if API is up
curl http://localhost:3000/health

# If not, start it:
pnpm --filter @apps/core-api start:dev
```

### SDK Out of Sync
```bash
# Regenerate SDK
pnpm dev:sdk

# Check for changes
git diff packages/sdk-js

# If changed, commit:
git add packages/sdk-js
git commit -m "chore: regenerate SDK types"
```

### Frontend Import Errors
```bash
# Ensure SDK is built
pnpm --filter @traffic-crm/sdk-js build

# Typecheck
pnpm --filter ./apps/frontend typecheck
```

### Prisma Type Errors (Non-blocking)
These are strict typing warnings in seed scripts. They don't prevent the app from running.

**Fix (optional):**
```typescript
// Wrap create payloads with Prisma validator
const orgData = Prisma.validator<Prisma.OrgCreateInput>()({
  id: 'clx0d018d000008l701211234',
  name: 'Acme Corp',
  // ...
});
```

## 📦 What's Included

### Backend (NestJS)
- ✅ Pipelines CRUD (`/pipelines`)
- ✅ Stages CRUD + reorder (`/stages`)
- ✅ Activities CRUD (`/activities`)
- ✅ Tags CRUD + assignment (`/tags`)
- ✅ RBAC Guard with `@RequirePermission` decorator
- ✅ OpenAPI/Swagger documentation
- ✅ Prisma schema (full CRM domain)

### Frontend (React + Vite)
- ✅ Pipelines settings page (CRUD + drag reorder)
- ✅ Contacts list (SDK-powered, search, pagination)
- ✅ Contact detail with Activity Timeline
- ✅ Reusable components:
  - `ActivityDialog` (optimistic updates)
  - `TagManager` (assign/create tags)
  - `TagFilter` (URL-driven filtering)
  - `FilterBar` (search + extras)
- ✅ Centralized API client (`lib/api.ts`)
- ✅ Type-safe routes (`routes/sprint2.routes.tsx`)

### SDK (`@traffic-crm/sdk-js`)
- ✅ Auto-generated from OpenAPI
- ✅ Type-safe methods for all endpoints
- ✅ Centralized error handling
- ✅ JWT auth integration
- ✅ Retry logic (ky-based)

### CI/CD
- ✅ SDK codegen workflow (auto-commits on API changes)
- ✅ Docs lint workflow
- ✅ Verification scripts

## 🎯 Next Steps

### This Week
1. **Migrate other entities to SDK**
   - Companies: Follow `ContactsListPage` pattern
   - Leads: Follow `ContactsListPage` pattern
   - Deals: Add stage-change history

2. **Wire RBAC**
   ```typescript
   @UseGuards(RbacGuard)
   @RequirePermission('deals:write')
   @Post()
   createDeal(@Body() dto: CreateDealDto) { /* ... */ }
   ```

3. **Add Playwright E2E**
   - Contact creation flow
   - Pipeline management flow
   - Tag assignment flow

4. **Enable SDK drift check as required PR status**
   - Update `.github/workflows/sdk-codegen.yml`
   - Add to branch protection rules

### Polishing
- [ ] Extract table patterns to `@ui-kit`
- [ ] URL-driven filters on all list pages
- [ ] CSV export buttons
- [ ] Stage-change reason modal (won/lost capture)
- [ ] Basic lead scoring (0-100)
- [ ] Server-side query validation (zod/yup)

## 📚 Documentation

- **[SPRINT_2_RUNBOOK.md](./SPRINT_2_RUNBOOK.md)** — Complete runbook
- **[SPRINT_2_FEATURES_READY.md](./SPRINT_2_FEATURES_READY.md)** — Component reference
- **[SPRINT_2_KICKOFF.md](./SPRINT_2_KICKOFF.md)** — Sprint overview
- **[SPRINT_2_WIRING_STATUS.md](./SPRINT_2_WIRING_STATUS.md)** — Wiring status

## 🆘 Need Help?

### Check Logs
```bash
# API logs
tail -f apps/core-api/logs/*.log

# Frontend dev server
# (logs in terminal where you ran pnpm dev)
```

### Verify Setup
```bash
# Run full verification
pnpm greenlight

# Individual checks
pnpm --filter @apps/core-api build
pnpm --filter @apps/core-api typecheck
pnpm --filter @traffic-crm/sdk-js build
pnpm --filter ./apps/frontend typecheck
```

### Common Issues

| Issue | Solution |
|-------|----------|
| `fetch failed` in `openapi:emit` | Ensure API is running: `pnpm --filter @apps/core-api start:dev` |
| `Cannot find module '@traffic-crm/sdk-js'` | Run `pnpm dev:sdk` |
| `Prisma.XCreateInput` type errors | Non-blocking, or wrap with `Prisma.validator<T>()({...})` |
| Engine warnings (Node 24 vs 20) | Use `nvm use 20` or update `.nvmrc` to 24 |
| RBAC `ForbiddenException` | Check JWT has correct role/permissions |

## ✨ Success Criteria

You're ready to ship when:
- ✅ `pnpm greenlight` passes
- ✅ All 3 pages load without errors
- ✅ Can create pipeline, add stages, reorder
- ✅ Can view contacts, open detail, add activity
- ✅ Can assign/remove tags
- ✅ No SDK drift (or drift is committed)

---

**🎉 You're ready to ship Sprint 2!**

For detailed component usage and production patterns, see [SPRINT_2_FEATURES_READY.md](./SPRINT_2_FEATURES_READY.md).


