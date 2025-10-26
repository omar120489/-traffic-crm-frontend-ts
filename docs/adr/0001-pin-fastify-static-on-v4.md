# ADR 0001: Pin @fastify/static to v6 for Fastify v4 Compatibility

## Status

**Accepted** (October 24, 2025)

## Context

The `@fastify/static` plugin is used in `apps/core-api` to serve static assets. During routine dependency updates, installing `@fastify/static@^8` alongside Fastify v4 caused a hard runtime failure:

```text
expected '5.x' fastify version, '4.x' is installed
```

### Root Cause

- `@fastify/static` 8.x requires Fastify v5
- Our core-api uses Fastify v4
- The plugin's peer dependency check enforces strict version alignment

### Compatibility Matrix

| @fastify/static | Compatible Fastify |
|-----------------|-------------------|
| 8.x             | 5.x               |
| 7.x             | 4.x               |
| 6.x             | 4.x               |

## Decision

**Pin `@fastify/static` to `^6.12.0`** (Fastify v4-compatible) until we can migrate the entire stack to Fastify v5.

### Rationale

1. **Immediate stability**: Restores service without blocking other work
2. **Low risk**: v6 is stable and well-tested on Fastify v4
3. **Buys time**: Allows us to plan a proper v5 migration with Node 20+ and schema audits
4. **Documented debt**: This ADR and the [Fastify Dependency Analysis](../FASTIFY_DEPENDENCY_ANALYSIS.md) make the trade-off explicit

## Alternatives Considered

### 1. Remove @fastify/static Entirely

**Pros**: Eliminates the dependency class entirely  
**Cons**: We use it to serve frontend assets in dev/preview; removing requires rearchitecture  
**Verdict**: Rejected (too disruptive for tactical fix)

### 2. Upgrade to Fastify v5 Immediately

**Pros**: Rejoins the plugin ecosystem's leading edge  
**Cons**: Requires Node 20+, schema refactoring, `listen()` signature changes, full E2E testing  
**Verdict**: Deferred (needs dedicated sprint)

### 3. Use @fastify/static@^7 (also v4-compatible)

**Pros**: Slightly newer than v6  
**Cons**: v6 is battle-tested and sufficient; v7 offers no critical features for our use case  
**Verdict**: Rejected (v6 is safer)

## Consequences

### Positive

- ✅ Backend starts cleanly on Fastify v4
- ✅ No breaking changes to existing code
- ✅ Clear migration path documented

### Negative

- ⚠️ Forgo newer features/perf fixes in `@fastify/static` 8.x
- ⚠️ Potential security patches may be limited to 8.x line
- ⚠️ Creates intentional technical debt

### Migration Trigger

Upgrade to Fastify v5 when:

1. **Node 20+ is standard** across local, CI, and production
2. **Dedicated sprint allocated** for schema audits and API refactoring
3. **E2E test suite** covers static routes and critical APIs
4. **Rollback plan** is documented and tested

## Implementation

**Commit**: `79591c21` - "fix(core-api): downgrade @fastify/static to v6 for Fastify 4 compatibility"

```bash
pnpm --filter @apps/core-api add @fastify/static@^6.12.0
```

## References

- [Fastify Dependency Analysis](../FASTIFY_DEPENDENCY_ANALYSIS.md) - Comprehensive technical analysis
- [Fastify v5 Migration Guide](https://fastify.dev/docs/latest/Guides/Migration-Guide-V5/)
- [@fastify/static Documentation](https://github.com/fastify/fastify-static)
- [GitHub Issue #TBD](https://github.com/omar120489/-traffic-crm-frontend-ts/issues/TBD) - Track v5 migration

## Review Date

**Q1 2026** - Reassess when Node 20 is stable in all environments

---

**Last Updated**: October 24, 2025  
**Supersedes**: None  
**Superseded By**: None (active)
