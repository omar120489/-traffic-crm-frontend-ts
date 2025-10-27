# Frontend Deployment Checklist

## Pre-Deployment Setup

### GitHub Container Registry (GHCR)

- [ ] Enable GHCR in repo settings
  - Go to **Settings** → **Packages** → Enable GitHub Container Registry
  - Grant Actions workflow "Improve repository permissions"
  
- [ ] Verify `frontend-docker.yml` workflow is active
  - Should trigger on pushes to `main` that touch `apps/frontend/**`
  
- [ ] Test manual workflow dispatch:

  ```bash
  gh workflow run frontend-docker.yml
  ```

### Kubernetes Cluster

- [ ] Kubernetes cluster is running and accessible

  ```bash
  kubectl cluster-info
  kubectl get nodes
  ```

- [ ] Create deployment namespaces:

  ```bash
  kubectl create namespace traffic-crm-dev
  kubectl create namespace traffic-crm-staging
  kubectl create namespace traffic-crm-prod
  ```

- [ ] Install ingress controller (if not already present):

  ```bash
  kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
  ```

- [ ] Install cert-manager for TLS (optional):

  ```bash
  kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
  ```

### Image Pull Configuration

- [ ] If GHCR is private, create image pull secrets:

  ```bash
  kubectl create secret docker-registry ghcr-secret \
    --docker-server=ghcr.io \
    --docker-username=<YOUR_USERNAME> \
    --docker-password=<GITHUB_TOKEN> \
    --docker-email=<YOUR_EMAIL> \
    -n traffic-crm-prod
  ```

## Configuration Updates

### Domain Names

- [ ] Update domain in `infra/k8s/frontend/ingress-prod.yaml`

  ```yaml
  - host: your-domain.com  # Change this
  ```

- [ ] Update API endpoints in `infra/k8s/frontend/configmap-envs.yaml`

  ```yaml
  data:
    api-url: "https://api.your-domain.com"  # Change this
  ```

### Environment Variables

- [ ] Review all ConfigMap values for each environment:
  - Development: `traffic-crm-dev` namespace
  - Staging: `traffic-crm-staging` namespace
  - Production: `traffic-crm-prod` namespace

- [ ] Any secrets (API keys, etc.) should use Kubernetes Secrets instead of ConfigMaps

### Resource Requests/Limits

- [ ] Verify CPU/Memory requests match your cluster capacity:

  ```yaml
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 500m
      memory: 512Mi
  ```

## Deployment Steps

### Initial Deployment to Development

```bash
# 1. Verify manifests are valid
kustomize build infra/k8s/frontend/ --enable-alpha-plugins > /tmp/manifest.yaml
cat /tmp/manifest.yaml  # Review output

# 2. Apply to development namespace
kubectl apply -k infra/k8s/frontend/ -n traffic-crm-dev

# 3. Verify deployment
kubectl get all -n traffic-crm-dev
kubectl get pods -n traffic-crm-dev
kubectl logs -l app=traffic-crm-frontend -n traffic-crm-dev
```

### Test Access

```bash
# Port-forward to test locally
kubectl port-forward svc/traffic-crm-frontend 8080:80 -n traffic-crm-dev

# In another terminal
curl http://localhost:8080
```

### Deploy to Staging/Production

```bash
# Update image tag if needed
sed -i 's/latest/<COMMIT_SHA>/g' infra/k8s/frontend/kustomization.yaml

# Deploy to staging
kubectl apply -k infra/k8s/frontend/ -n traffic-crm-staging
kubectl rollout status deployment/traffic-crm-frontend -n traffic-crm-staging --timeout=5m

# Deploy to production (with approval)
kubectl apply -k infra/k8s/frontend/ -n traffic-crm-prod
kubectl rollout status deployment/traffic-crm-frontend -n traffic-crm-prod --timeout=5m
```

## CI/CD Integration Setup

### GitHub Actions Secrets

