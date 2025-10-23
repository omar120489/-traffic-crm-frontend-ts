# Traffic CRM - Phase 2 Execution Plan

**Start Date:** October 23, 2025  
**Phase 1 Status:** ✅ Complete & Validated  
**Execution Strategy:** Feature-by-feature with clear acceptance criteria

---

## 🎯 Phase 2 Overview

Transform the monorepo from structure-only to a fully-integrated, type-safe, standardized codebase with:

- Shared types across frontend & backends
- Type-safe API contracts (OpenAPI/Zod)
- Standardized page architecture (AppPage, filters, exports, RBAC)
- Quality guardrails (pre-commit hooks, CI, ESLint zones)
- Unified dev environment (Docker Compose)

**Estimated Timeline:** 1-2 weeks (feature-by-feature)

---

## 📋 Feature Breakdown

### A) Shared Types & Path Aliases (Day 1)

**Goal:** Single source of truth for IDs, DTOs, pagination, domain models

**Tasks:**

1. Extract stable types to `packages/shared-types/src/`:
   - `EntityId` (already done), `Paginated<T>` (already done)
   - `BaseEntity` (id, createdAt, updatedAt)
   - Domain models: `Lead`, `Deal`, `Contact`, `Company`, `Note`, `Attachment`, `Notification`

2. Add import aliases in `tsconfig.base.json`:
   - `@shared-types/*` → `packages/shared-types/src/*` (already done)
   - `@core/*` → `apps/frontend/src/core/*`
   - `@data/*` → `apps/frontend/src/data/*`
   - `@features/*` → `apps/frontend/src/features/*`
   - `@shared/*` → `apps/frontend/src/shared/*`
   - `@views/*` → `apps/frontend/src/views/*`

3. Update `vite.config.mjs` with matching aliases

4. Update frontend imports incrementally (start with Contacts feature)

**Branch:** `chore/phase2-shared-types`

**Acceptance Criteria:**

- ✅ `pnpm --filter @shared-types typecheck` passes
- ✅ Contacts feature uses `@shared-types/contact`
- ✅ All path aliases work in VS Code & build
- ✅ Zero TypeScript errors in production code

**Files Changed:**

- `packages/shared-types/src/` (new types)
- `tsconfig.base.json` (path aliases)
- `apps/frontend/vite.config.mjs` (path aliases)
- `apps/frontend/src/views/pages/contacts/` (updated imports)
- `apps/frontend/src/services/contacts.ts` (updated imports)

---

### B) API Contracts (Day 2-3)

**Goal:** Stable contracts between frontend & backends

**Decision Point:** Choose source of truth:

- **Option 1 (Recommended):** OpenAPI in `apps/api-dev` & `apps/reporting`
- **Option 2:** Zod schemas in `packages/api-contracts`

#### Option 1: OpenAPI + Orval

**Tasks:**

1. Create `packages/api-clients/`:

   ```
   packages/api-clients/
   ├─ src/
   │  ├─ api-dev.openapi.yaml
   │  ├─ reporting.openapi.yaml
   │  └─ generated/
   │     ├─ api-dev.ts
   │     └─ reporting.ts
   ├─ orval.config.ts
   ├─ package.json
   └─ tsconfig.json
   ```

2. Install dependencies:
   - `orval` for client generation
   - `openapi-typescript` or `openapi-fetch`

3. Define OpenAPI spec for Contacts endpoints:
   - `GET /contacts` (list with filters)
   - `GET /contacts/:id` (detail)
   - `POST /contacts` (create)
   - `PATCH /contacts/:id` (update)
   - `DELETE /contacts/:id` (delete)

4. Generate typed client:

   ```bash
   pnpm --filter @api-clients run generate
   ```

5. Replace `apps/frontend/src/services/contacts.ts` with typed client calls

**Branch:** `chore/phase2-contracts-contacts`

**Acceptance Criteria:**

- ✅ OpenAPI spec validates
- ✅ Typed client generated successfully
- ✅ Contacts service uses typed client
- ✅ Autocomplete works in IDE for API methods
- ✅ Build passes, no type errors

**Files Changed:**

- `packages/api-clients/` (new package)
- `apps/frontend/src/services/contacts.ts` (use typed client)
- `apps/frontend/src/hooks/useContacts.ts` (updated types)

