# ✅ Production Deployment Validation Plan

**10-15 minute validation checklist to ensure production deployment is ready**

---

## 🎯 Validation Objectives

1. Verify workflow syntax is valid
2. Test manual deployment trigger
3. Test tag-based deployment trigger
4. Verify health check functionality
5. Test automatic rollback
6. Validate security and permissions

---

## Phase 1: Pre-Deployment Validation (5 min)

### 1.1 Workflow Syntax Validation

```bash
# Install actionlint (if not already installed)
brew install actionlint  # macOS
# or: go install github.com/rhysd/actionlint/cmd/actionlint@latest

# Lint workflow files
actionlint .github/workflows/deploy-production.yml
actionlint .github/workflows/smoke-production.yml
```

**Expected Result:** No errors (warnings about 'production' environment are expected)

---

### 1.2 Environment Setup Verification

```bash
# Verify environment exists
gh api repos/:owner/:repo/environments | jq '.environments[] | select(.name=="production")'

# Verify secrets are set
gh secret list --env production

# Verify variables are set
gh variable list --env production
```

**Expected Result:**
- Environment `production` exists
- Secrets: `PROD_API_KEY`, `PROD_DEPLOY_URL` (and provider-specific)
- Variables: `PROD_PUBLIC_URL`, `PROD_HEALTH_URL`

---

### 1.3 Protection Rules Verification

```bash
# View environment protection rules
gh api repos/:owner/:repo/environments/production | jq '.protection_rules'
```

**Expected Result:**
- Required reviewers configured
- Deployment branches restricted to `main`

---

## Phase 2: Dry Run Deployment (5 min)

### 2.1 Manual Trigger Test

```bash
# Trigger workflow manually
gh workflow run deploy-production.yml

# Get the run ID
RUN_ID=$(gh run list --workflow=deploy-production.yml --limit 1 --json databaseId --jq '.[0].databaseId')

# Watch the workflow
gh run watch $RUN_ID
```

**Steps:**
1. Workflow starts and runs "Build & Test" job
2. Workflow pauses at "Deploy" job waiting for approval
3. Go to GitHub Actions UI and approve deployment
4. Deployment proceeds
5. Health check runs
6. Workflow completes successfully

**Expected Duration:** ~10-15 minutes + approval time

---

### 2.2 Approval Process Test

**GitHub UI:**
1. Navigate to: **Actions** → **Deploy Production** → Select running workflow
2. Click: **Review deployments**
3. Check: `production` environment
4. Add comment: "Test approval - validating workflow"
5. Click: **Approve and deploy**

**Expected Result:** Deployment proceeds to "Deploy" job

---

### 2.3 Health Check Verification

Monitor the "Health Check" job logs:

```bash
# View logs for health check job
gh run view $RUN_ID --log | grep -A 20 "Health Check"
```

**Expected Result:**
- Wait 15 seconds for rollout
- Attempt 1-10: Check `/health` endpoint
- Response code: 200
- Health check passes

---

## Phase 3: Tag-Based Deployment (3 min)

### 3.1 Create Test Tag

```bash
# Create test tag
git tag v1.0.0-validation
git push origin v1.0.0-validation

# Monitor workflow
gh run list --workflow=deploy-production.yml --limit 1
```

**Expected Result:** Workflow triggers automatically on tag push

---

### 3.2 Verify Tag Deployment

```bash
# Get run ID
RUN_ID=$(gh run list --workflow=deploy-production.yml --limit 1 --json databaseId --jq '.[0].databaseId')

# Watch workflow
gh run watch $RUN_ID
```

**Expected Result:** Same flow as manual trigger (approval required)

---

## Phase 4: Rollback Testing (5 min) ⚠️ Optional but Recommended

### 4.1 Prepare Rollback Test

**Option A: Temporary Health Check Failure (Safe)**

Add a feature flag or environment variable to your app:

```bash
# Set a variable to make health check fail
gh variable set FORCE_HEALTH_FAILURE --env production --body "true"
```

**Option B: Deploy Known Bad Version**

Create a test branch with intentionally failing health check:

```bash
# Create test branch
git checkout -b test/rollback-validation

# Modify health endpoint to return 500
# (Make changes to your health endpoint)

# Commit and tag
git commit -am "test: force health check failure for rollback test"
git tag v1.0.0-rollback-test
git push origin v1.0.0-rollback-test
```

---

### 4.2 Trigger Deployment and Monitor Rollback

```bash
# Trigger deployment
gh workflow run deploy-production.yml

# Get run ID
RUN_ID=$(gh run list --workflow=deploy-production.yml --limit 1 --json databaseId --jq '.[0].databaseId')

# Watch workflow
gh run watch $RUN_ID
```

**Expected Flow:**
1. Build & Test: ✅ Pass
2. Deploy: ✅ Pass (after approval)
3. Health Check: ❌ Fail (10 attempts, all fail)
4. Rollback: ✅ Trigger automatically
   - Find previous successful deployment
   - Download previous artifact
   - Redeploy previous version
   - Announce rollback

---

### 4.3 Verify Rollback Success

```bash
# View deployment history
gh api repos/:owner/:repo/deployments \
  --jq '.[] | select(.environment=="production") | {ref, created_at, statuses_url}'

# Check latest deployment status
gh api repos/:owner/:repo/deployments | jq '.[0].statuses_url' | xargs gh api | jq
```

**Expected Result:**
- Rollback job completes successfully
- Previous version is redeployed
- Application is healthy again

---

### 4.4 Cleanup After Rollback Test

```bash
# Remove test variable (if used)
gh variable delete FORCE_HEALTH_FAILURE --env production

# Delete test tag
git tag -d v1.0.0-rollback-test
git push origin :refs/tags/v1.0.0-rollback-test

# Switch back to main branch
git checkout main
git branch -D test/rollback-validation
```

