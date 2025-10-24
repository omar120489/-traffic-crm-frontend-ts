# GitHub Branch Protection Settings — Copy-Paste Guide

**Quick Reference:** Exact settings to paste into GitHub UI

---

## 🎯 Access Branch Protection

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Click **Branches** (left sidebar)
4. Click **Add branch protection rule** (or edit existing rule for `main`)

---

## 📋 Settings to Enable

### Branch name pattern
```
main
```

---

### ✅ Protect matching branches

#### Require a pull request before merging
- [x] **Require a pull request before merging**
  - **Required number of approvals before merging:** `1`
  - [x] **Dismiss stale pull request approvals when new commits are pushed**
  - [ ] Require review from Code Owners (enable if you create `.github/CODEOWNERS`)
  - [x] **Require approval of the most recent reviewable push**

#### Require status checks to pass before merging
- [x] **Require status checks to pass before merging**
  - [x] **Require branches to be up to date before merging**
  
  **Search for and add these status checks:**
  
  In the "Search for status checks" box, type and select:
  ```
  CI / build
  CI / typecheck
  CI / lint
  CI / test
  SDK Codegen / codegen
  Docs Lint / lint
  ```
  
  **Note:** These will only appear after the workflows have run at least once. If you don't see them:
  1. Create a test PR first
  2. Wait for workflows to run
  3. Come back and add the checks

#### Other protections
- [x] **Require conversation resolution before merging**
- [ ] Require signed commits (optional, recommended for security)
- [ ] Require linear history (optional, enforces rebase/squash)
- [x] **Do not allow bypassing the above settings**
- [x] **Include administrators** (recommended for solo dev — keeps you honest!)

#### Rules applied to everyone including administrators
- [x] **Allow force pushes** → **Specify who can force push** → Leave empty (no one)
- [x] **Allow deletions** → Uncheck (prevents accidental branch deletion)

---

## 🖼️ Visual Checklist

When you're done, your settings should look like this:

```
Branch name pattern: main

✅ Require a pull request before merging
   └─ Required approvals: 1
   └─ ✅ Dismiss stale pull request approvals when new commits are pushed
   └─ ✅ Require approval of the most recent reviewable push

✅ Require status checks to pass before merging
   └─ ✅ Require branches to be up to date before merging
   └─ Status checks that are required:
      • CI / build
      • CI / typecheck
      • CI / lint
      • CI / test
      • SDK Codegen / codegen
      • Docs Lint / lint

✅ Require conversation resolution before merging

✅ Do not allow bypassing the above settings
   └─ ✅ Include administrators

❌ Allow force pushes (unchecked)
❌ Allow deletions (unchecked)
```

---

## 🚀 First-Time Setup Sequence

If this is your first time setting up branch protection, follow this sequence:

### Step 1: Create a test PR to trigger workflows
```bash
git checkout -b test/branch-protection-setup
echo "# Test PR for branch protection" > TEST.md
git add TEST.md
git commit -m "test: trigger workflows for branch protection"
git push origin test/branch-protection-setup
gh pr create --title "Test: Branch protection setup" --body "Triggering workflows to populate status checks"
```

### Step 2: Wait for workflows to complete
Check the PR's "Checks" tab. You should see:
- ✅ CI / build
- ✅ CI / typecheck
- ✅ CI / lint
- ✅ CI / test
- ✅ SDK Codegen / codegen
- ✅ Docs Lint / lint

### Step 3: Configure branch protection
Now go to **Settings → Branches → Add rule** and follow the checklist above.

The status checks will now appear in the search box.

### Step 4: Test the protection
Try to merge the test PR. It should:
1. Require 1 approval (if team, or you can approve your own if solo)
2. Show all checks passing
3. Allow merge

### Step 5: Clean up
```bash
gh pr merge test/branch-protection-setup --squash
git checkout main
git pull
git branch -d test/branch-protection-setup
```

---

## 🧪 Verification Tests

### Test 1: Direct push to main (should fail)
```bash
git checkout main
echo "test" >> README.md
git add README.md
git commit -m "test: direct push"
git push origin main
```

**Expected result:**
```
remote: error: GH006: Protected branch update failed for refs/heads/main.
remote: error: Changes must be made through a pull request.
```

✅ **Success!** Direct pushes are blocked.

