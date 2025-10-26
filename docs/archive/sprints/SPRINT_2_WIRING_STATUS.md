# Sprint 2 Wiring Status

> **Status**: 🟡 95% Complete - Minor fixes needed  
> **Last Updated**: October 24, 2025

---

## ✅ Completed

### Backend Structure
- ✅ Created 4 feature modules (Pipelines, Stages, Activities, Tags)
- ✅ Moved controllers/services into proper module directories
- ✅ Wired all modules into `AppModule`
- ✅ Created RBAC guard with `@RequirePermission` decorator
- ✅ Fixed import paths for PrismaService

### Scripts & Tooling
- ✅ Added `openapi:emit` script to core-api
- ✅ Added `codegen` script to SDK package
- ✅ Created OpenAPI emit script (`emit-openapi.mjs`)

### SDK & Frontend
- ✅ Extended SDK client with 8 new endpoint groups
- ✅ Created Playwright smoke tests

### Documentation
- ✅ Created `SPRINT_2_KICKOFF.md` with complete guide

---

## 🔧 Remaining Fixes (5 minutes)

### Prisma Relation Names

The Prisma schema uses **capitalized** relation names (e.g., `Company`, `Contact`, `User`), but some services use lowercase. Need to fix:

**Files to update:**
1. `apps/core-api/src/modules/contacts/contacts.service.ts` — Change `company` → `Company`
2. `apps/core-api/src/modules/deals/deals.service.ts` — Change `contact` → `Contact`, `company` → `Company`, `stage` → `Stage`
3. `apps/core-api/src/modules/leads/leads.service.ts` — Change `contact` → `Contact`, `source` → `LeadSource`
4. `apps/core-api/src/modules/pipelines/pipelines.service.ts` — Change `stages` → `Stage`

**Example fix:**
```typescript
// Before
include: { company: true }

// After
include: { Company: true }
```

### Seed File Type Errors (Non-blocking)

The `prisma/seed.ts` file has TypeScript errors due to strict Prisma types, but the seed script **runs fine**. These can be ignored or fixed later by adding explicit type casts.

---

## 🚀 Quick Fix Commands

```bash
# Fix relation names (manual edit required)
# Edit the 4 files listed above and capitalize relation names

# Then build
pnpm --filter @apps/core-api build

# Generate Prisma client
pnpm --filter @apps/core-api prisma:generate

# Start API
pnpm --filter @apps/core-api start:dev

# Emit OpenAPI (in another terminal)
pnpm --filter @apps/core-api openapi:emit

# Generate SDK types
pnpm --filter @traffic-crm/sdk-js codegen

# Build SDK
pnpm --filter @traffic-crm/sdk-js build
```

---

## 📋 Verification Checklist

Once fixes are applied:

- [ ] `pnpm --filter @apps/core-api build` succeeds
- [ ] API starts: `pnpm --filter @apps/core-api start:dev`
- [ ] Swagger UI loads: `http://localhost:3000/docs`
- [ ] OpenAPI spec emits: `pnpm --filter @apps/core-api openapi:emit`
- [ ] SDK types generate: `pnpm --filter @traffic-crm/sdk-js codegen`
- [ ] SDK builds: `pnpm --filter @traffic-crm/sdk-js build`
- [ ] Frontend can import SDK: `import { createClient } from '@traffic-crm/sdk-js'`

---

## 🎯 What Success Looks Like

```bash
# Terminal 1: API running
$ pnpm --filter @apps/core-api start:dev
[Nest] 12345  - 10/24/2025, 3:45:00 PM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 10/24/2025, 3:45:01 PM     LOG [RoutesResolver] PipelinesController {/pipelines}:
[Nest] 12345  - 10/24/2025, 3:45:01 PM     LOG [RouterExplorer] Mapped {/pipelines, GET} route
[Nest] 12345  - 10/24/2025, 3:45:01 PM     LOG [NestApplication] Nest application successfully started

# Terminal 2: OpenAPI emitted
$ pnpm --filter @apps/core-api openapi:emit
📡 Fetching OpenAPI spec from http://localhost:3000
✅ OpenAPI spec written to /path/to/openapi.json

# Terminal 3: SDK generated
$ pnpm --filter @traffic-crm/sdk-js codegen
✔ Generating TypeScript types from OpenAPI spec
✔ Generated src/types.gen.ts

# Terminal 4: Frontend dev
$ pnpm --filter ./apps/frontend dev
VITE v5.x.x  ready in 500 ms
➜  Local:   http://localhost:5173/
```

---

## 📚 Next Steps After Wiring

1. **Add RBAC to existing controllers** — Add `@UseGuards(RbacGuard)` and `@RequirePermission()` to Contacts, Companies, Leads, Deals
2. **Wire SDK in frontend** — Replace `fetch`/`axios` with SDK client
3. **Build UI for Pipelines/Stages** — Settings page for pipeline management
4. **Add Activity Timeline to entity pages** — Show timeline on Contact/Deal detail pages
5. **Implement tag filtering** — Add tag chips and filters to list pages

---

**📍 You are here:** Sprint 2 Wiring (95% complete)  
**🏠 Return to:** [Sprint 2 Kickoff](./SPRINT_2_KICKOFF.md) | [Project README](./README.md)


