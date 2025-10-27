# Traffic CRM - AI Coding Agent Instructions

## Architecture Overview

**Traffic CRM** is a TypeScript-first pnpm monorepo with strict Node.js 20.x enforcement. The system follows a
microservices pattern with shared packages:

- **apps/frontend** – React 19 + Vite + Material UI 7 (MUI v5→v7 migration in progress)
- **apps/core-api** – NestJS 10 + Fastify + Prisma, emits OpenAPI at `/docs`
- **apps/workers** – BullMQ job processors (lead scoring, enrichment stubs)
- **apps/reporting** – NestJS microservice scaffold (75 MB, purpose under review)
- **packages/sdk-js** – Auto-generated TypeScript client (`openapi-typescript` → `ky`)
- **packages/ui-kit** – Material UI component library (`@traffic-crm/ui-kit`)
- **packages/shared-types** – Monorepo-wide type contracts (`@traffic-crm/shared-types`)
- **packages/rbac** – Lightweight RBAC helpers

**Infrastructure**: Docker Compose stack in `infra/docker/` runs Postgres 16, Redis 7, MailHog, MinIO.

## Monorepo Workflow

### Package Management
- **Use pnpm**, not npm/yarn. Enable via `corepack enable pnpm`.
- Workspace commands use **filter syntax**: `pnpm --filter ./apps/frontend <cmd>` or `pnpm --filter @apps/core-api <cmd>`.
- Root package.json delegates to workspaces: `pnpm dev`, `pnpm build`, `pnpm test` run all apps.

### Critical Commands
```bash
# Start infrastructure + seed DB + generate dev JWT + refresh SDK
bash scripts/quick-start.sh

# Generate SDK after API changes (3-step chain)
pnpm dev:sdk  # = openapi:emit → codegen → build

# Create dev JWT (valid 24h, HS256, orgId=demo-org)
pnpm dev:jwt  # or node apps/core-api/scripts/make-dev-jwt.mjs

# Database workflow
pnpm docker:up        # Start Postgres
pnpm db:migrate       # = prisma db push in core-api
pnpm db:seed          # tsx prisma/seed.ts (demo-org + 2 contacts/leads/deals)

# Frontend-specific
pnpm --filter ./apps/frontend typecheck
pnpm --filter ./apps/frontend test:unit     # Vitest
pnpm --filter ./apps/frontend test:e2e      # Playwright
```

### Path Aliases (tsconfig.base.json)
- `@traffic-crm/shared-types/*` → `packages/shared-types/src/*`
- `@traffic-crm/ui-kit` → `packages/ui-kit/src`
- `@traffic-crm/sdk-js` → `packages/sdk-js/dist` (after build)
- Frontend-only: `@/*`, `@core/*`, `@data/*`, `@features/*`, `@hooks/*`, `@services/*`, `@views/*`

## Frontend Patterns

### Module Federation Setup
Uses `@originjs/vite-plugin-federation`. The `remoteEntry.js` is copied to dist root via custom Vite plugin.

### State Management
- **Redux Toolkit** (`store/slices/`) for global state (auth, menu, notifications)
- **React Router v6** with URL-based state (search params for filters/pagination)
- **Context-based auth**: `JWTContext` validates `serviceToken` from localStorage, hydrates user on mount

### Component Structure
- Modern pages in `src/pages/*` (hooks-based, TypeScript, MUI 7)
- Legacy components in `src/_legacy/*` and `src/views/*` (class components, deprecated patterns)
- Shared UI in `src/ui-component/*` and `@traffic-crm/ui-kit`

### Data Fetching
- **Prefer `@traffic-crm/sdk-js`** (generated client with type-safe endpoints)
- Fallback: `src/data/clients/axios.ts` for custom requests
- Never hard-code API URLs; use `import.meta.env.VITE_API_BASE_URL` (defaults to `http://localhost:3000`)

### TypeScript Conventions
- All new code must be `.ts`/`.tsx` (no `.js`/`.jsx`)
- Use `type` for props/interfaces, `interface` only for extensible contracts
- Prefer `unknown` over `any`; fix existing `any` types when touched
- React component props: `interface ComponentNameProps { readonly propName: Type }`

