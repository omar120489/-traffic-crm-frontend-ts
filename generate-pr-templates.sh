#!/usr/bin/env bash
# generate-pr-templates.sh
# Generates PR description templates for each issue
set -euo pipefail

OUTPUT_DIR=".github/PR_TEMPLATES"
mkdir -p "$OUTPUT_DIR"

# Issue #1
cat > "$OUTPUT_DIR/01-migrate-components.md" <<'EOF'
## 🎯 Goal
Eliminate all legacy `ui-component/*` imports and centralize under `@shared/components`

## 📋 Changes
- [ ] Completed `shared/components/index.ts` barrel exports (cards, extended, deals)
- [ ] Migrated ~129 imports across ~80 files
- [ ] Updated path aliases in tsconfig/vite config
- [ ] Removed/archived `ui-component/` directory

## ✅ Verification
```bash
# No ui-component imports remain
grep -r "from.*ui-component" apps/frontend/src
# Should return: (no matches)

# Build passes
pnpm --filter ./apps/frontend typecheck
pnpm --filter ./apps/frontend build
pnpm --filter ./apps/frontend preview  # smoke test
```

## 📸 Screenshots (if UI changes)
_Add before/after screenshots if applicable_

## 🔗 Related
Closes #1
EOF

# Issue #2
cat > "$OUTPUT_DIR/02-consolidate-layouts.md" <<'EOF'
## 🎯 Goal
Remove duplication between `layout/` and `layouts/` directories

## 📋 Changes
- [ ] Audited 11 mixed imports
- [ ] Kept `layout/` (MainLayout, MinimalLayout, SimpleLayout)
- [ ] Moved/deleted `layouts/AppPage.tsx`
- [ ] Updated all imports
- [ ] Removed `layouts/` directory

## ✅ Verification
```bash
pnpm --filter ./apps/frontend typecheck
pnpm --filter ./apps/frontend build
# Test all routes render correctly
```

## 🔗 Related
Closes #2
EOF

# Issue #3
cat > "$OUTPUT_DIR/03-organize-hooks-features.md" <<'EOF'
## 🎯 Goal
Organize hooks under `@shared/hooks` and create feature boundaries

## 📋 Changes
- [ ] Moved generic hooks to `src/shared/hooks/`
- [ ] Created feature boundaries:
  - [ ] `features/deals/` (hooks, components, types)
  - [ ] `features/leads/`
  - [ ] `features/companies/`
  - [ ] `features/contacts/`
  - [ ] `features/notifications/`
- [ ] Added feature barrel exports
- [ ] Updated all imports to new paths

## ✅ Verification
```bash
pnpm --filter ./apps/frontend typecheck
# All path aliases resolve correctly
```

## 🔗 Related
Closes #3
EOF

# Issue #4
cat > "$OUTPUT_DIR/04-code-splitting-error-boundaries.md" <<'EOF'
## 🎯 Goal
Improve performance with lazy loading and resilient error boundaries

## 📋 Changes
- [ ] Wrapped routes with `React.lazy()` + `Suspense`
- [ ] Enhanced `ErrorBoundary.tsx` with logging & reset
- [ ] Added per-feature error boundaries
- [ ] Tested error scenarios

## ✅ Verification
```bash
pnpm --filter ./apps/frontend build
# Check bundle size reduction in build output

pnpm --filter ./apps/frontend preview
# Test navigation, verify no console errors
# Test error scenarios (network failure, component crash)
```

## 📊 Performance Impact
- Bundle size before: ___ KB
- Bundle size after: ___ KB
- Reduction: ___%

## 🔗 Related
Closes #4
EOF

# Issue #5
cat > "$OUTPUT_DIR/05-align-dtos-shared-types.md" <<'EOF'
## 🎯 Goal
Eliminate type drift between API DTOs and shared-types

## 📋 Changes
- [ ] Standardized pagination format: `{ items, total, page, size, totalPages }`
- [ ] Updated `packages/shared-types/src/base.ts`
- [ ] Aligned all module DTOs with shared-types
- [ ] Added class-validator decorators
- [ ] Updated frontend pagination hooks

## ✅ Verification
```bash
pnpm --filter @apps/core-api typecheck
pnpm --filter @shared-types build
pnpm --filter ./apps/frontend typecheck
# No type casting needed in frontend
```

## 🔗 Related
Closes #5
EOF

# Issue #6
cat > "$OUTPUT_DIR/06-backend-e2e-tests.md" <<'EOF'
## 🎯 Goal
Establish e2e test coverage for core API functionality

## 📋 Changes
- [ ] Setup e2e infrastructure (@nestjs/testing, supertest)
- [ ] Created test database setup/teardown
- [ ] Added e2e tests:
  - [ ] `users.e2e-spec.ts`
  - [ ] `leads.e2e-spec.ts`
  - [ ] `deals.e2e-spec.ts`
  - [ ] `companies.e2e-spec.ts`
  - [ ] `contacts.e2e-spec.ts`
- [ ] Tested RBAC/auth guards
- [ ] Tested validation scenarios

## ✅ Verification
```bash
pnpm --filter @apps/core-api test:e2e
# All tests pass
```

## 📊 Coverage
- Endpoints covered: __/__
- Test scenarios: __

## 🔗 Related
Closes #6
EOF

