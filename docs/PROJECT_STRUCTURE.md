# Traffic CRM - Project Structure & Setup

**Last Updated:** October 23, 2025  
**Branch:** `chore/monorepo-structure`  
**Status:** Phase 1 Complete ✅

---

## 📂 Monorepo Layout

```
traffic-crm/                                   # Monorepo root
│
├─ apps/                                       # 🎯 Applications
│  │
│  ├─ frontend/                                # Main Vite + React app
│  │  ├─ src/
│  │  │  ├─ core/                              # Core modules (filters, export, rbac, app-page)
│  │  │  ├─ data/                              # Data layer (clients)
│  │  │  ├─ features/                          # Feature modules (chat, types)
│  │  │  ├─ shared/                            # Shared utilities
│  │  │  ├─ views/pages/                       # Page components
│  │  │  ├─ hooks/                             # App-level hooks
│  │  │  ├─ services/                          # API services
│  │  │  ├─ contexts/                          # React contexts
│  │  │  ├─ store/                             # Redux store
│  │  │  ├─ routes/                            # Route definitions
│  │  │  ├─ layout/                            # Layout components
│  │  │  ├─ themes/                            # MUI theme config
│  │  │  ├─ types/                             # TypeScript types
│  │  │  ├─ utils/                             # Utilities
│  │  │  └─ _legacy/                           # Archived code
│  │  ├─ public/                               # Static assets
│  │  ├─ e2e/                                  # E2E tests (Playwright)
│  │  ├─ scripts/                              # Dev scripts & tools
│  │  ├─ package.json                          # Frontend dependencies
│  │  ├─ tsconfig.json                         # Extends ../../tsconfig.base.json
│  │  ├─ vite.config.mjs                       # Vite configuration
│  │  ├─ vitest.config.ts                      # Vitest configuration
│  │  └─ docker-compose.yml                    # Dev services (MailHog, MinIO)
│  │
│  ├─ api-dev/                                 # Express mock API
│  │  └─ dev-backend/
│  │     ├─ server.js                          # Express server (port 8787)
│  │     ├─ logger.js                          # Logging utility
│  │     ├─ middleware/rbac.js                 # RBAC middleware
│  │     └─ package.json                       # API dependencies
│  │
│  └─ reporting/                               # NestJS reporting service
│     └─ traffic-crm-backend-reporting/
│        ├─ src/
│        │  ├─ main.ts                         # NestJS bootstrap (port 3001)
│        │  └─ reporting/
│        │     ├─ dto/                         # Data transfer objects
│        │     ├─ reporting.controller.ts      # REST controller
│        │     ├─ reporting.service.ts         # Business logic
│        │     └─ reporting.module.ts          # NestJS module
│        ├─ package.json                       # Reporting dependencies
│        └─ tsconfig.json                      # Extends ../../../tsconfig.base.json
│
├─ packages/                                   # 📦 Shared Packages
│  │
│  └─ shared-types/                            # Shared TypeScript types
│     ├─ src/index.ts                          # EntityId, Paginated types
│     ├─ package.json                          # Package config (@shared-types)
│     └─ tsconfig.json                         # Extends ../../tsconfig.base.json
│
├─ tools/                                      # 🔧 Repo-wide Tooling (empty, ready for scripts)
│
├─ infra/                                      # 🏗️  Infrastructure (empty)
│  ├─ nginx/                                   # Future: Nginx configs
│  └─ k8s/                                     # Future: Kubernetes manifests
│
├─ pnpm-workspace.yaml                         # 🔗 Workspace configuration
├─ tsconfig.base.json                          # 📐 Base TypeScript config
├─ package.json                                # 📋 Root package with monorepo scripts
├─ .env.example                                # 🔐 Environment template
└─ MONOREPO_SETUP_COMPLETE.md                 # 📖 Complete setup documentation
```

---

## ⚙️ Workspace Configuration

### pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "tools/*"
```

### Recognized Workspaces

- ✅ `traffic-crm` (root)
- ✅ `apps/frontend` (traffic-crm-frontend-ts@1.0.0)
- ✅ `packages/shared-types` (@shared-types@0.1.0)

---

## 📐 TypeScript Configuration

### Root: tsconfig.base.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@shared-types/*": ["packages/shared-types/src/*"]
    }
  }
}
```

