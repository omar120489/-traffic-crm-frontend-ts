# Fresh Clone Smoke Checklist

This checklist verifies a fresh clone works perfectly for new contributors.

## 🎯 Goal

Ensure a new developer can clone, install, and run the project in **under 2 minutes** with zero friction.

## ✅ Quick Smoke Test

Run this sequence on a fresh clone:

```bash
# 1. Clone
git clone https://github.com/omar120489/-traffic-crm-frontend-ts.git
cd traffic-crm-frontend-ts

# 2. Setup Node & pnpm
nvm use 20              # Switch to Node 20 (installs if needed)
corepack enable         # Enable pnpm via corepack (no global install needed)

# 3. Install (deterministic, mirrors CI)
pnpm -r install --frozen-lockfile

# 4. Verify Sprint 2 TypeScript
pnpm --filter ./apps/frontend run typecheck:sprint2

# 5. Verify linting
pnpm --filter ./apps/frontend run lint

# 6. (Optional) Run preflight
pnpm run preflight
```

## 📊 Expected Results

| Step | Expected Time | Expected Output |
|------|---------------|-----------------|
| **Clone** | 10-30s | Repo cloned successfully |
| **Node setup** | <5s | `Now using node v20.x.x` |
| **Corepack** | <1s | `Preparing pnpm@10.18.2...` |
| **Install (cold)** | 40-60s | `Done in ~50s` |
| **Install (cached)** | 10-15s | `Done in ~12s` |
| **TypeCheck** | 10-15s | `✅ No errors` |
| **Lint** | 12-18s | `✅ No warnings/errors` |
| **Preflight** | 20-25s (cached) | All green |

## 🚨 Common Issues

### Issue: `nvm: command not found`

**Solution:** Install nvm first:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# Restart terminal
nvm install 20
```

### Issue: `corepack: command not found`

**Solution:** Update Node.js (corepack ships with Node 16.9+):
```bash
nvm install 20
nvm use 20
corepack enable
```

### Issue: `ERR_PNPM_UNSUPPORTED_ENGINE`

**Solution:** You're on the wrong Node version:
```bash
node -v  # Check current version
nvm use 20  # Switch to Node 20
```

### Issue: Slow install (>2 minutes)

**Possible causes:**
- No cache (first install) → Expected
- Slow network → Check connection
- Missing `--frozen-lockfile` → Use it for deterministic installs

### Issue: TypeCheck fails with legacy errors

**Solution:** Ensure you're running the Sprint 2 config:
```bash
cd apps/frontend
pnpm tsc --noEmit -p tsconfig.sprint2.json  # Sprint 2 only
pnpm tsc --noEmit -p tsconfig.json          # Full repo (with shims)
```

## 🎯 Success Criteria

You're ready to contribute when:
- ✅ Install completes in <60s (cold) or <15s (cached)
- ✅ `typecheck:sprint2` passes with 0 errors
- ✅ `lint` passes with 0 warnings
- ✅ `pnpm run preflight` is all green
- ✅ Git hooks are installed (`.husky/pre-commit` and `.husky/pre-push` exist)

## 🚀 Next Steps

After smoke test passes:

1. **Start the backend:**
   ```bash
   pnpm --filter @apps/core-api start:dev
   # API runs on http://localhost:3000
   ```

2. **Start the frontend:**
   ```bash
   pnpm --filter ./apps/frontend dev
   # Frontend runs on http://localhost:5173
   ```

3. **Make a test change:**
   ```bash
   git checkout -b test/my-first-pr
   # Edit a file in apps/frontend/src/pages/contacts/
   git add .
   git commit -m "test(contacts): verify hooks work"
   # Pre-commit hook runs lint-staged
   git push origin test/my-first-pr
   # Pre-push hook runs Sprint 2 typecheck
   ```

4. **Open a PR:**
   - Go to GitHub
   - Create PR from `test/my-first-pr` → `main`
   - Verify CI runs and passes
   - Verify CODEOWNERS requests review

## 📚 Related Documentation

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Full contributor guide
- [BRANCH_PROTECTION_SETUP.md](./BRANCH_PROTECTION_SETUP.md) - GitHub settings
- [MIGRATION.md](../MIGRATION.md) - Legacy migration tracker

---

**Last Updated:** October 24, 2025  
**Status:** ✅ Production-ready