---

### C) Frontend Standardization (Week 1)

**Goal:** Every page follows the same shell & UX

#### C1: AppPage Wrapper

**Tasks:**

1. Ensure `AppPage` component supports:
   - `title` (string or ReactNode)
   - `actions` (toolbar buttons)
   - `toolbar` (filters, search, etc.)
   - `loading` (skeleton state)
   - `error` (error boundary)
   - `empty` (empty state)

2. Update all page components to use `AppPage`:
   - `ContactsListPage`
   - `LeadsListPage`
   - `DealsListPage`
   - `CompaniesListPage`

#### C2: URL Filters

**Tasks:**

1. Create `useUrlQuery` hook in `core/filters/`:

   ```typescript
   useUrlQuery<T extends Record<string, any>>({
     page: number,
     pageSize: number,
     q?: string,
     sort?: string,
     ...filters
   })
   ```

2. Implement in each list page:
   - Sync filters to URL query params
   - Restore filters on page load
   - Debounced search input

#### C3: Exports

**Tasks:**

1. Implement export utilities in `core/export/`:
   - `exportToCSV(data, filename)`
   - `exportToXLSX(data, filename, options)`
   - `exportToPDF(data, filename, options)` (optional)

2. Add export button to each list page toolbar:
   - Respects current filters
   - Exports visible columns
   - Shows progress indicator

#### C4: RBAC

**Tasks:**

1. Define permissions in `core/rbac/permissions.ts`:

   ```typescript
   export const PERMISSIONS = {
     CONTACTS_VIEW: 'contacts:view',
     CONTACTS_CREATE: 'contacts:create',
     CONTACTS_EDIT: 'contacts:edit',
     CONTACTS_DELETE: 'contacts:delete',
     // ... for leads, deals, companies
   }
   ```

2. Create `usePermissions()` hook:

   ```typescript
   const { can, cannot } = usePermissions();
   if (!can(PERMISSIONS.CONTACTS_DELETE)) return null;
   ```

3. Gate actions & routes:
   - Hide/disable buttons without permission
   - Redirect unauthorized route access

#### C5: No Horizontal Scroll

**Tasks:**

1. Add page container guards:
   - `maxWidth` on content containers
   - `overflow-x: hidden` on main layout

2. Fix table responsiveness:
   - DataGrid `autoHeight` and column flex
   - Horizontal scroll inside table only

**Branch:** `chore/phase2-frontend-standardization`

**Acceptance Criteria:**

- ✅ All list pages use `AppPage` wrapper
- ✅ URL filters work (bookmarkable URLs)
- ✅ CSV & XLSX exports functional
- ✅ RBAC gates working (hide/disable actions)
- ✅ No horizontal scroll on any page
- ✅ ESLint blocks direct `MainCard` imports

**Files Changed:**

- `apps/frontend/src/core/app-page/AppPage.tsx` (enhancements)
- `apps/frontend/src/core/filters/useUrlQuery.ts` (new)
- `apps/frontend/src/core/export/` (implementations)
- `apps/frontend/src/core/rbac/` (permissions & hooks)
- `apps/frontend/src/views/pages/contacts/` (standardized)
- `apps/frontend/src/views/pages/leads/` (standardized)
- `apps/frontend/src/views/pages/deals/` (standardized)
- `apps/frontend/src/views/pages/companies/` (standardized)
- `apps/frontend/eslint.config.mjs` (block MainCard)

---

### D) Dev Experience & Guardrails (1-2 days)

**Goal:** Make quality the default

#### D1: Pre-commit Hooks

**Tasks:**

1. Install `simple-git-hooks` + `lint-staged`:

   ```bash
   pnpm add -D simple-git-hooks lint-staged
   ```

2. Configure `.simple-git-hooks.js`:

   ```javascript
   module.exports = {
     'pre-commit': 'npx lint-staged'
   }
   ```

3. Configure `lint-staged` in `package.json`:

   ```json
   {
     "lint-staged": {
       "*.{ts,tsx,js,jsx}": [
         "prettier --write",
         "eslint --fix"
       ]
     }
   }
   ```

4. Run setup:

   ```bash
   npx simple-git-hooks
   ```

#### D2: CI (GitHub Actions)

