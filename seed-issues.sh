#!/usr/bin/env bash
# seed-issues.sh
# Creates 13 issues in the current repo's "origin" remote using GitHub CLI.
# Prereqs: gh auth status  ✅  |  gh repo set-default (optional)
set -euo pipefail

echo "🌱 Seeding 13 development issues..."
echo ""

# --- Config ---
ASSIGNEE="${ASSIGNEE:-omar120489}"     # change or unset if you don't want auto-assign
MILESTONE="${MILESTONE:-}"              # e.g. "Sprint-1"; leave empty to skip
COMMON_FLAGS=()
[ -n "$ASSIGNEE" ] && COMMON_FLAGS+=(--assignee "$ASSIGNEE")
[ -n "$MILESTONE" ] && COMMON_FLAGS+=(--milestone "$MILESTONE")

create_issue () {
  local title="$1"; shift
  local labels="$1"; shift
  local body="$1"; shift

  echo "Creating: $title"
  gh issue create \
    --title "$title" \
    --label "$labels" \
    --body "$body" \
    "${COMMON_FLAGS[@]}" 2>&1 | grep -E "^http" || echo "  ✅ Created"
}

# 1 — Frontend: migrate ui-component → @shared/components
create_issue \
"Frontend: migrate all ui-component imports to @shared/components" \
"area:frontend,priority:high,type:refactor" \
$'Goal: remove all legacy `ui-component/*` imports.\n\nTasks:\n- Complete shared/components barrel (cards, extended, deals, etc.)\n- Replace ~129 imports across ~80 files → `@shared/components`\n- Update aliases if needed; remove old folder\n\nAcceptance:\n- grep for `ui-component` returns 0\n- typecheck & build pass'

# 2 — Frontend: consolidate layout vs layouts
create_issue \
"Frontend: consolidate duplicate layout directories" \
"area:frontend,type:cleanup" \
$'Goal: keep a single `layout/` folder.\n\nTasks:\n- Audit 11 mixed imports; move/merge; delete `layouts/`\n- Fix imports; update aliases\n\nAcceptance:\n- Only `layout/` exists; build & routes OK'

# 3 — Frontend: organize hooks + feature boundaries
create_issue \
"Frontend: move generic hooks to @shared/hooks and add feature boundaries" \
"area:frontend,type:architecture" \
$'Tasks:\n- Move generic hooks → @shared/hooks\n- Create features: deals, leads, companies, contacts, notifications\n- Add feature barrels; update imports\n\nAcceptance:\n- Path aliases work; typecheck green'

# 4 — Frontend: route-level code splitting & error boundaries
create_issue \
"Frontend: add route-level code splitting and error boundaries" \
"area:frontend,type:performance" \
$'Tasks:\n- React.lazy + Suspense for routes\n- Improve ErrorBoundary (logging, reset)\n- Wrap feature routes\n\nAcceptance:\n- Smaller bundles; graceful failures; no console errors'

# 5 — Backend: align DTOs with shared-types (pagination)
create_issue \
"Backend: align DTOs with shared-types (fix pagination drift)" \
"area:backend,priority:high,type:consistency" \
$'Decision: standardize on `{ items,total,page,size,totalPages }`.\n\nTasks:\n- Update shared-types interface + API DTOs\n- Extend all module DTOs; add validators\n\nAcceptance:\n- No casting in FE; typecheck passes in API & shared-types'

# 6 — Backend: e2e tests for critical endpoints
create_issue \
"Backend: add e2e tests for users/leads/deals/companies/contacts" \
"area:backend,type:test" \
$'Tasks:\n- Setup @nestjs/testing + supertest; test DB\n- CRUD + auth/RBAC + validation\n\nAcceptance:\n- e2e suite green in CI; coverage on CRUD paths'

# 7 — Backend: health & version endpoints
create_issue \
"Backend: add /health and /version endpoints" \
"area:backend,type:ops" \
$'Tasks:\n- @nestjs/terminus health checks (db/redis)\n- /version returns version, commit, build time\n- Document in Swagger\n\nAcceptance:\n- curl /health 200; curl /version returns metadata'

# 8 — Workers: error handling, retries, DLQ
create_issue \
"Workers: add error handling, retries (backoff) and DLQ" \
"area:workers,priority:high,type:reliability" \
$'Tasks:\n- try/catch; structured logs; exponential backoff (1s→5m)\n- Dead-letter queue + replay\n- Idempotency checks\n\nAcceptance:\n- Retries observed; DLQ captures permanent failures'

# 9 — Workers: health probe & metrics
create_issue \
"Workers: add /health and /metrics endpoints" \
"area:workers,type:observability" \
$'Tasks:\n- Simple HTTP server: /health (queues status)\n- Optional Prometheus /metrics (prom-client)\n- Docker/K8s healthcheck\n\nAcceptance:\n- curl endpoints OK; health fails on Redis disconnect'

# 10 — SDK: usage docs & examples
create_issue \
"SDK: add usage documentation and runnable examples" \
"area:sdk,type:docs" \
$'Tasks:\n- README with install, auth, CRUD, TS usage\n- examples/: basic-usage.ts, with-auth.ts, pagination.ts, error-handling.ts\n- TypeDoc generation\n\nAcceptance:\n- Examples run; types published'

# 11 — Frontend: comprehensive test suite
create_issue \
"Frontend: add tests for pagination hooks, RBAC, core components" \
"area:frontend,type:test" \
$'Tasks:\n- Vitest + RTL tests for hooks (pagination), RBAC, AppPage, FilterPanel, PaginationToolbar\n- Auth flow + CRUD integration via MSW\n\nAcceptance:\n- CI green; target coverage met (hooks >60%, core >40%)'

# 12 — CI: caching + preview builds
create_issue \
"CI: add pnpm caching and PR preview build artifacts" \
"area:ci,type:performance" \
$'Tasks:\n- actions/cache for pnpm store + node_modules\n- Build FE on PR; upload dist/ as artifact\n- Optionally comment with link\n\nAcceptance:\n- CI 30–50% faster; artifact available'

# 13 — Docs: update PROJECT_STRUCTURE + FEATURE_FLAGS + TESTING
create_issue \
"Docs: update project structure & add FEATURE_FLAGS/TESTING guides" \
"area:docs,type:docs" \
$'Tasks:\n- Refresh PROJECT_STRUCTURE with final aliases\n- Add FEATURE_FLAGS (if any) and TESTING guides\n- README "Running locally" + scripts\n\nAcceptance:\n- New devs can onboard with docs alone'

echo "✅ Done. Issues created in $(gh repo view --json nameWithOwner -q .nameWithOwner)"

