#!/usr/bin/env bash
set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0
WARN=0

# Helper functions
print_header() {
  echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║  🔍 SPRINT 1 VERIFICATION                                 ║${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
  echo ""
}

print_step() {
  echo -e "${BLUE}▶ $1${NC}"
}

print_pass() {
  echo -e "${GREEN}  ✓ $1${NC}"
  ((PASS++))
}

print_fail() {
  echo -e "${RED}  ✗ $1${NC}"
  ((FAIL++))
}

print_warn() {
  echo -e "${YELLOW}  ⚠ $1${NC}"
  ((WARN++))
}

print_summary() {
  echo ""
  echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}📊 SUMMARY${NC}"
  echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}✓ PASS: $PASS${NC}"
  [[ $FAIL -gt 0 ]] && echo -e "${RED}✗ FAIL: $FAIL${NC}"
  [[ $WARN -gt 0 ]] && echo -e "${YELLOW}⚠ WARN: $WARN${NC}"
  echo ""
  
  if [[ $FAIL -eq 0 ]]; then
    echo -e "${GREEN}🎉 Sprint 1 verification complete! All checks passed.${NC}"
    return 0
  else
    echo -e "${RED}❌ Some checks failed. Please review the errors above.${NC}"
    return 1
  fi
}

# Start verification
print_header

# ============================================================================
# 1. Verify workspace packages
# ============================================================================
print_step "1. Verifying workspace packages..."

if [[ -d "apps/core-api" ]]; then
  print_pass "apps/core-api exists"
else
  print_fail "apps/core-api missing"
fi

if [[ -d "apps/frontend" ]]; then
  print_pass "apps/frontend exists"
else
  print_fail "apps/frontend missing"
fi

if [[ -d "apps/workers" ]]; then
  print_pass "apps/workers exists"
else
  print_fail "apps/workers missing"
fi

if [[ -d "packages/ui-kit" ]]; then
  print_pass "packages/ui-kit exists"
else
  print_fail "packages/ui-kit missing"
fi

if [[ -d "packages/rbac" ]]; then
  print_pass "packages/rbac exists"
else
  print_fail "packages/rbac missing"
fi

if [[ -d "packages/shared-types" ]]; then
  print_pass "packages/shared-types exists"
else
  print_fail "packages/shared-types missing"
fi

if [[ -d "packages/sdk-js" ]]; then
  print_pass "packages/sdk-js exists"
else
  print_fail "packages/sdk-js missing"
fi

echo ""

# ============================================================================
# 2. Verify Prisma setup
# ============================================================================
print_step "2. Verifying Prisma setup..."

if [[ -f "apps/core-api/prisma/schema.prisma" ]]; then
  print_pass "schema.prisma exists"
  
  # Check for schema-only mode (no migrations folder)
  if [[ ! -d "apps/core-api/prisma/migrations" ]]; then
    print_pass "Schema-only mode (no migrations folder)"
  else
    print_warn "Migrations folder exists (expected for schema-only mode)"
  fi
  
  # Validate schema
  if cd apps/core-api && npx prisma validate >/dev/null 2>&1; then
    print_pass "Prisma schema is valid"
  else
    print_fail "Prisma schema validation failed"
  fi
  cd - >/dev/null
else
  print_fail "schema.prisma missing"
fi

if [[ -f "apps/core-api/prisma/seed.ts" ]]; then
  print_pass "seed.ts exists"
else
  print_fail "seed.ts missing"
fi

echo ""

# ============================================================================
# 3. Verify UI Kit package
# ============================================================================
print_step "3. Verifying UI Kit package..."

if [[ -f "packages/ui-kit/package.json" ]]; then
  print_pass "ui-kit/package.json exists"
else
  print_fail "ui-kit/package.json missing"
fi

for component in AppPage DataTable FilterBar EntityTimeline index; do
  if [[ -f "packages/ui-kit/src/${component}.tsx" ]] || [[ -f "packages/ui-kit/src/${component}.ts" ]]; then
    print_pass "ui-kit/${component} exists"
  else
    print_fail "ui-kit/${component} missing"
  fi
