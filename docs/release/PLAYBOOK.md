# Release Playbook

Complete guide for managing releases, hotfixes, backports, and rollbacks in Traffic CRM.

## 📋 Table of Contents

- [Overview](#overview)
- [Release Types](#release-types)
- [Standard Release](#standard-release)
- [Hotfix Release](#hotfix-release)
- [Backport Release](#backport-release)
- [Pre-Release (Beta/RC)](#pre-release-betarc)
- [Emergency Rollback](#emergency-rollback)
- [Version Strategy](#version-strategy)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

We use **release-please** for automated releases based on Conventional Commits. This playbook covers both automated and manual release scenarios.

### Key Principles

- **Conventional Commits** drive releases automatically
- **Semantic Versioning** (SemVer) for all packages
- **Monorepo strategy** with independent package versions
- **Git tags** mark releases
- **GitHub Releases** provide changelogs

---

## 📦 Release Types

| Type | When | Example | Branch |
|------|------|---------|--------|
| **Standard** | Regular feature/fix releases | `v0.2.0` | `main` |
| **Hotfix** | Critical production bugs | `v0.1.1` | `hotfix/critical-bug` |
| **Backport** | Fix for older version | `v0.1.2` | `backport/v0.1` |
| **Pre-release** | Beta/RC testing | `v0.2.0-beta.1` | `beta` or `rc` |
| **Emergency** | Immediate rollback | `v0.1.0` (revert) | `main` |

---

## 🚀 Standard Release

### Automated Flow (Recommended)

**Prerequisites:**

- Conventional commits on `main`
- CI passing
- No breaking changes (or documented)

**Steps:**

```bash
# 1. Merge feature PRs to main (with conventional commits)
# Examples:
# - feat(frontend): add dark mode toggle
# - fix(api): handle null values in pagination
# - perf(workers): optimize job processing

# 2. release-please automatically opens a release PR
# Wait for it to appear (usually within minutes)

# 3. Review the release PR
# - Check CHANGELOG updates
# - Verify version bumps
# - Review included commits

# 4. Merge the release PR
# This triggers:
# - Git tags creation (e.g., v0.2.0, apps/frontend-v0.2.0)
# - GitHub Release with notes
# - Package version updates

# 5. Verify release
gh release list
git tag --list | tail -5
```

### Manual Release (If Needed)

```bash
# 1. Create release branch
git checkout main
git pull origin main
git checkout -b release/v0.2.0

# 2. Update versions manually
# Edit package.json files in:
# - Root
# - apps/frontend
# - apps/core-api
# - packages/sdk-js
# - packages/shared-types

# 3. Update CHANGELOGs
# Add entries for all changes since last release

# 4. Commit and tag
git add .
git commit -m "chore: release v0.2.0"
git tag -a v0.2.0 -m "Release v0.2.0"

# 5. Push
git push origin release/v0.2.0
git push origin v0.2.0

# 6. Create GitHub Release
gh release create v0.2.0 \
  --title "v0.2.0" \
  --notes-file CHANGELOG.md \
  --latest

# 7. Merge back to main
git checkout main
git merge release/v0.2.0
git push origin main
```

---

## 🔥 Hotfix Release

For critical bugs in production that can't wait for the next regular release.

### Process

```bash
# 1. Create hotfix branch from latest release tag
git checkout v0.1.0
git checkout -b hotfix/critical-security-fix

# 2. Make the fix
# ... edit code ...

# 3. Commit with conventional format
git add .
git commit -m "fix(api): patch critical security vulnerability

SECURITY: Fixes CVE-2024-XXXXX
Closes #123"

# 4. Test thoroughly
pnpm -r typecheck
pnpm -r test
pnpm -r build

# 5. Update version (patch bump)
# Edit package.json: 0.1.0 → 0.1.1

# 6. Update CHANGELOG
# Add hotfix entry at top

# 7. Commit version bump
git add .
git commit -m "chore: release v0.1.1 (hotfix)"

# 8. Tag
git tag -a v0.1.1 -m "Hotfix: Critical security patch"

# 9. Push
git push origin hotfix/critical-security-fix
git push origin v0.1.1

# 10. Create GitHub Release
gh release create v0.1.1 \
  --title "v0.1.1 (Hotfix)" \
  --notes "**Security Fix**

- Patches critical vulnerability CVE-2024-XXXXX
- Closes #123

**Upgrade Priority:** HIGH" \
  --latest

# 11. Merge to main
git checkout main
git merge hotfix/critical-security-fix
git push origin main

# 12. Delete hotfix branch
git branch -d hotfix/critical-security-fix
git push origin --delete hotfix/critical-security-fix
```

### Hotfix Checklist

- [ ] Fix tested in isolation
- [ ] Security team notified (if security issue)
- [ ] Changelog updated
- [ ] Version bumped (patch)
- [ ] Tagged and released
- [ ] Merged back to main
- [ ] Production deployed
- [ ] Verified in production
- [ ] Stakeholders notified

---

## 🔄 Backport Release

For applying fixes to older supported versions.

### When to Backport

- Security vulnerabilities
- Critical bugs affecting LTS versions
- Customer-specific fixes for older versions

### Process

```bash
# 1. Identify the fix commit
git log --oneline | grep "fix:"
# Example: abc1234 fix(api): handle edge case

# 2. Create backport branch from old version
git checkout v0.1.0
git checkout -b backport/v0.1-edge-case-fix

# 3. Cherry-pick the fix
git cherry-pick abc1234

# If conflicts, resolve them:
git status
# ... fix conflicts ...
git add .
git cherry-pick --continue

# 4. Test on old version
pnpm -r typecheck
pnpm -r test

# 5. Update version (patch bump)
# 0.1.0 → 0.1.2 (assuming 0.1.1 was a hotfix)

# 6. Update CHANGELOG
# Add backport entry

# 7. Commit and tag
git add .
git commit -m "chore: backport v0.1.2"
git tag -a v0.1.2 -m "Backport: Edge case fix"

# 8. Push
git push origin backport/v0.1-edge-case-fix
git push origin v0.1.2

# 9. Create GitHub Release
gh release create v0.1.2 \
  --title "v0.1.2 (Backport)" \
  --notes "Backported fix from main:
- Handle edge case in API (#123)

Compatible with v0.1.x deployments."

# 10. Clean up
git checkout main
git branch -d backport/v0.1-edge-case-fix
```

---

## 🧪 Pre-Release (Beta/RC)

For testing new features before stable release.

### Beta Release

```bash
# 1. Create beta branch
git checkout main
git pull origin main
git checkout -b beta

# 2. Update versions to beta
# 0.2.0 → 0.2.0-beta.1

# 3. Commit and tag
git add .
git commit -m "chore: release v0.2.0-beta.1"
git tag -a v0.2.0-beta.1 -m "Beta release v0.2.0-beta.1"

# 4. Push
git push origin beta
git push origin v0.2.0-beta.1

# 5. Create pre-release on GitHub
gh release create v0.2.0-beta.1 \
  --title "v0.2.0-beta.1" \
  --notes "Beta release for testing.

**New Features:**
- Feature A
- Feature B

**Known Issues:**
- Issue X (tracking in #123)

**Not for production use.**" \
  --prerelease

# 6. Iterate (beta.2, beta.3, etc.)
# ... make fixes ...
git commit -m "fix: beta feedback"
# Update to 0.2.0-beta.2
git tag -a v0.2.0-beta.2 -m "Beta 2"
git push origin beta v0.2.0-beta.2
```

### Release Candidate (RC)

```bash
# When beta is stable, promote to RC
git checkout -b rc

# Update versions: 0.2.0-beta.3 → 0.2.0-rc.1
git commit -m "chore: release v0.2.0-rc.1"
git tag -a v0.2.0-rc.1 -m "Release candidate v0.2.0-rc.1"
git push origin rc v0.2.0-rc.1

gh release create v0.2.0-rc.1 \
  --title "v0.2.0-rc.1" \
  --notes "Release candidate for v0.2.0.

**Ready for production testing.**

If no critical issues found, will be promoted to stable." \
  --prerelease
```

### Promote to Stable

```bash
# After RC testing passes
git checkout main
git merge rc
# Update versions: 0.2.0-rc.1 → 0.2.0
git commit -m "chore: release v0.2.0"
git tag -a v0.2.0 -m "Release v0.2.0"
git push origin main v0.2.0

gh release create v0.2.0 \
  --title "v0.2.0" \
  --notes-file CHANGELOG.md \
  --latest
```

---

## ⚡ Emergency Rollback

For immediate production issues requiring rollback.

### Quick Rollback (Revert Deployment)

```bash
# 1. Identify last good version
gh release list
# Example: v0.1.5 was good, v0.1.6 is broken

# 2. Revert deployment to v0.1.5
# (Deployment-specific - examples below)

# Kubernetes:
kubectl set image deployment/frontend frontend=ghcr.io/org/frontend:v0.1.5

# Docker:
docker pull ghcr.io/org/frontend:v0.1.5
docker-compose up -d

# Vercel/Netlify:
# Use UI to rollback to previous deployment

# 3. Verify rollback
curl https://api.example.com/version
# Should return v0.1.5

# 4. Communicate
# Notify team, update status page
```

### Code Rollback (Revert Commit)

```bash
# 1. Identify bad commit
git log --oneline
# Example: abc1234 feat(api): new feature (BROKEN)

# 2. Create revert
git revert abc1234

# 3. Update version (patch bump)
# 0.1.6 → 0.1.7 (revert release)

# 4. Commit and push
git add .
git commit -m "chore: release v0.1.7 (revert v0.1.6)"
git tag -a v0.1.7 -m "Revert: Rollback broken feature"
git push origin main v0.1.7

# 5. Create GitHub Release
gh release create v0.1.7 \
  --title "v0.1.7 (Rollback)" \
  --notes "**Emergency Rollback**

Reverts changes from v0.1.6 due to critical issue.

- Reverted: Feature X (caused production errors)
- Tracking issue: #123

**Upgrade Priority:** CRITICAL" \
  --latest

# 6. Deploy immediately
# ... deployment commands ...
```

### Full Rollback Checklist

- [ ] Identify issue and last good version
- [ ] Rollback deployment
- [ ] Verify rollback successful
- [ ] Update status page
- [ ] Notify stakeholders
- [ ] Create incident report
- [ ] Plan fix for next release
- [ ] Post-mortem scheduled

---

## 📊 Version Strategy

### Semantic Versioning

```
MAJOR.MINOR.PATCH[-PRERELEASE]

Examples:
- 0.1.0 → 0.1.1 (patch: bug fix)
- 0.1.1 → 0.2.0 (minor: new feature)
- 0.2.0 → 1.0.0 (major: breaking change)
- 1.0.0 → 1.0.1-beta.1 (pre-release)
```

### Commit Type → Version Bump

| Commit Type | Version Bump | Example |
|-------------|--------------|---------|
| `fix:` | PATCH | 0.1.0 → 0.1.1 |
| `feat:` | MINOR | 0.1.0 → 0.2.0 |
| `feat!:` or `BREAKING CHANGE:` | MAJOR | 0.2.0 → 1.0.0 |
| `chore:`, `docs:`, etc. | None | No release |

### Monorepo Versioning

Each package can have independent versions:

```json
{
  ".": "0.2.0",                    // Root
  "apps/frontend": "0.3.1",        // Frontend can be ahead
  "apps/core-api": "0.2.5",        // API different version
  "packages/sdk-js": "1.0.0",      // SDK stable
  "packages/shared-types": "0.2.0" // Types match root
}
```

---

## 🐛 Troubleshooting

### Release PR Not Created

**Problem:** Merged feat/fix but no release PR appeared.

**Solutions:**

```bash
# 1. Check if release-please workflow ran
gh run list --workflow=release-please.yml

# 2. Manually trigger workflow
gh workflow run release-please.yml

# 3. Check for conventional commits
git log --oneline | head -10
# Must have feat:, fix:, etc.

# 4. Check bootstrap-sha in config
cat release-please-config.json
# If set, release-please only looks after that commit
```

### Wrong Version Bumped

**Problem:** Expected minor bump, got patch.

**Solutions:**

```bash
# 1. Check commit types
git log --oneline v0.1.0..HEAD
# Ensure feat: commits exist (not just fix:)

# 2. Manually edit release PR
# Update version numbers in PR before merging

# 3. For next release, use correct commit types
git commit -m "feat: ..." # for minor bump
git commit -m "feat!: ..." # for major bump
```

### Multiple Releases Needed

**Problem:** Need to release only frontend, not everything.

**Solution:**

```bash
# Use path-based releases
# Edit release-please-config.json:
{
  "apps/frontend": {
    "release-type": "node",
    "package-name": "@apps/frontend"
  }
}

# Or manually tag specific package:
git tag apps/frontend-v0.3.0
git push origin apps/frontend-v0.3.0
```

### Failed Release Deployment

**Problem:** Release created but deployment failed.

**Solution:**

```bash
# 1. Check deployment logs
gh run list --workflow=deploy.yml

# 2. Re-run deployment
gh run rerun <run-id>

# 3. Or deploy manually
pnpm build
# ... manual deployment steps ...

# 4. Verify deployment
curl https://api.example.com/version
```

---

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [release-please Documentation](https://github.com/googleapis/release-please)
- [GitHub Releases Guide](https://docs.github.com/en/repositories/releasing-projects-on-github)

---

## 🎯 Quick Reference

```bash
# Standard release (automated)
# 1. Merge feat/fix PRs → 2. Wait for release PR → 3. Merge release PR

# Hotfix
git checkout v0.1.0 -b hotfix/name
# ... fix ... commit ... tag v0.1.1 ... push

# Backport
git checkout v0.1.0 -b backport/name
git cherry-pick <commit>
# ... tag v0.1.2 ... push

# Beta
git checkout -b beta
# ... update to v0.2.0-beta.1 ... tag ... push

# Rollback
git revert <commit>
# ... or ... redeploy old version

# Manual trigger
gh workflow run release-please.yml
```

---

**Questions?** Open a discussion or check [CONTRIBUTING.md](../CONTRIBUTING.md)
