# Branch Protection Setup Guide

This guide walks you through setting up branch protection rules for `main` to enforce quality gates.

## 🎯 Goal

Ensure all code merged to `main`:

- ✅ Passes Sprint 2 TypeScript checks
- ✅ Has at least 1 approved review
- ✅ Cannot be force-pushed
- ✅ Uses clean commit history (squash merges)

## 📋 Setup Steps

### 1. Navigate to Branch Protection Settings

1. Go to your GitHub repository
2. Click **Settings** → **Branches**
3. Under "Branch protection rules", click **Add rule**
4. In "Branch name pattern", enter: `main`

### 2. Configure Protection Rules

#### **A. Require Pull Request Reviews**

- ☑️ **Require a pull request before merging**
  - ☑️ **Require approvals**: `1`
  - ☑️ **Dismiss stale pull request approvals when new commits are pushed**
  - ☑️ **Require review from Code Owners** (uses `.github/CODEOWNERS`)

#### **B. Require Status Checks**

- ☑️ **Require status checks to pass before merging**
  - ☑️ **Require branches to be up to date before merging** ⚠️ **IMPORTANT**
    - This prevents green-but-stale PRs from merging after `main` moves
    - Forces a rebase/merge from `main` before final merge
  - **Search for and add these checks:**
    - ✅ `typecheck` (from `sprint2-typecheck` workflow)
    - ✅ `lint` (if you have a lint CI job)
    - ✅ `test` (if you have a test CI job)

#### **C. Additional Protections**

- ☑️ **Require conversation resolution before merging**
- ☑️ **Do not allow bypassing the above settings** (even for admins)
- ☑️ **Restrict who can push to matching branches** (optional, for team environments)

#### **D. Force Push & Deletion**

- ☑️ **Do not allow force pushes**
- ☑️ **Do not allow deletions**

#### **E. Merge Strategy** (Optional but Recommended)

- Go to **Settings** → **General** → **Pull Requests**
- ☑️ **Allow squash merging** (keeps history clean)
- ☐ **Allow merge commits** (optional)
- ☐ **Allow rebase merging** (optional)
- ☑️ **Automatically delete head branches** (cleans up after merge)

### 3. Save Changes

Click **Create** or **Save changes** at the bottom.

## 🎯 What This Enforces

### Before Merge

```
┌─────────────────────────────────────┐
│  Developer pushes to feature branch │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  CI runs sprint2-typecheck workflow │
│  ✅ TypeScript check must pass      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  CODEOWNERS auto-requests review    │
│  ✅ 1+ approval required             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  All checks green + approved?       │
│  ✅ Merge button enabled             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Squash & merge to main             │
│  ✅ Clean commit history             │
└─────────────────────────────────────┘
```

### Blocked Scenarios

- ❌ **Force push to `main`** → Rejected
- ❌ **Direct commit to `main`** → Must use PR
- ❌ **Merge without approval** → Blocked
- ❌ **Merge with failing checks** → Blocked
- ❌ **Merge with unresolved conversations** → Blocked

## 🧪 Test Your Setup

### 1. Create a Test PR

```bash
git checkout -b test/branch-protection
echo "// test" >> apps/frontend/src/lib/api.ts
git add apps/frontend/src/lib/api.ts
git commit -m "test(ci): verify branch protection"
git push origin test/branch-protection
```

### 2. Open PR on GitHub

- Go to your repo → **Pull requests** → **New pull request**
- Base: `main`, Compare: `test/branch-protection`
- Click **Create pull request**

### 3. Verify Checks Run

You should see:

- ⏳ `typecheck` check running
- ⏳ Review required (from CODEOWNERS)

### 4. Try to Merge (Should Be Blocked)

- **Before checks pass:** Merge button disabled
- **Before approval:** Merge button disabled
- **After checks pass + approval:** Merge button enabled ✅

### 5. Clean Up

```bash
git checkout main
git branch -D test/branch-protection
git push origin --delete test/branch-protection
```

## 🚨 Emergency Override

If you absolutely must bypass protection (production emergency):

1. **Temporarily disable branch protection:**
   - Settings → Branches → Edit rule → Uncheck "Do not allow bypassing"
   - Make your emergency fix
   - **Re-enable immediately after**

2. **Or use `--no-verify` for local hooks only:**

   ```bash
   git push --no-verify  # Bypasses pre-push hook, NOT CI
   ```

   ⚠️ **CI will still block the merge if checks fail**

## 📊 Monitoring

### Check Protection Status

```bash
# Via GitHub CLI
gh api repos/:owner/:repo/branches/main/protection

# Via web
# Settings → Branches → View rule for 'main'
```

### View Failed Checks

- Go to PR → **Checks** tab
- Click on failed check for details
- Fix locally, push again

## 🎯 Success Criteria

Your branch protection is working when:

- ✅ You cannot push directly to `main`
- ✅ PRs show "Review required" badge
- ✅ PRs show "Checks must pass" badge
- ✅ Merge button is disabled until all conditions met
- ✅ CI runs automatically on every PR push

## 📚 Related Documentation

- [CODEOWNERS](./.github/CODEOWNERS) - Who reviews what
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution workflow
- [typecheck-sprint2.yml](./.github/workflows/typecheck-sprint2.yml) - CI workflow

---

**Last Updated:** October 24, 2025  
**Status:** ✅ Production-ready
