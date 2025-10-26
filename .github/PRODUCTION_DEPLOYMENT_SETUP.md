# 🚀 Production Deployment Setup Guide

This guide walks you through setting up the production deployment workflow (`deploy-production.yml`).

---

## ⚠️ Prerequisites

Before using the production deployment workflow, you must configure the GitHub environment and secrets.

---

## 🔧 One-Time Setup (5 minutes)

### Step 1: Create the Production Environment

1. Go to your repository on GitHub
2. Click **Settings** → **Environments** (left sidebar)
3. Click **New environment**
4. Name it: `production`
5. Click **Configure environment**

### Step 2: Add Environment Secrets

In the `production` environment configuration, add these secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `PROD_API_KEY` | Deployment authentication token | `sk_prod_abc123...` |
| `PROD_DEPLOY_URL` | Deployment webhook/API endpoint | `https://api.vercel.com/v1/deploy` |

**How to add:**
1. Scroll to **Environment secrets**
2. Click **Add secret**
3. Enter name and value
4. Click **Add secret**

### Step 3: Add Environment Variables (Optional)

In the same environment configuration, add these variables:

| Variable Name | Description | Example |
|---------------|-------------|---------|
| `PROD_PUBLIC_URL` | Your production URL | `https://app.example.com` |
| `PROD_HEALTH_URL` | Health check endpoint | `https://app.example.com/api/health` |

**How to add:**
1. Scroll to **Environment variables**
2. Click **Add variable**
3. Enter name and value
4. Click **Add variable**

### Step 4: Configure Protection Rules (Recommended)

Still in the `production` environment settings:

#### Required Reviewers
1. Scroll to **Deployment protection rules**
2. Check **Required reviewers**
3. Add yourself: `@omar120489`
4. Set **Reviewers required**: 1

#### Deployment Branches
1. Under **Deployment branches**, select **Selected branches**
2. Add branch rule: `main`
3. This ensures only `main` branch can deploy to production

#### Wait Timer (Optional)
1. Check **Wait timer**
2. Set to **2-5 minutes**
3. This gives you time to cancel if needed

### Step 5: Save Configuration

Click **Save protection rules** at the bottom.

---

## 🎯 Customizing the Deployment

The workflow includes placeholder deployment commands. You need to replace them with your actual deployment provider.

### Option 1: Vercel

Replace the placeholder in the `Deploy (placeholder)` step:

```yaml
- name: Deploy to Vercel
  env:
    VERCEL_TOKEN: ${{ secrets.PROD_API_KEY }}
    VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
    VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
  run: |
    npm install -g vercel
    cd apps/frontend
    vercel deploy --prod --token=$VERCEL_TOKEN
```

### Option 2: AWS S3 + CloudFront

```yaml
- name: Deploy to AWS
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    AWS_REGION: us-east-1
  run: |
    tar -xzf artifact.tgz
    aws s3 sync dist_bundle/frontend s3://your-bucket-name --delete
    aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Option 3: Render

```yaml
- name: Deploy to Render
  env:
    RENDER_API_KEY: ${{ secrets.PROD_API_KEY }}
    RENDER_SERVICE_ID: ${{ secrets.RENDER_SERVICE_ID }}
  run: |
    curl -X POST "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys" \
      -H "Authorization: Bearer $RENDER_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{"clearCache": false}'
```

### Option 4: Fly.io

```yaml
- name: Deploy to Fly.io
  env:
    FLY_API_TOKEN: ${{ secrets.PROD_API_KEY }}
  run: |
    curl -L https://fly.io/install.sh | sh
    export FLYCTL_INSTALL="/home/runner/.fly"
    export PATH="$FLYCTL_INSTALL/bin:$PATH"
    flyctl deploy --remote-only --app your-app-name
```

### Option 5: Custom API

```yaml
- name: Deploy via API
  env:
    DEPLOY_TOKEN: ${{ secrets.PROD_API_KEY }}
    DEPLOY_URL: ${{ secrets.PROD_DEPLOY_URL }}
  run: |
    curl -X POST "$DEPLOY_URL" \
      -H "Authorization: Bearer $DEPLOY_TOKEN" \
      -F "artifact=@artifact.tgz" \
      -F "version=${GITHUB_REF#refs/tags/}"
```

---

## 🧪 Testing the Workflow

### Method 1: Manual Trigger (Recommended for First Test)

```bash
# Trigger the workflow manually
gh workflow run deploy-production.yml

# Check status
gh run list --workflow=deploy-production.yml --limit 5
```

### Method 2: Tag-Based Trigger

```bash
# Create and push a version tag
git tag v1.0.0
git push origin v1.0.0

