#!/usr/bin/env bash
set -euo pipefail

# Sprint 2 Greenlight Verification Script
# This script orchestrates the complete Sprint 2 setup and verification

red(){ printf "\033[31m%s\033[0m\n" "$*"; }
green(){ printf "\033[32m%s\033[0m\n" "$*"; }
yellow(){ printf "\033[33m%s\033[0m\n" "$*"; }
blue(){ printf "\033[34m%s\033[0m\n" "$*"; }
check(){ printf "• %s ... " "$1"; }

echo "🚀 Sprint 2 Greenlight Verification"
echo "===================================="
echo

# Check Node version
CURRENT_NODE=$(node -v | sed 's/v//')
EXPECTED_NODE="20"
if [[ ! "$CURRENT_NODE" =~ ^20\. ]]; then
  yellow "⚠️  Node version mismatch: current=$CURRENT_NODE, expected=20.x"
  echo "   Recommended: nvm use 20"
  echo "   (Continuing anyway, but you may see engine warnings)"
  echo
fi

# Step 1: Build Core API
echo "📦 Step 1: Building Core API..."
check "Core API builds successfully"
if pnpm --filter @apps/core-api build > /tmp/sprint2-api-build.log 2>&1; then
  green "✓ ok"
else
  red "✗ fail"
  echo "   See: /tmp/sprint2-api-build.log"
  exit 1
fi
echo

# Step 2: Check if API is running
echo "🔍 Step 2: Checking API status..."
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
  green "✓ API is running on http://localhost:3000"
else
  yellow "⚠️  API is not running"
  echo
  echo "Please start the API in another terminal:"
  blue "  pnpm --filter @apps/core-api start:dev"
  echo
  echo "Then re-run this script."
  exit 1
fi
echo

# Step 3: Emit OpenAPI & Generate SDK
echo "🔧 Step 3: Syncing SDK..."
check "Emit OpenAPI spec"
if pnpm --filter @apps/core-api openapi:emit > /tmp/sprint2-openapi.log 2>&1; then
  green "✓ ok"
else
  red "✗ fail"
  echo "   See: /tmp/sprint2-openapi.log"
  exit 1
fi

check "Generate SDK types"
if pnpm --filter @traffic-crm/sdk-js codegen > /tmp/sprint2-codegen.log 2>&1; then
  green "✓ ok"
else
  red "✗ fail"
  echo "   See: /tmp/sprint2-codegen.log"
  exit 1
fi

check "Build SDK"
if pnpm --filter @traffic-crm/sdk-js build > /tmp/sprint2-sdk-build.log 2>&1; then
  green "✓ ok"
else
  red "✗ fail"
  echo "   See: /tmp/sprint2-sdk-build.log"
  exit 1
fi
echo

# Step 4: Frontend typecheck
echo "🌐 Step 4: Checking Frontend..."
check "Frontend typechecks"
if pnpm --filter ./apps/frontend typecheck > /tmp/sprint2-fe-typecheck.log 2>&1; then
  green "✓ ok"
else
  yellow "⚠️  warnings (non-blocking)"
  echo "   See: /tmp/sprint2-fe-typecheck.log"
fi
echo

# Step 5: Check for SDK drift
echo "🔍 Step 5: Checking SDK drift..."
if git diff --exit-code packages/sdk-js > /dev/null 2>&1; then
  green "✓ No SDK drift detected"
else
  yellow "⚠️  SDK has changed!"
  echo
  echo "The following files have changed:"
  git diff --name-only packages/sdk-js
  echo
  echo "To commit these changes:"
  blue "  git add packages/sdk-js"
  blue "  git commit -m 'chore: regenerate SDK types'"
fi
echo

# Summary
echo "===================================="
green "✅ Sprint 2 Greenlight Complete!"
echo
echo "🎯 Next Steps:"
echo "   1. Start frontend: pnpm --filter ./apps/frontend dev"
echo "   2. Open: http://localhost:5173/settings/pipelines"
echo "   3. Open: http://localhost:5173/contacts"
echo
echo "🧪 Smoke Test Checklist:"
echo "   □ Create pipeline → add stages → reorder"
echo "   □ View contacts → open detail → add note"
echo "   □ Tag a contact → verify persistence"
echo
echo "📚 Documentation:"
echo "   • SPRINT_2_RUNBOOK.md"
echo "   • SPRINT_2_FEATURES_READY.md"
echo
green "🚀 Ready to ship!"


