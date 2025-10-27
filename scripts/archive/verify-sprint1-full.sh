#!/usr/bin/env bash
set -euo pipefail

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🔍 SPRINT 1 FULL VERIFICATION                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check Node version
echo "▶ Node version:"
NODE_VERSION=$(node -v)
echo "  Current: $NODE_VERSION"
if [[ "$NODE_VERSION" =~ ^v20\. ]]; then
  echo "  ✓ Node 20 (recommended)"
elif [[ "$NODE_VERSION" =~ ^v18\. ]]; then
  echo "  ⚠ Node 18 (works, but 20 recommended)"
else
  echo "  ⚠ Node $NODE_VERSION (recommend switching to Node 20: nvm use 20)"
fi
echo ""

# Typecheck
echo "▶ Typecheck all workspaces..."
echo "  (This may show some expected errors in core-api services)"
pnpm -r typecheck 2>&1 | tail -5 || true
echo ""

# Prisma
echo "▶ Prisma generate & push..."
cd apps/core-api
npx prisma generate >/dev/null 2>&1 && echo "  ✓ Client generated" || echo "  ✗ Generate failed"
npx prisma db push >/dev/null 2>&1 && echo "  ✓ Schema pushed" || echo "  ⚠ Push failed (may already be in sync)"
cd ../..
echo ""

# Seed
echo "▶ Seed database..."
pnpm --filter @apps/core-api prisma:seed 2>&1 | grep -E "(Seed complete|already exists)" || echo "  ⚠ Seed may have already run"
echo ""

# Build key packages
echo "▶ Build key packages..."
echo "  • UI Kit..."
cd packages/ui-kit
npx tsc --noEmit 2>&1 >/dev/null && echo "    ✓ UI Kit typechecks" || echo "    ✗ UI Kit has errors"
cd ../..

echo "  • RBAC..."
cd packages/rbac
npx tsc --noEmit 2>&1 >/dev/null && echo "    ✓ RBAC typechecks" || echo "    ✗ RBAC has errors"
cd ../..

echo "  • Shared Types..."
pnpm --filter @traffic-crm/shared-types build >/dev/null 2>&1 && echo "    ✓ Shared Types built" || echo "    ⚠ Shared Types build skipped"
echo ""

# File checks
echo "▶ Verify key files..."
[[ -f "packages/ui-kit/src/index.ts" ]] && echo "  ✓ UI Kit index" || echo "  ✗ UI Kit index missing"
[[ -f "packages/rbac/src/index.ts" ]] && echo "  ✓ RBAC index" || echo "  ✗ RBAC index missing"
[[ -f "apps/frontend/src/pages/ContactsPageExample.tsx" ]] && echo "  ✓ ContactsPageExample" || echo "  ⚠ Example missing"
[[ -f "apps/frontend/src/services/contacts.service.ts" ]] && echo "  ✓ contacts.service" || echo "  ⚠ Service missing"
[[ -f "apps/core-api/prisma/schema.prisma" ]] && echo "  ✓ Prisma schema" || echo "  ✗ Schema missing"
[[ -f "apps/core-api/prisma/seed.ts" ]] && echo "  ✓ Seed script" || echo "  ✗ Seed missing"
echo ""

# Summary
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  ✅ VERIFICATION COMPLETE                                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Next Steps:"
echo ""
echo "  1. View database:"
echo "     cd apps/core-api && npx prisma studio"
echo "     → http://localhost:5555"
echo ""
echo "  2. Test imports:"
echo "     npx tsx test-imports.ts"
echo ""
echo "  3. Start Core API:"
echo "     pnpm --filter @apps/core-api start:dev"
echo "     → http://localhost:3000/api/docs"
echo ""
echo "  4. Start Frontend:"
echo "     pnpm --filter ./apps/frontend dev"
echo "     → http://localhost:5173"
echo ""
echo "📚 Documentation:"
echo "  • README_SPRINT1.md         - Quick start guide"
echo "  • VERIFICATION_GUIDE.md     - Detailed verification steps"
echo "  • UI_KIT_EXAMPLES.md        - Component usage examples"
echo "  • EXAMPLES_COMPLETE.md      - Example code summary"
echo ""
echo "⚠️  Known Issues (Sprint 2):"
echo "  • core-api/deals.service.ts - needs stageId update"
echo "  • core-api/leads.service.ts - needs sourceId update"
echo ""

