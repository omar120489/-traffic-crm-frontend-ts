# 🔧 GitHub Infrastructure Guide

**Last Updated:** October 26, 2025  
**Status:** ✅ Production Ready  
**Workflows:** 14 active, 4 archived

---

## 📁 Directory Structure

```
.github/
├── CODEOWNERS                      # Code ownership mapping (1.2KB)
├── dependabot.yml                  # Dependency automation (3.1KB)
├── PRODUCTION_DEPLOYMENT_SETUP.md  # Production setup guide 🆕
├── README.md                       # This file
├── workflows/                      # GitHub Actions workflows
│   ├── ci.yml                      # Main CI pipeline
│   ├── codeql.yml                  # Security scanning
│   ├── deploy-production.yml       # Production deployment 🆕
│   ├── docs-lint.yml               # Markdown linting
│   ├── docs.yml                    # Documentation builds
│   ├── e2e-analytics.yml           # E2E tests
│   ├── no-artifacts.yml            # Artifact cleanup
│   ├── preview-build.yml           # PR preview builds
│   ├── publish-sdk.yml             # SDK publishing
│   ├── release-please.yml          # Automated releases
│   ├── release.yml                 # Release workflow
│   ├── sdk-codegen.yml             # SDK generation
│   ├── security-audit.yml          # Dependency scanning
│   ├── weekly-digest.yml           # Weekly reports
│   └── archive/                    # Historical workflows
└── scripts/
    └── verify-workflow-security.sh
```

---

## 🚀 Active Workflows (14)

### **0. Production Deployment** (`deploy-production.yml`) 🆕
**Triggers:** Manual dispatch, Version tags (`v*.*.*`)  
**Purpose:** Enterprise-grade production deployment with approvals and rollback

**Features:**
- ✅ Manual approval gate (requires `production` environment)
- ✅ Automatic health checks with retries
- ✅ Automatic rollback on failure
- ✅ Single concurrent deployment (no race conditions)
- ✅ Artifact-based deployment (build once, deploy anywhere)

**Jobs:**
1. Build & Test (20 min) - Full CI pipeline
2. Deploy (30 min) - Deploy to production (waits for approval)
3. Health Check (10 min) - Verify deployment success
4. Rollback (20 min) - Auto-rollback if health check fails

**Setup Required:** See [PRODUCTION_DEPLOYMENT_SETUP.md](./PRODUCTION_DEPLOYMENT_SETUP.md)

**Runtime:** ~10-15 minutes (+ approval wait time)

---

### **1. CI Pipeline** (`ci.yml`)
**Triggers:** PR, Push to main/develop  
**Purpose:** Main quality gate

**Jobs:**
- ✅ PR title validation (conventional commits)
- ✅ Type checking (4 workspaces in parallel)
- ✅ Linting (all workspaces)
- ✅ Testing (all workspaces)
- ✅ Security audit

**Status Checks Required:**
- `typecheck-and-build`
- `lint`
- `test`

**Runtime:** ~5-8 minutes

---

### **2. Security Scanning** (`codeql.yml`)
**Triggers:** Push to main, PR, Schedule (weekly)  
**Purpose:** Automated security analysis

**Features:**
- CodeQL analysis for JavaScript/TypeScript
- Vulnerability detection
- Security advisory alerts

**Runtime:** ~10-15 minutes

---

### **3. Dependency Scanning** (`security-audit.yml`)
**Triggers:** Push to main, PR, Schedule (daily)  
**Purpose:** Check for vulnerable dependencies

**Actions:**
- `pnpm audit` with moderate threshold
- Reports vulnerabilities
- Non-blocking (warning only)

**Runtime:** ~2-3 minutes

---

### **4. Automated Releases** (`release-please.yml`)
**Triggers:** Push to main  
**Purpose:** Automated version bumps and changelogs

**Features:**
- Conventional commit parsing
- Automatic CHANGELOG generation
- Version bumping (semver)
- Release PR creation

**Configuration:**
- `release-please-config.json`
- `release-please-manifest.json`

---

### **5. SDK Publishing** (`publish-sdk.yml`)
**Triggers:** Release published, Manual dispatch  
**Purpose:** Publish SDK to npm

