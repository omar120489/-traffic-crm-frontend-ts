# 🔧 Production Deployment Setup Commands

**Quick reference for one-time setup using GitHub CLI**

---

## Prerequisites

```bash
# Install GitHub CLI (if not already installed)
# macOS:
brew install gh

# Login
gh auth login
```

---

## 1. Create Production Environment

### Option A: GitHub UI (Recommended)
1. Go to: **Settings** → **Environments**
2. Click: **New environment**
3. Name: `production`
4. Click: **Configure environment**

### Option B: GitHub CLI

```bash
# Create environment
gh api -X PUT repos/:owner/:repo/environments/production

# Note: Replace :owner and :repo with your actual values
# Example: gh api -X PUT repos/omar120489/traffic-crm-frontend-ts/environments/production
```

---

## 2. Add Environment Secrets

```bash
# Set deployment API key
gh secret set PROD_API_KEY \
  --env production \
  --body "your-deployment-token-here"

# Set deployment URL
gh secret set PROD_DEPLOY_URL \
  --env production \
  --body "https://your-deployer.example.com/deploy"

# Optional: Add provider-specific secrets
# For Vercel:
gh secret set VERCEL_TOKEN --env production --body "your-vercel-token"
gh secret set VERCEL_ORG_ID --env production --body "your-org-id"
gh secret set VERCEL_PROJECT_ID --env production --body "your-project-id"

# For AWS:
gh secret set AWS_ACCESS_KEY_ID --env production --body "your-access-key"
gh secret set AWS_SECRET_ACCESS_KEY --env production --body "your-secret-key"

# For Render:
gh secret set RENDER_API_KEY --env production --body "your-render-key"
gh secret set RENDER_SERVICE_ID --env production --body "your-service-id"
```

---

## 3. Add Environment Variables

```bash
# Set public URL (visible in UI, not masked)
gh variable set PROD_PUBLIC_URL \
  --env production \
  --body "https://app.example.com"

# Set health check URL
gh variable set PROD_HEALTH_URL \
  --env production \
  --body "https://app.example.com/health"

# Optional: Set additional variables
gh variable set PROD_REGION --env production --body "us-east-1"
gh variable set PROD_ENVIRONMENT --env production --body "production"
```

---

## 4. Configure Protection Rules (GitHub UI Only)

**Note:** Protection rules must be configured via GitHub UI. CLI support is limited.

1. Go to: **Settings** → **Environments** → **production**
2. Configure:
   - ✅ **Required reviewers**: Add `@omar120489`
   - ✅ **Deployment branches**: Select "Selected branches" → Add `main`
   - ⚠️ **Wait timer**: 2-5 minutes (optional)
3. Click: **Save protection rules**

---

## 5. Verify Setup

```bash
# List environments
gh api repos/:owner/:repo/environments | jq '.environments[].name'

# List environment secrets (names only, values are masked)
gh secret list --env production

# List environment variables
gh variable list --env production

# View environment details
gh api repos/:owner/:repo/environments/production | jq
```

---

## 6. Test Deployment Workflow

### Method 1: Manual Trigger

```bash
# Trigger workflow manually
gh workflow run deploy-production.yml

# Check status
gh run list --workflow=deploy-production.yml --limit 5

# Watch logs (replace RUN_ID with actual ID)
gh run watch <RUN_ID>
```

### Method 2: Tag-Based Trigger

```bash
# Create and push version tag
git tag v1.0.0
git push origin v1.0.0

# Monitor workflow
gh run list --workflow=deploy-production.yml --limit 1
```

---

## 7. Approve Deployment (During Workflow Run)

### Option A: GitHub UI
1. Go to: **Actions** tab
2. Select the running workflow
3. Click: **Review deployments**
4. Check: `production`
5. Click: **Approve and deploy**

### Option B: GitHub CLI

```bash
# List pending deployments
gh api repos/:owner/:repo/actions/runs/:run_id/pending_deployments

# Approve deployment (requires run_id and environment_id)
gh api -X POST repos/:owner/:repo/actions/runs/:run_id/pending_deployments \
  -f environment_ids[]=:environment_id \
  -f state=approved \
  -f comment="Approved via CLI"
```

---

## 8. Run Smoke Tests

```bash
# Trigger smoke tests manually
gh workflow run smoke-production.yml

# Check results
gh run list --workflow=smoke-production.yml --limit 5
```

