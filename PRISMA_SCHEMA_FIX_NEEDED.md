# Prisma Schema Fix Needed ⚠️

**Issue:** Build is failing because Prisma `CreateInput` types require explicit `id` and `updatedAt` fields.

**Root Cause:** The Prisma schema is missing default value directives on `id` and `updatedAt` fields.

---

## 🔍 Problem

Current schema has:
```prisma
model Company {
  id        String     @id              // ❌ No @default(cuid())
  // ...
  updatedAt DateTime                    // ❌ No @updatedAt
}
```

This causes TypeScript to require these fields in all `create()` calls.

---

## ✅ Solution: Fix Prisma Schema

Add default directives to all models:

```prisma
model Activity {
  id          String    @id @default(cuid())  // ✅ Auto-generate
  // ...
  updatedAt   DateTime  @updatedAt            // ✅ Auto-update
}

model Company {
  id        String     @id @default(cuid())
  // ...
  updatedAt DateTime   @updatedAt
}

model Contact {
  id            String          @id @default(cuid())
  // ...
  updatedAt     DateTime        @updatedAt
}

model Deal {
  id          String     @id @default(cuid())
  // ...
  updatedAt   DateTime   @updatedAt
}

model Lead {
  id         String      @id @default(cuid())
  // ...
  updatedAt  DateTime    @updatedAt
}

model LeadSource {
  id        String   @id @default(cuid())
  // ... (already has createdAt)
}

model Org {
  id                 String               @id @default(cuid())
  // ...
  updatedAt          DateTime             @updatedAt
}

model Pipeline {
  id        String   @id @default(cuid())
  // ... (already has createdAt)
}

model Stage {
  id          String   @id @default(cuid())
  // ... (already has createdAt)
}

model Tag {
  id            String          @id @default(cuid())
  // ... (already has createdAt)
}

model TagAssignment {
  id         String   @id @default(cuid())
  // ... (already has createdAt)
}

model User {
  id           String         @id @default(cuid())
  // ...
  updatedAt    DateTime       @updatedAt
}
```

---

## 🚀 Apply Fix

### Step 1: Update Schema

```bash
# Edit apps/core-api/prisma/schema.prisma
# Add @default(cuid()) to all id fields
# Add @updatedAt to all updatedAt fields
```

### Step 2: Push Schema

```bash
pnpm db:migrate  # or: pnpm --filter @apps/core-api prisma:push
```

### Step 3: Regenerate Client

```bash
pnpm --filter @apps/core-api prisma:generate
```

### Step 4: Build

```bash
pnpm --filter @apps/core-api build
```

---

## 📝 Quick Fix Script

```bash
#!/usr/bin/env bash
# Fix Prisma schema - add default directives

SCHEMA_FILE="apps/core-api/prisma/schema.prisma"

# Backup
cp "$SCHEMA_FILE" "$SCHEMA_FILE.backup"

# Add @default(cuid()) to id fields (if not already present)
sed -i '' 's/id\s\+String\s\+@id$/id          String    @id @default(cuid())/g' "$SCHEMA_FILE"

# Add @updatedAt to updatedAt fields (if not already present)
sed -i '' 's/updatedAt\s\+DateTime$/updatedAt   DateTime  @updatedAt/g' "$SCHEMA_FILE"

echo "✅ Schema updated. Review changes:"
git diff "$SCHEMA_FILE"

echo ""
echo "Next steps:"
echo "  1. pnpm db:migrate"
echo "  2. pnpm --filter @apps/core-api prisma:generate"
echo "  3. pnpm --filter @apps/core-api build"
```

---

## 🎯 Why This Matters

**Without defaults:**
- TypeScript requires explicit `id` and `updatedAt` in every `create()`
- Causes TS2322 errors
- Forces use of `UncheckedCreateInput` (less type-safe)

**With defaults:**
- Prisma auto-generates `id` and `updatedAt`
- TypeScript uses `CreateInput` (more type-safe)
- Relation `connect` syntax works perfectly
- No TS2322 errors

---

## 🔍 Verification

After applying the fix, these should work without errors:

```typescript
// ✅ No explicit id or updatedAt needed
await prisma.company.create({
  data: {
    name: 'Acme Inc',
    Org: { connect: { id: orgId } },
  },
});

await prisma.contact.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    Org: { connect: { id: orgId } },
    Company: { connect: { id: companyId } },
  },
});
```

---

## ⚠️ Alternative: Use Unchecked Types (Not Recommended)

If you can't modify the schema right now, you can force Unchecked types:

```typescript
import { Prisma } from '@prisma/client';

// Explicitly use Unchecked type
const data: Prisma.CompanyUncheckedCreateInput = {
  id: cuid(),  // Generate manually
  orgId,
  name: dto.name,
  domain: dto.domain,
  createdAt: new Date(),
  updatedAt: new Date(),
};

await prisma.company.create({ data });
```

**But this is error-prone and defeats the purpose of using Prisma's type safety.**

---

## 📚 Related

- [Prisma Docs: Default values](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#default)
- [Prisma Docs: @updatedAt](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#updatedat)
- [Prisma Docs: cuid()](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#cuid)

---

**🎯 Bottom Line:** Add `@default(cuid())` and `@updatedAt` to the schema, then regenerate. This is the proper fix and will make all the relation `connect` syntax work perfectly.

---

*Last Updated: October 24, 2025*


