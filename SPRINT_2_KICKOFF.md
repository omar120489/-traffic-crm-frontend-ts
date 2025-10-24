# Sprint 2 Kickoff — Core CRUD + Pipelines + Activities + Tags

> **Status**: 🟢 Ready to start  
> **Duration**: 2 weeks  
> **Goal**: Polished CRUD with filters/tags, pipelines/stages, activity timeline, SDK integration, RBAC enforcement

---

## 🎯 Sprint 2 Goals (Outcomes)

- ✅ Core CRUD polished (filters/sort/pagination + tags) across Contacts, Companies, Leads, Deals
- ✅ Pipelines & Stages management live (with stage-change history)
- ✅ Unified Activity Timeline on entity pages (optimistic create)
- ✅ SDK wired via OpenAPI (frontend off axios → generated client)
- ✅ RBAC enforcement on core endpoints
- ✅ Green CI with smoke E2E for critical flows

---

## 📦 What's Been Scaffolded

### Backend (NestJS)

**New Controllers & Services:**
- `pipelines.controller.ts` + `pipelines.service.ts` — CRUD for pipelines
- `stages.controller.ts` + `stages.service.ts` — CRUD + reorder for stages
- `activities.controller.ts` + `activities.service.ts` — Timeline events
- `tags.controller.ts` + `tags.service.ts` — Tags + assignments

**RBAC:**
- `auth/rbac.guard.ts` — Guard + `@RequirePermission()` decorator
- Uses `@rbac/core` package (roles, permissions, `can()` helpers)

**OpenAPI:**
- `scripts/emit-openapi.mjs` — Fetch OpenAPI spec from running API
- `openapi:emit` script in `package.json`

### Frontend (React + Vite)

**SDK Client:**
- `packages/sdk-js/src/index.ts` — Extended with pipelines, stages, activities, tags methods
- `packages/sdk-js/src/client.ts` — Type-safe wrapper (optional, for future OpenAPI codegen)

**E2E Tests:**
- `apps/frontend/e2e/sprint2-smoke.spec.ts` — Playwright smoke tests for critical flows

---

## 🚀 Day 1–2: Immediate Next Steps

### 1. Lock Node 20 Everywhere

```bash
# Switch to Node 20 (if using nvm)
nvm use 20

# Verify
node --version  # Should show v20.x.x
pnpm --version  # Should show 10.x.x

# Enable corepack (for pnpm)
corepack enable
```

**Note:** Your `.nvmrc` is already set to `20`. Ensure your shell picks it up (add `nvm use` to `.zshrc` or `.bashrc`).

### 2. Wire New Modules into AppModule

Edit `apps/core-api/src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PipelinesController } from './modules/pipelines.controller';
import { PipelinesService } from './modules/pipelines.service';
import { StagesController } from './modules/stages.controller';
import { StagesService } from './modules/stages.service';
import { ActivitiesController } from './modules/activities.controller';
import { ActivitiesService } from './modules/activities.service';
import { TagsController } from './modules/tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    PipelinesController,
    StagesController,
    ActivitiesController,
    TagsController,
    // ... existing controllers
  ],
  providers: [
    PipelinesService,
    StagesService,
    ActivitiesService,
    TagsService,
    // ... existing services
  ],
})
export class AppModule {}
```

### 3. Generate OpenAPI + SDK Types

```bash
# Start the API (in one terminal)
pnpm --filter @apps/core-api start:dev

# In another terminal, emit OpenAPI spec
pnpm --filter @apps/core-api openapi:emit

# Generate SDK types
pnpm --filter @traffic-crm/sdk-js codegen

# Build SDK
pnpm --filter @traffic-crm/sdk-js build
```

### 4. Update Frontend to Use SDK

Replace direct `fetch`/`axios` calls with SDK client:

```typescript
// apps/frontend/src/lib/api.ts
import { createClient } from '@traffic-crm/sdk-js';

export const api = createClient({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  getToken: () => localStorage.getItem('token'),
});

// Usage in components:
const contacts = await api.listContacts({ page: 1, size: 20 });
const pipelines = await api.listPipelines(orgId);
```

### 5. Add RBAC to Existing Controllers