# The workflow will trigger automatically
```

---

## 🔄 Workflow Execution Flow

When triggered, the workflow follows this sequence:

```
1. Build & Test (20 min timeout)
   ├─ Checkout code
   ├─ Setup Node 20 + pnpm
   ├─ Install dependencies
   ├─ Typecheck, lint, test
   ├─ Build frontend + backend
   └─ Upload artifact (7-day retention)

2. Deploy (30 min timeout)
   ├─ 🛑 WAIT FOR MANUAL APPROVAL (if reviewers configured)
   ├─ Download build artifact
   ├─ Verify artifact integrity
   ├─ Deploy to production
   └─ Announce deployment

3. Health Check (10 min timeout)
   ├─ Wait 15 seconds for rollout
   ├─ Retry /health endpoint 10 times
   └─ Fail if not 200 OK

4. Rollback (only if health check fails)
   ├─ Find previous successful deployment
   ├─ Download previous artifact
   ├─ Redeploy previous version
   └─ Announce rollback
```

---

## 🔒 Security Features

### Least-Privilege Permissions
- Default: `contents: read`, `actions: read`
- Deploy job: `deployments: write` (scoped)
- No broad `write` permissions

### Concurrency Control
- Only one production deployment at a time
- No cancellation of in-flight deployments
- Prevents race conditions

### Manual Approval Gate
- Requires human review before deployment
- Configurable wait timer
- Can be bypassed for trusted automation

### Automatic Rollback
- Triggers on health check failure
- Uses previous successful artifact
- No manual intervention needed

### Audit Trail
- All deployments logged in GitHub
- Deployment history in Environments tab
- Approval history tracked

---

## 📊 Monitoring Deployments

### View Deployment History

```bash
# List recent deployments
gh api /repos/:owner/:repo/deployments --jq '.[] | {id, ref, environment, created_at}'

# View specific deployment
gh api /repos/:owner/:repo/deployments/DEPLOYMENT_ID
```

### Check Workflow Status

```bash
# List recent runs
gh run list --workflow=deploy-production.yml --limit 10

# View specific run
gh run view RUN_ID

# View logs
gh run view RUN_ID --log
```

### GitHub UI

1. Go to **Actions** tab
2. Select **Deploy Production** workflow
3. View run history, logs, and artifacts
4. Check **Environments** tab for deployment timeline

---

## 🚨 Troubleshooting

### Issue: "Value 'production' is not valid"

**Cause:** The `production` environment doesn't exist.

**Fix:** Follow [Step 1: Create the Production Environment](#step-1-create-the-production-environment)

---

### Issue: Deployment hangs at "Deploy to Production"

**Cause:** Waiting for manual approval.

**Fix:** 
1. Go to Actions → Select the run
2. Click **Review deployments**
3. Check `production` and click **Approve and deploy**

---

### Issue: Health check fails

**Cause:** Application not responding at health endpoint.

**Fix:**
1. Check `PROD_HEALTH_URL` variable is correct
2. Ensure your app exposes `/health` or `/api/health`
3. Verify app is actually deployed and running
4. Check application logs for startup errors

---

### Issue: Rollback fails with "No previous version available"

**Cause:** This is the first deployment, no previous version exists.

**Fix:** Manual intervention required. Deploy a known-good version manually or fix the issue and redeploy.

---

### Issue: Secrets not found

**Cause:** Secrets are not set in the `production` environment.

**Fix:** Follow [Step 2: Add Environment Secrets](#step-2-add-environment-secrets)

---

## 📈 Performance Tips

### Speed Up Builds

1. **Enable pnpm caching** (already configured)
2. **Use Turborepo remote cache:**
   ```yaml
   - name: Build with Turbo
     run: pnpm turbo build --token=${{ secrets.TURBO_TOKEN }}
   ```
3. **Parallelize tests:**
   ```yaml
   strategy:
     matrix:
       shard: [1, 2, 3, 4]
   ```

### Reduce Artifact Size

1. **Exclude unnecessary files:**
   ```bash
   tar -czf artifact.tgz \
     --exclude='*.map' \
     --exclude='node_modules' \
     dist_bundle
   ```

2. **Compress more aggressively:**
   ```bash
   tar -czf artifact.tgz -I 'gzip -9' dist_bundle
   ```

---

## 🎯 Next Steps

After setup is complete:

1. ✅ Create `production` environment in GitHub
2. ✅ Add required secrets and variables
3. ✅ Configure protection rules
4. ✅ Customize deployment commands for your provider
5. ✅ Test with manual trigger
6. ✅ Test with version tag
7. ✅ Monitor first production deployment
8. ✅ Verify health check works
9. ✅ (Optional) Test rollback by forcing a health check failure

---

## 📚 Additional Resources

- [GitHub Environments Documentation](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Deployment Protection Rules](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#deployment-protection-rules)
- [Workflow Concurrency](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#concurrency)

---

**Questions?** Open an issue or check the [main README](../README.md) for general setup instructions.

**Status:** Ready for production use after completing one-time setup ✅

