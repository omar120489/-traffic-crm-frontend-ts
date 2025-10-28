#!/usr/bin/env bash
# scripts/verify-frontend.sh
# One-shot, non-destructive verifier for the frontend workspace state.
# - No external deps (jq/curl) required.
# - Exits with non-zero if any REQUIRED checks fail.
# - Use --run to actually run lint/typecheck/tests when node_modules exist.

set -u -o pipefail

# ──────────────────────────────────────────────────────────────────────────────
# Pretty printing
RED='\033[31m'; GRN='\033[32m'; YLW='\033[33m'; BLU='\033[34m'; DIM='\033[2m'; CLR='\033[0m'
pass(){ echo -e "${GRN}✔${CLR} $*"; }
warn(){ echo -e "${YLW}▲${CLR} $*"; }
fail(){ echo -e "${RED}✖${CLR} $*"; FAILED=$((FAILED+1)); }
info(){ echo -e "${BLU}ℹ${CLR} $*"; }

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND="$ROOT_DIR/apps/frontend"
FAILED=0
RUN_TASKS=0
[[ "${1:-}" == "--run" ]] && RUN_TASKS=1

cd "$ROOT_DIR" || { echo "Cannot cd to repo root"; exit 2; }

# ──────────────────────────────────────────────────────────────────────────────
# 0) Sanity
if [[ ! -d "$FRONTEND" ]]; then
  fail "Missing $FRONTEND (expected frontend app at apps/frontend)."
  echo "Aborting early."; exit 1
fi

# ──────────────────────────────────────────────────────────────────────────────
# 1) Toolchain presence & versions
if command -v node >/dev/null 2>&1; then
  NODE_V="$(node -v 2>/dev/null || true)"
  echo -e "${DIM}node${CLR} $NODE_V"
  if [[ "$NODE_V" =~ ^v20\. ]]; then pass "Node version OK (20.x)"; else warn "Node is $NODE_V (project targets 20.x)."; fi
else
  fail "node not found in PATH."
fi

if command -v pnpm >/dev/null 2>&1; then
  PNPM_V="$(pnpm -v 2>/dev/null || true)"
  echo -e "${DIM}pnpm${CLR} $PNPM_V"
  pass "pnpm present"
else
  fail "pnpm not found in PATH. Enable with: corepack enable pnpm"
fi

# ──────────────────────────────────────────────────────────────────────────────
# 2) Install state
if [[ -d "$FRONTEND/node_modules" ]]; then
  pass "apps/frontend/node_modules present"
else
  warn "apps/frontend/node_modules missing → installs not completed."
fi

# Quick binaries peek (don’t run them; just check files exist if node_modules present)
if [[ -d "$FRONTEND/node_modules" ]]; then
  [[ -f "$FRONTEND/node_modules/.bin/eslint" ]]    && pass "eslint installed"    || warn "eslint not installed"
  [[ -f "$FRONTEND/node_modules/.bin/tsc" ]]       && pass "tsc installed"       || warn "typescript (tsc) not installed"
  [[ -f "$FRONTEND/node_modules/.bin/vitest" ]]    && pass "vitest installed"    || warn "vitest not installed"
  [[ -f "$FRONTEND/node_modules/.bin/playwright" ]]&& pass "playwright installed"|| warn "playwright not installed"
fi

# ──────────────────────────────────────────────────────────────────────────────
# 3) Scripts in package.json
PKG="$FRONTEND/package.json"
if [[ -f "$PKG" ]]; then
  grep -q '"dev"' "$PKG" && pass "apps/frontend has \"dev\" script" || warn "apps/frontend missing \"dev\" script (add alias to vite)."
  grep -q '"build"' "$PKG" && pass "apps/frontend has \"build\" script" || fail "apps/frontend missing \"build\" script."
  grep -q '"preview"' "$PKG" && pass "apps/frontend has \"preview\" script" || warn "apps/frontend missing \"preview\" script."
else
  fail "apps/frontend/package.json not found."
fi

# ──────────────────────────────────────────────────────────────────────────────
# 4) API baseURL fallback
AXIOS_CLIENT="$FRONTEND/src/data/clients/axios.ts"
if [[ -f "$AXIOS_CLIENT" ]]; then
  if grep -q "http://localhost:3000/" "$AXIOS_CLIENT"; then
    pass "API baseURL fallback is localhost:3000"
  else
    fail "API baseURL fallback not set to localhost:3000 in $AXIOS_CLIENT"
  fi
else
  warn "Axios client not found at $AXIOS_CLIENT (skip)."
fi

# ──────────────────────────────────────────────────────────────────────────────
# 5) Grid v7 migration (no legacy API usage)
LEGACY_GRID_IMPORTS=$(rg -n "GridLegacy" "$FRONTEND/src" || true)
if [[ -n "$LEGACY_GRID_IMPORTS" ]]; then
  fail "Found legacy Grid usage (GridLegacy)."
  echo "$LEGACY_GRID_IMPORTS" | sed 's/^/  ‣ /'
else
  pass "No GridLegacy imports detected."
fi

LEGACY_GRID_PROPS=$(rg -n "<Grid[^>]*\\b(xs|sm|md|lg|xl|item)=" "$FRONTEND/src" || true)
if [[ -n "$LEGACY_GRID_PROPS" ]]; then
  fail "Found legacy Grid props (xs|sm|md|lg|xl|item)."
  echo "$LEGACY_GRID_PROPS" | sed 's/^/  ‣ /'
else
  pass "Grid components use modern sizing props."
fi

