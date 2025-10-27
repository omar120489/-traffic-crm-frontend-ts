# Traffic CRM Frontend - Kubernetes Deployment Guide

## Overview

This guide covers deploying the Traffic CRM frontend application to Kubernetes using the provided manifests and Kustomize for environment-specific configuration.

## Prerequisites

- Kubernetes cluster (v1.19+)
- `kubectl` configured to access your cluster
- `kustomize` installed (or use `kubectl apply -k`)
- GHCR image available: `ghcr.io/omar120489/-traffic-crm-frontend-ts-frontend:latest`
- Ingress controller installed (nginx-ingress recommended)
- cert-manager for TLS (optional but recommended)

## Architecture

```
Internet
    ↓
Ingress (nginx, with TLS)
    ↓
Service (ClusterIP, port 80)
    ↓
Deployment (2 replicas, rolling updates)
    ↓
Pods (Nginx containers, non-root user)
```

## Environment Setup

### 1. Create Namespaces

```bash
kubectl create namespace traffic-crm-dev
kubectl create namespace traffic-crm-staging
kubectl create namespace traffic-crm-prod
```

### 2. Configure GHCR Access (if using private registry)

Create an image pull secret for each namespace:

```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=<USERNAME> \
  --docker-password=<GITHUB_TOKEN> \
  --docker-email=<EMAIL> \
  -n traffic-crm-dev

# Repeat for -staging and -prod namespaces
```

Then add to the deployment's `imagePullSecrets`:

```yaml
spec:
  template:
    spec:
      imagePullSecrets:
        - name: ghcr-secret
```

### 3. Deploy to Development

```bash
kubectl apply -k infra/k8s/frontend/ -n traffic-crm-dev
```

### 4. Deploy to Staging/Production

Update the `kustomization.yaml` image tag and apply:

```bash
# Update image tag in kustomization.yaml
sed -i 's/latest/<COMMIT_SHA>/g' infra/k8s/frontend/kustomization.yaml

# Deploy
kubectl apply -k infra/k8s/frontend/ -n traffic-crm-staging
kubectl apply -k infra/k8s/frontend/ -n traffic-crm-prod
```

## Configuration

### API Endpoint

Update `infra/k8s/frontend/configmap-envs.yaml` with your actual API endpoints:

```yaml
data:
  api-url: "https://api.your-domain.com"  # Update this
  base-name: "/"
```

### Scaling Replicas

Edit `kustomization.yaml`:

```yaml
replicas:
  - name: traffic-crm-frontend
    count: 3  # Adjust as needed
```

### Resource Limits

Adjust in `base-deployment.yaml`:

```yaml
resources:
  requests:
    cpu: 100m       # Adjust based on traffic
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 512Mi
```

## Verification

### Check Deployment Status

```bash
kubectl get deployment traffic-crm-frontend -n traffic-crm-prod
kubectl get pods -l app=traffic-crm-frontend -n traffic-crm-prod
kubectl get svc traffic-crm-frontend -n traffic-crm-prod
```

### View Logs

```bash
kubectl logs -l app=traffic-crm-frontend -n traffic-crm-prod -f
```

### Test Health

```bash
kubectl port-forward svc/traffic-crm-frontend 8080:80 -n traffic-crm-prod
curl http://localhost:8080
```

## Security Considerations

✅ **Implemented:**

- Non-root user (UID 65534)
- Read-only root filesystem
- No privilege escalation
- Network policies (ingress/egress)
- Pod anti-affinity (spreads replicas across nodes)
- SecurityContext with dropped capabilities
- Health checks (liveness & readiness probes)

## Monitoring & Observability

### Add Prometheus Metrics (Optional)

Add to deployment if you're using Prometheus:

```yaml
podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "9113"
  prometheus.io/path: "/metrics"
```

### Logs

Check pod logs:

```bash
kubectl logs <pod-name> -n traffic-crm-prod
```

## Troubleshooting

### Pod Not Starting

```bash
kubectl describe pod <pod-name> -n traffic-crm-prod
kubectl get events -n traffic-crm-prod
```

### Image Pull Failures

```bash
# Check image pull secrets
kubectl get secrets -n traffic-crm-prod

# Test image access
kubectl run test --image=ghcr.io/omar120489/-traffic-crm-frontend-ts-frontend:latest -n traffic-crm-prod
```

### Ingress Not Working

```bash
kubectl get ingress -n traffic-crm-prod
kubectl describe ingress traffic-crm-frontend -n traffic-crm-prod
```

## CI/CD Integration

The frontend-docker GitHub Actions workflow automatically:

1. Builds the Docker image
2. Pushes to `ghcr.io/omar120489/-traffic-crm-frontend-ts-frontend:<tag>`
3. Tags with: branch, commit SHA, and 'latest'

To automatically deploy after image push, add a second workflow that:

1. Waits for the docker build to complete
2. Updates the image tag in `kustomization.yaml`
3. Applies the manifest with `kubectl`

Example ArgoCD GitOps approach:

```yaml
# .github/workflows/deploy-frontend.yml
on:
  workflow_run:
    workflows: ["Build & Publish Frontend Image"]
    types: [completed]

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    steps:
      - uses: actions/checkout@v4
      - name: Update kustomization image
        run: |
          cd infra/k8s/frontend
          kustomize edit set image ghcr.io/omar120489/-traffic-crm-frontend-ts-frontend:${{ github.sha }}
      - name: Commit and push
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add infra/k8s/frontend/kustomization.yaml
          git commit -m "chore: update frontend image to ${{ github.sha }}"
          git push
```

## Rollback

```bash
kubectl rollout undo deployment/traffic-crm-frontend -n traffic-crm-prod
kubectl rollout history deployment/traffic-crm-frontend -n traffic-crm-prod
```

## Next Steps

1. **Update domain names** in `ingress-prod.yaml` and `configmap-envs.yaml`
2. **Set up cert-manager** for automatic TLS (optional)
3. **Configure GHCR image pull secrets** if using private registry
4. **Set up monitoring/logging** integration
5. **Add GitOps workflow** (ArgoCD, Flux, or custom)