done

if [[ -f "packages/ui-kit/tsconfig.json" ]]; then
  print_pass "ui-kit/tsconfig.json exists"
else
  print_fail "ui-kit/tsconfig.json missing"
fi

echo ""

# ============================================================================
# 4. Verify RBAC package
# ============================================================================
print_step "4. Verifying RBAC package..."

if [[ -f "packages/rbac/package.json" ]]; then
  print_pass "rbac/package.json exists"
else
  print_fail "rbac/package.json missing"
fi

for file in types roles checks index; do
  if [[ -f "packages/rbac/src/${file}.ts" ]]; then
    print_pass "rbac/${file}.ts exists"
  else
    print_fail "rbac/${file}.ts missing"
  fi
done

if [[ -f "packages/rbac/tsconfig.json" ]]; then
  print_pass "rbac/tsconfig.json exists"
else
  print_fail "rbac/tsconfig.json missing"
fi

echo ""

# ============================================================================
# 5. Verify TypeScript configuration
# ============================================================================
print_step "5. Verifying TypeScript configuration..."

if [[ -f "tsconfig.base.json" ]]; then
  print_pass "tsconfig.base.json exists"
  
  # Check for path aliases
  if grep -q "@ui-kit/\*" tsconfig.base.json; then
    print_pass "@ui-kit/* path alias configured"
  else
    print_fail "@ui-kit/* path alias missing"
  fi
  
  if grep -q "@rbac/\*" tsconfig.base.json; then
    print_pass "@rbac/* path alias configured"
  else
    print_fail "@rbac/* path alias missing"
  fi
else
  print_fail "tsconfig.base.json missing"
fi

echo ""

# ============================================================================
# 6. Verify package.json scripts
# ============================================================================
print_step "6. Verifying package.json scripts..."

if grep -q "prisma:push" apps/core-api/package.json; then
  print_pass "core-api has prisma:push script"
else
  print_fail "core-api missing prisma:push script"
fi

if grep -q "db:migrate.*prisma:push" package.json; then
  print_pass "root has db:migrate → prisma:push"
else
  print_fail "root db:migrate script not configured for schema-only mode"
fi

echo ""

# ============================================================================
# 7. Verify example files
# ============================================================================
print_step "7. Verifying example files..."

if [[ -f "apps/frontend/src/pages/ContactsPageExample.tsx" ]]; then
  print_pass "ContactsPageExample.tsx exists"
else
  print_warn "ContactsPageExample.tsx not found (optional)"
fi

if [[ -f "apps/frontend/src/services/contacts.service.ts" ]]; then
  print_pass "contacts.service.ts exists"
else
  print_warn "contacts.service.ts not found (optional)"
fi

echo ""

# ============================================================================
# 8. Verify documentation
# ============================================================================
print_step "8. Verifying documentation..."

for doc in SPRINT_1_COMPLETE.md SCHEMA_WORKFLOW.md REFACTOR_COMPLETE.md UI_KIT_EXAMPLES.md EXAMPLES_COMPLETE.md; do
  if [[ -f "$doc" ]]; then
    print_pass "$doc exists"
  else
    print_warn "$doc missing (optional)"
  fi
done

echo ""

# ============================================================================
# 9. Check for common issues
# ============================================================================
print_step "9. Checking for common issues..."

# Check if node_modules exists
if [[ -d "node_modules" ]]; then
  print_pass "Dependencies installed"
else
  print_fail "node_modules missing - run 'pnpm install'"
fi

# Check if Prisma client is generated
if [[ -d "node_modules/.pnpm/@prisma+client"* ]]; then
  print_pass "Prisma client generated"
else
  print_warn "Prisma client may need regeneration - run 'pnpm --filter @apps/core-api prisma:generate'"
fi

echo ""

# ============================================================================
# Summary
# ============================================================================
print_summary

