# Phase 1 Setup Resources

## 📚 Documentation (Pick One to Follow)

### For Speed (5-10 minutes)

👉 **`PHASE1_SETUP_QUICK.md`** - Condensed checklist with copy-paste commands

### For Details (15-20 minutes)

👉 **`K8S_SETUP_GUIDE.md`** - Full explanations with context

### Complete Context (20-30 minutes)

👉 **`GETTING_STARTED_PHASE1.md`** - Everything you need to know

---

## ✅ Phase 1 Checklist

- [ ] **Enable GHCR** in GitHub Settings → Packages
- [ ] **Update domain** in `infra/k8s/frontend/ingress-prod.yaml`
- [ ] **Update API URLs** in `infra/k8s/frontend/configmap-envs.yaml`
- [ ] **Create 3 K8s namespaces** (dev, staging, prod)
- [ ] **Install nginx-ingress controller**
- [ ] **(Optional) Install cert-manager** for TLS
- [ ] **(If private GHCR) Create image pull secrets**

---

## 📁 Your Configuration Files to Update

```
infra/k8s/frontend/
├── ingress-prod.yaml         ← Replace "crm.example.com" with YOUR domain
├── configmap-envs.yaml       ← Update API URLs for dev/staging/prod
└── base-deployment.yaml      ← (Only if private GHCR) add imagePullSecrets
```

---

## 🔧 Key Commands You'll Need

```bash
# Update domain name
sed -i 's/crm.example.com/YOUR_DOMAIN/g' infra/k8s/frontend/ingress-prod.yaml

# Create namespaces
kubectl create namespace traffic-crm-{dev,staging,prod}

# Install ingress
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Verify setup
kubectl get namespaces | grep traffic-crm
kubectl get pods -n ingress-nginx | grep controller
```

---

## ⏱️ Time Estimate

| Task | Time |
|------|------|
| Enable GHCR | 2 min |
| Update configs | 3 min |
| Create namespaces | 1 min |
| Install ingress | 5 min |
| Verify setup | 2 min |
| **Total** | **~13 minutes** |

---

## 🎯 Success Indicators

After Phase 1, you should see:

```bash
# ✅ 3 namespaces
$ kubectl get namespaces | grep traffic-crm
traffic-crm-dev        Active   XX
traffic-crm-prod       Active   XX
traffic-crm-staging    Active   XX

# ✅ Ingress controller running
$ kubectl get pods -n ingress-nginx
NAME                                        READY   UP-TO-DATE
nginx-ingress-controller-xxxxxxxxxx-xxxxx   1/1     Running

# ✅ Configs updated
$ grep "your-domain\|your-api" infra/k8s/frontend/configmap-envs.yaml
api-url: "https://your-api.your-domain.com"
```

---

## 📞 Having Issues?

1. **GHCR not enabling?**
   - Check repo has admin access
   - Try Settings → Packages → scroll down → enable

2. **kubectl commands not working?**
   - Verify kubectl is installed: `kubectl version`
   - Check kubeconfig: `kubectl cluster-info`

3. **Ingress controller stuck pending?**
   - Check cluster resources: `kubectl top nodes`
   - May need more memory/cpu

4. **Can't find sed command?**
   - Edit files manually or use: `vim` / `nano` / `code`

---

## ✨ After Phase 1 Complete

You'll be ready for **Phase 2: Deploy**

```
Phase 2 includes:
  → Deploy to development
  → Verify it's running
  → Deploy to production
  → Monitor logs
```

---

## 🚀 Start Here

Pick one and follow it:

1. **Quick Route** → `PHASE1_SETUP_QUICK.md`
2. **Detailed Route** → `K8S_SETUP_GUIDE.md`
3. **Complete Route** → `GETTING_STARTED_PHASE1.md`

Let me know when Phase 1 is complete! 👍
