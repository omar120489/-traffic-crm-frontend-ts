# Rollback Workflow Test Plan

**Version**: 1.0  
**Last Updated**: October 24, 2025  
**Owner**: DevOps Team (@omar120489)

---

## 📋 Purpose

This document defines the comprehensive test plan for the rollback workflow (`.github/workflows/rollback-release.yml`) to ensure reliable disaster recovery capability.

---

## 🎯 Test Objectives

1. ✅ Verify rollback workflow executes successfully
2. ✅ Validate version verification logic
3. ✅ Confirm build process for previous versions
4. ✅ Test deployment to production
5. ✅ Verify smoke tests and health checks
6. ✅ Validate issue tracking and notifications
7. ✅ Ensure proper error handling and rollback

---

## 🔧 Pre-Test Setup

### **Environment Preparation**

```bash
# 1. Ensure staging environment is available
# 2. Create test release tags
git tag v1.0.0-test
git tag v2.0.0-test
git tag v3.0.0-test
git push origin --tags

# 3. Verify workflow file exists
ls -la .github/workflows/rollback-release.yml

# 4. Verify required secrets are configured
# - SLACK_WEBHOOK_URL (optional)
# - Deployment credentials (if applicable)

# 5. Ensure test environment URLs are configured
# - Staging: https://staging.example.com
# - Production: https://example.com
```

### **Test Data**

