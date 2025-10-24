# Prisma Schema-Only Workflow

**Mode:** Direct Push (No Migrations)  
**Best For:** Solo development, fast iteration, prototyping

---

## 🎯 Why Schema-Only Mode?

✅ **Faster iteration** — No migration file generation  
✅ **Simpler workflow** — Just edit `schema.prisma` and push  
✅ **Fewer files** — No migrations folder to manage  
✅ **Perfect for prototyping** — Rapid schema changes

⚠️ **Trade-offs:**

- No migration history
- No rollback capability
- Not recommended for production deployments

---

## 📝 Daily Workflow

### **1. Edit Schema**

```bash
# Open schema file
code apps/core-api/prisma/schema.prisma
```

Make your changes (add models, fields, relations, etc.)

### **2. Push Changes**

```bash
# From project root
pnpm db:migrate

# Or directly
cd apps/core-api && npx prisma db push
```

This will:

- ✅ Compare schema.prisma with database
- ✅ Apply changes directly
- ✅ Regenerate Prisma client
- ⚡ No migration files created

### **3. Verify Changes**

```bash
# Open Prisma Studio to inspect data
cd apps/core-api && npx prisma studio
```

---

## 🔄 Common Operations

### **Add a New Model**

```prisma
// apps/core-api/prisma/schema.prisma

model Task {
  id        String   @id @default(cuid())
  orgId     String
  org       Org      @relation(fields: [orgId], references: [id])
  title     String
  status    String   @default("todo") // todo, in_progress, done
  dueDate   DateTime?
  assigneeId String?
  assignee  User?    @relation(fields: [assigneeId], references: [id])
  createdAt DateTime @default(now())
  
  @@index([orgId])
  @@index([assigneeId])
}
```

Then push:

```bash
pnpm db:migrate
```

### **Add a Field to Existing Model**

```prisma
model Contact {
  // ... existing fields
  linkedInUrl String?  // ← new field
}
```

Push:

```bash
pnpm db:migrate
```

### **Reset Database (Fresh Start)**

```bash
# WARNING: This deletes ALL data!
cd apps/core-api && npx prisma db push --force-reset

# Re-seed
pnpm db:seed
```

### **Change Field Type**

Prisma will warn you if data loss is possible:

```prisma
model Lead {
  score Int?  // was String, now Int
}
```

```bash
npx prisma db push
# ⚠️  Prisma will warn about potential data loss
# Confirm with 'y' if you're sure
```

---

## 🚨 Important Notes

### **Data Loss Scenarios**

Prisma `db push` will **warn** but **allow** destructive changes:

- Dropping columns
- Changing types (String → Int)
- Adding non-nullable fields without defaults
- Dropping tables

**Always backup important data before pushing!**

### **Team Collaboration**

If working with others:

1. **Commit** `schema.prisma` to git
2. **Don't commit** `migrations/` (doesn't exist in schema-only mode)
3. **Team members** run `pnpm db:migrate` to sync their local DB

### **Production Deployment**

**Schema-only mode is NOT recommended for production.**

When ready to deploy, switch to migrations:

```bash
# Create initial migration from current schema
cd apps/core-api
npx prisma migrate dev --name initial_production_schema
```

This creates a migration file you can safely apply to production.

---

## 🔧 Troubleshooting

### **"Database is out of sync"**

```bash
# Force push (overwrites DB schema)
cd apps/core-api && npx prisma db push --force-reset
pnpm db:seed
```

### **"Prisma Client is out of date"**

```bash
# Regenerate client
cd apps/core-api && npx prisma generate
```

### **"Can't connect to database"**

```bash
# Start PostgreSQL
pnpm db:up

# Check connection
cd apps/core-api && npx prisma db pull
```

---

## 📊 Comparison: Push vs Migrate

| Feature | `db push` (Current) | `migrate dev` |
|---------|---------------------|---------------|
| **Speed** | ⚡ Fast | Slower |
| **History** | ❌ No | ✅ Yes |
| **Rollback** | ❌ No | ✅ Yes |
| **Production** | ⚠️ Not recommended | ✅ Safe |
| **Team sync** | Manual | Automatic (via git) |
| **Best for** | Solo dev, prototyping | Teams, production |

---

## 🎓 Learning Resources

- [Prisma db push docs](https://www.prisma.io/docs/concepts/components/prisma-migrate/db-push)
- [Schema reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)

---

## 🔄 Switching Back to Migrations

When you're ready for production or team collaboration:

```bash
cd apps/core-api

# Create initial migration from current schema
npx prisma migrate dev --name initial_production_schema

# Update package.json scripts back to:
# "prisma:migrate": "prisma migrate dev"
```

Then update root `package.json`:

```json
{
  "scripts": {
    "db:migrate": "pnpm --filter @apps/core-api prisma:migrate"
  }
}
```

---

**📍 Current Mode:** Schema-Only (Fast Iteration)  
**🏠 Return to:** [Sprint 1 Complete](./SPRINT_1_COMPLETE.md) | [README](./README.md)