Example for `contacts.controller.ts`:

```typescript
import { UseGuards } from '@nestjs/common';
import { RbacGuard, RequirePermission } from '../auth/rbac.guard';

@Controller('contacts')
@UseGuards(RbacGuard)
export class ContactsController {
  @Get()
  @RequirePermission('contacts:read')
  async list() { ... }

  @Post()
  @RequirePermission('contacts:write')
  async create() { ... }

  @Delete(':id')
  @RequirePermission('contacts:delete')
  async delete() { ... }
}
```

---

## 🧩 Frontend Chores (Fast Wins)

1. **Extract Tables to UI Kit Patterns**
   - Use `AppPage`, `DataTable`, `FilterBar` from `@ui-kit/core`
   - See `apps/frontend/src/pages/ContactsPageExample.tsx` for reference

2. **URL-Driven Filters**
   - Parse `?q=&owner=&tag=&stage=` from URL
   - Update filters on URL change

3. **CSV Export Button**
   - Add "Export CSV" button to table headers
   - Use shared utilities (or simple `json2csv` library)

4. **Tag Chips in Tables**
   - Display tag chips in table rows
   - Click to filter by tag

---

## 🧪 Tests & Quality

### Unit Tests (Vitest)

```bash
# Test RBAC checks
pnpm --filter @apps/core-api test

# Test SDK adapters
pnpm --filter @traffic-crm/sdk-js test
```

### E2E Tests (Playwright)

```bash
# Run smoke tests
pnpm --filter @apps/frontend test:e2e

# Or run specific suite
npx playwright test e2e/sprint2-smoke.spec.ts
```

### Keep CI Green

```bash
# Full check
pnpm -r typecheck
pnpm -r lint
pnpm lint:md
pnpm test
```

---

## 🗂 Data Workflow (Quick)

```bash
# Push schema changes (schema-only mode)
pnpm db:migrate

# Refresh demo data
pnpm db:seed

# Open Prisma Studio
cd apps/core-api && npx prisma studio
```

---

## 🔎 Nice-to-Haves (If Time Permits)

- **Stage-change reason modal** — Capture won/lost reason when moving to final stages
- **Basic lead scoring column** — Display 0–100 score + sort
- **Server-side query params validation** — Use `zod`/`yup` shared schemas

---

## 📌 Sprint 2 Definition of Done

- [ ] CRUD polished for 4 entities (filters/sort/pagination/tags)
- [ ] Pipelines & Stages usable from UI
- [ ] Timeline visible + optimistic add
- [ ] FE uses generated SDK for at least Contacts + Companies
- [ ] RBAC enforced on touched endpoints
- [ ] 2 Playwright smokes pass in CI
- [ ] All typechecks, lints, tests green

---

## 📚 Quick Commands Reference

```bash
# Development
pnpm dev                          # Start all apps in parallel
pnpm --filter @apps/core-api dev # Start API only
pnpm --filter @apps/frontend dev  # Start frontend only

# Database
pnpm db:up                        # Start Postgres (Docker)
pnpm db:migrate                   # Push schema changes
pnpm db:seed                      # Seed demo data

# OpenAPI + SDK
pnpm --filter @apps/core-api openapi:emit  # Emit OpenAPI spec
pnpm --filter @traffic-crm/sdk-js codegen  # Generate SDK types
pnpm --filter @traffic-crm/sdk-js build    # Build SDK

# Testing
pnpm -r typecheck                 # Typecheck all packages
pnpm -r lint                      # Lint all packages
pnpm lint:md                      # Lint markdown
pnpm test                         # Run unit tests
pnpm --filter @apps/frontend test:e2e  # Run E2E tests

# CI
pnpm -r build                     # Build all packages
```

---

## ✍️ Update Log

- **2025-10-24:** Sprint 2 kickoff scaffolding complete (controllers, services, RBAC guard, SDK extensions, smoke tests)

---

**📍 You are here:** Sprint 2 Kickoff  
**🏠 Return to:** [Documentation Index](./docs/INDEX.md) | [Project README](./README.md)  
**🚀 Repository:** <https://github.com/omar120489/-traffic-crm-frontend-ts>