---

## Phase 5: Smoke Tests (2 min)

### 5.1 Run Production Smoke Tests

```bash
# Trigger smoke tests
gh workflow run smoke-production.yml

# Get run ID
RUN_ID=$(gh run list --workflow=smoke-production.yml --limit 1 --json databaseId --jq '.[0].databaseId')

# Watch results
gh run watch $RUN_ID
```

**Expected Result:**
- Root endpoint: ✅ 200 OK
- Health endpoint: ✅ 200 OK
- API endpoint: ✅ 200 OK (or ⚠️ non-blocking warning)

---

### 5.2 Verify Smoke Test Schedule

```bash
# Check if scheduled runs are configured
gh workflow view smoke-production.yml | grep -A 5 "on:"
```

**Expected Result:** Cron schedule configured (every 6 hours)

---

## Phase 6: Security Validation (3 min)

### 6.1 Verify Least-Privilege Permissions

```bash
# Check workflow permissions
grep -A 5 "permissions:" .github/workflows/deploy-production.yml
```

**Expected Result:**
- Default: `contents: read`, `actions: read`
- Deploy job: `contents: read`, `deployments: write`
- No `write` permissions for `contents` or `packages`

---

### 6.2 Verify Concurrency Control

```bash
# Check concurrency settings
grep -A 3 "concurrency:" .github/workflows/deploy-production.yml
```

**Expected Result:**
- Group: `deploy-production`
- Cancel-in-progress: `false`

---

### 6.3 Verify Environment Secrets Scope

```bash
# List repository-level secrets
gh secret list

# List environment-level secrets
gh secret list --env production
```

**Expected Result:**
- Production secrets are scoped to `production` environment only
- No production secrets at repository level

---

## Phase 7: Documentation Validation (2 min)

### 7.1 Verify Documentation Completeness

```bash
# Check all documentation files exist
ls -lh .github/PRODUCTION_DEPLOYMENT_SETUP.md
ls -lh .github/QUICK_START_PRODUCTION.md
ls -lh .github/DEPLOYMENT_COMPARISON.md
ls -lh .github/SETUP_COMMANDS.md
ls -lh .github/VALIDATION_PLAN.md
```

**Expected Result:** All files exist and are readable

---

### 7.2 Add Deployment Badge to README

Add this badge to your main `README.md`:

```markdown
[![Deploy Production](https://github.com/omar120489/traffic-crm-frontend-ts/actions/workflows/deploy-production.yml/badge.svg)](https://github.com/omar120489/traffic-crm-frontend-ts/actions/workflows/deploy-production.yml)
```

---

## 📊 Validation Results Checklist

Copy this checklist to track your validation:

```markdown
## Pre-Deployment Validation
- [ ] Workflow syntax is valid (actionlint passes)
- [ ] Environment `production` exists
- [ ] All required secrets are set
- [ ] All required variables are set
- [ ] Protection rules configured (reviewers, branches)

## Dry Run Deployment
- [ ] Manual trigger works
- [ ] Build & Test job passes
- [ ] Approval process works
- [ ] Deploy job completes
- [ ] Health check passes
- [ ] Deployment completes successfully

## Tag-Based Deployment
- [ ] Tag trigger works
- [ ] Workflow runs automatically
- [ ] Same approval flow as manual trigger

## Rollback Testing
- [ ] Health check failure detected
- [ ] Rollback job triggers automatically
- [ ] Previous artifact downloaded
- [ ] Previous version redeployed
- [ ] Application healthy after rollback

## Smoke Tests
- [ ] Smoke tests run successfully
- [ ] All endpoints return 200 OK
- [ ] Scheduled runs configured

## Security Validation
- [ ] Least-privilege permissions verified
- [ ] Concurrency control verified
- [ ] Environment secrets scoped correctly
- [ ] No production secrets at repo level

## Documentation
- [ ] All documentation files present
- [ ] Deployment badge added to README
- [ ] Team notified of new deployment process
```

---

## 🚨 Troubleshooting

### Issue: Workflow doesn't trigger on tag push

**Check:**
```bash
# Verify tag pattern matches
git tag | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$'
```

**Fix:** Ensure tag follows `v*.*.*` pattern (e.g., `v1.0.0`)

---

### Issue: Health check always fails

**Check:**
```bash
# Test health endpoint manually
curl -v https://your-app.com/health
```

**Fix:**
- Verify `PROD_HEALTH_URL` is correct
- Ensure app exposes `/health` endpoint
- Check app logs for errors

---

### Issue: Rollback can't find previous deployment

**Cause:** This is the first deployment, no previous version exists

**Fix:** Deploy a known-good version first, then test rollback

---

### Issue: Approval not required

**Check:**
```bash
# Verify protection rules
gh api repos/:owner/:repo/environments/production | jq '.protection_rules'
```

**Fix:** Configure required reviewers in GitHub UI

---

## 📈 Success Criteria

Your production deployment is validated when:

✅ All pre-deployment checks pass  
✅ Manual deployment completes successfully  
✅ Tag-based deployment works  
✅ Health checks verify deployment  
✅ Rollback works automatically on failure  
✅ Smoke tests pass  
✅ Security permissions are minimal  
✅ Documentation is complete  

---

## 🎉 Next Steps After Validation

1. **Document the process** for your team
2. **Set up monitoring** for production deployments
3. **Configure Slack/email notifications** (optional)
4. **Schedule regular smoke tests** (already configured)
5. **Plan first real production deployment**

---

**Validation Time:** ~15-20 minutes  
**Last Updated:** October 26, 2025  
**Maintained by:** @omar120489