### Test 2: PR with failing check (should block merge)
```bash
git checkout -b test/failing-check
echo "const x: number = 'string';" >> apps/core-api/src/test-error.ts
git add . && git commit -m "test: intentional type error"
git push origin test/failing-check
gh pr create --title "Test: Failing check" --body "Should block merge"
```

**Expected result:**
- PR is created
- CI / typecheck fails
- "Merge" button is disabled with message: "Required status checks must pass before merging"

✅ **Success!** Failing checks block merges.

### Test 3: PR with SDK drift (should block merge)
```bash
git checkout -b test/sdk-drift
echo "// API change" >> apps/core-api/src/modules/contacts/contacts.controller.ts
git add . && git commit -m "test: API change without SDK regen"
git push origin test/sdk-drift
gh pr create --title "Test: SDK drift" --body "Should fail SDK check"
```

**Expected result:**
- PR is created
- SDK Codegen / codegen fails
- Bot comments with instructions to run `pnpm dev:sdk`
- "Merge" button is disabled

✅ **Success!** SDK drift is detected and blocks merge.

---

## 🔧 Troubleshooting

### "Status checks not found"
**Problem:** The status checks don't appear in the search box.

**Solution:**
1. The workflows must run at least once before they appear
2. Create a test PR (see "First-Time Setup Sequence" above)
3. Wait for workflows to complete
4. Return to branch protection settings — checks will now be searchable

### "Include administrators" is greyed out
**Problem:** You're not an admin on the repository.

**Solution:**
1. Go to **Settings → Collaborators and teams**
2. Ensure your user has "Admin" role
3. Return to branch protection settings

### "Cannot merge even though checks pass"
**Problem:** "Require branches to be up to date" is enabled, but branch is behind main.

**Solution:**
```bash
git checkout your-branch
git pull origin main --rebase
git push --force-with-lease
```

### "Accidentally locked myself out"
**Problem:** Enabled protection but can't merge anything.

**Solution (temporary):**
1. Go to branch protection settings
2. Uncheck "Include administrators"
3. Merge your PR
4. Re-enable "Include administrators"

**Better solution:** Fix the failing checks instead of bypassing them!

---

## 📊 Status Check Reference

| Check Name | Workflow File | Job Name | Purpose |
|------------|---------------|----------|---------|
| `CI / build` | `.github/workflows/ci.yml` | `build` | Ensures all packages build |
| `CI / typecheck` | `.github/workflows/ci.yml` | `typecheck` | Catches TypeScript errors |
| `CI / lint` | `.github/workflows/ci.yml` | `lint` | Enforces code style |
| `CI / test` | `.github/workflows/ci.yml` | `test` | Runs unit tests |
| `SDK Codegen / codegen` | `.github/workflows/sdk-codegen.yml` | `codegen` | Ensures SDK is in sync |
| `Docs Lint / lint` | `.github/workflows/docs-lint.yml` | `lint` | Validates markdown |

---

## 🎯 Quick Copy-Paste for GitHub CLI

If you prefer to set this up via CLI:

```bash
# Set branch protection on main
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --input - << 'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "CI / build",
      "CI / typecheck",
      "CI / lint",
      "CI / test",
      "SDK Codegen / codegen",
      "Docs Lint / lint"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 1,
    "require_last_push_approval": true
  },
  "required_conversation_resolution": true,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF
```

**Note:** Replace `:owner` and `:repo` with your actual GitHub username and repository name.

---

## ✅ Final Verification

After setting up, verify all protections are working:

```bash
# Run this script to test all protections
./scripts/test-branch-protection.sh
```

Or manually check:
- [ ] Cannot push directly to `main`
- [ ] Cannot merge PR with failing checks
- [ ] Cannot merge PR without approval
- [ ] SDK drift blocks merge
- [ ] Markdown lint issues block merge
- [ ] TypeScript errors block merge

---

## 📚 Related Docs

- **[BRANCH_PROTECTION_REQUIRED_CHECKS.md](./BRANCH_PROTECTION_REQUIRED_CHECKS.md)** — Detailed guide
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** — Contribution workflow
- **[WORKFLOW_SCRIPTS.md](../docs/WORKFLOW_SCRIPTS.md)** — Available scripts

---

**🎉 Your `main` branch is now bulletproof!**

All changes must go through PRs, pass all checks, and get reviewed before merging.

---

*Last Updated: October 24, 2025*