**Tasks:**

1. Create `.github/workflows/ci.yml`:

   ```yaml
   name: CI
   
   on: [push, pull_request]
   
   jobs:
     test:
       runs-on: ubuntu-latest
       strategy:
         matrix:
           app: [frontend, api-dev, reporting, shared-types]
       steps:
         - uses: actions/checkout@v3
         - uses: pnpm/action-setup@v2
           with:
             version: 10
         - uses: actions/setup-node@v3
           with:
             node-version: 20
             cache: pnpm
         - run: pnpm install --frozen-lockfile
         - run: pnpm --filter ./${{ matrix.app }} run typecheck
         - run: pnpm --filter ./${{ matrix.app }} run lint
         - run: pnpm --filter ./${{ matrix.app }} run test
         - run: pnpm --filter ./${{ matrix.app }} run build
   ```

2. Add Playwright smoke tests on PR

#### D3: ESLint Import Zones

**Tasks:**

1. Add `eslint-plugin-import` rules:

   ```javascript
   {
     'import/no-restricted-paths': [
       'error',
       {
         zones: [
           {
             target: './apps/frontend/src',
             from: './apps/api-dev',
             message: 'Frontend cannot import from api-dev'
           },
           {
             target: './apps/frontend/src',
             from: './apps/reporting',
             message: 'Frontend cannot import from reporting'
           }
         ]
       }
     ]
   }
   ```

2. Extend existing no-restricted-imports to block legacy:
   - `ui-component/*` (except via barrel exports)
   - `@tabler/icons-react` (use MUI icons)
   - Direct `MainCard` imports (use `AppPage`)

**Branch:** `chore/phase2-guardrails-ci`

**Acceptance Criteria:**

- ✅ Pre-commit hook formats & lints changed files
- ✅ CI matrix tests all workspaces
- ✅ PRs blocked on failing typecheck/lint/test/build
- ✅ ESLint prevents cross-app imports
- ✅ Playwright smoke tests run on PR

**Files Changed:**

- `package.json` (simple-git-hooks, lint-staged)
- `.simple-git-hooks.js` (new)
- `.github/workflows/ci.yml` (new)
- `apps/frontend/eslint.config.mjs` (import zones)

---

### E) Environments & Docker (1 day, optional)

**Goal:** One command to run the world

**Tasks:**

1. Move `docker-compose.yml` to `infra/`:
   - Update service build contexts to `../apps/*`
   - Add all services (frontend, api-dev, reporting, postgres, mailhog, minio)

2. Normalize ports with root `.env`:
   - Frontend: 3002
   - API-dev: 8787
   - Reporting: 3001
   - Postgres: 5432
   - MailHog: 1025, 8025
   - MinIO: 9000, 9001

3. Add `pnpm dev:all` script:
   - Starts Docker services
   - Starts all apps in parallel
   - OR use `docker compose up` for everything

4. Add seed data script

**Branch:** `chore/phase2-infra` (optional)

**Acceptance Criteria:**

- ✅ `pnpm dev:all` starts full stack
- ✅ All services communicate correctly
- ✅ Environment variables centralized
- ✅ Seed data loads on first run

**Files Changed:**

- `infra/docker-compose.yml` (moved & enhanced)
- `.env.example` (centralized)
- `package.json` (dev:all script)
- `scripts/seed.sh` (optional)

---

### F) Observability & Logging (Nice-to-have)

**Goal:** Better debugging & monitoring

**Tasks:**

1. Add request/response logging in backends:
   - `apps/api-dev/logger.js` (enhance)
   - `apps/reporting/src/` (add logger middleware)
   - Redact sensitive data (passwords, tokens)

2. Frontend network toaster:
   - Show toast for 401 (unauthorized)
   - Show toast for 403 (forbidden)
   - Show toast for 422 (validation errors)
   - Show toast for 500 (server errors)

3. Web vitals & error boundary:
   - Log to console or external service
   - Track CLS, FID, LCP, TTFB

**Branch:** `chore/phase2-observability` (optional)

**Acceptance Criteria:**

- ✅ Backend logs structured JSON
- ✅ Frontend shows user-friendly error toasts
- ✅ Error boundary catches crashes
- ✅ Web vitals tracked

---