# Issue #7
cat > "$OUTPUT_DIR/07-health-version-endpoints.md" <<'EOF'
## 🎯 Goal
Production-ready health monitoring and version tracking

## 📋 Changes
- [ ] Installed @nestjs/terminus
- [ ] Created `/health` endpoint (overall + db + redis)
- [ ] Created `/version` endpoint (version, commit, build time)
- [ ] Updated Swagger docs
- [ ] Added CI health check validation

## ✅ Verification
```bash
pnpm --filter @apps/core-api dev
# In another terminal:
curl http://localhost:3000/health
curl http://localhost:3000/version
# Both should return 200 + JSON
```

## 🔗 Related
Closes #7
EOF

# Issue #8
cat > "$OUTPUT_DIR/08-workers-reliability.md" <<'EOF'
## 🎯 Goal
Production-grade worker reliability with error handling

## 📋 Changes
- [ ] Added try/catch to all processors
- [ ] Configured exponential backoff (1s, 5s, 30s, 5m)
- [ ] Implemented Dead Letter Queue pattern
- [ ] Added idempotency checks
- [ ] Added structured logging (job lifecycle)

## ✅ Verification
```bash
pnpm --filter @apps/workers test
# Enqueue test jobs with intentional failures
# Verify retry behavior in logs
# Confirm DLQ captures permanent failures
```

## 📊 Reliability Metrics
- Max retries: 5
- Backoff strategy: exponential
- DLQ retention: __

## 🔗 Related
Closes #8
EOF

# Issue #9
cat > "$OUTPUT_DIR/09-workers-health-metrics.md" <<'EOF'
## 🎯 Goal
Observable worker health and performance metrics

## 📋 Changes
- [ ] Created HTTP server in workers (port 3001)
- [ ] Added `/health` endpoint (worker status, queue connections)
- [ ] Added `/metrics` endpoint (Prometheus format)
- [ ] Updated Docker health check

## ✅ Verification
```bash
pnpm --filter @apps/workers dev
# In another terminal:
curl http://localhost:3001/health
curl http://localhost:3001/metrics
# Test Redis disconnect scenario
```

## 🔗 Related
Closes #9
EOF

# Issue #10
cat > "$OUTPUT_DIR/10-sdk-docs-examples.md" <<'EOF'
## 🎯 Goal
Developer-friendly SDK with clear usage examples

## 📋 Changes
- [ ] Updated `packages/sdk-js/README.md` with:
  - [ ] Installation & quick start
  - [ ] Authentication setup
  - [ ] CRUD examples
  - [ ] Error handling
- [ ] Added `examples/` directory:
  - [ ] `basic-usage.ts`
  - [ ] `with-auth.ts`
  - [ ] `pagination.ts`
  - [ ] `error-handling.ts`
- [ ] Added JSDoc comments
- [ ] Generated TypeDoc

## ✅ Verification
```bash
cd packages/sdk-js/examples
npx tsx basic-usage.ts
# All examples run successfully

pnpm --filter @sdk-js/core build
# Type definitions included
```

## 🔗 Related
Closes #10
EOF

# Issue #11
cat > "$OUTPUT_DIR/11-frontend-tests.md" <<'EOF'
## 🎯 Goal
Meaningful test coverage for critical frontend functionality

## 📋 Changes
- [ ] Added pagination hook tests
- [ ] Added RBAC tests
- [ ] Added core component tests (AppPage, FilterPanel, PaginationToolbar)
- [ ] Added feature tests (chat, deals)
- [ ] Added integration tests (auth flow, CRUD)

## ✅ Verification
```bash
pnpm --filter ./apps/frontend test:unit
pnpm --filter ./apps/frontend test:unit -- --coverage
# Target: hooks >60%, components >40%
```

## 📊 Coverage Report
- Hooks: ___%
- Components: ___%
- Overall: ___%

## 🔗 Related
Closes #11
EOF

# Issue #12
cat > "$OUTPUT_DIR/12-ci-caching-preview.md" <<'EOF'
## 🎯 Goal
Faster CI runs and preview deployments for PRs

## 📋 Changes
- [ ] Added pnpm store caching
- [ ] Added node_modules caching
- [ ] Added Turbo cache (if applicable)
- [ ] Created preview build job
- [ ] Added artifact upload
- [ ] Added PR comment with artifact link

## ✅ Verification
```bash
# Open a test PR and observe:
# - CI run time (should be 30-50% faster)
# - Artifact available in Actions tab
# - PR comment with download link
```

## 📊 Performance Impact
- CI time before: __ min
- CI time after: __ min
- Improvement: ___%

## 🔗 Related
Closes #12
EOF

# Issue #13
cat > "$OUTPUT_DIR/13-docs-update.md" <<'EOF'
## 🎯 Goal
Up-to-date documentation reflecting final architecture

## 📋 Changes
- [ ] Updated `docs/PROJECT_STRUCTURE.md`
- [ ] Created `docs/FEATURE_FLAGS.md` (if applicable)
- [ ] Updated root `README.md` with "Running locally"
- [ ] Created `docs/TESTING.md`

## ✅ Verification
```bash
# Review all updated docs
# Ensure no broken links
# Verify instructions work for new developers
```

## 🔗 Related
Closes #13
EOF

echo "✅ Generated 13 PR templates in $OUTPUT_DIR/"
ls -1 "$OUTPUT_DIR/"

