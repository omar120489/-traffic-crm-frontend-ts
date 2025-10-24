#!/usr/bin/env bash
set -euo pipefail

red(){ printf "\033[31m%s\033[0m\n" "$*"; }
green(){ printf "\033[32m%s\033[0m\n" "$*"; }
yellow(){ printf "\033[33m%s\033[0m\n" "$*"; }
check(){ printf "• %s ... " "$1"; }

PASS=0; FAIL=0; TODO=0

echo "🔍 Deployment Readiness Verification"
echo "======================================"
echo

# Tools
check "node available"
if command -v node >/dev/null; then green "ok"; ((PASS++)); else red "missing"; ((FAIL++)); fi

check "pnpm available"
if command -v pnpm >/dev/null; then green "ok"; ((PASS++)); else red "missing"; ((FAIL++)); fi

check "gh (GitHub CLI) available (optional)"
if command -v gh >/dev/null; then yellow "ok (optional)"; ((PASS++)); else yellow "not installed"; ((TODO++)); fi
echo

# Workflows present
echo "📋 Checking workflows..."
for wf in ci.yml release-please.yml publish-sdk.yml preview-build.yml docs-lint.yml codeql.yml; do
  check ".github/workflows/$wf present"
  [[ -f ".github/workflows/$wf" ]] && green "ok" && ((PASS++)) || { red "missing"; ((FAIL++)); }
done

check ".github/dependabot.yml present"
[[ -f ".github/dependabot.yml" ]] && green "ok" && ((PASS++)) || { red "missing"; ((FAIL++)); }
echo

# SDK package sanity
echo "📦 Checking SDK package..."
check "SDK package.json exists"
if [[ -f packages/sdk-js/package.json ]]; then
  green "ok"; ((PASS++))
  
  NAME=$(node -e "console.log(require('./packages/sdk-js/package.json').name||'')")
  PROV=$(node -e "let p=require('./packages/sdk-js/package.json');console.log(p.publishConfig?.provenance?'true':'false')")
  
  check "SDK name is scoped"
  [[ "$NAME" == @*/* ]] && green "$NAME" && ((PASS++)) || { yellow "unscoped: $NAME"; ((TODO++)); }
  
  check "Provenance enabled"
  [[ "$PROV" == "true" ]] && green "yes" && ((PASS++)) || { yellow "no"; ((TODO++)); }
else
  red "missing"; ((FAIL++))
fi
echo

# Build + pack (lightweight)
if command -v pnpm >/dev/null; then
  echo "🔨 Testing SDK build..."
  check "SDK builds"
  if (pnpm --filter ./packages/sdk-js build >/dev/null 2>&1); then
    green "ok"; ((PASS++))
  else
    red "fail"; ((FAIL++))
  fi
  
  check "SDK pack dry-run"
  if (cd packages/sdk-js && npm pack --dry-run >/dev/null 2>&1); then
    green "ok"; ((PASS++))
  else
    red "fail"; ((FAIL++))
  fi
fi
echo

# Secrets (optional if gh auth & perms)
if command -v gh >/dev/null && gh auth status >/dev/null 2>&1; then
  echo "🔐 Checking secrets..."
  check "NPM_TOKEN secret present"
  if (gh secret list 2>/dev/null | grep -q '^NPM_TOKEN'); then
    green "yes"; ((PASS++))
  else
    yellow "not found"; ((TODO++))
  fi
else
  yellow "⚠️  Skip secret check (gh not installed or not authenticated)"; ((TODO++))
fi
echo

# Summary
echo "========================================"
echo "📊 Summary:"
green "✅ PASS: $PASS"
[[ $FAIL -gt 0 ]] && red "❌ FAIL: $FAIL" || true
[[ $TODO -gt 0 ]] && yellow "⏳ PENDING: $TODO" || true
echo

if [[ $FAIL -eq 0 ]]; then
  green "🎉 Deployment readiness verified!"
  exit 0
else
  red "❌ Fix failures above before deploying"
  exit 1
fi

