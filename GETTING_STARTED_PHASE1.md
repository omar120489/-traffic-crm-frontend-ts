# 🚀 Phase 1 Setup - Complete Guide

## What You Have Ready

Everything is prepared and waiting for you:

✅ Docker image builds automatically (frontend-docker.yml)
✅ Kubernetes manifests configured (infra/k8s/frontend/)
✅ Auto-deploy workflow ready (deploy-frontend-k8s.yml)
✅ Complete documentation
✅ Quick setup scripts

---

## Phase 1: Your Action Items

### Step 1: Enable GHCR (GitHub)

Go to your repository settings:

```
GitHub → Settings → Packages → Enable GitHub Container Registry
→ Grant "Improve repository permissions" to Actions
```

**Why?** This allows your CI/CD workflows to push Docker images.

---

### Step 2: Update Configuration Files

Your actual domain and API endpoints need to be in the manifests.

**Option A - Quick (Using sed):**

```bash
# Replace example domain with YOUR domain
sed -i 's/crm.example.com/your-actual-domain.com/g' \
  infra/k8s/frontend/ingress-prod.yaml \
  infra/k8s/frontend/configmap-envs.yaml

# Replace API URLs
sed -i 's/api-staging.traffic-crm.example.com/api-staging.your-actual-domain.com/g' \
  infra/k8s/frontend/configmap-envs.yaml

sed -i 's/api.traffic-crm.example.com/api.your-actual-domain.com/g' \
  infra/k8s/frontend/configmap-envs.yaml
```

**Option B - Manual (Using your editor):**

- Edit `infra/k8s/frontend/ingress-prod.yaml`
  - Change `crm.example.com` → your domain (2 places)
- Edit `infra/k8s/frontend/configmap-envs.yaml`
  - Update API URLs for dev/staging/prod

---

### Step 3: Set Up Kubernetes Infrastructure

```bash
# 1. Create namespaces for each environment
kubectl create namespace traffic-crm-dev
kubectl create namespace traffic-crm-staging
kubectl create namespace traffic-crm-prod

# 2. Install nginx ingress controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# 3. (Optional but recommended) Install cert-manager for TLS
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

**Verify it worked:**

```bash
kubectl get namespaces | grep traffic-crm     # Should show 3 namespaces
kubectl get pods -n ingress-nginx | grep -i controller  # Should show controller pod
kubectl get pods -n cert-manager               # If you installed cert-manager
```

---

### Step 4: (If GHCR is Private) Set Up Image Pull Secrets

Skip this if your GHCR repository is public.

```bash
# Generate a GitHub Personal Access Token
# → Go to https://github.com/settings/tokens/new
# → Scopes needed: read:packages
# → Copy the token

# Create image pull secret in each namespace
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=YOUR_GITHUB_TOKEN \
  --docker-email=YOUR_EMAIL \
  -n traffic-crm-dev

kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=YOUR_GITHUB_TOKEN \
  --docker-email=YOUR_EMAIL \
  -n traffic-crm-staging

kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=YOUR_GITHUB_TOKEN \
  --docker-email=YOUR_EMAIL \
  -n traffic-crm-prod
```

Then add to `infra/k8s/frontend/base-deployment.yaml`:

```yaml
spec:
  template:
    spec:
      imagePullSecrets:
        - name: ghcr-secret
      containers:
        - name: frontend
```

---

## ✅ Verification Checklist

After completing all steps above, verify everything is ready:

```bash
# Check namespaces
kubectl get namespaces | grep traffic-crm
# Output should show: traffic-crm-dev, traffic-crm-staging, traffic-crm-prod

# Check ingress controller
kubectl get pods -n ingress-nginx | grep controller
# Output should show at least 1 running nginx ingress controller pod

# (If using cert-manager)
kubectl get pods -n cert-manager
# Output should show cert-manager pods running

# (If using private GHCR)
kubectl get secrets -n traffic-crm-prod
# Output should show ghcr-secret exists
```

---

## 🎯 What's Ready for Phase 2

Once you complete Phase 1, you'll be able to:

```bash
# Deploy to development environment
kubectl apply -k infra/k8s/frontend/ -n traffic-crm-dev

# Verify deployment
kubectl get pods -n traffic-crm-dev
kubectl logs -l app=traffic-crm-frontend -n traffic-crm-dev

# Test access (port-forward)
kubectl port-forward svc/traffic-crm-frontend 8080:80 -n traffic-crm-dev
curl http://localhost:8080
```

---

## 📋 Files to Reference

- **Quick Checklist**: `PHASE1_SETUP_QUICK.md` (this was created for you!)
- **Detailed Guide**: `K8S_SETUP_GUIDE.md` (full explanations)
- **Full Documentation**: `infra/k8s/frontend/DEPLOYMENT_CHECKLIST.md`
- **K8s Manifests**: `infra/k8s/frontend/*.yaml`

---

## 💡 Troubleshooting Phase 1

| Issue | Fix |
|-------|-----|
| Namespaces already exist | That's fine! Proceed to next step |
| Ingress controller stuck in pending | Check cluster resources, may need more memory |
| GHCR image push fails | Verify repo permissions were updated in Settings |
| kubectl commands not found | Ensure kubectl is installed and configured |

---

## 🚀 Next Steps

1. **Complete Phase 1 steps above** (Enable GHCR, update configs, create namespaces)
2. **Let me know when ready** → I'll guide you through Phase 2 (Deployment)
3. **Phase 2 includes**: Deploy to dev → test → deploy to prod

---

## 📞 Questions?

All details are in:

- `K8S_SETUP_GUIDE.md` - Detailed explanations
- `infra/k8s/frontend/DEPLOYMENT_CHECKLIST.md` - Full checklist
- `infra/k8s/frontend/DEPLOYMENT.md` - Architecture & deployment guide

**Ready to start Phase 1?** Follow `PHASE1_SETUP_QUICK.md` or `K8S_SETUP_GUIDE.md` and let me know when you're done! 👍