### Error Handling
- Modern pages use error boundaries (`ErrorBoundary` from `react-error-boundary`)
- Toast notifications via `useNotification()` hook (custom context)
- Loading states: `isLoading` boolean + `<Loader />` component

## Backend Patterns

### NestJS Structure (core-api)
- **Fastify adapter** (not Express)
- **Prisma ORM**: schema in `prisma/schema.prisma` (13 models: Org, User, Contact, Company, Lead, Deal, Pipeline,
  Stage, Activity, Tag, LeadSource, SavedView, TagAssignment)
- **DTO validation**: `class-validator` + `class-transformer`
- **OpenAPI emission**: `apps/core-api/scripts/emit-openapi.mjs` writes `openapi.json` for SDK generation

### Authentication Flow
- JWT auth using `jose` library (HS256 for dev, RS256 for prod)
- Token must include: `orgId`, `sub` (userId), `roles: string[]`
- Frontend stores token in `localStorage.serviceToken`
- All API requests require `Authorization: Bearer <token>`

### Database Conventions
- IDs: `cuid()` (not UUID)
- Timestamps: `createdAt`, `updatedAt` (automatic via Prisma)
- Multi-tenancy: `orgId` foreign key on all tenant-scoped models
- Run `prisma generate` after schema changes; commit `prisma/migrations/*`

### Workers (BullMQ)
- Redis-backed job queues in `apps/workers/src/`
- Queue names: `lead-scoring`, `lead-enrichment`
- Minimal business logic currently; extend as needed

## Testing Strategy

### Frontend
- **Vitest**: Unit/integration tests in `apps/frontend/src/**/*.test.tsx`
- **Playwright**: E2E tests in `apps/frontend/e2e/*.spec.ts`
- **Coverage target**: ≥80% (currently ~60%)
- Run tests before commits (enforced by Husky)

### Backend
- **Jest**: Core API tests via `pnpm --filter @apps/core-api test`
- Fastify/Prisma stubs in `apps/core-api/test/`
- E2E smoke tests: `test:e2e:smoke` (placeholder, expand in Sprint 2)

### Pre-commit Hooks
- `lint-staged` runs ESLint + TypeScript checks on `apps/frontend/src/**/*.{ts,tsx}`
- Markdownlint on `*.md` files
- Prettier on `package.json`

## CI/CD Expectations

### GitHub Actions Workflow
- `.github/workflows/ci.yml`: PR title validation (commitlint) → typecheck → lint → test → build
- Matrix strategy typechecks: `@apps/core-api`, `./apps/frontend`, `@traffic-crm/shared-types`, `@traffic-crm/sdk-js`
- Docker image build: `.github/workflows/frontend-docker.yml` (pushes to GHCR)

### Commit Message Format
```
type(scope): subject

feat(contacts): add bulk import via CSV
fix(core-api): resolve Prisma query timeout
chore(deps): update MUI to v7.3.4
```
**Types**: feat, fix, docs, style, refactor, perf, test, chore, ci, revert  
**Scopes**: frontend, core-api, workers, reporting, sdk, shared-types, contacts, leads, deals, companies, auth, deps,
config, docs, ci

## Migration Context (Important!)

### Ongoing Migrations
- **MUI v5 → v7**: Grid v2 warnings present, use `<Grid2>` for new code
- **Legacy → Modern React**: Converting class components in `src/_legacy/*` and `src/views/*` to hooks
- **TypeScript strictness**: Actively fixing `any` types and TS7 compatibility issues

### Known Quirks
- **Default credentials in repo**: Rotate before production (see `PROJECT_STATUS_OVERVIEW.md` Phase 3)
- **Reporting service**: 75 MB app with unclear purpose, under review
- **Empty K8s/Nginx dirs**: Decision pending on `infra/k8s/` and `infra/nginx/`

### Assets & Branding
- Branding migrated from "Berry" to "Traffic CRM" (see `ASSETS_DEEP_ANALYSIS.md`)
- Logo: `src/assets/images/logo.svg`
- Favicons optimized, old Berry assets removed

## Documentation Sources