- **Valid Version**: `v2.0.0-test` (exists)
- **Invalid Version**: `v99.99.99` (doesn't exist)
- **Current Version**: `v3.0.0-test` (latest)
- **Rollback Target**: `v2.0.0-test` (previous stable)

---

## 🧪 Test Scenarios

### **Scenario 1: Successful Rollback** ✅

**Objective**: Verify complete rollback workflow succeeds

**Pre-conditions**:

- Current deployment: `v3.0.0-test`
- Target version: `v2.0.0-test` (exists and is stable)
- All systems operational

**Steps**:

1. Navigate to GitHub Actions → Rollback Release
2. Click "Run workflow"
3. Enter inputs:
   - **version**: `v2.0.0-test`
   - **reason**: `Testing successful rollback workflow`
   - **skip_tests**: `false`
4. Click "Run workflow"
5. Monitor execution in real-time

**Expected Results**:

- ✅ Workflow starts successfully
- ✅ Validation job passes
  - Version `v2.0.0-test` exists
  - Rollback issue created
- ✅ Build job passes
  - Checkout `v2.0.0-test` successful
  - Dependencies installed
  - Tests pass (if not skipped)
  - Frontend build succeeds
  - Backend build succeeds
  - Artifacts uploaded
- ✅ Deploy job passes
  - Artifacts downloaded
  - Deployment to production succeeds
  - Health checks pass
- ✅ Notify job passes
  - Slack notification sent (if configured)
  - Rollback issue updated and closed
- ✅ Overall workflow status: SUCCESS

**Verification Commands**:

```bash
# Check workflow status
gh run list --workflow=rollback-release.yml --limit=1

# View workflow logs
gh run view --log

# Verify deployment
curl -f https://example.com/health

# Check version endpoint (if available)
curl -s https://example.com/api/version | jq '.version'
# Expected: "2.0.0-test"

# Verify issue created and closed
gh issue list --label rollback --state closed --limit 1
```

**Pass Criteria**:

- ✅ All jobs complete successfully
- ✅ Deployment verified in production
- ✅ Health checks pass
- ✅ Issue created and closed
- ✅ Notifications sent

---

### **Scenario 2: Rollback with Invalid Version** ❌

**Objective**: Verify workflow fails gracefully with invalid version

**Pre-conditions**:

- Current deployment: `v3.0.0-test`
- Target version: `v99.99.99` (doesn't exist)

**Steps**:

1. Navigate to GitHub Actions → Rollback Release
2. Click "Run workflow"
3. Enter inputs:
   - **version**: `v99.99.99`
   - **reason**: `Testing invalid version handling`
   - **skip_tests**: `false`
4. Click "Run workflow"
5. Monitor execution

**Expected Results**:

- ✅ Workflow starts successfully
- ❌ Validation job fails
  - Error message: "Version v99.99.99 does not exist"
  - Available versions listed
  - Rollback issue created with failure details
- ⏭️ Build job skipped (dependency on validation)
- ⏭️ Deploy job skipped (dependency on build)
- ✅ Notify job runs (always)
  - Failure notification sent
  - Issue updated with failure status
- ❌ Overall workflow status: FAILURE

**Verification Commands**:

```bash
# Check workflow status
gh run list --workflow=rollback-release.yml --limit=1
# Expected: "failure"

# View validation job logs
gh run view --log --job validate-rollback
# Expected: Error message about missing version

# Verify issue created with failure details
gh issue list --label rollback --state open --limit 1
```

**Pass Criteria**:

- ❌ Validation job fails with clear error message
- ✅ No deployment attempted
- ✅ Issue created with failure details
- ✅ Failure notification sent
- ✅ Production environment unchanged

---

### **Scenario 3: Rollback with Build Failure** ❌

**Objective**: Verify workflow handles build failures correctly

**Pre-conditions**:

- Current deployment: `v3.0.0-test`
- Target version: `v2.0.0-test-broken` (exists but has build errors)

**Setup**:

```bash
# Create a broken version for testing
git checkout v2.0.0-test
# Introduce intentional build error
echo "SYNTAX ERROR" >> apps/frontend/src/index.jsx
git commit -am "test: introduce build error"
git tag v2.0.0-test-broken
git push origin v2.0.0-test-broken
```

**Steps**:

1. Navigate to GitHub Actions → Rollback Release
2. Click "Run workflow"
3. Enter inputs:
   - **version**: `v2.0.0-test-broken`
   - **reason**: `Testing build failure handling`
   - **skip_tests**: `false`
4. Click "Run workflow"
5. Monitor execution

**Expected Results**:

- ✅ Workflow starts successfully
- ✅ Validation job passes
- ❌ Build job fails
  - Frontend build fails with syntax error
  - Build validation fails
  - Artifacts not uploaded
  - Rollback issue updated with build failure
- ⏭️ Deploy job skipped (dependency on build)
- ✅ Notify job runs
  - Failure notification sent
  - Issue updated with build error details
- ❌ Overall workflow status: FAILURE

**Verification Commands**:

```bash
# Check workflow status
gh run list --workflow=rollback-release.yml --limit=1
# Expected: "failure"

# View build job logs
gh run view --log --job build-previous-version
# Expected: Build error messages

# Verify no deployment occurred
curl -s https://example.com/api/version | jq '.version'
# Expected: Still "3.0.0-test" (unchanged)

# Verify issue updated
gh issue list --label rollback --state open --limit 1
```

**Pass Criteria**:

- ❌ Build job fails with clear error message
- ✅ No deployment attempted
- ✅ Issue updated with build failure details
- ✅ Failure notification sent
- ✅ Production environment unchanged

**Cleanup**:

```bash
# Remove broken tag
git tag -d v2.0.0-test-broken
git push origin :refs/tags/v2.0.0-test-broken
```

---

### **Scenario 4: Rollback with Deployment Failure** ❌

**Objective**: Verify workflow handles deployment failures correctly

**Pre-conditions**:

- Current deployment: `v3.0.0-test`
- Target version: `v2.0.0-test` (valid and builds successfully)
- Deployment credentials invalid (simulated)

**Setup**:

```bash
# Temporarily remove or invalidate deployment credentials
# (This is environment-specific - adjust as needed)
# Example: Remove AWS credentials, Vercel token, etc.
```

**Steps**:

1. Navigate to GitHub Actions → Rollback Release
2. Click "Run workflow"
3. Enter inputs:
   - **version**: `v2.0.0-test`
   - **reason**: `Testing deployment failure handling`
   - **skip_tests**: `false`
4. Click "Run workflow"
5. Monitor execution

**Expected Results**:

- ✅ Workflow starts successfully
- ✅ Validation job passes
- ✅ Build job passes
  - Artifacts uploaded successfully
- ❌ Deploy job fails
  - Deployment command fails (invalid credentials)
  - Health checks not attempted
  - Rollback issue updated with deployment failure
- ✅ Notify job runs
  - Failure notification sent
  - Issue updated with deployment error details
- ❌ Overall workflow status: FAILURE

**Verification Commands**:

```bash
# Check workflow status
gh run list --workflow=rollback-release.yml --limit=1
# Expected: "failure"

# View deploy job logs
gh run view --log --job deploy-rollback
# Expected: Deployment error messages

# Verify no deployment occurred
curl -s https://example.com/api/version | jq '.version'
# Expected: Still "3.0.0-test" (unchanged)

# Verify issue updated
gh issue list --label rollback --state open --limit=1
```

**Pass Criteria**:

- ❌ Deploy job fails with clear error message
- ✅ Build artifacts available (for retry)
- ✅ Issue updated with deployment failure details
- ✅ Failure notification sent
- ✅ Production environment unchanged

**Cleanup**:

```bash
# Restore deployment credentials
```

---

### **Scenario 5: Rollback with Skip Tests** ⚡

**Objective**: Verify emergency rollback with skipped tests

**Pre-conditions**:

- Current deployment: `v3.0.0-test` (critical bug in production)
- Target version: `v2.0.0-test` (last known good version)
- Emergency situation (need fast rollback)

**Steps**:

1. Navigate to GitHub Actions → Rollback Release
2. Click "Run workflow"
3. Enter inputs:
   - **version**: `v2.0.0-test`
   - **reason**: `Emergency rollback - critical bug in v3.0.0`
   - **skip_tests**: `true` ⚡
4. Click "Run workflow"
5. Monitor execution

**Expected Results**:

- ✅ Workflow starts successfully
- ✅ Validation job passes
- ✅ Build job passes
  - Tests skipped (faster execution)
  - Build completes quickly
  - Artifacts uploaded
- ✅ Deploy job passes
  - Deployment succeeds
  - Health checks pass
- ✅ Notify job passes
  - Success notification sent
  - Issue updated and closed
- ✅ Overall workflow status: SUCCESS
- ⏱️ Execution time: Faster than Scenario 1 (tests skipped)

**Verification Commands**:

```bash
# Check workflow status and duration
gh run list --workflow=rollback-release.yml --limit=1

# Compare execution time with Scenario 1
# Expected: 20-30% faster

# Verify deployment
curl -f https://example.com/health

# Check version
curl -s https://example.com/api/version | jq '.version'
# Expected: "2.0.0-test"
```

**Pass Criteria**:

- ✅ All jobs complete successfully
- ✅ Tests skipped (faster execution)
- ✅ Deployment verified
- ✅ Health checks pass
- ✅ Faster than full rollback

---

## 📊 Test Results Template

### **Test Execution Log**

| Date | Scenario | Version | Result | Duration | Notes |
|------|----------|---------|--------|----------|-------|
| 2025-10-24 | 1: Success | v2.0.0-test | ✅ PASS | 8m 32s | All checks passed |
| 2025-10-24 | 2: Invalid | v99.99.99 | ✅ PASS | 1m 15s | Failed as expected |
| 2025-10-24 | 3: Build Fail | v2.0.0-broken | ✅ PASS | 4m 22s | Failed as expected |
| 2025-10-24 | 4: Deploy Fail | v2.0.0-test | ✅ PASS | 6m 45s | Failed as expected |
| 2025-10-24 | 5: Skip Tests | v2.0.0-test | ✅ PASS | 5m 18s | Faster execution |

### **Overall Test Summary**

```
Total Scenarios: 5
Passed: 5/5 (100%)
Failed: 0/5 (0%)
Status: ✅ ALL TESTS PASSED
```

---

## 📅 Test Schedule

### **Regular Testing**

- **Frequency**: Quarterly
- **Schedule**:
  - Q1: January 15
  - Q2: April 15
  - Q3: July 15
  - Q4: October 15

### **Ad-Hoc Testing**

- After workflow modifications
- After infrastructure changes
- After any production rollback (post-mortem)

---

## 🚨 Incident Response

### **If Rollback Fails in Production**

1. **Immediate Actions**:
   - Assess impact and severity
   - Notify stakeholders
   - Activate incident response team

2. **Manual Rollback**:

   ```bash
   # If automated rollback fails, perform manual rollback
   git checkout v2.0.0-test
   pnpm install --frozen-lockfile
   pnpm --filter ./apps/frontend run build
   pnpm --filter ./apps/core-api run build
   # Deploy manually using your deployment method
   ```

3. **Investigation**:
   - Review workflow logs
   - Identify failure point
   - Document root cause

4. **Post-Mortem**:
   - Document incident
   - Update rollback workflow if needed
   - Update test plan
   - Conduct team review

---

## ✅ Success Criteria

### **Workflow Must**

- ✅ Validate version exists before proceeding
- ✅ Build previous version successfully
- ✅ Deploy to production without errors
- ✅ Pass health checks
- ✅ Create and update tracking issue
- ✅ Send notifications
- ✅ Handle failures gracefully
- ✅ Provide clear error messages
- ✅ Leave production unchanged on failure

### **Performance Targets**

- ⏱️ Full rollback (with tests): < 10 minutes
- ⏱️ Emergency rollback (skip tests): < 6 minutes
- ⏱️ Validation failure: < 2 minutes
- 🎯 Success rate: > 95%
- 🎯 Mean Time to Recovery (MTTR): < 15 minutes

---

## 📚 References

- [Rollback Workflow](./.github/workflows/rollback-release.yml)
- [Security Gap Analysis](../SECURITY_GAP_ANALYSIS.md)
- [Workflow Security Audit](../WORKFLOW_SECURITY_AUDIT.md)

---

## 📞 Contact

**DevOps Team**: @omar120489  
**Questions**: Open an issue with label `devops`  
**Urgent**: Contact on-call engineer

---

**Test Plan Version**: 1.0  
**Last Tested**: Pending  
**Next Test**: Sprint 5 (Week 3-4)
