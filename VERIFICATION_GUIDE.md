# Sprint 1 Verification Guide

Run these commands to verify your Sprint 1 setup is complete and working.

---

## ✅ 1. Verify Workspace Packages

```bash
# List all workspace packages
ls -d apps/* packages/*

# Expected output:
# apps/core-api
# apps/frontend
# apps/workers
# packages/rbac
# packages/sdk-js
# packages/shared-types
# packages/ui-kit
```

---

## ✅ 2. Type-Check All Packages

```bash
# Run typecheck across all workspaces
pnpm -r typecheck

# Expected: No errors
# Warnings are OK if they're about unused imports
```

**Known Issues:**

- `apps/core-api` may have errors in `deals.service.ts` and `leads.service.ts` (pre-existing, needs Sprint 2 fix)
- Other packages should be clean ✅

---

## ✅ 3. Prisma Validation

```bash
cd apps/core-api

# Validate schema
npx prisma validate
# Expected: "The schema at prisma/schema.prisma is valid 🚀"

# Format schema
npx prisma format
# Expected: "Formatted prisma/schema.prisma in Xms 🚀"

# Generate client
npx prisma generate
# Expected: "✔ Generated Prisma Client"

cd ../..
```

---

## ✅ 4. Database Status

```bash
# Check if database is in sync
cd apps/core-api && npx prisma db pull --force

# Expected: "✔ Introspected 20 models"
# Models: Activity, Channel, Company, Contact, Deal, EmailMessage, EmailThread,
#         IntegrationAccount, Lead, LeadSource, Message, Notification, Org,
#         Pipeline, SocialMessage, SocialThread, Stage, Tag, TagAssignment, User

cd ../..
```

---

## ✅ 5. View Database (Optional)

```bash
cd apps/core-api && npx prisma studio

# Opens http://localhost:5555
# You should see all 20 tables with seed data:
# - 1 Org (Acme Inc.)
# - 1 User (admin@acme.io)
# - 1 Pipeline (Sales Pipeline)
# - 4 Stages
# - 1 Company (Globex)
# - 1 Contact (Hannah Lee)
# - 1 Lead
# - 1 Deal
# - 1 Activity
# - 1 Tag
```

---

## ✅ 6. Build Packages

```bash
# Build UI Kit
cd packages/ui-kit && npx tsc --noEmit
# Expected: No errors

# Build RBAC
cd ../rbac && npx tsc --noEmit
# Expected: No errors

# Build Shared Types
cd ../shared-types && pnpm build
# Expected: Success

cd ../..
```

---

## ✅ 7. Verify Path Aliases

```bash
# Check tsconfig.base.json
grep -A 2 "@ui-kit" tsconfig.base.json
grep -A 2 "@rbac" tsconfig.base.json

# Expected output:
# "@ui-kit/*": ["packages/ui-kit/src/*"],
# "@rbac/*": ["packages/rbac/src/*"],
```

---

## ✅ 8. Verify Scripts

```bash
# Check core-api scripts
grep "prisma:push" apps/core-api/package.json

# Check root scripts
grep "db:migrate" package.json

# Expected:
# core-api: "prisma:push": "prisma db push"
# root: "db:migrate": "pnpm --filter @apps/core-api prisma:push"
```

---

## ✅ 9. Test RBAC Import (Optional)

Create a test file:

```typescript
// test-rbac.ts
import { can } from '@rbac/core';

console.log('Admin can read contacts:', can('admin', 'contacts:read')); // true
console.log('Viewer can write contacts:', can('viewer', 'contacts:write')); // false
console.log('Manager can assign leads:', can('manager', 'leads:assign')); // true
```

Run:

```bash
npx tsx test-rbac.ts
# Expected: true, false, true
```

---

## ✅ 10. Test UI Kit Import (Optional)

Create a test file:

```typescript
// test-ui-kit.tsx
import { AppPage, DataTable, FilterBar } from '@ui-kit/core';

console.log('UI Kit components loaded:', {
  AppPage: typeof AppPage,
  DataTable: typeof DataTable,
  FilterBar: typeof FilterBar,
});
```

Run:

```bash
npx tsx test-ui-kit.tsx
# Expected: { AppPage: 'function', DataTable: 'function', FilterBar: 'function' }
```

---

## ✅ 11. Verify Example Files