### Per-App Configuration

All app `tsconfig.json` files extend the base:

- `apps/frontend/tsconfig.json` → `extends "../../tsconfig.base.json"`
- `apps/reporting/.../tsconfig.json` → `extends "../../../tsconfig.base.json"`
- `packages/shared-types/tsconfig.json` → `extends "../../tsconfig.base.json"`

---

## 📋 Available Scripts (Root)

### Development

```bash
pnpm dev                               # Run all apps in parallel
pnpm --filter ./apps/frontend run dev  # Run frontend only
pnpm --filter ./apps/api-dev run dev   # Run API only
pnpm --filter ./apps/reporting run dev # Run reporting only
```

### Building

```bash
pnpm build                             # Build all apps
pnpm --filter ./apps/frontend run build # Build frontend only
```

### Quality Checks

```bash
pnpm typecheck                         # TypeScript check all packages
pnpm lint                              # Lint all packages
pnpm test                              # Test all packages
```

### Docker

```bash
pnpm docker:up                         # Start docker services
pnpm docker:down                       # Stop docker services
```

### Frontend-specific

```bash
pnpm audit:full                        # Run full audit
pnpm fix:typescript                    # Fix TypeScript issues
```

---

## 📦 Package Management

**Package Manager:** pnpm@10.18.2

### Add Dependencies

```bash
# To frontend
cd apps/frontend && pnpm add <package>
# or from root
pnpm --filter ./apps/frontend add <package>

# To shared-types
cd packages/shared-types && pnpm add <package>
```

### Install All Workspaces

```bash
pnpm install              # Installs all workspace dependencies
```

### Run Commands Across Workspaces

```bash
pnpm -r run <script>      # Run script in all workspaces
pnpm -r ls                # List all workspace packages
```

---

## 🔐 Environment Variables

### Root .env.example

```env
PORT_FRONTEND=3002
PORT_API_DEV=8787
PORT_REPORTING=3001
```

### Per-App Environment Files

- `apps/frontend/.env` (gitignored)
- `apps/api-dev/.env` (gitignored)
- `apps/reporting/.env` (gitignored)

---

## 🧪 Testing Setup

### Frontend

**Unit Tests:** Vitest (`vitest.config.ts`)

```bash
cd apps/frontend && pnpm test
```

**E2E Tests:** Playwright (`playwright.config.ts`)

```bash
cd apps/frontend && pnpm test:e2e       # Run tests
cd apps/frontend && pnpm test:e2e:ui    # UI mode
```

---

## 🐳 Docker Setup

### Current (apps/frontend/docker-compose.yml)

- MailHog (email testing) - http://localhost:8025
- MinIO (S3-compatible storage) - http://localhost:9001

### Future (Phase 2 - Root docker-compose.yml)

Will orchestrate:

- Frontend (Vite dev server) - port 3002
- API-dev (Express) - port 8787
- Reporting (NestJS) - port 3001
- PostgreSQL - port 5432
- MailHog - ports 1025, 8025
- MinIO - ports 9000, 9001

---

## 🎯 Frontend Structure Detail (apps/frontend/src/)

### Core Modules (Phase 1 ✅)

```
core/
├─ app-page/              # AppPage component (unified page wrapper)
├─ export/                # CSV, XLSX, PDF export utilities
├─ filters/               # URL query filter utilities
└─ rbac/                  # Role-based access control
```

### Data Layer (Phase 1 ✅)

```
data/
└─ clients/
   └─ axios.ts            # Configured axios instance
```

### Features (Phase 1 ✅)

```
features/
├─ chat/                  # Chat feature module
│  ├─ api.ts
│  ├─ hooks/
│  ├─ components/
│  └─ types.ts
└─ types/                 # Shared feature types
   └─ index.ts
```

### Shared (Phase 1 ✅)

```
shared/
├─ components/            # Reusable components
│  └─ index.ts            # Barrel exports
├─ hooks/                 # Shared hooks
├─ utils/                 # Helper functions
└─ types/                 # Shared types
```

