# TRAFFIC CRM — Product Roadmap Dashboard

> **Status**: 🟢 Infrastructure complete → Entering Sprint 1  
> **Last Updated**: October 24, 2025  
> **Vision**: Unified CRM from marketing → lead → deal → customer, with comms + finance connected, searchable, and auditable.

## 🧭 Principles

- Modular, event-driven, API-first, tenant-aware
- Least-privilege RBAC + scopes
- Offline-friendly UI with optimistic updates
- Deterministic migrations & reproducible environments

---

## 📦 Monorepo (Target Shape)

```text
apps/
  frontend/        # React 19 + Vite + Berry
  api-gateway/     # BFF/Edge: REST+WS, auth, rate limits
  core-api/        # Contacts, Companies, Leads, Deals, Stages, Activities
  comms-api/       # Email, Chat, Social, Notifications
  reporting-api/   # Analytics & P&L aggregation
  workers/         # BullMQ jobs: ingestion, ETL, webhooks
packages/
  shared-types/    # ✅
  ui-kit/          # AppPage, DataTable, FilterBar, Timeline, etc.
  sdk-js/          # Typed client SDK
  rbac/            # Roles, permissions, policy helpers
  config/          # Env schema (zod), constants
  validation/      # Shared zod/yup schemas
  telemetry/       # logger/tracing/metrics exporters
infra/
  docker/ db/ k8s/ nginx/
tools/
  codegen/ audit/ ci/
```

---

## 📊 Module Progress Matrix

| Module | Status | Sprint | Progress | Notes |
|--------|--------|--------|----------|-------|
| Infrastructure | ✅ Complete | Pre-1 | 100% | CI/CD, security, docs, automation |
| Core API Foundation | 🟡 In Progress | 1–2 | 60% | NestJS + Prisma scaffold |
| Contacts | 🟡 Partial | 1–2 | 40% | CRUD present; needs UI polish |
| Companies | 🟡 Partial | 1–2 | 40% | CRUD present; needs UI polish |
| Leads | 🟡 Partial | 1–2 | 40% | CRUD; add scoring |
| Deals | 🟡 Partial | 1–2 | 40% | CRUD; add pipeline |
| Stages/Pipelines | ⏳ Planned | 1–2 | 0% | Implement pipeline mgmt |
| Activities/Timeline | ⏳ Planned | 1–2 | 0% | Unified entity timeline |
| Tags | ⏳ Planned | 1–2 | 0% | Tagging + filters |
| RBAC | 🟡 Partial | 1–2 | 30% | Roles exist; add policies |
| UI Kit | ⏳ Planned | 1–2 | 0% | Extract shared components |
| SDK Integration | 🟡 Partial | 1–2 | 50% | OpenAPI → codegen SDK |
| Chat (Internal) | ⏳ Planned | 3–4 | 0% | Channels/DMs/threads |
| Email Inbox | ⏳ Planned | 3–4 | 0% | SMTP/IMAP (MailHog local) |
| Notifications | ⏳ Planned | 3–4 | 0% | In-app + email |
| Social Inbox | ⏳ Planned | 5–6 | 0% | FB/IG OAuth + webhooks |
| Reporting/Analytics | 🟡 Partial | 5–6 | 20% | Funnel/velocity/ROI |
| Marketing/Attribution | ⏳ Planned | 7–8 | 0% | UTM + touches |
| Automation/Workflows | ⏳ Planned | 9–10 | 0% | Triggers → actions |
| Connectors (Slack/Teams) | ⏳ Planned | 11–12 | 0% | Event bridge |

**Legend:** ✅ Complete · 🟡 Partial · ⏳ Planned · ❌ Blocked

---

## 🧱 Domain & Events (Snapshot)

**Core:** Org, User, Team, Role, Permission; Contact, Company; Lead, LeadSource; Deal, Pipeline, Stage; Activity, Tag.

**Comms:** Channel, Message; EmailThread/Message; SocialThread/Message; Notification.

**Events:** `contact.created`, `lead.converted`, `deal.stage_changed`, `email.received`, `social.message.received`, `notification.created`.

---

## 🗺️ 12-Week Roadmap (2-week sprints)

### Sprint 1–2 — Core CRM Foundation (current)

- **Back-end:** finalize Prisma schema; CRUD for Contacts/Companies/Leads/Deals; Pipelines/Stages; Activities; Tags; RBAC v1.
- **Front-end:** AppPage tables w/ filters, pagination, CSV export; Timeline; move to @sdk-js client; extract @ui-kit.
- **SDK:** OpenAPI generation from core-api; replace axios with generated client.