```bash
# Check if examples exist
ls -lh apps/frontend/src/pages/ContactsPageExample.tsx
ls -lh apps/frontend/src/services/contacts.service.ts

# Check documentation
ls -1 *.md | grep -E "(SPRINT|SCHEMA|REFACTOR|UI_KIT|EXAMPLES)"

# Expected:
# EXAMPLES_COMPLETE.md
# REFACTOR_COMPLETE.md
# SCHEMA_WORKFLOW.md
# SPRINT_1_COMPLETE.md
# UI_KIT_EXAMPLES.md
```

---

## ✅ 12. Quick Health Check

```bash
# Run this one-liner to check all packages
for dir in apps/* packages/*; do
  if [ -f "$dir/package.json" ]; then
    echo "✓ $(basename $dir)"
  fi
done

# Expected output:
# ✓ core-api
# ✓ frontend
# ✓ workers
# ✓ rbac
# ✓ sdk-js
# ✓ shared-types
# ✓ ui-kit
```

---

## 🎯 Expected Results Summary

| Check | Status | Notes |
|-------|--------|-------|
| Workspace packages | ✅ | 7 packages (3 apps, 4 packages) |
| Prisma schema | ✅ | 20 models, valid, formatted |
| Database | ✅ | In sync, seeded with sample data |
| UI Kit | ✅ | 4 components, typechecks |
| RBAC | ✅ | 4 roles, 15 permissions, typechecks |
| Path aliases | ✅ | @ui-kit/*, @rbac/* configured |
| Scripts | ✅ | Schema-only mode (prisma:push) |
| Examples | ✅ | ContactsPage + service |
| Documentation | ✅ | 5 markdown guides |

---

## ❌ Known Issues (To Fix in Sprint 2)

### **core-api Type Errors**

**Files:** `apps/core-api/src/modules/deals/deals.service.ts`, `apps/core-api/src/modules/leads/leads.service.ts`

**Issue:** Services reference old schema fields:

- `Deal.stage` (string) → now `Deal.stageId` (relation to Stage model)
- `Lead.source` (string) → now `Lead.sourceId` (relation to LeadSource model)

**Fix Required:**

```typescript
// Before (broken)
const deal = await prisma.deal.create({
  data: { stage: 'new' }  // ❌ stage is now a relation
});

// After (correct)
const deal = await prisma.deal.create({
  data: { 
    stageId: 'stage-id',  // ✅ use stageId
    stage: {              // or create relation
      connect: { id: 'stage-id' }
    }
  },
  include: { stage: true }  // include related stage
});
```

**Priority:** Sprint 2, Week 1

---

## 🚀 If Everything Passes

You're ready to:

1. ✅ Start building features
2. ✅ Use UI Kit components
3. ✅ Implement RBAC checks
4. ✅ Make schema changes (fast iteration mode)
5. ✅ Build Leads, Deals, Companies pages

**Next Steps:**

- Fix core-api services (Sprint 2, Week 1)
- Wire OpenAPI → SDK generation
- Replace mock data with real API calls
- Add authentication

---

## 🆘 Troubleshooting

### **"Prisma client not found"**

```bash
cd apps/core-api && npx prisma generate
```

### **"Cannot find module '@ui-kit/core'"**

```bash
# Check path alias in tsconfig.base.json
grep "@ui-kit" tsconfig.base.json

# Restart TypeScript server in your IDE
```

### **"Database connection failed"**

```bash
# Start PostgreSQL
pnpm db:up

# Check connection
cd apps/core-api && npx prisma db pull
```

### **"Schema out of sync"**

```bash
# Push schema (schema-only mode)
pnpm db:migrate

# Or force reset (WARNING: deletes all data)
cd apps/core-api && npx prisma db push --force-reset
pnpm db:seed
```

---

## 📚 Documentation

- **[SPRINT_1_COMPLETE.md](./SPRINT_1_COMPLETE.md)** — Sprint 1 overview
- **[SCHEMA_WORKFLOW.md](./SCHEMA_WORKFLOW.md)** — Database workflow
- **[REFACTOR_COMPLETE.md](./REFACTOR_COMPLETE.md)** — Schema-only mode
- **[UI_KIT_EXAMPLES.md](./UI_KIT_EXAMPLES.md)** — Component examples
- **[EXAMPLES_COMPLETE.md](./EXAMPLES_COMPLETE.md)** — Example summary

---

**✅ Sprint 1 Verification Complete!**

If all checks pass, you're ready to build! 🚀
