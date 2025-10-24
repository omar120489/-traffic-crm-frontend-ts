# Branch Protection & Required Checks Setup

**Purpose:** Ensure code quality and prevent breaking changes from reaching `main`.

---

## 🎯 Quick Setup (GitHub UI)

### 1. Navigate to Branch Protection Rules

```
Repository → Settings → Branches → Add branch protection rule
```

**Branch name pattern:** `main`

### 2. Required Settings (Copy-Paste Checklist)

#### ✅ Protect matching branches
- [x] **Require a pull request before merging**
  - [x] Require approvals: **1**
  - [x] Dismiss stale pull request approvals when new commits are pushed
  - [x] Require review from Code Owners (if you have a CODEOWNERS file)

- [x] **Require status checks to pass before merging**
  - [x] Require branches to be up to date before merging
  
  **Required status checks (add these):**
  ```
  CI / build
  CI / typecheck
  CI / lint
  CI / test
  SDK Codegen / codegen
  Docs Lint / lint
  ```

- [x] **Require conversation resolution before merging**

- [x] **Require signed commits** (optional, but recommended)

- [x] **Require linear history** (optional, keeps history clean)

- [x] **Do not allow bypassing the above settings**
  - [x] Include administrators (recommended for solo dev)

#### ❌ Do NOT enable (for solo dev)
- [ ] Lock branch (prevents all pushes)
- [ ] Restrict who can push to matching branches (not needed for solo)

---

## 📋 Required Status Checks Breakdown

### 1. **CI / build**
**Workflow:** `.github/workflows/ci.yml`  
**Job:** `build`  
**Purpose:** Ensures all packages build successfully  
**Command:** `pnpm -r build`

### 2. **CI / typecheck**
**Workflow:** `.github/workflows/ci.yml`  
**Job:** `typecheck`  
**Purpose:** Catches TypeScript errors across the monorepo  
**Command:** `pnpm -r typecheck`

### 3. **CI / lint**
**Workflow:** `.github/workflows/ci.yml`  
**Job:** `lint`  
**Purpose:** Enforces code style (ESLint)  
**Command:** `pnpm -r lint`

### 4. **CI / test**
**Workflow:** `.github/workflows/ci.yml`  
**Job:** `test`  
**Purpose:** Runs unit tests (Vitest)  
**Command:** `pnpm -r test`

### 5. **SDK Codegen / codegen**
**Workflow:** `.github/workflows/sdk-codegen.yml`  
**Job:** `codegen`  
**Purpose:** Ensures SDK types are in sync with OpenAPI spec  
**Fails if:** `packages/sdk-js` has uncommitted changes after regeneration

### 6. **Docs Lint / lint**
**Workflow:** `.github/workflows/docs-lint.yml`  
**Job:** `lint`  
**Purpose:** Ensures documentation follows markdown standards  
**Command:** `markdownlint-cli2 "**/*.md"`

---

## 🔧 GitHub CLI Setup (Alternative)

If you prefer CLI over UI, use this:

```bash
# Enable branch protection on main
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks[strict]=true \
  --field required_status_checks[contexts][]=CI%20/%20build \
  --field required_status_checks[contexts][]=CI%20/%20typecheck \
  --field required_status_checks[contexts][]=CI%20/%20lint \
  --field required_status_checks[contexts][]=CI%20/%20test \
  --field required_status_checks[contexts][]=SDK%20Codegen%20/%20codegen \
  --field required_status_checks[contexts][]=Docs%20Lint%20/%20lint \
  --field required_pull_request_reviews[required_approving_review_count]=1 \
  --field required_pull_request_reviews[dismiss_stale_reviews]=true \
  --field required_conversation_resolution=true \
  --field enforce_admins=true \
  --field restrictions=null
```

---

## 🧪 Verify Setup

### Test 1: Create a PR with failing typecheck
```bash
git checkout -b test/broken-types
# Introduce a type error
echo "const x: number = 'string';" >> apps/core-api/src/test.ts
git add . && git commit -m "test: intentional type error"
git push origin test/broken-types
gh pr create --title "Test: Broken types" --body "Should fail CI"
```

**Expected:** CI fails, PR cannot be merged.

### Test 2: Create a PR with SDK drift
```bash
git checkout -b test/sdk-drift
# Modify API without regenerating SDK
echo "// comment" >> apps/core-api/src/modules/contacts/contacts.controller.ts
git add . && git commit -m "test: API change without SDK regen"
git push origin test/sdk-drift
gh pr create --title "Test: SDK drift" --body "Should fail SDK Codegen check"
```

**Expected:** SDK Codegen check fails with helpful comment.

### Test 3: Create a valid PR
```bash
git checkout -b feat/valid-change
# Make a valid change
echo "// valid comment" >> apps/core-api/src/modules/contacts/contacts.service.ts
pnpm dev:sdk  # Regenerate SDK
git add . && git commit -m "feat: valid change with SDK regen"
git push origin feat/valid-change
gh pr create --title "Feat: Valid change" --body "Should pass all checks"
```

**Expected:** All checks pass, PR can be merged after review.

