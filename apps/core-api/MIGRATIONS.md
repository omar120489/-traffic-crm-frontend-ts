# Database Migration Workflow

**Status:** ✅ Initialized  
**Date:** October 26, 2025  
**Current Migration:** `20251026090416_init`

---

## 📋 Quick Reference

### **Development (Local)**
```bash
# Create a new migration after schema changes
pnpm prisma migrate dev --name <descriptive_name>

# Example: Add new field
pnpm prisma migrate dev --name add_user_avatar

# Reset database (⚠️ destructive)
pnpm prisma migrate reset
```

### **Production (Deployment)**
```bash
# Apply pending migrations
pnpm prisma migrate deploy

# Check migration status
pnpm prisma migrate status
```

### **Generate Prisma Client**
```bash
# After any schema changes
pnpm prisma generate
```

---

## 🔄 Migration Workflow

### **1. Modify Schema**
Edit `prisma/schema.prisma`:
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  avatar    String?  // ← New field
  createdAt DateTime @default(now())
}
```

### **2. Create Migration**
```bash
pnpm prisma migrate dev --name add_user_avatar
```

This will:
- Generate SQL migration file
- Apply migration to local database
- Regenerate Prisma Client

### **3. Review Migration**
Check `prisma/migrations/<timestamp>_add_user_avatar/migration.sql`:
```sql
-- AlterTable
ALTER TABLE "User" ADD COLUMN "avatar" TEXT;
```

### **4. Commit Migration**
```bash
git add prisma/migrations
git add prisma/schema.prisma
git commit -m "feat(db): add user avatar field"
```

### **5. Deploy to Production**
```bash
# On production server
pnpm prisma migrate deploy
```

---

## 📊 Current Schema (13 Models)

1. **Org** - Organization/tenant
2. **User** - User accounts
3. **Company** - Customer companies
4. **Contact** - Customer contacts
5. **Deal** - Sales deals/opportunities
6. **Lead** - Marketing leads
7. **Activity** - Activity log
8. **Task** - To-do items
9. **Note** - Notes and comments
10. **Attachment** - File attachments
11. **SavedView** - Saved filters/views
12. **Notification** - User notifications
13. **Webhook** - Webhook configurations

---

## 🚨 Important Rules

### **DO:**
✅ Always create migrations for schema changes  
✅ Review generated SQL before committing  
✅ Test migrations on staging before production  
✅ Commit both schema and migration files together  
✅ Use descriptive migration names

### **DON'T:**
❌ Edit schema without creating a migration  
❌ Manually edit migration files (unless necessary)  
❌ Delete migration files  
❌ Use `prisma db push` in production  
❌ Skip migrations in CI/CD

---

## 🔧 Troubleshooting

### **Migration Failed**
```bash
# Check status
pnpm prisma migrate status

# Mark migration as applied (if already applied manually)
pnpm prisma migrate resolve --applied <migration_name>

# Mark migration as rolled back
pnpm prisma migrate resolve --rolled-back <migration_name>
```

### **Schema Drift Detected**
```bash
# Compare database with schema
pnpm prisma migrate diff \
  --from-schema-datasource prisma/schema.prisma \
  --to-schema-datamodel prisma/schema.prisma \
  --script

# Reset and reapply all migrations
pnpm prisma migrate reset
```

### **Rollback Migration**
```bash
# 1. Revert schema changes
git revert <commit_hash>

# 2. Create new migration to undo changes
pnpm prisma migrate dev --name revert_<feature>

# Note: Prisma doesn't support automatic rollbacks
# You need to manually create a migration that undoes the changes
```

---

## 📦 CI/CD Integration

### **GitHub Actions**
```yaml
# .github/workflows/ci.yml
- name: Check Prisma Migrations
  working-directory: apps/core-api
  run: |
    pnpm prisma migrate status
    pnpm prisma generate
  env:
    DATABASE_URL: postgresql://test:test@localhost:5432/test_db
```

### **Pre-commit Hook**
```bash
# .husky/pre-commit
#!/usr/bin/env sh

# Check for schema changes without migrations
cd apps/core-api
if git diff --cached --name-only | grep -q "prisma/schema.prisma"; then
  echo "⚠️  Prisma schema changed. Checking for migration..."
  
  if ! pnpm prisma migrate status | grep -q "Database is up to date"; then
    echo "❌ Schema changed but no migration created."
    echo "Run: pnpm prisma migrate dev --name <migration_name>"
    exit 1
  fi
fi
```

---

## 📚 Resources

- [Prisma Migrate Docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Migration Troubleshooting](https://www.prisma.io/docs/guides/migrate/production-troubleshooting)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

---

## 🎯 Migration History

| Date | Migration | Description |
|------|-----------|-------------|
| 2025-10-26 | `20251026090416_init` | Initial schema with 13 models |

---

**Last Updated:** October 26, 2025  
**Maintainer:** Solo Developer

