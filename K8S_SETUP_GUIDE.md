# Kubernetes Configuration Setup Guide

## Step 2a: Update Ingress Domain (ingress-prod.yaml)

**Current**: `crm.example.com`

Replace with your actual domain:

```bash
# Option 1: Direct edit
sed -i 's/crm.example.com/your-crm-domain.com/g' infra/k8s/frontend/ingress-prod.yaml

# Option 2: Manual edit
vim infra/k8s/frontend/ingress-prod.yaml
# Find: crm.example.com (appears 2 times)
# Replace with: your-crm-domain.com
```

### What to verify after editing

```yaml
tls:
  - hosts:
      - your-crm-domain.com  # ← Should match your domain
    secretName: traffic-crm-frontend-tls
rules:
  - host: your-crm-domain.com  # ← Should match your domain
```

---

## Step 2b: Update API Endpoints (configmap-envs.yaml)

**Current endpoints (placeholders)**:

- Dev: `http://traffic-crm-api:3000`
- Staging: `https://api-staging.traffic-crm.example.com`
- Prod: `https://api.traffic-crm.example.com`

Update with your actual API endpoints:

```bash
# Development namespace (if using local API)
kubectl -n traffic-crm-dev create configmap traffic-crm-frontend-config \
  --from-literal=api-url="http://traffic-crm-api:3000" \
  --from-literal=base-name="/" \
  --dry-run=client -o yaml | kubectl apply -f -

# Staging namespace
kubectl -n traffic-crm-staging create configmap traffic-crm-frontend-config \
  --from-literal=api-url="https://api-staging.your-domain.com" \
  --from-literal=base-name="/" \
  --dry-run=client -o yaml | kubectl apply -f -

# Production namespace
kubectl -n traffic-crm-prod create configmap traffic-crm-frontend-config \
  --from-literal=api-url="https://api.your-domain.com" \
  --from-literal=base-name="/" \
  --dry-run=client -o yaml | kubectl apply -f -
```

**OR manually edit**: `infra/k8s/frontend/configmap-envs.yaml`

```yaml
---
# Development Environment
apiVersion: v1
kind: ConfigMap
metadata:
  name: traffic-crm-frontend-config
  namespace: traffic-crm-dev
data:
  api-url: "http://traffic-crm-api:3000"  # ← Update this
  base-name: "/"
---
# Staging Environment
apiVersion: v1
kind: ConfigMap
metadata:
  name: traffic-crm-frontend-config
  namespace: traffic-crm-staging
data:
  api-url: "https://api-staging.your-domain.com"  # ← Update this
  base-name: "/"
---
# Production Environment
apiVersion: v1
kind: ConfigMap
metadata:
  name: traffic-crm-frontend-config
  namespace: traffic-crm-prod
data:
  api-url: "https://api.your-domain.com"  # ← Update this
  base-name: "/"
```

---

## Step 3: Set Up Kubernetes Infrastructure

Run these commands to prepare your cluster:

```bash
# 1. Create namespaces
kubectl create namespace traffic-crm-dev
kubectl create namespace traffic-crm-staging
kubectl create namespace traffic-crm-prod

# 2. Verify namespaces created
kubectl get namespaces | grep traffic-crm

# 3. Install nginx-ingress controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# 4. Verify ingress controller is running
kubectl get pods -n ingress-nginx | grep nginx-ingress-controller

# 5. (Optional) Install cert-manager for TLS
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# 6. Verify cert-manager is running
kubectl get pods -n cert-manager
```

---

## Step 4: Set Up Image Pull Secrets (If GHCR is Private)

If your GHCR repository is private, create image pull secrets:

```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=<YOUR_GITHUB_USERNAME> \
  --docker-password=<GITHUB_PERSONAL_ACCESS_TOKEN> \
  --docker-email=<YOUR_EMAIL> \
  -n traffic-crm-dev

kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=<YOUR_GITHUB_USERNAME> \
  --docker-password=<GITHUB_PERSONAL_ACCESS_TOKEN> \
  --docker-email=<YOUR_EMAIL> \
  -n traffic-crm-staging

kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=<YOUR_GITHUB_USERNAME> \
  --docker-password=<GITHUB_PERSONAL_ACCESS_TOKEN> \
  --docker-email=<YOUR_EMAIL> \
  -n traffic-crm-prod
```

**Note**: You can generate a GITHUB_PERSONAL_ACCESS_TOKEN at:
<https://github.com/settings/tokens/new>

- Required scopes: `read:packages`

Then update `infra/k8s/frontend/base-deployment.yaml` to use the secret:

```yaml
spec:
  template:
    spec:
      imagePullSecrets:
        - name: ghcr-secret  # Add this
      containers:
        - name: frontend
          image: ghcr.io/omar120489/-traffic-crm-frontend-ts-frontend:latest
```

---

## ✅ Verification Checklist

After completing Steps 1-4:

- [ ] GHCR enabled in GitHub Settings
- [ ] `ingress-prod.yaml` updated with your domain
- [ ] `configmap-envs.yaml` updated with your API endpoints
- [ ] 3 namespaces created (`kubectl get namespaces`)
- [ ] nginx-ingress controller running (`kubectl get pods -n ingress-nginx`)
- [ ] (Optional) cert-manager running (`kubectl get pods -n cert-manager`)
- [ ] (If private GHCR) image pull secrets created

---

## Next Action

Once you complete these steps, you're ready for **Phase 2: Deploy**!

Confirm when you've completed these and I'll guide you through deploying to development.
