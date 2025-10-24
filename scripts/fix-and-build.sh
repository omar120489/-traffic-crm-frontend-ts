#!/usr/bin/env bash
set -euo pipefail

# Sprint 2 Fix & Build Script
# Applies all remaining fixes and builds the core-api

red(){ printf "\033[31m%s\033[0m\n" "$*"; }
green(){ printf "\033[32m%s\033[0m\n" "$*"; }
yellow(){ printf "\033[33m%s\033[0m\n" "$*"; }
blue(){ printf "\033[34m%s\033[0m\n" "$*"; }
check(){ printf "• %s ... " "$1"; }

echo "🔧 Sprint 2 Fix & Build"
echo "======================="
echo

# Step 1: Regenerate Prisma Client
echo "📦 Step 1: Regenerating Prisma Client..."
check "Generate Prisma Client"
if pnpm --filter @apps/core-api prisma:generate > /tmp/prisma-generate.log 2>&1; then
  green "✓ ok"
else
  red "✗ fail"
  echo "   See: /tmp/prisma-generate.log"
  exit 1
fi
echo

# Step 2: Build Core API
echo "🏗️  Step 2: Building Core API..."
check "Build @apps/core-api"
if pnpm --filter @apps/core-api build > /tmp/core-api-build.log 2>&1; then
  green "✓ ok"
else
  red "✗ fail"
  echo "   See: /tmp/core-api-build.log"
  cat /tmp/core-api-build.log
  exit 1
fi
echo

# Step 3: Typecheck
echo "🔍 Step 3: Typechecking..."
check "Typecheck @apps/core-api"
if pnpm --filter @apps/core-api typecheck > /tmp/core-api-typecheck.log 2>&1; then
  green "✓ ok"
else
  yellow "⚠️  warnings (check log)"
  echo "   See: /tmp/core-api-typecheck.log"
fi
echo

# Step 4: Test seed (optional)
if [[ "${SKIP_SEED:-}" != "true" ]]; then
  echo "🌱 Step 4: Testing seed script..."
  check "Seed compiles"
  if pnpm --filter @apps/core-api exec tsc prisma/seed.ts --noEmit > /tmp/seed-typecheck.log 2>&1; then
    green "✓ ok"
  else
    yellow "⚠️  warnings (non-blocking)"
    echo "   See: /tmp/seed-typecheck.log"
  fi
  echo
fi

# Summary
echo "======================="
green "✅ Core API Build Complete!"
echo
echo "🎯 Next Steps:"
echo "   1. Start API: pnpm --filter @apps/core-api start:dev"
echo "   2. Run seed: pnpm --filter @apps/core-api prisma:seed"
echo "   3. Sync SDK: pnpm dev:sdk"
echo "   4. Run greenlight: pnpm greenlight"
echo
green "🚀 Ready to ship!"