**Acceptance:** CRUD across 4 entities; stage change timeline; URL filters; CSV export; RBAC enforced; build/type/tests green.

### Sprint 3–4 — Comms MVP (Chat + Email)

- **Chat:** Channels/DMs/threads, file uploads, mentions & presence.
- **Email:** SMTP/IMAP via MailHog locally; threads stored & linked to entities.
- **Notify:** In-app notifications; routing rules v1.

**Acceptance:** Usable chat; email in/out; messages surface on timelines; SLAs displayed.

### Sprint 5–6 — Social Inbox + Reporting v1

- FB/IG OAuth; webhooks; unified inbox & reply; auto-lead on first DM.
- Reporting: funnel, win rate, velocity, source ROI; P&L v1.

### Sprint 7–8 — Marketing & Attribution

- UTM capture; multi-touch attribution; campaigns; optional Ads spend ingestion; enrichment + dedupe/merge.

### Sprint 9–10 — Automation & Scale

- Workflow builder v1; ⌘K palette; access logs; E2E suite; caching, N+1 & index tuning; p95 < 300ms on key APIs.

### Sprint 11–12 — Connectors & Polish

- Slack/Teams bridges; optional LinkedIn/YouTube ingestion; mobile polish; budgets; DR drill; runbooks.

---

## 🎯 Immediate Next Actions (Sprint 1 kickoff)

### Week 1

- Apply full Prisma schema + migration + seeds.
- Create `packages/ui-kit` (AppPage, DataTable, FilterBar, EntityTimeline).
- Create `packages/rbac` (roles, permissions, can/canAny/canAll).
- Add `@nestjs/swagger` + OpenAPI spec; wire codegen to `packages/sdk-js`.

### Week 2

- Complete Contacts/Companies/Leads/Deals UIs: filters, sorting, pagination, tags, timeline.
- Add Pipelines/Stages mgmt; stage change tracking; win/loss reasons.
- Replace axios with generated SDK client everywhere.

---

## 🧪 Quality Gates

- **Pre-commit:** typecheck, lint, tests.
- **CI:** build, unit, E2E smoke, bundle size.
- **Weekly:** CodeQL, dependency audit.
- **Migrations:** no destructive changes without plan.

---

## 📈 Metrics (Targets)

| Metric | Current | Target |
|--------|---------|--------|
| TypeScript "type-clean" | ✅ | ✅ |
| Unit Test Coverage | ~20% | 80% |
| E2E Coverage | ~10% | 60% |
| FE Bundle Size | ~2MB | <3MB |
| API p95 | ~500ms | <300ms |
| Security Alerts | 0 | 0 |

---

## 🚦 Risks & Mitigation

- **Legacy cleanup:** incremental migrations (Issues #1–3).
- **Test gaps:** add tests in Sprint 1–2 (Issue #11).
- **OpenAPI codegen:** standardize decorators now.
- **Social APIs:** backoff/retries; sandbox first.
- **Scale:** caching & indices in Sprint 9.

---

## ✅ Sprint DoR / DoD

**Definition of Ready:** Story + AC; API/UI contract (OpenAPI or types); Security notes (authZ, PII).

**Definition of Done:** Unit + E2E updated; type/lint/build clean; CI green; telemetry & error handling; docs updated.

---

## 📚 References

- [DEPLOYMENT_READINESS.md](../DEPLOYMENT_READINESS.md) — Infra status & checklists
- [CONTRIBUTING.md](../CONTRIBUTING.md) — Contribution & PR process
- [WORKFLOW_SCRIPTS.md](../WORKFLOW_SCRIPTS.md) — Issue → Branch → PR helpers
- [docs/RELEASE_PLAYBOOK.md](./RELEASE_PLAYBOOK.md) — Releases with release-please
- [docs/INDEX.md](./INDEX.md) — Full documentation hub

---

## 🛠 Quick Commands

```bash
# Start Sprint 1 work
./workflow-helper.sh start 1

# Generate & use SDK
pnpm -r build && pnpm -r typecheck

# Run tests
pnpm test
pnpm --filter ./apps/frontend test
pnpm --filter @apps/core-api test
```

---

## ✍️ Update Log

- **2025-10-24:** Initial roadmap dashboard created (Infra complete; Sprint 1 kickoff)

---

**📍 You are here:** Product Roadmap  
**🏠 Return to:** [Documentation Index](./INDEX.md) | [Project README](../README.md)  
**🚀 Repository:** <https://github.com/omar120489/-traffic-crm-frontend-ts>
