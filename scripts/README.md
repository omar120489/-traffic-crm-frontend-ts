# Scripts Documentation

This directory contains utility scripts for development, deployment, and maintenance.

## 📋 Active Scripts

### Development & Workflow

#### `premerge.sh`
Pre-merge validation checks before creating a PR.

**Usage:**
```bash
./scripts/premerge.sh
```

**What it does:**
- Runs linter
- Runs type checking
- Runs tests
- Checks for uncommitted changes

---

#### `quick-start.sh`
Quick start guide for new developers.

**Usage:**
```bash
./scripts/quick-start.sh
```

**What it does:**
- Installs dependencies
- Sets up environment
- Starts development servers

---

### Deployment

#### `quick-start-deploy.sh`
Quick deployment script for staging/production.

**Usage:**
```bash
./scripts/quick-start-deploy.sh [environment]
```

**Arguments:**
- `environment` - Target environment (dev|staging|production)

**Example:**
```bash
./scripts/quick-start-deploy.sh production
```

---

#### `verify-deployment-ready.sh`
Verifies that the application is ready for deployment.

**Usage:**
```bash
./scripts/verify-deployment-ready.sh
```

**Checks:**
- All tests passing
- No linter errors
- No type errors
- Environment variables configured
- Build succeeds

---

### Compliance & Security

#### `generate-compliance-html.sh`
Generates HTML compliance report.

**Usage:**
```bash
./scripts/generate-compliance-html.sh
```

**Output:** `Traffic_CRM_Security_Compliance_Bundle_[date].html`

---

#### `generate-compliance-pdf.sh`
Generates PDF compliance report.

**Usage:**
```bash
./scripts/generate-compliance-pdf.sh
```

**Output:** `Traffic_CRM_Security_Compliance_Bundle_[date].pdf`

---

### GitHub Integration

#### `sync_github.sh`
Syncs local repository with GitHub.

**Usage:**
```bash
./scripts/sync_github.sh
```

**What it does:**
- Fetches latest changes
- Rebases current branch
- Pushes changes

---

#### `sync_github_traffic_crm.sh`
Syncs Traffic CRM specific changes with GitHub.

**Usage:**
```bash
./scripts/sync_github_traffic_crm.sh
```

---

### Utilities

#### `cleanup-history.sh`
Cleans up git history (use with caution).

**Usage:**
```bash
./scripts/cleanup-history.sh
```

**⚠️ Warning:** This modifies git history. Only use if you know what you're doing.

---

#### `install_logo.sh`
Installs logo assets into the project.

**Usage:**
```bash
./scripts/install_logo.sh [logo-path]
```

**Arguments:**
- `logo-path` - Path to logo file

---

## 📦 Archived Scripts

Historical and sprint-specific scripts have been moved to `scripts/archive/` for reference.

### Archive Contents

- `launch_sprint4.sh` - Sprint 4 launch script (historical)
- `monorepo_move.sh` - Monorepo migration script (historical)
- `push-all-branches.sh` - Bulk branch push (historical)
- `create-sprint2-issues.sh` - Sprint 2 issue creation (historical)
- `sprint2-greenlight.sh` - Sprint 2 greenlight checks (historical)
- `verify-sprint1.sh` - Sprint 1 verification (historical)
- `verify-sprint1-full.sh` - Sprint 1 full verification (historical)
- `verify-sprint2.sh` - Sprint 2 verification (historical)

**Note:** Archived scripts are kept for historical reference but are no longer actively maintained.

---

## 🚀 Quick Reference

### Common Tasks

**Start development:**
```bash
./scripts/quick-start.sh
```

**Before creating PR:**
```bash
./scripts/premerge.sh
```

**Deploy to production:**
```bash
./scripts/quick-start-deploy.sh production
```

**Generate compliance report:**
```bash
./scripts/generate-compliance-html.sh
```

**Sync with GitHub:**
```bash
./scripts/sync_github.sh
```

---

## 📝 Script Conventions

All scripts in this directory follow these conventions:

1. **Shebang:** `#!/usr/bin/env bash`
2. **Header comment:** Description and usage
3. **Error handling:** `set -e` for strict error handling
4. **Exit codes:**
   - `0` - Success
   - `1` - General error
   - `2` - Invalid arguments

---

## 🔧 Adding New Scripts

When adding a new script:

1. Place it in the appropriate category directory
2. Make it executable: `chmod +x script-name.sh`
3. Add header documentation
4. Update this README
5. Test thoroughly before committing

**Template:**
```bash
#!/usr/bin/env bash
# script-name.sh
# Description: What this script does
# Usage: ./script-name.sh [options]
# Example: ./script-name.sh --env production

set -e

# Your code here
```

---

## 📚 Related Documentation

- [Contributing Guide](../CONTRIBUTING.md)
- [Deployment Guide](../docs/deployment/)
- [Security Guidelines](../SECURITY.md)

---

**Last Updated:** October 26, 2025