# ──────────────────────────────────────────────────────────────────────────────
# 6) Theme overrides migrated to slotProps
OVERRIDES_DIR="$FRONTEND/src/themes/overrides"
if [[ -d "$OVERRIDES_DIR" ]]; then
  TOTAL_OVR=$(find "$OVERRIDES_DIR" -type f -name "*.ts" | wc -l | tr -d ' ')
  WITH_SLOTS=$(grep -RIl "slotProps" "$OVERRIDES_DIR" | wc -l | tr -d ' ')
  if [[ "$TOTAL_OVR" -eq 0 ]]; then
    warn "No override files detected under themes/overrides."
  else
    if [[ "$WITH_SLOTS" -eq "$TOTAL_OVR" ]]; then
      pass "All overrides use slotProps ($WITH_SLOTS/$TOTAL_OVR)."
    else
      warn "Overrides migrated: $WITH_SLOTS/$TOTAL_OVR use slotProps. Remaining: $((TOTAL_OVR-WITH_SLOTS))."
      grep -RIL "slotProps" "$OVERRIDES_DIR" | sed 's/^/  ‣ /'
    fi
  fi
else
  warn "themes/overrides not found (skip)."
fi

# ──────────────────────────────────────────────────────────────────────────────
# 7) Auth token storage consistency (serviceToken vs access_token)
TOK_SERVICE=$(grep -RIn "serviceToken" "$FRONTEND/src" | wc -l | tr -d ' ')
TOK_ACCESS=$(grep -RIn "access_token" "$FRONTEND/src" | wc -l | tr -d ' ')
if [[ "$TOK_SERVICE" -gt 0 && "$TOK_ACCESS" -gt 0 ]]; then
  warn "Mixed token keys detected (serviceToken + access_token). Standardize on serviceToken."
  info "Files referencing access_token:"
  grep -RIn "access_token" "$FRONTEND/src" | sed 's/^/  ‣ /' | head -n 20
elif [[ "$TOK_SERVICE" -gt 0 ]]; then
  pass "Auth uses serviceToken consistently."
else
  warn "No serviceToken references found; verify auth contexts."
fi

# ──────────────────────────────────────────────────────────────────────────────
# 8) Routes consolidation
ROUTES_DIR="$FRONTEND/src/routes"
APP_ROUTES="$ROUTES_DIR/AppRoutes.tsx"
HAS_APP_ROUTES="no"
[[ -f "$APP_ROUTES" ]] && HAS_APP_ROUTES="yes"
HAS_MAIN=$(ls "$ROUTES_DIR" 2>/dev/null | grep -c "MainRoutes\.tsx" || true)
HAS_SPRINT2=$(ls "$ROUTES_DIR" 2>/dev/null | grep -c "sprint2\.routes\.tsx" || true)
if [[ "$HAS_APP_ROUTES" == "yes" && "$HAS_MAIN" -eq 0 && "$HAS_SPRINT2" -eq 0 ]]; then
  pass "Routes appear consolidated into AppRoutes.tsx."
else
  warn "Routes not fully consolidated. Status: AppRoutes=$HAS_APP_ROUTES, MainRoutes=$HAS_MAIN, sprint2.routes=$HAS_SPRINT2"
fi

# ──────────────────────────────────────────────────────────────────────────────
# 9) Services canonicalization (.sdk.ts only)
SERVICES_DIR="$FRONTEND/src/services"
if [[ -d "$SERVICES_DIR" ]]; then
  LEGACY=$(find "$SERVICES_DIR" -maxdepth 1 -type f -name "*.ts" ! -name "*.sdk.ts" ! -name "index.ts" | wc -l | tr -d ' ')
  if [[ "$LEGACY" -eq 0 ]]; then
    pass "Service layer is canonical (.sdk.ts only)."
  else
    warn "Found $LEGACY legacy service(s) (non-.sdk.ts). Consider deprecating/removing:"
    find "$SERVICES_DIR" -maxdepth 1 -type f -name "*.ts" ! -name "*.sdk.ts" ! -name "index.ts" -print | sed 's/^/  ‣ /'
  fi
else
  warn "services directory not found (skip)."
fi

# ──────────────────────────────────────────────────────────────────────────────
# 10) Env files and API URL presence
ENV_FILE="$FRONTEND/.env"
if [[ -f "$ENV_FILE" ]]; then
  if grep -q "^VITE_APP_API_URL=" "$ENV_FILE"; then
    pass ".env contains VITE_APP_API_URL"
  else
    warn ".env missing VITE_APP_API_URL"
  fi
else
  warn "apps/frontend/.env not found"
fi

# ──────────────────────────────────────────────────────────────────────────────
# 11) Optional execution of lint/type/test (only if node_modules exist)
if [[ "$RUN_TASKS" -eq 1 ]]; then
  if [[ -d "$FRONTEND/node_modules" ]]; then
    info "Running lint…"
    if pnpm --filter ./apps/frontend lint; then pass "lint passed"; else fail "lint failed"; fi

    info "Running typecheck…"
    if pnpm --filter ./apps/frontend typecheck; then pass "typecheck passed"; else fail "typecheck failed"; fi

    info "Running unit tests…"
    if pnpm --filter ./apps/frontend test:unit -- --reporter=verbose; then pass "unit tests passed"; else fail "unit tests failed"; fi
  else
    warn "--run requested but node_modules are missing; skipping executions."
  fi
else
  info "Add --run to execute lint/type/tests when node_modules are present."
fi

# ──────────────────────────────────────────────────────────────────────────────
# 12) Summary & exit code
echo
if [[ "$FAILED" -eq 0 ]]; then
  pass "Verification complete — no blocking failures."
  exit 0
else
  fail "Verification finished with $FAILED failure(s)."
  echo "Fix the items marked ✖ and re-run: bash scripts/verify-frontend.sh"
  exit 1
fi
