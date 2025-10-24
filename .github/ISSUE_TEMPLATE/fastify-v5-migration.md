---
name: Migrate to Fastify v5 & @fastify/static@^8
about: Track the strategic upgrade from Fastify v4 to v5
title: 'chore(core-api): migrate to Fastify v5 and @fastify/static@^8'
labels: ['dependencies', 'fastify', 'technical-debt', 'enhancement']
assignees: ['omar120489']
---

## Context

We're currently pinned to Fastify v4 and `@fastify/static@^6` (see [ADR 0001](../../docs/adr/0001-pin-fastify-static-on-v4.md)). This issue tracks the migration to Fastify v5 to rejoin the plugin ecosystem's leading edge.

**Related Documentation:**
- [Fastify Dependency Analysis](../../docs/FASTIFY_DEPENDENCY_ANALYSIS.md)
- [ADR 0001: Pin @fastify/static on v4](../../docs/adr/0001-pin-fastify-static-on-v4.md)

## Pre-requisites

- [ ] Node 20+ deployed in all environments (local, CI, staging, production)
- [ ] Sprint allocated for migration work (estimate: 2-3 days)
- [ ] Rollback plan documented and tested

## Acceptance Criteria

### Infrastructure

- [ ] Node 20 in `.nvmrc`
- [ ] Node 20 in CI workflows (`.github/workflows/*.yml`)
- [ ] Node 20 in Docker images (`apps/core-api/Dockerfile`)
- [ ] Node 20 in production runtime

### Code Changes

- [ ] Upgrade `fastify` to `^5.x` in `apps/core-api/package.json`
- [ ] Upgrade `@fastify/static` to `^8.x`
- [ ] Upgrade all `@fastify/*` plugins to v5-compatible versions
- [ ] Audit and complete all JSON Schemas (params, query, body)
- [ ] Refactor `listen()` calls to use options object: `listen({ port, host })`
- [ ] Update logger configuration per v5 requirements
- [ ] Replace any deprecated APIs (e.g., `reply.res` → `reply.raw`)

### Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E smoke tests cover:
  - [ ] Health check endpoint
  - [ ] Static asset serving
  - [ ] Critical API routes (contacts, deals, leads)
- [ ] Load test confirms no performance regression

### Observability

- [ ] Pino logger output verified in staging
- [ ] Metrics/APM integration still functional
- [ ] Error tracking (Sentry/etc.) captures Fastify v5 stack traces

### Deployment

- [ ] Feature branch deployed to staging
- [ ] Staging soak test (24h minimum)
- [ ] Canary deploy to production (10% traffic)
- [ ] Full production rollout
- [ ] Rollback plan tested and documented

## Migration Checklist

```bash
# 1. Update Node version
echo "20" > .nvmrc
nvm use 20

# 2. Upgrade Fastify ecosystem
cd apps/core-api
pnpm add fastify@^5 @fastify/static@^8

# 3. Update other Fastify plugins
pnpm outdated | grep @fastify
# Upgrade each to v5-compatible versions

# 4. Run tests
pnpm test
pnpm build

# 5. Smoke test locally
pnpm start:dev
curl -i http://localhost:3000/health
curl -I http://localhost:3000/assets/app.js
```

## Rollback Plan

If issues arise in production:

1. **Immediate**: Revert merge commit via `git revert`
2. **Deploy**: Fast-forward deploy the revert
3. **Verify**: Confirm health checks and metrics
4. **Postmortem**: Document what failed and why

## Success Metrics

- ✅ Zero downtime during migration
- ✅ No increase in error rate (< 0.1% change)
- ✅ No performance regression (p95 latency within 5%)
- ✅ All E2E tests green

## References

- [Fastify v5 Migration Guide](https://fastify.dev/docs/latest/Guides/Migration-Guide-V5/)
- [@fastify/static v8 Changelog](https://github.com/fastify/fastify-static/releases)
- [Compatibility Matrix](../../docs/FASTIFY_DEPENDENCY_ANALYSIS.md#3-the-compatibility-matrix-ground-truth)

---

**Estimated Effort**: 2-3 days  
**Priority**: Medium (technical debt, not blocking)  
**Target Quarter**: Q1 2026

