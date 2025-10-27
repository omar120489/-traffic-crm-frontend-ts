# Traffic CRM Frontend Deployment - Quick Reference

## What's Included

```
infra/k8s/frontend/
├── base-deployment.yaml       # K8s Deployment manifest with security hardening
├── service.yaml               # ClusterIP Service
├── serviceaccount.yaml        # Service Account
├── networkpolicy.yaml         # Ingress/Egress network policies
├── configmap-envs.yaml        # Environment-specific configurations (dev/staging/prod)
├── ingress-prod.yaml          # Production ingress with TLS
├── kustomization.yaml         # Kustomize configuration for easy management
├── DEPLOYMENT.md              # Full deployment guide
├── DEPLOYMENT_CHECKLIST.md    # Step-by-step checklist
└── README.md                  # This file

.github/workflows/
├── frontend-docker.yml        # Builds & pushes Docker image to GHCR
└── deploy-frontend-k8s.yml    # Auto-deploys from GHCR to K8s clusters
```

## Quick Start

### 1. Enable GHCR (One-Time Setup)

```
Repository → Settings → Packages → Enable GitHub Container Registry
Grant workflow permissions: "Improve repository permissions"
```

### 2. Prepare Kubernetes

```bash
# Create namespaces
kubectl create namespace traffic-crm-dev traffic-crm-staging traffic-crm-prod

# Install ingress-nginx (if needed)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
```

### 3. Configure Manifests

Update before deploying:

- `ingress-prod.yaml`: Change domain from `crm.example.com`
- `configmap-envs.yaml`: Update API URLs for each environment

### 4. Deploy Development

```bash
kubectl apply -k infra/k8s/frontend/ -n traffic-crm-dev
kubectl get pods -n traffic-crm-dev
```

### 5. Deploy to Production (via GitHub Actions)

```bash
# Push to main → triggers docker build → triggers K8s deploy
git push origin main
```

## Key Features

✅ **Security**

- Non-root user (nginx runs as appuser)
- Read-only filesystem
- Network policies
- Pod anti-affinity
- No privilege escalation

✅ **Reliability**

- Liveness & readiness probes
- Rolling updates (1 surge, 0 unavailable)
- Pod disruption budgets
- Health checks on all services

✅ **Scalability**

- Easily adjust replicas in `kustomization.yaml`
- HPA-ready (metrics can be added)
- Horizontal pod spreading (anti-affinity)

✅ **Operations**

- Environment-based ConfigMaps
- Easy rollouts/rollbacks
- Pod logging & events
- Namespace isolation

## Common Commands

```bash
# View deployment
kubectl get all -n traffic-crm-prod

# Check logs
kubectl logs -l app=traffic-crm-frontend -n traffic-crm-prod -f

# Port-forward for testing
kubectl port-forward svc/traffic-crm-frontend 8080:80 -n traffic-crm-prod

# Scale replicas
kubectl scale deployment traffic-crm-frontend --replicas=3 -n traffic-crm-prod

# Rollback
kubectl rollout undo deployment/traffic-crm-frontend -n traffic-crm-prod

# Check events
kubectl get events -n traffic-crm-prod --sort-by='.lastTimestamp'
```

## Environment Variables (in ConfigMap)

- `VITE_APP_API_URL`: Backend API endpoint (dev: <http://localhost:3000>, prod: <https://api.example.com>)
- `VITE_APP_BASE_NAME`: App base path (usually "/")

## Workflow: From Commit to Production

```
1. git push to main
   ↓
2. frontend-docker.yml triggers
   ├─ Builds Docker image
   └─ Pushes to ghcr.io/omar120489/-traffic-crm-frontend-ts-frontend:latest
   ↓
3. deploy-frontend-k8s.yml triggers (on docker build success)
   ├─ Updates kustomization.yaml with image SHA
   ├─ Commits updated manifest
   └─ Deploys to K8s (traffic-crm-prod namespace)
   ↓
4. Kubernetes rolling update
   ├─ Launches new pods with new image
   ├─ Waits for readiness probes
   └─ Terminates old pods
```

## For GitOps (ArgoCD/Flux)

If using ArgoCD/Flux, skip the deploy workflow and instead:

1. Let `frontend-docker.yml` push image to GHCR ✓ (already set up)
2. Create an ArgoCD Application pointing to `infra/k8s/frontend/`
3. Enable auto-sync or manually trigger from ArgoCD dashboard

Example ArgoCD Application:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: traffic-crm-frontend
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/omar120489/-traffic-crm-frontend-ts
    path: infra/k8s/frontend
    targetRevision: main
  destination:
    server: https://kubernetes.default.svc
    namespace: traffic-crm-prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

## Monitoring (Optional)

Add to deployment for Prometheus scraping:

```yaml
podAnnotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "9113"
  prometheus.io/path: "/metrics"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Pods not starting | `kubectl describe pod <pod>`, check image pull secrets |
| Ingress not working | `kubectl get ingress`, verify DNS, check TLS certificate |
| High latency | Check resource limits, scale up replicas, check backend API |
| Image pull fails | Verify GHCR secret exists, check registry credentials |
| Can't access app | `kubectl port-forward` to test locally, check ingress rules |

## Next Steps

1. ✅ Docker image builds & pushes (already configured)
2. 📋 Update domain names in manifests
3. 🔐 Set up KUBE_CONFIG secret for auto-deploy
4. 🚀 Test deployment to dev environment
5. 📊 Add monitoring & alerting
6. 🔄 Set up GitOps (ArgoCD/Flux) for production

## Support

For detailed deployment steps, see: `DEPLOYMENT.md`
For step-by-step checklist, see: `DEPLOYMENT_CHECKLIST.md`
For Docker image info, see: `../../docker/docker-compose.yml`
