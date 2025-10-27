# Traffic CRM Roadmap

_Last updated: 2025-10-27_

This roadmap tracks active workstreams across the monorepo. Items are grouped by phase and reflect the current plan for the next two sprints.

---

## Phase 2 · Frontend Modernization

| Status | Item | Target |
| --- | --- | --- |
| ✅ | Contacts, Companies, Deals, Analytics views migrated to React + MUI hooks with TypeScript safety | Complete |
| ⚙️ | Pipelines settings cleanup (`useCallback` imports, typing guardrails) | Sprint 7 |
| 🔶 | Leads list/detail migration to hook-based CRUD and SDK usage | Sprint 7 |
| 🔶 | Auth flows (register/reset) modernization and shared form helpers | Sprint 7 |
| 🟡 | PnL Analytics refactor (`PnLAnalyticsNew.tsx`) + feature flag wiring | Sprint 8 |
| 🟡 | Theme upgrades for MUI v7 (Grid v2 prop cleanup, dark-mode polish) | Sprint 8 |
| 🟢 | Lighthouse & bundle size regression monitoring | Backlog |

---

## Phase 3 · Backend Refinement

| Status | Item | Target |
| --- | --- | --- |
| ✅ | Core API + Prisma schema baseline verified (13 models, seed scripts) | Complete |
| 🔶 | Rotate default credentials and plumb secrets via CI | Sprint 7 |
| 🔶 | Add Redis persistence volume & snapshot automation | Sprint 7 |
| 🟡 | Flesh out BullMQ jobs (lead scoring logic, enrichment integrations) | Sprint 8 |
| 🟡 | Determine reporting service scope (deprecate or pursue analytics KPIs) | Sprint 8 decision |
| 🟢 | Add API integration tests (contacts, deals, P&L endpoints) | Backlog |

---

## Phase 4 · Testing & QA

| Status | Item | Target |
| --- | --- | --- |
| ⚙️ | Raise frontend unit coverage from ~60 % to 75 % (focus on hooks/components) | Sprint 7 |
| 🔶 | Add Playwright regression suite for leads/auth flows post-migration | Sprint 8 |
| 🟡 | Introduce backend integration tests (Prisma + HTTP endpoints) | Sprint 8 |
| 🟢 | Performance & accessibility baseline (Lighthouse CI) | Backlog |

---

## Phase 5 · DevOps & CI/CD

| Status | Item | Target |
| --- | --- | --- |
| ✅ | Frontend Docker publish workflow (GHCR) live | Complete |
| ✅ | Status ledger auto-refresh (`update-status.yml`) | Complete |
| 🔶 | Resolve local Docker permission blockers to keep quick-start functional | Sprint 7 |
| 🟡 | Add bundle-size regression workflow to CI | Sprint 8 |
| 🟢 | Evaluate monitoring stack (Sentry, Web Vitals, Grafana dashboards) | Backlog |

---

## Key Next Actions

1. Finish leads + auth migrations (frontend) and wire Playwright coverage.
2. Rotate secrets, enable Redis persistence, and document secure defaults.
3. Expand worker jobs with concrete lead scoring and enrichment logic.
4. Decide on the dedicated reporting service roadmap (double down vs sunset).
5. Add bundle-size guardrails and Lighthouse CI to protect performance.

Roadmap owners: `@frontend-team`, `@backend-team`, `@devops`. Update this file after sprint reviews to keep the plan current.
