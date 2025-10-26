# 🔄 Deployment Workflows Comparison

Quick reference comparing staging vs production deployment workflows.

---

## 📊 Feature Comparison

| Feature | Staging (`release.yml`) | Production (`deploy-production.yml`) |
|---------|------------------------|-------------------------------------|
| **Trigger** | Version tags (`v*.*.*`) | Version tags + Manual dispatch |
| **Approval Required** | ❌ No | ✅ Yes (manual approval gate) |
| **Environment** | None (removed) | `production` (required) |
| **Health Check** | ❌ No | ✅ Yes (10 retries, 50s) |
| **Rollback** | ❌ Manual only | ✅ Automatic on failure |
| **Concurrency** | Allows multiple | Single deployment only |
| **Timeout** | No explicit limit | 20-30 min per job |
| **Artifact Retention** | 30 days | 7 days |
| **Notifications** | Slack (optional) | GitHub notices |
| **Build Strategy** | Build per job | Build once, reuse artifact |

---

## 🎯 When to Use Each

### Use Staging Workflow (`release.yml`)

- ✅ Testing release candidates
- ✅ Automated deployments
- ✅ No approval needed
- ✅ Quick iteration
- ✅ Non-critical environments

**Example:**
```bash
git tag v1.0.0-rc.1
git push origin v1.0.0-rc.1
```

### Use Production Workflow (`deploy-production.yml`)

- ✅ Production deployments
- ✅ Manual approval required
- ✅ Automatic health checks
- ✅ Automatic rollback
- ✅ Critical environments

**Example:**
```bash
# Manual trigger
gh workflow run deploy-production.yml

# Or tag-based
git tag v1.0.0
git push origin v1.0.0
```

---

## 🔒 Security Comparison

| Security Feature | Staging | Production |
|------------------|---------|------------|
| Manual approval | ❌ | ✅ |
| Environment secrets | ❌ | ✅ |
| Deployment branches | ❌ | ✅ (main only) |
| Least-privilege tokens | ⚠️ Partial | ✅ Full |
| Audit trail | ✅ | ✅ |
| Rollback capability | ❌ | ✅ |

---

## 📈 Deployment Flow Comparison

### Staging Flow (Simplified)

```
Tag pushed
  ↓
Build & Test
  ↓
Deploy (automatic)
  ↓
Notify (Slack)
  ↓
Done ✅
```

**Duration:** ~10-15 minutes

### Production Flow (Robust)

```
Tag pushed or manual trigger
  ↓
Build & Test (20 min)
  ↓
🛑 WAIT FOR APPROVAL
  ↓
Deploy (30 min)
  ↓
Health Check (10 min)
  ├─ Success → Done ✅
  └─ Failure → Rollback ↩️
```

**Duration:** ~10-15 minutes + approval wait time

---

## 🎨 Customization Examples

### Staging: Quick Deploy

```yaml
- name: Deploy to Staging
  run: |
    echo "Deploying to staging..."
    # Fast, no checks
    vercel deploy --staging
```

### Production: Safe Deploy

```yaml
- name: Deploy to Production
  environment: production  # Requires approval
  run: |
    echo "Deploying to production..."
    # With health checks
    vercel deploy --prod
    
- name: Health Check
  run: |
    for i in {1..10}; do
      curl -f https://app.example.com/health && exit 0
      sleep 5
    done
    exit 1
```

---

## 🚀 Migration Path

### From Staging to Production

1. **Test in staging first:**
   ```bash
   git tag v1.0.0-rc.1
   git push origin v1.0.0-rc.1
   ```

2. **Verify staging deployment:**
   - Check application works
   - Run smoke tests
   - Verify no errors

3. **Promote to production:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

4. **Approve production deployment:**
   - Go to Actions tab
   - Review deployment
   - Click "Approve and deploy"

5. **Monitor health check:**
   - Watch for automatic health checks
   - Verify application is healthy
   - Rollback happens automatically if needed

---

## 📝 Configuration Files

### Staging

- **Workflow:** `.github/workflows/release.yml`
- **Secrets:** Repository-level (optional)
- **Environment:** None required
- **Documentation:** See workflow comments

### Production

- **Workflow:** `.github/workflows/deploy-production.yml`
- **Secrets:** Environment-level (required)
- **Environment:** `production` (required)
- **Documentation:** 
  - [PRODUCTION_DEPLOYMENT_SETUP.md](./PRODUCTION_DEPLOYMENT_SETUP.md)
  - [QUICK_START_PRODUCTION.md](./QUICK_START_PRODUCTION.md)

---

## ⚡ Performance Tips

### Staging: Optimize for Speed

```yaml
# Skip non-critical checks
- name: Quick lint
  run: pnpm lint --max-warnings 10

# Parallel builds
strategy:
  matrix:
    app: [frontend, backend]
```

### Production: Optimize for Safety

```yaml
# Full checks, no shortcuts
- name: Strict lint
  run: pnpm lint

# Sequential builds for reliability
- name: Build frontend
  run: pnpm --filter ./apps/frontend build
- name: Build backend
  run: pnpm --filter ./apps/core-api build
```

---

## 🎯 Best Practices

### Staging

- ✅ Deploy frequently (multiple times per day)
- ✅ Use for testing new features
- ✅ Allow automatic deployments
- ✅ Keep deployment fast (<15 min)
- ✅ Use for demo/preview environments

### Production

- ✅ Deploy during low-traffic hours
- ✅ Require manual approval
- ✅ Always run health checks
- ✅ Have rollback plan ready
- ✅ Monitor post-deployment
- ✅ Document each deployment
- ✅ Use semantic versioning

---

## 📚 Related Documentation

- [GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [Deployment Protection Rules](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#deployment-protection-rules)
- [Workflow Concurrency](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#concurrency)

---

**Last Updated:** October 26, 2025  
**Maintained by:** @omar120489
