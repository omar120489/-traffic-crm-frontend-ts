# Phase 1 Setup Checklist

## ✅ Quick Reference - What You Need to Do

### 1️⃣ Enable GHCR (5 min)

```
→ Go to https://github.com/omar120489/-traffic-crm-frontend-ts
→ Settings → Packages → Enable GitHub Container Registry
→ Improve repository permissions
→ ✅ Done
```

### 2️⃣ Update Domain Names (5 min)

**Update ingress-prod.yaml:**

```bash
# Replace crm.example.com with your domain
sed -i 's/crm.example.com/YOUR_DOMAIN_HERE/g' infra/k8s/frontend/ingress-prod.yaml
```

**Update configmap-envs.yaml:**

```bash
# Replace example API URLs with your actual API endpoints
sed -i 's|api-staging.traffic-crm.example.com|api-staging.YOUR_DOMAIN_HERE|g' infra/k8s/frontend/configmap-envs.yaml
sed -i 's|api.traffic-crm.example.com|api.YOUR_DOMAIN_HERE|g' infra/k8s/frontend/configmap-envs.yaml
```

### 3️⃣ Set Up Kubernetes (10 min)

```bash
# Create namespaces
kubectl create namespace traffic-crm-dev
kubectl create namespace traffic-crm-staging
kubectl create namespace traffic-crm-prod

# Install ingress controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Verify everything
kubectl get namespaces | grep traffic-crm
kubectl get pods -n ingress-nginx | grep controller
```

### 4️⃣ (Optional) Set Up TLS

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Verify
kubectl get pods -n cert-manager
```

### 5️⃣ (If Private GHCR) Image Pull Secrets

```bash
# Create GitHub token at: https://github.com/settings/tokens/new
# Scopes needed: read:packages

# Then create secrets in each namespace
for ns in traffic-crm-dev traffic-crm-staging traffic-crm-prod; do
  kubectl create secret docker-registry ghcr-secret \
    --docker-server=ghcr.io \
    --docker-username=YOUR_USERNAME \
    --docker-password=YOUR_GITHUB_TOKEN \
    --docker-email=YOUR_EMAIL \
    -n $ns
done
```

---

## 📋 Verification

```bash
# All namespaces created?
kubectl get namespaces | grep traffic-crm

# Ingress controller running?
kubectl get pods -n ingress-nginx

# (Optional) cert-manager running?
kubectl get pods -n cert-manager

# (If using private GHCR) secrets created?
kubectl get secrets -n traffic-crm-prod | grep ghcr
```

---

## ⏭️ What's Next

Once you complete these steps, I'll help you with **Phase 2: Deploy** which includes:

```bash
# Test deployment to development
kubectl apply -k infra/k8s/frontend/ -n traffic-crm-dev

# Verify it's working
kubectl get pods -n traffic-crm-dev
kubectl logs -l app=traffic-crm-frontend -n traffic-crm-dev
```

---

## 📚 Full Documentation

For detailed explanations of each step, see:

- `K8S_SETUP_GUIDE.md` - Detailed setup guide
- `K8S_DEPLOYMENT_INDEX.md` - Complete index
- `infra/k8s/frontend/DEPLOYMENT_CHECKLIST.md` - Full checklist