- Root README: Comprehensive setup + commands
- `PROJECT_STATUS_OVERVIEW.md`: Sprint-level status ledger (updated 2025-10-27)
- `docs/FRONTEND_STRUCTURE.md`: Frontend directory tree snapshot
- `scripts/quick-start.sh`: Automated dev environment setup

## When Making Changes

1. **SDK regeneration**: After modifying API endpoints, run `pnpm dev:sdk`
2. **Database changes**: Update `schema.prisma` → `pnpm db:migrate` → commit migrations
3. **Adding dependencies**: Use `pnpm add <pkg> --filter <workspace>`
4. **Type imports**: Import from `@traffic-crm/shared-types` for cross-app types
5. **Styling**: Use MUI `sx` prop or `styled()` (avoid inline styles flagged by webhint)
6. **Environment variables**: Frontend uses `VITE_*` prefix; backend uses standard `NODE_ENV`, `DATABASE_URL`, etc.

## Red Flags to Avoid

- ❌ Using `npm` or `yarn` commands (breaks pnpm workspace)
- ❌ Hard-coding `http://localhost:3000` (use env vars)
- ❌ Adding `.js`/`.jsx` files (TypeScript-only policy)
- ❌ Bypassing JWT auth in protected routes
- ❌ Modifying `dist/`, `build/`, or generated files (`.gen.ts`)
- ❌ Committing `.env.local` or tokens
- ❌ Running `prisma db push` in production (use migrations)

## Runtime Services & Boundaries

### Workers / BullMQ (current reality)
- **Status:** Workers exist but are **mostly stubs** and **not wired into CI** yet.
- **Do not invent schemas.** If you need a queue, **ask for a spec** (name, payload shape, idempotency, retries, DLQ).
- **Assumptions must be flagged.** Note any payload/processing assumptions in PR descriptions.
- **Local infra:** Redis is provided via Docker Compose; production usage is **planned but incomplete**.

### Reporting Service (apps/reporting/*)
- **Heavy & under evaluation. Treat as read-only.**
- Do **not** modify APIs, DTOs, or dependencies unless explicitly approved.
- If you need to reference data/contracts, link to the file and **confirm with the team** before changes.

## Security Guidance (must-haves)

1) **Secrets handling**
   - Never hardcode secrets or tokens. Use `process.env` and `.env.*` only.
   - Keep example keys in `.env.example`; do not commit real values.
   - Rotate any **default credentials** in Docker/local configs after first use.

2) **Auth flow changes (JWT/Cognito/Supabase/etc.)**
   - When touching auth flows, ensure **tests cover**:
     - Token issuance (claims, expiry) and refresh
     - Guards/middleware behavior (happy & failure paths)
     - Storage/clearing of tokens on logout and on decode failures
   - If token parsing can fail, **fail closed**, clear session, and surface actionable error.

## Module Federation & Shared UI

- **Host/Remotes**
  - `apps/frontend` is the primary **host** and exports `@traffic-crm/ui-kit` to other MF consumers (when enabled).
  - Remotes must **expose compiled browser assets** only (no server-only modules).
- **Versioning**
  - Keep shared deps **pinned to exact versions** across host/remotes to avoid runtime resolution mismatches.
  - When bumping MUI/React/RTK, bump across host & remotes in the same PR (or a locked sequence).
- **Import rules**
  - Remotes should avoid importing server-only code (Node APIs, fs, prisma client, Nest provider files).
  - Prefer **stable exported entrypoints** from `packages/ui-kit` and `packages/rbac`.
- **DX**
  - If a remote fails to mount due to version drift, check:
    - `shared` config alignment in MF setup
    - `peerDependencies` and lockfile sync
    - Exact version pinning (no `^`/`~` for shared libs)

## MUI v7 Migration Note
- The codebase is **in motion toward MUI v7**.
- Agents updating components should:
  - Prefer **v7-compatible patterns** (Grid v2, sx, slotProps).
  - Remove deprecated props (e.g., legacy `Grid item/xs/sm/md` in v2) and follow MUI's migration guide.
  - Update any overrides in `apps/frontend/src/themes/overrides/*` to match v7 slot APIs.
- If unsure, add a TODO with a link to the MUI migration doc and keep the change isolated.