### Legacy Structure (Still in use)

```
views/pages/              # Page components
├─ contacts/              # ContactsListPage
├─ leads/                 # LeadsListPage, LeadDetail, LeadEdit
├─ deals/                 # DealsListPage, DealDetail, DealEdit
├─ companies/             # CompaniesListPage
└─ analytics/             # PnLAnalytics, AnalyticsDashboard

hooks/                    # App-level hooks
├─ useContacts.ts
├─ useLeads.ts
├─ useDeals.ts
├─ useCompanies.ts
└─ ...

services/                 # API services
├─ contacts.ts
├─ leads.ts
├─ deals.ts
└─ ...

contexts/                 # React contexts
├─ JWTContext.tsx
├─ Auth0Context.tsx
└─ ...

store/                    # Redux store
routes/                   # React Router
layout/                   # Layout components
themes/                   # MUI theme
types/                    # TypeScript types
utils/                    # Utilities
```

---

## 🔧 Development Workflow

### 1. Start Development

```bash
# Terminal 1 - Frontend
cd apps/frontend
pnpm dev                    # Vite dev server on :3002

# Terminal 2 - Mock API
cd apps/api-dev/dev-backend
node server.js              # Express API on :8787

# Terminal 3 - Reporting (optional)
cd apps/reporting/traffic-crm-backend-reporting
pnpm run start:dev          # NestJS on :3001
```

### 2. Make Changes

- Edit files in `apps/frontend/src/`
- Hot reload works automatically
- TypeScript checks in IDE

### 3. Test Changes

```bash
cd apps/frontend
pnpm typecheck              # TypeScript
pnpm lint                   # ESLint
pnpm test                   # Unit tests
pnpm test:e2e               # E2E tests
pnpm build                  # Production build
```

### 4. Commit

```bash
git add -A
git commit -m "feat: your feature"
git push
```

---

## 📊 Quick Stats

| Metric           | Value                  |
| ---------------- | ---------------------- |
| Workspaces       | 3                      |
| Apps             | 3                      |
| Packages         | 1 (shared-types)       |
| Frontend Build   | ~7.3s                  |
| Repository Size  | ~780 MB (after cleanup)|
| Package Manager  | pnpm@10.18.2           |
| Node Version     | v24.7.0                |
| Current Branch   | chore/monorepo-structure |

---

## 🚀 Next Steps (Phase 2)

When ready for Phase 2:

1. **Migrate shared types**
   - Move `apps/frontend/src/types/` → `packages/shared-types/src/`
   - Update imports to use `@shared-types/*` alias

2. **Create API contracts package**
   - `packages/api-contracts/` with OpenAPI schemas
   - Generate typed API clients with `orval`

3. **Update Docker Compose**
   - Root `docker-compose.yml` to orchestrate all services
   - Include PostgreSQL, MailHog, MinIO

4. **Configure CI**
   - Matrix jobs for parallel app builds/tests
   - Separate jobs for frontend, api-dev, reporting

5. **Add shared config packages**
   - `packages/eslint-config/` for unified linting
   - `packages/tsconfig/` for TypeScript presets

6. **Optional improvements**
   - Turborepo for better caching
   - Changesets for versioning
   - Nx for advanced monorepo features

---

## 📚 Additional Documentation

- **Complete Setup Guide:** `MONOREPO_SETUP_COMPLETE.md`
- **Migration Script:** `monorepo_move.sh` (can be deleted after merge)
- **Frontend Docs:** `apps/frontend/docs/`
- **API Documentation:** `apps/frontend/Traffic_CRM_API.postman_collection.json`

---

## ✅ Current Status

- **Phase 1:** ✅ Complete
- **Build Status:** ✅ Working
- **Tests:** ✅ Passing (production code)
- **Breaking Changes:** ❌ None
- **Ready For:** Development, Testing, or Phase 2

---

**Last Build:** Successful in 7.33s  
**Branch:** `chore/monorepo-structure`  
**Ready to merge or continue to Phase 2** 🚀

