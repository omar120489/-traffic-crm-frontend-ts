#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Quick Start Deployment"
echo "========================="
echo

echo "🔎 Step 1: Verifying readiness..."
if ! scripts/verify-deployment-ready.sh; then
  echo
  echo "❌ Verification failed. Fix issues above before deploying."
  exit 1
fi

echo
echo "✅ Step 2: All checks passed!"
echo

if command -v gh >/dev/null && gh auth status >/dev/null 2>&1; then
  echo "🚀 Step 3: Triggering release-please workflow..."
  if gh workflow run release-please.yml; then
    echo "✅ Workflow triggered successfully!"
    echo
    echo "ℹ️  Check status: https://github.com/omar120489/-traffic-crm-frontend-ts/actions"
  else
    echo "⚠️  Could not trigger workflow. You may need to push a commit first."
  fi
else
  echo "ℹ️  Step 3: Install GitHub CLI (gh) to trigger workflows from terminal."
  echo "   Or push a conventional commit to trigger release-please automatically."
fi

echo
echo "======================================"
echo "📋 Next Steps:"
echo "   1. Make a conventional commit (feat:, fix:, etc.)"
echo "   2. Push and create a PR"
echo "   3. Merge PR → release-please creates release PR"
echo "   4. Merge release PR → SDK publishes to npm"
echo
echo "✅ You're ready to deploy!"

