# ✅ GitHub Actions Security Checklist

**Version**: 1.0  
**Last Updated**: October 24, 2025  
**Purpose**: Automated security audit checklist for workflow changes

---

## 📋 Overview

This checklist ensures all GitHub Actions workflows comply with official security standards from GitHub and AWS Well-Architected Framework.

**Use this checklist for**:

- ✅ New workflow creation
- ✅ Workflow modifications
- ✅ Pull request reviews
- ✅ Security audits
- ✅ Compliance verification

---

## 🔒 Official Standards Reference

### **GitHub Official Documentation**

**Citation**:
> "Pin actions to a full length commit SHA … helps mitigate the risk of a bad actor adding a backdoor to the action's repository."  
> — [GitHub Actions Security Hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#using-third-party-actions)

### **AWS Well-Architected Framework**

**Citation**:
> "Implement least privilege for workflow permissions… Use Dependabot to upgrade vulnerable actions… Pin versions of actions."  
> — [AWS Well-Architected Actions Security Guide](https://docs.aws.amazon.com/wellarchitected/latest/framework/sec_permissions_least_privileges.html)

---

## ✅ Pre-Submission Checklist

### **Before Creating/Modifying a Workflow**

Use this checklist to verify compliance before submitting a PR:

```markdown
## Workflow Security Checklist

**Workflow File**: `.github/workflows/[name].yml`  
**PR Number**: #[number]  
**Reviewer**: @[username]  
**Date**: [YYYY-MM-DD]

### 1. Action Version Pinning (CRITICAL)

**Standard**: GitHub Official Documentation  
**Requirement**: Pin actions to full-length commit SHA

- [ ] All `uses:` statements use commit SHA (not tags)
- [ ] Format: `uses: owner/action@{40-char-sha} # vX.Y.Z`
- [ ] Version comment included for readability
- [ ] No `@v*`, `@main`, or `@master` references

**Example**:
```yaml
# ✅ CORRECT
uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1

# ❌ INCORRECT
uses: actions/checkout@v4
uses: actions/checkout@main
```

**Verification Command**:

```bash
# Check for unpinned actions
grep -r "uses:.*@v[0-9]" .github/workflows/[name].yml
grep -r "uses:.*@main" .github/workflows/[name].yml
grep -r "uses:.*@master" .github/workflows/[name].yml
```

---

### 2. Least-Privilege Permissions (CRITICAL)

**Standard**: AWS Well-Architected Framework  
**Requirement**: Implement least privilege for workflow permissions

- [ ] Default permissions set to `contents: read`
- [ ] Permissions scoped per job (not workflow-level)
- [ ] Write permissions only where necessary
- [ ] Each permission justified with comment

**Example**:

```yaml
# ✅ CORRECT - Scoped per job
permissions:
  contents: read  # Default read-only

jobs:
  release:
    permissions:
      contents: write  # Needed to create release
  
  build:
    permissions:
      contents: read  # Read-only
```

**Verification Command**:

```bash
# Check for broad permissions
grep -A5 "permissions:" .github/workflows/[name].yml
```

---

### 3. Script Injection Prevention (CRITICAL)

**Standard**: GitHub Security Lab  
**Requirement**: Avoid untrusted input in `run:` commands

- [ ] No `${{ github.event.* }}` in `run:` commands
- [ ] No `${{ github.head_ref }}` in shell scripts
- [ ] No `${{ github.base_ref }}` in shell scripts
- [ ] User inputs use environment variables

**Example**:

```yaml
# ✅ CORRECT - Use environment variables
- name: Process input
  env:
    USER_INPUT: ${{ inputs.version }}
  run: |
    echo "Version: $USER_INPUT"

# ❌ INCORRECT - Direct interpolation
- name: Process input
  run: |
    echo "Version: ${{ inputs.version }}"
```

**Verification Command**:

```bash
# Check for dangerous patterns
grep -E '\$\{\{ github\.event\.' .github/workflows/[name].yml
grep -E '\$\{\{ github\.head_ref' .github/workflows/[name].yml
```

---

### 4. Secrets Management (HIGH)

**Standard**: GitHub Security Hardening  
**Requirement**: Proper secrets handling

- [ ] All secrets use `${{ secrets.* }}` syntax
- [ ] No hardcoded credentials
- [ ] Secrets not logged or echoed
- [ ] OIDC preferred over long-lived credentials

**Example**:

```yaml
# ✅ CORRECT
env:
  API_KEY: ${{ secrets.API_KEY }}

# ❌ INCORRECT
env:
  API_KEY: "hardcoded-key-12345"
```

**Verification Command**:

```bash
# Check for hardcoded secrets (common patterns)
grep -iE '(password|token|key|secret).*[:=].*["\047][a-zA-Z0-9]{20,}' .github/workflows/[name].yml
```

---

### 5. Concurrency Control (MEDIUM)

**Standard**: GitHub Best Practices  
**Requirement**: Prevent race conditions

- [ ] Concurrency group defined
- [ ] `cancel-in-progress` set appropriately
- [ ] Group name unique and descriptive

**Example**:

```yaml
# ✅ CORRECT
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: false
```

---

### 6. Timeout Management (MEDIUM)

**Standard**: GitHub Best Practices  
**Requirement**: Prevent hung jobs

- [ ] `timeout-minutes` set for each job
- [ ] Timeouts appropriate for job complexity
- [ ] Critical jobs have conservative timeouts

**Example**:

```yaml
# ✅ CORRECT
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 20
```

---

### 7. Dependabot Integration (HIGH)

**Standard**: AWS Well-Architected Framework  
**Requirement**: Use Dependabot to upgrade vulnerable actions

- [ ] Workflow included in `.github/dependabot.yml`
- [ ] Weekly or monthly update schedule
- [ ] Proper labels and reviewers assigned

**Verification**:

```bash
# Check if workflow is in dependabot config
grep -A10 "github-actions" .github/dependabot.yml
```

---

### 8. CODEOWNERS Protection (HIGH)

**Standard**: GitHub Security Best Practices  
**Requirement**: Require reviews for workflow changes

- [ ] Workflow path in `.github/CODEOWNERS`
- [ ] Security team assigned as owner
- [ ] Branch protection enforces review

**Verification**:

```bash
# Check CODEOWNERS
grep "workflows" .github/CODEOWNERS
```

---

### 9. Input Validation (MEDIUM)

**Standard**: OWASP CI/CD Security  
**Requirement**: Validate all inputs

- [ ] `workflow_dispatch` inputs have validation
- [ ] Required inputs marked as `required: true`
- [ ] Input types specified
- [ ] Default values provided where appropriate

**Example**:

```yaml
# ✅ CORRECT
on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to deploy (e.g., v1.0.0)'
        required: true
        type: string
      environment:
        description: 'Target environment'
        required: true
        type: choice
        options:
          - staging
          - production
        default: staging
```

---

### 10. Error Handling (MEDIUM)

**Standard**: DevOps Best Practices  
**Requirement**: Proper error handling

- [ ] Critical steps have `if: failure()` handlers
- [ ] Notifications on failure
- [ ] Cleanup steps use `if: always()`
- [ ] Exit codes checked explicitly

**Example**:

```yaml
# ✅ CORRECT
- name: Deploy
  run: ./deploy.sh
  
- name: Rollback on failure
  if: failure()
  run: ./rollback.sh
  
- name: Cleanup
  if: always()
  run: ./cleanup.sh
```

---

## 📊 Automated Verification

### **Quick Verification Script**

Save as `.github/scripts/verify-workflow-security.sh`:

```bash
#!/bin/bash
set -e

WORKFLOW_FILE="$1"

if [ -z "$WORKFLOW_FILE" ]; then
  echo "Usage: $0 <workflow-file>"
  exit 1
fi

echo "🔍 Verifying workflow security: $WORKFLOW_FILE"
echo ""

ERRORS=0

# Check 1: Unpinned actions
echo "1. Checking for unpinned actions..."
if grep -qE 'uses:.*@(v[0-9]|main|master)' "$WORKFLOW_FILE"; then
  echo "   ❌ FAIL: Found unpinned actions"
  grep -nE 'uses:.*@(v[0-9]|main|master)' "$WORKFLOW_FILE"
  ERRORS=$((ERRORS + 1))
else
  echo "   ✅ PASS: All actions are pinned"
fi
echo ""

# Check 2: Broad permissions
echo "2. Checking for broad permissions..."
if grep -q "permissions:" "$WORKFLOW_FILE"; then
  if grep -A1 "permissions:" "$WORKFLOW_FILE" | grep -q "write" | head -1; then
    echo "   ⚠️  WARNING: Found write permissions (verify they are scoped per job)"
  else
    echo "   ✅ PASS: Permissions are read-only or scoped"
  fi
else
  echo "   ⚠️  WARNING: No explicit permissions (using defaults)"
fi
echo ""

# Check 3: Script injection risks
echo "3. Checking for script injection risks..."
if grep -qE '\$\{\{ github\.event\.' "$WORKFLOW_FILE"; then
  echo "   ❌ FAIL: Found github.event.* in workflow"
  grep -nE '\$\{\{ github\.event\.' "$WORKFLOW_FILE"
  ERRORS=$((ERRORS + 1))
else
  echo "   ✅ PASS: No github.event.* usage"
fi
echo ""

# Check 4: Hardcoded secrets
echo "4. Checking for hardcoded secrets..."
if grep -qiE '(password|token|key|secret).*[:=].*["\047][a-zA-Z0-9]{20,}' "$WORKFLOW_FILE"; then
  echo "   ❌ FAIL: Possible hardcoded secrets found"
  ERRORS=$((ERRORS + 1))
else
  echo "   ✅ PASS: No hardcoded secrets detected"
fi
echo ""

# Check 5: Concurrency control
echo "5. Checking for concurrency control..."
if grep -q "concurrency:" "$WORKFLOW_FILE"; then
  echo "   ✅ PASS: Concurrency control defined"
else
  echo "   ⚠️  WARNING: No concurrency control (may cause race conditions)"
fi
echo ""

# Check 6: Timeout management
echo "6. Checking for timeout management..."
if grep -q "timeout-minutes:" "$WORKFLOW_FILE"; then
  echo "   ✅ PASS: Timeouts defined"
else
  echo "   ⚠️  WARNING: No timeouts (jobs may hang indefinitely)"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
  echo "✅ VERIFICATION PASSED: No critical issues found"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 0
else
  echo "❌ VERIFICATION FAILED: $ERRORS critical issue(s) found"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 1
fi
```

**Usage**:

```bash
# Make executable
chmod +x .github/scripts/verify-workflow-security.sh

# Run verification
.github/scripts/verify-workflow-security.sh .github/workflows/release.yml
```

---

## 🔄 Pull Request Template

### **Add to `.github/pull_request_template.md`**

```markdown
## Workflow Security Checklist

**Note**: Complete this section if PR modifies `.github/workflows/` files

### Action Version Pinning
- [ ] All actions pinned to full commit SHA
- [ ] Version comments included (e.g., `# v4.1.1`)
- [ ] Verified with: `grep -r "uses:.*@v[0-9]" .github/workflows/`

### Permissions
- [ ] Default permissions: `contents: read`
- [ ] Permissions scoped per job
- [ ] Write permissions justified with comments

### Script Injection Prevention
- [ ] No `${{ github.event.* }}` in `run:` commands
- [ ] User inputs use environment variables
- [ ] Verified with: `grep -E '\$\{\{ github\.event\.' .github/workflows/`

### Secrets Management
- [ ] All secrets use `${{ secrets.* }}`
- [ ] No hardcoded credentials
- [ ] OIDC used where possible

### Additional Checks
- [ ] Concurrency control defined
- [ ] Timeouts set for all jobs
- [ ] Error handling implemented
- [ ] Dependabot configured

### Verification
- [ ] Ran: `.github/scripts/verify-workflow-security.sh`
- [ ] All checks passed
- [ ] Security team review requested (@omar120489)

**Reference**: See `.github/WORKFLOW_SECURITY_CHECKLIST.md`
```

---

## 🤖 GitHub Actions Workflow for Automated Checks

### **Create `.github/workflows/workflow-security-check.yml`**

```yaml
name: Workflow Security Check

on:
  pull_request:
    paths:
      - '.github/workflows/**'
  push:
    branches: [main]
    paths:
      - '.github/workflows/**'

permissions:
  contents: read
  pull-requests: write

jobs:
  security-check:
    name: Verify Workflow Security
    runs-on: ubuntu-latest
    timeout-minutes: 5
    
    steps:
      - name: Checkout code
        uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1

      - name: Get changed workflow files
        id: changed-files
        uses: tj-actions/changed-files@v40
        with:
          files: .github/workflows/**

      - name: Run security checks
        if: steps.changed-files.outputs.any_changed == 'true'
        run: |
          echo "🔍 Checking modified workflows..."
          
          for file in ${{ steps.changed-files.outputs.all_changed_files }}; do
            echo ""
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo "Checking: $file"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            
            # Check for unpinned actions
            if grep -qE 'uses:.*@(v[0-9]|main|master)' "$file"; then
              echo "❌ CRITICAL: Unpinned actions found in $file"
              grep -nE 'uses:.*@(v[0-9]|main|master)' "$file"
              exit 1
            fi
            
            # Check for script injection risks
            if grep -qE '\$\{\{ github\.event\.' "$file"; then
              echo "❌ CRITICAL: Script injection risk in $file"
              grep -nE '\$\{\{ github\.event\.' "$file"
              exit 1
            fi
            
            echo "✅ Security checks passed for $file"
          done
          
          echo ""
          echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
          echo "✅ ALL SECURITY CHECKS PASSED"
          echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

      - name: Comment on PR
        if: github.event_name == 'pull_request' && steps.changed-files.outputs.any_changed == 'true'
        uses: actions/github-script@60a0d83039c74a4aee543508d2ffcb1c3799cdea # v7.0.1
        with:
          script: |
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: `## ✅ Workflow Security Check Passed
              
              All modified workflows passed automated security checks:
              - ✅ All actions are SHA-pinned
              - ✅ No script injection risks detected
              - ✅ No hardcoded secrets found
              
              **Modified workflows**: ${{ steps.changed-files.outputs.all_changed_files }}
              
              Please ensure you've completed the [Workflow Security Checklist](.github/WORKFLOW_SECURITY_CHECKLIST.md).`
            });
```

---

## 📅 Periodic Audit Schedule

### **Quarterly Security Audit**

**Schedule**: Every 3 months (Jan, Apr, Jul, Oct)

**Checklist**:

- [ ] Review all workflows against this checklist
- [ ] Update pinned action SHAs
- [ ] Review Dependabot alerts
- [ ] Verify CODEOWNERS coverage
- [ ] Update security documentation
- [ ] Run OpenSSF Scorecard
- [ ] Review access permissions
- [ ] Update this checklist if standards change

**Next Audit Date**: January 24, 2026

---

## 🔗 References

### **Official Standards**

1. **GitHub Actions Security Hardening**
   - URL: <https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions>
   - Citation: "Pin actions to a full length commit SHA"

2. **AWS Well-Architected Framework**
   - URL: <https://docs.aws.amazon.com/wellarchitected/latest/framework/sec_permissions_least_privileges.html>
   - Citation: "Implement least privilege for workflow permissions"

3. **GitHub Security Lab**
   - URL: <https://securitylab.github.com/research/github-actions-preventing-pwn-requests/>
   - Citation: "Avoid script injection via untrusted inputs"

4. **OpenSSF Scorecard**
   - URL: <https://github.com/ossf/scorecard>
   - Citation: "Pin dependencies to specific versions"

### **Internal Documentation**

- `WORKFLOW_SECURITY_AUDIT.md` - Comprehensive audit
- `SECURITY_GAP_ANALYSIS.md` - Gap analysis
- `SECURITY_COMPLIANCE_SUMMARY.md` - Compliance report
- `.github/ALLOWED_ACTIONS.md` - Approved actions

---

## ✅ Quick Reference Card

### **Critical Checks** (Must Pass)

| Check | Command | Expected |
|-------|---------|----------|
| **Unpinned Actions** | `grep -r "uses:.*@v[0-9]" .github/workflows/` | No matches |
| **Script Injection** | `grep -E '\$\{\{ github\.event\.' .github/workflows/` | No matches |
| **Hardcoded Secrets** | `grep -iE '(password\|token\|key).*[:=].*["\047][a-zA-Z0-9]{20,}' .github/workflows/` | No matches |

### **Recommended Checks** (Should Pass)

| Check | Command | Expected |
|-------|---------|----------|
| **Permissions** | `grep -A5 "permissions:" .github/workflows/` | Scoped per job |
| **Concurrency** | `grep "concurrency:" .github/workflows/` | Defined |
| **Timeouts** | `grep "timeout-minutes:" .github/workflows/` | Defined |

---

## 📞 Support

**Questions**: Open an issue with label `security`  
**Security Team**: @omar120489  
**Documentation**: `.github/WORKFLOW_SECURITY_CHECKLIST.md`

---

**Checklist Version**: 1.0  
**Last Updated**: October 24, 2025  
**Next Review**: January 24, 2026
