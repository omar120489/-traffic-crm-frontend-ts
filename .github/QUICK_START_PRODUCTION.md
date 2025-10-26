# 🚀 Production Deployment Quick Start

**5-Minute Setup Guide**

---

## ✅ Prerequisites Checklist

Before deploying to production, complete these steps:

- [ ] Create `production` environment in GitHub
- [ ] Add `PROD_API_KEY` secret
- [ ] Add `PROD_DEPLOY_URL` secret
- [ ] Add `PROD_PUBLIC_URL` variable (optional)
- [ ] Configure required reviewers
- [ ] Customize deployment commands

---

## 🔧 Step 1: Create Environment (2 min)

1. Go to: **Settings** → **Environments**
2. Click: **New environment**
3. Name: `production`
4. Click: **Configure environment**

---

## 🔐 Step 2: Add Secrets (2 min)

In the `production` environment:

### Required Secrets

| Secret | Value | Example |
|--------|-------|---------|
| `PROD_API_KEY` | Your deployment token | `sk_prod_abc123...` |
| `PROD_DEPLOY_URL` | Deployment endpoint | `https://api.vercel.com/v1/deploy` |

**How to add:**
1. Scroll to **Environment secrets**
2. Click **Add secret**
3. Enter name and value
4. Click **Add secret**

---

## 🛡️ Step 3: Configure Protection (1 min)

In the same environment settings:

1. **Required reviewers**: Add `@omar120489`
2. **Deployment branches**: Select `main` only
3. **Wait timer**: 2-5 minutes (optional)
4. Click **Save protection rules**

---

## 🎯 Step 4: Customize Deployment

Edit `.github/workflows/deploy-production.yml`:

### For Vercel:

```yaml
- name: Deploy to Vercel
  env:
    VERCEL_TOKEN: ${{ secrets.PROD_API_KEY }}
  run: |
    npm install -g vercel
    cd apps/frontend
    vercel deploy --prod --token=$VERCEL_TOKEN
```

### For AWS:

```yaml
- name: Deploy to AWS
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.PROD_API_KEY }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
  run: |
    tar -xzf artifact.tgz
    aws s3 sync dist_bundle/frontend s3://your-bucket --delete
```

### For Render:

```yaml
- name: Deploy to Render
  env:
    RENDER_API_KEY: ${{ secrets.PROD_API_KEY }}
  run: |
    curl -X POST "https://api.render.com/v1/services/${{ secrets.RENDER_SERVICE_ID }}/deploys" \
      -H "Authorization: Bearer $RENDER_API_KEY"
```

---

## 🧪 Step 5: Test Deployment

### Option A: Manual Trigger (Recommended)

```bash
gh workflow run deploy-production.yml
```

### Option B: Version Tag

```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## 📊 Monitoring Deployment

### Check Status

```bash
# List recent runs
gh run list --workflow=deploy-production.yml --limit 5

# View specific run
gh run view <RUN_ID>

# View logs
gh run view <RUN_ID> --log
```

### Approve Deployment

1. Go to **Actions** tab
2. Select the running workflow
3. Click **Review deployments**
4. Check `production`
5. Click **Approve and deploy**

---

## 🔄 Deployment Flow

```
1. Trigger (tag or manual)
   ↓
2. Build & Test (20 min)
   ├─ Typecheck
   ├─ Lint
   ├─ Tests
   └─ Build artifacts
   ↓
3. Deploy (30 min)
   🛑 WAITS FOR YOUR APPROVAL
   ↓
4. Health Check (10 min)
   ├─ Wait 15s for rollout
   └─ Retry /health 10 times
   ↓
5a. Success ✅
    └─ Deployment complete

5b. Failure ❌
    └─ Auto-rollback to previous version
```

---

## ⚠️ Troubleshooting

### "Value 'production' is not valid"

**Fix:** Create the `production` environment (Step 1)

---

### Deployment hangs at "Deploy to Production"

**Fix:** Approve the deployment in GitHub Actions UI

---

### Health check fails

**Fix:** 
1. Verify `PROD_HEALTH_URL` is correct
2. Ensure app exposes `/health` endpoint
3. Check application logs

---

### Secrets not found

**Fix:** Add secrets to the `production` environment (Step 2)

---

## 📚 Full Documentation

For detailed information, see:
- [PRODUCTION_DEPLOYMENT_SETUP.md](./PRODUCTION_DEPLOYMENT_SETUP.md) - Complete setup guide
- [README.md](./README.md) - Infrastructure overview

---

## ✅ Post-Setup Checklist

After first successful deployment:

- [ ] Verify health check works
- [ ] Test rollback (force health check failure)
- [ ] Document deployment process for team
- [ ] Set up monitoring/alerts
- [ ] Configure Slack notifications (optional)

---

**Status:** Ready for production ✅  
**Questions?** See [PRODUCTION_DEPLOYMENT_SETUP.md](./PRODUCTION_DEPLOYMENT_SETUP.md)


