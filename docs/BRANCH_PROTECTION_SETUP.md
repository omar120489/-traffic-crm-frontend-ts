# Branch Protection Setup Guide

This guide walks you through setting up branch protection rules on GitHub to enforce code quality and review processes.

## 📋 Quick Start

**Time Required:** ~5 minutes  
**Prerequisites:** Admin access to the GitHub repository

---

## 🔒 Recommended Protection Rules for `main`

### Step 1: Navigate to Settings

1. Go to your repository: https://github.com/omar120489/-traffic-crm-frontend-ts
2. Click **Settings** (top right)
3. In the left sidebar, click **Branches** (under "Code and automation")
4. Click **Add branch protection rule**

### Step 2: Configure Rule

#### Basic Settings

**Branch name pattern:**
```
main
```

#### Protection Rules (Check these boxes):

##### ✅ Require a pull request before merging
- [x] **Require pull request before merging**
  - [x] Require approvals: **1** (minimum)
  - [x] Dismiss stale pull request approvals when new commits are pushed
  - [x] Require review from Code Owners
  - [ ] Restrict who can dismiss pull request reviews (optional)
  - [ ] Allow specified actors to bypass required pull requests (optional)
  - [x] Require approval of the most recent reviewable push

##### ✅ Require status checks to pass before merging
- [x] **Require status checks to pass before merging**
  - [x] Require branches to be up to date before merging
  - **Add required status checks:**
    - `typecheck-and-build`
    - `lint`
    - `test`
    - `security-audit`
    - `ci-complete`
    - `pr-title-check` (validates conventional commits)

##### ✅ Require conversation resolution before merging
- [x] **Require conversation resolution before merging**

##### ✅ Require signed commits (Optional but recommended)
- [x] **Require signed commits**

##### ✅ Require linear history
- [x] **Require linear history**
  - Prevents merge commits
  - Enforces rebase or squash merging

##### ⚠️ Do not allow bypassing the above settings
- [x] **Do not allow bypassing the above settings**
  - Even admins must follow the rules
  - Optional: Uncheck if you need emergency access

##### ✅ Restrict pushes
- [ ] **Restrict pushes** (optional)
  - If checked, only specified users/teams can push
  - Leave unchecked for flexibility

##### ✅ Allow force pushes
- [ ] **Allow force pushes** (leave unchecked)
  - Prevents force pushes to main

##### ✅ Allow deletions
- [ ] **Allow deletions** (leave unchecked)
  - Prevents accidental branch deletion

### Step 3: Save

Click **Create** at the bottom.

---

## 🔧 Additional Branch Rules (Optional)

### Protect `develop` branch

Repeat the process with slightly relaxed rules:

- Branch name pattern: `develop`
- Require 1 approval
- Require status checks: `typecheck-and-build`, `lint`, `test`
- Allow force pushes: No
- Require linear history: Yes

### Protect release branches

- Branch name pattern: `release/*`
- Require 2 approvals
- All status checks required
- No force pushes allowed

---

## ✅ Verification

After setting up, test the protection:

### Test 1: Direct push to main (should fail)
```bash
git checkout main
echo "test" >> README.md
git add README.md
git commit -m "test: direct push"
git push origin main
# Expected: ❌ remote: error: GH006: Protected branch update failed
```

### Test 2: Create a PR (should work)
```bash
git checkout -b test/branch-protection
echo "test" >> README.md
git add README.md
git commit -m "test: verify branch protection"
git push origin test/branch-protection
# Then create a PR on GitHub
```

### Test 3: PR without approvals (should block merge)
- Try to merge the PR
- Expected: Merge button is disabled until approval

### Test 4: PR without status checks (should block merge)
- Create a PR that breaks build
- Expected: Cannot merge until CI passes

---

## 🎯 Status Checks Reference

These are the CI jobs defined in `.github/workflows/ci.yml`:

| Status Check | Purpose | Required |
|-------------|---------|----------|
| `pr-title-check` | Validates PR title follows conventional commits | ✅ Yes |
| `typecheck-and-build` | Type checking + build for all workspaces | ✅ Yes |
| `lint` | ESLint + Prettier checks | ✅ Yes |
| `test` | Unit + integration tests | ✅ Yes |
| `security-audit` | Dependency vulnerability scan | ✅ Yes |
| `ci-complete` | All checks passed indicator | ✅ Yes |

