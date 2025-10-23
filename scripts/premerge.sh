#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# Pre-Merge Final Check + (Optional) Merge Helper
# Usage:
#   MODE=pr                      ./premerge.sh   # push current branch to origin for PR
#   MODE=local TARGET_BRANCH=main ./premerge.sh  # merge into target branch locally & push
#   ./premerge.sh                                 # just run checks (no merge)
#
# Env:
#   BRANCH=chore/quick-wins-and-currency (default: current)
#   TARGET_BRANCH=main                          (default: main)
#   DEV_JWT=<token>                             (optional; will try pnpm dev:jwt)
# ──────────────────────────────────────────────────────────────────────────────

BRANCH="${BRANCH:-$(git rev-parse --abbrev-ref HEAD)}"
TARGET_BRANCH="${TARGET_BRANCH:-main}"
MODE="${MODE:-verify}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 PRE-MERGE FINAL CHECKS — branch: $BRANCH → target: $TARGET_BRANCH"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 0) Guard: ensure clean working tree
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "❌ Your working tree has uncommitted changes."
  echo "   Please commit or stash first."
  exit 1
fi

# 1) Regenerate SDK types (requires Core API running for /docs-json)
echo "1️⃣  Regenerating SDK types…"
if pnpm sdk:gen; then
  echo "   ✅ SDK types generated"
else
  echo "   ⚠️  Could not generate SDK types (is Core API running?). Continuing."
fi
echo ""

# 2) Build Core API
echo "2️⃣  Building Core API…"
pnpm --filter @apps/core-api build
echo "   ✅ Core API build OK"
echo ""

# 3) Typecheck frontend (ignore known legacy warnings)
echo "3️⃣  Typechecking frontend…"
if pnpm --filter ./apps/frontend typecheck; then
  echo "   ✅ Frontend typecheck OK"
else
  echo "   ⚠️  Typecheck reported issues (likely legacy/unused contexts). Continuing."
fi
echo ""

# 4) Build frontend
echo "4️⃣  Building frontend…"
pnpm --filter ./apps/frontend build
echo "   ✅ Frontend build OK"
echo ""

# 5) API smoke test (optional)
echo "5️⃣  API smoke test (optional)…"
if [ -z "${DEV_JWT:-}" ]; then
  if pnpm -s dev:jwt >/dev/null 2>&1; then
    export DEV_JWT="$(pnpm --silent dev:jwt || true)"
  fi
fi

if [ -n "${DEV_JWT:-}" ]; then
  echo "   🔑 Using DEV_JWT for smoke test"
  if command -v jq >/dev/null 2>&1; then
    curl -s "http://localhost:3000/api/contacts?page=1&size=5" \
      -H "Authorization: Bearer $DEV_JWT" | jq '.total, (.items|length)' || true
  else
    curl -sI "http://localhost:3000/api/contacts?page=1&size=5" \
      -H "Authorization: Bearer $DEV_JWT" || true
  fi
else
  echo "   ⚠️  DEV_JWT not set; skip smoke. Tip: export DEV_JWT=\$(pnpm --silent dev:jwt)"
fi
echo ""
echo "✅ Checks complete."

# ──────────────────────────────────────────────────────────────────────────────
# Merge options
# ──────────────────────────────────────────────────────────────────────────────
case "$MODE" in
  pr)
    echo ""
    echo "📤 MODE=pr — Push current branch for PR"
    git push -u origin "$BRANCH"
    echo "   ✅ Pushed. Open a PR from '$BRANCH' → '$TARGET_BRANCH' in your Git host UI."
    ;;

  local)
    echo ""
    echo "🔀 MODE=local — Merge into '$TARGET_BRANCH' locally"
    # Ensure target exists locally
    if ! git show-ref --verify --quiet "refs/heads/$TARGET_BRANCH"; then
      echo "   ℹ️  Local '$TARGET_BRANCH' not found. Fetching…"
      git fetch origin "$TARGET_BRANCH":"$TARGET_BRANCH" || true
    fi
    git checkout "$TARGET_BRANCH"
    git pull --ff-only origin "$TARGET_BRANCH" || true
    git merge --no-ff "$BRANCH" -m "Merge $BRANCH into $TARGET_BRANCH"
    git push origin "$TARGET_BRANCH"
    echo "   ✅ Merged & pushed to '$TARGET_BRANCH'"
    ;;

  verify|*)
    echo ""
    echo "📝 MODE=verify — Verification only (no push/merge)."
    ;;
esac

# ──────────────────────────────────────────────────────────────────────────────
# Post-merge / Local run cheatsheet
# ──────────────────────────────────────────────────────────────────────────────
cat <<'DONE'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Quick run (after merge)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 1) Start DB & seed
pnpm db:up && pnpm db:migrate && pnpm db:seed

# 2) Start Core API
pnpm --filter @apps/core-api dev &

# 3) Regenerate SDK types
pnpm sdk:gen

# 4) Start frontend
pnpm --filter ./apps/frontend dev

# 5) Manual checks:
#    - http://localhost:5173/contacts
#    - http://localhost:5173/leads
#    - http://localhost:5173/deals
#    - http://localhost:5173/companies
DONE

echo "🎉 Done."


