# A Technical Analysis of Dependency Management in the Fastify Ecosystem

## Deconstructing the @fastify/static ↔ Fastify v4 Compatibility Issue

## Executive Summary

- **What happened**: Installing `@fastify/static@^8` alongside Fastify v4 triggered a hard failure: "expected '5.x' fastify version, '4.x' is installed."
- **Why**: `@fastify/static` 8.x realigned to Fastify v5. For Fastify v4, the compatible lines are 6.x–7.x.
- **Tactical fix** (commit `79591c21`): Downgrade to `@fastify/static@^6` → unblocks the app.
- **Strategic implication**: This pins an older major and creates intentional technical debt; plan a managed upgrade to Fastify v5.
- **What to do next**:
  1. Keep the downgrade for stability.
  2. Schedule a v5 migration (see checklist below).
  3. Formalize dependency governance (pinning policy, bot-driven updates, tests).

---

## 1) Fastify in Brief: Why Plugins Amplify Version Risk

Fastify's core is intentionally small and fast; most functionality lives in plugins registered via `fastify.register(...)`. That modularity:

- ✅ Encourages clean composition and isolation.
- ⚠️ Means core major changes ripple through many plugins.

When the core jumps a major version, official plugins often ship matching major bumps. **Mismatch = runtime failures** like the one you saw.

---

## 2) What @fastify/static Does (and Why It's Special)

`@fastify/static` serves static assets (SPA bundles, images, etc.), layered over `@fastify/send`. Key options you'll encounter:

- `root` (required): absolute path to files.
- `prefix`: URL mount path (e.g., `/assets/`).
- `wildcard` / `globIgnore`: dynamic vs. route-per-file behavior.
- `setHeaders(res, path, stat)`: tweak cache/security headers.
- `send` options (`maxAge`, `immutable`, `cacheControl`) for caching.

Because it reaches into low-level response handling and performance tuning, it closely tracks Fastify's internals → **tight peer-version coupling**.

---

## 3) The Compatibility Matrix (Ground Truth)

| @fastify/static | Compatible Fastify |
|-----------------|-------------------|
| 8.x             | 5.x               |
| 7.x             | 4.x               |
| 6.x             | 4.x               |
| 5.x             | 3.x               |
| 2.x             | 2.x               |
| 1.x             | 1.x               |

**Your stack**: Fastify v4 ⇒ use `@fastify/static@^6` or `^7`.

Installing 8.x on v4 triggers the exact plugin version mismatch you observed.

---

## 4) What Changed Across Fastify Majors (Why v4 vs v5 Matters)

### Notable v3 → v4 Shifts That Impacted Plugins

- **Synchronous route registration**: different hook/registration expectations.
- **`reply.res` → `reply.raw`**: direct response access moved.
- **Encapsulated error handling**: plugin-local error handlers compose differently.
- **No `app.use()` in core**: use hooks or `@fastify/middie`.

### The v5 Realignment

v5 continued API tightening (e.g., full JSON Schema requirements), refined `listen()` signatures (options object), and elevated Node runtime requirements (Node 20+). Official plugins, including `@fastify/static`, bumped majors to align. **That's why `static@8` requires Fastify v5.**

---

## 5) The Downgrade (Commit 79591c21): Correct, But Creates Debt

- **Pros**: Fast, low-risk, restores service.
- **Trade-off**: You forgo newer features, perf fixes, and potential security patches limited to 8.x+.
- **Action**: Treat the pin as documented technical debt with an owner and review date.

---

## 6) Two Safe Operating Modes (Pick One Now)

### Option A — API-Only (No Static Serving)

Remove the plugin if you don't serve files:

```bash
pnpm --filter @apps/core-api remove @fastify/static
# Ensure there is no app.register(fastifyStatic, ...) in code
```

- ✅ Eliminates the class of issues entirely.

### Option B — Keep Static on Fastify v4

Install a compatible line:

```bash
pnpm --filter @apps/core-api add @fastify/static@^6.12.0
```

- ✅ Restores clean startup on v4.
- 📌 Record the pin and why (link to the commit).

---

## 7) Plan the Fastify v5 Migration (Strategic Fix)

### Pre-reqs

- Node 20+ everywhere (local, CI, prod).
- Agree target window and rollback plan.

### Code Changes to Expect

- **Schemas**: provide complete JSON Schemas for params/query/body (no shorthands).
- **Logger**: follow v5 logger config rules (no passing custom instance directly).
- **Server startup**: use `listen({ port, host })` (no variadic signature).

### Plugin Lining-Up

- Upgrade official plugins to the v5-aligned majors (e.g., `@fastify/static@^8`).
- Check transitive deps (e.g., `@fastify/send`) as part of lockfile refresh.

### Test & Rollout

- Add/expand E2E smoke tests for static routes and critical APIs.
- Run migration on a feature branch with CI + preview/staging.
- Roll out with canary or phased deploy; monitor logs/latency.

### Suggested Checklist

- [ ] Node 20 in `.nvmrc`, CI, containers, runtime.
- [ ] Fastify → v5, boot & health checks pass.
- [ ] All official plugins bumped to their v5-compatible lines.
- [ ] Schemas audited; strict validation enabled.
- [ ] E2E smoke suite green.
- [ ] Observability: verify Pino output & log routing.

---

## 8) Governance: Keep This From Happening Again

- **SemVer discipline**: Use `^` for well-behaved libs, `~` or exact pins for critical runtime plugins.
- **Automated updates**: Enable Dependabot/Renovate with grouping rules (e.g., "fastify core & official plugins").
- **Release gates**: CI job runs typecheck + unit + E2E on every dependency PR.
- **Operational notes**: Include a "Compatibility Matrix" table (like above) in your internal runbook for fast triage.

---

## 9) Quick References

### Register Static (v4-Compatible Line)

```typescript
import fastifyStatic from '@fastify/static';
import path from 'node:path';

app.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/assets/',
  setHeaders(res) {
    // Example: long-term caching for hashed assets
    res.setHeader('Cache-Control', 'public,max-age=31536000,immutable');
  }
});
```

### Health and Smoke Checks

```bash
# Backend
curl -i http://localhost:3000/health || curl -i http://localhost:3333/health

# Static
curl -I http://localhost:3000/assets/app.js
```

---

## Conclusion

Downgrading `@fastify/static` to the 6.x line on Fastify v4 was the right tactical move: it restores stability fast. Strategically, schedule an upgrade to Fastify v5 to rejoin the plugin ecosystem's leading edge and reclaim improvements that newer majors provide. With a lightweight governance layer—version discipline, automated update PRs, and E2E gates—you can turn one-off firefighting into a repeatable, low-risk upgrade rhythm.

---

## Related Documentation

- [Fastify v5 Migration Guide](https://fastify.dev/docs/latest/Guides/Migration-Guide-V5/)
- [@fastify/static Documentation](https://github.com/fastify/fastify-static)
- [Project Architecture Overview](./ARCHITECTURE_OVERVIEW.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