---

## 📝 CODEOWNERS Integration

With branch protection enabled, `.github/CODEOWNERS` file will automatically:

- Request reviews from specified owners
- Block merges without owner approval
- Ensure domain experts review changes

**Example:**
```
/apps/frontend/    @omar120489
/apps/core-api/    @omar120489
```

---

## 🚫 Handling Emergencies

If you need to bypass protection for urgent fixes:

### Option 1: Temporarily disable protection
1. Go to Settings → Branches
2. Edit the protection rule
3. Uncheck "Do not allow bypassing"
4. Make your change
5. Re-enable "Do not allow bypassing"

### Option 2: Use exception for admins
1. Edit protection rule
2. Check "Allow specified actors to bypass"
3. Add yourself
4. Bypass when needed (use sparingly!)

### Option 3: Emergency branch
```bash
git checkout -b emergency/critical-fix
# Make fix
git push origin emergency/critical-fix
# Create PR with fast-track approval
```

---

## 🔄 Maintenance

### Regular Review Schedule

**Monthly:**
- Review status check requirements
- Verify CODEOWNERS are up to date
- Check if any rules are too strict/loose

**Quarterly:**
- Audit bypass usage (if enabled)
- Review protection rule effectiveness
- Adjust based on team feedback

---

## 🎓 Best Practices

### DO:
✅ Require at least 1 approval  
✅ Require all status checks to pass  
✅ Require linear history  
✅ Dismiss stale reviews on new commits  
✅ Require conversation resolution  
✅ Use CODEOWNERS for automatic review requests  

### DON'T:
❌ Allow force pushes to main  
❌ Allow direct commits to main  
❌ Skip status checks  
❌ Delete the main branch  
❌ Bypass protection rules without documentation  

---

## 🆘 Troubleshooting

### Status check not appearing
- **Cause:** CI job name mismatch
- **Fix:** Check `.github/workflows/ci.yml` job names match exactly

### Cannot merge PR despite passing checks
- **Cause:** Branch not up to date
- **Fix:** `git fetch && git rebase origin/main`

### CODEOWNERS not requesting reviews
- **Cause:** File path pattern incorrect or file not committed
- **Fix:** Verify `.github/CODEOWNERS` is committed and paths are correct

### Need to merge without approval (emergency)
- **Cause:** Only admin available, no one to review
- **Fix:** Temporarily allow bypass or use admin override (document why)

---

## 📊 Effectiveness Metrics

Track these to measure protection effectiveness:

- **Blocked PRs:** How many PRs were blocked by checks?
- **Review Time:** Average time from PR creation to approval
- **Failed Checks:** Most common failing checks
- **Bypass Frequency:** How often are rules bypassed?

**Review quarterly and adjust rules based on data.**

---

## 🔗 Related Documentation

- [Contributing Guide](../CONTRIBUTING.md) - Contribution workflow
- [Pull Request Template](../.github/pull_request_template.md) - PR checklist
- [CI Workflow](../.github/workflows/ci.yml) - CI job definitions
- [CODEOWNERS](../.github/CODEOWNERS) - Code ownership

---

## ✅ Checklist

Before marking this complete:

- [ ] Branch protection rule created for `main`
- [ ] All 6 status checks configured as required
- [ ] Require 1 approval enabled
- [ ] Dismiss stale reviews enabled
- [ ] Require linear history enabled
- [ ] Conversation resolution required
- [ ] Force pushes blocked
- [ ] Deletions blocked
- [ ] Tested protection with a PR
- [ ] Verified CODEOWNERS integration
- [ ] Documented any custom rules
- [ ] Team notified of new protection rules

---

**🔒 Your main branch is now protected!**

New workflow:
1. Create feature branch
2. Make changes
3. Push and create PR
4. Wait for CI to pass
5. Request review (or auto-requested via CODEOWNERS)
6. Merge only after approval + passing checks

**No more direct pushes to main!** 🎉

