# 🚀 Production Deployment Cheat Sheet

**Quick reference card for production deployments**

---

## 📋 One-Time Setup (10 min)

```bash
# 1. Create environment (GitHub UI)
Settings → Environments → "production"

# 2. Add secrets
gh secret set PROD_API_KEY --env production --body "TOKEN"
gh secret set PROD_DEPLOY_URL --env production --body "URL"

# 3. Add variables
gh variable set PROD_PUBLIC_URL --env production --body "https://app.com"
gh variable set PROD_HEALTH_URL --env production --body "https://app.com/health"

# 4. Configure protection (GitHub UI)
Required reviewers: @omar120489
Deployment branches: main
```

---

## 🎯 Deploy Commands

```bash
# Manual deployment
gh workflow run deploy-production.yml

# Tag-based deployment
git tag v1.0.0 && git push origin v1.0.0

# Monitor deployment
gh run list --workflow=deploy-production.yml --limit 5
gh run watch <RUN_ID>
```

---

## ✅ Approve Deployment

```bash
# GitHub UI
Actions → Select run → Review deployments → Approve

# Or wait for email notification
```

---

## 🧪 Run Smoke Tests

```bash
# Manual trigger
gh workflow run smoke-production.yml

# Check results
gh run list --workflow=smoke-production.yml --limit 5
```

---

## 🔄 Rollback

```bash
# Automatic rollback triggers if health check fails
# Manual rollback: deploy previous version tag

git tag v1.0.0-rollback
git push origin v1.0.0-rollback
```

---

## 📊 Monitor Deployments

```bash
# View recent deployments
gh api repos/:owner/:repo/deployments | jq '.[] | select(.environment=="production")'

# View workflow runs
gh run list --workflow=deploy-production.yml --limit 10

# View logs
gh run view <RUN_ID> --log
```

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| Workflow doesn't trigger | Check tag format: `v*.*.*` |
| Health check fails | Verify `/health` endpoint returns 200 |
| Approval not required | Configure required reviewers in GitHub UI |
| Secrets not found | Add secrets to `production` environment |

---

## 📚 Documentation

- **Quick Start**: `.github/QUICK_START_PRODUCTION.md`
- **Setup Commands**: `.github/SETUP_COMMANDS.md`
- **Validation**: `.github/VALIDATION_PLAN.md`
- **Full Guide**: `.github/PRODUCTION_DEPLOYMENT_SETUP.md`

---

## 🔗 Quick Links

- [Workflow File](./workflows/deploy-production.yml)
- [Smoke Tests](./workflows/smoke-production.yml)
- [Infrastructure Guide](./README.md)
- [Deployment Comparison](./DEPLOYMENT_COMPARISON.md)

---

**Print this page for quick reference during deployments**