---

## 9. Validate Workflow Syntax (Optional)

```bash
# Install actionlint (if not already installed)
# macOS:
brew install actionlint

# Lint workflow files
actionlint .github/workflows/deploy-production.yml
actionlint .github/workflows/smoke-production.yml
```

---

## 🔒 Security Best Practices

### Use OIDC Instead of Static Tokens (Recommended)

For AWS, GCP, or Azure, use OpenID Connect (OIDC) for short-lived tokens:

```yaml
# Example for AWS (add to deploy job)
permissions:
  id-token: write
  contents: read

steps:
  - name: Configure AWS credentials
    uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::ACCOUNT_ID:role/GitHubActionsRole
      aws-region: us-east-1
```

**Setup:**
1. Create OIDC provider in AWS IAM
2. Create IAM role with trust policy for GitHub
3. Remove `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` secrets
4. Update workflow to use OIDC

---

## 📊 Monitoring Commands

```bash
# View recent deployments
gh api repos/:owner/:repo/deployments \
  --jq '.[] | select(.environment=="production") | {id, ref, created_at, updated_at}'

# View deployment statuses
gh api repos/:owner/:repo/deployments/:deployment_id/statuses

# View workflow runs
gh run list --workflow=deploy-production.yml --limit 20

# View failed runs only
gh run list --workflow=deploy-production.yml --status=failure --limit 10

# Download workflow logs
gh run download <RUN_ID>
```

---

## 🔄 Common Operations

### Update Secrets

```bash
# Update existing secret
gh secret set PROD_API_KEY --env production --body "new-token-here"

# Delete secret
gh secret delete PROD_API_KEY --env production
```

### Update Variables

```bash
# Update existing variable
gh variable set PROD_PUBLIC_URL --env production --body "https://new-url.com"

# Delete variable
gh variable delete PROD_PUBLIC_URL --env production
```

### Cancel Running Deployment

```bash
# List running workflows
gh run list --workflow=deploy-production.yml --status=in_progress

# Cancel specific run
gh run cancel <RUN_ID>
```

### Re-run Failed Deployment

```bash
# Re-run entire workflow
gh run rerun <RUN_ID>

# Re-run only failed jobs
gh run rerun <RUN_ID> --failed
```

---

## 🧪 Rollback Testing

### Test Automatic Rollback

```bash
# 1. Deploy a version that will fail health check
# Temporarily modify your app to return 500 on /health

# 2. Trigger deployment
git tag v1.0.1-test-rollback
git push origin v1.0.1-test-rollback

# 3. Approve deployment when prompted

# 4. Watch health check fail and rollback trigger
gh run watch <RUN_ID>

# 5. Verify rollback completed successfully
# Check deployment history
gh api repos/:owner/:repo/deployments | jq '.[] | select(.environment=="production") | {ref, created_at}'
```

---

## 📚 Additional Resources

- [GitHub CLI Manual](https://cli.github.com/manual/)
- [GitHub Environments API](https://docs.github.com/en/rest/deployments/environments)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [OIDC with GitHub Actions](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)

---

## ✅ Setup Checklist

Copy and paste this checklist to track your setup:

```markdown
- [ ] Install GitHub CLI (`gh`)
- [ ] Authenticate with GitHub (`gh auth login`)
- [ ] Create `production` environment
- [ ] Add `PROD_API_KEY` secret
- [ ] Add `PROD_DEPLOY_URL` secret
- [ ] Add `PROD_PUBLIC_URL` variable
- [ ] Add `PROD_HEALTH_URL` variable
- [ ] Configure required reviewers (GitHub UI)
- [ ] Configure deployment branches (GitHub UI)
- [ ] Verify setup (`gh secret list --env production`)
- [ ] Customize deployment commands in workflow
- [ ] Test manual trigger (`gh workflow run deploy-production.yml`)
- [ ] Test tag-based trigger (`git tag v1.0.0 && git push origin v1.0.0`)
- [ ] Approve deployment and verify success
- [ ] Run smoke tests (`gh workflow run smoke-production.yml`)
- [ ] Test rollback (optional but recommended)
- [ ] Add deployment badge to README
- [ ] Document deployment process for team
```

---

**Last Updated:** October 26, 2025  
**Maintained by:** @omar120489

