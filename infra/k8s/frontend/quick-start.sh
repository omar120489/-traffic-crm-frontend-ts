#!/bin/bash
# Quick deployment reference script

echo "═══════════════════════════════════════════════════════════════"
echo "  Traffic CRM Frontend - Deployment Quick Start"
echo "═══════════════════════════════════════════════════════════════"
echo ""

echo "📦 STEP 1: Enable GitHub Container Registry"
echo "   1. Go to: Repository Settings → Packages"
echo "   2. Enable GitHub Container Registry"
echo "   3. Grant workflow 'Improve repository permissions'"
echo ""

echo "🔑 STEP 2: Create Kubernetes Namespaces"
echo "   kubectl create namespace traffic-crm-dev"
echo "   kubectl create namespace traffic-crm-staging"
echo "   kubectl create namespace traffic-crm-prod"
echo ""

echo "⚙️  STEP 3: Update Configuration"
echo "   Edit: infra/k8s/frontend/ingress-prod.yaml"
echo "         - Change domain from 'crm.example.com'"
echo ""
echo "   Edit: infra/k8s/frontend/configmap-envs.yaml"
echo "         - Update API URLs for each environment"
echo ""

echo "📋 STEP 4: Install Prerequisites"
echo "   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml"
echo ""

echo "🚀 STEP 5: Deploy to Development"
echo "   kubectl apply -k infra/k8s/frontend/ -n traffic-crm-dev"
echo "   kubectl get pods -n traffic-crm-dev"
echo ""

echo "✅ STEP 6: Deploy to Production"
echo "   Option A (Manual):"
echo "   kubectl apply -k infra/k8s/frontend/ -n traffic-crm-prod"
echo ""
echo "   Option B (Automatic via GitHub Actions):"
echo "   1. Add KUBE_CONFIG secret to GitHub"
echo "   2. Push to main → Auto-deploy via deploy-frontend-k8s.yml"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "  For detailed steps, see: DEPLOYMENT_CHECKLIST.md"
echo "═══════════════════════════════════════════════════════════════"