---

## 📊 Status Check Matrix

| Check | Triggers On | Fails If | Fix Command |
|-------|-------------|----------|-------------|
| **build** | All PRs | Any package fails to build | `pnpm -r build` |
| **typecheck** | All PRs | TypeScript errors | Fix type errors |
| **lint** | All PRs | ESLint errors | `pnpm -r lint --fix` |
| **test** | All PRs | Unit tests fail | Fix tests |
| **SDK Codegen** | `apps/core-api/**` changes | SDK out of sync | `pnpm dev:sdk && git add packages/sdk-js && git commit` |
| **Docs Lint** | `**/*.md` changes | Markdown style issues | `pnpm lint:md:fix` |

---

## 🚨 Emergency Override (Use Sparingly)

If you absolutely need to bypass checks (e.g., hotfix):

### Option 1: Temporarily disable branch protection
```bash
gh api repos/:owner/:repo/branches/main/protection \
  --method DELETE
```

**Remember to re-enable after!**

### Option 2: Use admin override
If "Include administrators" is unchecked, admins can merge despite failing checks.

**⚠️ Not recommended for solo dev — keep yourself honest!**

---

## 🎯 Best Practices

### For Solo Dev
1. **Keep "Include administrators" checked** — Forces you to fix issues before merging
2. **Use draft PRs** — For work-in-progress that won't pass checks yet
3. **Local pre-push checks** — Run `pnpm greenlight` before pushing
4. **Conventional commits** — Already enforced via Husky + commitlint

### For Team
1. **Require 1+ reviews** — Already configured
2. **Use CODEOWNERS** — Auto-assign reviewers for specific paths
3. **Require conversation resolution** — Ensures all feedback is addressed
4. **Use linear history** — Keeps git log clean (rebase instead of merge)

---

## 📝 CODEOWNERS Example (Optional)

Create `.github/CODEOWNERS`:

```
# Default owner for everything
* @yourusername

# Backend
/apps/core-api/ @yourusername
/apps/workers/ @yourusername

# Frontend
/apps/frontend/ @yourusername

# SDK & Shared
/packages/sdk-js/ @yourusername
/packages/shared-types/ @yourusername

# Infrastructure
/infra/ @yourusername
/.github/ @yourusername

# Documentation
/docs/ @yourusername
*.md @yourusername
```

---

## 🔄 Workflow: Making Changes

### Standard Flow
```bash
# 1. Create feature branch
git checkout -b feat/new-feature

# 2. Make changes
# ... code ...

# 3. Run local checks
pnpm greenlight

# 4. If API changed, regenerate SDK
pnpm dev:sdk
git add packages/sdk-js

# 5. Commit (commitlint enforces conventional commits)
git commit -m "feat: add new feature"

# 6. Push
git push origin feat/new-feature

# 7. Create PR
gh pr create --title "Feat: Add new feature" --body "Description"

# 8. Wait for CI (all checks must pass)
# 9. Review (if team) or self-review
# 10. Merge via GitHub UI or CLI
gh pr merge --squash
```

### Quick Fix Flow
```bash
# For small fixes that don't need a PR (use sparingly)
git checkout main
git pull
# ... make fix ...
pnpm greenlight
git add . && git commit -m "fix: quick fix"
git push origin main
```

**⚠️ Only works if "Require a pull request before merging" is disabled for your user.**

---

## 🆘 Troubleshooting

### "Required status check is not present"
**Cause:** Workflow hasn't run yet on this branch  
**Fix:** Push a commit to trigger workflows, or wait for first run

### "This branch is out of date"
**Cause:** `main` has new commits since your branch was created  
**Fix:** 
```bash
git checkout feat/your-branch
git pull origin main --rebase
git push --force-with-lease
```

### "SDK Codegen check failed"
**Cause:** API changed but SDK wasn't regenerated  
**Fix:**
```bash
pnpm dev:sdk
git add packages/sdk-js
git commit -m "chore: regenerate SDK types"
git push
```

### "Docs Lint check failed"
**Cause:** Markdown style issues  
**Fix:**
```bash
pnpm lint:md:fix
git add .
git commit -m "docs: fix markdown linting"
git push
```

---

## ✅ Verification Checklist

After setting up branch protection, verify:

- [ ] Cannot push directly to `main` (must use PR)
- [ ] Cannot merge PR with failing checks
- [ ] Cannot merge PR without 1 approval (if team)
- [ ] SDK drift causes check to fail
- [ ] Markdown lint issues cause check to fail
- [ ] TypeScript errors cause check to fail
- [ ] Build failures cause check to fail

---

## 📚 Related Documentation

- **[CONTRIBUTING.md](../CONTRIBUTING.md)** — Contribution guidelines
- **[WORKFLOW_SCRIPTS.md](../docs/WORKFLOW_SCRIPTS.md)** — Available scripts
- **[SPRINT_2_QUICK_START.md](../SPRINT_2_QUICK_START.md)** — Development setup

---

**🎉 With these settings, your `main` branch is protected and your workflow is bulletproof!**

*Last Updated: October 24, 2025*