Add to repository **Settings** → **Secrets and variables** → **Actions**:

- [ ] `KUBE_CONFIG` (base64-encoded kubeconfig)

  ```bash
  cat ~/.kube/config | base64 | tr -d '\n' | xargs echo -n
  # Copy the output to repository secret
  ```

### Deploy Workflow

- [ ] Enable `deploy-frontend-k8s.yml` workflow
  - Should trigger after successful `frontend-docker.yml` build
  - Will auto-deploy to dev/staging/prod based on branch

### Manual Deployment (if not using GitOps)

```bash
# After docker image is built and pushed
kubectl set image deployment/traffic-crm-frontend \
  frontend=ghcr.io/omar120489/-traffic-crm-frontend-ts-frontend:<TAG> \
  -n traffic-crm-prod

kubectl rollout status deployment/traffic-crm-frontend -n traffic-crm-prod
```

## Post-Deployment Verification

- [ ] Pods are running:

  ```bash
  kubectl get pods -l app=traffic-crm-frontend -n traffic-crm-prod
  ```

- [ ] Service is accessible:

  ```bash
  kubectl get svc traffic-crm-frontend -n traffic-crm-prod
  ```

- [ ] Ingress is configured:

  ```bash
  kubectl get ingress -n traffic-crm-prod
  kubectl describe ingress traffic-crm-frontend -n traffic-crm-prod
  ```

- [ ] Health checks are passing:

  ```bash
  kubectl describe pod <pod-name> -n traffic-crm-prod | grep -A5 "Readiness\|Liveness"
  ```

- [ ] Logs are clean (no errors):

  ```bash
  kubectl logs -l app=traffic-crm-frontend -n traffic-crm-prod --tail=50
  ```

## Monitoring & Maintenance

### Daily Checks

```bash
# Check deployment status
kubectl get deployment traffic-crm-frontend -n traffic-crm-prod

# Watch pod events
kubectl get events -n traffic-crm-prod --sort-by='.lastTimestamp'

# Check resource usage
kubectl top nodes
kubectl top pods -n traffic-crm-prod
```

### Scaling

```bash
# Increase replicas if needed
kubectl scale deployment traffic-crm-frontend --replicas=3 -n traffic-crm-prod
```

### Rollback Plan

```bash
# View rollout history
kubectl rollout history deployment/traffic-crm-frontend -n traffic-crm-prod

# Rollback to previous version
kubectl rollout undo deployment/traffic-crm-frontend -n traffic-crm-prod

# Or rollback to specific revision
kubectl rollout undo deployment/traffic-crm-frontend --to-revision=2 -n traffic-crm-prod
```

## Troubleshooting

### Pod Fails to Start

```bash
kubectl describe pod <pod-name> -n traffic-crm-prod
kubectl logs <pod-name> -n traffic-crm-prod --previous  # If container crashed
```

### Image Pull Issues

```bash
kubectl get events -n traffic-crm-prod | grep ImagePull
kubectl get secret ghcr-secret -n traffic-crm-prod -o yaml  # Verify secret exists
```

### Service Not Accessible

```bash
kubectl get svc traffic-crm-frontend -n traffic-crm-prod
kubectl get endpoints traffic-crm-frontend -n traffic-crm-prod
kubectl port-forward svc/traffic-crm-frontend 8080:80 -n traffic-crm-prod
```

## Cleanup (if needed)

```bash
# Delete deployment
kubectl delete -k infra/k8s/frontend/ -n traffic-crm-prod

# Delete namespace
kubectl delete namespace traffic-crm-prod
```

## Notes

- Keep `infra/k8s/frontend/kustomization.yaml` in sync with deployed image tags
- Use GitOps (ArgoCD/Flux) for production environments for better auditability
- Regularly update base image (`node:20-alpine`, `nginx:alpine`) for security patches
- Monitor pod resource usage and adjust requests/limits accordingly
