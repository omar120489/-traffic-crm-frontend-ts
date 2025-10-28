# Traffic CRM — Frontend Development Instructions

> Updated: 2025-10-27  
> Scope: apps/frontend (React 19 + Vite + TypeScript)

---

## 🧠 Architecture Summary

- **Entry stack:** `src/index.jsx` → `App.jsx` → `AppWrapper.jsx` wraps theming, routing, providers, and error boundaries. Attach any new global state or query clients inside `AppWrapper.jsx`.
- **Routing:** Modern pages live under `src/pages/*` (Deals Kanban, Company 360, Login, Contacts, Settings). Legacy routes remain in `src/views/pages/*`; remove them once replacements stabilise. Plan to consolidate `routes/index.tsx`, `sprint*.routes.tsx`, and `MainRoutes.tsx` into a single `AppRoutes.tsx` after module Federation work settles.
- **Layouts:** `MainLayout`, `MinimalLayout`, and `SimpleLayout` are still JavaScript. Convert to TypeScript after the MUI v7 upgrade and centralise navigation, breadcrumbs, and headers in layout components rather than per-page logic.

---

## ⚙️ State & Data Flow

### Context Layer

- Contexts: `AuthContext`, `NotificationsContext`, `JWTContext`, provider-specific contexts (Auth0, Cognito, Firebase, Supabase). Consume via hooks such as `useAuth()` and `useToast()`.
- **Decision:** Pick React Query **or** RTK Query as the unified data layer.
  - Inject its provider in `AppWrapper.jsx`.
  - Standardise query keys or endpoint naming.
  - Ensure hooks return `{ data, isLoading, error }`.

### API Layer

- `lib/api.ts` and `lib/http.ts` wrap the generated SDK with auth header injection.
- Services under `src/services/*` mix handwritten and generated logic.

**Action items**

- Refactor `contacts.ts` (and similar services) to consume the generated SDK modules.
- Add retry/interceptor handling (401 refresh) in `http.ts`.
- Normalise responses using an adapter (DTO → view model) before components consume them.

---

## 🧩 UI Components & MUI v7 Migration

- `src/components/*` contains sprint-era widgets (e.g., `ActivityDialog`, `TagManager`).
- `src/ui-component/*` hosts Berry-derived components (e.g., `PaginationToolbar`, `FilterPanel`).

**Actions**

- Move reusable visual components into `packages/ui-kit`.
- Remove unused Berry components after migration.
- Introduce Storybook for component validation and visual regression.

### MUI v7 Checklist

- Replace deprecated Grid props (`item`, `xs`, `sm`, `md`) with Grid v2 syntax.
- Update theme overrides (`themes/overrides/*`) to the `slotProps` pattern.
- Verify typography variants and theme behaviour across dark/light modes.
- Run regression tests around layout breakpoints.

---

## 🔗 Module Federation

- **Host:** `apps/frontend`
- **Shared libraries:** `@traffic-crm/ui-kit`, `@traffic-crm/rbac`
- **Potential remotes:** admin tools, reporting dashboards

**Next steps**

- Lock shared dependency versions (React, MUI, Emotion, Redux) to exact matches between host and remotes.
- Expose only compiled assets from remotes.
- Document the federation map in `docs/MODULE_FEDERATION_GUIDE.md`.
- Validate runtime compatibility (local + staging) before enabling dynamic imports in production.

---

## 🧪 Testing & Quality

- **Unit/Integration (Vitest):** Target ≥ 70 % coverage. Expand coverage for `AuthContext`, `useToast`, `useNotifications`, Deals Kanban drag-and-drop logic.
- **E2E (Playwright):** Current suites cover Sprint 2. Add scenarios for login + refresh token, contact CRUD, pipeline drag/drop, and Company 360 read-only checks.
- **CI/CD flow:** Lint → Typecheck → Unit → E2E → Docker build. Add BuildKit caching and collect artifacts (screenshots, logs) for failed E2E runs.

---

## 🐳 Docker & DevOps

- Frontend builds via `apps/frontend/Dockerfile` (Vite → Nginx non-root image).
- `infra/docker/docker-compose.yml` provisions Redis, Postgres, MailHog, MinIO alongside the frontend.

**Open tasks**

- Fix Docker socket permission issues for local dev (add user to `docker` group in CI).
- Add `HEALTHCHECK` to the frontend container.
- Mount source folders for live reload in dev containers.
- Add `VITE_APP_API_URL` override in `.env.development.local` for consistent proxying.

---

## 🔐 Security Notes

- Keep secrets outside source; rely on `process.env`.
- Rotate default credentials in `.env.example`.
- On token/auth failures, clear storage and redirect to `/login`.
- Add Playwright coverage for expired or invalid JWT flows.

---

## 📄 Documentation To-Dos

- Regenerate `docs/FRONTEND_STRUCTURE.md` after the MUI migration and routing cleanup.
- Add `docs/MODULE_FEDERATION_GUIDE.md` with shared/remote architecture details.
- Add `docs/DATA_FLOW_GUIDE.md` explaining the API → hook → context pipeline.
- Integrate doc generation/validation into CI and link new guides from `README.md`.

---

## 🔜 Immediate Frontend Priorities (Q4 2025)

| Priority | Task | Owner | ETA |
| --- | --- | --- | --- |
| 🟢 P0 | Complete MUI v7 migration (Grid v2, slotProps) | Frontend team | Week 1–2 |
| 🟢 P0 | Standardise data fetching (React Query or RTK Query) | FE & BE | Week 2 |
| 🟡 P1 | Convert layouts to TypeScript | Frontend | Week 3 |
| 🟡 P1 | Consolidate routes & remove legacy Berry pages | Frontend | Week 3–4 |
| 🟡 P1 | Integrate UI Kit via module federation | Infra + FE | Week 4 |
| 🟢 P0 | Extend Playwright suite (login, pipeline DnD) | QA | Ongoing |
| 🟡 P2 | Add Storybook + visual regression pipeline | Frontend | Future sprint |
| 🟡 P2 | Optimise CI Docker builds (BuildKit cache) | DevOps | Future sprint |

---

Keep this guide updated after each Sprint or major architectural change. Link any new RFCs or tech decisions here so incoming contributors have a single source of truth for frontend work.***