**Steps:**
1. Build SDK
2. Run tests
3. Publish to npm (if not exists)

**Runtime:** ~3-5 minutes

---

### **6. E2E Tests** (`e2e-analytics.yml`)
**Triggers:** PR (frontend changes)  
**Purpose:** Run Playwright E2E tests

**Scope:**
- `apps/frontend/**` changes only
- Analytics dashboard tests
- Saved views tests

**Runtime:** ~5-10 minutes

---

### **7. Documentation** (`docs.yml`, `docs-lint.yml`)
**Triggers:** PR (markdown changes)  
**Purpose:** Validate and build documentation

**Checks:**
- Markdown linting (markdownlint)
- Link validation
- Format consistency

**Runtime:** ~1-2 minutes

---

### **8. Preview Builds** (`preview-build.yml`)
**Triggers:** PR to main/develop  
**Purpose:** Build frontend for preview

**Features:**
- Frontend build verification
- Bundle size reporting
- Preview deployment (optional)

**Runtime:** ~3-5 minutes

---

### **9. SDK Code Generation** (`sdk-codegen.yml`)
**Triggers:** Manual dispatch, Schedule (weekly)  
**Purpose:** Generate SDK from OpenAPI spec

**Steps:**
1. Generate OpenAPI spec from NestJS
2. Run openapi-typescript-codegen
3. Build SDK
4. Create PR if changes

**Runtime:** ~3-5 minutes

---

### **10. Weekly Digest** (`weekly-digest.yml`)
**Triggers:** Schedule (Monday 9 AM)  
**Purpose:** Weekly repository health report

**Includes:**
- PR summary
- Issue summary
- Dependency updates
- Test coverage trends

**Runtime:** ~1-2 minutes

---

### **11. Artifact Cleanup** (`no-artifacts.yml`)
**Triggers:** PR (markdown changes)  
**Purpose:** Prevent unnecessary artifact uploads

**Runtime:** <1 minute

---

### **12. Release Workflow** (`release.yml`)
**Triggers:** Release published  
**Purpose:** Production deployment

**Steps:**
1. Type check
2. Build all workspaces
3. Run tests
4. Deploy (if configured)

**Runtime:** ~10-15 minutes

---

## 👥 Code Ownership (CODEOWNERS)

**Purpose:** Automatic PR review assignment

### **Ownership Map:**

```
# Default
*                           @omar120489

# Frontend
/apps/frontend/             @omar120489
/packages/ui-kit/           @omar120489

# Backend
/apps/core-api/             @omar120489
/apps/reporting/            @omar120489
/apps/workers/              @omar120489

# Shared
/packages/sdk-js/           @omar120489
/packages/shared-types/     @omar120489
/packages/rbac/             @omar120489

# Infrastructure
/.github/workflows/         @omar120489
/infra/                     @omar120489

# Database
/apps/core-api/prisma/      @omar120489

# Configuration
*.config.js                 @omar120489
*.config.ts                 @omar120489
tsconfig*.json              @omar120489
package.json                @omar120489

# Documentation
*.md                        @omar120489
```

**How It Works:**
1. PR created
2. GitHub auto-assigns @omar120489 as reviewer
3. Review required before merge (if branch protection enabled)

---

## 🤖 Dependabot (dependabot.yml)

**Purpose:** Automated dependency updates

### **Configuration:**

**6 Workspaces Monitored:**
1. Root (`/`)
2. Frontend (`/apps/frontend`)
3. Core API (`/apps/core-api`)
4. Reporting (`/apps/reporting/traffic-crm-backend-reporting`)
5. Workers (`/apps/workers`)
6. SDK (`/packages/sdk-js`)

**Schedule:**
- GitHub Actions: Monday 9 AM
- Root: Monday 10 AM
- Frontend: Tuesday 10 AM
- Core API: Tuesday 11 AM
- Reporting: Wednesday 10 AM
- Workers: Wednesday 11 AM
- SDK: Thursday 10 AM

**PR Limits:**
- Root/Frontend/Core API: 10 PRs max
- Reporting/Workers/SDK: 5 PRs max