## 📊 Execution Order (Start → Finish)

| Step | Branch | Duration | Dependencies |
|------|--------|----------|--------------|
| 1 | `chore/phase2-shared-types` | 1 day | None |
| 2 | `chore/phase2-contracts-contacts` | 2-3 days | Step 1 |
| 3 | `chore/phase2-frontend-standardization` | 3-4 days | Steps 1-2 |
| 4 | `chore/phase2-guardrails-ci` | 1-2 days | None (parallel) |
| 5 | `chore/phase2-infra` | 1 day | None (optional) |
| 6 | `chore/phase2-observability` | 1 day | None (optional) |

**Total Estimated Time:** 8-12 days (working days)

---

## ✅ Acceptance Criteria (Per Feature)

Every feature branch must pass:

- **Type Safety:** 0 TypeScript errors in production code
- **UX:** AppPage wrapper with all slots wired
- **Filters:** URL-driven; state survives refresh/share
- **RBAC:** Hidden/disabled actions without permission
- **Exports:** CSV & XLSX from current filtered dataset
- **Perf:** No horizontal scroll; virtualized grids where needed
- **Tests:** Playwright smoke for routes + 1 happy-path per page

---

## 🧪 Quick Commands

### Create Phase 2 Branches

```bash
# Step 1
git checkout chore/monorepo-structure
git checkout -b chore/phase2-shared-types

# Step 2
git checkout chore/monorepo-structure
git checkout -b chore/phase2-contracts-contacts

# Step 3
git checkout chore/monorepo-structure
git checkout -b chore/phase2-frontend-standardization

# Step 4
git checkout chore/monorepo-structure
git checkout -b chore/phase2-guardrails-ci
```

### Verify Shared Types

```bash
# After extracting types
pnpm --filter @shared-types typecheck
pnpm --filter ./apps/frontend typecheck
pnpm --filter ./apps/frontend build
```

### Test Contacts with Shared Types

```bash
# After updating imports
pnpm --filter ./apps/frontend run dev
# Navigate to /contacts and verify functionality
```

---

## 📝 Branch Merge Strategy

Each feature branch should be:

1. **Small & Focused:** One feature, reviewable in <30 min
2. **Tested:** All acceptance criteria met
3. **Documented:** Update relevant docs
4. **Mergeable:** Can merge independently without breaking others

**Merge Order:**

1. Merge `chore/phase2-shared-types` → `chore/monorepo-structure`
2. Merge `chore/phase2-contracts-contacts` → `chore/monorepo-structure`
3. Merge `chore/phase2-frontend-standardization` → `chore/monorepo-structure`
4. Merge `chore/phase2-guardrails-ci` → `chore/monorepo-structure`
5. Merge `chore/monorepo-structure` → `main` (full Phase 2 complete)

---

## 🚨 Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Breaking existing pages | Test each page manually after standardization |
| Type conflicts between shared-types & frontend | Use incremental adoption, one feature at a time |
| CI build time too long | Use matrix jobs, cache node_modules |
| Docker compose slow on M1 | Use Rosetta 2, or native ARM images |
| RBAC breaks existing flows | Add feature flag, gradual rollout |

---

## 📚 Additional Resources

- **Phase 1 Documentation:** `MONOREPO_SETUP_COMPLETE.md`
- **Project Structure:** `PROJECT_STRUCTURE.md`
- **Frontend Docs:** `apps/frontend/docs/`
- **API Contracts:** `packages/api-clients/` (after Step 2)

---

## 🎯 Success Metrics (End of Phase 2)

| Metric | Target |
|--------|--------|
| TypeScript Errors (Production) | 0 |
| Test Coverage (Critical Paths) | >70% |
| Build Time (Frontend) | <10s |
| CI Pipeline Time | <5 min per workspace |
| Pages Standardized | 100% (Contacts, Leads, Deals, Companies) |
| API Endpoints Typed | 100% (All CRUD operations) |
| RBAC Coverage | 100% (All destructive actions) |
| Developer Onboarding | <30 min to first commit |

---

**Phase 2 Status:** Ready to Begin  
**Next Step:** Create branch `chore/phase2-shared-types` and start extraction  
**Owner:** Development Team  
**Started:** October 23, 2025  
**Target Completion:** November 5, 2025