**Features:**
- Automatic PR creation
- Conventional commit messages
- Auto-assign @omar120489
- Labels: `dependencies`, workspace-specific

**How to Handle:**
```bash
# List Dependabot PRs
gh pr list --label dependencies

# Review and merge
gh pr view <PR_NUMBER>
gh pr merge <PR_NUMBER> --squash

# Batch merge (if all green)
gh pr list --label dependencies --json number --jq '.[].number' | xargs -I {} gh pr merge {} --squash
```

---

## 📊 Workflow Status

### **Health Check:**
```bash
# View all workflow runs
gh run list --limit 20

# Check specific workflow
gh run list --workflow=ci.yml --limit 10

# View logs for failed run
gh run view <RUN_ID> --log-failed
```

### **Manual Triggers:**
```bash
# Trigger SDK generation
gh workflow run sdk-codegen.yml

# Trigger release
gh workflow run release.yml

# Trigger security audit
gh workflow run security-audit.yml
```

---

## 🔒 Security Features

### **1. CodeQL Scanning**
- **Language:** JavaScript/TypeScript
- **Frequency:** Weekly + on PR
- **Alerts:** GitHub Security tab

### **2. Dependency Scanning**
- **Tool:** `pnpm audit`
- **Frequency:** Daily + on PR
- **Threshold:** Moderate

### **3. Secret Scanning**
- **Status:** Enabled (GitHub default)
- **Alerts:** Email + GitHub

### **4. Workflow Security**
- Script: `verify-workflow-security.sh`
- Checks for:
  - Pinned action versions
  - Secure secret handling
  - Minimal permissions

---

## 🎯 Best Practices

### **1. Workflow Naming**
- Use kebab-case: `my-workflow.yml`
- Descriptive names
- Group related workflows

### **2. Status Checks**
- Mark critical workflows as required
- Use matrix builds for parallel execution
- Cache dependencies for speed

### **3. Secrets Management**
- Use GitHub Secrets
- Never commit secrets
- Rotate regularly

### **4. Workflow Maintenance**
- Archive unused workflows
- Update action versions quarterly
- Monitor workflow costs

---

## 📈 Metrics & Monitoring

### **Key Metrics:**
- ✅ CI success rate: ~95%
- ✅ Average runtime: 5-8 minutes
- ✅ Dependabot PRs: ~5-10/week
- ✅ Security alerts: 0 critical

### **Monitoring:**
```bash
# Workflow success rate (last 30 days)
gh run list --workflow=ci.yml --created="$(date -v-30d +%Y-%m-%d)" --json conclusion | jq '[.[] | select(.conclusion=="success")] | length'

# Failed runs
gh run list --status=failure --limit 10

# Workflow costs (requires billing access)
gh api /repos/:owner/:repo/actions/workflows/ci.yml/timing
```

---

## 🚀 Quick Reference

### **Common Commands:**
```bash
# List all workflows
gh workflow list

# View workflow file
gh workflow view ci.yml

# Enable/disable workflow
gh workflow enable ci.yml
gh workflow disable ci.yml

# Re-run failed jobs
gh run rerun <RUN_ID> --failed

# Cancel running workflow
gh run cancel <RUN_ID>
```

### **Troubleshooting:**
```bash
# Check workflow syntax
actionlint .github/workflows/*.yml

# View workflow logs
gh run view <RUN_ID> --log

# Debug workflow
# Add to workflow:
# - name: Debug
#   run: env | sort
```

---

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [CODEOWNERS Syntax](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [Dependabot Configuration](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
- [CodeQL Documentation](https://codeql.github.com/docs/)

---

## ✅ Status Summary

**Infrastructure Health:** 🟢 Excellent

- ✅ 14 active workflows (including production deployment)
- ✅ All workflows passing
- ✅ CODEOWNERS configured
- ✅ Dependabot active (6 workspaces)
- ✅ Security scanning enabled
- ✅ Automated releases configured
- ✅ Production deployment with approvals & rollback

**Last Audit:** October 26, 2025  
**Next Review:** November 26, 2025

---

**Maintained by:** @omar120489  
**Questions?** Open an issue or check the main [README](../README.md)

